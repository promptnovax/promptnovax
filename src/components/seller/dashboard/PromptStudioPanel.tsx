import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Layers, PenLine, Rocket, Sparkles } from 'lucide-react'

type PromptStudioPanelProps = {
  onLaunchStudio?: () => void
  onResumeDrafts?: () => void
}

const TEMPLATE_CATEGORIES = [
  'Image Design',
  'Code Generation',
  'Marketing Funnels',
  'Customer Success',
  'Automation Scripts',
  'Finance & Analytics'
]

const TOOL_RECOMMENDATIONS = [
  { name: 'OpenRouter', pill: 'LLM Router' },
  { name: 'Anthropic Claude 3.5', pill: 'Reasoning' },
  { name: 'GPT-4o mini', pill: 'Cost Efficient' },
  { name: 'Midjourney v6', pill: 'Imaging' },
  { name: 'Stability SDXL', pill: 'Imaging' },
  { name: 'Replicate Mixtral', pill: 'Multimodal' }
]

export function PromptStudioPanel({ onLaunchStudio, onResumeDrafts }: PromptStudioPanelProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Prompt Studio
          </CardTitle>
          <CardDescription>
            Start a new high-output prompt or refine an existing draft with guided best practices.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onResumeDrafts}>
            <Layers className="mr-2 h-4 w-4" />
            Resume drafts
          </Button>
          <Button onClick={() => {
            window.location.hash = '#dashboard/seller/prompt-studio'
            onLaunchStudio?.()
          }}>
            <PenLine className="mr-2 h-4 w-4" />
            Launch studio
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Templates
          </h4>
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_CATEGORIES.map((template) => (
              <Badge key={template} variant="outline" className="cursor-pointer px-3 py-1 text-xs">
                {template}
              </Badge>
            ))}
          </div>
        </section>

        <Separator />

        <section className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Tooling Suggestions
          </h4>
          <div className="grid gap-2 md:grid-cols-2">
            {TOOL_RECOMMENDATIONS.map((tool) => (
              <div
                key={tool.name}
                className={cn(
                  'flex items-center justify-between rounded-lg border border-border/80 bg-muted/40 px-3 py-2 text-sm',
                  'transition hover:border-primary/70 hover:bg-background/80'
                )}
              >
                <span>{tool.name}</span>
                <Badge variant="secondary" className="text-[11px]">
                  {tool.pill}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        <section className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Launch Checklist
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Rocket className="mt-0.5 h-4 w-4 text-primary" />
              <span>Create 3 sample inputs to validate prompt robustness.</span>
            </li>
            <li className="flex items-start gap-2">
              <Rocket className="mt-0.5 h-4 w-4 text-primary" />
              <span>Generate a cost-per-run estimate to set profitable pricing.</span>
            </li>
            <li className="flex items-start gap-2">
              <Rocket className="mt-0.5 h-4 w-4 text-primary" />
              <span>Add usage instructions and compliance disclaimers for faster approval.</span>
            </li>
          </ul>
        </section>
      </CardContent>
    </Card>
  )
}


