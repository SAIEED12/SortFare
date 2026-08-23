// lib/ai/tools/searchFlights.js
//
// FE-07 tool contract: `searchFlights`.
//
// Server-side tool executed by /api/chat. Queries the in-app SortFare
// catalog (data/flights.js) — the same dataset the Flights page renders.
// The Zod schema doubles as model guidance (every field carries a
// describe()) and as the runtime validator for the model's arguments, so
// hallucinated fields never reach the execute function.
import { tool } from 'ai'
import { z } from 'zod'
import { flights } from '@/data/flights'
import { flightSchema } from '@/lib/ai/tools/schemas'

// City pairs actually present in the catalog — derived from the data so
// the tool's coverage stays in sync with data/flights.js automatically.
// If a requested route falls outside it, the tool fails with a designed
// error — that surfaces as the `output-error` part state in the UI, so
// reviewers can trigger the failure on purpose without crashing the stream.
const coveredPairs = [
  ...new Set(flights.map((f) => `${f.departure.code} → ${f.arrival.code}`)),
]

export const searchFlightsInputSchema = z.object({
  origin: z
    .string()
    .regex(/^[A-Z]{3}$/, 'Three-letter airport code, e.g. JFK')
    .optional()
    .describe('Three-letter origin airport code. Omit to search all origins.'),
  destination: z
    .string()
    .regex(/^[A-Z]{3}$/, 'Three-letter airport code, e.g. ORD')
    .optional()
    .describe('Three-letter destination airport code. Omit to search all destinations.'),
  maxPrice: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Only return flights at or below this fare in USD.'),
  nonstopOnly: z
    .boolean()
    .optional()
    .describe('Set to true when the user wants only nonstop flights.'),
  maxStops: z
    .number()
    .int()
    .min(0)
    .max(2)
    .optional()
    .describe('Maximum number of stops the user will accept (0, 1, or 2).'),
  airline: z
    .string()
    .optional()
    .describe('Restrict results to this airline name, e.g. "Delta Air Lines".'),
  sortBy: z
    .enum(['price', 'duration', 'departure'])
    .optional()
    .describe('Ranking for the results. Defaults to price.'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .describe('Maximum number of flights to return (default 5).'),
})

export const searchFlightsOutputSchema = z.object({
  query: z
    .object({
      origin: z.string().nullable().describe('Origin code the search was run with'),
      destination: z.string().nullable().describe('Destination code the search was run with'),
      sortBy: z.string().describe('Ranking applied to the results'),
      nonstopOnly: z.boolean().describe('Whether only nonstops were requested'),
      maxStops: z.number().nullable().describe('Maximum stops applied, or null'),
      maxPrice: z.number().nullable().describe('Fare cap applied, or null'),
      airline: z.string().nullable().describe('Airline filter applied, or null'),
    })
    .describe('The exact query the tool executed'),
  count: z.number().int().describe('Number of flights returned'),
  flights: z.array(flightSchema).describe('Matching flights, ranked by the requested sort'),
})

function catalogCoversRoute(origin, destination) {
  if (!origin && !destination) return true
  return flights.some(
    (f) =>
      (!origin || f.departure.code === origin) &&
      (!destination || f.arrival.code === destination),
  )
}

function routeCoverageError(origin, destination) {
  const route = [origin, destination].filter(Boolean).join(' → ')
  return `The SortFare catalog does not cover ${route}. The sample catalog covers: ${coveredPairs.join(', ')}. Ask about one of those routes, or search the Flights page for live results.`
}

export const searchFlights = tool({
  description: [
    'Search the SortFare catalog of flights and return matching options',
    'ranked by the requested sort (price by default).',
    'Use this tool for ANY question about specific flights, fares,',
    'cheapest/fastest options, or comparisons between flights.',
    'The sample catalog covers a limited set of routes; searching',
    'another route fails with an explanatory error listing them.',
  ].join(' '),
  inputSchema: searchFlightsInputSchema,
  outputSchema: searchFlightsOutputSchema,
  execute: async ({ origin, destination, maxPrice, nonstopOnly, maxStops, airline, sortBy = 'price', limit = 5 }) => {
    if (!catalogCoversRoute(origin, destination)) {
      throw new Error(routeCoverageError(origin, destination))
    }

    let result = [...flights]

    if (origin) result = result.filter((f) => f.departure.code === origin)
    if (destination) result = result.filter((f) => f.arrival.code === destination)
    if (maxPrice != null) result = result.filter((f) => f.price <= maxPrice)
    if (nonstopOnly) result = result.filter((f) => f.stops === 0)
    else if (maxStops != null) result = result.filter((f) => f.stops <= maxStops)
    if (airline) result = result.filter((f) => f.airline === airline)

    switch (sortBy) {
      case 'duration':
        result.sort((a, b) => a.duration - b.duration)
        break
      case 'departure':
        result.sort((a, b) => a.departure.time.localeCompare(b.departure.time))
        break
      case 'price':
      default:
        result.sort((a, b) => a.price - b.price)
    }

    const selected = result.slice(0, limit)

    return {
      query: {
        origin: origin ?? null,
        destination: destination ?? null,
        sortBy,
        nonstopOnly: nonstopOnly ?? false,
        maxStops: maxStops ?? null,
        maxPrice: maxPrice ?? null,
        airline: airline ?? null,
      },
      count: selected.length,
      flights: selected,
    }
  },
})