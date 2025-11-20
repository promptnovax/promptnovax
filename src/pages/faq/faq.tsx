import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"
import { 
  ChevronDown, 
  ChevronUp,
  Search,
  HelpCircle,
  MessageCircle,
  Mail,
  ArrowRight,
  Zap,
  Shield,
  Users,
  CreditCard,
  Settings
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  popular?: boolean
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "What is PromptX and how does it work?",
    answer: "PromptX is an AI-powered platform that helps you create, optimize, and monetize prompts for various AI models. Our platform provides intuitive tools for prompt engineering, a marketplace to buy and sell prompts, and analytics to track performance. Simply sign up, create your prompts, and start generating better AI responses.",
    category: "General",
    popular: true
  },
  {
    id: "2", 
    question: "How much does PromptX cost?",
    answer: "PromptX offers a free tier with basic features and limited usage. Our paid plans start at $19/month for individual creators and $99/month for teams. Enterprise plans are available with custom pricing. All plans include access to our prompt marketplace and basic analytics.",
    category: "Pricing",
    popular: true
  },
  {
    id: "3",
    question: "Can I sell my prompts on the marketplace?",
    answer: "Yes! Our marketplace allows you to create and sell your prompts to other users. You can set your own prices, track sales analytics, and build a following. We take a small commission on sales to maintain the platform. Top sellers can earn significant income from their prompt creations.",
    category: "Marketplace",
    popular: true
  },
  {
    id: "4",
    question: "What AI models does PromptX support?",
    answer: "PromptX currently supports GPT-4, GPT-3.5, Claude 3, Gemini Pro, and other popular AI models. We're constantly adding support for new models as they become available. You can test your prompts across different models to see which works best for your use case.",
    category: "Technical",
    popular: false
  },
  {
    id: "5",
    question: "How do I get started with prompt engineering?",
    answer: "Getting started is easy! We provide templates, tutorials, and best practices to help you create effective prompts. Start with our beginner-friendly templates, then experiment with our prompt generator tool. Our community forum is also a great place to learn from other users and get feedback on your prompts.",
    category: "Getting Started",
    popular: true
  },
  {
    id: "6",
    question: "Is my data secure on PromptX?",
    answer: "Absolutely. We take data security seriously and use enterprise-grade encryption to protect your information. Your prompts and personal data are never shared without your consent. We're SOC 2 compliant and regularly audit our security practices to ensure your data remains safe.",
    category: "Security",
    popular: false
  },
  {
    id: "7",
    question: "Can I use PromptX for commercial purposes?",
    answer: "Yes, PromptX is designed for both personal and commercial use. Our business and enterprise plans include commercial licensing and additional features like team collaboration, advanced analytics, and priority support. Check our terms of service for specific commercial usage guidelines.",
    category: "Commercial",
    popular: false
  },
  {
    id: "8",
    question: "How do I contact customer support?",
    answer: "You can reach our support team through multiple channels: email support (hello@promptx.com), live chat on our website, or our community forum. We typically respond within 24 hours for email inquiries and within 2 hours for live chat during business hours.",
    category: "Support",
    popular: false
  },
  {
    id: "9",
    question: "Can I integrate PromptX with my existing workflow?",
    answer: "Yes! PromptX offers API access for developers and integrations with popular tools like Zapier, Slack, and Notion. Our API allows you to programmatically create, test, and manage prompts. Enterprise customers can also request custom integrations.",
    category: "Integrations",
    popular: false
  },
  {
    id: "10",
    question: "What's the difference between the free and paid plans?",
    answer: "The free plan includes basic prompt creation tools, limited marketplace access, and basic analytics. Paid plans unlock advanced features like team collaboration, unlimited prompt generation, detailed analytics, priority support, and higher marketplace visibility. See our pricing page for a detailed comparison.",
    category: "Pricing",
    popular: true
  }
]

const categories = [
  { value: "all", label: "All Categories", icon: HelpCircle },
  { value: "General", label: "General", icon: MessageCircle },
  { value: "Pricing", label: "Pricing", icon: CreditCard },
  { value: "Marketplace", label: "Marketplace", icon: Zap },
  { value: "Technical", label: "Technical", icon: Settings },
  { value: "Getting Started", label: "Getting Started", icon: Users },
  { value: "Security", label: "Security", icon: Shield },
  { value: "Support", label: "Support", icon: HelpCircle }
]

export function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openItems, setOpenItems] = useState<string[]>([])

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const popularFAQs = faqData.filter(faq => faq.popular)

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
              <HelpCircle className="w-10 h-10 text-primary" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Questions
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Find answers to common questions about PromptX. Can't find what you're looking for? Contact our support team.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  className="w-full pl-10 pr-4 py-3 h-12 border-2 focus:border-primary/50 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <motion.div
                      key={category.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={selectedCategory === category.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.value)}
                        className="h-12 whitespace-nowrap"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {category.label}
                      </Button>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular FAQs Section */}
      {selectedCategory === "all" && !searchTerm && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Popular Questions</h2>
              <div className="grid gap-4">
                {popularFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent 
                        className="p-6"
                        onClick={() => toggleItem(faq.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                            <h3 className="font-semibold text-left">{faq.question}</h3>
                          </div>
                          <motion.div
                            animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          </motion.div>
                        </div>
                        <AnimatePresence>
                          {openItems.includes(faq.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 pt-4 border-t"
                            >
                              <p className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* All FAQs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-8 text-center">
              {selectedCategory === "all" ? "All Questions" : `${selectedCategory} Questions`}
            </h2>
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent 
                      className="p-6"
                      onClick={() => toggleItem(faq.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                          {faq.popular && (
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                          )}
                          <h3 className="font-semibold text-left">{faq.question}</h3>
                        </div>
                        <motion.div
                          animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        </motion.div>
                      </div>
                      <AnimatePresence>
                        {openItems.includes(faq.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t"
                          >
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {filteredFAQs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="text-center py-12"
              >
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No FAQs found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or browse different categories.
                </p>
                <Button onClick={() => { setSearchTerm(""); setSelectedCategory("all") }}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our support team is here to help you get the most out of PromptX.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#chat">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Live Chat
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}