import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Phone, 
  Instagram, 
  Copy,
  ExternalLink,
  Check
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContactButtonsProps {
  userId?: string
  userName?: string
  phoneNumber?: string
  whatsappNumber?: string
  instagramHandle?: string
  className?: string
}

export function ContactButtons({ 
  userId, 
  userName = "Creator",
  phoneNumber,
  whatsappNumber,
  instagramHandle,
  className = ""
}: ContactButtonsProps) {
  const [showContactModal, setShowContactModal] = useState(false)
  const { success } = useToast()

  // Get default contact info (mock data for demo)
  const defaultWhatsApp = whatsappNumber || "+1234567890"
  const defaultInstagram = instagramHandle || userName.toLowerCase().replace(/\s+/g, "")
  const defaultPhone = phoneNumber || "+1234567890"

  const handleWhatsApp = () => {
    const message = `Hi ${userName}! I'm interested in your products.`
    const whatsappUrl = `https://wa.me/${defaultWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    success("Opening WhatsApp", "Connecting you with " + userName)
  }

  const handleInstagram = () => {
    const instagramUrl = `https://instagram.com/${defaultInstagram.replace('@', '')}`
    window.open(instagramUrl, '_blank')
    success("Opening Instagram", "Viewing " + userName + "'s profile")
  }

  const handlePhone = () => {
    const phoneUrl = `tel:${defaultPhone.replace(/[^0-9+]/g, '')}`
    window.open(phoneUrl)
    success("Calling", "Connecting to " + userName)
  }

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(defaultPhone)
    success("Copied", "Phone number copied to clipboard")
  }

  const handleCopyWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(defaultWhatsApp)
    success("Copied", "WhatsApp number copied to clipboard")
  }

  return (
    <>
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleWhatsApp}
            className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleInstagram}
            variant="outline"
            className="flex-1 border-pink-500 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950 font-semibold transition-all duration-200"
          >
            <Instagram className="h-4 w-4 mr-2" />
            Instagram
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => setShowContactModal(true)}
            variant="outline"
            className="flex-1 transition-all duration-200"
          >
            <Phone className="h-4 w-4 mr-2" />
            More
          </Button>
        </motion.div>
      </div>

      {/* Contact Details Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact {userName}
            </DialogTitle>
            <DialogDescription>
              Choose your preferred way to reach out
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* WhatsApp Section */}
            <div className="p-4 border rounded-lg hover:border-[#25D366] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#25D366]/10 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">Chat instantly</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={handleCopyWhatsApp}
                  variant="ghost"
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                  {defaultWhatsApp}
                </code>
                <Button
                  onClick={handleWhatsApp}
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              </div>
            </div>

            {/* Instagram Section */}
            <div className="p-4 border rounded-lg hover:border-pink-500 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-500/10 rounded-lg">
                    <Instagram className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Instagram</h3>
                    <p className="text-sm text-muted-foreground">View profile</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                  @{defaultInstagram.replace('@', '')}
                </code>
                <Button
                  onClick={handleInstagram}
                  variant="outline"
                  className="border-pink-500 text-pink-600 hover:bg-pink-50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              </div>
            </div>

            {/* Phone Section */}
            <div className="p-4 border rounded-lg hover:border-primary transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-sm text-muted-foreground">Call directly</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={handleCopyPhone}
                  variant="ghost"
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                  {defaultPhone}
                </code>
                <Button
                  onClick={handlePhone}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

