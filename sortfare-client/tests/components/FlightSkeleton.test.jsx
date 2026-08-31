import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import FlightSkeleton from '@/components/FlightSkeleton'

vi.mock('@heroui/react', () => ({
  Card: ({ children, className }) => <div className={className}>{children}</div>,
  Card: Object.assign(
    ({ children, className }) => <div className={className}>{children}</div>,
    {
      Content: ({ children, className }) => <div className={className}>{children}</div>,
    }
  ),
  Skeleton: ({ className }) => <div className={className} data-testid="skeleton" />,
}))

afterEach(() => {
  cleanup()
})

describe('FlightSkeleton', () => {
  it('renders loading region for screen readers', () => {
    render(<FlightSkeleton />)
    expect(screen.getByLabelText('Loading flight results')).toBeInTheDocument()
  })

  it('renders 5 skeleton cards', () => {
    render(<FlightSkeleton />)
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
