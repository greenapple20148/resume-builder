import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '../lib/useSEO'
import { toast } from '../components/Toast'
import { supabase } from '../lib/supabase'

export default function ContactPage() {
    useSEO({ title: 'Contact Us', description: 'Get in touch with the ResumeBuildIn team. We\'d love to hear from you.', path: '/contact' })

    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [sending, setSending] = useState(false)
    const [honeypot, setHoneypot] = useState('')
    const loadedAt = useRef(Date.now())

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)
        try {
            const { data, error } = await supabase.functions.invoke('contact-form', {
                body: { ...form, _hp: honeypot, _ts: loadedAt.current },
            })
            if (error) throw error
            if (data?.error) throw new Error(data.error)
            toast.success('Message sent! We\'ll get back to you within 24 hours.')
            setForm({ name: '', email: '', subject: '', message: '' })
        } catch (err: any) {
            toast.error(err?.message || 'Failed to send message. Please try again.')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="min-h-screen bg-parchment dark:bg-ink flex flex-col">
            <header className="flex items-center justify-between px-8 py-5">
                <Link to="/" className="font-display text-xl font-light text-ink dark:text-parchment no-underline tracking-tight">◈ Resume<em className="italic text-gold">BuildIn</em></Link>
                <Link to="/" className="btn btn-ghost btn-sm">← Back</Link>
            </header>

            <main className="flex-1 max-w-[720px] mx-auto w-full px-6 py-16">
                <h1 className="font-display text-4xl font-light text-ink dark:text-parchment mb-3 tracking-tight">Contact <em className="italic text-gold">Us</em></h1>
                <p className="text-[15px] text-ink-40 dark:text-[rgba(250,248,243,0.4)] mb-10">Have a question, suggestion, or just want to say hi? We{"'"}d love to hear from you.</p>
                <div className="h-px bg-ink-10 mb-10" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    {[
                        { icon: '✉️', title: 'Email', detail: 'hello@resumebuildin.com', sub: 'We reply within 24 hours' },
                        { icon: '💬', title: 'Live Chat', detail: 'Available 9am–6pm EST', sub: 'Mon – Fri' },
                        { icon: '🐦', title: 'Twitter / X', detail: '@resumebuildin', sub: 'DMs open' },
                    ].map(c => (
                        <div key={c.title} className="bg-[var(--white)] dark:bg-[rgba(250,248,243,0.03)] border border-ink-10 rounded-xl p-5 text-center">
                            <div className="text-2xl mb-2">{c.icon}</div>
                            <div className="text-sm font-semibold text-ink dark:text-parchment mb-1">{c.title}</div>
                            <div className="text-[13px] text-gold font-medium">{c.detail}</div>
                            <div className="text-[11px] text-ink-20 mt-1">{c.sub}</div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="bg-[var(--white)] dark:bg-[rgba(250,248,243,0.03)] border border-ink-10 rounded-xl p-8 space-y-5">
                    <h2 className="font-display text-xl font-light text-ink dark:text-parchment mb-2">Send us a message</h2>

                    {/* Honeypot — hidden from real users, bots will fill it */}
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                        <label htmlFor="_hp">Leave blank</label>
                        <input id="_hp" name="_hp" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" maxLength={100} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Subject</label>
                        <input className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" maxLength={200} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Message</label>
                        <textarea className="form-textarea min-h-[120px]" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us what's on your mind..." maxLength={5000} required />
                    </div>
                    <button type="submit" className="btn btn-gold w-full" disabled={sending}>
                        {sending ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </main>
        </div>
    )
}
