import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.warn('Missing Supabase URL. Please set VITE_SUPABASE_URL in your env file.')
}

if (!supabaseAnonKey) {
  console.warn('Missing Supabase anon key. Please set VITE_SUPABASE_ANON_KEY in your env file.')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

