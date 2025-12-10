/**
 * Simple in-memory cache with TTL
 * In production, use Redis
 */

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const cache = new Map<string, CacheEntry<any>>()

export function setCache<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs
  })
}

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key)
  
  if (!entry) {
    return null
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }

  return entry.data as T
}

export function generateCacheKey(params: any): string {
  // Create a deterministic key from request parameters
  const keyParts = [
    params.provider,
    params.model,
    params.userPrompt?.substring(0, 100), // First 100 chars
    params.systemPrompt?.substring(0, 50),
    params.temperature,
    params.maxTokens,
    params.workflow
  ]
  return `api_studio:${JSON.stringify(keyParts)}`
}

export function clearCache(): void {
  cache.clear()
}

// Clean expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      cache.delete(key)
    }
  }
}, 60 * 1000) // Every minute

