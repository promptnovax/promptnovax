import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/AuthGuard"
import { PromptForm } from "@/components/prompts/PromptForm"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { platformDb, isSupabaseConfigured } from "@/lib/platformClient"
import { doc, getDoc } from "@/lib/platformStubs/firestore"
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"

interface PromptEditPageProps {
  id: string
}

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

export function PromptEditPage({ id }: PromptEditPageProps) {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [prompt, setPrompt] = useState<PromptData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadPrompt()
    }
  }, [id])

  const loadPrompt = async () => {
    if (!isSupabaseConfigured || !platformDb) {
      // Mock data for demo mode
      loadMockData()
      return
    }

    try {
      setLoading(true)
      const promptRef = doc(platformDb, 'prompts', id)
      const promptSnap = await getDoc(promptRef)

      if (!promptSnap.exists()) {
        error("Prompt not found", "The prompt you're trying to edit doesn't exist")
        return
      }

      const promptData = { id: promptSnap.id, ...promptSnap.data() } as PromptData

      // Check if user owns this prompt
      if (promptData.uid !== currentUser?.uid) {
        error("Access denied", "You can only edit your own prompts")
        window.location.hash = "#dashboard/index"
        return
      }

      setPrompt(promptData)
    } catch (err: any) {
      console.error('Error loading prompt:', err)
      error("Loading failed", "Failed to load prompt data")
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    const mockPrompt: PromptData = {
      id: id,
      uid: currentUser?.uid || "user1",
      title: "Advanced Code Review Assistant",
      description: "Get comprehensive code reviews with suggestions for improvements, security vulnerabilities, and best practices. This prompt helps developers write better, more secure code by providing detailed feedback on their implementations.",
      category: "development",
      tags: ["code", "review", "security", "best-practices"],
      difficulty: "intermediate",
      visibility: true,
      previewImageURL: "https://github.com/shadcn.png",
      fileURL: "",
      likes: ["user2", "user3"],
      saves: ["user4"],
      createdAt: new Date(),
      lastEditedAt: new Date()
    }
    setPrompt(mockPrompt)
    setLoading(false)
  }

  const handleSave = (promptId: string) => {
    success("Prompt updated", "Your prompt has been updated successfully!")
    window.location.hash = "#dashboard/index"
  }

  const handleCancel = () => {
    window.location.hash = "#dashboard/index"
  }

  const handleBackToDashboard = () => {
    window.location.hash = "#dashboard/index"
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Loading prompt...</p>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!prompt) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
                <h1 className="text-2xl font-bold">Prompt Not Found</h1>
                <p className="text-muted-foreground">
                  The prompt you're trying to edit doesn't exist or you don't have permission to edit it.
                </p>
                <Button onClick={handleBackToDashboard}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b bg-background"
        >
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="container mx-auto px-4 py-8"
        >
          <PromptForm
            mode="edit"
            initialData={prompt}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </motion.div>
      </div>
    </AuthGuard>
  )
}
