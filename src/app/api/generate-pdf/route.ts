import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'

// Serverless config
export const maxDuration = 30

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
    const { existsSync } = await import('fs')
    const possiblePaths = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
    ]

    const executablePath = possiblePaths.find((p) => existsSync(p))
    if (!executablePath) {
        throw new Error('No Chrome/Chromium found. Install Google Chrome for local development.')
    }

    return { executablePath, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { html, filename = 'resume.pdf' } = body || {}

    if (!html || typeof html !== 'string') {
        return NextResponse.json({ error: 'Missing or invalid html field' }, { status: 400 })
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

        // Inject @page CSS for per-page margins
        const pageMarginCSS = `<style>@page { size: A4; margin: 10mm 0; } @page :first { margin: 0 0 10mm 0; }</style>`
        const styledHtml = html.replace('</head>', `${pageMarginCSS}</head>`)

        await page.setContent(styledHtml, { waitUntil: 'networkidle0', timeout: 15000 })
        await page.evaluateHandle('document.fonts.ready')
        await new Promise((r) => setTimeout(r, 300))

        const pdfBuffer = await page.pdf({
            printBackground: true,
            preferCSSPageSize: true,
        })

        return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        })
    } catch (err: any) {
        console.error('PDF generation failed:', err)
        return NextResponse.json(
            { error: 'PDF generation failed', message: err?.message || 'Unknown error' },
            { status: 500 }
        )
    } finally {
        if (browser) {
            await browser.close()
        }
    }
}
