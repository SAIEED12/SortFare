import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/lib/auth-client', () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

import { useSession, signOut } from '@/lib/auth-client'
import Nav from '@/components/Nav'

const mockUseSession = vi.mocked(useSession)
const mockSignOut = vi.mocked(signOut)

function setSession(session) {
  mockUseSession.mockReturnValue({ data: session })
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('Nav greeting', () => {
  it('shows "Hi, Name" when signed in', () => {
    setSession({ user: { name: 'Jane', email: 'jane@example.com' } })
    render(<Nav />)
    const greeting = screen.getByLabelText('Hi, Jane')
    expect(greeting).toBeInTheDocument()
    expect(greeting).toHaveTextContent('Hi, Jane')
  })

  it('does not show the greeting when signed out', () => {
    setSession(null)
    render(<Nav />)
    expect(screen.queryByText(/^Hi,/)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })

  it('falls back to "Hi, there" when the name is missing or empty', () => {
    setSession({ user: { email: 'jane@example.com' } })
    const { rerender } = render(<Nav />)
    expect(screen.getByLabelText('Hi, there')).toBeInTheDocument()

    setSession({ user: { name: '   ', email: 'jane@example.com' } })
    rerender(<Nav />)
    expect(screen.getByLabelText('Hi, there')).toBeInTheDocument()
  })

  it('shows the greeting in the mobile menu when signed in', async () => {
    setSession({ user: { name: 'Jane', email: 'jane@example.com' } })
    const user = userEvent.setup()
    render(<Nav />)
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getAllByLabelText('Hi, Jane').length).toBeGreaterThanOrEqual(2)
  })

  it('calls signOut when Sign Out is clicked', async () => {
    setSession({ user: { name: 'Jane', email: 'jane@example.com' } })
    const user = userEvent.setup()
    render(<Nav />)
    await user.click(screen.getByRole('button', { name: /sign out/i }))
    expect(mockSignOut).toHaveBeenCalled()
  })
})
