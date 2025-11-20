import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { LikeButton } from "@/components/LikeButton"
import { FollowButton } from "@/components/FollowButton"
import { CommentSection } from "@/components/CommentSection"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { doc, getDoc, collection, query, where, limit, getDocs, orderBy } from "firebase/firestore"
import { 
  ArrowLeft,
  Copy,
  Check,
  Star,
  Download,
  Eye,
  Calendar,
  User,
  Tag,
  DollarSign,
  Heart,
  MessageCircle,
  Share2,
  ChevronDown,
  ChevronUp
} from "lucide-react"

interface PromptData {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  price: number
  content: string
  imageUrl?: string
  sellerId: string
  sellerEmail: string
  createdAt: any
  likes: number
  downloads: number
  status: string
}

interface SellerData {
  id: string
  name: string
  avatar?: string
  followers: string[]
  following: string[]
  totalPrompts: number
  totalSales: number
  rating: number
}

interface PromptDetailPageProps {
  promptId: string
}

export function PromptDetailPage({ promptId }: PromptDetailPageProps) {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [prompt, setPrompt] = useState<PromptData | null>(null)
  const [seller, setSeller] = useState<SellerData | null>(null)
  const [relatedPrompts, setRelatedPrompts] = useState<PromptData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isContentExpanded, setIsContentExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (promptId) {
      loadPromptData()
    }
  }, [promptId])

  const loadPromptData = async () => {
    if (!isFirebaseConfigured || !firebaseDb) {
      // Mock data for demo mode
      loadMockData()
      return
    }

    try {
      setIsLoading(true)

      // Load prompt data
      const promptDoc = await getDoc(doc(firebaseDb, 'prompts', promptId))
      if (!promptDoc.exists()) {
        error("Prompt not found", "The prompt you're looking for doesn't exist")
        return
      }

      const promptData = { id: promptDoc.id, ...promptDoc.data() } as PromptData
      setPrompt(promptData)

      // Load seller data
      const sellerDoc = await getDoc(doc(firebaseDb, 'users', promptData.sellerId))
      if (sellerDoc.exists()) {
        const sellerData = { id: sellerDoc.id, ...sellerDoc.data() } as SellerData
        setSeller(sellerData)
      } else {
        // Create basic seller data if not found
        setSeller({
          id: promptData.sellerId,
          name: promptData.sellerEmail?.split('@')[0] || 'Unknown Seller',
          followers: [],
          following: [],
          totalPrompts: 1,
          totalSales: 0,
          rating: 4.5
        })
      }

      // Load related prompts
      const relatedQuery = query(
        collection(firebaseDb, 'prompts'),
        where('category', '==', promptData.category),
        where('status', '==', 'active'),
        limit(4)
      )
      const relatedSnapshot = await getDocs(relatedQuery)
      const related = relatedSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as PromptData))
        .filter(p => p.id !== promptId)
        .slice(0, 3)
      setRelatedPrompts(related)

    } catch (err: any) {
      console.error('Error loading prompt:', err)
      error("Loading failed", "Failed to load prompt details")
    } finally {
      setIsLoading(false)
    }
  }

  const loadMockData = () => {
    // Mock data for demo mode
    const mockPrompt: PromptData = {
      id: promptId,
      title: "Advanced Code Review Assistant",
      description: "Get comprehensive code reviews with suggestions for improvements, security issues, and best practices. This prompt helps developers write better, more secure code.",
      category: "development",
      tags: ["code", "review", "security", "best-practices"],
      price: 29.99,
      content: `You are an expert code reviewer with 10+ years of experience in software development. Your task is to provide a comprehensive code review for the following code:

[PASTE YOUR CODE HERE]

Please analyze the code and provide feedback on:

1. **Code Quality & Style**
   - Code readability and maintainability
   - Naming conventions and consistency
   - Code organization and structure

2. **Security Issues**
   - Potential security vulnerabilities
   - Input validation and sanitization
   - Authentication and authorization concerns

3. **Performance**
   - Algorithm efficiency
   - Memory usage optimization
   - Database query optimization

4. **Best Practices**
   - Design patterns usage
   - Error handling
   - Testing considerations

5. **Specific Improvements**
   - Concrete suggestions for refactoring
   - Alternative approaches
   - Code examples for improvements

Format your response with clear sections and actionable recommendations.`,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
      sellerId: "seller1",
      sellerEmail: "codemaster@example.com",
      createdAt: new Date(),
      likes: 42,
      downloads: 156,
      status: "active"
    }

    const mockSeller: SellerData = {
      id: "seller1",
      name: "CodeMaster Pro",
      avatar: "https://github.com/shadcn.png",
      followers: ["user1", "user2", "user3"],
      following: ["seller2", "seller3"],
      totalPrompts: 12,
      totalSales: 89,
      rating: 4.8
    }

    const mockRelated: PromptData[] = [
      {
        id: "2",
        title: "Security Code Scanner",
        description: "Identify security vulnerabilities in your code",
        category: "development",
        tags: ["security", "scanner", "vulnerability"],
        price: 24.99,
        content: "Security scanning prompt...",
        sellerId: "seller1",
        sellerEmail: "codemaster@example.com",
        createdAt: new Date(),
        likes: 28,
        downloads: 89,
        status: "active"
      },
      {
        id: "3",
        title: "API Documentation Generator",
        description: "Generate comprehensive API documentation",
        category: "development",
        tags: ["api", "documentation", "generator"],
        price: 19.99,
        content: "API documentation prompt...",
        sellerId: "seller2",
        sellerEmail: "apidev@example.com",
        createdAt: new Date(),
        likes: 35,
        downloads: 112,
        status: "active"
      }
    ]

    setPrompt(mockPrompt)
    setSeller(mockSeller)
    setRelatedPrompts(mockRelated)
    setIsLoading(false)
  }

  const handleBackToMarketplace = () => {
    window.location.hash = "#marketplace"
  }

  const handleCopyPrompt = async () => {
    if (!prompt) return

    try {
      await navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      success("Copied!", "Prompt content copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      error("Copy failed", "Failed to copy prompt to clipboard")
    }
  }

  const handleBuyPrompt = () => {
    if (!currentUser) {
      window.location.hash = "#login"
      return
    }
    success("Purchase initiated", "Redirecting to checkout...")
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-muted rounded"></div>
              <div className="h-8 w-64 bg-muted rounded"></div>
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-muted rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 w-3/4 bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-2/3 bg-muted rounded"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-muted rounded-lg"></div>
                <div className="h-48 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Prompt Not Found</h1>
          <p className="text-muted-foreground">The prompt you're looking for doesn't exist.</p>
          <Button onClick={handleBackToMarketplace}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
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
          <Button variant="ghost" size="sm" onClick={handleBackToMarketplace}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Image */}
            {prompt.imageUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img
                  src={prompt.imageUrl}
                  alt={prompt.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </motion.div>
            )}

            {/* Prompt Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {getCategoryLabel(prompt.category)}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(prompt.createdAt)}
                        </div>
                      </div>
                      <CardTitle className="text-2xl">{prompt.title}</CardTitle>
                      <CardDescription className="text-base">
                        {prompt.description}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(prompt.price)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        One-time purchase
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Tags */}
                  {prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {prompt.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {prompt.likes} likes
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {prompt.downloads} downloads
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {Math.floor(Math.random() * 1000) + 100} views
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Prompt Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Prompt Content</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPrompt}
                      className="flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy Prompt
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                      {isContentExpanded 
                        ? prompt.content 
                        : prompt.content.length > 500 
                          ? prompt.content.substring(0, 500) + "..."
                          : prompt.content
                      }
                    </pre>
                    {prompt.content.length > 500 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsContentExpanded(!isContentExpanded)}
                        className="mt-2"
                      >
                        {isContentExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show More
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CommentSection promptId={promptId} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    About the Seller
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={seller?.avatar} />
                      <AvatarFallback>
                        {seller?.name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{seller?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {seller?.followers?.length || 0} followers
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="font-semibold">{seller?.totalPrompts || 0}</div>
                      <div className="text-muted-foreground">Prompts</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="font-semibold">{seller?.totalSales || 0}</div>
                      <div className="text-muted-foreground">Sales</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <FollowButton 
                      sellerId={prompt.sellerId} 
                      sellerName={seller?.name || "Unknown"}
                    />
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6 space-y-4">
                  <LikeButton promptId={promptId} initialLikes={prompt.likes} />
                  
                  <Button 
                    onClick={handleBuyPrompt}
                    className="w-full"
                    size="lg"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Buy Now - {formatPrice(prompt.price)}
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Related Prompts */}
            {relatedPrompts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Related Prompts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {relatedPrompts.map((relatedPrompt) => (
                      <div
                        key={relatedPrompt.id}
                        className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => window.location.hash = `#marketplace/${relatedPrompt.id}`}
                      >
                        <div className="w-12 h-12 bg-muted rounded flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {relatedPrompt.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(relatedPrompt.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
