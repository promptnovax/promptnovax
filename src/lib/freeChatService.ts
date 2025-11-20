const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787'

export type FreeChatRole = 'user' | 'assistant' | 'system'

export interface FreeChatMessage {
  role: FreeChatRole
  content: string
}

export interface FreeChatRequest {
  messages: FreeChatMessage[]
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  tone?: string
}

export interface FreeChatResponse {
  success: boolean
  message: string
  metadata?: {
    provider?: string
    model?: string
    latencyMs?: number
    cached?: boolean
    tokens?: {
      prompt: number
      completion: number
      total: number
    }
  }
}

export async function requestFreeChatResponse(payload: FreeChatRequest): Promise<FreeChatResponse> {
  const response = await fetch(`${BACKEND_URL}/api/chat/free`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const data = await response.json()

  if (!response.ok || !data?.success) {
    throw new Error(data?.error || 'Unable to reach free chat model')
  }

  return data as FreeChatResponse
}

