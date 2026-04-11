'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useSEO } from '@/lib/useSEO'
import { useTheme } from '@/lib/useTheme'
import { toast } from '../components/Toast'
import { LandingIcon } from '../components/LandingIcons'

export default function ContactPage() {
    useSEO({ title: 'Contact Us', description: 'Get in touch with the ResumeBuildIn team. We\'d love to hear from you.', path: '/contact' })
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [sending, setSending] = useState(false)
    const [honeypot, setHoneypot] = useState('')
    const loadedAt = useRef(Date.now())

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, _hp: honeypot, _ts: loadedAt.current }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to send message')
            toast.success('Message sent! We\'ll get back to you within 24 hours.')
            setForm({ name: '', email: '', subject: '', message: '' })
        } catch (err: any) {
            toast.error(err?.message || 'Failed to send message. Please try again.')
        } finally {
            setSending(false)
        }
    }

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
                    Contact <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Us</em>
                </h1>
                <p style={{ fontSize: 15, color: 'var(--ink-40)', marginBottom: 8, marginTop: 0 }}>Have a question, suggestion, or just want to say hi? We{"'"}d love to hear from you.</p>
                <p style={{ fontSize: 13, color: 'var(--gold)', marginBottom: 40, marginTop: 0, fontWeight: 500 }}>We guarantee response times Monday–Friday during business hours. No bots. Real help.</p>
                <div style={{ height: 1, background: 'var(--ink-10)', marginBottom: 40 }} />

                {/* Contact cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, marginBottom: 48 }}>
                    {[
                        { icon: 'mail', title: 'Email', detail: 'hello@resumebuildin.com', sub: 'We reply within 24 hours' },
                        { icon: 'message-circle', title: 'Live Chat', detail: 'Available 9am–6pm EST', sub: 'Mon – Fri' },
                        { icon: 'twitter', title: 'Twitter / X', detail: '@resumebuildin', sub: 'DMs open' },
                    ].map(c => (
                        <div key={c.title} style={{ background: 'var(--white)', border: '1px solid var(--ink-10)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center', color: 'var(--gold)' }}><LandingIcon name={c.icon} size={24} /></div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{c.title}</div>
                            <div style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 500 }}>{c.detail}</div>
                            <div style={{ fontSize: 11, color: 'var(--ink-20)', marginTop: 4 }}>{c.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Priority Support Upsell */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(212,163,88,0.08), rgba(212,163,88,0.02))',
                    border: '1.5px solid rgba(212,163,88,0.25)',
                    borderRadius: 14,
                    padding: '28px 32px',
                    marginBottom: 48,
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: 'linear-gradient(135deg, #d4a358, #c9923c)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', flexShrink: 0,
                        }}><LandingIcon name="zap" size={22} /></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>Skip-the-Line Priority Support</div>
                            <p style={{ fontSize: 13, color: 'var(--ink-40)', margin: '0 0 14px 0', lineHeight: 1.6 }}>
                                When your job application deadline is close, waiting 48 hours isn't an option.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px 24px', marginBottom: 16 }}>
                                {[
                                    { icon: 'clock', text: 'Guaranteed 12-hour response time' },
                                    { icon: 'rocket', text: 'Your request moves to the front of the queue' },
                                    { icon: 'target', text: 'Direct assistance with resume edits & formatting' },
                                    { icon: 'message-circle', text: 'Faster clarification on AI suggestions' },
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-70)' }}>
                                        <span style={{ color: 'var(--gold)', flexShrink: 0, display: 'flex' }}><LandingIcon name={item.icon} size={16} /></span> {item.text}
                                    </div>
                                ))}
                            </div>
                            <Link href="/pricing" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '8px 20px', borderRadius: 8,
                                background: 'linear-gradient(135deg, #d4a358, #c9923c)',
                                color: '#fff', fontSize: 13, fontWeight: 600,
                                textDecoration: 'none', transition: 'all 0.2s ease',
                            }}>
                                Upgrade to Pro →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Contact form */}
                <form onSubmit={handleSubmit} style={{ background: 'var(--white)', border: '1px solid var(--ink-10)', borderRadius: 12, padding: 32 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 300, color: 'var(--ink)', marginBottom: 20, lineHeight: 1.2 }}>Send us a message</h2>

                    {/* Honeypot — hidden from real users, bots will fill it */}
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                        <label htmlFor="_hp">Leave blank</label>
                        <input id="_hp" name="_hp" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" maxLength={100} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 16 }}>
                        <label className="form-label">Subject</label>
                        <input className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" maxLength={200} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 20 }}>
                        <label className="form-label">Message</label>
                        <textarea className="form-textarea" style={{ minHeight: 120 }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us what's on your mind..." maxLength={5000} required />
                    </div>
                    <button type="submit" className="btn btn-gold" style={{ width: '100%' }} disabled={sending}>
                        {sending ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </main>
        </div>
    )
}
