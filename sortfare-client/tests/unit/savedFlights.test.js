import { describe, it, expect, vi, afterEach } from 'vitest'
import { validateSavedFlight } from '@/lib/savedFlights/validation'
import { saveFlight, fetchSavedFlights, removeSavedFlight } from '@/lib/savedFlights/client'

const VALID_FLIGHT = {
  id: 'off_123',
  airline: 'Duffel Airways',
  price: 123.45,
  currency: 'GBP',
  duration: 630,
  stops: 0,
  departure: { time: '09:00', code: 'LHR' },
  arrival: { time: '19:30', code: 'JFK' },
  bookingUrl: null,
}

describe('validateSavedFlight (shared validation)', () => {
  it('accepts a well-formed payload', () => {
    const r = validateSavedFlight({ userId: 'u1', flight: VALID_FLIGHT })
    expect(r.ok).toBe(true)
    expect(r.errors).toEqual([])
  })

  it.each([
    [undefined, 'userId is required'],
    ['', 'userId is required'],
  ])('rejects missing/empty userId (%p)', (userId, msg) => {
    const r = validateSavedFlight({ userId, flight: VALID_FLIGHT })
    expect(r.ok).toBe(false)
    expect(r.errors.join(' ')).toContain(msg)
  })

  it.each([
    ['', 'flight id is required'],
    [undefined, 'flight id is required'],
  ])('rejects missing flight.id (%p)', (id) => {
    const r = validateSavedFlight({ userId: 'u1', flight: { ...VALID_FLIGHT, id } })
    expect(r.ok).toBe(false)
    expect(r.errors.join(' ')).toContain('flight id is required')
  })

  it('rejects a negative price', () => {
    const r = validateSavedFlight({ userId: 'u1', flight: { ...VALID_FLIGHT, price: -5 } })
    expect(r.ok).toBe(false)
    expect(r.errors.join(' ')).toContain('price must be a number greater than or equal to 0')
  })

  it('rejects a non-numeric price', () => {
    const r = validateSavedFlight({ userId: 'u1', flight: { ...VALID_FLIGHT, price: 'abc' } })
    expect(r.ok).toBe(false)
  })

  it('rejects a negative stop count', () => {
    const r = validateSavedFlight({ userId: 'u1', flight: { ...VALID_FLIGHT, stops: -1 } })
    expect(r.ok).toBe(false)
  })

  it('rejects a missing departure/arrival code', () => {
    const r = validateSavedFlight({
      userId: 'u1',
      flight: { ...VALID_FLIGHT, departure: { time: '09:00', code: '' } },
    })
    expect(r.ok).toBe(false)
    expect(r.errors.join(' ')).toContain('departure airport code is required')
  })

  it('defaults optional fields while keeping required ones', () => {
    const r = validateSavedFlight({
      userId: 'u1',
      flight: { id: 'x', departure: { code: 'A' }, arrival: { code: 'B' }, price: 10 },
    })
    expect(r.ok).toBe(true)
    expect(r.data.flight.airline).toBe('Unknown airline')
    expect(r.data.flight.stops).toBe(0)
    expect(r.data.flight.currency).toBe('')
  })
})

describe('saved-flights client', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('saveFlight validates before sending and POSTs the flight', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ userId: 'u1', flightId: 'off_123', flight: VALID_FLIGHT }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const saved = await saveFlight('u1', VALID_FLIGHT)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/saved-flights',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(saved.flightId).toBe('off_123')
  })

  it('saveFlight never hits the network when validation fails', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(saveFlight('u1', { ...VALID_FLIGHT, id: '' })).rejects.toThrow(
      /flight id is required/,
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('fetchSavedFlights GETs by userId', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ flights: [{ flightId: 'off_123', flight: VALID_FLIGHT }], count: 1 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const flights = await fetchSavedFlights('u1')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/saved-flights?userId=u1'),
      expect.objectContaining({ method: 'GET' }),
    )
    expect(flights).toHaveLength(1)
  })

  it('removeSavedFlight DELETEs by flightId', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)

    await expect(removeSavedFlight('u1', 'off_123')).resolves.toBe(true)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/saved-flights/off_123?userId=u1'),
      expect.objectContaining({ method: 'DELETE' }),
    )
  })

  it('surfaces server error messages from the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'userId is required' } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(saveFlight('u1', VALID_FLIGHT)).rejects.toThrow(/userId is required/)
  })
})
