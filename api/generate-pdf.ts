import type { VercelRequest, VercelResponse } from '@vercel/node'
import puppeteer from 'puppeteer-core'

// Vercel serverless config
export const config = {
    maxDuration: 30,
}

async function getChromiumExecutable() {
    // In production (Vercel), use @sparticuz/chromium
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
        const chromium = await import('@sparticuz/chromium')
        return {
            executablePath: await chromium.default.executablePath(),
            args: chromium.default.args,
        }
    }

    // Local development — try common Chrome/Chromium paths
    const possiblePaths = [
        // macOS
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
        // Linux
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        // Windows
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    ]

    const { existsSync } = await import('fs')
    for (const p of possiblePaths) {
        if (existsSync(p)) {
            return { executablePath: p, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
        }
    }

    throw new Error('No Chrome/Chromium found. Install Google Chrome for local development.')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { html, filename = 'resume.pdf' } = req.body || {}

    if (!html || typeof html !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid html field' })
    }

    let browser = null

    try {
        const { executablePath, args } = await getChromiumExecutable()

        browser = await puppeteer.launch({
            args,
            defaultViewport: { width: 794, height: 1123 },
            executablePath,
            headless: true,
        })

        const page = await browser.newPage()

        // Inject @page CSS for per-page margins:
        // First page: no top margin, 10mm bottom
        // Subsequent pages: 10mm top and bottom
        const pageMarginCSS = `<style>@page { size: A4; margin: 10mm 0; } @page :first { margin: 0 0 10mm 0; }</style>`
        const styledHtml = html.replace('</head>', `${pageMarginCSS}</head>`)

        // Set the HTML content
        await page.setContent(styledHtml, {
            waitUntil: 'networkidle0',
            timeout: 15000,
        })

        // Wait for web fonts to load
        await page.evaluateHandle('document.fonts.ready')

        // Small extra delay for font rendering
        await new Promise(r => setTimeout(r, 300))

        // Generate PDF — preferCSSPageSize defers to @page CSS for size + margins
        const pdfBuffer = await page.pdf({
            printBackground: true,
            preferCSSPageSize: true,
        })

        // Return the PDF
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return res.status(200).send(pdfBuffer)
    } catch (err: any) {
        console.error('PDF generation failed:', err)
        return res.status(500).json({
            error: 'PDF generation failed',
            message: err?.message || 'Unknown error',
        })
    } finally {
        if (browser) {
            await browser.close()
        }
    }
}
