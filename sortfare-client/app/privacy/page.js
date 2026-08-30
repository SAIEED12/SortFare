import Link from 'next/link'

export default function PrivacyPage() {
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

      <p className="sf-eyebrow mt-8">Legal</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-slate-500">Effective date: August 30, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-500">
        <p>
          SortFare helps you search, compare, and rank flights across airlines. This Privacy Policy
          explains what information we collect, how we use it, and what choices you have. By using
          SortFare, you agree to the practices described here.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-ink">Information We Collect</h2>
          <p className="mt-2">
            <strong className="font-medium text-ink">Account information.</strong> When you create
            an account, we collect your name and email address. You may also choose to save
            preferences such as home airport and travel habits.
          </p>
          <p className="mt-2">
            <strong className="font-medium text-ink">Search queries.</strong> When you search for
            flights, we process your origin, destination, travel dates, and number of passengers. This
            data is used to fetch relevant results and is not linked to your identity unless you are
            signed in.
          </p>
          <p className="mt-2">
            <strong className="font-medium text-ink">Usage data.</strong> We collect anonymized
            analytics such as pages visited, features used, and interaction patterns. This helps us
            improve the product and does not include personal information.
          </p>
          <p className="mt-2">
            <strong className="font-medium text-ink">Cookies.</strong> We use essential cookies to
            maintain your session and preferences. We do not use advertising cookies or cross-site
            tracking.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">How We Use Your Information</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>To fetch and display flight search results from airline databases</li>
            <li>To save your preferences and comparison history when you have an account</li>
            <li>To improve SortFare through anonymized usage analytics</li>
            <li>To communicate with you about your account or respond to support requests</li>
            <li>To detect and prevent abuse of our search infrastructure</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Information Sharing</h2>
          <p className="mt-2">
            We do not sell, rent, or trade your personal information. We share data only in these
            limited cases:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong className="font-medium text-ink">Airline redirects.</strong> When you click
              &quot;View fare,&quot; you are sent directly to the airline&apos;s website. We do not
              pass your personal information to the airline — you interact with them directly.
            </li>
            <li>
              <strong className="font-medium text-ink">Service providers.</strong> We use trusted
              infrastructure providers to run SortFare. These providers process data on our behalf
              under strict confidentiality agreements.
            </li>
            <li>
              <strong className="font-medium text-ink">Legal requirements.</strong> We may disclose
              information if required by law or to protect the safety of our users and the public.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Data Security</h2>
          <p className="mt-2">
            We use industry-standard encryption to protect data in transit and at rest. Our
            infrastructure is hosted on secure, monitored servers. While no method of transmission is
            100% secure, we take reasonable measures to protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Your Rights</h2>
          <p className="mt-2">You have the right to:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Delete your account and associated data</li>
            <li>Export your data in a portable format</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at{' '}
            <span className="font-medium text-accent-600">support@sortfare.com</span>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Children&apos;s Privacy</h2>
          <p className="mt-2">
            SortFare is not intended for users under the age of 13. We do not knowingly collect
            information from children. If you believe a child has provided us with personal data,
            please contact us and we will delete it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Changes to This Policy</h2>
          <p className="mt-2">
            We may update this policy from time to time. When we make significant changes, we will
            notify you by email or through a notice on the site. Your continued use of SortFare after
            changes take effect constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Contact</h2>
          <p className="mt-2">
            For questions about this policy, reach out at{' '}
            <span className="font-medium text-accent-600">support@sortfare.com</span> or visit our{' '}
            <Link href="/contact" className="font-medium text-accent-600 hover:text-accent-700">
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
