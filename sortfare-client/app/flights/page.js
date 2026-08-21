import { Suspense } from 'react'
import Link from 'next/link'
import { fetchFlights } from '@/lib/api'
import FlightsContent from '@/components/FlightsContent'
import FlightSkeleton from '@/components/FlightSkeleton'

export default async function FlightsPage({ searchParams }) {
  const params = await searchParams
  const origin = params?.origin
  const destination = params?.destination
  const date = params?.date
  const passengers = params?.passengers

  if (!origin || !destination) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Flights</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 mb-4">
            <svg className="h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-600">Search for flights</h2>
          <p className="text-sm text-gray-400 mt-1 max-w-sm">
            Enter your origin, destination, and travel date to compare prices across airlines.
          </p>
          <Link
            href="/"
            className="mt-4 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            Start a search
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Flights from {origin} to {destination}
        {date ? <span className="text-base font-normal text-gray-500 ml-2">{date}</span> : null}
        {passengers ? <span className="text-base font-normal text-gray-500 ml-2">&middot; {passengers} {Number(passengers) === 1 ? 'passenger' : 'passengers'}</span> : null}
      </h1>

      <Suspense fallback={<FlightSkeleton />}>
        <FlightsContent origin={origin} destination={destination} date={date} passengers={passengers} />
      </Suspense>
    </div>
  )
}
