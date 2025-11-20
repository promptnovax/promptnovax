import type { KeyboardEvent } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCart } from "@/context/CartContext"
import {
  Sparkles,
  ShoppingCart,
  Star,
  TrendingUp,
  Image,
  PenTool,
  Code,
  BarChart3,
  Users,
  Zap,
  MessageCircle,
  Send,
  Bot,
  ChevronDown,
  ChevronUp,
  Loader2
} from "lucide-react"

type AIPlatform =
  | "ChatGPT"
  | "Claude"
  | "Gemini"
  | "Midjourney"
  | "Leonardo"
  | "Sora"
  | "Runway"
  | "Universal"

type MarketplaceCategory =
  | "trending"
  | "image"
  | "writing"
  | "engineering"
  | "growth"
  | "operations"

interface MarketplacePrompt {
  id: string
  title: string
  headline: string
  description: string
  aiPlatform: AIPlatform
  category: MarketplaceCategory
  image: string
  price: number
  strikePrice?: number
  rating: number
  reviews: number
  downloads: number
  tags: string[]
  deliverables: string[]
  seller: {
    id: string
    name: string
    avatar: string
    verified: boolean
  }
}

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  suggestions?: MarketplacePrompt[]
}

const promptsCatalog: MarketplacePrompt[] = [
  {
    id: "mp-001",
    title: "Full-Stack Feature Spec Generator",
    headline: "Specs, architecture, and sprint plans generated from one product brief.",
    description:
      "Paste a product idea and instantly get technical architecture, API contracts, sprint breakdowns, and risk matrix ready for engineering hand-off.",
    aiPlatform: "Claude",
    category: "engineering",
    image: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?w=1200&q=80&auto=format&fit=crop",
    price: 39,
    strikePrice: 79,
    rating: 4.9,
    reviews: 212,
    downloads: 3211,
    tags: ["Architecture", "Planning", "Sprints"],
    deliverables: ["Architecture Outline", "API Contracts", "Sprint Tasks", "Risk Matrix"],
    seller: {
      id: "creator-claude",
      name: "Nova Engineering",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=NE",
      verified: true
    }
  },
  {
    id: "mp-002",
    title: "Midjourney Render Studio",
    headline: "Cinematic hero renders with 12 lighting presets for physical products.",
    description:
      "Generate studio-grade renders with macro detail, stylised lighting, and social-ready exports for launches and pitch decks.",
    aiPlatform: "Midjourney",
    category: "image",
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?w=1200&q=80&auto=format&fit=crop",
    price: 24,
    rating: 4.8,
    reviews: 188,
    downloads: 1890,
    tags: ["Product", "Photography", "Branding"],
    deliverables: ["12 Lighting Scenarios", "4 Aspect Ratios", "Render Variations"],
    seller: {
      id: "creator-visuals",
      name: "Renderverse Studio",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=RS",
      verified: true
    }
  },
  {
    id: "mp-003",
    title: "Lifecycle Email Playbooks",
    headline: "5 complete lifecycle journeys each with copy, experiments, and timing.",
    description:
      "Plug-and-play journeys for welcome, activation, expansion, churn save, and win-back sequences with built-in experiment ideas.",
    aiPlatform: "ChatGPT",
    category: "growth",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&q=80&auto=format&fit=crop",
    price: 19,
    rating: 4.7,
    reviews: 162,
    downloads: 2450,
    tags: ["Lifecycle", "Email", "Automation"],
    deliverables: ["Copy Variations", "Timing Matrix", "Experiment Stack"],
    seller: {
      id: "creator-lifecycle",
      name: "Growthcraft",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=GC",
      verified: true
    }
  },
  {
    id: "mp-004",
    title: "Creative Director Storyboard Lab",
    headline: "Scene-by-scene voiceover, camera moves, and visual cues for Sora videos.",
    description:
      "Build cinematic ad campaigns with Sora-ready shot lists, visual treatments, voiceover cues, and production-ready deliverables.",
    aiPlatform: "Sora",
    category: "operations",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop",
    price: 49,
    strikePrice: 89,
    rating: 4.9,
    reviews: 134,
    downloads: 980,
    tags: ["Video", "Storyboard", "Creative"],
    deliverables: ["Scene Breakdown", "Camera Motion", "Shot List", "VO Script"],
    seller: {
      id: "creator-creative",
      name: "Nova Studio Lab",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=NS",
      verified: true
    }
  },
  {
    id: "mp-005",
    title: "AI Sales Companion",
    headline: "Discovery call summaries, objection handling, and follow-ups in one flow.",
    description:
      "Digest call transcripts, pull buying signals, segment decision makers, and send personalised follow-ups with tailored collateral.",
    aiPlatform: "Gemini",
    category: "trending",
    image: "https://images.unsplash.com/photo-1520241434507-9516cf4b65ac?w=1200&q=80&auto=format&fit=crop",
    price: 29,
    rating: 4.6,
    reviews: 201,
    downloads: 3075,
    tags: ["Sales", "Enablement", "Follow-up"],
    deliverables: ["Call Summary", "Objection Map", "CTA Bank"],
    seller: {
      id: "creator-sales",
      name: "Pipeline AI",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=PA",
      verified: true
    }
  },
  {
    id: "mp-006",
    title: "AI UX Research Lab",
    headline: "Interview scripts, insight clustering, and stakeholder-ready debriefs.",
    description:
      "Run remote interviews with AI: includes scripts, note-taking prompts, affinity mapping, and executive-ready summaries.",
    aiPlatform: "Claude",
    category: "operations",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&q=80&auto=format&fit=crop",
    price: 27,
    rating: 4.8,
    reviews: 98,
    downloads: 1785,
    tags: ["Research", "Insights", "Product"],
    deliverables: ["Interview Script", "Insight Board", "Action Matrix"],
    seller: {
      id: "creator-ux",
      name: "Design Signals",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DS",
      verified: false
    }
  },
  {
    id: "mp-007",
    title: "Chromatic Worlds Prompt Vault",
    headline: "40 Midjourney environments crafted for cinematic world-building.",
    description:
      "Create mythic forests, neon megacities, lunar deserts, and arctic dawns with tuned prompt variations and moodboard references.",
    aiPlatform: "Midjourney",
    category: "image",
    image: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=1200&q=80&auto=format&fit=crop",
    price: 15,
    rating: 4.7,
    reviews: 142,
    downloads: 2203,
    tags: ["Environment", "Worldbuilding", "Cinematic"],
    deliverables: ["40 Prompt Variants", "Reference Moodboard"],
    seller: {
      id: "creator-worlds",
      name: "Atlas Collective",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AC",
      verified: true
    }
  },
  {
    id: "mp-008",
    title: "Founder Press Kit Autopilot",
    headline: "Investor decks, executive bios, and rapid media responses in minutes.",
    description:
      "Transform your founder story into press-ready assets including bios, FAQs, media responses, and a messaging matrix.",
    aiPlatform: "ChatGPT",
    category: "growth",
    image: "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=1200&q=80&auto=format&fit=crop",
    price: 22,
    rating: 4.5,
    reviews: 76,
    downloads: 980,
    tags: ["PR", "Funding", "Brand"],
    deliverables: ["Media Kit", "Response Templates", "Messaging Matrix"],
    seller: {
      id: "creator-pr",
      name: "Launch Comms",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=LC",
      verified: true
    }
  }
]

const sections = [
  {
    key: "trending" as MarketplaceCategory,
    title: "Trending this week",
    description: "Highest converting prompt packs the Nova community relies on daily.",
    icon: TrendingUp
  },
  {
    key: "image" as MarketplaceCategory,
    title: "Image & Visual Studios",
    description: "Midjourney and Leonardo prompt vaults for production-ready visuals.",
    icon: Image
  },
  {
    key: "writing" as MarketplaceCategory,
    title: "Writing & Storytelling",
    description: "Copy systems tuned for blogs, scripts, and brand storytelling.",
    icon: PenTool
  },
  {
    key: "engineering" as MarketplaceCategory,
    title: "Engineering & Technical Ops",
    description: "Specs, QA copilots, and automation builders for technical teams.",
    icon: Code
  },
  {
    key: "growth" as MarketplaceCategory,
    title: "Growth & Revenue",
    description: "Lifecycle, demand gen, and sales automations that drive revenue.",
    icon: BarChart3
  },
  {
    key: "operations" as MarketplaceCategory,
    title: "Ops, Research & Creative",
    description: "Meeting intelligence, research automation, and creative production flows.",
    icon: Users
  }
] as const

const platformBadgeStyles: Record<AIPlatform, string> = {
  ChatGPT: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Claude: "bg-amber-100 text-amber-700 border border-amber-200",
  Gemini: "bg-sky-100 text-sky-700 border border-sky-200",
  Midjourney: "bg-purple-100 text-purple-700 border border-purple-200",
  Leonardo: "bg-rose-100 text-rose-700 border border-rose-200",
  Sora: "bg-lime-100 text-lime-700 border border-lime-200",
  Runway: "bg-orange-100 text-orange-700 border border-orange-200",
  Universal: "bg-slate-200 text-slate-700 border border-slate-300"
}

const platformFilters: (AIPlatform | "All Platforms")[] = [
  "All Platforms",
  "ChatGPT",
  "Claude",
  "Gemini",
  "Midjourney",
  "Leonardo",
  "Sora",
  "Runway",
  "Universal"
]

const priceFilters = [
  { value: "all", label: "All price points" },
  { value: "free", label: "Free" },
  { value: "starter", label: "Under $25" },
  { value: "pro", label: "$25 – $49" },
  { value: "premium", label: "$50+" }
] as const

const CHAT_QUICK_ASKS = [
  "Suggest a storytelling prompt for travel vloggers",
  "Need a prompt pack to speed up enterprise sales emails",
  "Show visual prompts tuned for futuristic product renders",
  "Find me prompts for founders writing investor updates",
  "Recommend lifecycle automations under $30"
] as const

export function MarketplacePage() {
  const { addItem } = useCart()
  const [search, setSearch] = useState("")
  const [platform, setPlatform] = useState<AIPlatform | "All Platforms">("All Platforms")
  const [price, setPrice] = useState<(typeof priceFilters)[number]["value"]>("all")
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [chatInput, setChatInput] = useState("")
  const [isChatThinking, setIsChatThinking] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: "assistant-welcome",
      role: "assistant",
      content:
        "Nova Copilot is listening. Tell me what you're building and I'll surface the exact marketplace prompts that teams are buying right now.",
      suggestions: promptsCatalog.slice(0, 3)
    }
  ])
  const chatBodyRef = useRef<HTMLDivElement | null>(null)
  const pendingReplyRef = useRef<number | null>(null)

  const filteredPrompts = useMemo(() => {
    return promptsCatalog.filter(prompt => {
      const matchesSearch =
        !search ||
        prompt.title.toLowerCase().includes(search.toLowerCase()) ||
        prompt.description.toLowerCase().includes(search.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))

      const matchesPlatform = platform === "All Platforms" || prompt.aiPlatform === platform

      const matchesPrice = (() => {
        switch (price) {
          case "free":
            return prompt.price === 0
          case "starter":
            return prompt.price > 0 && prompt.price < 25
          case "pro":
            return prompt.price >= 25 && prompt.price < 50
          case "premium":
            return prompt.price >= 50
          default:
            return true
        }
      })()

      return matchesSearch && matchesPlatform && matchesPrice
    })
  }, [search, platform, price])

  const currency = (amount: number) => `$${amount.toFixed(2)}`
  const promptUniverse = filteredPrompts.length > 0 ? filteredPrompts : promptsCatalog

  useEffect(() => {
    return () => {
      if (pendingReplyRef.current) {
        if (typeof window !== "undefined") {
          window.clearTimeout(pendingReplyRef.current)
        } else {
          clearTimeout(pendingReplyRef.current)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (!chatBodyRef.current) return
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth"
    })
  }, [chatMessages, isChatThinking])

  const handleQuickAsk = (prompt: string) => {
    setChatInput(prev => (prev.trim() ? `${prev.trim()} ${prompt}` : prompt))
    setIsChatOpen(true)
  }

  const handleChatSend = () => {
    const trimmed = chatInput.trim()
    if (!trimmed || isChatThinking) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput("")
    setIsChatThinking(true)

    const matches = promptUniverse
      .filter(prompt => {
        const haystack = `${prompt.title} ${prompt.headline} ${prompt.description} ${prompt.tags.join(" ")}`
        return haystack.toLowerCase().includes(trimmed.toLowerCase())
      })
      .slice(0, 3)

    const assistantCopy =
      matches.length > 0
        ? `Here ${matches.length > 1 ? "are" : "is"} what lines up with “${trimmed}”.`
        : `Couldn't find an exact match for “${trimmed}”, so here are marketplace favorites worth exploring.`

    const responder = () => {
      setChatMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: assistantCopy,
          suggestions: (matches.length > 0 ? matches : promptUniverse.slice(0, 3)) as MarketplacePrompt[]
        }
      ])
      setIsChatThinking(false)
      pendingReplyRef.current = null
    }

    const timeoutId =
      typeof window !== "undefined"
        ? window.setTimeout(responder, 520)
        : (setTimeout(responder, 520) as unknown as number)

    pendingReplyRef.current = timeoutId
  }

  const handlePromptView = (promptId: string) => {
    if (typeof window === "undefined") return
    window.location.hash = `#marketplace/${promptId}`
  }

  const handlePromptAdd = (prompt: MarketplacePrompt) => {
    addItem({
      id: prompt.id,
      title: prompt.title,
      price: prompt.price,
      imageUrl: prompt.image
    })
  }

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleChatSend()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-br from-background via-background to-muted/40">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-16 space-y-10"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Nova Prompt Marketplace
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Launch Ready Prompt Systems for Every Team
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover community-built prompt playbooks with proven results.
              Each template ships with workflows, deliverables, and usage metrics so you can skip the guesswork.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-center gap-4">
            <Input
              placeholder="Search by use-case, industry, or keyword…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="lg:w-[420px]"
            />
            <Select value={platform} onValueChange={(value) => setPlatform(value as AIPlatform | "All Platforms")}>
              <SelectTrigger className="lg:w-56">
                <SelectValue placeholder="AI platform" />
              </SelectTrigger>
              <SelectContent>
                {platformFilters.map(item => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={price} onValueChange={(value) => setPrice(value as typeof price)}>
              <SelectTrigger className="lg:w-48">
                <SelectValue placeholder="Pricing" />
              </SelectTrigger>
              <SelectContent>
                {priceFilters.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {sections.map(section => {
          const SectionIcon = section.icon
          const prompts = filteredPrompts.filter(prompt => prompt.category === section.key)

          if (prompts.length === 0) return null

          return (
            <section key={section.key} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-primary/80">
                    <SectionIcon className="h-4 w-4" />
                    {section.title}
                  </div>
                  <h2 className="text-2xl font-semibold mt-2">{section.description}</h2>
                </div>
                <Button variant="ghost" className="text-sm text-muted-foreground hover:text-primary">
                  Explore collection
                </Button>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-2">
                {prompts.map((prompt, index) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="min-w-[340px]"
                  >
                    <Card className="h-full overflow-hidden border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={prompt.image}
                          alt={prompt.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                          <Badge className={platformBadgeStyles[prompt.aiPlatform]}>
                            {prompt.aiPlatform}
                          </Badge>
                          <Badge variant="secondary" className="bg-white/80 text-slate-900">
                            {section.title}
                          </Badge>
                        </div>
                        {prompt.strikePrice && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-primary text-primary-foreground">
                              Save {Math.round(100 - (prompt.price / prompt.strikePrice) * 100)}%
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-5 space-y-5">
                        <div>
                          <h3 className="text-lg font-semibold leading-tight">{prompt.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {prompt.headline}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{prompt.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">({prompt.reviews})</span>
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {prompt.downloads.toLocaleString()} downloads
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {prompt.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          {prompt.deliverables.slice(0, 4).map(item => (
                            <div key={item} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {item}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              {prompt.strikePrice && (
                                <span className="text-xs text-muted-foreground line-through">
                                  {currency(prompt.strikePrice)}
                                </span>
                              )}
                              <span className="text-xl font-semibold">
                                {currency(prompt.price)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={prompt.seller.avatar} />
                                <AvatarFallback>{prompt.seller.name[0]}</AvatarFallback>
                              </Avatar>
                              <span>{prompt.seller.name}</span>
                              {prompt.seller.verified && (
                                <Badge variant="secondary" className="text-[10px]">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() =>
                                addItem({
                                  id: prompt.id,
                                  title: prompt.title,
                                  price: prompt.price,
                                  imageUrl: prompt.image
                                })
                              }
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Add
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => (window.location.hash = `#marketplace/${prompt.id}`)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          )
        })}

        {filteredPrompts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed rounded-3xl space-y-4 text-center">
            <Zap className="h-10 w-10 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">No prompts match your filters</h3>
              <p className="text-muted-foreground">
                Try changing the platform or reset your search to explore the full marketplace.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("")
                setPlatform("All Platforms")
                setPrice("all")
              }}
            >
              Reset filters
            </Button>
          </div>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-4 z-50 px-3 sm:px-6 pointer-events-none">
        <motion.div
          layout
          className={`pointer-events-auto mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-slate-950/70 backdrop-blur-2xl shadow-[0_35px_90px_rgba(2,6,23,0.65)] transition-all ${
            isChatOpen ? "p-5" : "p-3"
          }`}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                  {isChatThinking ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">Marketplace Copilot</p>
                  <p className="text-sm font-semibold text-white">Ask Nova for prompts without leaving the feed</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isChatThinking && (
                  <p className="hidden sm:flex items-center gap-1 text-xs text-white/70">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Shortlisting
                  </p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-white/80 hover:text-white"
                  onClick={() => setIsChatOpen(prev => !prev)}
                >
                  {isChatOpen ? (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Open
                    </>
                  )}
                </Button>
              </div>
            </div>

            {!isChatOpen ? (
              <button
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 hover:border-primary/40 transition-colors"
                onClick={() => setIsChatOpen(true)}
              >
                Tap to brief Nova on what you need. She’ll keep the marketplace visible while responding.
              </button>
            ) : (
              <>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {CHAT_QUICK_ASKS.map(ask => (
                    <button
                      key={ask}
                      className="whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80 hover:border-primary/50 hover:text-white transition-colors"
                      onClick={() => handleQuickAsk(ask)}
                    >
                      {ask}
                    </button>
                  ))}
                </div>

                <div
                  ref={chatBodyRef}
                  className="max-h-[240px] overflow-y-auto pr-1 space-y-3 mt-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
                >
                  {chatMessages.map(message => (
                    <div key={message.id} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          message.role === "assistant"
                            ? "bg-white/10 text-white"
                            : "bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                        }`}
                      >
                        {message.content}

                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.suggestions.map(prompt => (
                              <div
                                key={prompt.id}
                                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-white line-clamp-1">{prompt.title}</p>
                                    <p className="text-[11px] text-white/70 line-clamp-1">{prompt.headline}</p>
                                  </div>
                                  <span className="text-sm font-semibold text-primary">{currency(prompt.price)}</span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  <Button
                                    size="xs"
                                    variant="secondary"
                                    className="h-7 rounded-full bg-white/90 text-slate-900 hover:bg-white"
                                    onClick={() => handlePromptView(prompt.id)}
                                  >
                                    View
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant="ghost"
                                    className="h-7 rounded-full text-white/80 hover:text-white"
                                    onClick={() => handlePromptAdd(prompt)}
                                  >
                                    <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                                    Add
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isChatThinking && (
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Nova is searching live marketplace data…
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-col sm:flex-row items-end gap-3">
                  <div className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 focus-within:border-primary/50">
                    <textarea
                      rows={1}
                      className="w-full resize-none bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
                      placeholder="e.g. Need an intermediate writing prompt for SaaS product launches…"
                      value={chatInput}
                      onChange={event => setChatInput(event.target.value)}
                      onKeyDown={handleComposerKeyDown}
                    />
                  </div>
                  <Button
                    className="w-full sm:w-auto rounded-2xl bg-primary px-6 font-semibold shadow-lg shadow-primary/40"
                    onClick={handleChatSend}
                    disabled={!chatInput.trim() || isChatThinking}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "development", label: "Development" },
    { value: "writing", label: "Writing" },
    { value: "business", label: "Business" },
    { value: "ai", label: "AI & ML" },
    { value: "marketing", label: "Marketing" },
    { value: "data", label: "Data Science" },
    { value: "design", label: "Design" }
  ]

  const priceRangeOptions = [
    { value: "all", label: "All Prices" },
    { value: "free", label: "Free" },
    { value: "under-10", label: "Under $10" },
    { value: "under-50", label: "Under $50" },
    { value: "over-50", label: "$50+" }
  ]

  const ratingOptions = [
    { value: "all", label: "All Ratings" },
    { value: "4-plus", label: "4★ & Up" },
    { value: "3-plus", label: "3★ & Up" }
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" }
  ]

  const filteredPrompts = prompts.filter(prompt => {
    // Search filter (case-insensitive)
    const matchesSearch = searchQuery === "" || 
                         prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.shortDesc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Category filter
    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory
    
    // Price range filter
    const matchesPriceRange = (() => {
      switch (selectedPriceRange) {
        case "free":
          return prompt.price === 0
        case "under-10":
          return prompt.price < 10
        case "under-50":
          return prompt.price < 50
        case "over-50":
          return prompt.price >= 50
        default:
          return true
      }
    })()
    
    // Rating filter
    const matchesRating = (() => {
      switch (selectedRating) {
        case "4-plus":
          return prompt.rating >= 4.0
        case "3-plus":
          return prompt.rating >= 3.0
        default:
          return true
      }
    })()
    
    return matchesSearch && matchesCategory && matchesPriceRange && matchesRating
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handlePriceRangeChange = (priceRange: string) => {
    setSelectedPriceRange(priceRange)
  }

  const handleRatingChange = (rating: string) => {
    setSelectedRating(rating)
  }

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort)
  }

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode)
  }

  const handlePromptClick = (promptId: string) => {
    // Navigate to prompt detail page
    window.location.hash = `#marketplace/${promptId}`
  }

  const handleWishlist = (promptId: string) => {
    success("Added to wishlist", "Prompt saved for later!")
  }

  const handleSellerClick = (sellerId: string) => {
    window.location.hash = `#seller-profile/${sellerId}`
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Prompts
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover powerful AI prompts created by our community. Find the perfect prompt for your next project.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search prompts, categories, or tags..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedSort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleViewModeChange("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleViewModeChange("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPriceRange} onValueChange={handlePriceRangeChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRating} onValueChange={handleRatingChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <Star className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPrompts.length} of {prompts.length} prompts
              </p>
              
              {/* Active Filters */}
              {(searchQuery || selectedCategory !== "all" || selectedPriceRange !== "all" || selectedRating !== "all") && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Active filters:</span>
                  <div className="flex flex-wrap gap-1">
                    {searchQuery && (
                      <Badge variant="secondary" className="text-xs">
                        Search: "{searchQuery}"
                      </Badge>
                    )}
                    {selectedCategory !== "all" && (
                      <Badge variant="secondary" className="text-xs">
                        {categories.find(c => c.value === selectedCategory)?.label}
                      </Badge>
                    )}
                    {selectedPriceRange !== "all" && (
                      <Badge variant="secondary" className="text-xs">
                        {priceRangeOptions.find(p => p.value === selectedPriceRange)?.label}
                      </Badge>
                    )}
                    {selectedRating !== "all" && (
                      <Badge variant="secondary" className="text-xs">
                        {ratingOptions.find(r => r.value === selectedRating)?.label}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCategory("all")
                        setSelectedPriceRange("all")
                        setSelectedRating("all")
                      }}
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Trending this week</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Featured Prompts */}
      {filteredPrompts.filter(p => p.featured).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Featured Prompts</h2>
            <p className="text-muted-foreground">Hand-picked prompts from our top creators</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.filter(p => p.featured).map((prompt) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group">
                  <div className="relative">
                    <img
                      src={prompt.thumbnail}
                      alt={prompt.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
                        onClick={() => handleWishlist(prompt.id)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {prompt.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {prompt.shortDesc || prompt.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{prompt.rating}</span>
                        <span className="text-xs text-muted-foreground">({prompt.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {prompt.downloads.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={prompt.seller.avatar} />
                          <AvatarFallback className="text-xs">
                            {prompt.seller.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <button
                          onClick={() => handleSellerClick(prompt.seller.id)}
                          className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                        >
                          {prompt.seller.name}
                        </button>
                        {prompt.seller.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {prompt.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(prompt.originalPrice)}
                            </span>
                          )}
                          <span className="font-bold text-lg">{formatPrice(prompt.price)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300" 
                        onClick={() => handlePromptClick(prompt.id)}
                      >
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addItem({ id: String(prompt.id ?? prompt.title), title: prompt.title ?? "Prompt", price: Number(prompt.price ?? 0), imageUrl: prompt.imageUrl })}>
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">All Prompts</h2>
          <p className="text-muted-foreground">Browse our complete collection of AI prompts</p>
        </div>

        {filteredPrompts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No prompts found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedPriceRange("all")
                  setSelectedRating("all")
                }}
              >
                Clear all filters
              </Button>
            </div>
          </motion.div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPrompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group border hover:border-primary/20">
                  <div className="relative">
                    <img
                      src={prompt.thumbnail}
                      alt={prompt.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
                        onClick={() => handleWishlist(prompt.id)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {prompt.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {prompt.shortDesc || prompt.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{prompt.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {prompt.downloads.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={prompt.seller.avatar} />
                          <AvatarFallback className="text-xs">
                            {prompt.seller.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <button
                          onClick={() => handleSellerClick(prompt.seller.id)}
                          className="text-xs font-medium hover:text-primary transition-colors cursor-pointer"
                        >
                          {prompt.seller.name}
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {prompt.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(prompt.originalPrice)}
                            </span>
                          )}
                          <span className="font-bold">{formatPrice(prompt.price)}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300" 
                      size="sm"
                      onClick={() => handlePromptClick(prompt.id)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ x: 4 }}
              >
                <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group border hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={prompt.thumbnail}
                        alt={prompt.title}
                        className="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{prompt.title}</h3>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleWishlist(prompt.id)}
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                {prompt.originalPrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(prompt.originalPrice)}
                                  </span>
                                )}
                                <span className="font-bold text-lg">{formatPrice(prompt.price)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {prompt.shortDesc || prompt.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={prompt.seller.avatar} />
                                <AvatarFallback className="text-xs">
                                  {prompt.seller.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <button
                                onClick={() => handleSellerClick(prompt.seller.id)}
                                className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                              >
                                {prompt.seller.name}
                              </button>
                              {prompt.seller.verified && (
                                <Badge variant="secondary" className="text-xs">Verified</Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{prompt.rating}</span>
                              <span className="text-xs text-muted-foreground">({prompt.reviews})</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Eye className="h-3 w-3" />
                              {prompt.downloads.toLocaleString()} downloads
                            </div>
                          </div>
                          
                          <Button 
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                            onClick={() => handlePromptClick(prompt.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-12">
          <Button variant="outline" size="sm" disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="w-10"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" disabled={currentPage === 5}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}