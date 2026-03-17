import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'

// Serverless config
export const maxDuration = 30

async function getChromiumExecutable() {
    // In production (Vercel), use @sparticuz/chromium
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
        try {
            const chromium = await import('@sparticuz/chromium')
            // Cast to any because @sparticuz/chromium has runtime methods not in the types
            const mod = (chromium.default || chromium) as any

            // TC-046 fix: @sparticuz/chromium v143+ changed binary discovery.
            // Ensure headless mode is set for serverless environments.
            if (typeof mod.setHeadlessMode !== 'undefined') {
                mod.setHeadlessMode = true
            }

            // Some versions need graphics mode disabled
            if (typeof mod.setGraphicsMode !== 'undefined') {
                mod.setGraphicsMode = false
            }

            let executablePath: string
            try {
                // First try default path resolution
                executablePath = await mod.executablePath()
            } catch (defaultPathErr: any) {
                // TC-046 fix: If default path fails (bin/ directory not found),
                // try to explicitly resolve using require.resolve
                console.warn('[generate-pdf] Default chromium path failed:', defaultPathErr?.message)
                const path = await import('path')
                try {
                    const pkgPath = require.resolve('@sparticuz/chromium/package.json')
                    const binPath = path.join(path.dirname(pkgPath), 'bin')
                    console.log('[generate-pdf] Trying explicit bin path:', binPath)
                    executablePath = await mod.executablePath(binPath)
                } catch (explicitPathErr: any) {
                    console.error('[generate-pdf] Explicit bin path also failed:', explicitPathErr?.message)
                    throw defaultPathErr // throw original error
                }
            }
            console.log('[generate-pdf] Chromium executable path:', executablePath)

            return {
                executablePath,
                args: mod.args || [],
            }
        } catch (chromiumErr: any) {
            console.error('[generate-pdf] Chromium binary error:', chromiumErr?.message)
            // If chromium binary is not available, throw with a clear message
            throw new Error(
                `Chromium binary not available in serverless environment: ${chromiumErr?.message}. ` +
                'Please ensure @sparticuz/chromium is properly configured.'
            )
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
