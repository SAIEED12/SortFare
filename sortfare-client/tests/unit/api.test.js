import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  mapSearchParams,
  isoDurationToMinutes,
  normalizeFlight,
  fetchFlights,
} from '@/lib/api'

vi.mock('@/lib/ignav', () => ({
  searchOneWay: vi.fn(),
  searchRoundTrip: vi.fn(),
}))

const ORIGINAL_API_URL = process.env.NEXT_PUBLIC_API_URL
const ORIGINAL_IGNAV_KEY = process.env.IGNAV_API_KEY

afterEach(() => {
  if (ORIGINAL_API_URL === undefined) {
    delete process.env.NEXT_PUBLIC_API_URL
  } else {
    process.env.NEXT_PUBLIC_API_URL = ORIGINAL_API_URL
  }
  if (ORIGINAL_IGNAV_KEY === undefined) {
    delete process.env.IGNAV_API_KEY
  } else {
    process.env.IGNAV_API_KEY = ORIGINAL_IGNAV_KEY
  }
  vi.unstubAllGlobals()
})

function jsonResponse(body, { ok = true, status = 200, contentType = 'application/json' } = {}) {
  return {
    ok,
    status,
    headers: { get: () => contentType },
    json: async () => body,
  }
}

const SAMPLE_OFFER = {
  id: 'off_0000ABCD',
  airline: 'Duffel Airways',
  price: { amount: '189.50', currency: 'USD' },
  duration: 'PT2H45M',
  stops: 1,
  departure: { time: '2026-09-05T06:30:00Z', airport: 'LAX' },
  arrival: { time: '2026-09-05T09:15:00Z', airport: 'SFO' },
  deepLink: null,
}

describe('mapSearchParams', () => {
  it('maps UI fields onto the server contract', () => {
    const params = mapSearchParams({
      origin: 'JFK',
      destination: 'ORD',
      date: '2026-09-05',
      passengers: '2',
    })
    expect(params.get('origin')).toBe('JFK')
    expect(params.get('destination')).toBe('ORD')
    expect(params.get('departureDate')).toBe('2026-09-05')
    expect(params.get('adults')).toBe('2')
  })

  it('omits fields that are not provided, but defaults departureDate', () => {
    const params = mapSearchParams({ origin: 'JFK' })
    expect(params.get('origin')).toBe('JFK')
    expect([...params.keys()].sort()).toEqual(['departureDate', 'origin'])
  })

  it('defaults departureDate to a valid date about a week out', () => {
    const params = mapSearchParams({ origin: 'JFK', destination: 'ORD' })
    const expected = new Date()
    expected.setDate(expected.getDate() + 7)
    expect(params.get('departureDate')).toBe(expected.toISOString().slice(0, 10))
  })

  it('returns an empty query for no input', () => {
    expect(mapSearchParams().toString()).toBe('')
  })
})

describe('isoDurationToMinutes', () => {
  it.each([
    ['PT2H45M', 165],
    ['PT0S', 0],
    ['PT90M', 90],
    ['P1DT2H30M', 24 * 60 + 150],
    [null, 0],
    [undefined, 0],
    ['', 0],
    ['garbage', 0],
    ['PT', 0],
  ])('parses %j to %i minutes', (input, expected) => {
    expect(isoDurationToMinutes(input)).toBe(expected)
  })
})

describe('normalizeFlight', () => {
  it('maps a raw Duffel-shaped offer onto the UI flight shape', () => {
    expect(normalizeFlight(SAMPLE_OFFER)).toEqual({
      id: 'off_0000ABCD',
      airline: 'Duffel Airways',
      flightNumber: null,
      duration: 165,
      stops: 1,
      departure: { time: '06:30', code: 'LAX' },
      arrival: { time: '09:15', code: 'SFO' },
      price: 189.5,
      currency: '$',
      bookingUrl: null,
    })
  })

  it('defaults malformed prices to 0', () => {
    expect(normalizeFlight({ ...SAMPLE_OFFER, price: { amount: 'abc', currency: 'USD' } }).price).toBe(0)
    expect(normalizeFlight({ ...SAMPLE_OFFER, price: undefined }).price).toBe(0)
    expect(normalizeFlight({}).price).toBe(0)
  })

  it('passes unknown currency codes through instead of guessing a symbol', () => {
    expect(normalizeFlight({ ...SAMPLE_OFFER, price: { amount: '100', currency: 'JPY' } }).currency).toBe('JPY')
    expect(normalizeFlight({ ...SAMPLE_OFFER, price: { amount: '100' } }).currency).toBe('')
  })

  it('handles missing airline and airports gracefully', () => {
    const flight = normalizeFlight({ id: 'x', price: { amount: '10', currency: 'USD' } })
    expect(flight.airline).toBe('Unknown airline')
    expect(flight.departure).toEqual({ time: '', code: '' })
    expect(flight.arrival).toEqual({ time: '', code: '' })
  })

  it.each([
    [-1, 0],
    [undefined, 0],
    [NaN, 0],
    [2.7, 2],
  ])('sanitizes stops value %p to %i', (stops, expected) => {
    expect(normalizeFlight({ ...SAMPLE_OFFER, stops }).stops).toBe(expected)
  })

  it('keeps a deep link as the booking URL when present', () => {
    expect(
      normalizeFlight({ ...SAMPLE_OFFER, deepLink: 'https://airline.example/book' }).bookingUrl,
    ).toBe('https://airline.example/book')
  })
})

describe('fetchFlights', () => {
  it('normalizes Ignav API results', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')
    searchOneWay.mockResolvedValue({
      itineraries: [
        {
          ignav_id: 'ig-123',
          outbound: {
            carrier: 'Duffel Airways',
            duration_minutes: 180,
            segments: [
              {
                flight_number: 'DA100',
                operating_carrier_name: 'Duffel Airways',
                departure_airport: 'LAX',
                departure_time_local: '2026-09-05T08:00:00',
                arrival_airport: 'SFO',
                arrival_time_local: '2026-09-05T11:00:00',
                duration_minutes: 180,
              },
            ],
          },
          price: { amount: 189.5, currency: 'USD' },
        },
      ],
    })

    const result = await fetchFlights({
      origin: 'LAX',
      destination: 'SFO',
      date: '2026-09-05',
      passengers: '1',
    })

    expect(searchOneWay).toHaveBeenCalledWith({
      origin: 'LAX',
      destination: 'SFO',
      departureDate: '2026-09-05',
      adults: 1,
    })
    expect(result.source).toBe('live')
    expect(result.flights).toHaveLength(1)
    expect(result.flights[0].airline).toBe('Duffel Airways')
    expect(result.flights[0].price).toBe(189.5)
  })

  it('treats a successful Ignav response without itineraries as empty', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')
    searchOneWay.mockResolvedValue({})

    const result = await fetchFlights({ origin: 'JFK', destination: 'ORD' })
    expect(result.source).toBe('live')
    expect(result.flights).toEqual([])
  })

  it('falls back to the sample catalog on Ignav API errors', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')
    searchOneWay.mockRejectedValue(new Error('API error'))

    const result = await fetchFlights({ origin: 'JFK', destination: 'ORD' })
    expect(result.source).toBe('sample')
    expect(result.flights.length).toBeGreaterThan(0)
    expect(result.flights[0].departure.code).toBe('JFK')
  })

  it('falls back to the sample catalog when no API key is configured', async () => {
    delete process.env.IGNAV_API_KEY
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const result = await fetchFlights({ origin: 'JFK', destination: 'ORD' })

    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.source).toBe('sample')
    expect(result.flights.length).toBeGreaterThan(0)
  })

  it('sample fallback stays honest for routes the catalog does not cover', async () => {
    delete process.env.IGNAV_API_KEY

    const result = await fetchFlights({ origin: 'DFW', destination: 'BOS' })
    expect(result.source).toBe('sample')
    expect(result.flights).toEqual([])
  })

  it('never calls the network when no API URL is configured', async () => {
    delete process.env.IGNAV_API_KEY
    delete process.env.NEXT_PUBLIC_API_URL
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const result = await fetchFlights({ origin: 'JFK', destination: 'ORD' })

    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.source).toBe('sample')
    expect(result.flights.length).toBeGreaterThan(0)
  })
})

describe('sample catalog covers standard routes', () => {
  const routes = [
    { origin: 'JFK', destination: 'ORD' },
    { origin: 'LAX', destination: 'SFO' },
    { origin: 'SEA', destination: 'JFK' },
    { origin: 'MIA', destination: 'LAX' },
  ]

  it.each(routes.map((r) => [`${r.origin}-${r.destination}`, r]))(
    'returns matching sample flights for %s',
    async (_label, route) => {
      delete process.env.IGNAV_API_KEY
      delete process.env.NEXT_PUBLIC_API_URL

      const result = await fetchFlights({
        origin: route.origin,
        destination: route.destination,
      })

      expect(result.source).toBe('sample')
      expect(result.flights.length).toBeGreaterThan(0)
      for (const flight of result.flights) {
        expect(flight.departure.code).toBe(route.origin)
        expect(flight.arrival.code).toBe(route.destination)
      }
    },
  )
})
