'use client'
import Link from 'next/link'
import { useSEO } from '@/lib/useSEO'
import { useTheme } from '@/lib/useTheme'

export default function AboutPage() {
    useSEO({ title: 'About Us', description: 'Learn about ResumeBuildIn — beautiful resumes that get you hired.', path: '/about' })
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <div style={{ minHeight: '100vh', background: 'var(--parchment)', display: 'flex', flexDirection: 'column', transition: 'background 0.3s ease' }}>
            {/* Nav */}
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px' }}>
                <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 300, color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-0.02em' }}>
                    <span style={{ color: 'var(--gold)', marginRight: 4 }}>◈</span>
                    Resume<em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>BuildIn</em>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                        onClick={toggleTheme}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        style={{
                            width: 34, height: 34, borderRadius: '50%', background: 'var(--ink-05)',
                            border: '1px solid var(--ink-10)', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: 'var(--ink-40)', transition: 'all 0.2s ease',
                        }}
                    >
                        {isDark ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                        ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                        )}
                    </button>
                    <a href="/" className="btn btn-ghost btn-sm">← Back</a>
                </div>
            </header>

            <main style={{ flex: 1, maxWidth: 720, margin: '0 auto', width: '100%', padding: '64px 24px' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 300, color: 'var(--ink)', marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    About <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Us</em>
                </h1>
                <div style={{ height: 1, background: 'var(--ink-10)', marginBottom: 40 }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 15, color: 'var(--ink-70)', lineHeight: 1.7 }}>
                    <p style={{ margin: 0 }}>
                        <strong style={{ color: 'var(--ink)' }}>ResumeBuildIn</strong> was born from a simple frustration: beautiful resume design shouldn{"'"}t require a design degree. We believe every professional deserves a resume that reflects their talent — crisp, polished, and unmistakably premium.
                    </p>
                    <p style={{ margin: 0 }}>
                        Our team of designers and engineers obsess over typography, whitespace, and the subtle details that make a hiring manager pause and look twice. Every template is ATS-optimized and recruiter-approved, so your resume works as hard as you do.
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 300, color: 'var(--ink)', paddingTop: 24, lineHeight: 1.1 }}>Our Mission</h2>
                    <p style={{ margin: 0 }}>
                        To democratize professional branding. Whether you{"'"}re a first-time job seeker or a seasoned executive, you deserve tools that present your story with clarity and confidence.
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 300, color: 'var(--ink)', paddingTop: 24, lineHeight: 1.1 }}>What We Value</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, paddingTop: 8 }}>
                        {[
                            { icon: '◈', title: 'Craft', desc: 'Every pixel is intentional. We sweat the details so you don\'t have to.' },
                            { icon: '✦', title: 'Simplicity', desc: 'Complex made simple. Build a stunning resume in minutes, not hours.' },
                            { icon: '●', title: 'Impact', desc: 'Your resume should open doors. We optimize for real-world results.' },
                        ].map(v => (
                            <div key={v.title} style={{ background: 'var(--white)', border: '1px solid var(--ink-10)', borderRadius: 12, padding: 20 }}>
                                <div style={{ color: 'var(--gold)', fontSize: 20, marginBottom: 12 }}>{v.icon}</div>
                                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 6, fontFamily: 'var(--font-body)' }}>{v.title}</h3>
                                <p style={{ fontSize: 13, color: 'var(--ink-40)', lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 300, color: 'var(--ink)', paddingTop: 24, lineHeight: 1.1 }}>Get in Touch</h2>
                    <p style={{ margin: 0 }}>
                        Have questions, feedback, or partnership inquiries? We{"'"}d love to hear from you at <a href="mailto:hello@resumebuildin.com" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>hello@resumebuildin.com</a>.
                    </p>
                </div>
            </main>
        </div>
    )
}
