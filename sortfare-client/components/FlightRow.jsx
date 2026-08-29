'use client'
import { useState } from 'react'
import { Card } from '@heroui/react'
import { fetchBookingLinks } from '@/lib/api'

export function durationLabel(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function stopLabel(stops) {
  return stops === 0 ? 'Nonstop' : stops === 1 ? '1 stop' : `${stops} stops`
}

export function formatPrice(flight) {
  return `${flight.currency}${flight.price}`
}

export default function FlightRow({ flight }) {
  const [loadingLinks, setLoadingLinks] = useState(false)

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

  return (
    <Card shadow="none" className="w-full border border-line">
      <Card.Content className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              {flight.airline} <span className="font-normal text-slate-500">{flight.flightNumber}</span>
            </p>
            <p className="text-xs text-slate-500">
              {flight.departure.time} {flight.departure.code} → {flight.arrival.time} {flight.arrival.code}
            </p>
            {flight.stops > 0 && flight.segments && flight.segments.length > 1 && (
              <p className="text-[10px] text-slate-400 mt-0.5">
                Layover: {flight.segments.slice(0, -1).map(s => s.arrivalAirport).join(', ')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:block">
              {durationLabel(flight.duration)} · {stopLabel(flight.stops)}
            </span>
            <span className="font-mono text-sm font-bold text-ink">{formatPrice(flight)}</span>
            <button
              onClick={handleGetDeal}
              disabled={loadingLinks}
              className="cursor-pointer rounded-md bg-accent-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-accent-700 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingLinks ? 'Loading…' : 'Get deal'}
            </button>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}
