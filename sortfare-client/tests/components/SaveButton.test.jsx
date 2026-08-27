import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/lib/auth-client', () => ({
  useSession: vi.fn(),
}))

const pushMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

import { useSession } from '@/lib/auth-client'
import { useSavedFlights } from '@/lib/savedFlights/store'
import SaveButton from '@/components/SaveButton'

const VALID_FLIGHT = {
  id: 'off_123',
  airline: 'Duffel Airways',
  price: 123.45,
  currency: 'GBP',
  duration: 630,
  stops: 0,
  departure: { time: '09:00', code: 'LHR' },
  arrival: { time: '19:30', code: 'JFK' },
  bookingUrl: null,
}

function fetchMockOk() {
  return vi.fn(async (_url, opts) => {
    const method = opts?.method || 'GET'
    if (method === 'GET') return { ok: true, status: 200, json: async () => ({ flights: [], count: 0 }) }
    if (method === 'POST') {
      return { ok: true, status: 201, json: async () => ({ userId: 'u1', flightId: VALID_FLIGHT.id, flight: VALID_FLIGHT }) }
    }
    return { ok: true, status: 204, json: async () => ({}) }
  })
}

beforeEach(() => {
  useSavedFlights.setState({ flights: [], ids: {}, status: 'idle', error: null })
  pushMock.mockClear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('SaveButton', () => {
  it('renders an unpressed Save control with an accessible label', () => {
    useSession.mockReturnValue({ data: { user: { id: 'u1' } }, isPending: false })
    vi.stubGlobal('fetch', fetchMockOk())

    render(<SaveButton flight={VALID_FLIGHT} />)

    const button = screen.getByRole('button', { name: /save flight/i })
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('toggles to saved state and announces the change (aria-live)', async () => {
    useSession.mockReturnValue({ data: { user: { id: 'u1' } }, isPending: false })
    vi.stubGlobal('fetch', fetchMockOk())
    const user = userEvent.setup()

    render(<SaveButton flight={VALID_FLIGHT} />)
    await user.click(screen.getByRole('button', { name: /save flight/i }))

    const saved = await screen.findByRole('button', { name: /remove from saved/i })
    expect(saved).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Flight saved')).toBeInTheDocument()
  })

  it('redirects unauthenticated users to sign in instead of saving', async () => {
    useSession.mockReturnValue({ data: null, isPending: false })
    const user = userEvent.setup()

    render(<SaveButton flight={VALID_FLIGHT} />)
    await user.click(screen.getByRole('button', { name: /save flight/i }))

    expect(pushMock).toHaveBeenCalledWith('/login')
    expect(screen.getByText('Sign in to save flights')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save flight/i })).toHaveAttribute('aria-pressed', 'false')
  })
})
