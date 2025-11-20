export type PromptGeneratorMode = "generate" | "enhance"

export interface PromptGeneratorPayload {
  userInput: string
  promptType: string
  aiPlatform: string
  outputFormat: string
  language: string
  visualReference?: string
  referenceType?: string
  mode?: PromptGeneratorMode
  existingPrompt?: string
  disableCache?: boolean
}

export interface PromptGeneratorResponse {
  success: boolean
  prompt: string
  score: number | null
  metadata?: {
    provider?: string
    model?: string
    mode?: PromptGeneratorMode
    latencyMs?: number
    tokens?: {
      prompt: number
      completion: number
      total: number
    }
    cached?: boolean
    fallback?: boolean
    reason?: string
    category?: string
  }
}


