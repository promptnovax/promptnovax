import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Store, 
  TrendingUp, 
  TrendingDown,
  Package, 
  DollarSign, 
  Plus,
  BarChart3,
  Users,
  Star,
  Eye,
  Edit,
  Trash2,
  Download,
  Calendar,
  MessageCircle,
  Award,
  CheckCircle,
  Clock,
  Zap,
  Target,
  Percent,
  ShoppingCart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Verified,
  Shield,
  Settings,
  Bell
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { SellerProfileSettings } from '@/components/seller/SellerProfileSettings'
import { Skeleton } from '@/components/ui/skeleton'
import { QuickActions } from '@/components/dashboard/QuickActions'

export function ProfessionalSellerDashboard() {
  const { currentUser } = useAuth()
  const { success } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [verified, setVerified] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350) // brief skeleton to reduce jhatka
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pnx_seller_profile')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (typeof parsed.verified === 'boolean') setVerified(parsed.verified)
      }
    } catch {}
  }, [])

  // Mock seller data
  const sellerStats = {
    totalEarnings: 5045.34,
    monthlyEarnings: 1234.56,
    totalSales: 166,
    monthlySales: 42,
    totalPrompts: 12,
    activePrompts: 10,
    averageRating: 4.8,
    totalViews: 15234,
    conversionRate: 12.5,
    pendingPayouts: 245.67,
    followers: 1234
  }

  const earningsGrowth = 20.1
  const salesGrowth = 12.5
  const viewsGrowth = 8.3

  const topSellingPrompts = [
    {
      id: "1",
      title: "Advanced Code Review Assistant",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      price: 29.99,
      sales: 89,
      earnings: 2671.11,
      views: 2340,
      rating: 4.8,
      status: "active",
      trend: "up"
    },
    {
      id: "2",
      title: "Security Code Scanner",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      price: 34.99,
      sales: 45,
      earnings: 1574.55,
      views: 1890,
      rating: 4.7,
      status: "active",
      trend: "up"
    },
    {
      id: "3",
      title: "API Documentation Generator",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      price: 24.99,
      sales: 32,
      earnings: 799.68,
      views: 1567,
      rating: 4.6,
      status: "active",
      trend: "down"
    }
  ]

  const recentActivity = [
    { type: "sale", message: "New sale: Advanced Code Review Assistant", time: "2 minutes ago", amount: "$29.99" },
    { type: "review", message: "5-star review received", time: "1 hour ago" },
    { type: "view", message: "100 new views on Security Code Scanner", time: "3 hours ago" },
    { type: "sale", message: "New sale: API Documentation Generator", time: "5 hours ago", amount: "$24.99" }
  ]

  const handleCreatePrompt = () => {
    window.location.hash = "#dashboard/seller-upload"
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-10" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-72 lg:col-span-2" />
          <Skeleton className="h-72" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <QuickActions role="seller" />
      
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Store className="h-8 w-8 text-primary" />
                Seller Dashboard
              </h2>
              {verified && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <Verified className="h-3 w-3 mr-1" />
                  Verified Seller
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Welcome back! Here's your business overview
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button onClick={handleCreatePrompt} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Product
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Earnings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatPrice(sellerStats.totalEarnings)}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-medium">+{earningsGrowth}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">This month</span>
                    <span className="font-medium">{formatPrice(sellerStats.monthlyEarnings)}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Sales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <ShoppingCart className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{sellerStats.totalSales}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-medium">+{salesGrowth}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">This month: </span>
                    <span className="font-medium">{sellerStats.monthlySales}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{sellerStats.activePrompts}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {sellerStats.totalPrompts} total products
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {sellerStats.activePrompts} Active
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {sellerStats.totalPrompts - sellerStats.activePrompts} Draft
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Average Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center gap-2">
                  {sellerStats.averageRating}
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on {sellerStats.totalSales} sales
                </p>
                <div className="mt-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= Math.round(sellerStats.averageRating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Top Selling Products */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Selling Products</CardTitle>
                    <CardDescription>Your best performing prompts</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {topSellingPrompts.map((prompt, index) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <img
                      src={prompt.thumbnail}
                      alt={prompt.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{prompt.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          {prompt.sales} sales
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {prompt.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {prompt.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{formatPrice(prompt.price)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatPrice(prompt.earnings)} earned
                      </div>
                      {prompt.trend === "up" ? (
                        <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>+12%</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                          <TrendingDown className="h-3 w-3" />
                          <span>-5%</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity & Quick Stats */}
            <div className="space-y-4">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className={`p-2 rounded-full ${
                        activity.type === 'sale' ? 'bg-green-100 dark:bg-green-900' :
                        activity.type === 'review' ? 'bg-yellow-100 dark:bg-yellow-900' :
                        'bg-blue-100 dark:bg-blue-900'
                      }`}>
                        {activity.type === 'sale' ? (
                          <ShoppingCart className="h-4 w-4 text-green-600" />
                        ) : activity.type === 'review' ? (
                          <Star className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <Eye className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.message}</p>
                        {activity.amount && (
                          <p className="text-xs text-green-600 font-semibold">{activity.amount}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Conversion Rate</span>
                      <span className="text-sm font-semibold">{sellerStats.conversionRate}%</span>
                    </div>
                    <Progress value={sellerStats.conversionRate} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Views</span>
                      <span className="text-sm font-semibold">{sellerStats.totalViews.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Followers</span>
                      <span className="text-sm font-semibold">{sellerStats.followers.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending Payouts</span>
                      <span className="text-lg font-bold text-primary">{formatPrice(sellerStats.pendingPayouts)}</span>
                    </div>
                    <Button size="sm" className="w-full mt-2">
                      Request Payout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Products</CardTitle>
                  <CardDescription>Manage your prompt listings</CardDescription>
                </div>
                <Button onClick={handleCreatePrompt}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Full product management interface coming in next step...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>Deep dive into your sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Advanced analytics dashboard coming in next step...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>All your recent activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'sale' ? 'bg-green-100 dark:bg-green-900' :
                      activity.type === 'review' ? 'bg-yellow-100 dark:bg-yellow-900' :
                      'bg-blue-100 dark:bg-blue-900'
                    }`}>
                      {activity.type === 'sale' ? (
                        <ShoppingCart className="h-5 w-5 text-green-600" />
                      ) : activity.type === 'review' ? (
                        <Star className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.message}</p>
                      {activity.amount && (
                        <p className="text-sm text-green-600 font-semibold mt-1">{activity.amount}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <SellerProfileSettings onChange={(d) => setVerified(!!d.verified)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

