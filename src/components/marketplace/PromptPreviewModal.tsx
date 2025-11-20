import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/context/CartContext"
import { ContactButtons } from "@/components/contact/ContactButtons"
import { generateProductImageGallery, getCategoryPlaceholder } from "@/lib/marketplaceImages"
import { 
  X,
  Heart,
  Bookmark,
  Share2,
  UserPlus,
  Eye,
  Download,
  Calendar,
  ExternalLink,
  Copy,
  Loader2,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  ShoppingCart,
  Check,
  MessageCircle
} from "lucide-react"

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

interface PromptPreviewModalProps {
  prompt: PromptData | null
  isOpen: boolean
  onClose: () => void
  onViewFull: (promptId: string) => void
  onLike?: (promptId: string) => void
  onSave?: (promptId: string) => void
  onShare?: (promptId: string) => void
  onFollow?: (userId: string) => void
}

export function PromptPreviewModal({
  prompt,
  isOpen,
  onClose,
  onViewFull,
  onLike,
  onSave,
  onShare,
  onFollow
}: PromptPreviewModalProps) {
  const { currentUser } = useAuth()
  const { success } = useToast()
  const { addItem, isInCart } = useCart()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageGallery, setImageGallery] = useState<string[]>([])
  const [justAddedToCart, setJustAddedToCart] = useState(false)
  
  // Default price if not provided
  const productPrice = (prompt as any)?.price || 29.99
  const inCart = prompt ? isInCart(prompt.id) : false

  useEffect(() => {
    if (prompt) {
      // Generate image gallery if image exists
      if (prompt.previewImageURL) {
        const gallery = generateProductImageGallery(
          prompt.category,
          prompt.id,
          prompt.title,
          3
        )
        setImageGallery(gallery)
      } else {
        setImageGallery([])
      }
      setCurrentImageIndex(0)
      setImageLoaded(false)
    }
  }, [prompt])

  if (!prompt) return null

  const isOwner = currentUser?.uid === prompt.uid
  const isLiked = currentUser ? prompt.likes.includes(currentUser.uid) : false
  const isSaved = currentUser ? prompt.saves.includes(currentUser.uid) : false
  
  const displayImage = imageGallery[currentImageIndex] || prompt.previewImageURL || null
  
  const nextImage = () => {
    if (imageGallery.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % imageGallery.length)
      setImageLoaded(false)
    }
  }
  
  const prevImage = () => {
    if (imageGallery.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + imageGallery.length) % imageGallery.length)
      setImageLoaded(false)
    }
  }

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

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentUser) {
      window.location.hash = '#login'
      return
    }
    onLike?.(prompt.id)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentUser) {
      window.location.hash = '#login'
      return
    }
    onSave?.(prompt.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = window.location.origin + `#prompts/${prompt.id}`
    
    if (navigator.share) {
      navigator.share({
        title: prompt.title,
        text: prompt.description,
        url: url
      })
    } else {
      navigator.clipboard.writeText(url)
      success("Link copied", "Prompt link copied to clipboard")
    }
    onShare?.(prompt.id)
  }

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentUser) {
      window.location.hash = '#login'
      return
    }
    onFollow?.(prompt.uid)
  }

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(prompt.description)
    success("Copied", "Prompt content copied to clipboard")
  }

  const handleViewCreator = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.location.hash = `#user/${prompt.uid}`
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!prompt) return
    
    addItem({
      id: prompt.id,
      title: prompt.title,
      price: productPrice,
      imageUrl: prompt.previewImageURL,
      category: prompt.category,
      description: prompt.description,
      sellerId: prompt.uid,
      sellerName: prompt.creatorName
    })
    setJustAddedToCart(true)
    success("Added to Cart", `${prompt.title} has been added to your cart`)
    setTimeout(() => setJustAddedToCart(false), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <DialogHeader className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <DialogTitle className="text-2xl font-bold line-clamp-2">
                      {prompt.title}
                    </DialogTitle>
                    <div className="flex items-center gap-3">
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
                        <Badge variant="outline">Private</Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Left Column: Image and Creator */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Professional Preview Image Gallery */}
                    {displayImage ? (
                      <div className="relative w-full h-64 rounded-xl overflow-hidden bg-muted group">
                        {/* Loading State */}
                        {!imageLoaded && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center animate-pulse z-10">
                            <div className="text-center">
                              <ImageIcon className="h-10 w-10 text-primary/50 mx-auto mb-2 animate-pulse" />
                              <p className="text-xs text-muted-foreground">Loading HD Image...</p>
                            </div>
                          </div>
                        )}
                        
                        {/* High-Quality Image */}
                        <img
                          src={displayImage}
                          alt={prompt.title}
                          loading="eager"
                          onLoad={() => setImageLoaded(true)}
                          className={`w-full h-full object-cover transition-all duration-500 ${
                            imageLoaded 
                              ? 'opacity-100 scale-100' 
                              : 'opacity-0 scale-105'
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
                              onClick={(e) => {
                                e.stopPropagation()
                                prevImage()
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                nextImage()
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                            
                            {/* Image Indicators */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                              {imageGallery.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setCurrentImageIndex(index)
                                    setImageLoaded(false)
                                  }}
                                  className={`h-2 rounded-full transition-all ${
                                    index === currentImageIndex
                                      ? 'w-6 bg-white'
                                      : 'w-2 bg-white/50 hover:bg-white/75'
                                  }`}
                                />
                              ))}
                            </div>
                            
                            {/* Image Counter */}
                            <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                              {currentImageIndex + 1} / {imageGallery.length}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl mb-3 transform hover:scale-110 transition-transform">
                            {getCategoryPlaceholder(prompt.category)}
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">AI Prompt</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">{getCategoryLabel(prompt.category)}</p>
                        </div>
                      </div>
                    )}

                    {/* Creator Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12" onClick={handleViewCreator}>
                          <AvatarImage src={prompt.creatorAvatar} />
                          <AvatarFallback>
                            {prompt.creatorName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p 
                            className="font-semibold cursor-pointer hover:text-primary transition-colors"
                            onClick={handleViewCreator}
                          >
                            {prompt.creatorName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Created {formatDate(prompt.createdAt)}
                          </p>
                        </div>
                      </div>

                      {!isOwner && (
                        <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleFollow}
                          className="w-full"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                            Follow
                        </Button>
                          <ContactButtons
                            userId={prompt.uid}
                            userName={prompt.creatorName || "Creator"}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Likes</span>
                        <span className="font-medium">{prompt.likes.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Saves</span>
                        <span className="font-medium">{prompt.saves.length}</span>
                      </div>
                      {prompt.fileURL && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Files</span>
                          <span className="font-medium">1</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Description and Actions */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Description</h3>
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
                          {prompt.description}
                        </pre>
                      </div>
                    </div>

                    {/* Tags */}
                    {prompt.tags.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {prompt.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Actions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant={isLiked ? "default" : "outline"}
                          onClick={handleLike}
                          className="w-full"
                        >
                          <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                          {isLiked ? 'Liked' : 'Like'} ({prompt.likes.length})
                        </Button>
                        
                        <Button
                          variant={isSaved ? "default" : "outline"}
                          onClick={handleSave}
                          className="w-full"
                        >
                          <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                          {isSaved ? 'Saved' : 'Save'} ({prompt.saves.length})
                        </Button>
                        
                        <Button variant="outline" onClick={handleShare} className="w-full">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        
                        <Button variant="outline" onClick={handleCopyPrompt} className="w-full">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>

                      {/* Primary Actions */}
                      <div className="space-y-3 pt-4">
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                          <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="text-2xl font-bold text-primary">${productPrice.toFixed(2)}</p>
                          </div>
                          <Button
                            variant={inCart || justAddedToCart ? "default" : "outline"}
                            size="lg"
                            onClick={handleAddToCart}
                            className="min-w-[140px]"
                          >
                            {inCart || justAddedToCart ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                In Cart
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                        </div>
                        
                        <div className="flex gap-3">
                        <Button
                          onClick={() => onViewFull(prompt.id)}
                          className="flex-1"
                          size="lg"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Prompt
                        </Button>
                        
                        {prompt.fileURL && (
                          <Button variant="outline" size="lg" asChild>
                            <a href={prompt.fileURL} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </a>
                          </Button>
                        )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
