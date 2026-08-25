'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from '@/lib/auth-client'

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/flights', label: 'Flights' },
  { href: '/chat', label: 'Assistant' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  async function handleSignOut() {
    await signOut()
    setOpen(false)
  }

  const authLinks = session
    ? [
        ...publicLinks,
        { href: '/saved', label: 'Saved' },
        { href: '/account', label: 'Account' },
      ]
    : [
        ...publicLinks,
        { href: '/login', label: 'Sign In' },
        { href: '/signup', label: 'Sign Up' },
      ]

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-line bg-surface/85 px-4 py-2.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-surface/70">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600 text-white">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" />
            </svg>
          </span>
          SortFare
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-7" aria-label="Main navigation">
          {authLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-accent-600 ${
                isActive(link.href) ? 'text-accent-600' : 'text-slate-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <button
              type="button"
              onClick={handleSignOut}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-accent-600"
            >
              Sign Out
            </button>
          )}
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-slate-600 transition-colors hover:bg-paper lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="mx-auto mt-2 max-w-6xl lg:hidden" aria-label="Mobile navigation">
          <div className="space-y-1 rounded-2xl border border-line bg-surface px-4 pb-3 pt-2 shadow-sm">
            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-paper ${
                  isActive(link.href) ? 'text-accent-600' : 'text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <button
                type="button"
                onClick={handleSignOut}
                className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-paper"
              >
                Sign Out
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
