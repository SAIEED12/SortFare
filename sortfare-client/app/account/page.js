import Link from 'next/link'

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">Account</h1>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-gray-500">
          Your session details and account settings will appear here once Better Auth is configured.
        </p>
        <Link href="/" className="mt-4 text-sm text-blue-600 hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  )
}
