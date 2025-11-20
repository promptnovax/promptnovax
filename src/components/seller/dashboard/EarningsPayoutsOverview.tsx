import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, PiggyBank, TrendingUp, Calendar } from 'lucide-react'
import type { PayoutSnapshot } from '@/types/seller'

type EarningsPayoutsOverviewProps = {
  snapshot: PayoutSnapshot
  onViewFull?: () => void
}

export function EarningsPayoutsOverview({ snapshot, onViewFull }: EarningsPayoutsOverviewProps) {
  return (
    <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group" onClick={onViewFull}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <PiggyBank className="h-5 w-5 text-primary" />
              Earnings & Payouts
            </CardTitle>
            <CardDescription className="mt-1">
              Track your revenue and payouts
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5">
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pending Payout</span>
              <span className="text-xl font-bold">${snapshot.pendingAmount.toFixed(2)}</span>
            </div>
            {snapshot.nextPayoutDate && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Next payout: {new Date(snapshot.nextPayoutDate).toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-background/60 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <TrendingUp className="h-3 w-3" />
                Lifetime
              </div>
              <p className="text-lg font-semibold">${snapshot.lifetimeEarnings.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border bg-background/60 p-3">
              <div className="text-xs text-muted-foreground mb-1">Fee Split</div>
              <p className="text-sm font-semibold">
                {snapshot.feeSplit.sellerPercent}% / {snapshot.feeSplit.platformPercent}%
              </p>
            </div>
          </div>
          
          {snapshot.payoutMethod && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Payout Method</span>
              <Badge variant="secondary" className="text-[10px]">
                {snapshot.payoutMethod}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

