'use client'
import { useState } from 'react'
import { useCompare } from '@/context/CompareContext'
import CompareModal from '@/components/CompareModal'

export default function CompareBar() {
  const { selectedFlights, clearSelection, count } = useCompare()
  const [open, setOpen] = useState(false)

  if (count === 0) return null

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 sf-bar-slide-up">
        <div className="mx-auto max-w-4xl px-4 pb-4">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {selectedFlights.map((f) => (
                  <span
                    key={f.id}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-primary-100 text-xs font-bold text-primary-700"
                    title={`${f.airline} ${f.flightNumber}`}
                  >
                    {f.airline.charAt(0)}
                  </span>
                ))}
              </div>
              <span className="text-sm font-medium text-ink">
                {count} of 3 flights selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearSelection}
                className="cursor-pointer rounded-xl border border-line px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-paper"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(true)}
                disabled={count < 2}
                className="cursor-pointer rounded-xl bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-700 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Compare {count > 1 ? count : ''}
              </button>
            </div>
          </div>
        </div>
      </div>

      <CompareModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
