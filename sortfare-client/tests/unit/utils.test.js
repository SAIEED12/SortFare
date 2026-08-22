import { describe, it, expect } from 'vitest'
import { durationLabel, stopLabel, formatPrice } from '@/components/FlightRow'

describe('durationLabel', () => {
  it('formats exact hours', () => {
    expect(durationLabel(120)).toBe('2h')
  })

  it('formats hours and minutes', () => {
    expect(durationLabel(90)).toBe('1h 30m')
  })

  it('formats zero minutes', () => {
    expect(durationLabel(0)).toBe('0h')
  })

  it('formats minutes only (under 1 hour)', () => {
    expect(durationLabel(45)).toBe('0h 45m')
  })
})

describe('stopLabel', () => {
  it('returns Nonstop for 0 stops', () => {
    expect(stopLabel(0)).toBe('Nonstop')
  })

  it('returns singular for 1 stop', () => {
    expect(stopLabel(1)).toBe('1 stop')
  })

  it('returns plural for multiple stops', () => {
    expect(stopLabel(3)).toBe('3 stops')
  })
})

describe('formatPrice', () => {
  it('formats price with currency', () => {
    expect(formatPrice({ currency: '$', price: 199 })).toBe('$199')
  })

  it('formats zero price', () => {
    expect(formatPrice({ currency: '$', price: 0 })).toBe('$0')
  })

  it('formats large price', () => {
    expect(formatPrice({ currency: '€', price: 1299 })).toBe('€1299')
  })
})
