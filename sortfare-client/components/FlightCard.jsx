'use client'
import { Card } from '@heroui/react'

export default function FlightCard({ flight }) {
  const hours = Math.floor(flight.duration / 60)
  const minutes = flight.duration % 60
  const durationLabel = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  const stopLabel =
    flight.stops === 0 ? 'Nonstop' : flight.stops === 1 ? '1 stop' : `${flight.stops} stops`

  return (
    <Card className="w-full">
      <Card.Content className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{flight.airline}</span>
            <span className="text-xs text-gray-400">{flight.flightNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center min-w-[52px]">
              <div className="text-lg font-bold">{flight.departure.time}</div>
              <div className="text-xs text-gray-400">{flight.departure.code}</div>
            </div>

            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-gray-400">{stopLabel}</span>
              <div className="relative w-12">
                <div className="h-px bg-gray-300" />
                <div className="absolute right-0 -top-[3px] w-1.5 h-1.5 rounded-full bg-gray-400" />
              </div>
              <span className="text-[10px] text-gray-400">{durationLabel}</span>
            </div>

            <div className="text-center min-w-[52px]">
              <div className="text-lg font-bold">{flight.arrival.time}</div>
              <div className="text-xs text-gray-400">{flight.arrival.code}</div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
            <span className="text-xl font-bold">
              {flight.currency} {flight.price}
            </span>
            <a
              href={flight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              View Deal
            </a>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}
