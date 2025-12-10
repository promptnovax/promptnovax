import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DemoModeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            <strong>Demo Mode:</strong> Supabase is not configured.
            Connect your project to Supabase to unlock authentication, storage, and live marketplace data.
          </p>
        </div>
        <div className="ml-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://supabase.com/dashboard/projects', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Set up Supabase
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
