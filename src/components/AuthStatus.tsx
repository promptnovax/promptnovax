import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { User, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface AuthStatusProps {
  showLogout?: boolean
  className?: string
}

export function AuthStatus({ showLogout = true, className = "" }: AuthStatusProps) {
  const { currentUser, logout, loading } = useAuth()
  const { success, error } = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      success("Logged out successfully", "See you next time!")
    } catch (err: any) {
      error("Logout failed", err.message || "Please try again")
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Not logged in</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center space-x-3 ${className}`}
    >
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-primary" />
        <div className="text-sm">
          <div className="font-medium">{currentUser.displayName || 'User'}</div>
          <div className="text-muted-foreground text-xs">{currentUser.email}</div>
        </div>
      </div>
      {showLogout && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="h-8 px-2"
        >
          <LogOut className="h-3 w-3" />
        </Button>
      )}
    </motion.div>
  )
}

// Hook for getting authentication status
export function useAuthStatus() {
  const { currentUser, loading } = useAuth()
  
  return {
    isAuthenticated: !!currentUser,
    isLoading: loading,
    user: currentUser,
    userEmail: currentUser?.email,
    userName: currentUser?.displayName || currentUser?.email?.split('@')[0]
  }
}
