import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Activity,
  Brain,
  CheckCircle2,
  CircuitBoard,
  Play,
  PlugZap,
  Shuffle,
  Sparkles,
  Upload,
  Share2
} from "lucide-react"

const workflows = [
  {
    title: "Prompt QA feedback loop",
    description: "Collect buyer feedback, send to seller inbox and auto-generate diff report.",
    status: "Live",
    impact: "Saves 5h / sprint",
    steps: 4
  },
  {
    title: "Marketplace scouting alerts",
    description: "Watchlists for new FinTech prompts + Slack digest every Monday.",
    status: "Live",
    impact: "Adds 3 qualified prompts / week",
    steps: 3
  },
  {
    title: "License compliance watcher",
    description: "Monitor downloads vs seats per team and auto notify finance when exceeded.",
    status: "In review",
    impact: "Prevents policy breaches",
    steps: 5
  }
]

const connectors = [
  { label: "Slack HQ", status: "Connected", icon: PlugZap, accounts: 3 },
  { label: "Notion workspace", status: "Connected", icon: Share2, accounts: 1 },
  { label: "Linear issues", status: "Review needed", icon: Activity, accounts: 2 }
]

const blueprints = [
  { title: "Seller SLA monitor", tags: ["Ops", "Support"], difficulty: "Easy" },
  { title: "Prompt variant tester", tags: ["QA", "Automation"], difficulty: "Intermediate" },
  { title: "Collections drip", tags: ["Marketing"], difficulty: "Easy" }
]

export function BuyerAutomationHubPage() {
  const { success } = useToast()
  const [importSheetOpen, setImportSheetOpen] = useState(false)
  const [launchSheetOpen, setLaunchSheetOpen] = useState(false)
  const [importBlueprintName, setImportBlueprintName] = useState("")
  const [launchWorkflowName, setLaunchWorkflowName] = useState("")
  const [launchNotes, setLaunchNotes] = useState("")

  const handleImportBlueprint = () => {
    success("Blueprint queued", `${importBlueprintName || "Workflow"} will be synced shortly.`)
    setImportSheetOpen(false)
    setImportBlueprintName("")
  }

  const handleLaunchWorkflow = () => {
    success("Workflow launched", "We'll send logs to your notifications feed.")
    setLaunchSheetOpen(false)
    setLaunchWorkflowName("")
    setLaunchNotes("")
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <Brain className="h-6 w-6 text-primary" />
              Automation Hub
            </h1>
            <p className="text-muted-foreground">
              Deploy no-code workflows to sync vendors, alerts and prompt refreshes.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setImportSheetOpen(true)}>
              <Shuffle className="h-4 w-4 mr-2" />
              Import blueprint
            </Button>
            <Button onClick={() => setLaunchSheetOpen(true)}>
              <Play className="h-4 w-4 mr-2" />
              Launch workflow
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Live workflows</CardDescription>
            <CardTitle className="text-3xl">8</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            100% pass rate in last audit
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Weekly automations</CardDescription>
            <CardTitle className="text-3xl">42</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            +6 new actions deployed this week
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Connectors</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
            <CircuitBoard className="h-4 w-4 text-amber-500" />
            2 connectors require review
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workflow library</CardTitle>
          <CardDescription>Mix and match automations to orchestrate prompt operations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="my-workflows" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="my-workflows">My workflows</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="blueprints">Blueprints</TabsTrigger>
              <TabsTrigger value="history">Run history</TabsTrigger>
            </TabsList>

            <TabsContent value="my-workflows" className="mt-6 space-y-4">
              {workflows.map((flow, index) => (
                <motion.div
                  key={flow.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{flow.title}</p>
                        <Badge variant="secondary">{flow.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{flow.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit steps
                      </Button>
                      <Button size="sm">
                        View logs
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{flow.steps} automated steps</span>
                    <span>{flow.impact}</span>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="recommended" className="mt-6">
              <div className="rounded-2xl border border-dashed p-8 text-center space-y-3">
                <Sparkles className="h-8 w-8 text-primary mx-auto" />
                <p className="text-lg font-semibold">Smart recommendations are learning from your usage.</p>
                <p className="text-sm text-muted-foreground">
                  Connect more data sources or run buyer journeys to unlock curated automations.
                </p>
                <Button>
                  Enable signal tracking
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="blueprints" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {blueprints.map((blueprint) => (
                <Card key={blueprint.title}>
                  <CardHeader>
                    <CardTitle className="text-base">{blueprint.title}</CardTitle>
                    <CardDescription className="flex flex-wrap gap-2">
                      {blueprint.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <Badge>{blueprint.difficulty}</Badge>
                    <Button size="sm" variant="outline">
                      Preview steps
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <ScrollArea className="h-64 pr-4">
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="rounded-xl border p-4 text-sm text-muted-foreground flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Workflow run #{3490 + idx}</p>
                        <p>Marketplace scouting alerts • {new Date(Date.now() - idx * 3600_000).toLocaleString()}</p>
                      </div>
                      <Badge variant="secondary">Success</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Connectors health</CardTitle>
            <CardDescription>All integrations across Slack, CRM, analytics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {connectors.map((connector) => {
              const Icon = connector.icon
              return (
                <div key={connector.label} className="rounded-xl border p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{connector.label}</p>
                      <p className="text-xs text-muted-foreground">{connector.accounts} linked accounts</p>
                    </div>
                  </div>
                  <Badge variant={connector.status === "Connected" ? "secondary" : "destructive"}>
                    {connector.status}
                  </Badge>
                </div>
              )
            })}
            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Add connector
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI co-pilot suggestions</CardTitle>
            <CardDescription>Let PNX autogenerate workflow steps from your goal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-muted/40 p-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                “I want all premium prompts to post status to Slack and flag anomalies to finance.”
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline">Channel updates</Badge>
                <Badge variant="outline">Anomaly watch</Badge>
                <Badge variant="outline">Finance</Badge>
              </div>
              <Button size="sm" className="mt-2">
                Generate workflow
              </Button>
            </div>
            <div className="rounded-2xl border border-dashed p-6 text-center space-y-2">
              <Share2 className="h-8 w-8 text-primary mx-auto" />
              <p className="font-semibold">Need help deploying?</p>
              <p className="text-sm text-muted-foreground">
                Buyer ops engineers can co-build workflows with you live.
              </p>
              <Button variant="outline">Book ops session</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Sheet open={importSheetOpen} onOpenChange={setImportSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Import blueprint</SheetTitle>
            <SheetDescription>Paste a blueprint ID or repo link and we will scaffold the automation.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="blueprint-name">Blueprint name</Label>
              <Input id="blueprint-name" value={importBlueprintName} onChange={(e) => setImportBlueprintName(e.target.value)} placeholder="Seller SLA monitor" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blueprint-link">Source link</Label>
              <Input id="blueprint-link" placeholder="https://github.com/pnx/blueprints/sla" />
            </div>
          </div>
          <SheetFooter className="mt-6 gap-2">
            <Button variant="ghost" onClick={() => setImportSheetOpen(false)}>Cancel</Button>
            <Button disabled={!importBlueprintName} onClick={handleImportBlueprint}>Import</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={launchSheetOpen} onOpenChange={setLaunchSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Launch workflow</SheetTitle>
            <SheetDescription>Confirm details before we run the automation with production credentials.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Workflow</Label>
              <Input id="workflow-name" value={launchWorkflowName} onChange={(e) => setLaunchWorkflowName(e.target.value)} placeholder="Marketplace scouting alerts" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-notes">Notes for ops team</Label>
              <Textarea id="workflow-notes" value={launchNotes} onChange={(e) => setLaunchNotes(e.target.value)} placeholder="Share why we're running this build so ops can monitor." />
            </div>
          </div>
          <SheetFooter className="mt-6 gap-2">
            <Button variant="ghost" onClick={() => setLaunchSheetOpen(false)}>Cancel</Button>
            <Button disabled={!launchWorkflowName} onClick={handleLaunchWorkflow}>Run now</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

