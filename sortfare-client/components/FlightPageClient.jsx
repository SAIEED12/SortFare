'use client'
import { useFlights } from '@/hooks/useFlights'
import FlightFilters from '@/components/FlightFilters'
import FlightList from '@/components/FlightList'

export default function FlightPageClient({ flights }) {
  const { filters, updateFilter, filteredFlights, uniqueAirlines } = useFlights(flights)

  return (
    <div>
      <FlightFilters
        filters={filters}
        updateFilter={updateFilter}
        uniqueAirlines={uniqueAirlines}
      />

      <p
        className="text-sm text-gray-500 mt-4 mb-4"
        aria-live="polite"
        role="status"
      >
        {filteredFlights.length}{' '}
        {filteredFlights.length === 1 ? 'result' : 'results'} found
      </p>

      <FlightList flights={filteredFlights} />
    </div>
  )
}
