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
  streamText,
  toUIMessageStream,
} from 'ai'
import {
  MAX_OUTPUT_TOKENS,
  MODEL_TEMPERATURE,
  model,
  SYSTEM_PROMPT,
} from '@/lib/ai/model'

// Allow up to 30s for the Gemini stream (default is 10s on some platforms).
export const maxDuration = 30

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
  })

  // v7: `result.toUIMessageStreamResponse()` is deprecated; stream the
  // result's `stream` (renamed from `fullStream`) through the top-level
  // helpers instead.
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}