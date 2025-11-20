import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const wins = [
  { k: "Ship Faster", v: "3.1x", d: "Generator + Reviews + A/B" },
  { k: "Cut Prompt Cost", v: "-28%", d: "Variants + Analytics" },
  { k: "Team Adoption", v: "+2.4x", d: "Templates + RBAC" },
]

export function CustomerProofSection() {
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
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Why Teams Choose PNX</h2>
          <p className="text-lg md:text-xl text-muted-foreground mt-3">Measured wins from production use — not lab demos.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wins.map((w, i) => (
            <motion.div key={w.k} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-1">{w.v}</div>
                  <div className="text-sm text-muted-foreground mb-2">{w.k}</div>
                  <Badge variant="secondary">{w.d}</Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CustomerProofSection


