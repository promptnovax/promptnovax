import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function GeneratorsStudioSection() {
  const [feature, setFeature] = useState("Smart Filters")
  const [audience, setAudience] = useState("Growth Marketers")
  const output = `Subject: Launching ${feature} for ${audience}\n\nUnlock faster results with reusable prompts, versioning, and analytics. Start free.`

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1220] via-[#0b0f19] to-[#090c14]" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Generators Studio</h2>
          <p className="text-lg md:text-xl text-white/70 mt-3">Compose prompts with variables and preview output instantly.</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm text-white/70">Feature</label>
                <Input value={feature} onChange={e => setFeature(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-white/70">Audience</label>
                <Input value={audience} onChange={e => setAudience(e.target.value)} />
              </div>
              <Button variant="outline">Insert Variables</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-xs uppercase tracking-wider text-white/60 mb-2">Preview</div>
              <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed bg-muted/40 rounded p-4 min-h-[160px]">{output}</pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default GeneratorsStudioSection


