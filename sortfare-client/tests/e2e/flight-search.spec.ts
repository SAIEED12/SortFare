import { test, expect } from '@playwright/test'

test.describe('Flight search flow', () => {
  test('loads flights page and shows featured routes', async ({ page }) => {
    await page.goto('/flights')

    await expect(page.getByRole('heading', { name: /featured routes/i })).toBeVisible()
    await expect(page.getByText(/cheapest fares we found/i)).toBeVisible()
  })

  test('home page search form is functional', async ({ page }) => {
    await page.goto('/')

    const fromInput = page.getByLabel('From')
    const toInput = page.getByLabel('To')

    await expect(fromInput).toBeVisible()
    await expect(toInput).toBeVisible()
    await expect(page.getByRole('button', { name: /search flights/i })).toBeVisible()
  })
})
