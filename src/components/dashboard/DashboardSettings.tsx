import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "@/lib/platformStubs/firestore"
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "@/lib/platformStubs/storage"
import { platformDb, platformStorage, isSupabaseConfigured } from "@/lib/platformClient"
import { 
  Settings,
  User,
  Mail,
  Camera,
  Save,
  Loader2,
  AlertCircle,
  Check,
  Upload,
  Eye,
  EyeOff,
  Bell,
  Shield,
  Palette,
  MessageSquare
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface ChatSettings {
  model: string
  temperature: number
  maxTokens: number
  defaultPlaybook: string
  autoSave: boolean
  showTimestamps: boolean
  soundEnabled: boolean
  markdownEnabled: boolean
  codeHighlighting: boolean
  compactMode: boolean
  fontSize: "small" | "medium" | "large"
  theme: "dark" | "light" | "auto"
}

interface UserSettings {
  displayName: string
  email: string
  bio: string
  photoURL: string
  notifications: {
    email: boolean
    push: boolean
    likes: boolean
    follows: boolean
    messages: boolean
  }
  privacy: {
    profilePublic: boolean
    showEmail: boolean
    showFollowers: boolean
  }
  chat?: ChatSettings
}

export function DashboardSettings() {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [settings, setSettings] = useState<UserSettings>({
    displayName: "",
    email: "",
    bio: "",
    photoURL: "",
    notifications: {
      email: true,
      push: true,
      likes: true,
      follows: true,
      messages: true
    },
    privacy: {
      profilePublic: true,
      showEmail: false,
      showFollowers: true
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "privacy" | "chat">("profile")
  
  // Check if opened from chat
  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes("settings") && hash.includes("chat")) {
      setActiveTab("chat")
    }
    // Check URL params
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("tab") === "chat") {
      setActiveTab("chat")
    }
  }, [])

  const handleBackToChat = () => {
    window.location.hash = "#chat"
  }

  // Load user settings
  const loadSettings = async () => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured || !platformDb) {
      // Demo mode - use current user data
      setSettings({
        displayName: currentUser.displayName || currentUser.email?.split('@')[0] || "",
        email: currentUser.email || "",
        bio: "Creative prompt designer and AI enthusiast",
        photoURL: currentUser.photoURL || "",
        notifications: {
          email: true,
          push: true,
          likes: true,
          follows: true,
          messages: true
        },
        privacy: {
          profilePublic: true,
          showEmail: false,
          showFollowers: true
        }
      })
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const userQuery = query(
        collection(platformDb, 'users'),
        where('__name__', '==', currentUser.uid)
      )
      const userSnapshot = await getDocs(userQuery)
      
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data()
        setSettings({
          displayName: userData.displayName || currentUser.displayName || currentUser.email?.split('@')[0] || "",
          email: currentUser.email || "",
          bio: userData.bio || "",
          photoURL: userData.photoURL || currentUser.photoURL || "",
          notifications: userData.notifications || {
            email: true,
            push: true,
            likes: true,
            follows: true,
            messages: true
          },
          privacy: userData.privacy || {
            profilePublic: true,
            showEmail: false,
            showFollowers: true
          }
        })
      } else {
        // User document doesn't exist, use current user data
        setSettings({
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || "",
          email: currentUser.email || "",
          bio: "",
          photoURL: currentUser.photoURL || "",
          notifications: {
            email: true,
            push: true,
            likes: true,
            follows: true,
            messages: true
          },
          privacy: {
            profilePublic: true,
            showEmail: false,
            showFollowers: true
          }
        })
      }
    } catch (err: any) {
      console.error('Error loading settings:', err)
      error("Loading failed", "Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!isSupabaseConfigured || !platformStorage) {
      // Demo mode - just update local state
      const reader = new FileReader()
      reader.onload = (e) => {
        setSettings(prev => ({ ...prev, photoURL: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
      success("Uploaded", "Profile picture updated (demo mode)")
      return
    }

    setUploading(true)
    try {
      const imageRef = storageRef(platformStorage, `avatars/${currentUser?.uid}/${Date.now()}`)
      const snapshot = await uploadBytes(imageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      setSettings(prev => ({ ...prev, photoURL: downloadURL }))
      success("Uploaded", "Profile picture updated successfully")
    } catch (err: any) {
      console.error('Error uploading image:', err)
      error("Upload failed", "Failed to upload profile picture")
    } finally {
      setUploading(false)
    }
  }

  // Save settings
  const handleSaveSettings = async () => {
    if (!currentUser) return

    if (!isSupabaseConfigured || !platformDb) {
      // Demo mode - just show success
      setSaving(true)
      setTimeout(() => {
        setSaving(false)
        success("Saved", "Settings saved successfully (demo mode)")
      }, 1000)
      return
    }

    setSaving(true)
    try {
      const userRef = doc(platformDb, 'users', currentUser.uid)
      await updateDoc(userRef, {
        displayName: settings.displayName,
        bio: settings.bio,
        photoURL: settings.photoURL,
        notifications: settings.notifications,
        privacy: settings.privacy,
        updatedAt: new Date()
      })
      
      success("Saved", "Settings saved successfully")
    } catch (err: any) {
      console.error('Error saving settings:', err)
      error("Save failed", "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  // Load chat settings from localStorage
  const loadChatSettings = (): ChatSettings => {
    try {
      const stored = localStorage.getItem("pnx_chat_settings")
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error("Error loading chat settings:", e)
    }
    return {
      model: "free-hf",
      temperature: 0.35,
      maxTokens: 512,
      defaultPlaybook: "product-launch",
      autoSave: true,
      showTimestamps: true,
      soundEnabled: false,
      markdownEnabled: true,
      codeHighlighting: true,
      compactMode: false,
      fontSize: "medium",
      theme: "dark"
    }
  }

  const [chatSettings, setChatSettings] = useState<ChatSettings>(loadChatSettings())

  // Save chat settings to localStorage
  const saveChatSettings = (newSettings: ChatSettings) => {
    try {
      localStorage.setItem("pnx_chat_settings", JSON.stringify(newSettings))
      setChatSettings(newSettings)
      success("Saved", "Chat settings saved successfully")
    } catch (e) {
      console.error("Error saving chat settings:", e)
      error("Save failed", "Failed to save chat settings")
    }
  }

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [currentUser])

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "chat", label: "Chat", icon: MessageSquare }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-10 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                  <div className="h-32 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(tab.id as any)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </Button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={settings.photoURL} />
                      <AvatarFallback className="text-lg">
                        {settings.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Label htmlFor="avatar-upload">Profile Picture</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                          {uploading ? "Uploading..." : "Change Photo"}
                        </Button>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file)
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Display Name */}
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={settings.displayName}
                      onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Enter your display name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={settings.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={settings.bio}
                      onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleSaveSettings} disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { key: "email", label: "Email Notifications", description: "Receive notifications via email" },
                      { key: "push", label: "Push Notifications", description: "Receive push notifications in browser" },
                      { key: "likes", label: "Likes", description: "When someone likes your prompts" },
                      { key: "follows", label: "New Followers", description: "When someone follows you" },
                      { key: "messages", label: "Messages", description: "When you receive new messages" }
                    ].map((notification) => (
                      <div key={notification.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{notification.label}</p>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        <Button
                          variant={settings.notifications[notification.key as keyof typeof settings.notifications] ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSettings(prev => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              [notification.key]: !prev.notifications[notification.key as keyof typeof prev.notifications]
                            }
                          }))}
                        >
                          {settings.notifications[notification.key as keyof typeof settings.notifications] ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleSaveSettings} disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "privacy" && (
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { key: "profilePublic", label: "Public Profile", description: "Make your profile visible to other users" },
                      { key: "showEmail", label: "Show Email", description: "Display your email on your profile" },
                      { key: "showFollowers", label: "Show Followers", description: "Display your followers list publicly" }
                    ].map((privacy) => (
                      <div key={privacy.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{privacy.label}</p>
                          <p className="text-sm text-muted-foreground">{privacy.description}</p>
                        </div>
                        <Button
                          variant={settings.privacy[privacy.key as keyof typeof settings.privacy] ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSettings(prev => ({
                            ...prev,
                            privacy: {
                              ...prev.privacy,
                              [privacy.key]: !prev.privacy[privacy.key as keyof typeof prev.privacy]
                            }
                          }))}
                        >
                          {settings.privacy[privacy.key as keyof typeof settings.privacy] ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleSaveSettings} disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "chat" && (
              <div className="space-y-6">
                {/* Back to Chat Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Chat Settings</h2>
                    <p className="text-sm text-muted-foreground mt-1">Customize your AI chat experience</p>
                  </div>
                  <Button variant="outline" onClick={handleBackToChat}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Back to Chat
                  </Button>
                </div>

                {/* Model & Performance Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Model & Performance</CardTitle>
                    <p className="text-sm text-muted-foreground">Configure AI model and response settings</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Default Model</Label>
                      <Select
                        value={chatSettings.model}
                        onValueChange={(value) => setChatSettings(prev => ({ ...prev, model: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free-hf">PromptNX Free Model</SelectItem>
                          <SelectItem value="enterprise-ops" disabled>Enterprise Routing (Requires upgrade)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Choose your preferred AI model for chat responses</p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Temperature: {chatSettings.temperature.toFixed(2)}</Label>
                          <span className="text-xs text-muted-foreground">
                            {chatSettings.temperature < 0.5 ? "Focused" : chatSettings.temperature < 1.0 ? "Balanced" : "Creative"}
                          </span>
                        </div>
                        <Slider
                          value={[chatSettings.temperature]}
                          onValueChange={(value) => setChatSettings(prev => ({ ...prev, temperature: value[0] }))}
                          min={0}
                          max={2}
                          step={0.01}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                          Lower values make responses more focused and deterministic. Higher values increase creativity.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Max Tokens</Label>
                        <Input
                          type="number"
                          min="128"
                          max="4096"
                          step="128"
                          value={chatSettings.maxTokens}
                          onChange={(e) => setChatSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) || 512 }))}
                        />
                        <p className="text-xs text-muted-foreground">Maximum length of AI responses (128-4096 tokens)</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Default Playbook</Label>
                        <Select
                          value={chatSettings.defaultPlaybook}
                          onValueChange={(value) => setChatSettings(prev => ({ ...prev, defaultPlaybook: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="product-launch">Product Launch OS</SelectItem>
                            <SelectItem value="customer-success">Customer Success Playbook</SelectItem>
                            <SelectItem value="ops-maturity">Ops Maturity Sprint</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Default strategy lens for new conversations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* UI & Display Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>UI & Display</CardTitle>
                    <p className="text-sm text-muted-foreground">Customize chat interface appearance</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Timestamps</Label>
                          <p className="text-sm text-muted-foreground">Display time for each message</p>
                        </div>
                        <Switch
                          checked={chatSettings.showTimestamps}
                          onCheckedChange={(checked) => setChatSettings(prev => ({ ...prev, showTimestamps: checked }))}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Markdown Rendering</Label>
                          <p className="text-sm text-muted-foreground">Render markdown formatting in messages</p>
                        </div>
                        <Switch
                          checked={chatSettings.markdownEnabled}
                          onCheckedChange={(checked) => setChatSettings(prev => ({ ...prev, markdownEnabled: checked }))}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Code Syntax Highlighting</Label>
                          <p className="text-sm text-muted-foreground">Highlight code blocks with syntax colors</p>
                        </div>
                        <Switch
                          checked={chatSettings.codeHighlighting}
                          onCheckedChange={(checked) => setChatSettings(prev => ({ ...prev, codeHighlighting: checked }))}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Compact Mode</Label>
                          <p className="text-sm text-muted-foreground">Reduce spacing for more messages on screen</p>
                        </div>
                        <Switch
                          checked={chatSettings.compactMode}
                          onCheckedChange={(checked) => setChatSettings(prev => ({ ...prev, compactMode: checked }))}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Font Size</Label>
                        <Select
                          value={chatSettings.fontSize}
                          onValueChange={(value: "small" | "medium" | "large") => setChatSettings(prev => ({ ...prev, fontSize: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <Select
                          value={chatSettings.theme}
                          onValueChange={(value: "dark" | "light" | "auto") => setChatSettings(prev => ({ ...prev, theme: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="auto">Auto (System)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Behavior Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Behavior & Preferences</CardTitle>
                    <p className="text-sm text-muted-foreground">Control chat behavior and features</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto-save Conversations</Label>
                          <p className="text-sm text-muted-foreground">Automatically save chat history</p>
                        </div>
                        <Switch
                          checked={chatSettings.autoSave}
                          onCheckedChange={(checked) => setChatSettings(prev => ({ ...prev, autoSave: checked }))}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sound Notifications</Label>
                          <p className="text-sm text-muted-foreground">Play sound when AI responds</p>
                        </div>
                        <Switch
                          checked={chatSettings.soundEnabled}
                          onCheckedChange={(checked) => setChatSettings(prev => ({ ...prev, soundEnabled: checked }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={() => saveChatSettings(chatSettings)} className="w-full" size="lg">
                  <Save className="h-4 w-4 mr-2" />
                  Save Chat Settings
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
