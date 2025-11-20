import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { PromptLifecycleColumn } from '@/types/seller'
import { CalendarClock, CheckCircle2, Gauge, LayoutList, RefreshCcw, Edit, Eye, Play, MoreVertical, Filter, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type PromptLifecycleBoardProps = {
  columns: PromptLifecycleColumn[]
  onOpenPrompt?: (promptId: string) => void
}

const stageIcon: Record<PromptLifecycleColumn['stage'], React.ComponentType<{ className?: string }>> = {
  drafts: LayoutList,
  testing: RefreshCcw,
  review: Gauge,
  live: CheckCircle2
}

const stageConfig: Record<PromptLifecycleColumn['stage'], { label: string; description: string; color: string }> = {
  drafts: { label: 'Drafts', description: 'Work in progress prompts', color: 'text-amber-600 dark:text-amber-500' },
  testing: { label: 'Testing', description: 'Running automated QA scenarios', color: 'text-blue-600 dark:text-blue-500' },
  review: { label: 'Under Review', description: 'Waiting for Marketplace approval', color: 'text-purple-600 dark:text-purple-500' },
  live: { label: 'Live in Marketplace', description: 'Generating revenue right now', color: 'text-emerald-600 dark:text-emerald-500' }
}

export function PromptLifecycleBoard({ columns, onOpenPrompt }: PromptLifecycleBoardProps) {
  const [activeFilter, setActiveFilter] = useState<PromptLifecycleColumn['stage'] | 'all'>('all')

  const filteredColumns = activeFilter === 'all' 
    ? columns 
    : columns.filter(col => col.stage === activeFilter)

  const totalPrompts = columns.reduce((sum, col) => sum + col.prompts.length, 0)

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filter by stage:</span>
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('all')}
            className="h-8 text-xs"
          >
            All ({totalPrompts})
          </Button>
          {columns.map((column) => {
            const Icon = stageIcon[column.stage]
            const config = stageConfig[column.stage]
            return (
              <Button
                key={column.stage}
                variant={activeFilter === column.stage ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(column.stage)}
                className={cn(
                  "h-8 text-xs gap-1.5",
                  activeFilter === column.stage && config.color
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {config.label} ({column.prompts.length})
              </Button>
            )
          })}
        </div>
        {activeFilter !== 'all' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter('all')}
            className="h-8 text-xs gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            Clear filter
          </Button>
        )}
      </div>

      {/* Content Area */}
      {activeFilter === 'all' ? (
        // Show all columns in grid
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <TooltipProvider delayDuration={200}>
            {columns.map((column) => {
              const Icon = stageIcon[column.stage]
              const config = stageConfig[column.stage]
              return (
                <Card key={column.stage} className="flex flex-col border-dashed">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Icon className={cn("h-4 w-4", config.color)} />
                          {config.label}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                      <Badge variant="outline">{column.prompts.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-3">
                    {column.prompts.length === 0 ? (
                      <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 p-6 text-center text-xs text-muted-foreground">
                        Nothing here yet
                      </div>
                    ) : (
                      column.prompts.map((prompt) => (
                        <PromptCard
                          key={prompt.id}
                          prompt={prompt}
                          onOpenPrompt={onOpenPrompt}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </TooltipProvider>
        </div>
      ) : (
        // Show merged view for selected filter
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {(() => {
                    const Icon = stageIcon[activeFilter]
                    const config = stageConfig[activeFilter]
                    return (
                      <>
                        <Icon className={cn("h-5 w-5", config.color)} />
                        {config.label}
                      </>
                    )
                  })()}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {stageConfig[activeFilter].description}
                </p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {filteredColumns[0]?.prompts.length || 0} {filteredColumns[0]?.prompts.length === 1 ? 'prompt' : 'prompts'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredColumns[0]?.prompts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 p-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  {(() => {
                    const Icon = stageIcon[activeFilter]
                    return <Icon className="h-6 w-6 text-muted-foreground" />
                  })()}
                </div>
                <p className="text-sm font-medium text-muted-foreground">No prompts in this stage</p>
                <p className="text-xs text-muted-foreground mt-1">Create a new prompt to get started</p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredColumns[0]?.prompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onOpenPrompt={onOpenPrompt}
                    variant="detailed"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

type PromptCardProps = {
  prompt: {
    id: string
    title: string
    category: string
    status: string
    lastUpdated: string
    metrics?: { views: number; sales: number; conversionRate: number }
    qaScore?: number
  }
  onOpenPrompt?: (promptId: string) => void
  variant?: 'default' | 'detailed'
}

function PromptCard({ prompt, onOpenPrompt, variant = 'default' }: PromptCardProps) {
  if (variant === 'detailed') {
    return (
      <div className="group rounded-lg border border-border/60 bg-muted/30 p-4 transition hover:border-primary/60 hover:bg-background/80 hover:shadow-md">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold leading-tight mb-1">{prompt.title}</h4>
            <p className="text-xs text-muted-foreground">{prompt.category}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {typeof prompt.qaScore === 'number' && prompt.qaScore > 0 && (
              <Badge variant="secondary" className="text-[11px]">
                QA {prompt.qaScore}%
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onOpenPrompt?.(prompt.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {prompt.status === 'draft' && (
                  <>
                    <DropdownMenuItem onClick={() => window.location.hash = `#dashboard/seller/prompt-studio?edit=${prompt.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Prompt
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.hash = `#dashboard/seller/testing?promptId=${prompt.id}`}>
                      <Play className="h-4 w-4 mr-2" />
                      Test Prompt
                    </DropdownMenuItem>
                  </>
                )}
                {prompt.status === 'live' && (
                  <DropdownMenuItem onClick={() => window.location.hash = `#marketplace/prompt/${prompt.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View in Marketplace
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {prompt.metrics && prompt.metrics.views > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground mb-3 pt-3 border-t">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-medium">Views: {prompt.metrics.views.toLocaleString()}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Marketplace views (last 30 days)</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-medium">Sales: {prompt.metrics.sales.toLocaleString()}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Completed checkouts</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-medium">CVR: {prompt.metrics.conversionRate}%</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Conversion rate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            {new Date(prompt.lastUpdated).toLocaleDateString()}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => onOpenPrompt?.(prompt.id)}
          >
            View Details
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group rounded-lg border border-border/60 bg-muted/30 p-4 transition hover:border-primary/60 hover:bg-background/80">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold leading-tight truncate">{prompt.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{prompt.category}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {typeof prompt.qaScore === 'number' && prompt.qaScore > 0 && (
            <Badge variant="secondary" className="text-[11px]">
              QA {prompt.qaScore}%
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpenPrompt?.(prompt.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {prompt.status === 'draft' && (
                <>
                  <DropdownMenuItem onClick={() => window.location.hash = `#dashboard/seller/prompt-studio?edit=${prompt.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Prompt
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.hash = `#dashboard/seller/testing?promptId=${prompt.id}`}>
                    <Play className="h-4 w-4 mr-2" />
                    Test Prompt
                  </DropdownMenuItem>
                </>
              )}
              {prompt.status === 'live' && (
                <DropdownMenuItem onClick={() => window.location.hash = `#marketplace/prompt/${prompt.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View in Marketplace
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-wide text-muted-foreground">
        {prompt.metrics && prompt.metrics.views > 0 && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>Views {prompt.metrics.views.toLocaleString()}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Marketplace views (last 30 days)</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>Sales {prompt.metrics.sales.toLocaleString()}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Completed checkouts</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>CVR {prompt.metrics.conversionRate}%</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Conversion rate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center gap-1">
              <CalendarClock className="h-3 w-3" />
              {new Date(prompt.lastUpdated).toLocaleDateString()}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Last updated</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={() => onOpenPrompt?.(prompt.id)}
        >
          View Details
        </Button>
        {prompt.status === 'draft' && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={() => window.location.hash = `#dashboard/seller/prompt-studio?edit=${prompt.id}`}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        )}
        {prompt.status === 'testing' && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={() => window.location.hash = `#dashboard/seller/testing?promptId=${prompt.id}`}
          >
            <Play className="h-3 w-3 mr-1" />
            View Test
          </Button>
        )}
      </div>
    </div>
  )
}
