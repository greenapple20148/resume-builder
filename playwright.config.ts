import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    timeout: 30000,
    expect: { timeout: 5000 },
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: 'html',
    outputDir: 'test-results',
    use: {
        baseURL: 'http://localhost:3002',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'npm run dev -- -p 3002',
        url: 'http://localhost:3002',
        reuseExistingServer: true,
        timeout: 30000,
    },
})
