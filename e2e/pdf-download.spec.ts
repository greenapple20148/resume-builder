// e2e/pdf-download.spec.ts — Tests PDF generation using REAL template components
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const ALL_TEMPLATES = [
  'classic', 'executive', 'minimal', 'bold',
  'mono_clean', 'mono_sidebar', 'mono_stack', 'mono_type', 'mono_editorial',
  'exec_navy', 'exec_marble', 'exec_copper',
  'creative_neon', 'creative_coral', 'creative_blueprint', 'creative_sunset',
  'dark_obsidian', 'dark_midnight', 'dark_eclipse', 'dark_void', 'dark_carbon',
  'prestige', 'modern_sidebar', 'coral_horizon', 'swiss_grid', 'ocean_breeze',
  'monochrome_editorial', 'midnight_luxe', 'forest_canopy', 'copper_deco',
  'arctic_frost', 'sunset_gradient', 'metro_line', 'rose_quartz',
  'concrete_brutalist', 'lavender_fields', 'steel_industrial',
  'obsidian_executive', 'ivory_prestige', 'aurora_borealis',
  'blueprint_architect', 'onyx_ember',
  'exec_authority', 'exec_prestige', 'exec_pillar', 'exec_regal', 'exec_apex',
  'exec_strata', 'exec_counsel', 'exec_monogram', 'exec_ledger', 'exec_architect',
]

const PDF_OUTPUT_DIR = path.join(process.cwd(), 'test-results', 'pdfs')

test.describe('PDF Generation — Real Templates', () => {
  test.setTimeout(120_000) // generous timeout for PDF generation

  test.beforeAll(() => {
    // Clean and recreate output dir
    if (fs.existsSync(PDF_OUTPUT_DIR)) {
      for (const f of fs.readdirSync(PDF_OUTPUT_DIR)) {
        fs.unlinkSync(path.join(PDF_OUTPUT_DIR, f))
      }
    } else {
      fs.mkdirSync(PDF_OUTPUT_DIR, { recursive: true })
    }
  })

  for (const templateId of ALL_TEMPLATES) {
    test(`generates PDF for "${templateId}"`, async ({ page, request }) => {
      // 1. Navigate to the test page which renders the REAL React template
      await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(500) // let fonts load

      // 2. Verify the name "Alexandra Chen" is rendered in the template
      const h1 = page.locator('#resume-preview-root h1').first()
      await expect(h1).toBeVisible({ timeout: 5000 })
      const nameText = await h1.textContent()
      expect(nameText).toContain('Alexandra')

      // 3. Grab the full HTML of the rendered template
      const templateHTML = await page.evaluate(() => {
        const root = document.getElementById('resume-preview-root')
        if (!root) return ''

        // Collect Google Fonts & styles
        const fontLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]'))
          .map(el => el.outerHTML).join('\n')
        const styles = Array.from(document.querySelectorAll('style'))
          .map(s => s.outerHTML).join('\n')

        // Strip hardcoded 794px widths
        const clone = root.cloneNode(true) as HTMLElement
        const stripWidths = (el: HTMLElement) => {
          if (el.style?.width === '794px') el.style.width = '100%'
          for (let i = 0; i < el.children.length; i++) {
            const c = el.children[i]
            if (c instanceof HTMLElement) stripWidths(c)
          }
        }
        stripWidths(clone)

        // Get outer div's background
        const outerDiv = clone.querySelector(':scope > div') as HTMLElement
        const bg = outerDiv?.style?.background || outerDiv?.style?.backgroundColor || '#fff'

        return `<!DOCTYPE html>
        <html><head><meta charset="utf-8">
        ${fontLinks}
        ${styles}
        <style>
          *, *::before, *::after { box-sizing: border-box; }
          html, body { width: 100%; margin: 0; padding: 0; background: ${bg};
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important; }
          #resume-preview-root { width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          #resume-preview-root > div { width: 100% !important; max-width: 100% !important; min-height: auto !important; }
        </style>
        </head><body>${clone.outerHTML}</body></html>`
      })

      expect(templateHTML.length).toBeGreaterThan(500)

      // 4. Send to /api/generate-pdf
      const response = await request.post('/api/generate-pdf', {
        data: { html: templateHTML, filename: `${templateId}.pdf` },
      })

      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toBe('application/pdf')

      const pdfBuffer = await response.body()
      expect(pdfBuffer.length).toBeGreaterThan(1000)
      expect(pdfBuffer.slice(0, 5).toString()).toBe('%PDF-')

      // 5. Save the PDF
      fs.writeFileSync(path.join(PDF_OUTPUT_DIR, `${templateId}.pdf`), pdfBuffer)
    })
  }

  test('summary: all PDFs generated', () => {
    const files = fs.readdirSync(PDF_OUTPUT_DIR).filter(f => f.endsWith('.pdf'))
    console.log(`\n✅ Generated ${files.length} unique PDFs in: ${PDF_OUTPUT_DIR}`)
    let totalSize = 0
    const sizes: string[] = []
    for (const f of files.sort()) {
      const size = fs.statSync(path.join(PDF_OUTPUT_DIR, f)).size
      totalSize += size
      sizes.push(`   ${f.padEnd(30)} ${(size / 1024).toFixed(0)} KB`)
    }
    console.log(sizes.join('\n'))
    console.log(`\n   Total: ${(totalSize / 1024 / 1024).toFixed(2)} MB across ${files.length} templates`)
  })
})

// ── API Endpoint Tests ─────────────────────────────────
test.describe('PDF API Endpoint', () => {
  test('rejects missing HTML', async ({ request }) => {
    const response = await request.post('/api/generate-pdf', { data: { filename: 'empty.pdf' } })
    expect(response.status()).toBe(400)
  })

  test('rejects non-POST', async ({ request }) => {
    const response = await request.get('/api/generate-pdf')
    expect(response.status()).toBe(405)
  })
})
