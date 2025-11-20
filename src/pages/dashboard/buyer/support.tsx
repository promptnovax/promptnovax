import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  AlertTriangle,
  Calendar,
  Headphones,
  HelpCircle,
  MessageSquare,
  PhoneCall,
  Search,
  Send,
  Shield,
  Sparkles
} from "lucide-react"

const tickets = [
  {
    id: "CASE-4312",
    topic: "Prompt output drift",
    status: "Seller responding",
    priority: "High",
    updated: "2h ago",
    owner: "Nadia",
    channel: "Marketplace seller"
  },
  {
    id: "CASE-4301",
    topic: "Invoice mismatch",
    status: "Awaiting buyer",
    priority: "Medium",
    updated: "Yesterday",
    owner: "Finance",
    channel: "PNX billing"
  },
  {
    id: "CASE-4295",
    topic: "Workflow connector issue",
    status: "PNX triaging",
    priority: "Low",
    updated: "3d ago",
    owner: "Ops Desk",
    channel: "Automation hub"
  }
]

const faqs = [
  { icon: Shield, question: "How do SLAs work with sellers?", answer: "Every purchase includes default SLA terms. Customize inside Settings → Procurement." },
  { icon: Sparkles, question: "Can AI assist with ticket replies?", answer: "Yes, enable AI Co-Pilot to suggest drafts sourced from seller docs and prior resolutions." },
  { icon: AlertTriangle, question: "When should I escalate to PNX?", answer: "If a seller hasn’t responded within the SLA window or billing disputes stay unresolved for 48h." }
]

const contacts = [
  { label: "Buyer concierge", action: "Book call", icon: Calendar },
  { label: "Live chat", action: "Start chat", icon: MessageSquare },
  { label: "Emergency line", action: "Call now", icon: PhoneCall }
]

export function BuyerSupportPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <Headphones className="h-6 w-6 text-primary" />
              Support & Guidance
            </h1>
            <p className="text-muted-foreground">
              Track tickets, talk to sellers, and get hands-on help from the buyer concierge team.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.hash = "#notifications"}>
              Subscribe to alerts
            </Button>
            <Button onClick={() => window.location.hash = "#dashboard/buyer/automation"}>
              Launch troubleshooting workflow
            </Button>
          </div>
        </div>
      </motion.div>

      <Card>
        <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Open tickets</CardTitle>
            <CardDescription>View conversation health across sellers and PNX teams.</CardDescription>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative sm:w-64">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search tickets" className="pl-9" />
            </div>
            <Button onClick={() => window.alert("Launching new ticket wizard...")}>
              <Send className="h-4 w-4 mr-2" />
              Create ticket
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="rounded-2xl border p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{ticket.topic}</p>
                  <Badge variant={ticket.priority === "High" ? "destructive" : ticket.priority === "Medium" ? "secondary" : "outline"}>
                    {ticket.priority}
                  </Badge>
                  <Badge variant="outline">{ticket.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {ticket.id} • Updated {ticket.updated} • Owner {ticket.owner} • {ticket.channel}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Reply
                </Button>
                <Button size="sm" variant="ghost">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Escalate
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Knowledge base</CardTitle>
            <CardDescription>Guided answers and playbooks tailored to buyers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq) => {
              const Icon = faq.icon
              return (
                <div key={faq.question} className="rounded-2xl border p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <Icon className="h-4 w-4 text-primary" />
                    {faq.question}
                  </div>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              )
            })}
            <Button variant="outline" className="w-full" onClick={() => window.location.hash = "#help"}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Browse help center
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Concierge & escalation</CardTitle>
            <CardDescription>Reach humans fast for live troubleshooting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contacts.map((contact) => {
              const Icon = contact.icon
              return (
                <div key={contact.label} className="rounded-2xl bg-muted/40 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{contact.label}</p>
                      <p className="text-xs text-muted-foreground">Guaranteed response within 2 hours.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">{contact.action}</Button>
                </div>
              )
            })}
            <div className="rounded-2xl border border-dashed p-5 text-center space-y-2">
              <Sparkles className="h-6 w-6 text-primary mx-auto" />
              <p className="font-semibold">Ask the buyer AI coach</p>
              <p className="text-sm text-muted-foreground">Get curated responses from your workflow history.</p>
              <Button size="sm" onClick={() => window.location.hash = "#dashboard/buyer/analytics"}>
                Open AI coach
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guided escalation</CardTitle>
          <CardDescription>Describe the issue and we route it to the right specialist.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="seller">
            <TabsList className="grid grid-cols-2 md:grid-cols-3">
              <TabsTrigger value="seller">Seller issue</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="workflow">Workflow / Automation</TabsTrigger>
            </TabsList>
            <TabsContent value="seller" className="mt-6 space-y-4">
              <Textarea placeholder="Describe what happened, links, and urgency…" className="min-h-[120px]" />
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-muted-foreground">
                <p>Response SLA: under 60 minutes.</p>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Submit to seller + PNX
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="billing" className="mt-6 space-y-4">
              <Textarea placeholder="Link invoices, totals, or PO numbers…" className="min-h-[120px]" />
              <Button className="self-start">
                <Shield className="h-4 w-4 mr-2" />
                Route to billing ops
              </Button>
            </TabsContent>
            <TabsContent value="workflow" className="mt-6 space-y-4">
              <Textarea placeholder="Share the workflow name, failure mode, and desired outcome…" className="min-h-[120px]" />
              <Button variant="outline" className="self-start" onClick={() => window.location.hash = "#dashboard/buyer/automation"}>
                Launch debugging checklist
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


