'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { airports } from '@/data/routes'

function latLngToVector3(lat, lng, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

function createArcPoints(startLat, startLng, endLat, endLng, numPoints = 50, arcHeight = 0.25) {
  const start = latLngToVector3(startLat, startLng, 1)
  const end = latLngToVector3(endLat, endLng, 1)
  const points = []
  const distance = start.distanceTo(end)
  const height = Math.min(arcHeight, distance * 0.3)

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints
    const point = new THREE.Vector3().lerpVectors(start, end, t)
    const elevation = Math.sin(Math.PI * t) * height
    point.normalize().multiplyScalar(1 + elevation)
    points.push(point)
  }
  return points
}

export default function AnimatedDot({ fromCode, toCode, color = '#ffffff', speed = 0.3, delay = 0 }) {
  const ref = useRef()
  const from = airports[fromCode]
  const to = airports[toCode]

  const curve = useMemo(() => {
    const points = createArcPoints(from.lat, from.lng, to.lat, to.lng, 50, 0.25)
    return new THREE.CatmullRomCurve3(points)
  }, [from, to])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const elapsed = clock.getElapsedTime()
    const t = ((elapsed * speed + delay) % 1)
    const pos = curve.getPointAt(t)
    ref.current.position.copy(pos)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.012, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}
