'use client'

export default function GlobalError({ error, reset }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
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
      <h2 className="mt-4 text-lg font-semibold text-gray-900">Something went wrong</h2>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">
        An unexpected error occurred. Your data is safe — try reloading this page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 active:scale-[0.98]"
      >
        Try again
      </button>
    </div>
  )
}
