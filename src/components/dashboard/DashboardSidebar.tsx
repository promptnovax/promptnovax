import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { 
  LayoutDashboard,
  FileText,
  Users,
  DollarSign,
  Settings,
  Menu,
  X,
  User,
  LogOut
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DashboardSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  onLogout: () => void
}

export function DashboardSidebar({ 
  activeSection, 
  onSectionChange, 
  onLogout 
}: DashboardSidebarProps) {
  const { currentUser } = useAuth()
  const { success } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const sections = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      description: "Your dashboard stats"
    },
    {
      id: "prompts",
      label: "My Prompts",
      icon: FileText,
      description: "Manage your prompts"
    },
    {
      id: "followers",
      label: "Followers",
      icon: Users,
      description: "Your followers"
    },
    {
      id: "earnings",
      label: "Earnings",
      icon: DollarSign,
      description: "Revenue & analytics"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Account settings"
    }
  ]

  const handleLogout = async () => {
    try {
      await onLogout()
      success("Logged out successfully", "See you next time!")
      window.location.hash = "#home"
    } catch (err: any) {
      console.error("Logout error:", err)
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-background/95 backdrop-blur"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`
          fixed lg:relative lg:translate-x-0 z-40
          w-64 h-full bg-background border-r
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser?.photoURL || ""} />
                <AvatarFallback>
                  {currentUser?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {currentUser?.displayName || currentUser?.email?.split('@')[0] || "User"}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  Creator Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              
              return (
                <motion.div
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => {
                      onSectionChange(section.id)
                      setMobileMenuOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">{section.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => window.location.hash = `#user/${currentUser?.uid}`}
            >
              <User className="h-4 w-4 mr-2" />
              View Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}