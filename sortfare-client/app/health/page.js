import Link from 'next/link'

async function checkHealth() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  const url = `${apiUrl}/health`
  const start = Date.now()

  try {
    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(5000) })
    const data = await res.json()
    return {
      status: res.ok ? 'ok' : 'error',
      apiUrl,
      responseTime: Date.now() - start,
      data,
      error: null,
    }
  } catch (err) {
    return {
      status: 'error',
      apiUrl,
      responseTime: Date.now() - start,
      data: null,
      error: err.message || 'API unreachable',
    }
  }
}

export default async function HealthPage() {
  const result = await checkHealth()

  const isOk = result.status === 'ok'

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">&larr; Back to home</Link>

      <h1 className="mt-6 text-2xl font-bold">Health Check</h1>
      <p className="mt-1 text-sm text-gray-500">
        Verifies connectivity between this Next.js app and the external SortFare API.
      </p>

      <div className="mt-6 space-y-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className={`inline-block h-3 w-3 rounded-full ${isOk ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-semibold">{isOk ? 'Operational' : 'Degraded'}</span>
          </div>

          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-gray-500">Status</dt>
            <dd className={isOk ? 'text-green-700' : 'text-red-700'}>{result.status}</dd>

            <dt className="text-gray-500">API URL</dt>
            <dd className="font-mono text-xs">{result.apiUrl}</dd>

            <dt className="text-gray-500">Response time</dt>
            <dd>{result.responseTime}ms</dd>

            <dt className="text-gray-500">Timestamp</dt>
            <dd>{new Date().toISOString()}</dd>
          </dl>
        </div>

        {result.data && (
          <div className="rounded-lg border p-4">
            <h2 className="text-sm font-semibold mb-2">API Response</h2>
            <pre className="overflow-x-auto rounded bg-gray-50 p-3 text-xs">{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        )}

        {result.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4" role="alert">
            <h2 className="text-sm font-semibold text-red-700">Error</h2>
            <p className="mt-1 text-sm text-red-600">{result.error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
