# SortFare Client

A flight comparison app where users search, compare, and rank flights across airlines by price, duration, and stops. Users are linked out to airline sites to complete purchase — no booking, no fees, no middleman.

**Live Demo:** https://sortfare-client.vercel.app

<!-- Replace with actual screenshot URLs -->
<!-- ![Homepage with 3D globe hero](screenshots/home.png) -->
<!-- ![Flight search and comparison](screenshots/flights.png) -->
<!-- ![AI chat assistant](screenshots/chat.png) -->

## What It Does

- **Flight Search** — Enter origin, destination, date, and travelers to see options from across airlines in one view
- **Compare & Rank** — Sort results by price, duration, or departure time; filter by airline and number of stops
- **Save Flights** — Keep a shortlist of favorites and compare them anytime (requires account)
- **AI Assistant** — Chat with an AI that searches the flight catalog, compares options, and shares travel tips
- **3D Globe Hero** — Interactive Three.js globe showing flight routes with animated arcs and tooltips
- **Direct Booking** — One-click links to airline sites to complete purchases at listed fares

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router), React |
| Styling | Tailwind CSS |
| UI Components | HeroUI (primary) + Shadcn UI (supplementary) |
| 3D Graphics | Three.js, React Three Fiber, Drei |
| Auth | Better Auth (client + Next.js route handlers) |
| AI | Google Gemini (`gemini-3.6-flash`) via Vercel AI SDK |
| Language | JavaScript (no TypeScript) |

## Architecture

This repository is **frontend-only**. Business logic and flight data APIs live in a separate SortFare server repository. This app consumes that API via `NEXT_PUBLIC_API_URL`.

```
SortFare-Client (this repo)          Separate server repo
─────────────────────────────        ─────────────────────
Next.js pages & UI                   Express REST API
HeroUI + Shadcn components           Flight search & data
Better Auth route handlers           Business logic
Client fetch → NEXT_PUBLIC_API_URL
```

The AI chat assistant (`/chat`) runs server-side tool calls via `/api/chat` route handlers. It uses a local flight catalog (`data/flights.js`) for demo data and can fetch external URLs via the `fetchUrl` tool.

Saved flights are persisted in MongoDB by the separate SortFare server (the `savedFlights` collection in the Express backend, keyed by the Better Auth `userId`). The client sends the authenticated `userId` with each request; the `/saved` page and the "Save" button on every flight card read and write that collection via `NEXT_PUBLIC_API_URL`.

### Key Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with 3D globe hero, features, popular deals |
| `/flights` | Flight search and comparison page; with no search params it shows featured deals across several routes |
| `/chat` | AI assistant for flight questions and travel tips |
| `/saved` | Saved flight shortlist (requires account); tap "Save" on any flight to add it |
| `/health` | API connectivity health check |
| `/login`, `/signup` | Authentication pages |

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Install

```bash
git clone https://github.com/your-username/SortFare-Client.git
cd SortFare-Client/sortfare-client
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Base URL of the separate SortFare API server | Yes (for live search) |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth session signing | Yes |
| `BETTER_AUTH_URL` | Base URL of this Next.js app | Yes |
| `GEMINI_API_KEY` | Google Gemini API key for AI assistant | Yes (for chat) |

> **Note:** The flight search page requires the external API server. The AI chat uses a local catalog for demo purposes.

### Development

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
sortfare-client/
├── app/                    # Next.js App Router pages and layouts
│   ├── api/chat/           # AI streaming chat route handler
│   ├── chat/               # Chat page
│   ├── flights/            # Flight search page
│   ├── health/             # API health check
│   ├── login/, signup/     # Auth pages
│   └── page.js             # Landing page
├── components/             # React components
│   ├── GlobeHero.jsx       # 3D globe hero (Three.js)
│   ├── GlobeScene.jsx      # Globe scene with arcs and stars
│   ├── FlightArc.jsx       # Curved arc between airports
│   ├── ShaderHero.jsx      # Shader-based hero animation
│   ├── Chat.jsx            # AI chat interface
│   ├── ToolCall.jsx        # Tool call renderer for chat
│   ├── FlightCard.jsx      # Flight result card
│   └── Nav.jsx, Footer.jsx
├── data/                   # Flight routes and catalog
│   ├── flights.js          # 20 demo flights across 4 routes (JFK→ORD, LAX→SFO, SEA→JFK, MIA→LAX)
│   └── routes.js           # Airport coordinates and airline colors
├── hooks/                  # Custom React hooks
│   └── usePrefersReducedMotion.js
├── lib/                    # Utilities and config
│   ├── ai/                 # AI model, tools, and MCP client
│   │   ├── model.js        # Gemini model config and system prompt
│   │   ├── mcp.js          # MCP client factory
│   │   └── tools/          # searchFlights, getFlightDetails, fetchUrl
│   └── auth.js             # Better Auth config
└── public/textures/        # Earth texture (earth-day.jpg)
```

## Design Decisions

### Why Next.js App Router?
Server components reduce client bundle size. The AI chat route handler streams responses server-side without exposing the API key. Route handlers for auth stay co-located with the app.

### Why HeroUI + Shadcn?
HeroUI provides the primary design system with consistent theming. Shadcn fills gaps where HeroUI lacks specific primitives (like certain dialog patterns). This avoids building everything from scratch.

### Why No TypeScript?
The project started as a rapid prototype. JavaScript with JSDoc comments and Zod schemas (for API contracts) provides sufficient type safety without the compilation step overhead.

### Why Gemini?
The free tier (20 requests/day) is sufficient for a demo. The AI SDK's Google provider integrates cleanly with the Vercel AI SDK streaming protocol.

### Why Local Catalog for AI?
The AI assistant uses a local flight catalog (`data/flights.js`) instead of the external API. This makes the chat self-contained for demos and avoids coupling the AI to a running backend server.

## AI Assistant Details

### Tools

The assistant has three tools:

| Tool | Purpose | Input |
|------|---------|-------|
| `searchFlights` | Search the flight catalog | origin, destination, maxPrice, stops, airline, sortBy, limit |
| `getFlightDetails` | Get one flight's full details | flightId |
| `fetchUrl` | Fetch and extract web page content | url |

### Tool Part States

The chat UI renders tool calls in four states:

1. **Input streaming** — Skeleton shimmer + spinner as arguments arrive
2. **Input available** — Complete query shown as chips + running spinner
3. **Output available** — Real component (flight results list, chart, or extracted text)
4. **Output error** — Red failure card with sanitized error message

### Provider Quota

The Gemini free tier allows **20 model requests per day**. Each tool step counts as one request, so a typical comparison costs 2–3 requests. When the cap is hit, the chat renders an amber "limit reached" card. Quota resets at midnight Pacific.

## How AI Tools Built This

**Claude (Anthropic)** was used for architectural planning and design decisions. It helped structure the project, choose between Next.js patterns, and design the tool contract for the AI assistant.

**Opencode** was used for writing and fixing code. It generated component implementations, debugged Three.js issues, set up the Vercel AI SDK integration, and handled refactoring across files.

**Google Gemini** is the runtime AI provider. The free API key powers the chat assistant in production.

### What was manual

- Testing across browsers (Chrome, Firefox, Safari)
- Performance profiling and bundle analysis
- Accessibility auditing with Lighthouse
- Writing the system prompt and tool descriptions
- Final README and documentation

### Limitations encountered

- Gemini's free tier (20 req/day) limits demo availability
- The flight catalog is hardcoded to JFK → ORD for demo purposes
- Three.js bundle size (~400KB gzipped) required careful code-splitting with `next/dynamic`

## Known Limitations

- **Demo catalog** — Only covers JFK → ORD routes. Other routes show an explanatory error.
- **AI quota** — Gemini free tier allows 20 requests/day. Production use requires a paid plan.
- **No payment** — Users are directed to airline sites; no booking or payment processing.
- **External API dependency** — Flight search page requires the separate SortFare API server running.

## Running Tests

```bash
npm run test        # Run Vitest unit tests
npm run test:watch  # Run tests in watch mode
npm run lint        # Run ESLint
```

## License

MIT
