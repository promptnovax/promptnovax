import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CreditCard, 
  Check, 
  Crown, 
  Zap, 
  Shield,
  ArrowUpRight,
  Calendar,
  Download
} from "lucide-react"

export function DashboardBilling() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const currentPlan = {
    name: "Pro",
    price: billingCycle === "monthly" ? 29 : 290,
    period: billingCycle === "monthly" ? "month" : "year",
    features: [
      "Unlimited prompts",
      "Advanced AI models",
      "Priority support",
      "Custom integrations",
      "Analytics dashboard"
    ]
  }

  const plans = [
    {
      name: "Free",
      price: 0,
      period: "month",
      features: [
        "10 prompts per month",
        "Basic AI models",
        "Community support",
        "Standard templates"
      ],
      current: false
    },
    {
      name: "Pro",
      price: billingCycle === "monthly" ? 29 : 290,
      period: billingCycle === "monthly" ? "month" : "year",
      features: [
        "Unlimited prompts",
        "Advanced AI models",
        "Priority support",
        "Custom integrations",
        "Analytics dashboard"
      ],
      current: true,
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact",
      features: [
        "Everything in Pro",
        "Dedicated support",
        "Custom AI models",
        "White-label solution",
        "SLA guarantee"
      ],
      current: false
    }
  ]

  const recentInvoices = [
    { id: "INV-001", date: "Dec 15, 2024", amount: "$29.00", status: "paid" },
    { id: "INV-002", date: "Nov 15, 2024", amount: "$29.00", status: "paid" },
    { id: "INV-003", date: "Oct 15, 2024", amount: "$29.00", status: "paid" }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and payment methods</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Your active subscription details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                  <p className="text-muted-foreground">
                    ${currentPlan.price}/{currentPlan.period}
                  </p>
                </div>
                <Badge variant="secondary" className="text-sm">
                  Active
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Plan Features</h4>
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  Change Plan
                </Button>
                <Button variant="destructive" className="flex-1">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing Cycle Toggle */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Billing Cycle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Monthly</span>
                <Button
                  variant={billingCycle === "monthly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBillingCycle("monthly")}
                >
                  Monthly
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Yearly</span>
                <Button
                  variant={billingCycle === "yearly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBillingCycle("yearly")}
                >
                  Yearly
                </Button>
              </div>
              {billingCycle === "yearly" && (
                <Badge variant="secondary" className="w-full justify-center">
                  Save 20%
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Available Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>
              Choose the plan that best fits your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        Popular
                      </Badge>
                    )}
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {plan.name}
                        {plan.current && <Badge variant="secondary">Current</Badge>}
                      </CardTitle>
                      <div className="text-3xl font-bold">
                        {typeof plan.price === "number" ? `$${plan.price}` : plan.price}
                        {typeof plan.price === "number" && (
                          <span className="text-sm font-normal text-muted-foreground">
                            /{plan.period}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="w-full" 
                        variant={plan.current ? "outline" : "default"}
                        disabled={plan.current}
                      >
                        {plan.current ? "Current Plan" : "Upgrade Plan"}
                        {!plan.current && <ArrowUpRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Invoices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Recent Invoices
            </CardTitle>
            <CardDescription>
              Your billing history and downloadable invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{invoice.amount}</p>
                      <Badge variant="secondary" className="text-xs">
                        {invoice.status}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Method */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Payment Method
            </CardTitle>
            <CardDescription>
              Manage your payment information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-lg">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">**** **** **** 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/25</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
