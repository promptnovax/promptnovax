import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { 
  Bell,
  ShoppingBag,
  CreditCard,
  MessageCircle,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  UserPlus,
  Heart,
  Download,
  RefreshCw,
  Clock,
  Loader2
} from "lucide-react"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
  icon?: string
}

interface DashboardNotificationsProps {
  isOpen: boolean
  onClose: () => void
  userRole?: "seller" | "buyer"
}

export function DashboardNotifications({ isOpen, onClose, userRole }: DashboardNotificationsProps) {
  const { currentUser } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null)

  // Load notifications based on user role
  useEffect(() => {
    if (isOpen && currentUser) {
      loadNotifications()
    }
  }, [isOpen, currentUser, userRole])

  const loadNotifications = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockNotifications = userRole === "seller" ? getSellerNotifications() : getBuyerNotifications()
      setNotifications(mockNotifications)
      setLoading(false)
    }, 300)
  }

  const getSellerNotifications = (): Notification[] => {
    return [
      {
        id: "seller1",
        type: "sale",
        title: "New Sale!",
        message: "Your prompt 'Advanced Code Review' was purchased by John Doe",
        read: false,
        createdAt: new Date(Date.now() - 300000),
        actionUrl: "#dashboard/seller/payouts"
      },
      {
        id: "seller2",
        type: "review",
        title: "New Review",
        message: "Sarah Smith left a 5-star review on 'Creative Writing Prompts'",
        read: false,
        createdAt: new Date(Date.now() - 1800000),
        actionUrl: "#dashboard/seller/prompts"
      },
      {
        id: "seller3",
        type: "message",
        title: "New Message",
        message: "Buyer inquiry about 'AI Code Assistant' pricing",
        read: false,
        createdAt: new Date(Date.now() - 3600000),
        actionUrl: "#dashboard/seller/messages"
      },
      {
        id: "seller4",
        type: "payout",
        title: "Payout Processed",
        message: "$245.50 has been transferred to your account",
        read: true,
        createdAt: new Date(Date.now() - 86400000),
        actionUrl: "#dashboard/seller/payouts"
      },
      {
        id: "seller5",
        type: "analytics",
        title: "Weekly Report",
        message: "Your prompts got 120 views this week (+15% from last week)",
        read: true,
        createdAt: new Date(Date.now() - 172800000),
        actionUrl: "#dashboard/seller/analytics"
      }
    ]
  }

  const getBuyerNotifications = (): Notification[] => {
    return [
      {
        id: "buyer1",
        type: "purchase",
        title: "Purchase Successful",
        message: "You successfully purchased 'Advanced Code Review Assistant'",
        read: false,
        createdAt: new Date(Date.now() - 300000),
        actionUrl: "#dashboard/buyer/purchases"
      },
      {
        id: "buyer2",
        type: "update",
        title: "Prompt Updated",
        message: "'Creative Writing Prompts' has been updated with new features",
        read: false,
        createdAt: new Date(Date.now() - 1800000),
        actionUrl: "#dashboard/buyer/collections"
      },
      {
        id: "buyer3",
        type: "subscription",
        title: "Subscription Renewal",
        message: "Your subscription to 'Premium Prompts' will renew in 3 days",
        read: false,
        createdAt: new Date(Date.now() - 3600000),
        actionUrl: "#dashboard/buyer/subscriptions"
      },
      {
        id: "buyer4",
        type: "message",
        title: "New Message",
        message: "Seller 'CodeMaster Pro' replied to your inquiry",
        read: true,
        createdAt: new Date(Date.now() - 86400000),
        actionUrl: "#dashboard/buyer/messages"
      },
      {
        id: "buyer5",
        type: "recommendation",
        title: "New Recommendations",
        message: "5 new prompts match your interests based on your purchases",
        read: true,
        createdAt: new Date(Date.now() - 172800000),
        actionUrl: "#marketplace"
      }
    ]
  }

  const markAsRead = async (notificationId: string) => {
    setMarkingAsRead(notificationId)
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
    setTimeout(() => setMarkingAsRead(null), 300)
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
    toast({
      title: "All notifications marked as read",
    })
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    if (notification.actionUrl) {
      window.location.hash = notification.actionUrl
    }
    onClose()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "sale":
      case "purchase":
        return <ShoppingBag className="h-4 w-4 text-emerald-500" />
      case "review":
      case "update":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "message":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "payout":
      case "subscription":
        return <CreditCard className="h-4 w-4 text-purple-500" />
      case "analytics":
      case "recommendation":
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!currentUser) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-full mt-2 w-96 z-50"
        >
          <Card className="shadow-lg border">
            <CardContent className="p-0">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    {userRole === "seller" ? "Seller" : "Buyer"} Notifications
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userRole === "seller" 
                    ? "Sales, reviews, messages, and analytics updates"
                    : "Purchases, updates, subscriptions, and recommendations"}
                </p>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-3 animate-pulse">
                        <div className="h-10 w-10 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-muted rounded w-3/4"></div>
                          <div className="h-2 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No notifications yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {userRole === "seller" 
                        ? "You'll see sales, reviews, and messages here"
                        : "You'll see purchases, updates, and recommendations here"}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
                              {getNotificationIcon(notification.type)}
                            </div>
                            {!notification.read && (
                              <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold truncate">
                                {notification.title}
                              </p>
                              {markingAsRead === notification.id && (
                                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {formatTime(notification.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      window.location.hash = userRole === "seller" 
                        ? '#dashboard/seller/notifications' 
                        : '#dashboard/buyer/notifications'
                      onClose()
                    }}
                  >
                    View All Notifications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

