import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SellerFeedback } from '@/types/seller'
import { MessageCircle, Star, ExternalLink, TrendingUp } from 'lucide-react'

type FeedbackHighlightsProps = {
  feedback: SellerFeedback[]
}

export function FeedbackHighlights({ feedback }: FeedbackHighlightsProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Buyer feedback spotlight
              {feedback.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {feedback.length} {feedback.length === 1 ? 'review' : 'reviews'}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Use insights to iterate on prompt instructions and upsell opportunities.</CardDescription>
          </div>
          {feedback.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                window.location.hash = '#dashboard/seller?tab=feedback'
              }}
            >
              View All
              <TrendingUp className="h-3 w-3 ml-2" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedback.length === 0 ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/20 p-6 text-center text-sm text-muted-foreground">
            No feedback yet. Encourage buyers to leave reviews after successful runs.
          </div>
        ) : (
          feedback.map((item) => (
            <div key={item.id} className="rounded-lg border border-border/70 bg-muted/30 p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback>{item.buyerHandle.slice(1, 3).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold truncate">{item.buyerHandle}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        Verified Buyer
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{item.promptTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-1 text-sm font-medium text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    {item.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">"{item.comment}"</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => {
                      window.location.hash = `#dashboard/seller/prompts/${item.promptId}?tab=feedback`
                    }}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Respond
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => {
                      window.location.hash = `#dashboard/seller/prompts/${item.promptId}`
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Prompt
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}


