import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Calculator
} from 'lucide-react'

export function SellerPricingGuidePage() {
  const handleBack = () => {
    window.location.hash = '#dashboard/seller'
  }

  const pricingTiers = [
    {
      tier: 'Free',
      maxPrice: 0,
      description: 'Free prompts only',
      features: ['No revenue', 'Basic listing']
    },
    {
      tier: 'Starter',
      maxPrice: 29,
      description: 'Entry-level pricing',
      features: ['Up to $29 per prompt', 'Standard listing', 'Basic analytics']
    },
    {
      tier: 'Professional',
      maxPrice: 99,
      description: 'Mid-tier pricing',
      features: ['Up to $99 per prompt', 'Featured listing', 'Advanced analytics', 'Priority support']
    },
    {
      tier: 'Enterprise',
      maxPrice: 299,
      description: 'Premium pricing',
      features: ['Up to $299 per prompt', 'Premium placement', 'Full analytics suite', 'Dedicated support']
    },
    {
      tier: 'Beta',
      maxPrice: 159,
      description: 'Beta category limit',
      features: ['Development prompts: $159 max', 'Special restrictions apply']
    }
  ]

  const pricingFactors = [
    {
      title: 'Prompt Complexity',
      description: 'More complex prompts with multiple steps, conditional logic, or advanced techniques can command higher prices.',
      examples: ['Simple: $9-19', 'Moderate: $29-59', 'Complex: $79-159']
    },
    {
      title: 'Market Demand',
      description: 'Prompts in high-demand categories (development, marketing, design) can be priced higher.',
      examples: ['High demand: Premium pricing', 'Medium demand: Standard pricing', 'Niche: Competitive pricing']
    },
    {
      title: 'Proven Results',
      description: 'Prompts with high QA scores, positive reviews, and strong conversion rates justify premium pricing.',
      examples: ['90%+ QA score: +20% premium', '4.5+ rating: +15% premium', 'High CVR: +10% premium']
    },
    {
      title: 'Category Limits',
      description: 'Each category has specific pricing limits based on tier and market conditions.',
      examples: ['Check category limits before pricing', 'Beta categories have special restrictions']
    }
  ]

  const bestPractices = [
    {
      title: 'Start Competitive',
      description: 'Price slightly below market average when launching to gain initial traction and reviews.',
      icon: TrendingUp
    },
    {
      title: 'Test & Iterate',
      description: 'Monitor conversion rates and adjust pricing based on performance data.',
      icon: Calculator
    },
    {
      title: 'Bundle Value',
      description: 'Offer prompt packs or bundles to increase perceived value and average order size.',
      icon: DollarSign
    },
    {
      title: 'Stay Compliant',
      description: 'Always check category limits and platform pricing rules before setting prices.',
      icon: AlertTriangle
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h2 className="text-3xl font-bold">Pricing Guide</h2>
          <p className="text-muted-foreground mt-1">Learn how to price your prompts effectively and stay compliant</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Important Limits
            </CardTitle>
            <CardDescription>Pricing restrictions by tier and category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pricingTiers.map((tier) => (
              <div
                key={tier.tier}
                className={`rounded-lg border p-4 ${
                  tier.tier === 'Beta'
                    ? 'border-amber-500/50 bg-amber-500/5'
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{tier.tier}</h3>
                  <Badge variant={tier.tier === 'Beta' ? 'destructive' : 'secondary'}>
                    ${tier.maxPrice} max
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{tier.description}</p>
                <ul className="text-xs space-y-1">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Pricing Factors
            </CardTitle>
            <CardDescription>What influences prompt pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pricingFactors.map((factor, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-muted/30 p-4">
                <h3 className="font-semibold mb-2">{factor.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{factor.description}</p>
                <div className="space-y-1">
                  {factor.examples.map((example, exIdx) => (
                    <div key={exIdx} className="text-xs bg-background/60 rounded px-2 py-1">
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
          <CardDescription>Tips for successful prompt pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {bestPractices.map((practice, idx) => {
              const Icon = practice.icon
              return (
                <div key={idx} className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{practice.title}</h3>
                      <p className="text-sm text-muted-foreground">{practice.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Compliance Warning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Prompts that exceed category limits will be flagged and may be removed from the marketplace. 
            Always check the current limits for your prompt's category before setting a price.
          </p>
          <Button onClick={handleBack} variant="outline">
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

