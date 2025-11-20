import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Link } from "@/components/ui/link"
import { Sparkles, Gauge, BarChart3, Workflow } from "lucide-react"

const feats = [
  { icon: Sparkles, title: "Generators", desc: "Multi-modal prompts for text, chat, image, video, code.", href: "#studio" },
  { icon: Workflow, title: "Templates", desc: "Ready-made, tested prompts with tags and previews.", href: "#templates/index" },
  { icon: Gauge, title: "Performance", desc: "A/B variants, latency and cost insights.", href: "#home" },
  { icon: BarChart3, title: "Analytics", desc: "Outcome tracking tied to real metrics.", href: "#home" },
]

export function FeaturesIndexPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Features</h1>
        <p className="text-lg text-muted-foreground mt-2">Explore the core capabilities of PromptNovaX.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {feats.map((f, i) => {
          const Icon = f.icon
          return (
            <motion.div key={f.title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href={f.href} className="text-sm text-muted-foreground hover:text-primary">Learn more →</Link>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default FeaturesIndexPage



