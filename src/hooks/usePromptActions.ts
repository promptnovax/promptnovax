import { useState, useCallback } from "react"
import { 
  doc, 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  increment, 
  decrement,
  runTransaction,
  getDoc,
  serverTimestamp
} from "firebase/firestore"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"

export function usePromptActions() {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  // Like/Unlike a prompt
  const toggleLike = useCallback(async (promptId: string) => {
    if (!currentUser) {
      window.location.hash = '#login'
      return
    }

    if (!isFirebaseConfigured || !firebaseDb) {
      // Demo mode - just show toast
      success("Demo Mode", "Like functionality would work in production")
      return
    }

    setLoading(`like-${promptId}`)
    
    try {
      const promptRef = doc(firebaseDb, 'prompts', promptId)
      const likeRef = doc(firebaseDb, 'prompts', promptId, 'likes', currentUser.uid)
      
      await runTransaction(firebaseDb, async (transaction) => {
        const likeDoc = await transaction.get(likeRef)
        const promptDoc = await transaction.get(promptRef)
        
        if (!promptDoc.exists()) {
          throw new Error('Prompt not found')
        }
        
        if (likeDoc.exists()) {
          // Unlike: remove like document and decrement count
          transaction.delete(likeRef)
          transaction.update(promptRef, {
            likesCount: increment(-1),
            likes: promptDoc.data()?.likes?.filter((uid: string) => uid !== currentUser.uid) || []
          })
        } else {
          // Like: add like document and increment count
          transaction.set(likeRef, {
            userId: currentUser.uid,
            createdAt: serverTimestamp()
          })
          const currentLikes = promptDoc.data()?.likes || []
          transaction.update(promptRef, {
            likesCount: increment(1),
            likes: [...currentLikes, currentUser.uid]
          })
        }
      })
      
      success("Success", "Like status updated")
    } catch (err: any) {
      console.error('Error toggling like:', err)
      error("Error", err.message || "Failed to update like status")
    } finally {
      setLoading(null)
    }
  }, [currentUser, success, error])

  // Save/Unsave a prompt
  const toggleSave = useCallback(async (promptId: string) => {
    if (!currentUser) {
      window.location.hash = '#login'
      return
    }

    if (!isFirebaseConfigured || !firebaseDb) {
      // Demo mode - just show toast
      success("Demo Mode", "Save functionality would work in production")
      return
    }

    setLoading(`save-${promptId}`)
    
    try {
      const savedPromptRef = doc(firebaseDb, 'users', currentUser.uid, 'savedPrompts', promptId)
      const promptRef = doc(firebaseDb, 'prompts', promptId)
      
      await runTransaction(firebaseDb, async (transaction) => {
        const savedDoc = await transaction.get(savedPromptRef)
        const promptDoc = await transaction.get(promptRef)
        
        if (!promptDoc.exists()) {
          throw new Error('Prompt not found')
        }
        
        if (savedDoc.exists()) {
          // Unsave: remove saved document and decrement count
          transaction.delete(savedPromptRef)
          const currentSaves = promptDoc.data()?.saves || []
          transaction.update(promptRef, {
            savesCount: increment(-1),
            saves: currentSaves.filter((uid: string) => uid !== currentUser.uid)
          })
        } else {
          // Save: add saved document and increment count
          transaction.set(savedPromptRef, {
            promptId,
            savedAt: serverTimestamp()
          })
          const currentSaves = promptDoc.data()?.saves || []
          transaction.update(promptRef, {
            savesCount: increment(1),
            saves: [...currentSaves, currentUser.uid]
          })
        }
      })
      
      success("Success", "Save status updated")
    } catch (err: any) {
      console.error('Error toggling save:', err)
      error("Error", err.message || "Failed to update save status")
    } finally {
      setLoading(null)
    }
  }, [currentUser, success, error])

  // Follow/Unfollow a user
  const toggleFollow = useCallback(async (targetUserId: string) => {
    if (!currentUser) {
      window.location.hash = '#login'
      return
    }

    if (currentUser.uid === targetUserId) {
      error("Error", "You cannot follow yourself")
      return
    }

    if (!isFirebaseConfigured || !firebaseDb) {
      // Demo mode - just show toast
      success("Demo Mode", "Follow functionality would work in production")
      return
    }

    setLoading(`follow-${targetUserId}`)
    
    try {
      const currentUserRef = doc(firebaseDb, 'users', currentUser.uid)
      const targetUserRef = doc(firebaseDb, 'users', targetUserId)
      
      await runTransaction(firebaseDb, async (transaction) => {
        const currentUserDoc = await transaction.get(currentUserRef)
        const targetUserDoc = await transaction.get(targetUserRef)
        
        if (!currentUserDoc.exists() || !targetUserDoc.exists()) {
          throw new Error('User not found')
        }
        
        const currentFollowing = currentUserDoc.data()?.following || []
        const targetFollowers = targetUserDoc.data()?.followers || []
        
        if (currentFollowing.includes(targetUserId)) {
          // Unfollow: remove from following and followers
          transaction.update(currentUserRef, {
            following: currentFollowing.filter((uid: string) => uid !== targetUserId)
          })
          transaction.update(targetUserRef, {
            followers: targetFollowers.filter((uid: string) => uid !== currentUser.uid)
          })
        } else {
          // Follow: add to following and followers
          transaction.update(currentUserRef, {
            following: [...currentFollowing, targetUserId]
          })
          transaction.update(targetUserRef, {
            followers: [...targetFollowers, currentUser.uid]
          })
        }
      })
      
      success("Success", "Follow status updated")
    } catch (err: any) {
      console.error('Error toggling follow:', err)
      error("Error", err.message || "Failed to update follow status")
    } finally {
      setLoading(null)
    }
  }, [currentUser, success, error])

  // Check if user has liked a prompt
  const isLiked = useCallback((prompt: any) => {
    return currentUser ? prompt.likes?.includes(currentUser.uid) : false
  }, [currentUser])

  // Check if user has saved a prompt
  const isSaved = useCallback((prompt: any) => {
    return currentUser ? prompt.saves?.includes(currentUser.uid) : false
  }, [currentUser])

  // Check if user is following another user
  const isFollowing = useCallback((user: any) => {
    return currentUser ? user.followers?.includes(currentUser.uid) : false
  }, [currentUser])

  return {
    toggleLike,
    toggleSave,
    toggleFollow,
    isLiked,
    isSaved,
    isFollowing,
    loading
  }
}
