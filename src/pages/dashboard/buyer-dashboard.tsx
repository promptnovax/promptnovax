import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  ShoppingBag,
  Heart,
  History,
  Star,
  Search,
  Download,
  Eye,
  Calendar,
  DollarSign,
  MessageCircle,
  AlertTriangle,
  Clock4,
  Zap,
  Sparkles,
  BellRing,
  Ticket,
  Link2,
  BrainCircuit,
  Headphones,
  CreditCard,
  RefreshCw,
  ArrowUpRight,
  BarChart3,
  Workflow,
  PenTool,
  LifeBuoy
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { BuyerSubscriptions } from '@/components/buyer/BuyerSubscriptions'
import { BuyerDownloads } from '@/components/buyer/BuyerDownloads'
import { BuyerInvoices } from '@/components/buyer/BuyerInvoices'

export function BuyerDashboard() {
  const { userRole, currentUser } = useAuth()
  const { success } = useToast()
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  // Mock data for purchased prompts
  const purchasedPrompts = [
    {
      id: "1",
      title: "Advanced Code Review Assistant",
      description: "Get comprehensive code reviews with suggestions for improvements, security issues, and best practices.",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      price: 29.99,
      rating: 4.8,
      seller: {
        name: "CodeMaster Pro",
        avatar: "https://github.com/shadcn.png"
      },
      purchaseDate: "2024-01-20",
      downloadCount: 3,
      lastUsed: "2024-01-22"
    },
    {
      id: "2",
      title: "Creative Writing Prompts Generator",
      description: "Generate unique and inspiring writing prompts for stories, articles, and creative projects.",
      thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      price: 19.99,
      rating: 4.6,
      seller: {
        name: "Creative Minds",
        avatar: "https://github.com/shadcn.png"
      },
      purchaseDate: "2024-01-18",
      downloadCount: 1,
      lastUsed: "2024-01-18"
    },
    {
      id: "3",
      title: "Business Email Templates",
      description: "Professional email templates for various business scenarios including follow-ups, proposals, and negotiations.",
      thumbnail: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop",
      price: 24.99,
      rating: 4.9,
      seller: {
        name: "Business Solutions",
        avatar: "https://github.com/shadcn.png"
      },
      purchaseDate: "2024-01-15",
      downloadCount: 5,
      lastUsed: "2024-01-21"
    }
  ]

  // Mock data for wishlist
  const wishlistPrompts = [
    {
      id: "4",
      title: "AI Chatbot Personality Designer",
      description: "Create unique chatbot personalities with custom responses, tone, and conversation styles.",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
      price: 39.99,
      rating: 4.7,
      seller: {
        name: "AI Innovators",
        avatar: "https://github.com/shadcn.png"
      },
      addedDate: "2024-01-19"
    },
    {
      id: "5",
      title: "Social Media Content Calendar",
      description: "Generate engaging social media posts with hashtags, optimal posting times, and content ideas.",
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      price: 34.99,
      rating: 4.5,
      seller: {
        name: "Social Media Pro",
        avatar: "https://github.com/shadcn.png"
      },
      addedDate: "2024-01-17"
    }
  ]

  const handleDownload = (promptId: string) => {
    success("Download Started", "Your prompt is being downloaded...")
  }

  const handleViewPrompt = (promptId: string) => {
    window.location.hash = `#marketplace/${promptId}`
  }

  const handleRemoveFromWishlist = (promptId: string) => {
    success("Removed from Wishlist", "Prompt removed from your wishlist")
  }

  const accountHealth = [
    {
      label: "Usage credits",
      value: 72,
      total: 120,
      trend: "+18% vs last month",
      status: "Healthy"
    },
    {
      label: "Automation coverage",
      value: 4,
      total: 6,
      trend: "+2 new workflows deployed",
      status: "Expanding"
    },
    {
      label: "Team satisfaction",
      value: 92,
      total: 100,
      trend: "Last survey · Excellent",
      status: "On track"
    }
  ]

  const renewalAlerts = [
    {
      id: "REN-201",
      item: "Code review assistant seat pack",
      renewsOn: "2024-02-10",
      amount: 49.99,
      status: "due_soon"
    },
    {
      id: "REN-187",
      item: "Prompt testing add-on",
      renewsOn: "2024-02-02",
      amount: 24.00,
      status: "trial"
    },
    {
      id: "REN-178",
      item: "Creative studio premium",
      renewsOn: "2024-03-01",
      amount: 89.00,
      status: "active"
    }
  ]

  const supportTickets = [
    {
      id: "CASE-4312",
      topic: "Prompt output drift after update",
      status: "Seller responding",
      updated: "2h ago",
      owner: "Nadia"
    },
    {
      id: "CASE-4301",
      topic: "Invoice mismatch",
      status: "Waiting on buyer",
      updated: "Yesterday",
      owner: "Finance"
    }
  ]

  const personalizedStreams = [
    {
      title: "Ship code review rituals",
      description: "Bundle static analysis + AI reviewer for weekly releases",
      impact: "Saves 5 hrs / sprint",
      action: "Launch workflow"
    },
    {
      title: "Warm outbound automation",
      description: "Pair persona builder prompts with CRM sync",
      impact: "Adds 12 qualified leads / week",
      action: "Preview pack"
    },
    {
      title: "Voice of customer board",
      description: "Pipe marketplace feedback into Notion template",
      impact: "Surfaces top 3 request themes",
      action: "Install template"
    }
  ]

  const savedSearches = [
    { title: "Fintech onboarding copilots", alerts: 3, freshness: "Updated 6m ago" },
    { title: "Design QA testers", alerts: 1, freshness: "Updated 2h ago" },
    { title: "Multilingual copy studio", alerts: 4, freshness: "Updated 1d ago" }
  ]

  const navigationShortcuts = [
    {
      label: "Track purchases",
      description: "Audit licenses, download files, trigger follow-ups.",
      icon: ShoppingBag,
      href: "#dashboard/buyer/purchases"
    },
    {
      label: "Automation hub",
      description: "Launch workflows or review run history.",
      icon: Workflow,
      href: "#dashboard/buyer/automation"
    },
    {
      label: "Collections & assets",
      description: "Organize deliverables, wishlist, and briefs.",
      icon: PenTool,
      href: "#dashboard/buyer/collections"
    },
    {
      label: "Usage & billing",
      description: "Forecast spend, download invoices, update cards.",
      icon: BarChart3,
      href: "#dashboard/buyer/billing"
    },
    {
      label: "Guided support",
      description: "Open tickets, escalate to concierge, self-serve answers.",
      icon: LifeBuoy,
      href: "#dashboard/buyer/support"
    },
    {
      label: "Analytics",
      description: "Understand adoption, quality, and sentiment signals.",
      icon: History,
      href: "#dashboard/buyer/analytics"
    }
  ]

  const handleBrowseMarketplace = () => {
    window.location.hash = "#marketplace"
  }

  const buyerName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "there"

  const handleRefreshSignals = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1200)
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center space-x-3">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span>Buyer Dashboard</span>
            </h2>
            <p className="text-muted-foreground">
              Manage your purchases, wishlist, and discover new prompts
            </p>
          </div>
          <Button onClick={handleBrowseMarketplace} variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Browse Marketplace
          </Button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <QuickActions role="buyer" />

      {/* Welcome hero */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardContent className="p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="uppercase tracking-wide">Workspace</Badge>
            <h3 className="text-3xl font-semibold leading-tight">
              Welcome back, {buyerName} 👋
            </h3>
            <p className="text-muted-foreground max-w-2xl">
              Everything you need to run buyer operations lives here—purchases, workflows, support, and analytics.
              Jump back into a workflow or spin up a new prompt generator run in seconds.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button className="justify-between" onClick={() => window.open("http://localhost:8080/#prompt-generator", "_blank", "noopener,noreferrer")}>
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Launch Prompt Generator
              </span>
              <ArrowUpRight className="h-4 w-4 opacity-80" />
            </Button>
            <Button variant="outline" className="justify-between" onClick={() => window.location.hash = "#dashboard/buyer/support"}>
              <span className="flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                Open Support & Guidance
              </span>
              <ArrowUpRight className="h-4 w-4 opacity-80" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guided navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {navigationShortcuts.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card
                className="h-full border-dashed hover:border-primary/40 transition-colors cursor-pointer"
                onClick={() => window.location.hash = item.href}
              >
                <CardContent className="p-4 flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6"
      >
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchasedPrompts.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 this month
            </p>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wishlistPrompts.length}</div>
            <p className="text-xs text-muted-foreground">
              Saved for later
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(purchasedPrompts.reduce((sum, p) => sum + p.price, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {purchasedPrompts.reduce((sum, p) => sum + p.downloadCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total downloads
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Next renewal in 6 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportTickets.length}</div>
            <p className="text-xs text-muted-foreground">
              Avg response: 1h 20m
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Account Health</CardTitle>
              <CardDescription>Monitor adoption, automation and sentiment</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefreshSignals}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? "Syncing..." : "Refresh signals"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {accountHealth.map((item) => {
              const percent = Math.round((item.value / item.total) * 100)
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 font-medium">
                      <Zap className="h-4 w-4 text-primary" />
                      {item.label}
                    </div>
                    <span className="text-muted-foreground">
                      {item.value}/{item.total}
                    </span>
                  </div>
                  <Progress value={percent} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.trend}</span>
                    <Badge variant="outline">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="space-y-3">
          <CardHeader>
            <CardTitle>Saved Searches & Alerts</CardTitle>
            <CardDescription>Stay ahead of new drops and bundles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {savedSearches.map((search) => (
              <div key={search.title} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{search.title}</div>
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <BellRing className="h-3 w-3" />
                    {search.alerts} alerts
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{search.freshness}</span>
                  <button className="text-primary hover:underline text-xs" onClick={handleBrowseMarketplace}>
                    View matches
                  </button>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full border-dashed border" onClick={handleBrowseMarketplace}>
              <Sparkles className="h-4 w-4 mr-2" />
              Create smart alert
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs for Purchases and Wishlist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="purchases" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchases" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              My Purchases ({purchasedPrompts.length})
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wishlist ({wishlistPrompts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Purchases</CardTitle>
                <CardDescription>
                  Your purchased prompts and download history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchasedPrompts.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start exploring the marketplace to find amazing prompts!
                    </p>
                    <Button onClick={handleBrowseMarketplace}>
                      <Search className="h-4 w-4 mr-2" />
                      Browse Marketplace
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchasedPrompts.map((prompt, index) => (
                      <motion.div
                        key={prompt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                          <div className="relative">
                            <img
                              src={prompt.thumbnail}
                              alt={prompt.title}
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge variant="default" className="bg-green-500">
                                Purchased
                              </Badge>
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 line-clamp-2">
                              {prompt.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {prompt.description}
                            </p>

                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{prompt.rating}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Download className="h-3 w-3" />
                                {prompt.downloadCount} downloads
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={prompt.seller.avatar} />
                                <AvatarFallback className="text-xs">
                                  {prompt.seller.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                by {prompt.seller.name}
                              </span>
                            </div>

                            <div className="flex gap-2 mb-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleViewPrompt(prompt.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleDownload(prompt.id)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>

                            <div className="pt-3 border-t">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Purchased {formatDate(prompt.purchaseDate)}</span>
                                <span>Last used {formatDate(prompt.lastUsed)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
                <CardDescription>
                  Prompts you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                {wishlistPrompts.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Wishlist is empty</h3>
                    <p className="text-muted-foreground mb-4">
                      Save prompts you like to your wishlist for easy access later!
                    </p>
                    <Button onClick={handleBrowseMarketplace}>
                      <Search className="h-4 w-4 mr-2" />
                      Browse Marketplace
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistPrompts.map((prompt, index) => (
                      <motion.div
                        key={prompt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                          <div className="relative">
                            <img
                              src={prompt.thumbnail}
                              alt={prompt.title}
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500">
                                <Heart className="h-3 w-3 mr-1 fill-current" />
                                Saved
                              </Badge>
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 line-clamp-2">
                              {prompt.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {prompt.description}
                            </p>

                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{prompt.rating}</span>
                              </div>
                              <div className="text-lg font-bold text-primary">
                                {formatPrice(prompt.price)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={prompt.seller.avatar} />
                                <AvatarFallback className="text-xs">
                                  {prompt.seller.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                by {prompt.seller.name}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleViewPrompt(prompt.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => window.location.hash = `#marketplace/${prompt.id}`}
                              >
                                Buy Now
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRemoveFromWishlist(prompt.id)}
                              >
                                <Heart className="h-4 w-4 fill-current" />
                              </Button>
                            </div>

                            <div className="mt-3 pt-3 border-t">
                              <div className="text-xs text-muted-foreground">
                                Added {formatDate(prompt.addedDate)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Renewals, Support, Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        <Card className="xl:col-span-1 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Renewals & Trials
              </CardTitle>
              <Badge variant="secondary">Live</Badge>
            </div>
            <CardDescription>Prevent service gaps and surprise bills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renewalAlerts.map((alert) => (
              <div key={alert.id} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{alert.item}</span>
                  <span className="font-mono text-xs text-muted-foreground">{alert.id}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock4 className="h-3 w-3" />
                    Renews {formatDate(alert.renewsOn)}
                  </div>
                  <div className="font-semibold text-primary">{formatPrice(alert.amount)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={alert.status === "due_soon" ? "destructive" : alert.status === "trial" ? "secondary" : "outline"}
                  >
                    {alert.status === "due_soon" && "Due soon"}
                    {alert.status === "trial" && "Trial expiring"}
                    {alert.status === "active" && "Scheduled"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <CreditCard className="h-3 w-3 mr-2" />
                    Update billing
                  </Button>
                </div>
              </div>
            ))}
            <Button className="w-full">
              <Link2 className="h-4 w-4 mr-2" />
              Sync calendar
            </Button>
          </CardContent>
        </Card>

        <Card className="space-y-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />
              Support & Escalations
            </CardTitle>
            <CardDescription>Track conversations with sellers and PNX support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{ticket.topic}</span>
                  <Badge variant="outline">{ticket.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Owner: {ticket.owner}</span>
                  <span>Updated {ticket.updated}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  <Button size="sm" variant="ghost">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Escalate
                  </Button>
                </div>
              </div>
            ))}
            <div className="rounded-lg border border-dashed p-4 flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium">
                <Headphones className="h-4 w-4 text-primary" />
                Need faster help?
              </div>
              <p className="text-muted-foreground text-xs">
                Book a live buyer concierge to troubleshoot workflows with you.
              </p>
              <Button size="sm">
                <Calendar className="h-3 w-3 mr-2" />
                Schedule call
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-primary" />
              Personalized Plays
            </CardTitle>
            <CardDescription>Ready-to-run combinations that match your usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {personalizedStreams.map((stream) => (
              <div key={stream.title} className="rounded-lg bg-muted/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{stream.title}</div>
                  <Badge variant="secondary">High impact</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{stream.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{stream.impact}</span>
                  <Button variant="link" className="h-auto p-0 text-xs">
                    {stream.action}
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Ask AI buyer coach
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Operational Tables */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 2xl:grid-cols-2 gap-6"
      >
        <BuyerSubscriptions />
        <BuyerDownloads />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <BuyerInvoices />
      </motion.div>
    </div>
  )
}