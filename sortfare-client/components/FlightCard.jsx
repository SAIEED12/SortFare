'use client'
import { useState } from 'react'
import Link from 'next/link'
import { fetchBookingLinks } from '@/lib/api'
import { useCompare } from '@/context/CompareContext'

export default function FlightCard({ flight, isBest = false, showCompare = true }) {
  const [loadingLinks, setLoadingLinks] = useState(false)
  const { toggleFlight, isSelected, isFull } = useCompare()
  const selected = isSelected(flight.id)
  const disabled = isFull && !selected

  const hours = Math.floor(flight.duration / 60)
  const minutes = flight.duration % 60
  const durationLabel = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  const stopLabel =
    flight.stops === 0 ? 'Nonstop' : flight.stops === 1 ? '1 stop' : `${flight.stops} stops`

  const handleGetDeal = async () => {
    // If flight has a direct booking URL (static data), use it
    if (flight.bookingUrl) {
      window.open(flight.bookingUrl, '_blank')
      return
    }

    // For live flights (Ignav), fetch booking links
    // Only attempt if ID looks like an Ignav ID (non-numeric or string format)
    const flightId = String(flight.id)
    if (flightId && !/^\d+$/.test(flightId)) {
      setLoadingLinks(true)
      try {
        const data = await fetchBookingLinks(flight.id)
        if (data?.booking_options?.[0]?.links?.[0]?.url) {
          window.open(data.booking_options[0].links[0].url, '_blank')
        }
      } catch {
        // Silently handle errors
      }
      setLoadingLinks(false)
    } else {
      // For static flights without bookingUrl, try airline website
      const airlineUrls = {
        'Delta Air Lines': 'https://www.delta.com',
        'United Airlines': 'https://www.united.com',
        'American Airlines': 'https://www.aa.com',
        'Southwest Airlines': 'https://www.southwest.com',
        'JetBlue': 'https://www.jetblue.com',
        'Alaska Airlines': 'https://www.alaskaair.com',
      }
      const url = airlineUrls[flight.airline]
      if (url) {
        window.open(url, '_blank')
      }
    }
  }

  return (
    <div className={`sf-card overflow-hidden transition-shadow ${selected ? 'ring-2 ring-accent-500' : ''}`}>
      <div className="flex flex-col sm:flex-row">
        {/* Main ticket body */}
        <div className="flex-1 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {showCompare && (
                <label className="relative flex items-center" aria-label={`Compare ${flight.airline} ${flight.flightNumber}`}>
                  <input
                    type="checkbox"
                    className="sf-compare-checkbox peer sr-only"
                    checked={selected}
                    disabled={disabled}
                    onChange={() => toggleFlight(flight)}
                  />
                  <span className="sf-compare-check" />
                </label>
              )}
              <span className="text-sm font-semibold text-ink">{flight.airline}</span>
              <span className="text-xs text-slate-500">{flight.flightNumber}</span>
            </div>
            {isBest && (
              <span className="sf-stamp">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Best fare
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="text-center min-w-[56px]">
              <div className="font-mono text-xl font-bold leading-none text-ink">{flight.departure.time}</div>
              <div className="mt-1 text-xs font-medium text-slate-500">{flight.departure.code}</div>
            </div>

            <div className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{stopLabel}</span>
              <div className="relative w-full max-w-[140px]">
                <div className="h-px w-full bg-line" />
                <div className="absolute right-0 -top-[2px] h-1.5 w-1.5 rounded-full bg-accent-500" />
                <div className="absolute left-1/2 -top-[7px] -translate-x-1/2 text-accent-500">
                  <svg className="h-3.5 w-3.5 -rotate-45" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" />
                  </svg>
                </div>
              </div>
              <span className="text-[10px] font-medium text-slate-400">{durationLabel}</span>
            </div>

            <div className="text-center min-w-[56px]">
              <div className="font-mono text-xl font-bold leading-none text-ink">{flight.arrival.time}</div>
              <div className="mt-1 text-xs font-medium text-slate-500">{flight.arrival.code}</div>
            </div>
          </div>

          {flight.stops > 0 && flight.segments && flight.segments.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
              {flight.segments.slice(0, -1).map((seg, i) => (
                <span key={i} className="inline-flex items-center gap-1">
                  <span className="font-medium text-slate-600">{seg.arrivalAirport}</span>
                  <span className="text-slate-400">layover</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Perforation (mobile = horizontal) */}
        <div className="sf-perf hidden sm:block" aria-hidden="true" />
        <div className="block border-t-2 border-dashed border-line sm:hidden" aria-hidden="true" />

        {/* Stub */}
        <div className="flex flex-row items-center justify-between gap-4 bg-paper/60 p-5 sm:w-52 sm:flex-col sm:items-stretch sm:justify-center">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Fare</div>
            <div className="font-mono text-2xl font-bold leading-none text-accent-600">
              {flight.currency} {flight.price}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:flex-col sm:items-stretch">
            <Link
              href={`/flights/${flight.id}?origin=${flight.departure.code}&destination=${flight.arrival.code}`}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-line px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-paper hover:text-accent-600"
            >
              Details
            </Link>
            <button
              onClick={handleGetDeal}
              disabled={loadingLinks}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-700 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingLinks ? 'Loading…' : 'Get deal'}
            </button>
          </div>
        </div>
      </div>

      <div className="sf-barcode" aria-hidden="true" />
    </div>
  )
}
