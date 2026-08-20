'use client'
// components/FlightRow.jsx
//
// Compact flight row shared by every tool result renderer (search results
// list and single-flight details). Mirrors FlightCard's visual language but
// sized for the chat column.
import { Card } from '@heroui/react'

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
  return (
    <Card shadow="none" className="w-full border border-neutral-100">
      <Card.Content className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {flight.airline} <span className="font-normal text-neutral-500">{flight.flightNumber}</span>
            </p>
            <p className="text-xs text-neutral-500">
              {flight.departure.time} {flight.departure.code} → {flight.arrival.time} {flight.arrival.code}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-neutral-500 sm:block">
              {durationLabel(flight.duration)} · {stopLabel(flight.stops)}
            </span>
            <span className="text-sm font-bold text-gray-900">{formatPrice(flight)}</span>
            <a
              href={flight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-primary-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-primary-700"
            >
              View deal
            </a>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}