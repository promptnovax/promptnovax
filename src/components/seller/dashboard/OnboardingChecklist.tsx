import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { SellerChecklistItem } from '@/types/seller'
import { ArrowUpRight, CheckCircle2, CircleDashed, Loader2 } from 'lucide-react'

type OnboardingChecklistProps = {
  completionPercent: number
  items: SellerChecklistItem[]
}

const statusIcon: Record<SellerChecklistItem['status'], { icon: React.ReactNode; badge: string }> = {
  todo: {
    icon: <CircleDashed className="h-4 w-4 text-muted-foreground" />,
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  },
  in_progress: {
    icon: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
    badge: 'bg-primary/10 text-primary'
  },
  done: {
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  }
}

export function OnboardingChecklist({ completionPercent, items }: OnboardingChecklistProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-lg">Launch readiness</CardTitle>
        <CardDescription>Complete these steps to unlock marketplace featured placement.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Profile completion</span>
            <span>{completionPercent}%</span>
          </div>
          <Progress value={completionPercent} className="mt-2 h-2" />
        </div>
        <div className="space-y-3">
          {items.map((item) => {
            const status = statusIcon[item.status]
            return (
              <div
                key={item.id}
                className="rounded-lg border border-border/70 bg-muted/30 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold leading-tight">
                      {status.icon}
                      {item.label}
                      <Badge className={status.badge} variant="secondary">
                        {item.status === 'done'
                          ? 'Completed'
                          : item.status === 'in_progress'
                            ? 'In progress'
                            : 'Action needed'}
                      </Badge>
                    </div>
                    {item.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                  {item.cta && item.status !== 'done' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        window.location.hash = item.cta?.href ?? '#'
                      }}
                    >
                      {item.cta.label}
                      <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}


