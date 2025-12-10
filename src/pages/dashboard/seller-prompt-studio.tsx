import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
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
  ArrowLeft,
  Variable,
  Play,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  BookOpen,
  TrendingUp,
  Target,
  HelpCircle,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { apiBaseUrl } from '@/lib/utils'
import { isSupabaseConfigured } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'
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

interface PromptVariable {
  name: string
  description: string
  defaultValue: string
  required: boolean
}

interface PromptExample {
  id: string
  inputs: Record<string, string>
  expectedOutput: string
}

interface ValidationIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  suggestion?: string
}

interface AISuggestion {
  type: 'improvement' | 'optimization' | 'best-practice'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
}

interface PromptDraftRecord {
  id: string
  title: string
  text: string
  category: PromptCategory
  variables: PromptVariable[]
  examples: PromptExample[]
  validation?: ValidationIssue[]
  aiSuggestions?: AISuggestion[]
  status: string
  createdAt?: string
  updatedAt?: string
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'code-review',
    name: 'Code Review Assistant',
    category: 'code',
    description: 'Audit code for bugs, security issues, and performance bottlenecks with clear fix steps.',
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
    name: 'Image Generation Brief',
    category: 'image',
    description: 'Brief any image model with clear style, subject, and framing details.',
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
    description: 'Generate structured drafts for blogs, emails, and posts with hooks and CTAs.',
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
    description: 'Design a chat agent with defined persona, tone, and do / don’t rules.',
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
  const { currentUser } = useAuth()
  const [promptTitle, setPromptTitle] = useState('')
  const [promptText, setPromptText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('text')
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [recommendations, setRecommendations] = useState<ModelRecommendation[]>([])
  const [savedDrafts, setSavedDrafts] = useState<any[]>([])
  const [variables, setVariables] = useState<PromptVariable[]>([])
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [examples, setExamples] = useState<PromptExample[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState('editor')
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [showGuidance, setShowGuidance] = useState(true)
  const [loadingDrafts, setLoadingDrafts] = useState(false)

  // Extract variables from prompt text
  const detectedVariables = useMemo(() => {
    const varRegex = /\{([^}]+)\}/g
    const matches = promptText.matchAll(varRegex)
    const vars = new Set<string>()
    for (const match of matches) {
      vars.add(match[1].trim())
    }
    return Array.from(vars)
  }, [promptText])

  // Sync detected variables with state
  useEffect(() => {
    setVariables(prevVars => {
      const newVars: PromptVariable[] = detectedVariables.map(name => {
        const existing = prevVars.find(v => v.name === name)
        return existing || {
          name,
          description: '',
          defaultValue: '',
          required: false
        }
      })
      // Remove variables that no longer exist
      const filtered = newVars.filter(v => detectedVariables.includes(v.name))
      
      // Initialize variable values for new variables
      setVariableValues(prevValues => {
        const newValues: Record<string, string> = { ...prevValues }
        filtered.forEach(v => {
          if (!(v.name in newValues)) {
            newValues[v.name] = v.defaultValue || ''
          }
        })
        // Remove values for variables that no longer exist
        Object.keys(newValues).forEach(key => {
          if (!detectedVariables.includes(key)) {
            delete newValues[key]
          }
        })
        return newValues
      })
      
      return filtered
    })
  }, [detectedVariables])

  // Validate prompt
  useEffect(() => {
    const issues: ValidationIssue[] = []
    
    if (!promptTitle.trim()) {
      issues.push({
        type: 'error',
        message: 'Prompt title is required',
        suggestion: 'Add a descriptive title for your prompt'
      })
    }
    
    if (!promptText.trim()) {
      issues.push({
        type: 'error',
        message: 'Prompt text is required',
        suggestion: 'Write your prompt content'
      })
    } else {
      if (promptText.length < 20) {
        issues.push({
          type: 'warning',
          message: 'Prompt is too short',
          suggestion: 'Add more context and instructions for better results'
        })
      }
      
      if (promptText.length > 4000) {
        issues.push({
          type: 'warning',
          message: 'Prompt is very long',
          suggestion: 'Consider breaking it into smaller, focused prompts'
        })
      }
      
      // Check for clarity
      if (!promptText.includes('?') && !promptText.includes(':')) {
        issues.push({
          type: 'info',
          message: 'Consider adding specific instructions or questions',
          suggestion: 'Use clear instructions like "Analyze...", "Generate...", or "Explain..."'
        })
      }
      
      // Check for examples
      if (!promptText.toLowerCase().includes('example') && !promptText.toLowerCase().includes('sample')) {
        issues.push({
          type: 'info',
          message: 'Consider adding examples',
          suggestion: 'Examples help AI models understand your expected output format'
        })
      }
      
      // Check for output format
      if (!promptText.toLowerCase().includes('format') && !promptText.toLowerCase().includes('output')) {
        issues.push({
          type: 'info',
          message: 'Consider specifying output format',
          suggestion: 'Define how you want the response structured (JSON, markdown, plain text, etc.)'
        })
      }
    }
    
    // Check for undefined variables in examples
    examples.forEach((example, idx) => {
      Object.keys(example.inputs).forEach(varName => {
        if (!detectedVariables.includes(varName)) {
          issues.push({
            type: 'warning',
            message: `Example ${idx + 1} uses undefined variable: {${varName}}`,
            suggestion: `Add {${varName}} to your prompt or remove it from the example`
          })
        }
      })
    })
    
    setValidationIssues(issues)
  }, [promptTitle, promptText, examples, detectedVariables])

  // Generate AI suggestions
  useEffect(() => {
    if (promptText.trim().length < 20) {
      setAiSuggestions([])
      return
    }
    
    const suggestions: AISuggestion[] = []
    
    // Check for specificity
    if (promptText.split(' ').length < 50) {
      suggestions.push({
        type: 'improvement',
        title: 'Add More Context',
        description: 'Detailed prompts produce better results. Include background information, constraints, and desired outcomes.',
        impact: 'high'
      })
    }
    
    // Check for role definition
    if (!promptText.toLowerCase().includes('you are') && !promptText.toLowerCase().includes('act as')) {
      suggestions.push({
        type: 'best-practice',
        title: 'Define the AI Role',
        description: 'Start with "You are..." to set the AI\'s persona and expertise level.',
        impact: 'medium'
      })
    }
    
    // Check for step-by-step instructions
    if (!promptText.match(/\d+\./g) && !promptText.includes('step')) {
      suggestions.push({
        type: 'optimization',
        title: 'Use Step-by-Step Instructions',
        description: 'Break complex tasks into numbered steps for clearer execution.',
        impact: 'medium'
      })
    }
    
    // Check for constraints
    if (!promptText.toLowerCase().includes('do not') && !promptText.toLowerCase().includes('avoid')) {
      suggestions.push({
        type: 'best-practice',
        title: 'Add Constraints',
        description: 'Specify what the AI should avoid or exclude to prevent unwanted outputs.',
        impact: 'low'
      })
    }
    
    setAiSuggestions(suggestions)
  }, [promptText])

  useEffect(() => {
    const loadDrafts = async () => {
      setLoadingDrafts(true)
      try {
        if (isSupabaseConfigured && currentUser) {
          const res = await fetch(
            `${apiBaseUrl}/api/sellers/${currentUser.uid}/prompt-drafts`
          )
          if (res.ok) {
            const json = await res.json()
            setSavedDrafts(json.drafts || [])
          } else {
            console.warn('Failed to load cloud drafts, falling back to local storage')
          }
        }

        if (!isSupabaseConfigured || !currentUser) {
          const drafts = localStorage.getItem('pnx_prompt_drafts')
          if (drafts) {
            setSavedDrafts(JSON.parse(drafts))
          }
        }
      } catch (error) {
        console.warn('Failed to load prompt drafts', error)
      } finally {
        setLoadingDrafts(false)
      }
    }

    loadDrafts()
  }, [currentUser])

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

    const save = async () => {
      try {
        let draft: PromptDraftRecord

        if (isSupabaseConfigured && currentUser) {
          const res = await fetch(
            `${apiBaseUrl}/api/sellers/${currentUser.uid}/prompt-drafts`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: promptTitle,
                text: promptText,
                category: selectedCategory,
                variables,
                examples,
                validation: validationIssues,
                aiSuggestions
              })
            }
          )
          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.error || 'Failed to save draft')
          }
          const json = await res.json()
          draft = json.draft as PromptDraftRecord
        } else {
          draft = {
            id: `draft_${Date.now()}`,
            title: promptTitle,
            text: promptText,
            category: selectedCategory,
            variables,
            examples,
            validation: validationIssues,
            aiSuggestions,
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          const updatedLocal = [draft, ...savedDrafts].slice(0, 10)
          setSavedDrafts(updatedLocal)
          localStorage.setItem('pnx_prompt_drafts', JSON.stringify(updatedLocal))

          toast({
            title: 'Draft Saved (Local)',
            description: 'Supabase is not configured; draft saved in this browser only.'
          })
          return
        }

        const updated = [draft, ...savedDrafts.filter((d: PromptDraftRecord) => d.id !== draft.id)].slice(0, 20)
        setSavedDrafts(updated)

        toast({
          title: 'Draft Saved',
          description: 'Your prompt has been saved to your seller workspace.'
        })
      } catch (error: any) {
        console.error('Failed to save prompt draft', error)
        toast({
          title: 'Save failed',
          description: error?.message || 'Could not save your draft. Please try again.',
          variant: 'destructive'
        })
      }
    }

    void save()
  }

  const handleLoadDraft = (draft: any) => {
    setPromptTitle(draft.title)
    setPromptText(draft.text)
    setSelectedCategory(draft.category)
    if (draft.variables) setVariables(draft.variables)
    if (draft.examples) setExamples(draft.examples)
    toast({
      title: 'Draft Loaded',
      description: 'Draft loaded successfully'
    })
  }

  const handleAddExample = () => {
    const newExample: PromptExample = {
      id: `example_${Date.now()}`,
      inputs: {},
      expectedOutput: ''
    }
    detectedVariables.forEach(varName => {
      newExample.inputs[varName] = variableValues[varName] || ''
    })
    setExamples([...examples, newExample])
  }

  const handleRemoveExample = (id: string) => {
    setExamples(examples.filter(e => e.id !== id))
  }

  const handleUpdateExample = (id: string, field: 'inputs' | 'expectedOutput', value: any) => {
    setExamples(examples.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ))
  }

  const handleUpdateVariable = (name: string, field: keyof PromptVariable, value: string | boolean) => {
    setVariables(vars => vars.map(v => 
      v.name === name ? { ...v, [field]: value } : v
    ))
  }

  const renderPreview = () => {
    let preview = promptText
    Object.entries(variableValues).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g')
      preview = preview.replace(regex, value || `{${key}}`)
    })
    return preview
  }

  const getValidationScore = () => {
    const errors = validationIssues.filter(i => i.type === 'error').length
    const warnings = validationIssues.filter(i => i.type === 'warning').length
    if (errors > 0) return { score: 0, label: 'Invalid', color: 'destructive' }
    if (warnings > 2) return { score: 60, label: 'Needs Work', color: 'warning' }
    if (warnings > 0) return { score: 80, label: 'Good', color: 'default' }
    return { score: 100, label: 'Excellent', color: 'default' }
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
    const errors = validationIssues.filter(i => i.type === 'error')
    if (errors.length > 0) {
      toast({
        title: 'Validation Failed',
        description: `Please fix ${errors.length} error(s) before submitting`,
        variant: 'destructive'
      })
      return
    }
    
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

      <div className="grid gap-6 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] items-start">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="border-2 h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Prompt blueprints
              </CardTitle>
              <CardDescription>Kick off with a focused starting prompt instead of a blank editor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {PROMPT_TEMPLATES.map(template => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={selectedTemplate?.id === template.id ? 'default' : 'outline'}
                      className="w-full justify-start h-auto py-3 whitespace-normal text-left"
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
                <CardDescription>
                  {loadingDrafts ? 'Loading drafts...' : `${savedDrafts.length} draft${savedDrafts.length !== 1 ? 's' : ''} available`}
                </CardDescription>
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
          {/* Validation Score Card */}
          {promptText.trim() && (
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getValidationScore().score === 100 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : getValidationScore().score >= 80 ? (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-semibold">Quality Score: {getValidationScore().score}%</span>
                      <Badge variant={getValidationScore().color === 'destructive' ? 'destructive' : 'secondary'}>
                        {getValidationScore().label}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {validationIssues.filter(i => i.type === 'error').length} errors, {' '}
                      {validationIssues.filter(i => i.type === 'warning').length} warnings
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={showGuidance}
                      onCheckedChange={setShowGuidance}
                    />
                    <Label className="text-sm">Show Guidance</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Create Your Prompt</CardTitle>
                  <CardDescription>Build high-quality prompts for AI models</CardDescription>
                </div>
                <div className="flex items-center gap-2">
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
                  <Button
                    variant={showPreview ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="variables">
                    Variables {detectedVariables.length > 0 && (
                      <Badge variant="secondary" className="ml-2">{detectedVariables.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="examples">
                    Examples {examples.length > 0 && (
                      <Badge variant="secondary" className="ml-2">{examples.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="space-y-4 mt-4">
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
                    <div className="relative">
                      <Textarea
                        id="prompt"
                        placeholder="Write your prompt here... Use {variables} for dynamic inputs."
                        className="min-h-[350px] font-mono text-sm resize-y"
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                      />
                      {detectedVariables.length > 0 && (
                        <div className="absolute top-2 right-2 flex flex-wrap gap-1">
                          {detectedVariables.map(varName => (
                            <Badge key={varName} variant="outline" className="text-xs">
                              <Variable className="h-3 w-3 mr-1" />
                              {varName}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        💡 Tip: Be specific, include examples, and define the desired output format
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {promptText.split(/\s+/).filter(w => w.length > 0).length} words
                      </Badge>
                    </div>
                  </div>

                  {/* Preview Mode */}
                  {showPreview && promptText && (
                    <Card className="bg-muted/50 border-2">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Preview
                        </CardTitle>
                        <CardDescription>How your prompt will look with variables filled</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-background rounded-lg border font-mono text-sm whitespace-pre-wrap min-h-[200px]">
                          {renderPreview()}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Guidance Panel */}
                  {showGuidance && (
                    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Quick Guide
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <strong>Be Specific:</strong> Clearly define what you want the AI to do
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <strong>Use Variables:</strong> Use {'{variableName}'} for dynamic inputs
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <strong>Add Examples:</strong> Show expected input/output format
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <strong>Define Output Format:</strong> Specify JSON, markdown, or plain text
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="variables" className="space-y-4 mt-4">
                  {detectedVariables.length === 0 ? (
                    <Card className="border-2 border-dashed">
                      <CardContent className="pt-6 text-center">
                        <Variable className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">No variables detected</p>
                        <p className="text-sm text-muted-foreground">
                          Use {'{variableName}'} in your prompt to create dynamic inputs
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {variables.map((variable, idx) => (
                        <Card key={variable.name} className="border-2">
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Variable className="h-4 w-4 text-primary" />
                                  <Label className="font-semibold">{'{' + variable.name + '}'}</Label>
                                  {variable.required && (
                                    <Badge variant="destructive" className="text-xs">Required</Badge>
                                  )}
                                </div>
                                <Switch
                                  checked={variable.required}
                                  onCheckedChange={(checked) => handleUpdateVariable(variable.name, 'required', checked)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                  placeholder="What is this variable for?"
                                  value={variable.description}
                                  onChange={(e) => handleUpdateVariable(variable.name, 'description', e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Default Value</Label>
                                <Input
                                  placeholder="Default value for this variable"
                                  value={variable.defaultValue}
                                  onChange={(e) => {
                                    handleUpdateVariable(variable.name, 'defaultValue', e.target.value)
                                    setVariableValues({ ...variableValues, [variable.name]: e.target.value })
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Test Value</Label>
                                <Input
                                  placeholder="Value to use in preview"
                                  value={variableValues[variable.name] || ''}
                                  onChange={(e) => setVariableValues({ ...variableValues, [variable.name]: e.target.value })}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="examples" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Example Inputs & Outputs</h3>
                      <p className="text-sm text-muted-foreground">Add examples to help users understand how to use your prompt</p>
                    </div>
                    <Button onClick={handleAddExample} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Example
                    </Button>
                  </div>

                  {examples.length === 0 ? (
                    <Card className="border-2 border-dashed">
                      <CardContent className="pt-6 text-center">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">No examples yet</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Examples help users understand how to use your prompt effectively
                        </p>
                        <Button onClick={handleAddExample} variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Example
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {examples.map((example, idx) => (
                        <Card key={example.id} className="border-2">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">Example {idx + 1}</CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveExample(example.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label>Input Values</Label>
                              {detectedVariables.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No variables in your prompt</p>
                              ) : (
                                <div className="space-y-2">
                                  {detectedVariables.map(varName => (
                                    <div key={varName} className="space-y-1">
                                      <Label className="text-xs">{'{' + varName + '}'}</Label>
                                      <Input
                                        value={example.inputs[varName] || ''}
                                        onChange={(e) => handleUpdateExample(example.id, 'inputs', {
                                          ...example.inputs,
                                          [varName]: e.target.value
                                        })}
                                        placeholder={`Enter value for ${varName}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Separator />
                            <div className="space-y-2">
                              <Label>Expected Output</Label>
                              <Textarea
                                placeholder="Describe or show the expected output for this example"
                                value={example.expectedOutput}
                                onChange={(e) => handleUpdateExample(example.id, 'expectedOutput', e.target.value)}
                                className="min-h-[100px]"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="insights" className="space-y-4 mt-4">
                  {/* Validation Issues */}
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Validation
                      </CardTitle>
                      <CardDescription>Issues found in your prompt</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {validationIssues.length === 0 ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <CheckCircle2 className="h-5 w-5" />
                          <span>No issues found! Your prompt looks good.</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {validationIssues.map((issue, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border-2 ${
                                issue.type === 'error' ? 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900' :
                                issue.type === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900' :
                                'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                {issue.type === 'error' ? (
                                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                                ) : issue.type === 'warning' ? (
                                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                ) : (
                                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{issue.message}</p>
                                  {issue.suggestion && (
                                    <p className="text-xs text-muted-foreground mt-1">{issue.suggestion}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* AI Suggestions */}
                  {aiSuggestions.length > 0 && (
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          AI Suggestions
                        </CardTitle>
                        <CardDescription>Ways to improve your prompt</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {aiSuggestions.map((suggestion, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg border-2 hover:border-primary/50 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm">{suggestion.title}</span>
                                    <Badge
                                      variant={
                                        suggestion.impact === 'high' ? 'destructive' :
                                        suggestion.impact === 'medium' ? 'default' : 'secondary'
                                      }
                                      className="text-xs"
                                    >
                                      {suggestion.impact} impact
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

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

