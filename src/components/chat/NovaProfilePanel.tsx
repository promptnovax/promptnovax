import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Bot,
  Settings,
  Sparkles,
  MessageSquare,
  Zap,
  Palette,
  Volume2,
  Type,
  Code,
  Star,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface NovaProfile {
  name: string
  bio: string
  personality: string
  expertise: string[]
  responseStyle: string
  avatar: string
  color: string
  soundEnabled: boolean
  markdownEnabled: boolean
  fontSize: "small" | "medium" | "large"
  theme: "dark" | "light" | "auto"
}

interface NovaProfilePanelProps {
  open: boolean
  onClose: () => void
  onSettingsClick: () => void
}

const DEFAULT_PROFILE: NovaProfile = {
  name: "NOVA AI",
  bio: "Your intelligent AI assistant powered by PromptNX. I'm here to help you with prompts, content creation, and more.",
  personality: "Helpful, Professional, Friendly",
  expertise: ["Prompt Engineering", "Content Creation", "Code Assistance", "Creative Writing"],
  responseStyle: "Concise and clear",
  avatar: "",
  color: "#6366f1",
  soundEnabled: false,
  markdownEnabled: true,
  fontSize: "medium",
  theme: "dark"
}

export function NovaProfilePanel({ open, onClose, onSettingsClick }: NovaProfilePanelProps) {
  const [profile, setProfile] = useState<NovaProfile>(DEFAULT_PROFILE)

  useEffect(() => {
    // Load customized profile from localStorage
    try {
      const stored = localStorage.getItem("pnx_nova_profile")
      if (stored) {
        const parsed = JSON.parse(stored)
        setProfile({ ...DEFAULT_PROFILE, ...parsed })
      }

      // Also load from chat settings
      const chatSettings = localStorage.getItem("pnx_chat_settings")
      if (chatSettings) {
        const settings = JSON.parse(chatSettings)
        setProfile((prev) => ({
          ...prev,
          soundEnabled: settings.soundEnabled || false,
          markdownEnabled: settings.markdownEnabled !== false,
          fontSize: settings.fontSize || "medium",
          theme: settings.theme || "dark"
        }))
      }
    } catch (e) {
      console.error("Error loading NOVA profile:", e)
    }
  }, [open])

  const stats = [
    { label: "Conversations", value: "1.2K+", icon: MessageSquare },
    { label: "Prompts Generated", value: "5.8K+", icon: Sparkles },
    { label: "Response Time", value: "< 2s", icon: Zap },
    { label: "Accuracy", value: "98%", icon: CheckCircle }
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Profile Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 bg-[#0a0d14] border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold">NOVA Profile</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Avatar & Basic Info */}
              <div className="p-6 text-center border-b border-white/10">
                <Avatar className="h-20 w-20 mx-auto mb-4 border-2 border-primary/30">
                  <AvatarFallback className="bg-gradient-to-br from-primary/70 to-primary/40 text-white text-2xl">
                    <Bot className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-1">{profile.name}</h3>
                <p className="text-sm text-white/60 mb-4">{profile.bio}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSettingsClick}
                  className="border-white/20 text-white/70 hover:text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Customize NOVA
                </Button>
              </div>

              {/* Stats */}
              <div className="p-4 border-b border-white/10">
                <h4 className="text-sm font-semibold text-white/90 mb-3">Performance</h4>
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <Icon className="h-4 w-4 text-primary mb-2" />
                        <p className="text-xs text-white/50 mb-1">{stat.label}</p>
                        <p className="text-sm font-semibold">{stat.value}</p>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Personality */}
              <div className="p-4 border-b border-white/10">
                <h4 className="text-sm font-semibold text-white/90 mb-3">Personality</h4>
                <p className="text-sm text-white/70 mb-3">{profile.personality}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.expertise.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-primary/20 text-primary border-primary/30"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Response Style */}
              <div className="p-4 border-b border-white/10">
                <h4 className="text-sm font-semibold text-white/90 mb-2">Response Style</h4>
                <p className="text-sm text-white/70">{profile.responseStyle}</p>
              </div>

              {/* Preferences */}
              <div className="p-4 border-b border-white/10">
                <h4 className="text-sm font-semibold text-white/90 mb-3">Current Preferences</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70 flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Sound Notifications
                    </span>
                    <Badge variant={profile.soundEnabled ? "default" : "secondary"}>
                      {profile.soundEnabled ? "On" : "Off"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Markdown Support
                    </span>
                    <Badge variant={profile.markdownEnabled ? "default" : "secondary"}>
                      {profile.markdownEnabled ? "On" : "Off"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70 flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Font Size
                    </span>
                    <Badge variant="secondary" className="capitalize">
                      {profile.fontSize}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70 flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Theme
                    </span>
                    <Badge variant="secondary" className="capitalize">
                      {profile.theme}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-white/90 mb-2">About NOVA</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  NOVA is powered by PromptNX's advanced AI technology. Customize your experience
                  through settings to make NOVA work exactly how you need.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


