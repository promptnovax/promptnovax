import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "@/components/ui/link"
import { useToast } from "@/hooks/use-toast"
import { 
  Search,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Eye,
  Heart,
  MessageCircle,
  BookOpen,
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles
} from "lucide-react"

export function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const { success } = useToast()

  const categories = [
    { value: "all", label: "All Posts", count: 24 },
    { value: "product", label: "Product", count: 8 },
    { value: "ai", label: "AI", count: 6 },
    { value: "tips", label: "Tips", count: 5 },
    { value: "community", label: "Community", count: 3 },
    { value: "updates", label: "Updates", count: 2 }
  ]

  const featuredPost = {
    id: "featured-1",
    title: "The Future of AI-Powered Prompt Engineering: What's Next in 2024",
    description: "Explore the latest trends and innovations in AI prompt engineering, from advanced techniques to emerging tools that are revolutionizing how we interact with AI models.",
    author: {
      name: "Sarah Chen",
      avatar: "https://github.com/shadcn.png",
      role: "AI Research Lead"
    },
    category: "ai",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    views: 2847,
    likes: 156,
    comments: 23,
    featured: true
  }

  const blogPosts = [
    {
      id: "1",
      title: "Building Better Prompts: A Complete Guide to AI Communication",
      description: "Learn the fundamental principles of prompt engineering and discover techniques that will help you get better results from any AI model.",
      author: {
        name: "Alex Rodriguez",
        avatar: "https://github.com/shadcn.png",
        role: "Prompt Engineer"
      },
      category: "tips",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
      publishedAt: "2024-01-12",
      readTime: "6 min read",
      views: 1923,
      likes: 89,
      comments: 12,
      featured: false
    },
    {
      id: "2",
      title: "New Marketplace Features: Enhanced Search and Discovery",
      description: "We've launched several new features to help you discover and purchase the best prompts more easily. Here's what's new.",
      author: {
        name: "Emma Wilson",
        avatar: "https://github.com/shadcn.png",
        role: "Product Manager"
      },
      category: "product",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      publishedAt: "2024-01-10",
      readTime: "4 min read",
      views: 1456,
      likes: 67,
      comments: 8,
      featured: false
    },
    {
      id: "3",
      title: "Community Spotlight: Meet Our Top Prompt Creators",
      description: "Get to know the talented creators who are building amazing prompts and helping others succeed in the AI space.",
      author: {
        name: "Marcus Johnson",
        avatar: "https://github.com/shadcn.png",
        role: "Community Manager"
      },
      category: "community",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
      publishedAt: "2024-01-08",
      readTime: "5 min read",
      views: 987,
      likes: 45,
      comments: 6,
      featured: false
    },
    {
      id: "4",
      title: "GPT-4 vs Claude: A Comprehensive Comparison for Prompt Engineers",
      description: "Detailed analysis of how different AI models respond to various prompt types and which one to choose for your specific use case.",
      author: {
        name: "Dr. Lisa Park",
        avatar: "https://github.com/shadcn.png",
        role: "AI Researcher"
      },
      category: "ai",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
      publishedAt: "2024-01-05",
      readTime: "12 min read",
      views: 3245,
      likes: 178,
      comments: 34,
      featured: false
    },
    {
      id: "5",
      title: "5 Essential Tips for Selling Prompts Successfully",
      description: "Learn from successful prompt creators about pricing strategies, marketing techniques, and building a loyal customer base.",
      author: {
        name: "David Kim",
        avatar: "https://github.com/shadcn.png",
        role: "Business Development"
      },
      category: "tips",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      publishedAt: "2024-01-03",
      readTime: "7 min read",
      views: 1876,
      likes: 92,
      comments: 15,
      featured: false
    },
    {
      id: "6",
      title: "Platform Updates: New Dashboard and Analytics Features",
      description: "Discover the latest improvements to our dashboard, including enhanced analytics, better organization tools, and improved user experience.",
      author: {
        name: "Rachel Green",
        avatar: "https://github.com/shadcn.png",
        role: "UX Designer"
      },
      category: "updates",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      publishedAt: "2024-01-01",
      readTime: "5 min read",
      views: 1234,
      likes: 56,
      comments: 9,
      featured: false
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      success("Searching...", `Found ${filteredPosts.length} posts matching "${query}"`)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handlePostClick = (postId: string) => {
    success("Opening post...", "Loading blog post details")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-background via-background to-muted/20 py-16"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-8"
            >
              <BookOpen className="w-10 h-10 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              Insights &{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Updates
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Stay up to date with the latest AI, product, and community news.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 h-14 text-lg border-2 focus:border-primary/50 transition-all duration-300 focus:shadow-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Featured Post</h2>
          </div>

          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="mb-4">
                  <Badge variant="outline" className="mb-3">
                    {categories.find(c => c.value === featuredPost.category)?.label}
                  </Badge>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {featuredPost.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={featuredPost.author.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {featuredPost.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{featuredPost.author.name}</p>
                      <p className="text-xs text-muted-foreground">{featuredPost.author.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{formatDate(featuredPost.publishedAt)}</p>
                    <p className="text-xs text-muted-foreground">{featuredPost.readTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {featuredPost.views.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {featuredPost.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {featuredPost.comments}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Filter by Category</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.value
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">
              {selectedCategory === "all" ? "All Posts" : categories.find(c => c.value === selectedCategory)?.label}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filteredPosts.length} posts found
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card 
                    className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                    onClick={() => handlePostClick(post.id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="outline" className="text-xs">
                          {categories.find(c => c.value === post.category)?.label}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                              {post.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{post.author.name}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{post.readTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {post.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {post.comments}
                          </div>
                        </div>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ x: 4 }}
                        >
                          <ArrowRight className="h-4 w-4 text-primary" />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}>
                Clear Filters
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-12 flex justify-center"
        >
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" disabled={currentPage === 3}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}