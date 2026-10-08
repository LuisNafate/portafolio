import { Canvas, useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

const darkMaterial = { color: '#0b100e', metalness: 0.86, roughness: 0.24 }
const acidMaterial = { color: '#d9ff43', metalness: 0.45, roughness: 0.22, emissive: '#729000', emissiveIntensity: 0.24 }
const lightMaterial = { color: '#dfe5dc', metalness: 0.72, roughness: 0.2 }

function Wheel({ position }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh><cylinderGeometry args={[0.2, 0.2, 0.14, 20]} /><meshStandardMaterial color="#030404" roughness={0.7} /></mesh>
      <mesh position={[0, 0.075, 0]}><cylinderGeometry args={[0.085, 0.085, 0.012, 16]} /><meshStandardMaterial {...acidMaterial} /></mesh>
    </group>
  )
}

function FormulaCar({ objectRef }) {
  return (
    <group ref={objectRef} position={[1.1, -0.6, 0.25]} rotation={[0.08, -0.48, 0]} scale={0.86}>
      <mesh><boxGeometry args={[1.5, 0.22, 0.55]} /><meshStandardMaterial {...darkMaterial} /></mesh>
      <mesh position={[0.92, -0.02, 0]}><boxGeometry args={[0.95, 0.12, 0.22]} /><meshStandardMaterial {...acidMaterial} /></mesh>
      <mesh position={[1.42, 0.01, 0]}><boxGeometry args={[0.08, 0.08, 1.12]} /><meshStandardMaterial {...lightMaterial} /></mesh>
      <mesh position={[-0.84, 0.28, 0]}><boxGeometry args={[0.1, 0.34, 1.08]} /><meshStandardMaterial {...acidMaterial} /></mesh>
      <mesh position={[-0.12, 0.24, 0]} scale={[1, 0.72, 1]}><sphereGeometry args={[0.3, 20, 12]} /><meshPhysicalMaterial color="#101916" metalness={0.9} roughness={0.05} transmission={0.12} /></mesh>
      <mesh position={[0.25, 0.2, 0]} rotation={[0, 0, -0.2]}><torusGeometry args={[0.28, 0.035, 8, 24, Math.PI * 1.45]} /><meshStandardMaterial {...acidMaterial} /></mesh>
      <Wheel position={[-0.6, -0.05, 0.43]} /><Wheel position={[-0.6, -0.05, -0.43]} />
      <Wheel position={[0.72, -0.07, 0.38]} /><Wheel position={[0.72, -0.07, -0.38]} />
    </group>
  )
}

function Rocket({ objectRef }) {
  return (
    <group ref={objectRef} position={[2.45, 1.05, -1.2]} rotation={[0, 0, -0.15]} scale={0.7}>
      <mesh><cylinderGeometry args={[0.23, 0.31, 1.65, 18]} /><meshStandardMaterial {...lightMaterial} /></mesh>
      <mesh position={[0, 1.08, 0]}><coneGeometry args={[0.23, 0.55, 18]} /><meshStandardMaterial {...acidMaterial} /></mesh>
      <mesh position={[0, -0.95, 0]}><cylinderGeometry args={[0.18, 0.27, 0.25, 16]} /><meshStandardMaterial {...darkMaterial} /></mesh>
      {[-1, 1].map((side) => <mesh key={side} position={[side * 0.34, -0.62, 0]} rotation={[0, 0, side * -0.45]}><boxGeometry args={[0.12, 0.62, 0.08]} /><meshStandardMaterial {...acidMaterial} /></mesh>)}
      <mesh position={[0, -1.28, 0]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.17, 0.72, 16]} /><meshBasicMaterial color="#d9ff43" transparent opacity={0.58} /></mesh>
    </group>
  )
}

function Jet({ objectRef }) {
  return (
    <group ref={objectRef} position={[0.9, 1.15, -1.35]} rotation={[0.2, -0.15, -0.12]} scale={0.62}>
      <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.12, 0.27, 1.8, 14]} /><meshStandardMaterial {...lightMaterial} /></mesh>
      <mesh position={[0.95, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.12, 0.5, 14]} /><meshStandardMaterial {...acidMaterial} /></mesh>
      <mesh position={[-0.1, 0, 0]} rotation={[0, 0, -0.05]}><boxGeometry args={[1.15, 0.045, 2.25]} /><meshStandardMaterial {...darkMaterial} /></mesh>
      <mesh position={[-0.72, 0.26, 0]} rotation={[0, 0, -0.35]}><boxGeometry args={[0.52, 0.04, 0.78]} /><meshStandardMaterial {...acidMaterial} /></mesh>
    </group>
  )
}

function ParticleField() {
  const positions = useMemo(() => {
    const data = new Float32Array(420 * 3)
    for (let index = 0; index < 420; index += 1) {
      data[index * 3] = (Math.random() - 0.5) * 14
      data[index * 3 + 1] = (Math.random() - 0.5) * 9
      data[index * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return data
  }, [])
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial size={0.012} color="#aab1aa" transparent opacity={0.48} sizeAttenuation /></points>
}

function InnovationHangar() {
  const root = useRef(); const car = useRef(); const rocket = useRef(); const jet = useRef()
  useFrame((state, delta) => {
    const progress = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)
    const time = state.clock.elapsedTime
    root.current.position.x = THREE.MathUtils.lerp(root.current.position.x, state.size.width < 700 ? 0 : 0.78, 0.035)
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, state.pointer.x * 0.12 - progress * 0.35, 0.03)
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, state.pointer.y * 0.06, 0.03)
    car.current.position.x = 1.1 + Math.sin(time * 0.55) * 0.16 - progress * 1.7
    car.current.position.y = -0.6 + Math.sin(time * 1.3) * 0.025
    car.current.rotation.y = -0.48 + state.pointer.x * 0.08
    rocket.current.position.y = 1.05 + progress * 4.2 + Math.sin(time * 1.1) * 0.06
    rocket.current.rotation.y += delta * 0.14
    jet.current.position.x = 0.9 + Math.cos(time * 0.28) * 0.28
    jet.current.position.y = 1.15 + Math.sin(time * 0.4) * 0.18 - progress * 1.2
    jet.current.rotation.z = -0.12 + Math.sin(time * 0.35) * 0.08
  })
  return <group ref={root}><FormulaCar objectRef={car} /><Rocket objectRef={rocket} /><Jet objectRef={jet} /><gridHelper args={[10, 24, '#d9ff43', '#1b241e']} position={[0, -1.25, 0]} /><ParticleField /></group>
}

export default function Experience() {
  return <div className="experience" aria-hidden="true"><Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.4]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}><fog attach="fog" args={['#070909', 5.5, 11]} /><ambientLight intensity={0.65} /><directionalLight position={[3, 5, 5]} intensity={4.8} color="#efffc0" /><pointLight position={[1, -1, 3]} intensity={10} color="#78ffb7" distance={9} /><InnovationHangar /></Canvas></div>
}
