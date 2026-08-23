'use client'
import { useState } from 'react'
import { Button, Input, Select, ListBox, ListBoxItem } from '@heroui/react'

export const QUICK_ROUTES = [
  { origin: 'JFK', destination: 'ORD', label: 'New York → Chicago' },
  { origin: 'LAX', destination: 'SFO', label: 'Los Angeles → San Francisco' },
  { origin: 'SEA', destination: 'JFK', label: 'Seattle → New York' },
  { origin: 'MIA', destination: 'LAX', label: 'Miami → Los Angeles' },
]

export default function SearchForm() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState('1')

  const swap = () => {
    setOrigin(destination)
    setDestination(origin)
  }

  const applyRoute = (route) => {
    setOrigin(route.origin)
    setDestination(route.destination)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form action="/flights" method="GET">
      <input type="hidden" name="origin" value={origin} />
      <input type="hidden" name="destination" value={destination} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="passengers" value={passengers} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <label htmlFor="sf-origin" className="block text-sm font-medium text-gray-700">
            From
          </label>
          <Input
            id="sf-origin"
            type="text"
            required
            placeholder="e.g. JFK"
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            className="mt-1 w-full"
          />
        </div>

        <div className="hidden items-end sm:flex">
          <Button
            type="button"
            isIconOnly
            aria-label="Swap origin and destination"
            onClick={swap}
            className="rounded-full border border-primary-200 bg-primary-50 text-primary-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </Button>
        </div>

        <div>
          <label htmlFor="sf-destination" className="block text-sm font-medium text-gray-700">
            To
          </label>
          <Input
            id="sf-destination"
            type="text"
            required
            placeholder="e.g. ORD"
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
            className="mt-1 w-full"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sf-date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <Input
            id="sf-date"
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full"
          />
        </div>

        <div>
          <label htmlFor="sf-passengers" className="block text-sm font-medium text-gray-700">
            Passengers
          </label>
          <Select
            id="sf-passengers"
            selectedKey={passengers}
            onSelectionChange={(key) => setPassengers(String(key))}
            className="mt-1 w-full"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <ListBoxItem key={n} id={String(n)}>
                    {n} {n === 1 ? 'passenger' : 'passengers'}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        className="mt-5 bg-primary-600 text-sm font-semibold text-white hover:bg-primary-700"
      >
        Search Flights
      </Button>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-medium text-gray-500">Popular:</span>
        {QUICK_ROUTES.map((route) => (
          <button
            key={route.label}
            type="button"
            onClick={() => applyRoute(route)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-primary-300 hover:text-primary-600"
          >
            {route.label}
          </button>
        ))}
      </div>
    </form>
  )
}
