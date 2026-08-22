'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import GlobeScene from './GlobeScene'

function LoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
        <p className="text-sm text-gray-500">Loading 3D globe…</p>
      </div>
    </div>
  )
}

export default function GlobeCanvas() {
  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <GlobeScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
