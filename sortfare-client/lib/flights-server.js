import { flights } from '@/data/flights'
import { airports, routes } from '@/data/routes'
import { searchOneWay, searchRoundTrip } from '@/lib/ignav'
import { defaultDepartureDate, normalizeIgnavFlight } from '@/lib/api'

function catalogForRoute(origin, destination) {
  return flights.filter(
    (f) =>
      (!origin || f.departure.code === origin) &&
      (!destination || f.arrival.code === destination),
  )
}

export async function searchLiveFlights(searchParams = {}) {
  const { origin, destination, date, returnDate, passengers } = searchParams
  const ignavKey = process.env.IGNAV_API_KEY

  if (ignavKey && origin && destination) {
    try {
      const departureDate = date || defaultDepartureDate()

      let result
      if (returnDate) {
        result = await searchRoundTrip({
          origin,
          destination,
          departureDate,
          returnDate,
          adults: passengers ? Number(passengers) : 1,
        })
      } else {
        result = await searchOneWay({
          origin,
          destination,
          departureDate,
          adults: passengers ? Number(passengers) : 1,
        })
      }

      const mapped = (result.itineraries || [])
        .filter(Boolean)
        .map(normalizeIgnavFlight)
      return { flights: mapped, source: 'live' }
    } catch (err) {
      console.warn('Ignav API error, falling back to sample:', err.message)
    }
  }

  return { flights: catalogForRoute(origin, destination), source: 'sample' }
}

// How many marquee international pairs from data/routes.js join the catalog's own
// routes in the featured view. Kept small: a cache miss costs one Ignav call each.
const FEATURED_INTERNATIONAL_LIMIT = 2
const FARES_PER_GROUP = 3
const FEATURED_CACHE_TTL_MS = 15 * 60 * 1000

function routeKey(origin, destination) {
  return `${origin}-${destination}`
}

// Derived from the catalog rather than hardcoded so the featured list cannot
// drift away from the sample fares that back it.
const CATALOG_ROUTES = (() => {
  const seen = new Map()
  for (const flight of flights) {
    const origin = flight.departure.code
    const destination = flight.arrival.code
    const key = routeKey(origin, destination)
    if (!seen.has(key)) seen.set(key, { origin, destination })
  }
  return [...seen.values()]
})()

export const FEATURED_ROUTES = (() => {
  const featured = [...CATALOG_ROUTES]
  const keys = new Set(featured.map((r) => routeKey(r.origin, r.destination)))

  for (const route of routes) {
    if (featured.length - CATALOG_ROUTES.length >= FEATURED_INTERNATIONAL_LIMIT) break
    const key = routeKey(route.from, route.to)
    if (keys.has(key)) continue
    keys.add(key)
    featured.push({ origin: route.from, destination: route.to })
  }

  return featured
})()

export function featuredRoutesFor({ origin, destination } = {}) {
  if (!origin && !destination) return FEATURED_ROUTES

  const matches = FEATURED_ROUTES.filter(
    (route) =>
      (!origin || route.origin === origin.toUpperCase()) &&
      (!destination || route.destination === destination.toUpperCase()),
  )

  // A code we do not feature should not empty the page out.
  return matches.length > 0 ? matches : FEATURED_ROUTES
}

function airportName(code) {
  return airports[code]?.name ?? code
}

// Per-route so a narrowed request (e.g. ?origin=JFK) reuses work already done for
// the full featured list. Process-local: it resets on redeploy or a dev recompile.
const routeCache = new Map()

export function clearFeaturedCache() {
  routeCache.clear()
}

async function featuredGroup({ origin, destination, date }) {
  const key = `${routeKey(origin, destination)}-${date}`
  const cached = routeCache.get(key)
  if (cached && cached.expiresAt > Date.now()) return cached.group

  const result = await searchLiveFlights({ origin, destination, date })
  const fares = [...(result.flights || [])].sort((a, b) => a.price - b.price)

  const group = {
    id: routeKey(origin, destination),
    origin,
    destination,
    originName: airportName(origin),
    destinationName: airportName(destination),
    source: result.source,
    flights: fares.slice(0, FARES_PER_GROUP),
    totalCount: fares.length,
  }

  routeCache.set(key, { group, expiresAt: Date.now() + FEATURED_CACHE_TTL_MS })
  return group
}

export async function getFeaturedRouteGroups(searchParams = {}) {
  const date = defaultDepartureDate()
  const settled = await Promise.allSettled(
    featuredRoutesFor(searchParams).map((route) => featuredGroup({ ...route, date })),
  )

  // A route that blows up is dropped, never propagated: the featured view must
  // render whatever it did manage to find.
  const groups = settled
    .filter((entry) => entry.status === 'fulfilled')
    .map((entry) => entry.value)
    .filter((group) => group.flights.length > 0)

  const live = groups.filter((group) => group.source === 'live').length
  let source = 'mixed'
  if (groups.length === 0) source = 'none'
  else if (live === groups.length) source = 'live'
  else if (live === 0) source = 'sample'

  return { groups, source }
}
