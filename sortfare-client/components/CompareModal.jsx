'use client'
import { useEffect, useRef, useCallback } from 'react'
import { useCompare } from '@/context/CompareContext'
import { fetchBookingLinks } from '@/lib/api'
import { useState } from 'react'

function durationLabel(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function stopLabel(stops) {
  return stops === 0 ? 'Nonstop' : stops === 1 ? '1 stop' : `${stops} stops`
}

function BestBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-best-50 px-1.5 py-0.5 text-[10px] font-bold text-best-700">
      <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Best
    </span>
  )
}

function SegmentTimeline({ segments }) {
  if (!segments || segments.length === 0) return null

  return (
    <div className="mt-3 flex flex-col gap-0">
      {segments.map((seg, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-accent-500 bg-surface" />
            {i < segments.length - 1 && <div className="w-px flex-1 bg-line" style={{ minHeight: 24 }} />}
          </div>
          <div className="flex-1 pb-3">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-bold text-ink">{seg.departureTime}</span>
              <span className="text-xs font-medium text-slate-500">{seg.departureAirport}</span>
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400">
              {seg.flightNumber && <span>{seg.flightNumber}</span>}
              {seg.duration && <span> · {durationLabel(seg.duration)}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CompareModal({ open, onClose }) {
  const { selectedFlights, removeFlight } = useCompare()
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement
      dialogRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  if (!open || selectedFlights.length === 0) return null

  const prices = selectedFlights.map((f) => f.price)
  const durations = selectedFlights.map((f) => f.duration)
  const stopsList = selectedFlights.map((f) => f.stops)
  const minPrice = Math.min(...prices)
  const minDuration = Math.min(...durations)
  const minStops = Math.min(...stopsList)

  const rows = [
    {
      label: 'Airline',
      render: (f) => (
        <div>
          <div className="font-semibold text-ink">{f.airline}</div>
          <div className="text-xs text-slate-500">{f.flightNumber}</div>
        </div>
      ),
    },
    {
      label: 'Price',
      render: (f) => (
        <div className="font-mono text-lg font-bold text-ink">
          {f.currency}{f.price}
          {f.price === minPrice && <BestBadge />}
        </div>
      ),
    },
    {
      label: 'Duration',
      render: (f) => (
        <div className="font-mono text-sm font-semibold text-ink">
          {durationLabel(f.duration)}
          {f.duration === minDuration && <BestBadge />}
        </div>
      ),
    },
    {
      label: 'Departure',
      render: (f) => (
        <span className="font-mono text-sm font-bold text-ink">{f.departure.time}</span>
      ),
    },
    {
      label: 'Arrival',
      render: (f) => (
        <span className="font-mono text-sm font-bold text-ink">{f.arrival.time}</span>
      ),
    },
    {
      label: 'Stops',
      render: (f) => (
        <div>
          <span className="text-sm font-medium text-ink">{stopLabel(f.stops)}</span>
          {f.stops === minStops && <BestBadge />}
        </div>
      ),
    },
    {
      label: 'Route',
      render: (f) => (
        <span className="text-xs text-slate-500">
          {f.departure.code} → {f.arrival.code}
        </span>
      ),
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Compare flights"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl animate-compare-modal-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-lg font-bold text-ink">Compare Flights</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-paper hover:text-ink"
            aria-label="Close comparison"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-28 bg-surface p-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400" />
                {selectedFlights.map((f) => (
                  <th key={f.id} className="min-w-[160px] border-l border-line p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">{f.departure.code} → {f.arrival.code}</span>
                      <button
                        type="button"
                        onClick={() => removeFlight(f.id)}
                        className="cursor-pointer rounded p-0.5 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove ${f.airline} from comparison`}
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-paper/50' : ''}>
                  <td className="sticky left-0 z-10 bg-inherit p-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {row.label}
                  </td>
                  {selectedFlights.map((f) => (
                    <td key={f.id} className="border-l border-line p-3">
                      {row.render(f)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Segments row */}
              <tr className="bg-paper/50">
                <td className="sticky left-0 z-10 bg-inherit p-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Segments
                </td>
                {selectedFlights.map((f) => (
                  <td key={f.id} className="border-l border-line p-3">
                    {f.segments && f.segments.length > 0 ? (
                      <SegmentTimeline segments={f.segments} />
                    ) : (
                      <span className="text-xs text-slate-400">No segment data</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Book row */}
              <tr>
                <td className="sticky left-0 z-10 bg-surface p-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Book
                </td>
                {selectedFlights.map((f) => (
                  <td key={f.id} className="border-l border-line p-3">
                    <BookButton flight={f} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function BookButton({ flight }) {
  const [loading, setLoading] = useState(false)

  const handleBook = async () => {
    if (flight.bookingUrl) {
      window.open(flight.bookingUrl, '_blank')
      return
    }
    setLoading(true)
    const data = await fetchBookingLinks(flight.id)
    if (data?.booking_options?.[0]?.links?.[0]?.url) {
      window.open(data.booking_options[0].links[0].url, '_blank')
    }
    setLoading(false)
  }

  return (
    <button
      type="button"
      onClick={handleBook}
      disabled={loading}
      className="w-full cursor-pointer rounded-xl bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-700 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? 'Loading…' : 'Get deal'}
    </button>
  )
}
