import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3,
  CreditCard,
  Download,
  FileText,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Wallet
} from "lucide-react"

const usageMetrics = [
  { label: "Tokens consumed", value: 720000, limit: 1000000, delta: "+12% MoM" },
  { label: "Automations run", value: 42, limit: 80, delta: "+6 new playbooks" },
  { label: "Seats active", value: 18, limit: 25, delta: "2 pending invites" }
]

const invoices = [
  { id: "INV-2210", period: "Jan 2025", amount: 489.0, status: "Paid", issuedOn: "Feb 1" },
  { id: "INV-2209", period: "Dec 2024", amount: 512.0, status: "Paid", issuedOn: "Jan 1" },
  { id: "INV-2208", period: "Nov 2024", amount: 436.0, status: "Paid", issuedOn: "Dec 1" }
]

const paymentMethods = [
  { brand: "Visa", last4: "4242", expiry: "08/27", status: "Primary" },
  { brand: "Mastercard", last4: "3579", expiry: "03/26", status: "Backup" }
]

const forecast = [
  { label: "This month", amount: "$512", detail: "Based on current usage" },
  { label: "Projected", amount: "$540", detail: "If workflows launch as planned" },
  { label: "Credit buffer", amount: "$1,200", detail: "Auto top-up at $400" }
]

const statusBadge = (status: string) => {
  if (status === "Paid") {
    return <Badge className="bg-green-500">Paid</Badge>
  }
  if (status === "Due") {
    return <Badge variant="destructive">Due</Badge>
  }
  return <Badge variant="secondary">{status}</Badge>
}

const formatCurrency = (value: number) => `$${value.toFixed(2)}`

export function BuyerBillingPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-primary" />
              Billing & Usage
            </h1>
            <p className="text-muted-foreground">
              Monitor consumption, invoices, payment methods, and spend forecasts from one console.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.open("mailto:billing@pnx.ai?subject=Billing%20Question")}>
              <ShieldCheck className="h-4 w-4 mr-2" />
              Contact billing
            </Button>
            <Button onClick={() => window.location.hash = "#dashboard/buyer/subscriptions"}>
              Manage plan
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {usageMetrics.map((metric) => {
          const percent = Math.min(100, Math.round((metric.value / metric.limit) * 100))
          return (
            <Card key={metric.label}>
              <CardHeader className="pb-2">
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="text-3xl">
                  {metric.label === "Tokens consumed" ? metric.value.toLocaleString() : metric.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Progress value={percent} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{percent}% of plan</span>
                  <span>{metric.delta}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Invoice history</CardTitle>
              <CardDescription>Download fiscal-ready invoices for your finance team.</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export statements
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="hidden md:grid grid-cols-12 text-xs text-muted-foreground px-3">
              <span className="col-span-3">Invoice</span>
              <span className="col-span-3">Period</span>
              <span className="col-span-2 text-right">Amount</span>
              <span className="col-span-2">Issued</span>
              <span className="col-span-2 text-right">Status</span>
            </div>
            <div className="md:hidden flex flex-wrap gap-3 text-xs text-muted-foreground px-3">
              <span className="flex-1 min-w-[120px] font-medium">Invoice</span>
              <span className="flex-1 min-w-[120px] font-medium text-right">Details</span>
            </div>
            <Separator />
            <div className="divide-y rounded-xl border border-border/40">
              {invoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-3 py-4 text-sm"
                >
                  <div className="hidden md:grid grid-cols-12 items-center">
                    <div className="col-span-3 font-medium">{invoice.id}</div>
                    <div className="col-span-3">{invoice.period}</div>
                    <div className="col-span-2 text-right font-semibold">{formatCurrency(invoice.amount)}</div>
                    <div className="col-span-2 text-muted-foreground">{invoice.issuedOn}</div>
                    <div className="col-span-2 flex justify-end">
                      {statusBadge(invoice.status)}
                    </div>
                  </div>
                  <div className="md:hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{invoice.id}</span>
                      {statusBadge(invoice.status)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{invoice.period}</span>
                      <span>{invoice.issuedOn}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">Amount</span>
                      <span className="font-semibold">{formatCurrency(invoice.amount)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forecast & alerts</CardTitle>
            <CardDescription>Stay ahead of renewals and auto top-ups.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {forecast.map((item) => (
              <div key={item.label} className="rounded-2xl border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className="text-lg font-semibold">{item.amount}</span>
                </div>
              </div>
            ))}
            <Button className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Enable usage alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Payment methods</CardTitle>
            <CardDescription>Control who can charge the workspace and keep backups ready.</CardDescription>
          </div>
          <Button onClick={() => window.alert("Redirecting to secure billing portal...")}>
            <Wallet className="h-4 w-4 mr-2" />
            Update methods
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.last4} className="flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {method.brand[0]}
                </div>
                <div>
                  <p className="font-medium">{method.brand} •••• {method.last4}</p>
                  <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={method.status === "Primary" ? "secondary" : "outline"}>
                  {method.status}
                </Badge>
                <Button variant="outline" size="sm">
                  Set as default
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit & exports</CardTitle>
          <CardDescription>Finance-ready records with traces back to workflows.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions">
            <TabsList className="grid grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="workflows">Workflow costs</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions" className="mt-6 space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="rounded-xl border p-4 text-sm flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketplace purchase #{3081 + idx}</p>
                    <p className="text-xs text-muted-foreground">Linked to seller invoice · Settled</p>
                  </div>
                  <Button variant="link" size="sm" className="text-primary flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    View log
                  </Button>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="workflows" className="mt-6 space-y-3">
              {["Launch brief automation", "Support escalations AI", "Collections drip"].map((flow) => (
                <div key={flow} className="rounded-xl bg-muted/40 p-4 text-sm flex items-center justify-between">
                  <div>
                    <p className="font-medium">{flow}</p>
                    <p className="text-xs text-muted-foreground">Costs map directly to workflow steps.</p>
                  </div>
                  <Badge variant="outline">$ {Math.floor(Math.random() * 90) + 30}/mo</Badge>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="compliance" className="mt-6 space-y-3">
              <div className="rounded-xl border-dashed border p-6 text-center space-y-2">
                <BarChart3 className="h-8 w-8 text-primary mx-auto" />
                <p className="font-semibold">SOC & Finance exports</p>
                <p className="text-sm text-muted-foreground">
                  Download signed compliance packs with transaction traces.
                </p>
                <Button>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate report
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


