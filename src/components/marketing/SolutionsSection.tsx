import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Users,
  Code2,
  Sparkles,
  TrendingUp,
  Rocket,
  Target,
  FileCode,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Globe,
  BookOpen,
  Lightbulb
} from "lucide-react"
import sectionTwoBgVideo from "@/../media/section 2 bg.mp4"
import heroBg from "@/media/pnx-hero-bg.png"

const solutionCategories = [
  {
    icon: Sparkles,
    title: "Prompt Generator",
    description: "Create production-ready prompts in seconds with AI-powered generation",
    features: [
      "Multi-modal support (Text, Image, Video, Code)",
      "AI-powered enhancement",
      "Version history & rollback",
      "Export to multiple formats"
    ],
    href: "#prompt-generator",
    color: "from-purple-500/20 to-blue-500/10",
    iconColor: "text-purple-400"
  },
  {
    icon: Code2,
    title: "API Studio",
    description: "Design, test, and export prompts for any AI model with full parameter control",
    features: [
      "Multi-provider support (OpenAI, Claude, Gemini)",
      "Live code preview",
      "Parameter fine-tuning",
      "Export ready-to-use code"
    ],
    href: "#studio/api",
    color: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-400"
  },
  {
    icon: Globe,
    title: "Marketplace",
    description: "Browse thousands of curated prompts from top creators and experts",
    features: [
      "3,000+ ready-to-use prompts",
      "Curated by industry experts",
      "Instant download & use",
      "Community ratings & reviews"
    ],
    href: "#marketplace",
    color: "from-orange-500/20 to-red-500/10",
    iconColor: "text-orange-400"
  },
  {
    icon: Users,
    title: "Community",
    description: "Join a thriving community of AI enthusiasts, creators, and professionals",
    features: [
      "Share & collaborate on prompts",
      "Learn from experts",
      "Get feedback & improve",
      "Build your reputation"
    ],
    href: "#community",
    color: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-green-400"
  }
]

const useCases = [
  {
    title: "Marketing Campaigns",
    description: "Generate compelling copy, A/B test variants, and optimize for conversions",
    icon: TrendingUp,
    examples: ["Email campaigns", "Social media posts", "Ad copy", "Product descriptions"]
  },
  {
    title: "Content Creation",
    description: "Create blog posts, articles, and long-form content with consistent quality",
    icon: BookOpen,
    examples: ["Blog articles", "Newsletters", "Documentation", "Tutorials"]
  },
  {
    title: "Visual Design",
    description: "Generate stunning images and videos for your projects and campaigns",
    icon: ImageIcon,
    examples: ["Product images", "Social graphics", "Video intros", "Brand assets"]
  },
  {
    title: "Development",
    description: "Build AI features faster with tested prompts and code exports",
    icon: FileCode,
    examples: ["API integrations", "Chatbots", "Automation", "Data processing"]
  }
]

export function SolutionsSection() {
  return (
    <section
      id="solutions"
      className="relative py-32 overflow-hidden min-h-[100vh]"
      data-snap-section="true"
      data-snap-strong="true"
      data-stack-panel="true"
      data-stack-foreground="true"
    >
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
          <source src={sectionTwoBgVideo} type="video/mp4" />
        </video>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0a0f1e]/92 via-[#0a0f1e]/85 to-[#0a0f1e]/94" />
      <div className="absolute inset-0 -z-15 opacity-50 bg-[radial-gradient(circle_at_20%_25%,rgba(139,92,246,0.2),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(88,101,242,0.25),transparent_55%)] mix-blend-screen" />
      <div className="absolute inset-0 -z-10 opacity-30 animate-[gradientShift_20s_ease_infinite] bg-[conic-gradient(from_200deg_at_50%_50%,rgba(139,92,246,0.15),rgba(15,23,42,0),rgba(88,101,242,0.2),rgba(15,23,42,0))]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm mb-6"
            >
              <Target className="h-4 w-4 text-purple-400" />
              <span>Complete Solutions</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
            >
              Everything You Need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500">
                Succeed with AI
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed"
            >
              From prompt generation to API integration, marketplace to community—PNX provides all the tools you need to build, deploy, and scale AI-powered workflows.
            </motion.p>
          </motion.div>

          {/* Solution Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {solutionCategories.map((solution, index) => {
              const Icon = solution.icon
              return (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500`} />
                  <Card className="relative h-full border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${solution.color} bg-opacity-30`}>
                          <Icon className={`h-8 w-8 ${solution.iconColor}`} />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <Link href={solution.href}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <CardTitle className="text-2xl text-white mb-2">{solution.title}</CardTitle>
                      <p className="text-white/70 leading-relaxed">{solution.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {solution.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-white/80">
                            <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        size="lg"
                        asChild
                        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0"
                      >
                        <Link href={solution.href}>
                          Explore {solution.title}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Use Cases */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Popular Use Cases
              </h3>
              <p className="text-white/70 text-lg">
                See how teams use PNX to solve real challenges
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, index) => {
                const Icon = useCase.icon
                return (
                  <motion.div
                    key={useCase.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 w-fit mb-4">
                          <Icon className="h-6 w-6 text-purple-400" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">{useCase.title}</h4>
                        <p className="text-sm text-white/70 mb-4 leading-relaxed">{useCase.description}</p>
                        <div className="space-y-1">
                          {useCase.examples.map((example, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="mr-1 mb-1 border-white/10 bg-white/5 text-white/80 text-xs"
                            >
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center"
          >
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 px-8 py-6 text-lg font-semibold shadow-[0_20px_60px_rgba(139,92,246,0.4)]"
                >
                  <Link href="#prompt-generator">
                    <Rocket className="mr-2 h-5 w-5" />
                    Get Started Free
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-xl px-8 py-6 text-lg font-semibold"
                >
                  <Link href="#marketplace">
                    Browse Marketplace
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
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

export default SolutionsSection

