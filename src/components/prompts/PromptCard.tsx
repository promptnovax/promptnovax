import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Heart,
  Bookmark,
  Share2,
  Eye,
  Download,
  Calendar,
  User,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  ImageIcon,
  ZoomIn,
  ShoppingCart,
  Check
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { usePromptActions } from "@/hooks/usePromptActions"
import { useCart } from "@/context/CartContext"
import { getCategoryPlaceholder } from "@/lib/marketplaceImages"

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

interface PromptCardProps {
  prompt: PromptData
  showActions?: boolean
  onEdit?: (promptId: string) => void
  onDelete?: (promptId: string) => void
  onLike?: (promptId: string) => void
  onSave?: (promptId: string) => void
  onShare?: (promptId: string) => void
  className?: string
}

export function PromptCard({ 
  prompt, 
  showActions = true, 
  onEdit, 
  onDelete, 
  onLike, 
  onSave, 
  onShare,
  className = ""
}: PromptCardProps) {
  const { currentUser } = useAuth()
  const { success } = useToast()
  const { toggleLike, toggleSave, isLiked: checkIsLiked, isSaved: checkIsSaved, loading } = usePromptActions()
  const { addItem, isInCart } = useCart()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [justAddedToCart, setJustAddedToCart] = useState(false)

  const isOwner = currentUser?.uid === prompt.uid
  const isLiked = checkIsLiked(prompt)
  const isSaved = checkIsSaved(prompt)
  const inCart = isInCart(prompt.id)
  
  // Default price if not provided (for marketplace)
  const productPrice = (prompt as any).price || 29.99

  // Reset image state when image URL changes
  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [prompt.previewImageURL])

  const formatDate = (date: any) => {
    if (!date) return "Unknown"
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const handlePromptClick = () => {
    window.location.hash = `#prompts/${prompt.id}`
  }

  const handleCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.location.hash = `#user/${prompt.uid}`
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onLike) {
      onLike(prompt.id)
    } else {
      toggleLike(prompt.id)
    }
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onSave) {
      onSave(prompt.id)
    } else {
      toggleSave(prompt.id)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: prompt.title,
        text: prompt.description,
        url: window.location.origin + `#prompts/${prompt.id}`
      })
    } else {
      navigator.clipboard.writeText(window.location.origin + `#prompts/${prompt.id}`)
      success("Link copied", "Prompt link copied to clipboard")
    }
    onShare?.(prompt.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(prompt.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(prompt.id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group ${className}`}
    >
      <Card 
        className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-primary/20"
        onClick={handlePromptClick}
      >
        {/* Image Header - Professional 4K/HD Images */}
        <div className="relative overflow-hidden bg-muted">
          {prompt.previewImageURL && !imageError ? (
            <>
              {/* Loading Placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center animate-pulse">
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 text-primary/50 mx-auto mb-2 animate-pulse" />
                    <p className="text-xs text-muted-foreground">Loading...</p>
                  </div>
                </div>
              )}
              
              {/* High-Quality Image */}
              <img
                src={prompt.previewImageURL}
                alt={prompt.title}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true)
                  setImageLoaded(false)
                }}
                className={`w-full h-48 object-cover transition-all duration-500 ${
                  imageLoaded 
                    ? 'opacity-100 scale-100 group-hover:scale-110 group-hover:brightness-110' 
                    : 'opacity-0 scale-105'
                }`}
                style={{
                  imageRendering: 'high-quality',
                  objectFit: 'cover'
                }}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePromptClick()
                  }}
                >
                  <ZoomIn className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:via-primary/15 group-hover:to-primary/10 transition-all duration-300">
              <div className="text-center">
                <div className="text-5xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {getCategoryPlaceholder(prompt.category)}
                </div>
                <p className="text-sm text-muted-foreground font-medium">AI Prompt</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{getCategoryLabel(prompt.category)}</p>
              </div>
            </div>
          )}
          
          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge variant="secondary" className="capitalize">
              {getCategoryLabel(prompt.category)}
            </Badge>
            <Badge 
              variant="outline" 
              className={`capitalize ${getDifficultyColor(prompt.difficulty)}`}
            >
              {prompt.difficulty}
            </Badge>
          </div>

          {/* Owner Actions */}
          {isOwner && showActions && (
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Visibility Badge */}
          {!prompt.visibility && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="outline" className="bg-white/90">
                Private
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5">
          {/* Title and Description */}
          <div className="space-y-3 mb-4">
            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {prompt.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {prompt.description}
            </p>
          </div>

          {/* Tags */}
          {prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {prompt.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {prompt.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{prompt.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Creator Info */}
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-6 w-6" onClick={handleCreatorClick}>
              <AvatarImage src={prompt.creatorAvatar} />
              <AvatarFallback className="text-xs">
                {prompt.creatorName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span 
              className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors"
              onClick={handleCreatorClick}
            >
              {prompt.creatorName || "Unknown User"}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(prompt.createdAt)}
            </span>
          </div>

          {/* Stats and Actions */}
          <div className="flex flex-col gap-3">
            {/* Price and Stats Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {prompt.likes.length}
                </div>
                <div className="flex items-center gap-1">
                  <Bookmark className="h-4 w-4" />
                  {prompt.saves.length}
                </div>
                {prompt.fileURL && (
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    File
                  </div>
                )}
              </div>
              
              {/* Price */}
              <div className="font-bold text-lg text-primary">
                ${productPrice.toFixed(2)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {showActions && (
                <>
                  <Button
                    variant={inCart || justAddedToCart ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={handleAddToCart}
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
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${isLiked ? 'text-red-500' : ''}`}
                      onClick={handleLike}
                      disabled={loading === `like-${prompt.id}`}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${isSaved ? 'text-blue-500' : ''}`}
                      onClick={handleSave}
                      disabled={loading === `save-${prompt.id}`}
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
