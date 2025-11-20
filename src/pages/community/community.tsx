import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "@/components/ui/link"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { membershipSteps, communityStats, charterPrinciples, guidelineTabs, liveChatMessages } from "@/pages/community/constants"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  Globe,
  Heart,
  Lightbulb,
  MessageCircle,
  Plus,
  Search,
  Star,
  TrendingUp,
  Users,
  Zap
} from "lucide-react"

export function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeGuidelineTab, setActiveGuidelineTab] = useState("guidelines")
  const { success } = useToast()

  const navigateTo = (page: string) => {
    window.dispatchEvent(
      new CustomEvent("navigate", {
        detail: { href: page }
      })
    )
  }

  const categories = [
    { value: "all", label: "All Signals", icon: Globe, count: 156, description: "Latest threads across HQ" },
    { value: "trending", label: "Trending", icon: TrendingUp, count: 23, description: "Most active dialogs this week" },
    { value: "ai", label: "AI Ops", icon: Zap, count: 45, description: "Model deep dives, benchmarks, infrastructure" },
    { value: "coding", label: "Build Logs", icon: Lightbulb, count: 32, description: "Workflow automation and code reviews" },
    { value: "design", label: "Creative Pods", icon: Users, count: 28, description: "Visual systems, Midjourney, brand labs" },
    { value: "tutorials", label: "Playbooks", icon: BookOpen, count: 19, description: "How-tos, SOPs and teardown recaps" }
  ]

  const programs = [
    {
      title: "Live Teardowns",
      description: "Submit your prompt, workflow or launch deck. Mentors reverse-engineer it live.",
      slots: "Weekly · 8 seats",
      accent: "from-indigo-500/10 to-primary/10"
    },
    {
      title: "Signals Newsletter",
      description: "Curated digest of the sharpest builds, decks, hires and market intel from inside the community.",
      slots: "Delivered every Monday",
      accent: "from-emerald-500/10 to-cyan-500/10"
    },
    {
      title: "Partner Pods",
      description: "Small-group accountability sprints for GTM, design systems and ops automation.",
      slots: "Cohorts reset monthly",
      accent: "from-orange-500/10 to-rose-500/10"
    }
  ]

  const posts = [
    {
      id: "1",
      title: "Advanced Prompt Engineering Techniques for Better AI Responses",
      description: "Learn how to craft prompts that get more accurate and detailed responses from language models. This comprehensive guide covers everything from basic principles to advanced techniques.",
      author: {
        name: "Alex Chen",
        avatar: "https://github.com/shadcn.png",
        verified: true
      },
      category: "ai",
      tags: ["prompt-engineering", "ai", "tutorial"],
      stats: {
        likes: 42,
        comments: 18,
        views: 234
      },
      timeAgo: "2 hours ago",
      isLiked: false,
      isBookmarked: false
    },
    {
      id: "2",
      title: "Building a SaaS Dashboard with React and Tailwind CSS",
      description: "Step-by-step tutorial on creating a modern, responsive dashboard interface. Includes authentication, data visualization, and real-time updates.",
      author: {
        name: "Sarah Johnson",
        avatar: "https://github.com/shadcn.png",
        verified: true
      },
      category: "coding",
      tags: ["react", "tailwind", "dashboard", "tutorial"],
      stats: {
        likes: 38,
        comments: 12,
        views: 189
      },
      timeAgo: "4 hours ago",
      isLiked: true,
      isBookmarked: false
    },
    {
      id: "3",
      title: "The Future of AI in Creative Industries",
      description: "Exploring how artificial intelligence is transforming creative workflows in design, writing, and content creation. Real-world examples and case studies.",
      author: {
        name: "Marcus Rivera",
        avatar: "https://github.com/shadcn.png",
        verified: false
      },
      category: "design",
      tags: ["ai", "creativity", "future", "industry"],
      stats: {
        likes: 29,
        comments: 7,
        views: 156
      },
      timeAgo: "6 hours ago",
      isLiked: false,
      isBookmarked: true
    },
    {
      id: "4",
      title: "Midjourney Prompt Library: 50+ High-Quality Prompts",
      description: "Curated collection of proven prompts for different art styles, subjects, and moods. Perfect for artists and designers looking to expand their creative toolkit.",
      author: {
        name: "Emma Wilson",
        avatar: "https://github.com/shadcn.png",
        verified: true
      },
      category: "design",
      tags: ["midjourney", "prompts", "art", "design"],
      stats: {
        likes: 67,
        comments: 23,
        views: 445
      },
      timeAgo: "8 hours ago",
      isLiked: true,
      isBookmarked: false
    },
    {
      id: "5",
      title: "Automating Content Creation with AI: A Complete Workflow",
      description: "How to set up automated content pipelines using various AI tools. From ideation to publication, streamline your content creation process.",
      author: {
        name: "David Kim",
        avatar: "https://github.com/shadcn.png",
        verified: true
      },
      category: "ai",
      tags: ["automation", "content", "workflow", "ai"],
      stats: {
        likes: 34,
        comments: 15,
        views: 278
      },
      timeAgo: "12 hours ago",
      isLiked: false,
      isBookmarked: false
    }
  ]

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleLike = (postId: string) => {
    success("Post liked!", "Thanks for your engagement")
  }

  const handleBookmark = (postId: string) => {
    success("Post bookmarked!", "Saved to your bookmarks")
  }

  const handleNewPost = () => {
    success("New Post clicked!", "Redirecting to post creation...")
  }

  const handleJoinCommunity = () => {
    setShowLivePreview(true)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,123,255,0.12),_transparent_55%)]">
      <header className="sticky top-20 md:top-[5.25rem] z-30 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">PromptNovaX Community</p>
            <h1 className="text-3xl font-semibold leading-tight">The HQ where AI operators ship together</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              {filteredPosts.length} live posts
            </Badge>
            <Button onClick={handleNewPost} className="gap-2">
              <Plus className="h-4 w-4" />
              Share update
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-12 px-4 py-10">
        <section className="grid gap-6 rounded-3xl border border-border bg-background/90 p-6 shadow-xl shadow-primary/5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="rounded-full border-primary/30 text-primary">
                Community Launchpad
              </Badge>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                Built for founders, prompt engineers, growth and creative operators.
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Access the main PromptNovaX community HQ, align on guidelines, enroll into pods and step directly into the live chat
                experience where every message is signal.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {communityStats.map(stat => (
                <Card key={stat.label} className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs uppercase tracking-wide">{stat.label}</CardDescription>
                    <CardTitle className="text-3xl">{stat.value}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-primary">{stat.growth}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" onClick={() => navigateTo("community/hq")}>
                Enter main community
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-dashed border-primary/40 text-primary"
                onClick={() => navigateTo("community/guidelines")}
              >
                Review membership brief
              </Button>
            </div>
          </div>

          <Card className="border-primary/20 bg-gradient-to-b from-primary/10 to-background">
            <CardHeader>
              <CardTitle>Membership runway</CardTitle>
              <CardDescription>Everything you need before stepping inside HQ.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {membershipSteps.map(step => (
                <button
                  key={step.title}
                  onClick={() => navigateTo(step.target)}
                  className="w-full rounded-2xl border border-dashed border-primary/20 p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{step.title}</p>
                    <Badge variant="secondary">{step.cta}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </button>
              ))}
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                150 new members onboarded this month
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-primary/20">
            <CardHeader className="flex flex-col gap-2">
              <Badge variant="outline" className="w-fit border-primary/30 text-primary">
                Community Guardrails
              </Badge>
              <CardTitle>Guidelines, rules & perks</CardTitle>
              <CardDescription>
                Before you post in HQ, align with the charter. Trusted operators keep this space sharp.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeGuidelineTab} onValueChange={setActiveGuidelineTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
                  <TabsTrigger value="rules">Rules</TabsTrigger>
                  <TabsTrigger value="perks">Perks</TabsTrigger>
                </TabsList>
                {Object.entries(guidelineTabs).map(([key, items]) => (
                  <TabsContent key={key} value={key} className="space-y-3 pt-4">
                    {items.map(item => (
                      <div key={item} className="flex gap-3 rounded-xl border border-border/60 bg-muted/30 p-3 text-sm">
                        <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
                        <p>{item}</p>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background">
            <CardHeader>
              <CardTitle>Community charter</CardTitle>
              <CardDescription>The 3 principles that keep PromptNovaX professional.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {charterPrinciples.map(principle => (
                <div key={principle.title} className="rounded-2xl border border-dashed border-primary/30 p-4">
                  <p className="text-sm font-semibold">{principle.title}</p>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Live programs</CardTitle>
              <CardDescription>Recurring experiences curated for members.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {programs.map(program => (
                <div
                  key={program.title}
                  className={`rounded-2xl border border-primary/20 bg-gradient-to-br ${program.accent} p-4`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{program.title}</p>
                    <Badge variant="outline" className="border-primary/40 text-primary">
                      {program.slots}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{program.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Signal tracker</CardTitle>
                <CardDescription>Search threads, filter by focus and review top discussions.</CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search prompts, deals, pods..."
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3 lg:grid-cols-3">
                {categories.map(category => {
                  const Icon = category.icon
                  const isActive = selectedCategory === category.value
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`rounded-2xl border p-3 text-left transition-all ${
                        isActive ? "border-primary bg-primary/5" : "hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <p className="text-sm font-semibold">{category.label}</p>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {category.count}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{category.description}</p>
                    </button>
                  )
                })}
              </div>
              <Separator />
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <Card key={post.id} className="border-border/80 bg-muted/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {categories.find(c => c.value === post.category)?.label}
                        </Badge>
                        {post.author.verified && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <Star className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">
                        <Link href={`#community/${post.id}`}>{post.title}</Link>
                      </CardTitle>
                      <CardDescription>{post.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">{post.author.name}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {post.timeAgo}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <button
                          className={`flex items-center gap-1 rounded-full px-2 py-1 transition-colors ${
                            post.isLiked ? "text-red-500" : "hover:text-primary"
                          }`}
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                          {post.stats.likes}
                        </button>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.stats.comments}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.stats.views}
                        </div>
                        <button
                          className={`rounded-full px-2 py-1 ${
                            post.isBookmarked ? "bg-primary/10 text-primary" : "hover:text-primary"
                          }`}
                          onClick={() => handleBookmark(post.id)}
                        >
                          <Star className={`h-4 w-4 ${post.isBookmarked ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredPosts.length === 0 && (
                <div className="rounded-2xl border border-dashed p-10 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-lg font-semibold">No threads match those filters</p>
                  <p className="text-sm text-muted-foreground">Reset filters to view the full feed.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle>Community desk</CardTitle>
              <CardDescription>Need a rule clarified? Want to host a takeover? Ping the desk.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Guideline updates", detail: "Weekly & as needed", link: "View changelog", target: "community/desk/changelog" },
                { title: "Moderation window", detail: "24/7 global coverage", link: "Meet the team", target: "community/desk/team" },
                { title: "Escalation SLA", detail: "< 10 minutes on critical flags", link: "Open ticket", target: "community/desk/escalations" }
              ].map(item => (
                <div key={item.title} className="flex items-center justify-between rounded-2xl border border-border/70 p-3">
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <Button variant="ghost" className="gap-1" onClick={() => navigateTo(item.target)}>
                    {item.link}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/30">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  Live HQ Preview
                </Badge>
                <CardTitle>See what members are shipping right now</CardTitle>
                <CardDescription>A real-time glimpse inside the community chat.</CardDescription>
              </div>
              <Button variant="default" className="gap-2" onClick={() => navigateTo("community/hq")}>
                Experience live community
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 rounded-3xl border border-border/80 bg-muted/30 p-4">
                {liveChatMessages.map(message => (
                  <div key={message.author} className="rounded-2xl border border-dashed border-primary/30 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        {message.badge}
                      </Badge>
                      <p className="font-semibold">{message.author}</p>
                      <span className="text-xs text-muted-foreground">{message.role}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{message.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

    </div>
  )
}
