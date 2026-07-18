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

## License

This project is licensed under the MIT License.
