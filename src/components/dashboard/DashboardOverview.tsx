import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { 
  collection, 
  query, 
  where, 
  getDocs,
  onSnapshot
} from "@/lib/platformStubs/firestore"
import { platformDb, isSupabaseConfigured } from "@/lib/platformClient"
import { 
  FileText,
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  Eye,
  MessageCircle,
  Loader2
} from "lucide-react"

interface DashboardStats {
  totalPrompts: number
  totalFollowers: number
  totalLikes: number
  totalEarnings: number
  totalViews: number
  totalMessages: number
}

export function DashboardOverview() {
  const { currentUser } = useAuth()
  const { error } = useToast()
  const [stats, setStats] = useState<DashboardStats>({
    totalPrompts: 0,
    totalFollowers: 0,
    totalLikes: 0,
    totalEarnings: 0,
    totalViews: 0,
    totalMessages: 0
  })
  const [loading, setLoading] = useState(true)

  // Load dashboard stats
  const loadStats = async () => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured || !platformDb) {
      // Demo mode - show mock data
      setStats({
        totalPrompts: 12,
        totalFollowers: 156,
        totalLikes: 342,
        totalEarnings: 1250,
        totalViews: 2840,
        totalMessages: 23
      })
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Get user's prompts
      const promptsQuery = query(
        collection(platformDb, 'prompts'),
        where('uid', '==', currentUser.uid)
      )
      const promptsSnapshot = await getDocs(promptsQuery)
      const prompts = promptsSnapshot.docs.map(doc => doc.data())

      // Calculate total likes from all prompts
      const totalLikes = prompts.reduce((sum, prompt) => {
        return sum + (prompt.likes?.length || 0)
      }, 0)

      // Get user's follower count
      const userQuery = query(
        collection(platformDb, 'users'),
        where('__name__', '==', currentUser.uid)
      )
      const userSnapshot = await getDocs(userQuery)
      const userData = userSnapshot.docs[0]?.data()
      const totalFollowers = userData?.followers?.length || 0

      // Get conversations count (messages)
      const conversationsQuery = query(
        collection(platformDb, 'conversations'),
        where('participants', 'array-contains', currentUser.uid)
      )
      const conversationsSnapshot = await getDocs(conversationsQuery)
      const totalMessages = conversationsSnapshot.docs.length

      setStats({
        totalPrompts: prompts.length,
        totalFollowers,
        totalLikes,
        totalEarnings: 0, // Placeholder for now
        totalViews: Math.floor(Math.random() * 1000) + totalLikes * 2, // Mock views
        totalMessages
      })
    } catch (err: any) {
      console.error('Error loading dashboard stats:', err)
      error("Loading failed", "Failed to load dashboard statistics")
    } finally {
      setLoading(false)
    }
  }

  // Load stats on mount
  useEffect(() => {
    loadStats()
  }, [currentUser])

  const statCards = [
    {
      title: "Total Prompts",
      value: stats.totalPrompts,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      description: "Prompts you've created"
    },
    {
      title: "Followers",
      value: stats.totalFollowers,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
      description: "People following you"
    },
    {
      title: "Total Likes",
      value: stats.totalLikes,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
      description: "Likes on your prompts"
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      description: "Views across all prompts"
    },
    {
      title: "Messages",
      value: stats.totalMessages,
      icon: MessageCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      description: "Active conversations"
    },
    {
      title: "Earnings",
      value: `$${stats.totalEarnings}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      description: "Total revenue (coming soon)"
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's your activity summary.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
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
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your activity summary.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${card.bgColor}`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold">{card.value}</h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="w-full h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => window.location.hash = "#prompts/create"}
                >
                  <FileText className="h-6 w-6" />
                  <span>Create New Prompt</span>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => window.location.hash = "#marketplace/index"}
                >
                  <Eye className="h-6 w-6" />
                  <span>Browse Marketplace</span>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => window.location.hash = "#inbox"}
                >
                  <MessageCircle className="h-6 w-6" />
                  <span>View Messages</span>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}