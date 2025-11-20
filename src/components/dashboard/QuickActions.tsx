import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Plus,
  Store,
  ShoppingBag,
  BarChart3,
  Settings,
  ArrowUpRight,
  FileText,
  Sparkles,
  Workflow
} from "lucide-react"

interface QuickActionsProps {
  role: "seller" | "buyer"
}

export function QuickActions({ role }: QuickActionsProps) {
  const actions = role === "seller"
    ? [
        { icon: Plus, label: "New Product", onClick: () => (window.location.hash = "#dashboard/seller-upload") },
        { icon: BarChart3, label: "Analytics", onClick: () => (window.location.hash = "#dashboard/seller") },
        { icon: Store, label: "My Store", onClick: () => (window.location.hash = "#user/me") },
        { icon: Settings, label: "Settings", onClick: () => {} },
      ]
    : [
        { icon: ShoppingBag, label: "Purchases", onClick: () => (window.location.hash = "#dashboard/buyer/purchases") },
        { icon: FileText, label: "Subscriptions", onClick: () => (window.location.hash = "#dashboard/buyer/subscriptions") },
        { icon: Sparkles, label: "Prompt Generator", onClick: () => window.open("http://localhost:8080/#prompt-generator", "_blank", "noopener,noreferrer") },
        { icon: Workflow, label: "Automation Hub", onClick: () => (window.location.hash = "#dashboard/buyer/automation") },
      ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((a, i) => {
        const Icon = a.icon
        return (
          <motion.div key={a.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Button variant="outline" className="w-full justify-between" onClick={a.onClick}>
              <span className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4" /> {a.label}
              </span>
              <ArrowUpRight className="h-4 w-4 opacity-70" />
            </Button>
          </motion.div>
        )
      })}
    </div>
  )
}








