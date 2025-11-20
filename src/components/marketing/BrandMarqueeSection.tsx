import { motion } from "framer-motion"
import { Bot, Brain, Orbit, Atom, Sparkles, Shield } from "lucide-react"

const brands = [
  { name: "Acme", Icon: Atom },
  { name: "Monocle", Icon: Shield },
  { name: "Quanta", Icon: Sparkles },
  { name: "Nimbus", Icon: Orbit },
  { name: "Helix", Icon: Brain },
  { name: "Orbit", Icon: Bot },
]

export function BrandMarqueeSection() {
  return (
    <section className="py-14 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center text-xs uppercase tracking-wider text-muted-foreground mb-6">Trusted by teams at</div>
        <div className="relative">
          <motion.div
            className="flex gap-8 items-center"
            initial={{ x: 0 }}
            animate={{ x: [0, -400] }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          >
            {[...brands, ...brands].map((b, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-background/60 backdrop-blur">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-white/10 to-white/0 flex items-center justify-center">
                  <b.Icon className="h-4 w-4" />
                </div>
                <span className="font-medium opacity-80">{b.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default BrandMarqueeSection


