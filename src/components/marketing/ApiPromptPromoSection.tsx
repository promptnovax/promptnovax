import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { ServerCog, Code2 } from "lucide-react"

export function ApiPromptPromoSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1220] via-[#121429] to-[#0b1220]" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Prompt Studio for APIs</h2>
            <p className="text-lg text-white/70">Design prompts for any model + API (OpenAI, Claude, Gemini, SDXL, Runway) with parameters like temperature, max tokens, and system messages — then export the code.</p>
            <div className="flex gap-3 mt-6">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-white/80"><ServerCog className="h-4 w-4" /> Model & Keys agnostic</div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-white/80"><Code2 className="h-4 w-4" /> Live code preview</div>
            </div>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="#studio/api">Open API Prompt Studio</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="rounded-xl border p-6 bg-background/60">
              <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed bg-muted/40 rounded p-4 min-h-[240px]">{`const client = createClient(process.env.API_KEY)
const result = await client.generate({
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 600,
  system: "You are a helpful assistant",
  user: "Write a launch email for Smart Filters"
})
console.log(result)`}</pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ApiPromptPromoSection


