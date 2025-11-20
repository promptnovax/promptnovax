import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"
import { 
  FileText, 
  Calendar, 
  Shield, 
  Users, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from "lucide-react"

export function TermsPage() {
  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content: "By accessing and using PromptX, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      id: "use-license",
      title: "Use License",
      icon: FileText,
      content: "Permission is granted to temporarily download one copy of PromptX for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials."
    },
    {
      id: "user-accounts",
      title: "User Accounts",
      icon: Users,
      content: "You are responsible for safeguarding the password and for maintaining the confidentiality of your account. You agree to accept responsibility for all activities that occur under your account or password."
    },
    {
      id: "payment-terms",
      title: "Payment Terms",
      icon: CreditCard,
      content: "All fees are charged in advance on a monthly or annual basis. Refunds are available within 30 days of purchase. Subscription fees are automatically renewed unless cancelled before the renewal date."
    },
    {
      id: "content-policy",
      title: "Content Policy",
      icon: Shield,
      content: "Users are responsible for the content they create and share. PromptX reserves the right to remove content that violates our community guidelines, including but not limited to harmful, illegal, or inappropriate material."
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: Shield,
      content: "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your information."
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
              <FileText className="w-10 h-10 text-primary" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              Terms of{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Service
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Please read these terms carefully before using PromptX. By using our service, you agree to be bound by these terms.
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
              <Badge variant="secondary">Version 2.1</Badge>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Important Notice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms of Service ("Terms") govern your use of PromptX ("Service") operated by PromptX Inc. 
                    ("us", "we", or "our"). By accessing or using our Service, you agree to be bound by these Terms. 
                    If you disagree with any part of these terms, then you may not access the Service.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Terms Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
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

            {/* Additional Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mt-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Additional Terms</CardTitle>
                  <CardDescription>
                    Important information about your rights and responsibilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Intellectual Property</h4>
                    <p className="text-muted-foreground text-sm">
                      The Service and its original content, features, and functionality are and will remain the exclusive property of PromptX Inc. and its licensors. The Service is protected by copyright, trademark, and other laws.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Termination</h4>
                    <p className="text-muted-foreground text-sm">
                      We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Disclaimer</h4>
                    <p className="text-muted-foreground text-sm">
                      The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Governing Law</h4>
                    <p className="text-muted-foreground text-sm">
                      These Terms shall be interpreted and governed by the laws of the State of California, without regard to its conflict of law provisions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Questions About These Terms?</CardTitle>
                  <CardDescription>
                    If you have any questions about these Terms of Service, please contact us.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Email</h4>
                      <p className="text-muted-foreground">legal@promptx.com</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Address</h4>
                      <p className="text-muted-foreground">
                        PromptX Inc.<br />
                        123 AI Street<br />
                        San Francisco, CA 94105
                      </p>
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
            transition={{ duration: 0.6, delay: 1.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who trust PromptX for their AI prompt needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}