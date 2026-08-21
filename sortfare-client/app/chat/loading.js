export default function ChatLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <div className="flex h-[70dvh] min-h-[28rem] flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm sm:rounded-3xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
            <svg className="h-5 w-5 animate-pulse text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.669 4.097a2 2 0 0 0-2.44-2.44l-15.83 5.74a2 2 0 0 0-.17 3.75l6.3 2.53 2.53 6.3a2 2 0 0 0 3.75-.17l5.81-15.71Z" />
            </svg>
          </div>
          <p className="text-sm text-neutral-400">Loading assistant…</p>
        </div>
      </div>
    </div>
  )
}
