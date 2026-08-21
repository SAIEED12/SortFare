// lib/ai/tools/fetchUrl.js
//
// FL-07 tool contract: `fetchUrl`.
//
// Fetches a URL and returns its content as clean text. Uses the native
// Node.js fetch API — no external dependencies. The tool is defined in the
// same style as searchFlights and getFlightDetails so the model sees a
// consistent vocabulary and the UI can render the tool part uniformly.
import { tool } from 'ai'
import { z } from 'zod'

export const fetchUrlInputSchema = z.object({
  url: z
    .string()
    .url()
    .describe('The URL to fetch. Must be a valid HTTP or HTTPS URL.'),
})

export const fetchUrlOutputSchema = z.object({
  url: z.string().describe('The URL that was fetched'),
  title: z.string().nullable().describe('Page title if found in HTML, otherwise null'),
  content: z.string().describe('Extracted text content of the page (truncated to ~4000 chars)'),
  success: z.boolean().describe('Whether the fetch succeeded'),
})

function extractTextFromHtml(html) {
  // Remove script and style tags
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

  // Extract title
  const titleMatch = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : null

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ')

  // Decode HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')

  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim()

  // Truncate to ~4000 characters to stay within token limits
  if (text.length > 4000) {
    text = text.slice(0, 4000) + '\n\n[Content truncated — showing first 4000 characters]'
  }

  return { title, content: text }
}

export const fetchUrl = tool({
  description: [
    'Fetch a web page by URL and return its text content.',
    'Use this when the user asks about real-time information outside the',
    'SortFare catalog: airline policies, travel tips, airport guides,',
    'or current web content. Only fetch URLs you are confident are safe.',
  ].join(' '),
  inputSchema: fetchUrlInputSchema,
  outputSchema: fetchUrlOutputSchema,
  execute: async ({ url }) => {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'SortFare-Assistant/1.0',
          Accept: 'text/html,application/xhtml+xml,text/plain',
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!res.ok) {
        return {
          url,
          title: null,
          content: `Fetch failed with status ${res.status}: ${res.statusText}`,
          success: false,
        }
      }

      const contentType = res.headers.get('content-type') || ''
      const body = await res.text()

      if (contentType.includes('text/html') || contentType.includes('xhtml')) {
        const { title, content } = extractTextFromHtml(body)
        return { url, title, content, success: true }
      }

      // Plain text or other — return as-is (truncated)
      const content = body.length > 4000
        ? body.slice(0, 4000) + '\n\n[Content truncated]'
        : body
      return { url, title: null, content, success: true }
    } catch (error) {
      return {
        url,
        title: null,
        content: `Fetch error: ${error.message || 'Unknown error'}`,
        success: false,
      }
    }
  },
})
