import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FlightCard from '@/components/FlightCard'

vi.mock('@/lib/api', () => ({
  fetchBookingLinks: vi.fn().mockResolvedValue(null),
}))

vi.mock('@/context/CompareContext', () => ({
  useCompare: vi.fn(() => ({
    toggleFlight: vi.fn(),
    isSelected: vi.fn(() => false),
    isFull: false,
  })),
}))

const mockFlight = {
  id: 'test-1',
  airline: 'Delta Air Lines',
  flightNumber: 'DL 123',
  duration: 180,
  stops: 0,
  departure: { time: '08:00', code: 'JFK' },
  arrival: { time: '11:00', code: 'ORD' },
  price: 299,
  currency: '$',
  bookingUrl: 'https://delta.com/book/123',
}

afterEach(() => {
  cleanup()
})

describe('FlightCard', () => {
  it('renders airline name and flight number', () => {
    render(<FlightCard flight={mockFlight} />)
    expect(screen.getByText('Delta Air Lines')).toBeInTheDocument()
    expect(screen.getByText('DL 123')).toBeInTheDocument()
  })

  it('renders departure and arrival details', () => {
    render(<FlightCard flight={mockFlight} />)
    expect(screen.getByText('08:00')).toBeInTheDocument()
    expect(screen.getByText('JFK')).toBeInTheDocument()
    expect(screen.getByText('11:00')).toBeInTheDocument()
    expect(screen.getByText('ORD')).toBeInTheDocument()
  })

  it('renders price', () => {
    render(<FlightCard flight={mockFlight} />)
    expect(screen.getByText('$ 299')).toBeInTheDocument()
  })

  it('shows Nonstop for zero stops', () => {
    render(<FlightCard flight={mockFlight} />)
    expect(screen.getByText('Nonstop')).toBeInTheDocument()
  })

  it('shows stop count for connecting flights', () => {
    render(<FlightCard flight={{ ...mockFlight, stops: 1 }} />)
    expect(screen.getByText('1 stop')).toBeInTheDocument()
  })

  it('renders Details link with correct href', () => {
    render(<FlightCard flight={mockFlight} />)
    const detailsLink = screen.getByRole('link', { name: /details/i })
    expect(detailsLink).toHaveAttribute(
      'href',
      '/flights/test-1?origin=JFK&destination=ORD'
    )
  })

  it('renders Get deal button', () => {
    render(<FlightCard flight={mockFlight} />)
    expect(screen.getByRole('button', { name: /get deal/i })).toBeInTheDocument()
  })

  it('opens booking URL in new tab when Get deal is clicked', async () => {
    const user = userEvent.setup()
    window.open = vi.fn()
    render(<FlightCard flight={mockFlight} />)
    await user.click(screen.getByRole('button', { name: /get deal/i }))
    expect(window.open).toHaveBeenCalledWith(
      'https://delta.com/book/123',
      '_blank'
    )
  })

  it('shows Best fare stamp when isBest is true', () => {
    render(<FlightCard flight={mockFlight} isBest />)
    expect(screen.getByText('Best fare')).toBeInTheDocument()
  })

  it('renders compare checkbox with accessible label', () => {
    render(<FlightCard flight={mockFlight} />)
    expect(screen.getByLabelText('Compare Delta Air Lines DL 123')).toBeInTheDocument()
  })
})
