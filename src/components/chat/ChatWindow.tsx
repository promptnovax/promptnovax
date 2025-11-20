import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { useGuestChat } from "@/context/GuestChatContext"
import { useToast } from "@/hooks/use-toast"
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
  where
} from "firebase/firestore"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { 
  Send,
  Loader2,
  AlertCircle,
  MessageCircle,
  User,
  Paperclip,
  Smile,
  MoreVertical,
  Check,
  CheckCheck,
  ImageIcon,
  FileText,
  Clock,
  Phone,
  Video,
  Info,
  Star,
  Verified,
  Copy,
  Trash2
} from "lucide-react"

interface Message {
  id: string
  senderId: string
  text: string
  createdAt: any
  read: boolean
  senderName?: string
  senderAvatar?: string
}

interface ChatWindowProps {
  conversationId: string
  otherParticipant?: {
    uid: string
    name: string
    avatar?: string
  }
}

export function ChatWindow({ conversationId, otherParticipant }: ChatWindowProps) {
  const { currentUser } = useAuth()
  const { guestUser, isGuest } = useGuestChat()
  const { success, error } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)
  const [showProfileCard, setShowProfileCard] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Determine current user (logged in or guest)
  const currentUserId = currentUser?.uid || guestUser?.id || "guest"
  const currentUserName = currentUser?.displayName || currentUser?.email?.split('@')[0] || guestUser?.name || "Guest User"
  const currentUserAvatar = currentUser?.photoURL || guestUser?.avatar || ""
  
  const canSendMessages = !!currentUser || !!guestUser

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load messages
  const loadMessages = async () => {
    if (!currentUser || !conversationId) {
      setLoading(false)
      return
    }

    if (!isFirebaseConfigured || !firebaseDb) {
      // Demo mode - show mock data
      loadMockMessages()
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)

      const messagesRef = collection(firebaseDb, 'conversations', conversationId, 'messages')
      const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'))

      const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
        const messageList: Message[] = []

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

          messageList.push({
            id: doc.id,
            senderId: data.senderId,
            text: data.text,
            createdAt: data.createdAt,
            read: data.read,
            senderName,
            senderAvatar
          })
        }

        setMessages(messageList)
        setLoading(false)
      })

      return unsubscribe
    } catch (err: any) {
      console.error('Error loading messages:', err)
      setErrorMessage(err.message || "Failed to load messages")
      error("Loading failed", "Failed to load messages")
      setLoading(false)
    }
  }

  // Load mock data for demo mode
  const loadMockMessages = () => {
    const mockMessages: Message[] = [
      {
        id: "msg1",
        senderId: otherParticipant?.uid || "user2",
        text: "Hi! Thanks for your interest in my prompt. How can I help you?",
        createdAt: new Date(Date.now() - 3600000),
        read: true,
        senderName: otherParticipant?.name || "CodeMaster Pro",
        senderAvatar: otherParticipant?.avatar
      },
      {
        id: "msg2",
        senderId: currentUser?.uid || "user1",
        text: "I really like your code review prompt! Do you have any similar ones for testing?",
        createdAt: new Date(Date.now() - 3000000),
        read: true,
        senderName: currentUser?.email?.split('@')[0] || "You",
        senderAvatar: currentUser?.photoURL
      },
      {
        id: "msg3",
        senderId: otherParticipant?.uid || "user2",
        text: "Yes! I have a testing prompt that covers unit tests, integration tests, and test automation. Would you like me to share it?",
        createdAt: new Date(Date.now() - 2400000),
        read: true,
        senderName: otherParticipant?.name || "CodeMaster Pro",
        senderAvatar: otherParticipant?.avatar
      },
      {
        id: "msg4",
        senderId: currentUser?.uid || "user1",
        text: "That would be amazing! I'm working on a new project and could really use some good testing strategies.",
        createdAt: new Date(Date.now() - 1800000),
        read: true,
        senderName: currentUser?.email?.split('@')[0] || "You",
        senderAvatar: currentUser?.photoURL
      }
    ]
    
    setMessages(mockMessages)
    setLoading(false)
  }

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !canSendMessages || !conversationId) return

    if (!isFirebaseConfigured || !firebaseDb) {
      // Demo mode - just add to local state
      const demoMessage: Message = {
        id: `demo-${Date.now()}`,
        senderId: currentUserId,
        text: newMessage,
        createdAt: new Date(),
        read: false,
        senderName: currentUserName,
        senderAvatar: currentUserAvatar
      }
      setMessages(prev => [...prev, demoMessage])
      setNewMessage("")
      
      // Simulate typing indicator
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        // Simulate response for demo
        if (otherParticipant) {
          const response: Message = {
            id: `demo-response-${Date.now()}`,
            senderId: otherParticipant.uid,
            text: "Thanks for your message! I'll get back to you shortly.",
            createdAt: new Date(),
            read: false,
            senderName: otherParticipant.name,
            senderAvatar: otherParticipant.avatar
          }
          setMessages(prev => [...prev, response])
        }
      }, 2000)
      return
    }

    setSending(true)
    
    try {
      // Add message to subcollection
      const messagesRef = collection(firebaseDb, 'conversations', conversationId, 'messages')
      await addDoc(messagesRef, {
        senderId: currentUserId,
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
        read: false
      })

      // Update conversation's lastMessage and updatedAt
      const conversationRef = doc(firebaseDb, 'conversations', conversationId)
      await updateDoc(conversationRef, {
        lastMessage: {
          text: newMessage.trim(),
          senderId: currentUserId,
          createdAt: serverTimestamp()
        },
        updatedAt: serverTimestamp()
      })

      setNewMessage("")
      success("Message sent", "Your message has been sent")
    } catch (err: any) {
      console.error('Error sending message:', err)
      error("Send failed", err.message || "Failed to send message")
    } finally {
      setSending(false)
    }
  }

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Load messages on mount
  useEffect(() => {
    if (canSendMessages) {
      const unsubscribe = loadMessages()
      return () => {
        if (unsubscribe) {
          unsubscribe()
        }
      }
    } else {
      setLoading(false)
    }
  }, [conversationId, currentUser, guestUser])

  const formatTime = (date: any) => {
    if (!date) return ""
    const d = date.toDate ? date.toDate() : new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    
    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const formatMessageTime = (date: any) => {
    if (!date) return ""
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
    success("Copied", "Message copied to clipboard")
  }

  if (!canSendMessages) {
    return (
      <Card className="h-full">
        <CardContent className="py-16 text-center space-y-4">
          <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Start Messaging</h3>
            <p className="text-muted-foreground mb-6">
              Enter your name to start chatting with {otherParticipant?.name || "the creator"}
            </p>
            <Button onClick={() => {
              const name = prompt("Enter your name:")
              if (name && name.trim()) {
                // This will be handled by parent component
                window.location.hash = `#chat/guest/${otherParticipant?.uid || "guest"}`
              }
            }}>
              Start Chatting
            </Button>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">Or log in for a better experience</p>
            <Button variant="outline" asChild>
              <a href="#login">Log In</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border-b">
              <Avatar className="h-8 w-8">
                <AvatarImage src={otherParticipant?.avatar} />
                <AvatarFallback>
                  {otherParticipant?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{otherParticipant?.name || "Unknown User"}</p>
                <p className="text-sm text-muted-foreground">Loading messages...</p>
              </div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-3 animate-pulse">
                  <div className="h-8 w-8 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-12 bg-muted rounded w-3/4"></div>
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
          <h3 className="text-lg font-semibold mb-2">Error Loading Messages</h3>
          <p className="text-muted-foreground mb-4">{errorMessage}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Professional Chat Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <Avatar 
                className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                onClick={() => setShowProfileCard(!showProfileCard)}
              >
                <AvatarImage src={otherParticipant?.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {otherParticipant?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold truncate">{otherParticipant?.name || "Unknown User"}</p>
                <Badge variant="secondary" className="text-xs">
                  <Verified className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Active now</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/20">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((message, index) => {
                const isOwn = message.senderId === currentUserId
                const showAvatar = index === 0 || messages[index - 1]?.senderId !== message.senderId
                
                const getMessageDate = (date: any) => {
                  return date?.toDate ? date.toDate() : new Date(date)
                }
                
                const showTime = index === messages.length - 1 || 
                  (messages[index + 1]?.createdAt && 
                   getMessageDate(messages[index + 1]?.createdAt).getTime() - getMessageDate(message.createdAt).getTime() > 300000)
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2 group ${isOwn ? 'flex-row-reverse' : ''} ${
                      showAvatar ? 'mt-4' : 'mt-1'
                    }`}
                  >
                    {showAvatar && !isOwn && (
                      <Avatar className="h-8 w-8 flex-shrink-0 border-2 border-background">
                        <AvatarImage src={message.senderAvatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {message.senderName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {!showAvatar && !isOwn && <div className="w-8"></div>}
                    
                    <div className={`flex flex-col gap-1 max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                      {showAvatar && (
                        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                          <p className="text-xs font-semibold text-muted-foreground">
                            {isOwn ? "You" : message.senderName}
                          </p>
                        </div>
                      )}
                      <div className="relative group/message">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`relative px-4 py-2.5 rounded-2xl shadow-sm transition-all ${
                            isOwn
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-card border border-border rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                          
                          {/* Message Actions */}
                          <div className={`absolute top-0 ${isOwn ? '-left-12' : '-right-12'} flex items-center gap-1 opacity-0 group-hover/message:opacity-100 transition-opacity`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => copyMessage(message.text)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            {isOwn && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </motion.div>
                        
                        {/* Message Status & Time */}
                        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                          {isOwn && (
                            <span className="text-xs">
                              {message.read ? (
                                <CheckCheck className="h-3 w-3 text-blue-500" />
                              ) : (
                                <Check className="h-3 w-3 text-muted-foreground" />
                              )}
                            </span>
                          )}
                          {showTime && (
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(message.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 items-end"
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={otherParticipant?.avatar} />
                  <AvatarFallback>
                    {otherParticipant?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Professional Message Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-end gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setShowAttachments(!showAttachments)}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${otherParticipant?.name || "..."}...`}
              disabled={sending}
              className="pr-12 rounded-full border-2 focus:border-primary/50"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || sending}
            size="icon"
            className="h-9 w-9 rounded-full"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Quick Replies */}
        {!newMessage && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs rounded-full"
              onClick={() => setNewMessage("Hi! I'm interested in your prompt.")}
            >
              Hi! I'm interested
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs rounded-full"
              onClick={() => setNewMessage("Can you tell me more about this?")}
            >
              Tell me more
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs rounded-full"
              onClick={() => setNewMessage("What's included in this prompt?")}
            >
              What's included?
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
