import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  limit
} from "firebase/firestore"
import { MessageCircle, Send, Calendar, User } from "lucide-react"

interface Comment {
  id: string
  userId: string
  username: string
  userAvatar?: string
  text: string
  createdAt: any
}

interface CommentSectionProps {
  promptId: string
}

export function CommentSection({ promptId }: CommentSectionProps) {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isFirebaseConfigured && firebaseDb) {
      loadComments()
    } else {
      // Load mock comments for demo mode
      loadMockComments()
    }
  }, [promptId])

  const loadComments = () => {
    if (!isFirebaseConfigured || !firebaseDb) return

    const commentsRef = collection(firebaseDb, 'prompts', promptId, 'comments')
    const q = query(commentsRef, orderBy('createdAt', 'desc'), limit(50))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[]
      setComments(commentsData)
      setIsLoading(false)
    })

    return unsubscribe
  }

  const loadMockComments = () => {
    // Mock comments for demo mode
    const mockComments: Comment[] = [
      {
        id: "1",
        userId: "user1",
        username: "John Doe",
        userAvatar: "https://github.com/shadcn.png",
        text: "This prompt is amazing! It helped me improve my code quality significantly. The security suggestions were particularly helpful.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        id: "2",
        userId: "user2",
        username: "Sarah Wilson",
        userAvatar: "https://github.com/shadcn.png",
        text: "Great prompt! I've been using it for all my code reviews. The structure is clear and the suggestions are actionable.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        id: "3",
        userId: "user3",
        username: "Mike Chen",
        userAvatar: "https://github.com/shadcn.png",
        text: "Excellent work! This has become my go-to prompt for code reviews. Highly recommend it to other developers.",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      }
    ]
    setComments(mockComments)
    setIsLoading(false)
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    if (!currentUser) {
      window.location.hash = "#login"
      return
    }

    if (!isFirebaseConfigured || !firebaseDb) {
      // Mock functionality for demo mode
      handleMockSubmitComment()
      return
    }

    setIsSubmitting(true)

    try {
      const commentsRef = collection(firebaseDb, 'prompts', promptId, 'comments')
      await addDoc(commentsRef, {
        userId: currentUser.uid,
        username: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
        userAvatar: currentUser.photoURL || null,
        text: newComment.trim(),
        createdAt: serverTimestamp()
      })

      setNewComment("")
      success("Comment added", "Your comment has been posted")
    } catch (err: any) {
      console.error('Error adding comment:', err)
      error("Comment failed", err.message || "Failed to post comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMockSubmitComment = () => {
    const newCommentData: Comment = {
      id: Date.now().toString(),
      userId: currentUser?.uid || "mock-user",
      username: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Anonymous',
      userAvatar: currentUser?.photoURL || "https://github.com/shadcn.png",
      text: newComment.trim(),
      createdAt: new Date()
    }

    setComments(prev => [newCommentData, ...prev])
    setNewComment("")
    success("Comment added", "Your comment has been posted")
  }

  const formatDate = (date: any) => {
    if (!date) return "Unknown"
    const d = date.toDate ? date.toDate() : new Date(date)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
        <CardDescription>
          Share your thoughts and experiences with this prompt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.photoURL || undefined} />
                <AvatarFallback>
                  {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                    size="sm"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"
                        />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 border rounded-lg bg-muted/50">
            <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              Please log in to leave a comment
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.hash = "#login"}
            >
              Log In
            </Button>
          </div>
        )}

        <Separator />

        {/* Comments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-8 w-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex gap-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.userAvatar} />
                    <AvatarFallback>
                      {comment.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.username}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
