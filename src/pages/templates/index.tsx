import type { KeyboardEvent } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PromptPreviewModal } from "@/components/PromptPreviewModal"
import { Sparkles, TrendingUp, Image, PenTool, Code, Plus, Mic, AudioLines, Loader2, Send } from "lucide-react"

type AIPlatform =
  | "ChatGPT"
  | "Claude"
  | "Gemini"
  | "Midjourney"
  | "Leonardo"
  | "Sora"
  | "Runway"
  | "Universal"

type PlatformFilter = AIPlatform | "All"

interface Template {
  id: string
  title: string
  description: string
  category: string
  group: "trending" | "image" | "writing" | "development" | "marketing" | "operations"
  aiPlatform: AIPlatform
  price: number
  image: string
  prompt: string
  tags: string[]
  metrics: string
}

const templateLibrary: Template[] = [
  {
    id: "trend-1",
    title: "Viral Product Launch Sequence",
    description: "Complete 7-touch email + social cadence engineered for time-sensitive launches.",
    category: "Marketing",
    group: "trending",
    aiPlatform: "ChatGPT",
    price: 0,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop",
    prompt:
      "Design a persuasive launch sequence for {product}. Include teaser, announcement, social snippets, urgency nudge, and post-launch survey. Personalise for {audience persona}.",
    tags: ["Launch", "Email", "Social"],
    metrics: "🔥 2.1k creators shipped with this"
  },
  {
    id: "trend-2",
    title: "Auto-Reply Support Copilot",
    description: "Generate empathetic, on-brand responses to complex customer issues in seconds.",
    category: "Customer Support",
    group: "trending",
    aiPlatform: "Claude",
    price: 9,
    image: "https://images.unsplash.com/photo-1520241434507-9516cf4b65ac?w=1200&q=80&auto=format&fit=crop",
    prompt:
      "Craft a support response for {issue summary}. Empathise briefly, confirm understanding, outline 3 actionable steps, provide reassurance. Follow {brand tone guidelines}.",
    tags: ["Customer Care", "Automation"],
    metrics: "✅ Cuts reply time by 65%"
  },
  {
    id: "img-1",
    title: "Cinematic Neon Portrait",
    description: "High-contrast cyberpunk portrait lighting with moody atmosphere.",
    category: "Image Generation",
    group: "image",
    aiPlatform: "Midjourney",
    price: 0,
    image: "https://images.unsplash.com/photo-1615529328331-f8917e57ca93?w=1200&q=80&auto=format&fit=crop",
    prompt:
      "Ultra-detailed cyberpunk portrait of {subject}, neon reflections, volumetric lighting, 85mm lens, f1.8, cinematic grade, dramatic rim light, futuristic skyline bokeh --ar 2:3 --stylize 700",
    tags: ["Portrait", "Cyberpunk", "Lighting"],
    metrics: "🎨 4K upscales ready"
  },
  {
    id: "img-2",
    title: "Concept Art – Frontier City",
    description: "Wide-angle matte painting blueprint for visionary urban landscapes.",
    category: "Image Generation",
    group: "image",
    aiPlatform: "Leonardo",
    price: 0,
    image: "https://images.unsplash.com/photo-1535868463750-c78d9543614f?w=1200&q=80&auto=format&fit=crop",
    prompt:
      "Design a futuristic frontier city at golden hour, mixed organic + angular architecture, sweeping aerial shot, dramatic clouds, cinematic depth, concept art, 16k realism, volumetric fog",
    tags: ["Concept Art", "World Building"],
    metrics: "🌆 Ideal for pitch decks"
  },
  {
    id: "write-1",
    title: "SEO Authority Blog System",
    description: "Turn keywords into complete long-form articles with persona-based tone.",
    category: "Content",
    group: "writing",
    aiPlatform: "ChatGPT",
    price: 0,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=80&auto=format&fit=crop",
    prompt:
      "Write an authoritative blog post about {topic}. Target {keyword}. Include hook, executive summary, structured headings with bullet key takeaways, expert quotes, FAQ, CTA. Tone: {tone}. Audience: {persona}.",
    tags: ["Long-form", "SEO"],
    metrics: "📈 Ranks in 7 days avg"
  },
  {
    id: "write-2",
    title: "Short-Form Social Carousel",
    description: "Storyboard + copy for 6-slide Instagram/LinkedIn carousel content.",
    category: "Content",
    group: "writing",
    aiPlatform: "Gemini",
    price: 0,
    image: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=1200&q=80&auto=format&fit=crop",
    prompt:
      "Create a 6-slide carousel on {topic}. Slide 1 hook, slides 2-5 actionable insights with supporting data/examples, slide 6 CTA. Tone {tone}. Include headline + 35 word caption.",
    tags: ["Social", "Carousel", "Engagement"],
    metrics: "📲 48% more saves"
  },
  {
    id: "dev-1",
    title: "Full-stack Feature Blueprint",
    description: "Convert product specs into technical implementation plans with tasks and timelines.",
    category: "Development",
    group: "development",
    aiPlatform: "Claude",
    price: 12,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop",
    prompt:
      "You are a senior tech lead. Break down feature '{feature}' for a {stack} stack. Provide architecture outline, data model changes, API contracts, task list by priority, estimation and risks.",
    tags: ["Planning", "Architecture"],
    metrics: "🛠️ 3 teams shipped faster"
  },
  {
    id: "dev-2",
    title: "Code Review Assistant",
    description: "Summarise pull requests, flag regressions, and suggest refactors.",
    category: "Development",
    group: "development",
    aiPlatform: "ChatGPT",
    price: 0,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop",
    prompt:
      "Review the following PR diff: {paste diff}. Identify bugs, performance issues, missing tests, and style problems. Provide actionable review comments grouped by severity.",
    tags: ["Quality", "Review"],
    metrics: "✅ 92% bug catch rate"
  },
  {
    id: "marketing-1",
    title: "Paid Ads Variations Lab",
    description: "Generate multivariate headlines + body copy for paid acquisition campaigns.",
    category: "Marketing",
    group: "marketing",
    aiPlatform: "ChatGPT",
    price: 7,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop",
    prompt:
      "Produce 8 ad variations for {offer}. Provide 3 punchy headlines, 3 body copy angles, 2 CTA options. Optimise for {platform}. Use benefit-driven, data-backed messaging.",
    tags: ["Ads", "CRO"],
    metrics: "💸 +32% ROAS avg"
  },
  {
    id: "marketing-2",
    title: "Event Campaign Playbook",
    description: "Plan webinar/event promotion across three touchpoints with assets.",
    category: "Marketing",
    group: "marketing",
    aiPlatform: "Universal",
    price: 0,
    image: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=1200&q=80&auto=format&fit=crop",
    prompt:
      "Create a full event campaign for {event}. Include registration page copy, reminder email, follow-up email, social snippets, and CTA. Provide a suggested schedule.",
    tags: ["Events", "Lifecycle"],
    metrics: "📆 Fill rate resource"
  },
  {
    id: "ops-1",
    title: "Meeting Intelligence Recap",
    description: "Structured summaries with decisions, owners, blockers, and action items.",
    category: "Operations",
    group: "operations",
    aiPlatform: "Claude",
    price: 0,
    image: "https://images.unsplash.com/photo-1520241434507-9516cf4b65ac?w=1200&q=80&auto=format&fit=crop",
    prompt:
      "Summarise the following meeting transcript: {transcript}. Capture decisions, action items with owners, key risks, and next steps. Format as executive digest + board-ready summary.",
    tags: ["Meetings", "Productivity"],
    metrics: "🗂️ Saves 2h per week"
  },
  {
    id: "ops-2",
    title: "AI Video Storyboard",
    description: "Scene-by-scene direction tailored for Sora/Runway generative video.",
    category: "Creative Ops",
    group: "operations",
    aiPlatform: "Sora",
    price: 0,
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80&auto=format&fit=crop",
    prompt:
      "Create a video storyboard for {concept}. Include scene list with camera motion, subject details, environment, lighting, transitions, voiceover cues. Style {style}. Duration {seconds}.",
    tags: ["Video", "Storyboard"],
    metrics: "🎬 Production ready"
  }
];

type TemplateCopilotMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  suggestions?: Template[]
}

const TEMPLATE_ASKS = [
  "Show me templates for GTM launch threads",
  "Need Midjourney prompts for neon portraits",
  "Suggest engineering blueprints for AI features",
  "Looking for lifecycle email cadences",
  "Any templates for meeting recaps?"
] as const

const platformBadges: Record<AIPlatform, string> = {
  ChatGPT: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Claude: "bg-amber-100 text-amber-700 border border-amber-200",
  Gemini: "bg-sky-100 text-sky-700 border border-sky-200",
  Midjourney: "bg-purple-100 text-purple-700 border border-purple-200",
  Leonardo: "bg-rose-100 text-rose-700 border border-rose-200",
  Sora: "bg-lime-100 text-lime-700 border border-lime-200",
  Runway: "bg-orange-100 text-orange-700 border border-orange-200",
  Universal: "bg-slate-200 text-slate-700 border border-slate-300"
}

const sections = [
  {
    key: "trending",
    title: "Trending Templates",
    description: "Hand-picked flows the community is using right now to ship faster.",
    icon: Sparkles
  },
  {
    key: "image",
    title: "Image Generation",
    description: "Midjourney & Leonardo-ready prompts for instant portfolio visuals.",
    icon: Image
  },
  {
    key: "writing",
    title: "Writing & Content",
    description: "High-impact writing systems for blogs, socials, and newsletters.",
    icon: PenTool
  },
  {
    key: "development",
    title: "Development & Engineering",
    description: "Technical blueprints, code reviews, and AI pair-programming helpers.",
    icon: Code
  },
  {
    key: "marketing",
    title: "Growth & Marketing",
    description: "Acquisition, lifecycle, and experimentation templates ready to deploy.",
    icon: TrendingUp
  },
  {
    key: "operations",
    title: "Ops & Creative Workflows",
    description: "Meeting intelligence, video storyboards, and automation utilities.",
    icon: Code
  }
];

export function TemplatesIndexPage() {
  const [search, setSearch] = useState("")
  const [activePlatform, setActivePlatform] = useState<PlatformFilter>("All")
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null)
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)
  const [copilotInput, setCopilotInput] = useState("")
  const [copilotMessages, setCopilotMessages] = useState<TemplateCopilotMessage[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      content: "Hi, I'm Nova. Ask for a use-case and I'll pin the right templates without covering your gallery."
    }
  ])
  const [isCopilotThinking, setIsCopilotThinking] = useState(false)
  const copilotScrollRef = useRef<HTMLDivElement | null>(null)
  const pendingReplyRef = useRef<number | null>(null)
  const [showCopilotBar, setShowCopilotBar] = useState(true)

  const platforms = useMemo(() => {
    const uniquePlatforms = Array.from(new Set(templateLibrary.map(template => template.aiPlatform))) as AIPlatform[]
    return ["All", ...uniquePlatforms]
  }, []) as PlatformFilter[]

  const filteredTemplates = useMemo(() => {
    return templateLibrary.filter(template => {
      const matchPlatform = activePlatform === "All" || template.aiPlatform === activePlatform
      const matchSearch =
        !search ||
        template.title.toLowerCase().includes(search.toLowerCase()) ||
        template.description.toLowerCase().includes(search.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      return matchPlatform && matchSearch
    })
  }, [activePlatform, search]);

  const templateUniverse = filteredTemplates.length > 0 ? filteredTemplates : templateLibrary

  useEffect(() => {
    if (!copilotScrollRef.current) return
    copilotScrollRef.current.scrollTo({
      top: copilotScrollRef.current.scrollHeight,
      behavior: "smooth"
    })
  }, [copilotMessages, isCopilotThinking])

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

  // Hide copilot bar when user reaches the global footer area
  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement
      const scrollBottom = window.innerHeight + window.scrollY
      const docHeight = doc.scrollHeight
      const footerThreshold = 320

      setShowCopilotBar(scrollBottom < docHeight - footerThreshold)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  const handleCopilotSend = () => {
    const trimmed = copilotInput.trim()
    if (!trimmed || isCopilotThinking) return

    const userMessage: TemplateCopilotMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed
    }

    setCopilotMessages(prev => [...prev, userMessage])
    setCopilotInput("")
    setIsCopilotThinking(true)

    const matches = templateUniverse
      .filter(template => {
        const haystack = `${template.title} ${template.description} ${template.category} ${template.tags.join(" ")} ${template.prompt}`
        return haystack.toLowerCase().includes(trimmed.toLowerCase())
      })
      .slice(0, 3)

    const assistantText =
      matches.length > 0
        ? `Here ${matches.length > 1 ? "are" : "is"} what lines up with “${trimmed}”.`
        : `I didn’t find an exact match for “${trimmed}”, so here are templates creators rely on daily.`

    const reply = () => {
      setCopilotMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: assistantText,
          suggestions: matches.length > 0 ? matches : templateUniverse.slice(0, 3)
        }
      ])
      setIsCopilotThinking(false)
      pendingReplyRef.current = null
    }

    const timeoutId =
      typeof window !== "undefined"
        ? window.setTimeout(reply, 450)
        : (setTimeout(reply, 450) as unknown as number)

    pendingReplyRef.current = timeoutId
  }

  const handleQuickInsert = (text: string) => {
    setCopilotInput(prev => (prev.trim() ? `${prev.trim()} ${text}` : text))
    setIsCopilotOpen(true)
  }

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleCopilotSend()
    }
  }

  const handleUseTemplate = () => {
    if (typeof window === "undefined") return
    window.location.hash = "#prompts/create"
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Nova Templates Library
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Launch-Ready AI Templates for Every Team
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Drag-and-drop prompt systems built for marketing, design, engineering, and operations.
            Curated with real performance metrics so you can ship higher-quality work instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Input
              placeholder="Search by use-case, keyword, or AI platform..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="sm:w-[360px]"
            />
            <Select value={activePlatform} onValueChange={(value) => setActivePlatform(value as PlatformFilter)}>
              <SelectTrigger className="sm:w-56">
                <SelectValue placeholder="Filter by platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {sections.map(section => {
          const SectionIcon = section.icon
          const templates = filteredTemplates.filter(template => template.group === section.key)

          if (templates.length === 0) {
            return null
          }

          return (
            <section key={section.key} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-primary/80">
                    <SectionIcon className="h-4 w-4" />
                    {section.title}
                  </div>
                  <h2 className="text-2xl font-semibold mt-2">{section.description}</h2>
                </div>
                <Button variant="ghost" className="text-sm text-muted-foreground hover:text-primary">
                  View all
                </Button>
              </div>

              <div className="flex gap-6 pb-2 overflow-x-auto">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="min-w-[320px]"
                  >
                    <Card
                      className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      onClick={() => {
                        // Navigate to template detail page
                        window.location.hash = `#templates/${template.id}`
                      }}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={template.image}
                          alt={template.title}
                          loading="lazy"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="bg-white/80 text-slate-900">
                            {template.category}
                          </Badge>
                          <Badge className={platformBadges[template.aiPlatform]}>
                            {template.aiPlatform}
                          </Badge>
                          {template.price === 0 ? (
                            <Badge variant="outline" className="bg-white/80 text-slate-900 border-white">
                              Free
                            </Badge>
                          ) : (
                            <Badge className="bg-primary text-primary-foreground">
                              ${template.price}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-5 space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold">{template.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {template.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {template.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm font-medium text-primary/80">
                          <span>{template.metrics}</span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={(event) => {
                            event.stopPropagation()
                            // Navigate to template detail page with enhanced features
                            window.location.hash = `#templates/${template.id}`
                          }}>
                            View Details
                          </Button>
                          <Button size="sm" className="flex-1" asChild>
                            <Link href="#prompts/create">
                              Use Template
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          )
        })}

        {filteredTemplates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 border rounded-3xl border-dashed">
            <Sparkles className="h-10 w-10 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">No templates match your search</h3>
              <p className="text-muted-foreground">
                Try adjusting the keywords or changing the AI platform filter.
              </p>
            </div>
            <Button variant="outline" onClick={() => {
              setSearch("")
              setActivePlatform("All")
            }}>
              Reset Filters
            </Button>
          </div>
        )}

        {activeTemplate && (
          <PromptPreviewModal
            promptData={{
              title: activeTemplate.title,
              description: activeTemplate.description,
              category: activeTemplate.category.toLowerCase(),
              tags: activeTemplate.tags,
              price: activeTemplate.price,
              content: activeTemplate.prompt,
              imageFile: null,
              imageUrl: activeTemplate.image
            }}
            onClose={() => setActiveTemplate(null)}
            onPublish={() => null}
            isLoading={false}
          />
        )}
      </div>

      {showCopilotBar && (
        <div className="fixed inset-x-0 bottom-5 z-40 px-4 pointer-events-none">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="mx-auto max-w-4xl pointer-events-auto"
          >
            {!isCopilotOpen ? (
              <button
                className="w-full flex items-center justify-between rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-[0_25px_70px_rgba(2,6,23,0.65)] px-6 py-3 text-left text-white transition hover:border-primary/40"
                onClick={() => setIsCopilotOpen(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-white/80">Ask Nova for a template…</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <span className="h-2 w-2 rounded-full bg-violet-400" />
                  <Mic className="h-4 w-4" />
                  <AudioLines className="h-5 w-5" />
                </div>
              </button>
            ) : (
              <div className="rounded-[32px] border border-white/10 bg-slate-950/90 backdrop-blur-2xl shadow-[0_35px_95px_rgba(2,6,23,0.8)] text-white p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.5em] text-white/50">Templates Copilot</p>
                    <p className="text-sm text-white/80">Nova keeps the gallery visible while she curates template stacks for you.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCopilotThinking && (
                      <span className="flex items-center gap-1 text-xs text-white/70">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Searching
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-white/70 hover:text-white"
                      onClick={() => setIsCopilotOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {TEMPLATE_ASKS.map(item => (
                    <button
                      key={item}
                      className="whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:border-primary/40 hover:text-white transition"
                      onClick={() => handleQuickInsert(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div
                  ref={copilotScrollRef}
                  className="max-h-[260px] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                >
                  {copilotMessages.map(message => (
                    <div key={message.id} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "assistant"
                            ? "bg-white/10 text-white"
                            : "bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                          }`}
                      >
                        <p className="text-xs uppercase tracking-wide mb-1 opacity-70">
                          {message.role === "assistant" ? "Nova" : "You"}
                        </p>
                        <p>{message.content}</p>

                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.suggestions.map(template => (
                              <div key={template.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/80">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-white line-clamp-1">{template.title}</p>
                                    <p className="text-[11px] text-white/60 line-clamp-1">{template.description}</p>
                                  </div>
                                  {template.price === 0 ? (
                                    <span className="text-xs font-semibold text-emerald-300">Free</span>
                                  ) : (
                                    <span className="text-sm font-semibold text-primary">${template.price.toFixed(2)}</span>
                                  )}
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <Button
                                    size="sm"
                                    className="h-7 rounded-full px-3 text-xs"
                                    onClick={() => setActiveTemplate(template)}
                                  >
                                    Preview
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-7 rounded-full px-3 text-xs text-slate-900"
                                    onClick={handleUseTemplate}
                                  >
                                    Use Template
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isCopilotThinking && (
                    <p className="flex items-center gap-2 text-xs text-white/70">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Nova is mapping references to the templates library…
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 focus-within:border-primary/40">
                    <textarea
                      rows={1}
                      className="w-full resize-none bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
                      placeholder="Request a template for a workflow, channel, or team…"
                      value={copilotInput}
                      onChange={event => setCopilotInput(event.target.value)}
                      onKeyDown={handleComposerKeyDown}
                    />
                  </div>
                  <Button
                    className="w-full sm:w-auto rounded-full bg-primary px-6 font-semibold shadow-lg shadow-primary/40"
                    onClick={handleCopilotSend}
                    disabled={!copilotInput.trim() || isCopilotThinking}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default TemplatesIndexPage
