import { motion } from "framer-motion"
import { Link } from "@/components/ui/link"
import { Button } from "@/components/ui/button"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  MessageCircle,
  ArrowUpRight
} from "lucide-react"
import { ThemeSegmented } from "@/components/ui/theme-segmented"
import { BrandLogo } from "@/components/visuals/BrandLogo"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <BrandLogo />
              <p className="text-muted-foreground max-w-md leading-relaxed">
                Empowering creators and businesses with AI-powered prompt generation and marketplace solutions.
              </p>
              <div className="flex flex-wrap gap-2">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 group">
                    <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X / Twitter">
                      <Twitter className="h-4 w-4 text-muted-foreground group-hover:text-[#1DA1F2]" />
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 group">
                    <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                      <Linkedin className="h-4 w-4 text-muted-foreground group-hover:text-[#0A66C2]" />
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 group">
                    <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                      <Github className="h-4 w-4 text-muted-foreground group-hover:text-[#333333]" />
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 group">
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                      <Instagram className="h-4 w-4 text-muted-foreground group-hover:text-[#E4405F]" />
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 group">
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                      <Facebook className="h-4 w-4 text-muted-foreground group-hover:text-[#1877F2]" />
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 group">
                    <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                      <Youtube className="h-4 w-4 text-muted-foreground group-hover:text-[#FF0000]" />
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 group">
                    <a href="https://reddit.com" target="_blank" rel="noreferrer" aria-label="Reddit">
                      <Globe className="h-4 w-4 text-muted-foreground group-hover:text-[#FF4500]" />
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 group">
                    <a href="https://discord.com" target="_blank" rel="noreferrer" aria-label="Discord">
                      <MessageCircle className="h-4 w-4 text-muted-foreground group-hover:text-[#5865F2]" />
                    </a>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
                  About
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="#careers" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
                  Careers
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="#feedback" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
                  Feedback
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
                  Contact
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#dashboard" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
                  Dashboard
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="#marketplace" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
                  Marketplace
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
                  Pricing
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#docs" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
                  Documentation
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="#help" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
                  Help Center
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="#blog" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
                  Blog
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
                  Terms of Service
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
                  Privacy Policy
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 p-6 bg-muted/30 rounded-xl border border-border/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">hello@promptx.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">San Francisco, CA</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-muted-foreground">
            © 2025 PromptX. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <ThemeSegmented />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={scrollToTop}
                className="text-muted-foreground hover:text-foreground"
              >
                Back to top
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
