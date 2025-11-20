import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft,
  Search,
  ChevronRight,
  Clock,
  Star,
  TrendingUp,
  MessageCircle,
  BookOpen,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"

interface CategoryDetailProps {
  categoryId: string
}

export function CategoryDetailPage({ categoryId }: CategoryDetailProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { success } = useToast()

  const categoryData = {
    account: {
      title: "Account & Profile",
      description: "Manage your account settings, profile, and authentication",
      icon: "👤",
      color: "bg-blue-500/10 text-blue-600",
      faqs: [
        {
          id: "1",
          question: "How do I create an account?",
          answer: "Creating an account is simple! Click the 'Sign Up' button in the top right corner, enter your email address and password, and verify your email. You can also sign up using Google or GitHub for faster registration.",
          category: "Getting Started",
          helpful: 45,
          lastUpdated: "2 days ago"
        },
        {
          id: "2",
          question: "I forgot my password. How do I reset it?",
          answer: "To reset your password, go to the login page and click 'Forgot Password?'. Enter your email address and we'll send you a reset link. Make sure to check your spam folder if you don't see the email within a few minutes.",
          category: "Security",
          helpful: 38,
          lastUpdated: "1 week ago"
        },
        {
          id: "3",
          question: "How do I update my profile information?",
          answer: "You can update your profile by going to Settings > Profile. Here you can change your name, email, profile picture, and other personal information. Changes are saved automatically.",
          category: "Profile",
          helpful: 29,
          lastUpdated: "3 days ago"
        },
        {
          id: "4",
          question: "Can I change my email address?",
          answer: "Yes, you can change your email address in your account settings. You'll need to verify the new email address before the change takes effect. Your old email will remain active until verification is complete.",
          category: "Account Settings",
          helpful: 22,
          lastUpdated: "5 days ago"
        },
        {
          id: "5",
          question: "How do I enable two-factor authentication?",
          answer: "Two-factor authentication adds an extra layer of security to your account. Go to Settings > Security > Two-Factor Authentication and follow the setup process. We recommend using an authenticator app like Google Authenticator.",
          category: "Security",
          helpful: 41,
          lastUpdated: "1 week ago"
        }
      ]
    },
    billing: {
      title: "Billing & Payments",
      description: "Subscription management, payments, and refunds",
      icon: "💳",
      color: "bg-green-500/10 text-green-600",
      faqs: [
        {
          id: "1",
          question: "How do I upgrade my subscription?",
          answer: "To upgrade your subscription, go to Settings > Billing and click 'Upgrade Plan'. Choose your desired plan and follow the payment process. Your new plan will be active immediately.",
          category: "Subscription",
          helpful: 52,
          lastUpdated: "1 day ago"
        },
        {
          id: "2",
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our payment partners.",
          category: "Payment Methods",
          helpful: 47,
          lastUpdated: "2 days ago"
        },
        {
          id: "3",
          question: "How do I cancel my subscription?",
          answer: "You can cancel your subscription anytime by going to Settings > Billing > Cancel Subscription. Your access will continue until the end of your current billing period. You can reactivate anytime.",
          category: "Cancellation",
          helpful: 33,
          lastUpdated: "3 days ago"
        },
        {
          id: "4",
          question: "Can I get a refund?",
          answer: "We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied, contact our support team within 30 days of your purchase for a full refund.",
          category: "Refunds",
          helpful: 28,
          lastUpdated: "1 week ago"
        }
      ]
    },
    prompts: {
      title: "Prompts & Marketplace",
      description: "Creating, buying, and selling prompts on our marketplace",
      icon: "💡",
      color: "bg-purple-500/10 text-purple-600",
      faqs: [
        {
          id: "1",
          question: "How do I create my first prompt?",
          answer: "Creating a prompt is easy! Go to Dashboard > Prompt Generator and start typing your prompt idea. Use our AI assistant to refine it, add tags, and set a price if you want to sell it.",
          category: "Creating Prompts",
          helpful: 67,
          lastUpdated: "1 day ago"
        },
        {
          id: "2",
          question: "How do I buy prompts from the marketplace?",
          answer: "Browse the marketplace by category or search for specific prompts. Click on any prompt to see details, reviews, and pricing. Add to cart and checkout with your preferred payment method.",
          category: "Buying Prompts",
          helpful: 43,
          lastUpdated: "2 days ago"
        },
        {
          id: "3",
          question: "How do I sell my prompts?",
          answer: "To sell prompts, first create a seller account. Then upload your prompts with detailed descriptions, set competitive prices, and add relevant tags. Our marketplace handles payments and delivery automatically.",
          category: "Selling Prompts",
          helpful: 39,
          lastUpdated: "3 days ago"
        },
        {
          id: "4",
          question: "What makes a good prompt?",
          answer: "Good prompts are specific, clear, and provide context. Include examples, specify the desired output format, and use clear instructions. Test your prompts before publishing to ensure they work as expected.",
          category: "Best Practices",
          helpful: 55,
          lastUpdated: "1 week ago"
        }
      ]
    },
    "ai-tools": {
      title: "AI Tools & Features",
      description: "Using our AI-powered tools and advanced features",
      icon: "⚡",
      color: "bg-orange-500/10 text-orange-600",
      faqs: [
        {
          id: "1",
          question: "What AI models do you support?",
          answer: "We support GPT-4, Claude, Gemini, and other leading AI models. You can choose your preferred model for each prompt or let our system automatically select the best one for your use case.",
          category: "AI Models",
          helpful: 61,
          lastUpdated: "1 day ago"
        },
        {
          id: "2",
          question: "How do I use the prompt generator?",
          answer: "The prompt generator helps you create better prompts. Simply describe what you want to achieve, and our AI will suggest improvements, add context, and optimize your prompt for better results.",
          category: "Prompt Generator",
          helpful: 48,
          lastUpdated: "2 days ago"
        },
        {
          id: "3",
          question: "Can I integrate with external tools?",
          answer: "Yes! We offer API access and webhooks for integration with your existing tools. Check our API documentation for detailed integration guides and code examples.",
          category: "Integrations",
          helpful: 35,
          lastUpdated: "3 days ago"
        }
      ]
    },
    troubleshooting: {
      title: "Troubleshooting",
      description: "Common issues, bugs, and technical problems",
      icon: "🐛",
      color: "bg-red-500/10 text-red-600",
      faqs: [
        {
          id: "1",
          question: "The app is running slowly. What should I do?",
          answer: "Try refreshing the page, clearing your browser cache, or checking your internet connection. If the issue persists, try using a different browser or contact support with your browser and system information.",
          category: "Performance",
          helpful: 42,
          lastUpdated: "1 day ago"
        },
        {
          id: "2",
          question: "I'm getting an error when trying to save my prompt",
          answer: "This usually happens when the prompt is too long or contains invalid characters. Try shortening your prompt or removing special characters. If the problem continues, contact support.",
          category: "Saving Issues",
          helpful: 31,
          lastUpdated: "2 days ago"
        },
        {
          id: "3",
          question: "My payment was charged but I don't have access",
          answer: "Payment processing can take a few minutes. Check your email for a confirmation receipt. If you still don't have access after 15 minutes, contact our billing support with your transaction ID.",
          category: "Payment Issues",
          helpful: 26,
          lastUpdated: "3 days ago"
        }
      ]
    },
    integrations: {
      title: "Integrations",
      description: "Connecting with third-party services and APIs",
      icon: "🔗",
      color: "bg-cyan-500/10 text-cyan-600",
      faqs: [
        {
          id: "1",
          question: "How do I connect my Google account?",
          answer: "Go to Settings > Integrations > Google and click 'Connect'. You'll be redirected to Google to authorize the connection. Once authorized, you can sync your Google Drive files and use Google services.",
          category: "Google Integration",
          helpful: 38,
          lastUpdated: "1 day ago"
        },
        {
          id: "2",
          question: "Can I use webhooks for automation?",
          answer: "Yes! Set up webhooks in Settings > Integrations > Webhooks. You can receive notifications when prompts are created, updated, or when payments are processed.",
          category: "Webhooks",
          helpful: 29,
          lastUpdated: "2 days ago"
        }
      ]
    }
  }

  const category = categoryData[categoryId as keyof typeof categoryData]
  
  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Button asChild>
            <Link href="#help">Back to Help Center</Link>
          </Button>
        </div>
      </div>
    )
  }

  const filteredFaqs = category.faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleFaqHelpful = (faqId: string) => {
    success("Thank you!", "Your feedback helps us improve our help articles")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" asChild>
                <Link href="#help">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Help Center
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h1 className="text-xl font-bold">{category.title}</h1>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <Link href="#help" className="hover:text-primary transition-colors">Help Center</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{category.title}</span>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search within this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              {filteredFaqs.length} articles found
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <AccordionItem value={faq.id} className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                      <div className="flex items-start justify-between w-full">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Updated {faq.lastUpdated}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {faq.helpful} found helpful
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                        <div className="flex items-center gap-4 pt-4 border-t">
                          <motion.button
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => handleFaqHelpful(faq.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Was this helpful?
                          </motion.button>
                          <Button variant="ghost" size="sm" className="text-sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Support
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </motion.div>
            ))}
          </Accordion>

          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
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
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="max-w-xl mx-auto">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Still need help?</h3>
                <p className="text-muted-foreground mb-6">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="#contact">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Support
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="#community">
                      <BookOpen className="mr-2 h-4 w-4" />
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
