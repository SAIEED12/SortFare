import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold text-center">Create Account</h1>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-gray-500">
          Create an account to save and rank flights. Sign-up will be wired to Better Auth in a later phase.
        </p>
        <Link href="/" className="mt-4 text-sm text-blue-600 hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  )
}
