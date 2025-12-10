/**
 * API Studio Service
 * Handles API calls to execute prompts
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787'

export interface WorkflowStagePayload {
  id: string
  label: string
  type: 'text' | 'image' | 'video' | 'chat'
  runtime?: string
}

export interface StageResult {
  id: string
  status: 'completed' | 'skipped' | 'failed'
  summary: string
  details?: string
  outputType?: 'text' | 'image' | 'video'
  payload?: any
}

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
  workflowStages?: WorkflowStagePayload[]
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
  stageResults?: StageResult[]
  assets?: {
    images?: string[]
    videos?: string[]
    [key: string]: any
  }
}

/**
 * Check if backend server is running
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout
    
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-cache'
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      return false
    }
    
    // Verify it's actually the backend by checking response structure
    try {
      const data = await response.json()
      return data.status === 'ok' || data.status === 'OK'
    } catch {
      return response.ok
    }
  } catch (error: any) {
    // Only return false for actual connection errors, not CORS or other issues
    if (error.name === 'AbortError' || error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
      return false
    }
    // For other errors (like CORS), assume backend might be running but check failed
    // We'll let the actual API call determine if it's really down
    return true
  }
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
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(120000) // 2 minute timeout
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      return {
        success: false,
        error: errorData.error || `Server returned ${response.status}: ${response.statusText}`
      }
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timed out. The backend server may be slow or unresponsive.'
      }
    }
    
    if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED') || error.message?.includes('NetworkError')) {
      // Try to verify if backend is actually down by checking health endpoint
      const healthCheck = await checkBackendHealth().catch(() => false)
      
      if (!healthCheck) {
        return {
          success: false,
          error: `Backend server is not running.\n\nQuick Fix:\n1. Open terminal in PNX-main folder\n2. Run: npm run server\n\nOr run both frontend + backend:\nnpm run dev:full\n\nThen refresh this page and try again.`
        }
      }
      
      // If health check passes but API call fails, it might be a different issue
      return {
        success: false,
        error: `Connection error. Backend is reachable but API call failed. Please try again.`
      }
    }

    return {
      success: false,
      error: error.message || 'Network error occurred'
    }
  }
}

