// Example API route usage with Supabase helpers.
// This file shows how to use the Supabase helpers in your API routes.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const serverClient = supabaseUrl && serviceKey
  ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  : null

/**
 * Example API route that requires authentication.
 * Place this in pages/api/ or app/api/ directory.
 */
export async function GET(request: NextRequest) {
  if (!serverClient) {
    return NextResponse.json(
      { error: 'Supabase server client is not configured' },
      { status: 500 }
    )
  }

  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No valid authorization header' },
        { status: 401 }
      )
    }

    // Extract the ID token
    const idToken = authHeader.split('Bearer ')[1]
    
    // Verify the token against Supabase
    const { data, error: authError } = await serverClient.auth.getUser(idToken)
    
    if (authError || !data?.user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Token is valid, proceed with authenticated logic
    return NextResponse.json({
      message: 'Authenticated successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name
      }
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Example of how to use Supabase client-side.
 * This would be used in your React components.
 */
export const clientSideExample = `
// In your React component
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

// Sign in user
const handleSignIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const session = data.session
    
    // Store token for API calls
    localStorage.setItem('supabaseToken', session?.access_token || '')
    
    return data.user
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

// Sign out user
const handleSignOut = async () => {
  try {
    await supabase.auth.signOut()
    localStorage.removeItem('supabaseToken')
  } catch (error) {
    console.error('Sign out error:', error)
  }
}

// Make authenticated API call
const makeAuthenticatedRequest = async () => {
  const token = localStorage.getItem('supabaseToken')
  
  const response = await fetch('/api/protected-route', {
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  })
  
  return response.json()
}
`
