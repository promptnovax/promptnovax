/**
 * Code Generator for API Studio
 * Generates code snippets for different providers and formats
 */

import { AIProvider, AI_PROVIDERS } from './integrations/aiProviders'

export type CodeFormat = 'javascript' | 'python' | 'curl' | 'typescript' | 'nodejs'

export interface PromptConfig {
  provider: AIProvider
  model: string
  apiKey?: string
  systemPrompt?: string
  userPrompt: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
  // Image specific
  size?: string
  quality?: string
  style?: string
  // Video specific
  duration?: number
  aspectRatio?: string
}

/**
 * Generate code for OpenAI
 */
function generateOpenAICode(config: PromptConfig, format: CodeFormat): string {
  const { model, apiKey, systemPrompt, userPrompt, temperature, maxTokens, topP, frequencyPenalty, presencePenalty, stop, size, quality, style } = config

  const isImage = model.includes('dall-e')
  const isChat = model.includes('gpt') || model.includes('chat')

  if (isImage) {
    return generateOpenAIImageCode(config, format)
  }

  if (isChat) {
    const messages = []
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }
    messages.push({ role: 'user', content: userPrompt })

    const params: any = {
      model,
      messages
    }
    if (temperature !== undefined) params.temperature = temperature
    if (maxTokens !== undefined) params.max_tokens = maxTokens
    if (topP !== undefined) params.top_p = topP
    if (frequencyPenalty !== undefined) params.frequency_penalty = frequencyPenalty
    if (presencePenalty !== undefined) params.presence_penalty = presencePenalty
    if (stop && stop.length > 0) params.stop = stop

    switch (format) {
      case 'javascript':
        return `const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey || 'YOUR_API_KEY'}'
  },
  body: JSON.stringify(${JSON.stringify(params, null, 2)})
})

const data = await response.json()
console.log(data.choices[0].message.content)`

      case 'python':
        return `import openai

client = openai.OpenAI(api_key="${apiKey || 'YOUR_API_KEY'}")

response = client.chat.completions.create(
${Object.entries(params).map(([k, v]) => `    ${k}=${typeof v === 'string' ? JSON.stringify(v) : v}`).join(',\n')}
)

print(response.choices[0].message.content)`

      case 'curl':
        return `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -d '${JSON.stringify(params)}'`

      case 'typescript':
        return `interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`
  },
  body: JSON.stringify(${JSON.stringify(params, null, 2)})
})

const data = await response.json() as { choices: Array<{ message: Message }> }
console.log(data.choices[0].message.content)`

      case 'nodejs':
        return `const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const completion = await openai.chat.completions.create(${JSON.stringify(params, null, 2)})

console.log(completion.choices[0].message.content)`

      default:
        return ''
    }
  }

  return ''
}

function generateOpenAIImageCode(config: PromptConfig, format: CodeFormat): string {
  const { apiKey, userPrompt, size, quality, style } = config

  const params: any = {
    prompt: userPrompt,
    n: 1
  }
  if (size) params.size = size
  if (quality) params.quality = quality
  if (style) params.style = style

  switch (format) {
    case 'javascript':
      return `const response = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey || 'YOUR_API_KEY'}'
  },
  body: JSON.stringify(${JSON.stringify(params, null, 2)})
})

const data = await response.json()
console.log(data.data[0].url)`

    case 'python':
      return `import openai

client = openai.OpenAI(api_key="${apiKey || 'YOUR_API_KEY'}")

response = client.images.generate(
${Object.entries(params).map(([k, v]) => `    ${k}=${typeof v === 'string' ? JSON.stringify(v) : v}`).join(',\n')}
)

print(response.data[0].url)`

    case 'curl':
      return `curl https://api.openai.com/v1/images/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -d '${JSON.stringify(params)}'`

    default:
      return generateOpenAICode(config, format)
  }
}

/**
 * Generate code for Anthropic Claude
 */
function generateAnthropicCode(config: PromptConfig, format: CodeFormat): string {
  const { model, apiKey, systemPrompt, userPrompt, temperature, maxTokens, topP, stop } = config

  const messages = [{ role: 'user', content: userPrompt }]
  const params: any = {
    model,
    max_tokens: maxTokens || 1024,
    messages
  }
  if (systemPrompt) params.system = systemPrompt
  if (temperature !== undefined) params.temperature = temperature
  if (topP !== undefined) params.top_p = topP
  if (stop && stop.length > 0) params.stop_sequences = stop

  switch (format) {
    case 'javascript':
      return `const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '${apiKey || 'YOUR_API_KEY'}',
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify(${JSON.stringify(params, null, 2)})
})

const data = await response.json()
console.log(data.content[0].text)`

    case 'python':
      return `from anthropic import Anthropic

client = Anthropic(api_key="${apiKey || 'YOUR_API_KEY'}")

message = client.messages.create(
${Object.entries(params).map(([k, v]) => `    ${k}=${typeof v === 'string' ? JSON.stringify(v) : v}`).join(',\n')}
)

print(message.content[0].text)`

    case 'curl':
      return `curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey || 'YOUR_API_KEY'}" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '${JSON.stringify(params)}'`

    case 'typescript':
      return `const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY!,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify(${JSON.stringify(params, null, 2)})
})

const data = await response.json() as { content: Array<{ text: string }> }
console.log(data.content[0].text)`

    case 'nodejs':
      return `const Anthropic = require('@anthropic-ai/sdk')

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const message = await anthropic.messages.create(${JSON.stringify(params, null, 2)})

console.log(message.content[0].text)`

    default:
      return ''
  }
}

/**
 * Generate code for Google Gemini
 */
function generateGoogleCode(config: PromptConfig, format: CodeFormat): string {
  const { model, apiKey, systemPrompt, userPrompt, temperature, maxTokens, topP, stop } = config

  const parts = [{ text: userPrompt }]
  const params: any = {
    contents: [{ parts, role: 'user' }]
  }
  if (systemPrompt) {
    params.systemInstruction = { parts: [{ text: systemPrompt }] }
  }
  if (temperature !== undefined) params.temperature = temperature
  if (maxTokens !== undefined) params.maxOutputTokens = maxTokens
  if (topP !== undefined) params.topP = topP
  if (stop && stop.length > 0) params.stopSequences = stop

  switch (format) {
    case 'javascript':
      return `const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey || 'YOUR_API_KEY'}\`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(${JSON.stringify(params, null, 2)})
})

const data = await response.json()
console.log(data.candidates[0].content.parts[0].text)`

    case 'python':
      return `import google.generativeai as genai

genai.configure(api_key="${apiKey || 'YOUR_API_KEY'}")

model = genai.GenerativeModel('${model}')
response = model.generate_content(
${Object.entries(params).map(([k, v]) => `    ${k}=${typeof v === 'string' ? JSON.stringify(v) : v}`).join(',\n')}
)

print(response.text)`

    case 'curl':
      return `curl "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(params)}'`

    default:
      return ''
  }
}

/**
 * Generate code for Stability AI (SDXL)
 */
function generateStabilityCode(config: PromptConfig, format: CodeFormat): string {
  const { apiKey, userPrompt, size, aspectRatio } = config

  const params: any = {
    text_prompts: [{ text: userPrompt }],
    cfg_scale: 7,
    steps: 30
  }
  if (size) {
    const [width, height] = size.split('x').map(Number)
    params.width = width
    params.height = height
  }

  switch (format) {
    case 'javascript':
      return `const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey || 'YOUR_API_KEY'}'
  },
  body: JSON.stringify(${JSON.stringify(params, null, 2)})
})

const data = await response.json()
console.log(data.artifacts[0].base64)`

    case 'python':
      return `import requests

response = requests.post(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    headers={
        'Authorization': f'Bearer ${apiKey || 'YOUR_API_KEY'}',
        'Content-Type': 'application/json'
    },
    json=${JSON.stringify(params, null, 2)}
)

data = response.json()
print(data['artifacts'][0]['base64'])`

    case 'curl':
      return `curl https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -d '${JSON.stringify(params)}'`

    default:
      return ''
  }
}

/**
 * Generate code for Runway (Video)
 */
function generateRunwayCode(config: PromptConfig, format: CodeFormat): string {
  const { apiKey, userPrompt, duration, aspectRatio } = config

  const params: any = {
    prompt: userPrompt
  }
  if (duration) params.duration = duration
  if (aspectRatio) params.aspect_ratio = aspectRatio

  switch (format) {
    case 'javascript':
      return `const response = await fetch('https://api.runwayml.com/v1/image-to-video', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey || 'YOUR_API_KEY'}'
  },
  body: JSON.stringify(${JSON.stringify(params, null, 2)})
})

const data = await response.json()
console.log(data.video_url)`

    case 'python':
      return `import requests

response = requests.post(
    'https://api.runwayml.com/v1/image-to-video',
    headers={
        'Authorization': f'Bearer ${apiKey || 'YOUR_API_KEY'}',
        'Content-Type': 'application/json'
    },
    json=${JSON.stringify(params, null, 2)}
)

data = response.json()
print(data['video_url'])`

    case 'curl':
      return `curl https://api.runwayml.com/v1/image-to-video \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -d '${JSON.stringify(params)}'`

    default:
      return ''
  }
}

/**
 * Main code generator function
 */
export function generateCode(config: PromptConfig, format: CodeFormat = 'javascript'): string {
  switch (config.provider) {
    case 'openai':
      return generateOpenAICode(config, format)
    case 'anthropic':
      return generateAnthropicCode(config, format)
    case 'google':
      return generateGoogleCode(config, format)
    case 'stability':
      return generateStabilityCode(config, format)
    case 'replicate':
      // Runway-like for now
      return generateRunwayCode(config, format)
    default:
      // Generic fallback
      return generateOpenAICode(config, format)
  }
}

/**
 * Get available models for a provider
 */
export function getProviderModels(provider: AIProvider): string[] {
  return AI_PROVIDERS[provider]?.models || []
}

/**
 * Get supported formats for a provider
 */
export function getSupportedFormats(provider: AIProvider): CodeFormat[] {
  return ['javascript', 'python', 'curl', 'typescript', 'nodejs']
}

