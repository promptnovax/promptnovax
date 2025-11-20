import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { SellerAlert } from '@/types/seller'
import { AlertTriangle, CheckCircle2, FileWarning, LifeBuoy } from 'lucide-react'

type AlertsCenterProps = {
  alerts: SellerAlert[]
}

const severityConfig: Record<SellerAlert['severity'], { label: string; badgeClass: string }> = {
  info: { label: 'Info', badgeClass: 'bg-primary/10 text-primary' },
  warning: { label: 'Warning', badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  critical: { label: 'Critical', badgeClass: 'bg-red-500/10 text-red-600 dark:text-red-400' }
}

const typeIcon: Record<SellerAlert['type'], React.ComponentType<{ className?: string }>> = {
  compliance: FileWarning,
  payout: LifeBuoy,
  review: CheckCircle2,
  feature: AlertTriangle
}

export function AlertsCenter({ alerts }: AlertsCenterProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-lg">Action center</CardTitle>
        <CardDescription>Resolve alerts quickly to keep prompts live and payouts smooth.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/20 p-6 text-center text-sm text-muted-foreground">
            All clear — no actions required.
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = typeIcon[alert.type]
            const severity = severityConfig[alert.severity]
            return (
              <div
                key={alert.id}
                className="rounded-lg border border-border/70 bg-muted/30 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold">{alert.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                  <Badge variant="secondary" className={severity.badgeClass}>
                    {severity.label}
                  </Badge>
                </div>
                {alert.cta && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => {
                      window.location.hash = alert.cta?.href ?? '#'
                    }}
                  >
                    {alert.cta.label}
                  </Button>
                )}
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}


