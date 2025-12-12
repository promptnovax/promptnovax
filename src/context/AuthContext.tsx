import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'
import { postJson } from '@/lib/utils'

type UserRoleType = 'seller' | 'buyer'

interface AuthUser {
  uid: string
  email?: string
  displayName?: string | null
  photoURL?: string | null
  role?: UserRoleType
  createdAt?: string
}

interface UserRole {
  role: UserRoleType
  createdAt: string | null
}

interface AuthContextType {
  currentUser: AuthUser | null
  userRole: UserRole | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (
    email: string,
    password: string,
    role?: UserRoleType,
    displayName?: string
  ) => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  updateRole: (role: UserRoleType, displayName?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

const DEMO_USER_STORAGE_KEY = 'promptnx-demo-user'
const API_SESSION_STORAGE_KEY = 'promptnx-session-meta'

interface BackendAuthUser {
  id: string
  email?: string
  role?: UserRoleType
  displayName?: string | null
  avatarUrl?: string | null
  createdAt?: string | null
}

interface BackendAuthSession {
  id?: string | null
  accessToken: string
  refreshToken: string
  expiresAt?: string | null
}

interface AuthApiResponse {
  user?: BackendAuthUser | null
  session?: BackendAuthSession | null
  message?: string
}

interface SessionMeta {
  sessionId?: string | null
  userId?: string | null
}

const createDemoUser = (
  email: string,
  role: UserRoleType = 'buyer',
  displayName?: string
): AuthUser => ({
  uid: `demo-${email}`,
  email,
  displayName: displayName || email.split('@')[0],
  role,
  createdAt: new Date().toISOString()
})

const loadStoredDemoUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem(DEMO_USER_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as AuthUser) : null
  } catch {
    return null
  }
}

const persistDemoUser = (user: AuthUser | null) => {
  if (typeof window === 'undefined') return
  try {
    if (user) {
      window.localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(DEMO_USER_STORAGE_KEY)
    }
  } catch {
    // no-op
  }
}

const loadSessionMeta = (): SessionMeta | null => {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem(API_SESSION_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as SessionMeta) : null
  } catch {
    return null
  }
}

const persistSessionMeta = (meta: SessionMeta | null) => {
  if (typeof window === 'undefined') return
  try {
    if (meta) {
      window.localStorage.setItem(API_SESSION_STORAGE_KEY, JSON.stringify(meta))
    } else {
      window.localStorage.removeItem(API_SESSION_STORAGE_KEY)
    }
  } catch {
    // ignore
  }
}

const mapSupabaseUser = (user: any): AuthUser | null => {
  if (!user) return null
  return {
    uid: user.id,
    email: user.email,
    displayName: user.user_metadata?.full_name || user.user_metadata?.display_name || user.email?.split('@')[0],
    photoURL: user.user_metadata?.avatar_url || null,
    role: user.user_metadata?.role || 'buyer',
    createdAt: user.created_at || null
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (!isSupabaseConfigured) {
      return loadStoredDemoUser()
    }
    return null
  })
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionMeta, setSessionMeta] = useState<SessionMeta | null>(() => loadSessionMeta())

  const mapBackendUser = (user?: BackendAuthUser | null): AuthUser | null => {
    if (!user) return null
    return {
      uid: user.id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      photoURL: user.avatarUrl,
      createdAt: user.createdAt ?? undefined
    }
  }

  const applyBackendSession = async (session?: BackendAuthSession | null) => {
    if (!session) {
      setSessionMeta(null)
      persistSessionMeta(null)
      return
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.setSession({
          access_token: session.accessToken,
          refresh_token: session.refreshToken
        })
      } catch (error) {
        console.warn('Failed to set Supabase session', error)
      }
    }

    const meta: SessionMeta = {
      sessionId: session.id ?? null
    }
    setSessionMeta(meta)
    persistSessionMeta(meta)
  }

  const handleAuthSuccess = async (
    payload: AuthApiResponse,
    fallbackRole: UserRoleType = 'buyer',
    requireSession = true
  ) => {
    if (!payload.user) {
      throw new Error('Authentication response did not include a user')
    }
    if (requireSession && !payload.session) {
      throw new Error(payload.message || 'Account requires email confirmation before login.')
    }

    await applyBackendSession(payload.session)
    const mappedUser = mapBackendUser(payload.user)
    setCurrentUser(mappedUser)
    setUserRole(
      mappedUser
        ? {
            role: (mappedUser.role as UserRoleType) || fallbackRole,
            createdAt: mappedUser.createdAt || null
          }
        : null
    )
  }

  const updateRole = async (role: UserRoleType, displayName?: string) => {
    if (!currentUser) {
      throw new Error('No authenticated user to update role')
    }

    if (!isSupabaseConfigured || !supabase) {
      const updatedUser: AuthUser = {
        ...currentUser,
        role,
        displayName: displayName || currentUser.displayName
      }
      setCurrentUser(updatedUser)
      setUserRole({ role, createdAt: updatedUser.createdAt || null })
      persistDemoUser(updatedUser)
      return
    }

    const response = await postJson<AuthApiResponse>('/api/auth/update-role', {
      userId: currentUser.uid,
      role,
      displayName
    })

    if (!response.user) {
      throw new Error(response.message || 'Failed to update role')
    }

    const mappedUser = mapBackendUser(response.user)
    setCurrentUser(mappedUser)
    setUserRole(
      mappedUser
        ? {
            role: (mappedUser.role as UserRoleType) || role,
            createdAt: mappedUser.createdAt || null
          }
        : null
    )
  }

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      const demoUser = createDemoUser(email)
      setCurrentUser(demoUser)
      setUserRole({ role: demoUser.role || 'buyer', createdAt: demoUser.createdAt || null })
      persistDemoUser(demoUser)
      return
    }

    const response = await postJson<AuthApiResponse>('/api/auth/login', { email, password })
    await handleAuthSuccess(response)
  }

  const signup = async (
    email: string,
    password: string,
    role: UserRoleType = 'buyer',
    displayName?: string
  ) => {
    if (!isSupabaseConfigured || !supabase) {
      const demoUser = createDemoUser(email, role, displayName)
      setCurrentUser(demoUser)
      setUserRole({ role, createdAt: demoUser.createdAt || null })
      persistDemoUser(demoUser)
      return
    }

    const response = await postJson<AuthApiResponse>('/api/auth/signup', {
      email,
      password,
      role,
      displayName
    })
    await handleAuthSuccess(response, role, false)
  }

  const logout = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setCurrentUser(null)
      setUserRole(null)
      persistDemoUser(null)
      return
    }

    await postJson<{ success: boolean }>('/api/auth/logout', {
      userId: currentUser?.uid,
      sessionId: sessionMeta?.sessionId
    })

    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.warn('Supabase logout warning:', error)
    }
    setCurrentUser(null)
    setUserRole(null)
    setSessionMeta(null)
    persistSessionMeta(null)
  }

  const loginWithGoogle = async () => {
    if (!isSupabaseConfigured || !supabase) {
      const demoUser = createDemoUser('guest@example.com', 'buyer', 'Demo User')
      setCurrentUser(demoUser)
      setUserRole({ role: 'buyer', createdAt: demoUser.createdAt || null })
      persistDemoUser(demoUser)
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
        }
    })

    if (error) {
      console.error('Supabase Google login error:', error)
      throw error
    }
  }

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setUserRole((prev) => {
        if (prev) return prev
        const demoUser = loadStoredDemoUser()
        return demoUser ? { role: demoUser.role || 'buyer', createdAt: demoUser.createdAt || null } : null
      })
      setLoading(false)
      return
    }

    let isMounted = true

    const initSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return
      const mappedUser = mapSupabaseUser(data.session?.user || null)
      setCurrentUser(mappedUser)
      setUserRole(
        mappedUser ? { role: mappedUser.role || 'buyer', createdAt: mappedUser.createdAt || null } : null
      )
      setLoading(false)
    }

    void initSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const mappedUser = mapSupabaseUser(session?.user || null)
      setCurrentUser(mappedUser)
      setUserRole(
        mappedUser ? { role: mappedUser.role || 'buyer', createdAt: mappedUser.createdAt || null } : null
      )
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const contextValue = useMemo<AuthContextType>(() => ({
    currentUser,
    userRole,
    loading,
    login,
    signup,
    logout,
    loginWithGoogle,
    updateRole
  }), [currentUser, userRole, loading])

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}