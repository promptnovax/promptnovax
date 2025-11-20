import { useMemo, useState } from 'react'
import { AlertsCenter } from '@/components/seller/dashboard/AlertsCenter'
import { EducationSpotlight } from '@/components/seller/dashboard/EducationSpotlight'
import { FeedbackHighlights } from '@/components/seller/dashboard/FeedbackHighlights'
import { OnboardingChecklist } from '@/components/seller/dashboard/OnboardingChecklist'
import { PayoutSummaryCard } from '@/components/seller/dashboard/PayoutSummaryCard'
import { PromptLifecycleOverview } from '@/components/seller/dashboard/PromptLifecycleOverview'
import { LaunchReadinessOverview } from '@/components/seller/dashboard/LaunchReadinessOverview'
import { EarningsPayoutsOverview } from '@/components/seller/dashboard/EarningsPayoutsOverview'
import { SellerDashboardHeader } from '@/components/seller/dashboard/SellerDashboardHeader'
import { SellerKpiStrip } from '@/components/seller/dashboard/SellerKpiStrip'
import { TestingQueueWidget } from '@/components/seller/dashboard/TestingQueueWidget'
import { sellerDashboardMock } from '@/data/sellerDashboard'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, CreditCard, FileText, Settings, Sparkles, TestTube, Users } from 'lucide-react'

export function SellerDashboard() {
  const { currentUser } = useAuth()
  const { success } = useToast()
  const [summary] = useState(() => sellerDashboardMock)

  const sellerName = useMemo(
    () => currentUser?.displayName || currentUser?.email?.split('@')[0] || summary.profile.name,
    [currentUser, summary.profile.name]
  )

  const handleCreatePrompt = () => {
    success('Prompt Studio', 'Launching creation workspace…')
    window.location.hash = '#dashboard/seller/prompt-studio'
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <SellerDashboardHeader
        name={sellerName}
        avatarUrl={summary.profile.avatarUrl}
        verificationStatus={summary.profile.verificationStatus}
        completionPercent={summary.profile.completionPercent}
        onCreatePrompt={handleCreatePrompt}
        onRequestPayout={() => {
          window.location.hash = '#dashboard/seller/payouts'
        }}
        onOpenSupport={() => {
          window.location.hash = '#dashboard/seller/support'
        }}
      />

      {/* KPI Metrics */}
      <SellerKpiStrip items={summary.kpis} />

      {/* Quick Access Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Prompt Lifecycle Overview */}
        <PromptLifecycleOverview
          columns={summary.lifecycle}
          onViewFullLifecycle={() => {
            window.location.hash = '#dashboard/seller/prompt-lifecycle'
          }}
        />

        {/* Prompt Studio Card */}
        <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group" onClick={handleCreatePrompt}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Prompt Studio
                </CardTitle>
                <CardDescription className="mt-1">
                  Create and edit your prompts
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Draft Prompts</span>
                <span className="font-semibold">
                  {summary.lifecycle.find(c => c.stage === 'drafts')?.prompts.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">In Testing</span>
                <span className="font-semibold">
                  {summary.lifecycle.find(c => c.stage === 'testing')?.prompts.length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testing Lab Card */}
        <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => window.location.hash = '#dashboard/seller/testing'}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TestTube className="h-5 w-5 text-primary" />
                  Testing Lab
                </CardTitle>
                <CardDescription className="mt-1">
                  Test and validate your prompts
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Tests</span>
                <span className="font-semibold">{summary.testing.totalActive}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg. Time</span>
                <span className="font-semibold">{summary.testing.avgTurnaroundMinutes}m</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - Main Content (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Testing Queue Widget */}
          <TestingQueueWidget
            snapshot={summary.testing}
            onViewDetails={(runId) => {
              window.location.hash = `#dashboard/seller/testing?runId=${runId}`
            }}
          />

          {/* Feedback Highlights */}
          <FeedbackHighlights feedback={summary.feedback} />
        </div>

        {/* Right Column - Sidebar (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Launch Readiness Overview */}
          <LaunchReadinessOverview
            completionPercent={summary.profile.completionPercent}
            items={summary.profile.checklist}
            onViewFull={() => {
              window.location.hash = '#dashboard/seller/launch-readiness'
            }}
          />

          {/* Earnings & Payouts Overview */}
          <EarningsPayoutsOverview
            snapshot={summary.payouts}
            onViewFull={() => {
              window.location.hash = '#dashboard/seller/payouts'
            }}
          />

          {/* Education Spotlight */}
          <EducationSpotlight
            snapshot={summary.education}
            onOpenAcademy={() => {
              success('Academy', 'Browse advanced courses.')
              window.location.hash = '#/academy'
            }}
          />

          {/* Alerts Center */}
          <AlertsCenter alerts={summary.alerts} />
        </div>
      </div>
    </div>
  )
}
