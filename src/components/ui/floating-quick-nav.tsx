import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, Sparkles, DollarSign, Rocket, X, Menu } from "lucide-react"

export function FloatingQuickNav() {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  const sectionItems = [
    { icon: ArrowUp, label: "Top", id: "home" },
    { icon: Sparkles, label: "Features", id: "features" },
    { icon: DollarSign, label: "Pricing", id: "pricing" },
    { icon: Rocket, label: "Dashboard", id: "launch-dashboard" },
  ]

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = sectionItems.map(item => item.id)
      const scrollPosition = window.scrollY + 200

      for (const id of sections) {
        const element = id === 'home' ? document.body : document.getElementById(id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScroll = (id: string) => {
    const el = id === 'home' ? document.body : document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setOpen(false)
    }
  }

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative rounded-xl border bg-background/95 backdrop-blur-md shadow-lg p-3 space-y-2 min-w-[140px]"
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigate</span>
              <motion.button
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="h-6 w-6 grid place-items-center rounded-md hover:bg-muted transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            </div>
            {sectionItems.map(({ icon: Icon, label, id }) => {
              const isActive = activeSection === id
              return (
                <motion.button
                  key={id}
                  onClick={() => handleScroll(id)}
                  className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-muted/50 text-foreground'
                  }`}
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  <span>{label}</span>
                </motion.button>
              )
            })}
          </motion.div>
        ) : (
          <motion.button
            aria-label="Open navigation"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setOpen(true)}
            className="h-12 w-12 rounded-full bg-background/95 backdrop-blur-md border shadow-lg flex items-center justify-center hover:bg-muted/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="h-5 w-5 text-foreground" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}


