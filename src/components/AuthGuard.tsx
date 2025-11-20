import React, { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { Loader2, Shield } from 'lucide-react'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { currentUser, loading } = useAuth()
  
  // DEMO MODE: Allow access without login
  const DEMO_MODE = true // Set to false in production

  // Show loading spinner while checking authentication
  if (loading && !DEMO_MODE) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    )
  }

  // DEMO MODE: Allow access without authentication
  if (DEMO_MODE) {
    return <>{children}</>
  }

  // PRODUCTION MODE: Require authentication
  // If user is not authenticated, show fallback or redirect
  if (!currentUser) {
    if (fallback) {
      return <>{fallback}</>
    }

    // Default: redirect to login using hash routing
    React.useEffect(() => {
      window.location.hash = '#login'
    }, [])

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center">
            <Shield className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </motion.div>
      </div>
    )
  }

  // User is authenticated, render children
  return <>{children}</>
}

// Hook for checking authentication status
export function useAuthGuard() {
  const { currentUser, loading } = useAuth()
  
  return {
    isAuthenticated: !!currentUser,
    isLoading: loading,
    user: currentUser
  }
}
