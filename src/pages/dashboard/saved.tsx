import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PromptCard } from "@/components/prompts/PromptCard"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  onSnapshot,
  doc
} from "firebase/firestore"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { 
  Bookmark,
  Loader2,
  RefreshCw,
  AlertCircle,
  Heart
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
  savedAt?: any
}

export function SavedPromptsPage() {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [savedPrompts, setSavedPrompts] = useState<PromptData[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Load saved prompts
  const loadSavedPrompts = async () => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    if (!isFirebaseConfigured || !firebaseDb) {
      // Demo mode - show mock data
      loadMockSavedPrompts()
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)

      // Get saved prompt IDs from user's savedPrompts subcollection
      const savedPromptsRef = collection(firebaseDb, 'users', currentUser.uid, 'savedPrompts')
      const savedPromptsQuery = query(savedPromptsRef, orderBy('savedAt', 'desc'))
      const savedPromptsSnapshot = await getDocs(savedPromptsQuery)
      
      const savedPromptIds = savedPromptsSnapshot.docs.map(doc => ({
        id: doc.id,
        savedAt: doc.data().savedAt
      }))

      if (savedPromptIds.length === 0) {
        setSavedPrompts([])
        setLoading(false)
        return
      }

      // Fetch full prompt data for each saved prompt
      const prompts: PromptData[] = []
      
      for (const savedPrompt of savedPromptIds) {
        try {
          const promptRef = doc(firebaseDb, 'prompts', savedPrompt.id)
          const promptDoc = await getDocs(query(collection(firebaseDb, 'prompts'), where('__name__', '==', savedPrompt.id)))
          
          if (!promptDoc.empty) {
            const promptData = promptDoc.docs[0].data()
            let creatorName = "Unknown User"
            let creatorAvatar = ""

            // Fetch creator info
            if (promptData.uid) {
              try {
                const userQuery = query(
                  collection(firebaseDb, 'users'),
                  where('__name__', '==', promptData.uid)
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

            prompts.push({
              id: promptDoc.docs[0].id,
              ...promptData,
              creatorName,
              creatorAvatar,
              savedAt: savedPrompt.savedAt
            } as PromptData)
          }
        } catch (err) {
          console.error('Error fetching prompt:', err)
        }
      }

      setSavedPrompts(prompts)
    } catch (err: any) {
      console.error('Error loading saved prompts:', err)
      setErrorMessage(err.message || "Failed to load saved prompts")
      error("Loading failed", "Failed to load saved prompts")
    } finally {
      setLoading(false)
    }
  }

  // Load mock data for demo mode
  const loadMockSavedPrompts = () => {
    const mockPrompts: PromptData[] = [
      {
        id: "1",
        uid: "user1",
        title: "Advanced Code Review Assistant",
        description: "Get comprehensive code reviews with suggestions for improvements, security vulnerabilities, and best practices.",
        category: "development",
        tags: ["code", "review", "security"],
        difficulty: "intermediate",
        visibility: true,
        previewImageURL: "https://github.com/shadcn.png",
        likes: ["user2", "user3"],
        saves: ["user4", "user5"],
        createdAt: new Date(),
        creatorName: "CodeMaster Pro",
        creatorAvatar: "https://github.com/shadcn.png",
        savedAt: new Date()
      },
      {
        id: "2",
        uid: "user2",
        title: "Creative Writing Prompt Generator",
        description: "Generate unique and inspiring creative writing prompts for stories, poems, and essays.",
        category: "writing",
        tags: ["creative", "writing", "storytelling"],
        difficulty: "beginner",
        visibility: true,
        previewImageURL: "https://github.com/shadcn.png",
        likes: ["user1", "user3"],
        saves: ["user2", "user6"],
        createdAt: new Date(Date.now() - 86400000),
        creatorName: "Writer's Block",
        creatorAvatar: "https://github.com/shadcn.png",
        savedAt: new Date(Date.now() - 3600000)
      }
    ]
    
    setSavedPrompts(mockPrompts)
    setLoading(false)
  }

  // Load saved prompts on mount
  useEffect(() => {
    loadSavedPrompts()
  }, [currentUser])

  // Handle refresh
  const handleRefresh = () => {
    loadSavedPrompts()
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Login Required</h3>
            <p className="text-muted-foreground mb-4">
              Please log in to view your saved prompts.
            </p>
            <Button asChild>
              <a href="#login">Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Saved Prompts</h1>
              <p className="text-muted-foreground">Your bookmarked prompts</p>
            </div>
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="animate-pulse">
                    <div className="h-48 bg-muted"></div>
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-muted rounded-full"></div>
                        <div className="h-3 bg-muted rounded w-20"></div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Saved Prompts</h3>
            <p className="text-muted-foreground mb-4">{errorMessage}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bookmark className="h-8 w-8 text-primary" />
              Saved Prompts
            </h1>
            <p className="text-muted-foreground">
              {savedPrompts.length} saved prompt{savedPrompts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Saved Prompts Grid */}
        {savedPrompts.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Bookmark className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No saved prompts yet</h3>
                <p className="text-muted-foreground">
                  Start exploring prompts and save the ones you like to see them here.
                </p>
                <Button asChild>
                  <a href="#marketplace/index">Explore Marketplace</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <PromptCard
                  prompt={prompt}
                  showActions={true}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
