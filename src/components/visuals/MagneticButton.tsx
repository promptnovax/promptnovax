import { useState } from "react"
import { motion } from "framer-motion"

export function MagneticButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ y: hovered ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  )
}


