import { NextResponse } from 'next/server'
import { getFeaturedRouteGroups, clearFeaturedCache } from '@/lib/flights-server'

export async function GET() {
  clearFeaturedCache()
  const { groups, source } = await getFeaturedRouteGroups()
  return NextResponse.json({
    source,
    groups: groups.map((g) => ({
      id: g.id,
      source: g.source,
      totalCount: g.totalCount,
      shown: g.flights.length,
      ids: g.flights.map((f) => f.id),
      prices: g.flights.map((f) => f.price),
    })),
  })
}
