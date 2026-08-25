import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import {
  mapSearchParams,
  isoDurationToMinutes,
  normalizeFlight,
  fetchFlights,
  defaultDepartureDate,
} from '@/lib/api'
import {
  searchLiveFlights,
  getFeaturedRouteGroups,
  featuredRoutesFor,
  clearFeaturedCache,
  FEATURED_ROUTES,
} from '@/lib/flights-server'

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
  vi.clearAllMocks()
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

describe('searchLiveFlights (server)', () => {
  it('normalizes Ignav API results into live flights', async () => {
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

    const result = await searchLiveFlights({
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

  it('treats a successful Ignav response without itineraries as empty live', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')
    searchOneWay.mockResolvedValue({})

    const result = await searchLiveFlights({ origin: 'JFK', destination: 'ORD' })
    expect(result.source).toBe('live')
    expect(result.flights).toEqual([])
  })

  it('falls back to the sample catalog on Ignav API errors', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')
    searchOneWay.mockRejectedValue(new Error('API error'))

    const result = await searchLiveFlights({ origin: 'JFK', destination: 'ORD' })
    expect(result.source).toBe('sample')
    expect(result.flights.length).toBeGreaterThan(0)
    expect(result.flights[0].departure.code).toBe('JFK')
  })

  it('falls back to the sample catalog when no API key is configured', async () => {
    delete process.env.IGNAV_API_KEY
    const { searchOneWay } = await import('@/lib/ignav')

    const result = await searchLiveFlights({ origin: 'JFK', destination: 'ORD' })

    expect(searchOneWay).not.toHaveBeenCalled()
    expect(result.source).toBe('sample')
    expect(result.flights.length).toBeGreaterThan(0)
  })

  it('falls back to the sample catalog when origin or destination is missing', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')

    const result = await searchLiveFlights({ origin: 'JFK' })

    expect(searchOneWay).not.toHaveBeenCalled()
    expect(result.source).toBe('sample')
    expect(result.flights.length).toBeGreaterThan(0)
  })

  it('never throws on malformed Ignav itineraries and still returns live', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')
    searchOneWay.mockResolvedValue({
      itineraries: [null, {}, { ignav_id: 'ig-x' }],
    })

    const result = await searchLiveFlights({ origin: 'JFK', destination: 'ORD' })
    expect(result.source).toBe('live')
    expect(Array.isArray(result.flights)).toBe(true)
  })

  it.each([
    ['JFK', 'ORD'],
    ['LAX', 'SFO'],
    ['SEA', 'JFK'],
    ['MIA', 'LAX'],
  ])('sample fallback covers the standard route %s-%s', async (origin, destination) => {
    delete process.env.IGNAV_API_KEY
    const result = await searchLiveFlights({ origin, destination })
    expect(result.source).toBe('sample')
    expect(result.flights.length).toBeGreaterThan(0)
    for (const flight of result.flights) {
      expect(flight.departure.code).toBe(origin)
      expect(flight.arrival.code).toBe(destination)
    }
  })

  it('sample fallback stays honest for routes the catalog does not cover', async () => {
    delete process.env.IGNAV_API_KEY
    const result = await searchLiveFlights({ origin: 'DFW', destination: 'BOS' })
    expect(result.source).toBe('sample')
    expect(result.flights).toEqual([])
  })
})

describe('getFeaturedRouteGroups (server)', () => {
  const DATE = defaultDepartureDate()

  function itinerary({ origin, destination, price, id }) {
    return {
      ignav_id: id ?? `ig-${origin}-${destination}-${price}`,
      outbound: {
        carrier: 'Test Air',
        duration_minutes: 120,
        segments: [
          {
            flight_number: 'TA 1',
            operating_carrier_name: 'Test Air',
            departure_airport: origin,
            departure_time_local: `${DATE}T08:00:00`,
            arrival_airport: destination,
            arrival_time_local: `${DATE}T10:00:00`,
            duration_minutes: 120,
          },
        ],
      },
      price: { amount: price, currency: 'USD' },
    }
  }

  // Every featured route answers with a single live fare unless a test overrides it.
  function mockLiveEverywhere(searchOneWay, perRoute = () => undefined) {
    searchOneWay.mockImplementation(async ({ origin, destination }) => {
      const override = perRoute({ origin, destination })
      if (override) return override
      return { itineraries: [itinerary({ origin, destination, price: 300 })] }
    })
  }

  beforeEach(async () => {
    clearFeaturedCache()
    const { searchOneWay } = await import('@/lib/ignav')
    searchOneWay.mockReset()
  })

  it('covers several distinct routes, catalog pairs first', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')
    mockLiveEverywhere(searchOneWay)

    const { groups, source } = await getFeaturedRouteGroups()

    expect(groups.length).toBeGreaterThan(3)
    expect(new Set(groups.map((g) => g.id)).size).toBe(groups.length)
    expect(groups.slice(0, 4).map((g) => g.id)).toEqual([
      'JFK-ORD',
      'LAX-SFO',
      'SEA-JFK',
      'MIA-LAX',
    ])
    // At least one international pair from the globe route list.
    expect(groups.map((g) => g.id)).toContain('JFK-LHR')
    expect(source).toBe('live')
  })

  it('labels airports by name, falling back to the code when unknown', async () => {
    delete process.env.IGNAV_API_KEY

    const { groups } = await getFeaturedRouteGroups()
    const jfkOrd = groups.find((g) => g.id === 'JFK-ORD')
    const seaJfk = groups.find((g) => g.id === 'SEA-JFK')

    expect(jfkOrd.originName).toBe('New York JFK')
    expect(seaJfk.originName).toBe('SEA')
  })

  it('serves every group from the sample catalog when no API key is configured', async () => {
    delete process.env.IGNAV_API_KEY
    const { searchOneWay } = await import('@/lib/ignav')

    const { groups, source } = await getFeaturedRouteGroups()

    expect(searchOneWay).not.toHaveBeenCalled()
    expect(source).toBe('sample')
    expect(groups.every((g) => g.source === 'sample')).toBe(true)
    // Only the routes data/flights.js actually covers.
    expect(groups.map((g) => g.id)).toEqual(['JFK-ORD', 'LAX-SFO', 'SEA-JFK', 'MIA-LAX'])
  })

  it('keeps other routes live when one route fails, and reports a mixed source', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')
    searchOneWay.mockImplementation(async ({ origin, destination }) => {
      if (origin === 'LAX' && destination === 'SFO') throw new Error('API error')
      return { itineraries: [itinerary({ origin, destination, price: 300 })] }
    })

    const { groups, source } = await getFeaturedRouteGroups()

    expect(source).toBe('mixed')
    expect(groups.find((g) => g.id === 'LAX-SFO').source).toBe('sample')
    expect(groups.find((g) => g.id === 'JFK-ORD').source).toBe('live')
  })

  it('shows only the cheapest three fares per route, cheapest first', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')
    mockLiveEverywhere(searchOneWay, ({ origin, destination }) =>
      origin === 'JFK' && destination === 'ORD'
        ? {
            itineraries: [500, 120, 340, 90, 260].map((price) =>
              itinerary({ origin, destination, price }),
            ),
          }
        : undefined,
    )

    const { groups } = await getFeaturedRouteGroups()
    const jfkOrd = groups.find((g) => g.id === 'JFK-ORD')

    expect(jfkOrd.flights.map((f) => f.price)).toEqual([90, 120, 260])
    expect(jfkOrd.totalCount).toBe(5)
  })

  it('drops a route with no fares instead of rendering an empty section', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')
    mockLiveEverywhere(searchOneWay, ({ origin, destination }) =>
      origin === 'JFK' && destination === 'LHR' ? {} : undefined,
    )

    const { groups } = await getFeaturedRouteGroups()

    expect(groups.map((g) => g.id)).not.toContain('JFK-LHR')
    expect(groups.map((g) => g.id)).toContain('JFK-ORD')
  })

  it('survives malformed itineraries without throwing', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')
    searchOneWay.mockResolvedValue({ itineraries: [null, {}, { ignav_id: 'ig-x' }] })

    const { groups } = await getFeaturedRouteGroups()

    expect(Array.isArray(groups)).toBe(true)
    for (const group of groups) {
      expect(group.flights.length).toBeGreaterThan(0)
      expect(group.flights.every((f) => Number.isFinite(f.price))).toBe(true)
    }
  })

  it('reuses cached route results within the TTL', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')
    mockLiveEverywhere(searchOneWay)

    await getFeaturedRouteGroups()
    const callsAfterFirst = searchOneWay.mock.calls.length
    await getFeaturedRouteGroups()

    expect(callsAfterFirst).toBe(FEATURED_ROUTES.length)
    expect(searchOneWay.mock.calls.length).toBe(callsAfterFirst)
  })

  it('searches each featured route for the default departure date', async () => {
    process.env.IGNAV_API_KEY = 'test-key'
    const { searchOneWay } = await import('@/lib/ignav')
    mockLiveEverywhere(searchOneWay)

    await getFeaturedRouteGroups()

    expect(searchOneWay).toHaveBeenCalledWith({
      origin: 'JFK',
      destination: 'ORD',
      departureDate: DATE,
      adults: 1,
    })
  })
})

describe('featuredRoutesFor', () => {
  it('returns the full featured list when no codes are given', () => {
    expect(featuredRoutesFor()).toEqual(FEATURED_ROUTES)
    expect(featuredRoutesFor({})).toEqual(FEATURED_ROUTES)
  })

  it('narrows to routes touching a half-filled search', () => {
    expect(featuredRoutesFor({ origin: 'JFK' })).toEqual([
      { origin: 'JFK', destination: 'ORD' },
      { origin: 'JFK', destination: 'LHR' },
    ])
    expect(featuredRoutesFor({ destination: 'JFK' })).toEqual([
      { origin: 'SEA', destination: 'JFK' },
    ])
  })

  it('accepts lowercase codes', () => {
    expect(featuredRoutesFor({ origin: 'jfk' })).toEqual(featuredRoutesFor({ origin: 'JFK' }))
  })

  it('falls back to the full list for a code we do not feature', () => {
    expect(featuredRoutesFor({ origin: 'XXX' })).toEqual(FEATURED_ROUTES)
    expect(featuredRoutesFor({ origin: 'JFK', destination: 'SYD' })).toEqual(FEATURED_ROUTES)
  })
})

describe('fetchFlights (client wrapper)', () => {
  it('returns the source reported by the server route', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ flights: [{ id: 'x' }], source: 'live' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await fetchFlights({ origin: 'JFK', destination: 'ORD' })

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/flights?'))
    expect(result.source).toBe('live')
    expect(result.flights).toHaveLength(1)
  })

  it('maps a sample payload from the server to source "sample"', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ flights: [], source: 'sample' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await fetchFlights({ origin: 'JFK', destination: 'ORD' })
    expect(result.source).toBe('sample')
  })

  it('builds query params for origin, destination, dates, and passengers', async () => {
    let calledUrl = ''
    const fetchMock = vi.fn().mockImplementation(async (url) => {
      calledUrl = url
      return {
        ok: true,
        status: 200,
        json: async () => ({ flights: [], source: 'live' }),
      }
    })
    vi.stubGlobal('fetch', fetchMock)

    await fetchFlights({
      origin: 'JFK',
      destination: 'ORD',
      date: '2026-09-05',
      returnDate: '2026-09-12',
      passengers: '2',
    })

    expect(calledUrl).toContain('origin=JFK')
    expect(calledUrl).toContain('destination=ORD')
    expect(calledUrl).toContain('departureDate=2026-09-05')
    expect(calledUrl).toContain('returnDate=2026-09-12')
    expect(calledUrl).toContain('adults=2')
  })

  it('throws on a non-ok server response so the error state can render', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({}),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      fetchFlights({ origin: 'JFK', destination: 'ORD' }),
    ).rejects.toThrow(/502/)
  })
})
