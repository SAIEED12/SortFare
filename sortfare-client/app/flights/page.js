import { Suspense } from 'react'
import { fetchFlights } from '@/lib/api'
import FlightPageClient from '@/components/FlightPageClient'
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
          <h2 className="text-lg font-semibold text-gray-600">Search for flights</h2>
          <p className="text-sm text-gray-400 mt-1">
            Enter your origin, destination, and travel date to see results.
          </p>
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

async function FlightsContent({ origin, destination, date, passengers }) {
  let flights
  try {
    flights = await fetchFlights({ origin, destination, date, passengers })
  } catch {
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <h2 className="text-lg font-semibold text-red-600">Failed to load flights</h2>
        <p className="text-sm text-gray-400 mt-1">
          Unable to fetch flight data. Please try again later.
        </p>
      </div>
    )
  }

  if (!flights || flights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-600">No flights available</h2>
        <p className="text-sm text-gray-400 mt-1">
          No flights found for this route. Try different dates or airports.
        </p>
      </div>
    )
  }

  return <FlightPageClient flights={flights} />
}
