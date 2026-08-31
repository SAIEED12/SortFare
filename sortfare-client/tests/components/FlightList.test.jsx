import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import FlightList from '@/components/FlightList'

vi.mock('@/context/CompareContext', () => ({
  useCompare: vi.fn(() => ({
    toggleFlight: vi.fn(),
    isSelected: vi.fn(() => false),
    isFull: false,
  })),
}))

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

describe('FlightList', () => {
  it('renders empty state when no flights', () => {
    render(<FlightList flights={[]} />)
    expect(screen.getByText('No matching flights')).toBeInTheDocument()
    expect(screen.getByText(/try adjusting your filters/i)).toBeInTheDocument()
  })

  it('renders a list of flights', () => {
    render(<FlightList flights={[mockFlight, { ...mockFlight, id: 'test-2', airline: 'United' }]} />)
    expect(screen.getByText('Delta Air Lines')).toBeInTheDocument()
    expect(screen.getByText('United')).toBeInTheDocument()
  })

  it('renders single flight', () => {
    render(<FlightList flights={[mockFlight]} />)
    expect(screen.getByText('Delta Air Lines')).toBeInTheDocument()
    expect(screen.getByText('DL 123')).toBeInTheDocument()
  })
})
