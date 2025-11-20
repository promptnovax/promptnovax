import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight } from "lucide-react"

type DeskView = "changelog" | "team" | "escalations"

const deskCopy: Record<DeskView, { title: string; description: string; bullets: string[]; cta: string; link: string }> = {
  changelog: {
    title: "Moderation changelog",
    description: "Every rule tweak logged for transparency.",
    bullets: [
      "v3.4 · Added #silent tag for NDA-heavy drops.",
      "v3.3 · Expanded zero-tolerance clause to include scraped lead lists.",
      "v3.2 · Mentors now log takeover summary within 12 hours."
    ],
    cta: "Back to guardrails",
    link: "community/guidelines"
  },
  team: {
    title: "Moderation roster",
    description: "Humans covering every timezone.",
    bullets: [
      "AMER: Ava Flores (ops) · Mason Reed (growth)",
      "EMEA: Lucia Perez (design systems) · Roman Adler (security)",
      "APAC: Ravi Kapoor (automation) · Hana Ito (mentor desk)"
    ],
    cta: "Meet the full HQ",
    link: "community/hq"
  },
  escalations: {
    title: "Escalation desk",
    description: "Critical issues get a human in under 10 minutes.",
    bullets: [
      "Flag suspicious DMs, data leaks or spam with #escalate + evidence.",
      "Request community takeovers or co-marketing slots here.",
      "Report bugs in PromptNovaX products affecting members."
    ],
    cta: "Submit application",
    link: "community/apply"
  }
}

interface CommunityDeskPageProps {
  view: DeskView
}

export function CommunityDeskPage({ view }: CommunityDeskPageProps) {
  const data = deskCopy[view] ?? deskCopy.changelog

  const navigateTo = (page: string) => {
    window.dispatchEvent(new CustomEvent("navigate", { detail: { href: page } }))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-muted/20">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="border-primary/30 text-primary">
              Community desk
            </Badge>
            <h1 className="text-3xl font-semibold">{data.title}</h1>
            <p className="text-muted-foreground">{data.description}</p>
          </div>
          <Button variant="ghost" className="gap-2 self-start px-0 text-muted-foreground" onClick={() => navigateTo("community")}>
            <ArrowLeft className="h-4 w-4" />
            Back to community landing
          </Button>
        </div>
      </header>

      <main className="container mx-auto space-y-6 px-4 py-10">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>{data.title}</CardTitle>
            <CardDescription>{data.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.bullets.map(line => (
              <div key={line} className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
                {line}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need something else?</CardTitle>
            <CardDescription>The desk can reroute you to mentors, HQ or the application flow.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => navigateTo(data.link)} className="gap-2">
              {data.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigateTo("community/hq")}>
              Open HQ
            </Button>
            <Button variant="ghost" onClick={() => navigateTo("community")}>
              Return to landing
            </Button>
          </CardContent>
        </Card>

        <Separator />
        <p className="text-center text-xs text-muted-foreground">
          PromptNovaX community desk · escalations@promptnovax.com
        </p>
      </main>
    </div>
  )
}

