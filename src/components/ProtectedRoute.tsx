import React, { ReactNode } from 'react'
import { AuthGuard } from './AuthGuard'
import { motion } from 'framer-motion'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  return (
    <AuthGuard fallback={fallback}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AuthGuard>
  )
}

// Example usage in a dashboard component:
export function ExampleProtectedDashboard() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Protected Dashboard</h1>
        <p className="text-muted-foreground">
          This content is only visible to authenticated users.
        </p>
      </div>
    </ProtectedRoute>
  )
}
