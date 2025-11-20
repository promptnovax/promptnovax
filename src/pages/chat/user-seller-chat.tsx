import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useAuth } from "@/context/AuthContext"
import { useGuestChat } from "@/context/GuestChatContext"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Clock,
  User,
  Star,
  MessageCircle
} from "lucide-react"

interface UserSellerChatProps {
  sellerId: string
  isGuest?: boolean
}

export function UserSellerChatPage({ sellerId, isGuest = false }: UserSellerChatProps) {
  const { currentUser } = useAuth()
  const { guestUser, setGuestUser, isGuest: isGuestUser } = useGuestChat()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [guestName, setGuestName] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { success, error } = useToast()

  // Check if user needs to set up guest session
  const needsGuestSetup = (isGuest || isGuestUser) && !guestUser && !currentUser

  // Mock seller data - support multiple sellers
  const getSellerData = (id: string) => {
    const sellers: Record<string, any> = {
      "1": {
        id: "1",
        name: "CodeMaster Pro",
        avatar: "https://ui-avatars.com/api/?name=CodeMaster+Pro&background=5865F2&color=fff",
        verified: true,
        rating: 4.9,
        online: true,
        lastSeen: "2 minutes ago",
        bio: "Professional software engineer with 10+ years of experience"
      },
      "user1": {
        id: "user1",
        name: "CodeMaster Pro",
        avatar: "https://ui-avatars.com/api/?name=CodeMaster+Pro&background=5865F2&color=fff",
        verified: true,
        rating: 4.9,
        online: true,
        lastSeen: "2 minutes ago",
        bio: "Professional software engineer"
      },
      "user2": {
        id: "user2",
        name: "Writer's Block",
        avatar: "https://ui-avatars.com/api/?name=Writer+Block&background=10b981&color=fff",
        verified: true,
        rating: 4.8,
        online: false,
        lastSeen: "1 hour ago",
        bio: "Creative writing expert"
      },
      "user3": {
        id: "user3",
        name: "DesignMaster",
        avatar: "https://ui-avatars.com/api/?name=DesignMaster&background=ec4899&color=fff",
        verified: true,
        rating: 4.7,
        online: true,
        lastSeen: "5 minutes ago",
        bio: "UI/UX Design specialist"
      }
    }
    // If sellerId not found, create a generic seller
    return sellers[id] || {
      id: id,
      name: id.includes("user") ? `User ${id.replace("user", "")}` : "Creator",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(id)}&background=5865F2&color=fff`,
      verified: false,
      rating: 4.5,
      online: true,
      lastSeen: "now",
      bio: "Product creator"
    }
  }

  const seller = getSellerData(sellerId)

  // Mock chat history - support multiple sellers
  const getChatHistory = (sellerId: string) => {
    const seller = getSellerData(sellerId)
    const userId = currentUser?.uid || guestUser?.id || "user"
    const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || guestUser?.name || "You"
    const userAvatar = currentUser?.photoURL || guestUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=10b981&color=fff`
    
    const chatHistories: Record<string, any[]> = {
      "1": [
        {
          id: "1",
          senderId: seller.id,
          senderName: seller.name,
          senderAvatar: seller.avatar,
          message: "Hello! I saw you're interested in my Code Review Assistant prompt. How can I help you?",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: "read"
        },
        {
          id: "2",
          senderId: userId,
          senderName: userName,
          senderAvatar: userAvatar,
          message: "Hi! I'm working on a React project and need help with code quality. Your prompt looks perfect!",
          timestamp: new Date(Date.now() - 3300000).toISOString(),
          status: "read"
        },
        {
          id: "3",
          senderId: seller.id,
          senderName: seller.name,
          senderAvatar: seller.avatar,
          message: "Great! I'd be happy to help. What specific areas are you struggling with? Performance, security, or code structure?",
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          status: "read"
        },
        {
          id: "4",
          senderId: userId,
          senderName: userName,
          senderAvatar: userAvatar,
          message: "Mainly performance optimization and best practices. I have some components that are re-rendering too much.",
          timestamp: new Date(Date.now() - 2700000).toISOString(),
          status: "delivered"
        },
        {
          id: "5",
          senderId: seller.id,
          senderName: seller.name,
          senderAvatar: seller.avatar,
          message: "Perfect! I can definitely help with that. Would you like me to review your code and provide specific suggestions?",
          timestamp: new Date(Date.now() - 2400000).toISOString(),
          status: "read"
        }
      ]
    }
    
    // If no chat history, start with a welcome message
    return chatHistories[sellerId] || [{
      id: "welcome-1",
      senderId: seller.id,
      senderName: seller.name,
      senderAvatar: seller.avatar,
      message: `Hello! Thanks for reaching out. How can I help you today?`,
      timestamp: new Date().toISOString(),
      status: "read"
    }]
  }

  // Initialize guest session if needed
  useEffect(() => {
    if (needsGuestSetup && !showGuestModal) {
      setShowGuestModal(true)
    }
  }, [needsGuestSetup, showGuestModal])

  useEffect(() => {
    if (!needsGuestSetup) {
    setMessages(getChatHistory(sellerId))
    }
  }, [sellerId, needsGuestSetup])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleGuestSubmit = () => {
    if (!guestName.trim()) {
      error("Name Required", "Please enter your name to continue")
      return
    }
    
    setGuestUser({
      id: `guest-${Date.now()}`,
      name: guestName.trim(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(guestName.trim())}&background=5865F2&color=fff`
    })
    
    setShowGuestModal(false)
    success("Welcome!", `Hi ${guestName.trim()}, you can now start chatting!`)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    // Check if user is authorized
    if (needsGuestSetup) {
      setShowGuestModal(true)
      return
    }

    const currentUserName = currentUser?.displayName || currentUser?.email?.split('@')[0] || guestUser?.name || "You"
    const currentUserAvatar = currentUser?.photoURL || guestUser?.avatar || "https://github.com/shadcn.png"

    const message = {
      id: Date.now().toString(),
      senderId: currentUser?.uid || guestUser?.id || "user",
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: "sent"
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")
    success("Message sent", "Your message has been sent")
    
    // Simulate seller typing
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Simulate seller response
      const sellerResponse = {
        id: (Date.now() + 1).toString(),
        senderId: sellerId,
        senderName: seller.name,
        senderAvatar: seller.avatar,
        message: "Thanks for your message! I'll get back to you shortly with a detailed response.",
        timestamp: new Date().toISOString(),
        status: "read"
      }
      setMessages(prev => [...prev, sellerResponse])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleBackToInbox = () => {
    window.location.hash = '#inbox'
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
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

  // Guest Setup Modal
  if (showGuestModal) {
  return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Dialog open={showGuestModal} onOpenChange={setShowGuestModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                Start Chatting
              </DialogTitle>
              <DialogDescription>
                Enter your name to start a conversation with {seller.name || "the creator"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="guestName" className="text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleGuestSubmit()
                    }
                  }}
                  autoFocus
                  className="text-lg"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGuestModal(false)
                    window.location.hash = '#marketplace/index'
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGuestSubmit}
                  className="flex-1"
                  disabled={!guestName.trim()}
                >
                  Continue
            </Button>
                  </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground text-center mb-2">
                  Or log in for a better experience
                </p>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    window.location.hash = '#login'
                  }}
                >
                  Log In
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Loading state while setting up
  if (needsGuestSetup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Setting up chat...</p>
        </div>
      </div>
    )
  }

  const isOwnMessage = (senderId: string) => {
    const userId = currentUser?.uid || guestUser?.id || "user"
    return senderId === userId || senderId === "user"
  }

  return (
    <div className="flex flex-col h-screen bg-[#e5ddd5] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]">
      {/* WhatsApp Style Header */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3 shadow-lg z-10">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={handleBackToInbox}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="relative">
          <Avatar className="h-10 w-10 border-2 border-white/20">
            <AvatarImage src={seller.avatar} alt={seller.name} />
            <AvatarFallback className="bg-white/20 text-white font-semibold">
              {seller.name[0]}
            </AvatarFallback>
          </Avatar>
          {seller.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#075e54] rounded-full"></div>
          )}
            </div>

        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{seller.name}</h3>
            {seller.verified && (
              <Badge className="bg-white/20 text-white text-xs px-1.5 py-0 border-0">
                ✓
              </Badge>
            )}
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" />
              <span className="text-xs opacity-90">{seller.rating}</span>
            </div>
          </div>
          <p className="text-xs opacity-90 truncate">
            {seller.online ? 'online' : `last seen ${seller.lastSeen}`}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-10 w-10">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-10 w-10">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-10 w-10">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area - WhatsApp Style */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {messages.map((message, index) => {
          const ownMessage = isOwnMessage(message.senderId)
          const showAvatar = index === 0 || messages[index - 1]?.senderId !== message.senderId
          const showDate = index === messages.length - 1 || 
            new Date(messages[index + 1]?.timestamp).getTime() - new Date(message.timestamp).getTime() > 300000
          
          return (
              <motion.div
                key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-2 ${ownMessage ? 'justify-end' : 'justify-start'} ${
                showAvatar ? 'mt-4' : 'mt-0.5'
              }`}
            >
              {!ownMessage && showAvatar && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                  <AvatarFallback className="bg-white/80 text-gray-700 text-xs font-semibold">
                    {message.senderName?.[0] || 'U'}
                  </AvatarFallback>
                  </Avatar>
              )}
              {!ownMessage && !showAvatar && <div className="w-8"></div>}
              
              <div className={`flex flex-col gap-0.5 max-w-[75%] ${ownMessage ? 'items-end' : 'items-start'}`}>
                {showAvatar && !ownMessage && (
                  <span className="text-xs text-gray-600 px-1 mb-0.5">{message.senderName}</span>
                )}
                <div className="group relative">
                  <div className={`
                    px-3 py-1.5 rounded-lg shadow-sm
                    ${ownMessage 
                      ? 'bg-[#dcf8c6] text-gray-900 rounded-br-sm' 
                      : 'bg-white text-gray-900 rounded-bl-sm'
                    }
                  `}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {message.message}
                    </p>
                  </div>
                  
                  {/* Message Time & Status */}
                  <div className={`flex items-center gap-1 mt-0.5 ${ownMessage ? 'justify-end' : 'justify-start'}`}>
                    {showDate && (
                      <span className="text-[10px] text-gray-500 px-1">
                        {formatTime(message.timestamp)}
                      </span>
                    )}
                    {ownMessage && (
                      <span className="text-[10px]">
                        {getStatusIcon(message.status)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              </motion.div>
          )
        })}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
            initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 justify-start"
              >
            <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={seller.avatar} alt={seller.name} />
              <AvatarFallback className="bg-white/80 text-gray-700 text-xs">
                {seller.name[0]}
              </AvatarFallback>
                </Avatar>
            <div className="bg-white rounded-lg rounded-bl-sm px-4 py-2.5 shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
      </div>

      {/* WhatsApp Style Input */}
      <div className="bg-[#f0f2f5] px-4 py-3 border-t border-gray-300">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600 hover:bg-gray-200">
            <Paperclip className="h-5 w-5" />
              </Button>
              
              <div className="flex-1 relative">
            <input
              type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="w-full px-4 py-2.5 bg-white rounded-full border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm pr-12"
                />
                <Button
                  variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-600 hover:bg-gray-100 rounded-full"
                >
              <Smile className="h-5 w-5" />
                </Button>
              </div>
              
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim()}
            className="h-10 w-10 rounded-full bg-[#075e54] hover:bg-[#064e47] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            size="icon"
          >
            <Send className="h-5 w-5" />
              </Button>
            </div>
      </div>
    </div>
  )
}
