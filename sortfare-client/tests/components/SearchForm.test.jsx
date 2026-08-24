import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@heroui/react', async () => {
  const actual = await vi.importActual('@heroui/react')
  return {
    ...actual,
    Select: ({ children, selectedKey, onSelectionChange, ...props }) => (
      <div data-testid="select-mock">
        <select
          data-testid="passengers-select"
          value={selectedKey || ''}
          onChange={(e) => onSelectionChange?.(e.target.value)}
          aria-label="Passengers"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={String(n)}>
              {n} {n === 1 ? 'passenger' : 'passengers'}
            </option>
          ))}
        </select>
      </div>
    ),
  }
})

vi.mock('@/lib/api', () => ({
  fetchAirportSuggestions: vi.fn().mockResolvedValue([]),
}))

import SearchForm from '@/components/SearchForm'

afterEach(() => {
  cleanup()
})

describe('SearchForm component', () => {
  it('renders form fields with labels', () => {
    render(<SearchForm />)
    expect(screen.getByLabelText('From')).toBeInTheDocument()
    expect(screen.getByLabelText('To')).toBeInTheDocument()
    expect(screen.getByLabelText('Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Passengers')).toBeInTheDocument()
  })

  it('renders search button', () => {
    render(<SearchForm />)
    expect(screen.getByRole('button', { name: /search flights/i })).toBeInTheDocument()
  })

  it('renders trip type toggle buttons', () => {
    render(<SearchForm />)
    expect(screen.getByRole('button', { name: /one-way/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /round-trip/i })).toBeInTheDocument()
  })

  it('origin input accepts text', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)
    const originInput = screen.getByLabelText('From')
    await user.type(originInput, 'JFK')
    expect(originInput).toHaveValue('JFK')
  })

  it('switching to round-trip shows return date field', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)
    expect(screen.queryByLabelText('Return Date')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /round-trip/i }))
    expect(screen.getByLabelText('Return Date')).toBeInTheDocument()
  })
})
