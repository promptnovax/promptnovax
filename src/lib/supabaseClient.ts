import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let client: SupabaseClient | null = null

if (isSupabaseConfigured) {
  client = createClient(supabaseUrl!, supabaseAnonKey!)
} else {
  console.warn(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live data.'
  )
}

export const supabase = client

export function requireSupabase() {
  if (!client) {
    throw new Error('Supabase is not configured for this environment.')
  }
  return client
}

