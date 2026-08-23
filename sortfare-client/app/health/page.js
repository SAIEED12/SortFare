import Link from 'next/link'

export default function HealthPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">&larr; Back to home</Link>

      <h1 className="mt-6 text-2xl font-bold">Health Check</h1>
      <p className="mt-1 text-sm text-gray-500">
        Verifies that the SortFare app is running.
      </p>

      <div className="mt-6 space-y-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
            <span className="font-semibold">Operational</span>
          </div>

          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-gray-500">Status</dt>
            <dd className="text-green-700">ok</dd>

            <dt className="text-gray-500">Timestamp</dt>
            <dd>{new Date().toISOString()}</dd>
          </dl>
        </div>
      </div>
    </div>
  )
}
