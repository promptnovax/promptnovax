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
import type { LucideIcon } from "lucide-react"

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

type SidebarItem<T extends string> = { key: T; label: string; icon: LucideIcon }
type SidebarGroup<T extends string> = { title: string; items: SidebarItem<T>[] }

export function RoleSidebar({ role, activeSection, onNavigate }: RoleSidebarProps) {
  const sellerGroups: SidebarGroup<SellerSection>[] = [
    {
      title: "Workspace",
      items: [
        { key: "overview", label: "Overview", icon: Store },
        { key: "products", label: "Products", icon: Package },
        { key: "upload", label: "Upload", icon: Plus },
        { key: "orders", label: "Orders", icon: ShoppingBag },
        { key: "reviews", label: "Reviews", icon: Star }
      ]
    },
    {
      title: "Growth",
      items: [
        { key: "analytics", label: "Analytics", icon: BarChart3 },
        { key: "payouts", label: "Payouts", icon: DollarSign },
        { key: "customers", label: "Customers", icon: Users },
        { key: "coupons", label: "Coupons", icon: BadgePercent }
      ]
    },
    {
      title: "Brand & Settings",
      items: [
        { key: "storefront", label: "Storefront", icon: Layout },
        { key: "integrations", label: "Integrations", icon: Puzzle },
        { key: "settings", label: "Settings", icon: Settings }
      ]
    }
  ]

  const buyerGroups: SidebarGroup<BuyerSection>[] = [
    {
      title: "Activity",
      items: [
        { key: "overview", label: "Overview", icon: ShoppingBag },
        { key: "purchases", label: "Purchases", icon: Receipt },
        { key: "wishlist", label: "Wishlist", icon: Heart },
        { key: "downloads", label: "Downloads", icon: Download }
      ]
    },
    {
      title: "Management",
      items: [
        { key: "invoices", label: "Invoices", icon: Receipt },
        { key: "subscriptions", label: "Subscriptions", icon: RefreshCw },
        { key: "refunds", label: "Refunds", icon: RotateCcw },
        { key: "saved", label: "Saved Sellers", icon: UserCheck },
        { key: "notifications", label: "Notifications", icon: Bell }
      ]
    },
    {
      title: "Support",
      items: [
        { key: "support", label: "Support", icon: Headphones },
        { key: "settings", label: "Settings", icon: Settings }
      ]
    }
  ]

  const groups = role === "seller" ? sellerGroups : buyerGroups

  const handleClick = (sectionKey: string) => {
    // Push deep link first, then update state
    window.location.hash = `#dashboard/${role}/${sectionKey}`
    onNavigate(sectionKey)
  }

  return (
    <nav className="space-y-6">
      {groups.map((group, groupIndex) => (
        <div key={group.title} className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {group.title}
          </p>
          <div className="space-y-1">
            {group.items.map((item, index) => {
              const Icon = item.icon
              const isActive = activeSection === item.key
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (groupIndex * 5 + index) * 0.03 }}
                >
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
          </div>
        </div>
      ))}
    </nav>
  )
}
