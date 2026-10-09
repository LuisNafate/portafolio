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

const graphite = new THREE.Color('#171c19')
const silver = new THREE.Color('#c7ccc6')
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const smooth = (value) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}

function prepareScene(source) {
  const scene = source.clone(true)
  scene.traverse((child) => {
    if (!child.isMesh) return
    child.castShadow = true
    child.receiveShadow = true
    const originals = Array.isArray(child.material) ? child.material : [child.material]
    const materials = originals.map((original) => {
      const material = original.clone()
      if (material.color) {
        const luminance = material.color.r * 0.2126 + material.color.g * 0.7152 + material.color.b * 0.0722
        material.color.lerp(luminance > 0.56 ? silver : graphite, 0.82)
      }
      material.metalness = Math.max(material.metalness || 0, 0.42)
      material.roughness = Math.min(Math.max(material.roughness || 0.3, 0.24), 0.5)
      material.envMapIntensity = 1.15
      material.needsUpdate = true
      return material
    })
    child.material = Array.isArray(child.material) ? materials : materials[0]
  })
  return scene
}

function FormulaModel({ modelRef }) {
  const gltf = useLoader(GLTFLoader, CAR_URL)
  const scene = useMemo(() => prepareScene(gltf.scene), [gltf.scene])
  return (
    <group ref={modelRef} scale={0.76} rotation={[0.06, 0.94, -0.025]}>
      <primitive object={scene} />
      <mesh position={[0, 0.04, -3.2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.018, 5.8]} />
        <meshBasicMaterial color="#d9ff43" transparent opacity={0.38} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

function RocketModel({ modelRef }) {
  const models = useLoader(GLTFLoader, ROCKET_URLS)
  const scenes = useMemo(() => models.map((model) => prepareScene(model.scene)), [models])
  return (
    <group ref={modelRef} scale={0.082} rotation={[0.025, -0.2, -0.025]}>
      <primitive object={scenes[0]} />
      <primitive object={scenes[1]} position={[0, 24, 0]} />
      <primitive object={scenes[2]} position={[0, 25.6, 0]} />
      <primitive object={scenes[3]} position={[0, 37.9, 0]} />
      <mesh position={[0, -7.2, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[1.2, 14.5, 24, 1, true]} />
        <meshBasicMaterial color="#d9ff43" transparent opacity={0.19} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

function PlaneModel({ modelRef }) {
  const gltf = useLoader(GLTFLoader, PLANE_URL)
  const scene = useMemo(() => prepareScene(gltf.scene), [gltf.scene])
  return (
    <group ref={modelRef} scale={0.092}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={scene} />
        {[-5.7, 5.7].map((offset) => (
          <mesh key={offset} position={[offset, 0.05, -31]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 36]} />
            <meshBasicMaterial color="#d9ff43" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function TrackBackdrop({ backdropRef }) {
  return (
    <group ref={backdropRef} position={[1.2, -0.45, -2.7]} rotation={[Math.PI / 2, 0, -0.16]}>
      <gridHelper args={[16, 32, '#d9ff43', '#38403b']} />
      {[-1.48, 1.48].map((x) => (
        <mesh key={x} position={[x, 0.012, 0]}>
          <boxGeometry args={[0.025, 0.015, 16]} />
          <meshBasicMaterial color="#d9ff43" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function OrbitBackdrop({ backdropRef }) {
  return (
    <group ref={backdropRef} position={[-0.45, 0.25, -2.5]} rotation={[0.12, -0.18, 0]}>
      {[1.55, 2.3, 3.15].map((radius, index) => (
        <mesh key={radius} rotation={[0, 0, index * 0.38]}>
          <torusGeometry args={[radius, index === 1 ? 0.011 : 0.006, 8, 110]} />
          <meshBasicMaterial color={index === 1 ? '#d9ff43' : '#8e9690'} transparent opacity={index === 1 ? 0.4 : 0.22} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0]}><circleGeometry args={[0.045, 18]} /><meshBasicMaterial color="#d9ff43" /></mesh>
    </group>
  )
}

function FlightBackdrop({ backdropRef }) {
  const markers = useMemo(() => [[-3.2, -1.55], [-1.1, 1.35], [1.4, -1.1], [3.35, 1.55]], [])
  return (
    <group ref={backdropRef} position={[0, 0, -2.8]}>
      {[-1.55, 1.55].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <planeGeometry args={[14, 0.012]} />
          <meshBasicMaterial color="#7b837d" transparent opacity={0.32} />
        </mesh>
      ))}
      {markers.map(([x, y], index) => (
        <group key={x} position={[x, y, 0]}>
          <mesh><ringGeometry args={[0.07, 0.085, 20]} /><meshBasicMaterial color={index === 2 ? '#d9ff43' : '#8e9690'} transparent opacity={0.65} /></mesh>
          <mesh position={[0.3, 0, 0]}><planeGeometry args={[0.5, 0.008]} /><meshBasicMaterial color="#6f7771" transparent opacity={0.4} /></mesh>
        </group>
      ))}
    </group>
  )
}

function setBackdropOpacity(group, opacity) {
  if (!group) return
  group.visible = opacity > 0.01
  group.traverse((child) => {
    if (!child.material) return
    if (child.userData.baseOpacity === undefined) child.userData.baseOpacity = child.material.opacity
    child.material.opacity = opacity * child.userData.baseOpacity
  })
}

function SceneSequence() {
  const car = useRef()
  const rocket = useRef()
  const plane = useRef()
  const track = useRef()
  const orbit = useRef()
  const flight = useRef()
  const motion = useRef({ unit: 0, x: 0, y: 0 })

  useFrame((state, delta) => {
    if (!car.current || !rocket.current || !plane.current) return
    const targetUnit = scrollY / Math.max(1, innerHeight)
    const frameDelta = Math.min(delta, 0.05)
    motion.current.unit = THREE.MathUtils.damp(motion.current.unit, targetUnit, 6.5, frameDelta)
    motion.current.x = THREE.MathUtils.damp(motion.current.x, state.pointer.x, 4.5, frameDelta)
    motion.current.y = THREE.MathUtils.damp(motion.current.y, state.pointer.y, 4.5, frameDelta)

    const unit = motion.current.unit
    const time = state.clock.elapsedTime
    const pointerX = motion.current.x
    const pointerY = motion.current.y

    const carExit = smooth((unit - 0.94) / 0.55)
    car.current.position.x = THREE.MathUtils.lerp(1.25, 8.2, carExit) + pointerX * 0.1
    car.current.position.y = -0.56 + Math.sin(time * 0.7) * 0.018 + pointerY * 0.045
    car.current.position.z = THREE.MathUtils.lerp(0.15, -0.85, carExit)
    car.current.rotation.y = 0.94 - carExit * 0.08

    const rocketIn = smooth((unit - 1.02) / 0.55)
    const rocketOut = smooth((unit - 1.94) / 0.42)
    rocket.current.position.x = -0.45 + pointerX * 0.065
    rocket.current.position.y = THREE.MathUtils.lerp(-7.1, -1.78, rocketIn) + rocketOut * 8.2 + Math.sin(time * 0.55) * 0.025
    rocket.current.position.z = -0.2
    rocket.current.rotation.y += frameDelta * 0.024

    const planeIn = smooth((unit - 1.96) / 0.42)
    const planeOut = smooth((unit - 2.88) / 0.42)
    plane.current.position.x = THREE.MathUtils.lerp(-8.4, 0.25, planeIn) + planeOut * 8.8
    plane.current.position.y = 0.1 + Math.sin(time * 0.32) * 0.035 + pointerY * 0.045
    plane.current.position.z = THREE.MathUtils.lerp(-0.95, 0.15, planeIn) - planeOut * 0.8
    plane.current.rotation.z = Math.PI / 2 + Math.sin(time * 0.28) * 0.018

    const trackOpacity = 0.28 * (1 - smooth((unit - 1.05) / 0.42))
    const orbitOpacity = 0.34 * smooth((unit - 1.05) / 0.4) * (1 - smooth((unit - 2.08) / 0.34))
    const flightOpacity = 0.3 * smooth((unit - 2.02) / 0.34) * (1 - smooth((unit - 3.05) / 0.32))
    setBackdropOpacity(track.current, trackOpacity)
    setBackdropOpacity(orbit.current, orbitOpacity)
    setBackdropOpacity(flight.current, flightOpacity)
  })

  return (
    <>
      <TrackBackdrop backdropRef={track} />
      <OrbitBackdrop backdropRef={orbit} />
      <FlightBackdrop backdropRef={flight} />
      <FormulaModel modelRef={car} />
      <RocketModel modelRef={rocket} />
      <PlaneModel modelRef={plane} />
    </>
  )
}

useLoader.preload(GLTFLoader, CAR_URL)
useLoader.preload(GLTFLoader, PLANE_URL)
ROCKET_URLS.forEach((url) => useLoader.preload(GLTFLoader, url))

export default function Experience() {
  return (
    <div className="experience" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 39 }}
        dpr={[1, 1.25]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.9
        }}
      >
        <fog attach="fog" args={['#070909', 7.4, 13]} />
        <ambientLight intensity={0.72} />
        <hemisphereLight args={['#f0f4eb', '#070a08', 1.25]} />
        <directionalLight position={[4, 6, 7]} intensity={4.2} color="#f7ffe2" />
        <pointLight position={[-4, -1, 4]} intensity={4.5} color="#a3ffc5" distance={11} />
        <SceneSequence />
      </Canvas>
    </div>
  )
}
