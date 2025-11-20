import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sparkles, 
  FileText, 
  Image, 
  Code, 
  MessageSquare,
  Save,
  Eye,
  Zap,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Copy,
  Wand2,
  ArrowLeft
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { AI_PROVIDERS, recommendModels, ModelRecommendation } from '@/lib/integrations/aiProviders'
import { getActiveIntegrations } from '@/lib/integrations/integrationService'

type PromptCategory = 'text' | 'image' | 'code' | 'chat' | 'marketing' | 'analysis' | 'creative'

interface PromptTemplate {
  id: string
  name: string
  category: PromptCategory
  description: string
  template: string
  icon: React.ReactNode
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'code-review',
    name: 'Code Review Assistant',
    category: 'code',
    description: 'Get comprehensive code reviews with security and best practices',
    template: `You are an expert code reviewer. Analyze the following code and provide:
1. Security vulnerabilities
2. Performance improvements
3. Best practices
4. Code quality score

Code:
{code}`,
    icon: <Code className="h-5 w-5" />
  },
  {
    id: 'image-generator',
    name: 'Image Generation',
    category: 'image',
    description: 'Create detailed image generation prompts',
    template: `Generate a high-quality image with the following specifications:
- Style: {style}
- Subject: {subject}
- Mood: {mood}
- Colors: {colors}
- Details: {details}`,
    icon: <Image className="h-5 w-5" />
  },
  {
    id: 'content-writer',
    name: 'Content Writer',
    category: 'text',
    description: 'Professional content writing assistant',
    template: `Write a {type} about {topic} with the following requirements:
- Tone: {tone}
- Length: {length}
- Target audience: {audience}
- Key points to cover: {points}`,
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'chat-assistant',
    name: 'Chat Assistant',
    category: 'chat',
    description: 'Conversational AI assistant',
    template: `You are a helpful assistant. Your personality:
- Name: {name}
- Expertise: {expertise}
- Communication style: {style}
- Limitations: {limitations}

Respond to user queries in character.`,
    icon: <MessageSquare className="h-5 w-5" />
  }
]

export function SellerPromptStudioPage() {
  const { toast } = useToast()
  const [promptTitle, setPromptTitle] = useState('')
  const [promptText, setPromptText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('text')
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [recommendations, setRecommendations] = useState<ModelRecommendation[]>([])
  const [savedDrafts, setSavedDrafts] = useState<any[]>([])

  useEffect(() => {
    // Load saved drafts
    try {
      const drafts = localStorage.getItem('pnx_prompt_drafts')
      if (drafts) {
        setSavedDrafts(JSON.parse(drafts))
      }
    } catch {}
  }, [])

  useEffect(() => {
    // Get model recommendations when prompt text changes
    if (promptText.trim().length > 20) {
      const recs = recommendModels(selectedCategory, 'medium', 'medium')
      const activeIntegrations = getActiveIntegrations()
      const filtered = recs.filter(r => 
        activeIntegrations.some(i => i.providerId === r.providerId)
      )
      setRecommendations(filtered.slice(0, 5))
    } else {
      setRecommendations([])
    }
  }, [promptText, selectedCategory])

  const handleTemplateSelect = (template: PromptTemplate) => {
    setSelectedTemplate(template)
    setPromptText(template.template)
    setSelectedCategory(template.category)
    setPromptTitle(template.name)
  }

  const handleSaveDraft = () => {
    if (!promptTitle.trim() || !promptText.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please add a title and prompt text',
        variant: 'destructive'
      })
      return
    }

    const draft = {
      id: `draft_${Date.now()}`,
      title: promptTitle,
      text: promptText,
      category: selectedCategory,
      createdAt: new Date().toISOString()
    }

    const updated = [draft, ...savedDrafts].slice(0, 10) // Keep last 10
    setSavedDrafts(updated)
    localStorage.setItem('pnx_prompt_drafts', JSON.stringify(updated))

    toast({
      title: 'Draft Saved',
      description: 'Your prompt has been saved as a draft'
    })
  }

  const handleLoadDraft = (draft: any) => {
    setPromptTitle(draft.title)
    setPromptText(draft.text)
    setSelectedCategory(draft.category)
    toast({
      title: 'Draft Loaded',
      description: 'Draft loaded successfully'
    })
  }

  const handleTestPrompt = () => {
    if (!promptText.trim()) {
      toast({
        title: 'Empty Prompt',
        description: 'Please write a prompt before testing',
        variant: 'destructive'
      })
      return
    }
    window.location.hash = '#dashboard/seller/testing?prompt=' + encodeURIComponent(promptText)
  }

  const handleSubmitForReview = () => {
    if (!promptTitle.trim() || !promptText.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please complete title and prompt',
        variant: 'destructive'
      })
      return
    }
    toast({
      title: 'Ready for Testing',
      description: 'Please test your prompt before submitting for review'
    })
    handleTestPrompt()
  }

  const categories: PromptCategory[] = ['text', 'image', 'code', 'chat', 'marketing', 'analysis', 'creative']
  const categoryLabels: Record<PromptCategory, string> = {
    text: 'Text Generation',
    image: 'Image Generation',
    code: 'Code Assistant',
    chat: 'Chat Bot',
    marketing: 'Marketing',
    analysis: 'Data Analysis',
    creative: 'Creative Writing'
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.hash = '#dashboard/seller'}
            className="gap-2"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              Prompt Studio
            </h1>
            <p className="text-muted-foreground mt-1.5">
              Create, test, and optimize your AI prompts with professional tools
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={!promptTitle.trim() || !promptText.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleTestPrompt} disabled={!promptText.trim()}>
            <Zap className="h-4 w-4 mr-2" />
            Test Prompt
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Templates
              </CardTitle>
              <CardDescription>Start with a professional template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {PROMPT_TEMPLATES.map(template => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={selectedTemplate?.id === template.id ? 'default' : 'outline'}
                    className="w-full justify-start h-auto py-3"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="mt-0.5">{template.icon}</div>
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs opacity-70 mt-0.5">{template.description}</div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {savedDrafts.length > 0 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Saved Drafts
                </CardTitle>
                <CardDescription>{savedDrafts.length} draft{savedDrafts.length !== 1 ? 's' : ''} available</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {savedDrafts.map(draft => (
                  <Button
                    key={draft.id}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2.5"
                    onClick={() => handleLoadDraft(draft)}
                  >
                    <div className="flex-1 min-w-0 text-left">
                      <div className="font-medium text-sm truncate">{draft.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {new Date(draft.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Editor */}
        <div className="space-y-4">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Create Your Prompt</CardTitle>
                  <CardDescription>Build high-quality prompts for AI models</CardDescription>
                </div>
                <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as PromptCategory)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {categoryLabels[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Prompt Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Advanced Code Review Assistant"
                  value={promptTitle}
                  onChange={(e) => setPromptTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prompt">Prompt Text *</Label>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{promptText.length} characters</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(promptText)
                        toast({ title: 'Copied to clipboard' })
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="prompt"
                  placeholder="Write your prompt here... Use {variables} for dynamic inputs."
                  className="min-h-[350px] font-mono text-sm resize-y"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Be specific, include examples, and define the desired output format
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {promptText.split(/\s+/).filter(w => w.length > 0).length} words
                  </Badge>
                </div>
              </div>

              {recommendations.length > 0 && (
                <Card className="bg-primary/5 border-primary/20 border-2">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Recommended Models
                    </CardTitle>
                    <CardDescription>Based on your prompt category and complexity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background border hover:border-primary/50 transition-colors">
                          <div className="flex-1">
                            <div className="font-semibold text-sm">
                              {AI_PROVIDERS[rec.providerId].name} - {rec.model}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">{rec.reason}</div>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {Math.round(rec.confidence * 100)}% match
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2 justify-end pt-2">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={!promptTitle.trim() || !promptText.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestPrompt}
              disabled={!promptText.trim()}
            >
              <Eye className="h-4 w-4 mr-2" />
              Test Prompt
            </Button>
            <Button 
              onClick={handleSubmitForReview}
              disabled={!promptTitle.trim() || !promptText.trim()}
            >
              Submit for Review
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

