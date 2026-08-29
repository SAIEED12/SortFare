'use client'

import Link from 'next/link'

export default function FlightsError({ error, reset }) {
  const isNetwork =
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('NetworkError') ||
    error?.name === 'TypeError'

  return (
    <div
      role="alert"
      className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
        <svg
          className="h-7 w-7 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0 3.75h.008M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        {isNetwork ? 'Unable to connect' : 'Failed to load flights'}
      </h2>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">
        {isNetwork
          ? 'Check your internet connection and try again.'
          : 'Something went wrong while fetching flight data. Please try again.'}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 active:scale-[0.98]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-neutral-50"
        >
          New search
        </Link>
      </div>
    </div>
  )
}
