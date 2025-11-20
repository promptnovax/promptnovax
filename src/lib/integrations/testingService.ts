/**
 * Testing Service
 * Handles prompt testing across multiple AI providers
 */

import { AIProvider, ModelRecommendation, recommendModels } from './aiProviders'
import { getActiveIntegrations, getIntegration } from './integrationService'

export interface TestRun {
  id: string
  promptId: string
  promptText: string
  providerId: AIProvider
  model: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  input?: string
  output?: string
  metrics?: {
    tokensUsed?: number
    cost?: number
    latency?: number
    qualityScore?: number
  }
  error?: string
  createdAt: string
  completedAt?: string
}

export interface TestScenario {
  id: string
  name: string
  input: string
  expectedOutput?: string
  category: 'simple' | 'edge-case' | 'complex'
}

/**
 * Create a test run
 */
export function createTestRun(
  promptId: string,
  promptText: string,
  providerId: AIProvider,
  model: string,
  input?: string
): TestRun {
  return {
    id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    promptId,
    promptText,
    providerId,
    model,
    status: 'queued',
    input,
    createdAt: new Date().toISOString()
  }
}

/**
 * Get recommended models for testing
 */
export function getRecommendedModelsForPrompt(
  promptText: string,
  promptType: 'text' | 'image' | 'code' | 'chat'
): ModelRecommendation[] {
  // Analyze prompt complexity
  const wordCount = promptText.split(/\s+/).length
  const complexity: 'simple' | 'medium' | 'complex' = 
    wordCount < 50 ? 'simple' : wordCount < 200 ? 'medium' : 'complex'

  // Check available integrations
  const activeIntegrations = getActiveIntegrations()
  const recommendations = recommendModels(promptType, complexity, 'medium')

  // Filter to only recommended models from active integrations
  return recommendations.filter(rec => 
    activeIntegrations.some(int => int.providerId === rec.providerId)
  )
}

/**
 * Execute a test run (simulated - in production this calls backend)
 */
export async function executeTestRun(run: TestRun): Promise<TestRun> {
  // In production, this would call your backend API
  // Backend would:
  // 1. Validate the API key
  // 2. Make request to the AI provider
  // 3. Calculate metrics
  // 4. Return results

  // Simulate execution
  run.status = 'running'
  
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Simulate output
  run.output = `[Simulated response from ${run.providerId}/${run.model}]\n\nThis is a test output for the prompt: "${run.promptText.substring(0, 50)}..."`
  run.status = 'completed'
  run.completedAt = new Date().toISOString()
  run.metrics = {
    tokensUsed: Math.floor(Math.random() * 1000) + 100,
    cost: Math.random() * 0.1,
    latency: Math.floor(Math.random() * 2000) + 500,
    qualityScore: Math.random() * 0.3 + 0.7 // 0.7-1.0
  }

  return run
}

/**
 * Batch test a prompt across multiple models
 */
export async function batchTestPrompt(
  promptId: string,
  promptText: string,
  models: Array<{ providerId: AIProvider; model: string }>,
  testInput?: string
): Promise<TestRun[]> {
  const runs = models.map(({ providerId, model }) =>
    createTestRun(promptId, promptText, providerId, model, testInput)
  )

  // Execute in parallel (with rate limiting in production)
  const results = await Promise.all(
    runs.map(run => executeTestRun(run))
  )

  return results
}

/**
 * Generate test scenarios for a prompt
 */
export function generateTestScenarios(promptText: string): TestScenario[] {
  return [
    {
      id: 'scenario_1',
      name: 'Standard Input',
      input: 'Test input for standard use case',
      category: 'simple'
    },
    {
      id: 'scenario_2',
      name: 'Edge Case',
      input: 'Extreme or unusual input to test robustness',
      category: 'edge-case'
    },
    {
      id: 'scenario_3',
      name: 'Complex Scenario',
      input: 'Multi-part complex input requiring detailed reasoning',
      category: 'complex'
    }
  ]
}

