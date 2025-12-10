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
  Heart,
  UserPlus,
  MessageCircle,
  Check,
  CheckCheck,
  Loader2,
  AlertCircle,
  Clock
} from "lucide-react"

interface Notification {
  id: string
  recipientId: string
  senderId: string
  type: "like" | "follow" | "message"
  referenceId: string
  message: string
  read: boolean
  createdAt: any
  senderName?: string
  senderAvatar?: string
}

interface NotificationsDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null)

  // Load notifications
  const loadNotifications = async () => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    loadMockNotifications()
  }

  // Load mock data for demo mode
  const loadMockNotifications = () => {
    const mockNotifications: Notification[] = [
      {
        id: "notif1",
        recipientId: currentUser?.uid || "user1",
        senderId: "user2",
        type: "like",
        referenceId: "prompt1",
        message: "liked your prompt",
        read: false,
        createdAt: new Date(Date.now() - 300000),
        senderName: "CodeMaster Pro",
        senderAvatar: "https://github.com/shadcn.png"
      },
      {
        id: "notif2",
        recipientId: currentUser?.uid || "user1",
        senderId: "user3",
        type: "follow",
        referenceId: "user3",
        message: "started following you",
        read: false,
        createdAt: new Date(Date.now() - 1800000),
        senderName: "Writer's Block",
        senderAvatar: "https://github.com/shadcn.png"
      },
      {
        id: "notif3",
        recipientId: currentUser?.uid || "user1",
        senderId: "user2",
        type: "message",
        referenceId: "conv1",
        message: "sent you a message",
        read: true,
        createdAt: new Date(Date.now() - 3600000),
        senderName: "CodeMaster Pro",
        senderAvatar: "https://github.com/shadcn.png"
      }
    ]
    
    setNotifications(mockNotifications)
    setLoading(false)
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    setMarkingAsRead(notificationId)
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
    setTimeout(() => setMarkingAsRead(null), 300)
  }

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if not already
    if (!notification.read) {
      markAsRead(notification.id)
    }

    // Navigate based on type
    switch (notification.type) {
      case "like":
        window.location.hash = `#prompts/${notification.referenceId}`
        break
      case "follow":
        window.location.hash = `#user/${notification.senderId}`
        break
      case "message":
        window.location.hash = `#inbox/${notification.referenceId}`
        break
    }
    
    onClose()
  }

  // Load notifications on mount
  useEffect(() => {
    loadNotifications()
  }, [currentUser])

  const formatTime = (date: any) => {
    if (!date) return ""
    const d = date.toDate ? date.toDate() : new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    
    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return d.toLocaleDateString()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case "message":
        return <MessageCircle className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
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
          className="absolute right-0 top-full mt-2 w-80 z-50"
        >
          <Card className="shadow-lg border">
            <CardContent className="p-0">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.hash = '#notifications'}
                  >
                    View All
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-3 animate-pulse">
                        <div className="h-8 w-8 bg-muted rounded-full"></div>
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
                    <p className="text-muted-foreground">No notifications yet</p>
                    <p className="text-sm text-muted-foreground">
                      You'll see notifications here when someone interacts with your content
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
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={notification.senderAvatar} />
                              <AvatarFallback>
                                {notification.senderName?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">
                                {notification.senderName}
                              </p>
                              {!notification.read && (
                                <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {formatTime(notification.createdAt)}
                              </span>
                            </div>
                          </div>

                          {markingAsRead === notification.id && (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          )}
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
                    onClick={() => window.location.hash = '#notifications'}
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
