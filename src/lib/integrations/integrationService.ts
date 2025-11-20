/**
 * Integration Service
 * Manages API keys and provider connections
 */

import { AIProvider, IntegrationCredentials, AI_PROVIDERS } from './aiProviders'

const STORAGE_KEY = 'pnx_seller_integrations'

export interface StoredIntegrations {
  [providerId: string]: IntegrationCredentials
}

/**
 * Load integrations from localStorage
 */
export function loadIntegrations(): StoredIntegrations {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

/**
 * Save integrations to localStorage
 */
export function saveIntegrations(integrations: StoredIntegrations): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(integrations))
  } catch (error) {
    console.error('Failed to save integrations:', error)
  }
}

/**
 * Add or update an integration
 */
export function upsertIntegration(credentials: IntegrationCredentials): void {
  const integrations = loadIntegrations()
  integrations[credentials.providerId] = {
    ...credentials,
    lastUsed: new Date().toISOString()
  }
  saveIntegrations(integrations)
}

/**
 * Remove an integration
 */
export function removeIntegration(providerId: AIProvider): void {
  const integrations = loadIntegrations()
  delete integrations[providerId]
  saveIntegrations(integrations)
}

/**
 * Get active integrations
 */
export function getActiveIntegrations(): IntegrationCredentials[] {
  const integrations = loadIntegrations()
  return Object.values(integrations).filter(i => i.isActive)
}

/**
 * Get integration by provider
 */
export function getIntegration(providerId: AIProvider): IntegrationCredentials | null {
  const integrations = loadIntegrations()
  return integrations[providerId] || null
}

/**
 * Validate API key format (basic validation)
 */
export function validateApiKey(providerId: AIProvider, apiKey: string): { valid: boolean; error?: string } {
  if (!apiKey || apiKey.trim().length < 10) {
    return { valid: false, error: 'API key is too short' }
  }

  const provider = AI_PROVIDERS[providerId]
  if (!provider) {
    return { valid: false, error: 'Unknown provider' }
  }

  // Basic format checks
  if (providerId === 'openai' && !apiKey.startsWith('sk-')) {
    return { valid: false, error: 'OpenAI keys should start with "sk-"' }
  }

  if (providerId === 'anthropic' && !apiKey.startsWith('sk-ant-')) {
    return { valid: false, error: 'Anthropic keys should start with "sk-ant-"' }
  }

  if (providerId === 'openrouter' && !apiKey.startsWith('sk-or-')) {
    return { valid: false, error: 'OpenRouter keys should start with "sk-or-"' }
  }

  return { valid: true }
}

/**
 * Test API key by making a minimal request
 * Note: This would call your backend API in production
 */
export async function testApiKey(
  providerId: AIProvider,
  apiKey: string
): Promise<{ success: boolean; error?: string }> {
  // In production, this would call your backend
  // Backend would make a test request to the provider
  try {
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const validation = validateApiKey(providerId, apiKey)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // In real implementation, backend would test the key
    // For now, we'll just validate format
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to test API key' }
  }
}

