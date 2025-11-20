import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PromptCard } from "./PromptCard"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { collection, query, where, orderBy, limit, getDocs, onSnapshot } from "firebase/firestore"
import { 
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Loader2,
  FileText,
  SortAsc,
  SortDesc
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
  creatorName?: string
  creatorAvatar?: string
}

interface PromptListProps {
  userId?: string // If provided, shows only prompts from this user
  showCreateButton?: boolean
  onEdit?: (promptId: string) => void
  onDelete?: (promptId: string) => void
  onLike?: (promptId: string) => void
  onSave?: (promptId: string) => void
  onShare?: (promptId: string) => void
  className?: string
}

export function PromptList({ 
  userId, 
  showCreateButton = false, 
  onEdit, 
  onDelete, 
  onLike, 
  onSave, 
  onShare,
  className = ""
}: PromptListProps) {
  const { currentUser } = useAuth()
  const { error } = useToast()
  
  const [prompts, setPrompts] = useState<PromptData[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<PromptData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "development", label: "Development" },
    { value: "writing", label: "Writing" },
    { value: "business", label: "Business" },
    { value: "ai", label: "AI & ML" },
    { value: "marketing", label: "Marketing" },
    { value: "data", label: "Data Science" },
    { value: "design", label: "Design" },
    { value: "education", label: "Education" },
    { value: "health", label: "Health & Fitness" },
    { value: "other", label: "Other" }
  ]

  const difficulties = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most_liked", label: "Most Liked" },
    { value: "most_saved", label: "Most Saved" },
    { value: "alphabetical", label: "A-Z" }
  ]

  useEffect(() => {
    loadPrompts()
  }, [userId])

  useEffect(() => {
    filterAndSortPrompts()
  }, [prompts, searchQuery, selectedCategory, selectedDifficulty, sortBy])

  const loadPrompts = async () => {
    if (!isFirebaseConfigured || !firebaseDb) {
      // Mock data for demo mode
      loadMockData()
      return
    }

    try {
      setLoading(true)
      
      let q = query(
        collection(firebaseDb, 'prompts'),
        where('visibility', '==', true), // Only public prompts
        orderBy('createdAt', 'desc'),
        limit(50)
      )

      // If userId is provided, filter by user
      if (userId) {
        q = query(
          collection(firebaseDb, 'prompts'),
          where('uid', '==', userId),
          orderBy('createdAt', 'desc')
        )
      }

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const promptsData: PromptData[] = []
        
        for (const doc of snapshot.docs) {
          const data = doc.data()
          let creatorName = "Unknown User"
          let creatorAvatar = ""

          // Fetch creator info
          if (data.uid) {
            try {
              const userDoc = await getDocs(query(
                collection(firebaseDb, 'users'),
                where('__name__', '==', data.uid)
              ))
              if (!userDoc.empty) {
                const userData = userDoc.docs[0].data()
                creatorName = userData.displayName || userData.email?.split('@')[0] || "Unknown User"
                creatorAvatar = userData.photoURL || ""
              }
            } catch (err) {
              console.error('Error fetching user data:', err)
            }
          }

          promptsData.push({
            id: doc.id,
            ...data,
            creatorName,
            creatorAvatar
          } as PromptData)
        }

        setPrompts(promptsData)
      })

      return () => unsubscribe()
    } catch (err: any) {
      console.error('Error loading prompts:', err)
      error("Loading failed", "Failed to load prompts")
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    const mockPrompts: PromptData[] = [
      {
        id: "1",
        uid: "user1",
        title: "Advanced Code Review Assistant",
        description: "Get comprehensive code reviews with suggestions for improvements, security vulnerabilities, and best practices.",
        category: "development",
        tags: ["code", "review", "security", "best-practices"],
        difficulty: "intermediate",
        visibility: true,
        previewImageURL: "https://github.com/shadcn.png",
        likes: ["user2", "user3"],
        saves: ["user4"],
        createdAt: new Date(),
        creatorName: "CodeMaster Pro",
        creatorAvatar: "https://github.com/shadcn.png"
      },
      {
        id: "2",
        uid: "user2",
        title: "Creative Writing Prompt Generator",
        description: "Generate unique and inspiring creative writing prompts for stories, poems, and essays.",
        category: "writing",
        tags: ["creative", "writing", "storytelling", "inspiration"],
        difficulty: "beginner",
        visibility: true,
        previewImageURL: "https://github.com/shadcn.png",
        likes: ["user1", "user3", "user5"],
        saves: ["user2", "user6"],
        createdAt: new Date(Date.now() - 86400000),
        creatorName: "Writer's Block",
        creatorAvatar: "https://github.com/shadcn.png"
      },
      {
        id: "3",
        uid: "user3",
        title: "Business Strategy Analyzer",
        description: "Analyze business strategies and provide insights on market positioning, competitive analysis, and growth opportunities.",
        category: "business",
        tags: ["business", "strategy", "analysis", "growth"],
        difficulty: "advanced",
        visibility: true,
        previewImageURL: "https://github.com/shadcn.png",
        likes: ["user1", "user4"],
        saves: ["user3", "user7"],
        createdAt: new Date(Date.now() - 172800000),
        creatorName: "Business Guru",
        creatorAvatar: "https://github.com/shadcn.png"
      }
    ]

    setPrompts(mockPrompts)
    setLoading(false)
  }

  const filterAndSortPrompts = () => {
    let filtered = [...prompts]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory)
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(prompt => prompt.difficulty === selectedDifficulty)
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.createdAt?.toDate?.()?.getTime() || 0 - (a.createdAt?.toDate?.()?.getTime() || 0))
        break
      case "oldest":
        filtered.sort((a, b) => a.createdAt?.toDate?.()?.getTime() || 0 - (b.createdAt?.toDate?.()?.getTime() || 0))
        break
      case "most_liked":
        filtered.sort((a, b) => b.likes.length - a.likes.length)
        break
      case "most_saved":
        filtered.sort((a, b) => b.saves.length - a.saves.length)
        break
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredPrompts(filtered)
  }

  const handleCreatePrompt = () => {
    window.location.hash = "#prompts/create"
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading prompts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {userId ? "My Prompts" : "All Prompts"}
          </h2>
          <p className="text-muted-foreground">
            {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        {showCreateButton && (
          <Button onClick={handleCreatePrompt}>
            <Plus className="h-4 w-4 mr-2" />
            Create Prompt
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(diff => (
                    <SelectItem key={diff.value} value={diff.value}>
                      {diff.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredPrompts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all" 
                ? "No prompts found" 
                : "No prompts yet"
              }
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all"
                ? "Try adjusting your search or filters"
                : userId 
                  ? "Create your first prompt to get started!"
                  : "Be the first to create a prompt!"
              }
            </p>
            {showCreateButton && (
              <Button onClick={handleCreatePrompt}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Prompt
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          <AnimatePresence>
            {filteredPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <PromptCard
                  prompt={prompt}
                  showActions={true}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onLike={onLike}
                  onSave={onSave}
                  onShare={onShare}
                  className={viewMode === "list" ? "w-full" : ""}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
