import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore"
import { UserPlus, UserCheck, Loader2 } from "lucide-react"

interface FollowButtonProps {
  sellerId: string
  sellerName?: string
}

export function FollowButton({ sellerId, sellerName }: FollowButtonProps) {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentUser && isFirebaseConfigured && firebaseDb) {
      checkFollowStatus()
    }
  }, [currentUser, sellerId])

  const checkFollowStatus = async () => {
    if (!currentUser || !isFirebaseConfigured || !firebaseDb) return

    try {
      const userDoc = await getDoc(doc(firebaseDb, 'users', currentUser.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const following = userData.following || []
        setIsFollowing(following.includes(sellerId))
      }
    } catch (err) {
      console.error('Error checking follow status:', err)
    }
  }

  const handleFollow = async () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      window.location.hash = "#login"
      return
    }

    if (!isFirebaseConfigured || !firebaseDb) {
      // Mock functionality for demo mode
      handleMockFollow()
      return
    }

    setIsLoading(true)

    try {
      const currentUserRef = doc(firebaseDb, 'users', currentUser.uid)
      const sellerRef = doc(firebaseDb, 'users', sellerId)

      if (isFollowing) {
        // Unfollow
        await updateDoc(currentUserRef, {
          following: arrayRemove(sellerId),
          updatedAt: serverTimestamp()
        })
        await updateDoc(sellerRef, {
          followers: arrayRemove(currentUser.uid),
          updatedAt: serverTimestamp()
        })
        
        setIsFollowing(false)
        success("Unfollowed", `You unfollowed ${sellerName}`)
      } else {
        // Follow
        await updateDoc(currentUserRef, {
          following: arrayUnion(sellerId),
          updatedAt: serverTimestamp()
        })
        await updateDoc(sellerRef, {
          followers: arrayUnion(currentUser.uid),
          updatedAt: serverTimestamp()
        })
        
        setIsFollowing(true)
        success("Following!", `You are now following ${sellerName}`)
      }
    } catch (err: any) {
      console.error('Error toggling follow:', err)
      error("Follow failed", err.message || "Failed to follow user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMockFollow = () => {
    if (isFollowing) {
      setIsFollowing(false)
      success("Unfollowed", `You unfollowed ${sellerName}`)
    } else {
      setIsFollowing(true)
      success("Following!", `You are now following ${sellerName}`)
    }
  }

  if (!currentUser) {
    return (
      <Button
        variant="outline"
        onClick={() => window.location.hash = "#login"}
        className="flex-1"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Login to Follow
      </Button>
    )
  }

  return (
    <Button
      variant={isFollowing ? "default" : "outline"}
      onClick={handleFollow}
      disabled={isLoading}
      className="flex-1"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {isFollowing ? "Unfollowing..." : "Following..."}
        </>
      ) : (
        <>
          {isFollowing ? (
            <>
              <UserCheck className="h-4 w-4 mr-2" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Follow
            </>
          )}
        </>
      )}
    </Button>
  )
}
