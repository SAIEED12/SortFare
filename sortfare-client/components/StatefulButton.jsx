'use client'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

const IDLE = 'idle'
const LOADING = 'loading'
const SUCCESS = 'success'
const ERROR = 'error'

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      if (state.status === LOADING) return state
      return { status: LOADING }
    case 'RESOLVE':
      if (state.status !== LOADING) return state
      return { status: SUCCESS }
    case 'REJECT':
      if (state.status !== LOADING) return state
      return { status: ERROR, error: action.error }
    case 'RESET':
      return { status: IDLE }
    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Color variants — shared motion language
// ---------------------------------------------------------------------------

const COLORS = {
  primary: {
    idle: 'bg-accent-600 text-white',
    loading: 'bg-accent-600 text-white',
    success: 'bg-best-600 text-white',
    error: 'bg-red-600 text-white',
    disabled: 'bg-accent-400/50 text-white/70 cursor-not-allowed',
  },
  danger: {
    idle: 'bg-red-600 text-white',
    loading: 'bg-red-600 text-white',
    success: 'bg-best-600 text-white',
    error: 'bg-red-700 text-white ring-2 ring-red-300',
    disabled: 'bg-red-400/50 text-white/70 cursor-not-allowed',
  },
}

// ---------------------------------------------------------------------------
// Spinner (Framer-animated)
// ---------------------------------------------------------------------------

function Spinner({ reducedMotion }) {
  return (
    <motion.svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      animate={reducedMotion ? {} : { rotate: 360 }}
      transition={
        reducedMotion
          ? {}
          : { repeat: Infinity, duration: 0.8, ease: 'linear' }
      }
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
      />
    </motion.svg>
  )
}

// ---------------------------------------------------------------------------
// Checkmark (Framer path draw)
// ---------------------------------------------------------------------------

function Checkmark({ reducedMotion }) {
  return (
    <motion.svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </motion.svg>
  )
}

// ---------------------------------------------------------------------------
// Error icon
// ---------------------------------------------------------------------------

function ErrorIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Label content per state
// ---------------------------------------------------------------------------

function LabelContent({ status, children, reducedMotion }) {
  const content = (() => {
    switch (status) {
      case LOADING:
        return (
          <span key="loading" className="inline-flex items-center gap-2">
            <Spinner reducedMotion={reducedMotion} />
            <span>Sending…</span>
          </span>
        )
      case SUCCESS:
        return (
          <span key="success" className="inline-flex items-center gap-2">
            <Checkmark reducedMotion={reducedMotion} />
            <span>Sent!</span>
          </span>
        )
      case ERROR:
        return (
          <span key="error" className="inline-flex items-center gap-2">
            <ErrorIcon />
            <span>Retry</span>
          </span>
        )
      default:
        return <span key="idle">{children}</span>
    }
  })()

  return (
    <AnimatePresence mode="wait">
      {content}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// Screen reader live region
// ---------------------------------------------------------------------------

const ANNOUNCEMENTS = {
  [IDLE]: '',
  [LOADING]: 'Sending…',
  [SUCCESS]: 'Sent successfully',
  [ERROR]: 'Failed to send. Click to retry.',
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function StatefulButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}) {
  const [state, dispatch] = useReducer(reducer, { status: IDLE })
  const shouldReduceMotion = useReducedMotion()
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const { status } = state
  const isLoading = status === LOADING
  const isDisabled = disabled || isLoading

  // Auto-reset success → idle after 2s
  useEffect(() => {
    if (status !== SUCCESS) return
    const t = setTimeout(() => {
      if (mountedRef.current) dispatch({ type: 'RESET' })
    }, 2000)
    return () => clearTimeout(t)
  }, [status])

  const handleClick = useCallback(
    async (e) => {
      if (isDisabled) return

      // If in error or success state, reset first
      if (status === ERROR || status === SUCCESS) {
        dispatch({ type: 'RESET' })
      }

      dispatch({ type: 'LOAD' })
      try {
        await onClick?.(e)
        if (mountedRef.current) dispatch({ type: 'RESOLVE' })
      } catch (err) {
        if (mountedRef.current) dispatch({ type: 'REJECT', error: err })
      }
    },
    [onClick, isDisabled, status],
  )

  // --- Framer animation variants ---

  // All motion variants in one object for the button
  const variants = {
    idle: shouldReduceMotion
      ? {}
      : {
          scale: 1,
          y: 0,
          x: 0,
        },
    hover: shouldReduceMotion
      ? {}
      : {
          scale: 1.02,
          y: -1,
          x: 0,
        },
    tap: shouldReduceMotion
      ? {}
      : {
          scale: 0.97,
          y: 0,
          x: 0,
        },
    shake: shouldReduceMotion
      ? {}
      : {
          x: [0, -5, 5, -3, 3, -1, 0],
          transition: {
            duration: 0.5,
            ease: [0.36, 0.07, 0.19, 0.97],
          },
        },
  }

  // Determine which animation state to use
  const animate = status === ERROR ? 'shake' : 'idle'

  const bgColor = (() => {
    if (isDisabled && status === IDLE) return COLORS[variant].disabled
    switch (status) {
      case LOADING:
        return COLORS[variant].loading
      case SUCCESS:
        return COLORS[variant].success
      case ERROR:
        return COLORS[variant].error
      default:
        return COLORS[variant].idle
    }
  })()

  return (
    <>
      <motion.button
        type="button"
        disabled={isDisabled}
        onClick={handleClick}
        aria-busy={isLoading || undefined}
        aria-disabled={isDisabled || undefined}
        className={[
          'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold shadow-sm outline-none',
          'focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          bgColor,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        variants={variants}
        initial="idle"
        animate={animate}
        whileHover={isDisabled ? undefined : 'hover'}
        whileTap={isDisabled ? undefined : 'tap'}
        transition={{
          scale: { type: 'spring', stiffness: 400, damping: 25 },
          x: { duration: 0.5, ease: [0.36, 0.07, 0.19, 0.97] },
        }}
      >
        <LabelContent status={status} reducedMotion={shouldReduceMotion}>
          {children}
        </LabelContent>
      </motion.button>

      {/* Screen reader announcement */}
      <span className="sr-only" role="status" aria-live="polite">
        {ANNOUNCEMENTS[status]}
      </span>
    </>
  )
}
