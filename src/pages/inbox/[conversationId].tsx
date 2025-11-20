import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChatWindow } from "@/components/chat/ChatWindow"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { 
  ArrowLeft,
  MessageCircle,
  Loader2,
  AlertCircle,
  User
} from "lucide-react"

interface ConversationDetailPageProps {
  conversationId: string
}

interface OtherParticipant {
  uid: string
  name: string
  avatar?: string
}

export function ConversationDetailPage({ conversationId }: ConversationDetailPageProps) {
  const { currentUser } = useAuth()
  const { error } = useToast()
  const [otherParticipant, setOtherParticipant] = useState<OtherParticipant | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (conversationId) {
      loadConversationDetails()
    }
  }, [conversationId])

  const loadConversationDetails = async () => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    if (!isFirebaseConfigured || !firebaseDb) {
      // Demo mode - use mock data
      loadMockData()
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)

      // Get conversation details
      const conversationRef = doc(firebaseDb, 'conversations', conversationId)
      const conversationSnap = await getDoc(conversationRef)

      if (!conversationSnap.exists()) {
        setErrorMessage("Conversation not found")
        setLoading(false)
        return
      }

      const conversationData = conversationSnap.data()
      
      // Find the other participant
      const otherParticipantId = conversationData.participants.find(
        (uid: string) => uid !== currentUser.uid
      )

      if (!otherParticipantId) {
        setErrorMessage("Invalid conversation")
        setLoading(false)
        return
      }

      // Fetch other participant's info
      let otherParticipant: OtherParticipant = {
        uid: otherParticipantId,
        name: "Unknown User",
        avatar: ""
      }

      try {
        const userQuery = query(
          collection(firebaseDb, 'users'),
          where('__name__', '==', otherParticipantId)
        )
        const userSnapshot = await getDocs(userQuery)
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data()
          otherParticipant = {
            uid: otherParticipantId,
            name: userData.displayName || userData.email?.split('@')[0] || "Unknown User",
            avatar: userData.photoURL || ""
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
      }

      setOtherParticipant(otherParticipant)
    } catch (err: any) {
      console.error('Error loading conversation:', err)
      setErrorMessage(err.message || "Failed to load conversation")
      error("Loading failed", "Failed to load conversation")
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    const mockOtherParticipant: OtherParticipant = {
      uid: "user2",
      name: "CodeMaster Pro",
      avatar: "https://github.com/shadcn.png"
    }
    setOtherParticipant(mockOtherParticipant)
    setLoading(false)
  }

  const handleBackToInbox = () => {
    window.location.hash = "#inbox"
  }

  const handleBackToDashboard = () => {
    window.location.hash = "#dashboard/index"
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-16 text-center">
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Login Required</h3>
              <p className="text-muted-foreground mb-4">
                Please log in to view conversations.
              </p>
              <Button asChild>
                <a href="#login">Log In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b bg-background"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToInbox}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Inbox
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading conversation...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b bg-background"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToInbox}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Inbox
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Conversation</h1>
                <p className="text-muted-foreground">Chat with other users</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
              <h1 className="text-2xl font-bold">Error Loading Conversation</h1>
              <p className="text-muted-foreground">{errorMessage}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={loadConversationDetails} variant="outline">
                  Try Again
                </Button>
                <Button onClick={handleBackToInbox}>
                  Back to Inbox
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToInbox}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Inbox
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <MessageCircle className="h-6 w-6" />
                  {otherParticipant?.name || "Conversation"}
                </h1>
                <p className="text-muted-foreground">Chat with {otherParticipant?.name || "user"}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleBackToDashboard}>
              <User className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ChatWindow
            conversationId={conversationId}
            otherParticipant={otherParticipant || undefined}
          />
        </div>
      </div>
    </div>
  )
}
