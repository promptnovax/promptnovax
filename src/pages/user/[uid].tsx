import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileTabs } from "@/components/profile/ProfileTabs"
import { EditProfileModal } from "@/components/dashboard/EditProfileModal"
import { platformDb, isSupabaseConfigured } from "@/lib/platformClient"
import { generateProductImage, generateProductThumbnail } from "@/lib/marketplaceImages"
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "@/lib/platformStubs/firestore"
import { 
  ArrowLeft,
  Edit,
  Plus,
  User,
  Heart,
  MessageCircle,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Star,
  Download,
  Eye
} from "lucide-react"

interface UserData {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  bio?: string
  followers: string[]
  following: string[]
  createdAt: any
  totalPrompts?: number
  totalLikes?: number
  totalDownloads?: number
}

interface PromptData {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  price: number
  content: string
  imageUrl?: string
  sellerId: string
  sellerEmail: string
  createdAt: any
  likes: number
  downloads: number
  status: string
}

interface UserProfilePageProps {
  uid: string
}

export function UserProfilePage({ uid }: UserProfilePageProps) {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [user, setUser] = useState<UserData | null>(null)
  const [userPrompts, setUserPrompts] = useState<PromptData[]>([])
  const [followers, setFollowers] = useState<UserData[]>([])
  const [following, setFollowing] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [activeTab, setActiveTab] = useState("prompts")

  const isOwner = currentUser?.uid === uid

  useEffect(() => {
    if (uid) {
      loadUserData()
    }
  }, [uid])

  const loadUserData = async () => {
    if (!isSupabaseConfigured || !platformDb) {
      // Mock data for demo mode
      loadMockData()
      return
    }

    try {
      setIsLoading(true)

      // Load user data
      const userDoc = await getDoc(doc(platformDb, 'users', uid))
      if (!userDoc.exists()) {
        error("User not found", "The user profile you're looking for doesn't exist")
        return
      }

      const userData = { uid: userDoc.id, ...userDoc.data() } as UserData
      setUser(userData)

      // Load user's prompts
      const promptsQuery = query(
        collection(platformDb, 'prompts'),
        where('sellerId', '==', uid),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      )
      const promptsSnapshot = await getDocs(promptsQuery)
      const prompts = promptsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PromptData[]
      setUserPrompts(prompts)

      // Calculate stats
      const totalLikes = prompts.reduce((sum, prompt) => sum + prompt.likes, 0)
      const totalDownloads = prompts.reduce((sum, prompt) => sum + prompt.downloads, 0)
      
      setUser(prev => prev ? {
        ...prev,
        totalPrompts: prompts.length,
        totalLikes,
        totalDownloads
      } : null)

      // Load followers
      if (userData.followers.length > 0) {
        const followersQuery = query(
          collection(platformDb, 'users'),
          where('__name__', 'in', userData.followers.slice(0, 10)) // Limit to 10 for performance
        )
        const followersSnapshot = await getDocs(followersQuery)
        const followersData = followersSnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        })) as UserData[]
        setFollowers(followersData)
      }

      // Load following
      if (userData.following.length > 0) {
        const followingQuery = query(
          collection(platformDb, 'users'),
          where('__name__', 'in', userData.following.slice(0, 10)) // Limit to 10 for performance
        )
        const followingSnapshot = await getDocs(followingQuery)
        const followingData = followingSnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        })) as UserData[]
        setFollowing(followingData)
      }

    } catch (err: any) {
      console.error('Error loading user data:', err)
      error("Loading failed", "Failed to load user profile")
    } finally {
      setIsLoading(false)
    }
  }

  const loadMockData = () => {
    // Mock data for demo mode
    const mockUser: UserData = {
      uid: uid,
      displayName: "CodeMaster Pro",
      email: "codemaster@example.com",
      photoURL: generateProductThumbnail("development", uid, "CodeMaster Pro"),
      bio: "Professional software engineer with 10+ years of experience in code quality and best practices. Passionate about helping developers write better, more secure code.",
      followers: ["user1", "user2", "user3", "user4", "user5"],
      following: ["seller1", "seller2", "seller3"],
      createdAt: new Date("2023-03-15"),
      totalPrompts: 12,
      totalLikes: 156,
      totalDownloads: 2341
    }

    const mockPrompts: PromptData[] = [
      {
        id: "1",
        title: "Advanced Code Review Assistant",
        description: "Get comprehensive code reviews with suggestions for improvements, security vulnerabilities, and best practices. Perfect for developers who want to improve their code quality.",
        category: "development",
        tags: ["code", "review", "security"],
        price: 29.99,
        content: "Code review prompt content...",
        imageUrl: generateProductImage("development", "1", "Advanced Code Review Assistant"),
        sellerId: uid,
        sellerEmail: "codemaster@example.com",
        createdAt: new Date(),
        likes: 42,
        downloads: 156,
        status: "active"
      },
      {
        id: "2",
        title: "Security Code Scanner",
        description: "Identify security vulnerabilities in your codebase. Advanced AI-powered scanner that detects common security issues and provides detailed recommendations.",
        category: "development",
        tags: ["security", "scanner", "vulnerability"],
        price: 24.99,
        content: "Security scanning prompt content...",
        imageUrl: generateProductImage("development", "2", "Security Code Scanner"),
        sellerId: uid,
        sellerEmail: "codemaster@example.com",
        createdAt: new Date(),
        likes: 28,
        downloads: 89,
        status: "active"
      },
      {
        id: "3",
        title: "Full-Stack Web Development Guide",
        description: "Complete guide for full-stack web development covering frontend, backend, databases, and deployment strategies.",
        category: "development",
        tags: ["web-development", "full-stack", "javascript"],
        price: 34.99,
        content: "Full-stack guide content...",
        imageUrl: generateProductImage("development", "3", "Full-Stack Web Development Guide"),
        sellerId: uid,
        sellerEmail: "codemaster@example.com",
        createdAt: new Date(),
        likes: 56,
        downloads: 234,
        status: "active"
      }
    ]

    const mockFollowers: UserData[] = [
      {
        uid: "user1",
        displayName: "John Doe",
        email: "john@example.com",
        photoURL: "https://github.com/shadcn.png",
        followers: [],
        following: [],
        createdAt: new Date()
      },
      {
        uid: "user2",
        displayName: "Sarah Wilson",
        email: "sarah@example.com",
        photoURL: "https://github.com/shadcn.png",
        followers: [],
        following: [],
        createdAt: new Date()
      }
    ]

    const mockFollowing: UserData[] = [
      {
        uid: "seller1",
        displayName: "AI Innovators",
        email: "ai@example.com",
        photoURL: "https://github.com/shadcn.png",
        followers: [],
        following: [],
        createdAt: new Date()
      }
    ]

    setUser(mockUser)
    setUserPrompts(mockPrompts)
    setFollowers(mockFollowers)
    setFollowing(mockFollowing)
    setIsLoading(false)
  }

  const handleBackToMarketplace = () => {
    window.location.hash = "#marketplace"
  }

  const handleEditProfile = () => {
    setShowEditModal(true)
  }

  const handleAddNewPrompt = () => {
    window.location.hash = "#dashboard/create-prompt"
  }

  const handleProfileUpdated = (updatedUser: UserData) => {
    setUser(updatedUser)
    setShowEditModal(false)
    success("Profile updated", "Your profile has been successfully updated")
  }

  const formatDate = (date: any) => {
    if (!date) return "Unknown"
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-muted rounded"></div>
              <div className="h-8 w-64 bg-muted rounded"></div>
            </div>

            {/* Profile Skeleton */}
            <div className="space-y-6">
              <div className="h-48 bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 w-1/3 bg-muted rounded"></div>
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-2/3 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">User Not Found</h1>
          <p className="text-muted-foreground">The user profile you're looking for doesn't exist.</p>
          <Button onClick={handleBackToMarketplace}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
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
          <Button variant="ghost" size="sm" onClick={handleBackToMarketplace}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ProfileHeader
          user={user}
          isOwner={isOwner}
          onEditProfile={handleEditProfile}
          onAddNewPrompt={handleAddNewPrompt}
        />
      </motion.div>

      {/* Profile Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="container mx-auto px-4 py-8"
      >
        <ProfileTabs
          user={user}
          prompts={userPrompts}
          followers={followers}
          following={following}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </motion.div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileUpdated}
        />
      )}
    </div>
  )
}
