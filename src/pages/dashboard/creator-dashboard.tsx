import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { DashboardPrompts } from "@/components/dashboard/DashboardPrompts"
import { DashboardFollowers } from "@/components/dashboard/DashboardFollowers"
import { DashboardEarnings } from "@/components/dashboard/DashboardEarnings"
import { DashboardSettings } from "@/components/dashboard/DashboardSettings"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"

export function CreatorDashboard() {
  const { currentUser, logout } = useAuth()
  const { error } = useToast()
  const [activeSection, setActiveSection] = useState("overview")

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err: any) {
      error("Logout failed", err.message || "Please try again")
    }
  }

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />
      case "prompts":
        return <DashboardPrompts />
      case "followers":
        return <DashboardFollowers />
      case "earnings":
        return <DashboardEarnings />
      case "settings":
        return <DashboardSettings />
      default:
        return <DashboardOverview />
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to access the dashboard</p>
          <button 
            onClick={() => window.location.hash = "#login"}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <DashboardSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onLogout={handleLogout}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
