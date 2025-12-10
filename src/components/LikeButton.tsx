import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
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

  const storageKey = currentUser ? `promptnx:likes:${currentUser.uid}` : null

  useEffect(() => {
    if (!currentUser) {
      setIsLiked(false)
      return
    }
    try {
      const stored = storageKey ? JSON.parse(localStorage.getItem(storageKey) || '[]') : []
      setIsLiked(stored.includes(promptId))
    } catch {
      setIsLiked(false)
    }
  }, [currentUser, promptId, storageKey])

  const handleLike = async () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      window.location.hash = "#login"
      return
    }

    setIsLoading(true)

    try {
      const storedLikes: string[] = storageKey
        ? JSON.parse(localStorage.getItem(storageKey) || '[]')
        : []

      if (isLiked) {
        const updated = storedLikes.filter(id => id !== promptId)
        if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(updated))
        }
        setLikesCount(prev => Math.max(0, prev - 1))
        setIsLiked(false)
        success("Unliked", "You unliked this prompt")
      } else {
        const updated = Array.from(new Set([...storedLikes, promptId]))
        if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(updated))
        }
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
