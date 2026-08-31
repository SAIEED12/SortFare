import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import ShaderFallback from '@/components/ShaderFallback'

afterEach(() => {
  cleanup()
})

describe('ShaderFallback', () => {
  it('renders without crashing', () => {
    const { container } = render(<ShaderFallback />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('has aria-hidden for screen readers', () => {
    const { container } = render(<ShaderFallback />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })
})
