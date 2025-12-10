import { motion } from "framer-motion"
import { ArrowRight, Briefcase, Globe, Sparkles, Users, Target, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import heroBg from "@/media/pnx-hero-bg.png"

const roles = [
  { title: "Senior Frontend Engineer", location: "Remote · PK/Global", type: "Full-time" },
  { title: "AI Prompt Engineer", location: "Remote · PK/Global", type: "Full-time" },
  { title: "Product Designer (SaaS)", location: "Remote · PK/Global", type: "Contract to Hire" },
  { title: "Growth Marketer", location: "Hybrid · Lahore", type: "Full-time" },
]

const values = [
  { icon: Sparkles, title: "Ship fast", desc: "Small crews owning outcomes with rapid releases." },
  { icon: Shield, title: "Trust & privacy", desc: "Secure by default for every buyer and builder workflow." },
  { icon: Users, title: "Kind candor", desc: "Direct feedback with respect for people and time." },
  { icon: Target, title: "Impact focus", desc: "Prioritize what moves customers and revenue forward." },
]

export function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="relative overflow-hidden">
        <img
          src={heroBg}
          alt="PNX"
          className="absolute inset-0 h-full w-full object-cover opacity-10 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

        <div className="container mx-auto px-4 pt-20 pb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/30">We’re hiring</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Build the future of prompt commerce at PNX
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
              Join the founding team led by Haider Shabbir. We’re crafting buyer-grade experiences for prompts,
              APIs, and automations—serving creators, agencies, and product teams globally.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> Remote-first
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Early team equity
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Builder culture
              </Badge>
            </div>
            <div className="mt-8 flex gap-3">
              <Button size="lg" asChild>
                <a href="mailto:careers@promptnovax.com">Email your CV</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#open-roles">View open roles</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="open-roles" className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Open roles</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowRight className="h-4 w-4" />
            Drag your talent here—let’s build together.
          </div>
        </div>
        <div className="grid gap-4">
          {roles.map(role => (
            <Card key={role.title} className="group transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-5">
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{role.title}</h3>
                  <p className="text-sm text-muted-foreground">{role.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{role.type}</Badge>
                  <Button size="sm" asChild>
                    <a href="mailto:careers@promptnovax.com?subject=Role%20Application">Apply</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <Card key={value.title} className="h-full">
                <CardHeader className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-muted-foreground">{value.desc}</CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
