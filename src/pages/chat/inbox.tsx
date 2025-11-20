import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  Search,
  MessageCircle,
  Star,
  Clock,
  Check,
  CheckCheck,
  Filter,
  MoreVertical,
  User,
  ShoppingBag,
  Heart
} from "lucide-react"

export function InboxPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { success } = useToast()

  // Mock conversations data
  const conversations = [
    {
      id: "1",
      sellerId: "1",
      sellerName: "CodeMaster Pro",
      sellerAvatar: "https://github.com/shadcn.png",
      verified: true,
      rating: 4.9,
      lastMessage: "Perfect! I can definitely help with that. Would you like me to review your code and provide specific suggestions?",
      lastMessageTime: "2024-01-20T10:40:00Z",
      unreadCount: 0,
      status: "read",
      category: "development",
      isOnline: true,
      lastSeen: "2 minutes ago"
    },
    {
      id: "2",
      sellerId: "2",
      sellerName: "ContentCreator",
      sellerAvatar: "https://github.com/shadcn.png",
      verified: true,
      rating: 4.8,
      lastMessage: "I'll create a custom writing prompt for your blog. What's your target audience?",
      lastMessageTime: "2024-01-19T15:30:00Z",
      unreadCount: 2,
      status: "delivered",
      category: "writing",
      isOnline: false,
      lastSeen: "1 hour ago"
    },
    {
      id: "3",
      sellerId: "3",
      sellerName: "DataInsights Pro",
      sellerAvatar: "https://github.com/shadcn.png",
      verified: true,
      rating: 4.9,
      lastMessage: "The data analysis prompt is perfect for your use case. Would you like me to customize it further?",
      lastMessageTime: "2024-01-18T09:15:00Z",
      unreadCount: 0,
      status: "read",
      category: "analytics",
      isOnline: true,
      lastSeen: "5 minutes ago"
    },
    {
      id: "4",
      sellerId: "4",
      sellerName: "DesignMaster",
      sellerAvatar: "https://github.com/shadcn.png",
      verified: false,
      rating: 4.6,
      lastMessage: "Thanks for your interest in my design prompts! I can help you create better UI/UX designs.",
      lastMessageTime: "2024-01-17T14:20:00Z",
      unreadCount: 1,
      status: "delivered",
      category: "design",
      isOnline: false,
      lastSeen: "3 hours ago"
    },
    {
      id: "5",
      sellerId: "5",
      sellerName: "MarketingGuru",
      sellerAvatar: "https://github.com/shadcn.png",
      verified: true,
      rating: 4.7,
      lastMessage: "I'll help you create compelling marketing copy for your product launch.",
      lastMessageTime: "2024-01-16T11:45:00Z",
      unreadCount: 0,
      status: "read",
      category: "marketing",
      isOnline: true,
      lastSeen: "1 minute ago"
    }
  ]

  const handleChatClick = (sellerId: string) => {
    window.location.hash = `#chat/${sellerId}`
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && conv.unreadCount > 0
    if (activeTab === "verified") return matchesSearch && conv.verified
    if (activeTab === "online") return matchesSearch && conv.isOnline
    
    return matchesSearch
  })

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'development':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'writing':
        return <User className="h-4 w-4 text-green-500" />
      case 'analytics':
        return <ShoppingBag className="h-4 w-4 text-purple-500" />
      case 'design':
        return <Heart className="h-4 w-4 text-pink-500" />
      case 'marketing':
        return <Star className="h-4 w-4 text-yellow-500" />
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-background"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Messages</h1>
              <p className="text-muted-foreground">Connect with sellers and get support</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All ({conversations.length})</TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({conversations.filter(c => c.unreadCount > 0).length})
            </TabsTrigger>
            <TabsTrigger value="verified">
              Verified ({conversations.filter(c => c.verified).length})
            </TabsTrigger>
            <TabsTrigger value="online">
              Online ({conversations.filter(c => c.isOnline).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleChatClick(conversation.sellerId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conversation.sellerAvatar} alt={conversation.sellerName} />
                            <AvatarFallback>{conversation.sellerName[0]}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                            conversation.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate">{conversation.sellerName}</h3>
                              {conversation.verified && (
                                <Badge variant="secondary" className="text-xs">Verified</Badge>
                              )}
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{conversation.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(conversation.lastMessageTime)}
                              </span>
                              {getStatusIcon(conversation.status)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            {getCategoryIcon(conversation.category)}
                            <span className="text-xs text-muted-foreground capitalize">
                              {conversation.category}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {conversation.isOnline ? 'Online' : `Last seen ${conversation.lastSeen}`}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-primary text-primary-foreground">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? `No conversations match "${searchQuery}"`
                      : "Start a conversation with a seller to see messages here"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
