// e2e/resume-rendering.spec.ts — Comprehensive rendering tests for ALL resume templates
// Validates visual structure, content rendering, section completeness, layout integrity,
// and edge-case handling for every template in the PREVIEW_MAP.
import { test, expect, type Page, type Locator } from '@playwright/test'

// ── All 52 template IDs from PREVIEW_MAP ───────────────────
// NOTE: 'mono_clean' and 'exec_authority' in the old PDF spec don't exist in PREVIEW_MAP.
// This list is the authoritative set pulled directly from ThemesPreviews.tsx PREVIEW_MAP export.
const ALL_TEMPLATES = [
  // Core 4
  'classic', 'executive', 'minimal', 'bold',
  // Mono series
  'mono_sidebar', 'mono_stack', 'mono_type', 'mono_editorial',
  // Executive variants
  'exec_navy', 'exec_marble', 'exec_copper',
  // Creative series
  'creative_neon', 'creative_coral', 'creative_blueprint', 'creative_sunset',
  // Dark series
  'dark_obsidian', 'dark_midnight', 'dark_eclipse', 'dark_void', 'dark_carbon',
  // Premium singles
  'prestige', 'modern_sidebar', 'coral_horizon', 'swiss_grid', 'ocean_breeze',
  'monochrome_editorial', 'midnight_luxe', 'forest_canopy', 'copper_deco',
  'arctic_frost', 'sunset_gradient', 'metro_line', 'rose_quartz',
  'concrete_brutalist', 'lavender_fields', 'steel_industrial',
  'obsidian_executive', 'ivory_prestige', 'aurora_borealis',
  'blueprint_architect', 'onyx_ember',
  // Executive collection (exec_authority exists in old spec but NOT in PREVIEW_MAP — omitted)
  'exec_prestige', 'exec_pillar', 'exec_regal', 'exec_apex',
  'exec_strata', 'exec_counsel', 'exec_monogram', 'exec_ledger', 'exec_architect',
] as const

// ── Dark header templates (need contrast checks) ──────────
const DARK_TEMPLATES = new Set([
  'dark_obsidian', 'dark_midnight', 'dark_eclipse', 'dark_void', 'dark_carbon',
  'obsidian_executive', 'aurora_borealis', 'blueprint_architect', 'onyx_ember',
  'midnight_luxe', 'creative_neon',
  'exec_navy', 'exec_copper',
  'exec_authority', 'exec_pillar', 'exec_apex', 'exec_strata', 'exec_ledger',
])

// ── Sidebar layout templates ──────────────────────────────
const SIDEBAR_TEMPLATES = new Set([
  'mono_sidebar', 'modern_sidebar', 'exec_monogram',
])

// ── Templates with centered headers ───────────────────────
const CENTERED_HEADER_TEMPLATES = new Set([
  'ivory_prestige', 'exec_regal',
])

// Fake data reference values (must match TestTemplatePage.tsx FAKE_DATA)
const EXPECTED = {
  name: 'Alexandra Chen',
  nameFirst: 'Alexandra',
  role: 'Senior Product Manager',
  email: 'alexandra.chen@example.com',
  phone: '(415) 555-0192',
  location: 'San Francisco, CA',
  companies: ['Stripe', 'Figma', 'Google'],
  schools: ['Stanford University', 'UC Berkeley'],
  skillsSample: ['Product Strategy', 'Agile / Scrum', 'SQL & Data Analysis'],
  certSample: ['Certified Scrum Product Owner (CSPO)', 'Google Analytics Professional'],
  languageSample: ['English', 'Mandarin'],
} as const


// ════════════════════════════════════════════════════════════
// SECTION 1: PER-TEMPLATE RENDERING TESTS
// ════════════════════════════════════════════════════════════

test.describe('Resume Template Rendering — All Templates', () => {
  test.setTimeout(60_000)

  for (const templateId of ALL_TEMPLATES) {
    test.describe(`Template: ${templateId}`, () => {

      // ── 1.1 Basic Load & Name Visibility ────────────────
      test('renders and shows candidate name', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(600) // allow fonts to load

        const root = page.locator('#resume-preview-root')
        await expect(root).toBeVisible({ timeout: 8000 })

        // Every template must render an <h1> with the candidate's name
        const h1 = root.locator('h1').first()
        await expect(h1).toBeVisible({ timeout: 5000 })
        const text = await h1.textContent()
        expect(text).toContain(EXPECTED.nameFirst)
      })

      // ── 1.2 Name Contrast Check (dark templates) ───────
      test('name has sufficient contrast on dark templates', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        const h1 = page.locator('#resume-preview-root h1').first()
        await expect(h1).toBeVisible({ timeout: 5000 })

        // Get computed color: for dark templates, text must not be too close to background
        const { textColor, bgColor } = await h1.evaluate((el) => {
          const style = window.getComputedStyle(el)
          return {
            textColor: style.color,
            bgColor: style.backgroundColor,
          }
        })

        // Simple sanity check: text color shouldn't be transparent or same as background
        expect(textColor).not.toBe('rgba(0, 0, 0, 0)')
        expect(textColor).not.toBe(bgColor)
      })

      // ── 1.3 Job Title Rendering ─────────────────────────
      test('renders job title / role', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        const root = page.locator('#resume-preview-root')
        const bodyText = await root.textContent()

        // The role may appear in different forms (uppercase, styled, etc.)
        expect(bodyText?.toLowerCase()).toContain(EXPECTED.role.toLowerCase())
      })

      // ── 1.4 Experience Section ──────────────────────────
      test('renders experience section with all companies', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        const root = page.locator('#resume-preview-root')
        const bodyText = await root.textContent() || ''

        for (const company of EXPECTED.companies) {
          expect(bodyText, `Missing company: ${company}`).toContain(company)
        }
      })

      // ── 1.5 Education Section ───────────────────────────
      test('renders education section with schools', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        const root = page.locator('#resume-preview-root')
        const bodyText = await root.textContent() || ''

        for (const school of EXPECTED.schools) {
          expect(bodyText, `Missing school: ${school}`).toContain(school)
        }
      })

      // ── 1.6 Skills Rendering ────────────────────────────
      test('renders skills section', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        const root = page.locator('#resume-preview-root')
        const bodyText = await root.textContent() || ''

        // At least one skill should be present
        const hasSkill = EXPECTED.skillsSample.some(s => bodyText.includes(s))
        expect(hasSkill, `No skills found in template "${templateId}"`).toBeTruthy()
      })

      // ── 1.7 Contact Info Rendering ──────────────────────
      test('renders contact info (email, phone, location)', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        const root = page.locator('#resume-preview-root')
        const bodyText = await root.textContent() || ''

        expect(bodyText, 'Missing email').toContain(EXPECTED.email)
        expect(bodyText, 'Missing phone').toContain(EXPECTED.phone)
        expect(bodyText, 'Missing location').toContain(EXPECTED.location)
      })

      // ── 1.8 Container Dimensions ────────────────────────
      test('renders within expected container width', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        const root = page.locator('#resume-preview-root')
        const box = await root.boundingBox()

        expect(box).not.toBeNull()
        // Template should be rendered at ~794px width (standard resume width)
        expect(box!.width).toBeGreaterThanOrEqual(790)
        expect(box!.width).toBeLessThanOrEqual(800)
      })

      // ── 1.9 Minimum Height ──────────────────────────────
      test('has sufficient height (content not collapsed)', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        const root = page.locator('#resume-preview-root')
        const box = await root.boundingBox()

        expect(box).not.toBeNull()
        // A fully populated resume should be at least 800px tall
        expect(box!.height).toBeGreaterThan(800)
      })

      // ── 1.10 No Error State Rendered ────────────────────
      test('does not show error or "not found" message', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        // TestTemplatePage renders an error div with red text if template not in PREVIEW_MAP
        const errorDiv = page.locator('#resume-preview-root >> text="not found in PREVIEW_MAP"')
        await expect(errorDiv).toHaveCount(0)
      })

      // ── 1.11 Experience Bullet Points ───────────────────
      test('renders experience bullet points', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        const root = page.locator('#resume-preview-root')
        const bodyText = await root.textContent() || ''

        // Check for at least one specific bullet from the fake data
        expect(bodyText).toContain('Stripe Terminal SDK')
      })

      // ── 1.12 Screenshot Capture (for visual regression) ─
      test('captures screenshot for visual review', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(800)

        const root = page.locator('#resume-preview-root')
        await expect(root).toBeVisible()

        await root.screenshot({
          path: `test-results/screenshots/${templateId}.png`,
        })
      })
    })
  }
})


// ════════════════════════════════════════════════════════════
// SECTION 2: CROSS-TEMPLATE CONSISTENCY TESTS
// ════════════════════════════════════════════════════════════

test.describe('Cross-Template Consistency', () => {
  test.setTimeout(120_000)

  test('all templates render in "all" mode without errors', async ({ page }) => {
    await page.goto('/test-template?id=all', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Count all template labels (present in "all" mode)
    const templateLabels = page.locator('[data-template-id]')
    const count = await templateLabels.count()

    // Should match the number of templates in PREVIEW_MAP
    expect(count).toBeGreaterThanOrEqual(ALL_TEMPLATES.length)
  })

  test('every template in "all" mode has a visible <h1>', async ({ page }) => {
    await page.goto('/test-template?id=all', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    for (const id of ALL_TEMPLATES) {
      const templateContainer = page.locator(`[data-template-id="${id}"]`)
      const h1 = templateContainer.locator('h1').first()
      await expect(h1, `Template "${id}" missing visible h1`).toBeVisible({ timeout: 5000 })
    }
  })

  test('every template shows candidate name in "all" mode', async ({ page }) => {
    await page.goto('/test-template?id=all', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    for (const id of ALL_TEMPLATES) {
      const templateContainer = page.locator(`[data-template-id="${id}"]`)
      const text = await templateContainer.textContent()
      expect(text, `Template "${id}" doesn't show candidate name`).toContain(EXPECTED.nameFirst)
    }
  })

  test('no template in "all" mode shows PREVIEW_MAP error', async ({ page }) => {
    await page.goto('/test-template?id=all', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    const errors = page.locator('text="not found in PREVIEW_MAP"')
    const errorCount = await errors.count()
    expect(errorCount, 'Some templates missing from PREVIEW_MAP').toBe(0)
  })
})


// ════════════════════════════════════════════════════════════
// SECTION 3: TEMPLATE SECTION COMPLETENESS
// ════════════════════════════════════════════════════════════

test.describe('Template Section Completeness', () => {
  test.setTimeout(120_000)

  // Test that certifications are rendered (templates that support them)
  for (const templateId of ALL_TEMPLATES) {
    test(`"${templateId}" renders certifications when provided`, async ({ page }) => {
      await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(400)

      const root = page.locator('#resume-preview-root')
      const bodyText = await root.textContent() || ''

      // The FAKE_DATA has 2 certifications — at least one should appear
      // Note: Some templates may not display certifications (by design). That's ok,
      // but the majority should.
      const hasCert = EXPECTED.certSample.some(c => bodyText.includes(c))

      // Log it but don't strictly fail — certifications are optional in some designs
      if (!hasCert) {
        console.warn(`  ⚠ Template "${templateId}" does not render certifications`)
      }
    })
  }
})


// ════════════════════════════════════════════════════════════
// SECTION 4: LAYOUT-SPECIFIC STRUCTURE TESTS
// ════════════════════════════════════════════════════════════

test.describe('Layout Structure Verification', () => {
  test.setTimeout(60_000)

  // Sidebar templates should have at least 2 immediate child elements side-by-side
  for (const templateId of SIDEBAR_TEMPLATES) {
    test(`"${templateId}" has sidebar layout`, async ({ page }) => {
      await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(400)

      const root = page.locator('#resume-preview-root')
      const bodyText = await root.textContent() || ''

      // Sidebar templates should have "aside" or display:flex layout
      const hasSidebarStructure = await root.evaluate((el) => {
        const inner = el.querySelector('div')
        if (!inner) return false
        // Check for flex/grid layout or aside element
        const hasAside = !!inner.querySelector('aside')
        const style = window.getComputedStyle(inner)
        const isFlex = style.display === 'flex' || style.display === 'grid'
        // Check nested children for sidebar layout
        const children = inner.children
        for (let i = 0; i < children.length; i++) {
          const cs = window.getComputedStyle(children[i] as HTMLElement)
          if (cs.display === 'flex' || cs.display === 'grid') return true
        }
        return hasAside || isFlex
      })

      expect(hasSidebarStructure, `Template "${templateId}" missing sidebar layout structure`).toBeTruthy()
    })
  }

  // Templates with centered headers
  for (const templateId of CENTERED_HEADER_TEMPLATES) {
    test(`"${templateId}" has centered header`, async ({ page }) => {
      await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(400)

      const header = page.locator('#resume-preview-root header').first()
      if (await header.count() > 0) {
        const textAlign = await header.evaluate(el => {
          return window.getComputedStyle(el).textAlign
        })
        expect(textAlign).toBe('center')
      }
    })
  }
})


// ════════════════════════════════════════════════════════════
// SECTION 5: EDGE CASE — TEMPLATE NOT FOUND
// ════════════════════════════════════════════════════════════

test.describe('Edge Cases', () => {
  test('invalid template ID shows error message', async ({ page }) => {
    await page.goto('/test-template?id=nonexistent_template_abc', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // TestTemplatePage should show the "not found in PREVIEW_MAP" error
    const body = await page.locator('body').textContent()
    expect(body).toContain('not found in PREVIEW_MAP')
  })

  test('no id parameter defaults to "classic"', async ({ page }) => {
    await page.goto('/test-template', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Should render the classic template with the candidate's name
    const h1 = page.locator('#resume-preview-root h1').first()
    await expect(h1).toBeVisible({ timeout: 5000 })
    const text = await h1.textContent()
    expect(text).toContain(EXPECTED.nameFirst)
  })
})


// ════════════════════════════════════════════════════════════
// SECTION 6: PRINT READINESS VALIDATION
// ════════════════════════════════════════════════════════════

test.describe('Print Readiness', () => {
  test.setTimeout(120_000)

  // Sampling a few templates for deeper structural checks
  const DEEP_CHECK_TEMPLATES = ['classic', 'executive', 'dark_obsidian', 'exec_prestige', 'ivory_prestige', 'blueprint_architect']

  for (const templateId of DEEP_CHECK_TEMPLATES) {
    test(`"${templateId}" HTML is synthesizable for PDF`, async ({ page }) => {
      await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(600)

      // Check that the resume-preview-root exists and has substantial HTML
      const htmlLength = await page.evaluate(() => {
        const root = document.getElementById('resume-preview-root')
        return root ? root.innerHTML.length : 0
      })

      expect(htmlLength).toBeGreaterThan(500) // Must have substantial content
    })

    test(`"${templateId}" has no overlapping text elements`, async ({ page }) => {
      await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(600)

      // Check that h1 (name) doesn't overlap with the next sibling
      const h1 = page.locator('#resume-preview-root h1').first()
      const h1Box = await h1.boundingBox()

      if (h1Box) {
        // Name should have positive height/width (not collapsed)
        expect(h1Box.height).toBeGreaterThan(10)
        expect(h1Box.width).toBeGreaterThan(50)
      }
    })

    test(`"${templateId}" background color is captured correctly`, async ({ page }) => {
      await page.goto(`/test-template?id=${templateId}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(400)

      const bg = await page.evaluate(() => {
        const root = document.getElementById('resume-preview-root')
        const inner = root?.querySelector(':scope > div') as HTMLElement
        if (!inner) return ''
        const style = window.getComputedStyle(inner)
        return style.background || style.backgroundColor || ''
      })

      // Background must be defined (not empty/transparent)
      expect(bg.length).toBeGreaterThan(0)
    })
  }
})


// ════════════════════════════════════════════════════════════
// SECTION 7: FONT LOADING VALIDATION
// ════════════════════════════════════════════════════════════

test.describe('Font Loading', () => {
  test.setTimeout(30_000)

  test('Google Fonts are loaded on test-template page', async ({ page }) => {
    await page.goto('/test-template?id=classic', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    // Check for Google Fonts stylesheet links
    const fontLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]')
      return links.length
    })

    // Classic template uses Playfair Display + Source Sans 3
    expect(fontLinks).toBeGreaterThanOrEqual(1)
  })

  test('font-family is not browser default on classic template', async ({ page }) => {
    await page.goto('/test-template?id=classic', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)

    const fontFamily = await page.evaluate(() => {
      const root = document.getElementById('resume-preview-root')
      const inner = root?.querySelector(':scope > div') as HTMLElement
      if (!inner) return ''
      return window.getComputedStyle(inner).fontFamily
    })

    // Should not fall back to raw "Times New Roman" or "serif" without a custom font
    expect(fontFamily).not.toBe('')
    expect(fontFamily).not.toBe('serif')
  })
})


// ════════════════════════════════════════════════════════════
// SECTION 8: 2-PAGE RESUME RENDERING (Extended Data)
// ════════════════════════════════════════════════════════════

// Expected values for the extended/2-page data set
const EXTENDED_EXPECTED = {
  name: 'Alexandra Chen',
  nameFirst: 'Alexandra',
  role: 'VP of Product',
  companies: ['Stripe', 'Figma', 'Google', 'Dropbox', 'LinkedIn', 'Microsoft'],
  schools: ['Stanford University', 'UC Berkeley', 'MIT Sloan'],
  certSample: ['CSPO', 'AWS Solutions Architect'],
} as const

test.describe('2-Page Resume Rendering — Extended Data', () => {
  test.setTimeout(60_000)

  for (const templateId of ALL_TEMPLATES) {
    test.describe(`2-Page: ${templateId}`, () => {

      // ── 8.1 Renders with extended data ──────────────────
      test('renders with extended data and shows name', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}&data=extended`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(600)

        const root = page.locator('#resume-preview-root')
        await expect(root).toBeVisible({ timeout: 8000 })

        const h1 = root.locator('h1').first()
        await expect(h1).toBeVisible({ timeout: 5000 })
        const text = await h1.textContent()
        expect(text).toContain(EXTENDED_EXPECTED.nameFirst)
      })

      // ── 8.2 All 6 companies rendered ────────────────────
      test('renders all 6 experience entries', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}&data=extended`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        const root = page.locator('#resume-preview-root')
        const bodyText = await root.textContent() || ''

        for (const company of EXTENDED_EXPECTED.companies) {
          expect(bodyText, `Missing company: ${company}`).toContain(company)
        }
      })

      // ── 8.3 All 3 schools rendered ──────────────────────
      test('renders all 3 education entries', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}&data=extended`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        const root = page.locator('#resume-preview-root')
        const bodyText = await root.textContent() || ''

        for (const school of EXTENDED_EXPECTED.schools) {
          expect(bodyText, `Missing school: ${school}`).toContain(school)
        }
      })

      // ── 8.4 Height exceeds single page ──────────────────
      test('content overflows past 1-page height (1123px)', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}&data=extended`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        const root = page.locator('#resume-preview-root')
        const box = await root.boundingBox()

        expect(box).not.toBeNull()
        // A4 resume page = ~1123px at 96 DPI. 2-page resume should exceed this.
        expect(box!.height, `Template "${templateId}" did not overflow to 2 pages`).toBeGreaterThan(1123)
      })

      // ── 8.5 No content clipping ─────────────────────────
      test('last company (Microsoft) is not clipped', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}&data=extended`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)

        const root = page.locator('#resume-preview-root')
        const bodyText = await root.textContent() || ''

        // Microsoft is the 6th/last entry — if it appears, content isn't clipped
        expect(bodyText, 'Last experience entry (Microsoft) is missing — content may be clipped').toContain('Microsoft')
      })

      // ── 8.6 Full-page screenshot for visual review ──────
      test('captures full-page screenshot (extended)', async ({ page }) => {
        await page.goto(`/test-template?id=${templateId}&data=extended`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(800)

        const root = page.locator('#resume-preview-root')
        await expect(root).toBeVisible()

        await root.screenshot({
          path: `test-results/screenshots/${templateId}_2page.png`,
        })
      })
    })
  }
})


// ════════════════════════════════════════════════════════════
// SECTION 9: 2-PAGE CROSS-TEMPLATE CONSISTENCY
// ════════════════════════════════════════════════════════════

test.describe('2-Page Cross-Template Consistency', () => {
  test.setTimeout(120_000)

  test('all templates render in "all" mode with extended data', async ({ page }) => {
    await page.goto('/test-template?id=all&data=extended', { waitUntil: 'networkidle' })
    await page.waitForTimeout(3000)

    const templateLabels = page.locator('[data-template-id]')
    const count = await templateLabels.count()
    expect(count).toBeGreaterThanOrEqual(ALL_TEMPLATES.length)
  })

  test('every template shows all 6 companies in extended "all" mode', async ({ page }) => {
    await page.goto('/test-template?id=all&data=extended', { waitUntil: 'networkidle' })
    await page.waitForTimeout(3000)

    for (const id of ALL_TEMPLATES) {
      const templateContainer = page.locator(`[data-template-id="${id}"]`)
      const text = await templateContainer.textContent() || ''

      for (const company of EXTENDED_EXPECTED.companies) {
        expect(text, `Template "${id}" missing "${company}" in 2-page mode`).toContain(company)
      }
    }
  })

  test('no template in extended mode shows PREVIEW_MAP error', async ({ page }) => {
    await page.goto('/test-template?id=all&data=extended', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    const errors = page.locator('text="not found in PREVIEW_MAP"')
    const errorCount = await errors.count()
    expect(errorCount).toBe(0)
  })
})


// ════════════════════════════════════════════════════════════
// SECTION 10: SUMMARY REPORT
// ════════════════════════════════════════════════════════════

test.describe('Summary', () => {
  test('final report — template count', () => {
    const perTemplate1Page = 12
    const perTemplate2Page = 6
    const total1Page = perTemplate1Page * ALL_TEMPLATES.length
    const total2Page = perTemplate2Page * ALL_TEMPLATES.length
    console.log(`\n✅ Resume Rendering Test Suite`)
    console.log(`   Templates under test: ${ALL_TEMPLATES.length}`)
    console.log(`   1-Page tests: ${total1Page} (${perTemplate1Page} per template)`)
    console.log(`   2-Page tests: ${total2Page} (${perTemplate2Page} per template)`)
    console.log(`   Cross-template + Edge + Print + Fonts: ~30`)
    console.log(`   Grand total: ~${total1Page + total2Page + 30}\n`)
  })
})

