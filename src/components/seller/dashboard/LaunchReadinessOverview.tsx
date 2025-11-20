import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, Rocket, CheckCircle2, CircleDashed, Loader2 } from 'lucide-react'
import type { SellerChecklistItem } from '@/types/seller'

type LaunchReadinessOverviewProps = {
  completionPercent: number
  items: SellerChecklistItem[]
  onViewFull?: () => void
}

export function LaunchReadinessOverview({ completionPercent, items, onViewFull }: LaunchReadinessOverviewProps) {
  const completedCount = items.filter(item => item.status === 'done').length
  const inProgressCount = items.filter(item => item.status === 'in_progress').length
  const todoCount = items.filter(item => item.status === 'todo').length

  return (
    <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group" onClick={onViewFull}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Rocket className="h-5 w-5 text-primary" />
              Launch Readiness
            </CardTitle>
            <CardDescription className="mt-1">
              Complete your profile to unlock marketplace features
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
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Profile Completion</span>
              <span className="font-semibold">{completionPercent}%</span>
            </div>
            <Progress value={completionPercent} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/30">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mb-1" />
              <p className="text-xs font-medium text-muted-foreground">Completed</p>
              <p className="text-lg font-semibold">{completedCount}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/30">
              <Loader2 className="h-5 w-5 text-primary mb-1" />
              <p className="text-xs font-medium text-muted-foreground">In Progress</p>
              <p className="text-lg font-semibold">{inProgressCount}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/30">
              <CircleDashed className="h-5 w-5 text-amber-600 mb-1" />
              <p className="text-xs font-medium text-muted-foreground">To Do</p>
              <p className="text-lg font-semibold">{todoCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

