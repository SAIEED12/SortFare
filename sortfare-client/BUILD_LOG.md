# FL-07 Build Log — SortFare Assistant Agent

## What Was Built

Added a third live tool (`fetchUrl`) to the SortFare assistant, giving it the ability to fetch and read content from any URL. This complements the two existing tools (`searchFlights` and `getFlightDetails`) that query the static flight catalog.

### Tools now available to the agent:

| Tool | Data Source | Purpose |
|------|-------------|---------|
| `searchFlights` | `data/flights.js` (static file) | Search the JFK→ORD catalog by price, stops, airline |
| `getFlightDetails` | `data/flights.js` (static file) | Get full details of a single flight by ID |
| `fetchUrl` | Live web (any HTTP URL) | Fetch and extract text from airline sites, travel blogs, etc. |

## What Broke & What Changed

### Attempt 1: MCP Server (Fetch MCP)
**Goal:** Use the official `@modelcontextprotocol/server-fetch` package via the `@ai-sdk/mcp` client.

**What happened:** The package `@modelcontextprotocol/server-fetch` does not exist on npm. The official fetch MCP server is a **Python package** (`mcp-server-fetch` on PyPI), not a Node.js package. The npm package `mcp-server-fetch` is a security holding package (v0.0.1-security).

**Error:** `npm error 404 Not Found - GET https://registry.npmjs.org/@modelcontextprotocol%2fserver-fetch`

**Decision:** Pivoted to building a custom `fetchUrl` tool directly in the project using the same `tool()` API as the existing tools. This avoids the Python dependency entirely and keeps the stack pure JavaScript.

### Attempt 2: Custom fetchUrl tool
**What worked:** Created `lib/ai/tools/fetchUrl.js` with:
- Zod input/output schemas (same pattern as searchFlights)
- Native Node.js `fetch()` API (no external dependencies)
- HTML-to-text extraction (strips tags, decodes entities, truncates to ~4000 chars)
- 10-second timeout via `AbortSignal.timeout()`
- Graceful error handling (returns `success: false` instead of throwing)

### Lint Error: Backtick in Template Literal
**What happened:** Adding `` `fetch` `` (with backticks) inside the system prompt template literal caused ESLint to fail with "Missing semicolon" because the backtick closed the template literal early.

**Fix:** Changed `` `fetch` `` to `"fetch"` in the system prompt text.

### Test JSON Format Mismatch
**What happened:** Raw API tests with a minimal JSON body (`{"messages":[{"role":"user","content":"Hello"}]}`) caused `TypeError: Cannot read properties of undefined (reading 'map')` in `convertToModelMessages`.

**Root cause:** AI SDK v7's `convertToModelMessages` expects messages with a `parts` array (the UI message format that `useChat` sends). The minimal format works with the chat UI but not with the raw API.

**Fix:** Test JSON bodies now include `id`, `createdAt`, and `parts` fields to match the AI SDK v7 message format.

### ToolCall.jsx UI Update
**What happened:** The `ToolCall` component only had metadata and rendering for `searchFlights` and `getFlightDetails`. The new `fetchUrl` tool would fall back to generic rendering.

**Fix:**
- Added `fetchUrl` entry to `TOOL_META` (label: "Web fetch")
- Added `IconGlobe` SVG component for the fetch tool icon
- Added rendering branch for `fetchUrl` output: shows URL link (title or raw URL), success/failure badge, and truncated content preview

## What Was Cut from Spec

**MCP server integration was cut.** The original plan called for spawning the Fetch MCP server as a stdio subprocess via `@ai-sdk/mcp`. This was abandoned because:
1. The official fetch MCP server is Python-only
2. Community npm alternatives (`mcp-fetch-server`) exist but are less maintained
3. A custom tool using native `fetch()` achieves the same result with zero dependencies

The `@ai-sdk/mcp` and `@modelcontextprotocol/sdk` packages are still installed but unused — they can be removed or used for future MCP integrations.

## Quota Considerations

- Gemini free tier: 20 model requests/day
- Each tool call = 1 model request
- A typical multi-tool question costs 2–3 requests (model → tool → model → answer)
- The `fetchUrl` tool adds a new capability but doesn't change the quota math
- The `stopWhen: isStepCount(3)` cap prevents runaway tool loops

## Files Changed

| File | Change |
|------|--------|
| `lib/ai/tools/fetchUrl.js` | **New** — custom fetch tool with Zod schemas |
| `app/api/chat/route.js` | Added `fetchUrl` to tools import and export |
| `lib/ai/model.js` | Added fetchUrl guidance to system prompt |
| `components/ToolCall.jsx` | Added fetchUrl metadata, icon, and output rendering |
| `package.json` | Added `@ai-sdk/mcp` and `@modelcontextprotocol/sdk` (unused) |

## Test Results

All three tools verified working via raw API calls:

1. **searchFlights**: "What is the cheapest flight from JFK to Chicago?" → 5 flights returned, sorted by price (Southwest $129 cheapest)
2. **fetchUrl**: "Fetch https://httpbin.org/html" → Successfully fetched and extracted HTML content
3. **getFlightDetails**: "Tell me about DL 482" → Model used searchFlights with airline filter, returned Delta flights
