import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import Footer from '@/components/Footer'

afterEach(() => {
  cleanup()
})

describe('Footer', () => {
  it('renders SortFare brand name', () => {
    render(<Footer />)
    expect(screen.getByText('SortFare')).toBeInTheDocument()
  })

  it('renders product links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /flights/i })).toHaveAttribute('href', '/flights')
    expect(screen.getByRole('link', { name: /assistant/i })).toHaveAttribute('href', '/chat')
  })

  it('renders account links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /create account/i })).toHaveAttribute('href', '/signup')
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
    const accountLink = screen.getAllByRole('link').find((a) => a.getAttribute('href') === '/account')
    expect(accountLink).toBeTruthy()
  })

  it('renders support links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /help & faq/i })).toHaveAttribute('href', '/help')
    expect(screen.getByRole('link', { name: /contact us/i })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: /terms of service/i })).toHaveAttribute('href', '/terms')
  })

  it('renders copyright with current year', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`${year}.*SortFare`))).toBeInTheDocument()
  })

  it('renders Product and Support headings', () => {
    render(<Footer />)
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
  })
})
