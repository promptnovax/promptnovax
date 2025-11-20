import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Home, ArrowLeft, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function UnauthorizedPage() {
  const { userRole } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-destructive/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-3 rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl">Access Denied</CardTitle>
              <CardDescription className="text-base">
                You don't have permission to access this page.
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {userRole && (
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Your current role:</span>
                  <span className="font-medium capitalize">{userRole.role}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.hash = '#home'}
                className="w-full"
                size="lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.hash = '#dashboard'}
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                If you believe this is an error, please contact support.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
