import { motion } from "framer-motion"

export function GradientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 0.35, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute -top-24 -left-16 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle at center, rgba(88,101,242,0.35), transparent 60%)" }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 0.3, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle at center, rgba(168,85,247,0.30), transparent 60%)" }}
      />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-20 w-3/5 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl opacity-40" />
    </div>
  )
}

export default GradientOrbs


