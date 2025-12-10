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
import { MarketplacePromptAIChat } from "@/components/marketplace/MarketplacePromptAIChat"
import { ToolSuggestions } from "@/components/templates/ToolSuggestions"
import { PromptPackOrganizer, PromptPackItem } from "@/components/templates/PromptPackOrganizer"
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
  ChevronUp,
  MessageSquare,
  ShoppingCart,
  CheckCircle,
  FileText,
  TrendingUp
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
  promptPack?: PromptPackItem[]
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
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [isPurchased, setIsPurchased] = useState(false) // TODO: Check actual purchase status from database

  useEffect(() => {
    if (promptId) {
      loadPromptData()
    }
  }, [promptId])

  const loadPromptData = () => {
    setIsLoading(true)
    try {
      loadMockData()
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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="animate-pulse space-y-8">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-muted rounded-lg"></div>
              <div className="h-6 w-48 bg-muted rounded"></div>
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="h-80 bg-muted rounded-xl"></div>
                <div className="space-y-4">
                  <div className="h-10 w-3/4 bg-muted rounded-lg"></div>
                  <div className="h-6 w-full bg-muted rounded"></div>
                  <div className="h-6 w-5/6 bg-muted rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-muted rounded-full"></div>
                    <div className="h-6 w-20 bg-muted rounded-full"></div>
                  </div>
                </div>
                <div className="h-64 bg-muted rounded-xl"></div>
              </div>
              <div className="lg:col-span-4 space-y-6">
                <div className="h-96 bg-muted rounded-xl"></div>
                <div className="h-64 bg-muted rounded-xl"></div>
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Professional Header with Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToMarketplace}
              className="group hover:bg-primary/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Marketplace
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Marketplace</span>
              <span>/</span>
              <span className="text-foreground font-medium">{prompt.category}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`space-y-6 ${isChatOpen && !isChatMinimized ? 'lg:col-span-8' : 'lg:col-span-9'}`}
          >
            {/* Professional Hero Image */}
            {prompt.imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group overflow-hidden rounded-2xl shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                <img
                  src={prompt.imageUrl}
                  alt={prompt.title}
                  className="w-full h-80 md:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary/90 backdrop-blur-sm">
                      {getCategoryLabel(prompt.category)}
                    </Badge>
                    {prompt.price === 0 ? (
                      <Badge variant="secondary" className="bg-green-500/90 backdrop-blur-sm">
                        Free
                      </Badge>
                    ) : (
                      <Badge className="bg-primary/90 backdrop-blur-sm">
                        {formatPrice(prompt.price)}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Professional Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-2 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        {!prompt.imageUrl && (
                          <Badge variant="outline" className="capitalize text-sm px-3 py-1">
                            {getCategoryLabel(prompt.category)}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Published {formatDate(prompt.createdAt)}</span>
                        </div>
                      </div>
                      <CardTitle className="text-3xl md:text-4xl font-bold leading-tight">
                        {prompt.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed text-muted-foreground">
                        {prompt.description}
                      </CardDescription>
                    </div>
                    {!prompt.imageUrl && (
                      <div className="text-right flex-shrink-0">
                        <div className="text-4xl font-bold text-primary mb-1">
                          {formatPrice(prompt.price)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          One-time purchase
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tags */}
                  {prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {prompt.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs px-2.5 py-1 hover:bg-primary/10 transition-colors cursor-default"
                        >
                          <Tag className="h-3 w-3 mr-1.5" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Professional Stats */}
                  <Separator />
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 group cursor-default">
                      <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                        <Heart className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="font-medium">{prompt.likes}</span>
                      <span className="text-muted-foreground">likes</span>
                    </div>
                    <div className="flex items-center gap-2 group cursor-default">
                      <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                        <Download className="h-4 w-4 text-blue-500" />
                      </div>
                      <span className="font-medium">{prompt.downloads}</span>
                      <span className="text-muted-foreground">downloads</span>
                    </div>
                    <div className="flex items-center gap-2 group cursor-default">
                      <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                        <Eye className="h-4 w-4 text-purple-500" />
                      </div>
                      <span className="font-medium">{Math.floor(Math.random() * 1000) + 100}</span>
                      <span className="text-muted-foreground">views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Prompt Content Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Prompt Content</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Copy and use this prompt in your preferred AI tool
                      </p>
                    </div>
                    <Button
                      variant={copied ? "default" : "outline"}
                      size="sm"
                      onClick={handleCopyPrompt}
                      className="flex items-center gap-2 transition-all"
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
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-gradient-to-br from-muted/80 to-muted/50 rounded-xl p-6 border-2 border-muted backdrop-blur-sm">
                      <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-foreground/90 overflow-x-auto">
                        {isContentExpanded 
                          ? prompt.content 
                          : prompt.content.length > 500 
                            ? prompt.content.substring(0, 500) + "..."
                            : prompt.content
                        }
                      </pre>
                      {prompt.content.length > 500 && (
                        <div className="mt-4 flex justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsContentExpanded(!isContentExpanded)}
                            className="group"
                          >
                            {isContentExpanded ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1 group-hover:-translate-y-0.5 transition-transform" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1 group-hover:translate-y-0.5 transition-transform" />
                                Show More
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Prompt Pack Organizer - Show if template has multiple prompts */}
            {prompt.promptPack && prompt.promptPack.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <PromptPackOrganizer
                  items={prompt.promptPack.map((item, index) => ({
                    id: item.id || `pack-${index}`,
                    title: item.title || `Prompt ${index + 1}`,
                    content: item.content,
                    order: item.order !== undefined ? item.order : index
                  }))}
                  onItemsChange={() => {
                    // Read-only mode for viewers
                  }}
                  readOnly={true}
                />
              </motion.div>
            )}

            {/* Tool Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ToolSuggestions
                templateCategory={prompt.category}
                templateTitle={prompt.title}
                promptContent={prompt.content}
              />
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <CommentSection promptId={promptId} />
            </motion.div>
          </motion.div>

          {/* Professional AI Chat Sidebar */}
          {isChatOpen && !isChatMinimized && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-4"
            >
              <div className="sticky top-24">
                <div className="h-[calc(100vh-8rem)]">
                  <MarketplacePromptAIChat
                    promptId={prompt.id}
                    promptTitle={prompt.title}
                    promptDescription={prompt.description}
                    promptCategory={prompt.category}
                    promptContent={prompt.content}
                    promptPrice={prompt.price}
                    promptTags={prompt.tags}
                    isPurchased={isPurchased}
                    isMinimized={isChatMinimized}
                    onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
                    onPurchaseClick={handleBuyPrompt}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`space-y-6 ${isChatOpen && !isChatMinimized ? 'lg:col-span-12 lg:mt-8' : 'lg:col-span-3'}`}
          >
            {/* Toggle Chat Button */}
            {(!isChatOpen || isChatMinimized) && (
              <Card>
                <CardContent className="p-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsChatOpen(true)
                      setIsChatMinimized(false)
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {isChatMinimized ? "Restore AI Guide" : "Open AI Guide"}
                  </Button>
                </CardContent>
              </Card>
            )}
            {/* Professional Seller Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border border-border/50 shadow-xl bg-card/95 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-background to-muted/30 border-b">
                  <CardTitle className="flex items-center gap-3 text-lg font-bold">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-sm">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    About the Seller
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20 ring-4 ring-primary/10 shadow-lg">
                      <AvatarImage src={seller?.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-xl">
                        {seller?.name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl mb-1.5">{seller?.name}</h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 rounded-md bg-yellow-500/10">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </div>
                          <span className="text-sm font-semibold">{seller?.rating?.toFixed(1) || "4.5"}</span>
                          <span className="text-xs text-muted-foreground">rating</span>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <span className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">{seller?.followers?.length || 0}</span> followers
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-primary/8 via-primary/5 to-transparent rounded-xl border border-primary/20 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-3xl font-bold text-primary mb-1">{seller?.totalPrompts || 0}</div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Prompts</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-500/8 via-green-500/5 to-transparent rounded-xl border border-green-500/20 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{seller?.totalSales || 0}</div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sales</div>
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="flex gap-3">
                    <FollowButton 
                      sellerId={prompt.sellerId} 
                      sellerName={seller?.name || "Unknown"}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="default" 
                      className="flex-1 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Action Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-2 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <LikeButton promptId={promptId} initialLikes={prompt.likes} />
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="text-center pb-2">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {formatPrice(prompt.price)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        One-time purchase • Lifetime access
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleBuyPrompt}
                      className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Buy Now
                    </Button>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 hover:bg-primary/10 transition-colors"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 hover:bg-primary/10 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>

                  <div className="pt-2 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      <span>Instant download</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      <span>Free updates included</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Related Prompts */}
            {relatedPrompts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="border border-border/50 shadow-xl bg-card/95 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-background to-muted/30 border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3 text-lg font-bold mb-1">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-sm">
                            <TrendingUp className="h-5 w-5 text-primary" />
                          </div>
                          Related Prompts
                        </CardTitle>
                        <p className="text-sm text-muted-foreground ml-11">
                          You might also like these prompts
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {relatedPrompts.map((relatedPrompt, index) => (
                      <motion.div
                        key={relatedPrompt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="group flex gap-4 p-4 border border-border/50 rounded-xl hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                        onClick={() => window.location.hash = `#marketplace/${relatedPrompt.id}`}
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-primary/20 shadow-sm">
                          <FileText className="h-10 w-10 text-primary/70 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-base line-clamp-2 group-hover:text-primary transition-colors mb-1.5">
                              {relatedPrompt.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {relatedPrompt.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
                                {getCategoryLabel(relatedPrompt.category)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-primary">
                                {formatPrice(relatedPrompt.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
