import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Timer, PlugZap, Users, DollarSign } from "lucide-react"

const pains = [
  { icon: Timer, title: "Time‑consuming", desc: "Scattered tools and trial‑and‑error slow teams down." },
  { icon: PlugZap, title: "Hard to operationalize", desc: "No standards, no reviews, no versioning." },
  { icon: Users, title: "Skills gap", desc: "Not everyone is a prompt expert — and that’s okay." },
]

const roles = [
  { r: "Marketers", win: "Ship campaigns faster", detail: "Use ready templates + A/B variants for higher CTR." },
  { r: "Developers", win: "Build faster", detail: "Use tested prompts to scaffold apps with your favorite AI tools." },
  { r: "Designers", win: "Create stunning visuals", detail: "Grab curated prompts for images and video — studio‑grade." },
  { r: "Experts", win: "Monetize expertise", detail: "Sell prompt packs and earn from the marketplace." },
]

export function PainPointsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-background to-background" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">AI Without the Friction</h2>
          <p className="text-lg md:text-xl text-muted-foreground mt-3">PNX solves the real problems: time, quality, and scale.</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pains.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-6 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold text-foreground">{title}</div>
                    <div className="text-sm text-muted-foreground">{desc}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          {roles.map((x, i) => (
            <motion.div key={x.r} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">{x.r}</div>
                  <div className="font-semibold text-foreground">{x.win}</div>
                  <div className="text-sm text-muted-foreground mt-1">{x.detail}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PainPointsSection


