'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from '@/lib/auth-client'
import { Skeleton } from '@heroui/react'

function getInitials(name, email) {
  if (name && name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }
  return (email?.[0] || '?').toUpperCase()
}

export default function AccountPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login')
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="sf-card overflow-hidden">
          <div className="flex items-center gap-4 border-b border-line bg-primary-50/40 px-6 py-6">
            <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-3 w-56 rounded-md" />
            </div>
          </div>
          <div className="grid gap-4 px-6 py-6 sm:grid-cols-2">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!session) return null

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  const user = session.user || {}
  const initials = getInitials(user.name, user.email)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="sf-card overflow-hidden">
        {/* Header band */}
        <div className="flex items-center gap-4 border-b border-line bg-primary-50/40 px-6 py-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-600 text-lg font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="sf-eyebrow">Account</p>
            <h1 className="truncate text-xl font-bold text-ink">
              {user.name || 'Traveler'}
            </h1>
            <p className="truncate text-sm text-slate-500">{user.email || '—'}</p>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-paper/50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Name
              </dt>
              <dd className="mt-1 font-mono text-sm text-ink">{user.name || '—'}</dd>
            </div>
            <div className="rounded-xl border border-line bg-paper/50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </dt>
              <dd className="mt-1 font-mono text-sm text-ink">{user.email || '—'}</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400">Signed in to SortFare</p>
            <button
              type="button"
              onClick={handleSignOut}
              className="cursor-pointer rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="sf-barcode" aria-hidden="true" />
      </div>
    </div>
  )
}
