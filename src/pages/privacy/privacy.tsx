import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"
import { 
  Shield, 
  Calendar, 
  Eye, 
  Lock, 
  Database,
  User,
  Mail,
  Settings,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Globe,
  Smartphone
} from "lucide-react"

export function PrivacyPage() {
  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Database,
      content: "We collect information you provide directly to us, such as when you create an account, use our services, or contact us. This includes your name, email address, payment information, and any content you create or share on our platform."
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      icon: Settings,
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and promotional offers."
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: User,
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with service providers who assist us in operating our platform."
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: Globe,
      content: "We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences."
    },
    {
      id: "your-rights",
      title: "Your Rights",
      icon: CheckCircle,
      content: "You have the right to access, update, or delete your personal information. You can also opt out of certain communications and request data portability. Contact us to exercise these rights."
    }
  ]

  const dataTypes = [
    {
      icon: User,
      title: "Personal Information",
      description: "Name, email, and contact details",
      examples: ["Account registration", "Profile setup", "Support requests"]
    },
    {
      icon: Database,
      title: "Usage Data",
      description: "How you interact with our platform",
      examples: ["Feature usage", "Performance metrics", "Error logs"]
    },
    {
      icon: Smartphone,
      title: "Device Information",
      description: "Technical details about your device",
      examples: ["Browser type", "Operating system", "IP address"]
    },
    {
      icon: Mail,
      title: "Communication Data",
      description: "Messages and support interactions",
      examples: ["Support tickets", "Feedback", "Survey responses"]
    }
  ]

  const lastUpdated = "January 1, 2025"

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-8"
            >
              <Shield className="w-10 h-10 text-primary" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              Privacy{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Policy
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use PromptX.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center justify-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {lastUpdated}</span>
              </div>
              <Badge variant="secondary">GDPR Compliant</Badge>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Data Types Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Types of Data We Collect</h2>
              <p className="text-xl text-muted-foreground">
                We collect different types of information to provide and improve our services
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dataTypes.map((dataType, index) => {
                const Icon = dataType.icon
                return (
                  <motion.div
                    key={dataType.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="flex flex-col items-center">
                        <div className="p-3 rounded-full bg-primary/10 mb-4">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{dataType.title}</CardTitle>
                        <CardDescription>{dataType.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {dataType.examples.map((example, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full"></div>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Our Commitment to Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    At PromptX, we are committed to protecting your privacy and ensuring the security of your personal information. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                    service. Please read this policy carefully to understand our practices regarding your personal data.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Privacy Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {section.content}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="mt-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Additional Privacy Information</CardTitle>
                  <CardDescription>
                    Important details about your privacy rights and our practices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Data Retention</h4>
                    <p className="text-muted-foreground text-sm">
                      We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">International Transfers</h4>
                    <p className="text-muted-foreground text-sm">
                      Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during such transfers.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Children's Privacy</h4>
                    <p className="text-muted-foreground text-sm">
                      Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will take steps to delete the information.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Changes to This Policy</h4>
                    <p className="text-muted-foreground text-sm">
                      We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="mt-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Questions About Your Privacy?</CardTitle>
                  <CardDescription>
                    If you have any questions about this Privacy Policy or our data practices, please contact us.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Privacy Officer</h4>
                      <p className="text-muted-foreground">privacy@promptx.com</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                      <p className="text-muted-foreground">dpo@promptx.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Privacy Matters
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              We're committed to protecting your data and being transparent about our practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#contact">
                  Contact Privacy Team
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#settings">
                  Privacy Settings
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}