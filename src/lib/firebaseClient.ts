import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

const clientConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef'
}

// Check if we have valid Firebase configuration
const hasValidConfig = clientConfig.apiKey && 
  clientConfig.apiKey !== 'your_api_key_here' && 
  clientConfig.apiKey !== 'demo-key'

let firebaseApp = null

// Initialize Firebase App only if no apps exist and we have valid config
if (!getApps().length && hasValidConfig) {
  try {
    firebaseApp = initializeApp(clientConfig)
  } catch (error) {
    console.warn('Firebase initialization failed:', error)
  }
}

// Export Firebase services with fallback handling
export const firebaseAuth = hasValidConfig ? getAuth() : null
export const firebaseStorage = hasValidConfig ? getStorage() : null
export const firebaseDb = hasValidConfig ? getFirestore() : null

// Export configuration status
export const isFirebaseConfigured = hasValidConfig
