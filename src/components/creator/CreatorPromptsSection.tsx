import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  collection, 
  query, 
  where, 
  orderBy,
  getDocs
} from "@/lib/platformStubs/firestore"
import { platformDb, isSupabaseConfigured } from "@/lib/platformClient"
import { 
  FileText,
  Search,
  Filter,
  Heart,
  Eye,
  Calendar,
  Loader2,
  TrendingUp,
  Clock,
  Star
} from "lucide-react"

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
}

interface CreatorPromptsSectionProps {
  creatorId: string
}

export function CreatorPromptsSection({ creatorId }: CreatorPromptsSectionProps) {
  const [prompts, setPrompts] = useState<PromptData[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<PromptData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular" | "top-rated">("newest")

  // Load creator's prompts
  const loadPrompts = async () => {
    if (!isSupabaseConfigured || !platformDb) {
      // Demo mode - show mock data
      loadMockPrompts()
      return
    }

    try {
      setLoading(true)

      const promptsRef = collection(platformDb, 'prompts')
      const promptsQuery = query(
        promptsRef,
        where('uid', '==', creatorId),
        where('visibility', '==', true), // Only public prompts
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(promptsQuery)
      const promptList: PromptData[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PromptData))

      setPrompts(promptList)
    } catch (err: any) {
      console.error('Error loading prompts:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load mock data for demo mode
  const loadMockPrompts = () => {
    const mockPrompts: PromptData[] = [
      {
        id: "1",
        uid: creatorId,
        title: "Advanced Code Review Assistant",
        description: "Get comprehensive code reviews with suggestions for improvements, security vulnerabilities, and best practices.",
        category: "development",
        tags: ["code", "review", "security"],
        difficulty: "intermediate",
        visibility: true,
        previewImageURL: "https://github.com/shadcn.png",
        likes: ["user2", "user3", "user4"],
        saves: ["user5", "user6"],
        createdAt: new Date(),
        lastEditedAt: new Date()
      },
      {
        id: "2",
        uid: creatorId,
        title: "Creative Writing Prompt Generator",
        description: "Generate unique and inspiring creative writing prompts for stories, poems, and essays.",
        category: "writing",
        tags: ["creative", "writing", "storytelling"],
        difficulty: "beginner",
        visibility: true,
        previewImageURL: "https://github.com/shadcn.png",
        likes: ["user1", "user3", "user5"],
        saves: ["user2", "user6"],
        createdAt: new Date(Date.now() - 86400000),
        lastEditedAt: new Date(Date.now() - 3600000)
      },
      {
        id: "3",
        uid: creatorId,
        title: "Business Strategy Analyzer",
        description: "Analyze business strategies and provide insights on market positioning, competitive analysis, and growth opportunities.",
        category: "business",
        tags: ["business", "strategy", "analysis"],
        difficulty: "advanced",
        visibility: true,
        previewImageURL: "https://github.com/shadcn.png",
        likes: ["user1", "user4"],
        saves: ["user3", "user7"],
        createdAt: new Date(Date.now() - 172800000),
        lastEditedAt: new Date(Date.now() - 7200000)
      }
    ]
    
    setPrompts(mockPrompts)
    setLoading(false)
  }

  // Filter and sort prompts
  useEffect(() => {
    let filtered = [...prompts]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime())
        break
      case "oldest":
        filtered.sort((a, b) => a.createdAt.toDate().getTime() - b.createdAt.toDate().getTime())
        break
      case "popular":
        filtered.sort((a, b) => b.likes.length - a.likes.length)
        break
      case "top-rated":
        filtered.sort((a, b) => (b.likes.length + b.saves.length) - (a.likes.length + a.saves.length))
        break
    }

    setFilteredPrompts(filtered)
  }, [prompts, searchQuery, sortBy])

  // Load prompts on mount
  useEffect(() => {
    loadPrompts()
  }, [creatorId])

  const formatDate = (date: any) => {
    if (!date) return "Unknown"
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      development: "Development",
      writing: "Writing",
      business: "Business",
      ai: "AI & ML",
      marketing: "Marketing",
      data: "Data Science",
      design: "Design",
      education: "Education",
      health: "Health & Fitness",
      other: "Other"
    }
    return categories[category] || category
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Creator's Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="animate-pulse">
                      <div className="h-48 bg-muted rounded mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-4"></div>
                      <div className="flex gap-2 mb-4">
                        <div className="h-6 w-16 bg-muted rounded"></div>
                        <div className="h-6 w-20 bg-muted rounded"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-4 w-16 bg-muted rounded"></div>
                        <div className="h-4 w-12 bg-muted rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator's Prompts</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Popular</option>
              <option value="top-rated">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Prompts Grid */}
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {prompts.length === 0 ? "No prompts yet" : "No prompts found"}
            </h3>
            <p className="text-muted-foreground">
              {prompts.length === 0 
                ? "This creator hasn't published any prompts yet."
                : "Try adjusting your search or filters."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPrompts.map((prompt, index) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => window.location.hash = `#prompts/${prompt.id}`}
                  >
                    {/* Image Header */}
                    <div className="relative">
                      {prompt.previewImageURL ? (
                        <img
                          src={prompt.previewImageURL}
                          alt={prompt.title}
                          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/10 rounded-t-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🤖</div>
                            <p className="text-sm text-muted-foreground">AI Prompt</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <Badge variant="secondary" className="capitalize">
                          {getCategoryLabel(prompt.category)}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${getDifficultyColor(prompt.difficulty)}`}
                        >
                          {prompt.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      {/* Title and Description */}
                      <div className="space-y-2 mb-4">
                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                          {prompt.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {prompt.description}
                        </p>
                      </div>

                      {/* Tags */}
                      {prompt.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {prompt.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {prompt.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{prompt.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {prompt.likes.length}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {Math.floor(Math.random() * 100) + prompt.likes.length * 2}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(prompt.createdAt)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
