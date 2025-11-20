import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  Activity,
  AlertTriangle,
  BellRing,
  Mail,
  Radio,
  RefreshCcw,
  ShieldCheck,
  Siren,
  Workflow
} from "lucide-react"

const signalStreams = [
  { name: "Marketplace drops", status: "Healthy", events: 182 },
  { name: "Workflow incidents", status: "Investigate", events: 12 },
  { name: "Billing alerts", status: "Healthy", events: 9 },
  { name: "Support escalations", status: "Elevated", events: 27 }
]

const alertTemplates = [
  { label: "Renewal deadline missed", severity: "High" },
  { label: "Automation drift detected", severity: "Medium" },
  { label: "Prompt quality drop", severity: "Medium" }
]

export function BuyerSignalsPage() {
  const [email, setEmail] = useState("ops@buyerteam.com")
  const [digestEnabled, setDigestEnabled] = useState(true)

  const handleSubscribe = () => {
    window.location.hash = "#notifications"
  }

  const handleTestAlert = () => {
    window.alert("Test alert dispatched to configured channels.")
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <BellRing className="h-6 w-6 text-primary" />
              Signals & alerts
            </h1>
            <p className="text-muted-foreground">
              Monitor automation health, SLA risk, and marketplace drops—then route alerts to the right teams.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSubscribe}>
              Manage notification center
            </Button>
            <Button onClick={handleTestAlert}>
              <Siren className="h-4 w-4 mr-2" />
              Send test alert
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Live alert rules</CardDescription>
            <CardTitle className="text-3xl">14</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            9 auto-escalate to concierge
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Today's events</CardDescription>
            <CardTitle className="text-3xl">230</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            12 require attention
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Digest recipients</CardDescription>
            <CardTitle className="text-3xl">6</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
            <Mail className="h-4 w-4 text-amber-500" />
            Daily at 8:00am
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Signal streams</CardTitle>
          <CardDescription>Every event powering dashboards and automation fail-safes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {signalStreams.map((stream) => (
            <div key={stream.name} className="rounded-2xl border p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Radio className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{stream.name}</p>
                <p className="text-xs text-muted-foreground">{stream.events} events today</p>
              </div>
              <Badge variant={stream.status === "Healthy" ? "secondary" : stream.status === "Investigate" ? "destructive" : "outline"}>
                {stream.status}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => window.alert(`Viewing logs for ${stream.name}`)}>
                View feed
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert routing</CardTitle>
          <CardDescription>Choose who gets notified and how.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="digest">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="digest">Digest</TabsTrigger>
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="workflows">Automation</TabsTrigger>
            </TabsList>
            <TabsContent value="digest" className="mt-6 space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Daily digest email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <p className="font-medium text-sm">Enable morning digest</p>
                  <p className="text-xs text-muted-foreground">Sent weekdays at 8:00am with top signals</p>
                </div>
                <Switch checked={digestEnabled} onCheckedChange={setDigestEnabled} />
              </div>
              <Button onClick={() => window.alert(`Digest preferences saved for ${email}`)}>
                Save preferences
              </Button>
            </TabsContent>
            <TabsContent value="channels" className="mt-6 space-y-4">
              {["Slack #buyer-ops", "Email finance@company.com", "PagerDuty buyer-oncall"].map((channel) => (
                <div key={channel} className="rounded-xl bg-muted/40 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{channel}</p>
                    <p className="text-xs text-muted-foreground">Receives high severity alerts</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.alert(`Configuring ${channel}`)}>
                    Configure
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => window.alert("New channel wizard coming soon.")}>
                Add channel
              </Button>
            </TabsContent>
            <TabsContent value="workflows" className="mt-6 space-y-4">
              {[ "Auto open support ticket", "Notify workflow owner", "Pause risky automation" ].map((flow) => (
                <div key={flow} className="rounded-xl border p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Workflow className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{flow}</p>
                      <p className="text-xs text-muted-foreground">Triggered by Severity = High</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert templates</CardTitle>
          <CardDescription>Reuse the guardrails your teams depend on.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alertTemplates.map((template) => (
            <div key={template.label} className="rounded-xl bg-muted/40 p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{template.label}</p>
                <p className="text-xs text-muted-foreground">Fires when data drifts beyond tolerance.</p>
              </div>
              <Badge variant={template.severity === "High" ? "destructive" : "secondary"}>
                {template.severity}
              </Badge>
            </div>
          ))}
          <Button variant="ghost" className="w-full" onClick={() => window.alert("Opening template library...")}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Browse more templates
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


