import Link from 'next/link'
import { Card } from '@heroui/react'
import SearchForm from '@/components/SearchForm'
import FlightCard from '@/components/FlightCard'
import { flights } from '@/data/flights'

const stats = [
  { value: '50+', label: 'Airlines compared' },
  { value: '100k+', label: 'Fares scanned daily' },
  { value: '$0', label: 'Booking fees, ever' },
]

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
    title: 'Save flights',
    description: 'Keep the shortlist you like and compare it anytime from your saved flights.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
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
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/3 h-64 w-64 rounded-full bg-primary-200/40 blur-3xl" />

        <svg
          className="pointer-events-none absolute right-8 top-16 hidden w-64 text-primary-200 lg:block"
          viewBox="0 0 260 180"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 156C60 138 92 64 152 44s104 4 104 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
          <circle cx="8" cy="156" r="4" fill="currentColor" />
          <circle cx="256" cy="48" r="4" fill="currentColor" />
          <path
            d="M176 22l58 14-24 30-34-10-14 12-22-6 36-40z"
            fill="currentColor"
            transform="rotate(-8 176 22)"
          />
        </svg>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            Compare fares across 50+ airlines
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Find the best fare for{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              every flight
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-gray-500 sm:text-lg">
            Search, compare, and rank flights across airlines by price, duration, and stops.
            When you find the one, book it directly with the airline.
          </p>

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-primary-100/50 sm:p-6">
            <SearchForm />
          </div>

          <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-bold text-gray-900">{stat.value}</dd>
                <dd className="mt-1 text-sm text-gray-500">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20" aria-labelledby="how-it-works">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            How it works
          </p>
          <h2 id="how-it-works" className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            From search to takeoff in three steps
          </h2>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                {step.icon}
              </div>
              <span className="mt-4 block text-xs font-semibold text-primary-400">
                Step {step.number}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-gray-50 py-20" aria-labelledby="features">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              Features
            </p>
            <h2 id="features" className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to pick the right flight
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="w-full">
                <Card.Content className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.description}</p>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20" aria-labelledby="popular-deals">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              Popular deals
            </p>
            <h2 id="popular-deals" className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trending fares right now
            </h2>
          </div>
          <Link
            href="/flights"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            Browse all flights
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 space-y-4">
          {popularFlights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your next flight is one search away
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-primary-100 sm:text-base">
            Create a free account to save flights and keep your shortlist handy for when you are ready to book.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 sm:w-auto"
            >
              Create free account
            </Link>
            <Link
              href="/flights"
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Search flights
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
