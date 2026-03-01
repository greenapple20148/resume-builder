import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'
import { existsSync } from 'fs'

/**
 * Vite plugin: serves /api/generate-pdf in dev using local Puppeteer.
 * In production this route is handled by Vercel's serverless function.
 */
function localApiPlugin(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/generate-pdf', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        // Parse JSON body
        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk as Buffer)
        const body = JSON.parse(Buffer.concat(chunks).toString())
        const { html, filename = 'resume.pdf' } = body || {}

        if (!html || typeof html !== 'string') {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Missing or invalid html field' }))
          return
        }

        let browser = null
        try {
          const puppeteer = await import('puppeteer-core')

          // Find local Chrome/Chromium
          const possiblePaths = [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Chromium.app/Contents/MacOS/Chromium',
            '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
          ]
          const executablePath = possiblePaths.find(p => existsSync(p))
          if (!executablePath) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'No Chrome/Chromium found locally.' }))
            return
          }

          browser = await puppeteer.default.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 794, height: 1123 },
            executablePath,
            headless: true,
          })

          // Inject @page CSS for per-page margins:
          // First page: no top margin, 10mm bottom
          // Subsequent pages: 10mm top and bottom
          const pageMarginCSS = `<style>@page { size: A4; margin: 10mm 0; } @page :first { margin: 0 0 10mm 0; }</style>`
          const styledHtml = html.replace('</head>', `${pageMarginCSS}</head>`)

          const page = await browser.newPage()
          await page.setContent(styledHtml, { waitUntil: 'networkidle0', timeout: 15000 })
          await page.evaluateHandle('document.fonts.ready')
          await new Promise(r => setTimeout(r, 300))

          const pdfBuffer = await page.pdf({
            printBackground: true,
            preferCSSPageSize: true,
          })

          res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          })
          res.end(pdfBuffer)
        } catch (err: any) {
          console.error('PDF generation failed:', err)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'PDF generation failed', message: err?.message }))
        } finally {
          if (browser) await browser.close()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
