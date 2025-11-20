import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { guidelineTabs, charterPrinciples } from "@/pages/community/constants"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

export function CommunityGuidelinesPage() {
  const navigateTo = (page: string) => {
    window.dispatchEvent(new CustomEvent("navigate", { detail: { href: page } }))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-muted/20">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="border-primary/30 text-primary">
              Community charter
            </Badge>
            <h1 className="text-3xl font-semibold">Rules, guidelines & perks</h1>
            <p className="text-muted-foreground">
              Every PromptNovaX member signs this charter. Keep it handy for your team.
            </p>
          </div>
          <Button variant="ghost" className="gap-2 self-start px-0 text-muted-foreground" onClick={() => navigateTo("community")}>
            <ArrowLeft className="h-4 w-4" />
            Back to community landing
          </Button>
        </div>
      </header>

      <main className="container mx-auto space-y-8 px-4 py-10">
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle>Playbook</CardTitle>
            <CardDescription>Choose a tab to review guidelines, mandatory rules or perks.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="guidelines">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="perks">Perks</TabsTrigger>
              </TabsList>
              {Object.entries(guidelineTabs).map(([key, items]) => (
                <TabsContent key={key} value={key} className="space-y-3 pt-4">
                  {items.map(item => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
                      <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                      <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {charterPrinciples.map(principle => (
            <Card key={principle.title} className="border-dashed border-primary/30">
              <CardHeader>
                <CardTitle className="text-lg">{principle.title}</CardTitle>
                <CardDescription>{principle.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Need clarification?</CardTitle>
            <CardDescription>Ping the community desk and reference the section above.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => navigateTo("community/desk/changelog")}>Read moderation changelog</Button>
            <Button variant="outline" onClick={() => navigateTo("community/hq")}>
              Visit HQ preview
            </Button>
            <Button variant="ghost" onClick={() => navigateTo("community")}>
              Return to landing
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

