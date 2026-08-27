import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// The saved-flights client talks to the Express server via NEXT_PUBLIC_API_URL.
// Provide a default so the client can build absolute URLs under test.
process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

afterEach(() => {
  cleanup()
})
