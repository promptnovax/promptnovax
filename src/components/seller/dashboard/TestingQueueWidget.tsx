import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { TestingQueueSnapshot } from '@/types/seller'
import { Activity, Clock, Gauge, PlayCircle } from 'lucide-react'

type TestingQueueWidgetProps = {
  snapshot: TestingQueueSnapshot
  onViewDetails?: (runId: string) => void
}

const statusColor: Record<
  TestingQueueSnapshot['runs'][number]['status'],
  { label: string; badgeClass: string; progress: number }
> = {
  queued: { label: 'Queued', badgeClass: 'bg-slate-500/20 text-slate-500', progress: 15 },
  running: { label: 'Running', badgeClass: 'bg-blue-500/20 text-blue-600 dark:text-blue-400', progress: 55 },
  passed: { label: 'Passed', badgeClass: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400', progress: 100 },
  failed: { label: 'Failed', badgeClass: 'bg-red-500/20 text-red-600 dark:text-red-400', progress: 100 }
}

export function TestingQueueWidget({ snapshot, onViewDetails }: TestingQueueWidgetProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="h-5 w-5 text-primary" />
              Testing queue
            </CardTitle>
            <CardDescription>
              Automated verification runs across your selected AI model providers.
            </CardDescription>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center justify-end gap-2">
              <Clock className="h-4 w-4" />
              Avg turnaround {snapshot.avgTurnaroundMinutes} min
            </div>
            <p>{snapshot.totalActive} active runs</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {snapshot.runs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/20 p-6 text-center text-sm text-muted-foreground">
            <p className="mb-2">No test runs yet.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.hash = '#dashboard/seller/testing'
                onViewDetails?.('')
              }}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Go to Testing Lab
            </Button>
          </div>
        ) : (
          snapshot.runs.map((run) => {
            const status = statusColor[run.status]
            return (
              <div
                key={run.id}
                className="rounded-lg border border-border/70 bg-muted/30 p-4 transition hover:border-primary/60 hover:bg-background/70"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold leading-tight">
                      {run.promptTitle}
                      <Badge variant="secondary" className="text-[11px]">
                        {run.model}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>ID {run.id}</span>
                      <span>
                        Started {new Date(run.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>
                        Updated {new Date(run.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={status.badgeClass}>{status.label}</Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => onViewDetails?.(run.id)}
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Gauge className="h-3.5 w-3.5" />
                  <span>Quality score {(run.score ?? 0) * 100}%</span>
                  <span>•</span>
                  <span>Cost estimate ${run.costEstimateUsd?.toFixed(2) ?? '—'}</span>
                </div>
                <Progress value={status.progress} className="mt-3 h-2" />
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}


