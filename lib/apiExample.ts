// Example API route usage with Firebase helpers
// This file shows how to use the Firebase helpers in your API routes

import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from './serverHelpers'

/**
 * Example API route that requires authentication
 * Place this in pages/api/ or app/api/ directory
 */
export async function GET(request: NextRequest) {
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
    
    // Verify the token
    const decodedToken = await verifyIdToken(idToken)
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Token is valid, proceed with authenticated logic
    return NextResponse.json({
      message: 'Authenticated successfully',
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name
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
 * Example of how to use Firebase client-side
 * This would be used in your React components
 */
export const clientSideExample = `
// In your React component
import { firebaseAuth } from '@/lib/firebaseClient'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

// Sign in user
const handleSignIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password)
    const idToken = await userCredential.user.getIdToken()
    
    // Store token for API calls
    localStorage.setItem('firebaseToken', idToken)
    
    return userCredential.user
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

// Sign out user
const handleSignOut = async () => {
  try {
    await signOut(firebaseAuth)
    localStorage.removeItem('firebaseToken')
  } catch (error) {
    console.error('Sign out error:', error)
  }
}

// Make authenticated API call
const makeAuthenticatedRequest = async () => {
  const token = localStorage.getItem('firebaseToken')
  
  const response = await fetch('/api/protected-route', {
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  })
  
  return response.json()
}
`
