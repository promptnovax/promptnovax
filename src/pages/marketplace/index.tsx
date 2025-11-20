import type { KeyboardEvent } from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader"
import { FiltersBar } from "@/components/marketplace/FiltersBar"
import { PromptGrid } from "@/components/marketplace/PromptGrid"
import { useToast } from "@/hooks/use-toast"
import { usePromptActions } from "@/hooks/usePromptActions"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { generateProductImage, generateProductThumbnail } from "@/lib/marketplaceImages"
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  startAfter,
  DocumentSnapshot
} from "firebase/firestore"
import { Plus, X, Mic, AudioLines, MessageCircle, Send, Loader2 } from "lucide-react"

interface PromptData {
  id: string
  uid: string
  title: string
  description: string
  category: string
  tags: string[]
  difficulty: string
  visibility: boolean
  previewImageURL?: string
  fileURL?: string
  likes: string[]
  saves: string[]
  createdAt: any
  lastEditedAt?: any
  creatorName?: string
  creatorAvatar?: string
  price?: number
}

type CopilotMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  suggestions?: PromptData[]
}

const QUICK_INSIGHTS = [
  "Show me bestselling business prompts under $40",
  "I need a storytelling prompt for tech launch videos",
  "Suggest intermediate prompts for marketing teams",
  "What can help me audit code quality fast?",
  "Find prompts tuned for investor updates"
] as const

export function MarketplaceIndex() {
  const { success, error } = useToast()
  const { toggleLike, toggleSave, toggleFollow } = usePromptActions()
  
  // State
  const [prompts, setPrompts] = useState<PromptData[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)
  const [copilotInput, setCopilotInput] = useState("")
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      content: "I’m Nova. Tell me what kind of prompt you need and I’ll shortlist marketplace picks without taking over your screen."
    }
  ])
  const [isCopilotThinking, setIsCopilotThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const pendingReplyRef = useRef<number | null>(null)

  // Load prompts with filters
  const loadPrompts = useCallback(async (reset = false) => {
    if (!isFirebaseConfigured || !firebaseDb) {
      // Mock data for demo mode
      loadMockData()
      return
    }

    try {
      if (reset) {
        setLoading(true)
        setPrompts([])
        setLastDoc(null)
        setHasMore(true)
      } else {
        setLoadingMore(true)
      }

      setErrorMessage(null)

      // Build query
      let q = query(
        collection(firebaseDb, 'prompts'),
        where('visibility', '==', true)
      )

      // Apply category filter
      if (selectedCategory !== "all") {
        q = query(q, where('category', '==', selectedCategory))
      }

      // Apply difficulty filter
      if (selectedDifficulty !== "all") {
        q = query(q, where('difficulty', '==', selectedDifficulty))
      }

      // Apply sorting
      switch (sortBy) {
        case "newest":
          q = query(q, orderBy('createdAt', 'desc'))
          break
        case "oldest":
          q = query(q, orderBy('createdAt', 'asc'))
          break
        case "most_liked":
          q = query(q, orderBy('likes', 'desc'))
          break
        case "most_saved":
          q = query(q, orderBy('saves', 'desc'))
          break
        case "alphabetical":
          q = query(q, orderBy('title', 'asc'))
          break
        default:
          q = query(q, orderBy('createdAt', 'desc'))
      }

      // Apply pagination
      if (lastDoc && !reset) {
        q = query(q, startAfter(lastDoc))
      }

      q = query(q, limit(20))

      const snapshot = await getDocs(q)
      const newPrompts: PromptData[] = []

      for (const doc of snapshot.docs) {
        const data = doc.data()
        let creatorName = "Unknown User"
        let creatorAvatar = ""

        // Fetch creator info
        if (data.uid) {
          try {
            const userQuery = query(
              collection(firebaseDb, 'users'),
              where('__name__', '==', data.uid)
            )
            const userSnapshot = await getDocs(userQuery)
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data()
              creatorName = userData.displayName || userData.email?.split('@')[0] || "Unknown User"
              creatorAvatar = userData.photoURL || ""
            }
          } catch (err) {
            console.error('Error fetching user data:', err)
          }
        }

        newPrompts.push({
          id: doc.id,
          ...data,
          creatorName,
          creatorAvatar
        } as PromptData)
      }

      // Advanced search filter (client-side for now)
      let filteredPrompts = newPrompts
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const searchTerms = query.split(/\s+/).filter(term => term.length > 0)
        
        filteredPrompts = newPrompts.filter(prompt => {
          const searchText = [
            prompt.title,
            prompt.description,
            prompt.category,
            prompt.creatorName || "",
            ...prompt.tags
          ].join(" ").toLowerCase()
          
          // Match all search terms (AND logic) or any term (OR logic)
          // Using AND logic for more precise results
          return searchTerms.every(term => searchText.includes(term))
        })
      }

      if (reset) {
        setPrompts(filteredPrompts)
      } else {
        setPrompts(prev => [...prev, ...filteredPrompts])
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null)
      setHasMore(snapshot.docs.length === 20)

    } catch (err: any) {
      console.error('Error loading prompts:', err)
      setErrorMessage(err.message || "Failed to load prompts")
      error("Loading failed", "Failed to load prompts")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy, lastDoc, error])

  // Load mock data for demo mode
  const loadMockData = () => {
    const mockPrompts: PromptData[] = [
      {
        id: "1",
        uid: "user1",
        title: "Advanced Code Review Assistant",
        description: "Get comprehensive code reviews with suggestions for improvements, security vulnerabilities, and best practices. This prompt helps developers write better, more secure code by providing detailed feedback on their implementations.",
        category: "development",
        tags: ["code", "review", "security", "best-practices"],
        difficulty: "intermediate",
        visibility: true,
        previewImageURL: generateProductImage("development", "1", "Advanced Code Review Assistant"),
        fileURL: "https://example.com/sample-file.json",
        likes: ["user2", "user3", "user4"],
        saves: ["user5", "user6"],
        createdAt: new Date(),
        creatorName: "CodeMaster Pro",
        creatorAvatar: generateProductThumbnail("development", "user1", "CodeMaster Pro"),
        price: 29.99
      },
      {
        id: "2",
        uid: "user2",
        title: "Creative Writing Prompt Generator",
        description: "Generate unique and inspiring creative writing prompts for stories, poems, and essays. Perfect for writers looking for inspiration or creative exercises.",
        category: "writing",
        tags: ["creative", "writing", "storytelling", "inspiration"],
        difficulty: "beginner",
        visibility: true,
        previewImageURL: generateProductImage("writing", "2", "Creative Writing Prompt Generator"),
        likes: ["user1", "user3", "user5", "user7"],
        saves: ["user2", "user6", "user8"],
        createdAt: new Date(Date.now() - 86400000),
        creatorName: "Writer's Block",
        creatorAvatar: generateProductThumbnail("writing", "user2", "Writer's Block"),
        price: 19.99
      },
      {
        id: "3",
        uid: "user3",
        title: "Business Strategy Analyzer",
        description: "Analyze business strategies and provide insights on market positioning, competitive analysis, and growth opportunities. Ideal for entrepreneurs and business analysts.",
        category: "business",
        tags: ["business", "strategy", "analysis", "growth"],
        difficulty: "advanced",
        visibility: true,
        previewImageURL: generateProductImage("business", "3", "Business Strategy Analyzer"),
        likes: ["user1", "user4", "user9"],
        saves: ["user3", "user7", "user10"],
        createdAt: new Date(Date.now() - 172800000),
        creatorName: "Business Guru",
        creatorAvatar: generateProductThumbnail("business", "user3", "Business Guru"),
        price: 39.99
      },
      {
        id: "4",
        uid: "user4",
        title: "AI Content Marketing Assistant",
        description: "Create compelling marketing content for social media, blogs, and campaigns. Includes templates for different platforms and audience targeting strategies.",
        category: "marketing",
        tags: ["marketing", "content", "social-media", "seo"],
        difficulty: "intermediate",
        visibility: true,
        previewImageURL: generateProductImage("marketing", "4", "AI Content Marketing Assistant"),
        likes: ["user2", "user5", "user8"],
        saves: ["user4", "user6", "user11"],
        createdAt: new Date(Date.now() - 259200000),
        creatorName: "Marketing Pro",
        creatorAvatar: generateProductThumbnail("marketing", "user4", "Marketing Pro"),
        price: 24.99
      },
      {
        id: "5",
        uid: "user5",
        title: "Data Science Project Planner",
        description: "Plan and structure data science projects from data collection to model deployment. Includes best practices for data preprocessing, feature engineering, and model evaluation.",
        category: "data",
        tags: ["data-science", "machine-learning", "python", "analytics"],
        difficulty: "advanced",
        visibility: true,
        previewImageURL: generateProductImage("data", "5", "Data Science Project Planner"),
        likes: ["user1", "user3", "user6"],
        saves: ["user5", "user9", "user12"],
        createdAt: new Date(Date.now() - 345600000),
        creatorName: "Data Scientist",
        creatorAvatar: generateProductThumbnail("data", "user5", "Data Scientist"),
        price: 34.99
      },
      {
        id: "6",
        uid: "user6",
        title: "UI/UX Design Critique Assistant",
        description: "Get detailed feedback on UI/UX designs including usability, accessibility, and visual design principles. Perfect for designers looking to improve their work.",
        category: "design",
        tags: ["design", "ui", "ux", "accessibility"],
        difficulty: "intermediate",
        visibility: true,
        previewImageURL: generateProductImage("design", "6", "UI/UX Design Critique Assistant"),
        likes: ["user2", "user4", "user7"],
        saves: ["user6", "user8", "user10"],
        createdAt: new Date(Date.now() - 432000000),
        creatorName: "Design Expert",
        creatorAvatar: generateProductThumbnail("design", "user6", "Design Expert"),
        price: 27.99
      },
      {
        id: "7",
        uid: "user7",
        title: "AI Machine Learning Model Builder",
        description: "Build and optimize machine learning models with advanced techniques. Includes hyperparameter tuning, model selection, and performance optimization strategies.",
        category: "ai",
        tags: ["ai", "machine-learning", "neural-networks", "deep-learning"],
        difficulty: "advanced",
        visibility: true,
        previewImageURL: generateProductImage("ai", "7", "AI Machine Learning Model Builder"),
        likes: ["user1", "user2", "user5", "user8"],
        saves: ["user3", "user6", "user9"],
        createdAt: new Date(Date.now() - 518400000),
        creatorName: "AI Expert",
        creatorAvatar: generateProductThumbnail("ai", "user7", "AI Expert"),
        price: 44.99
      },
      {
        id: "8",
        uid: "user8",
        title: "Educational Course Planner",
        description: "Plan and structure educational courses with learning objectives, assessments, and curriculum design. Perfect for educators and course creators.",
        category: "education",
        tags: ["education", "course", "learning", "curriculum"],
        difficulty: "intermediate",
        visibility: true,
        previewImageURL: generateProductImage("education", "8", "Educational Course Planner"),
        likes: ["user2", "user4", "user6"],
        saves: ["user1", "user5", "user7"],
        createdAt: new Date(Date.now() - 604800000),
        creatorName: "EduMaster",
        creatorAvatar: generateProductThumbnail("education", "user8", "EduMaster"),
        price: 22.99
      },
      {
        id: "9",
        uid: "user9",
        title: "Fitness & Wellness Tracker",
        description: "Track fitness goals, nutrition plans, and wellness metrics. Includes workout plans, meal planning, and progress monitoring features.",
        category: "health",
        tags: ["fitness", "wellness", "health", "nutrition"],
        difficulty: "beginner",
        visibility: true,
        previewImageURL: generateProductImage("health", "9", "Fitness & Wellness Tracker"),
        likes: ["user3", "user5", "user7", "user10"],
        saves: ["user2", "user4", "user8"],
        createdAt: new Date(Date.now() - 691200000),
        creatorName: "Fitness Pro",
        creatorAvatar: generateProductThumbnail("health", "user9", "Fitness Pro"),
        price: 17.99
      },
      {
        id: "10",
        uid: "user10",
        title: "Full-Stack Web Development Guide",
        description: "Complete guide for full-stack web development covering frontend, backend, databases, and deployment strategies. Perfect for aspiring developers.",
        category: "development",
        tags: ["web-development", "full-stack", "javascript", "nodejs"],
        difficulty: "intermediate",
        visibility: true,
        previewImageURL: generateProductImage("development", "10", "Full-Stack Web Development Guide"),
        likes: ["user1", "user2", "user6"],
        saves: ["user3", "user5", "user9"],
        createdAt: new Date(Date.now() - 777600000),
        creatorName: "DevMaster",
        creatorAvatar: generateProductThumbnail("development", "user10", "DevMaster"),
        price: 32.99
      }
    ]

    // Apply filters to mock data
    let filteredPrompts = mockPrompts

    if (selectedCategory !== "all") {
      filteredPrompts = filteredPrompts.filter(p => p.category === selectedCategory)
    }

    if (selectedDifficulty !== "all") {
      filteredPrompts = filteredPrompts.filter(p => p.difficulty === selectedDifficulty)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      const searchTerms = query.split(/\s+/).filter(term => term.length > 0)
      
      filteredPrompts = filteredPrompts.filter(prompt => {
        const searchText = [
          prompt.title,
          prompt.description,
          prompt.category,
          prompt.creatorName || "",
          ...prompt.tags
        ].join(" ").toLowerCase()
        
        // Match all search terms for precise results
        return searchTerms.every(term => searchText.includes(term))
      })
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filteredPrompts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case "oldest":
        filteredPrompts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case "most_liked":
        filteredPrompts.sort((a, b) => b.likes.length - a.likes.length)
        break
      case "most_saved":
        filteredPrompts.sort((a, b) => b.saves.length - a.saves.length)
        break
      case "alphabetical":
        filteredPrompts.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setPrompts(filteredPrompts)
    setLoading(false)
    setHasMore(false)
  }

  // Load prompts when filters change
  useEffect(() => {
    loadPrompts(true)
  }, [selectedCategory, selectedDifficulty, sortBy])

  // Load prompts when search changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPrompts(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Load more prompts
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadPrompts(false)
    }
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSortBy("newest")
  }

  // Refresh prompts
  const handleRefresh = () => {
    loadPrompts(true)
  }

  // Handle like
  const handleLike = (promptId: string) => {
    toggleLike(promptId)
  }

  // Handle save
  const handleSave = (promptId: string) => {
    toggleSave(promptId)
  }

  // Handle share
  const handleShare = (promptId: string) => {
    // TODO: Implement share functionality
    console.log('Share prompt:', promptId)
  }

  // Handle follow
  const handleFollow = (userId: string) => {
    toggleFollow(userId)
  }

  const availablePrompts = prompts.length ? prompts : []

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    })
  }, [copilotMessages, isCopilotThinking])

  useEffect(() => {
    return () => {
      if (pendingReplyRef.current) {
        clearTimeout(pendingReplyRef.current)
      }
    }
  }, [])

  const handleCopilotSend = () => {
    const trimmed = copilotInput.trim()
    if (!trimmed || isCopilotThinking) return

    const userMessage: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed
    }

    setCopilotMessages(prev => [...prev, userMessage])
    setCopilotInput("")
    setIsCopilotThinking(true)

    const matchingPrompts = availablePrompts
      .filter(prompt => {
        const haystack = `${prompt.title} ${prompt.description} ${prompt.category} ${(prompt.tags || []).join(" ")} ${prompt.creatorName || ""}`
        return haystack.toLowerCase().includes(trimmed.toLowerCase())
      })
      .slice(0, 3)

    const assistantText =
      matchingPrompts.length > 0
        ? `Here ${matchingPrompts.length > 1 ? "are" : "is"} what matches “${trimmed}”.`
        : `I don’t see an exact hit for “${trimmed}”, but these marketplace prompts are worth a look.`

    const reply = () => {
      setCopilotMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: assistantText,
          suggestions: matchingPrompts.length > 0 ? matchingPrompts : availablePrompts.slice(0, 3)
        }
      ])
      setIsCopilotThinking(false)
      pendingReplyRef.current = null
    }

    const timeoutId =
      typeof window !== "undefined"
        ? window.setTimeout(reply, 500)
        : (setTimeout(reply, 500) as unknown as number)

    pendingReplyRef.current = timeoutId
  }

  const handlePromptOpen = (promptId: string) => {
    if (typeof window === "undefined") return
    window.location.hash = `#marketplace/${promptId}`
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MarketplaceHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Filters Bar */}
        <FiltersBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          resultCount={prompts.length}
          onClearFilters={handleClearFilters}
        />

        {/* Prompt Grid */}
        <PromptGrid
          prompts={prompts}
          loading={loading}
          error={errorMessage}
          viewMode={viewMode}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          onRefresh={handleRefresh}
          onLike={handleLike}
          onSave={handleSave}
          onShare={handleShare}
          onFollow={handleFollow}
        />
      </div>

      {/* Floating Copilot Bar */}
      <div className="fixed inset-x-0 bottom-5 z-40 px-4 pointer-events-none">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="mx-auto max-w-4xl pointer-events-auto"
        >
          {!isCopilotOpen ? (
            <button
              className="w-full flex items-center justify-between rounded-full bg-slate-950/75 border border-white/10 backdrop-blur-2xl shadow-[0_25px_60px_rgba(2,6,23,0.65)] px-5 py-3 text-left text-white transition hover:border-primary/40"
              onClick={() => setIsCopilotOpen(true)}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="text-sm text-white/80">Ask anything…</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                <Mic className="h-4 w-4" />
                <AudioLines className="h-5 w-5" />
              </div>
            </button>
          ) : (
            <div className="rounded-[32px] border border-white/10 bg-slate-950/90 backdrop-blur-2xl shadow-[0_35px_90px_rgba(2,6,23,0.75)] p-6 space-y-4 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.5em] text-white/50">Marketplace Copilot</p>
                  <p className="text-sm text-white/80">Stay on the marketplace while Nova curates prompts for you.</p>
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
                    className="text-white/70 hover:text-white rounded-full"
                    onClick={() => setIsCopilotOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {QUICK_INSIGHTS.map(chip => (
                  <button
                    key={chip}
                    className="whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:border-primary/40 hover:text-white transition"
                    onClick={() => handleQuickInsert(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div
                ref={scrollRef}
                className="max-h-[260px] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              >
                {copilotMessages.map(message => (
                  <div key={message.id} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        message.role === "assistant"
                          ? "bg-white/10 text-white"
                          : "bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide mb-1 opacity-70">
                        {message.role === "assistant" ? (
                          <>
                            <MessageCircle className="h-3.5 w-3.5" />
                            Nova
                          </>
                        ) : (
                          "You"
                        )}
                      </div>
                      <p>{message.content}</p>

                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map(suggestion => (
                            <div key={suggestion.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/80">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-white line-clamp-1">{suggestion.title}</p>
                                  <p className="text-[11px] text-white/60 line-clamp-1">{suggestion.description}</p>
                                </div>
                                {typeof suggestion.price === "number" && (
                                  <span className="text-sm font-semibold text-primary">${suggestion.price.toFixed(2)}</span>
                                )}
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Button
                                  size="sm"
                                  className="h-7 rounded-full px-3 text-xs"
                                  onClick={() => handlePromptOpen(suggestion.id)}
                                >
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="h-7 rounded-full px-3 text-xs text-slate-900"
                                  onClick={() => handleSave(suggestion.id)}
                                >
                                  Save
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
                    Nova is mapping your request to marketplace data…
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 focus-within:border-primary/40">
                  <textarea
                    rows={1}
                    className="w-full resize-none bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
                    placeholder="Ask for a specific use case or prompt style…"
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
    </div>
  )
}
