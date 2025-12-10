import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  ShoppingBag,
  PenTool,
  Workflow,
  BarChart3,
  FileText,
  CreditCard,
  LifeBuoy,
  BellRing,
  MessageCircle,
  Store,
  Bot,
  Settings,
  HelpCircle
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BuyerSidebarProps = {
  className?: string
}

type SidebarItem = {
  icon: LucideIcon
  label: string
  href: string
  key: string
}

const workspaceItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", href: "#dashboard/buyer", key: "overview" },
  { icon: ShoppingBag, label: "Purchases", href: "#dashboard/buyer/purchases", key: "purchases" },
  { icon: PenTool, label: "Collections & Assets", href: "#dashboard/buyer/collections", key: "collections" },
  { icon: Workflow, label: "Automation Hub", href: "#dashboard/buyer/automation", key: "automation" },
  { icon: BarChart3, label: "Usage & Analytics", href: "#dashboard/buyer/analytics", key: "analytics" },
  { icon: FileText, label: "Subscriptions", href: "#dashboard/buyer/subscriptions", key: "subscriptions" }
]

const accountItems: SidebarItem[] = [
  { icon: CreditCard, label: "Billing & Usage", href: "#dashboard/buyer/billing", key: "billing" },
  { icon: MessageCircle, label: "Messages", href: "#dashboard/buyer/messages", key: "messages" },
  { icon: BellRing, label: "Signals & Alerts", href: "#dashboard/buyer/signals", key: "signals" },
  { icon: Settings, label: "Settings", href: "#dashboard/buyer/settings", key: "settings" }
]

const supportItems: SidebarItem[] = [
  { icon: LifeBuoy, label: "Support & Guidance", href: "#dashboard/buyer/support", key: "support" }
]

const externalItems: SidebarItem[] = [
  { icon: Store, label: "Marketplace", href: "#marketplace", key: "marketplace" },
  { icon: Bot, label: "Prompt Generator", href: "http://localhost:8080/#prompt-generator", key: "generator" }
]

export function BuyerSidebar({ className }: BuyerSidebarProps) {
  const [activeKey, setActiveKey] = useState<string>("overview")

  useEffect(() => {
    const updateActiveKey = () => {
      const hash = window.location.hash
      if (hash.includes("purchases")) {
        setActiveKey("purchases")
      } else if (hash.includes("collections")) {
        setActiveKey("collections")
      } else if (hash.includes("automation")) {
        setActiveKey("automation")
      } else if (hash.includes("analytics")) {
        setActiveKey("analytics")
      } else if (hash.includes("subscriptions")) {
        setActiveKey("subscriptions")
      } else if (hash.includes("billing")) {
        setActiveKey("billing")
      } else if (hash.includes("messages")) {
        setActiveKey("messages")
      } else if (hash.includes("signals")) {
        setActiveKey("signals")
      } else if (hash.includes("settings")) {
        setActiveKey("settings")
      } else if (hash.includes("support")) {
        setActiveKey("support")
      } else if (hash.includes("dashboard/buyer") && !hash.match(/dashboard\/buyer\/(purchases|collections|automation|analytics|subscriptions|billing|messages|signals|settings|support)/)) {
        setActiveKey("overview")
      }
    }

    updateActiveKey()
    window.addEventListener("hashchange", updateActiveKey)
    return () => window.removeEventListener("hashchange", updateActiveKey)
  }, [])

  const handleClick = (href: string, key: string) => {
    setActiveKey(key)
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer")
    } else {
      window.location.hash = href
    }
  }

  const renderButton = (item: SidebarItem) => {
    const Icon = item.icon
    const isActive = activeKey === item.key
    return (
      <Button
        key={item.key}
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all",
          isActive
            ? "bg-primary/15 text-primary shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
        )}
        onClick={() => handleClick(item.href, item.key)}
      >
        <Icon className="h-4 w-4" />
        <span>{item.label}</span>
      </Button>
    )
  }

  return (
    <aside className={cn("w-64 bg-background border-r flex flex-col h-full", className)}>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Workspace Section */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Workspace</p>
          <nav className="space-y-1">{workspaceItems.map(renderButton)}</nav>
        </div>

        {/* Account Section */}
        <div className="space-y-1 border-t border-border/60 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Account</p>
          {accountItems.map(renderButton)}
        </div>

        {/* Support Section */}
        <div className="space-y-1 border-t border-border/60 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Support</p>
          {supportItems.map(renderButton)}
        </div>

        {/* External Links */}
        <div className="space-y-1 border-t border-border/60 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Quick Links</p>
          {externalItems.map(renderButton)}
        </div>
      </div>
    </aside>
  )
}

