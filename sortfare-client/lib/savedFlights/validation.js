// lib/savedFlights/validation.js
//
// Shared validation for the "save flight" feature. This is the single source
// of truth for what a saved-flight payload must look like — it is used by the
// browser UI (before POSTing) AND by the unit tests. Keeping it in one module
// satisfies the project rule that form/input validation lives in a single
// place reused by both the UI and the tests.
import { z } from 'zod'

export const savedFlightSchema = z.object({
  id: z.string({ error: 'flight id is required' }).min(1, 'flight id is required'),
  airline: z.string().default('Unknown airline'),
  flightNumber: z.string().nullable().optional(),
  duration: z.number().min(0).default(0),
  stops: z.number().int().min(0).default(0),
  departure: z.object({
    time: z.string().default(''),
    code: z.string({ error: 'departure airport code is required' }).min(1, 'departure airport code is required'),
  }),
  arrival: z.object({
    time: z.string().default(''),
    code: z.string({ error: 'arrival airport code is required' }).min(1, 'arrival airport code is required'),
  }),
  price: z.number({ error: 'price must be a number greater than or equal to 0' }).min(0, 'price must be a number greater than or equal to 0'),
  currency: z.string().default(''),
  bookingUrl: z.string().nullable().optional(),
  segments: z.array(z.any()).optional(),
})

// The full payload the client sends to the saved-flights API: the Better Auth
// user id plus the normalized flight.
export const savePayloadSchema = z.object({
  userId: z.string({ error: 'userId is required' }).min(1, 'userId is required'),
  flight: savedFlightSchema,
})

// Returns { ok, data, errors }. `errors` is a list of human-readable strings,
// suitable for surfacing or asserting in tests.
export function validateSavedFlight(input) {
  const result = savePayloadSchema.safeParse(input)
  if (result.success) {
    return { ok: true, data: result.data, errors: [] }
  }
  return {
    ok: false,
    data: null,
    errors: result.error.issues.map((issue) => {
      const path = issue.path.join('.')
      return path ? `${path} ${issue.message}` : issue.message
    }),
  }
}
