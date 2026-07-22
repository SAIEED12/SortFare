import Link from 'next/link'

export default async function FlightDetailPage({ params }) {
  const { id } = await params

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/flights" className="text-sm text-blue-600 hover:underline">&larr; Back to flights</Link>
      <div className="mt-6 flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-bold">Flight Detail</h1>
        <p className="mt-2 text-gray-500">
          Viewing details for flight #{id}. Compare and rank flights side by side.
        </p>
        <span className="mt-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-medium text-blue-700">
          Coming soon
        </span>
      </div>
    </div>
  )
}
