import Link from 'next/link'

const productLinks = [
  { href: '/', label: 'Home' },
  { href: '/flights', label: 'Search Flights' },
]

const accountLinks = [
  { href: '/signup', label: 'Create Account' },
  { href: '/login', label: 'Sign In' },
  { href: '/account', label: 'Account' },
]

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600 text-white">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" />
                </svg>
              </span>
              SortFare
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              Search, compare, and rank flights across airlines by price, duration, and stops.
              Book directly with the airline — no fees, ever.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Product</h3>
            <ul className="mt-3 space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-accent-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Account</h3>
            <ul className="mt-3 space-y-2">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-accent-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} SortFare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
