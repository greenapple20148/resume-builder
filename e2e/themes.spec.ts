// e2e/themes.spec.ts — Template/themes gallery E2E tests
import { test, expect } from '@playwright/test'

test.describe('Themes Page', () => {
    test('loads and shows template items', async ({ page }) => {
        await page.goto('/themes')
        await page.waitForLoadState('domcontentloaded')
        await page.waitForTimeout(2000)

        // The page should render some template elements
        // Look for any visible content on the page
        const body = page.locator('body')
        const text = await body.textContent()
        expect(text?.length).toBeGreaterThan(100)
    })

    test('page has heading or title', async ({ page }) => {
        await page.goto('/themes')
        await page.waitForLoadState('domcontentloaded')
        await page.waitForTimeout(1000)

        // Should have some heading
        const heading = page.locator('h1, h2, h3').first()
        await expect(heading).toBeVisible({ timeout: 5000 })
    })

    test('contains template category names', async ({ page }) => {
        await page.goto('/themes')
        await page.waitForLoadState('domcontentloaded')
        await page.waitForTimeout(1000)

        // Check that the page body contains at least one category keyword
        const body = await page.locator('body').textContent()
        const hasCategory = ['Classic', 'Executive', 'Modern', 'Dark', 'Creative', 'Mono', 'Premium']
            .some(cat => body?.includes(cat))
        expect(hasCategory).toBeTruthy()
    })
})
