# SortFare Client

Frontend for SortFare — a flight comparison app where users search, compare, and rank flights across airlines by price, duration, and stops. Users are linked out to airline sites to complete purchase; there is no booking or payment in this app.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React, Tailwind CSS
- **Language:** Plain JavaScript (no TypeScript)
- **UI:** [HeroUI](https://www.heroui.com/) (primary) + [Shadcn UI](https://ui.shadcn.com/) (supplementary primitives)
- **Auth:** Better Auth (client + Next.js route handlers)

## Architecture

This repository is **frontend-only**. Business logic and flight data APIs live in a separate SortFare server repository. This app consumes that API via `NEXT_PUBLIC_API_URL`.

Authentication runs in this repo through Better Auth catch-all route handlers under `app/api/auth/`. That is the only server-side code allowed here — no Express, no business REST endpoints, no backend validation logic.

```
SortFare-Client (this repo)          Separate server repo
─────────────────────────────        ─────────────────────
Next.js pages & UI                   Express REST API
HeroUI + Shadcn components           Flight search & data
Better Auth route handlers           Business logic
Client fetch → NEXT_PUBLIC_API_URL
```

The frontend dev server can run independently for UI work. Flight search features require the external API server to be running.

## Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

## Getting Started

### Install dependencies

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
# External SortFare API (separate server repo)
NEXT_PUBLIC_API_URL=http://localhost:4000

# Better Auth (Next.js route handlers in this repo)
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the separate SortFare API server |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth session signing |
| `BETTER_AUTH_URL` | Base URL of this Next.js app (where auth routes are served) |

If Better Auth uses a database adapter, add the adapter-specific variable when auth is scaffolded (e.g. `MONGODB_URI` for a Mongo adapter) — scoped to auth only.

### Development

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). Ensure the external API server is running at the URL set in `NEXT_PUBLIC_API_URL` for flight search to work.

### Other scripts

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## UI Setup

**HeroUI** — wrap the root layout with the HeroUI provider:

```jsx
import { HeroUIProvider } from "@heroui/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <HeroUIProvider>{children}</HeroUIProvider>
      </body>
    </html>
  );
}
```

**Shadcn UI** — initialize with JavaScript (uses `jsconfig.json` for path aliases):

```bash
npx shadcn@latest init
```

Add components as needed:

```bash
npx shadcn@latest add button dialog
```

Prefer HeroUI for primary UI; reach for Shadcn when HeroUI lacks a specific primitive.

## Auth Setup

Better Auth runs via a catch-all route handler:

```
app/api/auth/[...all]/route.js
```

The client uses Better Auth React hooks to sign in, sign out, and read session state. Auth config and any database adapter live in `lib/auth.js`.

## Project Structure

```
app/                  # Next.js App Router pages and layouts
  api/auth/           # Better Auth route handlers (only server-side code)
components/           # Shared React components
  ui/                 # Shadcn UI components
hooks/                # Custom React hooks
lib/                  # Auth config, API client, utilities
public/               # Static assets
```

## Assistant Tool Contract (FE-07)

The SortFare Assistant (`/chat`) can call server-side tools defined in `lib/ai/tools/`. Every tool has a Zod schema (the language model's contract) and an `execute` function (the runtime). Tool calls stream to the client as typed tool parts (`tool-<name>` in `message.parts`), and `components/ToolCall.jsx` renders the lifecycle as four distinct states.

### `searchFlights` — `lib/ai/tools/searchFlights.js`

Searches the in-app catalog (`data/flights.js`) and returns matching flights ranked by the requested sort.

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `origin` | `string` (3-letter code) | — | Optional; omitted = any origin |
| `destination` | `string` (3-letter code) | — | Optional; omitted = any destination |
| `maxPrice` | `number` (int > 0) | — | Fare cap in USD |
| `nonstopOnly` | `boolean` | `false` | Overrides `maxStops` when set |
| `maxStops` | `number` (0–2) | — | Ignored when `nonstopOnly` is set |
| `airline` | `string` | — | Exact airline name |
| `sortBy` | `enum('price' \| 'duration' \| 'departure')` | `'price'` | Ranking applied before limiting |
| `limit` | `number` (1–10) | `5` | Max results |

**Return shape** — Zod-validated, typed as `tool-searchFlights` output on the client:

```js
{
  query: { origin, destination, sortBy, nonstopOnly, maxStops, maxPrice, airline }, // what was executed
  count: number,                          // 0 when nothing matches the filters
  flights: [{ id, airline, flightNumber, duration, stops,
              departure: { time, code }, arrival: { time, code },
              price, currency, bookingUrl }]
}
```

**Errors:** the catalog covers only `JFK → ORD`. Any requested route outside it throws a descriptive error (rendered as the `output-error` state); a covered route with no matches returns `count: 0` (rendered as a designed empty state, not an error).

### `getFlightDetails` — `lib/ai/tools/getFlightDetails.js`

Returns one flight's full details. The model picks between this and `searchFlights` based on the question; the choice is visible in the UI as the tool part streams in.

| Field | Type | Notes |
|-------|------|-------|
| `flightId` | `number` (int > 0) | Catalog id, e.g. `1` for DL 482 |

**Return shape:** `{ flight: { id, airline, flightNumber, duration, stops, departure: { time, code }, arrival: { time, code }, price, currency, bookingUrl } }`

**Errors:** unknown id throws with the valid id list in the message.

### Tool part states and their UI (components/ToolCall.jsx)

| State | User question it answers | Visual treatment |
|-------|--------------------------|------------------|
| `input-streaming` | "What is it doing?" | Skeleton shimmer + spinner; args chips appear as they stream in |
| `input-available` | "With what input?" | Complete query as chips + running spinner |
| `output-available` | "What came back?" | Real component (`FlightResults` — list, empty state, and an SVG price-by-airline chart), never raw JSON |
| `output-error` | "What went wrong?" | Designed red failure card with the sanitized error and a suggested fix |

Transitions between states crossfade (`sf-tool-phase-in`, 220ms) inside a stable card frame — no layout jump. `prefers-reduced-motion` disables the animation.

**To demo the error state:** ask "what's the cheapest flight from LAX to SFO?" — the route is outside the catalog and the tool fails on purpose.

### Provider quota note

The assistant runs on a free-tier Gemini API key: **20 model requests per day** for `gemini-3.6-flash` (`GenerateRequestsPerDayPerProjectPerModel-FreeTier`). Every tool step is one request, so a typical comparison question costs 2–3 of the daily 20. When the cap is hit, the model stream fails with a 429 — the chat renders a designed amber "daily free-tier limit reached" card (not a crash) and the quota resets at midnight Pacific. To raise the limit, enable billing for the key at [ai.google.dev/gemini-api](https://ai.google.dev/gemini-api) and update `GEMINI_API_KEY` in `.env.local` and the Vercel environment.

## License

This project is licensed under the MIT License.
