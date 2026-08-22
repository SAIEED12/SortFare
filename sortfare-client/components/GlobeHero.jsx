'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import GlobeFallback from './GlobeFallback'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const GlobeCanvas = dynamic(() => import('./GlobeCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
        <p className="text-sm text-gray-500">Loading 3D globe…</p>
      </div>
    </div>
  ),
})

export default function GlobeHero() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-primary-900 to-gray-900">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:pt-24">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">
              Compare fares across 50+ airlines
            </span>

            <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:mx-0 lg:max-w-xl">
              Find the best fare for{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                every flight
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base text-gray-300 sm:text-lg lg:mx-0">
              Search, compare, and rank flights across airlines by price, duration, and stops.
              When you find the one, book it directly with the airline.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
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

          <div className="relative h-[300px] w-full flex-shrink-0 sm:h-[400px] lg:h-[480px] lg:w-[480px]" role="img" aria-label="Interactive 3D globe showing flight routes between airports">
            {reducedMotion ? (
              <GlobeFallback />
            ) : (
              <GlobeCanvas />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
