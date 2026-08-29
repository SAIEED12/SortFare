'use client'
import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const MAX_COMPARE = 3
const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const [selectedFlights, setSelectedFlights] = useState([])

  const toggleFlight = useCallback((flight) => {
    setSelectedFlights((prev) => {
      const exists = prev.some((f) => f.id === flight.id)
      if (exists) return prev.filter((f) => f.id !== flight.id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, flight]
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedFlights([])
  }, [])

  const removeFlight = useCallback((flightId) => {
    setSelectedFlights((prev) => prev.filter((f) => f.id !== flightId))
  }, [])

  const isSelected = useCallback(
    (id) => selectedFlights.some((f) => f.id === id),
    [selectedFlights],
  )

  const isFull = selectedFlights.length >= MAX_COMPARE

  const value = useMemo(
    () => ({
      selectedFlights,
      toggleFlight,
      clearSelection,
      removeFlight,
      isSelected,
      isFull,
      count: selectedFlights.length,
      max: MAX_COMPARE,
    }),
    [selectedFlights, toggleFlight, clearSelection, removeFlight, isSelected, isFull],
  )

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within a CompareProvider')
  return ctx
}
