import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  writeBatch
} from "firebase/firestore"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { 
  Bell,
  Heart,
  UserPlus,
  MessageCircle,
  CheckCheck,
  Loader2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Settings
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

export function NotificationsPage() {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false)
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null)

  // Load notifications
  const loadNotifications = async () => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    if (!isFirebaseConfigured || !firebaseDb) {
      // Demo mode - show mock data
      loadMockNotifications()
      return
    }

    try {
      setLoading(true)

      const notificationsRef = collection(firebaseDb, 'notifications')
      const notificationsQuery = query(
        notificationsRef,
        where('recipientId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      )

      const unsubscribe = onSnapshot(notificationsQuery, async (snapshot) => {
        const notificationList: Notification[] = []

        for (const doc of snapshot.docs) {
          const data = doc.data()
          
          // Fetch sender info
          let senderName = "Unknown User"
          let senderAvatar = ""

          try {
            const userQuery = query(
              collection(firebaseDb, 'users'),
              where('__name__', '==', data.senderId)
            )
            const userSnapshot = await getDocs(userQuery)
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data()
              senderName = userData.displayName || userData.email?.split('@')[0] || "Unknown User"
              senderAvatar = userData.photoURL || ""
            }
          } catch (err) {
            console.error('Error fetching user data:', err)
          }

          notificationList.push({
            id: doc.id,
            recipientId: data.recipientId,
            senderId: data.senderId,
            type: data.type,
            referenceId: data.referenceId,
            message: data.message,
            read: data.read,
            createdAt: data.createdAt,
            senderName,
            senderAvatar
          })
        }

        setNotifications(notificationList)
        setLoading(false)
      })

      return unsubscribe
    } catch (err: any) {
      console.error('Error loading notifications:', err)
      error("Loading failed", "Failed to load notifications")
      setLoading(false)
    }
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
      },
      {
        id: "notif4",
        recipientId: currentUser?.uid || "user1",
        senderId: "user4",
        type: "like",
        referenceId: "prompt2",
        message: "liked your prompt",
        read: true,
        createdAt: new Date(Date.now() - 7200000),
        senderName: "Design Expert",
        senderAvatar: "https://github.com/shadcn.png"
      },
      {
        id: "notif5",
        recipientId: currentUser?.uid || "user1",
        senderId: "user5",
        type: "follow",
        referenceId: "user5",
        message: "started following you",
        read: true,
        createdAt: new Date(Date.now() - 86400000),
        senderName: "Data Scientist",
        senderAvatar: "https://github.com/shadcn.png"
      }
    ]
    
    setNotifications(mockNotifications)
    setLoading(false)
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    if (!isFirebaseConfigured || !firebaseDb) {
      // Demo mode - just update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      )
      return
    }

    setMarkingAsRead(notificationId)
    try {
      const notificationRef = doc(firebaseDb, 'notifications', notificationId)
      await updateDoc(notificationRef, { read: true })
    } catch (err: any) {
      console.error('Error marking notification as read:', err)
      error("Error", "Failed to mark notification as read")
    } finally {
      setMarkingAsRead(null)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read)
    if (unreadNotifications.length === 0) return

    if (!isFirebaseConfigured || !firebaseDb) {
      // Demo mode - just update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      )
      success("Success", "All notifications marked as read")
      return
    }

    setMarkingAllAsRead(true)
    try {
      const batch = writeBatch(firebaseDb)
      
      unreadNotifications.forEach(notification => {
        const notificationRef = doc(firebaseDb, 'notifications', notification.id)
        batch.update(notificationRef, { read: true })
      })
      
      await batch.commit()
      success("Success", "All notifications marked as read")
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err)
      error("Error", "Failed to mark all notifications as read")
    } finally {
      setMarkingAllAsRead(false)
    }
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
  }

  // Load notifications on mount
  useEffect(() => {
    const unsubscribe = loadNotifications()
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [currentUser])

  const formatTime = (date: any) => {
    if (!date) return ""
    const d = date.toDate ? date.toDate() : new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    
    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
    return d.toLocaleDateString()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />
      case "follow":
        return <UserPlus className="h-5 w-5 text-blue-500" />
      case "message":
        return <MessageCircle className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const handleBackToDashboard = () => {
    window.location.hash = "#dashboard/index"
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-16 text-center">
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Login Required</h3>
              <p className="text-muted-foreground mb-4">
                Please log in to view your notifications.
              </p>
              <Button asChild>
                <a href="#login">Log In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b bg-background"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Bell className="h-6 w-6" />
                  Notifications
                </h1>
                <p className="text-muted-foreground">Your activity updates</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-background"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Bell className="h-6 w-6" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadCount} unread
                    </Badge>
                  )}
                </h1>
                <p className="text-muted-foreground">Your activity updates</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                disabled={markingAllAsRead}
                variant="outline"
              >
                {markingAllAsRead ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCheck className="h-4 w-4 mr-2" />
                )}
                Mark All as Read
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Bell className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No notifications yet</h3>
                <p className="text-muted-foreground">
                  You'll see notifications here when someone likes your prompts, follows you, or sends you messages.
                </p>
                <Button asChild>
                  <a href="#marketplace/index">Explore Marketplace</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !notification.read ? 'border-primary/20 bg-primary/5' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={notification.senderAvatar} />
                          <AvatarFallback>
                            {notification.senderName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">
                            {notification.senderName}
                          </p>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formatTime(notification.createdAt)}
                          </span>
                          {markingAsRead === notification.id && (
                            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
