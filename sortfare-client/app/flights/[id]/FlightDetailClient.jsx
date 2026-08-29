'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useCompare } from '@/context/CompareContext'
import { fetchBookingLinks } from '@/lib/api'

function durationLabel(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function stopLabel(stops) {
  return stops === 0 ? 'Nonstop' : stops === 1 ? '1 stop' : `${stops} stops`
}

export default function FlightDetailClient({ flight }) {
  const [loadingLinks, setLoadingLinks] = useState(false)
  const { toggleFlight, isSelected, isFull } = useCompare()
  const selected = isSelected(flight.id)
  const disabled = isFull && !selected

  const handleGetDeal = async () => {
    if (flight.bookingUrl) {
      window.open(flight.bookingUrl, '_blank')
      return
    }
    setLoadingLinks(true)
    const data = await fetchBookingLinks(flight.id)
    if (data?.booking_options?.[0]?.links?.[0]?.url) {
      window.open(data.booking_options[0].links[0].url, '_blank')
    }
    setLoadingLinks(false)
  }

  const hasSegments = flight.segments && flight.segments.length > 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/flights"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-accent-600"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to flights
      </Link>

      {/* Route header */}
      <div className="sf-card mt-6 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-ink">{flight.airline}</span>
              <span className="text-sm text-slate-500">{flight.flightNumber}</span>
            </div>
            <button
              type="button"
              onClick={() => toggleFlight(flight)}
              disabled={disabled}
              className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                selected
                  ? 'border-accent-500 bg-accent-50 text-accent-700'
                  : 'border-line bg-surface text-slate-600 hover:border-accent-300 hover:text-accent-600'
              }`}
            >
              {selected ? (
                <span className="inline-flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  In compare
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                  Add to compare
                </span>
              )}
            </button>
          </div>

          {/* Big route display */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="font-mono text-4xl font-bold leading-none text-ink">{flight.departure.code}</div>
              <div className="mt-2 font-mono text-2xl font-bold text-accent-600">{flight.departure.time}</div>
            </div>

            <div className="flex flex-1 flex-col items-center gap-2 px-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stopLabel(flight.stops)}
              </span>
              <div className="relative w-full max-w-[200px]">
                <div className="h-px w-full bg-line" />
                <div className="absolute right-0 -top-[3px] h-1.5 w-1.5 rounded-full bg-accent-500" />
                <div className="absolute left-0 -top-[3px] h-1.5 w-1.5 rounded-full bg-ink" />
                <div className="absolute left-1/2 -top-[10px] -translate-x-1/2 text-accent-500">
                  <svg className="h-5 w-5 -rotate-45" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" />
                  </svg>
                </div>
              </div>
              <span className="text-sm font-medium text-slate-500">{durationLabel(flight.duration)}</span>
            </div>

            <div className="text-center">
              <div className="font-mono text-4xl font-bold leading-none text-ink">{flight.arrival.code}</div>
              <div className="mt-2 font-mono text-2xl font-bold text-accent-600">{flight.arrival.time}</div>
            </div>
          </div>
        </div>

        <div className="sf-barcode" aria-hidden="true" />
      </div>

      {/* Segment timeline */}
      {hasSegments && (
        <div className="sf-card mt-6 overflow-hidden p-6">
          <h2 className="sf-eyebrow mb-4">Itinerary</h2>
          <div className="flex flex-col">
            {flight.segments.map((seg, i) => (
              <div key={i} className="flex gap-4">
                {/* Timeline rail */}
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full border-2 border-accent-500 bg-surface" />
                  {i < flight.segments.length - 1 && (
                    <div className="w-px flex-1 bg-line" style={{ minHeight: 48 }} />
                  )}
                </div>

                {/* Segment info */}
                <div className="flex-1 pb-6">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="font-mono text-xl font-bold text-ink">{seg.departureTime}</span>
                    <span className="text-sm font-semibold text-slate-600">{seg.departureAirport}</span>
                    {seg.flightNumber && (
                      <span className="text-xs text-slate-400">{seg.flightNumber}</span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    {seg.airline && <span>{seg.airline}</span>}
                    {seg.duration && <span>· {durationLabel(seg.duration)}</span>}
                  </div>
                  {i === flight.segments.length - 1 && (
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="font-mono text-xl font-bold text-ink">{seg.arrivalTime}</span>
                      <span className="text-sm font-semibold text-slate-600">{seg.arrivalAirport}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layover info */}
      {hasSegments && flight.segments.length > 1 && (
        <div className="sf-card mt-6 overflow-hidden p-6">
          <h2 className="sf-eyebrow mb-3">Layovers</h2>
          <div className="flex flex-col gap-3">
            {flight.segments.slice(0, -1).map((seg, i) => {
              const nextSeg = flight.segments[i + 1]
              const layoverMinutes = nextSeg.departureTime && seg.arrivalTime
                ? (() => {
                    const [dh, dm] = nextSeg.departureTime.split(':').map(Number)
                    const [ah, am] = seg.arrivalTime.split(':').map(Number)
                    return (dh * 60 + dm) - (ah * 60 + am)
                  })()
                : null

              return (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-paper px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                    <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink">{seg.arrivalAirport}</div>
                    <div className="text-xs text-slate-500">
                      {layoverMinutes !== null && layoverMinutes > 0
                        ? `Layover: ${durationLabel(layoverMinutes)}`
                        : 'Connecting flight'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* No segment data fallback */}
      {!hasSegments && (
        <div className="sf-card mt-6 overflow-hidden p-6">
          <h2 className="sf-eyebrow mb-3">Route details</h2>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>{flight.departure.code}</span>
            <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <span>{flight.arrival.code}</span>
          </div>
        </div>
      )}

      {/* Price + Book */}
      <div className="sf-card mt-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Fare</div>
            <div className="mt-1 font-mono text-4xl font-bold text-accent-600">
              {flight.currency}{flight.price}
            </div>
            <div className="mt-1 text-sm text-slate-500">per person</div>
          </div>

          <div className="sf-perf hidden sm:block" aria-hidden="true" />
          <div className="block border-t-2 border-dashed border-line sm:hidden" aria-hidden="true" />

          <div className="flex items-center justify-center p-6 sm:w-64">
            <button
              type="button"
              onClick={handleGetDeal}
              disabled={loadingLinks}
              className="w-full cursor-pointer rounded-xl bg-accent-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-700 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingLinks ? 'Loading…' : 'Get deal'}
            </button>
          </div>
        </div>
        <div className="sf-barcode" aria-hidden="true" />
      </div>
    </div>
  )
}
