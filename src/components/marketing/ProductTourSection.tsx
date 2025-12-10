import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"
import { Sparkles, Gauge, Rocket, BarChart3, CheckCircle2, ArrowRight } from "lucide-react"
import heroBg from "@/media/pnx-hero-bg.png"
import dashboardVideo from "@/../media/dashboard side video.mp4"

const tourSteps = [
  {
    icon: Sparkles,
    step: "Compose",
    title: "Smart Prompt Generator",
    detail: "Variables, tone controls, templates, and guardrails for every draft."
  },
  {
    icon: Gauge,
    step: "Govern",
    title: "Reviews & Approvals",
    detail: "Checklists, rich comments, and version history your legal team will love."
  },
  {
    icon: Rocket,
    step: "Ship",
    title: "A/B Variants & Automation",
    detail: "Spin up variants, route to APIs, and trigger automations without leaving PNX."
  },
  {
    icon: BarChart3,
    step: "Measure",
    title: "Analytics that tie to KPIs",
    detail: "Outcome dashboards that track win rate, latency, and cost-per-run."
  }
]

const previewCode = `const client = createClient(process.env.API_KEY)
const result = await client.generate({
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 600,
  system: "You are a helpful assistant.",
  user: "Write a launch email for Smart Filters"
})
console.log(result)`

export function ProductTourSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-30 bg-black" aria-hidden>
        <video
          className="h-full w-full object-cover opacity-80"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={heroBg}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noremoteplayback nofullscreen"
          style={{ filter: "brightness(0.45) contrast(1.2)" }}
        >
          <source src={dashboardVideo} type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#050918]/90 via-[#050918]/75 to-[#050918]/92" />
      <div className="absolute inset-0 -z-10 opacity-40 animate-[gradientShift_18s_ease_infinite] bg-[radial-gradient(circle_at_20%_15%,rgba(139,92,246,0.25),transparent_55%),radial-gradient(circle_at_80%_5%,rgba(59,130,246,0.25),transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <Badge variant="outline" className="border-white/20 bg-white/5 text-white uppercase tracking-[0.3em] mb-5">
                Guided product tour
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                Take a quick{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                  product tour
                </span>
              </h2>
              <p className="text-lg md:text-xl text-white/80 mt-4 leading-relaxed">
                Watch how drafts become reviewed, tested, and measured without leaving PNX. Every phase is built for SaaS teams that need governance and speed.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-5">
              {tourSteps.map((step, idx) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 blur-2xl group-hover:opacity-100" />
                    <Card className="relative border-white/10 bg-white/5 backdrop-blur-xl">
                      <CardContent className="p-5 flex gap-4 items-start">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-[0.3em] text-white/60">{step.step}</div>
                          <div className="text-lg font-semibold text-white mt-1">{step.title}</div>
                          <p className="text-sm text-white/70 mt-1">{step.detail}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Button size="lg" asChild className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-0 px-8 py-6 text-lg font-semibold">
                <Link href="#prompt-generator">
                  Launch Prompt Studio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold">
                <Link href="#solutions">See all workflows</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/30 to-blue-500/10 blur-3xl" aria-hidden />
            <Card className="relative border-white/10 bg-slate-950/70 backdrop-blur-xl shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-white/70 text-sm">
                  <span>API preview</span>
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Ready for export
                  </span>
                </div>
                <pre className="bg-black/70 border border-white/10 rounded-2xl p-6 text-sm leading-relaxed text-white/90 font-mono whitespace-pre-wrap min-h-[260px]">
                  {previewCode}
                </pre>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/80 text-sm">
                  <div className="uppercase text-[0.65rem] tracking-[0.3em] mb-1 text-white/60">Scenario</div>
                  <p>Marketing team launches Smart Filters in three markets. Variants push to API Studio with review notes attached.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <style>{`
        @keyframes gradientShift {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
        }
      `}</style>
    </section>
  )
}

export default ProductTourSection


