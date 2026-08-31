import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import SampleDataBanner from '@/components/SampleDataBanner'

afterEach(() => {
  cleanup()
})

describe('SampleDataBanner', () => {
  it('renders the sample data warning message', () => {
    render(<SampleDataBanner />)
    expect(screen.getByText(/live flight search is unavailable/i)).toBeInTheDocument()
    expect(screen.getByText(/showing sample data/i)).toBeInTheDocument()
  })

  it('has role="status" for screen readers', () => {
    render(<SampleDataBanner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
