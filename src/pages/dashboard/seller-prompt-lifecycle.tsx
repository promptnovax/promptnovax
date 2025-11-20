import { useState } from 'react'
import { PromptLifecycleBoard } from '@/components/seller/dashboard/PromptLifecycleBoard'
import { sellerDashboardMock } from '@/data/sellerDashboard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function SellerPromptLifecyclePage() {
  const [summary] = useState(() => sellerDashboardMock)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.hash = '#dashboard/seller'}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Prompt Lifecycle</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your prompts across different stages
          </p>
        </div>
      </div>

      {/* Full Lifecycle Board */}
      <PromptLifecycleBoard
        columns={summary.lifecycle}
        onOpenPrompt={(promptId) => {
          window.location.hash = `#dashboard/seller/prompts/${promptId}`
        }}
      />
    </div>
  )
}

