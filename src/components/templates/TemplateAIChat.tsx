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
  X,
  Minimize2,
  Maximize2,
  Copy,
  Lightbulb
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { requestFreeChatResponse } from "@/lib/freeChatService"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

interface TemplateAIChatProps {
  templateTitle: string
  templateDescription: string
  templateCategory: string
  promptContent: string
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

export function TemplateAIChat({
  templateTitle,
  templateDescription,
  templateCategory,
  promptContent,
  isMinimized = false,
  onToggleMinimize
}: TemplateAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I'm your AI guide for "${templateTitle}". I can help you:\n\n• Understand how to use this prompt effectively\n• Guide you through implementation steps\n• Answer questions about best practices\n• Help you customize it for your needs\n\nWhat would you like to know?`,
      timestamp: Date.now()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { success } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const buildSystemPrompt = () => {
    return `You are an expert AI assistant helping users with the prompt template: "${templateTitle}".

Template Details:
- Title: ${templateTitle}
- Description: ${templateDescription}
- Category: ${templateCategory}
- Prompt Content: ${promptContent}

Your role:
1. Provide clear, actionable guidance on how to use this prompt
2. Explain best practices and tips for getting the best results
3. Help users customize the prompt for their specific needs
4. Answer questions about implementation and usage
5. Suggest related workflows or complementary prompts

Be concise, helpful, and practical. Focus on real-world application.`
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

  const quickQuestions = [
    "How do I use this prompt?",
    "What are best practices?",
    "Can you help me customize it?",
    "Show me an example"
  ]

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    setTimeout(() => handleSend(), 100)
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(promptContent)
    success("Copied", "Prompt copied to clipboard!")
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
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">AI Guide</CardTitle>
                <p className="text-xs text-muted-foreground">Get help with this template</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={copyPrompt}
                title="Copy prompt"
              >
                <Copy className="h-4 w-4" />
              </Button>
              {onToggleMinimize && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onToggleMinimize}
                  title="Minimize"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
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
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Quick questions:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => handleQuickQuestion(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about this template..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

