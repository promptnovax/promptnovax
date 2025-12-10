import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { 
  Sparkles, 
  Zap, 
  Wand2, 
  ArrowRight, 
  PlayCircle,
  Code2,
  Image as ImageIcon,
  Video,
  MessageSquare,
  FileCode
} from "lucide-react"
import ggVideo from "@/../media/gg.mp4"
import heroBg from "@/media/pnx-hero-bg.png"

const generatorFeatures = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Create perfect prompts using advanced AI algorithms",
    color: "text-purple-400"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate professional prompts in seconds",
    color: "text-yellow-400"
  },
  {
    icon: Wand2,
    title: "Smart Enhancement",
    description: "Automatically optimize and refine your prompts",
    color: "text-blue-400"
  },
  {
    icon: Code2,
    title: "Multi-Format Export",
    description: "Export to JSON, code, or any format you need",
    color: "text-green-400"
  }
]

const generatorTypes = [
  {
    icon: MessageSquare,
    label: "Text Prompts",
    description: "Generate text-based prompts for any AI model"
  },
  {
    icon: ImageIcon,
    label: "Image Prompts",
    description: "Create prompts for image generation models"
  },
  {
    icon: Video,
    label: "Video Prompts",
    description: "Design prompts for video generation"
  },
  {
    icon: FileCode,
    label: "Code Prompts",
    description: "Generate code and API payload prompts"
  }
]

export function AdvancedGeneratorsSection() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <section
      id="studio"
      className="relative py-32 overflow-hidden min-h-[100vh]"
      data-stack-panel="true"
      data-stack-foreground="true"
      data-snap-section="true"
    >
      {/* Video Background */}
      <div className="absolute inset-0 -z-30 bg-black" aria-hidden>
        <video
          className="h-full w-full object-cover opacity-90 scale-[1.05]"
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

      {/* Subtle tint only */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#050917]/30 via-[#050917]/20 to-transparent" />

      {/* Animated Glow Effects */}
      <motion.div
        className="absolute inset-0 -z-5 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.2), transparent 60%)",
            "radial-gradient(circle at 70% 30%, rgba(88, 101, 242, 0.25), transparent 60%)",
            "radial-gradient(circle at 50% 25%, rgba(139, 92, 246, 0.2), transparent 60%)",
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm mb-6"
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Prompt Generator Studio</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            >
              Create{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500">
                Production-Ready
              </span>{" "}
              Prompts
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            >
              Generate, enhance, and optimize prompts for any AI model. From text to images, videos to code—build perfect prompts in seconds.
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {generatorFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6 space-y-4">
                      <motion.div
                        className={`p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 w-fit ${feature.color}`}
                        animate={{
                          scale: hoveredFeature === index ? 1.1 : 1,
                          rotate: hoveredFeature === index ? [0, -5, 5, -5, 0] : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="h-6 w-6" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Generator Types Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {generatorTypes.map((type, index) => {
                const Icon = type.icon
                return (
                  <motion.div
                    key={type.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                    <Card className="relative border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                      <CardContent className="p-6 text-center space-y-3">
                        <div className="mx-auto p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 w-fit">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-white text-sm">{type.label}</h4>
                        <p className="text-xs text-white/60">{type.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
        </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                asChild
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 px-8 py-6 text-lg font-semibold shadow-[0_20px_60px_rgba(139,92,246,0.4)]"
              >
                <Link href="#prompt-generator">
                  <span className="relative z-10 flex items-center gap-2">
                    <PlayCircle className="h-5 w-5" />
                    Launch Prompt Generator
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-xl px-8 py-6 text-lg font-semibold"
              >
                <Link href="#prompt-generator">
                  <span className="flex items-center gap-2">
                    Explore Features
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="space-y-2">
              <motion.div
                className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.3, type: "spring" }}
              >
                10K+
              </motion.div>
              <p className="text-white/70 text-sm">Prompts Generated</p>
            </div>
            <div className="space-y-2">
              <motion.div
                className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.4, type: "spring" }}
              >
                95%
              </motion.div>
              <p className="text-white/70 text-sm">Success Rate</p>
                </div>
            <div className="space-y-2">
              <motion.div
                className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.5, type: "spring" }}
              >
                &lt;5s
              </motion.div>
              <p className="text-white/70 text-sm">Generation Time</p>
                </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
        }
      `}</style>
    </section>
  )
}

export default AdvancedGeneratorsSection
