import Link from 'next/link'

export default function TermsPage() {
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
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-slate-500">Effective date: August 30, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-500">
        <p>
          Welcome to SortFare. These Terms of Service govern your use of our website, search tools,
          and AI assistant. By accessing or using SortFare, you agree to be bound by these terms.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-ink">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By using SortFare, you confirm that you are at least 13 years old and agree to comply
            with these Terms. If you do not agree, you may not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">2. Use of the Service</h2>
          <p className="mt-2">
            SortFare is a flight search and comparison tool. You may use it to search for flights,
            compare fares across airlines, sort results by various criteria, and interact with our AI
            travel assistant. The service is provided as-is and is available without charge.
          </p>
          <p className="mt-2">
            You agree not to:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Use automated scripts, bots, or scrapers to access or collect data from SortFare</li>
            <li>Attempt to bypass rate limits, authentication, or security measures</li>
            <li>Reproduce, distribute, or create derivative works from our content or code</li>
            <li>Use the service for any unlawful purpose or in violation of any applicable laws</li>
            <li>Interfere with or disrupt the infrastructure supporting SortFare</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">3. Account Registration</h2>
          <p className="mt-2">
            Creating an account is optional. If you do create one, you are responsible for
            maintaining the confidentiality of your credentials and for all activity that occurs
            under your account. You agree to notify us immediately if you suspect unauthorized
            access.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">4. Airline Bookings</h2>
          <p className="mt-2">
            SortFare does not process payments, complete bookings, or act as a travel agent. When
            you select a flight, you are redirected to the airline&apos;s own website or booking
            platform. Your transaction is solely between you and the airline.
          </p>
          <p className="mt-2">
            We are not responsible for the accuracy of information on airline websites, changes to
            fares after redirection, or any issues arising from your booking with an airline.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">5. Pricing &amp; Availability</h2>
          <p className="mt-2">
            Flight fares and availability shown on SortFare are pulled from airline databases in
            real time. Prices may change at any time and are not guaranteed until you complete a
            booking on the airline&apos;s site. We display the most recent data we receive, but
            brief delays may occur.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">6. AI Assistant</h2>
          <p className="mt-2">
            The AI assistant provides flight search assistance based on the data available to it.
            Responses are generated algorithmically and may occasionally be inaccurate. Always verify
            important details — such as dates, prices, and routing — before booking.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">7. Intellectual Property</h2>
          <p className="mt-2">
            SortFare owns all rights to its platform, design, code, and original content. Airline
            names, logos, and fare data are the property of their respective owners and are used for
            identification purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">8. Limitation of Liability</h2>
          <p className="mt-2">
            SortFare is a search tool, not a booking agent. We are not liable for any losses
            arising from your use of or reliance on the service, including but not limited to fare
            discrepancies, booking errors, travel disruptions, or decisions made based on search
            results. Your sole remedy for dissatisfaction is to stop using the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">9. Termination</h2>
          <p className="mt-2">
            We reserve the right to suspend or terminate your access to SortFare at our discretion,
            without notice, if we believe you are violating these Terms or misusing the service.
            Upon termination, your right to use SortFare ceases immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">10. Governing Law</h2>
          <p className="mt-2">
            These Terms are governed by and construed in accordance with the laws of the United
            States. Any disputes arising under these terms shall be resolved in the courts of
            competent jurisdiction within the United States.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Changes to These Terms</h2>
          <p className="mt-2">
            We may update these Terms from time to time. When we make material changes, we will
            notify you via email or a notice on the site. Continued use of SortFare after changes
            take effect constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Contact</h2>
          <p className="mt-2">
            Questions about these Terms? Contact us at{' '}
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
