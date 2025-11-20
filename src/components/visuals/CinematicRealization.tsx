import { useEffect, useRef, useState, lazy, Suspense } from "react"
import { motion, useInView } from "framer-motion"

const KeyScene = lazy(() => import("./KeyScene").then(m => ({ default: m.KeyScene })))

export function CinematicRealizationSection() {
  const ref = useRef<HTMLDivElement | null>(null)
  const inViewFM = useInView(ref, { margin: "-30% 0px -30% 0px", once: true })
  const [reduced, setReduced] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReduced(mq.matches)
      const onChange = () => setReduced(mq.matches)
      if (mq.addEventListener) {
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
      }
    } catch {}
  }, [])

  useEffect(() => {
    setMobile(window.innerWidth < 768)
    const onResize = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <section
      id="ai-awareness"
      ref={ref}
      className="relative flex flex-col items-center justify-center overflow-hidden min-h-screen bg-gradient-to-b from-[#0f0f1b] via-[#131327] to-[#0a0a14] text-center text-white"
    >
      {/* Background gradient + conic shimmer */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(1000px_600px_at_10%_-20%,rgba(88,101,242,0.18),transparent),radial-gradient(900px_500px_at_90%_120%,rgba(168,85,247,0.15),transparent)]" />
      <div className="absolute inset-0 -z-30 opacity-40 animate-[gradientShift_20s_linear_infinite] bg-[conic-gradient(from_160deg_at_50%_50%,rgba(15,23,42,0),rgba(59,130,246,0.10),rgba(168,85,247,0.12),rgba(15,23,42,0))]" />

      {/* soft animated particle layer */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <div className="absolute w-2 h-2 rounded-full bg-sky-300/40 blur-[2px] left-12 top-24 animate-[float_9s_ease_infinite]" />
        <div className="absolute w-3 h-3 rounded-full bg-indigo-400/40 blur-[2px] right-20 top-40 animate-[float_11s_ease_infinite]" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300/40 blur-[1px] left-1/3 bottom-16 animate-[float_13s_ease_infinite]" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-purple-400/40 blur-[3px] right-10 bottom-24 animate-[float_10s_ease_infinite]" />
      </div>

      {/* 3D layer (lazy and disabled if reduced-motion/mobile) */}
      {!reduced && !mobile && inViewFM && (
        <div className="absolute inset-0 -z-10">
          <Suspense fallback={null}>
            <KeyScene />
          </Suspense>
        </div>
      )}
      {(reduced || mobile) && (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(800px_400px_at_50%_60%,rgba(99,102,241,0.25),transparent)]" />
      )}

      {/* Text layer */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-300"
        >
          AI Tools Don’t Equal Outcomes.
        </motion.h1>

        {/* Subtle reflection under heading */}
        <div className="relative h-10 mt-1 w-[min(900px,92vw)]">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full select-none pointer-events-none">
            <div className="text-5xl md:text-7xl font-bold text-white/10 scale-y-[-1] opacity-30 [mask-image:linear-gradient(to_bottom,rgba(255,255,255,0.35),transparent)]">
              AI Tools Don’t Equal Outcomes.
            </div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-6 max-w-2xl text-gray-300 text-lg md:text-xl leading-relaxed"
        >
          Buying tools is easy; operationalizing AI is hard. 
          PNX standardizes prompts, automates reviews, and tracks impact—turning ad‑hoc usage into scalable, measurable workflows.
        </motion.p>

        {/* Light beam shimmer over text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.8 }}
          aria-hidden
          className="relative mt-6 h-12 w-[min(720px,90vw)]"
        >
          <span className="absolute -inset-y-6 -left-24 w-24 rotate-12 bg-gradient-to-r from-white/0 via-white/30 to-white/0 h-20 animate-[sweep_1.6s_ease_in_out]" />
        </motion.div>

        {/* CTA bottom */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="absolute bottom-10"
        >
          <a href="#features" aria-label="Discover the Real Power" className="relative inline-flex items-center gap-2 text-base md:text-lg px-6 py-3 rounded-lg border overflow-hidden group focus:outline-none focus:ring-2 focus:ring-sky-400/60">
            <span className="absolute -inset-px rounded-lg bg-[linear-gradient(110deg,rgba(88,101,242,0.35),rgba(168,85,247,0.30),rgba(88,101,242,0.35))] opacity-0 group-hover:opacity-100 transition-opacity blur" />
            <span className="relative">Discover the Real Power →</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
