import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, Gauge, LayoutList, RefreshCcw } from 'lucide-react'
import type { PromptLifecycleColumn } from '@/types/seller'
import { cn } from '@/lib/utils'

type PromptLifecycleOverviewProps = {
  columns: PromptLifecycleColumn[]
  onViewFullLifecycle?: () => void
}

const stageIcon: Record<PromptLifecycleColumn['stage'], React.ComponentType<{ className?: string }>> = {
  drafts: LayoutList,
  testing: RefreshCcw,
  review: Gauge,
  live: CheckCircle2
}

const stageConfig: Record<PromptLifecycleColumn['stage'], { label: string; color: string }> = {
  drafts: { label: 'Drafts', color: 'text-amber-600 dark:text-amber-500' },
  testing: { label: 'Testing', color: 'text-blue-600 dark:text-blue-500' },
  review: { label: 'Under Review', color: 'text-purple-600 dark:text-purple-500' },
  live: { label: 'Live', color: 'text-emerald-600 dark:text-emerald-500' }
}

export function PromptLifecycleOverview({ columns, onViewFullLifecycle }: PromptLifecycleOverviewProps) {
  const totalPrompts = columns.reduce((sum, col) => sum + col.prompts.length, 0)

  return (
    <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group" onClick={onViewFullLifecycle}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <LayoutList className="h-5 w-5 text-primary" />
              Prompt Lifecycle
            </CardTitle>
            <CardDescription className="mt-1">
              Track and manage your prompts across all stages
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5">
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {columns.map((column) => {
            const Icon = stageIcon[column.stage]
            const config = stageConfig[column.stage]
            return (
              <div
                key={column.stage}
                className="flex flex-col items-center justify-center p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <Icon className={cn("h-6 w-6 mb-2", config.color)} />
                <p className="text-xs font-medium text-muted-foreground mb-1">{config.label}</p>
                <Badge variant="secondary" className="text-sm font-semibold">
                  {column.prompts.length}
                </Badge>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Prompts</span>
          <span className="text-lg font-semibold">{totalPrompts}</span>
        </div>
      </CardContent>
    </Card>
  )
}

