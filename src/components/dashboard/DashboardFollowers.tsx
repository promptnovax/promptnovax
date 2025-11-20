import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { 
  collection, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { 
  Users,
  Search,
  UserPlus,
  UserMinus,
  Calendar,
  Loader2,
  AlertCircle,
  Heart,
  MessageCircle
} from "lucide-react"

interface Follower {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  bio?: string
  followers: string[]
  following: string[]
  createdAt: any
  isFollowingBack?: boolean
}

export function DashboardFollowers() {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [followers, setFollowers] = useState<Follower[]>([])
  const [filteredFollowers, setFilteredFollowers] = useState<Follower[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [followingBack, setFollowingBack] = useState<string | null>(null)

  // Load followers
  const loadFollowers = async () => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    if (!isFirebaseConfigured || !firebaseDb) {
      // Demo mode - show mock data
      loadMockFollowers()
      return
    }

    try {
      setLoading(true)

      // Get current user's data to find followers
      const userQuery = query(
        collection(firebaseDb, 'users'),
        where('__name__', '==', currentUser.uid)
      )
      const userSnapshot = await getDocs(userQuery)
      
      if (userSnapshot.empty) {
        setFollowers([])
        setLoading(false)
        return
      }

      const userData = userSnapshot.docs[0].data()
      const followerIds = userData.followers || []

      if (followerIds.length === 0) {
        setFollowers([])
        setLoading(false)
        return
      }

      // Fetch follower details
      const followerList: Follower[] = []
      
      for (const followerId of followerIds) {
        try {
          const followerQuery = query(
            collection(firebaseDb, 'users'),
            where('__name__', '==', followerId)
          )
          const followerSnapshot = await getDocs(followerQuery)
          
          if (!followerSnapshot.empty) {
            const followerData = followerSnapshot.docs[0].data()
            const isFollowingBack = followerData.following?.includes(currentUser.uid) || false
            
            followerList.push({
              uid: followerId,
              displayName: followerData.displayName || followerData.email?.split('@')[0] || "Unknown User",
              email: followerData.email || "",
              photoURL: followerData.photoURL || "",
              bio: followerData.bio || "",
              followers: followerData.followers || [],
              following: followerData.following || [],
              createdAt: followerData.createdAt,
              isFollowingBack
            })
          }
        } catch (err) {
          console.error('Error fetching follower data:', err)
        }
      }

      setFollowers(followerList)
    } catch (err: any) {
      console.error('Error loading followers:', err)
      error("Loading failed", "Failed to load followers")
    } finally {
      setLoading(false)
    }
  }

  // Load mock data for demo mode
  const loadMockFollowers = () => {
    const mockFollowers: Follower[] = [
      {
        uid: "user2",
        displayName: "CodeMaster Pro",
        email: "codemaster@example.com",
        photoURL: "https://github.com/shadcn.png",
        bio: "Full-stack developer passionate about clean code and AI",
        followers: ["user1", "user3", "user4"],
        following: ["user1", "user5"],
        createdAt: new Date(Date.now() - 86400000),
        isFollowingBack: true
      },
      {
        uid: "user3",
        displayName: "Writer's Block",
        email: "writer@example.com",
        photoURL: "https://github.com/shadcn.png",
        bio: "Creative writer and content creator",
        followers: ["user1", "user2", "user6"],
        following: ["user1", "user7"],
        createdAt: new Date(Date.now() - 172800000),
        isFollowingBack: true
      },
      {
        uid: "user4",
        displayName: "Design Expert",
        email: "designer@example.com",
        photoURL: "https://github.com/shadcn.png",
        bio: "UI/UX designer with a passion for beautiful interfaces",
        followers: ["user1", "user2", "user3", "user5"],
        following: ["user2", "user6"],
        createdAt: new Date(Date.now() - 259200000),
        isFollowingBack: false
      },
      {
        uid: "user5",
        displayName: "Data Scientist",
        email: "data@example.com",
        photoURL: "https://github.com/shadcn.png",
        bio: "Data scientist and machine learning enthusiast",
        followers: ["user1", "user4", "user6"],
        following: ["user1", "user3"],
        createdAt: new Date(Date.now() - 345600000),
        isFollowingBack: false
      }
    ]
    
    setFollowers(mockFollowers)
    setLoading(false)
  }

  // Filter followers
  useEffect(() => {
    let filtered = [...followers]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(follower =>
        follower.displayName.toLowerCase().includes(query) ||
        follower.email.toLowerCase().includes(query) ||
        follower.bio?.toLowerCase().includes(query)
      )
    }

    setFilteredFollowers(filtered)
  }, [followers, searchQuery])

  // Follow/Unfollow user
  const handleFollowToggle = async (followerId: string, isCurrentlyFollowing: boolean) => {
    if (!currentUser || !isFirebaseConfigured || !firebaseDb) {
      // Demo mode - just update local state
      setFollowers(prev => 
        prev.map(follower => 
          follower.uid === followerId 
            ? { ...follower, isFollowingBack: !isCurrentlyFollowing }
            : follower
        )
      )
      success(
        isCurrentlyFollowing ? "Unfollowed" : "Following", 
        isCurrentlyFollowing ? "You unfollowed this user" : "You're now following this user"
      )
      return
    }

    setFollowingBack(followerId)
    try {
      const currentUserRef = doc(firebaseDb, 'users', currentUser.uid)
      const followerRef = doc(firebaseDb, 'users', followerId)
      
      if (isCurrentlyFollowing) {
        // Unfollow
        await updateDoc(currentUserRef, {
          following: arrayRemove(followerId)
        })
        await updateDoc(followerRef, {
          followers: arrayRemove(currentUser.uid)
        })
        success("Unfollowed", "You unfollowed this user")
      } else {
        // Follow
        await updateDoc(currentUserRef, {
          following: arrayUnion(followerId)
        })
        await updateDoc(followerRef, {
          followers: arrayUnion(currentUser.uid)
        })
        success("Following", "You're now following this user")
      }

      // Update local state
      setFollowers(prev => 
        prev.map(follower => 
          follower.uid === followerId 
            ? { ...follower, isFollowingBack: !isCurrentlyFollowing }
            : follower
        )
      )
    } catch (err: any) {
      console.error('Error toggling follow:', err)
      error("Action failed", "Failed to update follow status")
    } finally {
      setFollowingBack(null)
    }
  }

  // Load followers on mount
  useEffect(() => {
    loadFollowers()
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Followers</h1>
          <p className="text-muted-foreground">People who follow you</p>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                      <div className="h-8 w-20 bg-muted rounded"></div>
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
          <h1 className="text-3xl font-bold mb-2">Followers</h1>
          <p className="text-muted-foreground">
            People who follow you ({filteredFollowers.length} total)
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search followers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Followers List */}
      {filteredFollowers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">
                  {followers.length === 0 ? "No followers yet" : "No followers found"}
                </h3>
                <p className="text-muted-foreground">
                  {followers.length === 0 
                    ? "Share your prompts to start building your following."
                    : "Try adjusting your search query."
                  }
                </p>
                <Button onClick={() => window.location.hash = "#marketplace/index"}>
                  Share Your Prompts
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredFollowers.map((follower, index) => (
              <motion.div
                key={follower.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <Avatar 
                        className="h-12 w-12 cursor-pointer"
                        onClick={() => window.location.hash = `#user/${follower.uid}`}
                      >
                        <AvatarImage src={follower.photoURL} />
                        <AvatarFallback>
                          {follower.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 
                            className="font-semibold cursor-pointer hover:text-primary transition-colors"
                            onClick={() => window.location.hash = `#user/${follower.uid}`}
                          >
                            {follower.displayName}
                          </h3>
                          {follower.isFollowingBack && (
                            <Badge variant="secondary" className="text-xs">
                              Following you back
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {follower.bio || "No bio available"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {follower.followers.length} followers
                          </div>
                          <div className="flex items-center gap-1">
                            <UserPlus className="h-4 w-4" />
                            {follower.following.length} following
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined {formatDate(follower.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.hash = `#inbox`}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={follower.isFollowingBack ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleFollowToggle(follower.uid, follower.isFollowingBack || false)}
                          disabled={followingBack === follower.uid}
                        >
                          {followingBack === follower.uid ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : follower.isFollowingBack ? (
                            <>
                              <UserMinus className="h-4 w-4 mr-1" />
                              Unfollow
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-1" />
                              Follow Back
                            </>
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
