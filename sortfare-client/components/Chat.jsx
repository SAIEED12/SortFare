'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// ---------------------------------------------------------------------------
// Persistence (stretch goal): the conversation survives a refresh via
// localStorage. Loaded after hydration (never during SSR) so the server and
// client initial renders can't disagree.
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'sortfare:chat:v1'

function loadStoredMessages() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function storeMessages(messages) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // Storage can be unavailable (private mode, quota). Non-fatal.
  }
}

function clearStoredMessages() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Markdown helpers
// ---------------------------------------------------------------------------

// While streaming, an odd number of ``` means a code fence is still open and
// react-markdown would try to parse a half-finished fence — rendering that
// tail as a plain preformatted block instead keeps the layout intact.
function hasOpenCodeFence(text) {
  const fences = text.match(/```/g)
  return fences ? fences.length % 2 === 1 : false
}

const mdComponents = {
  p: ({ children }) => <p className="mb-2 leading-7 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="leading-7">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary-600 underline decoration-primary-300 underline-offset-2 hover:text-primary-700"
    >
      {children}
    </a>
  ),
  h1: ({ children }) => <h1 className="mb-2 text-lg font-bold text-gray-900">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 text-base font-bold text-gray-900">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 text-sm font-bold text-gray-900">{children}</h3>,
  hr: () => <hr className="my-4 border-gray-100" />,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-primary-200 pl-3 text-gray-600 italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = /language-/.test(className || '')
    return isBlock ? (
      <code className={`block overflow-x-auto ${className || ''}`} {...props}>
        {children}
      </code>
    ) : (
      <code
        className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.85em] text-primary-700"
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-lg bg-neutral-900 p-3 text-sm leading-6 text-neutral-100 last:mb-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto last:mb-0">
      <table className="w-full divide-y divide-neutral-200 text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-neutral-50 px-3 py-2 text-left font-semibold text-gray-700">{children}</th>
  ),
  td: ({ children }) => <td className="px-3 py-2 text-gray-700">{children}</td>,
}

function MarkdownContent({ text, isStreaming }) {
  if (isStreaming && hasOpenCodeFence(text)) {
    const lastFence = text.lastIndexOf('```')
    const before = text.slice(0, lastFence)
    const openTail = text.slice(lastFence + 3)
    return (
      <>
        {before && <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{before}</ReactMarkdown>}
        {openTail && (
          <pre className="my-3 overflow-x-auto rounded-lg bg-neutral-900 p-3 text-sm text-neutral-100">
            <code>{openTail}</code>
            <span className="animate-caret">▍</span>
          </pre>
        )}
      </>
    )
  }
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{text}</ReactMarkdown>
}

function messageText(message) {
  const textParts = (message?.parts ?? []).filter((p) => p.type === 'text')
  return textParts.map((p) => p.text).join('')
}

// ---------------------------------------------------------------------------
// Thinking dots: shown before the first token, then faded out while the
// first text fades in — a handoff, not a swap, so the UI never flickers.
// ---------------------------------------------------------------------------

const DOTS_FADE_MS = 400

function ThinkingDots({ show }) {
  return (
    <span
      className={`inline-flex items-center gap-1 transition-opacity duration-300 motion-reduce:transition-none ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden={!show}
    >
      <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400 motion-reduce:animate-none" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400 [animation-delay:150ms] motion-reduce:animate-none" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400 [animation-delay:300ms] motion-reduce:animate-none" />
    </span>
  )
}

function AssistantMessage({ message, isStreaming }) {
  const text = messageText(message)
  const [dotsGone, setDotsGone] = useState(false)

  // Unmount the dots once the fade-out animation has finished. The fade
  // itself is CSS-driven (sf-dots-leave / sf-text-enter), so no synchronous
  // state flip is needed — the classes derive straight from the props.
  useEffect(() => {
    if (isStreaming && text.length > 0) {
      const t = setTimeout(() => setDotsGone(true), DOTS_FADE_MS)
      return () => clearTimeout(t)
    }
  }, [isStreaming, text.length])

  const showDots = isStreaming && (text.length === 0 || !dotsGone)
  const handoff = isStreaming && text.length > 0

  return (
    <div className="animate-message-in flex gap-3 motion-reduce:animate-none">
      <div
        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-sm"
        aria-hidden="true"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.669 4.097a2 2 0 0 0-2.44-2.44l-15.83 5.74a2 2 0 0 0-.17 3.75l6.3 2.53 2.53 6.3a2 2 0 0 0 3.75-.17l5.81-15.71Z" />
        </svg>
      </div>
      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-neutral-200 bg-white px-4 py-3 shadow-sm">
        {isStreaming && (
          <div
            className={`flex h-6 items-center ${handoff ? 'sf-dots-leave' : ''}`}
            aria-hidden={handoff}
          >
            <ThinkingDots show={showDots} />
            {!handoff && <span className="sr-only">Assistant is thinking</span>}
          </div>
        )}
        {text.length > 0 && (
          <div
            className={`text-sm text-gray-800 ${handoff ? 'sf-text-enter' : ''}`}
            role="log"
            aria-live="polite"
          >
            <MarkdownContent text={text} isStreaming={isStreaming} />
          </div>
        )}
        {!isStreaming && text.length > 0 && (
          <p className="mt-2 text-xs text-neutral-400">{message.metadata?.model ?? 'Gemini 2.5 Flash'}</p>
        )}
      </div>
    </div>
  )
}

function UserMessage({ message }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary-600 px-4 py-2.5 text-sm leading-7 text-white shadow-sm sm:max-w-[75%]">
        {messageText(message)}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Auto-scroll: pinned to the bottom only while the user is already there.
// Scrolling up mid-stream releases the pin; the floating "jump to latest"
// button brings it back and re-pins for subsequent tokens.
// ---------------------------------------------------------------------------

const SCROLL_TOLERANCE_PX = 24

const SUGGESTIONS = [
  'What is the cheapest flight from JFK to Chicago today?',
  'Compare the fastest and cheapest options for JFK → ORD.',
  'Tips for finding the best flight deals?',
]

export default function Chat() {
  const { messages, sendMessage, stop, regenerate, status, error, setMessages, clearError } =
    useChat({
      transport: new DefaultChatTransport({ api: '/api/chat' }),
    })

  const [input, setInput] = useState('')

  const scrollRef = useRef(null)
  const textareaRef = useRef(null)
  const [atBottom, setAtBottom] = useState(true)

  // --- persistence ------------------------------------------------
  // Loaded after hydration in an effect so SSR and client first renders
  // never disagree. Saving skips the empty conversation so clearing +
  // refreshing stays cleared.
  useEffect(() => {
    const stored = loadStoredMessages()
    if (stored.length > 0) setMessages(stored)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (messages.length > 0) storeMessages(messages)
  }, [messages])

  // --- auto-scroll ------------------------------------------------
  const checkAtBottom = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_TOLERANCE_PX)
  }, [])

  useEffect(() => {
    if (atBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, atBottom])

  const jumpToLatest = () => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    setAtBottom(true)
  }

  // --- input handling ---------------------------------------------
  const isBusy = status === 'submitted' || status === 'streaming'

  const handleSend = useCallback(
    (raw) => {
      const value = (raw ?? input).trim()
      if (!value || status !== 'ready') return
      sendMessage({ text: value })
      setInput('')
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    },
    [input, sendMessage, status],
  )

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      if (input.trim() && !isBusy) handleSend()
    }
  }

  // Keep the textarea height in sync with its content (max 5 rows-ish).
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  const clearConversation = () => {
    setMessages([])
    clearStoredMessages()
  }

  const lastMessage = messages[messages.length - 1]
  const showRegenerate =
    lastMessage?.role === 'assistant' && status === 'ready' && !error

  const conversationLive = messages.length > 0 || isBusy

  return (
    <div className="flex h-[70dvh] min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm sm:rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.669 4.097a2 2 0 0 0-2.44-2.44l-15.83 5.74a2 2 0 0 0-.17 3.75l6.3 2.53 2.53 6.3a2 2 0 0 0 3.75-.17l5.81-15.71Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">SortFare Assistant</h2>
            <p className="text-xs text-neutral-500" role="status" aria-live="polite">
              {isBusy
                ? status === 'submitted'
                  ? 'Thinking…'
                  : 'Streaming reply…'
                : status === 'error'
                  ? 'Something went wrong'
                  : 'Powered by Gemini'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearConversation}
          disabled={messages.length === 0}
          className="rounded-md px-2 py-1 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40"
        >
          Clear
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between gap-3 border-b border-red-100 bg-red-50 px-4 py-2.5">
          <p className="text-xs text-red-700">
            Something went wrong while streaming. The conversation is intact.
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => regenerate()}
              className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={clearError}
              className="rounded-md px-2 py-1 text-xs text-red-400 transition-colors hover:text-red-600"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={checkAtBottom}
        className="relative flex-1 overflow-y-auto overscroll-contain bg-neutral-50"
      >
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-4">
          {messages.length === 0 && !isBusy && (
            <div className="flex min-h-full flex-col items-center justify-center gap-5 px-2 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-200">
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.669 4.097a2 2 0 0 0-2.44-2.44l-15.83 5.74a2 2 0 0 0-.17 3.75l6.3 2.53 2.53 6.3a2 2 0 0 0 3.75-.17l5.81-15.71Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Ask about flights and fares</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-500">
                  I can compare the current JFK → ORD offers, explain how SortFare ranks
                  flights, and share tips for finding cheap fares.
                </p>
              </div>
              <div className="flex w-full max-w-md flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSend(s)}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-left text-sm text-gray-700 shadow-sm transition-all hover:border-primary-300 hover:text-primary-700 hover:shadow"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const isStreaming = isBusy && m === lastMessage && m.role === 'assistant'
            return m.role === 'user' ? (
              <UserMessage key={m.id} message={m} />
            ) : (
              <div key={m.id}>
                <AssistantMessage message={m} isStreaming={isStreaming} />
                {showRegenerate && m === lastMessage && (
                  <button
                    type="button"
                    onClick={() => regenerate()}
                    className="ml-11 mt-1.5 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-gray-700"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Regenerate
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Jump to latest — visible only when the user has scrolled up */}
        {!atBottom && (
          <button
            type="button"
            onClick={jumpToLatest}
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-lg transition-colors hover:border-primary-300 hover:text-primary-700"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l-4.5-4.5M12 19.5l4.5-4.5" />
            </svg>
            Jump to latest
          </button>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="border-t border-neutral-100 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4 sm:pb-4"
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about flights, fares, or travel tips…"
            disabled={isBusy}
            aria-label="Message the SortFare assistant"
            className="max-h-40 min-h-[44px] w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-gray-800 shadow-inner outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-400 focus:bg-white disabled:opacity-60"
          />
          {isBusy ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Stop generating"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600 active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || status !== 'ready'}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm transition-all hover:bg-primary-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          )}
        </div>
        <p className="mt-2 px-1 text-center text-[11px] text-neutral-400">
          Enter to send · Shift+Enter for a new line · Streaming can be stopped mid-answer
        </p>
      </form>
    </div>
  )
}