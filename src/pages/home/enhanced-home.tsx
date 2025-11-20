import { motion, useMotionValue, useSpring } from "framer-motion"
import { PremiumNavbar } from "@/components/layout/PremiumNavbar"
import { lazy, Suspense, useEffect, useState } from "react"
import type { CSSProperties } from "react"
import { ArrowRight, Sparkles, Zap, Users, Shield, Star, Quote, PlayCircle, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "@/components/ui/link"
import heroBg from "@/media/pnx-hero-bg.png"
import heroBgVideo from "@/../media/hero bg video.mp4"
import nextSectionVideo from "@/../media/next section.mp4"
import dashboardSideVideo from "@/../media/dashboard side video.mp4"
import { useTheme } from "@/components/theme-provider"

type HeroBackgroundConfig = {
  base: string
  radialLeft: string[]
  radialRight: string[]
  linear: string[]
  overlayTint: string
  imageOverlay: {
    opacity: number
    mixBlendMode: CSSProperties["mixBlendMode"]
  }
}

const HERO_BACKGROUNDS: Record<"dark" | "light", HeroBackgroundConfig> = {
  dark: {
    base: "#050505",
    radialLeft: [
      'radial-gradient(ellipse 1200px 800px at 0% 0%, rgba(255, 140, 66, 0.85) 0%, rgba(255, 107, 53, 0.75) 15%, rgba(220, 20, 60, 0.6) 30%, rgba(139, 0, 0, 0.4) 45%, rgba(128, 0, 32, 0.2) 60%, transparent 80%)',
      'radial-gradient(ellipse 1400px 900px at -5% -5%, rgba(255, 140, 66, 0.9) 0%, rgba(255, 107, 53, 0.8) 15%, rgba(220, 20, 60, 0.65) 30%, rgba(139, 0, 0, 0.45) 45%, rgba(128, 0, 32, 0.25) 60%, transparent 80%)',
      'radial-gradient(ellipse 1300px 850px at 2% 2%, rgba(255, 140, 66, 0.88) 0%, rgba(255, 107, 53, 0.78) 15%, rgba(220, 20, 60, 0.63) 30%, rgba(139, 0, 0, 0.43) 45%, rgba(128, 0, 32, 0.23) 60%, transparent 80%)',
      'radial-gradient(ellipse 1200px 800px at 0% 0%, rgba(255, 140, 66, 0.85) 0%, rgba(255, 107, 53, 0.75) 15%, rgba(220, 20, 60, 0.6) 30%, rgba(139, 0, 0, 0.4) 45%, rgba(128, 0, 32, 0.2) 60%, transparent 80%)',
    ],
    radialRight: [
      'radial-gradient(ellipse 1200px 800px at 100% 0%, rgba(139, 92, 246, 0.85) 0%, rgba(168, 85, 247, 0.75) 15%, rgba(37, 99, 235, 0.6) 30%, rgba(30, 64, 175, 0.4) 45%, rgba(30, 64, 175, 0.2) 60%, transparent 80%)',
      'radial-gradient(ellipse 1400px 900px at 105% -5%, rgba(139, 92, 246, 0.9) 0%, rgba(168, 85, 247, 0.8) 15%, rgba(37, 99, 235, 0.65) 30%, rgba(30, 64, 175, 0.45) 45%, rgba(30, 64, 175, 0.25) 60%, transparent 80%)',
      'radial-gradient(ellipse 1300px 850px at 98% 2%, rgba(139, 92, 246, 0.88) 0%, rgba(168, 85, 247, 0.78) 15%, rgba(37, 99, 235, 0.63) 30%, rgba(30, 64, 175, 0.43) 45%, rgba(30, 64, 175, 0.23) 60%, transparent 80%)',
      'radial-gradient(ellipse 1200px 800px at 100% 0%, rgba(139, 92, 246, 0.85) 0%, rgba(168, 85, 247, 0.75) 15%, rgba(37, 99, 235, 0.6) 30%, rgba(30, 64, 175, 0.4) 45%, rgba(30, 64, 175, 0.2) 60%, transparent 80%)',
    ],
    linear: [
      `linear-gradient(
        to right,
        rgba(255, 140, 66, 0.4) 0%,
        rgba(255, 107, 53, 0.35) 8%,
        rgba(220, 20, 60, 0.3) 18%,
        rgba(180, 20, 60, 0.25) 28%,
        rgba(139, 0, 0, 0.2) 35%,
        rgba(128, 0, 32, 0.15) 40%,
        rgba(26, 26, 26, 0.9) 45%,
        rgba(10, 10, 10, 0.95) 50%,
        rgba(26, 26, 26, 0.9) 55%,
        rgba(30, 64, 175, 0.15) 60%,
        rgba(37, 99, 235, 0.2) 65%,
        rgba(88, 101, 242, 0.25) 72%,
        rgba(139, 92, 246, 0.3) 78%,
        rgba(168, 85, 247, 0.35) 85%,
        rgba(139, 92, 246, 0.4) 92%,
        rgba(37, 99, 235, 0.4) 100%
      )`,
      `linear-gradient(
        to right,
        rgba(255, 140, 66, 0.42) 0%,
        rgba(255, 107, 53, 0.37) 8%,
        rgba(220, 20, 60, 0.32) 18%,
        rgba(180, 20, 60, 0.27) 28%,
        rgba(139, 0, 0, 0.22) 35%,
        rgba(128, 0, 32, 0.17) 40%,
        rgba(26, 26, 26, 0.92) 45%,
        rgba(10, 10, 10, 0.97) 50%,
        rgba(26, 26, 26, 0.92) 55%,
        rgba(30, 64, 175, 0.17) 60%,
        rgba(37, 99, 235, 0.22) 65%,
        rgba(88, 101, 242, 0.27) 72%,
        rgba(139, 92, 246, 0.32) 78%,
        rgba(168, 85, 247, 0.37) 85%,
        rgba(139, 92, 246, 0.42) 92%,
        rgba(37, 99, 235, 0.42) 100%
      )`,
      `linear-gradient(
        to right,
        rgba(255, 140, 66, 0.38) 0%,
        rgba(255, 107, 53, 0.33) 8%,
        rgba(220, 20, 60, 0.28) 18%,
        rgba(180, 20, 60, 0.23) 28%,
        rgba(139, 0, 0, 0.18) 35%,
        rgba(128, 0, 32, 0.13) 40%,
        rgba(26, 26, 26, 0.88) 45%,
        rgba(10, 10, 10, 0.93) 50%,
        rgba(26, 26, 26, 0.88) 55%,
        rgba(30, 64, 175, 0.13) 60%,
        rgba(37, 99, 235, 0.18) 65%,
        rgba(88, 101, 242, 0.23) 72%,
        rgba(139, 92, 246, 0.28) 78%,
        rgba(168, 85, 247, 0.33) 85%,
        rgba(139, 92, 246, 0.38) 92%,
        rgba(37, 99, 235, 0.38) 100%
      )`,
      `linear-gradient(
        to right,
        rgba(255, 140, 66, 0.4) 0%,
        rgba(255, 107, 53, 0.35) 8%,
        rgba(220, 20, 60, 0.3) 18%,
        rgba(180, 20, 60, 0.25) 28%,
        rgba(139, 0, 0, 0.2) 35%,
        rgba(128, 0, 32, 0.15) 40%,
        rgba(26, 26, 26, 0.9) 45%,
        rgba(10, 10, 10, 0.95) 50%,
        rgba(26, 26, 26, 0.9) 55%,
        rgba(30, 64, 175, 0.15) 60%,
        rgba(37, 99, 235, 0.2) 65%,
        rgba(88, 101, 242, 0.25) 72%,
        rgba(139, 92, 246, 0.3) 78%,
        rgba(168, 85, 247, 0.35) 85%,
        rgba(139, 92, 246, 0.4) 92%,
        rgba(37, 99, 235, 0.4) 100%
      )`,
    ],
    overlayTint: "linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent)",
    imageOverlay: {
      opacity: 0.6,
      mixBlendMode: "overlay",
    },
  },
  light: {
    base: "#F8FAFF",
    radialLeft: [
      'radial-gradient(ellipse 1200px 800px at 0% 0%, rgba(255, 203, 164, 0.7) 0%, rgba(255, 198, 186, 0.5) 18%, rgba(255, 255, 255, 0.35) 32%, rgba(255, 255, 255, 0.1) 50%, transparent 75%)',
      'radial-gradient(ellipse 1400px 900px at -5% -5%, rgba(255, 208, 174, 0.8) 0%, rgba(255, 204, 196, 0.58) 18%, rgba(255, 255, 255, 0.38) 32%, rgba(255, 255, 255, 0.15) 50%, transparent 75%)',
      'radial-gradient(ellipse 1300px 850px at 2% 2%, rgba(255, 212, 182, 0.75) 0%, rgba(255, 204, 196, 0.56) 18%, rgba(255, 255, 255, 0.36) 32%, rgba(255, 255, 255, 0.12) 50%, transparent 75%)',
      'radial-gradient(ellipse 1200px 800px at 0% 0%, rgba(255, 203, 164, 0.7) 0%, rgba(255, 198, 186, 0.5) 18%, rgba(255, 255, 255, 0.35) 32%, rgba(255, 255, 255, 0.1) 50%, transparent 75%)',
    ],
    radialRight: [
      'radial-gradient(ellipse 1200px 800px at 100% 0%, rgba(176, 154, 255, 0.65) 0%, rgba(167, 184, 255, 0.55) 18%, rgba(201, 218, 255, 0.45) 35%, rgba(244, 248, 255, 0.25) 50%, transparent 75%)',
      'radial-gradient(ellipse 1400px 900px at 105% -5%, rgba(180, 162, 255, 0.72) 0%, rgba(167, 184, 255, 0.58) 18%, rgba(201, 218, 255, 0.48) 35%, rgba(244, 248, 255, 0.28) 50%, transparent 75%)',
      'radial-gradient(ellipse 1300px 850px at 98% 2%, rgba(176, 154, 255, 0.68) 0%, rgba(167, 184, 255, 0.56) 18%, rgba(201, 218, 255, 0.46) 35%, rgba(244, 248, 255, 0.26) 50%, transparent 75%)',
      'radial-gradient(ellipse 1200px 800px at 100% 0%, rgba(176, 154, 255, 0.65) 0%, rgba(167, 184, 255, 0.55) 18%, rgba(201, 218, 255, 0.45) 35%, rgba(244, 248, 255, 0.25) 50%, transparent 75%)',
    ],
    linear: [
      `linear-gradient(
        to right,
        rgba(255, 210, 182, 0.65) 0%,
        rgba(255, 196, 178, 0.55) 10%,
        rgba(255, 255, 255, 0.9) 40%,
        rgba(248, 250, 255, 0.95) 55%,
        rgba(228, 238, 255, 0.6) 72%,
        rgba(203, 219, 255, 0.6) 85%,
        rgba(180, 195, 255, 0.65) 100%
      )`,
      `linear-gradient(
        to right,
        rgba(255, 210, 190, 0.68) 0%,
        rgba(255, 198, 185, 0.58) 10%,
        rgba(255, 255, 255, 0.92) 40%,
        rgba(248, 250, 255, 0.97) 55%,
        rgba(228, 238, 255, 0.63) 72%,
        rgba(203, 219, 255, 0.63) 85%,
        rgba(180, 195, 255, 0.68) 100%
      )`,
      `linear-gradient(
        to right,
        rgba(255, 214, 196, 0.62) 0%,
        rgba(255, 201, 189, 0.52) 10%,
        rgba(255, 255, 255, 0.87) 40%,
        rgba(248, 250, 255, 0.9) 55%,
        rgba(228, 238, 255, 0.57) 72%,
        rgba(203, 219, 255, 0.57) 85%,
        rgba(180, 195, 255, 0.62) 100%
      )`,
      `linear-gradient(
        to right,
        rgba(255, 210, 182, 0.65) 0%,
        rgba(255, 196, 178, 0.55) 10%,
        rgba(255, 255, 255, 0.9) 40%,
        rgba(248, 250, 255, 0.95) 55%,
        rgba(228, 238, 255, 0.6) 72%,
        rgba(203, 219, 255, 0.6) 85%,
        rgba(180, 195, 255, 0.65) 100%
      )`,
    ],
    overlayTint: "linear-gradient(to top, rgba(255, 255, 255, 0.92), rgba(248, 250, 255, 0.5), transparent)",
    imageOverlay: {
      opacity: 0.35,
      mixBlendMode: "multiply",
    },
  },
}

function CursorGlow() {
  const [isVisible, setIsVisible] = useState(true)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    const handleEnter = () => setIsVisible(true)
    const handleLeave = () => setIsVisible(false)
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseenter', handleEnter)
    window.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseenter', handleEnter)
      window.removeEventListener('mouseleave', handleLeave)
    }
  }, [mouseX, mouseY])

  return (
    <motion.div
      aria-hidden
      style={{ left: smoothX, top: smoothY }}
      className={`pointer-events-none fixed z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.primary/20),transparent_60%)] blur-3xl transition-opacity ${isVisible ? 'opacity-60' : 'opacity-0'}`}
    />
  )
}

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Create perfect prompts using advanced AI algorithms that understand context and optimize for results.",
    color: "text-purple-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate professional prompts in seconds, not hours. Our optimized engine delivers instant results.",
    color: "text-yellow-500"
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Access thousands of prompts created by our community of AI enthusiasts and professionals.",
    color: "text-blue-500"
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "Built with security and scalability in mind. Perfect for teams and organizations of any size.",
    color: "text-green-500"
  }
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    content: "PromptNovaX has revolutionized our content creation process. We've increased our productivity by 300% and the quality of our AI-generated content is outstanding.",
    avatar: "SJ",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    company: "StartupXYZ",
    content: "The prompt generator is incredibly intuitive. I can create complex technical prompts in minutes that would have taken me hours before. Game changer!",
    avatar: "MC",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Content Creator",
    company: "Creative Agency",
    content: "The marketplace is a goldmine of inspiration. I've found prompts for every use case imaginable. The community is amazing and very supportive.",
    avatar: "ER",
    rating: 5
  }
]

const heroValueProps = [
  {
    icon: Sparkles,
    title: "Prompt Marketplace",
    description: "Curated kits for marketers, founders, agencies, and researchers."
  },
  {
    icon: Zap,
    title: "Generator Studio",
    description: "Structure complex multi-step prompts with reusable blueprints."
  },
  {
    icon: Shield,
    title: "API & Automations",
    description: "Pipe prompts into products with secure API + workflow hooks."
  },
  {
    icon: Users,
    title: "Buyer Workspaces",
    description: "Share, version, and collaborate on prompt libraries with teams."
  }
]

const immersiveHighlights = [
  {
    label: "Live testing",
    title: "Scenario playback",
    description: "Preview how prompts perform inside chat, agent, or marketing funnels."
  },
  {
    label: "Buyer control",
    title: "Workspace sharing",
    description: "Package templates, docs, and telemetry into branded buyer portals."
  },
  {
    label: "Automation",
    title: "API orchestration",
    description: "Route prompts directly into your stack with version-safe endpoints."
  }
]

export function EnhancedHomePage() {
  const { theme } = useTheme()
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    if (theme === "light") return "light"
    if (theme === "dark") return "dark"
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "dark"
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const updateFromMatch = (matches: boolean) => setResolvedTheme(matches ? "dark" : "light")
      const handleChange = (event: MediaQueryListEvent) => {
        updateFromMatch(event.matches)
      }

      updateFromMatch(mediaQuery.matches)

      if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
      } else {
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    } else {
      setResolvedTheme(theme)
    }
  }, [theme])

  const isDarkMode = resolvedTheme === "dark"
  const heroBackground = HERO_BACKGROUNDS[isDarkMode ? "dark" : "light"]
  const gradientBackdrop = heroBackground.linear[0]
  const gradientBackdropOverlay = isDarkMode ? "rgba(2, 6, 23, 0.85)" : "rgba(255, 255, 255, 0.85)"
  const heroVideoOverlay = isDarkMode
    ? "linear-gradient(180deg, rgba(2,6,23,0.9) 0%, rgba(2,6,23,0.55) 45%, rgba(2,6,23,0.85) 100%)"
    : "linear-gradient(180deg, rgba(15,23,42,0.35) 0%, rgba(240,246,255,0.75) 65%, rgba(255,255,255,0.9) 100%)"
  const heroRadialOpacity = isDarkMode ? 0.65 : 0.45
  const heroLinearOpacity = isDarkMode ? 0.55 : 0.4
  const heroRadialBlend = isDarkMode ? "screen" : "multiply"
  const heroLinearBlend = isDarkMode ? "soft-light" : "multiply"
  const featureCardClasses = isDarkMode
    ? "bg-background/80 border-white/10 shadow-2xl backdrop-blur-md"
    : "bg-white/95 border-slate-200/70 shadow-xl backdrop-blur"
  const featureHeadingText = isDarkMode ? "text-white" : "text-slate-900"
  const featureSubText = isDarkMode ? "text-slate-100/80" : "text-muted-foreground"
  const heroPrimaryCtaClasses = [
    "group relative inline-flex items-center justify-between gap-6 rounded-2xl border px-6 py-4 md:px-7 md:py-5",
    "text-left transition-all duration-300 backdrop-blur-xl w-full sm:w-auto",
    "hover:-translate-y-0.5 hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
  ].join(" ") + (isDarkMode
    ? " text-white border-white/15 bg-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
    : " text-slate-900 border-slate-200/80 bg-white/85 shadow-[0_25px_60px_rgba(15,23,42,0.2)]")
  const heroSecondaryCtaClasses = [
    "group relative inline-flex items-center justify-between gap-5 rounded-2xl border px-6 py-4 md:px-7 w-full sm:w-auto",
    "text-left transition-all duration-300 backdrop-blur-xl hover:-translate-y-0.5"
  ].join(" ") + (isDarkMode
    ? " border-white/10 text-white/90 bg-white/5 shadow-[0_15px_45px_rgba(0,0,0,0.45)]"
    : " border-slate-200/70 text-slate-900 bg-white/65 shadow-[0_15px_40px_rgba(15,23,42,0.18)]")
  const heroPrimaryIconClasses = isDarkMode
    ? "h-12 w-12 rounded-2xl bg-white/20 text-white shadow-inner border border-white/30"
    : "h-12 w-12 rounded-2xl bg-slate-900 text-white shadow-inner border border-white/40"
  const heroSecondaryIconClasses = isDarkMode
    ? "h-11 w-11 rounded-2xl bg-white/10 text-white border border-white/20"
    : "h-11 w-11 rounded-2xl bg-white text-slate-900 border border-slate-200"
  const heroEyebrowText = isDarkMode ? "text-white/55" : "text-slate-500"
  const heroSupportText = isDarkMode ? "text-white/70" : "text-slate-600"
  const dashboardSectionOverlay = isDarkMode ? "rgba(5, 8, 20, 0.92)" : "rgba(248, 250, 255, 0.92)"
  const announcementStyles = isDarkMode
    ? {
        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(220, 20, 60, 0.15), rgba(139, 92, 246, 0.15), rgba(37, 99, 235, 0.15))',
        borderColor: 'rgba(255, 107, 53, 0.3)',
        color: 'white',
        textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
      }
    : {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(248, 250, 255, 0.85))',
        borderColor: 'rgba(226, 232, 240, 0.9)',
        color: '#0f172a',
        textShadow: '0 1px 2px rgba(148, 163, 184, 0.6)',
      }
  const sparklesAccent = isDarkMode ? '#FF8C42' : '#F97316'

  return (
    <div className="min-h-screen bg-background">
      <CursorGlow />
      {/* Remove page-level navbar to avoid duplicate; using layout's top-level navbar */}
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden min-h-[85vh] flex items-center"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Background video */}
        <div className="absolute inset-0 -z-10 bg-black" aria-hidden>
          <video
            className="h-full w-full object-cover opacity-90"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={heroBg}
          >
            <source src={heroBgVideo} type="video/mp4" />
          </video>
        </div>

        {/* Gradient overlays (reintroduce hero glow) */}
        <motion.div
          className="absolute inset-0 -z-9 pointer-events-none"
          style={{ opacity: heroRadialOpacity, mixBlendMode: heroRadialBlend }}
          animate={{ background: heroBackground.radialLeft }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 -z-8 pointer-events-none"
          style={{ opacity: heroRadialOpacity, mixBlendMode: heroRadialBlend }}
          animate={{ background: heroBackground.radialRight }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        <motion.div
          className="absolute inset-0 -z-7 pointer-events-none"
          style={{ opacity: heroLinearOpacity, mixBlendMode: heroLinearBlend }}
          animate={{ background: heroBackground.linear }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tint overlay for readability */}
        <div
          className="absolute inset-0 -z-6 pointer-events-none"
          style={{ background: heroVideoOverlay }}
          aria-hidden
        />

        {/* Subtle texture overlay */}
        <motion.div
          className="absolute inset-0 -z-5 pointer-events-none"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: heroBackground.imageOverlay.mixBlendMode,
            opacity: heroBackground.imageOverlay.opacity,
          }}
          animate={{ opacity: [0.15, 0.3, 0.2] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Soft blur breathing */}
        <motion.div
          className="absolute inset-0 -z-4 pointer-events-none"
          style={{ backdropFilter: 'blur(1px)', WebkitBackdropFilter: 'blur(1px)' }}
          animate={{ opacity: [0.25, 0.45, 0.35] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Cursor-follow glow orb */}
        <div id="cursor-orb" className="pointer-events-none absolute z-0 h-56 w-56 rounded-full opacity-40" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var orb = document.getElementById('cursor-orb');
            if(!orb) return;
            var raf;
            var x=0,y=0,tX=0,tY=0;
            document.addEventListener('mousemove', function(e){ tX=e.clientX; tY=e.clientY; if(!raf) loop(); });
            function loop(){ x += (tX - x) * 0.12; y += (tY - y) * 0.12; orb.style.transform = 'translate('+(x-112)+'px,'+(y-112)+'px)'; raf = requestAnimationFrame(loop); }
            orb.style.background = 'radial-gradient(circle at center, rgba(88,101,242,0.35), transparent 60%)';
          })();
        `}} />
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border transition-all duration-300 hover:scale-105"
              style={announcementStyles}
            >
              <Sparkles 
                className="h-4 w-4 transition-colors duration-300"
                style={{ color: sparklesAccent }}
              />
              <span>New · PromptNovaX OS for Buyers & Builders</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            >
              Command Every{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 drop-shadow-[0_2px_4px_rgba(88,101,242,0.4)]">
                Prompting Workflow
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
            >
              Source elite prompt systems, remix them with our generator studio, and ship to buyers or internal teams through workspaces, APIs, and automations—no context switching.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
            >
              {heroValueProps.map((prop) => {
                const Icon = prop.icon
                return (
                  <div
                    key={prop.title}
                    className={`flex flex-col gap-2 rounded-2xl border px-4 py-4 text-left backdrop-blur ${isDarkMode ? 'border-white/10 bg-white/5 text-white/90' : 'border-slate-200/70 bg-white/70 text-slate-900'}`}
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Icon className="h-4 w-4 text-primary" />
                      {prop.title}
                    </div>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
                      {prop.description}
                    </p>
                  </div>
                )
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-3xl mx-auto"
            >
              <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-full sm:w-auto"
              >
                <Link href="#generator" className={heroPrimaryCtaClasses}>
                  <div className="flex flex-col">
                    <span className={`text-[0.65rem] tracking-[0.35em] uppercase mb-1 ${heroEyebrowText}`}>
                      Generator
                    </span>
                    <span className="text-lg md:text-xl font-semibold">
                      Launch Prompt Studio
                    </span>
                    <span className={`text-sm mt-1 ${heroSupportText}`}>
                      Craft production-ready prompts in seconds
                    </span>
                  </div>
                  <div className={`flex items-center justify-center ${heroPrimaryIconClasses}`}>
                    <PlayCircle className="h-5 w-5" />
                  </div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-full sm:w-auto"
              >
                <Link href="#marketplace" className={heroSecondaryCtaClasses}>
                  <div className="flex flex-col">
                    <span className={`text-[0.65rem] tracking-[0.35em] uppercase mb-1 ${heroEyebrowText}`}>
                      Marketplace
                    </span>
                    <span className="text-lg md:text-xl font-semibold">
                      Browse Curated Prompt Kits
                    </span>
                    <span className={`text-sm mt-1 ${heroSupportText}`}>
                      3k+ ready-to-use workflows from pros
                    </span>
                  </div>
                  <div className={`flex items-center justify-center ${heroSecondaryIconClasses}`}>
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div id="brand-marquee" />
      {/* Brand Marquee (credibility near top) */}
      {(() => {
        const Marquee = lazy(() => import('@/components/marketing/BrandMarqueeSection').then(m => ({ default: m.BrandMarqueeSection })))
        return (
          <Suspense fallback={<div className="py-10" />}> 
            <Marquee />
          </Suspense>
        )
      })()}

      <div id="pain-points" />
      {/* Pain Points to Solutions */}
      {(() => {
        const Pains = lazy(() => import('@/components/marketing/PainPointsSection').then(m => ({ default: m.PainPointsSection })))
        return (
          <Suspense fallback={<div className="py-16" />}> 
            <Pains />
          </Suspense>
        )
      })()}

      <div id="outcomes" />
      {/* Outcomes (New Section #2) */}
      {(() => {
        const Outcomes = lazy(() => import('@/components/marketing/SaaSOutcomesSection').then(m => ({ default: m.SaaSOutcomesSection })))
        return (
          <Suspense fallback={<div className="py-24" />}> 
            <Outcomes />
          </Suspense>
        )
      })()}

      <div id="product-tour" />
      {/* Product Tour (Section #3) */}
      {(() => {
        const ProductTour = lazy(() => import('@/components/marketing/ProductTourSection').then(m => ({ default: m.ProductTourSection })))
        return (
          <Suspense fallback={<div className="py-20" />}> 
            <ProductTour />
          </Suspense>
        )
      })()}


      <div id="use-cases" />
      {/* Use Cases (Section #4) */}
      {(() => {
        const UseCases = lazy(() => import('@/components/marketing/UseCasesSection').then(m => ({ default: m.UseCasesSection })))
        return (
          <Suspense fallback={<div className="py-20" />}> 
            <UseCases />
          </Suspense>
        )
      })()}

      {/* Immersive Flow Section with background video */}
      <section id="immersive-lab" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-black" aria-hidden>
          <video
            className="h-full w-full object-cover opacity-90"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={heroBg}
          >
            <source src={nextSectionVideo} type="video/mp4" />
          </video>
        </div>
        <div
          className="absolute inset-0 -z-9 pointer-events-none"
          style={{
            background: 'linear-gradient(120deg, rgba(4,7,16,0.95) 0%, rgba(25,7,45,0.8) 35%, rgba(2,6,23,0.92) 100%)'
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-8 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.08), transparent 55%), radial-gradient(circle at 80% 10%, rgba(88,101,242,0.15), transparent 60%)'
          }}
          aria-hidden
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-10 lg:gap-14 md:grid-cols-[1.1fr,0.9fr] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                Flowroom Mode
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.55)]">
                  Bring buyers inside a living prompt lab
                </h2>
                <p className="text-lg md:text-xl text-white/80 max-w-3xl">
                  Spin up cinematic walkthroughs where your marketplace prompts, generator blueprints, and API-backed workflows play together continuously—without revealing there’s a video backdrop in action.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold text-white">3,000+</div>
                  <p className="text-white/70">buyer workspaces launched in the last 90 days</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white">92%</div>
                  <p className="text-white/70">teams say Flowroom demos close deals faster</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link href="#studio" className="font-semibold">
                    Explore Studio
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20" asChild>
                  <Link href="#marketplace">View Marketplace Tours</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl blur-2xl bg-primary/20 opacity-60" aria-hidden />
              <div className="relative rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-8 text-white space-y-6 shadow-[0_25px_80px_rgba(0,0,0,0.65)]">
                <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                  Included in PromptNovaX OS
                </p>
                <div className="space-y-5">
                  {immersiveHighlights.map((item) => (
                    <div key={item.title} className="border border-white/10 rounded-2xl p-4 bg-white/5">
                      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/60 mb-1">{item.label}</p>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-white/75 mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-white/70 pt-4 border-t border-white/10">
                  <span>Continuous playback</span>
                  <span>0 buffering · muted autoplay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{ background: gradientBackdrop }}
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-9"
          style={{ background: gradientBackdropOverlay }}
          aria-hidden
        />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold tracking-tight mb-4 ${featureHeadingText}`}>
              Why Choose PromptNovaX?
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${featureSubText}`}>
              Built for creators, developers, and businesses who want to unlock the full potential of AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className={`h-full transition-all duration-300 ${featureCardClasses} hover:-translate-y-1`}>
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                        <Icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      

      <div id="studio" />
      {/* Advanced Generators Studio */}
      {(() => {
        const Studio = lazy(() => import('@/components/marketing/AdvancedGeneratorsSection').then(m => ({ default: m.AdvancedGeneratorsSection })))
        return (
          <Suspense fallback={<div className="py-16" />}> 
            <Studio />
          </Suspense>
        )
      })()}

      <div id="templates" />
      {/* Templates Library */}
      {(() => {
        const Templates = lazy(() => import('@/components/marketing/TemplatesLibrarySection').then(m => ({ default: m.TemplatesLibrarySection })))
        return (
          <Suspense fallback={<div className="py-16" />}> 
            <Templates />
          </Suspense>
        )
      })()}


      <div id="marketplace-highlight" />
      {/* Marketplace Highlight */}
      {(() => {
        const Market = lazy(() => import('@/components/marketing/MarketplaceHighlightSection').then(m => ({ default: m.MarketplaceHighlightSection })))
        return (
          <Suspense fallback={<div className="py-16" />}> 
            <Market />
          </Suspense>
        )
      })()}

      <div id="integrations" />
      {/* Integrations (after marketplace) */}
      {(() => {
        const Integrations = lazy(() => import('@/components/marketing/IntegrationsSection').then(m => ({ default: m.IntegrationsSection })))
        return (
          <Suspense fallback={<div className="py-16" />}> 
            <Integrations />
          </Suspense>
        )
      })()}

      <div id="api-promo" />
      {/* API Prompt Promo (moved below marketplace) */}
      {(() => {
        const ApiPromo = lazy(() => import('@/components/marketing/ApiPromptPromoSection').then(m => ({ default: m.ApiPromptPromoSection })))
        return (
          <Suspense fallback={<div className="py-16" />}> 
            <ApiPromo />
          </Suspense>
        )
      })()}

      {/* Pricing Teaser */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Start free and upgrade as you grow. No hidden fees, no surprises.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="relative rounded-xl border p-6 text-center">
                <div className="text-4xl font-bold">Free</div>
                <div className="text-muted-foreground">Get started</div>
              </div>
              <div className="relative rounded-xl border p-6 text-center bg-primary/5">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-primary text-white px-2 py-1 rounded">Most popular</div>
                <div className="text-4xl font-bold">$19</div>
                <div className="text-muted-foreground">Pro plan</div>
              </div>
              <div className="relative rounded-xl border p-6 text-center">
                <div className="text-4xl font-bold">$99</div>
                <div className="text-muted-foreground">Enterprise</div>
              </div>
            </div>
            <Button size="lg" className="mt-8" asChild>
              <Link href="#pricing">
                View All Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Security & Compliance */}
      {(() => {
        const Security = lazy(() => import('@/components/marketing/SecuritySection').then(m => ({ default: m.SecuritySection })))
        return (
          <Suspense fallback={<div className="py-16" />}> 
            <Security />
          </Suspense>
        )
      })()}

      {/* Customer Proof (replacing case studies) */}
      {(() => {
        const Proof = lazy(() => import('@/components/marketing/CustomerProofSection').then(m => ({ default: m.CustomerProofSection })))
        return (
          <Suspense fallback={<div className="py-16" />}> 
            <Proof />
          </Suspense>
        )
      })()}

      {/* CTA Band */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/10 via-primary/20 to-purple-500/10">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(800px_400px_at_90%_-10%,theme(colors.primary/30),transparent)]" />
            <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to level up your AI prompting?</h3>
                <p className="text-muted-foreground">Join creators and teams using PromptNovaX to ship faster with better prompts.</p>
              </div>
              <div className="flex gap-3">
                <Button size="lg" asChild>
                  <Link href="#signup">Start Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#demo">Book a Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Launch Dashboard Section */}
      <section id="launch-dashboard" className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{ background: heroBackground.linear[0] }}
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-9"
          style={{ background: dashboardSectionOverlay }}
          aria-hidden
        />
        <div className="container mx-auto px-4 relative">
          <div
            className={`relative overflow-hidden rounded-3xl backdrop-blur bg-background/80 ${isDarkMode ? 'border-white/10 shadow-[0_45px_120px_rgba(0,0,0,0.45)]' : 'border-white/60 shadow-[0_35px_80px_rgba(15,23,42,0.2)]'}`}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: heroBackground.radialLeft[0], opacity: 0.25, mixBlendMode: "soft-light" }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: heroBackground.radialRight[0], opacity: 0.25, mixBlendMode: "soft-light" }}
            />
            <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-14">
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Launch your creator dashboard</h3>
                <p className="text-muted-foreground text-lg">Publish prompts, manage sales, track performance, and message buyers—all in one place.</p>
                <ul className="text-sm text-muted-foreground grid gap-2">
                  <li>• Upload and version prompts with rich metadata</li>
                  <li>• Analytics for views, conversions, and revenue</li>
                  <li>• Inbox and notifications integrated</li>
                </ul>
                <div className="flex gap-3 pt-2">
                  <Button size="lg" asChild>
                    <Link href="#dashboard/index">Open Dashboard</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#help">Learn more</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl blur-2xl bg-primary/15" />
                <div className="relative rounded-2xl border bg-background/80 overflow-hidden shadow-[0_35px_80px_rgba(0,0,0,0.35)]">
                  <div className="relative">
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/35 to-transparent z-10" />
                    <video
                      className="w-full h-full object-cover pointer-events-none"
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
                    >
                      <source src={dashboardSideVideo} type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
