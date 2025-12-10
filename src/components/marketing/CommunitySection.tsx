import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  MessageSquare,
  TrendingUp,
  Star,
  ArrowRight,
  Heart,
  Share2,
  Award
} from "lucide-react"
import sectionTwoBgVideo from "@/../media/section 2 bg.mp4"
import heroBg from "@/media/pnx-hero-bg.png"

const communityStats = [
  { label: "Active Members", value: "50K+", icon: Users },
  { label: "Prompts Shared", value: "100K+", icon: Share2 },
  { label: "Community Ratings", value: "4.9/5", icon: Star },
  { label: "Monthly Growth", value: "25%", icon: TrendingUp }
]

const testimonials = [
  {
    name: "Alex Chen",
    role: "Senior Developer",
    company: "TechCorp",
    avatar: "AC",
    content: "The PNX community has been incredible. I've learned so much from sharing prompts and getting feedback.",
    rating: 5
  },
  {
    name: "Sarah Martinez",
    role: "Marketing Director",
    company: "GrowthCo",
    avatar: "SM",
    content: "Found my best-performing campaign prompts in the community. The collaboration here is unmatched.",
    rating: 5
  },
  {
    name: "David Kim",
    role: "AI Creator",
    company: "Indie",
    avatar: "DK",
    content: "Monetizing my expertise through PNX marketplace changed everything. The community support is amazing.",
    rating: 5
  }
]

export function CommunitySection() {
  return (
    <section
      id="community"
      className="relative py-32 overflow-hidden min-h-[90vh] flex items-center"
      data-stack-panel="true"
      data-stack-foreground="true"
      data-snap-section="true"
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
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0a0f1e]/90 via-[#0a0f1e]/80 to-[#0a0f1e]/92" />
      <div className="absolute inset-0 -z-15 opacity-50 bg-[radial-gradient(circle_at_20%_25%,rgba(139,92,246,0.2),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(88,101,242,0.25),transparent_55%)] mix-blend-screen" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm mb-6">
              <Users className="h-4 w-4 text-purple-400" />
              <span>PNX Community</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-white">
              Join a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Thriving Community
              </span>
            </h2>

            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Connect with AI enthusiasts, share your work, learn from experts, and grow together.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {communityStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 text-center">
                    <CardContent className="p-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 w-fit mx-auto mb-4">
                        <Icon className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="border-2 border-white/20">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-xs text-white/60">{testimonial.role} • {testimonial.company}</div>
                      </div>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed mb-4">{testimonial.content}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                size="lg"
                asChild
                className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 px-8 py-6 text-lg font-semibold shadow-[0_20px_60px_rgba(139,92,246,0.4)]"
              >
                <Link href="#community">
                  <span className="flex items-center gap-2">
                    Join Community
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CommunitySection

