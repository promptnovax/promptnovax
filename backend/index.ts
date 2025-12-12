import dotenv from 'dotenv'
dotenv.config()
import express, { Request } from 'express'
import cors from 'cors'
import { Resend } from 'resend'
import axios from 'axios'
import { rateLimit, getClientIdentifier } from './utils/rateLimiter.js'
import { getCache, setCache, generateCacheKey } from './utils/cache.js'
import { validateExecuteRequest } from './utils/validators.js'
import { calculateCost, formatCost } from './utils/costCalculator.js'
import { executeProviderRequest } from './utils/providerHandler.js'
import { buildPromptBlueprint, estimatePromptScore } from './utils/promptGenerator.js'
import { synthesizeLocalPrompt } from './utils/localPromptSynthesis.js'
import { getSupabaseAdmin } from './lib/supabase.js'
import type { Session, User } from '@supabase/supabase-js'

// Env
const PORT = process.env.PORT || 8787
const RESEND_API_KEY = process.env.RESEND_API_KEY as string
const RESEND_DOMAIN = process.env.RESEND_DOMAIN as string
const SENDER_EMAIL = process.env.SENDER_EMAIL as string
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

type WorkflowStageId = 'briefing' | 'generation' | 'image' | 'chat-loop' | 'video'

interface WorkflowStageInput {
  id: WorkflowStageId
  label?: string
  type?: string
  runtime?: string
}

interface StageResult {
  id: WorkflowStageId
  status: 'completed' | 'skipped' | 'failed'
  summary: string
  details?: string
  outputType?: 'text' | 'image' | 'video'
  payload?: any
}

const WORKFLOW_STAGE_IDS: WorkflowStageId[] = ['briefing', 'generation', 'image', 'chat-loop', 'video']

function normalizeWorkflowStages(input: any): WorkflowStageInput[] {
  const fallback: WorkflowStageInput[] = [
    { id: 'briefing', label: 'Briefing + Guardrails', type: 'text', runtime: 'Prep' },
    { id: 'generation', label: 'Primary Generation', type: 'text', runtime: 'Core' }
  ]

  if (!Array.isArray(input) || input.length === 0) {
    return fallback
  }

  const cleaned = input
    .map((stage) => ({
      id: stage?.id,
      label: stage?.label,
      type: stage?.type,
      runtime: stage?.runtime
    }))
    .filter((stage): stage is WorkflowStageInput => {
      return Boolean(stage.id && WORKFLOW_STAGE_IDS.includes(stage.id))
    })

  return cleaned.length ? cleaned : fallback
}

function sortStageResults(stageResults: StageResult[], order: WorkflowStageId[]) {
  return [...stageResults].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
}

async function handleImageStage({
  provider,
  apiKey,
  prompt,
  size,
  quality,
  style
}: {
  provider: string
  apiKey: string
  prompt: string
  size?: string
  quality?: string
  style?: string
}): Promise<StageResult> {
  if (provider !== 'openai') {
    return {
      id: 'image',
      status: 'skipped',
      summary: 'Visual companion requires the OpenAI provider (DALL·E / GPT-Image).'
    }
  }

  const payload: any = {
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size: size || '1024x1024'
  }
  if (quality) payload.quality = quality
  if (style) payload.style = style

  const response = await executeProviderRequest({
    url: 'https://api.openai.com/v1/images/generations',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    data: payload
  })

  const first = response?.data?.[0]
  if (!first) {
    throw new Error('OpenAI image endpoint returned an empty response')
  }

  const dataUrl = first.b64_json
    ? `data:image/png;base64,${first.b64_json}`
    : first.url

  return {
    id: 'image',
    status: 'completed',
    summary: `Generated companion visual (${payload.size})`,
    outputType: 'image',
    payload: {
      url: first.url,
      base64: first.b64_json,
      source: dataUrl
    }
  }
}

async function handleChatLoopStage({
  provider,
  apiKey,
  systemPrompt,
  userPrompt,
  assistantOutput,
  temperature,
  maxTokens
}: {
  provider: string
  apiKey: string
  systemPrompt?: string
  userPrompt: string
  assistantOutput?: string
  temperature?: number
  maxTokens?: number
}): Promise<StageResult> {
  if (!assistantOutput) {
    return {
      id: 'chat-loop',
      status: 'failed',
      summary: 'Chat loop requires a successful primary generation first.'
    }
  }

  if (provider !== 'openai') {
    return {
      id: 'chat-loop',
      status: 'skipped',
      summary: 'Chat loop automation is currently available for OpenAI only.'
    }
  }

  const messages = [
    { role: 'system', content: systemPrompt || DEFAULT_CHAT_SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
    { role: 'assistant', content: assistantOutput },
    {
      role: 'user',
      content: 'Continue the conversation with a concise follow-up question and one tactical suggestion.'
    }
  ]

  const response = await executeProviderRequest({
    url: 'https://api.openai.com/v1/chat/completions',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    data: {
      model: 'gpt-4o-mini',
      messages,
      temperature: Math.min((temperature ?? 0.7) + 0.1, 1.2),
      max_tokens: Math.min(maxTokens ?? 300, 500)
    }
  })

  const chatContent = response?.choices?.[0]?.message?.content?.trim()
  if (!chatContent) {
    throw new Error('Chat loop returned an empty response')
  }

  return {
    id: 'chat-loop',
    status: 'completed',
    summary: 'Follow-up turn generated',
    outputType: 'text',
    payload: {
      text: chatContent
    }
  }
}

function buildVideoStageResult(provider: string, result: any): StageResult {
  if (provider !== 'replicate') {
    return {
      id: 'video',
      status: 'skipped',
      summary: 'Motion Layer currently requires the Replicate provider.'
    }
  }

  const videoUrl = result?.data?.output?.[0] || result?.data?.urls?.get

  return {
    id: 'video',
    status: result?.type === 'video' ? 'completed' : 'skipped',
    summary: 'Video prediction requested via Replicate.',
    outputType: 'video',
    payload: {
      url: videoUrl,
      raw: result?.data
    }
  }
}

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

const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>()

const app = express()
app.use(cors())
app.use(express.json())

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null
const supabaseAdmin = (() => {
  try {
    return getSupabaseAdmin()
  } catch (error) {
    console.warn('Supabase admin client unavailable; DB-backed routes disabled.')
    return null
  }
})()

type AuthEventType =
  | 'signup'
  | 'login'
  | 'logout'
  | 'password_reset_request'
  | 'password_reset'
  | 'token_refresh'
  | 'role_update'

type AuthUserRole = 'buyer' | 'seller'

const PASSWORD_RESET_REDIRECT =
  process.env.AUTH_PASSWORD_RESET_REDIRECT ||
  `${process.env.APP_URL || 'http://localhost:5173'}/reset-password`

function normalizeRole(role?: string | null): AuthUserRole {
  return role === 'seller' ? 'seller' : 'buyer'
}

function mapAuthUser(user: User | null) {
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    role: normalizeRole((user.user_metadata as any)?.role),
    displayName:
      (user.user_metadata as any)?.display_name ||
      (user.user_metadata as any)?.full_name ||
      user.email?.split('@')[0] ||
      null,
    avatarUrl: (user.user_metadata as any)?.avatar_url || null,
    createdAt: user.created_at
  }
}

async function upsertProfileFromUser(user: User, role: AuthUserRole, displayName?: string) {
  if (!supabaseAdmin) return
  try {
    const fallbackUsername = user.email?.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '')?.toLowerCase()
    const profilePayload: Record<string, any> = {
      id: user.id,
      role,
      username: (user.user_metadata as any)?.username || fallbackUsername,
      display_name:
        displayName ||
        (user.user_metadata as any)?.display_name ||
        (user.user_metadata as any)?.full_name,
      avatar_url: (user.user_metadata as any)?.avatar_url,
      metadata: (user.user_metadata as any)?.metadata || {}
    }
    Object.keys(profilePayload).forEach((key) => {
      if (profilePayload[key] === undefined) {
        delete profilePayload[key]
      }
    })
    await supabaseAdmin.from('profiles').upsert(profilePayload, { onConflict: 'id' })

    if (role === 'seller') {
      const sellerPayload: Record<string, any> = {
        seller_id: user.id,
        headline: profilePayload.display_name || profilePayload.username,
        verification_status: 'unverified'
      }
      Object.keys(sellerPayload).forEach((key) => {
        if (sellerPayload[key] === undefined) {
          delete sellerPayload[key]
        }
      })
      await supabaseAdmin.from('seller_profiles').upsert(sellerPayload, { onConflict: 'seller_id' })
    }
  } catch (error) {
    console.warn('[Auth] Failed to sync profile after auth event', error)
  }
}

async function logAuthEvent({
  eventType,
  request,
  success,
  userId,
  errorCode,
  metadata
}: {
  eventType: AuthEventType
  request?: Request
  userId?: string
  success: boolean
  errorCode?: string
  metadata?: Record<string, any>
}) {
  if (!supabaseAdmin) return
  try {
    await supabaseAdmin.from('auth_events').insert({
      user_id: userId ?? null,
      event_type: eventType,
      success,
      error_code: errorCode || null,
      metadata: metadata || {},
      ip_address: request?.ip || null,
      user_agent: request?.get('user-agent') || null
    })
  } catch (error) {
    console.warn('[Auth] Failed to log auth event', error)
  }
}

async function persistSessionRecord({
  session,
  userId,
  request
}: {
  session: Session | null
  userId: string
  request?: Request
}) {
  if (!supabaseAdmin || !session) return null
  try {
    const expiresAt =
      session.expires_at && !Number.isNaN(session.expires_at)
        ? new Date(session.expires_at * 1000).toISOString()
        : session.expires_in
        ? new Date(Date.now() + session.expires_in * 1000).toISOString()
        : new Date(Date.now() + 3600 * 1000).toISOString()

    const { data, error } = await supabaseAdmin
      .from('user_sessions')
      .insert({
        user_id: userId,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: expiresAt,
        ip_address: request?.ip || null,
        user_agent: request?.get('user-agent') || null
      })
      .select('id')
      .single()

    if (error) throw error
    return data?.id ?? null
  } catch (error) {
    console.warn('[Auth] Failed to persist session record', error)
    return null
  }
}

async function revokeSessionRecord({
  sessionId,
  userId
}: {
  sessionId?: string
  userId?: string
}) {
  if (!supabaseAdmin) return
  if (!sessionId && !userId) return
  try {
    const query = supabaseAdmin
      .from('user_sessions')
      .update({ revoked_at: new Date().toISOString() })
      .is('revoked_at', null)
    if (sessionId) {
      await query.eq('id', sessionId)
    } else if (userId) {
      await query.eq('user_id', userId)
    }
  } catch (error) {
    console.warn('[Auth] Failed to revoke session record', error)
  }
}

// Auth endpoints --------------------------------------------------------------
app.post('/api/auth/signup', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { email, password, role = 'buyer', displayName } = req.body as {
      email?: string
      password?: string
      role?: AuthUserRole
      displayName?: string
    }

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const normalizedRole = normalizeRole(role)

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: normalizedRole,
        display_name: displayName
      }
    })

    if (error || !data.user) {
      await logAuthEvent({
        eventType: 'signup',
        request: req,
        success: false,
        errorCode: error?.message,
        metadata: { email }
      })
      return res.status(400).json({ error: error?.message || 'Failed to create account' })
    }

    await upsertProfileFromUser(data.user, normalizedRole, displayName)
    await logAuthEvent({
      eventType: 'signup',
      request: req,
      success: true,
      userId: data.user.id,
      metadata: { role: normalizedRole }
    })

    res.status(201).json({ user: mapAuthUser(data.user) })
  } catch (error: any) {
    console.error('[Auth] signup failed', error)
    res.status(500).json({ error: 'Failed to create account' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { email, password } = req.body as { email?: string; password?: string }
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      await logAuthEvent({
        eventType: 'login',
        request: req,
        success: false,
        errorCode: error?.message,
        metadata: { email }
      })
      return res.status(401).json({ error: error?.message || 'Invalid credentials' })
    }

    const normalizedRole = normalizeRole((data.user.user_metadata as any)?.role)
    await upsertProfileFromUser(data.user, normalizedRole)

    if (!data.session) {
      await logAuthEvent({
        eventType: 'login',
        request: req,
        success: true,
        userId: data.user.id,
        metadata: { requiresEmailConfirmation: true }
      })
      return res.status(202).json({
        user: mapAuthUser(data.user),
        session: null,
        message: 'Email confirmation required before login completes.'
      })
    }

    const sessionId = await persistSessionRecord({
      session: data.session,
      userId: data.user.id,
      request: req
    })

    await logAuthEvent({
      eventType: 'login',
      request: req,
      success: true,
      userId: data.user.id
    })

    res.json({
      user: mapAuthUser(data.user),
      session: {
        id: sessionId,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt:
          data.session.expires_at && !Number.isNaN(data.session.expires_at)
            ? new Date(data.session.expires_at * 1000).toISOString()
            : null
      }
    })
  } catch (error: any) {
    console.error('[Auth] login failed', error)
    res.status(500).json({ error: 'Failed to login' })
  }
})

app.post('/api/auth/update-role', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { userId, role, displayName } = req.body as {
      userId?: string
      role?: AuthUserRole
      displayName?: string
    }

    if (!userId || !role) {
      return res.status(400).json({ error: 'userId and role are required' })
    }

    const normalizedRole = normalizeRole(role)

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        role: normalizedRole,
        display_name: displayName
      }
    })

    if (error || !data?.user) {
      await logAuthEvent({
        eventType: 'role_update',
        request: req,
        success: false,
        userId,
        errorCode: error?.message,
        metadata: { role: normalizedRole }
      })
      return res.status(400).json({ error: error?.message || 'Failed to update role' })
    }

    await upsertProfileFromUser(data.user, normalizedRole, displayName)

    await logAuthEvent({
      eventType: 'role_update',
      request: req,
      success: true,
      userId,
      metadata: { role: normalizedRole }
    })

    res.json({ user: mapAuthUser(data.user) })
  } catch (error: any) {
    console.error('[Auth] update-role failed', error)
    res.status(500).json({ error: 'Failed to update role' })
  }
})

app.post('/api/auth/logout', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { userId, sessionId } = req.body as { userId?: string; sessionId?: string }
    if (!userId) {
      return res.status(400).json({ error: 'userId is required to logout' })
    }

    const { error } = await supabaseAdmin.auth.admin.signOut(userId)
    if (error) {
      await logAuthEvent({
        eventType: 'logout',
        request: req,
        success: false,
        userId,
        errorCode: error.message
      })
      return res.status(500).json({ error: 'Failed to sign out user' })
    }

    await revokeSessionRecord({ sessionId, userId })
    await logAuthEvent({
      eventType: 'logout',
      request: req,
      success: true,
      userId
    })

    res.json({ success: true })
  } catch (error: any) {
    console.error('[Auth] logout failed', error)
    res.status(500).json({ error: 'Failed to logout user' })
  }
})

app.post('/api/auth/refresh', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { refreshToken } = req.body as { refreshToken?: string }
    if (!refreshToken) {
      return res.status(400).json({ error: 'refreshToken is required' })
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({ refresh_token: refreshToken })
    if (error || !data.session || !data.user) {
      await logAuthEvent({
        eventType: 'token_refresh',
        request: req,
        success: false,
        errorCode: error?.message
      })
      return res.status(401).json({ error: error?.message || 'Failed to refresh session' })
    }

    const sessionId = await persistSessionRecord({
      session: data.session,
      userId: data.user.id,
      request: req
    })

    await logAuthEvent({
      eventType: 'token_refresh',
      request: req,
      success: true,
      userId: data.user.id
    })

    res.json({
      user: mapAuthUser(data.user),
      session: {
        id: sessionId,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt:
          data.session.expires_at && !Number.isNaN(data.session.expires_at)
            ? new Date(data.session.expires_at * 1000).toISOString()
            : null
      }
    })
  } catch (error: any) {
    console.error('[Auth] refresh failed', error)
    res.status(500).json({ error: 'Failed to refresh session' })
  }
})

app.post('/api/auth/password/reset', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { email, redirectTo } = req.body as { email?: string; redirectTo?: string }
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || PASSWORD_RESET_REDIRECT
    })

    if (error) {
      await logAuthEvent({
        eventType: 'password_reset_request',
        request: req,
        success: false,
        errorCode: error.message,
        metadata: { email }
      })
      return res.status(500).json({ error: 'Failed to send password reset email' })
    }

    await logAuthEvent({
      eventType: 'password_reset_request',
      request: req,
      success: true,
      metadata: { email }
    })

    res.json({ success: true })
  } catch (error: any) {
    console.error('[Auth] password reset request failed', error)
    res.status(500).json({ error: 'Failed to process password reset request' })
  }
})
// GET /api/profiles/:id - hydrate profile + seller info
app.get('/api/profiles/:id', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { id } = req.params
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (profileError) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    const { data: sellerProfile } = await supabaseAdmin
      .from('seller_profiles')
      .select('*')
      .eq('seller_id', id)
      .maybeSingle()

    res.json({ profile, sellerProfile })
  } catch (error: any) {
    console.error('[Profiles] failed to fetch profile', error)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// GET /api/prompts - public marketplace feed
app.get('/api/prompts', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100)
    const statusFilter = (req.query.status as string) || 'live'
    const search = (req.query.search as string) || ''

    let query = supabaseAdmin
      .from('prompts')
      .select('*')
      .eq('visibility', 'public')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    res.json({ prompts: data ?? [] })
  } catch (error: any) {
    console.error('[Prompts] failed to fetch marketplace prompts', error)
    res.status(500).json({ error: 'Failed to load prompts' })
  }
})

// GET /api/sellers/:id/dashboard - aggregated seller dashboard data
app.get('/api/sellers/:id/dashboard', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { id: sellerId } = req.params

    const [
      { data: profile, error: profileError },
      { data: sellerProfile, error: sellerProfileError },
      { data: prompts, error: promptsError },
      { data: orderItems, error: orderItemsError },
      { data: reviews, error: reviewsError },
      { data: notifications, error: notificationsError }
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('*').eq('id', sellerId).maybeSingle(),
      supabaseAdmin.from('seller_profiles').select('*').eq('seller_id', sellerId).maybeSingle(),
      supabaseAdmin
        .from('prompts')
        .select('*')
        .eq('seller_id', sellerId)
        .order('updated_at', { ascending: false }),
      supabaseAdmin
        .from('order_items')
        .select('id,order_id,prompt_id,price_cents,seller_earnings_cents,created_at')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('prompt_reviews')
        .select('id,prompt_id,buyer_id,rating,comment,created_at,status')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(25),
      supabaseAdmin
        .from('notifications')
        .select('*')
        .eq('user_id', sellerId)
        .order('created_at', { ascending: false })
        .limit(10)
    ])

    if (profileError) throw profileError
    if (sellerProfileError && sellerProfileError.code !== 'PGRST116') throw sellerProfileError
    if (promptsError) throw promptsError
    if (orderItemsError) throw orderItemsError
    if (reviewsError) throw reviewsError
    if (notificationsError) throw notificationsError

    if (!profile) {
      return res.status(404).json({ error: 'Seller profile not found' })
    }

    const promptSummaries =
      prompts?.map((prompt) => ({
        id: prompt.id,
        title: prompt.title,
        category: prompt.category_id || 'uncategorized',
        price: (prompt.price_cents || 0) / 100,
        status: prompt.status,
        lastUpdated: prompt.updated_at,
        metrics: prompt.metrics || null,
        qaScore: prompt.qa_score || null
      })) ?? []

    const lifecycleColumns = [
      { stage: 'drafts', title: 'Drafts', description: 'Work in progress prompts' },
      { stage: 'testing', title: 'Testing', description: 'Validating quality & results' },
      { stage: 'review', title: 'Review', description: 'Awaiting compliance/go-live' },
      { stage: 'live', title: 'Live', description: 'Earning revenue today' }
    ].map((column) => ({
      ...column,
      prompts: promptSummaries.filter((prompt) => {
        if (column.stage === 'drafts') return prompt.status === 'draft'
        if (column.stage === 'testing') return prompt.status === 'testing'
        if (column.stage === 'review') return prompt.status === 'review'
        if (column.stage === 'live') return prompt.status === 'live'
        return false
      })
    }))

    const totalSales = orderItems?.length ?? 0
    const lifetimeEarningsCents =
      orderItems?.reduce((sum, item) => sum + (item.seller_earnings_cents || 0), 0) ?? 0
    
    // Calculate 30-day stats
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentOrders = orderItems?.filter(
      (item) => new Date(item.created_at) >= thirtyDaysAgo
    ) ?? []
    const earnings30DaysCents = recentOrders.reduce(
      (sum, item) => sum + (item.seller_earnings_cents || 0),
      0
    )
    
    const pendingAmountCents =
      Math.max(
        0,
        orderItems?.slice(0, 5).reduce((sum, item) => sum + (item.seller_earnings_cents || 0), 0) ??
          0
      ) ?? 0

    const livePrompts = promptSummaries.filter((p) => p.status === 'live')
    const totalPrompts = promptSummaries.length

    const dashboard = {
      sellerId,
      profile: {
        name: sellerProfile?.headline || profile.display_name || profile.username || 'Unnamed',
        avatarUrl: profile.avatar_url,
        verificationStatus: sellerProfile?.verification_status || 'unverified',
        completionPercent: sellerProfile?.completion_percent || 0,
        checklist: sellerProfile?.checklist || []
      },
      kpis: [
        {
          id: 'revenue_30d',
          label: 'Net Earn (30D)',
          value: `$${(earnings30DaysCents / 100).toFixed(2)}`,
          hint: 'After payouts',
          change: null // Can add trend later
        },
        {
          id: 'catalog',
          label: 'Prompts',
          value: String(totalPrompts),
          hint: 'Track and manage your prompts',
          change: null
        },
        {
          id: 'conversion',
          label: 'Orders',
          value: String(totalSales),
          hint: 'Total paid orders',
          change: null
        },
        {
          id: 'lifetime',
          label: 'Lifetime Earnings',
          value: `$${(lifetimeEarningsCents / 100).toFixed(2)}`,
          hint: 'All-time revenue',
          change: null
        }
      ],
      lifecycle: lifecycleColumns,
      testing: {
        totalActive: promptSummaries.filter((p) => p.status === 'testing').length,
        avgTurnaroundMinutes: 45,
        runs: []
      },
      payouts: {
        pendingAmount: pendingAmountCents / 100,
        lifetimeEarnings: lifetimeEarningsCents / 100,
        historyPreview: orderItems?.slice(0, 5).map((item) => ({
          id: item.id,
          amount: (item.seller_earnings_cents || 0) / 100,
          status: 'pending',
          scheduledFor: item.created_at
        })),
        feeSplit: sellerProfile?.fee_split || { platformPercent: 15, sellerPercent: 85 }
      },
      education: {
        certificationProgress: sellerProfile?.metrics?.certificationProgress || 0,
        recommendations: [],
        activeCourse: null
      },
      alerts: notifications?.map((notification) => ({
        id: notification.id,
        type: notification.type || 'feature',
        title: notification.title,
        message: notification.body,
        severity: notification.metadata?.severity || 'info'
      })) ?? [],
      feedback:
        reviews?.map((review) => ({
          id: review.id,
          promptId: review.prompt_id,
          buyerHandle: review.buyer_id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.created_at
        })) ?? []
    }

    res.json(dashboard)
  } catch (error: any) {
    console.error('[Sellers] failed to build dashboard', error)
    res.status(500).json({ error: 'Failed to load seller dashboard' })
  }
})

// GET /api/sellers/:id/prompts - list seller's prompts with filters
app.get('/api/sellers/:id/prompts', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { id: sellerId } = req.params
    const status = req.query.status as string | undefined
    const limit = Math.min(Number(req.query.limit) || 50, 100)
    const offset = Number(req.query.offset) || 0

    let query = supabaseAdmin
      .from('prompts')
      .select('*')
      .eq('seller_id', sellerId)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: prompts, error } = await query

    if (error) throw error

    const formatted = prompts?.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      slug: prompt.slug,
      summary: prompt.summary,
      price: (prompt.price_cents || 0) / 100,
      status: prompt.status,
      visibility: prompt.visibility,
      qaScore: prompt.qa_score,
      metrics: prompt.metrics || {},
      tags: prompt.tags || [],
      thumbnailUrl: prompt.thumbnail_url,
      createdAt: prompt.created_at,
      updatedAt: prompt.updated_at,
      publishedAt: prompt.published_at
    })) ?? []

    res.json({ prompts: formatted, total: formatted.length })
  } catch (error: any) {
    console.error('[Sellers] failed to fetch prompts', error)
    res.status(500).json({ error: 'Failed to load prompts' })
  }
})

// GET /api/sellers/:id/stats - quick stats for widgets
app.get('/api/sellers/:id/stats', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { id: sellerId } = req.params
    const period = (req.query.period as string) || '30d' // 7d, 30d, 90d, all

    const daysBack = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : null
    const cutoffDate = daysBack ? new Date() : null
    if (cutoffDate && daysBack) {
      cutoffDate.setDate(cutoffDate.getDate() - daysBack)
    }

    const [
      { data: prompts },
      { data: orderItems },
      { data: reviews }
    ] = await Promise.all([
      supabaseAdmin
        .from('prompts')
        .select('id,status,price_cents,metrics')
        .eq('seller_id', sellerId),
      supabaseAdmin
        .from('order_items')
        .select('seller_earnings_cents,created_at')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('prompt_reviews')
        .select('rating,created_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
    ])

    const filteredOrders = cutoffDate
      ? orderItems?.filter((item) => new Date(item.created_at) >= cutoffDate) ?? []
      : orderItems ?? []

    const earningsCents = filteredOrders.reduce(
      (sum, item) => sum + (item.seller_earnings_cents || 0),
      0
    )

    const livePrompts = prompts?.filter((p) => p.status === 'live') ?? []
    const avgRating =
      reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null

    res.json({
      period,
      earnings: earningsCents / 100,
      orders: filteredOrders.length,
      livePrompts: livePrompts.length,
      totalPrompts: prompts?.length ?? 0,
      avgRating: avgRating ? Number(avgRating.toFixed(1)) : null,
      totalReviews: reviews?.length ?? 0
    })
  } catch (error: any) {
    console.error('[Sellers] failed to fetch stats', error)
    res.status(500).json({ error: 'Failed to load stats' })
  }
})

// GET /api/sellers/:id/prompt-drafts - load Prompt Studio drafts for a seller
app.get('/api/sellers/:id/prompt-drafts', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { id: sellerId } = req.params

    const { data, error } = await supabaseAdmin
      .from('prompt_workbench_drafts')
      .select('*')
      .eq('seller_id', sellerId)
      .order('updated_at', { ascending: false })

    if (error) throw error

    const drafts =
      data?.map((row) => ({
        id: row.id,
        title: row.title,
        text: row.prompt_text,
        category: row.category,
        variables: row.variables || [],
        examples: row.examples || [],
        validation: row.validation || {},
        aiSuggestions: row.ai_suggestions || [],
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })) ?? []

    res.json({ drafts })
  } catch (error: any) {
    console.error('[PromptStudio] failed to fetch drafts', error)
    res.status(500).json({ error: 'Failed to load prompt drafts' })
  }
})

// POST /api/sellers/:id/prompt-drafts - create or update a Prompt Studio draft
app.post('/api/sellers/:id/prompt-drafts', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const { id: sellerId } = req.params
    const {
      id,
      title,
      text,
      category,
      variables,
      examples,
      validation,
      aiSuggestions,
      status
    } = req.body as {
      id?: string
      title?: string
      text?: string
      category?: string
      variables?: any
      examples?: any
      validation?: any
      aiSuggestions?: any
      status?: string
    }

    if (!title || !text) {
      return res.status(400).json({ error: 'title and text are required' })
    }

    const payload: Record<string, any> = {
      seller_id: sellerId,
      title,
      prompt_text: text,
      category: category || null,
      variables: variables ?? [],
      examples: examples ?? [],
      validation: validation ?? {},
      ai_suggestions: aiSuggestions ?? [],
      status: status || 'draft'
    }

    let result
    if (id) {
      result = await supabaseAdmin
        .from('prompt_workbench_drafts')
        .update(payload)
        .eq('id', id)
        .eq('seller_id', sellerId)
        .select('*')
        .maybeSingle()
    } else {
      result = await supabaseAdmin
        .from('prompt_workbench_drafts')
        .insert(payload)
        .select('*')
        .maybeSingle()
    }

    const { data, error } = result

    if (error || !data) {
      throw error || new Error('No draft returned from database')
    }

    const draft = {
      id: data.id,
      title: data.title,
      text: data.prompt_text,
      category: data.category,
      variables: data.variables || [],
      examples: data.examples || [],
      validation: data.validation || {},
      aiSuggestions: data.ai_suggestions || [],
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }

    res.json({ draft })
  } catch (error: any) {
    console.error('[PromptStudio] failed to upsert draft', error)
    res.status(500).json({ error: 'Failed to save prompt draft' })
  }
})

// POST /api/profiles/sync - ensure Supabase profile rows exist after auth
app.post('/api/profiles/sync', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not configured on server' })
  }

  try {
    const {
      userId,
      role = 'buyer',
      username,
      displayName,
      avatarUrl,
      country,
      metadata,
      sellerProfile
    } = req.body as {
      userId?: string
      role?: string
      username?: string
      displayName?: string
      avatarUrl?: string
      country?: string
      metadata?: Record<string, any>
      sellerProfile?: {
        headline?: string
        verificationStatus?: string
        completionPercent?: number
        payoutEmail?: string
        payoutMethod?: string
        checklist?: any[]
        metrics?: Record<string, any>
      }
    }

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    const profilePayload: Record<string, any> = {
      id: userId,
      role,
      username,
      display_name: displayName,
      avatar_url: avatarUrl,
      country,
      metadata
    }

    // Remove undefined keys so Supabase doesn't overwrite with null
    Object.keys(profilePayload).forEach((key) => {
      if (profilePayload[key] === undefined) {
        delete profilePayload[key]
      }
    })

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })
      .select('*')
      .single()

    if (profileError) {
      throw profileError
    }

    let sellerProfileRow = null
    const shouldSyncSeller = role === 'seller' || Boolean(sellerProfile)

    if (shouldSyncSeller) {
      const sellerPayload: Record<string, any> = {
        seller_id: userId,
        headline: sellerProfile?.headline,
        verification_status: sellerProfile?.verificationStatus || 'unverified',
        completion_percent: sellerProfile?.completionPercent ?? 0,
        payout_email: sellerProfile?.payoutEmail,
        payout_method: sellerProfile?.payoutMethod,
        checklist: sellerProfile?.checklist,
        metrics: sellerProfile?.metrics
      }

      Object.keys(sellerPayload).forEach((key) => {
        if (sellerPayload[key] === undefined) {
          delete sellerPayload[key]
        }
      })

      const { data, error } = await supabaseAdmin
        .from('seller_profiles')
        .upsert(sellerPayload, { onConflict: 'seller_id' })
        .select('*')
        .single()

      if (error) {
        throw error
      }

      sellerProfileRow = data
    }

    res.json({
      success: true,
      profile,
      sellerProfile: sellerProfileRow
    })
  } catch (error: any) {
    console.error('[Profiles] failed to sync profile', error)
    res.status(500).json({ error: 'Failed to sync profile' })
  }
})

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
    
    otpStore.set(email, { code, expiresAt, attempts: 0 })

    if (!resend) return res.status(500).json({ error: 'Email service not configured' })

    await resend.emails.send({
      from: `${'PromptNX'} <${SENDER_EMAIL}>`,
      to: email,
      subject: 'Your PromptNX verification code',
      html: otpHtmlTemplate(code)
    })

    const payload: Record<string, any> = { ok: true }
    if (process.env.NODE_ENV !== 'production') {
      payload.devCode = code
    }

    res.json(payload)
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

    const entry = otpStore.get(email)
    if (!entry) return res.status(400).json({ error: 'OTP not found' })
    if (Date.now() > entry.expiresAt) {
      otpStore.delete(email)
      return res.status(400).json({ error: 'OTP expired' })
    }
    if (entry.code !== code) {
      entry.attempts = (entry.attempts || 0) + 1
      otpStore.set(email, entry)
      return res.status(400).json({ error: 'Invalid code' })
    }

    otpStore.delete(email)
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
function buildFriendlyError(provider: string | undefined, model: string | undefined, status: number, rawMessage: string) {
  let suggestion: string | undefined
  let fallbackModels: string[] | undefined

  if (
    provider === 'openai' &&
    status === 404 &&
    /does not exist|do not have access/i.test(rawMessage) &&
    model
  ) {
    suggestion =
      `OpenAI reports that ${model} is unavailable for your account. This usually happens when the model is not part of your plan or it has been renamed.`
    fallbackModels = ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo']
  } else if (status === 401) {
    suggestion = 'Double-check that the API key is valid and has the correct scopes.'
  } else if (status === 429) {
    suggestion = 'The provider is rate limiting this key. Wait a bit or lower your request volume.'
  }

  return { suggestion, fallbackModels }
}

app.post('/api/studio/execute', async (req, res) => {
  const startTime = Date.now()
  const clientId = getClientIdentifier(req)
  const workflowStages = normalizeWorkflowStages(req.body?.workflowStages)
  const stageOrder = workflowStages.map((stage) => stage.id)
  const activeStageIds = new Set(stageOrder)
  const stageResults: StageResult[] = []
  const assets: { images?: string[]; videos?: string[] } = {}
  const hasStage = (id: WorkflowStageId) => activeStageIds.has(id)
  
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
      systemPrompt: rawSystemPrompt,
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

    const systemPrompt = hasStage('briefing')
      ? rawSystemPrompt || DEFAULT_CHAT_SYSTEM_PROMPT
      : undefined

    if (!hasStage('generation')) {
      return res.status(400).json({
        success: false,
        error: 'Enable the Primary Generation stage before executing.',
        metadata: {
          responseTime: Date.now() - startTime,
          missingStage: 'generation'
        },
        stageResults: stageResults.length ? sortStageResults(stageResults, stageOrder) : undefined
      })
    }

    if (hasStage('briefing')) {
      stageResults.push({
        id: 'briefing',
        status: 'completed',
        summary: rawSystemPrompt
          ? 'Custom guardrails applied.'
          : 'Default PromptNX guardrails injected.',
        outputType: 'text',
        payload: {
          systemPrompt
        }
      })
    }

    // Check cache
    if (useCache) {
      const cacheKey = generateCacheKey({
        provider,
        model,
        userPrompt,
        systemPrompt,
        temperature,
        maxTokens,
        workflow: stageOrder.join('|')
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

    if (hasStage('generation')) {
      stageResults.push({
        id: 'generation',
        status: result?.success ? 'completed' : 'failed',
        summary: result?.success
          ? `Generated ${result?.type || 'text'} output via ${provider}.`
          : 'Primary generation failed.',
        outputType: result?.type || 'text',
        payload: result?.data
      })
    }

    if (hasStage('image')) {
      try {
        const imageStage = await handleImageStage({
          provider,
          apiKey,
          prompt: userPrompt,
          size,
          quality,
          style
        })
        stageResults.push(imageStage)
        if (imageStage.payload?.source) {
          assets.images = [...(assets.images || []), imageStage.payload.source]
        }
      } catch (imageError: any) {
        stageResults.push({
          id: 'image',
          status: 'failed',
          summary: 'Failed to generate visual companion.',
          details: imageError.message || 'Unknown image stage error.'
        })
      }
    }

    if (hasStage('chat-loop')) {
      try {
        const assistantOutput =
          typeof result?.data === 'string'
            ? result.data
            : JSON.stringify(result?.data ?? {}).slice(0, 2000)

        const chatStage = await handleChatLoopStage({
          provider,
          apiKey,
          systemPrompt,
          userPrompt,
          assistantOutput,
          temperature,
          maxTokens
        })
        stageResults.push(chatStage)
      } catch (chatError: any) {
        stageResults.push({
          id: 'chat-loop',
          status: 'failed',
          summary: 'Chat loop stage failed.',
          details: chatError.message || 'Unknown chat loop error.'
        })
      }
    }

    if (hasStage('video')) {
      const videoStage = buildVideoStageResult(provider, result)
      stageResults.push(videoStage)
      if (videoStage.payload?.url) {
        assets.videos = [...(assets.videos || []), videoStage.payload.url]
      }
    }

    const orderedStageResults = stageResults.length ? sortStageResults(stageResults, stageOrder) : undefined
    const assetPayload =
      (assets.images && assets.images.length) || (assets.videos && assets.videos.length)
        ? {
            ...(assets.images?.length ? { images: assets.images } : {}),
            ...(assets.videos?.length ? { videos: assets.videos } : {})
          }
        : undefined

    // Add metadata
    const responseData = {
      ...result,
      metadata: {
        provider,
        model,
        responseTime: Date.now() - startTime,
        cost: cost > 0 ? formatCost(cost) : null,
        cached: false
      },
      stageResults: orderedStageResults,
      assets: assetPayload
    }

    // Cache successful text responses (not images/videos)
    if (useCache && result.success && result.type === 'text') {
      const cacheKey = generateCacheKey({
        provider,
        model,
        userPrompt,
        systemPrompt,
        temperature,
        maxTokens,
        workflow: stageOrder.join('|')
      })
      setCache(cacheKey, responseData, 5 * 60 * 1000) // 5 minutes
    }

    // Log successful request
    console.log(`[${provider}/${model}] Success in ${Date.now() - startTime}ms, Cost: ${formatCost(cost)}`)

    res.json(responseData)
  } catch (error: any) {
    const statusCode = error.response?.status || 500
    const errorMessage = error.response?.data?.error?.message || 
                        error.response?.data?.message ||
                        error.message || 
                        'Failed to execute API call'

    const { suggestion, fallbackModels } = buildFriendlyError(
      req.body.provider,
      req.body.model,
      statusCode,
      errorMessage
    )
    
    console.error(`[API Error] ${error.response?.status || 500}:`, {
      provider: req.body.provider,
      model: req.body.model,
      error: errorMessage,
      responseTime: Date.now() - startTime
    })

    res.status(statusCode).json({
      success: false,
      error: suggestion ? `${errorMessage} ${suggestion}` : errorMessage,
      metadata: {
        responseTime: Date.now() - startTime,
        provider: req.body.provider,
        model: req.body.model,
        suggestion,
        fallbackModels
      },
      stageResults: stageResults.length ? sortStageResults(stageResults, stageOrder) : undefined
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



