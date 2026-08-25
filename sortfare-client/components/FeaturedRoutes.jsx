import Link from 'next/link'
import { getFeaturedRouteGroups } from '@/lib/flights-server'
import FeaturedRouteSection from '@/components/FeaturedRouteSection'
import SampleDataBanner from '@/components/SampleDataBanner'

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 mb-4">
        <svg className="h-7 w-7 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-600">No featured fares right now</h2>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">
        We could not load any deals for our featured routes. Search a route to see live fares.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
      >
        Start a search
      </Link>
    </div>
  )
}

export default async function FeaturedRoutes({ origin, destination }) {
  const { groups, source } = await getFeaturedRouteGroups({ origin, destination })

  if (groups.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      {/* Only honest when nothing came back live; mixed results say so per section. */}
      {source === 'sample' ? <SampleDataBanner /> : null}
      {groups.map((group) => (
        <FeaturedRouteSection key={group.id} group={group} />
      ))}
    </>
  )
}
