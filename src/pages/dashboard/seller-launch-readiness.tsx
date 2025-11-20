import { useState } from 'react'
import { OnboardingChecklist } from '@/components/seller/dashboard/OnboardingChecklist'
import { sellerDashboardMock } from '@/data/sellerDashboard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function SellerLaunchReadinessPage() {
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
          <h1 className="text-2xl font-semibold tracking-tight">Launch Readiness</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete these steps to unlock marketplace featured placement
          </p>
        </div>
      </div>

      {/* Full Checklist */}
      <OnboardingChecklist
        completionPercent={summary.profile.completionPercent}
        items={summary.profile.checklist}
      />
    </div>
  )
}

