import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Zap, 
  Wand2, 
  Copy, 
  Download, 
  RefreshCw,
  Sparkles,
  Target,
  Settings
} from "lucide-react"

export function DashboardGenerator() {
  const [prompt, setPrompt] = useState("")
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedTone, setSelectedTone] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("")

  const models = [
    { value: "gpt-4", label: "GPT-4" },
    { value: "gpt-3.5", label: "GPT-3.5 Turbo" },
    { value: "claude", label: "Claude 3" },
    { value: "gemini", label: "Gemini Pro" }
  ]

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "creative", label: "Creative" },
    { value: "technical", label: "Technical" }
  ]

  const styles = [
    { value: "detailed", label: "Detailed" },
    { value: "concise", label: "Concise" },
    { value: "step-by-step", label: "Step-by-step" },
    { value: "conversational", label: "Conversational" }
  ]

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate generation delay
    setTimeout(() => {
      setGeneratedPrompt(`You are an expert ${selectedTone || 'professional'} assistant. ${prompt || 'Please provide a detailed response to the user\'s query.'} Please respond in a ${selectedStyle || 'detailed'} manner.`)
      setIsGenerating(false)
    }, 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Prompt Generator</h1>
        <p className="text-muted-foreground">Create custom AI prompts with our advanced generator</p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generator Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Wand2 className="h-5 w-5 text-primary" />
                  </div>
                  Create New Prompt
                </CardTitle>
                <CardDescription>
                  Configure your prompt parameters and generate custom AI prompts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* AI Model Selection */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="model" className="text-sm font-medium">AI Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="h-12 border-2 focus:border-primary/50 transition-colors">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Prompt Input */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="prompt" className="text-sm font-medium">Prompt Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe what you want the AI to do..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="border-2 focus:border-primary/50 transition-colors resize-none"
                  />
                </motion.div>

                {/* Tone Selection */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="tone" className="text-sm font-medium">Tone</Label>
                  <Select value={selectedTone} onValueChange={setSelectedTone}>
                    <SelectTrigger className="h-12 border-2 focus:border-primary/50 transition-colors">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Style Selection */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="style" className="text-sm font-medium">Style</Label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger className="h-12 border-2 focus:border-primary/50 transition-colors">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Generate Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !prompt}
                    className="w-full h-12 text-base font-medium"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        Generate Prompt
                      </>
                    )}
                  </Button>
                </motion.div>
            </CardContent>
          </Card>
        </motion.div>

          {/* Generated Prompt */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  Generated Prompt
                </CardTitle>
                <CardDescription>
                  Your custom AI prompt is ready to use
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {generatedPrompt ? (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl border-2 border-primary/10"
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{generatedPrompt}</p>
                    </motion.div>
                    <div className="flex gap-3">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={handleCopy} variant="outline" size="sm" className="h-10">
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm" className="h-10">
                          <Download className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <div className="h-48 flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/40 rounded-xl border-2 border-dashed border-muted-foreground/20">
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="p-4 rounded-full bg-primary/10 mx-auto mb-4 w-fit">
                        <Target className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Ready to Generate</h3>
                      <p className="text-muted-foreground text-sm max-w-xs">
                        Fill out the form and click "Generate Prompt" to create your custom AI prompt.
                      </p>
                    </motion.div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
      </div>

        {/* Quick Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                Quick Templates
              </CardTitle>
              <CardDescription>
                Start with these popular prompt templates
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Content Writer", description: "Create engaging content", icon: "✍️" },
                  { title: "Code Assistant", description: "Help with programming", icon: "💻" },
                  { title: "Creative Writer", description: "Generate creative stories", icon: "📚" },
                  { title: "Data Analyst", description: "Analyze and interpret data", icon: "📊" },
                  { title: "Marketing Expert", description: "Create marketing strategies", icon: "📈" },
                  { title: "Technical Writer", description: "Write technical documentation", icon: "📝" }
                ].map((template, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start text-left w-full hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                      onClick={() => setPrompt(template.description)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="text-2xl">{template.icon}</div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{template.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
    </div>
  )
}
