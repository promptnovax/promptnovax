import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "@/components/ui/link"
import { useToast } from "@/hooks/use-toast"
import { liveChatMessages, membershipSteps } from "@/pages/community/constants"
import { ArrowLeft, ArrowRight, MessageSquare, UserPlus } from "lucide-react"

interface ChatMessage {
  author: string
  role: string
  timestamp: string
  badge: string
  message: string
}

export function CommunityHQPage() {
  const { success } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>(liveChatMessages)
  const [composer, setComposer] = useState("")

  const handleSend = () => {
    if (!composer.trim()) return
    const newMessage: ChatMessage = {
      author: "You",
      role: "Prospective Member",
      timestamp: "just now",
      badge: "INTRO",
      message: composer.trim()
    }
    setMessages([newMessage, ...messages])
    setComposer("")
    success("Message queued", "Your message would appear to mentors once approved.")
  }

  const navigateTo = (page: string) => {
    window.dispatchEvent(new CustomEvent("navigate", { detail: { href: page } }))
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle,_rgba(120,123,255,0.08),_transparent_65%)]">
      <header className="border-b bg-background/90 backdrop-blur">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <Button variant="ghost" className="w-fit gap-2 px-0 text-muted-foreground" onClick={() => navigateTo("community")}>
            <ArrowLeft className="h-4 w-4" />
            Back to landing
          </Button>
          <div className="text-muted-foreground text-sm">
            Live HQ is monitored 24/7. Respect the guardrails at all times.
          </div>
        </div>
      </header>

      <main className="container mx-auto grid gap-6 px-4 py-10 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="space-y-3">
            <Badge variant="outline" className="border-primary/30 text-primary">
              PromptNovaX HQ
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight">Where operators ship in public</h1>
            <p className="text-muted-foreground">
              This sandbox mirrors the real community chat. Every thread expects shipping updates, playbooks or requests for help with context.
            </p>
          </div>

          <Card className="border-primary/30">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Live conversation stream</CardTitle>
                <CardDescription>Messages refresh every few minutes. Mentors step in when tagged.</CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {messages.length} visible messages
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-[480px] rounded-2xl border border-border bg-muted/20">
                <div className="space-y-3 p-4">
                  {messages.map(message => (
                    <div key={`${message.author}-${message.timestamp}-${message.message.slice(0, 6)}`} className="rounded-2xl border border-dashed border-primary/30 bg-background/80 p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className="border-primary/40 text-primary">
                          {message.badge}
                        </Badge>
                        <span className="font-semibold">{message.author}</span>
                        <span className="text-xs text-muted-foreground">{message.role}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{message.timestamp}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{message.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-3 rounded-2xl border border-border/80 bg-background/90 p-4">
                <Textarea
                  placeholder="Write your update, include stack + goal + blockers..."
                  value={composer}
                  onChange={event => setComposer(event.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Use tags like #ship #help #idea. No promos, NDA leaks or AI-generated fluff.
                  </p>
                  <Button onClick={handleSend}>
                    Publish preview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding runway</CardTitle>
              <CardDescription>Complete these checkpoints before requesting full HQ access.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {membershipSteps.map(step => (
                <button
                  key={step.title}
                  onClick={() => navigateTo(step.target)}
                  className="w-full rounded-2xl border border-dashed border-border/60 p-4 text-left transition hover:border-primary/50 hover:bg-primary/5"
                >
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                  <Badge variant="outline" className="mt-2 border-primary/40 text-primary">
                    {step.cta}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-transparent">
            <CardHeader className="space-y-1">
              <CardTitle>Mentor presence</CardTitle>
              <CardDescription>Operators who volunteered for live coverage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Ava Flores", "Noah Grant", "Lucia P.", "Ravi Kapoor"].map(name => (
                <div key={name} className="flex items-center gap-3 rounded-2xl border border-border/70 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} />
                    <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">Online now</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Mentor
                  </Badge>
                </div>
              ))}
              <Separator />
              <Button variant="outline" className="w-full gap-2" onClick={() => navigateTo("community/desk/team")}>
                Meet full moderation desk
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need help?</CardTitle>
              <CardDescription>Ping the desk for escalations, takeovers or sponsorship requests.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full gap-2" onClick={() => navigateTo("community/desk/changelog")}>
                View latest guideline changelog
              </Button>
              <Button className="w-full gap-2" onClick={() => navigateTo("community/apply")}>
                Request full membership
                <UserPlus className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </aside>
      </main>

      <footer className="border-t bg-background/80">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>PromptNovaX Community HQ · Private space for verified operators.</span>
          <Link href="#community" className="text-primary">
            Return to community overview
          </Link>
        </div>
      </footer>
    </div>
  )
}

