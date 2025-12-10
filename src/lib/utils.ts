import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple API helper for OTP server
// Default to backend on port 8080; override with VITE_API_BASE for deployed envs.
export const apiBaseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

export async function postJson<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }
  return (await res.json()) as T
}