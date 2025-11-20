import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Eye,
  Plus,
  BarChart3,
  Users,
  Star,
  ArrowUpRight,
  Calendar,
  MessageSquare
} from "lucide-react"

export function SellerPage() {
  const stats = [
    {
      title: "Total Sales",
      value: "$2,450",
      change: "+12%",
      changeType: "positive",
      icon: DollarSign,
      description: "This month"
    },
    {
      title: "Active Listings",
      value: "8",
      change: "+2",
      changeType: "positive",
      icon: Package,
      description: "Live prompts"
    },
    {
      title: "Total Views",
      value: "12.5K",
      change: "+8%",
      changeType: "positive",
      icon: Eye,
      description: "All time"
    },
    {
      title: "Rating",
      value: "4.9",
      change: "+0.1",
      changeType: "positive",
      icon: Star,
      description: "Average rating"
    }
  ]

  const recentSales = [
    {
      id: "SALE-001",
      prompt: "Advanced Content Marketing Strategy",
      buyer: "Marketing Agency",
      amount: "$29.99",
      date: "2 hours ago",
      status: "completed"
    },
    {
      id: "SALE-002",
      prompt: "Python Code Review Assistant",
      buyer: "Tech Startup",
      amount: "$19.99",
      date: "5 hours ago",
      status: "completed"
    },
    {
      id: "SALE-003",
      prompt: "Creative Story Generator",
      buyer: "Content Creator",
      amount: "$24.99",
      date: "1 day ago",
      status: "completed"
    },
    {
      id: "SALE-004",
      prompt: "Business Plan Generator",
      buyer: "Entrepreneur",
      amount: "$39.99",
      date: "2 days ago",
      status: "completed"
    }
  ]

  const topPrompts = [
    {
      title: "Advanced Content Marketing Strategy",
      sales: 45,
      revenue: "$1,349.55",
      views: 2340,
      rating: 4.9
    },
    {
      title: "Python Code Review Assistant",
      sales: 32,
      revenue: "$639.68",
      views: 1890,
      rating: 4.8
    },
    {
      title: "Creative Story Generator",
      sales: 28,
      revenue: "$699.72",
      views: 1567,
      rating: 4.7
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your prompts and track your sales performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="#seller/listings">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link href="#seller/upload">
              <Plus className="mr-2 h-4 w-4" />
              Upload Prompt
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group"
            >
              <Card className="hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20 group-hover:from-primary/5 group-hover:to-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                    <Badge 
                      variant={stat.changeType === "positive" ? "default" : "secondary"}
                      className="text-xs font-medium"
                    >
                      {stat.change}
                    </Badge>
                    <span className="group-hover:text-foreground transition-colors">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Sales
              </CardTitle>
              <CardDescription>
                Your latest prompt sales and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale, index) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{sale.prompt}</p>
                        <p className="text-xs text-muted-foreground">
                          Sold to {sale.buyer} • {sale.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{sale.amount}</p>
                        <Badge variant="secondary" className="text-xs">
                          {sale.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="#seller/listings">View All Sales</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performing Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Prompts</CardTitle>
              <CardDescription>
                Your best-selling prompts this month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topPrompts.map((prompt, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium line-clamp-1">{prompt.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      <span>{prompt.sales} sales</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{prompt.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{prompt.revenue}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>{prompt.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your marketplace presence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start" asChild>
                <Link href="#seller/upload">
                  <Plus className="h-5 w-5 mb-2" />
                  <span className="font-medium">Upload New Prompt</span>
                  <span className="text-xs text-muted-foreground">Create and publish</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start" asChild>
                <Link href="#seller/listings">
                  <Package className="h-5 w-5 mb-2" />
                  <span className="font-medium">Manage Listings</span>
                  <span className="text-xs text-muted-foreground">Edit and organize</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start" asChild>
                <Link href="#seller/analytics">
                  <BarChart3 className="h-5 w-5 mb-2" />
                  <span className="font-medium">View Analytics</span>
                  <span className="text-xs text-muted-foreground">Performance insights</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start" asChild>
                <Link href="#seller/settings">
                  <Users className="h-5 w-5 mb-2" />
                  <span className="font-medium">Seller Settings</span>
                  <span className="text-xs text-muted-foreground">Account preferences</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Your marketplace performance over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Chart visualization will be implemented here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Track sales trends, popular categories, and revenue growth
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
