import { notFound } from 'next/navigation'
import { flights } from '@/data/flights'
import FlightDetailClient from './FlightDetailClient'

export default async function FlightDetailPage({ params }) {
  const { id } = await params
  const flightId = Number(id)
  const flight = flights.find((f) => f.id === flightId)

  if (!flight) {
    notFound()
  }

  return <FlightDetailClient flight={flight} />
}
