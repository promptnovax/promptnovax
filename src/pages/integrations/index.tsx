import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/components/ui/link"
import { PlugZap, Layers, Database, MessageCircle, LayoutTemplate, Send, Box } from "lucide-react"

const vendors = [
  { name: "PromptNovaX", Icon: Box, desc: "Native workflows, governed prompts, analytics" },
  { name: "OpenAI", Icon: PlugZap, desc: "GPT, Completions, Embeddings" },
  { name: "Anthropic", Icon: Layers, desc: "Claude models, long-context" },
  { name: "Gemini", Icon: Database, desc: "Web & vision LLMs, JSON tools" },
  { name: "Slack", Icon: MessageCircle, desc: "Real-time AI in team chat" },
  { name: "Notion", Icon: LayoutTemplate, desc: "Docs, notes, report generation" },
  { name: "Zapier", Icon: Send, desc: "Automations and triggers" },
]

export function IntegrationsIndexPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Integrations</h1>
        <p className="text-lg text-muted-foreground mt-2">Connect your favorite models and tools in minutes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((v, i) => (
          <motion.div key={v.name} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card>
              <CardContent className="p-6 flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <v.Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{v.name}</div>
                  <div className="text-sm text-muted-foreground">{v.desc}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link href="#home" className="text-sm text-muted-foreground hover:text-primary">Back to Home</Link>
      </div>
    </div>
  )
}

export default IntegrationsIndexPage



