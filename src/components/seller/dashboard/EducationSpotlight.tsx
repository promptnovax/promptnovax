import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { EducationSnapshot } from '@/types/seller'
import { BookOpenCheck, GraduationCap, Play } from 'lucide-react'

type EducationSpotlightProps = {
  snapshot: EducationSnapshot
  onOpenAcademy?: () => void
}

const categoryBadge: Record<EducationSnapshot['recommendations'][number]['category'], string> = {
  prompting: 'bg-primary/10 text-primary',
  pricing: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  marketing: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  compliance: 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
}

export function EducationSpotlight({ snapshot, onOpenAcademy }: EducationSpotlightProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="h-5 w-5 text-primary" />
              Upskill & certification
            </CardTitle>
            <CardDescription>
              Level up your prompt engineering skills to unlock higher marketplace tiers.
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={onOpenAcademy}>
            Academy
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {snapshot.activeCourse && (
          <button
            onClick={() => {
              window.location.hash = '#/academy'
            }}
            className="w-full rounded-lg border border-border/70 bg-muted/30 p-4 transition hover:border-primary/70 hover:bg-muted/50 text-left"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Active course</p>
                <p className="text-sm text-muted-foreground">{snapshot.activeCourse.title}</p>
              </div>
              <Badge variant="secondary" className="text-[11px]">
                {snapshot.activeCourse.progressPercent}% complete
              </Badge>
            </div>
          </button>
        )}

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Recommended next</p>
          <div className="mt-2 space-y-3">
            {snapshot.recommendations.map((resource) => (
              <button
                key={resource.id}
                onClick={() => {
                  if (resource.href) {
                    window.location.hash = resource.href
                  }
                }}
                className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-background/60 p-3 transition hover:border-primary/70 hover:bg-muted/40 text-left w-full"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <BookOpenCheck className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">{resource.title}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {resource.durationMinutes} min • {resource.level}
                  </p>
                </div>
                <Badge variant="secondary" className={categoryBadge[resource.category]}>
                  {resource.category}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-primary/50 p-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-primary">
            <Play className="h-4 w-4" />
            Certification progress
          </div>
          <p className="mt-1">
            Complete {100 - snapshot.certificationProgress}% more to unlock the Marketplace Pro badge.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


