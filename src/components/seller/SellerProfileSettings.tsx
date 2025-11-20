import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Verified,
  Shield,
  Globe,
  MapPin,
  Phone,
  Instagram,
  Link as LinkIcon,
  Save,
  CheckCircle
} from "lucide-react"

interface SellerProfileData {
  displayName: string
  tagline: string
  about: string
  location: string
  website: string
  whatsapp: string
  instagram: string
  verified: boolean
}

const STORAGE_KEY = "pnx_seller_profile"

export function SellerProfileSettings({ onChange }: { onChange?: (data: SellerProfileData) => void }) {
  const [data, setData] = useState<SellerProfileData>({
    displayName: "",
    tagline: "",
    about: "",
    location: "",
    website: "",
    whatsapp: "",
    instagram: "",
    verified: true // demo: verified by default
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setData((prev) => ({ ...prev, ...parsed }))
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (onChange) onChange(data)
  }, [data, onChange])

  const handleChange = (field: keyof SellerProfileData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Verification Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg">Verification Status</CardTitle>
            <CardDescription>Build trust with a verified badge</CardDescription>
          </div>
          {data.verified ? (
            <Badge className="bg-green-500 hover:bg-green-600">
              <Verified className="h-3 w-3 mr-1" /> Verified
            </Badge>
          ) : (
            <Badge variant="secondary">
              <Shield className="h-3 w-3 mr-1" /> Not Verified
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Display Name</Label>
              <Input
                value={data.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
                placeholder="Your store or creator name"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input
                value={data.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                placeholder="Short, catchy line about your products"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>About</Label>
            <Textarea
              value={data.about}
              onChange={(e) => handleChange("about", e.target.value)}
              placeholder="Tell buyers about your expertise and what makes your prompts special"
              className="mt-1"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Location</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={data.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="City, Country"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Website</Label>
              <div className="relative mt-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={data.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://example.com"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>WhatsApp</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={data.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  placeholder="WhatsApp number"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Instagram</Label>
              <div className="relative mt-1">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={data.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  placeholder="@yourhandle"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Other Link</Label>
              <div className="relative mt-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Optional portfolio or social link" className="pl-10" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              Your profile helps buyers trust your brand.
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleChange("verified", !data.verified)}>
                {data.verified ? <Shield className="h-4 w-4 mr-2" /> : <Verified className="h-4 w-4 mr-2" />}
                {data.verified ? "Disable Badge (Demo)" : "Enable Badge (Demo)"}
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Saved successfully
            </div>
          )}
        </CardContent>
      </Card>

      {/* Public Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Public Preview</CardTitle>
          <CardDescription>How your profile appears to buyers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-muted" />
              {data.verified && (
                <Badge className="absolute -bottom-2 -right-2 bg-green-500">
                  <Verified className="h-3 w-3 mr-1" /> Verified
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{data.displayName || "Your Name"}</h3>
                {data.tagline && (
                  <Badge variant="secondary">{data.tagline}</Badge>
                )}
              </div>
              {data.about && (
                <p className="text-sm text-muted-foreground max-w-prose">{data.about}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {data.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {data.location}
                  </span>
                )}
                {data.website && (
                  <span className="inline-flex items-center gap-1">
                    <Globe className="h-3 w-3" /> {data.website}
                  </span>
                )}
                {data.instagram && (
                  <span className="inline-flex items-center gap-1">
                    <Instagram className="h-3 w-3" /> @{data.instagram.replace('@','')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}








