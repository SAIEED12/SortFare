'use client'
// components/FlightResults.jsx
//
// FE-07: renders a searchFlights tool result as a real component — not text.
// Shows the applied query, a hand-rolled SVG price-by-airline chart, and
// compact flight rows with booking links. Also owns the designed "no
// matches" empty state (a successful run with zero results, which is
// distinct from a failed run — see ToolCall's output-error state).

import FlightRow, { durationLabel, stopLabel } from '@/components/FlightRow'

// Hand-rolled SVG: average price by airline as horizontal bars. No chart
// library — bars scale to the priciest airline in the result set.
function PriceByAirlineChart({ flights }) {
  const byAirline = flights.reduce((acc, f) => {
    acc[f.airline] = acc[f.airline] || []
    acc[f.airline].push(f.price)
    return acc
  }, {})

  const rows = Object.entries(byAirline)
    .map(([airline, prices]) => ({
      airline,
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      count: prices.length,
    }))
    .sort((a, b) => b.avg - a.avg)

  const max = Math.max(...rows.map((r) => r.avg), 1)
  const barMaxWidth = 150
  const rowH = 26

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
        Avg price by airline
      </p>
      <svg
        viewBox={`0 0 230 ${rows.length * rowH + 2}`}
        className="w-full"
        role="img"
        aria-label="Average price by airline chart"
      >
        {rows.map((r, i) => {
          const barWidth = Math.max((r.avg / max) * barMaxWidth, 3)
          const y = i * rowH + 2
          return (
            <g key={r.airline}>
              <text x="0" y={y + 11} className="fill-neutral-500" fontSize="9">
                {r.airline.split(' ')[0]}
              </text>
              <rect
                x="64"
                y={y + 2}
                width={barWidth}
                height="10"
                rx="3"
                className="fill-primary-500"
              />
              <text x={64 + barWidth + 6} y={y + 11} className="fill-gray-800" fontSize="9" fontWeight="600">
                ${r.avg}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function QueryChips({ query }) {
  const chips = []
  if (query.origin || query.destination) {
    chips.push(`${query.origin ?? 'Any'} → ${query.destination ?? 'Any'}`)
  }
  if (query.maxPrice != null) chips.push(`≤ $${query.maxPrice}`)
  if (query.nonstopOnly) chips.push('Nonstop')
  else if (query.maxStops != null) chips.push(`${query.maxStops}+ stops max`)
  if (query.airline) chips.push(query.airline)
  if (chips.length === 0) chips.push('All flights')

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

export default function FlightResults({ result }) {
  const { query, count, flights } = result
  const sortLabel =
    query.sortBy === 'duration' ? 'fastest' : query.sortBy === 'departure' ? 'earliest' : 'cheapest'

  if (count === 0 || !Array.isArray(flights) || flights.length === 0) {
    return (
      <div className="flex flex-col items-start gap-1.5 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4">
        <p className="text-sm font-semibold text-gray-800">No flights match those filters</p>
        <p className="text-xs leading-5 text-neutral-500">
          The catalog has {query.origin ?? 'flights'} → {query.destination ?? 'anywhere'} offers, but
          nothing fits your limits. Try raising the price cap or allowing stops.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {count} flight{count !== 1 ? 's' : ''}
          </span>
          <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700">
            sorted by {sortLabel}
          </span>
        </div>
      </div>

      <QueryChips query={query} />

      {flights.length > 1 && <PriceByAirlineChart flights={flights} />}

      <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-white px-3">
        {flights.map((f) => (
          <div key={f.id} className="py-2">
            <FlightRow flight={f} />
          </div>
        ))}
      </div>
    </div>
  )
}