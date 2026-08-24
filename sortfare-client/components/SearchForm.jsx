'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Input, Select, ListBox, ListBoxItem } from '@heroui/react'
import { fetchAirportSuggestions } from '@/lib/api'

export default function SearchForm() {
  const [tripType, setTripType] = useState('oneway')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [passengers, setPassengers] = useState('1')

  const [originQuery, setOriginQuery] = useState('')
  const [destinationQuery, setDestinationQuery] = useState('')
  const [originSuggestions, setOriginSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [showOriginDropdown, setShowOriginDropdown] = useState(false)
  const [showDestDropdown, setShowDestDropdown] = useState(false)

  const originRef = useRef(null)
  const destRef = useRef(null)

  const swap = () => {
    setOrigin(destination)
    setDestination(destinationQuery)
    setDestinationQuery(originQuery)
    setOriginQuery(origin)
  }

  const today = new Date().toISOString().split('T')[0]

  const debouncedSearch = useCallback(async (query, setSuggestions, setShowDropdown) => {
    if (query.length >= 2) {
      const results = await fetchAirportSuggestions(query)
      setSuggestions(results)
      setShowDropdown(true)
    } else {
      setSuggestions([])
      setShowDropdown(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(originQuery, setOriginSuggestions, setShowOriginDropdown)
    }, 300)
    return () => clearTimeout(timer)
  }, [originQuery, debouncedSearch])

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(destinationQuery, setDestinationSuggestions, setShowDestDropdown)
    }, 300)
    return () => clearTimeout(timer)
  }, [destinationQuery, debouncedSearch])

  useEffect(() => {
    function handleClickOutside(e) {
      if (originRef.current && !originRef.current.contains(e.target)) {
        setShowOriginDropdown(false)
      }
      if (destRef.current && !destRef.current.contains(e.target)) {
        setShowDestDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectAirport = (airport, setQuery, setCode, setShowDropdown) => {
    setQuery(airport.code)
    setCode(airport.code)
    setShowDropdown(false)
  }

  return (
    <form action="/flights" method="GET">
      <input type="hidden" name="origin" value={origin} />
      <input type="hidden" name="destination" value={destination} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="returnDate" value={tripType === 'roundtrip' ? returnDate : ''} />
      <input type="hidden" name="passengers" value={passengers} />
      <input type="hidden" name="tripType" value={tripType} />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Trip Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTripType('oneway')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tripType === 'oneway'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            One-way
          </button>
          <button
            type="button"
            onClick={() => setTripType('roundtrip')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tripType === 'roundtrip'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Round-trip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div ref={originRef} className="relative">
          <label htmlFor="sf-origin" className="block text-sm font-medium text-gray-700">
            From
          </label>
          <Input
            id="sf-origin"
            type="text"
            required
            placeholder="Type city or airport"
            value={originQuery}
            onChange={(e) => {
              setOriginQuery(e.target.value)
              setOrigin('')
            }}
            onFocus={() => originQuery.length >= 2 && setShowOriginDropdown(true)}
            className="mt-1 w-full"
            autoComplete="off"
          />
          {showOriginDropdown && originSuggestions.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto">
              {originSuggestions.map((airport) => (
                <button
                  key={airport.code}
                  type="button"
                  onClick={() => selectAirport(airport, setOriginQuery, setOrigin, setShowOriginDropdown)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <div className="font-medium text-sm">{airport.code}</div>
                  <div className="text-xs text-gray-500">{airport.name}</div>
                  <div className="text-xs text-gray-400">{airport.city}, {airport.country}</div>
                </button>
              ))}
            </div>
          )}
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

        <div ref={destRef} className="relative">
          <label htmlFor="sf-destination" className="block text-sm font-medium text-gray-700">
            To
          </label>
          <Input
            id="sf-destination"
            type="text"
            required
            placeholder="Type city or airport"
            value={destinationQuery}
            onChange={(e) => {
              setDestinationQuery(e.target.value)
              setDestination('')
            }}
            onFocus={() => destinationQuery.length >= 2 && setShowDestDropdown(true)}
            className="mt-1 w-full"
            autoComplete="off"
          />
          {showDestDropdown && destinationSuggestions.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto">
              {destinationSuggestions.map((airport) => (
                <button
                  key={airport.code}
                  type="button"
                  onClick={() => selectAirport(airport, setDestinationQuery, setDestination, setShowDestDropdown)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <div className="font-medium text-sm">{airport.code}</div>
                  <div className="text-xs text-gray-500">{airport.name}</div>
                  <div className="text-xs text-gray-400">{airport.city}, {airport.country}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sf-date" className="block text-sm font-medium text-gray-700">
            {tripType === 'roundtrip' ? 'Departure Date' : 'Date'}
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

        {tripType === 'roundtrip' && (
          <div>
            <label htmlFor="sf-return-date" className="block text-sm font-medium text-gray-700">
              Return Date
            </label>
            <Input
              id="sf-return-date"
              type="date"
              min={date || today}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="mt-1 w-full"
            />
          </div>
        )}

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
    </form>
  )
}
