import { notFound } from 'next/navigation'
import { flights } from '@/data/flights'
import FlightDetailClient from './FlightDetailClient'

async function getFlight(id, searchParams) {
  const flightId = Number(id)
  
  // First try static data
  const staticFlight = flights.find((f) => f.id === flightId)
  if (staticFlight) return staticFlight

  // Try fetching from API if not static (for Ignav IDs)
  // Pass origin/destination so the API can re-run the Ignav search
  try {
    const baseUrl = process.env.NEXT_APP_URL || 'http://localhost:3000'
    const params = new URLSearchParams({ id })
    if (searchParams.origin) params.set('origin', searchParams.origin)
    if (searchParams.destination) params.set('destination', searchParams.destination)
    if (searchParams.date) params.set('departureDate', searchParams.date)
    if (searchParams.returnDate) params.set('returnDate', searchParams.returnDate)
    if (searchParams.passengers) params.set('adults', searchParams.passengers)
    
    const res = await fetch(`${baseUrl}/api/flights?${params.toString()}`, {
      cache: 'no-store',
    })
    
    if (res.ok) {
      const data = await res.json()
      if (data.flights && data.flights.length > 0) {
        return data.flights.find((f) => String(f.id) === String(id))
      }
    }
  } catch {
    // Fall through to notFound
  }

  return null
}

export default async function FlightDetailPage({ params, searchParams }) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const flight = await getFlight(id, resolvedSearchParams || {})

  if (!flight) {
    notFound()
  }

  return <FlightDetailClient flight={flight} />
}
