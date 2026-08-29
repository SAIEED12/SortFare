'use client'

import { useRef, useMemo, useState, useCallback, Suspense } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Html } from '@react-three/drei'
import FlightArc from './FlightArc'
import AnimatedDot from './AnimatedDot'
import { routes, airports } from '@/data/routes'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

function latLngToVector3(lat, lng, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

function EarthSphere() {
  const texture = useLoader(THREE.TextureLoader, '/textures/earth-day.jpg')
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

const STAR_POSITIONS = (() => {
  const pos = new Float32Array(2000 * 3)
  const seededRandom = (i) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
  }
  for (let i = 0; i < 2000; i++) {
    const r = 5 + seededRandom(i) * 15
    const theta = seededRandom(i + 1000) * Math.PI * 2
    const phi = Math.acos(2 * seededRandom(i + 2000) - 1)
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)
  }
  return pos
})()

function Stars() {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2000}
          array={STAR_POSITIONS}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.02} sizeAttenuation transparent opacity={0.6} />
    </points>
  )
}

function RouteTooltip({ fromCode, toCode, airline, price, position }) {
  const from = airports[fromCode]
  const to = airports[toCode]
  return (
    <Html center position={position} style={{ pointerEvents: 'none' }}>
      <div className="rounded-lg border border-white/10 bg-gray-900/90 px-3 py-2 text-xs text-white shadow-xl backdrop-blur-sm whitespace-nowrap">
        <div className="font-semibold">{airline}</div>
        <div className="text-gray-300">{fromCode} → {toCode}</div>
        <div className="mt-0.5 text-primary-400 font-bold">${price}</div>
      </div>
    </Html>
  )
}

function InteractiveArc({ route, onHover, onUnhover, hovered }) {
  const from = airports[route.from]
  const to = airports[route.to]

  const midPoint = useMemo(() => {
    const phi = (90 - (from.lat + to.lat) / 2) * (Math.PI / 180)
    const theta = ((from.lng + to.lng) / 2 + 180) * (Math.PI / 180)
    return new THREE.Vector3(
      -1.15 * Math.sin(phi) * Math.cos(theta),
      1.15 * Math.cos(phi),
      1.15 * Math.sin(phi) * Math.sin(theta),
    )
  }, [from.lat, from.lng, to.lat, to.lng])

  return (
    <group
      onPointerEnter={(e) => { e.stopPropagation(); onHover(route.id) }}
      onPointerLeave={(e) => { e.stopPropagation(); onUnhover() }}
    >
      <FlightArc
        fromCode={route.from}
        toCode={route.to}
        color={hovered ? '#60a5fa' : route.color}
        opacity={hovered ? 1 : 0.6}
      />
      {hovered && (
        <RouteTooltip
          fromCode={route.from}
          toCode={route.to}
          airline={route.airline}
          price={route.price}
          position={midPoint}
        />
      )}
    </group>
  )
}

export default function GlobeScene({ showStars = true }) {
  const reducedMotion = usePrefersReducedMotion()
  const [hoveredRoute, setHoveredRoute] = useState(null)
  const controlsRef = useRef()

  const handleHover = useCallback((id) => setHoveredRoute(id), [])
  const handleUnhover = useCallback(() => setHoveredRoute(null), [])

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#4488ff" />

      {showStars && <Stars />}

      <Suspense fallback={null}>
        <EarthSphere />
      </Suspense>

      {routes.map((route) => (
        <InteractiveArc
          key={route.id}
          route={route}
          onHover={handleHover}
          onUnhover={handleUnhover}
          hovered={hoveredRoute === route.id}
        />
      ))}

      {!reducedMotion &&
        routes.map((route, i) => (
          <AnimatedDot
            key={`dot-${route.id}`}
            fromCode={route.from}
            toCode={route.to}
            color="#ffffff"
            speed={0.25}
            delay={i * 0.12}
          />
        ))}

      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        minDistance={1.5}
        maxDistance={5}
        autoRotate={!reducedMotion && !hoveredRoute}
        autoRotateSpeed={0.4}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
      />
    </>
  )
}
