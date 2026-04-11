import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    productionBrowserSourceMaps: true,
    // External packages for server components
    serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
    // Ensure @sparticuz/chromium binary files are included in the serverless bundle
    outputFileTracingIncludes: {
        '/api/generate-pdf': ['./node_modules/@sparticuz/chromium/**/*'],
    },
    // Security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
        ]
    },
}

export default nextConfig
