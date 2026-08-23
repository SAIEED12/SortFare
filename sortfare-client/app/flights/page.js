import { Suspense } from 'react'
import FlightsContent from '@/components/FlightsContent'
import FlightSkeleton from '@/components/FlightSkeleton'

export default async function FlightsPage({ searchParams }) {
  const params = await searchParams
  // Bare /flights (nav click) defaults to a featured route so the page
  // always shows results instead of an empty search prompt.
  const isFeaturedSearch = !params?.origin || !params?.destination
  const origin = params?.origin ?? 'JFK'
  const destination = params?.destination ?? 'ORD'
  const date = params?.date
  const passengers = params?.passengers

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Flights from {origin} to {destination}
        {isFeaturedSearch ? (
          <span className="ml-2 inline-block align-middle rounded-full bg-primary-50 px-3 py-0.5 text-xs font-medium text-primary-700">
            Featured deals
          </span>
        ) : null}
        {date ? <span className="text-base font-normal text-gray-500 ml-2">{date}</span> : null}
        {passengers ? <span className="text-base font-normal text-gray-500 ml-2">&middot; {passengers} {Number(passengers) === 1 ? 'passenger' : 'passengers'}</span> : null}
      </h1>

      <Suspense fallback={<FlightSkeleton />}>
        <FlightsContent origin={origin} destination={destination} date={date} passengers={passengers} />
      </Suspense>
    </div>
  )
}
