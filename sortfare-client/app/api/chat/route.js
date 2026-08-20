// app/api/chat/route.js
//
// Streaming chat route handler (AI SDK v7 / Gemini).
// Receives the conversation as UI messages, converts them to model messages,
// and streams the assistant reply back in the AI SDK UI-message protocol that
// `useChat` consumes. The API key lives exclusively in this server module
// (via lib/ai/model.js) — never in client code.
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
} from 'ai'
import {
  MAX_OUTPUT_TOKENS,
  MODEL_TEMPERATURE,
  model,
  SYSTEM_PROMPT,
} from '@/lib/ai/model'
import { searchFlights } from '@/lib/ai/tools/searchFlights'
import { getFlightDetails } from '@/lib/ai/tools/getFlightDetails'

// Allow up to 30s for the Gemini stream (default is 10s on some platforms).
export const maxDuration = 30

// FE-07: the model may call these tools. The same set is passed to
// `toUIMessageStream` so the client receives *typed* tool parts
// (tool-searchFlights / tool-getFlightDetails) with schema-derived
// input/output shapes instead of untyped dynamic-tool parts.
export const tools = {
  searchFlights,
  getFlightDetails,
}

// Sanitizes error text before it reaches the client. Three cases:
//   1. Designed tool errors (thrown by the `execute` functions, known
//      prefix) — surfaced as written.
//   2. Provider quota / rate-limit failures (free-tier Gemini allows 20
//      model requests/day) — mapped to a designed message the client can
//      detect and render as the amber "limit reached" card.
//   3. Everything else — generic text; server internals never leak.
const DESIGNED_TOOL_ERROR_PREFIXES = ['The SortFare catalog', 'Flight id']

const QUOTA_ERROR_TEXT =
  'The AI provider quota was exceeded — the free-tier daily limit of 20 model requests was reached. Retry after midnight Pacific, or raise the limit in Google AI Studio.'

function isQuotaError(error) {
  let current = error
  let text = ''
  for (let depth = 0; depth < 3 && current; depth++) {
    if (typeof current.message === 'string') text += ` ${current.message}`
    current = current?.cause
  }
  return /quota|rate\s?limit|RESOURCE_EXHAUSTED|429/i.test(text)
}

function toolErrorText(error) {
  let current = error
  for (let depth = 0; depth < 3 && current; depth++) {
    if (typeof current.message === 'string' && current.message) {
      if (DESIGNED_TOOL_ERROR_PREFIXES.some((p) => current.message.startsWith(p))) {
        return current.message
      }
    }
    current = current?.cause
  }
  if (isQuotaError(error)) return QUOTA_ERROR_TEXT
  return 'An error occurred while streaming. The conversation is intact.'
}

export async function POST(req) {
  const { messages } = await req.json()

  const result = streamText({
    model,
    // v7: `system` was renamed to `instructions`.
    instructions: SYSTEM_PROMPT,
    // Client messages (`useChat`) are UI-shaped; convert them to what the
    // model layer expects. This is the server side of the same conversion.
    messages: await convertToModelMessages(messages),
    temperature: MODEL_TEMPERATURE,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    tools,
    // v7 default is isStepCount(1) — the stream would end right after the
    // tool runs and the summary would never arrive. Keep the tool loop
    // server-side so one request streams tool parts AND the final answer.
    // Capped at 3 steps: every step is one model request, and the free-tier
    // Gemini key allows only 20 requests/day.
    stopWhen: isStepCount(3),
  })

  // v7: `result.toUIMessageStreamResponse()` is deprecated; stream the
  // result's `stream` (renamed from `fullStream`) through the top-level
  // helpers instead.
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream, tools, onError: toolErrorText }),
  })
}