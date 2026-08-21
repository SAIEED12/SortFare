// lib/ai/tools/getFlightDetails.js
//
// FE-07 tool contract: `getFlightDetails`.
//
// Second tool: lets the model choose between "search the catalog" and
// "explain one flight". Kept deliberately narrow — a single flight by id —
// so the model's choice between the two tools is legible in the UI as the
// tool part streams in.
import { tool } from 'ai'
import { z } from 'zod'
import { flights } from '@/data/flights'
import { flightSchema } from '@/lib/ai/tools/schemas'

export const getFlightDetailsInputSchema = z.object({
  flightId: z
    .number()
    .int()
    .positive()
    .describe('Numeric id of the flight in the SortFare catalog, e.g. 1 for DL 482'),
})

export const getFlightDetailsOutputSchema = z.object({
  flight: flightSchema.describe('The requested flight with its full details'),
})

export const getFlightDetails = tool({
  description: [
    'Get the full details of a single flight from the SortFare catalog by its',
    'numeric id. Use this when the user asks about one specific flight',
    '(e.g. "tell me about DL 482"). If the id is not known yet, call',
    'searchFlights first to find it.',
  ].join(' '),
  inputSchema: getFlightDetailsInputSchema,
  outputSchema: getFlightDetailsOutputSchema,
  execute: async ({ flightId }) => {
    const flight = flights.find((f) => f.id === flightId)
    if (!flight) {
      throw new Error(
        `Flight id ${flightId} is not in the SortFare catalog. The catalog only contains ids ${flights
          .map((f) => f.id)
          .join(', ')} — search for a flight first, then ask about its id.`,
      )
    }
    return { flight }
  },
})