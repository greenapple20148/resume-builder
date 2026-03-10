import type { Metadata } from 'next'
import { ClientProviders } from './providers'
import '@/styles/global.css'

export const metadata: Metadata = {
    title: 'ResumeBuildIn — Build Resumes That Get You Hired',
    description:
        'ResumeBuildIn — Build beautiful, ATS-optimized resumes in minutes. Choose from 25 professional themes, use the live editor, and download perfect PDFs instantly. Free forever.',
    keywords:
        'resume builder, resume maker, free resume builder, ATS resume, professional resume templates, resume PDF, resume themes, CV builder, job application, career tools',
    authors: [{ name: 'ResumeBuildIn' }],
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    metadataBase: new URL('https://resumebuildin.io'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        url: 'https://resumebuildin.io/',
        title: 'ResumeBuildIn — Build Resumes That Get You Hired',
        description:
            'Build beautiful, ATS-optimized resumes in minutes. 25 professional themes, live editor, instant PDF download. Free forever.',
        images: [
            {
                url: 'https://resumebuildin.io/og-image.png',
                width: 1200,
                height: 630,
            },
        ],
        siteName: 'ResumeBuildIn',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ResumeBuildIn — Build Resumes That Get You Hired',
        description:
            'Build beautiful, ATS-optimized resumes in minutes. 25 professional themes, live editor, instant PDF download.',
        images: ['https://resumebuildin.io/og-image.png'],
    },
    icons: {
        icon: '/favicon.svg',
        apple: '/favicon.svg',
    },
    other: {
        'theme-color': '#1a1410',
        'msapplication-TileColor': '#1a1410',
    },
}

// Structured data JSON-LD
const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ResumeBuildIn',
    url: 'https://resumebuildin.io',
    logo: 'https://resumebuildin.io/favicon.svg',
    description: 'Build beautiful, ATS-optimized resumes in minutes with 25 professional themes.',
    sameAs: [],
}

const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ResumeBuildIn',
    url: 'https://resumebuildin.io',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
        'Free online resume builder with 25 ATS-optimized professional themes, live editor, and instant PDF download.',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free plan — build resumes at no cost, forever.',
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '4700',
        bestRating: '5',
    },
    featureList: [
        '25 professional resume themes',
        'ATS-optimized templates',
        'Live resume editor with real-time preview',
        'Instant PDF download',
        'AI-powered cover letter generator',
        'LinkedIn optimization tools',
        'AI mock interview practice',
    ],
}

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Is ResumeBuildIn free?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes! The Free plan is forever free with access to core themes, a live editor, and PDF export. No credit card required.',
            },
        },
        {
            '@type': 'Question',
            name: 'Are ResumeBuildIn templates ATS-friendly?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Absolutely. All 25 templates are designed to pass Applicant Tracking Systems (ATS) so your resume gets seen by real humans, not filtered by bots.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I download my resume as PDF?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Every resume can be exported as a pixel-perfect PDF that looks identical to your on-screen preview.',
            },
        },
        {
            '@type': 'Question',
            name: 'How many resume themes are available?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'ResumeBuildIn offers 25 professionally designed themes spanning minimal, professional, creative, and dark categories.',
            },
        },
    ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Security Headers */}
                <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
                <meta name="referrer" content="strict-origin-when-cross-origin" />

                {/* Preconnect for performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* Google Fonts */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Lora:wght@400;600&family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;700&family=Nunito:wght@300;400;600;700&family=Raleway:wght@300;400;700;900&family=Oswald:wght@400;600;700&family=Cinzel:wght@400;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Tenor+Sans&family=Josefin+Sans:wght@100;300;400;600&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&family=Nunito+Sans:wght@300;400;600;700&family=Source+Sans+3:wght@300;400;600;700&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=PT+Serif:wght@400;700&display=swap"
                    rel="stylesheet"
                />

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />

                {/* Prevent flash of wrong theme on load */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){var t=localStorage.getItem('resumebuildin-theme');if(!t)t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t)})();`,
                    }}
                />
            </head>
            <body suppressHydrationWarning>
                <ClientProviders>{children}</ClientProviders>
            </body>
        </html>
    )
}
