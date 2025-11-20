import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { membershipSteps, communityStats } from "@/pages/community/constants"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Send, Users } from "lucide-react"

interface ApplicationForm {
  name: string
  role: string
  company: string
  stack: string
  goal: string
}

export function CommunityApplyPage() {
  const { success } = useToast()
  const [form, setForm] = useState<ApplicationForm>({
    name: "",
    role: "",
    company: "",
    stack: "",
    goal: ""
  })

  const navigateTo = (page: string) => {
    window.dispatchEvent(new CustomEvent("navigate", { detail: { href: page } }))
  }

  const handleChange = (field: keyof ApplicationForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!form.name || !form.role || !form.stack || !form.goal) {
      return
    }
    success("Application received", "We will review and respond within 24 hours.")
    setForm({ name: "", role: "", company: "", stack: "", goal: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-muted/20">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="border-primary/30 text-primary">
              Membership desk
            </Badge>
            <h1 className="text-3xl font-semibold">Apply for PromptNovaX HQ</h1>
            <p className="text-muted-foreground">Share your stack, active build and what you’ll contribute to the community.</p>
          </div>
          <Button variant="ghost" className="gap-2 self-start px-0 text-muted-foreground" onClick={() => navigateTo("community")}>
            <ArrowLeft className="h-4 w-4" />
            Back to community landing
          </Button>
        </div>
      </header>

      <main className="container mx-auto grid gap-6 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Access request</CardTitle>
            <CardDescription>All responses are encrypted and reviewed by the moderation desk.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Full name" value={form.name} onChange={event => handleChange("name", event.target.value)} />
              <Input placeholder="Role" value={form.role} onChange={event => handleChange("role", event.target.value)} />
              <Input placeholder="Company / project" value={form.company} onChange={event => handleChange("company", event.target.value)} />
              <Input placeholder="Primary stack / tools" value={form.stack} onChange={event => handleChange("stack", event.target.value)} />
            </div>
            <Textarea
              placeholder="What are you building? What resource do you need from the community? What can you give back?"
              value={form.goal}
              onChange={event => handleChange("goal", event.target.value)}
              className="min-h-[160px]"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">You will get a decision within 24 hours. Expect DM from a mentor.</p>
              <Button onClick={handleSubmit} disabled={!form.name || !form.role || !form.stack || !form.goal} className="gap-2">
                Submit application
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-transparent">
            <CardHeader>
              <CardTitle>Why we vet members</CardTitle>
              <CardDescription>Keep the HQ professional and high-signal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {membershipSteps.map(step => (
                <div key={step.title} className="rounded-2xl border border-dashed border-primary/30 p-4">
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              ))}
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                92% of applicants who give detailed build logs get accepted.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community stats</CardTitle>
              <CardDescription>Real-time snapshot of PromptNovaX HQ.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {communityStats.map(stat => (
                <div key={stat.label} className="rounded-2xl border border-border/70 p-4">
                  <p className="text-xs uppercase text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-primary">{stat.growth}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

