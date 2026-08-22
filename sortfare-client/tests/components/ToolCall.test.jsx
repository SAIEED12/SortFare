import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('@/components/FlightResults', () => ({
  default: ({ result }) => (
    <div data-testid="flight-results">
      {result.count} flights found
    </div>
  ),
}))

vi.mock('@/components/FlightRow', () => ({
  default: ({ flight }) => (
    <div data-testid="flight-row">
      {flight.airline} {flight.flightNumber}
    </div>
  ),
}))

import ToolCall from '@/components/ToolCall'

afterEach(() => {
  cleanup()
})

describe('ToolCall component', () => {
  it('renders streaming body with skeleton for input-streaming state', () => {
    render(
      <ToolCall
        part={{
          type: 'tool-searchFlights',
          state: 'input-streaming',
          input: { origin: 'JFK', destination: 'ORD' },
        }}
      />,
    )
    expect(screen.getByText(/Running the tool/)).toBeInTheDocument()
    expect(screen.getByText('JFK → ORD')).toBeInTheDocument()
  })

  it('renders running status with chips for input-available state', () => {
    render(
      <ToolCall
        part={{
          type: 'tool-searchFlights',
          state: 'input-available',
          input: { origin: 'JFK', destination: 'ORD', maxPrice: 200 },
        }}
      />,
    )
    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByText('JFK → ORD')).toBeInTheDocument()
    expect(screen.getByText('≤ $200')).toBeInTheDocument()
  })

  it('renders error card for output-error state', () => {
    render(
      <ToolCall
        part={{
          type: 'tool-searchFlights',
          state: 'output-error',
          errorText: 'Flight id not found',
        }}
      />,
    )
    expect(screen.getByText('Flight search could not run')).toBeInTheDocument()
    expect(screen.getByText('Flight id not found')).toBeInTheDocument()
  })

  it('renders FlightResults for searchFlights output-available', () => {
    render(
      <ToolCall
        part={{
          type: 'tool-searchFlights',
          state: 'output-available',
          output: { count: 3, flights: [] },
        }}
      />,
    )
    expect(screen.getByTestId('flight-results')).toBeInTheDocument()
    expect(screen.getByText('3 flights found')).toBeInTheDocument()
  })

  it('renders FlightRow for getFlightDetails output-available', () => {
    render(
      <ToolCall
        part={{
          type: 'tool-getFlightDetails',
          state: 'output-available',
          output: { flight: { airline: 'United', flightNumber: 'UA123' } },
        }}
      />,
    )
    expect(screen.getByTestId('flight-row')).toBeInTheDocument()
    expect(screen.getByText('United UA123')).toBeInTheDocument()
  })

  it('renders link and content for fetchUrl output-available', () => {
    render(
      <ToolCall
        part={{
          type: 'tool-fetchUrl',
          state: 'output-available',
          output: {
            url: 'https://example.com',
            title: 'Example Page',
            content: 'Page content here',
            success: true,
          },
        }}
      />,
    )
    expect(screen.getByText('Example Page')).toBeInTheDocument()
    expect(screen.getByText('Page content here')).toBeInTheDocument()
  })
})
