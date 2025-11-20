import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plug, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Key, 
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  Shield,
  Zap
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { AI_PROVIDERS, AIProvider, IntegrationCredentials } from '@/lib/integrations/aiProviders'
import { 
  loadIntegrations, 
  upsertIntegration, 
  removeIntegration, 
  validateApiKey, 
  testApiKey 
} from '@/lib/integrations/integrationService'

export function SellerIntegrationsPage() {
  const { toast } = useToast()
  const [integrations, setIntegrations] = useState<Record<string, IntegrationCredentials>>({})
  const [loading, setLoading] = useState(true)
  const [testingKey, setTestingKey] = useState<string | null>(null)

  useEffect(() => {
    const loaded = loadIntegrations()
    setIntegrations(loaded)
    setLoading(false)
  }, [])

  const handleAddIntegration = async (providerId: AIProvider, apiKey: string, label?: string) => {
    const validation = validateApiKey(providerId, apiKey)
    if (!validation.valid) {
      toast({
        title: 'Invalid API Key',
        description: validation.error,
        variant: 'destructive'
      })
      return
    }

    setTestingKey(providerId)
    const testResult = await testApiKey(providerId, apiKey)
    setTestingKey(null)

    if (!testResult.success) {
      toast({
        title: 'API Key Test Failed',
        description: testResult.error || 'Could not verify API key',
        variant: 'destructive'
      })
      return
    }

    const newIntegration: IntegrationCredentials = {
      providerId,
      apiKey,
      label,
      isActive: true,
      createdAt: new Date().toISOString()
    }

    upsertIntegration(newIntegration)
    setIntegrations(prev => ({ ...prev, [providerId]: newIntegration }))

    toast({
      title: 'Integration Added',
      description: `Successfully connected to ${AI_PROVIDERS[providerId].name}`
    })
  }

  const handleRemoveIntegration = (providerId: AIProvider) => {
    removeIntegration(providerId)
    const updated = { ...integrations }
    delete updated[providerId]
    setIntegrations(updated)
    toast({
      title: 'Integration Removed',
      description: `Disconnected from ${AI_PROVIDERS[providerId].name}`
    })
  }

  const handleToggleActive = (providerId: AIProvider) => {
    const integration = integrations[providerId]
    if (!integration) return

    const updated: IntegrationCredentials = {
      ...integration,
      isActive: !integration.isActive
    }
    upsertIntegration(updated)
    setIntegrations(prev => ({ ...prev, [providerId]: updated }))
  }

  const connectedProviders = Object.keys(integrations)
  const availableProviders = Object.values(AI_PROVIDERS)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Plug className="h-8 w-8 text-primary" />
            AI Integrations
          </h2>
          <p className="text-muted-foreground mt-2">
            Connect your API keys to test prompts across multiple AI providers
          </p>
        </div>
      </div>

      <Tabs defaultValue="connected" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connected">
            Connected ({connectedProviders.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available Providers ({availableProviders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          {connectedProviders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Plug className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Integrations Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Connect your first AI provider to start testing prompts
                </p>
                <Button onClick={() => {
                  const tabs = document.querySelector('[role="tablist"]') as HTMLElement
                  const availableTab = tabs?.querySelector('[value="available"]') as HTMLElement
                  availableTab?.click()
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Providers
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {connectedProviders.map(providerId => {
                const integration = integrations[providerId]
                const provider = AI_PROVIDERS[providerId as AIProvider]
                if (!provider || !integration) return null

                return (
                  <Card key={providerId} className={integration.isActive ? '' : 'opacity-60'}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {provider.name}
                            {integration.isActive ? (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {provider.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {integration.label && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Label</Label>
                          <p className="text-sm font-medium">{integration.label}</p>
                        </div>
                      )}
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">API Key</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Key className="h-4 w-4 text-muted-foreground" />
                          <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                            {integration.apiKey.substring(0, 12)}...
                          </code>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleToggleActive(providerId as AIProvider)}
                        >
                          {integration.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveIntegration(providerId as AIProvider)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {integration.lastUsed && (
                        <p className="text-xs text-muted-foreground">
                          Last used: {new Date(integration.lastUsed).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableProviders.map(provider => {
              const isConnected = integrations[provider.id]
              const isTesting = testingKey === provider.id

              return (
                <Card key={provider.id} className={isConnected ? 'border-primary' : ''}>
                  <CardHeader>
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <CardDescription>{provider.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Supported Features</Label>
                      <div className="flex flex-wrap gap-2">
                        {provider.supports.text && <Badge variant="outline">Text</Badge>}
                        {provider.supports.image && <Badge variant="outline">Image</Badge>}
                        {provider.supports.code && <Badge variant="outline">Code</Badge>}
                        {provider.supports.chat && <Badge variant="outline">Chat</Badge>}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Available Models</Label>
                      <div className="text-xs text-muted-foreground">
                        {provider.models.slice(0, 3).join(', ')}
                        {provider.models.length > 3 && ` +${provider.models.length - 3} more`}
                      </div>
                    </div>

                    {provider.pricing && (
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Pricing</Label>
                        <div className="text-xs text-muted-foreground">
                          {provider.pricing.perToken && `~$${(provider.pricing.perToken * 1000).toFixed(4)}/1K tokens`}
                          {provider.pricing.perImage && ` ~$${provider.pricing.perImage}/image`}
                          {provider.pricing.notes && (
                            <p className="mt-1 italic">{provider.pricing.notes}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {isConnected ? (
                        <Button variant="outline" className="flex-1" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Connected
                        </Button>
                      ) : (
                        <AddIntegrationDialog
                          provider={provider}
                          onAdd={handleAddIntegration}
                          isTesting={isTesting}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(provider.website, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• API keys are stored locally in your browser and never shared</p>
          <p>• Keys are encrypted and only used for testing your prompts</p>
          <p>• You can revoke access at any time by removing integrations</p>
          <p>• We recommend using separate API keys for testing vs production</p>
        </CardContent>
      </Card>
    </div>
  )
}

interface AddIntegrationDialogProps {
  provider: typeof AI_PROVIDERS[AIProvider]
  onAdd: (providerId: AIProvider, apiKey: string, label?: string) => Promise<void>
  isTesting: boolean
}

function AddIntegrationDialog({ provider, onAdd, isTesting }: AddIntegrationDialogProps) {
  const [open, setOpen] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [label, setLabel] = useState('')

  const handleSubmit = async () => {
    if (!apiKey.trim()) return
    await onAdd(provider.id, apiKey.trim(), label.trim() || undefined)
    setOpen(false)
    setApiKey('')
    setLabel('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1" disabled={isTesting}>
          {isTesting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Connect
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect {provider.name}</DialogTitle>
          <DialogDescription>
            Add your API key to start testing prompts with {provider.name} models.
            <br />
            <a
              href={provider.apiKeyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1 mt-2"
            >
              Get API key <ExternalLink className="h-3 w-3" />
            </a>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label (Optional)</Label>
            <Input
              id="label"
              placeholder="e.g., Personal Key, Work Key"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key *</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder={`Enter your ${provider.name} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never shared
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!apiKey.trim() || isTesting}>
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Connect'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

