import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
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

  const storageKey = currentUser ? `promptnx:follows:${currentUser.uid}` : null

  useEffect(() => {
    if (!currentUser) {
      setIsFollowing(false)
      return
    }
    try {
      const stored = storageKey ? JSON.parse(localStorage.getItem(storageKey) || '[]') : []
      setIsFollowing(stored.includes(sellerId))
    } catch {
      setIsFollowing(false)
    }
  }, [currentUser, sellerId, storageKey])

  const handleFollow = async () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      window.location.hash = "#login"
      return
    }

    setIsLoading(true)

    try {
      const stored: string[] = storageKey
        ? JSON.parse(localStorage.getItem(storageKey) || '[]')
        : []

      if (isFollowing) {
        const updated = stored.filter(id => id !== sellerId)
        if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(updated))
        }
        setIsFollowing(false)
        success("Unfollowed", `You unfollowed ${sellerName}`)
      } else {
        const updated = Array.from(new Set([...stored, sellerId]))
        if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(updated))
        }
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
