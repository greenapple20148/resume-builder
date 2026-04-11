'use client'
import Link from 'next/link'
import { useSEO } from '@/lib/useSEO'
import { useTheme } from '@/lib/useTheme'

export default function BlogPage() {
    useSEO({ title: 'Blog', description: 'Resume tips, career advice, and product updates from ResumeBuildIn.', path: '/blog' })
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    const posts = [
        { date: 'Feb 24, 2026', title: '10 Resume Mistakes That Cost You Interviews', excerpt: 'Small formatting errors and vague descriptions can tank your chances. Here\'s what to fix today.', tag: 'Career Tips' },
        { date: 'Feb 18, 2026', title: 'ATS-Friendly Resumes: The Complete Guide', excerpt: 'Learn how applicant tracking systems parse your resume and how to optimize for them.', tag: 'Guides' },
        { date: 'Feb 10, 2026', title: 'New Templates: Swiss Grid & Purple Dusk', excerpt: 'We just launched two stunning new templates designed for creative and technical professionals.', tag: 'Product' },
        { date: 'Jan 28, 2026', title: 'How to Write a Summary That Stands Out', excerpt: 'Your professional summary is prime real estate. Make every word count with these proven formulas.', tag: 'Career Tips' },
        { date: 'Jan 15, 2026', title: 'The Power of Quantified Achievements', excerpt: 'Numbers speak louder than adjectives. Learn how to transform vague bullets into impact statements.', tag: 'Guides' },
    ]

    return (
        <div style={{ minHeight: '100vh', background: 'var(--parchment)', display: 'flex', flexDirection: 'column', transition: 'background 0.3s ease' }}>
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
                    Blog
                </h1>
                <p style={{ fontSize: 15, color: 'var(--ink-40)', marginBottom: 40, marginTop: 0 }}>Resume tips, career advice, and product updates.</p>
                <div style={{ height: 1, background: 'var(--ink-10)', marginBottom: 40 }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {posts.map((post, i) => (
                        <article
                            key={i}
                            style={{
                                background: 'var(--white)', border: '1px solid var(--ink-10)', borderRadius: 12,
                                padding: 24, cursor: 'pointer', transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold-light)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ink-10)'; e.currentTarget.style.boxShadow = 'none' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--ink-20)' }}>{post.date}</span>
                                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gold)', background: 'var(--gold-pale)', padding: '2px 8px', borderRadius: 9999 }}>{post.tag}</span>
                            </div>
                            <h2 style={{ fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 400, color: 'var(--ink)', marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.3 }}>{post.title}</h2>
                            <p style={{ fontSize: 13.5, color: 'var(--ink-40)', lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>
                        </article>
                    ))}
                </div>

                <div style={{ textAlign: 'center', paddingTop: 48, fontSize: 13, color: 'var(--ink-20)' }}>
                    More articles coming soon. Stay tuned!
                </div>
            </main>
        </div>
    )
}
