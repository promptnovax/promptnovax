import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Gauge, Rocket, BarChart3 } from "lucide-react"

const items = [
  {
    icon: Sparkles,
    title: "Smart Prompt Generator",
    desc: "AI-assisted drafts with variables, tone controls, and guardrails.",
    preview: `Act as a product marketer.\nWrite a launch email for {feature} targeting {segment}.\nConstraints: 120–150 words, positive tone.`
  },
  {
    icon: Gauge,
    title: "Reviews & Approvals",
    desc: "Built-in checklists, comments, and version history for teams.",
    preview: `Checklist:\n- Brand tone aligned\n- PII scrubbed\n- Links validated\n- Variant notes added`
  },
  {
    icon: Rocket,
    title: "A/B Variants",
    desc: "Test multiple prompts, track win rate, latency, and cost.",
    preview: `Variant A → CTR 3.4%\nVariant B → CTR 4.1%\nWinner → Variant B`
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Outcome dashboards tied to business metrics, not just tokens.",
    preview: `Campaign: Onboarding v2\nSends: 12,410\nWin rate: 62%\nAvg Cost: $0.003/run`
  }
]

export function ProductTourSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1220] via-[#131432] to-[#0b1220]" />
      <div className="absolute inset-0 -z-10 opacity-25 animate-[gradientShift_18s_linear_infinite] bg-[conic-gradient(from_200deg_at_50%_50%,rgba(99,102,241,0.10),rgba(15,23,42,0),rgba(56,189,248,0.10),rgba(15,23,42,0))]" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Take a Quick Product Tour</h2>
          <p className="text-lg md:text-xl text-white/70 mt-3">See how drafts become reviewed, tested, and measured — all inside PNX.</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, idx) => {
            const Icon = it.icon
            return (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <Card className="h-full group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{it.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/70 mb-4">{it.desc}</p>
                    <div className="rounded-lg border bg-background p-3 font-mono text-xs whitespace-pre-wrap leading-relaxed min-h-[112px]">
                      {it.preview}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Button size="lg">Start Free</Button>
        </motion.div>
      </div>
    </section>
  )
}

export default ProductTourSection


