import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { GradientOrbs } from "@/components/visuals/SectionOrnaments"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Layers, MessageCircle, Send, Database, Box, LayoutTemplate, PlugZap } from "lucide-react"

const vendors = [
  { name: "PromptNovaX", hue: "from-indigo-400/40 to-purple-400/10", Icon: Box, info: "Native AI workflows, role-based prompts" },
  { name: "OpenAI", hue: "from-sky-500/20 to-sky-500/5", Icon: PlugZap, info: "GPT, Completions, Embeddings" },
  { name: "Anthropic", hue: "from-amber-500/20 to-amber-500/5", Icon: Layers, info: "Claude models, context expansion" },
  { name: "Gemini", hue: "from-blue-500/20 to-blue-500/5", Icon: Database, info: "Web & vision LLMs, JSON tools" },
  { name: "Slack", hue: "from-cyan-500/20 to-cyan-500/5", Icon: MessageCircle, info: "Real-time team chat AI connect" },
  { name: "Notion", hue: "from-neutral-500/20 to-neutral-500/5", Icon: LayoutTemplate, info: "Write AI notes & docs automatically" },
  { name: "Zapier", hue: "from-orange-500/20 to-orange-500/5", Icon: Send, info: "Automate triggers, events, workflows" },
]

export function IntegrationsSection() {
  return (
    <section id="integrations" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1220] via-[#0f1629] to-[#0b1220]" />
      <GradientOrbs />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Integrates with Your Stack</h2>
          <p className="text-lg md:text-xl text-white/70 mt-3">Connect models, data, and workflows. No heavy lifts — ship on day one.</p>
        </motion.div>

        <TooltipProvider>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {vendors.map((v, i) => (
              <Tooltip key={v.name}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                  >
                    <Card className={`h-24 rounded-xl border bg-gradient-to-br ${v.hue} backdrop-blur overflow-hidden hover:shadow-lg transition-transform flex items-center justify-center group relative cursor-pointer`}>
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-background/80 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-transform duration-300 border border-primary/30 relative">
                          {v.name === "PromptNovaX" ? (
                            <span className="text-2xl">🪐</span>
                          ) : (
                            <v.Icon className="h-6 w-6 text-primary" />
                          )}
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-3 w-9 rounded-full bg-primary/30 blur opacity-60" />
                        </div>
                        <div className="text-base font-medium opacity-80">{v.name}</div>
                      </div>
                    </Card>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{v.info}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="#integrations/index">See All Integrations</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default IntegrationsSection


