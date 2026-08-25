import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('@/components/FlightCard', () => ({
  default: ({ flight }) => (
    <div data-testid="flight-card">
      {flight.airline} {flight.currency}
      {flight.price}
    </div>
  ),
}))

import FeaturedRouteSection from '@/components/FeaturedRouteSection'

afterEach(() => {
  cleanup()
})

function group(overrides = {}) {
  return {
    id: 'JFK-ORD',
    origin: 'JFK',
    destination: 'ORD',
    originName: 'New York JFK',
    destinationName: "Chicago O'Hare",
    source: 'live',
    totalCount: 2,
    flights: [
      { id: 1, airline: 'Delta Air Lines', price: 189, currency: '$' },
      { id: 2, airline: 'United Airlines', price: 145, currency: '$' },
    ],
    ...overrides,
  }
}

describe('FeaturedRouteSection component', () => {
  it('names the section with its route heading', () => {
    render(<FeaturedRouteSection group={group()} />)

    const section = screen.getByRole('region')
    const heading = screen.getByRole('heading', { level: 2 })

    expect(heading).toHaveTextContent('JFK → ORD')
    expect(section).toHaveAttribute('aria-labelledby', heading.getAttribute('id'))
    expect(screen.getByText("New York JFK to Chicago O'Hare")).toBeInTheDocument()
  })

  it('renders a card per fare', () => {
    render(<FeaturedRouteSection group={group()} />)
    expect(screen.getAllByTestId('flight-card')).toHaveLength(2)
  })

  it('links to a real search for the route with a self-contained label', () => {
    render(<FeaturedRouteSection group={group()} />)

    const link = screen.getByRole('link', { name: /see all jfk → ord fares/i })
    expect(link).toHaveAttribute('href', '/flights?origin=JFK&destination=ORD')
  })

  it('flags sample fares only when the group did not come back live', () => {
    const { unmount } = render(<FeaturedRouteSection group={group()} />)
    expect(screen.queryByText('Sample fares')).not.toBeInTheDocument()
    unmount()

    render(<FeaturedRouteSection group={group({ source: 'sample' })} />)
    expect(screen.getByText('Sample fares')).toBeInTheDocument()
  })

  it('says how many further fares the route has, and stays silent when there are none', () => {
    const { unmount } = render(<FeaturedRouteSection group={group({ totalCount: 5 })} />)
    expect(screen.getByText('3 more fares on this route')).toBeInTheDocument()
    unmount()

    render(<FeaturedRouteSection group={group({ totalCount: 3 })} />)
    expect(screen.getByText('1 more fare on this route')).toBeInTheDocument()
    cleanup()

    render(<FeaturedRouteSection group={group()} />)
    expect(screen.queryByText(/more fare/)).not.toBeInTheDocument()
  })

  it('renders nothing for a group with no fares or a missing group', () => {
    const { container, unmount } = render(<FeaturedRouteSection group={group({ flights: [] })} />)
    expect(container).toBeEmptyDOMElement()
    unmount()

    const { container: empty } = render(<FeaturedRouteSection />)
    expect(empty).toBeEmptyDOMElement()
  })
})
