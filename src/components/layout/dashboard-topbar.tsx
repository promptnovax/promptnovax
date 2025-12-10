import { useState, useEffect } from "react"
import { Bell, Search, User, Settings, CreditCard, LogOut, Store, BarChart3, FileText, HelpCircle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { BrandLogo } from "@/components/visuals/BrandLogo"
import { useAuth } from "@/context/AuthContext"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { DashboardNotifications } from "@/components/dashboard/DashboardNotifications"

export function DashboardTopbar() {
  const { currentUser, logout, userRole } = useAuth()
  const { toast } = useToast()
  const [isSellerDashboard, setIsSellerDashboard] = useState(false)
  const [isBuyerDashboard, setIsBuyerDashboard] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  useEffect(() => {
    const checkRoute = () => {
      setIsSellerDashboard(window.location.hash.includes('dashboard/seller'))
      setIsBuyerDashboard(window.location.hash.includes('dashboard/buyer'))
    }
    checkRoute()
    window.addEventListener('hashchange', checkRoute)
    return () => window.removeEventListener('hashchange', checkRoute)
  }, [])

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'
  const userEmail = currentUser?.email || 'user@example.com'
  const userInitials = userDisplayName.slice(0, 2).toUpperCase()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    window.location.hash = '#/'
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        {/* Logo - Larger and properly sized */}
        <div className="flex items-center gap-3 min-w-[120px]">
          <BrandLogo showWordmark={true} className="h-10 w-auto" />
        </div>
        
        {/* Search Bar */}
        <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">
          <div className="relative flex flex-1 items-center max-w-2xl">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Search prompts, templates, analytics..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-x-2 lg:gap-x-3">
          {/* Seller Quick Actions */}
          {isSellerDashboard && (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.hash = '#dashboard/seller/prompt-studio'}
                className="hidden sm:flex gap-1.5"
              >
                <Store className="h-4 w-4" />
                <span className="hidden lg:inline">Studio</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.hash = '#dashboard/seller'}
                className="hidden sm:flex gap-1.5"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden lg:inline">Analytics</span>
              </Button>
            </>
          )}

          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          </Button>
            <DashboardNotifications
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
              userRole={isSellerDashboard ? "seller" : isBuyerDashboard ? "buyer" : undefined}
            />
          </div>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-border hover:border-primary/50 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.photoURL || undefined} alt={userDisplayName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold leading-none">{userDisplayName}</p>
                    {isSellerDashboard && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        Seller
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => window.location.hash = '#dashboard/seller'}>
                  <User className="h-4 w-4 mr-2" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                {isSellerDashboard && (
                  <>
                    <DropdownMenuItem onClick={() => window.location.hash = '#dashboard/seller/payouts'}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span>Payouts & Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.hash = '#dashboard/seller/integrations'}>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      <span>Integrations</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => window.location.hash = '#dashboard/settings'}>
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.hash = '#/help'}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.hash = '#/help'}>
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Documentation</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
