import { useMemo, useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  Code2, 
  Copy, 
  Check, 
  Play, 
  Download,
  ServerCog,
  Sparkles,
  Image as ImageIcon,
  Video,
  MessageSquare,
  HelpCircle,
  Brain,
  Clock3,
  ShieldCheck,
  Layers,
  Zap,
  Cpu,
  BarChart3,
  Key,
  Rocket
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  AIProvider, 
  AI_PROVIDERS
} from "@/lib/integrations/aiProviders"
import { 
  loadIntegrations
} from "@/lib/integrations/integrationService"
import { generateCode, CodeFormat, getProviderModels as getModels } from "@/lib/codeGenerators"
import { executePrompt, ExecutePromptResponse } from "@/lib/apiStudioService"
import { ApiStudioSidebar, addPromptToHistory } from "@/components/studio/ApiStudioSidebar"

type SectionId = "overview" | "blueprint" | "composer" | "ops"

type WorkflowStage = {
  id: string
  label: string
  description: string
  type: "text" | "image" | "video" | "chat"
  icon: LucideIcon
  active: boolean
  runtime: string
}

type PromptTemplate = {
  id: string
  title: string
  system: string
  user: string
  tone: string
  target: string
}

const WORKFLOW_BLUEPRINT: WorkflowStage[] = [
  {
    id: "briefing",
    label: "Briefing + Guardrails",
    description: "System persona, constraints, and compliance filters",
    type: "text",
    icon: Brain,
    active: true,
    runtime: "Prep"
  },
  {
    id: "generation",
    label: "Primary Generation",
    description: "Core completion or summarization pass (Required)",
    type: "text",
    icon: Sparkles,
    active: true,
    runtime: "Core"
  },
  {
    id: "image",
    label: "Visual Companion",
    description: "Optional hero image or storyboard frames (OpenAI/Stability only)",
    type: "image",
    icon: ImageIcon,
    active: false,
    runtime: "Asset"
  },
  {
    id: "chat-loop",
    label: "Chat Loop",
    description: "Memory-aware chat responses for follow ups (OpenAI only)",
    type: "chat",
    icon: MessageSquare,
    active: true,
    runtime: "Realtime"
  },
  {
    id: "video",
    label: "Motion Layer",
    description: "Short-form video beats or shot list (Replicate only)",
    type: "video",
    icon: Video,
    active: false,
    runtime: "Experimental"
  }
]

const PROMPT_LIBRARY: PromptTemplate[] = [
  {
    id: "launch-email",
    title: "Product Launch Email",
    system: "You are a bold product marketing lead that ships crisp copy with clear CTAs.",
    user: "Announce the Smart Filters feature to power users, highlight 3 benefits, craft an urgent CTA.",
    tone: "Product Marketing",
    target: "B2B SaaS"
  },
  {
    id: "support-bot",
    title: "Support Deflection Bot",
    system: "You triage tickets, keep responses empathetic, and de-escalate.",
    user: "Help the user troubleshoot intermittent webhook failures using the runbook below.",
    tone: "Support",
    target: "Dev Tools"
  },
  {
    id: "pitch-deck",
    title: "Deck Narrative",
    system: "You are a visionary founder with deep market insight.",
    user: "Draft a 6-slide flow for a pitch deck targeting climate fintech investors.",
    tone: "Executive",
    target: "VC"
  }
]

const CAPABILITY_TAGS = [
  "Retrieval Augmented",
  "Multi-turn Chat",
  "Guardrail Hooks",
  "Streaming Ready",
  "Cost Controls",
  "Webhooks"
]

const SECTION_NAV: Array<{
  id: SectionId
  label: string
  description: string
  icon: LucideIcon
}> = [
  {
    id: "overview",
    label: "Overview",
    description: "Mission control + hero",
    icon: ServerCog
  },
  {
    id: "blueprint",
    label: "Blueprint",
    description: "Stage architecture",
    icon: Layers
  },
  {
    id: "composer",
    label: "Composer",
    description: "Prompts & parameters",
    icon: Sparkles
  },
  {
    id: "ops",
    label: "Ops",
    description: "Executing & telemetry",
    icon: ShieldCheck
  }
]

interface ApiStudioPageProps {
  initialSection?: SectionId
  restrictToSection?: boolean
}

export function ApiStudioPage({ initialSection = "overview", restrictToSection = false }: ApiStudioPageProps = {}) {
  const { toast } = useToast()
  
  // Provider & Model State
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>("openai")
  const [selectedModel, setSelectedModel] = useState("")
  
  // Prompt Configuration
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant")
  const [userPrompt, setUserPrompt] = useState("Write a launch email for Smart Filters")
  
  // Advanced Parameters
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)
  const [topP, setTopP] = useState(1.0)
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0)
  const [presencePenalty, setPresencePenalty] = useState(0.0)
  const [stopSequences, setStopSequences] = useState<string[]>([])
  const [stopInput, setStopInput] = useState("")
  
  // Image/Video specific
  const [imageSize, setImageSize] = useState("1024x1024")
  const [imageQuality, setImageQuality] = useState("standard")
  const [imageStyle, setImageStyle] = useState("vivid")
  const [videoDuration, setVideoDuration] = useState(5)
  const [aspectRatio, setAspectRatio] = useState("16:9")
  
  // UI State
  const [activeTab, setActiveTab] = useState<"text" | "image" | "video" | "chat">("text")
  const [codeFormat, setCodeFormat] = useState<CodeFormat>("javascript")
  const [copied, setCopied] = useState(false)
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStage[]>(() => WORKFLOW_BLUEPRINT)
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<string>(WORKFLOW_BLUEPRINT[0].id)
  const [autoExecuteEnabled, setAutoExecuteEnabled] = useState(false)
  const [livePreviewMode, setLivePreviewMode] = useState<"request" | "response" | "schema">("request")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [activeSectionNav, setActiveSectionNav] = useState<SectionId>(initialSection ?? "overview")
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    overview: null,
    blueprint: null,
    composer: null,
    ops: null
  })
  
  // Execution State
  const [executing, setExecuting] = useState(false)
  const [response, setResponse] = useState<ExecutePromptResponse | null>(null)
  const [saveToHistory, setSaveToHistory] = useState(true) // Auto save by default
  
  // Load saved integrations
  useEffect(() => {
    // Set default model
    const models = getModels(selectedProvider)
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0])
    }
  }, [selectedProvider])
  
  // Get current API key (must be defined before useEffects that use it)
  const currentApiKey = useMemo(() => {
    const integrations = loadIntegrations()
    return integrations[selectedProvider]?.apiKey || ""
  }, [selectedProvider])

  // Keyboard shortcut: Shift + Enter to run pipeline
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'Enter') {
        // Don't trigger if user is typing in a textarea/input
        const target = e.target as HTMLElement
        if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
          return
        }
        
        e.preventDefault()
        if (!executing && currentApiKey && selectedModel && userPrompt.trim()) {
          handleExecute()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executing, currentApiKey, selectedModel, userPrompt])

  useEffect(() => {
    const matchingStep = workflowSteps.find(step => step.type === activeTab && step.active)
    if (matchingStep && matchingStep.id !== selectedWorkflowStep) {
      setSelectedWorkflowStep(matchingStep.id)
    }
  }, [activeTab, workflowSteps, selectedWorkflowStep])

  useEffect(() => {
    if (restrictToSection) return

    const handleScroll = () => {
      let currentSection: SectionId = activeSectionNav
      const offset = window.innerHeight * 0.25

      for (const section of SECTION_NAV) {
        const el = sectionRefs.current[section.id]
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= offset && rect.bottom >= offset) {
            currentSection = section.id
            break
          }
        }
      }

      if (currentSection !== activeSectionNav) {
        setActiveSectionNav(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [activeSectionNav, restrictToSection])
  
  // Available models for selected provider
  const availableModels = useMemo(() => {
    return getModels(selectedProvider)
  }, [selectedProvider])

  const provider = AI_PROVIDERS[selectedProvider]
  const supportsImage = provider?.supports.image
  const supportsVideo = selectedProvider === 'replicate' || selectedProvider === 'stability'

  const selectedStep = workflowSteps.find(step => step.id === selectedWorkflowStep)

  const estimatedCost = useMemo(() => {
    const tokenPrice = provider?.pricing?.perToken ?? 0.00001
    if (!maxTokens) return tokenPrice
    return Number((tokenPrice * maxTokens).toFixed(4))
  }, [provider, maxTokens])

  const readinessScore = useMemo(() => {
    let score = 35
    if (currentApiKey) score += 30
    if (selectedModel) score += 20
    if (workflowSteps.filter(step => step.active).length > 2) score += 10
    if (response?.success) score += 5
    return Math.min(score, 100)
  }, [currentApiKey, selectedModel, workflowSteps, response])

  const generatedCode = useMemo(() => {
    if (!selectedModel || !userPrompt) return ""
    
    const includeSystemPrompt = workflowSteps.some(stage => stage.active && stage.id === "briefing")

    const config = {
      provider: selectedProvider,
      model: selectedModel,
      apiKey: currentApiKey || "YOUR_API_KEY",
      systemPrompt: includeSystemPrompt ? systemPrompt || undefined : undefined,
      userPrompt,
      temperature,
      maxTokens,
      topP,
      frequencyPenalty,
      presencePenalty,
      stop: stopSequences.length > 0 ? stopSequences : undefined,
      size: imageSize,
      quality: imageQuality,
      style: imageStyle,
      duration: videoDuration,
      aspectRatio
    }
    
    return generateCode(config, codeFormat)
  }, [
    selectedProvider, selectedModel, currentApiKey, systemPrompt, userPrompt,
    temperature, maxTokens, topP, frequencyPenalty, presencePenalty, stopSequences,
    imageSize, imageQuality, imageStyle, videoDuration, aspectRatio, codeFormat, workflowSteps
  ])

  const blueprintSchema = useMemo(() => {
    return JSON.stringify({
      provider: selectedProvider,
      model: selectedModel,
      stages: workflowSteps.filter(step => step.active).map(step => ({
        id: step.id,
        type: step.type,
        label: step.label
      })),
      parameters: {
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        presencePenalty,
        stopSequences
      }
    }, null, 2)
  }, [
    selectedProvider,
    selectedModel,
    workflowSteps,
    temperature,
    maxTokens,
    topP,
    frequencyPenalty,
    presencePenalty,
    stopSequences
  ])

  const livePreviewContent = useMemo(() => {
    if (livePreviewMode === "response") {
      if (!response) {
        return "// Execute the pipeline to capture the latest response payload"
      }
      if (!response.success) {
        return `// Error: ${response.error}`
      }
      return typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data, null, 2)
    }

    if (livePreviewMode === "schema") {
      return blueprintSchema
    }

    return generatedCode || "// Select a model and enter a prompt to generate code"
  }, [livePreviewMode, response, generatedCode, blueprintSchema])
  
  // Copy to clipboard
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Code copied to clipboard"
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy",
        variant: "destructive"
      })
    }
  }
  
  // Add stop sequence
  const addStopSequence = () => {
    if (stopInput.trim() && !stopSequences.includes(stopInput.trim())) {
      setStopSequences([...stopSequences, stopInput.trim()])
      setStopInput("")
    }
  }
  
  // Remove stop sequence
  const removeStopSequence = (seq: string) => {
    setStopSequences(stopSequences.filter(s => s !== seq))
  }

  const handleBlueprintToggle = (id: string) => {
    // Prevent disabling Primary Generation (required stage)
    if (id === "generation") {
      toast({
        title: "Cannot Disable",
        description: "Primary Generation stage must remain enabled to execute prompts.",
        variant: "destructive"
      })
      return
    }

    setWorkflowSteps(prev =>
      prev.map(step =>
        step.id === id ? { ...step, active: !step.active } : step
      )
    )

    const step = workflowSteps.find(s => s.id === id)
    if (step) {
      toast({
        title: step.active ? "Stage Disabled" : "Stage Enabled",
        description: `${step.label} has been ${step.active ? "disabled" : "enabled"}. ${step.active ? "This stage will be skipped during execution." : "This stage will run when you execute."}`,
        duration: 3000
      })
    }
  }

  const handleSelectWorkflowStep = (id: string) => {
    setSelectedWorkflowStep(id)
    const step = workflowSteps.find(s => s.id === id)
    if (step) {
      setActiveTab(step.type)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = PROMPT_LIBRARY.find(t => t.id === templateId)
    if (!template) return
    setSelectedTemplateId(templateId)
    setSystemPrompt(template.system)
    setUserPrompt(template.user)
    toast({
      title: "Template loaded",
      description: `${template.title} applied to the editor.`
    })
  }

  const registerSectionRef = (id: SectionId) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el
  }

  const handleSectionNavigate = (id: SectionId) => {
    if (restrictToSection && id !== initialSection) {
      window.location.href = `#studio/api/${id}`
      return
    }

    const el = sectionRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setActiveSectionNav(id)
  }

  const handleOpenDedicatedView = (id: SectionId) => {
    if (typeof window === "undefined") return
    const url = `${window.location.origin}/#studio/api/${id}`
    window.open(url, "_blank", "noopener,noreferrer")
  }
  
  // Execute prompt
  const handleExecute = async () => {
    if (!currentApiKey) {
      toast({
        title: "API Key Required",
        description: "Please add an API key in Settings (top right)",
        variant: "destructive"
      })
      return
    }
    
    const activeStages = workflowSteps.filter(step => step.active)
    
    if (activeStages.length === 0) {
      toast({
        title: "Workflow Required",
        description: "Toggle on at least one stage in the Workflow Blueprint.",
        variant: "destructive"
      })
      return
    }

    if (!activeStages.some(stage => stage.id === "generation")) {
      toast({
        title: "Enable Primary Generation",
        description: "The Primary Generation stage must remain enabled to execute.",
        variant: "destructive"
      })
      return
    }
    
    if (!selectedModel) {
      toast({
        title: "Model Required",
        description: "Please select a model",
        variant: "destructive"
      })
      return
    }
    
    if (!userPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt",
        variant: "destructive"
      })
      return
    }

    const wantsImageStage = activeStages.some(stage => stage.id === "image")
    if (wantsImageStage && !supportsImage) {
      toast({
        title: "Image Stage Unsupported",
        description: "Switch to a provider that supports image generation (OpenAI or Stability).",
        variant: "destructive"
      })
      return
    }

    const wantsVideoStage = activeStages.some(stage => stage.id === "video")
    if (wantsVideoStage && !supportsVideo) {
      toast({
        title: "Video Stage Unsupported",
        description: "Select the Replicate provider to use the Motion Layer stage.",
        variant: "destructive"
      })
      return
    }
    
    setExecuting(true)
    setResponse(null)
    
    try {
      const stagePayload = activeStages.map(stage => ({
        id: stage.id,
        label: stage.label,
        type: stage.type,
        runtime: stage.runtime
      }))

      const result = await executePrompt({
        provider: selectedProvider,
        model: selectedModel,
        apiKey: currentApiKey,
        systemPrompt: activeStages.some(stage => stage.id === "briefing") ? systemPrompt || undefined : undefined,
        userPrompt,
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        presencePenalty,
        stop: stopSequences.length > 0 ? stopSequences : undefined,
        size: imageSize,
        quality: imageQuality,
        style: imageStyle,
        duration: videoDuration,
        aspectRatio,
        workflowStages: stagePayload
      })
      
      setResponse(result)
      
      // Save to history if enabled
      if (result.success) {
        if (saveToHistory) {
          addPromptToHistory({
            provider: selectedProvider,
            model: selectedModel,
            prompt: userPrompt,
            response: typeof result.data === 'string' ? result.data : JSON.stringify(result.data)
          })
        }
        
        toast({
          title: "Success!",
          description: "Prompt executed successfully"
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to execute prompt",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to execute prompt",
        variant: "destructive"
      })
      setResponse({
        success: false,
        error: error.message || "Failed to execute prompt"
      })
    } finally {
      setExecuting(false)
    }
  }

  // Auto Execute: Re-run when parameters change (debounced)
  useEffect(() => {
    if (!autoExecuteEnabled) return
    if (!currentApiKey || !selectedModel || !userPrompt.trim()) return
    if (executing) return // Don't trigger if already executing

    // Debounce: Wait 1.5 seconds after last change before executing
    const timeoutId = setTimeout(() => {
      if (!executing) {
        handleExecute()
      }
    }, 1500)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoExecuteEnabled, userPrompt, systemPrompt, temperature, maxTokens, topP, selectedProvider, selectedModel, currentApiKey, executing])

  // Handle history load
  const handleLoadHistory = (historyItem: any) => {
    setSelectedProvider(historyItem.provider)
    setUserPrompt(historyItem.prompt)
    if (historyItem.model) setSelectedModel(historyItem.model)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
        <motion.section
          id="overview"
          ref={registerSectionRef("overview")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 text-white shadow-2xl scroll-mt-32"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -right-8 top-4 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-purple-500/20 blur-3xl" />
          </div>
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4 max-w-3xl">
                <Badge variant="outline" className="border-white/30 bg-white/10 text-white">
                  Multi-Modal Generators Studio
                </Badge>
                <h1 className="text-4xl md:text-5xl font-black leading-tight">
                  Build runway-ready text, image, chat, and video routines from a single canvas.
                </h1>
                <p className="text-lg text-white/80">
                  Orchestrate guardrails, API keys, and parameters once—then export runnable code for OpenAI, Claude, Gemini, Stable Diffusion, Replicate, and more.
                </p>
                <div className="flex flex-wrap gap-3">
                  {workflowSteps.filter(step => step.active).map(step => {
                    const Icon = step.icon
                    return (
                      <Badge key={step.id} className="bg-white/15 border-white/20 text-white gap-2">
                        <Icon className="h-3 w-3" />
                        {step.label}
                      </Badge>
                    )
                  })}
                  {workflowSteps.filter(step => !step.active && step.id !== "generation").length > 0 && (
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60 gap-2">
                      +{workflowSteps.filter(step => !step.active && step.id !== "generation").length} more available
                    </Badge>
                  )}
                </div>
              </div>
              <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-wide text-white/60">Provider</p>
                    <p className="text-lg font-semibold">{provider?.name ?? "Select provider"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.65rem] uppercase tracking-wide text-white/60">Mode</p>
                    <p className="text-lg font-semibold capitalize">{activeTab}</p>
                  </div>
                </div>
                <Separator className="my-4 border-white/20" />
                <div className="grid grid-cols-2 gap-4 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/60">Tokens Budget</p>
                    <p className="text-2xl font-bold">{maxTokens}</p>
                    <p className="text-xs text-white/60">per request</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/60">Est. Cost</p>
                    <p className="text-2xl font-bold">${estimatedCost.toFixed(4)}</p>
                    <p className="text-xs text-white/60">USD per call</p>
                  </div>
                </div>
                <Separator className="my-4 border-white/20" />
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-white/80">
                      <ShieldCheck className="h-4 w-4" />
                      {currentApiKey ? "API key connected" : "Add an API key"}
                    </div>
                    {!currentApiKey && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <ApiStudioSidebar 
                    onApiKeyChange={(provider, key) => {
                      const integrations = loadIntegrations()
                      if (integrations[provider]?.apiKey !== key) {
                        window.location.reload()
                      }
                    }}
                    onLoadHistory={handleLoadHistory}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {CAPABILITY_TAGS.map(tag => (
                <Badge key={tag} variant="secondary" className="border-white/20 bg-white/10 text-white">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-6 text-white shadow-xl backdrop-blur xl:grid-cols-3">
          <div className="flex gap-3">
            <div className="rounded-2xl bg-white/10 p-3 text-white">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-white/70">Step 1</p>
              <h3 className="text-lg font-semibold">Connect a provider key</h3>
              <p className="text-sm text-white/70">Use Studio Ops → Settings to drop in OpenRouter, OpenAI, Claude, etc.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-2xl bg-white/10 p-3 text-white">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-white/70">Step 2</p>
              <h3 className="text-lg font-semibold">Blueprint the routine</h3>
              <p className="text-sm text-white/70">Toggle stages, load prompt kits, and assign guardrails before composing.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-2xl bg-white/10 p-3 text-white">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-white/70">Step 3</p>
              <h3 className="text-lg font-semibold">Test and ship</h3>
              <p className="text-sm text-white/70">Use Composer to execute, then Ops to monitor readiness and export code.</p>
            </div>
          </div>
        </div>

        <div
          className="sticky z-30"
          style={{ top: "5.25rem" }}
        >
          <div className="flex flex-wrap gap-3 overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 text-white backdrop-blur-xl shadow-lg">
            {SECTION_NAV.map(section => {
              const Icon = section.icon
              const isActive = activeSectionNav === section.id
              const isRendered = !restrictToSection || section.id === initialSection
              const handleNavClick = () => {
                if (isRendered) {
                  handleSectionNavigate(section.id)
                } else {
                  window.location.href = `#studio/api/${section.id}`
                }
              }
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={handleNavClick}
                  className={`flex flex-col items-start rounded-2xl border px-5 py-3 text-left transition shadow-sm ${
                    isActive
                      ? "border-primary/60 bg-primary/15 text-primary"
                      : "border-white/10 bg-white/5 text-white hover:border-white/40"
                  }`}
                >
                  <div className="flex items-center gap-2 text-base font-semibold tracking-tight">
                    <Icon className="h-4 w-4" />
                    <span>{section.label}</span>
                  </div>
                  <p className={`text-xs sm:text-sm leading-snug ${isActive ? "text-primary/80" : "text-white/70"}`}>
                    {section.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {!currentApiKey && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex items-start gap-3 p-4">
              <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Connect a key to start building</p>
                <p className="text-sm text-muted-foreground">
                  Click the <strong>Studio Ops</strong> button above to paste your provider key. Need a free sandbox?
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="text-primary underline ml-1">
                    Grab an OpenRouter key →
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {(!restrictToSection || initialSection === "blueprint") && (
        <section
          id="blueprint"
          ref={registerSectionRef("blueprint")}
          className="space-y-5 scroll-mt-32"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Stage Architecture</p>
              <h2 className="text-2xl font-semibold">Blueprint the flow before toggling parameters</h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Decide which stages ship with this generator, attach guardrails, and pull in curated kits before you fine-tune prompts.
              </p>
            </div>
            {!restrictToSection && (
              <Button variant="outline" size="sm" onClick={() => handleOpenDedicatedView("blueprint")}>
                Open dedicated view
              </Button>
            )}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="h-fit border-dashed border-primary/20 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Workflow Blueprint</CardTitle>
                    <CardDescription>Toggle the stages your generator should run.</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {workflowSteps.filter(s => s.active).length} of {workflowSteps.length} active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflowSteps.map(step => {
                  const Icon = step.icon
                  const isSelected = selectedWorkflowStep === step.id
                  return (
                    <div
                      key={step.id}
                      className={`rounded-2xl border p-4 transition-all ${isSelected ? "border-primary bg-primary/5" : "border-muted"}`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          className="flex flex-1 items-start gap-3 text-left"
                          onClick={() => handleSelectWorkflowStep(step.id)}
                        >
                          <div className={`rounded-full p-2 ${isSelected ? "bg-primary/10 text-primary" : "bg-muted text-foreground"}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold">{step.label}</p>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                        </button>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-muted-foreground">{step.runtime}</span>
                          <Switch 
                            checked={step.active} 
                            onCheckedChange={() => handleBlueprintToggle(step.id)}
                            disabled={step.id === "generation"}
                            title={step.id === "generation" ? "Primary Generation cannot be disabled" : undefined}
                          />
                          {step.id === "generation" && (
                            <Badge variant="outline" className="text-xs mt-1">Required</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className="rounded-2xl border border-dashed border-muted p-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground mb-2">💡 Stage Guide:</p>
                  <ul className="space-y-1 text-xs list-disc list-inside">
                    <li><strong>Briefing:</strong> Applies system prompts and guardrails before generation</li>
                    <li><strong>Primary Generation:</strong> Required - Executes the main AI model call</li>
                    <li><strong>Visual Companion:</strong> Generates images (OpenAI DALL·E or Stability SDXL)</li>
                    <li><strong>Chat Loop:</strong> Creates follow-up conversation turns (OpenAI only)</li>
                    <li><strong>Motion Layer:</strong> Generates video content (Replicate provider)</li>
                  </ul>
                  <p className="mt-3 text-xs">Need another stage (RAG, tool-call, webhook)? Add it here and we will auto-wire the schema once backend endpoints exist.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prompt Kits & Templates</CardTitle>
                <CardDescription>Load curated system/user combos for faster iteration.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {PROMPT_LIBRARY.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all ${selectedTemplateId === template.id ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{template.title}</p>
                      <Badge variant="outline" className="text-xs">{template.tone}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{template.user}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Layers className="h-3 w-3" />
                      Target: {template.target}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capability Stack</CardTitle>
                <CardDescription>Paired hooks ship with every blueprint.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border p-3">
                    <p className="font-semibold flex items-center gap-2"><Cpu className="h-3 w-3" /> Runtime</p>
                    <p className="text-muted-foreground text-xs mt-1">Edge-ready, streaming friendly.</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="font-semibold flex items-center gap-2"><ServerCog className="h-3 w-3" /> Providers</p>
                    <p className="text-muted-foreground text-xs mt-1">OpenAI, Anthropic, Gemini, SDXL.</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="font-semibold flex items-center gap-2"><Zap className="h-3 w-3" /> Testing</p>
                    <p className="text-muted-foreground text-xs mt-1">Sandbox runs + history.</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="font-semibold flex items-center gap-2"><BarChart3 className="h-3 w-3" /> Analytics</p>
                    <p className="text-muted-foreground text-xs mt-1">Tokens, latency, cache hits.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        )}

        {(!restrictToSection || initialSection === "composer") && (
        <section
          id="composer"
          ref={registerSectionRef("composer")}
          className="space-y-5 scroll-mt-32"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Prompt & Parameter Composer</p>
              <h2 className="text-2xl font-semibold">Dial in prompts, parameters, and responses</h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Choose providers, tweak controls, and test outputs without ever leaving this surface. Each tab focuses on a specific modality.
              </p>
            </div>
            {!restrictToSection && (
              <Button variant="outline" size="sm" onClick={() => handleOpenDedicatedView("composer")}>
                Launch composer view
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                    <div className="flex-1">
                      <Label className="text-sm mb-2 block flex items-center gap-2">
                        AI Provider
                        {!currentApiKey && (
                          <Badge variant="destructive" className="text-xs">API Key Required</Badge>
                        )}
                      </Label>
                      <Select value={selectedProvider} onValueChange={(v) => {
                        setSelectedProvider(v as AIProvider)
                        const models = getModels(v as AIProvider)
                        if (models.length > 0) setSelectedModel(models[0])
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(AI_PROVIDERS).map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} - {p.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!currentApiKey && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Add API key via Studio Ops to use this provider
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm mb-2 block">Model</Label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedModel && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {provider?.models.includes(selectedModel) ? 'Model ready' : 'Select a model'}
                        </p>
                      )}
                    </div>
                  </div>
                  {currentApiKey && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Check className="h-3 w-3 text-green-500" />
                        API Key Connected
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="mb-6 flex flex-wrap gap-2">
                <TabsTrigger value="text" className="gap-2">
                  <Sparkles className="h-4 w-4" /> Text
                </TabsTrigger>
                {supportsImage && (
                  <TabsTrigger value="image" className="gap-2">
                    <ImageIcon className="h-4 w-4" /> Image
                  </TabsTrigger>
                )}
                {supportsVideo && (
                  <TabsTrigger value="video" className="gap-2">
                    <Video className="h-4 w-4" /> Video
                  </TabsTrigger>
                )}
                <TabsTrigger value="chat" className="gap-2">
                  <MessageSquare className="h-4 w-4" /> Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Set up your prompt and parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>System Prompt</Label>
                  <Textarea
                    placeholder="You are a helpful assistant..."
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>User Prompt</Label>
                  <Textarea
                    placeholder="Enter your prompt here..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Temperature: {temperature.toFixed(2)}</Label>
                      <span className="text-xs text-muted-foreground">Creativity</span>
                    </div>
                    <Slider value={[temperature]} onValueChange={(v) => setTemperature(v[0])} min={0} max={2} step={0.01} />
                  </div>
                  
                  <div>
                    <Label>Max Tokens</Label>
                    <Input
                      type="number"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Top P: {topP.toFixed(2)}</Label>
                    </div>
                    <Slider value={[topP]} onValueChange={(v) => setTopP(v[0])} min={0} max={1} step={0.01} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Frequency Penalty: {frequencyPenalty.toFixed(2)}</Label>
                    </div>
                    <Slider value={[frequencyPenalty]} onValueChange={(v) => setFrequencyPenalty(v[0])} min={-2} max={2} step={0.01} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Presence Penalty: {presencePenalty.toFixed(2)}</Label>
                    </div>
                    <Slider value={[presencePenalty]} onValueChange={(v) => setPresencePenalty(v[0])} min={-2} max={2} step={0.01} />
                  </div>
                  
                  <div>
                    <Label>Stop Sequences</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Enter stop sequence"
                        value={stopInput}
                        onChange={(e) => setStopInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addStopSequence()}
                      />
                      <Button onClick={addStopSequence} size="sm">Add</Button>
                    </div>
                    {stopSequences.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {stopSequences.map((seq) => (
                          <Badge key={seq} variant="secondary" className="gap-1">
                            {seq}
                            <button onClick={() => removeStopSequence(seq)} className="ml-1">×</button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button
                    onClick={handleExecute}
                    disabled={executing || !currentApiKey || !selectedModel}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {executing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Execute Prompt
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Code Preview Panel */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Code Preview</CardTitle>
                    <CardDescription>Live code generation</CardDescription>
                  </div>
                  <Select value={codeFormat} onValueChange={(v) => setCodeFormat(v as CodeFormat)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="nodejs">Node.js</SelectItem>
                      <SelectItem value="curl">cURL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <pre className="bg-muted/40 rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    <code>{generatedCode || "// Select a model and enter a prompt to generate code"}</code>
                  </pre>
                  {generatedCode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(generatedCode)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCopy(generatedCode)}
                    disabled={!generatedCode}
                    className="flex-1 gap-2"
                  >
                    <Copy className="h-4 w-4" /> Copy Code
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([generatedCode], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `prompt-${selectedProvider}-${Date.now()}.${codeFormat === 'python' ? 'py' : codeFormat === 'curl' ? 'sh' : 'js'}`
                      a.click()
                    }}
                    disabled={!generatedCode}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Response Display */}
          {response && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {response.success ? (
                    <>
                      <Check className="h-5 w-5 text-green-500" />
                      Response
                    </>
                  ) : (
                    <>
                      <span className="h-5 w-5 text-red-500">✕</span>
                      Error
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {response.success ? (
                  <div className="space-y-4">
                    {response.type === 'image' && response.data?.url ? (
                      <div>
                        <img 
                          src={response.data.url} 
                          alt="Generated" 
                          className="max-w-full rounded-lg border"
                        />
                      </div>
                    ) : response.type === 'image' && response.data?.base64 ? (
                      <div>
                        <img 
                          src={`data:image/png;base64,${response.data.base64}`} 
                          alt="Generated" 
                          className="max-w-full rounded-lg border"
                        />
                      </div>
                    ) : (
                      <div className="bg-muted/40 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm font-mono">
                          {typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)}
                        </pre>
                      </div>
                    )}
                    {(response.usage || response.metadata) && (
                      <div className="space-y-2 pt-2 border-t">
                        {response.usage && (
                          <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                            {response.usage.prompt_tokens && (
                              <span>Prompt: {response.usage.prompt_tokens} tokens</span>
                            )}
                            {response.usage.completion_tokens && (
                              <span>Completion: {response.usage.completion_tokens} tokens</span>
                            )}
                            {response.usage.total_tokens && (
                              <span>Total: {response.usage.total_tokens} tokens</span>
                            )}
                          </div>
                        )}
                        {response.metadata && (
                          <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                            {response.metadata.responseTime && (
                              <span>Response: {response.metadata.responseTime}ms</span>
                            )}
                            {response.metadata.cost && (
                              <span className="text-green-500">Cost: {response.metadata.cost}</span>
                            )}
                            {response.metadata.cached && (
                              <Badge variant="outline" className="text-xs">Cached</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {response.stageResults?.length ? (
                      <div className="space-y-3 border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-semibold">Workflow Execution Results</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {response.stageResults.filter(s => s.status === 'completed').length} completed
                            {response.stageResults.filter(s => s.status === 'skipped').length > 0 && 
                              ` • ${response.stageResults.filter(s => s.status === 'skipped').length} skipped`}
                            {response.stageResults.filter(s => s.status === 'failed').length > 0 && 
                              ` • ${response.stageResults.filter(s => s.status === 'failed').length} failed`}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {response.stageResults.map((stage) => {
                            const badgeVariant =
                              stage.status === 'completed'
                                ? 'default'
                                : stage.status === 'skipped'
                                  ? 'outline'
                                  : 'destructive'
                            const stageIcon = workflowSteps.find(s => s.id === stage.id)?.icon || Sparkles
                            const Icon = stageIcon
                            return (
                              <div
                                key={stage.id}
                                className={`rounded-xl border px-3 py-2.5 text-sm flex flex-col gap-2 transition-colors ${
                                  stage.status === 'completed' 
                                    ? 'border-green-500/20 bg-green-500/5' 
                                    : stage.status === 'failed'
                                      ? 'border-red-500/20 bg-red-500/5'
                                      : 'border-muted'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <Icon className={`h-4 w-4 ${
                                      stage.status === 'completed' ? 'text-green-500' : 
                                      stage.status === 'failed' ? 'text-red-500' : 
                                      'text-muted-foreground'
                                    }`} />
                                    <p className="font-semibold capitalize">{stage.id.replace('-', ' ')}</p>
                                  </div>
                                  <Badge variant={badgeVariant} className="text-xs capitalize">
                                    {stage.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{stage.summary}</p>
                                {stage.details && (
                                  <p className="text-xs text-muted-foreground italic">{stage.details}</p>
                                )}
                                {typeof stage.payload?.text === 'string' && (
                                  <div className="mt-1">
                                    <p className="text-xs font-medium mb-1 text-muted-foreground">Output:</p>
                                    <p className="text-xs bg-muted/40 rounded-lg p-2 whitespace-pre-wrap border">
                                      {stage.payload.text}
                                    </p>
                                  </div>
                                )}
                                {stage.payload?.systemPrompt && (
                                  <div className="mt-1">
                                    <p className="text-xs font-medium mb-1 text-muted-foreground">System Prompt Applied:</p>
                                    <p className="text-xs bg-muted/40 rounded-lg p-2 whitespace-pre-wrap border max-h-32 overflow-y-auto">
                                      {stage.payload.systemPrompt}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : null}
                    {response.assets?.images?.length ? (
                      <div className="space-y-2 border-t pt-4">
                        <p className="text-sm font-semibold">Companion Visuals</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {response.assets.images.map((src, idx) => (
                            <img
                              key={`${src}-${idx}`}
                              src={src}
                              alt={`Workflow asset ${idx + 1}`}
                              className="rounded-lg border object-cover w-full"
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {response.assets?.videos?.length ? (
                      <div className="space-y-2 border-t pt-4">
                        <p className="text-sm font-semibold">Motion Layer Assets</p>
                        <div className="space-y-2 text-xs">
                          {response.assets.videos.map((video, idx) => (
                            <a
                              key={`${video}-${idx}`}
                              href={video}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline"
                            >
                              View clip #{idx + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-destructive font-medium">{response.error || 'Unknown error occurred'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="image" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Generation</CardTitle>
                <CardDescription>Configure image generation parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Image Prompt</Label>
                  <Textarea
                    placeholder="A beautiful landscape with mountains..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <div>
                  <Label>Image Size</Label>
                  <Select value={imageSize} onValueChange={setImageSize}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="256x256">256x256</SelectItem>
                      <SelectItem value="512x512">512x512</SelectItem>
                      <SelectItem value="1024x1024">1024x1024</SelectItem>
                      <SelectItem value="1024x1792">1024x1792</SelectItem>
                      <SelectItem value="1792x1024">1792x1024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedProvider === 'openai' && (
                  <>
                    <div>
                      <Label>Quality</Label>
                      <Select value={imageQuality} onValueChange={setImageQuality}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="hd">HD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Style</Label>
                      <Select value={imageStyle} onValueChange={setImageStyle}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vivid">Vivid</SelectItem>
                          <SelectItem value="natural">Natural</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Code Preview</CardTitle>
                    <CardDescription>Live code generation</CardDescription>
                  </div>
                  <Select value={codeFormat} onValueChange={(v) => setCodeFormat(v as CodeFormat)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="nodejs">Node.js</SelectItem>
                      <SelectItem value="curl">cURL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <pre className="bg-muted/40 rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    <code>{generatedCode || "// Enter a prompt to generate code"}</code>
                  </pre>
                  {generatedCode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(generatedCode)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCopy(generatedCode)}
                    disabled={!generatedCode}
                    className="flex-1 gap-2"
                  >
                    <Copy className="h-4 w-4" /> Copy Code
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([generatedCode], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `image-prompt-${selectedProvider}-${Date.now()}.${codeFormat === 'python' ? 'py' : codeFormat === 'curl' ? 'sh' : 'js'}`
                      a.click()
                    }}
                    disabled={!generatedCode}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="video" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Generation</CardTitle>
                <CardDescription>Configure video generation parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Video Prompt</Label>
                  <Textarea
                    placeholder="A cinematic video of..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <div>
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(Number(e.target.value))}
                    className="mt-2"
                    min={1}
                    max={10}
                  />
                </div>
                <div>
                  <Label>Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="9:16">9:16</SelectItem>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="4:3">4:3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Code Preview</CardTitle>
                    <CardDescription>Live code generation</CardDescription>
                  </div>
                  <Select value={codeFormat} onValueChange={(v) => setCodeFormat(v as CodeFormat)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="nodejs">Node.js</SelectItem>
                      <SelectItem value="curl">cURL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <pre className="bg-muted/40 rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    <code>{generatedCode || "// Enter a prompt to generate code"}</code>
                  </pre>
                  {generatedCode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(generatedCode)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCopy(generatedCode)}
                    disabled={!generatedCode}
                    className="flex-1 gap-2"
                  >
                    <Copy className="h-4 w-4" /> Copy Code
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([generatedCode], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `video-prompt-${selectedProvider}-${Date.now()}.${codeFormat === 'python' ? 'py' : codeFormat === 'curl' ? 'sh' : 'js'}`
                      a.click()
                    }}
                    disabled={!generatedCode}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat Configuration</CardTitle>
                <CardDescription>Set up conversation parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>System Message</Label>
                  <Textarea
                    placeholder="You are a helpful assistant..."
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>User Message</Label>
                  <Textarea
                    placeholder="Enter your message..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Temperature: {temperature.toFixed(2)}</Label>
                    </div>
                    <Slider value={[temperature]} onValueChange={(v) => setTemperature(v[0])} min={0} max={2} step={0.01} />
                  </div>
                  <div>
                    <Label>Max Tokens</Label>
                    <Input
                      type="number"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Code Preview</CardTitle>
                    <CardDescription>Live code generation</CardDescription>
                  </div>
                  <Select value={codeFormat} onValueChange={(v) => setCodeFormat(v as CodeFormat)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="nodejs">Node.js</SelectItem>
                      <SelectItem value="curl">cURL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <pre className="bg-muted/40 rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    <code>{generatedCode || "// Enter a message to generate code"}</code>
                  </pre>
                  {generatedCode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(generatedCode)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCopy(generatedCode)}
                    disabled={!generatedCode}
                    className="flex-1 gap-2"
                  >
                    <Copy className="h-4 w-4" /> Copy Code
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([generatedCode], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `chat-prompt-${selectedProvider}-${Date.now()}.${codeFormat === 'python' ? 'py' : codeFormat === 'curl' ? 'sh' : 'js'}`
                      a.click()
                    }}
                    disabled={!generatedCode}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
          </div>
        </section>
        )}

        {(!restrictToSection || initialSection === "ops") && (
        <section
          id="ops"
          ref={registerSectionRef("ops")}
          className="space-y-5 scroll-mt-32"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Operations & Telemetry</p>
              <h2 className="text-2xl font-semibold">Control execution, safety, and downstream exports</h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Keep ops isolated in its own lane—auto execute, monitor readiness, and capture live payloads for handoff.
              </p>
            </div>
            {!restrictToSection && (
              <Button variant="outline" size="sm" onClick={() => handleOpenDedicatedView("ops")}>
                Open ops deck
              </Button>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6">
              <div className="rounded-2xl border bg-muted/40 p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Active Stage</p>
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-semibold">{selectedStep?.label ?? "Stage"}</p>
                  <p className="text-sm text-muted-foreground">{selectedStep?.description}</p>
                  <Badge variant="secondary" className="w-fit">{selectedStep?.runtime ?? "..."}</Badge>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Operations Console</CardTitle>
                  <CardDescription>Launch runs, history, and safeguards.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto Execute</p>
                      <p className="text-xs text-muted-foreground">Re-run when parameters change</p>
                    </div>
                    <Switch checked={autoExecuteEnabled} onCheckedChange={setAutoExecuteEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Save to History</p>
                      <p className="text-xs text-muted-foreground">Logged after successful executions</p>
                    </div>
                    <Button
                      variant={saveToHistory ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSaveToHistory(!saveToHistory)}
                      className="gap-1 h-7"
                    >
                      <Clock3 className="h-3 w-3" />
                      {saveToHistory ? "Auto" : "Off"}
                    </Button>
                  </div>
                  <Separator />
                  <Button
                    onClick={handleExecute}
                    disabled={executing || !currentApiKey || !selectedModel}
                    className="w-full gap-2"
                  >
                    {executing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Executing
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Run Pipeline
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">Shift + Enter also runs the pipeline</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Readiness & Budget</CardTitle>
                  <CardDescription>Confidence before you hand this to engineering.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Readiness</p>
                      <p className="text-2xl font-bold">{readinessScore}%</p>
                      <p className="text-xs text-muted-foreground">Keys, models, tests</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Est. Cost</p>
                      <p className="text-2xl font-bold">${estimatedCost.toFixed(4)}</p>
                      <p className="text-xs text-muted-foreground">Per execution</p>
                    </div>
                  </div>
                  <Progress value={readinessScore} />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tokens</span>
                      <span>{maxTokens}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Active stages</span>
                      <span>{workflowSteps.filter(step => step.active).length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last response</span>
                      <span>{response ? (response.success ? "Success" : "Error") : "Not run"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <CardTitle>Live Preview</CardTitle>
                    <CardDescription>Inspect requests, responses, or schema.</CardDescription>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(["request", "response", "schema"] as const).map(mode => (
                      <Button
                        key={mode}
                        size="sm"
                        variant={livePreviewMode === mode ? "default" : "outline"}
                        onClick={() => setLivePreviewMode(mode)}
                        className="capitalize"
                      >
                        {mode}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <pre className="bg-muted/40 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap max-h-[360px] overflow-auto">
                    <code>{livePreviewContent}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(livePreviewContent)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  {livePreviewMode === "schema" ? "Blueprint JSON updates as you flip stages or tweak parameters." : null}
                  {livePreviewMode === "response" && !response ? "Execute a run to populate real responses." : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        )}
      </div>
    </div>
  )
}

export default ApiStudioPage


