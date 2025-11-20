import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { motion, useReducedMotion } from "framer-motion"

function Scene() {
  // Simple placeholder silhouettes using boxes to keep implementation light now
  return (
    <group>
      {/* Car silhouette */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[3.2, 0.5, 1]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      {/* Key */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshBasicMaterial color="#8b5cf6" />
      </mesh>
    </group>
  )
}

export function ImpactScene() {
  const reduceMotion = useReducedMotion()
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-background to-background/60">
      <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_20%_-10%,rgba(59,130,246,0.25),transparent),radial-gradient(600px_300px_at_80%_110%,rgba(168,85,247,0.25),transparent)]" />
      <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12">
        <div className="space-y-4">
          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold"
          >
            AI Tools Don’t Equal Outcomes.
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Buying tools is easy; operationalizing AI is hard. PNX standardizes prompts, automates reviews, and tracks impact—turning ad‑hoc usage into scalable, measurable workflows.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl font-semibold"
          >
            Ship AI that drives outcomes, not just demos.
          </motion.p>
        </div>
        <div className="relative h-64 md:h-80">
          {reduceMotion ? (
            <div className="h-full w-full rounded-xl bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2),transparent_60%)]" />
          ) : (
            <Canvas camera={{ position: [0, 0.6, 5], fov: 50 }}>
              <Suspense fallback={<Html center>Loading…</Html>}>
                <Scene />
              </Suspense>
              <ambientLight intensity={0.6} />
            </Canvas>
          )}
        </div>
      </div>
    </div>
  )
}


