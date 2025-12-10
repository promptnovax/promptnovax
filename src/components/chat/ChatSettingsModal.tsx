import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Slider from "@/components/ui/slider"
import {
  Settings,
  Bot,
  Zap,
  FileText,
  Sparkles,
  Code,
  Palette,
  Volume2,
  Type,
  Layout,
  ExternalLink,
  Save,
  RotateCcw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ChatSettings {
  model: string
  temperature: number
  maxTokens: number
  fontSize: "small" | "medium" | "large"
  theme: "dark" | "light" | "auto"
  soundEnabled: boolean
  markdownEnabled: boolean
  compactMode: boolean
  autoSave: boolean
}

const MODELS = [
  { id: "free-hf", label: "PromptNX Free Model", description: "Managed Hugging Face inference" },
  { id: "gpt-4o-mini", label: "GPT-4o Mini", description: "Fast and efficient (Requires upgrade)" },
  { id: "claude-3-haiku", label: "Claude 3 Haiku", description: "Anthropic's fastest model (Requires upgrade)" }
]

interface ChatSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: ChatSettings
  onSettingsChange: (settings: ChatSettings) => void
}

export function ChatSettingsModal({
  open,
  onOpenChange,
  settings,
  onSettingsChange
}: ChatSettingsModalProps) {
  const { toast } = useToast()
  const [localSettings, setLocalSettings] = useState<ChatSettings>(settings)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings, open])

  const handleSave = () => {
    onSettingsChange(localSettings)
    // Save to localStorage
    try {
      localStorage.setItem("pnx_chat_settings", JSON.stringify(localSettings))
      
      // Also update NOVA profile with settings
      const novaProfile = {
        soundEnabled: localSettings.soundEnabled,
        markdownEnabled: localSettings.markdownEnabled,
        fontSize: localSettings.fontSize,
        theme: localSettings.theme
      }
      const existingProfile = localStorage.getItem("pnx_nova_profile")
      if (existingProfile) {
        const profile = JSON.parse(existingProfile)
        localStorage.setItem("pnx_nova_profile", JSON.stringify({ ...profile, ...novaProfile }))
      } else {
        localStorage.setItem("pnx_nova_profile", JSON.stringify(novaProfile))
      }
      
      toast({
        title: "Settings saved",
        description: "Your chat preferences have been updated."
      })
    } catch (error) {
      console.error("Error saving settings:", error)
    }
    onOpenChange(false)
  }

  const handleReset = () => {
    const defaultSettings: ChatSettings = {
      model: "free-hf",
      temperature: 0.7,
      maxTokens: 512,
      fontSize: "medium",
      theme: "dark",
      soundEnabled: false,
      markdownEnabled: true,
      compactMode: false,
      autoSave: true
    }
    setLocalSettings(defaultSettings)
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults."
    })
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "prompt-generator":
        window.location.hash = "#prompt-generator"
        onOpenChange(false)
        break
      case "form-generator":
        window.location.hash = "#generator"
        onOpenChange(false)
        break
      default:
        break
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0d14] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Chat Settings
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Customize your NOVA AI chat experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction("prompt-generator")}
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Prompt Generator</p>
                    <p className="text-xs text-white/50">Create AI prompts</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white/70" />
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction("form-generator")}
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Form Generator</p>
                    <p className="text-xs text-white/50">Form-based prompts</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white/70" />
                </div>
              </motion.button>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Model
            </h3>
            <div className="space-y-2">
              {MODELS.map((model) => (
                <motion.button
                  key={model.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setLocalSettings({ ...localSettings, model: model.id })}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    localSettings.model === model.id
                      ? "border-primary bg-primary/10 text-white"
                      : "border-white/10 bg-white/5 hover:bg-white/10 text-white/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{model.label}</p>
                      <p className="text-xs text-white/50 mt-0.5">{model.description}</p>
                    </div>
                    {localSettings.model === model.id && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Temperature */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Temperature
              </h3>
              <span className="text-xs text-white/60">{localSettings.temperature.toFixed(1)}</span>
            </div>
            <Slider
              value={[localSettings.temperature]}
              onValueChange={([value]) => setLocalSettings({ ...localSettings, temperature: value })}
              min={0}
              max={2}
              step={0.1}
            />
            <p className="text-xs text-white/50">
              Higher values make responses more creative, lower values make them more focused.
            </p>
          </div>

          {/* Max Tokens */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Max Tokens
              </h3>
              <span className="text-xs text-white/60">{localSettings.maxTokens}</span>
            </div>
            <Slider
              value={[localSettings.maxTokens]}
              onValueChange={([value]) => setLocalSettings({ ...localSettings, maxTokens: value })}
              min={128}
              max={2048}
              step={128}
            />
            <p className="text-xs text-white/50">
              Maximum length of the AI's response in tokens.
            </p>
          </div>

          {/* Appearance */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </h3>
            
            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-xs text-white/70 flex items-center gap-2">
                <Type className="h-3.5 w-3.5" />
                Font Size
              </label>
              <div className="flex gap-2">
                {(["small", "medium", "large"] as const).map((size) => (
                  <Button
                    key={size}
                    variant={localSettings.fontSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLocalSettings({ ...localSettings, fontSize: size })}
                    className="flex-1 capitalize"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <label className="text-xs text-white/70 flex items-center gap-2">
                <Layout className="h-3.5 w-3.5" />
                Theme
              </label>
              <div className="flex gap-2">
                {(["dark", "light", "auto"] as const).map((theme) => (
                  <Button
                    key={theme}
                    variant={localSettings.theme === theme ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLocalSettings({ ...localSettings, theme })}
                    className="flex-1 capitalize"
                  >
                    {theme}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </h3>
            <div className="space-y-2">
              {[
                { key: "soundEnabled", label: "Sound Notifications", icon: Volume2 },
                { key: "markdownEnabled", label: "Markdown Support", icon: Code },
                { key: "compactMode", label: "Compact Mode", icon: Layout },
                { key: "autoSave", label: "Auto-save Conversations", icon: Save }
              ].map(({ key, label, icon: Icon }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() =>
                    setLocalSettings({
                      ...localSettings,
                      [key]: !localSettings[key as keyof ChatSettings]
                    })
                  }
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-white/60" />
                    <span className="text-sm text-white/90">{label}</span>
                  </div>
                  <div
                    className={`h-5 w-9 rounded-full transition-colors ${
                      localSettings[key as keyof ChatSettings]
                        ? "bg-primary"
                        : "bg-white/20"
                    } relative`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                        localSettings[key as keyof ChatSettings] ? "translate-x-4" : ""
                      }`}
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 border-white/20 text-white/70 hover:text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

