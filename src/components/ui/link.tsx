import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
  active?: boolean
  animate?: boolean
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, className, active, animate = true, ...props }, ref) => {
    const isHashLink = href.startsWith("#")

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isHashLink) {
        e.preventDefault()
        const targetId = href.slice(1)
        const target = document.getElementById(targetId) || (targetId === "" ? document.body : null)

        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" })
          window.history.replaceState({}, "", `#${targetId}`)
          return
        }
        // fall back to default navigation event if the target doesn't exist
      } else {
        e.preventDefault()
      }

      const event = new CustomEvent('navigate', {
        detail: { href: href.replace('#', '') }
      })
      window.dispatchEvent(event)
    }

    const linkContent = (
      <a
        ref={ref}
        href={href}
        onClick={handleClick}
        className={cn(
          "transition-all duration-200 ease-in-out",
          "hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          active && "text-primary font-medium",
          className
        )}
        {...props}
      >
        {children}
      </a>
    )

    if (animate) {
      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {linkContent}
        </motion.div>
      )
    }

    return linkContent
  }
)

Link.displayName = "Link"
