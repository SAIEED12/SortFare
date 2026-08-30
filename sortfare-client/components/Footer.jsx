import Link from 'next/link'

const productLinks = [
  { href: '/', label: 'Home' },
  { href: '/flights', label: 'Flights' },
  { href: '/chat', label: 'Assistant' },
]

const accountLinks = [
  { href: '/signup', label: 'Create Account' },
  { href: '/login', label: 'Sign In' },
  { href: '/account', label: 'Account' },
]

const supportLinks = [
  { href: '/help', label: 'Help & FAQ' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-accent-500 bg-accent-600">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-accent-600">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" />
                </svg>
              </span>
              SortFare
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-accent-100">
              Search, compare, and rank flights across airlines by price, duration, and stops.
              Book directly with the airline — no fees, ever.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Product</h3>
            <ul className="mt-3 space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-accent-100 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Account</h3>
            <ul className="mt-3 space-y-2">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-accent-100 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Support</h3>
            <ul className="mt-3 space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-accent-100 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-accent-500 pt-6">
          <p className="text-xs text-accent-200">
            &copy; {new Date().getFullYear()} SortFare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
