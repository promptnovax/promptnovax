import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  FlaskConical, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  Loader2,
  Zap,
  TrendingUp,
  DollarSign,
  Timer,
  BarChart3,
  Copy,
  Download,
  RefreshCw,
  ArrowLeft,
  History
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { AI_PROVIDERS, AIProvider, ModelRecommendation, recommendModels } from '@/lib/integrations/aiProviders'
import { getActiveIntegrations } from '@/lib/integrations/integrationService'
import { 
  TestRun, 
  createTestRun, 
  executeTestRun, 
  batchTestPrompt,
  generateTestScenarios,
  getRecommendedModelsForPrompt
} from '@/lib/integrations/testingService'

export function SellerTestingLabPage() {
  const { toast } = useToast()
  const [promptText, setPromptText] = useState('')
  const [testInput, setTestInput] = useState('')
  const [selectedModels, setSelectedModels] = useState<Array<{ providerId: AIProvider; model: string }>>([])
  const [testRuns, setTestRuns] = useState<TestRun[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [recommendations, setRecommendations] = useState<ModelRecommendation[]>([])

  // Load prompt from URL if provided
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const promptParam = params.get('prompt')
    if (promptParam) {
      setPromptText(decodeURIComponent(promptParam))
    }
  }, [])

  useEffect(() => {
    if (promptText.trim().length > 20) {
      const recs = getRecommendedModelsForPrompt(promptText, 'text')
      setRecommendations(recs)
    } else {
      setRecommendations([])
    }
  }, [promptText])

  const handleAddModel = (providerId: AIProvider, model: string) => {
    if (selectedModels.some(m => m.providerId === providerId && m.model === model)) {
      toast({
        title: 'Already Added',
        description: 'This model is already in the test queue',
        variant: 'destructive'
      })
      return
    }
    setSelectedModels([...selectedModels, { providerId, model }])
  }

  const handleRemoveModel = (index: number) => {
    setSelectedModels(selectedModels.filter((_, i) => i !== index))
  }

  const handleRunTests = async () => {
    if (!promptText.trim()) {
      toast({
        title: 'Missing Prompt',
        description: 'Please enter a prompt to test',
        variant: 'destructive'
      })
      return
    }

    if (selectedModels.length === 0) {
      toast({
        title: 'No Models Selected',
        description: 'Please select at least one model to test',
        variant: 'destructive'
      })
      return
    }

    setIsRunning(true)
    const promptId = `prompt_${Date.now()}`

    try {
      const runs = await batchTestPrompt(promptId, promptText, selectedModels, testInput || undefined)
      setTestRuns(runs)
      toast({
        title: 'Tests Completed',
        description: `Successfully tested ${runs.length} model(s)`
      })
    } catch (error) {
      toast({
        title: 'Test Failed',
        description: 'An error occurred while running tests',
        variant: 'destructive'
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleClearResults = () => {
    setTestRuns([])
    setSelectedModels([])
  }

  const activeIntegrations = getActiveIntegrations()
  const availableModels = activeIntegrations.flatMap(int => {
    const provider = AI_PROVIDERS[int.providerId]
    return provider.models.map(model => ({
      providerId: int.providerId,
      model,
      providerName: provider.name
    }))
  })

  const completedRuns = testRuns.filter(r => r.status === 'completed')
  const failedRuns = testRuns.filter(r => r.status === 'failed')
  const avgLatency = completedRuns.length > 0
    ? Math.round(completedRuns.reduce((sum, r) => sum + (r.metrics?.latency || 0), 0) / completedRuns.length)
    : 0
  const totalCost = completedRuns.reduce((sum, r) => sum + (r.metrics?.cost || 0), 0)

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
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
              <FlaskConical className="h-8 w-8 text-primary" />
              Testing Lab
            </h1>
            <p className="text-muted-foreground mt-1.5">
              Test your prompts across multiple AI models and compare results
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => window.location.hash = '#dashboard/seller/test-scenarios'}
            className="gap-2"
          >
            <FlaskConical className="h-4 w-4" />
            <span className="hidden sm:inline">Scenarios</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.hash = '#dashboard/seller/test-history'}
            className="gap-2"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </Button>
          {testRuns.length > 0 && (
            <Button variant="outline" onClick={handleClearResults} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
          <Button 
            onClick={() => window.location.hash = '#dashboard/seller/prompt-studio'}
            className="gap-2"
          >
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Create Prompt</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {testRuns.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Tests</p>
                  <p className="text-2xl font-bold">{testRuns.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Passed</p>
                  <p className="text-2xl font-bold text-green-600">{completedRuns.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Avg Latency</p>
                  <p className="text-2xl font-bold">{avgLatency}ms</p>
                </div>
                <Timer className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                  <p className="text-2xl font-bold">${totalCost.toFixed(4)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Main Testing Area */}
        <div className="space-y-4">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">Prompt to Test</CardTitle>
              <CardDescription>Enter the prompt you want to test across multiple models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt Text *</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your prompt here..."
                  className="min-h-[150px] font-mono text-sm"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="testInput">Test Input (Optional)</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.hash = '#dashboard/seller/test-scenarios'}
                    className="text-xs h-7 gap-1"
                  >
                    <FlaskConical className="h-3 w-3" />
                    Load from Scenarios
                  </Button>
                </div>
                <Input
                  id="testInput"
                  placeholder="Input to test with the prompt..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Model Selection */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">Select Models</CardTitle>
              <CardDescription>Choose which AI models to test your prompt against</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedModels.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Models ({selectedModels.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedModels.map((model, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-2">
                        {AI_PROVIDERS[model.providerId].name} - {model.model}
                        <button
                          onClick={() => handleRemoveModel(idx)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Available Models</Label>
                <Select
                  onValueChange={(value) => {
                    const [providerId, model] = value.split('::')
                    handleAddModel(providerId as AIProvider, model)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((m, idx) => (
                      <SelectItem key={idx} value={`${m.providerId}::${m.model}`}>
                        {m.providerName} - {m.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {recommendations.length > 0 && (
                <div className="space-y-2">
                  <Label>Recommended Models</Label>
                  <div className="space-y-2">
                    {recommendations.slice(0, 3).map((rec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded border bg-muted/50"
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {AI_PROVIDERS[rec.providerId].name} - {rec.model}
                          </div>
                          <div className="text-xs text-muted-foreground">{rec.reason}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddModel(rec.providerId, rec.model)}
                          disabled={selectedModels.some(m => m.providerId === rec.providerId && m.model === rec.model)}
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={handleRunTests}
                  disabled={isRunning || selectedModels.length === 0 || !promptText.trim()}
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Tests ({selectedModels.length})
                    </>
                  )}
                </Button>
                {selectedModels.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Select at least one model to run tests
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          {testRuns.length > 0 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Test Results</CardTitle>
                <CardDescription>
                  {completedRuns.length} completed, {failedRuns.length} failed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {testRuns.map((run) => (
                    <motion.div
                      key={run.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-2 rounded-lg p-4 space-y-3 bg-card hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {AI_PROVIDERS[run.providerId].name} - {run.model}
                            {run.status === 'completed' && (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Passed
                              </Badge>
                            )}
                            {run.status === 'failed' && (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                            {run.status === 'running' && (
                              <Badge variant="secondary">
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Running
                              </Badge>
                            )}
                          </div>
                          {run.metrics && (
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Timer className="h-3 w-3" />
                                {run.metrics.latency}ms
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                ${run.metrics.cost?.toFixed(4)}
                              </span>
                              {run.metrics.tokensUsed && (
                                <span>{run.metrics.tokensUsed} tokens</span>
                              )}
                              {run.metrics.qualityScore && (
                                <span className="flex items-center gap-1">
                                  <BarChart3 className="h-3 w-3" />
                                  {Math.round(run.metrics.qualityScore * 100)}% quality
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {run.output && (
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold">Output</Label>
                          <div className="p-3 bg-muted/50 rounded-lg border font-mono text-sm max-h-[200px] overflow-auto">
                            {run.output}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(run.output || '')
                                toast({ title: 'Copied to clipboard' })
                              }}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy Output
                            </Button>
                          </div>
                        </div>
                      )}

                      {run.error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                          <div className="flex items-center gap-2 font-semibold mb-1">
                            <XCircle className="h-4 w-4" />
                            Error
                          </div>
                          {run.error}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          {testRuns.length > 0 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Test Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Tests</span>
                    <span className="font-semibold">{testRuns.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Passed</span>
                    <span className="font-semibold text-green-600">{completedRuns.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Failed</span>
                    <span className="font-semibold text-red-600">{failedRuns.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Latency</span>
                    <span className="font-semibold flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {avgLatency}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Cost</span>
                    <span className="font-semibold flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ${totalCost.toFixed(4)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.hash = '#dashboard/seller/prompt-studio'}
              >
                <Zap className="h-4 w-4 mr-2" />
                Create New Prompt
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.hash = '#dashboard/seller/test-scenarios'}
              >
                <FlaskConical className="h-4 w-4 mr-2" />
                Test Scenarios
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.hash = '#dashboard/seller/test-history'}
              >
                <History className="h-4 w-4 mr-2" />
                Test History
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.hash = '#dashboard/seller/integrations'}
              >
                <FlaskConical className="h-4 w-4 mr-2" />
                Manage Integrations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

