import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Badge } from "@/components/ui/badge"
import heroBg from "@/media/pnx-hero-bg.png"
import teamVideo from "@/../media/next section.mp4"

const cases = {
  marketing: {
    title: "Marketing teams",
    pain: "Campaigns stall because drafts, reviews, and variants live in five tools.",
    solution: "PNX centralizes copy kits, approval workflows, and analytics so campaigns launch in days—not weeks.",
    metrics: [
      { k: "Time to draft", v: "-72%" },
      { k: "CTR lift", v: "+18%" },
      { k: "Cost/run", v: "$0.003" }
    ],
    cta: "#prompt-generator"
  },
  support: {
    title: "Support desks",
    pain: "Agents copy/paste outdated macros and AI summaries that legal can’t trust.",
    solution: "Standardize guardrailed prompts, auto-summaries, and QA checklists with full audit logs.",
    metrics: [
      { k: "Resolution time", v: "-34%" },
      { k: "CSAT", v: "+0.4" },
      { k: "Deflection", v: "+22%" }
    ],
    cta: "#solutions"
  },
  engineering: {
    title: "Product & engineering",
    pain: "Specs, release notes, and code reviews depend on whoever wrote the last prompt.",
    solution: "Version-controlled prompt blueprints, API exports, and telemetry wired to your stack.",
    metrics: [
      { k: "PR review time", v: "-28%" },
      { k: "Docs coverage", v: "+31%" },
      { k: "MTTR", v: "-12%" }
    ],
    cta: "#studio/api"
  },
  sales: {
    title: "Revenue teams",
    pain: "Personalization is manual, and battle cards never stay in sync.",
    solution: "Dynamic prompt kits tied to CRM data with variant testing and post-call summaries.",
    metrics: [
      { k: "Reply speed", v: "2.1x faster" },
      { k: "Meeting rate", v: "+14%" },
      { k: "Prep time", v: "-60%" }
    ],
    cta: "#marketplace"
  }
} as const

export function UseCasesSection() {
  return (
    <section id="use-cases" className="py-24 relative overflow-hidden">
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
          style={{ filter: "brightness(0.45) contrast(1.1)" }}
        >
          <source src={teamVideo} type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#050918]/92 via-[#050918]/82 to-[#050918]/95" />
      <div className="absolute inset-0 -z-10 opacity-35 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.15),transparent_55%),radial-gradient(circle_at_85%_5%,rgba(139,92,246,0.2),transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <Badge variant="outline" className="border-white/20 bg-white/5 text-white uppercase tracking-[0.3em] mb-4">
            Built for your team
          </Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Use cases with measurable lift</h2>
          <p className="text-lg md:text-xl text-white/75 mt-3">Switch tabs to see the exact problems we solve for each function.</p>
        </motion.div>

        <div className="mt-12">
          <Tabs defaultValue="marketing" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 max-w-3xl mx-auto bg-white/5 text-white">
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="engineering">Product & Eng</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
            </TabsList>

            {Object.entries(cases).map(([key, data]) => (
              <TabsContent key={key} value={key} className="mt-10">
                <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-6 items-stretch">
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardContent className="p-8 space-y-4">
                      <div className="text-xs uppercase tracking-[0.3em] text-white/60">Pain</div>
                      <p className="text-white/80 text-base leading-relaxed">{data.pain}</p>
                      <div className="pt-4 border-t border-white/10">
                        <div className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">PNX solution</div>
                        <h3 className="text-2xl font-semibold text-white mt-2">{data.title}</h3>
                        <p className="text-white/80 mt-2 leading-relaxed">{data.solution}</p>
                      </div>
                      <Button
                        size="lg"
                        asChild
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 mt-4"
                      >
                        <Link href={data.cta}>See workflows for {data.title.split(" ")[0]}</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {data.metrics.map(m => (
                      <Card key={m.k} className="border-white/10 bg-white/5 text-center backdrop-blur-xl">
                        <CardContent className="p-6">
                          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                            {m.v}
                          </div>
                          <div className="text-sm text-white/70">{m.k}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  )
}

export default UseCasesSection


