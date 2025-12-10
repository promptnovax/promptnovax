import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Workflow,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Menu,
  ShoppingBag,
  LifeBuoy,
  Settings2,
  BellRing,
  Headphones,
  PenTool,
  FileText,
  Store,
  Bot,
  Layers,
  CreditCard,
  MessageCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { SellerSidebar } from "@/components/seller/dashboard/SellerSidebar"
import { BuyerSidebar } from "@/components/buyer/dashboard/BuyerSidebar"
import { DashboardTopbar } from "@/components/layout/dashboard-topbar"
import { Badge } from "@/components/ui/badge"
import { BrandLogo } from "@/components/visuals/BrandLogo"
import type { LucideIcon } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

type BuyerNavItem = {
  icon: LucideIcon
  label: string
  href: string
  badge?: string
  external?: boolean
}

const buyerNav: BuyerNavItem[] = [
  { icon: LayoutDashboard, label: "Overview", href: "#dashboard/buyer", badge: "Live" },
  { icon: ShoppingBag, label: "Purchases", href: "#dashboard/buyer/purchases" },
  { icon: PenTool, label: "Collections & Assets", href: "#dashboard/buyer/collections" },
  { icon: Workflow, label: "Automation Hub", href: "#dashboard/buyer/automation" },
  { icon: BarChart3, label: "Usage & Analytics", href: "#dashboard/buyer/analytics" },
  { icon: FileText, label: "Subscriptions", href: "#dashboard/buyer/subscriptions" },
  { icon: CreditCard, label: "Billing & Usage", href: "#dashboard/buyer/billing" },
  { icon: LifeBuoy, label: "Support & Guidance", href: "#dashboard/buyer/support" },
  { icon: BellRing, label: "Signals & Alerts", href: "#dashboard/buyer/signals" },
  { icon: MessageCircle, label: "Messages", href: "#dashboard/buyer/messages" },
  { icon: Store, label: "Marketplace", href: "#marketplace" },
  { icon: Bot, label: "Prompt Generator", href: "http://localhost:8080/#prompt-generator", badge: "New", external: true },
  { icon: Settings2, label: "Settings", href: "#dashboard/settings" }
]

export function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSellerPage, setIsSellerPage] = useState(false)
  const [isBuyerPage, setIsBuyerPage] = useState(false)

  useEffect(() => {
    const checkRoute = () => {
      const hash = window.location.hash.replace("#", "")
      setIsSellerPage(hash.includes("dashboard/seller"))
      setIsBuyerPage(hash.includes("dashboard/buyer"))
    }
    checkRoute()
    window.addEventListener("hashchange", checkRoute)
    return () => window.removeEventListener("hashchange", checkRoute)
  }, [])

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className={cn(
          "flex items-center gap-3 transition-all",
          sidebarCollapsed ? "justify-center w-full" : "justify-between w-full"
        )}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              {isBuyerPage ? <Layers className="h-5 w-5" /> : <LayoutDashboard className="h-5 w-5" />}
            </div>
            {!sidebarCollapsed && (
              <div>
                <p className="text-sm font-semibold leading-tight">{isBuyerPage ? "Buyer workspace" : "Workspace"}</p>
                <p className="text-xs text-muted-foreground">Quick access to your programs</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(true)}
              className="hidden lg:flex h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {sidebarCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              className="hidden lg:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {buyerNav.map((item, index) => {
          const Icon = item.icon
          const target = item.href.startsWith("#") ? item.href.slice(1) : item.href
          const matchesExact = !item.external && currentPage === target
          const matchesChild = !item.external && currentPage?.startsWith(`${target}/`)
          const isOverview = target === "dashboard/buyer"
          const isActive = matchesExact || (!isOverview && matchesChild)

          const content = item.external ? (
            <button
              onClick={() => window.open(item.href, "_blank", "noopener,noreferrer")}
              className={cn(
                "w-full group flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 text-left",
                sidebarCollapsed ? "justify-center" : "gap-3",
                "hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <div className="flex items-center justify-between flex-1 gap-3">
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </button>
          ) : (
            <Link
              href={item.href}
              className={cn(
                "group flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                sidebarCollapsed ? "justify-center" : "gap-3",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
              )}
              active={isActive}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <div className="flex items-center justify-between flex-1 gap-3">
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Link>
          )

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {content}
            </motion.div>
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t">
        <div className="rounded-2xl bg-muted/60 p-4 space-y-3">
          {!sidebarCollapsed && (
            <>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Need help?</span>
                <Badge variant="outline">24/7</Badge>
              </div>
              <p className="text-sm font-semibold leading-tight">
                Invite buyer concierge into any workflow.
              </p>
              <p className="text-xs text-muted-foreground">
                The Support & Guidance hub offers chat, calls, or AI suggestions.
              </p>
            </>
          )}
          <Button
            size="sm"
            className="w-full"
            variant={sidebarCollapsed ? "ghost" : "secondary"}
            onClick={() => window.location.hash = '#dashboard/buyer/support'}
          >
            <Headphones className="h-4 w-4 mr-2" />
            {sidebarCollapsed ? null : "Open support desk"}
          </Button>
        </div>
      </div>
    </div>
  )

  // Use SellerSidebar for seller pages, BuyerSidebar for buyer pages, otherwise use default sidebar
  const SidebarComponent = isSellerPage ? (
    <SellerSidebar />
  ) : isBuyerPage ? (
    <BuyerSidebar />
  ) : (
    <motion.div
      initial={{ width: 256 }}
      animate={{ width: sidebarCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full bg-card border-r"
    >
      <SidebarContent />
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Topbar */}
      <DashboardTopbar />
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r z-30",
          (isSellerPage || isBuyerPage) ? "w-64" : sidebarCollapsed ? "w-16" : "w-64"
        )}>
          {SidebarComponent}
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ marginLeft: 256 }}
          animate={{ marginLeft: (isSellerPage || isBuyerPage) ? 256 : (sidebarCollapsed ? 64 : 256) }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1 overflow-y-auto"
        >
          <main className="p-6">
            {children}
          </main>
        </motion.div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col flex-1">
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 bg-background border-b p-4 flex items-center justify-between">
          <BrandLogo className="h-9" />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              {isSellerPage ? <SellerSidebar /> : isBuyerPage ? <BuyerSidebar /> : <SidebarContent />}
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>

    </div>
  )
}
