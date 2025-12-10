import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "@/lib/platformStubs/firestore"
import { platformDb, isSupabaseConfigured } from "@/lib/platformClient"
import { 
  User,
  Users,
  Heart,
  Eye,
  Calendar,
  MessageCircle,
  Loader2,
  AlertCircle,
  FileText
} from "lucide-react"
import { CreatorPromptsSection } from "@/components/creator/CreatorPromptsSection"
import { CreatorFollowersSection } from "@/components/creator/CreatorFollowersSection"

interface CreatorProfilePageProps {
  username: string
}

interface CreatorData {
  uid: string
  username: string
  displayName: string
  email: string
  bio: string
  photoURL: string
  followers: string[]
  following: string[]
  totalLikes: number
  badges: string[]
  createdAt: any
}

export function CreatorProfilePage({ username }: CreatorProfilePageProps) {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [creator, setCreator] = useState<CreatorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  // Load creator data
  const loadCreatorData = async () => {
    if (!isSupabaseConfigured || !platformDb) {
      // Demo mode - show mock data
      loadMockCreatorData()
      return
    }

    try {
      setLoading(true)

      // Try to find user by username first, then by uid
      const usersRef = collection(platformDb, 'users')
      let userQuery = query(usersRef, where('username', '==', username))
      let userSnapshot = await getDocs(userQuery)

      // If not found by username, try by uid
      if (userSnapshot.empty) {
        userQuery = query(usersRef, where('__name__', '==', username))
        userSnapshot = await getDocs(userQuery)
      }

      if (userSnapshot.empty) {
        error("Creator not found", "The creator you're looking for doesn't exist")
        return
      }

      const userDoc = userSnapshot.docs[0]
      const userData = userDoc.data()

      // Check if current user is following this creator
      const isFollowing = currentUser ? userData.followers?.includes(currentUser.uid) : false

      const creatorData: CreatorData = {
        uid: userDoc.id,
        username: userData.username || userData.email?.split('@')[0] || username,
        displayName: userData.displayName || userData.email?.split('@')[0] || "Unknown User",
        email: userData.email || "",
        bio: userData.bio || "No bio available",
        photoURL: userData.photoURL || "",
        followers: userData.followers || [],
        following: userData.following || [],
        totalLikes: userData.totalLikes || 0,
        badges: userData.badges || [],
        createdAt: userData.createdAt
      }

      setCreator(creatorData)
      setFollowing(isFollowing)
    } catch (err: any) {
      console.error('Error loading creator data:', err)
      error("Loading failed", "Failed to load creator profile")
    } finally {
      setLoading(false)
    }
  }

  // Load mock data for demo mode
  const loadMockCreatorData = () => {
    const mockCreator: CreatorData = {
      uid: "creator123",
      username: username,
      displayName: "CodeMaster Pro",
      email: "codemaster@example.com",
      bio: "Full-stack developer passionate about clean code and AI. Creating amazing prompts for the community!",
      photoURL: "https://github.com/shadcn.png",
      followers: ["user1", "user2", "user3", "user4", "user5"],
      following: ["user6", "user7"],
      totalLikes: 156,
      badges: ["Top Creator", "100+ Likes", "Early Contributor"],
      createdAt: new Date(Date.now() - 86400000 * 30)
    }
    
    setCreator(mockCreator)
    setFollowing(currentUser ? mockCreator.followers.includes(currentUser.uid || "") : false)
    setLoading(false)
  }

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!currentUser || !creator) return

    if (!isSupabaseConfigured || !platformDb) {
      // Demo mode - just update local state
      setFollowing(!following)
      success(
        !following ? "Following" : "Unfollowed", 
        !following ? `You're now following ${creator.displayName}` : `You unfollowed ${creator.displayName}`
      )
      return
    }

    setFollowLoading(true)
    try {
      const currentUserRef = doc(platformDb, 'users', currentUser.uid)
      const creatorRef = doc(platformDb, 'users', creator.uid)
      
      if (following) {
        // Unfollow
        await updateDoc(currentUserRef, {
          following: arrayRemove(creator.uid)
        })
        await updateDoc(creatorRef, {
          followers: arrayRemove(currentUser.uid)
        })
        setFollowing(false)
        setCreator(prev => prev ? {
          ...prev,
          followers: prev.followers.filter(uid => uid !== currentUser.uid)
        } : null)
        success("Unfollowed", `You unfollowed ${creator.displayName}`)
      } else {
        // Follow
        await updateDoc(currentUserRef, {
          following: arrayUnion(creator.uid)
        })
        await updateDoc(creatorRef, {
          followers: arrayUnion(currentUser.uid)
        })
        setFollowing(true)
        setCreator(prev => prev ? {
          ...prev,
          followers: [...prev.followers, currentUser.uid]
        } : null)
        success("Following", `You're now following ${creator.displayName}`)
      }
    } catch (err: any) {
      console.error('Error toggling follow:', err)
      error("Action failed", "Failed to update follow status")
    } finally {
      setFollowLoading(false)
    }
  }

  // Load creator data on mount
  useEffect(() => {
    if (username) {
      loadCreatorData()
    }
  }, [username, currentUser])

  const formatDate = (date: any) => {
    if (!date) return "Unknown"
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            {/* Profile Header Skeleton */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="h-24 w-24 bg-muted rounded-full"></div>
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="h-8 bg-muted rounded w-1/3 mx-auto md:mx-0"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mx-auto md:mx-0"></div>
                    <div className="h-4 bg-muted rounded w-2/3 mx-auto md:mx-0"></div>
                  </div>
                  <div className="h-10 w-24 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <div className="h-8 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Creator Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The creator you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => window.location.hash = "#marketplace/index"}>
              Browse Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <Avatar className="h-24 w-24">
                  <AvatarImage src={creator.photoURL} />
                  <AvatarFallback className="text-2xl">
                    {creator.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{creator.displayName}</h1>
                  <p className="text-muted-foreground mb-2">@{creator.username}</p>
                  <p className="text-muted-foreground mb-4 max-w-2xl">
                    {creator.bio}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {formatDate(creator.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Follow Button */}
                <div className="flex flex-col items-center gap-2">
                  {currentUser && currentUser.uid !== creator.uid ? (
                    <Button
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      variant={following ? "outline" : "default"}
                    >
                      {followLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : following ? (
                        "Following"
                      ) : (
                        "Follow"
                      )}
                    </Button>
                  ) : currentUser?.uid === creator.uid ? (
                    <Button 
                      variant="outline"
                      onClick={() => window.location.hash = "#dashboard/creator"}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Button onClick={() => window.location.hash = "#login"}>
                      Login to Follow
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Prompts</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{creator.followers.length}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{creator.totalLikes}</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Views</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Creator's Prompts and Followers Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prompts Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CreatorPromptsSection creatorId={creator.uid} />
            </motion.div>
          </div>

          {/* Followers Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CreatorFollowersSection 
                creatorId={creator.uid} 
                followerCount={creator.followers.length} 
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
