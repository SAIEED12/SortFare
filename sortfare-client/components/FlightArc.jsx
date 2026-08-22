'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
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

export default function FlightArc({ fromCode, toCode, color = '#00ccff', opacity = 0.7 }) {
  const from = airports[fromCode]
  const to = airports[toCode]

  const points = useMemo(
    () => createArcPoints(from.lat, from.lng, to.lat, to.lng, 50, 0.25),
    [from, to],
  )

  return <Line points={points} color={color} lineWidth={1.5} transparent opacity={opacity} />
}
