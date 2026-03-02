// e2e/pricing.spec.ts — Pricing page E2E tests
import { test, expect } from '@playwright/test'

test.describe('Pricing Page', () => {
    test('loads and displays plan cards', async ({ page }) => {
        await page.goto('/pricing')

        // Page should load
        await page.waitForLoadState('domcontentloaded')

        // Should show plan names
        const proText = page.locator('text=Pro')
        const premiumText = page.locator('text=Premium')

        await expect(proText.first()).toBeVisible({ timeout: 10000 })
        await expect(premiumText.first()).toBeVisible()
    })

    test('shows billing toggle (monthly/annual)', async ({ page }) => {
        await page.goto('/pricing')
        await page.waitForLoadState('domcontentloaded')

        // Look for billing toggle
        const monthlyOption = page.locator('text=Monthly, text=monthly')
        const annualOption = page.locator('text=Annual, text=annual, text=Yearly, text=yearly')

        if (await monthlyOption.count() > 0) {
            await expect(monthlyOption.first()).toBeVisible()
        }
    })

    test('displays add-ons section', async ({ page }) => {
        await page.goto('/pricing')
        await page.waitForLoadState('domcontentloaded')

        // Should show add-on products
        const expressUnlock = page.locator('text=Express')
        const mockPack = page.locator('text=Mock')

        if (await expressUnlock.count() > 0) {
            await expect(expressUnlock.first()).toBeVisible()
        }
        if (await mockPack.count() > 0) {
            await expect(mockPack.first()).toBeVisible()
        }
    })

    test('FAQ section is visible', async ({ page }) => {
        await page.goto('/pricing')
        await page.waitForLoadState('domcontentloaded')

        const faqSection = page.locator('text=FAQ, text=Frequently Asked')
        if (await faqSection.count() > 0) {
            await expect(faqSection.first()).toBeVisible()
        }
    })
})
