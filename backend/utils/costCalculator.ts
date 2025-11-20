/**
 * Cost calculator for different providers
 */

interface Pricing {
  inputPer1k?: number
  outputPer1k?: number
  imagePer1?: number
}

const PRICING: Record<string, Pricing> = {
  'openai': {
    'gpt-4-turbo': { inputPer1k: 0.01, outputPer1k: 0.03 },
    'gpt-4': { inputPer1k: 0.03, outputPer1k: 0.06 },
    'gpt-3.5-turbo': { inputPer1k: 0.0015, outputPer1k: 0.002 },
    'dall-e-3': { imagePer1: 0.04 },
    'dall-e-2': { imagePer1: 0.02 }
  },
  'anthropic': {
    'claude-3-opus-20240229': { inputPer1k: 0.015, outputPer1k: 0.075 },
    'claude-3-sonnet-20240229': { inputPer1k: 0.003, outputPer1k: 0.015 },
    'claude-3-haiku-20240307': { inputPer1k: 0.00025, outputPer1k: 0.00125 }
  },
  'google': {
    'gemini-pro': { inputPer1k: 0.0005, outputPer1k: 0.0015 },
    'gemini-pro-vision': { inputPer1k: 0.0005, outputPer1k: 0.0015 }
  },
  'openrouter': {
    // Average pricing
    'default': { inputPer1k: 0.0005, outputPer1k: 0.0015 }
  }
}

export function calculateCost(
  provider: string,
  model: string,
  usage: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number },
  type: 'text' | 'image' | 'video' = 'text'
): number {
  if (type === 'image') {
    const pricing = PRICING[provider]?.[model] || PRICING[provider]?.['default']
    return pricing?.imagePer1 || 0
  }

  const pricing = PRICING[provider]?.[model] || PRICING[provider]?.['default'] || PRICING['openrouter']['default']
  
  if (!pricing) return 0

  const inputTokens = usage.prompt_tokens || 0
  const outputTokens = usage.completion_tokens || 0

  const inputCost = (inputTokens / 1000) * (pricing.inputPer1k || 0)
  const outputCost = (outputTokens / 1000) * (pricing.outputPer1k || 0)

  return inputCost + outputCost
}

export function formatCost(cost: number): string {
  if (cost < 0.001) {
    return `$${(cost * 1000).toFixed(3)}¢`
  }
  return `$${cost.toFixed(4)}`
}

