import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Star, Zap, Crown, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const pricingPlans = {
  monthly: [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with AI prompts",
      icon: Star,
      features: [
        "5 prompts per day",
        "Basic AI models access",
        "Community support",
        "Standard templates",
        "Mobile app access"
      ],
      cta: "Get Started Free",
      popular: false,
      color: "default"
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For professionals who need more power",
      icon: Zap,
      features: [
        "Unlimited prompts",
        "All AI models access",
        "Priority support",
        "Advanced templates",
        "Custom prompt creation",
        "API access",
        "Team collaboration",
        "Analytics dashboard"
      ],
      cta: "Start Pro Trial",
      popular: true,
      color: "primary"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For teams and organizations",
      icon: Building,
      features: [
        "Everything in Pro",
        "Custom AI model training",
        "Dedicated support",
        "White-label solution",
        "Advanced security",
        "Custom integrations",
        "SLA guarantee",
        "On-premise deployment"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "secondary"
    }
  ],
  yearly: [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with AI prompts",
      icon: Star,
      features: [
        "5 prompts per day",
        "Basic AI models access",
        "Community support",
        "Standard templates",
        "Mobile app access"
      ],
      cta: "Get Started Free",
      popular: false,
      color: "default"
    },
    {
      name: "Pro",
      price: "$15",
      period: "per month",
      description: "For professionals who need more power",
      icon: Zap,
      features: [
        "Unlimited prompts",
        "All AI models access",
        "Priority support",
        "Advanced templates",
        "Custom prompt creation",
        "API access",
        "Team collaboration",
        "Analytics dashboard"
      ],
      cta: "Start Pro Trial",
      popular: true,
      color: "primary",
      savings: "Save 20%"
    },
    {
      name: "Enterprise",
      price: "$79",
      period: "per month",
      description: "For teams and organizations",
      icon: Building,
      features: [
        "Everything in Pro",
        "Custom AI model training",
        "Dedicated support",
        "White-label solution",
        "Advanced security",
        "Custom integrations",
        "SLA guarantee",
        "On-premise deployment"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "secondary",
      savings: "Save 20%"
    }
  ]
}

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const plans = isYearly ? pricingPlans.yearly : pricingPlans.monthly

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your needs. Start free and upgrade anytime.
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="ml-2">
                Save 20%
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Crown className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full transition-all duration-300 hover:shadow-lg ${
                  plan.popular ? 'ring-2 ring-primary scale-105' : 'hover:scale-105'
                }`}>
                  <CardHeader className="text-center pb-8">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">/{plan.period}</span>
                      {plan.savings && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {plan.savings}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: (index * 0.2) + (featureIndex * 0.1) }}
                          className="flex items-center space-x-3"
                        >
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, all paid plans come with a 14-day free trial. No credit card required.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, we offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

