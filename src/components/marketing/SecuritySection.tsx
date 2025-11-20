import { motion } from "framer-motion"
import { Shield, LockKeyhole, FileText, History } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function SecuritySection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1220] via-[#0b0f19] to-[#090c14]" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Security & Compliance</h2>
          <p className="text-lg md:text-xl text-white/70 mt-3">Enterprise guardrails without slowing teams down.</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[{Icon: Shield, t: "RBAC & SSO", d: "Granular roles, SSO/SAML, least‑privilege defaults."},
            {Icon: LockKeyhole, t: "Data Controls", d: "PII redaction, regional data residency, no-training by default."},
            {Icon: History, t: "Audit Trails", d: "Full prompt/version history with approvals."},
            {Icon: FileText, t: "Policies", d: "Usage policies, rate limits, retention windows."}
          ].map(({Icon, t, d}, i) => (
            <Card key={t}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{t}</div>
                    <div className="text-sm text-white/70">{d}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-white/60 mt-6">SOC 2 Type II (in progress) • GDPR ready • DPA available</p>
      </div>
    </section>
  )
}

export default SecuritySection


