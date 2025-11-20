import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { GradientOrbs } from "@/components/visuals/SectionOrnaments"

const templates = [
  { name: "Blog Outline", category: "Marketing", img: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop" },
  { name: "Launch Email", category: "Marketing", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" },
  { name: "Support Reply", category: "Support", img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop" },
  { name: "Bug Triage", category: "Engineering", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" },
  { name: "Sales Follow‑up", category: "Sales", img: "https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=1200&auto=format&fit=crop" },
  { name: "Release Notes", category: "Engineering", img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop" },
  { name: "FAQ Generator", category: "Docs", img: "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1200&auto=format&fit=crop" },
  { name: "SEO Meta Pack", category: "Marketing", img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop" },
]

export function TemplatesLibrarySection() {
  return (
    <section id="templates" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1220] via-[#0c1a20] to-[#0b1220]" />
      <GradientOrbs />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Template Library</h2>
          <p className="text-lg md:text-xl text-white/70 mt-3">Ready‑made, field‑tested templates for every team. Start fast, customize, and ship.</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {["Marketing","Support","Engineering","Sales","Docs"].map((t) => (
              <Badge key={t} variant="secondary">{t}</Badge>
            ))}
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((tpl, i) => (
            <motion.div
              key={tpl.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <Card className="h-full hover:-translate-y-1 transition-transform overflow-hidden">
                <div className="relative h-28 w-full overflow-hidden">
                  <img src={tpl.img} alt={tpl.name} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                </div>
                <CardContent className="p-5">
                  <div className="text-sm text-white/60 mb-1">{tpl.category}</div>
                  <div className="font-semibold">{tpl.name}</div>
                  <div className="mt-3 h-2 w-1/2 bg-muted rounded" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button size="lg" variant="outline" asChild>
            <Link href="#templates/index">View More Templates</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default TemplatesLibrarySection


