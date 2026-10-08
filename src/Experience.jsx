import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const asset = (name) => `${import.meta.env.BASE_URL}models/${name}`
const CAR_URL = asset('formula-racer.glb')
const PLANE_URL = asset('airliner.glb')
const ROCKET_URLS = [
  asset('rocket-first-stage.glb'),
  asset('rocket-interstage.glb'),
  asset('rocket-second-stage.glb'),
  asset('rocket-fairing.glb'),
]

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const ease = (value) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}

function prepareScene(source) {
  const scene = source.clone(true)
  scene.traverse((child) => {
    if (!child.isMesh) return
    child.castShadow = true
    child.receiveShadow = true
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach((material) => {
      if (!material) return
      material.envMapIntensity = 1.35
      material.needsUpdate = true
    })
  })
  return scene
}

function FormulaModel({ modelRef }) {
  const gltf = useLoader(GLTFLoader, CAR_URL)
  const scene = useMemo(() => prepareScene(gltf.scene), [gltf.scene])
  return (
    <group ref={modelRef} scale={0.82} rotation={[0.08, 0.92, -0.03]}>
      <primitive object={scene} />
      <mesh position={[0, 0.08, -2.8]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.025, 4.8]} />
        <meshBasicMaterial color="#d9ff43" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

function RocketModel({ modelRef }) {
  const models = useLoader(GLTFLoader, ROCKET_URLS)
  const scenes = useMemo(() => models.map((model) => prepareScene(model.scene)), [models])
  return (
    <group ref={modelRef} scale={0.088} rotation={[0.04, -0.28, -0.05]}>
      <primitive object={scenes[0]} />
      <primitive object={scenes[1]} position={[0, 24, 0]} />
      <primitive object={scenes[2]} position={[0, 25.6, 0]} />
      <primitive object={scenes[3]} position={[0, 37.9, 0]} />
      <mesh position={[0, -6.5, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[1.4, 13, 20, 1, true]} />
        <meshBasicMaterial color="#d9ff43" transparent opacity={0.24} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

function PlaneModel({ modelRef }) {
  const gltf = useLoader(GLTFLoader, PLANE_URL)
  const scene = useMemo(() => prepareScene(gltf.scene), [gltf.scene])
  return (
    <group ref={modelRef} scale={0.115} rotation={[Math.PI / 2, 0, -Math.PI / 2]}>
      <primitive object={scene} />
      {[-5.7, 5.7].map((offset) => (
        <mesh key={offset} position={[offset, 0.1, -28]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 31]} />
          <meshBasicMaterial color="#d9ff43" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Dust() {
  const positions = useMemo(() => {
    const data = new Float32Array(260 * 3)
    for (let index = 0; index < 260; index += 1) {
      data[index * 3] = (Math.random() - 0.5) * 15
      data[index * 3 + 1] = (Math.random() - 0.5) * 9
      data[index * 3 + 2] = (Math.random() - 0.5) * 7
    }
    return data
  }, [])
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial size={0.01} color="#d9ff43" transparent opacity={0.3} sizeAttenuation /></points>
}

function VehicleSequence() {
  const car = useRef()
  const rocket = useRef()
  const plane = useRef()

  useFrame((state, delta) => {
    if (!car.current || !rocket.current || !plane.current) return
    const unit = scrollY / Math.max(1, innerHeight)
    const time = state.clock.elapsedTime
    const pointerX = state.pointer.x
    const pointerY = state.pointer.y

    const carExit = ease((unit - 0.86) / 0.78)
    car.current.position.x = THREE.MathUtils.lerp(1.35, -7.5, carExit) + pointerX * 0.14
    car.current.position.y = -0.58 + Math.sin(time * 0.85) * 0.025 + pointerY * 0.06
    car.current.position.z = THREE.MathUtils.lerp(0.25, -1.5, carExit)
    car.current.rotation.y = 0.92 + carExit * 0.28

    const rocketIn = ease((unit - 1.12) / 0.66)
    const rocketOut = ease((unit - 2.15) / 0.72)
    rocket.current.position.x = 1.35 + pointerX * 0.1
    rocket.current.position.y = THREE.MathUtils.lerp(-7.3, -1.9, rocketIn) + rocketOut * 8.4 + Math.sin(time * 0.7) * 0.045
    rocket.current.position.z = -0.25
    rocket.current.rotation.y += delta * 0.055

    const planeIn = ease((unit - 2.14) / 0.86)
    const planeOut = ease((unit - 3.46) / 0.72)
    plane.current.position.x = THREE.MathUtils.lerp(-8.5, 0.65, planeIn) + planeOut * 9.2
    plane.current.position.y = 0.05 + Math.sin(time * 0.42) * 0.1 + pointerY * 0.08
    plane.current.position.z = THREE.MathUtils.lerp(-1.4, 0.35, planeIn) - planeOut * 1.2
    plane.current.rotation.z = -0.08 + Math.sin(time * 0.35) * 0.035
  })

  return <><FormulaModel modelRef={car} /><RocketModel modelRef={rocket} /><PlaneModel modelRef={plane} /><Dust /></>
}

useLoader.preload(GLTFLoader, CAR_URL)
useLoader.preload(GLTFLoader, PLANE_URL)
ROCKET_URLS.forEach((url) => useLoader.preload(GLTFLoader, url))

export default function Experience() {
  return (
    <div className="experience" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 7], fov: 39 }} dpr={[1, 1.35]} shadows gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <fog attach="fog" args={['#070909', 7, 13]} />
        <ambientLight intensity={1.2} />
        <hemisphereLight args={['#efffc0', '#08110d', 1.6]} />
        <directionalLight position={[4, 6, 7]} intensity={5.8} color="#f7ffe2" castShadow />
        <pointLight position={[-4, -1, 4]} intensity={7} color="#78ffb7" distance={12} />
        <VehicleSequence />
      </Canvas>
    </div>
  )
}
