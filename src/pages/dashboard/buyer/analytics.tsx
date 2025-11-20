import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart3,
  ChartNoAxesCombined,
  Flame,
  Gauge,
  Layers,
  LineChart,
  Radio,
  TrendingUp
} from "lucide-react"

const usageStreams = [
  { label: "Buyer research", value: 68, delta: "+12%" },
  { label: "Creative production", value: 52, delta: "+4%" },
  { label: "Automation studio", value: 41, delta: "-3%" },
  { label: "Testing lab", value: 33, delta: "+9%" }
]

const adoptionMetrics = [
  { title: "Licenses utilized", value: "72%", change: "+5%", icon: Gauge },
  { title: "Teams activated", value: "9/12", change: "+2", icon: Layers },
  { title: "Net sentiment", value: "4.7/5", change: "stable", icon: Flame }
]

const timeline = [
  { label: "Week 1", total: 120, automation: 48 },
  { label: "Week 2", total: 142, automation: 56 },
  { label: "Week 3", total: 158, automation: 74 },
  { label: "Week 4", total: 171, automation: 80 }
]

const heatMap = [
  { day: "Mon", values: [40, 60, 20, 80, 30] },
  { day: "Tue", values: [55, 40, 50, 65, 45] },
  { day: "Wed", values: [70, 58, 60, 72, 52] },
  { day: "Thu", values: [66, 48, 62, 70, 40] },
  { day: "Fri", values: [48, 34, 41, 52, 29] }
]

export function BuyerUsageAnalyticsPage() {
  const { success } = useToast()
  const [compareDialogOpen, setCompareDialogOpen] = useState(false)
  const [periodA, setPeriodA] = useState("This month")
  const [periodB, setPeriodB] = useState("Last month")

  const handleExport = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      metrics: adoptionMetrics,
      streams: usageStreams
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `usage-analytics-${Date.now()}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    success("Export ready", "Analytics JSON downloaded.")
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              Usage analytics
            </h1>
            <p className="text-muted-foreground">
              Measure adoption, ROI and automation coverage across every buyer team.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCompareDialogOpen(true)}>
              <ChartNoAxesCombined className="h-4 w-4 mr-2" />
              Compare periods
            </Button>
            <Button onClick={handleExport}>
              <LineChart className="h-4 w-4 mr-2" />
              Export dashboard
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {adoptionMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title}>
              <CardHeader className="flex items-center justify-between">
                <CardDescription>{metric.title}</CardDescription>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <CardTitle>{metric.value}</CardTitle>
                <Badge variant="secondary">{metric.change}</Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage mix</CardTitle>
          <CardDescription>Share of credits consumed by teams and initiatives.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="streams" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="streams">Streams</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="streams" className="mt-6 space-y-4">
              {usageStreams.map((stream) => (
                <div key={stream.label}>
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-medium">{stream.label}</p>
                    <span className="text-muted-foreground">{stream.delta}</span>
                  </div>
                  <Progress value={stream.value} className="h-2 mt-2" />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <div className="grid grid-cols-4 gap-6">
                {timeline.map((point) => (
                  <div key={point.label} className="rounded-2xl border p-4 space-y-2">
                    <p className="text-xs text-muted-foreground">{point.label}</p>
                    <p className="text-2xl font-semibold">{point.total}</p>
                    <p className="text-xs text-muted-foreground">automation {point.automation}</p>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(point.automation / point.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="heatmap" className="mt-6">
              <div className="space-y-3">
                {heatMap.map((row) => (
                  <div key={row.day} className="flex items-center gap-2">
                    <span className="w-10 text-xs text-muted-foreground">{row.day}</span>
                    <div className="flex gap-2 flex-1">
                      {row.values.map((value, idx) => (
                        <div
                          key={`${row.day}-${idx}`}
                          className="h-10 flex-1 rounded-lg"
                          style={{
                            backgroundColor: `hsl(222, 85%, ${80 - value / 2}%)`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="mt-6 space-y-4">
              {[
                { title: "Automation adoption dipped in QA team", severity: "Medium" },
                { title: "Creator prompts outpacing entitlements", severity: "High" }
              ].map((alert) => (
                <div key={alert.title} className="rounded-xl border p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">Investigate and notify stakeholders</p>
                  </div>
                  <Badge variant={alert.severity === "High" ? "destructive" : "secondary"}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Team adoption leaderboard</CardTitle>
            <CardDescription>Compare credit usage vs automation saves.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Growth", "Product", "Design QA", "Support"].map((team, idx) => (
              <div key={team} className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{team}</p>
                  <Badge variant="secondary">Rank #{idx + 1}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <p>Credits</p>
                    <p className="text-lg font-semibold text-foreground">{120 - idx * 12}</p>
                  </div>
                  <div>
                    <p>Automation saves</p>
                    <p className="text-lg font-semibold text-foreground">{48 - idx * 6} hrs</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Signal feeds</CardTitle>
            <CardDescription>Real-time events powering the analytics stack.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="rounded-xl bg-muted/40 p-4 flex items-center gap-3">
                <Radio className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Stream #{209 + idx}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(Date.now() - idx * 600_000).toLocaleTimeString()} • {80 + idx * 5} events ingested
                  </p>
                </div>
                <Badge className="ml-auto" variant="secondary">
                  Healthy
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border border-dashed p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">Need executive-ready reporting?</p>
          <p className="text-sm text-muted-foreground">
            Share a live analytics board with leadership or export formatted slides.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Schedule rundown</Button>
          <Button>
            <TrendingUp className="h-4 w-4 mr-2" />
            Create board
          </Button>
        </div>
      </div>

      <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compare usage windows</DialogTitle>
            <DialogDescription>Select two periods to overlay across every widget.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <Label>Primary period</Label>
              <Select value={periodA} onValueChange={setPeriodA}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="This month">This month</SelectItem>
                  <SelectItem value="Last month">Last month</SelectItem>
                  <SelectItem value="Last quarter">Last quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Baseline</Label>
              <Select value={periodB} onValueChange={setPeriodB}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Last month">Last month</SelectItem>
                  <SelectItem value="Last quarter">Last quarter</SelectItem>
                  <SelectItem value="Year to date">Year to date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCompareDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => { setCompareDialogOpen(false); success("Comparison applied", `${periodA} vs ${periodB}`); }}>
              Apply overlay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

