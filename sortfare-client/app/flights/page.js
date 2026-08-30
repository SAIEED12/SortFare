import { Suspense } from 'react'
import FlightsContent from '@/components/FlightsContent'
import FeaturedRoutes from '@/components/FeaturedRoutes'
import FlightSkeleton from '@/components/FlightSkeleton'
import CompareBar from '@/components/CompareBar'

export default async function FlightsPage({ searchParams }) {
  const params = await searchParams
  const origin = params?.origin
  const destination = params?.destination
  const date = params?.date
  const returnDate = params?.returnDate
  const passengers = params?.passengers

  // Without a complete route we have nothing to search, so the page shows
  // featured deals across several routes instead of one hardcoded pair.
  const hasSearch = Boolean(origin && destination)

  if (!hasSearch) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">
          Featured routes
          <span className="ml-2 inline-block align-middle rounded-full bg-primary-50 px-3 py-0.5 text-xs font-medium text-primary-700">
            Featured deals
          </span>
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          The cheapest fares we found on our most popular routes. Search above for your own.
        </p>

        <Suspense fallback={<FlightSkeleton />}>
          <FeaturedRoutes origin={origin} destination={destination} />
        </Suspense>

        <CompareBar />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Flights from {origin} to {destination}
        {date ? <span className="text-base font-normal text-gray-500 ml-2">{date}</span> : null}
        {returnDate ? <span className="text-base font-normal text-gray-500 ml-2">→ {returnDate}</span> : null}
        {passengers ? <span className="text-base font-normal text-gray-500 ml-2">&middot; {passengers} {Number(passengers) === 1 ? 'passenger' : 'passengers'}</span> : null}
      </h1>

      <Suspense fallback={<FlightSkeleton />}>
        <FlightsContent origin={origin} destination={destination} date={date} returnDate={returnDate} passengers={passengers} />
      </Suspense>
    </div>
  )
}
