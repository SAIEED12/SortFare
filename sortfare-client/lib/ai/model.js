// lib/ai/model.js
//
// Single source of truth for the SortFare assistant: the Gemini model,
// generation settings, and the system prompt. The /api/chat route handler
// imports from here and nothing else imports provider code directly.
// FE-07 (tools, structured output) extends this module — keep it free of
// UI concerns, with comments explaining each knob.
import { createGoogle } from '@ai-sdk/google'

// ---------------------------------------------------------------------------
// Model configuration
// ---------------------------------------------------------------------------

// Gemini Flash generation as of Aug 2026: fast first token, good streaming
// cadence for a chat demo. (gemini-2.5-flash is retired for new keys.)
export const MODEL_ID = 'gemini-3.6-flash'

// 0.7 keeps answers grounded and a little creative without drifting.
export const MODEL_TEMPERATURE = 0.7

// Cap reply length so a runaway generation can't stream forever past the
// question. 2048 tokens is generous for a travel-advice answer.
export const MAX_OUTPUT_TOKENS = 2048

// ---------------------------------------------------------------------------
// Model instance
// ---------------------------------------------------------------------------

// The @ai-sdk/google provider reads GOOGLE_GENERATIVE_AI_API_KEY by default,
// but this project stores the key as GEMINI_API_KEY (.env.local), so pass it
// explicitly. Note (v4 API): createGoogle({...}) returns the callable
// provider — the plain `google` export returns a non-callable provider
// reference when given a settings object. This runs server-side only; the
// key never reaches the client.
export const model = (() => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Add it to .env.local (server-side only).')
  }
  return createGoogle({ apiKey })(MODEL_ID)
})()

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

export const SYSTEM_PROMPT = `
You are the SortFare assistant, embedded in the SortFare flight-search app.
SortFare compares fares across many airlines, lets travelers rank flights by
price, duration, or departure time, filter by airline and stops, and then
book directly with the airline — no booking fees, no markup.

Ground rules:
- Answer questions about flights, fares, airlines, and travel tips. Help
  travelers decide which option fits best: price, duration, stops, timing.
- For ANY question about specific flights, fares, or comparisons, call the
  searchFlights tool — do not invent flight numbers or prices from memory.
  The tool returns the real catalog, so always cite flight numbers, times,
  and fares from its result and nothing else.
- If the user asks about one specific flight (e.g. "tell me about DL 482"),
  call getFlightDetails with that flight's catalog id; if you only have a
  flight number, use searchFlights first to find the id.
- The demo catalog only covers JFK → ORD. searchFlights will fail for other
  routes — in that case, explain the catalog's scope and point the user to
  the Flights page for live search. Never guess data for routes outside the
  catalog.
- Booking happens on the airline's own site. Never ask for payment details,
  personal identity, or credentials. You cannot book, change, or cancel
  anything.
- Prefer concise, practical answers. Use short markdown: bold for key facts,
  tight lists, and small tables when comparing 2–4 flights. Do not overuse
  headings.
`.trim()