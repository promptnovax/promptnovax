import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"
import { useToast } from "@/hooks/use-toast"
import { 
  Search,
  ArrowRight,
  Users,
  CreditCard,
  Lightbulb,
  Settings,
  Bug,
  MessageCircle,
  BookOpen,
  Zap,
  Shield,
  HelpCircle,
  TrendingUp,
  Clock,
  Star
} from "lucide-react"

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search for help articles...")
  const { success } = useToast()

  const categories = [
    {
      id: "account",
      title: "Account & Profile",
      description: "Manage your account settings, profile, and authentication",
      icon: Users,
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
      iconColor: "text-blue-600",
      articles: 12,
      popular: true
    },
    {
      id: "billing",
      title: "Billing & Payments",
      description: "Subscription management, payments, and refunds",
      icon: CreditCard,
      color: "bg-green-500/10 text-green-600 border-green-200",
      iconColor: "text-green-600",
      articles: 8,
      popular: true
    },
    {
      id: "prompts",
      title: "Prompts & Marketplace",
      description: "Creating, buying, and selling prompts on our marketplace",
      icon: Lightbulb,
      color: "bg-purple-500/10 text-purple-600 border-purple-200",
      iconColor: "text-purple-600",
      articles: 15,
      popular: true
    },
    {
      id: "ai-tools",
      title: "AI Tools & Features",
      description: "Using our AI-powered tools and advanced features",
      icon: Zap,
      color: "bg-orange-500/10 text-orange-600 border-orange-200",
      iconColor: "text-orange-600",
      articles: 20,
      popular: false
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      description: "Common issues, bugs, and technical problems",
      icon: Bug,
      color: "bg-red-500/10 text-red-600 border-red-200",
      iconColor: "text-red-600",
      articles: 18,
      popular: true
    },
    {
      id: "integrations",
      title: "Integrations",
      description: "Connecting with third-party services and APIs",
      icon: Settings,
      color: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
      iconColor: "text-cyan-600",
      articles: 10,
      popular: false
    }
  ]

  const popularArticles = [
    {
      title: "How to create your first prompt",
      category: "Prompts & Marketplace",
      views: 1234,
      rating: 4.8
    },
    {
      title: "Setting up payment methods",
      category: "Billing & Payments",
      views: 987,
      rating: 4.6
    },
    {
      title: "Troubleshooting login issues",
      category: "Account & Profile",
      views: 856,
      rating: 4.7
    },
    {
      title: "Understanding AI model differences",
      category: "AI Tools & Features",
      views: 743,
      rating: 4.9
    }
  ]

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      success("Searching...", `Found ${filteredCategories.length} categories matching "${query}"`)
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    success("Category clicked!", `Opening ${categoryId} help section`)
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
              <HelpCircle className="w-10 h-10 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              How can we{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                help you?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Find answers to your questions, learn how to use our features, and get the most out of PromptX.
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
                  placeholder={searchPlaceholder}
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
        {/* Popular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Popular Articles</h2>
            <p className="text-lg text-muted-foreground">
              Most viewed help articles this week
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularArticles.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {article.rating}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {article.views.toLocaleString()} views
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-lg text-muted-foreground">
              Find help organized by topic
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCategories.map((category, index) => {
                const Icon = category.icon
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-gradient-to-br from-background to-muted/10 hover:from-primary/5 hover:to-primary/10"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl ${category.color}`}>
                            <Icon className={`h-6 w-6 ${category.iconColor}`} />
                          </div>
                          {category.popular && (
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {category.title}
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="h-4 w-4" />
                            {category.articles} articles
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
                )
              })}
            </motion.div>
          </AnimatePresence>

          {filteredCategories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms
              </p>
              <Button onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="#contact">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Support
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="#community">
                      <Users className="mr-2 h-4 w-4" />
                      Ask Community
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}