import { motion } from "framer-motion"
import { CheckCircle2, Gauge, ShieldCheck, Workflow, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import heroBg from "@/media/pnx-hero-bg.png"
import nextSectionVideo from "@/../media/next section.mp4"

export function SaaSOutcomesSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 -z-30 bg-black" aria-hidden>
        <video
          className="h-full w-full object-cover opacity-95 pointer-events-none scale-[1.02]"
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
          style={{ filter: "brightness(0.75) contrast(1.1) saturate(1.1)" }}
        >
          <source src={nextSectionVideo} type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#050917]/35 via-[#050917]/65 to-[#050917]/90" />
      <div className="absolute inset-0 -z-15 opacity-50 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.16),transparent_45%),radial-gradient(circle_at_82%_5%,rgba(121,134,255,0.35),transparent_55%)] mix-blend-screen" />
      <div className="absolute inset-0 -z-10 opacity-30 animate-[gradientShift_18s_ease_infinite] bg-[conic-gradient(from_240deg_at_50%_50%,rgba(88,101,242,0.2),rgba(15,23,42,0),rgba(168,85,247,0.24),rgba(15,23,42,0))]" />

      <div className="container mx-auto px-4">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Operationalize AI Across Your Team</h2>
          <p className="text-lg md:text-xl text-white/70 mt-3">
            PNX turns scattered prompt usage into governed, measurable workflows — with reviews, versioning, and outcome analytics.
          </p>
        </motion.div>

        {/* content */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* left: feature bullets */}
          <div className="space-y-5">
            {[
              { icon: Workflow, title: "Standardized pipelines", desc: "Reusable prompt flows with approvals and handoffs." },
              { icon: ShieldCheck, title: "Built‑in guardrails", desc: "PII checks, audit trails, and role‑based access controls." },
              { icon: Gauge, title: "Performance at a glance", desc: "Prompt variants auto‑A/B tested with latency and cost insights." },
              { icon: LineChart, title: "Outcome analytics", desc: "Track conversion, CTR, and downstream business impact." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-4"
              >
                <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-lg">{f.title}</div>
                  <div className="text-sm text-white/70">{f.desc}</div>
                </div>
              </motion.div>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              {["Versioning", "Reviews", "RBAC", "A/B Tests", "Webhooks"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {t}
                </span>
              ))}
            </div>

            <div className="pt-4">
              <Button size="lg">Book a Live Demo</Button>
            </div>
          </div>

          {/* right: product mock / animated card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 relative overflow-hidden">
              <div className="absolute -inset-1 opacity-30 bg-[radial-gradient(800px_400px_at_90%_-10%,theme(colors.primary/30),transparent)]" />
              <CardContent className="relative p-0">
                <div className="grid grid-cols-12 gap-3">
                  {/* left rail */}
                  <div className="col-span-5 space-y-3">
                    {["Draft", "Review", "Approve", "Deploy"].map((step, idx) => (
                      <div key={step} className={`rounded-lg border p-3 ${idx < 3 ? 'bg-background' : 'bg-muted/40'}`}>
                        <div className="text-sm font-medium">{step}</div>
                        <div className="mt-1 h-2 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                  {/* center flow */}
                  <div className="col-span-7">
                    <div className="rounded-lg border p-4 bg-background">
                      <div className="text-xs uppercase tracking-wider text-white/60 mb-2">Prompt Variant A</div>
                      <div className="h-28 rounded bg-muted" />
                      <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                        {[
                          { k: "Win rate", v: "62%" },
                          { k: "Latency", v: "420ms" },
                          { k: "Cost", v: "$0.003" },
                        ].map(m => (
                          <div key={m.k}>
                            <div className="text-xl font-bold">{m.v}</div>
                            <div className="text-xs text-white/60">{m.k}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default SaaSOutcomesSection


