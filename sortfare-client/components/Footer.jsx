import Link from 'next/link'

const productLinks = [
  { href: '/', label: 'Home' },
  { href: '/flights', label: 'Search Flights' },
  { href: '/saved', label: 'Saved Flights' },
]

const accountLinks = [
  { href: '/signup', label: 'Create Account' },
  { href: '/login', label: 'Sign In' },
  { href: '/account', label: 'Account' },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
              SortFare
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
              Search, compare, and rank flights across airlines by price, duration, and stops.
              Book directly with the airline — no fees, ever.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
            <ul className="mt-3 space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Account</h3>
            <ul className="mt-3 space-y-2">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} SortFare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
