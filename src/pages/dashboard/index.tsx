import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/AuthGuard"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { PromptList } from "@/components/prompts/PromptList"
import { EditProfileModal } from "@/components/dashboard/EditProfileModal"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { 
  ArrowLeft,
  Edit,
  Plus,
  User,
  Heart,
  MessageCircle,
  Calendar,
  Star,
  Download,
  Eye,
  Settings,
  FileText,
  Users,
  UserPlus
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

export function DashboardIndex() {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [user, setUser] = useState<UserData | null>(null)
  const [userPrompts, setUserPrompts] = useState<PromptData[]>([])
  const [followers, setFollowers] = useState<UserData[]>([])
  const [following, setFollowing] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (currentUser) {
      loadUserData()
    }
  }, [currentUser])

  const loadUserData = async () => {
    if (!currentUser) return

    if (!isFirebaseConfigured || !firebaseDb) {
      // Mock data for demo mode
      loadMockData()
      return
    }

    try {
      setIsLoading(true)

      // Load user data
      const userDoc = await getDoc(doc(firebaseDb, 'users', currentUser.uid))
      let userData: UserData

      if (userDoc.exists()) {
        userData = { uid: userDoc.id, ...userDoc.data() } as UserData
      } else {
        // Create user document if it doesn't exist
        userData = {
          uid: currentUser.uid,
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || undefined,
          bio: '',
          followers: [],
          following: [],
          createdAt: new Date(),
          totalPrompts: 0,
          totalLikes: 0,
          totalDownloads: 0
        }
      }

      setUser(userData)

      // Load user's prompts
      const promptsQuery = query(
        collection(firebaseDb, 'prompts'),
        where('sellerId', '==', currentUser.uid),
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
          collection(firebaseDb, 'users'),
          where('__name__', 'in', userData.followers.slice(0, 10))
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
          collection(firebaseDb, 'users'),
          where('__name__', 'in', userData.following.slice(0, 10))
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
      error("Loading failed", "Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const loadMockData = () => {
    if (!currentUser) return

    const mockUser: UserData = {
      uid: currentUser.uid,
      displayName: currentUser.displayName || "Demo User",
      email: currentUser.email || "demo@example.com",
      photoURL: currentUser.photoURL || "https://github.com/shadcn.png",
      bio: "This is a demo user profile. Update your bio to tell others about yourself!",
      followers: ["user1", "user2", "user3"],
      following: ["seller1", "seller2"],
      createdAt: new Date(),
      totalPrompts: 3,
      totalLikes: 45,
      totalDownloads: 123
    }

    const mockPrompts: PromptData[] = [
      {
        id: "1",
        title: "My First Prompt",
        description: "A sample prompt I created",
        category: "development",
        tags: ["sample", "demo"],
        price: 9.99,
        content: "Sample prompt content...",
        sellerId: currentUser.uid,
        sellerEmail: currentUser.email || "",
        createdAt: new Date(),
        likes: 15,
        downloads: 45,
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
      }
    ]

    const mockFollowing: UserData[] = [
      {
        uid: "seller1",
        displayName: "AI Expert",
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

  const handleBackToHome = () => {
    window.location.hash = "#home"
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

  const handleViewProfile = () => {
    window.location.hash = `#user/${currentUser?.uid}`
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-8">
              {/* Header Skeleton */}
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="h-8 w-64 bg-muted rounded"></div>
              </div>

              {/* Content Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  <div className="h-64 bg-muted rounded-lg"></div>
                </div>
                <div className="lg:col-span-3 space-y-6">
                  <div className="h-32 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!user) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Dashboard Error</h1>
            <p className="text-muted-foreground">Unable to load your dashboard data.</p>
            <Button onClick={handleBackToHome}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleBackToHome}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {user.displayName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleViewProfile}>
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
                <Button variant="outline" size="sm" onClick={handleEditProfile}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <DashboardSidebar
                user={user}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onEditProfile={handleEditProfile}
                onAddNewPrompt={handleAddNewPrompt}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="overview" className="mt-0">
                  <DashboardOverview
                    user={user}
                    prompts={userPrompts}
                    followers={followers}
                    following={following}
                  />
                </TabsContent>

                <TabsContent value="prompts" className="mt-0">
                  <PromptList
                    userId={currentUser?.uid}
                    showCreateButton={true}
                    onEdit={(promptId) => window.location.hash = `#prompts/edit/${promptId}`}
                    onDelete={(promptId) => {
                      // TODO: Implement delete functionality
                      console.log('Delete prompt:', promptId)
                    }}
                    onLike={(promptId) => {
                      // TODO: Implement like functionality
                      console.log('Like prompt:', promptId)
                    }}
                    onSave={(promptId) => {
                      // TODO: Implement save functionality
                      console.log('Save prompt:', promptId)
                    }}
                    onShare={(promptId) => {
                      // TODO: Implement share functionality
                      console.log('Share prompt:', promptId)
                    }}
                  />
                </TabsContent>

                <TabsContent value="followers" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Followers ({followers.length})</CardTitle>
                      <CardDescription>
                        People who follow you
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {followers.length === 0 ? (
                        <div className="text-center py-12">
                          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No followers yet</h3>
                          <p className="text-muted-foreground">
                            Share your prompts to get followers!
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {followers.map((follower) => (
                            <div key={follower.uid} className="flex items-center gap-3 p-3 border rounded-lg">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={follower.photoURL} />
                                <AvatarFallback>
                                  {follower.displayName?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium">{follower.displayName}</h4>
                                <p className="text-sm text-muted-foreground">{follower.email}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.hash = `#user/${follower.uid}`}
                              >
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="following" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Following ({following.length})</CardTitle>
                      <CardDescription>
                        People you follow
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {following.length === 0 ? (
                        <div className="text-center py-12">
                          <UserPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Not following anyone</h3>
                          <p className="text-muted-foreground">
                            Follow other creators to see their latest prompts!
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {following.map((followedUser) => (
                            <div key={followedUser.uid} className="flex items-center gap-3 p-3 border rounded-lg">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={followedUser.photoURL} />
                                <AvatarFallback>
                                  {followedUser.displayName?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium">{followedUser.displayName}</h4>
                                <p className="text-sm text-muted-foreground">{followedUser.email}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.hash = `#user/${followedUser.uid}`}
                              >
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Settings</CardTitle>
                      <CardDescription>
                        Manage your account settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center py-12">
                        <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Settings Coming Soon</h3>
                        <p className="text-muted-foreground">
                          Advanced settings will be available in a future update.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <EditProfileModal
            user={user}
            onClose={() => setShowEditModal(false)}
            onSave={handleProfileUpdated}
          />
        )}
      </div>
    </AuthGuard>
  )
}
