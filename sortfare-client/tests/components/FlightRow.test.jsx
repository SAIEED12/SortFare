import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FlightRow, { durationLabel, stopLabel, formatPrice } from '@/components/FlightRow'

vi.mock('@/lib/api', () => ({
  fetchBookingLinks: vi.fn().mockResolvedValue(null),
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

describe('FlightRow utilities', () => {
  it('durationLabel formats hours and minutes', () => {
    expect(durationLabel(180)).toBe('3h')
    expect(durationLabel(125)).toBe('2h 5m')
    expect(durationLabel(0)).toBe('0h')
  })

  it('stopLabel returns correct labels', () => {
    expect(stopLabel(0)).toBe('Nonstop')
    expect(stopLabel(1)).toBe('1 stop')
    expect(stopLabel(2)).toBe('2 stops')
  })

  it('formatPrice returns currency and price', () => {
    expect(formatPrice(mockFlight)).toBe('$299')
  })
})

describe('FlightRow component', () => {
  it('renders airline and flight number', () => {
    render(<FlightRow flight={mockFlight} />)
    expect(screen.getByText('Delta Air Lines')).toBeInTheDocument()
    expect(screen.getByText('DL 123')).toBeInTheDocument()
  })

  it('renders departure and arrival info', () => {
    render(<FlightRow flight={mockFlight} />)
    expect(screen.getByText(/08:00.*JFK.*→.*11:00.*ORD/)).toBeInTheDocument()
  })

  it('renders price', () => {
    render(<FlightRow flight={mockFlight} />)
    expect(screen.getByText('$299')).toBeInTheDocument()
  })

  it('renders Get deal button', () => {
    render(<FlightRow flight={mockFlight} />)
    expect(screen.getByRole('button', { name: /get deal/i })).toBeInTheDocument()
  })

  it('opens booking URL when Get deal is clicked', async () => {
    const user = userEvent.setup()
    window.open = vi.fn()
    render(<FlightRow flight={mockFlight} />)
    await user.click(screen.getByRole('button', { name: /get deal/i }))
    expect(window.open).toHaveBeenCalledWith('https://delta.com/book/123', '_blank')
  })

  it('shows layover info for connecting flights', () => {
    const connectingFlight = {
      ...mockFlight,
      stops: 1,
      segments: [
        { arrivalAirport: 'ORD' },
        { arrivalAirport: 'LAX' },
      ],
    }
    render(<FlightRow flight={connectingFlight} />)
    expect(screen.getByText(/Layover:.*ORD/)).toBeInTheDocument()
  })
})
