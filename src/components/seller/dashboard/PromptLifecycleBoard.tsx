import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { PromptLifecycleColumn } from '@/types/seller'
import { 
  CalendarClock, 
  CheckCircle2, 
  Gauge, 
  LayoutList, 
  RefreshCcw, 
  Edit, 
  Eye, 
  Play, 
  MoreVertical, 
  Filter, 
  X, 
  Search,
  TrendingUp,
  DollarSign,
  Users,
  ArrowRight,
  Clock,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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

const stageConfig: Record<PromptLifecycleColumn['stage'], { 
  label: string
  description: string
  color: string
  bgColor: string
  borderColor: string
}> = {
  drafts: { 
    label: 'Drafts', 
    description: 'Work in progress prompts', 
    color: 'text-amber-600 dark:text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    borderColor: 'border-amber-200 dark:border-amber-800'
  },
  testing: { 
    label: 'Testing', 
    description: 'Running automated QA scenarios', 
    color: 'text-blue-600 dark:text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  review: { 
    label: 'Under Review', 
    description: 'Waiting for Marketplace approval', 
    color: 'text-purple-600 dark:text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  live: { 
    label: 'Live in Marketplace', 
    description: 'Generating revenue right now', 
    color: 'text-emerald-600 dark:text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800'
  }
}

export function PromptLifecycleBoard({ columns, onOpenPrompt }: PromptLifecycleBoardProps) {
  const [activeFilter, setActiveFilter] = useState<PromptLifecycleColumn['stage'] | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredColumns = activeFilter === 'all' 
    ? columns 
    : columns.filter(col => col.stage === activeFilter)

  const totalPrompts = columns.reduce((sum, col) => sum + col.prompts.length, 0)

  // Filter prompts by search query
  const filterPrompts = (prompts: any[]) => {
    if (!searchQuery.trim()) return prompts
    const query = searchQuery.toLowerCase()
    return prompts.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border bg-muted/30">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
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
            const filteredCount = filterPrompts(column.prompts).length
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
                {config.label} ({filteredCount})
              </Button>
            )
          })}
        </div>
      </div>

      {/* Kanban Board View */}
      {activeFilter === 'all' ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <TooltipProvider delayDuration={200}>
            {columns.map((column, colIndex) => {
              const Icon = stageIcon[column.stage]
              const config = stageConfig[column.stage]
              const filteredPrompts = filterPrompts(column.prompts)
              
              return (
                <motion.div
                  key={column.stage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: colIndex * 0.1 }}
                >
                  <Card className={cn(
                    "flex flex-col border-2 transition-all hover:shadow-lg",
                    config.borderColor
                  )}>
                    <CardHeader className={cn("pb-3", config.bgColor)}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className={cn("p-2 rounded-lg", config.bgColor)}>
                            <Icon className={cn("h-4 w-4", config.color)} />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                              {config.label}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs font-semibold">
                          {filteredPrompts.length}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-3 pt-4 min-h-[400px]">
                      {filteredPrompts.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-8 text-center">
                          <div className={cn("rounded-full p-3 mb-3", config.bgColor)}>
                            <Icon className={cn("h-6 w-6", config.color)} />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">No prompts here</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {searchQuery ? 'Try a different search' : 'Create a new prompt to get started'}
                          </p>
                        </div>
                      ) : (
                        filteredPrompts.map((prompt, index) => (
                          <motion.div
                            key={prompt.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <PromptCard
                              prompt={prompt}
                              onOpenPrompt={onOpenPrompt}
                              stage={column.stage}
                            />
                          </motion.div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </TooltipProvider>
        </div>
      ) : (
        // Filtered View
        <Card className="border-2">
          <CardHeader className={cn("pb-3", stageConfig[activeFilter].bgColor)}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className={cn("p-2 rounded-lg", stageConfig[activeFilter].bgColor)}>
                  {(() => {
                    const Icon = stageIcon[activeFilter]
                    return <Icon className={cn("h-5 w-5", stageConfig[activeFilter].color)} />
                  })()}
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    {stageConfig[activeFilter].label}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {stageConfig[activeFilter].description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm font-semibold">
                  {filterPrompts(filteredColumns[0]?.prompts || []).length} {filterPrompts(filteredColumns[0]?.prompts || []).length === 1 ? 'prompt' : 'prompts'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {filterPrompts(filteredColumns[0]?.prompts || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center">
                <div className={cn("rounded-full p-4 mb-4", stageConfig[activeFilter].bgColor)}>
                  {(() => {
                    const Icon = stageIcon[activeFilter]
                    return <Icon className={cn("h-8 w-8", stageConfig[activeFilter].color)} />
                  })()}
                </div>
                <p className="text-sm font-medium text-muted-foreground">No prompts in this stage</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {searchQuery ? 'Try a different search query' : 'Create a new prompt to get started'}
                </p>
                {!searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => window.location.hash = '#dashboard/seller/prompt-studio'}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create New Prompt
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filterPrompts(filteredColumns[0]?.prompts || []).map((prompt, index) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PromptCard
                      prompt={prompt}
                      onOpenPrompt={onOpenPrompt}
                      stage={activeFilter}
                      variant="detailed"
                    />
                  </motion.div>
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
    price?: number
  }
  onOpenPrompt?: (promptId: string) => void
  stage: PromptLifecycleColumn['stage']
  variant?: 'default' | 'detailed'
}

function PromptCard({ prompt, onOpenPrompt, stage, variant = 'default' }: PromptCardProps) {
  const config = stageConfig[stage]
  const hasMetrics = prompt.metrics && prompt.metrics.views > 0

  if (variant === 'detailed') {
    return (
      <Card className={cn(
        "group transition-all hover:shadow-lg border-2",
        config.borderColor,
        "hover:scale-[1.02]"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold leading-tight mb-1.5 line-clamp-2">{prompt.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px]">
                  {prompt.category}
                </Badge>
                {typeof prompt.qaScore === 'number' && prompt.qaScore > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    QA {prompt.qaScore}%
                  </Badge>
                )}
                {prompt.price && (
                  <Badge variant="outline" className="text-[10px]">
                    ${prompt.price}
                  </Badge>
                )}
              </div>
            </div>
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
                <DropdownMenuSeparator />
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
                {prompt.status === 'testing' && (
                  <DropdownMenuItem onClick={() => window.location.hash = `#dashboard/seller/testing?promptId=${prompt.id}`}>
                    <Play className="h-4 w-4 mr-2" />
                    View Test Results
                  </DropdownMenuItem>
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

          {hasMetrics && (
            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-muted/50 mb-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mb-1">
                        <Eye className="h-3 w-3" />
                        Views
                      </div>
                      <p className="text-xs font-semibold">{prompt.metrics!.views.toLocaleString()}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Marketplace views (last 30 days)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mb-1">
                        <DollarSign className="h-3 w-3" />
                        Sales
                      </div>
                      <p className="text-xs font-semibold">{prompt.metrics!.sales.toLocaleString()}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Completed purchases</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mb-1">
                        <TrendingUp className="h-3 w-3" />
                        CVR
                      </div>
                      <p className="text-xs font-semibold">{prompt.metrics!.conversionRate}%</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Conversion rate</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-3 border-t">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
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
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      "group transition-all hover:shadow-md border",
      config.borderColor,
      "hover:border-primary/60"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold leading-tight truncate">{prompt.title}</h4>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Badge variant="outline" className="text-[10px]">
                {prompt.category}
              </Badge>
              {typeof prompt.qaScore === 'number' && prompt.qaScore > 0 && (
                <Badge variant="secondary" className="text-[10px]">
                  QA {prompt.qaScore}%
                </Badge>
              )}
            </div>
          </div>
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
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.hash = `#dashboard/seller/testing?promptId=${prompt.id}`}>
                    <Play className="h-4 w-4 mr-2" />
                    Test
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {hasMetrics && (
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3 pt-2 border-t">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {prompt.metrics!.views.toLocaleString()}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Views</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {prompt.metrics!.sales.toLocaleString()}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sales</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {prompt.metrics!.conversionRate}%
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>CVR</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            {new Date(prompt.lastUpdated).toLocaleDateString()}
          </span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 text-[10px] px-2"
              onClick={() => onOpenPrompt?.(prompt.id)}
            >
              View
            </Button>
            {prompt.status === 'draft' && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] px-2"
                onClick={() => window.location.hash = `#dashboard/seller/prompt-studio?edit=${prompt.id}`}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {prompt.status === 'testing' && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] px-2"
                onClick={() => window.location.hash = `#dashboard/seller/testing?promptId=${prompt.id}`}
              >
                <Play className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
