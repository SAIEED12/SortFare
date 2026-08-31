import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FlightFilters from '@/components/FlightFilters'

vi.mock('@heroui/react', () => ({
  Select: ({ children, 'aria-label': ariaLabel }) => (
    <div data-testid={`select-${ariaLabel}`}>
      <select aria-label={ariaLabel}>
        <option value="all">All</option>
      </select>
    </div>
  ),
  ListBox: ({ children }) => <div>{children}</div>,
  ListBoxItem: ({ children, id }) => <option value={id}>{children}</option>,
}))

const defaultFilters = {
  stops: 'all',
  airline: 'all',
  priceMin: '',
  priceMax: '',
  sortBy: 'price',
}

afterEach(() => {
  cleanup()
})

describe('FlightFilters', () => {
  it('renders all filter labels', () => {
    render(
      <FlightFilters
        filters={defaultFilters}
        updateFilter={vi.fn()}
        uniqueAirlines={['Delta', 'United']}
      />
    )
    expect(screen.getByText('Stops')).toBeInTheDocument()
    expect(screen.getByText('Airline')).toBeInTheDocument()
    expect(screen.getByText('Min Price')).toBeInTheDocument()
    expect(screen.getByText('Max Price')).toBeInTheDocument()
    expect(screen.getByText('Sort by')).toBeInTheDocument()
  })

  it('renders min and max price inputs', () => {
    render(
      <FlightFilters
        filters={defaultFilters}
        updateFilter={vi.fn()}
        uniqueAirlines={[]}
      />
    )
    expect(screen.getByLabelText('Min Price')).toBeInTheDocument()
    expect(screen.getByLabelText('Max Price')).toBeInTheDocument()
  })

  it('calls updateFilter when min price changes', async () => {
    const user = userEvent.setup()
    const updateFilter = vi.fn()
    render(
      <FlightFilters
        filters={defaultFilters}
        updateFilter={updateFilter}
        uniqueAirlines={[]}
      />
    )
    await user.type(screen.getByLabelText('Min Price'), '100')
    expect(updateFilter).toHaveBeenCalledWith('priceMin', expect.any(String))
  })

  it('calls updateFilter when max price changes', async () => {
    const user = userEvent.setup()
    const updateFilter = vi.fn()
    render(
      <FlightFilters
        filters={defaultFilters}
        updateFilter={updateFilter}
        uniqueAirlines={[]}
      />
    )
    await user.type(screen.getByLabelText('Max Price'), '500')
    expect(updateFilter).toHaveBeenCalledWith('priceMax', expect.any(String))
  })
})
