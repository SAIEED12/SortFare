'use client'

import { useState } from 'react'
import Link from 'next/link'

const faqs = [
  {
    question: 'How does SortFare work?',
    answer:
      'SortFare searches across 50+ airlines simultaneously to find flight options for your route. We show you every available fare in one view so you can compare prices, duration, and stops without jumping between tabs. When you find the right flight, we send you directly to the airline to book.',
  },
  {
    question: 'Do you charge booking fees?',
    answer:
      'No. SortFare is completely free to use and we never add service fees, markups, or hidden charges. The price you see is the price the airline charges. We make money through optional advertising, not by taking a cut of your fare.',
  },
  {
    question: 'How are flights ranked?',
    answer:
      'By default, flights are sorted by a combination of price and duration to surface the best overall value. You can re-rank results instantly by price, duration, departure time, or arrival time with a single tap. Your sort preference applies across all results.',
  },
  {
    question: 'Can I book directly through SortFare?',
    answer:
      "SortFare is a search and comparison tool — we don't process payments or handle bookings. Once you've found the right flight, clicking \"View fare\" takes you straight to the airline's website where you complete the purchase. This means no middleman, no extra fees, and full control over your booking.",
  },
  {
    question: 'What airlines do you search?',
    answer:
      'We search over 50 airlines across major international and domestic routes. This includes full-service carriers like British Airways, ANA, Air France, and Emirates, as well as budget airlines where available. Our route network covers 8 key international corridors with more being added regularly.',
  },
  {
    question: 'How does the AI assistant work?',
    answer:
      'The assistant lets you describe your trip in plain language — like "round trip from New York to London next Friday for 2 passengers" — and it searches, filters, and ranks results for you. It can also answer questions about fares, airlines, and travel options based on real-time data.',
  },
  {
    question: 'Do I need an account to search?',
    answer:
      "No account is required to search, compare, or view flights. Creating a free account lets you save preferences and keep your details handy for faster searches, but it's entirely optional.",
  },
  {
    question: 'How do I save my flight preferences?',
    answer:
      'Create a free account and your search preferences, compared flights, and sort settings are saved automatically. You can access your comparison history and favorite routes from your account dashboard at any time.',
  },
]

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-accent-600"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-ink">{faq.question}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-accent-600' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isOpen}
      >
        <p className="text-sm leading-relaxed text-slate-500">{faq.answer}</p>
      </div>
    </div>
  )
}

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState(null)

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
        Help &amp; FAQ
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
        Everything you need to know about using SortFare to find and compare flights.
      </p>

      <div className="mt-10">
        {faqs.map((faq, i) => (
          <FaqItem
            key={i}
            faq={faq}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-line bg-paper/40 p-6 text-center">
        <p className="text-sm text-slate-500">
          Still have questions?{' '}
          <Link href="/contact" className="font-semibold text-accent-600 hover:text-accent-700">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  )
}
