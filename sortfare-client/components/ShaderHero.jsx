'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import ShaderFallback from './ShaderFallback'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const ShaderCanvas = dynamic(() => import('./ShaderCanvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900" />
  ),
})

export default function ShaderHero() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-950">
      {/* Shader background */}
      {reducedMotion ? <ShaderFallback /> : <ShaderCanvas />}

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <span className="inline-flex items-center rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">
          Compare fares across 50+ airlines
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Find the best fare for{' '}
          <span className="bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
            every flight
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-gray-300 sm:text-lg">
          Search, compare, and rank flights across airlines by price, duration, and stops.
          When you find the one, book it directly with the airline.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/flights"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-colors hover:bg-primary-500 sm:w-auto"
          >
            Search flights
          </Link>
          <Link
            href="/signup"
            className="inline-flex w-full items-center justify-center rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5 sm:w-auto"
          >
            Create free account
          </Link>
        </div>
      </div>
    </section>
  )
}
