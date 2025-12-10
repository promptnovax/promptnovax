import React, { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  fallback?: ReactNode
  redirectTo?: string
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback, 
  redirectTo = '#unauthorized' 
}: RoleGuardProps) {
  const { currentUser, userRole, loading } = useAuth()

  // Show loading spinner while checking authentication and role
  if (loading) {
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

  // If user is not authenticated, redirect to login
  if (!currentUser) {
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

  // If user doesn't have a role or role is not allowed
  const roleAllowed = userRole && allowedRoles.includes(userRole.role)
  if (!roleAllowed) {
    if (fallback) {
      return <>{fallback}</>
    }

    // Default: redirect to unauthorized page
    React.useEffect(() => {
      window.location.hash = redirectTo
    }, [redirectTo])

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-6 max-w-md mx-auto px-4"
        >
          <div className="flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Required role: {allowedRoles.join(' or ')}
              {userRole && ` • Your role: ${userRole.role}`}
            </p>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={() => window.location.hash = '#home'}
              className="w-full"
            >
              Go to Home
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.hash = '#dashboard'}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // User has the required role, render children
  return <>{children}</>
}

// Hook for checking role permissions
export function useRoleGuard(allowedRoles: string[]) {
  const { currentUser, userRole, loading } = useAuth()
  
  const hasPermission = userRole && allowedRoles.includes(userRole.role)
  const isAuthenticated = !!currentUser
  
  return {
    hasPermission,
    isAuthenticated,
    isLoading: loading,
    userRole: userRole?.role,
    user: currentUser
  }
}
