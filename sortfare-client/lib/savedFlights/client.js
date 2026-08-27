// lib/savedFlights/client.js
//
// Browser-side API client for the saved-flights endpoints hosted on the
// Express server (NEXT_PUBLIC_API_URL). `saveFlight` validates the payload
// with the shared validation module before sending.
import { validateSavedFlight } from './validation'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

function buildUrl(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, value)
  }
  return url.toString()
}

async function parseError(res) {
  try {
    const body = await res.json()
    return body?.error?.message || `Request failed (${res.status})`
  } catch {
    return `Request failed (${res.status})`
  }
}

export async function fetchSavedFlights(userId) {
  if (!userId) return []
  const res = await fetch(buildUrl('/saved-flights', { userId }), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new Error(await parseError(res))
  }
  const data = await res.json()
  return Array.isArray(data.flights) ? data.flights : []
}

export async function saveFlight(userId, flight) {
  const validation = validateSavedFlight({ userId, flight })
  if (!validation.ok) {
    throw new Error(validation.errors.join('; '))
  }

  const res = await fetch(`${BASE_URL}/saved-flights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, flight: validation.data.flight }),
  })
  if (!res.ok) {
    throw new Error(await parseError(res))
  }
  if (res.status === 204) return null
  return res.json()
}

export async function removeSavedFlight(userId, flightId) {
  const res = await fetch(buildUrl(`/saved-flights/${encodeURIComponent(flightId)}`, { userId }), {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error(await parseError(res))
  }
  return true
}
