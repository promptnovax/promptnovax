import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Link } from "@/components/ui/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NotificationsDropdown } from "@/components/ui/notifications-dropdown"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  Bell, 
  Image, 
  Video, 
  MessageSquare, 
  Zap, 
  PenTool, 
  Presentation,
  Code,
  BookOpen,
  HelpCircle,
  FileText,
  Users,
  Building2,
  Briefcase,
  Mail,
  ChevronRight
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { BrandLogo } from "@/components/visuals/BrandLogo"

interface NavbarProps {
  currentPage?: string
}

export function Navbar({ currentPage }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { currentUser, userRole, logout } = useAuth()
  const { success, error } = useToast()

  // Load unread notification count
  useEffect(() => {
    if (!currentUser) {
      setUnreadCount(0)
      return
    }

    // Demo mode - show constant mock count
    setUnreadCount(2)
  }, [currentUser])

  const handleLogout = async () => {
    try {
      await logout()
      success("Logged out successfully", "See you next time!")
      // Redirect to home page
      window.location.hash = "#home"
    } catch (err: any) {
      error("Logout failed", err.message || "Please try again")
    }
  }

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Define mega menu structure (clear, concise, user-friendly)
  const productsMenu = {
    title: "Products",
    items: [
      {
        title: "Templates Library",
        description: "Browse 200+ curated, high-performing templates",
        icon: FileText,
        href: "#templates/index"
      },
      {
        title: "Prompt Generators",
        description: "Create prompts for text, image, and bulk workflows",
        icon: Zap,
        href: "#generator"
      },
      {
        title: "Prompt Studio (API)",
        description: "Design, version, and integrate via API",
        icon: Code,
        href: "#studio/api"
      },
      {
        title: "Humanizer Tools",
        description: "AI-to-human, rewriter, and paraphraser",
        icon: PenTool,
        href: "#prompt-generator"
      }
    ]
  }

  const marketplaceMenu = {
    title: "Marketplace",
    items: [
      {
        title: "Browse Prompts",
        description: "Discover top-rated prompts by category",
        icon: Image,
        href: "#marketplace"
      },
      {
        title: "Start Selling",
        description: "List prompts, manage orders, and get paid",
        icon: Briefcase,
        href: "#seller/listings"
      }
    ]
  }

  const resourcesMenu = {
    title: "Resources",
    items: [
      {
        title: "Help Center",
        description: "Guides, FAQs, troubleshooting",
        icon: HelpCircle,
        href: "#help"
      },
      {
        title: "Documentation",
        description: "API reference and integration guides",
        icon: BookOpen,
        href: "#docs"
      },
      {
        title: "Blog",
        description: "Tips, tutorials, and product updates",
        icon: FileText,
        href: "#blog"
      },
      {
        title: "Feedback",
        description: "Share ideas and report issues",
        icon: MessageSquare,
        href: "#feedback"
      }
    ]
  }

  const companyMenu = {
    title: "Company",
    items: [
      {
        title: "About",
        description: "Our mission, team, and story",
        icon: Building2,
        href: "#about"
      },
      {
        title: "Careers",
        description: "Open roles and hiring process",
        icon: Briefcase,
        href: "#careers"
      },
      {
        title: "Contact",
        description: "Talk to sales or support",
        icon: Mail,
        href: "#contact"
      }
    ]
  }

  // Combine all links for mobile menu
  const navLinks = [
    { href: "#dashboard/index", label: "Dashboard" },
    { href: "#inbox", label: "Messages" },
    { href: "#marketplace", label: "Marketplace" },
    { href: "#community", label: "Community" },
    { href: "#pricing", label: "Pricing" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="flex items-center hover:opacity-80 transition-opacity">
            <BrandLogo className="h-9" />
          </Link>

          {/* Desktop Navigation with Mega Menus */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {/* Dashboard */}
              <NavigationMenuItem>
                <Link 
                  href={currentUser && userRole ? "#dashboard/creator" : "#dashboard/index"}
                  className="text-sm font-medium transition-colors hover:text-primary px-4 py-2 rounded-md"
                >
                  Dashboard
                </Link>
              </NavigationMenuItem>

              {/* Messages */}
              <NavigationMenuItem>
                <Link 
                  href="#inbox"
                  className="text-sm font-medium transition-colors hover:text-primary px-4 py-2 rounded-md"
                >
                  Messages
                </Link>
              </NavigationMenuItem>

              {/* Products Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-5 md:w-[500px] lg:w-[600px] lg:grid-cols-2">
                    {productsMenu.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <NavigationMenuLink key={item.href} asChild>
                          <Link
                            href={item.href}
                            className="flex items-start gap-3 p-3 rounded-md hover:bg-accent transition-colors group"
                          >
                            <Icon className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium group-hover:text-primary">{item.title}</div>
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      )
                    })}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Marketplace Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">Marketplace</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-5 w-[300px]">
                    {marketplaceMenu.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <NavigationMenuLink key={item.href} asChild>
                          <Link
                            href={item.href}
                            className="flex items-start gap-3 p-3 rounded-md hover:bg-accent transition-colors group"
                          >
                            <Icon className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium group-hover:text-primary">{item.title}</div>
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      )
                    })}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Community */}
              <NavigationMenuItem>
                <Link 
                  href="#community"
                  className="text-sm font-medium transition-colors hover:text-primary px-4 py-2 rounded-md"
                >
                  Community
                </Link>
              </NavigationMenuItem>

              {/* Pricing */}
              <NavigationMenuItem>
                <Link 
                  href="#pricing"
                  className="text-sm font-medium transition-colors hover:text-primary px-4 py-2 rounded-md"
                >
                  Pricing
                </Link>
              </NavigationMenuItem>

              {/* Resources Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-5 md:w-[500px] lg:w-[600px] lg:grid-cols-2">
                    {resourcesMenu.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <NavigationMenuLink key={item.href} asChild>
                          <Link
                            href={item.href}
                            className="flex items-start gap-3 p-3 rounded-md hover:bg-accent transition-colors group"
                          >
                            <Icon className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium group-hover:text-primary">{item.title}</div>
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      )
                    })}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Company Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">Company</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-5 w-[300px]">
                    {companyMenu.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <NavigationMenuLink key={item.href} asChild>
                          <Link
                            href={item.href}
                            className="flex items-start gap-3 p-3 rounded-md hover:bg-accent transition-colors group"
                          >
                            <Icon className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium group-hover:text-primary">{item.title}</div>
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      )
                    })}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Notifications Bell */}
            {currentUser && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
                <NotificationsDropdown
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                />
              </div>
            )}
            
            <div className="hidden md:flex items-center space-x-2">
                {currentUser ? (
                  <>
                    {currentPage?.startsWith("marketplace") && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href="#prompts/create">Create Prompt</Link>
                      </Button>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`#user/${currentUser.uid}`}>
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {currentUser.email}
                      </span>
                      <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {currentPage?.startsWith("marketplace") && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href="#prompts/create">Create Prompt</Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="#login">Log In</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="#signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            
            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">

                  {/* Products Section */}
                  <Collapsible 
                    open={openSections.products} 
                    onOpenChange={() => toggleSection('products')}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-2">
                        <span className="font-medium">Products</span>
                        {openSections.products ? 
                          <X className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 pl-4">
                      {productsMenu.items.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 py-2 text-sm hover:text-primary"
                          >
                            <Icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        )
                      })}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Marketplace Section */}
                  <Collapsible 
                    open={openSections.marketplace} 
                    onOpenChange={() => toggleSection('marketplace')}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-2">
                        <span className="font-medium">Marketplace</span>
                        {openSections.marketplace ? 
                          <X className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 pl-4">
                      {marketplaceMenu.items.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 py-2 text-sm hover:text-primary"
                          >
                            <Icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        )
                      })}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Resources Section */}
                  <Collapsible 
                    open={openSections.resources} 
                    onOpenChange={() => toggleSection('resources')}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-2">
                        <span className="font-medium">Resources</span>
                        {openSections.resources ? 
                          <X className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 pl-4">
                      {resourcesMenu.items.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 py-2 text-sm hover:text-primary"
                          >
                            <Icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        )
                      })}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Company Section */}
                  <Collapsible 
                    open={openSections.company} 
                    onOpenChange={() => toggleSection('company')}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-2">
                        <span className="font-medium">Company</span>
                        {openSections.company ? 
                          <X className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 pl-4">
                      {companyMenu.items.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 py-2 text-sm hover:text-primary"
                          >
                            <Icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        )
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                    <div className="pt-4 border-t space-y-2">
                      {currentUser ? (
                        <>
                          <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="#prompts/create">Create Prompt</Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => {
                              setNotificationsOpen(!notificationsOpen)
                              setMobileMenuOpen(false)
                            }}
                          >
                            <Bell className="h-4 w-4 mr-2" />
                            Notifications
                            {unreadCount > 0 && (
                              <span className="ml-auto h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </span>
                            )}
                          </Button>
                          <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href={`#user/${currentUser.uid}`}>
                              <User className="h-4 w-4 mr-2" />
                              Profile
                            </Link>
                          </Button>
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            {currentUser.email}
                          </div>
                          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="#prompts/create">Create Prompt</Link>
                          </Button>
                          <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="#login">Log In</Link>
                          </Button>
                          <Button className="w-full" asChild>
                            <Link href="#signup">Sign Up</Link>
                          </Button>
                        </>
                      )}
                    </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
