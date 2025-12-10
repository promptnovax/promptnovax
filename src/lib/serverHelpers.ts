/**
 * Placeholder server helpers while Supabase migration is in progress.
 * These helpers previously proxied Firebase Admin features. Implementations
 * will be added once the Supabase service role workflow is finalized.
 */

export async function verifyIdToken(_token: string) {
  console.warn('verifyIdToken is not implemented because Firebase has been removed.')
  return null
}

export async function getUserByUid(_uid: string) {
  console.warn('getUserByUid is not implemented because Firebase has been removed.')
  return null
}

export async function createCustomToken(_uid: string, _claims?: object) {
  throw new Error('createCustomToken is not implemented. Supabase migration pending.')
}
