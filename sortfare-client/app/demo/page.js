'use client'
import { useState, useCallback } from 'react'
import StatefulButton from '@/components/StatefulButton'

// ---------------------------------------------------------------------------
// Fake async call — random delay 800–2000ms, configurable failure rate
// ---------------------------------------------------------------------------

function fakeAsync(failureRate = 0.2) {
  return new Promise((resolve, reject) => {
    const delay = 800 + Math.random() * 1200
    setTimeout(() => {
      if (Math.random() < failureRate) {
        reject(new Error('Simulated network error'))
      } else {
        resolve()
      }
    }, delay)
  })
}

// ---------------------------------------------------------------------------
// Design notes
// ---------------------------------------------------------------------------

const NOTES = [
  {
    label: 'Hover',
    duration: '150ms',
    easing: 'ease-out',
    rationale:
      'Fast enough to feel instant. Ease-out prevents overshoot — the button lifts subtly without bouncing.',
  },
  {
    label: 'Press',
    duration: '100ms',
    easing: 'spring (stiffness: 400, damping: 25)',
    rationale:
      'Quick squeeze confirms the click registered. Spring physics give a natural settle.',
  },
  {
    label: 'Label crossfade',
    duration: '200ms',
    easing: '[0.4, 0, 0.2, 1] (Material standard)',
    rationale:
      'Old label slides up and fades, new label slides in from below. The cubic-bezier matches Material Design\'s standard curve for a familiar feel.',
  },
  {
    label: 'Width morph',
    duration: '300ms',
    easing: 'spring (stiffness: 300, damping: 30)',
    rationale:
      'Button reshapes to fit the spinner. Spring prevents the awkward overshoot of a naive CSS width transition.',
  },
  {
    label: 'Spinner',
    duration: '800ms',
    easing: 'linear',
    rationale:
      'Steady, predictable cadence. Linear rotation communicates "working" without drawing attention.',
  },
  {
    label: 'Checkmark draw',
    duration: '400ms',
    easing: 'ease-out',
    rationale:
      'SVG pathLength animates from 0→1. Ease-out makes the draw feel decisive — a quick confirmation.',
  },
  {
    label: 'Shake (error)',
    duration: '500ms',
    easing: '[0.36, 0.07, 0.19, 0.97]',
    rationale:
      'Decaying x-axis oscillation (±5px → ±3px → ±1px → 0). The custom bezier mimics real-world friction.',
  },
  {
    label: 'Success → idle',
    duration: '2s pause + 300ms',
    easing: 'ease-in-out',
    rationale:
      '2-second pause lets the user register success. The fade back is gentle — no jarring snap.',
  },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DemoPage() {
  const [mode, setMode] = useState('auto')

  const makeHandler = useCallback(
    (failRate) => async () => {
      const rate = mode === 'force-success' ? 0 : mode === 'force-error' ? 1 : failRate
      await fakeAsync(rate)
    },
    [mode],
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center">
        <span className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          FE-AA1 · Week 6
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Buttons with a Brain
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
          Motion &amp; state micro-interactions — a button that communicates what&apos;s
          happening at every moment, without a single abrupt swap.
        </p>
      </div>

      {/* Demo area */}
      <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-sm font-semibold text-gray-900">Interactive Demo</h2>
        <p className="mt-1 text-sm text-gray-500">
          Click the buttons to trigger the full state cycle. Change the mode to force outcomes.
        </p>

        {/* Mode selector */}
        <div className="mt-5 flex flex-wrap gap-3">
          {[
            { value: 'auto', label: 'Auto (20% fail)' },
            { value: 'force-success', label: 'Force success' },
            { value: 'force-error', label: 'Force error' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === opt.value
                  ? 'border-primary-300 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="demo-mode"
                value={opt.value}
                checked={mode === opt.value}
                onChange={() => setMode(opt.value)}
                className="sr-only"
              />
              <span
                className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 ${
                  mode === opt.value ? 'border-primary-600' : 'border-gray-300'
                }`}
              >
                {mode === opt.value && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                )}
              </span>
              {opt.label}
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <StatefulButton
            onClick={makeHandler(0.2)}
            variant="primary"
          >
            Send Message
          </StatefulButton>

          <StatefulButton
            onClick={makeHandler(0.15)}
            variant="danger"
          >
            Deploy to Production
          </StatefulButton>
        </div>
      </div>

      {/* States reference */}
      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-sm font-semibold text-gray-900">States</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { name: 'Idle', desc: 'Default state. Label visible, ready for interaction.' },
            { name: 'Hover', desc: 'Subtle lift (scale 1.02, y -1px). Confirms the cursor is on target.' },
            { name: 'Focus', desc: 'Blue ring appears for keyboard navigation. Slight scale for feedback.' },
            { name: 'Pressed', desc: 'Quick squeeze (scale 0.97). Instant click acknowledgment.' },
            { name: 'Loading', desc: 'Label slides out, spinner slides in, width morphs. aria-busy set.' },
            { name: 'Success', desc: 'Green flash + checkmark SVG draw. Returns to idle after 2s.' },
            { name: 'Error', desc: 'Red flash + shake animation. Shows "Retry" label until next click.' },
            { name: 'Disabled', desc: 'Muted colors, pointer-events none. Used when parent decides.' },
          ].map((s) => (
            <div key={s.name} className="flex gap-3 rounded-lg bg-gray-50 p-3">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary-400" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                <p className="mt-0.5 text-xs text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Design notes */}
      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-sm font-semibold text-gray-900">Design Notes</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Every duration and easing was chosen deliberately. Hover and press are fast (100–150ms)
          so the button feels responsive. State transitions (loading, success, error) use 200–400ms
          with Material&apos;s standard cubic-bezier to feel familiar. The width morph uses Framer
          Motion&apos;s spring physics to avoid the awkward overshoot of a naive CSS transition.
          The error shake uses a custom bezier that mimics real-world friction decay. All animations
          use compositor-friendly properties (transform, opacity) — no layout thrash.
        </p>

        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-2.5 font-semibold text-gray-700">Transition</th>
                <th className="px-4 py-2.5 font-semibold text-gray-700">Duration</th>
                <th className="px-4 py-2.5 font-semibold text-gray-700">Easing</th>
                <th className="hidden px-4 py-2.5 font-semibold text-gray-700 sm:table-cell">Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {NOTES.map((n) => (
                <tr key={n.label} className="group">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{n.label}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-600">{n.duration}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-600">{n.easing}</td>
                  <td className="hidden px-4 py-2.5 text-xs text-gray-500 sm:table-cell">
                    {n.rationale}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accessibility */}
      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-sm font-semibold text-gray-900">Accessibility</h2>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
            Native <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">{'<button>'}</code> element — not a div. Full keyboard support out of the box.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">focus-visible</code> ring — blue outline appears only for keyboard navigation, not mouse clicks.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">aria-busy</code> set during loading so screen readers announce the button is processing.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">{'aria-live="polite"'}</code> region announces state changes: &ldquo;Sending…&rdquo;, &ldquo;Sent successfully&rdquo;, &ldquo;Failed to send&rdquo;.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">prefers-reduced-motion</code> — all transform/scale motion removed. Color changes preserved (color is not motion).
          </li>
        </ul>
      </div>
    </div>
  )
}
