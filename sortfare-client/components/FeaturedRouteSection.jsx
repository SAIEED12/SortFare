import Link from 'next/link'
import FlightCard from '@/components/FlightCard'

export default function FeaturedRouteSection({ group }) {
  if (!group?.flights?.length) return null

  const headingId = `featured-${group.id}`
  const route = `${group.origin} → ${group.destination}`
  const more = group.totalCount - group.flights.length

  return (
    <section aria-labelledby={headingId} className="mb-10 last:mb-0">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id={headingId} className="text-lg font-semibold text-gray-900">
            {route}
            {group.source === 'sample' ? (
              <span className="ml-2 inline-block align-middle rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                Sample fares
              </span>
            ) : null}
          </h2>
          <p className="text-sm text-gray-500">
            {group.originName} to {group.destinationName}
          </p>
        </div>

        <Link
          href={`/flights?origin=${group.origin}&destination=${group.destination}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          <span aria-hidden="true">See all</span>
          <span className="sr-only">{`See all ${route} fares`}</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {group.flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>

      {more > 0 ? (
        <p className="mt-2 text-xs text-gray-500">
          {more} more {more === 1 ? 'fare' : 'fares'} on this route
        </p>
      ) : null}
    </section>
  )
}
