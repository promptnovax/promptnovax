/**
 * API Studio Service
 * Handles API calls to execute prompts
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787'

export interface ExecutePromptParams {
  provider: string
  model: string
  apiKey: string
  systemPrompt?: string
  userPrompt: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
  size?: string
  quality?: string
  style?: string
  duration?: number
  aspectRatio?: string
}

export interface ExecutePromptResponse {
  success: boolean
  data?: any
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
  type?: 'text' | 'image' | 'video'
  error?: string
  metadata?: {
    provider?: string
    model?: string
    responseTime?: number
    cost?: string
    cached?: boolean
  }
  cached?: boolean
}

/**
 * Execute a prompt via the backend API
 */
export async function executePrompt(
  params: ExecutePromptParams
): Promise<ExecutePromptResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/studio/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to execute prompt'
      }
    }

    return data
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    }
  }
}

