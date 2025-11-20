import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  X, 
  Eye, 
  Star, 
  Download, 
  Heart, 
  Tag, 
  DollarSign,
  Calendar,
  User,
  Save
} from "lucide-react"

interface PromptPreviewModalProps {
  promptData: {
    title: string
    description: string
    category: string
    tags: string[]
    price: number
    content: string
    imageFile: File | null
    imageUrl: string
  }
  onClose: () => void
  onPublish: () => void
  isLoading: boolean
}

export function PromptPreviewModal({ 
  promptData, 
  onClose, 
  onPublish, 
  isLoading 
}: PromptPreviewModalProps) {
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold">Preview Your Prompt</h2>
              <p className="text-sm text-muted-foreground">
                This is how your prompt will appear in the marketplace
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6">
              <Card className="overflow-hidden">
                <div className="relative">
                  {/* Image */}
                  {promptData.imageFile ? (
                    <img
                      src={URL.createObjectURL(promptData.imageFile)}
                      alt={promptData.title}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Tag className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-muted-foreground">No preview image</p>
                      </div>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="capitalize">
                      {getCategoryLabel(promptData.category)}
                    </Badge>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="default" className="bg-primary">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {formatPrice(promptData.price)}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Title and Description */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-3">{promptData.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {promptData.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {promptData.tags.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {promptData.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Seller Info */}
                  <div className="flex items-center gap-3 mb-6 p-4 bg-muted/50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Your Prompt</p>
                      <p className="text-sm text-muted-foreground">
                        Published by you
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">New</span>
                      </div>
                      <p className="text-xs text-muted-foreground">0 reviews</p>
                    </div>
                  </div>

                  {/* Prompt Content */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3">Prompt Content</h4>
                    <div className="bg-muted/50 rounded-lg p-4 border">
                      <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                        {promptData.content}
                      </pre>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">0</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Likes</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Download className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">0</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Downloads</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Now</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Published</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Back to Edit
                    </Button>
                    <Button
                      onClick={onPublish}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"
                          />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Publish Prompt
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
