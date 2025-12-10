import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Workflow,
  Sparkles,
  TestTube,
  BarChart3,
  FileText,
  CreditCard,
  Users,
  Settings,
  HelpCircle,
  MessageCircle
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SellerSidebarProps = {
  className?: string
}

type SidebarItem = {
  icon: LucideIcon
  label: string
  href: string
  key: string
}

const workspaceItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", href: "#dashboard/seller", key: "overview" },
  { icon: Workflow, label: "Prompt Lifecycle", href: "#dashboard/seller/prompt-lifecycle", key: "lifecycle" },
  { icon: Sparkles, label: "Prompt Studio", href: "#dashboard/seller/prompt-studio", key: "studio" },
  { icon: TestTube, label: "Testing Lab", href: "#dashboard/seller/testing", key: "testing" }
]

const businessItems: SidebarItem[] = [
  { icon: FileText, label: "My Prompts", href: "#dashboard/seller/prompts", key: "prompts" },
  { icon: BarChart3, label: "Analytics", href: "#dashboard/seller/analytics", key: "analytics" },
  { icon: CreditCard, label: "Payouts", href: "#dashboard/seller/payouts", key: "payouts" },
  { icon: Users, label: "Customers", href: "#dashboard/seller/customers", key: "customers" }
]

const communicationItems: SidebarItem[] = [
  { icon: MessageCircle, label: "Messages", href: "#dashboard/seller/messages", key: "messages" }
]

const accountItems: SidebarItem[] = [
  { icon: Settings, label: "Settings", href: "#dashboard/seller/settings", key: "settings" },
  { icon: HelpCircle, label: "Support", href: "#dashboard/seller/support", key: "support" }
]

export function SellerSidebar({ className }: SellerSidebarProps) {
  const [activeKey, setActiveKey] = useState<string>("overview")

  useEffect(() => {
    const updateActiveKey = () => {
      const hash = window.location.hash
      if (hash.includes("prompt-lifecycle") || hash.includes("lifecycle")) {
        setActiveKey("lifecycle")
      } else if (hash.includes("prompt-studio") || hash.includes("studio")) {
        setActiveKey("studio")
      } else if (hash.includes("testing")) {
        setActiveKey("testing")
      } else if (hash.includes("analytics")) {
        setActiveKey("analytics")
      } else if (hash.includes("prompts") && !hash.match(/prompts\/[^/]+$/)) {
        setActiveKey("prompts")
      } else if (hash.includes("payouts")) {
        setActiveKey("payouts")
      } else if (hash.includes("customers")) {
        setActiveKey("customers")
      } else if (hash.includes("messages")) {
        setActiveKey("messages")
      } else if (hash.includes("settings")) {
        setActiveKey("settings")
      } else if (hash.includes("support")) {
        setActiveKey("support")
      } else if (hash.includes("dashboard/seller")) {
        setActiveKey("overview")
      }
    }

    updateActiveKey()
    window.addEventListener("hashchange", updateActiveKey)
    return () => window.removeEventListener("hashchange", updateActiveKey)
  }, [])

  const handleClick = (href: string, key: string) => {
    setActiveKey(key)
    window.location.hash = href
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

        {/* Business Section */}
        <div className="space-y-1 border-t border-border/60 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Business</p>
          {businessItems.map(renderButton)}
        </div>

        {/* Communication Section */}
        <div className="space-y-1 border-t border-border/60 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Communication</p>
          {communicationItems.map(renderButton)}
        </div>

        {/* Account Section */}
        <div className="space-y-1 border-t border-border/60 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Account</p>
          {accountItems.map(renderButton)}
        </div>
      </div>
    </aside>
  )
}

