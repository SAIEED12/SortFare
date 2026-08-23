'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { fragmentShader, vertexShader } from './shaders/fragment.glsl'

export default function ShaderPlane({ mouse }) {
  const materialRef = useRef()

  // Create uniforms once, then update refs each frame
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [],
  )

  useFrame(({ clock, size, gl }) => {
    if (!materialRef.current) return

    // Pause animation when tab is hidden
    if (!document.hidden) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime()
    }

    materialRef.current.uniforms.u_resolution.value.set(size.width, size.height)
    materialRef.current.uniforms.u_mouse.value.set(mouse.current.x, mouse.current.y)
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  )
}
