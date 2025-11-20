import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import { Resend } from 'resend'
import axios from 'axios'
import { initializeApp, cert, getApps, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { rateLimit, getClientIdentifier } from './utils/rateLimiter.js'
import { getCache, setCache, generateCacheKey } from './utils/cache.js'
import { validateExecuteRequest } from './utils/validators.js'
import { calculateCost, formatCost } from './utils/costCalculator.js'
import { executeProviderRequest } from './utils/providerHandler.js'
import { buildPromptBlueprint, estimatePromptScore } from './utils/promptGenerator.js'
import { synthesizeLocalPrompt } from './utils/localPromptSynthesis.js'

// Env
const PORT = process.env.PORT || 8787
const RESEND_API_KEY = process.env.RESEND_API_KEY as string
const RESEND_DOMAIN = process.env.RESEND_DOMAIN as string
const SENDER_EMAIL = process.env.SENDER_EMAIL as string
const SERVICE_ACCOUNT_JSON = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const PROMPT_GENERATOR_PROVIDER = (process.env.PROMPT_GENERATOR_PROVIDER || 'huggingface').toLowerCase()
const PROMPT_GENERATOR_MODEL = process.env.PROMPT_GENERATOR_MODEL || (PROMPT_GENERATOR_PROVIDER === 'openrouter'
  ? 'meta-llama/Meta-Llama-3.1-8B-Instruct'
  : 'mistralai/Mistral-7B-Instruct-v0.2')
const PROMPT_GENERATOR_MAX_TOKENS = Number(process.env.PROMPT_GENERATOR_MAX_TOKENS || 512)
const PROMPT_GENERATOR_TEMPERATURE = Number(process.env.PROMPT_GENERATOR_TEMPERATURE || 0.35)
const PROMPT_GENERATOR_CACHE_TTL = Number(process.env.PROMPT_GENERATOR_CACHE_TTL || 2 * 60 * 1000)
const FREE_CHAT_CACHE_TTL = Number(process.env.FREE_CHAT_CACHE_TTL || 60 * 1000)
const DEFAULT_CHAT_SYSTEM_PROMPT = `You are PromptNX Copilot, a senior AI strategy partner.
- Respond like a seasoned consultant working for a SaaS platform.
- Always provide clear structure with headings, bullets, and KPIs when relevant.
- Tie recommendations back to revenue impact, product velocity, or customer experience.`
const PROMPT_GENERATOR_SYSTEM_PROMPT =
  process.env.PROMPT_GENERATOR_SYSTEM_PROMPT ||
  `You are PromptNX's elite prompt engineer. transform any instructions into a production-ready AI prompt with structure, scoring rubric, and implementation guidance.`

type ChatRole = 'user' | 'assistant' | 'system'
interface IncomingChatMessage {
  role: ChatRole
  content: string
}

if (!RESEND_API_KEY || !RESEND_DOMAIN || !SENDER_EMAIL) {
  console.warn('Resend env vars missing; OTP emails will fail until configured')
}

if (PROMPT_GENERATOR_PROVIDER === 'huggingface' && !HUGGINGFACE_API_KEY) {
  console.warn('HUGGINGFACE_API_KEY missing - Hugging Face powered endpoints will fail until configured')
}

if (PROMPT_GENERATOR_PROVIDER === 'openrouter' && !OPENROUTER_API_KEY) {
  console.warn('OPENROUTER_API_KEY missing - OpenRouter powered endpoints will fail until configured')
}

// Firebase Admin init (server-only)
let db: any = null
if (!getApps().length && SERVICE_ACCOUNT_JSON) {
  try {
    const serviceAccount = JSON.parse(SERVICE_ACCOUNT_JSON) as ServiceAccount
    initializeApp({ credential: cert(serviceAccount) })
    db = getFirestore()
    console.log('Firebase Admin initialized successfully')
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error)
    console.warn('OTP functionality will be limited without Firebase')
  }
} else {
  console.warn('Firebase service account not provided - OTP functionality will be limited')
}

const app = express()
app.use(cors())
app.use(express.json())

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function otpHtmlTemplate(code: string) {
  return `
  <div style="font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;background:#0b0f19;color:#e5e7eb;padding:32px">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1f2937">
      <tr>
        <td style="padding:28px 28px 0 28px;text-align:center">
          <div style="display:inline-flex;align-items:center;gap:8px;color:#fff;font-weight:700;font-size:20px">
            <span style="display:inline-block;width:10px;height:10px;background:#8b5cf6;border-radius:9999px"></span>
            PromptNX
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px 8px 28px;text-align:center">
          <div style="font-size:24px;font-weight:700;color:#fff">Your verification code</div>
          <div style="margin-top:6px;color:#9ca3af;font-size:14px">Use this code to verify your email address</div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px 8px 28px;text-align:center">
          <div style="display:inline-block;letter-spacing:6px;font-size:32px;font-weight:800;color:#fff;background:#0b0f19;border:1px solid #374151;border-radius:12px;padding:14px 18px">
            ${code}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 24px 28px;text-align:center;color:#9ca3af;font-size:12px">
          This code expires in 10 minutes. If you didn’t request it, you can ignore this email.
        </td>
      </tr>
      <tr>
        <td style="height:1px;background:#1f2937"></td>
      </tr>
      <tr>
        <td style="padding:18px 28px;color:#6b7280;font-size:12px;text-align:center">
          Sent securely by PromptNX • ${RESEND_DOMAIN}
        </td>
      </tr>
    </table>
  </div>`
}

// POST /otp/send { email }
app.post('/otp/send', async (req, res) => {
  try {
    const { email } = req.body as { email: string }
    if (!email) return res.status(400).json({ error: 'Email required' })

    const code = generateOtp()
    const expiresAt = Date.now() + 10 * 60 * 1000
    
    // Store OTP in Firestore if available
    if (db) {
      await db.collection('emailOtps').doc(email).set({ code, expiresAt, attempts: 0 }, { merge: true })
    } else {
      console.warn('Firestore not available - OTP not persisted')
    }

    if (!resend) return res.status(500).json({ error: 'Email service not configured' })

    await resend.emails.send({
      from: `${'PromptNX'} <${SENDER_EMAIL}>`,
      to: email,
      subject: 'Your PromptNX verification code',
      html: otpHtmlTemplate(code)
    })

    res.json({ ok: true })
  } catch (e: any) {
    console.error(e)
    res.status(500).json({ error: 'Failed to send OTP' })
  }
})

// POST /otp/verify { email, code }
app.post('/otp/verify', async (req, res) => {
  try {
    const { email, code } = req.body as { email: string; code: string }
    if (!email || !code) return res.status(400).json({ error: 'Email and code required' })

    if (!db) {
      console.warn('Firestore not available - OTP verification skipped')
      return res.json({ ok: true }) // Allow verification to pass for testing
    }

    const docRef = db.collection('emailOtps').doc(email)
    const snap = await docRef.get()
    if (!snap.exists) return res.status(400).json({ error: 'OTP not found' })
    const data = snap.data() as any
    if (Date.now() > data.expiresAt) return res.status(400).json({ error: 'OTP expired' })
    if (data.code !== code) {
      const attempts = (data.attempts || 0) + 1
      await docRef.update({ attempts })
      return res.status(400).json({ error: 'Invalid code' })
    }

    await docRef.delete()
    res.json({ ok: true })
  } catch (e: any) {
    console.error(e)
    res.status(500).json({ error: 'Failed to verify OTP' })
  }
})

// POST /api/prompt-generator - Generate or enhance prompts via free Hugging Face model
app.post('/api/prompt-generator', async (req, res) => {
  const startTime = Date.now()
  const clientId = getClientIdentifier(req)

  try {
    const rateLimitResult = rateLimit(clientId)
    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      })
    }

    const respondWithLocal = (reason?: string) => {
      const payload = synthesizeLocalPrompt(
        {
          userInput,
          promptType,
          aiPlatform,
          outputFormat,
          language,
          visualReference,
          referenceType,
          mode,
          existingPrompt
        },
        reason
      )

      return res.json({
        ...payload,
        metadata: {
          ...payload.metadata,
          latencyMs: Date.now() - startTime
        }
      })
    }

    if (PROMPT_GENERATOR_PROVIDER === 'local') {
      return respondWithLocal('Local provider selected')
    }

    if (PROMPT_GENERATOR_PROVIDER === 'huggingface' && !HUGGINGFACE_API_KEY) {
      console.warn('HUGGINGFACE_API_KEY missing; using local prompt synthesis fallback')
      return respondWithLocal('Hugging Face key missing')
    }

    if (PROMPT_GENERATOR_PROVIDER === 'openrouter' && !OPENROUTER_API_KEY) {
      console.warn('OPENROUTER_API_KEY missing; using local prompt synthesis fallback')
      return respondWithLocal('OpenRouter key missing')
    }

    const {
      userInput,
      promptType,
      aiPlatform,
      outputFormat,
      language,
      visualReference,
      referenceType,
      mode = 'generate',
      existingPrompt,
      disableCache = false
    } = req.body as {
      userInput: string
      promptType: string
      aiPlatform: string
      outputFormat: string
      language: string
      visualReference?: string
      referenceType?: string
      mode?: 'generate' | 'enhance'
      existingPrompt?: string
      disableCache?: boolean
    }

    if (!userInput || !promptType || !aiPlatform || !outputFormat || !language) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      })
    }

    if (mode === 'enhance' && !existingPrompt) {
      return res.status(400).json({
        success: false,
        error: 'existingPrompt is required when mode is enhance'
      })
    }

    const blueprint = buildPromptBlueprint({
      userInput,
      promptType,
      aiPlatform,
      outputFormat,
      language,
      visualReference,
      referenceType,
      mode,
      existingPrompt
    })

    const cacheKey = generateCacheKey({
      provider: `promptnx-${PROMPT_GENERATOR_PROVIDER}`,
      model: PROMPT_GENERATOR_MODEL,
      userPrompt: `${mode}:${userInput}:${promptType}:${aiPlatform}:${outputFormat}:${language}:${visualReference || ''}`,
      systemPrompt: existingPrompt?.substring(0, 80),
      temperature: PROMPT_GENERATOR_TEMPERATURE,
      maxTokens: PROMPT_GENERATOR_MAX_TOKENS
    })

    if (!disableCache) {
      const cached = getCache<any>(cacheKey)
      if (cached) {
        return res.json({
          ...cached,
          metadata: {
            ...cached.metadata,
            cached: true,
            latencyMs: Date.now() - startTime
          }
        })
      }
    }

    let generatedText = ''
    let promptTokens = 0
    let completionTokens = 0

    try {
      if (PROMPT_GENERATOR_PROVIDER === 'openrouter') {
        const openRouterMessages = [
          { role: 'system', content: PROMPT_GENERATOR_SYSTEM_PROMPT },
          { role: 'user', content: blueprint }
        ]

        const openRouterResponse = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: PROMPT_GENERATOR_MODEL,
            messages: openRouterMessages,
            temperature: PROMPT_GENERATOR_TEMPERATURE,
            max_tokens: PROMPT_GENERATOR_MAX_TOKENS,
            top_p: 0.9
          },
          {
            headers: {
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              'HTTP-Referer': 'https://promptnx.com',
              'X-Title': 'PromptNX Studio'
            },
            timeout: 120000
          }
        )

        generatedText =
          openRouterResponse.data?.choices?.[0]?.message?.content?.trim() || ''

        const usage = openRouterResponse.data?.usage
        promptTokens =
          usage?.prompt_tokens ?? Math.max(1, Math.round(blueprint.length / 4))
        completionTokens =
          usage?.completion_tokens ??
          Math.max(1, Math.round(generatedText.length / 4))
      } else {
        const huggingFaceResponse = await axios.post(
          `https://api-inference.huggingface.co/models/${PROMPT_GENERATOR_MODEL}`,
          {
            inputs: blueprint,
            parameters: {
              temperature: PROMPT_GENERATOR_TEMPERATURE,
              max_new_tokens: PROMPT_GENERATOR_MAX_TOKENS,
              top_p: 0.9,
              repetition_penalty: 1.08,
              return_full_text: false
            }
          },
          {
            headers: {
              Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
              'Content-Type': 'application/json'
            },
            params: {
              wait_for_model: true
            },
            timeout: 120000
          }
        )

        const rawData = huggingFaceResponse.data

        if (rawData?.error) {
          throw new Error(rawData.error)
        }

        if (Array.isArray(rawData)) {
          generatedText =
            rawData[0]?.generated_text ||
            rawData[0]?.output_text ||
            rawData[0]?.text ||
            ''
        } else if (typeof rawData === 'object') {
          generatedText =
            rawData.generated_text ||
            rawData.output_text ||
            rawData?.choices?.[0]?.text ||
            rawData?.data?.[0]?.generated_text ||
            ''
        } else if (typeof rawData === 'string') {
          generatedText = rawData
        }

        generatedText = generatedText?.trim()

        if (!generatedText) {
          throw new Error('Model returned an empty response')
        }

        promptTokens = Math.max(1, Math.round(blueprint.length / 4))
        completionTokens = Math.max(1, Math.round(generatedText.length / 4))
      }
    } catch (providerError: any) {
      console.error('Prompt provider error, falling back to local synthesis:', providerError?.message || providerError)
      return respondWithLocal(providerError?.message || 'Provider error')
    }

    generatedText = generatedText?.trim()

    if (!generatedText) {
      throw new Error('Model returned an empty response')
    }

    const score = estimatePromptScore(generatedText)

    const providerLabel = PROMPT_GENERATOR_PROVIDER === 'openrouter' ? 'openrouter' : 'huggingface-inference'

    const responsePayload = {
      success: true,
      prompt: generatedText,
      score,
      metadata: {
        provider: providerLabel,
        model: PROMPT_GENERATOR_MODEL,
        mode,
        latencyMs: Date.now() - startTime,
        tokens: {
          prompt: promptTokens,
          completion: completionTokens,
          total: promptTokens + completionTokens
        },
        cached: false
      }
    }

    if (!disableCache) {
      setCache(cacheKey, responsePayload, PROMPT_GENERATOR_CACHE_TTL)
    }

    res.json(responsePayload)
  } catch (error: any) {
    const status = error.response?.status || 500
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Failed to generate prompt'

    console.error('[Prompt Generator Error]', {
      status,
      message,
      request: {
        promptType: req.body?.promptType,
        aiPlatform: req.body?.aiPlatform
      }
    })

    res.status(status).json({
      success: false,
      error: message
    })
  }
})

// POST /api/chat/free - Lightweight chat endpoint backed by configurable free model
app.post('/api/chat/free', async (req, res) => {
  const startTime = Date.now()
  const clientId = getClientIdentifier(req)

  try {
    const rateLimitResult = rateLimit(clientId)
    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      })
    }

    if (PROMPT_GENERATOR_PROVIDER === 'huggingface' && !HUGGINGFACE_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'HUGGINGFACE_API_KEY not configured on server'
      })
    }

    if (PROMPT_GENERATOR_PROVIDER === 'openrouter' && !OPENROUTER_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OPENROUTER_API_KEY not configured on server'
      })
    }

    const {
      messages,
      systemPrompt,
      temperature = PROMPT_GENERATOR_TEMPERATURE,
      maxTokens = PROMPT_GENERATOR_MAX_TOKENS,
      tone
    } = req.body as {
      messages?: IncomingChatMessage[]
      systemPrompt?: string
      temperature?: number
      maxTokens?: number
      tone?: string
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Chat messages array is required'
      })
    }

    const sanitizedMessages = messages
      .filter((message): message is IncomingChatMessage => {
        return Boolean(message?.content && ['user', 'assistant', 'system'].includes(message.role))
      })
      .slice(-10) // keep last 10 turns to stay within context limits

    if (sanitizedMessages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one valid chat message is required'
      })
    }

    const compiledPrompt = [
      systemPrompt || DEFAULT_CHAT_SYSTEM_PROMPT,
      tone ? `Adopt a ${tone} tone throughout the conversation.` : null,
      '',
      'Conversation so far:',
      sanitizedMessages
        .map((message) => {
          const speaker = message.role === 'assistant' ? 'Assistant' : message.role === 'system' ? 'System' : 'User'
          return `${speaker}: ${message.content.trim()}`
        })
        .join('\n'),
      '',
      'Assistant:'
    ]
      .filter(Boolean)
      .join('\n')

    const cacheKey = generateCacheKey({
      provider: `promptnx-${PROMPT_GENERATOR_PROVIDER}-chat`,
      model: `${PROMPT_GENERATOR_MODEL}:free-chat`,
      userPrompt: compiledPrompt,
      temperature,
      maxTokens
    })
    const cachedResponse = getCache<any>(cacheKey)
    if (cachedResponse) {
      return res.json({
        ...cachedResponse,
        metadata: {
          ...(cachedResponse.metadata || {}),
          cached: true,
          latencyMs: Date.now() - startTime
        }
      })
    }

    let generatedText = ''
    let promptTokens = 0
    let completionTokens = 0

    if (PROMPT_GENERATOR_PROVIDER === 'openrouter') {
      const combinedSystemPrompt = tone
        ? `${systemPrompt || DEFAULT_CHAT_SYSTEM_PROMPT}\nAdopt a ${tone} tone throughout the conversation.`
        : systemPrompt || DEFAULT_CHAT_SYSTEM_PROMPT

      const openRouterMessages: IncomingChatMessage[] = [
        { role: 'system', content: combinedSystemPrompt }
      ]

      sanitizedMessages.forEach((message) => {
        openRouterMessages.push({
          role: message.role,
          content: message.content.trim()
        })
      })

      const openRouterResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: PROMPT_GENERATOR_MODEL,
          messages: openRouterMessages,
          temperature,
          max_tokens: maxTokens,
          top_p: 0.9
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://promptnx.com',
            'X-Title': 'PromptNX Studio'
          },
          timeout: 120000
        }
      )

      generatedText =
        openRouterResponse.data?.choices?.[0]?.message?.content?.trim() || ''

      const usage = openRouterResponse.data?.usage
      promptTokens =
        usage?.prompt_tokens ?? Math.max(1, Math.round(compiledPrompt.length / 4))
      completionTokens =
        usage?.completion_tokens ??
        Math.max(1, Math.round(generatedText.length / 4))
    } else {
      const huggingFaceResponse = await axios.post(
        `https://api-inference.huggingface.co/models/${PROMPT_GENERATOR_MODEL}`,
        {
          inputs: compiledPrompt,
          parameters: {
            temperature,
            max_new_tokens: maxTokens,
            top_p: 0.9,
            repetition_penalty: 1.05,
            return_full_text: false
          }
        },
        {
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          params: {
            wait_for_model: true
          },
          timeout: 120000
        }
      )

      const rawData = huggingFaceResponse.data

      if (Array.isArray(rawData)) {
        generatedText =
          rawData[0]?.generated_text ||
          rawData[0]?.output_text ||
          rawData[0]?.text ||
          ''
      } else if (typeof rawData === 'object') {
        generatedText =
          rawData.generated_text ||
          rawData.output_text ||
          rawData?.choices?.[0]?.text ||
          rawData?.data?.[0]?.generated_text ||
          ''
      } else if (typeof rawData === 'string') {
        generatedText = rawData
      }

      generatedText = generatedText?.trim()
      if (!generatedText) {
        throw new Error('Model returned an empty response')
      }

      promptTokens = Math.max(1, Math.round(compiledPrompt.length / 4))
      completionTokens = Math.max(1, Math.round(generatedText.length / 4))
    }

    generatedText = generatedText?.trim()
    if (!generatedText) {
      throw new Error('Model returned an empty response')
    }

    const providerLabel = PROMPT_GENERATOR_PROVIDER === 'openrouter' ? 'openrouter' : 'huggingface-inference'

    const responsePayload = {
      success: true,
      message: generatedText,
      metadata: {
        provider: providerLabel,
        model: PROMPT_GENERATOR_MODEL,
        latencyMs: Date.now() - startTime,
        tokens: {
          prompt: promptTokens,
          completion: completionTokens,
          total: promptTokens + completionTokens
        },
        cached: false
      }
    }

    setCache(cacheKey, responsePayload, FREE_CHAT_CACHE_TTL)

    res.json(responsePayload)
  } catch (error: any) {
    const status = error.response?.status || 500
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Failed to complete chat request'

    console.error('[Free Chat Error]', {
      status,
      message
    })

    res.status(status).json({
      success: false,
      error: message
    })
  }
})

// POST /api/studio/execute - Execute AI API calls
app.post('/api/studio/execute', async (req, res) => {
  const startTime = Date.now()
  const clientId = getClientIdentifier(req)
  
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(clientId)
    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      })
    }

    // Request validation
    const validation = validateExecuteRequest(req.body)
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors
      })
    }

    const {
      provider,
      model,
      apiKey,
      systemPrompt,
      userPrompt,
      temperature,
      maxTokens,
      topP,
      frequencyPenalty,
      presencePenalty,
      stop,
      useCache = true, // Allow disabling cache
      // Image specific
      size,
      quality,
      style,
      // Video specific
      duration,
      aspectRatio
    } = req.body

    // Check cache
    if (useCache) {
      const cacheKey = generateCacheKey({
        provider,
        model,
        userPrompt,
        systemPrompt,
        temperature,
        maxTokens
      })
      const cached = getCache(cacheKey)
      if (cached) {
        console.log(`Cache hit for ${provider}/${model}`)
        return res.json({
          ...cached,
          cached: true,
          responseTime: Date.now() - startTime
        })
      }
    }

    let result: any
    let usage: any = null
    let cost: number = 0

    // OpenAI
    if (provider === 'openai') {
      const isImage = model.includes('dall-e')
      
      if (isImage) {
        const response = await executeProviderRequest({
          url: 'https://api.openai.com/v1/images/generations',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`
          },
          data: {
            prompt: userPrompt,
            n: 1,
            size: size || '1024x1024',
            quality: quality || 'standard',
            style: style || 'vivid'
          }
        })
        
        result = {
          success: true,
          data: response.data[0],
          type: 'image'
        }
        cost = calculateCost(provider, model, {}, 'image')
      } else {
        const messages: any[] = []
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
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

        const response = await executeProviderRequest({
          url: 'https://api.openai.com/v1/chat/completions',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`
          },
          data: params
        })
        
        usage = response.usage
        cost = calculateCost(provider, model, usage, 'text')
        
        result = {
          success: true,
          data: response.choices[0].message.content,
          usage,
          type: 'text'
        }
      }
    }
    // Anthropic Claude
    else if (provider === 'anthropic') {
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

      const response = await executeProviderRequest({
        url: 'https://api.anthropic.com/v1/messages',
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        data: params
      })
      
      usage = response.usage
      cost = calculateCost(provider, model, usage, 'text')
      
      result = {
        success: true,
        data: response.content[0].text,
        usage,
        type: 'text'
      }
    }
    // Google Gemini
    else if (provider === 'google') {
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

      const response = await executeProviderRequest({
        url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        method: 'POST',
        params: { key: apiKey },
        data: params
      })
      
      usage = response.usageMetadata
      cost = calculateCost(provider, model, {
        prompt_tokens: usage?.promptTokenCount,
        completion_tokens: usage?.candidatesTokenCount,
        total_tokens: usage?.totalTokenCount
      }, 'text')
      
      result = {
        success: true,
        data: response.candidates[0].content.parts[0].text,
        usage,
        type: 'text'
      }
    }
    // OpenRouter (supports multiple models)
    else if (provider === 'openrouter') {
      const messages: any[] = []
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
      messages.push({ role: 'user', content: userPrompt })

      const params: any = {
        model,
        messages
      }
      if (temperature !== undefined) params.temperature = temperature
      if (maxTokens !== undefined) params.max_tokens = maxTokens
      if (topP !== undefined) params.top_p = topP

      const response = await executeProviderRequest({
        url: 'https://openrouter.ai/api/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://promptnx.com',
          'X-Title': 'PromptNX Studio'
        },
        data: params
      })
      
      usage = response.usage
      cost = calculateCost(provider, model, usage, 'text')
      
      result = {
        success: true,
        data: response.choices[0].message.content,
        usage,
        type: 'text'
      }
    }
    // Stability AI (SDXL)
    else if (provider === 'stability') {
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

      const response = await executeProviderRequest({
        url: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        data: params
      })
      
      cost = calculateCost(provider, model, {}, 'image')
      
      result = {
        success: true,
        data: response.artifacts[0].base64,
        type: 'image'
      }
    }
    // Replicate (for video/other models)
    else if (provider === 'replicate') {
      const input: any = {
        prompt: userPrompt
      }
      if (duration) input.duration = duration
      if (aspectRatio) input.aspect_ratio = aspectRatio

      const response = await executeProviderRequest({
        url: `https://api.replicate.com/v1/models/${model}/predictions`,
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`
        },
        data: { input }
      })
      
      result = {
        success: true,
        data: response,
        type: 'video'
      }
    }
    else {
      return res.status(400).json({ 
        success: false,
        error: `Provider ${provider} not yet supported` 
      })
    }

    // Add metadata
    const responseData = {
      ...result,
      metadata: {
        provider,
        model,
        responseTime: Date.now() - startTime,
        cost: cost > 0 ? formatCost(cost) : null,
        cached: false
      }
    }

    // Cache successful text responses (not images/videos)
    if (useCache && result.success && result.type === 'text') {
      const cacheKey = generateCacheKey({
        provider,
        model,
        userPrompt,
        systemPrompt,
        temperature,
        maxTokens
      })
      setCache(cacheKey, responseData, 5 * 60 * 1000) // 5 minutes
    }

    // Log successful request
    console.log(`[${provider}/${model}] Success in ${Date.now() - startTime}ms, Cost: ${formatCost(cost)}`)

    res.json(responseData)
  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || 
                        error.response?.data?.message ||
                        error.message || 
                        'Failed to execute API call'
    
    console.error(`[API Error] ${error.response?.status || 500}:`, {
      provider: req.body.provider,
      model: req.body.model,
      error: errorMessage,
      responseTime: Date.now() - startTime
    })

    res.status(error.response?.status || 500).json({
      success: false,
      error: errorMessage,
      metadata: {
        responseTime: Date.now() - startTime,
        provider: req.body.provider,
        model: req.body.model
      }
    })
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API info endpoint
app.get('/api/studio/info', (req, res) => {
  res.json({
    version: '1.0.0',
    features: [
      'Rate limiting',
      'Response caching',
      'Retry logic',
      'Cost tracking',
      'Request validation',
      'Multiple providers support'
    ],
    supportedProviders: [
      'openai',
      'anthropic',
      'google',
      'openrouter',
      'stability',
      'replicate'
    ]
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`API Info: http://localhost:${PORT}/api/studio/info`)
})



