import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  Sparkles,
  Minimize2,
  Copy,
  Lightbulb,
  ShoppingCart,
  CheckCircle,
  Lock,
  Unlock,
  HelpCircle,
  DollarSign,
  Zap
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { requestFreeChatResponse } from "@/lib/freeChatService"
import { useAuth } from "@/context/AuthContext"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

interface MarketplacePromptAIChatProps {
  promptId: string
  promptTitle: string
  promptDescription: string
  promptCategory: string
  promptContent: string
  promptPrice: number
  promptTags: string[]
  isPurchased: boolean
  isMinimized?: boolean
  onToggleMinimize?: () => void
  onPurchaseClick?: () => void
}

export function MarketplacePromptAIChat({
  promptId,
  promptTitle,
  promptDescription,
  promptCategory,
  promptContent,
  promptPrice,
  promptTags,
  isPurchased,
  isMinimized = false,
  onToggleMinimize,
  onPurchaseClick
}: MarketplacePromptAIChatProps) {
  const { currentUser } = useAuth()
  const { success } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize welcome message based on purchase status
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: isPurchased
        ? `🎉 Welcome! You own "${promptTitle}". I'm your AI guide with complete access to this prompt's context.\n\nI can help you:\n• Use this prompt effectively\n• Troubleshoot any issues\n• Customize it for your needs\n• Answer questions about implementation\n• Provide best practices and tips\n\nWhat would you like to know?`
        : `👋 Hi! I'm your AI guide for "${promptTitle}". I can help you understand:\n\n• What this prompt can do\n• Problems it solves\n• Pricing and value\n• How to use it effectively\n• Whether it fits your needs\n\n💡 After purchase, I'll have full access to help you use it!\n\nWhat would you like to know?`,
      timestamp: Date.now()
    }
    setMessages([welcomeMessage])
  }, [promptId, promptTitle, isPurchased])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const buildSystemPrompt = () => {
    const baseContext = `You are an expert AI assistant helping users with a marketplace prompt: "${promptTitle}".

Prompt Details:
- Title: ${promptTitle}
- Description: ${promptDescription}
- Category: ${promptCategory}
- Price: $${promptPrice.toFixed(2)}
- Tags: ${promptTags.join(", ")}

${isPurchased 
  ? `USER HAS PURCHASED THIS PROMPT - FULL ACCESS MODE:
- You have COMPLETE ACCESS to the full prompt content
- Full Prompt Content: ${promptContent}
- Help the user use this prompt effectively
- Provide troubleshooting for any issues
- Guide them through customization
- Answer detailed questions about implementation
- Share best practices and advanced tips
- Help them get maximum value from their purchase`
  : `PRE-PURCHASE MODE - SALES ASSISTANCE:
- You can see the prompt description but NOT the full content
- Your goal is to help the user understand the value and decide if they should buy
- Explain what problems this prompt solves
- Describe what they can achieve with it
- Highlight key features and benefits
- Answer questions about pricing and value
- Help them understand if it fits their needs
- Be helpful but don't reveal the full prompt content
- Encourage purchase by showing value, not by being pushy`}

Your role:
1. Be friendly, helpful, and professional
2. Provide clear, actionable guidance
3. ${isPurchased ? "Help with usage, troubleshooting, and optimization" : "Help users understand value and make informed purchase decisions"}
4. Answer questions accurately based on available context
5. ${isPurchased ? "Provide detailed technical help" : "Focus on benefits and use cases"}

Be concise, helpful, and practical. Focus on real-world application.`

    return baseContext
  }

  const handleSend = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedInput,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    const assistantPlaceholder: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, assistantPlaceholder])

    try {
      const response = await requestFreeChatResponse({
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: trimmedInput }
        ],
        systemPrompt: buildSystemPrompt()
      })

      setMessages(prev => {
        const updated = [...prev]
        const lastIndex = updated.length - 1
        if (updated[lastIndex]?.role === "assistant") {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: response.message || "I apologize, but I couldn't generate a response. Please try again."
          }
        }
        return updated
      })
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev => {
        const updated = [...prev]
        const lastIndex = updated.length - 1
        if (updated[lastIndex]?.role === "assistant") {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: "Sorry, I encountered an error. Please try again or check your connection."
          }
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const prePurchaseQuestions = [
    "What problems does this solve?",
    "What can I achieve with this?",
    "How much does it cost?",
    "Is this right for me?"
  ]

  const postPurchaseQuestions = [
    "How do I use this prompt?",
    "Show me best practices",
    "Help me customize it",
    "Troubleshoot an issue"
  ]

  const quickQuestions = isPurchased ? postPurchaseQuestions : prePurchaseQuestions

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    setTimeout(() => handleSend(), 100)
  }

  const copyPrompt = () => {
    if (isPurchased) {
      navigator.clipboard.writeText(promptContent)
      success("Copied", "Full prompt copied to clipboard!")
    } else {
      success("Purchase Required", "Please purchase this prompt to access the full content.")
    }
  }

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={onToggleMinimize}
          className="rounded-full shadow-lg h-14 w-14 p-0"
          size="lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border border-border/50 shadow-xl bg-card/95 backdrop-blur-sm max-h-[calc(100vh-8rem)]">
        <CardHeader className="pb-4 border-b bg-gradient-to-r from-background to-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl shadow-sm ${isPurchased ? 'bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20' : 'bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20'}`}>
                {isPurchased ? (
                  <Unlock className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Lock className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  AI Guide
                  {isPurchased && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Full Access
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  {isPurchased ? "Complete prompt assistance" : "Pre-purchase guidance"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isPurchased && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-primary/10"
                  onClick={copyPrompt}
                  title="Copy full prompt"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
              {onToggleMinimize && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-primary/10"
                  onClick={onToggleMinimize}
                  title="Minimize"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {!isPurchased && (
          <div className="px-5 pt-4 pb-3 border-b bg-gradient-to-br from-primary/8 via-primary/5 to-transparent">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-primary">${promptPrice.toFixed(2)}</span>
                  <p className="text-[10px] text-muted-foreground">One-time purchase</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={onPurchaseClick}
                className="h-9 px-4 font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <ShoppingCart className="h-4 w-4 mr-1.5" />
                Buy Now
              </Button>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                Purchase to unlock full AI assistance with complete prompt access and usage support
              </p>
            </div>
          </div>
        )}

        <CardContent className="flex-1 flex flex-col p-0 bg-gradient-to-b from-background to-muted/20">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                        : "bg-muted/80 border border-border/50 backdrop-blur-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content || (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Thinking...
                        </span>
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted/80 rounded-2xl px-4 py-3 border border-border/50">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-5 pb-3 border-t bg-muted/30 pt-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 rounded-lg bg-primary/10">
                  <Lightbulb className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  {isPurchased ? "Quick help:" : "Ask me about:"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 px-3 hover:bg-primary/10 hover:border-primary/30 transition-all"
                    onClick={() => handleQuickQuestion(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-5 border-t bg-background/95 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isPurchased
                    ? "Ask about usage, troubleshooting, or customization..."
                    : "Ask about features, pricing, or use cases..."
                }
                disabled={isLoading}
                className="flex-1 h-10 border-border/50 focus:border-primary/50"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-10 w-10 shadow-sm hover:shadow-md transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            {!isPurchased && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <p className="text-xs text-muted-foreground">
                  After purchase, I'll have full context to help you use this prompt!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

