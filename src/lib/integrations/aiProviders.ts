/**
 * AI Provider Integration Service
 * Supports multiple AI providers: OpenRouter, OpenAI, Anthropic, Hugging Face, etc.
 */

export type AIProvider = 
  | 'openai'
  | 'anthropic'
  | 'openrouter'
  | 'huggingface'
  | 'mistral'
  | 'google'
  | 'cohere'
  | 'stability'
  | 'midjourney'
  | 'replicate'

export interface AIProviderConfig {
  id: AIProvider
  name: string
  description: string
  icon?: string
  website: string
  apiKeyUrl: string
  models: string[]
  supports: {
    text: boolean
    image: boolean
    code: boolean
    chat: boolean
  }
  pricing?: {
    perToken?: number
    perImage?: number
    notes?: string
  }
}

export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o, GPT-4o Mini, GPT-3.5, DALL·E, Whisper',
    website: 'https://platform.openai.com',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'dall-e-3', 'dall-e-2', 'whisper-1'],
    supports: { text: true, image: true, code: true, chat: true },
    pricing: {
      perToken: 0.00001,
      perImage: 0.04,
      notes: 'Varies by model'
    }
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 3 Opus, Sonnet, Haiku',
    website: 'https://www.anthropic.com',
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    supports: { text: true, image: false, code: true, chat: true },
    pricing: {
      perToken: 0.000015,
      notes: 'Varies by model tier'
    }
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Unified API for 100+ models',
    website: 'https://openrouter.ai',
    apiKeyUrl: 'https://openrouter.ai/keys',
    models: ['gpt-4', 'claude-3-opus', 'llama-2-70b', 'mistral-7b', 'palm-2'],
    supports: { text: true, image: true, code: true, chat: true },
    pricing: {
      perToken: 0.000008,
      notes: 'Aggregated pricing across providers'
    }
  },
  huggingface: {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Open-source models & Inference API',
    website: 'https://huggingface.co',
    apiKeyUrl: 'https://huggingface.co/settings/tokens',
    models: ['meta-llama/Llama-2-70b-chat-hf', 'mistralai/Mistral-7B-Instruct-v0.1', 'stabilityai/stable-diffusion-xl-base-1.0'],
    supports: { text: true, image: true, code: true, chat: true },
    pricing: {
      perToken: 0.000005,
      notes: 'Free tier available, pay-per-use'
    }
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'Mistral 7B, Mixtral 8x7B',
    website: 'https://mistral.ai',
    apiKeyUrl: 'https://console.mistral.ai/api-keys/',
    models: ['mistral-large', 'mistral-medium', 'mistral-small', 'mixtral-8x7b'],
    supports: { text: true, image: false, code: true, chat: true },
    pricing: {
      perToken: 0.000007,
    }
  },
  google: {
    id: 'google',
    name: 'Google AI',
    description: 'Gemini Pro, PaLM 2',
    website: 'https://ai.google.dev',
    apiKeyUrl: 'https://makersuite.google.com/app/apikey',
    models: ['gemini-pro', 'gemini-pro-vision', 'palm-2'],
    supports: { text: true, image: true, code: true, chat: true },
    pricing: {
      perToken: 0.000002,
      notes: 'Generous free tier'
    }
  },
  cohere: {
    id: 'cohere',
    name: 'Cohere',
    description: 'Command, Embed, Classify',
    website: 'https://cohere.com',
    apiKeyUrl: 'https://dashboard.cohere.com/api-keys',
    models: ['command', 'command-light', 'embed-english-v3.0'],
    supports: { text: true, image: false, code: false, chat: true },
    pricing: {
      perToken: 0.00001,
    }
  },
  stability: {
    id: 'stability',
    name: 'Stability AI',
    description: 'Stable Diffusion, StableLM',
    website: 'https://stability.ai',
    apiKeyUrl: 'https://platform.stability.ai/account/keys',
    models: ['stable-diffusion-xl-1024-v1-0', 'stable-diffusion-v1-6', 'stablelm-tuned-alpha-7b'],
    supports: { text: true, image: true, code: false, chat: true },
    pricing: {
      perImage: 0.02,
      notes: 'Per image generation'
    }
  },
  midjourney: {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'AI image generation',
    website: 'https://www.midjourney.com',
    apiKeyUrl: 'https://www.midjourney.com/account',
    models: ['midjourney-v6', 'midjourney-v5'],
    supports: { text: false, image: true, code: false, chat: false },
    pricing: {
      perImage: 0.05,
      notes: 'Subscription-based'
    }
  },
  replicate: {
    id: 'replicate',
    name: 'Replicate',
    description: 'Run open-source models',
    website: 'https://replicate.com',
    apiKeyUrl: 'https://replicate.com/account/api-tokens',
    models: ['llama-2-70b', 'stable-diffusion', 'whisper'],
    supports: { text: true, image: true, code: true, chat: true },
    pricing: {
      perToken: 0.00001,
      notes: 'Pay-per-second of compute'
    }
  }
}

export interface IntegrationCredentials {
  providerId: AIProvider
  apiKey: string
  label?: string
  isActive: boolean
  createdAt: string
  lastUsed?: string
}

export interface ModelRecommendation {
  providerId: AIProvider
  model: string
  reason: string
  confidence: number
  estimatedCost?: number
}

/**
 * Recommend AI models based on prompt characteristics
 */
export function recommendModels(
  promptType: 'text' | 'image' | 'code' | 'chat',
  complexity: 'simple' | 'medium' | 'complex',
  budget: 'free' | 'low' | 'medium' | 'high'
): ModelRecommendation[] {
  const recommendations: ModelRecommendation[] = []

  // Filter providers that support the prompt type
  const supportedProviders = Object.values(AI_PROVIDERS).filter(
    p => p.supports[promptType]
  )

  for (const provider of supportedProviders) {
    // Budget filtering
    if (budget === 'free' && provider.id !== 'google' && provider.id !== 'huggingface') {
      continue
    }

    // Complexity-based model selection
    let recommendedModel = provider.models[0]
    if (complexity === 'complex' && provider.models.length > 1) {
      recommendedModel = provider.models.find(m => m.includes('4') || m.includes('opus') || m.includes('large')) || provider.models[0]
    } else if (complexity === 'simple' && provider.models.length > 1) {
      recommendedModel = provider.models.find(m => m.includes('light') || m.includes('small') || m.includes('haiku')) || provider.models[0]
    }

    recommendations.push({
      providerId: provider.id,
      model: recommendedModel,
      reason: getRecommendationReason(provider, promptType, complexity, budget),
      confidence: calculateConfidence(provider, promptType, complexity, budget),
      estimatedCost: provider.pricing?.perToken || provider.pricing?.perImage
    })
  }

  // Sort by confidence
  return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 5)
}

function getRecommendationReason(
  provider: AIProviderConfig,
  promptType: string,
  complexity: string,
  budget: string
): string {
  if (provider.id === 'openrouter') {
    return 'Best for trying multiple models with one API key'
  }
  if (provider.id === 'openai' && complexity === 'complex') {
    return 'GPT-4 Turbo excels at complex reasoning tasks'
  }
  if (provider.id === 'anthropic' && promptType === 'chat') {
    return 'Claude has excellent conversation capabilities'
  }
  if (provider.id === 'google' && budget === 'free') {
    return 'Generous free tier, great for testing'
  }
  return `${provider.name} is well-suited for ${promptType} prompts`
}

function calculateConfidence(
  provider: AIProviderConfig,
  promptType: string,
  complexity: string,
  budget: string
): number {
  let confidence = 0.5

  // Provider reputation
  if (['openai', 'anthropic'].includes(provider.id)) confidence += 0.2
  if (provider.id === 'openrouter') confidence += 0.15

  // Budget match
  if (budget === 'free' && ['google', 'huggingface'].includes(provider.id)) confidence += 0.2
  if (budget !== 'free' && !['google', 'huggingface'].includes(provider.id)) confidence += 0.1

  // Complexity match
  if (complexity === 'complex' && provider.models.some(m => m.includes('4') || m.includes('opus'))) {
    confidence += 0.15
  }

  return Math.min(confidence, 1.0)
}

