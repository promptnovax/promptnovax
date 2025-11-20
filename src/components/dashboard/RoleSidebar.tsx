import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Store,
  Package,
  Plus,
  BarChart3,
  Users,
  DollarSign,
  Settings,
  ShoppingBag,
  Heart,
  Download,
  Receipt,
  UserCheck,
  BadgePercent,
  Star,
  Layout,
  Puzzle,
  Headphones,
  Bell,
  RefreshCw,
  RotateCcw
} from "lucide-react"

type Role = "seller" | "buyer"

type SellerSection =
  | "overview"
  | "products"
  | "upload"
  | "orders"
  | "reviews"
  | "coupons"
  | "analytics"
  | "payouts"
  | "customers"
  | "storefront"
  | "integrations"
  | "settings"

type BuyerSection =
  | "overview"
  | "purchases"
  | "wishlist"
  | "downloads"
  | "invoices"
  | "subscriptions"
  | "refunds"
  | "saved"
  | "notifications"
  | "support"
  | "settings"

interface RoleSidebarProps {
  role: Role
  activeSection: string
  onNavigate: (section: string) => void
}

export function RoleSidebar({ role, activeSection, onNavigate }: RoleSidebarProps) {
  const sellerItems: { key: SellerSection; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: Store },
    { key: "products", label: "Products", icon: Package },
    { key: "upload", label: "Upload", icon: Plus },
    { key: "orders", label: "Orders", icon: ShoppingBag },
    { key: "reviews", label: "Reviews", icon: Star },
    { key: "coupons", label: "Coupons", icon: BadgePercent },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "payouts", label: "Payouts", icon: DollarSign },
    { key: "customers", label: "Customers", icon: Users },
    { key: "storefront", label: "Storefront", icon: Layout },
    { key: "integrations", label: "Integrations", icon: Puzzle },
    { key: "settings", label: "Settings", icon: Settings },
  ]

  const buyerItems: { key: BuyerSection; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: ShoppingBag },
    { key: "purchases", label: "Purchases", icon: Receipt },
    { key: "wishlist", label: "Wishlist", icon: Heart },
    { key: "downloads", label: "Downloads", icon: Download },
    { key: "invoices", label: "Invoices", icon: Receipt },
    { key: "subscriptions", label: "Subscriptions", icon: RefreshCw },
    { key: "refunds", label: "Refunds", icon: RotateCcw },
    { key: "saved", label: "Saved Sellers", icon: UserCheck },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "support", label: "Support", icon: Headphones },
    { key: "settings", label: "Settings", icon: Settings },
  ]

  const items = role === "seller" ? sellerItems : buyerItems

  const handleClick = (sectionKey: string) => {
    // Push deep link first, then update state
    window.location.hash = `#dashboard/${role}/${sectionKey}`
    onNavigate(sectionKey)
  }

  return (
    <nav className="space-y-1">
      {items.map((item, index) => {
        const Icon = item.icon
        const isActive = activeSection === item.key
        return (
          <motion.div key={item.key} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={cn("w-full justify-start gap-2", isActive ? "shadow-sm" : "")}
              onClick={() => handleClick(item.key)}
            >
              <Icon className="h-4 w-4" /> {item.label}
            </Button>
          </motion.div>
        )
      })}
    </nav>
  )
}
