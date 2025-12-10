import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { 
  collection, 
  query, 
  where, 
  getDocs
} from "@/lib/platformStubs/firestore"
import { platformDb, isSupabaseConfigured } from "@/lib/platformClient"
import { 
  Users,
  UserPlus,
  UserMinus,
  MessageCircle,
  Calendar,
  Loader2,
  Eye
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

interface CreatorFollowersSectionProps {
  creatorId: string
  followerCount: number
}

export function CreatorFollowersSection({ creatorId, followerCount }: CreatorFollowersSectionProps) {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [followers, setFollowers] = useState<Follower[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [followingBack, setFollowingBack] = useState<string | null>(null)

  // Load followers data
  const loadFollowers = async () => {
    if (!isSupabaseConfigured || !platformDb) {
      // Demo mode - show mock data
      loadMockFollowers()
      return
    }

    setLoading(true)
    try {
      // Get creator's follower IDs
      const userQuery = query(
        collection(platformDb, 'users'),
        where('__name__', '==', creatorId)
      )
      const userSnapshot = await getDocs(userQuery)
      
      if (userSnapshot.empty) {
        setFollowers([])
        return
      }

      const userData = userSnapshot.docs[0].data()
      const followerIds = userData.followers || []

      if (followerIds.length === 0) {
        setFollowers([])
        return
      }

      // Fetch follower details
      const followerList: Follower[] = []
      
      for (const followerId of followerIds) {
        try {
          const followerQuery = query(
            collection(platformDb, 'users'),
            where('__name__', '==', followerId)
          )
          const followerSnapshot = await getDocs(followerQuery)
          
          if (!followerSnapshot.empty) {
            const followerData = followerSnapshot.docs[0].data()
            const isFollowingBack = followerData.following?.includes(currentUser?.uid || "") || false
            
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
        displayName: "Writer's Block",
        email: "writer@example.com",
        photoURL: "https://github.com/shadcn.png",
        bio: "Creative writer and content creator",
        followers: ["user1", "user3", "user6"],
        following: ["user1", "user7"],
        createdAt: new Date(Date.now() - 86400000),
        isFollowingBack: true
      },
      {
        uid: "user3",
        displayName: "Design Expert",
        email: "designer@example.com",
        photoURL: "https://github.com/shadcn.png",
        bio: "UI/UX designer with a passion for beautiful interfaces",
        followers: ["user1", "user2", "user3", "user5"],
        following: ["user2", "user6"],
        createdAt: new Date(Date.now() - 172800000),
        isFollowingBack: false
      },
      {
        uid: "user4",
        displayName: "Data Scientist",
        email: "data@example.com",
        photoURL: "https://github.com/shadcn.png",
        bio: "Data scientist and machine learning enthusiast",
        followers: ["user1", "user4", "user6"],
        following: ["user1", "user3"],
        createdAt: new Date(Date.now() - 259200000),
        isFollowingBack: true
      }
    ]
    
    setFollowers(mockFollowers)
    setLoading(false)
  }

  // Follow/Unfollow user
  const handleFollowToggle = async (followerId: string, isCurrentlyFollowing: boolean) => {
    if (!currentUser || !isSupabaseConfigured || !platformDb) {
      // Demo mode - just update local state
      setFollowers(prev => 
        prev.map(follower => 
          follower.uid === followerId 
            ? { ...follower, isFollowingBack: !isCurrentlyFollowing }
            : follower
        )
      )
      success(
        !isCurrentlyFollowing ? "Following" : "Unfollowed", 
        !isCurrentlyFollowing ? "You're now following this user" : "You unfollowed this user"
      )
      return
    }

    setFollowingBack(followerId)
    try {
      const currentUserRef = doc(platformDb, 'users', currentUser.uid)
      const followerRef = doc(platformDb, 'users', followerId)
      
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

  // Load followers when modal opens
  useEffect(() => {
    if (modalOpen && followers.length === 0) {
      loadFollowers()
    }
  }, [modalOpen])

  const formatDate = (date: any) => {
    if (!date) return "Unknown"
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Followers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {followerCount === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No followers yet</h3>
              <p className="text-muted-foreground">
                This creator is just getting started. Be the first to follow!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Follower Avatars Preview */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(5, followerCount) }).map((_, index) => (
                    <Avatar key={index} className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="text-xs">
                        {String.fromCharCode(65 + index)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {followerCount > 5 && (
                    <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-medium">+{followerCount - 5}</span>
                    </div>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
                </span>
              </div>

              {/* View All Button */}
              <Button 
                variant="outline" 
                onClick={() => setModalOpen(true)}
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                View All Followers
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Followers Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Followers ({followerCount})
            </DialogTitle>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4 p-4">
                    <div className="h-12 w-12 bg-muted rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
                    </div>
                    <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : followers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No followers found</h3>
                <p className="text-muted-foreground">
                  This creator doesn't have any followers yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {followers.map((follower, index) => (
                  <motion.div
                    key={follower.uid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
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
                      <h3 
                        className="font-semibold cursor-pointer hover:text-primary transition-colors"
                        onClick={() => window.location.hash = `#user/${follower.uid}`}
                      >
                        {follower.displayName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {follower.bio || "No bio available"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {follower.followers.length} followers
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {formatDate(follower.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {currentUser && currentUser.uid !== follower.uid && (
                        <>
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
                                Follow
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
