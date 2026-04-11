import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/editor/',          // private resume editor
                    '/dashboard',        // authenticated dashboard
                    '/profile',          // user profile
                    '/welcome',          // post-signup onboarding
                    '/confirm-email',    // email confirmation
                    '/test-template',    // internal dev/test page
                    '/resume/',          // shared resume pages (user content)
                    '/api/',             // API routes
                ],
            },
        ],
        sitemap: 'https://resumebuildin.com/sitemap.xml',
    }
}
