import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"
import { 
  BookOpen, 
  Code, 
  Zap, 
  Users, 
  ArrowRight,
  FileText,
  Play,
  Download,
  Search,
  Terminal,
  Database,
  Settings,
  Globe,
  Shield,
  MessageSquare
} from "lucide-react"
import { Input } from "@/components/ui/input"

export function DocsPage() {
  const docCategories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics and create your first prompt",
      articles: 12,
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: Code,
      title: "API Reference",
      description: "Complete API documentation for developers",
      articles: 25,
      color: "bg-green-500/10 text-green-600"
    },
    {
      icon: Users,
      title: "Marketplace",
      description: "Buy, sell, and manage prompts",
      articles: 18,
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      icon: Settings,
      title: "Configuration",
      description: "Platform settings and customization",
      articles: 8,
      color: "bg-orange-500/10 text-orange-600"
    },
    {
      icon: Shield,
      title: "Security",
      description: "Security best practices and guidelines",
      articles: 6,
      color: "bg-red-500/10 text-red-600"
    },
    {
      icon: Globe,
      title: "Integrations",
      description: "Connect with third-party services",
      articles: 15,
      color: "bg-cyan-500/10 text-cyan-600"
    }
  ]

  const quickLinks = [
    {
      title: "Authentication",
      description: "Learn how to authenticate with our API",
      icon: Shield,
      href: "#docs/auth"
    },
    {
      title: "Prompt Templates",
      description: "Explore our library of prompt templates",
      icon: FileText,
      href: "#docs/templates"
    },
    {
      title: "Webhooks",
      description: "Set up real-time notifications",
      icon: Zap,
      href: "#docs/webhooks"
    },
    {
      title: "Rate Limits",
      description: "Understand API rate limiting",
      icon: Terminal,
      href: "#docs/rate-limits"
    }
  ]

  const popularArticles = [
    {
      title: "Creating Your First Prompt",
      description: "Step-by-step guide to creating effective AI prompts",
      views: "12.5k",
      category: "Getting Started"
    },
    {
      title: "API Authentication Guide",
      description: "Complete guide to API authentication and security",
      views: "8.2k",
      category: "API Reference"
    },
    {
      title: "Marketplace Best Practices",
      description: "Tips for selling prompts successfully",
      views: "6.7k",
      category: "Marketplace"
    },
    {
      title: "Prompt Engineering Techniques",
      description: "Advanced techniques for better AI responses",
      views: "15.3k",
      category: "Getting Started"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
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
              Documentation{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Center
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Everything you need to know to get started with PromptX and make the most of our platform.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search documentation..."
                  className="w-full pl-10 pr-4 py-3 h-12 border-2 focus:border-primary/50 transition-colors"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Quick Start Guide</h2>
              <p className="text-lg text-muted-foreground">
                Get up and running with PromptX in minutes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-col items-center">
                    <div className="p-4 rounded-full bg-primary/10 mb-4">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>1. Create Account</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Sign up for a free PromptX account to get started with prompt creation and management.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="#signup">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-col items-center">
                    <div className="p-4 rounded-full bg-primary/10 mb-4">
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>2. Create Your First Prompt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Use our intuitive prompt builder to create your first AI prompt with our guided templates.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="#dashboard/generator">Try Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-col items-center">
                    <div className="p-4 rounded-full bg-primary/10 mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>3. Share & Monetize</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Share your prompts with the community or list them on our marketplace to start earning.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="#marketplace">Explore</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Documentation Categories</h2>
              <p className="text-lg text-muted-foreground">
                Explore our comprehensive guides and resources
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {docCategories.map((category, index) => {
                const Icon = category.icon
                return (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          {category.title}
                        </CardTitle>
                        <CardDescription>
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {category.articles} articles
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links & Popular Articles */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <h3 className="text-2xl font-bold mb-6">Quick Links</h3>
                <div className="space-y-4">
                  {quickLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <motion.div
                        key={link.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{link.title}</h4>
                                <p className="text-sm text-muted-foreground">{link.description}</p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Popular Articles */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
              >
                <h3 className="text-2xl font-bold mb-6">Popular Articles</h3>
                <div className="space-y-4">
                  {popularArticles.map((article, index) => (
                    <motion.div
                      key={article.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{article.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{article.description}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {article.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {article.views} views
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  Can't find what you're looking for? Our support team is here to help you succeed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="#contact">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Support
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="#help">Help Center</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
