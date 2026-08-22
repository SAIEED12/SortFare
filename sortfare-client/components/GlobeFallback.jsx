export default function GlobeFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900">
      <div className="relative flex flex-col items-center text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full border border-primary-400/20 bg-primary-500/10">
          <svg
            className="h-20 w-20 text-primary-300/60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={0.8}
          >
            <circle cx="12" cy="12" r="10" />
            <ellipse cx="12" cy="12" rx="4" ry="10" />
            <path d="M2 12h20" />
            <path d="M4 7h16" />
            <path d="M4 17h16" />
          </svg>
        </div>
        <p className="text-sm font-medium text-primary-200">
          Interactive 3D globe
        </p>
        <p className="mt-1 text-xs text-primary-300/60">
          Enable JavaScript for the full experience
        </p>
      </div>
    </div>
  )
}
