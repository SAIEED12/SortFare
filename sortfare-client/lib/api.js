const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£' }

const DEFAULT_DATE_OFFSET_DAYS = 7

export function defaultDepartureDate() {
  const date = new Date()
  date.setDate(date.getDate() + DEFAULT_DATE_OFFSET_DAYS)
  return date.toISOString().slice(0, 10)
}

export function mapSearchParams({ origin, destination, date, passengers, returnDate } = {}) {
  const params = new URLSearchParams()
  if (origin) params.set('origin', origin)
  if (destination) params.set('destination', destination)
  if (date) params.set('departureDate', date)
  else if (origin || destination) params.set('departureDate', defaultDepartureDate())
  if (returnDate) params.set('returnDate', returnDate)
  if (passengers) params.set('adults', passengers)
  return params
}

export function isoDurationToMinutes(value) {
  if (typeof value !== 'string') return 0
  const match = value.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/)
  if (!match) return 0
  const [, days, hours, minutes] = match
  return (
    Number(days || 0) * 24 * 60 + Number(hours || 0) * 60 + Number(minutes || 0)
  )
}

export function normalizeFlight(raw = {}) {
  const amount = Number.parseFloat(raw.price?.amount)
  const currencyCode = raw.price?.currency || ''
  const stops =
    typeof raw.stops === 'number' && Number.isFinite(raw.stops) && raw.stops >= 0
      ? Math.floor(raw.stops)
      : 0

  return {
    id: raw.id,
    airline: raw.airline || 'Unknown airline',
    flightNumber: null,
    duration: isoDurationToMinutes(raw.duration),
    stops,
    departure: {
      time:
        typeof raw.departure?.time === 'string'
          ? raw.departure.time.slice(11, 16)
          : '',
      code: raw.departure?.airport || '',
    },
    arrival: {
      time:
        typeof raw.arrival?.time === 'string' ? raw.arrival.time.slice(11, 16) : '',
      code: raw.arrival?.airport || '',
    },
    price: Number.isFinite(amount) ? amount : 0,
    currency: CURRENCY_SYMBOLS[currencyCode] ?? currencyCode,
    bookingUrl: raw.deepLink || null,
  }
}

export function normalizeIgnavFlight(itinerary) {
  const outbound = itinerary?.outbound || {}
  const segments = outbound.segments || []
  const firstSeg = segments[0] || {}
  const lastSeg = segments[segments.length - 1] || {}

  const depTime = firstSeg.departure_time_local?.slice(11, 16) || ''
  const arrTime = lastSeg.arrival_time_local?.slice(11, 16) || ''

  return {
    id: itinerary.ignav_id,
    airline: outbound.carrier || 'Unknown airline',
    flightNumber: segments.map(s => s.flight_number).filter(Boolean).join(' → '),
    duration: outbound.duration_minutes || 0,
    stops: Math.max(0, segments.length - 1),
    departure: {
      time: depTime,
      code: firstSeg.departure_airport || '',
    },
    arrival: {
      time: arrTime,
      code: lastSeg.arrival_airport || '',
    },
    price: itinerary.price?.amount || 0,
    currency: itinerary.price?.currency || 'USD',
    bookingUrl: null,
    segments: segments.map(s => ({
      flightNumber: s.flight_number,
      airline: s.operating_carrier_name,
      departureAirport: s.departure_airport,
      departureTime: s.departure_time_local?.slice(11, 16),
      arrivalAirport: s.arrival_airport,
      arrivalTime: s.arrival_time_local?.slice(11, 16),
      duration: s.duration_minutes,
    })),
    inbound: itinerary?.inbound ? {
      carrier: itinerary.inbound.carrier,
      duration: itinerary.inbound.duration_minutes,
      segments: (itinerary.inbound.segments || []).map(s => ({
        flightNumber: s.flight_number,
        airline: s.operating_carrier_name,
        departureAirport: s.departure_airport,
        departureTime: s.departure_time_local?.slice(11, 16),
        arrivalAirport: s.arrival_airport,
        arrivalTime: s.arrival_time_local?.slice(11, 16),
        duration: s.duration_minutes,
      })),
    } : null,
  }
}

export async function fetchFlights(searchParams = {}) {
  const { origin, destination, date, returnDate, passengers } = searchParams

  const params = new URLSearchParams()
  if (origin) params.set('origin', origin)
  if (destination) params.set('destination', destination)
  if (date) params.set('departureDate', date)
  if (returnDate) params.set('returnDate', returnDate)
  if (passengers) params.set('adults', passengers)

  const res = await fetch(`/api/flights?${params.toString()}`)
  if (!res.ok) {
    throw new Error(`Flight search failed (${res.status})`)
  }

  const data = await res.json()
  return {
    flights: Array.isArray(data.flights) ? data.flights : [],
    source: data.source === 'live' ? 'live' : 'sample',
  }
}

export async function fetchAirportSuggestions(query) {
  if (!query || query.length < 2) return []
  try {
    const res = await fetch(`/api/airports?q=${encodeURIComponent(query)}&limit=6`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function fetchBookingLinks(ignavId) {
  try {
    const res = await fetch('/api/booking-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ignav_id: ignavId }),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
