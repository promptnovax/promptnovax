import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useRef } from "react"
import { Environment } from "@react-three/drei"

function SpinningSphere() {
  const ref = useRef<any>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.25
    ref.current.rotation.x += delta * 0.08
  })
  return (
    <mesh ref={ref} position={[0, 0, 0]} castShadow receiveShadow>
      <icosahedronGeometry args={[1.3, 2]} />
      <meshStandardMaterial color="#6d7cff" metalness={0.6} roughness={0.2} emissive="#3b82f6" emissiveIntensity={0.15} />
    </mesh>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 4, 3]} intensity={1} color="#93c5fd" />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#a78bfa" />
    </>
  )
}

export function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} shadows>
      <Suspense fallback={null}>
        <Lights />
        <SpinningSphere />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}


