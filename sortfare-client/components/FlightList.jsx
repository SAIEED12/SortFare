'use client'
import FlightCard from '@/components/FlightCard'

export default function FlightList({ flights }) {
  if (flights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h3 className="text-lg font-semibold text-gray-600">No matching flights</h3>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters to see more results.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  )
}
