import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Copy, Save, Sparkles, Loader2, CheckCircle, Wand2, Zap, Target, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Stepper } from "@/components/ui/stepper"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"

const steps = ["AI Model", "Topic", "Context", "Preview"]

const aiModels = [
  { value: "chatgpt", label: "ChatGPT", description: "OpenAI's conversational AI" },
  { value: "claude", label: "Claude", description: "Anthropic's AI assistant" },
  { value: "gemini", label: "Gemini", description: "Google's multimodal AI" },
  { value: "midjourney", label: "Midjourney", description: "AI image generation" },
  { value: "dalle", label: "DALL-E", description: "OpenAI's image generator" },
  { value: "other", label: "Other", description: "Custom AI model" }
]

const tones = [
  "Professional", "Casual", "Friendly", "Formal", "Creative", "Technical", "Persuasive", "Educational"
]

const styles = [
  "Concise", "Detailed", "Step-by-step", "Conversational", "Structured", "Creative", "Analytical", "Narrative"
]

interface GeneratorData {
  aiModel: string
  topic: string
  context: string
  tone: string
  style: string
  tags: string[]
}

export function GeneratorPage() {
  const { currentUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [data, setData] = useState<GeneratorData>({
    aiModel: "",
    topic: "",
    context: "",
    tone: "",
    style: "",
    tags: []
  })

  const [tagInput, setTagInput] = useState("")
  const { success } = useToast()

  const updateData = (field: keyof GeneratorData, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      updateData("tags", [...data.tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateData("tags", data.tags.filter(tag => tag !== tagToRemove))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.aiModel !== ""
      case 2:
        return data.topic.trim() !== ""
      case 3:
        return true // Context is optional
      default:
        return true
    }
  }

  const nextStep = () => {
    if (canProceed() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generatePrompt = () => {
    const selectedModel = aiModels.find(model => model.value === data.aiModel)
    
    return `Act as a ${selectedModel?.label || 'AI assistant'} expert.

Topic: ${data.topic}

${data.context ? `Context: ${data.context}` : ''}

${data.tone ? `Tone: ${data.tone}` : ''}
${data.style ? `Style: ${data.style}` : ''}
${data.tags.length > 0 ? `Tags: ${data.tags.join(', ')}` : ''}

Please provide a comprehensive response that addresses the topic with the specified requirements.`
  }

  const handleGeneratePrompt = async () => {
    setIsGenerating(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
    setCurrentStep(4)
    success("Prompt generated!", "Your custom prompt is ready to use")
  }

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatePrompt())
      setIsCopied(true)
      success("Copied to clipboard!", "Prompt copied successfully")
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      success("Copy failed", "Unable to copy to clipboard")
    }
  }

  const handleSavePrompt = async () => {
    setIsSaved(true)
    try {
      if (!currentUser) {
        // demo: just toast
        success("Prompt saved!", "Login to save in your library")
        return
      }
      if (!isFirebaseConfigured || !firebaseDb) {
        success("Demo Mode", "Would save to your library in production")
        return
      }
      const promptRef = doc(firebaseDb, 'prompts')
      await setDoc(promptRef, {
        uid: currentUser.uid,
        title: data.topic || 'Untitled Prompt',
        description: generatePrompt(),
        category: 'other',
        tags: data.tags,
        difficulty: 'beginner',
        visibility: true,
        previewImageURL: '',
        fileURL: '',
        likes: [],
        saves: [],
        createdAt: serverTimestamp(),
        lastEditedAt: serverTimestamp()
      })
      success("Prompt saved!", "Added to your prompt library")
    } catch (e: any) {
      success("Save failed", e.message || "Unable to save prompt")
    } finally {
      setTimeout(() => setIsSaved(false), 2000)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">Choose AI Model</h3>
              <p className="text-muted-foreground mb-6">
                Select the AI model you want to generate a prompt for
              </p>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="ai-model">AI Model</Label>
              <Select value={data.aiModel} onValueChange={(value) => updateData("aiModel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an AI model" />
                </SelectTrigger>
                <SelectContent>
                  {aiModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{model.label}</span>
                        <span className="text-xs text-muted-foreground">{model.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">Enter Topic</h3>
              <p className="text-muted-foreground mb-6">
                What do you want to create a prompt for?
              </p>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="topic">Topic or Use Case</Label>
              <Textarea
                id="topic"
                placeholder="e.g., Write a marketing email for a new product launch, Create a code review checklist, Generate social media content for a tech startup..."
                value={data.topic}
                onChange={(e) => updateData("topic", e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">Add Context & Options</h3>
              <p className="text-muted-foreground mb-6">
                Customize your prompt with additional context and preferences
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="context">Additional Context (Optional)</Label>
                <Textarea
                  id="context"
                  placeholder="Add any specific requirements, constraints, or additional context..."
                  value={data.context}
                  onChange={(e) => updateData("context", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={data.tone} onValueChange={(value) => updateData("tone", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="style">Style</Label>
                  <Select value={data.style} onValueChange={(value) => updateData("style", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="tags">Tags (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                {data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"
              >
                <CheckCircle className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Prompt Generated!</h3>
              <p className="text-muted-foreground mb-6">
                Your custom prompt is ready! Review and copy it below.
              </p>
            </div>
            
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Your Custom Prompt
                </CardTitle>
                <CardDescription>
                  Generated for {aiModels.find(m => m.value === data.aiModel)?.label}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-muted/50 p-6 rounded-lg border"
                >
                  <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                    {generatePrompt()}
                  </pre>
                </motion.div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button 
                      onClick={handleCopyPrompt} 
                      className="w-full h-12"
                      disabled={isCopied}
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Prompt
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button 
                      onClick={handleSavePrompt} 
                      variant="outline" 
                      className="w-full h-12"
                      disabled={isSaved}
                    >
                      {isSaved ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Prompt
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Prompt Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create custom AI prompts tailored to your specific needs with our intelligent generator
          </p>
        </motion.div>

        {/* Stepper */}
        <div className="mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : currentStep === steps.length - 1 ? (
                  <Button
                    onClick={handleGeneratePrompt}
                    disabled={!canProceed() || isGenerating}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Generate Prompt
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate New
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
