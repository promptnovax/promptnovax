import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Code, 
  Palette, 
  Wand2, 
  ExternalLink, 
  Copy,
  Sparkles,
  Zap,
  Rocket
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Tool {
  id: string
  name: string
  description: string
  category: "development" | "design" | "ai" | "productivity"
  url: string
  icon: React.ReactNode
  color: string
  popular?: boolean
}

const toolsByCategory: Record<string, Tool[]> = {
  development: [
    {
      id: "cursor",
      name: "Cursor",
      description: "AI-powered code editor with built-in AI assistance",
      category: "development",
      url: "https://cursor.sh",
      icon: <Code className="h-5 w-5" />,
      color: "bg-blue-500",
      popular: true
    },
    {
      id: "lovable",
      name: "Lovable.dev",
      description: "Build web apps with AI - no coding required",
      category: "development",
      url: "https://lovable.dev",
      icon: <Wand2 className="h-5 w-5" />,
      color: "bg-purple-500",
      popular: true
    },
    {
      id: "github-copilot",
      name: "GitHub Copilot",
      description: "AI pair programmer that suggests code",
      category: "development",
      url: "https://github.com/features/copilot",
      icon: <Code className="h-5 w-5" />,
      color: "bg-gray-800"
    },
    {
      id: "v0",
      name: "v0 by Vercel",
      description: "Generate UI components with AI",
      category: "development",
      url: "https://v0.dev",
      icon: <Sparkles className="h-5 w-5" />,
      color: "bg-black"
    }
  ],
  design: [
    {
      id: "figma",
      name: "Figma",
      description: "Design and prototype with AI plugins",
      category: "design",
      url: "https://figma.com",
      icon: <Palette className="h-5 w-5" />,
      color: "bg-purple-600"
    },
    {
      id: "midjourney",
      name: "Midjourney",
      description: "AI image generation for designs",
      category: "design",
      url: "https://midjourney.com",
      icon: <Palette className="h-5 w-5" />,
      color: "bg-green-500"
    },
    {
      id: "dalle",
      name: "DALL·E",
      description: "Create images from text descriptions",
      category: "design",
      url: "https://openai.com/dall-e",
      icon: <Palette className="h-5 w-5" />,
      color: "bg-blue-600"
    }
  ],
  ai: [
    {
      id: "chatgpt",
      name: "ChatGPT",
      description: "Advanced AI conversation and assistance",
      category: "ai",
      url: "https://chatgpt.com",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-green-500",
      popular: true
    },
    {
      id: "claude",
      name: "Claude",
      description: "AI assistant for complex tasks",
      category: "ai",
      url: "https://claude.ai",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-orange-500"
    },
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Multimodal AI for various tasks",
      category: "ai",
      url: "https://gemini.google.com",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-blue-500"
    }
  ],
  productivity: [
    {
      id: "notion",
      name: "Notion AI",
      description: "AI-powered workspace and notes",
      category: "productivity",
      url: "https://notion.so",
      icon: <Rocket className="h-5 w-5" />,
      color: "bg-gray-800"
    }
  ]
}

interface ToolSuggestionsProps {
  templateCategory: string
  templateTitle: string
  promptContent?: string
}

export function ToolSuggestions({ 
  templateCategory, 
  templateTitle,
  promptContent 
}: ToolSuggestionsProps) {
  const { success } = useToast()

  // Map template categories to tool categories
  const getRelevantTools = (): Tool[] => {
    const categoryMap: Record<string, string[]> = {
      development: ["development", "ai"],
      writing: ["ai", "productivity"],
      marketing: ["ai", "productivity"],
      design: ["design", "ai"],
      image: ["design"],
      operations: ["productivity", "ai"]
    }

    const relevantCategories = categoryMap[templateCategory.toLowerCase()] || ["ai", "development"]
    const tools: Tool[] = []
    
    relevantCategories.forEach(cat => {
      if (toolsByCategory[cat]) {
        tools.push(...toolsByCategory[cat])
      }
    })

    // Prioritize popular tools
    return tools.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)).slice(0, 6)
  }

  const relevantTools = getRelevantTools()

  const handleCopyToCursor = async (tool: Tool) => {
    if (tool.id === "cursor" && promptContent) {
      // Copy prompt to clipboard with instructions
      const cursorPrompt = `# ${templateTitle}\n\n${promptContent}\n\n---\n\nUse this prompt in Cursor's AI chat to get started.`
      await navigator.clipboard.writeText(cursorPrompt)
      success("Copied to Clipboard", "Prompt copied! Open Cursor and paste it in the AI chat.")
    } else {
      // For other tools, just copy the prompt
      if (promptContent) {
        await navigator.clipboard.writeText(promptContent)
        success("Copied", `Prompt copied! Ready to use in ${tool.name}.`)
      }
    }
  }

  const handleOpenTool = (tool: Tool) => {
    window.open(tool.url, "_blank", "noopener,noreferrer")
    if (promptContent) {
      // Copy prompt to clipboard when opening tool
      navigator.clipboard.writeText(promptContent).then(() => {
        success("Prompt Copied", `Prompt copied! Paste it in ${tool.name}.`)
      })
    }
  }

  if (relevantTools.length === 0) {
    return null
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommended AI Tools
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Use these tools with your prompt to build faster
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relevantTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`${tool.color} p-2 rounded-lg text-white flex-shrink-0`}>
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{tool.name}</h4>
                        {tool.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    {tool.id === "cursor" && promptContent ? (
                      <Button
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => handleCopyToCursor(tool)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy to Cursor
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => handleCopyToCursor(tool)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Prompt
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => handleOpenTool(tool)}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {templateCategory.toLowerCase() === "development" && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <Rocket className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Pro Tip: Using with Cursor</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  After copying the prompt, open Cursor and paste it in the AI chat. The AI will guide you step-by-step on how to implement this in your codebase.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => {
                    if (promptContent) {
                      const cursorGuide = `# ${templateTitle}\n\n${promptContent}\n\n---\n\n**How to use in Cursor:**\n1. Open Cursor editor\n2. Press Cmd/Ctrl + L to open AI chat\n3. Paste this prompt\n4. The AI will guide you through implementation\n5. Ask follow-up questions as needed`
                      navigator.clipboard.writeText(cursorGuide)
                      success("Guide Copied", "Complete guide copied! Paste it in Cursor's AI chat.")
                    }
                  }}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Complete Guide
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

