import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"
import { useToast } from "@/hooks/use-toast"
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  DollarSign, 
  Zap, 
  Clock,
  ArrowUpRight,
  Activity,
  Edit,
  Trash2,
  MoreVertical
} from "lucide-react"

export function DashboardOverview() {
  const { success, error } = useToast()
  const stats = [
    {
      title: "Total Prompts",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: Zap,
      description: "Prompts created this month"
    },
    {
      title: "Active Users",
      value: "25",
      change: "+8%",
      changeType: "positive",
      icon: Users,
      description: "Users using your prompts"
    },
    {
      title: "Earnings",
      value: "$450",
      change: "+23%",
      changeType: "positive",
      icon: DollarSign,
      description: "Revenue this month"
    },
    {
      title: "Response Time",
      value: "2.3s",
      change: "-15%",
      changeType: "positive",
      icon: Clock,
      description: "Average response time"
    }
  ]

  const recentActivity = [
    { action: "Created prompt", time: "2 minutes ago", type: "prompt" },
    { action: "User interaction", time: "5 minutes ago", type: "interaction" },
    { action: "Generated response", time: "8 minutes ago", type: "generation" },
    { action: "Updated settings", time: "1 hour ago", type: "settings" }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your account.</p>
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
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <Card 
                  className="hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20 group-hover:from-primary/5 group-hover:to-primary/10 cursor-pointer"
                  onClick={() => success(`${stat.title} clicked!`, `Current value: ${stat.value}`)}
                >
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest actions and interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentActivity.map((activity, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => success("Activity clicked!", activity.action)}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="w-3 h-3 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
                      <div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-medium">
                        {activity.type}
                      </Badge>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                Quick Actions
              </CardTitle>
              <CardDescription>
                Get started with these common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full justify-start h-12" variant="outline" asChild>
                  <Link href="#dashboard/generator">
                    <div className="p-2 rounded-lg bg-primary/10 mr-3">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    Create New Prompt
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full justify-start h-12" variant="outline" asChild>
                  <Link href="#chat">
                    <div className="p-2 rounded-lg bg-primary/10 mr-3">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    Start Chat Session
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full justify-start h-12" variant="outline" asChild>
                  <Link href="#dashboard/analytics">
                    <div className="p-2 rounded-lg bg-primary/10 mr-3">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    View Analytics
                  </Link>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Performance Overview
            </CardTitle>
            <CardDescription>
              Your prompt performance over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/40 rounded-xl border-2 border-dashed border-muted-foreground/20">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="p-4 rounded-full bg-primary/10 mx-auto mb-4 w-fit">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Chart Coming Soon</h3>
                <p className="text-muted-foreground max-w-sm">
                  Interactive performance charts will be implemented here to show your prompt analytics and trends.
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
