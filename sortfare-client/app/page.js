import Link from 'next/link'
import FlightCard from '@/components/FlightCard'
import HomeHero from '@/components/HomeHero'
import { flights } from '@/data/flights'

const steps = [
  {
    number: '01',
    title: 'Search your route',
    description:
      'Enter your origin, destination, date, and travelers. SortFare pulls options from across airlines in one view.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Compare & rank',
    description:
      'Sort results by price, duration, or departure time. Filter by airline and stops to zero in on the right fit.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 4v16a2 2 0 002 2h14a2 2 0 002-2V4M3 4h18M7 8h10M7 12h6" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Book with the airline',
    description:
      'Head straight to the airline to complete your purchase — no markup, no hidden fees, no middleman.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    ),
  },
]

const features = [
  {
    title: 'Rank by what matters',
    description: 'Sort every option by price, duration, departure, or arrival time in a single tap.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h6v-6H3v6zm0 7.5h6v-6H3v6zm12-15h6v-6h-6v6zm0 7.5h6v-6h-6v6z" />
      </svg>
    ),
  },
  {
    title: 'Live airline links',
    description: 'One click takes you to the airline site to complete your purchase at the listed fare.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
  {
    title: 'Ask the assistant',
    description: 'Describe the trip in plain language and let the assistant search and compare for you.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0C7.418 8.05 6.75 8.907 6.75 9.882v4.286c0 .837.493 1.58 1.229 1.905m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: 'No booking fees',
    description: 'You pay the airline directly. Compare freely without paying us a cent.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
]

const popularFlights = [...flights].sort((a, b) => a.price - b.price).slice(0, 3)

export default function Home() {
  return (
    <>
      <HomeHero />

      <section
        className="mx-auto max-w-7xl px-4 py-20 sm:py-24"
        aria-labelledby="how-it-works"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}
      >
        <div className="max-w-2xl">
          <p className="sf-eyebrow">How it works</p>
          <h2 id="how-it-works" className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            From search to takeoff in three steps
          </h2>
        </div>

        {/* An ordered list because the steps genuinely happen in this order. */}
        <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="relative border-t border-line pt-6">
              <span
                className="absolute -top-px left-0 h-px w-12 bg-accent-500"
                aria-hidden="true"
              />
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-accent-600">
                  {step.number}
                </span>
                <span className="text-primary-400">{step.icon}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="border-y border-line bg-surface py-20 sm:py-24"
        aria-labelledby="features"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-2xl">
            <p className="sf-eyebrow">Features</p>
            <h2 id="features" className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Everything you need to pick the right flight
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-line bg-paper/40 p-6 transition-colors hover:border-accent-200 hover:bg-accent-50/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-accent-600 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 py-20 sm:py-24"
        aria-labelledby="popular-deals"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="sf-eyebrow">Popular deals</p>
            <h2 id="popular-deals" className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Trending fares right now
            </h2>
          </div>
          <Link
            href="/flights"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700"
          >
            Browse all flights
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 space-y-4">
          {popularFlights.map((flight, i) => (
            <FlightCard key={flight.id} flight={flight} isBest={i === 0} />
          ))}
        </div>
      </section>

      <section className="px-4 pb-20" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 300px' }}>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary-900 px-6 py-16 text-center sm:px-16">
          <div
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent-500/25 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-accent-400/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your next flight is one search away
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-primary-100 sm:text-base">
              Create a free account to keep your details handy, or jump straight into the
              fares — no account needed to search.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-900 transition-colors hover:bg-accent-50 sm:w-auto"
              >
                Create free account
              </Link>
              <Link
                href="/flights"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                Search flights
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
