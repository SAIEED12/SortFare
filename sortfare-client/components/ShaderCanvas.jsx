'use client'

import { useRef, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import ShaderPlane from './ShaderPlane'

export default function ShaderCanvas() {
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const containerRef = useRef(null)

  const handlePointerMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    // Normalize to 0–1 range, flip Y so bottom=0 top=1
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1.0 - (e.clientY - rect.top) / rect.height,
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onPointerMove={handlePointerMove}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ShaderPlane mouse={mouseRef} />
      </Canvas>
    </div>
  )
}
