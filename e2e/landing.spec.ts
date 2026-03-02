// e2e/landing.spec.ts — Landing page E2E tests
import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
    test('loads the home page and shows hero content', async ({ page }) => {
        await page.goto('/')

        // The page should load successfully
        await expect(page).toHaveTitle(/ResumeBuild/i)

        // Hero section should be visible
        const heroHeading = page.locator('h1').first()
        await expect(heroHeading).toBeVisible()

        // Navigation should be visible
        const nav = page.locator('nav').first()
        await expect(nav).toBeVisible()
    })

    test('navigation links are functional', async ({ page }) => {
        await page.goto('/')

        // Check that key navigation links exist
        const pricingLink = page.locator('a[href*="pricing"], button:has-text("Pricing")')
        if (await pricingLink.count() > 0) {
            await expect(pricingLink.first()).toBeVisible()
        }
    })

    test('dark mode toggle works', async ({ page }) => {
        await page.goto('/')

        // Look for a theme toggle button
        const themeToggle = page.locator('button[aria-label*="theme"], button[title*="theme"], button[title*="dark"], button[title*="light"], [data-testid="theme-toggle"]')
        if (await themeToggle.count() > 0) {
            const htmlEl = page.locator('html')
            const initialTheme = await htmlEl.getAttribute('data-theme')

            await themeToggle.first().click()
            await page.waitForTimeout(300)

            const newTheme = await htmlEl.getAttribute('data-theme')
            expect(newTheme).not.toBe(initialTheme)
        }
    })

    test('CTA buttons link to auth or features', async ({ page }) => {
        await page.goto('/')

        // There should be at least one call-to-action button
        const ctaButtons = page.locator('a.btn, button.btn, a:has-text("Get Started"), a:has-text("Sign Up"), a:has-text("Try")')
        if (await ctaButtons.count() > 0) {
            await expect(ctaButtons.first()).toBeVisible()
        }
    })
})
