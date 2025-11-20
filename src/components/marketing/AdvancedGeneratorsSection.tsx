import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Mode = "text" | "image" | "video" | "code"

const textModels = ["OpenAI GPT-4o", "Anthropic Claude 3", "Gemini 1.5"]
const imageModels = ["Midjourney", "Stable Diffusion XL", "Ideogram"]
const videoModels = ["Runway Gen-3", "Pika", "Kling"]

const styleChips = ["Professional", "Playful", "Technical", "Minimal", "Persuasive"]
const imgStyles = ["Photoreal", "Cinematic", "3D Render", "Studio Light", "Moody"]
const vidStyles = ["Product Ad", "Explainer", "Cinematic", "Kinetic Text", "App Demo"]

function Chips({ items, onPick }: { items: string[]; onPick: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(it => (
        <button key={it} onClick={() => onPick(it)} className="text-xs rounded-full border px-3 py-1 hover:bg-primary/10">
          {it}
        </button>
      ))}
    </div>
  )
}

const tabs = [
  {
    label: "Text",
    value: "text",
    prompt: `{
  "model": "gpt-4o",
  "prompt": "List 5 growth tactics for SaaS startups in 2024",
  "max_tokens": 400,
  "temperature": 0.7
}`,
    output: `• Product-led growth\n• Community building\n• SEO + programmatic content\n• Partnerships\n• AI-driven onboarding` },
  {
    label: "Chat",
    value: "chat",
    prompt: `{
  "model": "gpt-4o-chat",
  "messages": [
    { "role": "system", "content": "You are a product strategist." },
    { "role": "user", "content": "How can I reduce churn for B2B SaaS customers?" }
  ],
  "stream": true
}`,
    output: `Sure!\n- Analyze exit feedback\n- Offer retention incentives\n- Improve onboarding\n- Proactive support\n- Community/peer networking` },
  {
    label: "Image",
    value: "image",
    prompt: `{
  "model": "stable-diffusion-xl",
  "prompt": "Isometric 3D futuristic SaaS dashboard, vibrant colors, realistic lighting, depth of field",
  "size": "1024x1024",
  "num_images": 1
}`,
    output: `![image](https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400)` },
  {
    label: "Video",
    value: "video",
    prompt: `{
  "model": "runway-gen3",
  "prompt": "Show SaaS dashboard in action. UI elements flying in, charts animating, code editor glowing.",
  "seconds": 5,
  "output_format": "mp4"
}`,
    output: "[Video would play here]"},
  {
    label: "Code",
    value: "code",
    prompt: `import openai

res = openai.ChatCompletion.create(
  model="gpt-4o",
  messages=[
    {"role": "system", "content": "Expert Python developer."},
    {"role": "user", "content": "Generate a FastAPI endpoint for user login."}
  ]
)
print(res["choices"][0]["message"]["content"])
`,
    output: `@app.post("/login")\ndef login(user: User):\n    # ...\n    return {"authenticated": True}`},
  {
    label: "JSON",
    value: "json",
    prompt: `{
  "model": "gpt-4o",
  "tools": [
    {
      "type": "function",
      "function": { "name": "getWeather", "parameters": { "city": "Karachi" } }
    }
  ],
  "messages": [
    { "role": "user", "content": "What's the weather in Karachi?" }
  ]
}`,
    output: `{"city":"Karachi","temperature":"33°C","desc":"Mostly sunny"}`},
]

export function AdvancedGeneratorsSection() {
  const [tab, setTab] = useState(tabs[0].value)
  const tabData = tabs.find((x) => x.value === tab)
  const copy = async (text: string) => { try { await navigator.clipboard.writeText(text) } catch {}
  }

  return (
    <section id="studio" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1220] via-[#101a2e] to-[#0b1220]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-20 w-3/5 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl opacity-40" />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Multi‑Modal Generators Studio</h2>
          <p className="text-lg md:text-xl text-white/70 mt-3">Text, chat, image, video, code, even complex API payloads — real-world prompt engineering at scale.</p>
        </div>

        <div className="mt-12">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full flex gap-2 flex-wrap justify-center mb-8">
              {tabs.map(({ label, value }) => (
                <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
              ))}
            </TabsList>

            {tabs.map(({ value, prompt, output }, idx) => (
              <TabsContent key={value} value={value} className="grid md:grid-cols-2 gap-8">
                <div className="relative">
                  <div className="mb-3 text-xs uppercase tracking-wider text-white/60">Prompt Payload</div>
                  <button onClick={() => copy(prompt)} className="absolute right-2 -top-2 text-xs px-2 py-1 rounded bg-primary/20 hover:bg-primary/30">Copy</button>
                  <pre className="bg-neutral-950/60 rounded-lg p-4 text-xs md:text-sm overflow-x-auto font-mono border border-neutral-800 text-primary-foreground min-h-[160px]">
                    {prompt}
                  </pre>
                </div>
                <div className="relative">
                  <div className="mb-3 text-xs uppercase tracking-wider text-white/60">{value === "image" ? "Rendered Image" : value === "video" ? "Video Preview" : value === "code" ? "Generated Code" : value === "json" ? "Tool Output" : "Model Output"}</div>
                  {(value !== 'image' && value !== 'video') && (
                    <button onClick={() => copy(output)} className="absolute right-2 -top-2 text-xs px-2 py-1 rounded bg-primary/20 hover:bg-primary/30">Copy</button>
                  )}
                  {value === "image" ? (
                    <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400" alt="Example" className="rounded-xl border shadow-lg max-w-full h-44 object-cover mb-2" />
                  ) : value === "video" ? (
                    <div className="rounded-xl border shadow-lg bg-black text-white flex items-center justify-center h-44">[ Video Preview ]</div>
                  ) : value === "code" || value === "json" ? (
                    <pre className="bg-neutral-950/60 rounded-lg p-4 text-xs md:text-sm overflow-x-auto font-mono border border-neutral-800 text-green-300 min-h-[160px]">{output}</pre>
                  ) : (
                    <pre className="bg-black/70 rounded-lg p-4 text-xs md:text-sm overflow-x-auto font-mono border border-neutral-800 text-blue-300 min-h-[160px]">{output}</pre>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  )
}

export default AdvancedGeneratorsSection


