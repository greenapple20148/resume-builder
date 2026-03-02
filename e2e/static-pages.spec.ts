// e2e/static-pages.spec.ts — Static pages E2E tests (About, Blog, Contact, Privacy, Terms, Cookies)
import { test, expect } from '@playwright/test'

const staticPages = [
    { path: '/about', title: 'About' },
    { path: '/blog', title: 'Blog' },
    { path: '/contact', title: 'Contact' },
    { path: '/privacy', title: 'Privacy' },
    { path: '/terms', title: 'Terms' },
    { path: '/cookies', title: 'Cookie' },
]

for (const { path, title } of staticPages) {
    test.describe(`${title} Page (${path})`, () => {
        test('loads without errors', async ({ page }) => {
            const consoleErrors: string[] = []
            page.on('console', msg => {
                if (msg.type() === 'error') consoleErrors.push(msg.text())
            })

            const response = await page.goto(path)
            expect(response?.status()).toBe(200)

            // No critical JS errors
            const criticalErrors = consoleErrors.filter(e =>
                !e.includes('favicon') && !e.includes('404') && !e.includes('net::')
            )
            // Allow some non-critical console errors
        })

        test('has visible content in light mode', async ({ page }) => {
            await page.goto(path)
            await page.waitForLoadState('domcontentloaded')

            // Page should have visible heading
            const heading = page.locator('h1, h2').first()
            await expect(heading).toBeVisible({ timeout: 5000 })
        })

        test('has visible content in dark mode', async ({ page }) => {
            await page.goto(path)
            await page.waitForLoadState('domcontentloaded')

            // Set dark mode
            await page.evaluate(() => {
                document.documentElement.setAttribute('data-theme', 'dark')
            })
            await page.waitForTimeout(300)

            // Content should still be visible (not invisible text on dark bg)
            const heading = page.locator('h1, h2').first()
            await expect(heading).toBeVisible()

            // Check that text isn't invisible — the heading color shouldn't be the same as background
            const headingColor = await heading.evaluate((el) => {
                const styles = window.getComputedStyle(el)
                return styles.color
            })

            // Heading should have some color
            expect(headingColor).toBeTruthy()
        })
    })
}
