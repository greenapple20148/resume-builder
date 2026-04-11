import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'ResumeBuildIn — Build Resumes That Get You Hired',
        short_name: 'ResumeBuildIn',
        description: 'Build beautiful, ATS-optimized resumes in minutes. 25 professional themes, live editor, instant PDF download.',
        start_url: '/',
        display: 'standalone',
        background_color: '#1a1410',
        theme_color: '#1a1410',
        icons: [
            {
                src: '/favicon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
        ],
    }
}
