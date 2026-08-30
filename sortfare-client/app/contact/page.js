import Link from 'next/link'

const contactMethods = [
  {
    title: 'Email',
    detail: 'support@sortfare.com',
    description: 'For general questions, feedback, or support requests.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    title: 'Response Time',
    detail: 'Within 24 hours',
    description: 'We respond on business days. Weekends may take longer.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Social',
    detail: '@sortfare',
    description: 'Follow us on Twitter/X for updates and travel tips.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
]

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-accent-600 hover:text-accent-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to home
      </Link>

      <p className="sf-eyebrow mt-8">Support</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Contact Us
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
        We&apos;re a small team building a better way to search flights. We read every message.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {contactMethods.map((method) => (
          <div
            key={method.title}
            className="rounded-2xl border border-line bg-paper/40 p-6"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
              {method.icon}
            </div>
            <h3 className="mt-4 text-base font-semibold text-ink">{method.title}</h3>
            <p className="mt-1 font-mono text-sm text-accent-600">{method.detail}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{method.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-line bg-paper/40 p-6">
        <h2 className="text-lg font-semibold text-ink">Before you write</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-500">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
            Check the <Link href="/help" className="font-medium text-accent-600 hover:text-accent-700">Help &amp; FAQ</Link> — most questions are answered there.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
            Include your email if you want a reply — we can&apos;t respond to anonymous messages.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
            For booking issues, contact the airline directly — we don&apos;t handle payments or reservations.
          </li>
        </ul>
      </div>
    </div>
  )
}
