'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { useSavedFlights } from '@/lib/savedFlights/store'
import FlightCard from '@/components/FlightCard'

export default function SavedPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const userId = session?.user?.id
  const { flights, status, hydrate } = useSavedFlights()

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login')
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (userId) hydrate(userId)
  }, [userId, hydrate])

  if (isPending) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold">Saved Flights</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-500">Loading…</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const isEmpty = status === 'ready' && flights.length === 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">Saved Flights</h1>
      <p className="mt-1 text-sm text-slate-500">
        {status === 'ready' ? `${flights.length} flight${flights.length !== 1 ? 's' : ''} saved` : ' '}
      </p>

      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-500">Loading your saved flights…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-red-600">Could not load saved flights. Please try again.</p>
          <button
            type="button"
            onClick={() => userId && hydrate(userId)}
            className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      )}

      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-500">
            You haven&apos;t saved any flights yet. Tap &ldquo;Save&rdquo; on any flight to keep it here.
          </p>
          <Link href="/flights" className="mt-4 text-sm text-blue-600 hover:underline">
            Search for flights
          </Link>
        </div>
      )}

      {status === 'ready' && flights.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {flights.map((entry) => (
            <FlightCard key={entry.flightId} flight={entry.flight} />
          ))}
        </div>
      )}
    </div>
  )
}
