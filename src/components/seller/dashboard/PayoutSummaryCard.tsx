import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { PayoutSnapshot } from '@/types/seller'
import { ArrowUpRight, Banknote, PiggyBank, Shield, Sparkles } from 'lucide-react'

type PayoutSummaryCardProps = {
  snapshot: PayoutSnapshot
  onManagePayouts?: () => void
}

const statusColor: Record<PayoutSnapshot['historyPreview'][number]['status'], string> = {
  pending: 'text-amber-500',
  processing: 'text-blue-500',
  paid: 'text-emerald-500',
  failed: 'text-red-500'
}

export function PayoutSummaryCard({ snapshot, onManagePayouts }: PayoutSummaryCardProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <PiggyBank className="h-5 w-5 text-primary" />
              Earnings & payouts
            </CardTitle>
            <CardDescription>
              Keep payouts flowing by staying compliant and monitoring marketplace fees.
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={onManagePayouts}>
            Manage
            <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Pending payout</span>
            <span>${snapshot.pendingAmount.toFixed(2)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Next payout {snapshot.nextPayoutDate ? new Date(snapshot.nextPayoutDate).toLocaleDateString() : '—'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-background/60 p-3">
            <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
              <Banknote className="h-4 w-4 text-primary" />
              Lifetime earnings
            </div>
            <p className="mt-1 text-lg font-semibold">${snapshot.lifetimeEarnings.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/60 p-3">
            <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              Fee split
            </div>
            <p className="mt-1 text-lg font-semibold">
              {snapshot.feeSplit.sellerPercent}% seller / {snapshot.feeSplit.platformPercent}% platform
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
            <span>Payout method</span>
            {snapshot.payoutMethod ? (
              <Badge variant="secondary" className="text-[11px]">
                {snapshot.payoutMethod}
              </Badge>
            ) : (
              <span className="text-red-500">Add method</span>
            )}
          </div>
          <Separator />
          <div className="space-y-3">
            {snapshot.historyPreview.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">${entry.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.scheduledFor).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-medium ${statusColor[entry.status]}`}>
                  {entry.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-primary/40 p-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            Tip
          </div>
          <p className="mt-1">
            Sellers with on-time tax forms and verified payout methods get featured placement in marketplace promos.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


