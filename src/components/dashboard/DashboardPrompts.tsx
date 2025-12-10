import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { 
  collection, 
  query, 
  where, 
  orderBy,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc
} from "@/lib/platformStubs/firestore"
import { platformDb, isSupabaseConfigured } from "@/lib/platformClient"
import { 
  FileText,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Heart,
  Calendar,
  Loader2,
  Plus,
  AlertCircle
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

export function DashboardPrompts() {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [prompts, setPrompts] = useState<PromptData[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<PromptData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "likes">("newest")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Load user's prompts
  const loadPrompts = async () => {
    if (!currentUser) {
      setLoading(false)
      return
    }

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
        where('uid', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      )

      const unsubscribe = onSnapshot(promptsQuery, (snapshot) => {
        const promptList: PromptData[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as PromptData))

        setPrompts(promptList)
        setLoading(false)
      })

      return unsubscribe
    } catch (err: any) {
      console.error('Error loading prompts:', err)
      error("Loading failed", "Failed to load your prompts")
      setLoading(false)
    }
  }

  // Load mock data for demo mode
  const loadMockPrompts = () => {
    const mockPrompts: PromptData[] = [
      {
        id: "1",
        uid: currentUser?.uid || "user1",
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
        uid: currentUser?.uid || "user1",
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
        uid: currentUser?.uid || "user1",
        title: "Business Strategy Analyzer",
        description: "Analyze business strategies and provide insights on market positioning, competitive analysis, and growth opportunities.",
        category: "business",
        tags: ["business", "strategy", "analysis"],
        difficulty: "advanced",
        visibility: false,
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
      case "likes":
        filtered.sort((a, b) => b.likes.length - a.likes.length)
        break
    }

    setFilteredPrompts(filtered)
  }, [prompts, searchQuery, sortBy])

  // Delete prompt
  const handleDeletePrompt = async (promptId: string) => {
    if (!isSupabaseConfigured || !platformDb) {
      // Demo mode - just remove from local state
      setPrompts(prev => prev.filter(p => p.id !== promptId))
      success("Deleted", "Prompt deleted successfully")
      return
    }

    setDeletingId(promptId)
    try {
      await deleteDoc(doc(platformDb, 'prompts', promptId))
      success("Deleted", "Prompt deleted successfully")
    } catch (err: any) {
      console.error('Error deleting prompt:', err)
      error("Delete failed", "Failed to delete prompt")
    } finally {
      setDeletingId(null)
    }
  }

  // Edit prompt
  const handleEditPrompt = (promptId: string) => {
    window.location.hash = `#prompts/edit/${promptId}`
  }

  // View prompt
  const handleViewPrompt = (promptId: string) => {
    window.location.hash = `#prompts/${promptId}`
  }

  // Load prompts on mount
  useEffect(() => {
    const unsubscribe = loadPrompts()
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [currentUser])

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Prompts</h1>
          <p className="text-muted-foreground">Manage your created prompts</p>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 bg-muted rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                        <div className="flex gap-2">
                          <div className="h-6 w-16 bg-muted rounded"></div>
                          <div className="h-6 w-20 bg-muted rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">My Prompts</h1>
          <p className="text-muted-foreground">
            Manage your created prompts ({filteredPrompts.length} total)
          </p>
        </div>
        <Button onClick={() => window.location.hash = "#prompts/create"}>
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
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
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "likes")}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="likes">Most Liked</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Prompts List */}
      {filteredPrompts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">
                  {prompts.length === 0 ? "No prompts yet" : "No prompts found"}
                </h3>
                <p className="text-muted-foreground">
                  {prompts.length === 0 
                    ? "Start creating prompts to see them here."
                    : "Try adjusting your search or filters."
                  }
                </p>
                <Button onClick={() => window.location.hash = "#prompts/create"}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Prompt
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        {prompt.previewImageURL ? (
                          <img
                            src={prompt.previewImageURL}
                            alt={prompt.title}
                            className="h-16 w-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg line-clamp-1">
                              {prompt.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {prompt.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {!prompt.visibility && (
                              <Badge variant="outline" className="text-xs">
                                Private
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Tags and Meta */}
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryLabel(prompt.category)}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getDifficultyColor(prompt.difficulty)}`}
                          >
                            {prompt.difficulty}
                          </Badge>
                          {prompt.tags.slice(0, 2).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {prompt.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{prompt.tags.length - 2}
                            </Badge>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {prompt.likes.length}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {Math.floor(Math.random() * 100) + prompt.likes.length * 2}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(prompt.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPrompt(prompt.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPrompt(prompt.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePrompt(prompt.id)}
                          disabled={deletingId === prompt.id}
                        >
                          {deletingId === prompt.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
