import { Canvas, useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Core() {
  const group = useRef()
  const knot = useRef()
  const ringA = useRef()
  const ringB = useRef()

  useFrame((state, delta) => {
    const scrollMax = Math.max(1, document.documentElement.scrollHeight - innerHeight)
    const progress = scrollY / scrollMax
    const pointerX = state.pointer.x * 0.18
    const pointerY = state.pointer.y * 0.12
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointerX + progress * 4.2, 0.035)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointerY + progress * 1.2, 0.035)
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.08
    knot.current.rotation.x += delta * 0.18
    knot.current.rotation.z -= delta * 0.12
    ringA.current.rotation.z += delta * 0.17
    ringB.current.rotation.x -= delta * 0.13
  })

  return (
    <group ref={group}>
        <mesh ref={knot} scale={0.92}>
          <torusKnotGeometry args={[1.05, 0.32, 180, 24, 2, 3]} />
          <meshPhysicalMaterial
            color="#111714"
            metalness={0.88}
            roughness={0.19}
            clearcoat={1}
            clearcoatRoughness={0.14}
            emissive="#79a900"
            emissiveIntensity={0.12}
          />
        </mesh>
        <mesh ref={ringA} rotation={[1.1, 0.25, 0]}>
          <torusGeometry args={[1.85, 0.012, 8, 160]} />
          <meshBasicMaterial color="#d9ff43" transparent opacity={0.8} />
        </mesh>
        <mesh ref={ringB} rotation={[0.1, 1.1, 0.35]}>
          <torusGeometry args={[1.55, 0.008, 8, 160]} />
          <meshBasicMaterial color="#f5f7ec" transparent opacity={0.35} />
        </mesh>
        <mesh scale={0.32}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color="#d9ff43" wireframe />
        </mesh>
        {Array.from({ length: 8 }).map((_, index) => {
          const angle = (index / 8) * Math.PI * 2
          return (
            <mesh key={index} position={[Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, Math.sin(angle * 2) * 0.25]}>
              <sphereGeometry args={[index % 3 === 0 ? 0.045 : 0.025, 12, 12]} />
              <meshBasicMaterial color={index % 3 === 0 ? '#d9ff43' : '#f5f7ec'} />
            </mesh>
          )
        })}
    </group>
  )
}

function Field() {
  const points = useMemo(() => {
    const positions = new Float32Array(360 * 3)
    for (let i = 0; i < 360; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return positions
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#9ba29b" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

export default function Experience() {
  return (
    <div className="experience" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.4]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={4.5} color="#efffc0" />
        <pointLight position={[-3, -2, 3]} intensity={8} color="#78ffb7" distance={10} />
        <Core />
        <Field />
      </Canvas>
    </div>
  )
}
