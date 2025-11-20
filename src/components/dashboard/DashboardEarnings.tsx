import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Loader2,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  Wallet
} from "lucide-react"

interface EarningsData {
  month: string
  earnings: number
  prompts: number
  views: number
}

interface EarningsStats {
  totalEarnings: number
  monthlyEarnings: number
  weeklyEarnings: number
  totalPrompts: number
  averageEarningsPerPrompt: number
  growthRate: number
}

export function DashboardEarnings() {
  const { currentUser } = useAuth()
  const { error } = useToast()
  const [earningsData, setEarningsData] = useState<EarningsData[]>([])
  const [stats, setStats] = useState<EarningsStats>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    weeklyEarnings: 0,
    totalPrompts: 0,
    averageEarningsPerPrompt: 0,
    growthRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month")

  // Load earnings data
  const loadEarningsData = async () => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    // Demo mode - show mock data
    setLoading(true)
    
    // Simulate loading delay
    setTimeout(() => {
      const mockEarningsData: EarningsData[] = [
        { month: "Jan", earnings: 45, prompts: 3, views: 120 },
        { month: "Feb", earnings: 78, prompts: 5, views: 180 },
        { month: "Mar", earnings: 92, prompts: 4, views: 220 },
        { month: "Apr", earnings: 156, prompts: 6, views: 340 },
        { month: "May", earnings: 203, prompts: 8, views: 450 },
        { month: "Jun", earnings: 189, prompts: 7, views: 420 },
        { month: "Jul", earnings: 234, prompts: 9, views: 520 },
        { month: "Aug", earnings: 267, prompts: 10, views: 580 },
        { month: "Sep", earnings: 298, prompts: 11, views: 650 },
        { month: "Oct", earnings: 312, prompts: 12, views: 720 },
        { month: "Nov", earnings: 345, prompts: 13, views: 800 },
        { month: "Dec", earnings: 378, prompts: 14, views: 890 }
      ]

      const mockStats: EarningsStats = {
        totalEarnings: 2597,
        monthlyEarnings: 378,
        weeklyEarnings: 89,
        totalPrompts: 14,
        averageEarningsPerPrompt: 185.5,
        growthRate: 12.5
      }

      setEarningsData(mockEarningsData)
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }

  // Load earnings data on mount
  useEffect(() => {
    loadEarningsData()
  }, [currentUser, timeRange])

  // Simple bar chart component (since we don't have Recharts installed)
  const SimpleBarChart = ({ data }: { data: EarningsData[] }) => {
    const maxEarnings = Math.max(...data.map(d => d.earnings))
    
    return (
      <div className="space-y-4">
        <div className="flex items-end justify-between h-64 gap-2">
          {data.map((item, index) => {
            const height = (item.earnings / maxEarnings) * 100
            return (
              <motion.div
                key={item.month}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div className="w-full bg-primary rounded-t-lg relative group">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background border rounded px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    ${item.earnings}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{item.month}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // Simple line chart component
  const SimpleLineChart = ({ data }: { data: EarningsData[] }) => {
    const maxEarnings = Math.max(...data.map(d => d.earnings))
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (item.earnings / maxEarnings) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.polyline
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            points={points}
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - (item.earnings / maxEarnings) * 100
            return (
              <motion.circle
                key={item.month}
                initial={{ r: 0 }}
                animate={{ r: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                cx={x}
                cy={y}
                fill="hsl(var(--primary))"
                className="hover:r-2 transition-all"
              />
            )
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
          {data.map((item) => (
            <span key={item.month}>{item.month}</span>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Earnings</h1>
          <p className="text-muted-foreground">Your revenue and analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-8 w-8 bg-muted rounded"></div>
                      <div className="h-4 w-4 bg-muted rounded"></div>
                    </div>
                    <div className="h-8 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (index + 4) * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-64 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Earnings</h1>
          <p className="text-muted-foreground">Your revenue and analytics</p>
        </div>
        <div className="flex gap-2">
          {(["week", "month", "year"] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Earnings",
            value: `$${stats.totalEarnings}`,
            icon: DollarSign,
            color: "text-emerald-500",
            bgColor: "bg-emerald-50 dark:bg-emerald-950",
            change: `+${stats.growthRate}%`,
            changeType: "positive" as const
          },
          {
            title: "This Month",
            value: `$${stats.monthlyEarnings}`,
            icon: Calendar,
            color: "text-blue-500",
            bgColor: "bg-blue-50 dark:bg-blue-950",
            change: "+8.2%",
            changeType: "positive" as const
          },
          {
            title: "This Week",
            value: `$${stats.weeklyEarnings}`,
            icon: Activity,
            color: "text-purple-500",
            bgColor: "bg-purple-50 dark:bg-purple-950",
            change: "+12.5%",
            changeType: "positive" as const
          },
          {
            title: "Avg per Prompt",
            value: `$${stats.averageEarningsPerPrompt}`,
            icon: Target,
            color: "text-orange-500",
            bgColor: "bg-orange-50 dark:bg-orange-950",
            change: "+5.1%",
            changeType: "positive" as const
          }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      {stat.changeType === "positive" ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === "positive" ? "text-emerald-500" : "text-red-500"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={earningsData} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Earnings Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleLineChart data={earningsData} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Coming Soon Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Monetization Coming Soon</h3>
              <p className="text-muted-foreground">
                We're working on implementing real payment processing and earnings tracking. 
                This dashboard shows placeholder data for demonstration purposes.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Stripe Integration</Badge>
                <Badge variant="outline">PayPal Support</Badge>
                <Badge variant="outline">Crypto Payments</Badge>
                <Badge variant="outline">Analytics</Badge>
              </div>
              <Button variant="outline" className="mt-4">
                <Wallet className="h-4 w-4 mr-2" />
                Get Notified When Available
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions (Placeholder) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { prompt: "Advanced Code Review Assistant", amount: 15.99, date: "Dec 15, 2024", status: "Completed" },
                { prompt: "Creative Writing Generator", amount: 12.50, date: "Dec 14, 2024", status: "Completed" },
                { prompt: "Business Strategy Analyzer", amount: 25.00, date: "Dec 13, 2024", status: "Pending" },
                { prompt: "UI/UX Design Critique", amount: 18.75, date: "Dec 12, 2024", status: "Completed" }
              ].map((transaction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.prompt}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">+${transaction.amount}</p>
                    <Badge variant={transaction.status === "Completed" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
