'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { useSavedFlights } from '@/lib/savedFlights/store'

export default function SaveButton({ flight }) {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const userId = session?.user?.id

  const isSaved = useSavedFlights((s) => Boolean(s.ids?.[flight.id]))
  const toggleSave = useSavedFlights((s) => s.toggleSave)
  const hydrate = useSavedFlights((s) => s.hydrate)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (userId) hydrate(userId)
  }, [userId, hydrate])

  const handleClick = () => {
    if (!userId && !isPending) {
      setAnnouncement('Sign in to save flights')
      router.push('/login')
      return
    }
    if (!userId) return

    toggleSave(userId, flight)
    setAnnouncement(isSaved ? 'Removed from saved' : 'Flight saved')
  }

  const label = isSaved ? 'Remove from saved' : 'Save flight'

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={isSaved}
        aria-label={label}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill={isSaved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L7 21V5z"
          />
        </svg>
        {isSaved ? 'Saved' : 'Save'}
      </button>
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </>
  )
}
