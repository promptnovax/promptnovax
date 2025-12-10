import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { TemplateAIChat } from "@/components/templates/TemplateAIChat"
import { ToolSuggestions } from "@/components/templates/ToolSuggestions"
import { PromptPackOrganizer, PromptPackItem } from "@/components/templates/PromptPackOrganizer"
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Download,
  Clock,
  Copy,
  MessageSquare,
  ExternalLink
} from "lucide-react"

// Import template library - in production, this should be a shared module
// For now, we'll duplicate the structure to avoid circular dependencies
interface Template {
  id: string
  title: string
  description: string
  category: string
  group: string
  aiPlatform: string
  price: number
  image: string
  prompt: string
  tags: string[]
  metrics: string
}

const getTemplateLibrary = (): Template[] => {
  // This should match templates/index.tsx templateLibrary
  // In production, extract to a shared data file
  return [
    {
      id: "trend-1",
      title: "Viral Product Launch Sequence",
      description: "Complete 7-touch email + social cadence engineered for time-sensitive launches.",
      category: "Marketing",
      group: "trending",
      aiPlatform: "ChatGPT",
      price: 0,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop",
      prompt: "Design a persuasive launch sequence for {product}. Include teaser, announcement, social snippets, urgency nudge, and post-launch survey. Personalise for {audience persona}.",
      tags: ["Launch", "Email", "Social"],
      metrics: "🔥 2.1k creators shipped with this"
    },
    {
      id: "trend-2",
      title: "Auto-Reply Support Copilot",
      description: "Generate empathetic, on-brand responses to complex customer issues in seconds.",
      category: "Customer Support",
      group: "trending",
      aiPlatform: "Claude",
      price: 9,
      image: "https://images.unsplash.com/photo-1520241434507-9516cf4b65ac?w=1200&q=80&auto=format&fit=crop",
      prompt: "Craft a support response for {issue summary}. Empathise briefly, confirm understanding, outline 3 actionable steps, provide reassurance. Follow {brand tone guidelines}.",
      tags: ["Customer Care", "Automation"],
      metrics: "✅ Cuts reply time by 65%"
    },
    {
      id: "dev-1",
      title: "Full-stack Feature Blueprint",
      description: "Convert product specs into technical implementation plans with tasks and timelines.",
      category: "Development",
      group: "development",
      aiPlatform: "Claude",
      price: 12,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop",
      prompt: "You are a senior tech lead. Break down feature '{feature}' for a {stack} stack. Provide architecture outline, data model changes, API contracts, task list by priority, estimation and risks.",
      tags: ["Planning", "Architecture"],
      metrics: "🛠️ 3 teams shipped faster"
    },
    {
      id: "dev-2",
      title: "Code Review Assistant",
      description: "Summarise pull requests, flag regressions, and suggest refactors.",
      category: "Development",
      group: "development",
      aiPlatform: "ChatGPT",
      price: 0,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop",
      prompt: "Review the following PR diff: {paste diff}. Identify bugs, performance issues, missing tests, and style problems. Provide actionable review comments grouped by severity.",
      tags: ["Quality", "Review"],
      metrics: "✅ 92% bug catch rate"
    }
  ]
}

interface TemplateDetailProps {
  templateId: string
}

export function TemplateDetailPage({ templateId }: TemplateDetailProps) {
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const { success } = useToast()

  const template = getTemplateLibrary().find(t => t.id === templateId)

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Template Not Found</h1>
          <Button onClick={() => window.location.hash = "#templates/index"}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
        </div>
      </div>
    )
  }

  const handleBackToTemplates = () => {
    window.location.hash = "#templates/index"
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(template.prompt)
    success("Copied!", "Prompt copied to clipboard")
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackToTemplates}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <Badge variant="outline" className="capitalize">{template.category}</Badge>
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
            {/* Template Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                      {template.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                      {template.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" onClick={handleCopyPrompt}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Prompt
                    </Button>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="mb-6">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                  />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>{template.metrics}</span>
                  </div>
                  <Badge variant="secondary">{template.aiPlatform}</Badge>
                  {template.price === 0 ? (
                    <Badge variant="outline">Free</Badge>
                  ) : (
                    <Badge>${template.price}</Badge>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prompt Content */}
            <Card>
              <CardHeader>
                <CardTitle>Prompt Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{template.prompt}</pre>
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

            {/* Tool Suggestions */}
            <ToolSuggestions
              templateCategory={template.category}
              templateTitle={template.title}
              promptContent={template.prompt}
            />
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
                  templateTitle={template.title}
                  templateDescription={template.description}
                  templateCategory={template.category}
                  promptContent={template.prompt}
                  isMinimized={isChatMinimized}
                  onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
                />
              </div>
            </motion.div>
          )}

          {/* Sidebar Toggle */}
          {(!isChatOpen || isChatMinimized) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3"
            >
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
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

