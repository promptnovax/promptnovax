import { adminAuth } from './firebaseAdmin'

/**
 * Verify Firebase ID token on the server side
 * @param idToken - The Firebase ID token to verify
 * @returns Decoded token data or null if verification fails
 */
export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    return decodedToken
  } catch (error) {
    console.error('Error verifying ID token:', error)
    return null
  }
}

/**
 * Get user data from Firebase Auth by UID
 * @param uid - The user's Firebase UID
 * @returns User record or null if not found
 */
export async function getUserByUid(uid: string) {
  try {
    const userRecord = await adminAuth.getUser(uid)
    return userRecord
  } catch (error) {
    console.error('Error getting user by UID:', error)
    return null
  }
}

/**
 * Create a custom token for a user
 * @param uid - The user's Firebase UID
 * @param additionalClaims - Additional claims to include in the token
 * @returns Custom token string
 */
export async function createCustomToken(uid: string, additionalClaims?: object) {
  try {
    const customToken = await adminAuth.createCustomToken(uid, additionalClaims)
    return customToken
  } catch (error) {
    console.error('Error creating custom token:', error)
    throw error
  }
}
