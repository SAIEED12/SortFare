import FlightSkeleton from '@/components/FlightSkeleton'

export default function FlightsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 space-y-2">
        <div className="h-7 w-48 animate-pulse rounded-md bg-neutral-200" />
        <div className="h-4 w-32 animate-pulse rounded-md bg-neutral-100" />
      </div>
      <FlightSkeleton />
    </div>
  )
}
