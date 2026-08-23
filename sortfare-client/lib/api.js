import { flights } from '@/data/flights'

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£' }

// The server requires a YYYY-MM-DD departureDate, but the UI allows
// leaving the date empty (e.g. the featured default search). Default to
// about a week out so every request satisfies the API contract.
const DEFAULT_DATE_OFFSET_DAYS = 7

function defaultDepartureDate() {
  const date = new Date()
  date.setDate(date.getDate() + DEFAULT_DATE_OFFSET_DAYS)
  return date.toISOString().slice(0, 10)
}

// Maps the UI search form fields onto the SortFare server's
// /flights/search query contract (departureDate, adults).
export function mapSearchParams({ origin, destination, date, passengers } = {}) {
  const params = new URLSearchParams()
  if (origin) params.set('origin', origin)
  if (destination) params.set('destination', destination)
  if (date) params.set('departureDate', date)
  else if (origin || destination) params.set('departureDate', defaultDepartureDate())
  if (passengers) params.set('adults', passengers)
  return params
}

// Converts an ISO 8601 duration ("PT2H45M", "P1DT2H30M") into whole
// minutes. Anything malformed or missing becomes 0 so cards never render
// NaN from bad upstream data.
export function isoDurationToMinutes(value) {
  if (typeof value !== 'string') return 0
  const match = value.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/)
  if (!match) return 0
  const [, days, hours, minutes] = match
  return (
    Number(days || 0) * 24 * 60 + Number(hours || 0) * 60 + Number(minutes || 0)
  )
}

// Shapes a raw Duffel offer (as normalized by the SortFare server) into
// the flight shape the UI consumes (flat numeric price, minute-based
// duration, "HH:mm" times, airport codes).
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

function catalogForRoute(origin, destination) {
  return flights.filter(
    (f) =>
      (!origin || f.departure.code === origin) &&
      (!destination || f.arrival.code === destination),
  )
}

// Live search is unavailable (server down, HTTP error, bad payload):
// fall back to the local sample catalog filtered by the requested route.
// Callers can tell the two apart via `source`.
export async function fetchFlights(searchParams = {}) {
  const { origin, destination } = searchParams
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  if (!baseUrl) {
    return { flights: catalogForRoute(origin, destination), source: 'sample' }
  }

  try {
    const res = await fetch(
      `${baseUrl}/flights/search?${mapSearchParams(searchParams).toString()}`,
      { headers: { Accept: 'application/json' } },
    )
    if (!res.ok) throw new Error(`Flight search failed (${res.status})`)
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      throw new Error('Unexpected response type')
    }
    const body = await res.json()
    const list = Array.isArray(body?.flights) ? body.flights : []
    return { flights: list.map(normalizeFlight), source: 'live' }
  } catch {
    return { flights: catalogForRoute(origin, destination), source: 'sample' }
  }
}
