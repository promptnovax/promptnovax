import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Shield,
  Zap,
  Send,
  RefreshCw,
  Loader2,
  Plus,
  Settings,
  ExternalLink,
  Mic,
  AudioLines
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { requestFreeChatResponse, type FreeChatMessage } from "@/lib/freeChatService"

type ConversationMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: number
  status?: "complete" | "streaming"
  latencyMs?: number
  tokens?: {
    prompt?: number
    completion?: number
  }
}

const STRATEGY_PLAYBOOKS = [
  {
    id: "product-launch",
    title: "Product Launch OS",
    focus: "Monetization & Adoption",
    summary: "Align GTM narrative with finance KPIs before the Q1 board readout.",
    checkpoints: ["Executive brief", "Activation dashboard", "Risk register"],
    tone: "confident and executive",
    metrics: {
      northStar: "Activation Rate",
      wow: "+12% WoW",
      health: "Green"
    }
  },
  {
    id: "customer-success",
    title: "Customer Success Playbook",
    focus: "Retention & Expansion",
    summary: "Stabilize enterprise accounts and surface upsell stories.",
    checkpoints: ["NPS loop", "Churn map", "Success storyboard"],
    tone: "empathetic and data-backed",
    metrics: {
      northStar: "Net Revenue Retention",
      wow: "+4% WoW",
      health: "Amber"
    }
  },
  {
    id: "ops-maturity",
    title: "Ops Maturity Sprint",
    focus: "Internal Automation",
    summary: "Document the operating model for the RevOps council.",
    checkpoints: ["Workflow audit", "Policy digest", "Enablement kit"],
    tone: "precise and operational",
    metrics: {
      northStar: "Time-to-Resolution",
      wow: "-18% WoW",
      health: "Green"
    }
  }
] as const

const MODEL_PRESETS = [
  {
    id: "free-hf",
    label: "PromptNX Free Model",
    tier: "Connected",
    description: "Managed Hugging Face inference • Cost optimized",
    latency: "~1.8s median",
    temperature: 0.35,
    maxTokens: 512,
    status: "active"
  },
  {
    id: "enterprise-ops",
    label: "Enterprise Routing",
    tier: "Requires upgrade",
    description: "Routes to GPT-4o mini with Claude fallback",
    latency: "~0.9s",
    temperature: 0.2,
    maxTokens: 1024,
    status: "locked"
  }
] as const

const QUICK_PROMPTS = [
  {
    id: "exec-brief",
    title: "Executive Brief",
    detail: "Translate this thread into a board-ready status memo."
  },
  {
    id: "risk-grid",
    title: "Risk Grid",
    detail: "List assumptions, blockers, owners, and mitigation paths."
  },
  {
    id: "customer-story",
    title: "Customer Story",
    detail: "Package insight into a narrative for the customer advisory board."
  }
] as const

const INITIAL_MESSAGES: ConversationMessage[] = [
  {
    id: "assistant-welcome",
    role: "assistant",
    content: "Welcome back to PromptNX Copilot. I'm holding the Product Launch OS playbook and watching activation KPIs. What's the next move we should sharpen?",
    createdAt: Date.now() - 1000
  },
  {
    id: "user-intent",
    role: "user",
    content: "We need a sharper narrative for the PLG add-on before finance reviews it. Highlight measurable revenue impact.",
    createdAt: Date.now() - 800
  },
  {
    id: "assistant-plan",
    role: "assistant",
    content: "Roger that. I'll anchor on monetization levers, GTM velocity, and downstream ops requirements. Drop any fresh signals and I'll reframe the launch storyline in real time.",
    createdAt: Date.now() - 600
  }
]

export function ChatPage() {
  const [messages, setMessages] = useState<ConversationMessage[]>(INITIAL_MESSAGES)
  const [composerValue, setComposerValue] = useState("")
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>(STRATEGY_PLAYBOOKS[0].id)
  const [selectedModelId, setSelectedModelId] = useState<string>(MODEL_PRESETS[0].id)
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
const [sessionMeta, setSessionMeta] = useState({
    turns: INITIAL_MESSAGES.length,
    avgLatency: 1500,
    cacheHits: 0,
    tokens: {
      prompt: 0,
      completion: 0,
      total: 0
    }
  })

const [userHandle] = useState(() => {
    if (typeof window === "undefined") return "Operator"
    return window.localStorage.getItem("pnx:user-handle") || "Operator"
  })

  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLTextAreaElement>(null)

const userInitials = useMemo(() => {
    const initials = userHandle
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
    return initials ? initials.toUpperCase() : "ME"
  }, [userHandle])

const activePlaybook = useMemo(
    () => STRATEGY_PLAYBOOKS.find((playbook) => playbook.id === selectedPlaybookId) ?? STRATEGY_PLAYBOOKS[0],
    [selectedPlaybookId]
  )

const activeModel = useMemo(
    () => MODEL_PRESETS.find((model) => model.id === selectedModelId) ?? MODEL_PRESETS[0],
    [selectedModelId]
  )

  useEffect(() => {
  const id = window.setTimeout(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, 80)
  return () => window.clearTimeout(id)
}, [messages])

  useEffect(() => {
    if (!composerRef.current) return
    composerRef.current.style.height = "auto"
    composerRef.current.style.height = `${composerRef.current.scrollHeight}px`
  }, [composerValue])

const CONVERSATION_SUGGESTIONS = [
  "Line up the GTM story with finance guardrails.",
  "Summarize the adoption risks in 3 bullets.",
  "Draft an update thread for the PLG steering group.",
  "Translate this roadmap into exec-ready talking points."
] as const

  const buildSystemPrompt = useCallback(() => {
    return [
      "You are PromptNX Copilot, an enterprise AI partner for SaaS operators.",
      `Playbook: ${activePlaybook.title} (${activePlaybook.focus})`,
      "Expectations:",
      "- Respond like a senior product strategist supporting an exec team.",
      "- Lead with measurable outcomes, KPIs, and next steps.",
      "- Keep responses concise (<= 250 words) with an executive tone.",
      "- Reference activation, finance, or operational impact whenever possible."
    ].join("\n")
  }, [activePlaybook])

  const handleResetThread = () => {
    setMessages(INITIAL_MESSAGES)
    setSessionMeta({
      turns: INITIAL_MESSAGES.length,
      avgLatency: 1500,
      cacheHits: 0,
      tokens: { prompt: 0, completion: 0, total: 0 }
    })
    setComposerValue("")
    setErrorMessage(null)
  }

  const insertQuickPrompt = (prompt: string) => {
    setComposerValue((prev) => (prev.trim() ? `${prev.trim()}\n\n${prompt}` : prompt))
  }

  const handleOpenNewTab = () => {
    if (typeof window === "undefined") return
    const nextUrl = `${window.location.origin}/#chat?thread=${Date.now()}`
    window.open(nextUrl, "_blank", "noopener,noreferrer")
  }

  const handleOpenSettings = () => {
    if (typeof window === "undefined") return
    window.location.hash = "#dashboard/settings"
  }

  const handleOpenDocs = () => {
    if (typeof window === "undefined") return
    window.location.hash = "#marketplace"
  }

  const handleSendMessage = async () => {
    const trimmed = composerValue.trim()
    if (!trimmed) return

    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
      status: "complete"
    }

    const snapshot = [...messages, userMessage]
    setMessages(snapshot)
    setComposerValue("")
    setErrorMessage(null)
    setIsSending(true)

    const placeholderId = `assistant-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: placeholderId,
        role: "assistant",
        content: "Synthesizing a structured recommendation...",
        createdAt: Date.now(),
        status: "streaming"
      }
    ])

    const payloadMessages: FreeChatMessage[] = [
      { role: "system", content: buildSystemPrompt() },
      ...snapshot.map((message) => ({
        role: message.role,
        content: message.content
      }))
    ]

    try {
      const response = await requestFreeChatResponse({
        messages: payloadMessages,
        systemPrompt: buildSystemPrompt(),
        temperature: activeModel.temperature,
        maxTokens: activeModel.maxTokens,
        tone: activePlaybook.tone
      })

      setMessages((prev) =>
        prev.map((message) =>
          message.id === placeholderId
            ? {
                ...message,
                content: response.message,
                status: "complete",
                latencyMs: response.metadata?.latencyMs,
                tokens: {
                  prompt: response.metadata?.tokens?.prompt,
                  completion: response.metadata?.tokens?.completion
                }
              }
            : message
        )
      )

      setSessionMeta((prev) => {
        const turns = prev.turns + 1
        const latency = response.metadata?.latencyMs ?? prev.avgLatency
        const avgLatency = Math.round(((prev.avgLatency * prev.turns) + latency) / turns)
        return {
          turns,
          avgLatency,
          cacheHits: prev.cacheHits + (response.metadata?.cached ? 1 : 0),
          tokens: {
            prompt: prev.tokens.prompt + (response.metadata?.tokens?.prompt ?? 0),
            completion: prev.tokens.completion + (response.metadata?.tokens?.completion ?? 0),
            total: prev.tokens.total + (response.metadata?.tokens?.total ?? 0)
          }
        }
      })
    } catch (error: any) {
      setErrorMessage(error?.message || "Free model is unavailable right now. Please try again.")
      setMessages((prev) => prev.filter((message) => message.id !== placeholderId))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#05070e] text-white">
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <nav className="rounded-[28px] border border-white/10 bg-black/40 backdrop-blur px-5 py-4 flex flex-wrap items-center justify-between gap-4 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/70 to-primary/40 text-black font-semibold flex items-center justify-center">
                PN
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/40">PromptNX</p>
                <p className="text-lg font-semibold">NOVA Copilot</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                className="rounded-full"
                onClick={handleResetThread}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Thread
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-white/30 text-white/90"
                onClick={handleOpenNewTab}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                New Tab
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-white/80 hover:text-white"
                onClick={handleOpenSettings}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-white/80 hover:text-white"
                onClick={handleOpenDocs}
              >
                Docs
              </Button>
            </div>
          </nav>

          <header className="space-y-6 text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center px-6 py-5 rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur">
              <Avatar className="h-12 w-12 border border-white/10 bg-white/10 text-white">
                <AvatarFallback className="text-base font-semibold tracking-wide">
                  NV
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-left">
                <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">Nova Assistant</p>
                <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">What's happening, {userHandle}?</h1>
                <p className="text-sm text-white/70">
                  Nova keeps your strategy, memory, and guardrails synced so you can chat like GPT—but inside PromptNX.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                Model · {activeModel.label}
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/80">
                Playbook · {activePlaybook.title}
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/70">
                Latency {activeModel.latency}
              </Badge>
            </div>

            <div className="grid gap-8">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-white/40 text-center">Model routing</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {MODEL_PRESETS.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      disabled={model.status === "locked"}
                      onClick={() => model.status !== "locked" && setSelectedModelId(model.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        selectedModelId === model.id
                          ? "bg-white text-black border-white"
                          : "border-white/20 text-white/70 hover:border-white/60"
                      } ${model.status === "locked" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {model.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-white/40 text-center">Assistant lens</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {STRATEGY_PLAYBOOKS.map((playbook) => (
                    <button
                      key={playbook.id}
                      type="button"
                      onClick={() => setSelectedPlaybookId(playbook.id)}
                      className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                        activePlaybook.id === playbook.id
                          ? "border-primary/70 bg-primary/15 text-white"
                          : "border-white/15 text-white/70 hover:border-white/40"
                      }`}
                    >
                      {playbook.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <section className="space-y-5">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] flex flex-col min-h-[70vh] max-w-3xl mx-auto w-full">
              <div className="px-6 py-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-white/40">Nova session</p>
                  <p className="text-sm text-white/70">Realtime memory • Guardrails ON</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-300 border-0">
                    Live
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white"
                    onClick={handleResetThread}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-5">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start gap-3 max-w-3xl ${
                        message.role === "user" ? "flex-row-reverse text-right" : ""
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-xs font-semibold ${
                          message.role === "user"
                            ? "bg-primary/90 text-primary-foreground"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        {message.role === "user" ? userInitials : "NV"}
                      </div>
                      <div
                        className={`rounded-3xl border px-5 py-4 text-sm leading-relaxed shadow-lg whitespace-pre-wrap ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground border-primary/40"
                            : "bg-white/5 border-white/10 text-white/90"
                        }`}
                      >
                        <div
                          className={`flex text-[11px] uppercase tracking-wide mb-2 opacity-70 ${
                            message.role === "user" ? "justify-end gap-2" : "justify-between"
                          }`}
                        >
                          <span>{message.role === "user" ? userHandle : "Nova"}</span>
                          <span>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p>{message.content}</p>
                        {message.status === "streaming" && (
                          <div className="flex items-center gap-2 text-xs mt-3 opacity-80">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Nova is composing
                          </div>
                        )}
                        {message.latencyMs && (
                          <p className="text-[11px] mt-3 opacity-70">
                            {Math.round(message.latencyMs)} ms • {message.tokens?.completion ?? 0} completion tokens
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={endOfMessagesRef} />
              </div>

              <div className="border-t border-white/5 bg-black/40 px-3 py-5 sm:px-6 space-y-4">
                <div className="space-y-1 text-xs text-white/60">
                  {CONVERSATION_SUGGESTIONS.map((prompt) => (
                    <p key={prompt}>{prompt}</p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <Button
                      key={prompt.id}
                      variant="outline"
                      size="sm"
                      className="rounded-full border-white/20 text-white/70 hover:text-white hover:border-white/60"
                      onClick={() => insertQuickPrompt(prompt.detail)}
                    >
                      {prompt.title}
                    </Button>
                  ))}
                </div>
                <div className="rounded-full border border-white/15 bg-black/50 px-4 py-3 flex items-center gap-3 shadow-[0_15px_45px_rgba(0,0,0,0.45)]">
                  <button
                    type="button"
                    className="h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/10"
                    onClick={() => setComposerValue("")}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <textarea
                    ref={composerRef}
                    value={composerValue}
                    onChange={(event) => setComposerValue(event.target.value)}
                    placeholder="Ask NOVA anything…"
                    rows={1}
                    className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-white/60 resize-none"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <button type="button" className="text-white/60 hover:text-white">
                    <Mic className="h-5 w-5" />
                  </button>
                  <button type="button" className="text-white/60 hover:text-white">
                    <AudioLines className="h-5 w-5" />
                  </button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSending || !composerValue.trim()}
                    className="rounded-full h-11 w-11 p-0"
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <AnimatePresence>
                  {errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-sm text-red-400"
                    >
                      {errorMessage}
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="text-xs text-white/50 flex items-center gap-2">
                  Enter to send • Shift + Enter for a new line
                  {isSending && (
                    <span className="inline-flex items-center gap-1 text-emerald-300">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Nova thinking
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 flex flex-wrap items-center justify-center gap-4 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-300" />
                Safety filters active
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-300" />
                {sessionMeta.turns} turns • {Math.round(sessionMeta.avgLatency)}ms avg
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {sessionMeta.tokens.total} tokens processed
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}