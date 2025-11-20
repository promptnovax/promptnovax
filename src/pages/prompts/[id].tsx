import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { ContactButtons } from "@/components/contact/ContactButtons"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { generateProductImage, generateProductImageGallery, generateProductThumbnail, getCategoryPlaceholder } from "@/lib/marketplaceImages"
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, collection, query, where, getDocs, addDoc, orderBy, limit } from "firebase/firestore"
import { 
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Download,
  Calendar,
  User,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Loader2,
  AlertCircle,
  MessageCircle,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Star,
  TrendingUp,
  ShoppingCart
} from "lucide-react"

interface PromptDetailPageProps {
  id: string
}

interface PromptData {
  id: string
  uid: string
  title: string
  description: string
  category: string
  tags: string[]
  difficulty: string
  visibility: boolean
  previewImageURL?: string
  fileURL?: string
  likes: string[]
  saves: string[]
  createdAt: any
  lastEditedAt?: any
  creatorName?: string
  creatorAvatar?: string
}

export function PromptDetailPage({ id }: PromptDetailPageProps) {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [prompt, setPrompt] = useState<PromptData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiking, setIsLiking] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const isOwner = currentUser?.uid === prompt?.uid
  const isLiked = currentUser ? prompt?.likes.includes(currentUser.uid) : false
  const isSaved = currentUser ? prompt?.saves.includes(currentUser.uid) : false

  useEffect(() => {
    if (id) {
      loadPrompt()
    }
  }, [id])

  const loadPrompt = async () => {
    if (!isFirebaseConfigured || !firebaseDb) {
      // Mock data for demo mode
      loadMockData()
      return
    }

    try {
      setLoading(true)
      const promptRef = doc(firebaseDb, 'prompts', id)
      const promptSnap = await getDoc(promptRef)

      if (!promptSnap.exists()) {
        error("Prompt not found", "The prompt you're looking for doesn't exist")
        return
      }

      const data = promptSnap.data()
      let creatorName = "Unknown User"
      let creatorAvatar = ""

      // Fetch creator info
      if (data.uid) {
        try {
          const userRef = doc(firebaseDb, 'users', data.uid)
          const userSnap = await getDoc(userRef)
          if (userSnap.exists()) {
            const userData = userSnap.data()
            creatorName = userData.displayName || userData.email?.split('@')[0] || "Unknown User"
            creatorAvatar = userData.photoURL || ""
          }
        } catch (err) {
          console.error('Error fetching user data:', err)
        }
      }

      const promptData: PromptData = {
        id: promptSnap.id,
        ...data,
        creatorName,
        creatorAvatar
      } as PromptData

      setPrompt(promptData)
    } catch (err: any) {
      console.error('Error loading prompt:', err)
      error("Loading failed", "Failed to load prompt details")
    } finally {
      setLoading(false)
    }
  }

  const [imageGallery, setImageGallery] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [relatedPrompts, setRelatedPrompts] = useState<PromptData[]>([])

  const loadMockData = () => {
    const mockPrompt: PromptData = {
      id: id,
      uid: "user1",
      title: "Advanced Code Review Assistant",
      description: "Get comprehensive code reviews with suggestions for improvements, security vulnerabilities, and best practices. This prompt helps developers write better, more secure code by providing detailed feedback on their implementations.\n\n## Features:\n- Security vulnerability detection\n- Code quality analysis\n- Performance optimization suggestions\n- Best practices recommendations\n- Style and formatting feedback\n\n## Usage:\nSimply paste your code and ask for a review. The AI will provide detailed feedback on various aspects of your code.",
      category: "development",
      tags: ["code", "review", "security", "best-practices", "development"],
      difficulty: "intermediate",
      visibility: true,
      previewImageURL: generateProductImage("development", id, "Advanced Code Review Assistant"),
      fileURL: "https://example.com/sample-file.json",
      likes: ["user2", "user3", "user4"],
      saves: ["user5", "user6"],
      createdAt: new Date(),
      lastEditedAt: new Date(),
      creatorName: "CodeMaster Pro",
      creatorAvatar: generateProductThumbnail("development", "user1", "CodeMaster Pro")
    }
    
    // Generate image gallery for this product
    const gallery = generateProductImageGallery("development", id, mockPrompt.title, 4)
    setImageGallery(gallery)
    
    // Generate related prompts with proper images
    const related: PromptData[] = [
      {
        id: "2",
        uid: "user2",
        title: "Code Documentation Generator",
        description: "Generate comprehensive documentation for your code",
        category: "development",
        tags: ["code", "documentation", "docs"],
        difficulty: "beginner",
        visibility: true,
        previewImageURL: generateProductImage("development", "2", "Code Documentation Generator"),
        likes: [],
        saves: [],
        createdAt: new Date(),
        creatorName: "DevMaster",
        creatorAvatar: generateProductThumbnail("development", "user2", "DevMaster")
      },
      {
        id: "3",
        uid: "user3",
        title: "Security Code Scanner",
        description: "Identify security vulnerabilities in your codebase",
        category: "development",
        tags: ["security", "scanner", "vulnerability"],
        difficulty: "advanced",
        visibility: true,
        previewImageURL: generateProductImage("development", "3", "Security Code Scanner"),
        likes: [],
        saves: [],
        createdAt: new Date(),
        creatorName: "Security Expert",
        creatorAvatar: generateProductThumbnail("development", "user3", "Security Expert")
      }
    ]
    setRelatedPrompts(related)
    
    setPrompt(mockPrompt)
    setLoading(false)
  }

  // Load related prompts
  useEffect(() => {
    if (prompt && isFirebaseConfigured && firebaseDb) {
      loadRelatedPrompts()
    }
  }, [prompt])

  const handleLike = async () => {
    if (!currentUser) {
      window.location.hash = '#login'
      return
    }

    if (!prompt || !isFirebaseConfigured || !firebaseDb) {
      // Mock functionality for demo mode
      setPrompt(prev => prev ? {
        ...prev,
        likes: isLiked 
          ? prev.likes.filter(uid => uid !== currentUser.uid)
          : [...prev.likes, currentUser.uid]
      } : null)
      success(isLiked ? "Unliked" : "Liked", isLiked ? "Prompt unliked" : "Prompt liked")
      return
    }

    setIsLiking(true)
    try {
      const promptRef = doc(firebaseDb, 'prompts', prompt.id)
      
      if (isLiked) {
        await updateDoc(promptRef, {
          likes: arrayRemove(currentUser.uid),
          lastEditedAt: serverTimestamp()
        })
        setPrompt(prev => prev ? {
          ...prev,
          likes: prev.likes.filter(uid => uid !== currentUser.uid)
        } : null)
        success("Unliked", "Prompt unliked successfully")
      } else {
        await updateDoc(promptRef, {
          likes: arrayUnion(currentUser.uid),
          lastEditedAt: serverTimestamp()
        })
        setPrompt(prev => prev ? {
          ...prev,
          likes: [...prev.likes, currentUser.uid]
        } : null)
        success("Liked", "Prompt liked successfully")
      }
    } catch (err: any) {
      console.error('Error updating like:', err)
      error("Action failed", "Failed to update like status")
    } finally {
      setIsLiking(false)
    }
  }

  const handleSave = async () => {
    if (!currentUser) {
      window.location.hash = '#login'
      return
    }

    if (!prompt || !isFirebaseConfigured || !firebaseDb) {
      // Mock functionality for demo mode
      setPrompt(prev => prev ? {
        ...prev,
        saves: isSaved 
          ? prev.saves.filter(uid => uid !== currentUser.uid)
          : [...prev.saves, currentUser.uid]
      } : null)
      success(isSaved ? "Unsaved" : "Saved", isSaved ? "Prompt removed from saves" : "Prompt saved")
      return
    }

    setIsSaving(true)
    try {
      const promptRef = doc(firebaseDb, 'prompts', prompt.id)
      
      if (isSaved) {
        await updateDoc(promptRef, {
          saves: arrayRemove(currentUser.uid),
          lastEditedAt: serverTimestamp()
        })
        setPrompt(prev => prev ? {
          ...prev,
          saves: prev.saves.filter(uid => uid !== currentUser.uid)
        } : null)
        success("Unsaved", "Prompt removed from your saves")
      } else {
        await updateDoc(promptRef, {
          saves: arrayUnion(currentUser.uid),
          lastEditedAt: serverTimestamp()
        })
        setPrompt(prev => prev ? {
          ...prev,
          saves: [...prev.saves, currentUser.uid]
        } : null)
        success("Saved", "Prompt saved to your collection")
      }
    } catch (err: any) {
      console.error('Error updating save:', err)
      error("Action failed", "Failed to update save status")
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = () => {
    const url = window.location.origin + `#prompts/${prompt?.id}`
    
    if (navigator.share) {
      navigator.share({
        title: prompt?.title,
        text: prompt?.description,
        url: url
      })
    } else {
      navigator.clipboard.writeText(url)
      success("Link copied", "Prompt link copied to clipboard")
    }
  }

  const handleCopyPrompt = () => {
    if (prompt?.description) {
      navigator.clipboard.writeText(prompt.description)
      success("Copied", "Prompt content copied to clipboard")
    }
  }

  const handleEdit = () => {
    window.location.hash = `#prompts/edit/${prompt?.id}`
  }

  const handleDelete = () => {
    // TODO: Implement delete functionality
    error("Not implemented", "Delete functionality will be implemented soon")
  }

  const handleCreatorClick = () => {
    window.location.hash = `#user/${prompt?.uid}`
  }


  const handleBackToPrompts = () => {
    window.location.hash = "#dashboard/index"
  }

  const loadRelatedPrompts = async () => {
    if (!prompt || !isFirebaseConfigured || !firebaseDb) return
    
    try {
      const relatedQuery = query(
        collection(firebaseDb, 'prompts'),
        where('category', '==', prompt.category),
        where('visibility', '==', true),
        orderBy('createdAt', 'desc'),
        limit(3)
      )
      const relatedSnapshot = await getDocs(relatedQuery)
      const related: PromptData[] = []
      
      for (const doc of relatedSnapshot.docs) {
        if (doc.id === prompt.id) continue // Skip current prompt
        
        const data = doc.data()
        let creatorName = "Unknown User"
        let creatorAvatar = ""
        
        if (data.uid) {
          try {
            const userRef = doc(firebaseDb, 'users', data.uid)
            const userSnap = await getDoc(userRef)
            if (userSnap.exists()) {
              const userData = userSnap.data()
              creatorName = userData.displayName || userData.email?.split('@')[0] || "Unknown User"
              creatorAvatar = userData.photoURL || ""
            }
          } catch (err) {
            console.error('Error fetching user data:', err)
          }
        }
        
        related.push({
          id: doc.id,
          ...data,
          creatorName,
          creatorAvatar: creatorAvatar || generateProductThumbnail(data.category, data.uid, creatorName)
        } as PromptData)
      }
      
      // Generate images for related prompts
      related.forEach((rp) => {
        if (!rp.previewImageURL) {
          rp.previewImageURL = generateProductImage(rp.category, rp.id, rp.title)
        }
      })
      
      setRelatedPrompts(related.slice(0, 3))
    } catch (err) {
      console.error('Error loading related prompts:', err)
    }
  }

  useEffect(() => {
    if (prompt?.previewImageURL || imageGallery.length > 0) {
      const gallery = imageGallery.length > 0 ? imageGallery : [prompt.previewImageURL].filter(Boolean) as string[]
      setImageGallery(gallery)
      setImageLoaded(false)
    }
  }, [prompt?.previewImageURL])

  const formatDate = (date: any) => {
    if (!date) return "Unknown"
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      development: "Development",
      writing: "Writing",
      business: "Business",
      ai: "AI & ML",
      marketing: "Marketing",
      data: "Data Science",
      design: "Design",
      education: "Education",
      health: "Health & Fitness",
      other: "Other"
    }
    return categories[category] || category
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading prompt...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
              <h1 className="text-2xl font-bold">Prompt Not Found</h1>
              <p className="text-muted-foreground">
                The prompt you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={handleBackToPrompts}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Prompts
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-background"
      >
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={handleBackToPrompts}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Prompts
          </Button>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Title and Meta */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h1 className="text-3xl font-bold">{prompt.title}</h1>
                        {isOwner && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleEdit}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleDelete}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="secondary" className="capitalize">
                          {getCategoryLabel(prompt.category)}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${getDifficultyColor(prompt.difficulty)}`}
                        >
                          {prompt.difficulty}
                        </Badge>
                        {!prompt.visibility && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <EyeOff className="h-3 w-3" />
                            Private
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Creator Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10" onClick={handleCreatorClick}>
                        <AvatarImage src={prompt.creatorAvatar} />
                        <AvatarFallback>
                          {prompt.creatorName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p 
                          className="font-medium cursor-pointer hover:text-primary transition-colors"
                          onClick={handleCreatorClick}
                        >
                          {prompt.creatorName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created {formatDate(prompt.createdAt)}
                          {prompt.lastEditedAt && (
                            <span> • Edited {formatDate(prompt.lastEditedAt)}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    {prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {prompt.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Product Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0 relative group">
                  {(prompt.previewImageURL || imageGallery.length > 0) ? (
                    <>
                      {/* Loading Placeholder */}
                      {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center z-10 animate-pulse">
                          <div className="text-center">
                            <ImageIcon className="h-12 w-12 text-primary/50 mx-auto mb-2 animate-pulse" />
                            <p className="text-sm text-muted-foreground">Loading HD Image...</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Main Product Image */}
                      <img
                        src={imageGallery[currentImageIndex] || prompt.previewImageURL}
                        alt={prompt.title}
                        loading="eager"
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-96 object-cover transition-all duration-500 ${
                          imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                        }`}
                        style={{
                          imageRendering: 'high-quality',
                          objectFit: 'cover'
                        }}
                      />
                      
                      {/* Image Gallery Navigation */}
                      {imageGallery.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentImageIndex((prev) => (prev - 1 + imageGallery.length) % imageGallery.length)
                              setImageLoaded(false)
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentImageIndex((prev) => (prev + 1) % imageGallery.length)
                              setImageLoaded(false)
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </Button>
                          
                          {/* Image Indicators */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {imageGallery.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setCurrentImageIndex(index)
                                  setImageLoaded(false)
                                }}
                                className={`h-2 rounded-full transition-all ${
                                  index === currentImageIndex
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/50 hover:bg-white/75'
                                }`}
                              />
                            ))}
                          </div>
                          
                          {/* Image Counter */}
                          <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-md backdrop-blur-sm">
                            {currentImageIndex + 1} / {imageGallery.length}
                          </div>
                        </>
                      )}
                      
                      {/* Zoom Button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-4 left-4 bg-white/90 hover:bg-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          // Open image in fullscreen/modal
                          window.open(imageGallery[currentImageIndex] || prompt.previewImageURL, '_blank')
                        }}
                      >
                        <ZoomIn className="h-4 w-4 mr-2" />
                        View Full Size
                      </Button>
                    </>
                  ) : (
                    <div className="w-full h-96 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">{getCategoryPlaceholder(prompt.category)}</div>
                        <p className="text-lg text-muted-foreground font-medium">AI Prompt</p>
                        <p className="text-sm text-muted-foreground/70 mt-2">{getCategoryLabel(prompt.category)}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Related Products */}
            {relatedPrompts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Related Products</CardTitle>
                      <Badge variant="secondary">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Similar Items
                      </Badge>
                    </div>
                    <CardDescription>Discover more prompts like this one</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {relatedPrompts.map((relatedPrompt) => (
                        <motion.div
                          key={relatedPrompt.id}
                          whileHover={{ scale: 1.02 }}
                          className="group cursor-pointer"
                          onClick={() => window.location.hash = `#prompts/${relatedPrompt.id}`}
                        >
                          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="relative">
                              {relatedPrompt.previewImageURL ? (
                                <img
                                  src={relatedPrompt.previewImageURL}
                                  alt={relatedPrompt.title}
                                  className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                  <div className="text-3xl">{getCategoryPlaceholder(relatedPrompt.category)}</div>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                                {relatedPrompt.title}
                              </h4>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {relatedPrompt.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {getCategoryLabel(relatedPrompt.category)}
                                </Badge>
                                <div className="flex items-center gap-1 ml-auto">
                                  <Heart className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{relatedPrompt.likes.length}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {prompt.description}
                    </pre>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" onClick={handleCopyPrompt}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Prompt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* File Download */}
            {prompt.fileURL && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Files</CardTitle>
                    <CardDescription>
                      Download additional resources for this prompt
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <a href={prompt.fileURL} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download File
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    className="w-full"
                    onClick={handleLike}
                    disabled={isLiking}
                  >
                    {isLiking ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    )}
                    {isLiked ? 'Liked' : 'Like'} ({prompt.likes.length})
                  </Button>
                  
                  <Button
                    variant={isSaved ? "default" : "outline"}
                    className="w-full"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                    )}
                    {isSaved ? 'Saved' : 'Save'} ({prompt.saves.length})
                  </Button>
                  
                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>

                  {!isOwner && (
                    <ContactButtons
                      userId={prompt?.uid}
                      userName={prompt?.creatorName || "Creator"}
                      className="w-full"
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Likes</span>
                    <span className="font-medium">{prompt.likes.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Saves</span>
                    <span className="font-medium">{prompt.saves.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="font-medium">{formatDate(prompt.createdAt)}</span>
                  </div>
                  {prompt.lastEditedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Edited</span>
                      <span className="font-medium">{formatDate(prompt.lastEditedAt)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
