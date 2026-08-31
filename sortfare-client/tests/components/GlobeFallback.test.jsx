import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import GlobeFallback from '@/components/GlobeFallback'

afterEach(() => {
  cleanup()
})

describe('GlobeFallback', () => {
  it('renders globe label', () => {
    render(<GlobeFallback />)
    expect(screen.getByText('Interactive 3D globe')).toBeInTheDocument()
  })

  it('renders JavaScript fallback message', () => {
    render(<GlobeFallback />)
    expect(screen.getByText(/enable javascript for the full experience/i)).toBeInTheDocument()
  })
})
