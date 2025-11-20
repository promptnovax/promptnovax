import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function ROICalculatorSection() {
  const [runsPerDay, setRunsPerDay] = useState(500)
  const [costPerRun, setCostPerRun] = useState(0.003)
  const [hoursSaved, setHoursSaved] = useState(2.5)

  const monthly = useMemo(() => {
    const days = 22
    const runCost = runsPerDay * costPerRun * days
    const timeValue = hoursSaved * 50 /* assumed $50/hr */ * days
    const total = Math.max(timeValue - runCost, 0)
    return { runCost, timeValue, total }
  }, [runsPerDay, costPerRun, hoursSaved])

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1220] via-[#0b0f19] to-[#090c14]" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Estimate Your ROI</h2>
          <p className="text-lg md:text-xl text-white/70 mt-3">Simple assumptions to ballpark impact with PNX.</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm text-white/70">Runs per day</label>
                <Input type="number" value={runsPerDay} onChange={e => setRunsPerDay(Number(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-white/70">Cost per run ($)</label>
                <Input type="number" step="0.001" value={costPerRun} onChange={e => setCostPerRun(Number(e.target.value || 0))} />
              </div>
              <div>
                <label className="text-sm text-white/70">Hours saved / day</label>
                <Input type="number" step="0.1" value={hoursSaved} onChange={e => setHoursSaved(Number(e.target.value || 0))} />
              </div>
              <p className="text-xs text-white/50">Assumes $50/hr blended rate and 22 working days/month.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">${monthly.runCost.toFixed(2)}</div>
                <div className="text-sm text-white/70">Model cost</div>
              </div>
              <div>
                <div className="text-2xl font-bold">${monthly.timeValue.toFixed(0)}</div>
                <div className="text-sm text-white/70">Time value</div>
              </div>
              <div>
                <div className="text-2xl font-bold">${monthly.total.toFixed(0)}</div>
                <div className="text-sm text-white/70">Est. net monthly ROI</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default ROICalculatorSection


