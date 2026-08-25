'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { fetchFlights } from '@/lib/api'
import FlightPageClient from '@/components/FlightPageClient'
import FlightSkeleton from '@/components/FlightSkeleton'
import SampleDataBanner from '@/components/SampleDataBanner'

function ErrorState({ error, onRetry, origin, destination }) {
  const isNetwork =
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('NetworkError') ||
    error?.name === 'TypeError'

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 mb-4">
        <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-600">
        {isNetwork ? 'Unable to connect' : 'Failed to load flights'}
      </h2>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">
        {isNetwork
          ? 'Check your internet connection and try again.'
          : `Unable to fetch flight data for ${origin} → ${destination}. Please try again.`}
      </p>
      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 active:scale-[0.98]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-neutral-50"
        >
          New search
        </Link>
      </div>
    </div>
  )
}

function EmptyState({ origin, destination }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 mb-4">
        <svg className="h-7 w-7 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-600">No flights found</h2>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">
        No flights are currently available for {origin} → {destination}.
        Try different dates or airports.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
      >
        Try a different route
      </Link>
    </div>
  )
}

export default function FlightsContent({ origin, destination, date, returnDate, passengers }) {
  const [flights, setFlights] = useState(null)
  const [isSample, setIsSample] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadFlights = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFlights({ origin, destination, date, returnDate, passengers })
      setFlights(result.flights)
      setIsSample(result.source === 'sample')
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [origin, destination, date, returnDate, passengers])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchFlights({ origin, destination, date, returnDate, passengers })
        if (!cancelled) {
          setFlights(result.flights)
          setIsSample(result.source === 'sample')
        }
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [origin, destination, date, returnDate, passengers])

  if (loading) {
    return <FlightSkeleton />
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadFlights} origin={origin} destination={destination} />
  }

  if (flights && flights.length === 0) {
    return <EmptyState origin={origin} destination={destination} />
  }

  if (flights) {
    return (
      <>
        {isSample ? <SampleDataBanner /> : null}
        <FlightPageClient flights={flights} />
      </>
    )
  }

  return <FlightSkeleton />
}
