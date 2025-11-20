import { Suspense, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import { motion, useReducedMotion } from "framer-motion"

function GradientWaves() {
  // Lightweight placeholder: two blurred layers for glow effect (no custom shader to keep simple)
  return (
    <group>
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[30, 18]} />
        <meshBasicMaterial color="#0b1220" />
      </mesh>
    </group>
  )
}

function Particles() {
  // Very light particle field using points; keep count small for perf
  const positions = useMemo(() => {
    const count = 200
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12
      arr[i * 3 + 2] = -Math.random() * 6
    }
    return arr
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#8b5cf6" opacity={0.6} transparent />
    </points>
  )
}

export function HeroBackground() {
  const reduceMotion = useReducedMotion()
  return (
    <div className="absolute inset-0 -z-10">
      {reduceMotion ? (
        <div className="h-full w-full bg-[radial-gradient(800px_400px_at_20%_-10%,rgba(88,101,242,0.25),transparent),radial-gradient(600px_300px_at_80%_110%,rgba(168,85,247,0.25),transparent)]" />
      ) : (
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} frameloop="demand">
          <Suspense fallback={null}>
            <GradientWaves />
            <Particles />
            <Environment preset="city" />
          </Suspense>
          <ambientLight intensity={0.4} />
        </Canvas>
      )}
    </div>
  )
}


