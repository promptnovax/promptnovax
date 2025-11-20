import { motion } from "framer-motion"
import { GradientOrbs } from "@/components/visuals/SectionOrnaments"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

const cases = {
  marketing: {
    title: "Marketing",
    metrics: [
      { k: "Time to draft", v: "-72%" },
      { k: "CTR lift", v: "+18%" },
      { k: "Cost/run", v: "$0.003" }
    ],
    blurb: "Ship campaigns faster with governed prompts and variant testing."
  },
  support: {
    title: "Support",
    metrics: [
      { k: "Resolution time", v: "-34%" },
      { k: "CSAT", v: "+0.4" },
      { k: "Deflection", v: "+22%" }
    ],
    blurb: "Standard replies with guardrails, auto‑summaries, and tone controls."
  },
  engineering: {
    title: "Engineering",
    metrics: [
      { k: "PR review time", v: "-28%" },
      { k: "Docs coverage", v: "+31%" },
      { k: "MTTR", v: "-12%" }
    ],
    blurb: "Consistent prompts for specs, code comments, and change logs."
  },
  sales: {
    title: "Sales",
    metrics: [
      { k: "Reply speed", v: "+2.1x" },
      { k: "Meeting rate", v: "+14%" },
      { k: "Prep time", v: "-60%" }
    ],
    blurb: "Personalized outreach and call notes, tied to CRM."
  }
} as const

export function UseCasesSection() {
  return (
    <section id="use-cases" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1220] via-[#14112d] to-[#0b1220]" />
      <GradientOrbs />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Built for Your Team</h2>
          <p className="text-lg md:text-xl text-white/70 mt-3">Switch tabs to see role‑specific outcomes.</p>
        </motion.div>

        <div className="mt-10">
          <Tabs defaultValue="marketing" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 max-w-3xl mx-auto">
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="engineering">Engineering</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
            </TabsList>

            {Object.entries(cases).map(([key, data]) => (
              <TabsContent key={key} value={key} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <Card className="md:col-span-1">
                    <CardContent className="p-6">
                      <div className="text-xl font-semibold mb-2">{data.title}</div>
                      <p className="text-sm text-white/70">{data.blurb}</p>
                    </CardContent>
                  </Card>
                  {data.metrics.map(m => (
                    <Card key={m.k}>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold mb-1">{m.v}</div>
                        <div className="text-sm text-white/70">{m.k}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  )
}

export default UseCasesSection


