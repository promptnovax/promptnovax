/**
 * Simple in-memory rate limiter
 * In production, use Redis or similar
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 100, // 100 requests
  windowMs: 60 * 1000 // per minute
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier
  const record = store[key]

  // Clean expired records
  if (record && now > record.resetTime) {
    delete store[key]
  }

  const current = store[key]

  if (!current) {
    // First request
    store[key] = {
      count: 1,
      resetTime: now + config.windowMs
    }
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs
    }
  }

  if (current.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime
    }
  }

  // Increment count
  current.count++
  return {
    allowed: true,
    remaining: config.maxRequests - current.count,
    resetTime: current.resetTime
  }
}

export function getClientIdentifier(req: any): string {
  // Use IP address or API key as identifier
  return req.headers['x-api-key'] || 
         req.ip || 
         req.headers['x-forwarded-for']?.split(',')[0] || 
         'anonymous'
}

