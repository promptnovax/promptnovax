/**
 * Request validators
 */

const SUPPORTED_PROVIDERS = ['openai', 'anthropic', 'google', 'openrouter', 'stability', 'replicate']
const ALLOWED_WORKFLOW_STAGE_IDS = ['briefing', 'generation', 'image', 'chat-loop', 'video']

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateExecuteRequest(body: any): ValidationResult {
  const errors: string[] = []

  if (!body.provider) {
    errors.push('Provider is required')
  } else if (!SUPPORTED_PROVIDERS.includes(body.provider)) {
    errors.push('Invalid provider')
  }

  if (!body.model || typeof body.model !== 'string') {
    errors.push('Model is required')
  }

  if (!body.apiKey || typeof body.apiKey !== 'string') {
    errors.push('API key is required')
  } else if (body.apiKey.length < 10) {
    errors.push('API key is too short')
  }

  if (!body.userPrompt || typeof body.userPrompt !== 'string') {
    errors.push('User prompt is required')
  } else if (body.userPrompt.length > 100000) {
    errors.push('User prompt is too long (max 100,000 characters)')
  }

  if (body.systemPrompt && body.systemPrompt.length > 50000) {
    errors.push('System prompt is too long (max 50,000 characters)')
  }

  if (body.temperature !== undefined) {
    if (typeof body.temperature !== 'number' || body.temperature < 0 || body.temperature > 2) {
      errors.push('Temperature must be between 0 and 2')
    }
  }

  if (body.maxTokens !== undefined) {
    if (typeof body.maxTokens !== 'number' || body.maxTokens < 1 || body.maxTokens > 100000) {
      errors.push('Max tokens must be between 1 and 100,000')
    }
  }

  if (body.topP !== undefined) {
    if (typeof body.topP !== 'number' || body.topP < 0 || body.topP > 1) {
      errors.push('Top P must be between 0 and 1')
    }
  }

  if (body.workflowStages !== undefined) {
    if (!Array.isArray(body.workflowStages)) {
      errors.push('workflowStages must be an array')
    } else if (body.workflowStages.length > 10) {
      errors.push('workflowStages cannot exceed 10 entries')
    } else {
      for (const stage of body.workflowStages) {
        if (!stage || typeof stage !== 'object') {
          errors.push('Invalid workflow stage payload')
          break
        }
        if (!stage.id || typeof stage.id !== 'string') {
          errors.push('workflowStages entries require an id')
          break
        }
        if (!ALLOWED_WORKFLOW_STAGE_IDS.includes(stage.id)) {
          errors.push(`Workflow stage ${stage.id} is not supported`)
          break
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

