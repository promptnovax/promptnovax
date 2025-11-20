import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PromptPreviewModal } from "@/components/PromptPreviewModal"
import { Sparkles, TrendingUp, Image, PenTool, Code } from "lucide-react"

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
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=1200&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?w=1200&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1200&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop",
    prompt:
      "Create a video storyboard for {concept}. Include scene list with camera motion, subject details, environment, lighting, transitions, voiceover cues. Style {style}. Duration {seconds}.",
    tags: ["Video", "Storyboard"],
    metrics: "🎬 Production ready"
  }
];

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

  return (
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
                      onClick={() => setActiveTemplate(template)}
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
                            setActiveTemplate(template)
                          }}>
                            Preview
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
  )
}

export default TemplatesIndexPage
