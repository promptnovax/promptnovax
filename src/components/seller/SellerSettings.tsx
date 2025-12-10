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
  Tag,
  Bell,
  DollarSign,
  Shield,
  ShieldCheck,
  KeyRound,
  CreditCard,
  UserRound,
  CheckCircle,
  PlugZap,
  Mail,
  Smartphone,
  Lock,
  LifeBuoy,
  Upload,
  Clock,
  Building2,
  MapPin,
  FileText,
  Copy,
  Eye,
  EyeOff,
  Verified,
  AlertCircle,
  ArrowRight
} from "lucide-react"

const STORAGE_KEY = "pnx_seller_settings"

interface SellerSettingsData {
  displayName: string
  headline: string
  avatarUrl: string
  email: string
  timezone: string
  storeSlug: string
  storeBio: string
  // Defaults
  defaultPrice: string
  defaultCategory: string
  allowDiscounts: boolean
  // Notifications
  emailOnSale: boolean
  emailOnReview: boolean
  weeklyDigest: boolean
  smsAlerts: boolean
  productTips: boolean
  // Billing
  payoutMethod: string
  payoutEmail: string
  billingAddress: string
  taxId: string
  // Security
  twoFactorEnabled: boolean
  loginAlerts: boolean
  apiToken: string
  sessions: number
  // Compliance
  termsAccepted: boolean
  privacyAccepted: boolean
  // Messaging & Profile
  allowMessages: boolean
  messageNotifications: boolean
  profileVisibility: "public" | "followers" | "private"
  showContactInfo: boolean
  autoReplyEnabled: boolean
  autoReplyMessage: string
}

const settingsNav = [
  { key: "profile", label: "Profile", icon: UserRound, description: "Identity & brand" },
  { key: "messaging", label: "Messaging", icon: Mail, description: "Messages & communication" },
  { key: "notifications", label: "Notifications", icon: Bell, description: "Alerts & digests" },
  { key: "billing", label: "Billing & Payouts", icon: CreditCard, description: "Payments & tax" },
  { key: "security", label: "Security", icon: Shield, description: "Account protection" },
  { key: "integrations", label: "Integrations", icon: PlugZap, description: "Connected apps" }
]

const timezones = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Dubai", "Asia/Kolkata",
  "Asia/Shanghai", "Asia/Tokyo", "Australia/Sydney"
]

export function SellerSettings() {
  const { toast } = useToast()
  const [data, setData] = useState<SellerSettingsData>({
    displayName: "",
    headline: "",
    avatarUrl: "",
    email: "",
    timezone: "UTC",
    storeSlug: "",
    storeBio: "",
    defaultPrice: "",
    defaultCategory: "",
    allowDiscounts: true,
    emailOnSale: true,
    emailOnReview: true,
    weeklyDigest: true,
    smsAlerts: false,
    productTips: true,
    payoutMethod: "",
    payoutEmail: "",
    billingAddress: "",
    taxId: "",
    twoFactorEnabled: false,
    loginAlerts: true,
    apiToken: "",
    sessions: 2,
    termsAccepted: true,
    privacyAccepted: true,
    allowMessages: true,
    messageNotifications: true,
    profileVisibility: "public",
    showContactInfo: false,
    autoReplyEnabled: false,
    autoReplyMessage: "Thanks for your message! I'll get back to you soon."
  })
  const [saved, setSaved] = useState(false)
  const [showApiToken, setShowApiToken] = useState(false)

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

  const setField = (k: keyof SellerSettingsData, v: any) => setData(prev => ({ ...prev, [k]: v }))

  const copyApiToken = () => {
    if (data.apiToken) {
      navigator.clipboard.writeText(data.apiToken)
      toast({
        title: "Copied",
        description: "API token copied to clipboard.",
      })
    }
  }

  const generateApiToken = () => {
    const newToken = `pnx_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setField("apiToken", newToken)
    toast({
      title: "Token generated",
      description: "New API token has been generated.",
    })
  }

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
            {/* Verification Status Card */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Identity Verification
                    </CardTitle>
                    <CardDescription>Verify your identity to unlock payouts and marketplace features</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Complete verification to access all features</p>
                    <p className="text-xs text-muted-foreground">Upload your ID and complete the verification process</p>
                  </div>
                  <Button 
                    onClick={() => window.location.hash = '#dashboard/seller/verification'}
                    className="gap-2"
                  >
                    Verify Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Profile & Branding</CardTitle>
                <CardDescription className="text-sm mt-1">Control how buyers see you across the marketplace.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex flex-wrap items-start gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-20 w-20 border-2 border-border">
                      <AvatarImage src={data.avatarUrl} />
                      <AvatarFallback className="text-lg">{data.displayName?.slice(0, 2).toUpperCase() || "PN"}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="h-3 w-3 mr-2" />
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
                    <Input className="mt-1" value={data.headline} onChange={(e) => setField("headline", e.target.value)} placeholder="e.g., Senior Prompt Engineer" />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <div className="relative mt-1">
                      <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-9" value={data.email} onChange={(e) => setField("email", e.target.value)} placeholder="you@company.com" />
                    </div>
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
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
                  <Label>Public Bio</Label>
                  <Textarea className="mt-1" rows={4} value={data.storeBio} onChange={(e) => setField("storeBio", e.target.value)} placeholder="Describe your specialties, experience, and what buyers can expect." />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    Public Store URL
                  </Label>
                  <div className="relative mt-1">
                    <Globe className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9" value={data.storeSlug} onChange={(e) => setField("storeSlug", e.target.value)} placeholder="your-handle" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Your store will be available at: promptnx.com/sellers/{data.storeSlug || "your-handle"}</p>
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
          <TabsContent value="messaging" className="space-y-6 mt-0">
            <Card className="shadow-sm border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Messaging Preferences</CardTitle>
                <CardDescription className="text-sm mt-1">Control how buyers can contact you and manage your messaging settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="p-4 rounded-lg border bg-muted/30 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Allow Messages</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Let buyers send you messages through PromptNX.</p>
                  </div>
                  <Switch checked={data.allowMessages} onCheckedChange={(v) => setField("allowMessages", v)} />
                </div>
                
                {data.allowMessages && (
                  <>
                    <Separator />
                    <div className="p-4 rounded-lg border bg-muted/30 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">Message Notifications</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">Get notified when you receive new messages.</p>
                      </div>
                      <Switch checked={data.messageNotifications} onCheckedChange={(v) => setField("messageNotifications", v)} />
                    </div>
                    
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
                          <SelectItem value="public">Public - Anyone can message you</SelectItem>
                          <SelectItem value="followers">Followers Only - Only followers can message</SelectItem>
                          <SelectItem value="private">Private - No messages allowed</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">Control who can send you messages</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="p-4 rounded-lg border bg-muted/30 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">Show Contact Info</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">Display WhatsApp/Instagram on your profile (optional).</p>
                      </div>
                      <Switch checked={data.showContactInfo} onCheckedChange={(v) => setField("showContactInfo", v)} />
                    </div>
                    
                    <Separator />
                    
                    <div className="p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <p className="font-semibold text-sm mb-1">Auto-Reply</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">Automatically reply to new messages.</p>
                        </div>
                        <Switch checked={data.autoReplyEnabled} onCheckedChange={(v) => setField("autoReplyEnabled", v)} />
                      </div>
                      {data.autoReplyEnabled && (
                        <div className="mt-4">
                          <Label>Auto-Reply Message</Label>
                          <Textarea 
                            className="mt-1" 
                            rows={3} 
                            value={data.autoReplyMessage} 
                            onChange={(e) => setField("autoReplyMessage", e.target.value)} 
                            placeholder="Thanks for your message! I'll get back to you soon."
                          />
                          <p className="text-xs text-muted-foreground mt-1">This message will be sent automatically to new conversations</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
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
                <CardTitle className="text-xl">Notifications</CardTitle>
                <CardDescription className="text-sm mt-1">Decide how PromptNX keeps you in the loop.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {[
                  { label: "Email on sale", help: "Instant email when a prompt sells.", key: "emailOnSale" },
                  { label: "Email on review", help: "Email whenever you receive new feedback.", key: "emailOnReview" },
                  { label: "Weekly digest", help: "Every Monday you’ll get KPIs, churn, and watchlist prompts.", key: "weeklyDigest" },
                  { label: "SMS alerts", help: "Critical payout or compliance updates sent via SMS.", key: "smsAlerts" },
                  { label: "Product tips", help: "Occasional strategy notes from the PromptNX team.", key: "productTips" }
                ].map((item, index) => (
                  <div key={item.key} className={`flex items-center justify-between gap-4 p-4 rounded-lg ${index < 4 ? 'border-b border-border/50 pb-4' : ''}`}>
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">{item.label}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.help}</p>
                    </div>
                    <Switch 
                      checked={data[item.key as keyof SellerSettingsData] as boolean} 
                      onCheckedChange={(v) => setField(item.key as keyof SellerSettingsData, v)}
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

          {/* Billing */}
          <TabsContent value="billing" className="space-y-6 mt-0">
            <Card className="shadow-sm border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Payouts</CardTitle>
                <CardDescription className="text-sm mt-1">Where should PromptNX send your earnings?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <CreditCard className="h-3 w-3" />
                      Payout Method
                    </Label>
                    <Select value={data.payoutMethod || ""} onValueChange={(v) => setField("payoutMethod", v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select payout method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe Connect</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency (USDC)</SelectItem>
                      </SelectContent>
                    </Select>
                    {data.payoutMethod === "stripe" && (
                      <Input className="mt-2" placeholder="Stripe account ID (acct_...)" />
                    )}
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      Payout Email
                    </Label>
                    <Input className="mt-1" type="email" value={data.payoutEmail} onChange={(e) => setField("payoutEmail", e.target.value)} placeholder="finance@you.com" />
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-3 w-3" />
                    Billing Address
                  </Label>
                  <Textarea rows={3} className="mt-1" value={data.billingAddress} onChange={(e) => setField("billingAddress", e.target.value)} placeholder="Company name, street address, city, state, country, postal code" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      Tax / VAT ID
                    </Label>
                    <Input className="mt-1" value={data.taxId} onChange={(e) => setField("taxId", e.target.value)} placeholder="Optional - for tax reporting" />
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
                    <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Secure & Compliant</p>
                      <p className="text-xs text-muted-foreground mt-1">All payouts run through PromptNX's PCI-compliant Stripe Connect flow with bank-level encryption.</p>
                    </div>
                  </div>
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

            <Card className="shadow-sm border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Invoices & Docs</CardTitle>
                <CardDescription className="text-sm mt-1">Get a monthly financial package with CSV exports.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="font-medium">Monthly finance bundle</p>
                  <p className="text-sm text-muted-foreground">Receive invoices, payouts, and fees by the 2nd of every month.</p>
                </div>
                <Button variant="outline"><CreditCard className="h-4 w-4 mr-2" /> Enable Bundle</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="mt-0">
            <Card className="shadow-sm border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Security</CardTitle>
                <CardDescription className="text-sm mt-1">Keep your studio and buyer data safe.</CardDescription>
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
                      <p className="text-xs text-muted-foreground mr-2 leading-relaxed flex-1">Use an authenticator app for all studio logins.</p>
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

          {/* Integrations */}
          <TabsContent value="integrations" className="mt-0">
            <Card className="shadow-sm border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">API & Integrations</CardTitle>
                <CardDescription className="text-sm mt-1">Connect PromptNX to other tools.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border-2 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <Label className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <PlugZap className="h-4 w-4 text-primary" /> 
                      Marketplace API token
                    </Label>
                    <div className="relative mt-2">
                      <Input 
                        className="font-mono text-sm pr-20" 
                        type={showApiToken ? "text" : "password"}
                        value={data.apiToken} 
                        onChange={(e) => setField("apiToken", e.target.value)} 
                        placeholder="pnx_live_xxxxxxxx" 
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        {data.apiToken && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={copyApiToken}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => setShowApiToken(!showApiToken)}
                        >
                          {showApiToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={generateApiToken}>Generate new token</Button>
                      {data.apiToken && (
                        <Button variant="outline" size="sm" onClick={copyApiToken}>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Use this token to authenticate API requests to the PromptNX marketplace.</p>
                  </div>
                  <div className="p-5 rounded-xl border-2 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <Label className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <LifeBuoy className="h-4 w-4 text-primary" /> 
                      Support handoff
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Automatically send high-severity support tickets to your Slack channel.</p>
                    <Button variant="outline" className="mt-3">Connect Slack</Button>
                  </div>
                </div>
                <Separator />
                <div className="p-4 rounded-lg border bg-muted/30 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Zapier automation</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Trigger workflows when a prompt is approved or rejected.</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4">Connect Zapier</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}








