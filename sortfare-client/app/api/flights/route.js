import { NextResponse } from 'next/server'
import { searchLiveFlights } from '@/lib/flights-server'
import { flights } from '@/data/flights'

const CODE_RE = /^[A-Za-z]{3}$/

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const date = searchParams.get('departureDate')
  const returnDate = searchParams.get('returnDate')
  const passengers = searchParams.get('adults')
  const id = searchParams.get('id')

  // If ID is provided, try to find that specific flight
  if (id) {
    const flightId = Number(id)
    const staticFlight = flights.find((f) => f.id === flightId)
    if (staticFlight) {
      return NextResponse.json({ flights: [staticFlight], source: 'sample' })
    }
    // For Ignav IDs, search and filter
    if (origin && destination) {
      const result = await searchLiveFlights({ origin, destination, date, returnDate, passengers })
      const found = result.flights.find((f) => String(f.id) === String(id))
      if (found) {
        return NextResponse.json({ flights: [found], source: result.source })
      }
    }
    return NextResponse.json({ flights: [], source: 'none' })
  }

  if (origin && !CODE_RE.test(origin)) {
    return NextResponse.json({ error: 'Invalid origin code' }, { status: 400 })
  }
  if (destination && !CODE_RE.test(destination)) {
    return NextResponse.json({ error: 'Invalid destination code' }, { status: 400 })
  }

  const result = await searchLiveFlights({
    origin,
    destination,
    date,
    returnDate,
    passengers,
  })

  return NextResponse.json(result)
}
