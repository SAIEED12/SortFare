import { test, expect } from '@playwright/test'

test.describe('Chat flow', () => {
  test('loads chat page and displays suggestions', async ({ page }) => {
    await page.goto('/chat')

    await expect(page.getByRole('heading', { name: /sortfare assistant/i })).toBeVisible()
    await expect(page.getByText('Ask about flights and fares')).toBeVisible()
    await expect(page.getByRole('button', { name: /what is the cheapest flight/i })).toBeVisible()
  })

  test('sends a message and shows it in the conversation', async ({ page }) => {
    await page.goto('/chat')

    await expect(page.getByText('Ask about flights and fares')).toBeVisible()

    const textarea = page.getByRole('textbox', { name: /message the sortfare assistant/i })
    await textarea.fill('Hello, can you help me find flights?')

    const sendButton = page.getByRole('button', { name: /send message/i })
    await sendButton.click()

    await expect(page.getByText('Hello, can you help me find flights?')).toBeVisible()
  })
})
