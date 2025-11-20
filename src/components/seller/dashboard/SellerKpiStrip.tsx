import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { SellerKpi } from '@/types/seller'
import { ArrowDownRight, ArrowUpRight, Info } from 'lucide-react'

type SellerKpiStripProps = {
  items: SellerKpi[]
}

export function SellerKpiStrip({ items }: SellerKpiStripProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((kpi) => (
        <Card key={kpi.id} className="border-border/60 bg-background/60 backdrop-blur">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-semibold">{kpi.value}</p>
              </div>
              {kpi.change && (
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                    kpi.change.direction === 'up'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400'
                  )}
                >
                  {kpi.change.direction === 'up' ? (
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                  )}
                  {kpi.change.value}
                </span>
              )}
            </div>
            {kpi.hint && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>{kpi.hint}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


