import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Save,
  Globe,
  Bell,
  DollarSign,
  Shield,
  ShieldCheck,
  KeyRound,
  CreditCard,
  UserRound,
  CheckCircle,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  MessageCircle,
  ShoppingBag,
  Heart,
  Download,
  AlertCircle,
  ArrowRight
} from "lucide-react"

const STORAGE_KEY = "pnx_buyer_settings"

interface BuyerSettingsData {
  displayName: string
  headline: string
  avatarUrl: string
  email: string
  timezone: string
  bio: string
  // Messaging
  allowMessages: boolean
  messageNotifications: boolean
  autoReplyEnabled: boolean
  autoReplyMessage: string
  showOnlineStatus: boolean
  // Notifications
  emailOnPurchase: boolean
  emailOnUpdate: boolean
  emailOnSubscription: boolean
  emailOnRefund: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  productTips: boolean
  collectionAlerts: boolean
  // Privacy
  profileVisibility: "public" | "followers" | "private"
  showPurchaseHistory: boolean
  showCollections: boolean
  showSubscriptions: boolean
  showWishlist: boolean
  // Billing
  defaultPaymentMethod: string
  billingEmail: string
  billingAddress: string
  autoRenewSubscriptions: boolean
  // Security
  twoFactorEnabled: boolean
  loginAlerts: boolean
  sessions: number
  // Preferences
  language: string
  theme: "light" | "dark" | "system"
  defaultView: "grid" | "list"
}

const settingsNav = [
  { key: "profile", label: "Profile", icon: UserRound, description: "Buyer identity & preferences" },
  { key: "messaging", label: "Messaging", icon: MessageCircle, description: "Buyer-seller communication" },
  { key: "notifications", label: "Notifications", icon: Bell, description: "Purchase & update alerts" },
  { key: "privacy", label: "Privacy", icon: Shield, description: "Purchase & collection privacy" },
  { key: "billing", label: "Billing", icon: CreditCard, description: "Payment & subscriptions" },
  { key: "security", label: "Security", icon: Lock, description: "Account protection" }
]

const timezones = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Dubai", "Asia/Kolkata",
  "Asia/Shanghai", "Asia/Tokyo", "Australia/Sydney"
]

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "hi", label: "Hindi" },
  { value: "ur", label: "Urdu" }
]

export function BuyerSettings() {
  const { toast } = useToast()
  const [data, setData] = useState<BuyerSettingsData>({
    displayName: "",
    headline: "",
    avatarUrl: "",
    email: "",
    timezone: "UTC",
    bio: "",
    allowMessages: true,
    messageNotifications: true,
    autoReplyEnabled: false,
    autoReplyMessage: "Thanks for your message! I'll get back to you soon.",
    showOnlineStatus: true,
    emailOnPurchase: true,
    emailOnUpdate: true,
    emailOnSubscription: true,
    emailOnRefund: true,
    pushNotifications: true,
    weeklyDigest: true,
    productTips: true,
    collectionAlerts: true,
    profileVisibility: "public",
    showPurchaseHistory: false,
    showCollections: true,
    showSubscriptions: false,
    showWishlist: true,
    defaultPaymentMethod: "",
    billingEmail: "",
    billingAddress: "",
    autoRenewSubscriptions: true,
    twoFactorEnabled: false,
    loginAlerts: true,
    sessions: 2,
    language: "en",
    theme: "system",
    defaultView: "grid"
  })
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setData(prev => ({ ...prev, ...JSON.parse(raw) }))
    } catch {}
  }, [])

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setSaved(true)
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    })
    setTimeout(() => setSaved(false), 2000)
  }

  const setField = (k: keyof BuyerSettingsData, v: any) => setData(prev => ({ ...prev, [k]: v }))

  return (
    <Tabs defaultValue="profile" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:sticky lg:top-6 lg:h-fit">
          <TabsList className="flex lg:flex-col gap-2 bg-muted/30 p-2 rounded-xl border h-auto w-full">
            {settingsNav.map((nav) => {
              const Icon = nav.icon
              return (
                <TabsTrigger
                  key={nav.key}
                  value={nav.key}
                  className="justify-start rounded-lg px-4 py-3 h-auto w-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold leading-tight">{nav.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{nav.description}</p>
                  </div>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6 min-w-0">
          {/* Profile */}
          <TabsContent value="profile" className="space-y-6 mt-0">
            <Card className="shadow-sm border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Buyer Profile & Preferences</CardTitle>
                <CardDescription className="text-sm mt-1">Manage your buyer profile, display preferences, and how you appear to sellers and other buyers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex flex-wrap items-start gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-20 w-20 border-2 border-border">
                      <AvatarImage src={data.avatarUrl} />
                      <AvatarFallback className="text-lg">{data.displayName?.slice(0, 2).toUpperCase() || "BU"}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-3 w-3 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Label className="text-sm text-muted-foreground">Avatar URL</Label>
                    <Input
                      className="mt-1"
                      value={data.avatarUrl}
                      onChange={(e) => setField("avatarUrl", e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Or paste a direct image URL</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Display Name</Label>
                    <Input className="mt-1" value={data.displayName} onChange={(e) => setField("displayName", e.target.value)} />
                  </div>
                  <div>
                    <Label>Headline</Label>
                    <Input className="mt-1" value={data.headline} onChange={(e) => setField("headline", e.target.value)} placeholder="e.g., AI Enthusiast, Prompt Collector" />
                    <p className="text-xs text-muted-foreground mt-1">How you'd like to be known as a buyer</p>
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <div className="relative mt-1">
                      <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-9" value={data.email} onChange={(e) => setField("email", e.target.value)} placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      Timezone
                    </Label>
                    <Select value={data.timezone} onValueChange={(v) => setField("timezone", v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea className="mt-1" rows={4} value={data.bio} onChange={(e) => setField("bio", e.target.value)} placeholder="Tell sellers and other buyers about your interests, what types of prompts you're looking for, or your use cases..." />
                  <p className="text-xs text-muted-foreground mt-1">Help sellers understand what you're looking for</p>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Language</Label>
                    <Select value={data.language} onValueChange={(v) => setField("language", v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Theme</Label>
                    <Select value={data.theme} onValueChange={(v: "light" | "dark" | "system") => setField("theme", v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Default View</Label>
                    <Select value={data.defaultView} onValueChange={(v: "grid" | "list") => setField("defaultView", v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid View</SelectItem>
                        <SelectItem value="list">List View</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">Default view for purchases and collections</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between pt-2">
                  <Button onClick={save} size="default" className="gap-2">
                    <Save className="h-4 w-4" /> 
                    Save profile
                  </Button>
                  {saved && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle className="h-4 w-4" /> 
                      Saved successfully
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messaging */}
          <TabsContent value="messaging" className="mt-0">
            <Card className="shadow-sm border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Messaging Settings</CardTitle>
                <CardDescription className="text-sm mt-1">Control how you communicate with sellers and other buyers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="p-4 rounded-lg border bg-muted/30 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Allow Messages</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Let sellers and other buyers send you messages.</p>
                  </div>
                  <Switch checked={data.allowMessages} onCheckedChange={(v) => setField("allowMessages", v)} />
                </div>
                
                <div className="p-4 rounded-lg border bg-muted/30 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Message Notifications</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Get notified when you receive new messages from sellers or buyers.</p>
                  </div>
                  <Switch checked={data.messageNotifications} onCheckedChange={(v) => setField("messageNotifications", v)} />
                </div>
                
                <div className="p-4 rounded-lg border bg-muted/30 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Show Online Status</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Let others see when you're online.</p>
                  </div>
                  <Switch checked={data.showOnlineStatus} onCheckedChange={(v) => setField("showOnlineStatus", v)} />
                </div>
                
                <Separator />
                
                <div className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">Auto-Reply</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Automatically reply to messages when you're away.</p>
                    </div>
                    <Switch checked={data.autoReplyEnabled} onCheckedChange={(v) => setField("autoReplyEnabled", v)} />
                  </div>
                  {data.autoReplyEnabled && (
                    <div className="mt-3">
                      <Label className="text-xs text-muted-foreground">Auto-Reply Message</Label>
                      <Textarea 
                        rows={3} 
                        className="mt-1" 
                        value={data.autoReplyMessage} 
                        onChange={(e) => setField("autoReplyMessage", e.target.value)} 
                        placeholder="Thanks for your message! I'll get back to you soon."
                      />
                    </div>
                  )}
                </div>
                
                <Separator />
                <div className="flex items-center justify-between pt-2">
                  <Button onClick={save} size="default" className="gap-2">
                    <Save className="h-4 w-4" /> 
                    Save messaging settings
                  </Button>
                  {saved && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle className="h-4 w-4" /> 
                      Saved successfully
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-0">
            <Card className="shadow-sm border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Buyer Notifications</CardTitle>
                <CardDescription className="text-sm mt-1">Control how PromptNX keeps you informed about purchases, subscriptions, and updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {[
                  { label: "Email on purchase", help: "Get notified via email when you successfully purchase a prompt.", key: "emailOnPurchase" },
                  { label: "Email on prompt updates", help: "Receive emails when prompts you've purchased receive updates or new versions.", key: "emailOnUpdate" },
                  { label: "Email on subscription", help: "Get notified about subscription renewals, changes, or cancellations.", key: "emailOnSubscription" },
                  { label: "Email on refunds", help: "Receive notifications when refunds are processed for your purchases.", key: "emailOnRefund" },
                  { label: "Push notifications", help: "Browser push notifications for important purchase and subscription updates.", key: "pushNotifications" },
                  { label: "Weekly digest", help: "Weekly summary of your purchases, collections, and personalized recommendations.", key: "weeklyDigest" },
                  { label: "Product tips", help: "Tips and best practices for using your purchased prompts effectively.", key: "productTips" },
                  { label: "Collection alerts", help: "Get notified when new prompts are added to collections you follow.", key: "collectionAlerts" }
                ].map((item, index) => (
                  <div key={item.key} className={`flex items-center justify-between gap-4 p-4 rounded-lg ${index < 5 ? 'border-b border-border/50 pb-4' : ''}`}>
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">{item.label}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.help}</p>
                    </div>
                    <Switch 
                      checked={data[item.key as keyof BuyerSettingsData] as boolean} 
                      onCheckedChange={(v) => setField(item.key as keyof BuyerSettingsData, v)}
                      className="flex-shrink-0"
                    />
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between pt-2">
                  <Button onClick={save} size="default" className="gap-2">
                    <Save className="h-4 w-4" /> 
                    Save preferences
                  </Button>
                  {saved && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle className="h-4 w-4" /> 
                      Saved successfully
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy" className="space-y-6 mt-0">
            <Card className="shadow-sm border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Buyer Privacy Settings</CardTitle>
                <CardDescription className="text-sm mt-1">Control what sellers and other buyers can see about your purchases, collections, and activity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <Label className="flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    Profile Visibility
                  </Label>
                  <Select value={data.profileVisibility} onValueChange={(v: "public" | "followers" | "private") => setField("profileVisibility", v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can view your buyer profile</SelectItem>
                      <SelectItem value="followers">Followers Only - Only followers can view your profile</SelectItem>
                      <SelectItem value="private">Private - Your profile is hidden from others</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Control who can see your buyer profile and activity</p>
                </div>
                
                <Separator />
                
                <div className="p-4 rounded-lg border bg-muted/30 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Show Purchase History</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Allow others to see your purchase history (anonymized - prompt names hidden).</p>
                  </div>
                  <Switch checked={data.showPurchaseHistory} onCheckedChange={(v) => setField("showPurchaseHistory", v)} />
                </div>
                
                <div className="p-4 rounded-lg border bg-muted/30 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Show Collections</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Make your prompt collections visible to sellers and other buyers.</p>
                  </div>
                  <Switch checked={data.showCollections} onCheckedChange={(v) => setField("showCollections", v)} />
                </div>
                
                <div className="p-4 rounded-lg border bg-muted/30 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Show Subscriptions</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Display your active subscriptions on your buyer profile.</p>
                  </div>
                  <Switch checked={data.showSubscriptions} onCheckedChange={(v) => setField("showSubscriptions", v)} />
                </div>
                
                <div className="p-4 rounded-lg border bg-muted/30 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Show Wishlist</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Make your wishlist visible to sellers (helps them understand your interests).</p>
                  </div>
                  <Switch checked={data.showWishlist} onCheckedChange={(v) => setField("showWishlist", v)} />
                </div>
                
                <Separator />
                <div className="flex items-center justify-between pt-2">
                  <Button onClick={save} size="default" className="gap-2">
                    <Save className="h-4 w-4" /> 
                    Save privacy settings
                  </Button>
                  {saved && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle className="h-4 w-4" /> 
                      Saved successfully
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="space-y-6 mt-0">
            <Card className="shadow-sm border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Billing & Payment</CardTitle>
                <CardDescription className="text-sm mt-1">Manage payment methods for purchases and subscription billing preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <CreditCard className="h-3 w-3" />
                      Default Payment Method
                    </Label>
                    <Select value={data.defaultPaymentMethod || ""} onValueChange={(v) => setField("defaultPaymentMethod", v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      Billing Email
                    </Label>
                    <Input className="mt-1" type="email" value={data.billingEmail} onChange={(e) => setField("billingEmail", e.target.value)} placeholder="billing@example.com" />
                  </div>
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    Billing Address
                  </Label>
                  <Textarea rows={3} className="mt-1" value={data.billingAddress} onChange={(e) => setField("billingAddress", e.target.value)} placeholder="Street address, city, state, country, postal code" />
                </div>
                <Separator />
                <div className="p-4 rounded-lg border bg-muted/30 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Auto-Renew Subscriptions</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Automatically renew your subscriptions when they expire.</p>
                  </div>
                  <Switch checked={data.autoRenewSubscriptions} onCheckedChange={(v) => setField("autoRenewSubscriptions", v)} />
                </div>
                <Separator />
                <div className="flex items-center justify-between pt-2">
                  <Button onClick={save} size="default" className="gap-2">
                    <Save className="h-4 w-4" /> 
                    Save billing
                  </Button>
                  {saved && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle className="h-4 w-4" /> 
                      Saved successfully
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="mt-0">
            <Card className="shadow-sm border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Security</CardTitle>
                <CardDescription className="text-sm mt-1">Protect your account and data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border-2 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <Label className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Lock className="h-4 w-4 text-primary" /> 
                      Password
                    </Label>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Passwords are managed via Supabase Auth.</p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="#reset-password">Reset password</a>
                    </Button>
                  </div>
                  <div className="p-5 rounded-xl border-2 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <Label className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <KeyRound className="h-4 w-4 text-primary" /> 
                      Two-factor authentication
                    </Label>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-muted-foreground mr-2 leading-relaxed flex-1">Use an authenticator app for all logins.</p>
                      <Switch checked={data.twoFactorEnabled} onCheckedChange={(v) => setField("twoFactorEnabled", v)} />
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Login alerts</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Notify me when a new device logs in.</p>
                  </div>
                  <Switch checked={data.loginAlerts} onCheckedChange={(v) => setField("loginAlerts", v)} />
                </div>
                <Separator />
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-semibold text-sm flex items-center gap-2 mb-2">
                    <Smartphone className="h-4 w-4 text-primary" /> 
                    Active sessions
                  </p>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">You have {data.sessions} devices signed in. End any suspicious sessions below.</p>
                  <Button variant="outline" size="sm">View sessions</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between pt-2">
                  <Button onClick={save} size="default" className="gap-2">
                    <Save className="h-4 w-4" /> 
                    Save security settings
                  </Button>
                  {saved && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle className="h-4 w-4" /> 
                      Saved successfully
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}

