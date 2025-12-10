import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ContactButtons } from "@/components/contact/ContactButtons"
import { TemplateAIChat } from "@/components/templates/TemplateAIChat"
import { ToolSuggestions } from "@/components/templates/ToolSuggestions"
import { PromptPackOrganizer, PromptPackItem } from "@/components/templates/PromptPackOrganizer"
import { 
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Download,
  Eye,
  Clock,
  User,
  CheckCircle,
  ExternalLink,
  Copy,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  ShoppingCart,
  TrendingUp,
  Award,
  Shield,
  X,
  MessageSquare
} from "lucide-react"

interface PromptDetailProps {
  promptId: string
}

export function PromptDetailPage({ promptId }: PromptDetailProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const { success } = useToast()

  // Mock prompt data based on ID
  const getPromptData = (id: string) => {
    const prompts = {
      "1": {
        id: "1",
        title: "Advanced Code Review Assistant",
        description: "Get comprehensive code reviews with suggestions for improvements, security issues, and best practices. This prompt helps you analyze code quality, identify potential bugs, suggest optimizations, and ensure adherence to coding standards.",
    fullDescription: `# Advanced Code Review Assistant

## Overview
This comprehensive prompt is designed to help developers get detailed code reviews from AI assistants. It provides structured analysis covering multiple aspects of code quality, security, performance, and maintainability.

## Features
- **Code Quality Analysis**: Identifies code smells, anti-patterns, and areas for improvement
- **Security Review**: Scans for common vulnerabilities and security issues
- **Performance Optimization**: Suggests optimizations for better performance
- **Best Practices**: Ensures adherence to coding standards and conventions
- **Documentation**: Provides suggestions for better code documentation

## How to Use
1. Copy the prompt template
2. Paste your code after the prompt
3. Specify the programming language
4. Add any specific requirements or concerns
5. Get comprehensive feedback and suggestions

## Example Usage
\`\`\`
Please review the following JavaScript code for:
- Code quality and best practices
- Potential security vulnerabilities
- Performance optimizations
- Documentation improvements

[Your code here]
\`\`\`

## Benefits
- Saves time on manual code reviews
- Identifies issues you might miss
- Provides learning opportunities
- Improves overall code quality
- Reduces technical debt

## Perfect For
- Individual developers
- Code review teams
- Learning and skill improvement
- Open source projects
- Enterprise development teams`,
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    price: 29.99,
    originalPrice: 49.99,
    rating: 4.8,
    reviews: 124,
    downloads: 2341,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    seller: {
      name: "CodeMaster Pro",
      avatar: "https://github.com/shadcn.png",
      verified: true,
      rating: 4.9,
      totalSales: 15420,
      memberSince: "2023-03-15",
      bio: "Professional software engineer with 10+ years of experience in code quality and best practices. Specialized in helping developers write better, more secure code."
    },
    category: "development",
    tags: ["code", "review", "security", "best-practices", "javascript", "python", "typescript"],
    features: [
      "Comprehensive code analysis",
      "Security vulnerability detection",
      "Performance optimization suggestions",
      "Best practices recommendations",
      "Multiple programming language support",
      "Detailed explanations and examples"
    ],
    requirements: [
      "Basic understanding of programming concepts",
      "Access to an AI assistant (ChatGPT, Claude, etc.)",
      "Code to be reviewed"
    ],
    exampleUsage: `# Code Review Prompt Template

Please review the following code for:

## Code Quality
- Code structure and organization
- Naming conventions
- Code readability and maintainability
- Error handling

## Security
- Input validation
- Authentication and authorization
- Data protection
- Common vulnerabilities

## Performance
- Algorithm efficiency
- Memory usage
- Database queries
- Caching opportunities

## Best Practices
- Design patterns
- SOLID principles
- Documentation
- Testing considerations

**Language:** [Specify programming language]
**Context:** [Brief description of the project/feature]

\`\`\`[language]
[Your code here]
\`\`\``,
    relatedPrompts: [
      {
        id: "2",
        title: "Code Documentation Generator",
        description: "Generate comprehensive documentation for your code",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
        price: 19.99,
        rating: 4.6,
        downloads: 1876
      },
      {
        id: "3",
        title: "Security Code Scanner",
        description: "Identify security vulnerabilities in your code",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
        price: 34.99,
        rating: 4.7,
        downloads: 1234
      },
      {
        id: "4",
        title: "Performance Optimization Guide",
        description: "Optimize your code for better performance",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
        price: 24.99,
        rating: 4.5,
        downloads: 987
      }
    ],
    reviewList: [
      {
        id: "1",
        author: "John Doe",
        avatar: "https://github.com/shadcn.png",
        rating: 5,
        date: "2024-01-20",
        comment: "Excellent prompt! Very detailed and helpful. The code review suggestions are spot on and helped me improve my code quality significantly. Highly recommend!",
        helpful: 12
      },
      {
        id: "2",
        author: "Jane Smith",
        avatar: "https://github.com/shadcn.png",
        rating: 5,
        date: "2024-01-18",
        comment: "Great quality work. The prompt provides comprehensive feedback and catches issues I would have missed. Worth every penny!",
        helpful: 8
      },
      {
        id: "3",
        author: "Mike Johnson",
        avatar: "https://github.com/shadcn.png",
        rating: 4,
        date: "2024-01-15",
        comment: "Very useful prompt. The security analysis is particularly good. Would love to see more advanced features in future updates.",
        helpful: 5
      },
      {
        id: "4",
        author: "Sarah Wilson",
        avatar: "https://github.com/shadcn.png",
        rating: 5,
        date: "2024-01-12",
        comment: "Amazing prompt! It's like having a senior developer review your code. The suggestions are practical and easy to implement.",
        helpful: 15
      },
      {
        id: "5",
        author: "David Brown",
        avatar: "https://github.com/shadcn.png",
        rating: 4,
        date: "2024-01-10",
        comment: "Good prompt overall. The performance optimization suggestions are helpful. Could use more examples for different programming languages.",
        helpful: 3
      }
    ]
  },
  "2": {
    id: "2",
    title: "AI Writing Assistant Pro",
    description: "Professional writing assistant that helps create compelling content for blogs, articles, marketing copy, and more. Includes tone adjustment, SEO optimization, and style consistency.",
    fullDescription: `# AI Writing Assistant Pro

## Overview
This comprehensive writing prompt helps you create high-quality content for various purposes including blogs, articles, marketing copy, social media posts, and professional documents.

## Features
- **Content Generation**: Creates engaging and informative content
- **Tone Adjustment**: Adapts writing style to match your brand voice
- **SEO Optimization**: Includes keywords and meta descriptions
- **Style Consistency**: Maintains consistent formatting and structure
- **Multiple Formats**: Supports various content types and lengths

## How to Use
1. Specify your content type and purpose
2. Define your target audience
3. Set the desired tone and style
4. Include any specific requirements
5. Get professionally written content

## Perfect For
- Content creators
- Marketing professionals
- Blog writers
- Social media managers
- Business owners`,
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
    price: 19.99,
    originalPrice: 39.99,
    rating: 4.7,
    reviews: 89,
    downloads: 1876,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    seller: {
      name: "ContentCreator",
      avatar: "https://github.com/shadcn.png",
      verified: true,
      rating: 4.8,
      totalSales: 8920,
      memberSince: "2023-05-20",
      bio: "Professional content writer and marketing specialist with expertise in AI-assisted content creation and SEO optimization."
    },
    category: "writing",
    tags: ["writing", "content", "marketing", "seo", "blog", "copywriting"],
    features: [
      "Multiple content formats",
      "SEO optimization",
      "Tone and style adjustment",
      "Audience targeting",
      "Professional quality output"
    ],
    requirements: [
      "Clear content objectives",
      "Target audience definition",
      "Brand voice guidelines"
    ],
    exampleUsage: `# Writing Assistant Prompt

Please create a [content type] about [topic] for [target audience].

Requirements:
- Tone: [professional/casual/friendly]
- Length: [word count]
- Style: [specific style requirements]
- Keywords: [include these keywords]

Focus on: [specific goals or outcomes]`,
    relatedPrompts: [
      {
        id: "1",
        title: "Advanced Code Review Assistant",
        description: "Get comprehensive code reviews with suggestions for improvements",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
        price: 29.99,
        rating: 4.8,
        downloads: 2341
      },
      {
        id: "3",
        title: "Data Analysis Expert",
        description: "Comprehensive data analysis and visualization",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
        price: 34.99,
        rating: 4.9,
        downloads: 3245
      }
    ],
    reviewList: [
      {
        id: "1",
        author: "Alice Johnson",
        avatar: "https://github.com/shadcn.png",
        rating: 5,
        date: "2024-01-19",
        comment: "Fantastic writing assistant! The content it generates is engaging and well-structured. Perfect for my blog posts.",
        helpful: 9
      },
      {
        id: "2",
        author: "Bob Wilson",
        avatar: "https://github.com/shadcn.png",
        rating: 4,
        date: "2024-01-17",
        comment: "Great tool for content creation. The SEO optimization features are particularly useful for my marketing campaigns.",
        helpful: 6
      },
      {
        id: "3",
        author: "Carol Davis",
        avatar: "https://github.com/shadcn.png",
        rating: 5,
        date: "2024-01-14",
        comment: "Love this prompt! It helps me maintain consistent tone across all my content. Highly recommended for content creators.",
        helpful: 11
      }
    ]
  },
  "3": {
    id: "3",
    title: "Data Analysis Expert",
    description: "Comprehensive data analysis prompt that helps interpret data, create visualizations, and generate insights for business decisions and research projects.",
    fullDescription: `# Data Analysis Expert

## Overview
This advanced prompt helps you analyze data, create meaningful visualizations, and generate actionable insights for business decisions, research projects, and academic work.

## Features
- **Statistical Analysis**: Performs various statistical tests and calculations
- **Data Visualization**: Suggests appropriate charts and graphs
- **Insight Generation**: Identifies patterns and trends
- **Report Creation**: Generates comprehensive analysis reports
- **Recommendation Engine**: Provides actionable recommendations

## How to Use
1. Provide your dataset or data description
2. Specify analysis objectives
3. Define key metrics and KPIs
4. Request specific types of analysis
5. Get detailed insights and recommendations

## Perfect For
- Business analysts
- Data scientists
- Researchers
- Students
- Decision makers`,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    price: 34.99,
    originalPrice: 59.99,
    rating: 4.9,
    reviews: 156,
    downloads: 3245,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-22",
    seller: {
      name: "DataInsights Pro",
      avatar: "https://github.com/shadcn.png",
      verified: true,
      rating: 4.9,
      totalSales: 12300,
      memberSince: "2023-02-10",
      bio: "Data science expert with 8+ years of experience in statistical analysis, machine learning, and business intelligence."
    },
    category: "analytics",
    tags: ["data", "analysis", "statistics", "visualization", "insights", "business"],
    features: [
      "Statistical analysis",
      "Data visualization",
      "Trend identification",
      "Report generation",
      "Actionable recommendations"
    ],
    requirements: [
      "Dataset or data description",
      "Analysis objectives",
      "Key metrics definition"
    ],
    exampleUsage: `# Data Analysis Prompt

Please analyze the following data: [describe your data]

Analysis objectives:
- [Primary goal]
- [Secondary goals]

Key metrics to focus on:
- [Metric 1]
- [Metric 2]

Please provide:
1. Statistical summary
2. Key insights
3. Visualization suggestions
4. Recommendations`,
    relatedPrompts: [
      {
        id: "1",
        title: "Advanced Code Review Assistant",
        description: "Get comprehensive code reviews with suggestions for improvements",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
        price: 29.99,
        rating: 4.8,
        downloads: 2341
      },
      {
        id: "2",
        title: "AI Writing Assistant Pro",
        description: "Professional writing assistant for content creation",
        thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop",
        price: 19.99,
        rating: 4.7,
        downloads: 1876
      }
    ],
    reviewList: [
      {
        id: "1",
        author: "Dr. Sarah Chen",
        avatar: "https://github.com/shadcn.png",
        rating: 5,
        date: "2024-01-21",
        comment: "Outstanding data analysis prompt! It helped me identify key insights from my research data that I would have missed. The visualization suggestions are spot on.",
        helpful: 14
      },
      {
        id: "2",
        author: "Mark Thompson",
        avatar: "https://github.com/shadcn.png",
        rating: 5,
        date: "2024-01-18",
        comment: "Excellent tool for business analytics. The statistical analysis is thorough and the recommendations are actionable. Saved me hours of work!",
        helpful: 8
      },
      {
        id: "3",
        author: "Lisa Rodriguez",
        avatar: "https://github.com/shadcn.png",
        rating: 4,
        date: "2024-01-16",
        comment: "Very comprehensive data analysis prompt. The trend identification features are particularly useful for my quarterly reports.",
        helpful: 7
      },
      {
        id: "4",
        author: "James Park",
        avatar: "https://github.com/shadcn.png",
        rating: 5,
        date: "2024-01-13",
        comment: "Amazing prompt for data scientists! The report generation capabilities are impressive and the insights are always valuable.",
        helpful: 12
      }
    ]
  }
}
    
return prompts[id] || prompts["1"] // Default to first prompt if ID not found
}

  const prompt = getPromptData(promptId)

  // Safety check to prevent errors
  if (!prompt || !prompt.seller) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Prompt Not Found</h1>
          <Button onClick={handleBackToMarketplace}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </div>
    )
  }

const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    success(isLiked ? "Removed from likes" : "Added to likes", "Thanks for your feedback!")
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks", "Saved for later!")
  }

  const handleShare = () => {
    success("Link copied!", "Share this prompt with others")
  }

  const handleCopyPrompt = () => {
    success("Prompt copied!", "Ready to use in your AI assistant")
  }

  const handleBuyNow = () => {
    success("Purchase initiated!", "Redirecting to checkout...")
  }

  const handleBackToMarketplace = () => {
    window.location.hash = '#marketplace'
  }

  const handleViewSellerProfile = () => {
    // Navigate to seller profile (using seller ID from prompt data)
    window.location.hash = `#seller-profile/1`
  }

  const handleReadReviews = () => {
    setShowReviews(true)
  }

  // Add keyboard shortcut for back navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleBackToMarketplace()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

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
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToMarketplace}
                title="Back to Marketplace (Esc)"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Button>
            </motion.div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">{prompt.category}</Badge>
              <Badge variant="secondary">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`space-y-8 ${isChatOpen && !isChatMinimized ? 'lg:col-span-8' : 'lg:col-span-9'}`}
          >
            {/* Prompt Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                      {prompt?.title || 'Untitled Prompt'}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                      {prompt?.description || 'No description available'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <motion.button
                      className={`p-2 rounded-lg transition-colors ${
                        isLiked 
                          ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      }`}
                      onClick={handleLike}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    </motion.button>
                    <motion.button
                      className={`p-2 rounded-lg transition-colors ${
                        isBookmarked 
                          ? 'text-primary bg-primary/10' 
                          : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                      }`}
                      onClick={handleBookmark}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </motion.button>
                    <motion.button
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      onClick={handleShare}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="mb-6">
                  <img
                    src={prompt?.thumbnail || 'https://via.placeholder.com/800x400'}
                    alt={prompt?.title || 'Prompt image'}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                  />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{prompt?.rating || 'N/A'}</span>
                    <span className="text-muted-foreground">({prompt?.reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>{(prompt?.downloads || 0).toLocaleString()} downloads</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Updated {prompt?.updatedAt ? formatDate(prompt.updatedAt) : 'Unknown'}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {prompt.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Full Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {showFullDescription ? prompt.fullDescription : prompt.description}
                  </div>
                </div>
                {!showFullDescription && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setShowFullDescription(true)}
                  >
                    Read More
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prompt.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prompt.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Example Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Example Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{prompt.exampleUsage}</pre>
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleCopyPrompt}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Prompt
                </Button>
              </CardContent>
            </Card>

            {/* Prompt Pack Organizer - Show if template has multiple prompts */}
            {(prompt as any).promptPack && (prompt as any).promptPack.length > 0 && (
              <PromptPackOrganizer
                items={(prompt as any).promptPack.map((item: any, index: number) => ({
                  id: item.id || `pack-${index}`,
                  title: item.title || `Prompt ${index + 1}`,
                  content: item.content || item,
                  order: index
                }))}
                onItemsChange={(items) => {
                  // Handle prompt pack changes if needed
                }}
                readOnly={true}
              />
            )}

            {/* Tool Suggestions */}
            <ToolSuggestions
              templateCategory={prompt.category}
              templateTitle={prompt.title}
              promptContent={prompt.exampleUsage}
            />

            {/* Related Prompts */}
            <Card>
              <CardHeader>
                <CardTitle>Related Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {prompt.relatedPrompts.map((relatedPrompt) => (
                    <motion.div
                      key={relatedPrompt.id}
                      className="group cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="overflow-hidden">
                        <img
                          src={relatedPrompt.thumbnail}
                          alt={relatedPrompt.title}
                          className="w-full h-32 object-cover"
                        />
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2 line-clamp-2">
                            {relatedPrompt.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {relatedPrompt.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{relatedPrompt.rating}</span>
                            </div>
                            <span className="font-bold">{formatPrice(relatedPrompt.price)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Chat Sidebar */}
          {isChatOpen && !isChatMinimized && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-4"
            >
              <div className="sticky top-24">
                <TemplateAIChat
                  templateTitle={prompt.title}
                  templateDescription={prompt.description}
                  templateCategory={prompt.category}
                  promptContent={prompt.exampleUsage}
                  isMinimized={isChatMinimized}
                  onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
                />
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

            {/* Purchase Card */}
            <Card className={isChatOpen && !isChatMinimized ? "" : "sticky top-24"}>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {prompt.originalPrice && (
                      <span className="text-2xl text-muted-foreground line-through">
                        {formatPrice(prompt.originalPrice)}
                      </span>
                    )}
                    <span className="text-3xl font-bold">{formatPrice(prompt.price)}</span>
                  </div>
                  {prompt.originalPrice && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {Math.round((1 - prompt.price / prompt.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <Button className="w-full" size="lg" onClick={handleBuyNow}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Buy Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Add to Wishlist
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-blue-500" />
                    <span>Instant download</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>Premium quality</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Seller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar 
                    className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" 
                    onClick={handleViewSellerProfile}
                    title="View seller profile"
                  >
                    <AvatarImage src={prompt.seller?.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {prompt.seller?.name?.[0] || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 
                      className="font-semibold cursor-pointer hover:text-primary transition-colors" 
                      onClick={handleViewSellerProfile}
                      title="View seller profile"
                    >
                      {prompt.seller?.name || 'Unknown Seller'}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{prompt.seller?.rating || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {prompt.seller?.bio || 'No bio available'}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Sales</span>
                    <p className="font-semibold">{prompt.seller?.totalSales?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Member Since</span>
                    <p className="font-semibold">{prompt.seller?.memberSince ? formatDate(prompt.seller.memberSince) : 'Unknown'}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={handleViewSellerProfile}
                    title="View complete seller profile"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <ContactButtons
                    userId={prompt.seller?.id || prompt.uid}
                    userName={prompt.seller?.name || prompt.creatorName || "Creator"}
                    className="w-auto"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reviews Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold mb-1">{prompt.rating}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(prompt.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {prompt.reviews} reviews
                  </p>
                </div>
                
                <Button variant="outline" className="w-full" onClick={handleReadReviews}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Read Reviews
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Reviews Modal */}
      {showReviews && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowReviews(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReviews(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {prompt.reviewList && prompt.reviewList.length > 0 ? (
                  prompt.reviewList.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.avatar} alt={review.author} />
                        <AvatarFallback>{review.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.author}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            {Array.from({ length: 5 - review.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gray-300" />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{review.comment}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <Button variant="ghost" size="sm" className="h-8">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Helpful ({review.helpful})
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No reviews available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}