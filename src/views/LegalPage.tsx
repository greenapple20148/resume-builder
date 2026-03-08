'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSEO } from '@/lib/useSEO'
import { useTheme } from '@/lib/useTheme'

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
    '/refund-policy': {
        title: 'Refund Policy',
        seoTitle: 'Refund Policy',
        seoDesc: 'Understand the refund policy for ResumeBuildIn digital services and subscriptions.',
        lastUpdated: 'March 1, 2026',
        sections: [
            { heading: 'Overview', body: 'We want you to feel confident in your purchase. Because our product is a digital service, we offer a 7-day conditional refund policy.' },
            { heading: 'Eligibility for Refund', body: 'You may request a refund within 7 days of purchase if:\n\n• You are unsatisfied with the service\n• You have not excessively downloaded or exported resume templates\n• No resume review or mock interview session has been fully delivered' },
            { heading: 'Non-Refundable Situations', body: 'Refunds will not be issued if:\n\n• A professional resume review has already been completed\n• A mock interview session has been conducted\n• There is evidence of abuse or excessive use of the platform' },
            { heading: 'How to Request a Refund', body: 'To request a refund, email support@resumebuildin.io with your account email and reason for the request. Please include your order confirmation or receipt if available.' },
            { heading: 'Processing Time', body: 'Approved refunds are processed within 5–10 business days. The refund will be returned to the original payment method used at checkout.' },
            { heading: 'Subscription Cancellations', body: 'You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period. No partial refunds are given for unused time in the current billing cycle.' },
        ],
    },
}

export default function LegalPage() {
    const pathname = usePathname()
    const content = LEGAL_CONTENT[pathname]
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    // Fallback if route doesn't match
    if (!content) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--parchment)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--ink)', marginBottom: 16 }}>Page Not Found</h1>
                    <Link href="/" className="btn btn-gold">Go Home</Link>
                </div>
            </div>
        )
    }

    useSEO({ title: content.seoTitle, description: content.seoDesc, path: pathname })

    return (
        <div style={{ minHeight: '100vh', background: 'var(--parchment)', display: 'flex', flexDirection: 'column', transition: 'background 0.3s ease' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px' }}>
                <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 300, color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-0.02em' }}>
                    <span style={{ color: 'var(--gold)', marginRight: 4 }}>◈</span>
                    Resume<em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>BuildIn</em>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            background: 'var(--ink-05)',
                            border: '1px solid var(--ink-10)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--ink-40)',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {isDark ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>
                    <Link href="/" className="btn btn-ghost btn-sm">← Back</Link>
                </div>
            </header>

            {/* Content */}
            <main style={{ flex: 1, maxWidth: 720, margin: '0 auto', width: '100%', padding: '64px 24px' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 300, color: 'var(--ink)', marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    {content.title}
                </h1>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--ink-40)', marginBottom: 40 }}>
                    Last updated: {content.lastUpdated}
                </p>
                <div style={{ height: 1, background: 'var(--ink-10)', marginBottom: 40 }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {content.sections.map((s, i) => (
                        <section key={i}>
                            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
                                <span style={{ color: 'var(--gold)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>§{i + 1}</span>
                                {s.heading}
                            </h2>
                            <div style={{ fontSize: 14, color: 'var(--ink-40)', lineHeight: 1.8, margin: 0 }}>
                                {s.body.split('\n').map((line, li) => (
                                    <p key={li} style={{ margin: line.startsWith('•') ? '6px 0 6px 4px' : li > 0 ? '8px 0 0' : '0' }}>
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer contact */}
                <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--ink-10)' }}>
                    <p style={{ fontSize: 13, color: 'var(--ink-40)', lineHeight: 1.7 }}>
                        If you have questions about this policy, please contact us at{' '}
                        <a href="mailto:legal@resumebuildin.com" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>legal@resumebuildin.com</a>.
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--ink-40)', lineHeight: 1.7, marginTop: 12 }}>
                        Resume BuildIn is operated by RZeal Solutions, United States.
                    </p>
                </div>
            </main>
        </div>
    )
}

