import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import { AuthGuard } from "@/components/AuthGuard"
import { SellerDashboard } from "./seller-dashboard"
import { ProfessionalSellerDashboard } from "@/components/seller/ProfessionalSellerDashboard"
import { BuyerDashboard } from "./buyer-dashboard"
import { 
  Store, 
  ShoppingBag, 
  User, 
  Settings,
  ArrowLeft,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Star,
  Heart,
  History,
  Download,
  Eye
} from "lucide-react"
import { RoleOnboarding } from "@/components/dashboard/RoleOnboarding"
import { RoleSidebar } from "@/components/dashboard/RoleSidebar"
import { SellerOrders } from "@/components/seller/SellerOrders"
import { BuyerSubscriptions } from "@/components/buyer/BuyerSubscriptions"
import { SellerSettings } from "@/components/seller/SellerSettings"
import { SellerReviews } from "@/components/seller/SellerReviews"
import { SellerCoupons } from "@/components/seller/SellerCoupons"
import { BuyerInvoices } from "@/components/buyer/BuyerInvoices"
import { BuyerDownloads } from "@/components/buyer/BuyerDownloads"

const ROLE_STORAGE_KEY = "pnx_user_role"

type Role = "seller" | "buyer"

type SectionMap = {
  [key: string]: string
}

const sellerSections: SectionMap = {
  overview: "overview",
  products: "products",
  upload: "upload",
  analytics: "analytics",
  payouts: "payouts",
  customers: "customers",
  settings: "settings",
}

const buyerSections: SectionMap = {
  overview: "overview",
  purchases: "purchases",
  wishlist: "wishlist",
  downloads: "downloads",
  invoices: "invoices",
  saved: "saved",
  settings: "settings",
}

export function DashboardPage() {
  const { currentUser, userRole } = useAuth()
  const [activeTab, setActiveTab] = useState<Role>("seller")
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("overview")

  // Hydrate from localStorage and hash
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash
      const parts = hash.replace('#', '').split('/') // e.g., [dashboard, role, section]

      // If just #dashboard or malformed, redirect to stored role
      const stored = (localStorage.getItem(ROLE_STORAGE_KEY) as Role | null) || null
      const onboardingDone = localStorage.getItem('pnx_onboarding_done') === '1'
      if (!stored || !onboardingDone) {
        setNeedsOnboarding(true)
      }
      if (parts[0] !== 'dashboard' || parts.length < 3) {
        const fallbackRole: Role = stored || 'seller'
        window.location.hash = `#dashboard/${fallbackRole}/overview`
        setActiveTab(fallbackRole)
        setActiveSection('overview')
        return
      }

      const role = (parts[1] === 'buyer' ? 'buyer' : 'seller') as Role
      const section = parts[2] || 'overview'
      setActiveTab(role)
      setActiveSection(section)
    }

    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  // Sync userRole (if available) to UI
  useEffect(() => {
    if (userRole?.role === "buyer") {
      setActiveTab("buyer")
      window.location.hash = "#dashboard/buyer/overview"
    } else if (userRole?.role === "seller") {
      setActiveTab("seller")
      window.location.hash = "#dashboard/seller/overview"
    }
  }, [userRole])

  // Maintain deep link when tab changes
  const handleTabChange = (value: string) => {
    const role = value as Role
    setActiveTab(role)
    setActiveSection('overview')
    window.location.hash = `#dashboard/${role}/overview`
  }

  const navigateSection = (section: string) => {
    setActiveSection(section)
    window.location.hash = `#dashboard/${activeTab}/${section}`
    // Redirect to pages where required
    if (activeTab === 'seller' && section === 'upload') {
      window.location.hash = '#dashboard/seller-upload'
    }
  }

  const renderPlaceholder = (title: string, description: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">This section is ready for data; we'll wire data sources next.</p>
      </CardContent>
    </Card>
  )

  const renderSellerSection = () => {
    switch (activeSection) {
      case 'overview':
        return <ProfessionalSellerDashboard />
      case 'products':
        return <ProfessionalSellerDashboard />
      case 'analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Deep dive into performance (coming next step)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Charts and KPIs will appear here.</p>
            </CardContent>
          </Card>
        )
      case 'payouts':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payouts</CardTitle>
              <CardDescription>Manage your earnings and withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Connect payout method (Stripe/Bank) — demo placeholder.</p>
            </CardContent>
          </Card>
        )
      case 'customers':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>Manage followers and buyers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Customer list and CRM coming soon.</p>
            </CardContent>
          </Card>
        )
      case 'orders':
        return <SellerOrders />
      case 'reviews':
        return <SellerReviews />
      case 'coupons':
        return <SellerCoupons />
      case 'storefront':
        return renderPlaceholder('Storefront', 'Customize your public seller page')
      case 'integrations':
        return renderPlaceholder('Integrations', 'Connect analytics, payments, and external tools')
      case 'settings':
        return <SellerSettings />
      default:
        return <ProfessionalSellerDashboard />
    }
  }

  const renderBuyerSection = () => {
    switch (activeSection) {
      case 'overview':
        return <BuyerDashboard />
      case 'purchases':
        return <BuyerDashboard />
      case 'wishlist':
        return <BuyerDashboard />
      case 'downloads':
        return <BuyerDownloads />
      case 'invoices':
        return <BuyerInvoices />
      case 'saved':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Saved Sellers</CardTitle>
              <CardDescription>Your favorite creators</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Saved/Followed sellers will appear here.</p>
            </CardContent>
          </Card>
        )
      case 'subscriptions':
        return <BuyerSubscriptions />
      case 'refunds':
        return renderPlaceholder('Refunds', 'Track refund requests and statuses')
      case 'notifications':
        return renderPlaceholder('Notifications', 'Your alerts and announcements')
      case 'support':
        return renderPlaceholder('Support', 'Open tickets and help resources')
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Buyer Settings</CardTitle>
              <CardDescription>Preferences and account configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings UI coming soon.</p>
            </CardContent>
          </Card>
        )
      default:
        return <BuyerDashboard />
    }
  }

  if (needsOnboarding) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <RoleOnboarding onComplete={(role) => {
              setNeedsOnboarding(false)
              setActiveTab(role)
              window.location.hash = `#dashboard/${role}/overview`
            }} />
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b bg-background"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleBackToHome}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {currentUser?.email || "Guest"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {activeTab === "seller" ? "Seller" : "Buyer"} Account
                </Badge>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content with Sidebar */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="seller" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Seller Dashboard
              </TabsTrigger>
              <TabsTrigger value="buyer" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Buyer Dashboard
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="seller" className="mt-0">
                <motion.div
                  key={`seller-${activeSection}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6"
                >
                  <div>
                    <RoleSidebar role="seller" activeSection={activeSection} onNavigate={navigateSection} />
                  </div>
                  <div>
                    {renderSellerSection()}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="buyer" className="mt-0">
                <motion.div
                  key={`buyer-${activeSection}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6"
                >
                  <div>
                    <RoleSidebar role="buyer" activeSection={activeSection} onNavigate={navigateSection} />
                  </div>
                  <div>
                    {renderBuyerSection()}
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
