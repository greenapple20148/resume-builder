import { Link, useLocation } from 'react-router-dom'
import { useSEO } from '../lib/useSEO'

const LEGAL_CONTENT: Record<string, { title: string; seoTitle: string; seoDesc: string; lastUpdated: string; sections: { heading: string; body: string }[] }> = {
    '/privacy': {
        title: 'Privacy Policy',
        seoTitle: 'Privacy Policy',
        seoDesc: 'Learn how ResumeBuildIn collects, uses, and protects your personal data.',
        lastUpdated: 'February 1, 2026',
        sections: [
            { heading: 'Information We Collect', body: 'We collect information you provide directly, including your name, email address, and resume content. We also collect usage data such as pages visited, features used, and device information to improve our service.' },
            { heading: 'How We Use Your Data', body: 'Your data is used to provide and improve our services, including generating resumes, processing payments, and sending transactional emails. We never sell your personal information to third parties.' },
            { heading: 'Data Storage & Security', body: 'Your data is stored securely using industry-standard encryption (AES-256 at rest, TLS 1.3 in transit). Resume content is stored in your account and is only accessible by you. We use Supabase for our database, which provides SOC 2 Type II compliant infrastructure.' },
            { heading: 'Third-Party Services', body: 'We use Stripe for payment processing, Supabase for authentication and data storage, and Vercel for hosting. Each service has its own privacy policy and complies with applicable data protection regulations.' },
            { heading: 'Data Retention', body: 'Your resume data is retained as long as your account is active. Upon account deletion, all associated data is permanently removed within 30 days. You can export or delete your data at any time from your account settings.' },
            { heading: 'Your Rights', body: 'You have the right to access, correct, export, or delete your personal data. You may also object to processing or request data portability. To exercise these rights, contact us at privacy@resumebuildin.com.' },
            { heading: 'Cookies', body: 'We use essential cookies for authentication and session management. We do not use third-party advertising cookies. See our Cookie Policy for more details.' },
            { heading: 'Updates', body: 'We may update this policy periodically. We will notify you of material changes via email or an in-app notification. Continued use of the service after changes constitutes acceptance.' },
        ],
    },
    '/terms': {
        title: 'Terms of Service',
        seoTitle: 'Terms of Service',
        seoDesc: 'Read the terms and conditions for using ResumeBuildIn.',
        lastUpdated: 'February 1, 2026',
        sections: [
            { heading: 'Acceptance of Terms', body: 'By accessing or using ResumeBuildIn, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.' },
            { heading: 'Account Registration', body: 'You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials and for all activity under your account.' },
            { heading: 'Service Description', body: 'ResumeBuildIn provides tools for creating, editing, and exporting professional resumes. We offer both free and premium tiers with varying feature access.' },
            { heading: 'Acceptable Use', body: 'You agree not to use the service for unlawful purposes, to impersonate others, to distribute malware, or to interfere with the service\'s operation. We reserve the right to suspend accounts that violate these terms.' },
            { heading: 'Intellectual Property', body: 'Resume templates and the ResumeBuildIn platform are our intellectual property. Your resume content belongs to you. By using our service, you grant us a limited license to process and display your content solely for service delivery.' },
            { heading: 'Payment & Subscriptions', body: 'Premium features require a paid subscription processed through Stripe. Subscriptions auto-renew unless cancelled. Refunds are available within 14 days of purchase if you haven\'t used premium features.' },
            { heading: 'Limitation of Liability', body: 'ResumeBuildIn is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages arising from your use of the service. Our total liability is limited to the amount you paid in the 12 months preceding a claim.' },
            { heading: 'Termination', body: 'Either party may terminate the agreement at any time. Upon termination, your right to use the service ceases immediately. We will retain your data for 30 days to allow for export.' },
            { heading: 'Governing Law', body: 'These terms are governed by the laws of the State of Delaware, United States. Any disputes shall be resolved through binding arbitration in accordance with the AAA rules.' },
        ],
    },
    '/cookies': {
        title: 'Cookie Policy',
        seoTitle: 'Cookie Policy',
        seoDesc: 'Understand how ResumeBuildIn uses cookies and similar technologies.',
        lastUpdated: 'February 1, 2026',
        sections: [
            { heading: 'What Are Cookies', body: 'Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and provide a better experience.' },
            { heading: 'Essential Cookies', body: 'We use essential cookies for authentication, session management, and security. These are strictly necessary and cannot be disabled while using our service.' },
            { heading: 'Functional Cookies', body: 'We use functional cookies to remember your theme preference (light/dark mode), language settings, and editor state. These enhance your experience but are not strictly required.' },
            { heading: 'Analytics', body: 'We may use privacy-friendly analytics to understand how our service is used. We do not use Google Analytics or any service that shares data with advertising networks.' },
            { heading: 'Third-Party Cookies', body: 'Our payment processor (Stripe) may set cookies for fraud prevention. No advertising cookies are used on ResumeBuildIn.' },
            { heading: 'Managing Cookies', body: 'You can manage cookies through your browser settings. Disabling essential cookies may prevent you from using certain features of our service.' },
        ],
    },
}

export default function LegalPage() {
    const location = useLocation()
    const content = LEGAL_CONTENT[location.pathname]

    // Fallback if route doesn't match
    if (!content) {
        return (
            <div className="min-h-screen bg-parchment dark:bg-ink flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-display text-3xl text-ink dark:text-parchment mb-4">Page Not Found</h1>
                    <Link to="/" className="btn btn-gold">Go Home</Link>
                </div>
            </div>
        )
    }

    useSEO({ title: content.seoTitle, description: content.seoDesc, path: location.pathname })

    return (
        <div className="min-h-screen bg-parchment dark:bg-ink flex flex-col">
            <header className="flex items-center justify-between px-8 py-5">
                <Link to="/" className="font-display text-xl font-light text-ink dark:text-parchment no-underline tracking-tight">◈ Resume<em className="italic text-gold">BuildIn</em></Link>
                <Link to="/" className="btn btn-ghost btn-sm">← Back</Link>
            </header>

            <main className="flex-1 max-w-[720px] mx-auto w-full px-6 py-16">
                <h1 className="font-display text-4xl font-light text-ink dark:text-parchment mb-3 tracking-tight">{content.title}</h1>
                <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink-20 mb-10">Last updated: {content.lastUpdated}</p>
                <div className="h-px bg-ink-10 mb-10" />

                <div className="space-y-8">
                    {content.sections.map((s, i) => (
                        <section key={i}>
                            <h2 className="text-[15px] font-semibold text-ink dark:text-parchment mb-2.5 flex items-center gap-2.5">
                                <span className="text-gold text-xs">§{i + 1}</span>
                                {s.heading}
                            </h2>
                            <p className="text-[14px] text-ink-60 dark:text-[rgba(250,248,243,0.5)] leading-[1.8] m-0">{s.body}</p>
                        </section>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-ink-10">
                    <p className="text-[13px] text-ink-20 leading-relaxed">
                        If you have questions about this policy, please contact us at{' '}
                        <a href="mailto:legal@resumebuildin.com" className="text-gold underline">legal@resumebuildin.com</a>.
                    </p>
                    <p className="text-[13px] text-ink-20 leading-relaxed mt-3">
                        Resume BuildIn is operated by RZeal Solutions, VA, United States.
                    </p>
                </div>
            </main>
        </div>
    )
}
