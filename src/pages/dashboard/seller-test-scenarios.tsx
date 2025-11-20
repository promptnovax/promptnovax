import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, FlaskConical, Plus, Trash2, Play, Save } from 'lucide-react'

interface TestScenario {
  id: string
  name: string
  input: string
  expectedOutput?: string
  description?: string
}

export function SellerTestScenariosPage() {
  const [scenarios, setScenarios] = useState<TestScenario[]>([
    {
      id: '1',
      name: 'Basic Test',
      input: 'Sample input text',
      description: 'Basic functionality test'
    }
  ])
  const [editingScenario, setEditingScenario] = useState<TestScenario | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSaveScenario = (scenario: TestScenario) => {
    if (scenario.id && scenarios.find(s => s.id === scenario.id)) {
      setScenarios(scenarios.map(s => s.id === scenario.id ? scenario : s))
    } else {
      setScenarios([...scenarios, { ...scenario, id: Date.now().toString() }])
    }
    setEditingScenario(null)
    setIsCreating(false)
  }

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id))
  }

  const handleRunScenario = (scenario: TestScenario) => {
    window.location.hash = `#dashboard/seller/testing?scenario=${scenario.id}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.hash = '#dashboard/seller/testing'}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Testing Lab
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
              <FlaskConical className="h-7 w-7 text-primary" />
              Test Scenarios
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage test scenarios for your prompts
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setIsCreating(true)
            setEditingScenario({
              id: '',
              name: '',
              input: '',
              expectedOutput: '',
              description: ''
            })
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Scenario
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingScenario) && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>{editingScenario?.id ? 'Edit Scenario' : 'Create New Scenario'}</CardTitle>
            <CardDescription>Define input and expected output for testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scenario-name">Scenario Name *</Label>
              <Input
                id="scenario-name"
                placeholder="e.g., Basic Functionality Test"
                value={editingScenario?.name || ''}
                onChange={(e) => setEditingScenario({ ...editingScenario!, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scenario-description">Description</Label>
              <Input
                id="scenario-description"
                placeholder="What does this scenario test?"
                value={editingScenario?.description || ''}
                onChange={(e) => setEditingScenario({ ...editingScenario!, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scenario-input">Test Input *</Label>
              <Textarea
                id="scenario-input"
                placeholder="Enter the input to test with..."
                className="min-h-[100px]"
                value={editingScenario?.input || ''}
                onChange={(e) => setEditingScenario({ ...editingScenario!, input: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scenario-output">Expected Output (Optional)</Label>
              <Textarea
                id="scenario-output"
                placeholder="What output do you expect?"
                className="min-h-[100px]"
                value={editingScenario?.expectedOutput || ''}
                onChange={(e) => setEditingScenario({ ...editingScenario!, expectedOutput: e.target.value })}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingScenario(null)
                  setIsCreating(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => editingScenario && handleSaveScenario(editingScenario)}
                disabled={!editingScenario?.name || !editingScenario?.input}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Scenario
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scenarios List */}
      <div className="grid gap-4">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{scenario.name}</CardTitle>
                  {scenario.description && (
                    <CardDescription className="mt-1">{scenario.description}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingScenario(scenario)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteScenario(scenario.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Test Input</Label>
                <div className="p-3 bg-muted/50 rounded-lg border font-mono text-sm">
                  {scenario.input}
                </div>
              </div>
              {scenario.expectedOutput && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Expected Output</Label>
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 font-mono text-sm">
                    {scenario.expectedOutput}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRunScenario(scenario)}
                  className="gap-2"
                >
                  <Play className="h-3 w-3" />
                  Run This Scenario
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {scenarios.length === 0 && !isCreating && (
        <Card className="border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FlaskConical className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">No test scenarios yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create scenarios to test your prompts systematically</p>
            <Button
              onClick={() => {
                setIsCreating(true)
                setEditingScenario({
                  id: '',
                  name: '',
                  input: '',
                  expectedOutput: '',
                  description: ''
                })
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create First Scenario
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

