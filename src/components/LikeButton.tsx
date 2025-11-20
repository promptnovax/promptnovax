import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore"
import { Heart } from "lucide-react"

interface LikeButtonProps {
  promptId: string
  initialLikes: number
}

export function LikeButton({ promptId, initialLikes }: LikeButtonProps) {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [isLiked, setIsLiked] = useState(false) 
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentUser && isFirebaseConfigured && firebaseDb) {
      checkLikeStatus()
    }
  }, [currentUser, promptId])

  const checkLikeStatus = async () => {
    if (!currentUser || !isFirebaseConfigured || !firebaseDb) return

    try {
      const likeDoc = await getDoc(doc(firebaseDb, 'prompts', promptId, 'likes', currentUser.uid))
      setIsLiked(likeDoc.exists())
    } catch (err) {
      console.error('Error checking like status:', err)
    }
  }

  const handleLike = async () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      window.location.hash = "#login"
      return
    }

    if (!isFirebaseConfigured || !firebaseDb) {
      // Mock functionality for demo mode
      handleMockLike()
      return
    }

    setIsLoading(true)

    try {
      const promptRef = doc(firebaseDb, 'prompts', promptId)
      const likeRef = doc(firebaseDb, 'prompts', promptId, 'likes', currentUser.uid)

      if (isLiked) {
        // Unlike
        await updateDoc(promptRef, {
          likes: likesCount - 1
        })
        await setDoc(likeRef, {
          userId: currentUser.uid,
          likedAt: serverTimestamp()
        }, { merge: true })
        
        setLikesCount(prev => prev - 1)
        setIsLiked(false)
        success("Unliked", "You unliked this prompt")
      } else {
        // Like
        await updateDoc(promptRef, {
          likes: likesCount + 1
        })
        await setDoc(likeRef, {
          userId: currentUser.uid,
          likedAt: serverTimestamp()
        })
        
        setLikesCount(prev => prev + 1)
        setIsLiked(true)
        success("Liked!", "You liked this prompt")
      }
    } catch (err: any) {
      console.error('Error toggling like:', err)
      error("Like failed", err.message || "Failed to like prompt. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMockLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1)
      setIsLiked(false)
      success("Unliked", "You unliked this prompt")
    } else {
      setLikesCount(prev => prev + 1)
      setIsLiked(true)
      success("Liked!", "You liked this prompt")
    }
  }

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      onClick={handleLike}
      disabled={isLoading}
      className="w-full justify-start"
    >
      <motion.div
        animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={`h-4 w-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
        />
      </motion.div>
      {isLoading ? "..." : `${likesCount} ${likesCount === 1 ? 'Like' : 'Likes'}`}
    </Button>
  )
}
