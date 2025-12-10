import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Badge } from "@/components/ui/badge"
import {
  ServerCog,
  Code2,
  Zap,
  CheckCircle2,
  ArrowRight,
  Key,
  Layers,
  ShieldCheck
} from "lucide-react"
import ggVideo from "@/../media/gg.mp4"
import heroBg from "@/media/pnx-hero-bg.png"

const features = [
  {
    icon: ServerCog,
    title: "Multi-Provider Support",
    description: "OpenAI, Claude, Gemini, Stable Diffusion, Runway—all in one place"
  },
  {
    icon: Code2,
    title: "Live Code Preview",
    description: "See your code in real-time as you design prompts"
  },
  {
    icon: Key,
    title: "API Key Management",
    description: "Secure, centralized key management for all providers"
  },
  {
    icon: Layers,
    title: "Parameter Control",
    description: "Fine-tune temperature, tokens, and all advanced parameters"
  }
]

export function ApiStudioPromoSection() {
  return (
    <section id="api-studio-promo" className="relative py-32 overflow-hidden min-h-[80vh] flex items-center">
      {/* Video Background */}
      <div className="absolute inset-0 -z-30 bg-black" aria-hidden>
        <video
          className="h-full w-full object-cover opacity-80 scale-[1.03]"
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
          style={{ 
            filter: "brightness(0.4) contrast(1.2) saturate(1.1)",
            objectPosition: "center center"
          }}
        >
          <source src={ggVideo} type="video/mp4" />
        </video>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0a0f1e]/90 via-[#0a0f1e]/80 to-[#0a0f1e]/92" />
      <div className="absolute inset-0 -z-15 opacity-50 bg-[radial-gradient(circle_at_20%_25%,rgba(88,101,242,0.2),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.25),transparent_55%)] mix-blend-screen" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                <ServerCog className="h-4 w-4 text-blue-400" />
                <span>PNX API Studio</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
                Design Prompts for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Any AI Model
                </span>
              </h2>

              <p className="text-xl text-white/80 leading-relaxed">
                Build production-ready prompts with full parameter control. Test, iterate, and export code for OpenAI, Claude, Gemini, and more—all from one powerful studio.
              </p>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="border-white/20 bg-white/10 text-white px-4 py-2">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Model Agnostic
                </Badge>
                <Badge variant="secondary" className="border-white/20 bg-white/10 text-white px-4 py-2">
                  <Code2 className="h-4 w-4 mr-2" />
                  Code Export
                </Badge>
                <Badge variant="secondary" className="border-white/20 bg-white/10 text-white px-4 py-2">
                  <Zap className="h-4 w-4 mr-2" />
                  Live Preview
                </Badge>
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  asChild
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 px-8 py-6 text-lg font-semibold shadow-[0_20px_60px_rgba(88,101,242,0.4)]"
                >
                  <Link href="#studio/api">
                    <span className="flex items-center gap-2">
                      Open API Studio
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Features Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/10 w-fit mb-4">
                          <Icon className="h-6 w-6 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-sm text-white/70 leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ApiStudioPromoSection

