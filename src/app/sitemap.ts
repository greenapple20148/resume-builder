import type { MetadataRoute } from 'next'

const BASE_URL = 'https://resumebuildin.com'

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date().toISOString()

    // ── High-priority public pages ────────────────────────
    const publicPages: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/themes`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/pricing`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ]

    // ── Tool pages ────────────────────────────────────────
    const toolPages: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/tools/ai`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/tools/cover-letter`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ]

    // ── Auth page (lower priority) ────────────────────────
    const authPages: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/auth`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.4,
        },
    ]

    // ── Legal pages (lowest priority) ─────────────────────
    const legalPages: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
        { url: `${BASE_URL}/refund-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    ]

    return [...publicPages, ...toolPages, ...authPages, ...legalPages]
}
