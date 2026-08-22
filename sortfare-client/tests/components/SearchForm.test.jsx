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

  it('renders quick route buttons', () => {
    render(<SearchForm />)
    expect(screen.getByText('New York → Chicago')).toBeInTheDocument()
    expect(screen.getByText('Los Angeles → San Francisco')).toBeInTheDocument()
    expect(screen.getByText('Seattle → New York')).toBeInTheDocument()
    expect(screen.getByText('Miami → Los Angeles')).toBeInTheDocument()
  })

  it('origin input accepts text', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)
    const originInput = screen.getByLabelText('From')
    await user.type(originInput, 'JFK')
    expect(originInput).toHaveValue('JFK')
  })

  it('quick route button populates origin and destination', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)
    await user.click(screen.getByText('New York → Chicago'))
    expect(screen.getByLabelText('From')).toHaveValue('JFK')
    expect(screen.getByLabelText('To')).toHaveValue('ORD')
  })
})
