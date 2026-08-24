const IGNAV_BASE = 'https://ignav.com/api'

function getHeaders() {
  return {
    'X-Api-Key': process.env.IGNAV_API_KEY,
    'Content-Type': 'application/json',
  }
}

export async function searchAirports(query, limit = 8) {
  if (!query || query.length < 2) return []
  const res = await fetch(
    `${IGNAV_BASE}/airports?q=${encodeURIComponent(query)}&limit=${limit}`,
    { headers: { 'X-Api-Key': process.env.IGNAV_API_KEY } }
  )
  if (!res.ok) throw new Error(`Airport search failed (${res.status})`)
  return res.json()
}

export async function searchOneWay({ origin, destination, departureDate, adults = 1, cabinClass = 'economy', maxStops }) {
  const body = {
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    departure_date: departureDate,
    adults,
    cabin_class: cabinClass,
  }
  if (maxStops !== undefined) body.max_stops = maxStops

  const res = await fetch(`${IGNAV_BASE}/fares/one-way`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`One-way search failed (${res.status})`)
  return res.json()
}

export async function searchRoundTrip({ origin, destination, departureDate, returnDate, adults = 1, cabinClass = 'economy', maxStops }) {
  const body = {
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    departure_date: departureDate,
    return_date: returnDate,
    adults,
    cabin_class: cabinClass,
  }
  if (maxStops !== undefined) body.max_stops = maxStops

  const res = await fetch(`${IGNAV_BASE}/fares/round-trip`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Round-trip search failed (${res.status})`)
  return res.json()
}

export async function getBookingLinks(ignavId) {
  const res = await fetch(`${IGNAV_BASE}/fares/booking-links`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ ignav_id: ignavId }),
  })
  if (!res.ok) throw new Error(`Booking links failed (${res.status})`)
  return res.json()
}
