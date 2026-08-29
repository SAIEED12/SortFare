'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import ShaderFallback from './ShaderFallback'
import GlobeFallback from './GlobeFallback'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { routes, airports } from '@/data/routes'

// The shader is the hero's atmosphere: it fills the whole section behind
// everything else. Its fallback doubles as the loading state so there is only
// one gradient definition to keep in sync.
const ShaderCanvas = dynamic(() => import('./ShaderCanvas'), {
  ssr: false,
  loading: () => <ShaderFallback />,
})

// The globe is the object suspended in that atmosphere, not a separate band.
const GlobeCanvas = dynamic(() => import('./GlobeCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
        <p className="text-sm text-gray-400">Loading 3D globe…</p>
      </div>
    </div>
  ),
})

// The four cheapest routes drawn on the globe, shown as boarding-pass stubs.
const stubs = [...routes].sort((a, b) => a.price - b.price).slice(0, 4)

export default function HomeHero() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section className="relative overflow-hidden bg-gray-950">
      {/* Atmosphere */}
      {reducedMotion ? <ShaderFallback /> : <ShaderCanvas />}

      {/* Contrast wash — keeps the headline legible over the moving field */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/35 to-gray-950/80"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-14 sm:pt-20 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Thesis */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent-200 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" aria-hidden="true" />
              50+ airlines, one view
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find the best fare for{' '}
              <span className="bg-gradient-to-r from-accent-300 to-accent-100 bg-clip-text text-transparent">
                every flight
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg lg:mx-0">
              Search, compare, and rank flights across airlines by price, duration, and
              stops. When you find the one, book it directly with the airline.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <Link
                href="/flights"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-gray-950/40 transition-colors hover:bg-accent-50"
              >
                Search flights
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Create free account
              </Link>
            </div>

            <p className="mt-6 text-xs text-gray-400">
              No booking fees. You pay the airline directly.
            </p>
          </div>

          {/* The object in the atmosphere */}
          <div className="relative">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/20 blur-3xl sm:h-[28rem] sm:w-[28rem]"
              aria-hidden="true"
            />
            <div
              className="relative mx-auto h-[280px] w-full max-w-[520px] sm:h-[380px] lg:h-[460px]"
              role="img"
              aria-label="Interactive 3D globe showing eight flight routes between major airports"
            >
              {reducedMotion ? <GlobeFallback /> : <GlobeCanvas showStars={false} />}
            </div>
          </div>
        </div>

        {/* Signature: the hero tears off into a boarding pass */}
        <div className="pb-14 pt-12 sm:pt-16">
          <div className="sf-card overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-stretch">
              <div className="px-5 py-4 sm:w-48 sm:shrink-0">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Live on the globe
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">
                  {routes.length} routes tracked
                </p>
                <Link
                  href="/flights"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent-600 hover:text-accent-700"
                >
                  Browse all fares
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>

              <div className="sf-perf hidden sm:block" aria-hidden="true" />
              <div className="border-t-2 border-dashed border-line sm:hidden" aria-hidden="true" />

              <ul className="grid flex-1 grid-cols-2 sm:flex sm:items-stretch">
                {stubs.map((route, i) => (
                  <li key={route.id} className="flex flex-1 items-stretch">
                    {i > 0 && (
                      <>
                        <div className="sf-perf hidden sm:block" aria-hidden="true" />
                        <div className="border-l-2 border-dashed border-line sm:hidden" aria-hidden="true" />
                      </>
                    )}
                    <div className="flex-1 bg-paper/50 px-4 py-4">
                      <div className="flex items-baseline gap-1.5 font-mono text-sm font-bold text-ink">
                        {route.from}
                        <svg className="h-3 w-3 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                        {route.to}
                      </div>
                      <p className="mt-1 truncate text-[0.7rem] text-slate-500">
                        {airports[route.to]?.name ?? route.to}
                      </p>
                      <p className="mt-2 font-mono text-lg font-bold leading-none text-accent-600">
                        ${route.price}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sf-barcode" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
