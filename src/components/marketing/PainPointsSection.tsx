import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { 
  Timer, 
  PlugZap, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Rocket,
  Sparkles
} from "lucide-react"
import sectionTwoBgVideo from "@/../media/section 2 bg.mp4"
import heroBg from "@/media/pnx-hero-bg.png"

const realLifeProblems = [
  {
    icon: Timer,
    problem: "Wasting Hours on Trial & Error",
    scenario: "Sarah, a marketing director, spends 3 hours daily testing different prompts to get the right tone for her campaign. Most fail, wasting time and budget.",
    solution: "With PNX, she finds pre-tested prompts in 30 seconds, A/B tests variants instantly, and ships campaigns 10x faster.",
    metric: "Save 20+ hours/week",
    color: "text-orange-400"
  },
  {
    icon: PlugZap,
    problem: "No Standardization Across Teams",
    scenario: "A tech startup has 5 developers each using different prompt styles. Code reviews become nightmares, and prompts break in production.",
    solution: "PNX provides versioned, tested prompts that work consistently. Teams collaborate on shared libraries with built-in quality checks.",
    metric: "95% fewer production errors",
    color: "text-blue-400"
  },
  {
    icon: Users,
    problem: "Skills Gap Blocks Adoption",
    scenario: "A design agency wants to use AI for client work, but only 2 out of 10 designers know how to write effective prompts.",
    solution: "PNX marketplace gives them studio-grade prompts ready to use. No expertise needed—just pick, customize, and create.",
    metric: "10x team productivity",
    color: "text-purple-400"
  }
]

const roleSolutions = [
  {
    role: "Marketers",
    icon: TrendingUp,
    pain: "Campaigns take weeks to launch. Testing different messaging is expensive and slow.",
    win: "Ship campaigns in days, not weeks",
    detail: "Access 500+ proven marketing prompts. A/B test variants instantly. Track performance with built-in analytics.",
    result: "3x faster campaign launches",
    color: "from-orange-500/20 to-red-500/10"
  },
  {
    role: "Developers",
    icon: Zap,
    pain: "Building AI features means writing prompts from scratch. No reusable components, constant debugging.",
    win: "Build AI features 10x faster",
    detail: "Use tested, versioned prompts as building blocks. Export to code. Integrate with your stack seamlessly.",
    result: "80% less development time",
    color: "from-blue-500/20 to-cyan-500/10"
  },
  {
    role: "Designers",
    icon: Sparkles,
    pain: "Creating visuals requires expensive tools and hours of iteration. Client revisions eat up time.",
    win: "Create stunning visuals instantly",
    detail: "Curated image and video prompts from top creators. Studio-quality results without the studio price tag.",
    result: "5x more client projects",
    color: "from-purple-500/20 to-pink-500/10"
  },
  {
    role: "Experts & Creators",
    icon: Rocket,
    pain: "Your expertise is valuable but hard to monetize. Creating courses takes months, and marketplaces are saturated.",
    win: "Monetize your expertise now",
    detail: "Sell prompt packs on our marketplace. Set your price, reach buyers instantly. Earn while you sleep.",
    result: "$5K+ monthly passive income",
    color: "from-green-500/20 to-emerald-500/10"
  }
]

export function PainPointsSection() {
  return (
    <section
      id="pain-points"
      className="relative py-32 overflow-hidden min-h-[100vh] flex items-center"
    >
      {/* Video Background - Seamlessly Integrated */}
      <div className="absolute inset-0 -z-30 bg-black" aria-hidden>
        <video
          className="h-full w-full object-cover opacity-85 scale-[1.03]"
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
            filter: "brightness(0.35) contrast(1.25) saturate(1.15)",
            objectPosition: "center center"
          }}
        >
          <source src={sectionTwoBgVideo} type="video/mp4" />
        </video>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0a0f1e]/90 via-[#0a0f1e]/80 to-[#0a0f1e]/92" />
      <div className="absolute inset-0 -z-15 opacity-50 bg-[radial-gradient(circle_at_15%_20%,rgba(255,107,53,0.2),transparent_50%),radial-gradient(circle_at_85%_15%,rgba(139,92,246,0.25),transparent_55%)] mix-blend-screen" />
      <div className="absolute inset-0 -z-10 opacity-30 animate-[gradientShift_18s_ease_infinite] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,107,53,0.15),rgba(15,23,42,0),rgba(139,92,246,0.2),rgba(15,23,42,0))]" />

      {/* Animated Glow Effects */}
      <motion.div
        className="absolute inset-0 -z-5 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 25% 25%, rgba(255, 107, 53, 0.15), transparent 65%)",
            "radial-gradient(circle at 75% 30%, rgba(139, 92, 246, 0.2), transparent 65%)",
            "radial-gradient(circle at 50% 20%, rgba(255, 107, 53, 0.15), transparent 65%)",
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
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
              <Target className="h-4 w-4 text-orange-400" />
              <span>Real Problems, Real Solutions</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
            >
              AI{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-500">
                Without the Friction
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed"
            >
              Stop wasting time on trial and error. PNX solves the real problems teams face every day: time, quality, and scale.
            </motion.p>
          </motion.div>

          {/* Real-Life Problems Section */}
          <div className="mb-20 space-y-8">
            {realLifeProblems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.problem}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />
                  <Card className="relative border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
                        <motion.div
                          className={`p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ${item.color} shrink-0`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Icon className="h-8 w-8" />
                        </motion.div>
                        <div className="space-y-4 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-2">{item.problem}</h3>
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-red-400 font-semibold mt-1">❌ Problem:</span>
                                  <p className="text-white/70 leading-relaxed flex-1">{item.scenario}</p>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-green-400 font-semibold mt-1">✅ Solution:</span>
                                  <p className="text-white/90 leading-relaxed flex-1 font-medium">{item.solution}</p>
                                </div>
                              </div>
                            </div>
                            <motion.div
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-white/10 backdrop-blur-sm shrink-0"
                              initial={{ scale: 0.9 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.7 + index * 0.2, type: "spring" }}
                            >
                              <div className="text-xs uppercase tracking-wider text-white/60 mb-1">Result</div>
                              <div className="text-lg font-bold text-white">{item.metric}</div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Role-Based Solutions */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Solutions for Every Role
              </h3>
              <p className="text-white/70 text-lg">
                See how PNX transforms workflows for different teams
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roleSolutions.map((role, index) => {
                const Icon = role.icon
                return (
                  <motion.div
                    key={role.role}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative group h-full"
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
                    <Card className="relative h-full border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                      <CardContent className="p-6 space-y-4 h-full flex flex-col">
                        <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${role.color} bg-opacity-20`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">{role.role}</div>
                        </div>
                        
                        <div className="space-y-3 flex-1">
                          <div className="space-y-2">
                            <div className="text-xs text-red-400 font-semibold uppercase tracking-wide">The Pain</div>
                            <p className="text-sm text-white/70 leading-relaxed">{role.pain}</p>
                          </div>
                          
                          <div className="space-y-2 pt-2 border-t border-white/10">
                            <div className="text-xs text-green-400 font-semibold uppercase tracking-wide">The Win</div>
                            <h4 className="text-lg font-bold text-white">{role.win}</h4>
                            <p className="text-sm text-white/80 leading-relaxed">{role.detail}</p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-white/50">Impact</div>
                            <div className="text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
                              {role.result}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-center"
          >
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  asChild
                  className="group relative overflow-hidden bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white border-0 px-8 py-6 text-lg font-semibold shadow-[0_20px_60px_rgba(255,107,53,0.4)] transition-all duration-300"
                >
                  <Link href="#prompt-generator">
                    <span className="relative z-10 flex items-center gap-2">
                      <Rocket className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      Start Solving Problems Now
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="group border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-xl px-8 py-6 text-lg font-semibold transition-all duration-300"
                >
                  <Link href="#solutions">
                    <span className="flex items-center gap-2">
                      Explore Solutions
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
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

export default PainPointsSection
