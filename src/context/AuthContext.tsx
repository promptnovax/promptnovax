import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { firebaseAuth, firebaseDb, isFirebaseConfigured } from '../lib/firebaseClient'

interface UserRole {
  role: 'seller' | 'buyer' | 'both'
  createdAt: any
}

interface AuthContextType {
  currentUser: User | null
  userRole: UserRole | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (
    email: string,
    password: string,
    role?: 'seller' | 'buyer' | 'both',
    displayName?: string
  ) => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      throw new Error('Firebase not configured. Please set up your Firebase project.')
    }
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const signup = async (
    email: string,
    password: string,
    role: 'seller' | 'buyer' | 'both' = 'buyer',
    displayName?: string
  ) => {
    if (!isFirebaseConfigured || !firebaseAuth || !firebaseDb) {
      throw new Error('Firebase not configured. Please set up your Firebase project.')
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
      const user = userCredential.user
      if (displayName) {
        await updateProfile(user, { displayName })
      }

      await setDoc(doc(firebaseDb, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.email?.split('@')[0],
        role: role,
        createdAt: serverTimestamp()
      })

      // Create role documents accordingly
      if (role === 'seller' || role === 'both') {
        await setDoc(doc(firebaseDb, 'sellers', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: displayName || '',
          createdAt: serverTimestamp()
        })
      }
      if (role === 'buyer' || role === 'both') {
        await setDoc(doc(firebaseDb, 'buyers', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: displayName || '',
          createdAt: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const logout = async () => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      setUserRole(null)
      return
    }
    try {
      await signOut(firebaseAuth)
      setUserRole(null)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !firebaseAuth || !firebaseDb) {
      throw new Error('Firebase not configured. Please set up your Firebase project.')
    }
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(firebaseAuth, provider)
      const user = userCredential.user

      const userDocRef = doc(firebaseDb, 'users', user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          role: 'buyer',
          createdAt: serverTimestamp()
        })

        await setDoc(doc(firebaseDb, 'buyers', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          createdAt: serverTimestamp()
        })

        await setDoc(doc(firebaseDb, 'usernames', user.uid), {
          uid: user.uid,
          displayName: user.displayName || user.email?.split('@')[0] || '',
          email: user.email,
          createdAt: serverTimestamp()
        })
      } else {
        const existing = userDoc.data()
        if (!existing.displayName && (user.displayName || user.email)) {
          await setDoc(
            userDocRef,
            { ...existing, displayName: user.displayName || user.email?.split('@')[0] },
            { merge: true }
          )
        }
      }
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    }
  }

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      console.warn('Firebase not configured, using demo mode')
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setCurrentUser(user)

      if (user && firebaseDb) {
        try {
          const userDocRef = doc(firebaseDb, 'users', user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUserRole({ role: userData.role, createdAt: userData.createdAt })
          } else {
            setUserRole(null)
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
          setUserRole(null)
        }
      } else {
        setUserRole(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    currentUser,
    userRole,
    loading,
    login,
    signup,
    logout,
    loginWithGoogle
  }

  return (
    <AuthContext.Provider value={value}>
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