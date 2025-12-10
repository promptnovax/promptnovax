import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { useGuestChat } from "@/context/GuestChatContext"
import { useToast } from "@/hooks/use-toast"
import { 
  MessageCircle,
  Loader2,
  RefreshCw,
  AlertCircle,
  Clock
} from "lucide-react"

interface Conversation {
  id: string
  participants: string[]
  lastMessage?: {
    text: string
    senderId: string
    createdAt: any
  }
  updatedAt: any
  otherParticipant?: {
    uid: string
    name: string
    avatar?: string
  }
  unreadCount?: number
  starred?: boolean
  archived?: boolean
}

interface InboxSidebarProps {
  onConversationSelect: (
    conversationId: string,
    otherParticipant?: {
      uid: string
      name: string
      avatar?: string
    }
  ) => void
  selectedConversationId?: string
  searchQuery?: string
  isDashboard?: boolean // If true, skip login prompts
  filterMode?: "all" | "starred" | "archived"
}

export function InboxSidebar({
  onConversationSelect,
  selectedConversationId,
  searchQuery = "",
  isDashboard = false,
  filterMode = "all"
}: InboxSidebarProps) {
  const { currentUser } = useAuth()
  // GuestChatProvider wraps messages pages, so this is safe
  const { guestUser } = useGuestChat()
  const { error } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // In dashboard context, assume user is logged in
  const canAccess = isDashboard ? !!currentUser : (!!currentUser || !!guestUser)

  // Load conversations
  const loadConversations = () => {
    loadMockConversations()
  }

  // Load mock data for demo mode
  const loadMockConversations = () => {
    const userId = currentUser?.uid || guestUser?.id || "guest-user"
    const mockConversations: Conversation[] = [
      {
        id: "conv1",
        participants: [userId, "user2"],
        lastMessage: {
          text: "Thanks for the prompt! It worked perfectly for my project. Really appreciate your help!",
          senderId: "user2",
          createdAt: new Date(Date.now() - 1800000) // 30 min ago
        },
        updatedAt: new Date(Date.now() - 1800000),
        otherParticipant: {
          uid: "user2",
          name: "CodeMaster Pro",
          avatar: "https://ui-avatars.com/api/?name=CodeMaster+Pro&background=5865F2&color=fff"
        },
        unreadCount: 0
      },
      {
        id: "conv2",
        participants: [userId, "user3"],
        lastMessage: {
          text: "Hi! I'm interested in your writing prompts. Do you have more examples?",
          senderId: userId,
          createdAt: new Date(Date.now() - 7200000) // 2 hours ago
        },
        updatedAt: new Date(Date.now() - 7200000),
        otherParticipant: {
          uid: "user3",
          name: "Writer's Block",
          avatar: "https://ui-avatars.com/api/?name=Writer+Block&background=10b981&color=fff"
        },
        unreadCount: 2
      },
      {
        id: "conv3",
        participants: [userId, "user4"],
        lastMessage: {
          text: "The design prompts are amazing! Can we discuss custom requirements?",
          senderId: "user4",
          createdAt: new Date(Date.now() - 86400000) // 1 day ago
        },
        updatedAt: new Date(Date.now() - 86400000),
        otherParticipant: {
          uid: "user4",
          name: "DesignMaster",
          avatar: "https://ui-avatars.com/api/?name=DesignMaster&background=ec4899&color=fff"
        },
        unreadCount: 0
      },
      {
        id: "conv4",
        participants: [userId, "user5"],
        lastMessage: {
          text: "Sure! I'll help you with that data analysis prompt.",
          senderId: "user5",
          createdAt: new Date(Date.now() - 172800000) // 2 days ago
        },
        updatedAt: new Date(Date.now() - 172800000),
        otherParticipant: {
          uid: "user5",
          name: "DataInsights Pro",
          avatar: "https://ui-avatars.com/api/?name=DataInsights&background=8b5cf6&color=fff"
        },
        unreadCount: 1
      }
    ]
    
    // Merge with stored metadata (starred / archived)
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("promptnx-chat-metadata")
        if (raw) {
          const meta = JSON.parse(raw) as Record<string, { starred?: boolean; archived?: boolean }>
          const merged = mockConversations.map((conv) => {
            const m = meta[conv.id]
            return m ? { ...conv, starred: Boolean(m.starred), archived: Boolean(m.archived) } : conv
          })
          setConversations(merged)
        } else {
          setConversations(mockConversations)
        }
      } catch {
        setConversations(mockConversations)
      }
    } else {
      setConversations(mockConversations)
    }
    setLoading(false)
  }

  // Filter conversations by search query and filter mode
  const filteredConversations = conversations.filter(conv => {
    // Archived/starred filtering
    if (filterMode === "archived") {
      if (!conv.archived) return false
    } else {
      // Hide archived in normal / starred view
      if (conv.archived) return false
    }

    if (filterMode === "starred" && !conv.starred) {
      return false
    }

    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      conv.otherParticipant?.name.toLowerCase().includes(query) ||
      conv.lastMessage?.text.toLowerCase().includes(query)
    )
  })

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [currentUser, guestUser])

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

  const truncateMessage = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }


  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted animate-pulse">
                  <div className="h-10 w-10 bg-muted-foreground/20 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (errorMessage) {
    return (
      <Card className="h-full">
        <CardContent className="py-16 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Conversations</h3>
          <p className="text-muted-foreground mb-4">{errorMessage}</p>
          <Button onClick={loadConversations} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full">
      <div className="p-2">
        {(!canAccess && !isDashboard) ? (
          <div className="py-16 text-center px-4">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No conversations yet</p>
            <p className="text-xs text-muted-foreground mt-2">
              Start chatting from product pages
            </p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No conversations yet</p>
            <p className="text-xs text-muted-foreground mt-2">
              Start a conversation by messaging a creator
            </p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-muted-foreground">No conversations found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                >
                  <div
                    className={`
                      w-full px-3 py-3 cursor-pointer rounded-lg transition-colors
                      ${selectedConversationId === conversation.id 
                        ? 'bg-muted border-l-2 border-primary' 
                        : 'hover:bg-muted/50 border-l-2 border-transparent'
                      }
                    `}
                    onClick={() => onConversationSelect(conversation.id, conversation.otherParticipant)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-12 w-12 border-2 border-background">
                          <AvatarImage src={conversation.otherParticipant?.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {conversation.otherParticipant?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.unreadCount && conversation.unreadCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold"
                          >
                            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`font-semibold truncate ${
                            selectedConversationId === conversation.id ? 'text-primary' : ''
                          }`}>
                            {conversation.otherParticipant?.name}
                          </p>
                          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                            {formatTime(conversation.updatedAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className={`text-sm truncate flex-1 ${
                            conversation.unreadCount && conversation.unreadCount > 0
                              ? 'font-semibold text-foreground'
                              : 'text-muted-foreground'
                          }`}>
                            {conversation.lastMessage ? 
                              truncateMessage(conversation.lastMessage.text, 35) : 
                              "No messages yet"
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
