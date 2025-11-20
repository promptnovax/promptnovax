import { Home, Store, Zap, MessageSquare, Settings, Menu } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link } from "@/components/ui/link"
import { BrandLogo } from "@/components/visuals/BrandLogo"

interface SidebarProps {
  isMobile?: boolean
  onClose?: () => void
  currentPage?: string
}

export function DashboardSidebar({ isMobile = false, onClose, currentPage }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: "Home", href: "#dashboard" },
    { icon: Store, label: "Marketplace", href: "#marketplace" },
    { icon: Zap, label: "Generator", href: "#generator" },
    { icon: Settings, label: "Settings", href: "#dashboard/settings" },
  ]

  const SidebarContent = () => (
    <motion.div 
      className="flex flex-col h-full"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-6 border-b">
        <BrandLogo className="h-10" />
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.href.slice(1) 
                    ? "bg-accent text-accent-foreground shadow-sm" 
                    : "hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
                }`}
                active={currentPage === item.href.slice(1)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </motion.div>
          )
        })}
      </nav>
    </motion.div>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-50">
      <div className="flex flex-col flex-grow border-r bg-background">
        <SidebarContent />
      </div>
    </div>
  )
}
