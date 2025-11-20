import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const studies = [
  { logo: "Acme", title: "Acme Marketing", before: "4 weeks to launch", after: "9 days to launch", lift: "+3.1x faster" },
  { logo: "Nimbus", title: "Nimbus Support", before: "CSAT 4.1", after: "CSAT 4.5", lift: "+0.4 CSAT" },
  { logo: "Helix", title: "Helix Docs", before: "Docs coverage 42%", after: "Docs coverage 73%", lift: "+31% coverage" },
]

export function CaseStudiesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Proven in the Wild</h2>
          <p className="text-lg md:text-xl text-muted-foreground mt-3">Short wins from real teams using PNX.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studies.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">{s.logo}</div>
                  <div className="font-semibold mb-2">{s.title}</div>
                  <div className="text-sm">Before: {s.before}</div>
                  <div className="text-sm">After: {s.after}</div>
                  <div className="mt-2 text-primary font-medium">{s.lift}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CaseStudiesSection


