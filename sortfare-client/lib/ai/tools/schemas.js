// lib/ai/tools/schemas.js
//
// Shared Zod schemas for the FE-07 tool contracts. The flight shape is
// identical across tools so the model sees one consistent vocabulary and
// the UI can render one component for every tool output.
import { z } from 'zod'

export const flightSchema = z.object({
  id: z.number().describe('Numeric id of the flight in the SortFare catalog'),
  airline: z.string().describe('Airline operating the flight'),
  flightNumber: z.string().describe('Flight number, e.g. "DL 482"'),
  duration: z.number().describe('Total travel time in minutes'),
  stops: z.number().int().min(0).describe('Number of stops (0 = nonstop)'),
  departure: z
    .object({
      time: z.string().describe('Local departure time, 24h HH:MM'),
      code: z.string().describe('Three-letter departure airport code'),
    })
    .describe('Departure leg'),
  arrival: z
    .object({
      time: z.string().describe('Local arrival time, 24h HH:MM'),
      code: z.string().describe('Three-letter arrival airport code'),
    })
    .describe('Arrival leg'),
  price: z.number().describe('Fare in the flight currency'),
  currency: z.string().describe('Currency symbol for the fare'),
  bookingUrl: z.string().describe('Airline booking URL (opens in a new tab)'),
})