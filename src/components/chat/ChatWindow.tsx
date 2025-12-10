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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

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
  Info,
  Star,
  Verified,
  Copy,
  Trash2,
  X
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
  isDashboard?: boolean // If true, skip login prompts
}

export function ChatWindow({ conversationId, otherParticipant, isDashboard = false }: ChatWindowProps) {
  const { currentUser } = useAuth()
  // GuestChatProvider wraps messages pages, so this is safe
  const { guestUser, isGuest } = useGuestChat()
  const { success, error } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showProfileCard, setShowProfileCard] = useState(false)
  const [showDetailsPanel, setShowDetailsPanel] = useState(false)
  const [isStarred, setIsStarred] = useState(false)
  const [isArchived, setIsArchived] = useState(false)
  const [selectedMediaName, setSelectedMediaName] = useState<string | null>(null)
  const [selectedDocumentName, setSelectedDocumentName] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)

  const METADATA_STORAGE_KEY = "promptnx-chat-metadata"
  
  // Determine current user (logged in or guest)
  const currentUserId = currentUser?.uid || guestUser?.id || "guest"
  const currentUserName = currentUser?.displayName || currentUser?.email?.split('@')[0] || guestUser?.name || "Guest User"
  const currentUserAvatar = currentUser?.photoURL || guestUser?.avatar || ""
  
  // In dashboard context, assume user is logged in
  const canSendMessages = isDashboard ? !!currentUser : (!!currentUser || !!guestUser)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load messages
  const loadMessages = () => {
    if (!conversationId) {
      setLoading(false)
      return
    }
    loadMockMessages()
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

    setSending(true)

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
    success("Message sent", "Your message has been sent")
    setSending(false)
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
      loadMessages()
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

  // Conversation metadata helpers (starred / archived)
  const loadConversationMeta = () => {
    if (typeof window === "undefined" || !conversationId) return
    try {
      const raw = window.localStorage.getItem(METADATA_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as Record<string, { starred?: boolean; archived?: boolean }>
      const meta = parsed[conversationId]
      if (meta) {
        setIsStarred(Boolean(meta.starred))
        setIsArchived(Boolean(meta.archived))
      } else {
        setIsStarred(false)
        setIsArchived(false)
      }
    } catch {
      // ignore
    }
  }

  const updateConversationMeta = (patch: { starred?: boolean; archived?: boolean }) => {
    if (typeof window === "undefined" || !conversationId) return
    try {
      const raw = window.localStorage.getItem(METADATA_STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as Record<string, { starred?: boolean; archived?: boolean }>) : {}
      const existing = parsed[conversationId] || {}
      const next = { ...existing, ...patch }
      parsed[conversationId] = next
      window.localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(parsed))
    } catch {
      // ignore
    }
  }

  const handleToggleStar = () => {
    const next = !isStarred
    setIsStarred(next)
    updateConversationMeta({ starred: next })
    success(next ? "Chat starred" : "Star removed", next ? "This chat is now in Starred." : "Removed from Starred.")
  }

  const handleArchiveChat = () => {
    if (isArchived) return
    setIsArchived(true)
    updateConversationMeta({ archived: true })
    success("Chat archived", "You can find this chat in Archived.")
  }

  const handleClearHistory = () => {
    setMessages([])
    success("Chat cleared", "Message history has been cleared for this session.")
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const handleOpenMediaPicker = () => {
    mediaInputRef.current?.click()
  }

  const handleOpenDocumentPicker = () => {
    docInputRef.current?.click()
  }

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedMediaName(file.name)
      success("Media selected", file.name)
    }
  }

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedDocumentName(file.name)
      success("Attachment selected", file.name)
    }
  }

  const handleOpenProfile = () => {
    if (otherParticipant?.uid) {
      window.location.hash = `#user/${otherParticipant.uid}`
    }
  }

  // Load conversation metadata when conversation changes
  useEffect(() => {
    loadConversationMeta()
  }, [conversationId])

  // Only show login prompt if not in dashboard context
  if (!canSendMessages && !isDashboard) {
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
    <Card className="h-full flex flex-col overflow-hidden relative">
      {/* Professional Chat Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              type="button"
              className="flex items-center gap-3 flex-1 text-left focus:outline-none"
              onClick={handleOpenProfile}
            >
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
                  <span>Tap name to view profile</span>
                </div>
              </div>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setShowDetailsPanel((prev) => !prev)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right-side details panel (WhatsApp-style) */}
      <AnimatePresence>
        {showDetailsPanel && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 right-0 h-full w-72 bg-background border-l shadow-xl z-20 flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Chat details</p>
                <p className="text-xs text-muted-foreground">
                  Manage this conversation&apos;s settings.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowDetailsPanel(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={otherParticipant?.avatar} />
                  <AvatarFallback>
                    {otherParticipant?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{otherParticipant?.name || "Unknown User"}</p>
                  <p className="text-xs text-muted-foreground">Tap header to view full profile</p>
                </div>
              </div>

              <div className="border rounded-lg p-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Preferences</p>
                <button className="w-full text-left text-sm py-1.5 rounded hover:bg-muted transition-colors">
                  Mute notifications
                </button>
                <button
                  className="w-full text-left text-sm py-1.5 rounded hover:bg-muted transition-colors"
                  onClick={handleToggleStar}
                >
                  {isStarred ? "Remove from starred" : "Star this chat"}
                </button>
              </div>

              <div className="border rounded-lg p-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Actions</p>
                <button
                  className="w-full text-left text-sm py-1.5 rounded hover:bg-muted transition-colors"
                  onClick={handleClearHistory}
                >
                  Clear chat history
                </button>
                <button
                  className="w-full text-left text-sm py-1.5 rounded hover:bg-muted transition-colors"
                  onClick={handleArchiveChat}
                >
                  Archive chat
                </button>
                <button className="w-full text-left text-sm py-1.5 rounded hover:bg-muted text-destructive transition-colors">
                  Block &amp; report
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto px-4 py-3 bg-gradient-to-b from-background to-muted/20 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground">
                Start the conversation by sending a message
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-auto space-y-4">
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
            </div>
          </>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Professional Message Input */}
      <div className="p-3 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur-sm">
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
            <DropdownMenu open={showAttachments} onOpenChange={setShowAttachments}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                <DropdownMenuLabel>Attach</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleOpenMediaPicker}>
                  <ImageIcon className="h-3 w-3 mr-2" />
                  Media (images / video)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleOpenDocumentPicker}>
                  <FileText className="h-3 w-3 mr-2" />
                  Document
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Clock className="h-3 w-3 mr-2" />
                  Location (coming soon)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <Star className="h-3 w-3 mr-2" />
                  Saved templates
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <DropdownMenu open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-transparent active:scale-100"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" className="w-56">
                  <DropdownMenuLabel>Quick emojis</DropdownMenuLabel>
                  <div className="grid grid-cols-6 gap-1 px-1 py-1 text-lg">
                    {["😀","😁","😂","🤣","😊","😍","😎","🤔","🙌","👍","🔥","💡"].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted"
                        onClick={() => handleEmojiSelect(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
        
        {/* Hidden inputs for media & documents */}
        <input
          ref={mediaInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleMediaChange}
        />
        <input
          ref={docInputRef}
          type="file"
          className="hidden"
          onChange={handleDocumentChange}
        />

        {/* Small chips to show selected attachments (demo only) */}
        {(selectedMediaName || selectedDocumentName) && (
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            {selectedMediaName && (
              <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                <ImageIcon className="h-3 w-3" />
                <span className="max-w-[160px] truncate">{selectedMediaName}</span>
              </div>
            )}
            {selectedDocumentName && (
              <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                <FileText className="h-3 w-3" />
                <span className="max-w-[160px] truncate">{selectedDocumentName}</span>
              </div>
            )}
          </div>
        )}

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
