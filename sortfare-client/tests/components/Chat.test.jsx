import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@ai-sdk/react', () => ({
  useChat: vi.fn(),
}))

vi.mock('ai', () => ({
  DefaultChatTransport: vi.fn(),
}))

vi.mock('@/components/ToolCall', () => ({
  default: ({ part }) => <div data-testid="tool-call">{part.type}</div>,
}))

import { useChat } from '@ai-sdk/react'
import Chat from '@/components/Chat'

const mockUseChat = vi.mocked(useChat)

function makeChat(overrides = {}) {
  const defaults = {
    messages: [],
    sendMessage: vi.fn(),
    stop: vi.fn(),
    regenerate: vi.fn(),
    status: 'ready',
    error: null,
    setMessages: vi.fn(),
    clearError: vi.fn(),
    ...overrides,
  }
  mockUseChat.mockReturnValue(defaults)
  return defaults
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  window.localStorage.clear()
})

describe('Chat component', () => {
  it('renders empty state with suggestion buttons', () => {
    makeChat()
    render(<Chat />)
    expect(screen.getByText('Ask about flights and fares')).toBeInTheDocument()
    expect(screen.getByText(/What is the cheapest flight/)).toBeInTheDocument()
    expect(screen.getByText(/Compare the fastest/)).toBeInTheDocument()
    expect(screen.getByText(/Tips for finding/)).toBeInTheDocument()
  })

  it('renders user message', () => {
    makeChat({
      messages: [
        {
          id: '1',
          role: 'user',
          parts: [{ type: 'text', text: 'Find flights to Chicago' }],
        },
      ],
    })
    render(<Chat />)
    expect(screen.getByText('Find flights to Chicago')).toBeInTheDocument()
  })

  it('renders assistant message with text', () => {
    makeChat({
      messages: [
        {
          id: '1',
          role: 'user',
          parts: [{ type: 'text', text: 'Hello' }],
        },
        {
          id: '2',
          role: 'assistant',
          parts: [{ type: 'text', text: 'I can help you find flights.' }],
          metadata: { model: 'Gemini 2.5 Flash' },
        },
      ],
    })
    render(<Chat />)
    expect(screen.getByText('I can help you find flights.')).toBeInTheDocument()
  })

  it('shows thinking dots when streaming with no text yet', () => {
    makeChat({
      messages: [
        {
          id: '1',
          role: 'assistant',
          parts: [],
        },
      ],
      status: 'streaming',
    })
    render(<Chat />)
    expect(screen.getByText('Assistant is thinking')).toBeInTheDocument()
  })

  it('shows streaming status when streaming with text', () => {
    makeChat({
      messages: [
        {
          id: '1',
          role: 'assistant',
          parts: [{ type: 'text', text: 'Hello' }],
        },
      ],
      status: 'streaming',
    })
    render(<Chat />)
    expect(screen.getAllByText('Streaming reply…').length).toBeGreaterThanOrEqual(1)
  })

  it('renders error banner with quota message', () => {
    makeChat({
      error: new Error('quota exceeded - RESOURCE_EXHAUSTED'),
    })
    render(<Chat />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/free-tier limit was reached/)).toBeInTheDocument()
  })

  it('renders error banner with network message', () => {
    makeChat({
      error: new Error('Failed to fetch'),
    })
    render(<Chat />)
    const alerts = screen.getAllByRole('alert')
    expect(alerts.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/No internet connection/)).toBeInTheDocument()
  })

  it('renders error banner with generic message', () => {
    makeChat({
      error: new Error('Something unexpected happened'),
    })
    render(<Chat />)
    const alerts = screen.getAllByRole('alert')
    expect(alerts.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Something went wrong while streaming/)).toBeInTheDocument()
  })

  it('disables composer when busy', () => {
    makeChat({ status: 'submitted' })
    render(<Chat />)
    const textareas = screen.getAllByRole('textbox', { name: /message the sortfare assistant/i })
    expect(textareas.length).toBeGreaterThanOrEqual(1)
    textareas.forEach((textarea) => {
      expect(textarea).toBeDisabled()
    })
  })
})
