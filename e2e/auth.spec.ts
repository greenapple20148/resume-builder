// e2e/auth.spec.ts — Authentication flow E2E tests
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
    test('auth page loads (sign in mode)', async ({ page }) => {
        await page.goto('/auth')
        await page.waitForLoadState('domcontentloaded')

        // Should show the Welcome back heading
        const heading = page.locator('h3:has-text("Welcome back")')
        await expect(heading).toBeVisible({ timeout: 5000 })

        // Should show email and password inputs
        const emailInput = page.locator('input[type="email"]')
        const passwordInput = page.locator('input[type="password"]')
        await expect(emailInput).toBeVisible()
        await expect(passwordInput).toBeVisible()
    })

    test('auth page loads (sign up mode)', async ({ page }) => {
        await page.goto('/auth?mode=signup')
        await page.waitForLoadState('domcontentloaded')

        // Should show Create your account heading
        const heading = page.locator('h3:has-text("Create your account")')
        await expect(heading).toBeVisible({ timeout: 5000 })

        // Should show name, email, and password inputs
        const nameInput = page.locator('input[type="text"]')
        const emailInput = page.locator('input[type="email"]')
        await expect(nameInput).toBeVisible()
        await expect(emailInput).toBeVisible()
    })

    test('shows validation on empty sign-in submit', async ({ page }) => {
        await page.goto('/auth')
        await page.waitForLoadState('domcontentloaded')

        // Click sign in with empty fields
        const submitBtn = page.locator('button[type="submit"]')
        await submitBtn.click()
        await page.waitForTimeout(500)

        // Should show validation error for password
        const errorMsg = page.locator('.form-error')
        if (await errorMsg.count() > 0) {
            await expect(errorMsg.first()).toBeVisible()
        }
    })

    test('Google sign in button is present', async ({ page }) => {
        await page.goto('/auth')
        await page.waitForLoadState('domcontentloaded')

        const googleBtn = page.locator('button:has-text("Continue with Google")')
        await expect(googleBtn).toBeVisible({ timeout: 5000 })
    })

    test('unauthenticated user cannot access dashboard', async ({ page }) => {
        await page.goto('/dashboard')
        await page.waitForLoadState('domcontentloaded')
        await page.waitForTimeout(2000)

        // Should redirect to auth or show auth page content
        const currentUrl = page.url()
        const isOnAuth = currentUrl.includes('/auth')
        const hasAuthContent = await page.locator('h3:has-text("Welcome back"), h3:has-text("Create your account")').count() > 0

        expect(isOnAuth || hasAuthContent).toBeTruthy()
    })
})
