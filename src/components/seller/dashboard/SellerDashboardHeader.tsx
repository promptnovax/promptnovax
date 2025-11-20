import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MessageSquare, ShieldCheck, UserCheck, Zap } from 'lucide-react'

type SellerDashboardHeaderProps = {
  name: string
  avatarUrl?: string
  verificationStatus: 'unverified' | 'pending' | 'verified'
  completionPercent: number
  onCreatePrompt?: () => void
  onRequestPayout?: () => void
  onOpenSupport?: () => void
}

const statusConfig: Record<
  SellerDashboardHeaderProps['verificationStatus'],
  { label: string; badgeClass: string }
> = {
  verified: { label: 'Verified Seller', badgeClass: 'bg-emerald-500 text-white' },
  pending: { label: 'Verification pending', badgeClass: 'bg-amber-500/90 text-white' },
  unverified: { label: 'Verification required', badgeClass: 'bg-red-500 text-white' }
}

export function SellerDashboardHeader({
  name,
  avatarUrl,
  verificationStatus,
  completionPercent,
  onCreatePrompt,
  onRequestPayout,
  onOpenSupport
}: SellerDashboardHeaderProps) {
  const status = statusConfig[verificationStatus]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name} />
            ) : (
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {name}</h1>
              <Badge className={status.badgeClass}>{status.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Track your prompt business, submit new launches, and keep your marketplace profile sharp.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onRequestPayout}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Next payout
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View payout schedule and connect settlement accounts.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button size="sm" variant="outline" onClick={onOpenSupport}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Support
          </Button>
          <Button size="sm" onClick={onCreatePrompt}>
            <Zap className="mr-2 h-4 w-4" />
            New prompt
          </Button>
        </div>
      </div>
      <div className="rounded-xl border bg-muted/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Profile completeness</span>
          </div>
          <span className="text-sm text-muted-foreground">{completionPercent}%</span>
        </div>
        <Progress value={completionPercent} className="mt-2 h-2" />
      </div>
    </div>
  )
}


