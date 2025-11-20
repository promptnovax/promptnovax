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
import { motion } from "framer-motion"
import { 
  Save,
  Globe,
  Tag,
  Bell,
  DollarSign,
  Shield,
  Verified,
  Zap,
  BookOpen,
  ExternalLink,
  CheckCircle
} from "lucide-react"

const STORAGE_KEY = "pnx_seller_settings"

interface SellerSettingsData {
  storeName: string
  storeSlug: string
  storeBio: string
  // Product defaults
  defaultPrice: string
  defaultCategory: string
  allowDiscounts: boolean
  // Notifications
  emailOnSale: boolean
  emailOnReview: boolean
  weeklyDigest: boolean
  // Payments
  payoutMethod: string
  taxId: string
  // SEO
  metaTitle: string
  metaDescription: string
  // Compliance
  termsAccepted: boolean
  privacyAccepted: boolean
  // Verification progress
  idVerified: boolean
  portfolioLinked: boolean
  minProducts: number
}

export function SellerSettings() {
  const [data, setData] = useState<SellerSettingsData>({
    storeName: "",
    storeSlug: "",
    storeBio: "",
    defaultPrice: "",
    defaultCategory: "",
    allowDiscounts: true,
    emailOnSale: true,
    emailOnReview: true,
    weeklyDigest: true,
    payoutMethod: "",
    taxId: "",
    metaTitle: "",
    metaDescription: "",
    termsAccepted: false,
    privacyAccepted: false,
    idVerified: false,
    portfolioLinked: false,
    minProducts: 0
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setData(prev => ({ ...prev, ...JSON.parse(raw) }))
    } catch {}
  }, [])

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const setField = (k: keyof SellerSettingsData, v: any) => setData(prev => ({ ...prev, [k]: v }))

  const verificationScore = (
    (data.idVerified ? 1 : 0) +
    (data.portfolioLinked ? 1 : 0) +
    (data.minProducts >= 3 ? 1 : 0) +
    (data.termsAccepted && data.privacyAccepted ? 1 : 0)
  )
  const verifiedEligible = verificationScore >= 3

  return (
    <Tabs defaultValue="store" className="space-y-4">
      <TabsList className="w-full grid grid-cols-2 md:grid-cols-6">
        <TabsTrigger value="store">Store</TabsTrigger>
        <TabsTrigger value="products">Product Defaults</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
      </TabsList>

      {/* Store */}
      <TabsContent value="store">
        <Card>
          <CardHeader>
            <CardTitle>Store Settings</CardTitle>
            <CardDescription>Brand and public information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Store Name</Label>
                <Input value={data.storeName} onChange={e => setField('storeName', e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Store Slug</Label>
                <div className="relative mt-1">
                  <Globe className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={data.storeSlug} onChange={e => setField('storeSlug', e.target.value)} className="pl-9" placeholder="your-store" />
                </div>
              </div>
            </div>
            <div>
              <Label>Store Bio</Label>
              <Textarea value={data.storeBio} onChange={e => setField('storeBio', e.target.value)} rows={4} className="mt-1" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save</Button>
              {saved && (
                <div className="text-sm text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Saved</div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Product Defaults */}
      <TabsContent value="products">
        <Card>
          <CardHeader>
            <CardTitle>Product Defaults</CardTitle>
            <CardDescription>Defaults applied when creating new prompts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Default Price</Label>
                <div className="relative mt-1">
                  <DollarSign className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={data.defaultPrice} onChange={e => setField('defaultPrice', e.target.value)} className="pl-9" placeholder="0.00" />
                </div>
              </div>
              <div>
                <Label>Default Category</Label>
                <div className="relative mt-1">
                  <Tag className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={data.defaultCategory} onChange={e => setField('defaultCategory', e.target.value)} className="pl-9" placeholder="e.g., development" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Discounts</Label>
                  <p className="text-xs text-muted-foreground">Enable coupon codes for your products</p>
                </div>
                <Switch checked={data.allowDiscounts} onCheckedChange={(v) => setField('allowDiscounts', v)} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save</Button>
              {saved && (<div className="text-sm text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Saved</div>)}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Stay informed about sales and reviews</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email on Sale</Label>
                  <p className="text-xs text-muted-foreground">Get an email when someone purchases</p>
                </div>
                <Switch checked={data.emailOnSale} onCheckedChange={v => setField('emailOnSale', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email on Review</Label>
                  <p className="text-xs text-muted-foreground">Get an email when you receive a review</p>
                </div>
                <Switch checked={data.emailOnReview} onCheckedChange={v => setField('emailOnReview', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly Digest</Label>
                  <p className="text-xs text-muted-foreground">Weekly summary of your performance</p>
                </div>
                <Switch checked={data.weeklyDigest} onCheckedChange={v => setField('weeklyDigest', v)} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save</Button>
              {saved && (<div className="text-sm text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Saved</div>)}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Payments */}
      <TabsContent value="payments">
        <Card>
          <CardHeader>
            <CardTitle>Payments & Payouts</CardTitle>
            <CardDescription>Configure payout method and compliance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Payout Method</Label>
                <Input value={data.payoutMethod} onChange={e => setField('payoutMethod', e.target.value)} placeholder="e.g., Stripe account ID" className="mt-1" />
              </div>
              <div>
                <Label>Tax ID (optional)</Label>
                <Input value={data.taxId} onChange={e => setField('taxId', e.target.value)} placeholder="Tax/VAT ID" className="mt-1" />
              </div>
            </div>
            <Separator />
            <div>
              <Label>Verification Center</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <Badge variant={data.idVerified ? 'default' : 'secondary'} className={data.idVerified ? 'bg-green-600' : ''}>
                  <Shield className="h-3 w-3 mr-1" /> ID Verified
                </Badge>
                <Badge variant={data.portfolioLinked ? 'default' : 'secondary'} className={data.portfolioLinked ? 'bg-green-600' : ''}>
                  <Globe className="h-3 w-3 mr-1" /> Portfolio Linked
                </Badge>
                <Badge variant={data.minProducts >= 3 ? 'default' : 'secondary'} className={data.minProducts >= 3 ? 'bg-green-600' : ''}>
                  <Tag className="h-3 w-3 mr-1" /> 3+ Products
                </Badge>
                <Badge variant={data.termsAccepted && data.privacyAccepted ? 'default' : 'secondary'} className={data.termsAccepted && data.privacyAccepted ? 'bg-green-600' : ''}>
                  <Shield className="h-3 w-3 mr-1" /> Policies Accepted
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Requirement: complete 3 of 4 to qualify for <Badge className="ml-1"><Verified className="h-3 w-3 mr-1" /> Verified Badge</Badge>.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Mark ID Verified (demo)</Label>
                <Switch checked={data.idVerified} onCheckedChange={v => setField('idVerified', v)} className="mt-1" />
              </div>
              <div>
                <Label>Portfolio URL</Label>
                <Input value={data.portfolioLinked ? 'https://your-portfolio.com' : ''} onChange={e => setField('portfolioLinked', !!e.target.value)} placeholder="https://..." className="mt-1" />
              </div>
              <div>
                <Label>Products Live</Label>
                <Input type="number" value={data.minProducts} onChange={e => setField('minProducts', Number(e.target.value || 0))} className="mt-1" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm">
                Status: {verifiedEligible ? (
                  <span className="text-green-600 inline-flex items-center gap-1"><Verified className="h-4 w-4" /> Eligible</span>
                ) : (
                  <span className="text-muted-foreground">Incomplete</span>
                )}
              </div>
              <Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* SEO */}
      <TabsContent value="seo">
        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
            <CardDescription>Improve discoverability of your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Meta Title</Label>
              <Input value={data.metaTitle} onChange={e => setField('metaTitle', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Textarea value={data.metaDescription} onChange={e => setField('metaDescription', e.target.value)} rows={3} className="mt-1" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save</Button>
              {saved && (<div className="text-sm text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Saved</div>)}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tutorials */}
      <TabsContent value="tutorials">
        <Card>
          <CardHeader>
            <CardTitle>Seller Tutorials</CardTitle>
            <CardDescription>Short guides to help you succeed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'How to get Verified', icon: Verified, href: '#docs' },
                { title: 'Write High-Converting Descriptions', icon: Zap, href: '#docs' },
                { title: 'Pricing Strategy 101', icon: DollarSign, href: '#docs' },
                { title: 'SEO for Prompts', icon: Globe, href: '#docs' },
                { title: 'Using Coupons Effectively', icon: Tag, href: '#docs' },
                { title: 'Handling Reviews Professionally', icon: Bell, href: '#docs' },
              ].map((t, i) => {
                const Icon = t.icon
                return (
                  <motion.div key={t.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 border rounded-lg hover:shadow-sm">
                    <div className="flex items-center gap-2 font-medium"><Icon className="h-4 w-4" /> {t.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">2–5 minute read</p>
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <a href={t.href}><ExternalLink className="h-4 w-4 mr-2" /> Open</a>
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}








