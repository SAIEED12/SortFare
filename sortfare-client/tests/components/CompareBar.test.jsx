import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CompareBar from '@/components/CompareBar'

const mockUseCompare = vi.fn()

vi.mock('@/context/CompareContext', () => ({
  useCompare: (...args) => mockUseCompare(...args),
}))

vi.mock('@/components/CompareModal', () => ({
  default: ({ open, onClose }) => (
    open ? <div data-testid="compare-modal"><button onClick={onClose}>Close modal</button></div> : null
  ),
}))

afterEach(() => {
  cleanup()
  mockUseCompare.mockReset()
})

describe('CompareBar', () => {
  it('renders nothing when no flights selected', () => {
    mockUseCompare.mockReturnValue({
      selectedFlights: [],
      clearSelection: vi.fn(),
      count: 0,
    })
    const { container } = render(<CompareBar />)
    expect(container.innerHTML).toBe('')
  })

  it('shows flight count when flights are selected', () => {
    mockUseCompare.mockReturnValue({
      selectedFlights: [{ id: '1', airline: 'Delta', flightNumber: 'DL1' }],
      clearSelection: vi.fn(),
      count: 1,
    })
    render(<CompareBar />)
    expect(screen.getByText('1 of 3 flights selected')).toBeInTheDocument()
  })

  it('renders Clear button', () => {
    mockUseCompare.mockReturnValue({
      selectedFlights: [{ id: '1', airline: 'Delta', flightNumber: 'DL1' }],
      clearSelection: vi.fn(),
      count: 1,
    })
    render(<CompareBar />)
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })

  it('calls clearSelection when Clear is clicked', async () => {
    const user = userEvent.setup()
    const clearSelection = vi.fn()
    mockUseCompare.mockReturnValue({
      selectedFlights: [{ id: '1', airline: 'Delta', flightNumber: 'DL1' }],
      clearSelection,
      count: 1,
    })
    render(<CompareBar />)
    await user.click(screen.getByRole('button', { name: /clear/i }))
    expect(clearSelection).toHaveBeenCalled()
  })

  it('Compare button is disabled when only 1 flight selected', () => {
    mockUseCompare.mockReturnValue({
      selectedFlights: [{ id: '1', airline: 'Delta', flightNumber: 'DL1' }],
      clearSelection: vi.fn(),
      count: 1,
    })
    render(<CompareBar />)
    expect(screen.getByRole('button', { name: /compare/i })).toBeDisabled()
  })

  it('Compare button is enabled when 2+ flights selected', () => {
    mockUseCompare.mockReturnValue({
      selectedFlights: [
        { id: '1', airline: 'Delta', flightNumber: 'DL1' },
        { id: '2', airline: 'United', flightNumber: 'UA1' },
      ],
      clearSelection: vi.fn(),
      count: 2,
    })
    render(<CompareBar />)
    expect(screen.getByRole('button', { name: /compare/i })).not.toBeDisabled()
  })
})
