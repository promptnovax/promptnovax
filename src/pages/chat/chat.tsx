import { FormEvent, useState, useMemo, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Loader2,
  Plus,
  Settings,
  MessageSquare,
  Trash2,
  MoreVertical,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  Menu,
  X,
  Sparkles,
  Store,
  FileText,
  Wand2,
  ShoppingCart,
  Paperclip,
  Image as ImageIcon,
  Mic,
  Smile,
  Bell,
  Search,
  Edit,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { requestFreeChatResponse, type FreeChatMessage } from "@/lib/freeChatService"
import { ChatSettingsModal } from "@/components/chat/ChatSettingsModal"
import { NovaProfilePanel } from "@/components/chat/NovaProfilePanel"
import { ChatSearchModal } from "@/components/chat/ChatSearchModal"
import { NotificationsPanel } from "@/components/chat/NotificationsPanel"
import { requestPromptGeneration } from "@/lib/promptGeneratorService"

type ConversationMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: number
  status?: "complete" | "streaming"
}

type Conversation = {
  id: string
  title: string
  messages: ConversationMessage[]
  updatedAt: number
}

interface ChatSettings {
  model: string
  temperature: number
  maxTokens: number
  fontSize: "small" | "medium" | "large"
  theme: "dark" | "light" | "auto"
  soundEnabled: boolean
  markdownEnabled: boolean
  compactMode: boolean
  autoSave: boolean
}

const DEFAULT_SETTINGS: ChatSettings = {
  model: "free-hf",
  temperature: 0.7,
  maxTokens: 512,
  fontSize: "medium",
  theme: "dark",
  soundEnabled: false,
  markdownEnabled: true,
  compactMode: false,
  autoSave: true
}

const INITIAL_MESSAGES: ConversationMessage[] = [
  {
    id: "assistant-welcome",
    role: "assistant",
    content: "Hello! I'm NOVA, your AI assistant. How can I help you today?",
    createdAt: Date.now() - 1000
  }
]

export function ChatPage() {
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "default",
      title: "New Conversation",
      messages: INITIAL_MESSAGES,
      updatedAt: Date.now()
    }
  ])
  const [activeConversationId, setActiveConversationId] = useState<string>("default")
  const [messageInput, setMessageInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [novaProfileOpen, setNovaProfileOpen] = useState(false)
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editMessageContent, setEditMessageContent] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  
  // Load settings from localStorage
  const loadSettings = (): ChatSettings => {
    try {
      const stored = localStorage.getItem("pnx_chat_settings")
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
      }
    } catch (e) {
      console.error("Error loading chat settings:", e)
    }
    return DEFAULT_SETTINGS
  }

  const [chatSettings, setChatSettings] = useState<ChatSettings>(loadSettings)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) || conversations[0],
    [conversations, activeConversationId]
  )

  const messages = activeConversation?.messages || []

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`
    }
  }, [messageInput])

  // Focus input when conversation changes
  useEffect(() => {
    inputRef.current?.focus()
  }, [activeConversationId])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K for search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      // Escape to close modals
      if (e.key === "Escape") {
        setSearchOpen(false)
        setNotificationsOpen(false)
        setNovaProfileOpen(false)
        setSettingsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Auto-save conversations if enabled
  useEffect(() => {
    if (chatSettings.autoSave && conversations.length > 0) {
      try {
        localStorage.setItem("pnx_chat_conversations", JSON.stringify(conversations))
      } catch (e) {
        console.error("Error auto-saving conversations:", e)
      }
    }
  }, [conversations, chatSettings.autoSave])

  // Load saved conversations on mount
  useEffect(() => {
    if (chatSettings.autoSave) {
      try {
        const saved = localStorage.getItem("pnx_chat_conversations")
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setConversations(parsed)
            setActiveConversationId(parsed[0].id)
          }
        }
      } catch (e) {
        console.error("Error loading saved conversations:", e)
      }
    }
  }, [])

  const handleSendMessage = async (e?: FormEvent) => {
    e?.preventDefault()
    const trimmed = messageInput.trim()
    if ((!trimmed && attachedFiles.length === 0) || isSending) return

    // Build message content with file info
    let content = trimmed
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map((f) => f.name).join(", ")
      content = content
        ? `${content}\n\n[Attached: ${fileNames}]`
        : `[Attached: ${fileNames}]`
    }

    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content,
      createdAt: Date.now(),
      status: "complete"
    }

    // Update conversation with user message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              updatedAt: Date.now(),
              title: conv.id === "default" && conv.messages.length === 1 ? trimmed.slice(0, 50) : conv.title
            }
          : conv
      )
    )

    const messageToSend = trimmed
    setMessageInput("")
    setAttachedFiles([]) // Clear attached files after sending
    setIsSending(true)

    // Add placeholder for assistant response
    const placeholderId = `assistant-${Date.now()}`
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: placeholderId,
                  role: "assistant",
                  content: "",
                  createdAt: Date.now(),
                  status: "streaming"
                }
              ]
            }
          : conv
      )
    )

    try {
      const allMessages = [...messages, userMessage]
      const payloadMessages: FreeChatMessage[] = allMessages.map((msg) => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await requestFreeChatResponse({
        messages: payloadMessages,
        systemPrompt: "You are NOVA, a helpful AI assistant. Be concise, clear, and professional.",
        temperature: chatSettings.temperature,
        maxTokens: chatSettings.maxTokens
      })

      // Update with actual response
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.id === placeholderId
                    ? {
                        ...msg,
                        content: response.message,
                        status: "complete"
                      }
                    : msg
                ),
                updatedAt: Date.now()
              }
            : conv
        )
      )

      // Play sound if enabled
      if (chatSettings.soundEnabled && typeof window !== "undefined") {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          oscillator.frequency.value = 800
          oscillator.type = "sine"
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.1)
        } catch (e) {
          console.error("Error playing sound:", e)
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to get response. Please try again.",
        variant: "destructive"
      })
      // Remove placeholder on error
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: conv.messages.filter((msg) => msg.id !== placeholderId)
              }
            : conv
        )
      )
    } finally {
      setIsSending(false)
    }
  }

  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`
    const newConversation: Conversation = {
      id: newId,
      title: "New Conversation",
      messages: INITIAL_MESSAGES,
      updatedAt: Date.now()
    }
    setConversations((prev) => [newConversation, ...prev])
    setActiveConversationId(newId)
    setMessageInput("")
  }

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (conversations.length === 1) {
      toast({
        title: "Cannot delete",
        description: "You must have at least one conversation.",
        variant: "destructive"
      })
      return
    }
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (activeConversationId === id) {
      const remaining = conversations.filter((conv) => conv.id !== id)
      setActiveConversationId(remaining[0]?.id || "default")
    }
  }

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
      toast({
        title: "Copied!",
        description: "Message copied to clipboard"
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      })
    }
  }

  const handleEnhancePrompt = async () => {
    const trimmed = messageInput.trim()
    if (!trimmed || isEnhancingPrompt) return

    setIsEnhancingPrompt(true)
    try {
      const response = await requestPromptGeneration({
        userInput: trimmed,
        promptType: "general",
        aiPlatform: "chatgpt",
        outputFormat: "structured",
        language: "en",
        mode: "enhance"
      })

      if (response.success && response.prompt) {
        setMessageInput(response.prompt)
        toast({
          title: "Prompt Enhanced!",
          description: "Your message has been optimized for better AI understanding."
        })
      } else {
        toast({
          title: "Enhancement failed",
          description: "Could not enhance prompt. Using original message.",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to enhance prompt.",
        variant: "destructive"
      })
    } finally {
      setIsEnhancingPrompt(false)
    }
  }

  const renderMessageContent = (content: string) => {
    if (!chatSettings.markdownEnabled) {
      return <div className="whitespace-pre-wrap">{content}</div>
    }

    // Basic markdown support
    let processed = content
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, '<code class="bg-black/40 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/\n/g, "<br />")

    return <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: processed }} />
  }

  const userInitials = useMemo(() => {
    if (typeof window === "undefined") return "U"
    const handle = window.localStorage.getItem("pnx:user-handle") || "User"
    return handle
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  }, [])

  return (
    <div className="flex h-screen bg-[#05070e] text-white overflow-hidden">
      {/* Left Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-64 bg-[#0a0d14] border-r border-white/10 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/10">
              <Button
                onClick={handleNewConversation}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-1">
                {conversations.map((conv) => (
                  <motion.div
                    key={conv.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => setActiveConversationId(conv.id)}
                      className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        activeConversationId === conv.id
                          ? "bg-primary/20 text-white border border-primary/30"
                          : "hover:bg-white/5 text-white/70 hover:text-white"
                      }`}
                    >
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left truncate">{conv.title}</span>
                      <button
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-white/50 hover:text-red-400" />
                      </button>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-white/10 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-white/70 hover:text-white"
                onClick={() => {
                  window.location.hash = "#marketplace"
                  setSidebarOpen(false)
                }}
              >
                <Store className="h-4 w-4 mr-2" />
                Marketplace
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white/70 hover:text-white"
                onClick={() => {
                  window.location.hash = "#templates"
                  setSidebarOpen(false)
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white/70 hover:text-white"
                onClick={() => {
                  window.location.hash = "#prompt-generator"
                  setSidebarOpen(false)
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Prompt Generator
              </Button>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-white/10">
              <Button
                variant="ghost"
                className="w-full justify-start text-white/70 hover:text-white"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-14 bg-[#0a0d14] border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <button
              onClick={() => setNovaProfileOpen(true)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/70 to-primary/40 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">NOVA AI</p>
                <p className="text-xs text-white/50">AI Assistant</p>
              </div>
            </button>
          </div>
          
          {/* Top Right Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              onClick={() => setSearchOpen(true)}
              title="Search conversations (Ctrl+K)"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all relative"
              onClick={() => setNotificationsOpen(true)}
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full animate-pulse" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              onClick={() => setSettingsOpen(true)}
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area - Scrollable */}
        <div
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto px-4 py-6 ${
            chatSettings.compactMode ? "space-y-3 py-4" : "space-y-6"
          }`}
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                onMouseEnter={() => setHoveredMessageId(message.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback
                      className={
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/10 text-white"
                      }
                    >
                      {message.role === "user" ? (
                        userInitials
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  {/* Message Content */}
                  <div className="flex flex-col gap-1">
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/5 text-white/90 border border-white/10"
                      } ${
                        chatSettings.compactMode ? "px-3 py-2" : ""
                      }`}
                    >
                      {message.status === "streaming" ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      ) : (
                        <div
                          className={`leading-relaxed ${
                            chatSettings.fontSize === "small"
                              ? "text-xs"
                              : chatSettings.fontSize === "large"
                              ? "text-base"
                              : "text-sm"
                          }`}
                        >
                          {renderMessageContent(message.content)}
                        </div>
                      )}
                    </div>
                    {hoveredMessageId === message.id && message.status !== "streaming" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`flex gap-1 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role === "user" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-white/50 hover:text-white hover:bg-white/10"
                            onClick={() => {
                              setEditingMessageId(message.id)
                              setEditMessageContent(message.content)
                            }}
                            title="Edit message"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-white/50 hover:text-white hover:bg-white/10"
                          onClick={() => handleCopyMessage(message.content, message.id)}
                          title="Copy message"
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </motion.div>
                    )}
                    
                    {/* Edit Message Input */}
                    {editingMessageId === message.id && message.role === "user" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <textarea
                          value={editMessageContent}
                          onChange={(e) => setEditMessageContent(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setConversations((prev) =>
                                prev.map((conv) =>
                                  conv.id === activeConversationId
                                    ? {
                                        ...conv,
                                        messages: conv.messages.map((msg) =>
                                          msg.id === message.id
                                            ? { ...msg, content: editMessageContent }
                                            : msg
                                        )
                                      }
                                    : conv
                                )
                              )
                              setEditingMessageId(null)
                              setEditMessageContent("")
                              toast({
                                title: "Message updated",
                                description: "Your message has been edited."
                              })
                            }}
                            className="h-7 px-3"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingMessageId(null)
                              setEditMessageContent("")
                            }}
                            className="h-7 px-3"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Professional Chat Input Bar */}
        <div className="border-t border-white/10 bg-gradient-to-b from-[#0a0d14] to-[#05070e] backdrop-blur-sm">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto p-4">
            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 flex flex-wrap gap-2"
              >
                {attachedFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-xs text-white/90 truncate max-w-[150px] font-medium">
                      {file.name}
                    </span>
                    <span className="text-xs text-white/50">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-white/50 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => {
                        setAttachedFiles(attachedFiles.filter((_, i) => i !== index))
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Main Input Container */}
            <div className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-2 shadow-lg shadow-black/20">
              <div className="flex items-end gap-2">
                {/* Left Action Buttons */}
                <div className="flex items-center gap-1 px-1">
                  {/* File Attachment */}
                  <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      setAttachedFiles([...attachedFiles, ...files])
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    onClick={() => document.getElementById("file-input")?.click()}
                    title="Attach file"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>

                  {/* Image Upload */}
                  <input
                    type="file"
                    id="image-input"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      setAttachedFiles([...attachedFiles, ...files])
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    onClick={() => document.getElementById("image-input")?.click()}
                    title="Attach image"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>

                  {/* Emoji Picker */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Add emoji"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>

                {/* Text Input Area */}
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Type your message to NOVA..."
                    rows={1}
                    className="w-full bg-transparent border-none rounded-lg px-4 py-3 pr-20 text-sm text-white placeholder:text-white/40 resize-none focus:outline-none"
                    style={{ maxHeight: "200px", minHeight: "48px" }}
                    disabled={isSending}
                  />
                  
                  {/* Prompt Enhancement Button (inside input) */}
                  {messageInput.trim() && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleEnhancePrompt}
                      disabled={isEnhancingPrompt || isSending}
                      className="absolute right-12 top-1/2 -translate-y-1/2 h-7 w-7 text-white/50 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      title="Enhance prompt"
                    >
                      {isEnhancingPrompt ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1 px-1">
                  {/* Voice Input */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 rounded-lg transition-all ${
                      isRecording
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    onClick={() => {
                      setIsRecording(!isRecording)
                      toast({
                        title: isRecording ? "Recording stopped" : "Recording started",
                        description: isRecording
                          ? "Voice input stopped"
                          : "Voice input is ready (Feature coming soon)"
                      })
                    }}
                    title="Voice input"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>

                  {/* Send Button */}
                  <Button
                    type="submit"
                    disabled={(!messageInput.trim() && attachedFiles.length === 0) || isSending}
                    size="icon"
                    className="h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 text-white flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 transition-all hover:scale-105"
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Emoji Picker Dropdown */}
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-0 mb-2 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 max-h-48 overflow-y-auto shadow-2xl"
                >
                <div className="grid grid-cols-8 gap-2">
                  {["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕"].map(
                    (emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setMessageInput(messageInput + emoji)
                          setShowEmojiPicker(false)
                        }}
                        className="text-2xl hover:scale-125 transition-transform p-1"
                      >
                        {emoji}
                      </button>
                    )
                  )}
                </div>
              </motion.div>
            )}

              {/* Helper Text */}
              <div className="flex items-center justify-between mt-2 px-2">
                <div className="flex items-center gap-3 text-xs text-white/50">
                  {attachedFiles.length > 0 && (
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5">
                      <Paperclip className="h-3 w-3" />
                      {attachedFiles.length} file{attachedFiles.length > 1 ? "s" : ""}
                    </span>
                  )}
                  {messageInput.trim() && (
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary">
                      <Wand2 className="h-3 w-3" />
                      Enhance available
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">Enter</kbd>
                  <span>to send</span>
                  <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">Shift + Enter</kbd>
                  <span>for new line</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Chat Settings Modal */}
      <ChatSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={chatSettings}
        onSettingsChange={setChatSettings}
      />

      {/* NOVA Profile Panel */}
      <NovaProfilePanel
        open={novaProfileOpen}
        onClose={() => setNovaProfileOpen(false)}
        onSettingsClick={() => {
          setNovaProfileOpen(false)
          setSettingsOpen(true)
        }}
      />

      {/* Search Modal */}
      <ChatSearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        conversations={conversations.map((c) => ({
          id: c.id,
          title: c.title,
          updatedAt: c.updatedAt
        }))}
        onSelectConversation={setActiveConversationId}
      />

      {/* Notifications Panel */}
      <NotificationsPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  )
}
