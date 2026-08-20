'use client'
// components/ToolCall.jsx
//
// FE-07: renders a tool part across its lifecycle. The four states are a
// state machine and each answers a different user question:
//
//   input-streaming  — "what is it doing?"   shimmer skeleton + partial args
//   input-available  — "with what input?"    the complete query as chips
//   output-available — "what came back?"     a real result component
//   output-error     — "what went wrong?"    a designed failure card
//
// The card frame is stable; only the body crossfades between states
// (sf-tool-phase-in) so transitions morph instead of jumping layout.
import FlightResults from '@/components/FlightResults'
import FlightRow from '@/components/FlightRow'

const TOOL_META = {
  searchFlights: {
    label: 'Flight search',
    running: 'Searching the catalog…',
    streaming: 'Reading your request…',
  },
  getFlightDetails: {
    label: 'Flight details',
    running: 'Loading flight…',
    streaming: 'Reading your request…',
  },
}

function IconMagnifier() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
    </svg>
  )
}

function IconTicket() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18v4a3 3 0 0 0 0 4v4H3V6Zm6 0v12" />
    </svg>
  )
}

function IconAlert() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z" />
    </svg>
  )
}

function IconSpinner() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4Z" />
    </svg>
  )
}

// Partial chips for input-streaming / input-available. DeepPartial may have
// fields missing, so every read is optional.
function chipsFromInput(input) {
  const chips = []
  if (input?.origin || input?.destination) {
    chips.push(`${input.origin ?? 'Any'} → ${input.destination ?? 'Any'}`)
  }
  if (input?.maxPrice != null) chips.push(`≤ $${input.maxPrice}`)
  if (input?.nonstopOnly) chips.push('Nonstop')
  else if (input?.maxStops != null) chips.push(`${input.maxStops}+ stops max`)
  if (input?.airline) chips.push(input.airline)
  if (input?.sortBy) chips.push(`sort: ${input.sortBy}`)
  return chips
}

function QueryChips({ chips }) {
  if (chips.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <span
          key={c}
          className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600"
        >
          {c}
        </span>
      ))}
    </div>
  )
}

// "What is it doing?" — skeleton lines that read as an in-flight tool call.
// Any args streamed in so far already appear as chips, so input-streaming
// morphs into input-available rather than swapping.
function StreamingBody({ chips }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <IconSpinner />
        <span>Running the tool — arguments are being read from your question…</span>
      </div>
      {chips.length > 0 && <QueryChips chips={chips} />}
      <div className="space-y-1.5" aria-hidden="true">
        <div className="h-2 w-3/4 animate-pulse rounded-full bg-neutral-200" />
        <div className="h-2 w-1/2 animate-pulse rounded-full bg-neutral-200" />
        <div className="h-2 w-2/3 animate-pulse rounded-full bg-neutral-200" />
      </div>
    </div>
  )
}

// "With what input?" — the full query the tool is about to run with.
function InputAvailableBody({ chips, running }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <IconSpinner />
        <span>{running}</span>
      </div>
      <QueryChips chips={chips} />
    </div>
  )
}

// "What went wrong?" — designed failure state, never a crash. The error
// text is server-sanitized (toUIMessageStream onError) so no internals leak.
function ErrorBody({ errorText, toolName }) {
  return (
    <div className="flex gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3">
      <span className="mt-0.5 shrink-0 text-red-500">
        <IconAlert />
      </span>
      <div className="space-y-1 text-sm">
        <p className="font-semibold text-red-800">{toolName} could not run</p>
        <p className="text-red-700">{errorText}</p>
        <p className="pt-1 text-xs leading-5 text-red-500">
          The demo catalog only covers JFK → Chicago (ORD). Ask about that route, or use the Flights
          page for live search across other city pairs.
        </p>
      </div>
    </div>
  )
}

function StatusChip({ state, count }) {
  let label = '…'
  let cls = 'bg-neutral-100 text-neutral-600'
  if (state === 'input-streaming') {
    label = 'Reading'
    cls = 'bg-neutral-100 text-neutral-600'
  } else if (state === 'input-available') {
    label = 'Running'
    cls = 'bg-primary-50 text-primary-700'
  } else if (state === 'output-available') {
    label = count != null ? `${count} results` : 'Done'
    cls = 'bg-emerald-50 text-emerald-700'
  } else if (state === 'output-error') {
    label = 'Failed'
    cls = 'bg-red-50 text-red-700'
  }
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {label}
    </span>
  )
}

export default function ToolCall({ part }) {
  const toolName = part.type.startsWith('tool-') ? part.type.slice('tool-'.length) : 'unknown'
  const meta = TOOL_META[toolName] ?? { label: toolName, running: 'Running…', streaming: 'Reading…' }

  const icon = toolName === 'getFlightDetails' ? <IconTicket /> : <IconMagnifier />

  let body
  let statusCount = null

  if (part.state === 'input-streaming') {
    body = <StreamingBody chips={chipsFromInput(part.input)} />
  } else if (part.state === 'input-available') {
    body = <InputAvailableBody chips={chipsFromInput(part.input)} running={meta.running} />
  } else if (part.state === 'output-error') {
    body = <ErrorBody errorText={part.errorText ?? 'Unknown error'} toolName={meta.label} />
  } else {
    // output-available (plus any future state falls back here defensively)
    if (toolName === 'getFlightDetails') {
      const flight = part.output?.flight
      statusCount = flight ? 1 : null
      body = flight ? (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
            Flight details
          </p>
          <FlightRow flight={flight} />
        </div>
      ) : (
        <p className="text-sm text-neutral-500">No flight returned.</p>
      )
    } else {
      const result = part.output
      const count = result?.count
      statusCount = typeof count === 'number' ? count : null
      body = result ? (
        <FlightResults result={result} />
      ) : (
        <p className="text-sm text-neutral-500">No result returned.</p>
      )
    }
  }

  return (
    <div className="my-2.5 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary-500 to-primary-700 text-white">
            {icon}
          </span>
          <span className="truncate text-xs font-semibold text-gray-900">{meta.label}</span>
        </div>
        <StatusChip state={part.state} count={statusCount} />
      </div>
      <div key={part.state} className="sf-tool-phase-in px-3 py-2.5">
        {body}
      </div>
    </div>
  )
}