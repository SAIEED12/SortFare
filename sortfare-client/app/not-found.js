import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
        <svg
          className="h-7 w-7 text-neutral-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">Page not found</h2>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          Go home
        </Link>
        <Link
          href="/flights"
          className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-neutral-50"
        >
          Search flights
        </Link>
      </div>
    </div>
  )
}
