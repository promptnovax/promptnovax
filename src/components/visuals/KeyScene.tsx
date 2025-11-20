import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useMemo, useRef } from "react"
import { Environment, Float, Sparkles, PresentationControls } from "@react-three/drei"

function MetallicKey() {
  const ref = useRef<any>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.35
    ref.current.position.y = Math.sin(Date.now() * 0.001) * 0.1
  })

  return (
    <group ref={ref} position={[0, 0.2, 0]}>
      {/* Key head */}
      <mesh>
        <torusGeometry args={[0.6, 0.12, 16, 64]} />
        <meshStandardMaterial color="#c9d2ff" metalness={0.9} roughness={0.15} emissive="#4ee1ff" emissiveIntensity={0.05} />
      </mesh>
      {/* Stem */}
      <mesh position={[0.8, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.6, 24]} />
        <meshStandardMaterial color="#d7e0ff" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Teeth */}
      <mesh position={[1.5, -0.5, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.18]} />
        <meshStandardMaterial color="#e5ecff" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  )
}

function HoloRing() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
      <ringGeometry args={[1.2, 2.6, 64]} />
      <meshBasicMaterial color="#4ee1ff" transparent opacity={0.18} />
    </mesh>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      {/* key light */}
      <directionalLight color="#ffffff" intensity={0.7} position={[2, 3, 2]} />
      {/* rim light */}
      <directionalLight color="#4ee1ff" intensity={0.9} position={[-3, 2, -2]} />
    </>
  )
}

function FloatingOrbs() {
  const group = useRef<any>(null)
  const orbs = useMemo(() => new Array(6).fill(0).map((_, i) => ({
    radius: 0.14 + (i % 3) * 0.05,
    x: Math.cos(i * 1.1) * 1.4,
    z: Math.sin(i * 1.3) * 1.2,
    y: -0.1 + (i % 2) * 0.25
  })), [])

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.children.forEach((m: any, idx: number) => {
      m.position.y = orbs[idx].y + Math.sin(t + idx) * 0.1
      m.position.x = orbs[idx].x + Math.cos(t * 0.6 + idx) * 0.08
      m.position.z = orbs[idx].z + Math.sin(t * 0.6 + idx) * 0.08
      m.rotation.y += 0.01
    })
  })

  return (
    <group ref={group}>
      {orbs.map((o, i) => (
        <mesh key={i} position={[o.x, o.y, o.z]}>
          <icosahedronGeometry args={[o.radius, 3]} />
          <meshStandardMaterial color={i % 2 ? "#8ab6ff" : "#a78bfa"} metalness={0.8} roughness={0.2} emissive="#7dd3fc" emissiveIntensity={0.05} />
        </mesh>
      ))}
    </group>
  )
}

function ParallaxCamera() {
  const ref = useRef<any>(null)
  useFrame((state) => {
    const targetX = state.pointer.x * 0.4
    const targetY = state.pointer.y * 0.2
    const cam = state.camera
    cam.position.x += (targetX - cam.position.x) * 0.05
    cam.position.y += (-targetY + 0.6 - cam.position.y) * 0.05
    cam.lookAt(0, 0.1, 0)
  })
  return null
}

export function KeyScene() {
  return (
    <Canvas camera={{ position: [0, 0.6, 4], fov: 45 }}>
      <Suspense fallback={null}>
        <Lights />
        <ParallaxCamera />
        <PresentationControls global rotation={[0, 0, 0]} snap={false} polar={[ -0.2, 0.3 ]} azimuth={[ -0.4, 0.4 ]} config={{ mass: 1, tension: 120, friction: 18 }}>
          <Float floatIntensity={0.6} rotationIntensity={0.25} speed={1.2}>
            <MetallicKey />
            <HoloRing />
            <FloatingOrbs />
          </Float>
        </PresentationControls>
        <Sparkles count={60} scale={[6, 2, 4]} size={2} speed={0.6} opacity={0.3} color="#93c5fd" />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}


