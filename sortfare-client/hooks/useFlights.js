'use client'
import { useMemo, useState } from 'react'

export function useFlights(flights) {
  const [filters, setFilters] = useState({
    stops: 'all',
    priceMin: '',
    priceMax: '',
    airline: 'all',
    sortBy: 'price',
  })

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filteredFlights = useMemo(() => {
    let result = [...flights]

    if (filters.stops === 'nonstop') result = result.filter(f => f.stops === 0)
    else if (filters.stops === '1stop') result = result.filter(f => f.stops === 1)
    else if (filters.stops === '2plus') result = result.filter(f => f.stops >= 2)

    if (filters.priceMin) result = result.filter(f => f.price >= Number(filters.priceMin))
    if (filters.priceMax) result = result.filter(f => f.price <= Number(filters.priceMax))

    if (filters.airline && filters.airline !== 'all') {
      result = result.filter(f => f.airline === filters.airline)
    }

    switch (filters.sortBy) {
      case 'price':      result.sort((a, b) => a.price - b.price); break
      case 'duration':   result.sort((a, b) => a.duration - b.duration); break
      case 'departure':  result.sort((a, b) => a.departure.time.localeCompare(b.departure.time)); break
      case 'arrival':    result.sort((a, b) => a.arrival.time.localeCompare(b.arrival.time)); break
    }

    return result
  }, [flights, filters])

  const uniqueAirlines = useMemo(
    () => [...new Set(flights.map(f => f.airline))],
    [flights],
  )

  return { filters, updateFilter, filteredFlights, uniqueAirlines }
}
