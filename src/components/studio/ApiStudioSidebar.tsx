import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import {
  Key,
  History,
  Settings,
  Plus,
  Trash2,
  Check,
  X,
  Clock,
  Sparkles,
  ChevronRight,
  HelpCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  AIProvider, 
  AI_PROVIDERS 
} from "@/lib/integrations/aiProviders"
import { 
  loadIntegrations, 
  upsertIntegration, 
  removeIntegration,
  validateApiKey,
  testApiKey 
} from "@/lib/integrations/integrationService"

interface PromptHistory {
  id: string
  provider: AIProvider
  model: string
  prompt: string
  timestamp: number
  response?: string
}

interface ApiStudioSidebarProps {
  onApiKeyChange?: (provider: AIProvider, apiKey: string) => void
  onLoadHistory?: (history: PromptHistory) => void
}

export function ApiStudioSidebar({ onApiKeyChange, onLoadHistory }: ApiStudioSidebarProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"keys" | "history" | "settings">("keys")
  const [tempApiKey, setTempApiKey] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>("openai")
  const [testingKey, setTestingKey] = useState(false)
  const [history, setHistory] = useState<PromptHistory[]>([])

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('api_studio_history')
      if (saved) {
        setHistory(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load history:', e)
    }
  }, [])

  // Save history to localStorage
  const saveHistory = (newHistory: PromptHistory[]) => {
    try {
      localStorage.setItem('api_studio_history', JSON.stringify(newHistory))
      setHistory(newHistory)
    } catch (e) {
      console.error('Failed to save history:', e)
    }
  }

  // Add to history
  const addToHistory = (item: Omit<PromptHistory, 'id' | 'timestamp'>) => {
    const newItem: PromptHistory = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now()
    }
    const newHistory = [newItem, ...history].slice(0, 50) // Keep last 50
    saveHistory(newHistory)
  }

  // Load integrations
  const integrations = loadIntegrations()

  // Handle API key save
  const handleSaveApiKey = async () => {
    if (!tempApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive"
      })
      return
    }
    
    const validation = validateApiKey(selectedProvider, tempApiKey)
    if (!validation.valid) {
      toast({
        title: "Invalid API Key",
        description: validation.error,
        variant: "destructive"
      })
      return
    }
    
    setTestingKey(true)
    const testResult = await testApiKey(selectedProvider, tempApiKey)
    setTestingKey(false)
    
    if (!testResult.success) {
      toast({
        title: "API Key Test Failed",
        description: testResult.error || "Could not verify API key",
        variant: "destructive"
      })
      return
    }
    
    upsertIntegration({
      providerId: selectedProvider,
      apiKey: tempApiKey,
      isActive: true,
      createdAt: new Date().toISOString()
    })
    
    onApiKeyChange?.(selectedProvider, tempApiKey)
    
    toast({
      title: "API Key Saved",
      description: `Successfully connected to ${AI_PROVIDERS[selectedProvider].name}`
    })
    
    setTempApiKey("")
  }

  // Remove API key
  const handleRemoveApiKey = (provider: AIProvider) => {
    removeIntegration(provider)
    toast({
      title: "API Key Removed",
      description: `Disconnected from ${AI_PROVIDERS[provider].name}`
    })
  }

  // Load history item
  const handleLoadHistory = (item: PromptHistory) => {
    onLoadHistory?.(item)
    toast({
      title: "History Loaded",
      description: "Prompt loaded from history"
    })
  }

  // Delete history item
  const handleDeleteHistory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id)
    saveHistory(newHistory)
    toast({
      title: "Deleted",
      description: "Removed from history"
    })
  }

  // Clear all history
  const handleClearHistory = () => {
    saveHistory([])
    toast({
      title: "History Cleared",
      description: "All history items removed"
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>API Studio Settings</SheetTitle>
        </SheetHeader>

        {/* Tabs */}
        <div className="flex gap-2 mt-6 border-b">
          <Button
            variant={activeTab === "keys" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("keys")}
            className="flex-1"
          >
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("history")}
            className="flex-1"
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("settings")}
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* API Keys Tab */}
        {activeTab === "keys" && (
          <div className="mt-6 space-y-4">
            <div>
              <Label className="mb-2 block">Add New API Key</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Provider</Label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => {
                      setSelectedProvider(e.target.value as AIProvider)
                      const saved = integrations[e.target.value as AIProvider]
                      setTempApiKey(saved?.apiKey || "")
                    }}
                    className="w-full mt-1 px-3 py-2 bg-background border rounded-md"
                  >
                    {Object.values(AI_PROVIDERS).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">API Key</Label>
                  <Input
                    type="password"
                    placeholder="sk-..."
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    className="mt-1"
                  />
                  <a
                    href={AI_PROVIDERS[selectedProvider].apiKeyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary mt-1 block hover:underline"
                  >
                    Get your API key →
                  </a>
                </div>
                <Button
                  onClick={handleSaveApiKey}
                  disabled={testingKey || !tempApiKey.trim()}
                  className="w-full"
                >
                  {testingKey ? "Testing..." : "Save & Test"}
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Label className="mb-3 block">Saved API Keys</Label>
              <div className="space-y-2">
                {Object.values(AI_PROVIDERS).map((provider) => {
                  const saved = integrations[provider.id]
                  if (!saved) return null
                  
                  return (
                    <Card key={provider.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{provider.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {saved.apiKey.substring(0, 12)}...
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveApiKey(provider.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                {Object.values(integrations).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No API keys saved yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Prompt History</Label>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearHistory}
                  className="text-destructive"
                >
                  Clear All
                </Button>
              )}
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No history yet. Execute prompts to see them here.
                </p>
              ) : (
                history.map((item) => (
                  <Card key={item.id} className="hover:bg-accent transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {AI_PROVIDERS[item.provider]?.name || item.provider}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm truncate">{item.prompt}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLoadHistory(item)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteHistory(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="mt-6 space-y-6">
            <div>
              <Label className="mb-3 block">Quick Start Guide</Label>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Add API Key</p>
                    <p className="text-muted-foreground text-xs">
                      Go to API Keys tab and add your key. OpenRouter offers free models!
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Select Model</p>
                    <p className="text-muted-foreground text-xs">
                      Choose your provider and model from the dropdown
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Enter Prompt</p>
                    <p className="text-muted-foreground text-xs">
                      Type your question or request in the prompt box
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Execute</p>
                    <p className="text-muted-foreground text-xs">
                      Click "Execute Prompt" button to get results
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Label className="mb-3 block">Recommended Free Models</Label>
              <div className="space-y-2">
                <Card>
                  <CardContent className="p-3">
                    <div className="font-medium text-sm">OpenRouter</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Free models: google/gemini-pro, meta-llama/llama-2-70b-chat
                    </div>
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary mt-2 block hover:underline"
                    >
                      Get API Key →
                    </a>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="font-medium text-sm">Google Gemini</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Generous free tier available
                    </div>
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary mt-2 block hover:underline"
                    >
                      Get API Key →
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

// Export function to add to history (to be called from parent)
export function addPromptToHistory(item: Omit<PromptHistory, 'id' | 'timestamp'>) {
  try {
    const saved = localStorage.getItem('api_studio_history')
    const history: PromptHistory[] = saved ? JSON.parse(saved) : []
    const newItem: PromptHistory = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now()
    }
    const newHistory = [newItem, ...history].slice(0, 50)
    localStorage.setItem('api_studio_history', JSON.stringify(newHistory))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

