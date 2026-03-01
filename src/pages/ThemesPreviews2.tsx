import React from 'react'
import '../styles/templates-batch2.css'
import { useDynamicData } from './ThemesPreviews'
import { ResumeData } from '../types'

interface PreviewProps {
    data?: Partial<ResumeData>
}

/* ═══ Resume 20 — Origami Zen ═══ */
export const OrigamiZenPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'origami_zen')
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    return (
        <div className="origami-zen-wrapper">
            <div className="red-stripe" />
            <header>
                <div>
                    <div className="name">{firstName}<strong>{lastName}</strong></div>
                    <div className="role">{res.role}</div>
                </div>
                <div className="contact-block">
                    <div className="contact-item">{res.location}<br />{res.phone}<br /><a href="#">{res.email}</a></div>
                </div>
            </header>
            <div className="body">
                <div className="main">
                    <div className="section">
                        <div className="section-title">Summary</div>
                        <p className="summary">{res.summary}</p>
                    </div>
                    <div className="section">
                        <div className="section-title">Experience</div>
                        {res.experience.map((e, i) => (
                            <div className="entry" key={i}>
                                <div className="entry-meta"><div className="entry-title">{e.title}</div><div className="entry-date">{e.startDate} — {e.current ? 'Present' : e.endDate}</div></div>
                                <div className="entry-company">{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                                {e.description && <ul>{e.description.split('\n').filter(Boolean).map((b, j) => <li key={j}>{b.replace(/^[•\-–—]\s*/, '')}</li>)}</ul>}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="center-rule"><div className="fold-mark" /></div>
                <div className="sidebar">
                    <div className="section">
                        <div className="section-title">Skills</div>
                        {res.skills.map((s, i) => <div className="sidebar-item" key={i}>{s}</div>)}
                    </div>
                    <div className="section">
                        <div className="section-title">Education</div>
                        {res.education.map((edu, i) => (
                            <div className="edu-item" key={i}><h4>{edu.degree}</h4><p>{edu.school}<br />{edu.endDate}</p></div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="foot-ornament"><div className="ornament-line" /><div className="ornament-mark" /><div className="ornament-line" /></div>
        </div>
    )
}

/* ═══ Resume 21 — Corporate Slate ═══ */
export const CorporateSlatePreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'corporate_slate')
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    const initials = (firstName[0] || '') + (lastName[0] || '')
    const s = {
        wrap: { fontFamily: "'Inter', sans-serif", background: '#fff', display: 'flex', overflow: 'hidden', minHeight: '100%' } as React.CSSProperties,
        aside: { width: 256, flexShrink: 0, background: '#1e293b', color: '#94a3b8', display: 'flex', flexDirection: 'column' as const, gap: 28, padding: 32 },
        initials: { width: 64, height: 64, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 20 },
        h1: { color: '#fff', fontSize: 24, fontWeight: 700, lineHeight: 1.2 },
        role: { color: '#60a5fa', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' as const, marginTop: 8, fontWeight: 500 },
        sTitle: { color: '#60a5fa', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: 600, marginBottom: 12 },
        hr: { border: 'none', borderTop: '1px solid #475569', margin: 0 },
        contact: { fontSize: 12.5, color: '#94a3b8', display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
        main: { flex: 1, padding: 40 },
        bars: { display: 'flex', gap: 4, marginBottom: 32 },
        mTitle: { fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: '#2563eb', borderBottom: '2px solid #dbeafe', paddingBottom: 8, marginBottom: 16 },
        entryTitle: { fontSize: 15, fontWeight: 600, color: '#1e293b' },
        entryDate: { fontSize: 11.5, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: 4, fontWeight: 500, whiteSpace: 'nowrap' as const },
        entryCo: { fontSize: 13, color: '#2563eb', fontWeight: 600, marginBottom: 8 },
        bullet: { fontSize: 13, color: '#64748b', lineHeight: 1.6, display: 'flex', gap: 8, marginBottom: 6 },
        bDot: { color: '#60a5fa', marginTop: 4, flexShrink: 0 },
        skillBar: { height: 4, background: '#334155', borderRadius: 99, marginTop: 4 },
        skillFill: (w: string) => ({ height: '100%', width: w, background: '#3b82f6', borderRadius: 99 }),
    }
    return (
        <div style={s.wrap}>
            <aside style={s.aside}>
                <div><div style={s.initials}>{initials}</div><h1 style={s.h1}>{firstName}<br />{lastName}</h1><p style={s.role}>{res.role}</p></div>
                <hr style={s.hr} />
                <div><div style={s.sTitle}>Contact</div>
                    <div style={s.contact}>{res.email}</div>
                    <div style={s.contact}>{res.phone}</div>
                    <div style={s.contact}>{res.location}</div>
                </div>
                <hr style={s.hr} />
                <div><div style={s.sTitle}>Skills</div>
                    {res.skills.slice(0, 4).map((sk, i) => (
                        <div key={i} style={{ marginBottom: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: '#cbd5e1' }}>{sk}</span></div><div style={s.skillBar}><div style={s.skillFill(`${85 - i * 5}%`)} /></div></div>
                    ))}
                </div>
                <hr style={s.hr} />
                <div><div style={s.sTitle}>Education</div>
                    {res.education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: 12 }}><p style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{edu.degree}</p><p style={{ color: '#94a3b8', fontSize: 11.5, marginTop: 2 }}>{edu.school}<br />{edu.endDate}</p></div>
                    ))}
                </div>
            </aside>
            <main style={s.main}>
                <div style={s.bars}><div style={{ height: 4, width: 56, background: '#3b82f6', borderRadius: 99 }} /><div style={{ height: 4, width: 36, background: '#93c5fd', borderRadius: 99 }} /><div style={{ height: 4, width: 20, background: '#bfdbfe', borderRadius: 99 }} /></div>
                <section style={{ marginBottom: 32 }}>
                    <div style={s.mTitle}>Professional Summary</div>
                    <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.6 }}>{res.summary}</p>
                </section>
                <section style={{ marginBottom: 32 }}>
                    <div style={s.mTitle}>Work Experience</div>
                    {res.experience.map((e, i) => (
                        <div key={i} style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}><h3 style={s.entryTitle}>{e.title}</h3><span style={s.entryDate}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div>
                            <p style={s.entryCo}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                            {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={s.bullet}><span style={s.bDot}>▸</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                        </div>
                    ))}
                </section>
            </main>
        </div>
    )
}

/* ═══ Resume 22 — Teal Wave ═══ */
export const TealWavePreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'teal_wave')
    const c = { teal: '#0d9488', tealDk: '#0f766e', tealLt: '#99f6e4', bg: '#f0fdfa', white: '#fff', txt: '#475569', txtDk: '#1e293b' }
    const sTitle = { color: c.tealDk, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 20 }
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: c.white, overflow: 'hidden' }}>
            <header style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)', padding: '48px 56px 64px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -48, right: -48, width: 192, height: 192, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
                    <div>
                        <p style={{ color: '#99f6e4', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>Curriculum Vitae</p>
                        <h1 style={{ color: '#fff', fontSize: 50, fontWeight: 700, lineHeight: 1 }}>{firstName}<br /><span style={{ fontWeight: 300, fontStyle: 'italic', opacity: 0.8 }}>{lastName}</span></h1>
                        <p style={{ color: '#ccfbf1', fontSize: 14, letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 12, fontWeight: 500 }}>{res.role}</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 13, color: '#ccfbf1', lineHeight: 2 }}>
                        <p>{res.location}</p><p>{res.phone}</p><p>{res.email}</p>
                    </div>
                </div>
            </header>
            <div style={{ padding: '40px 56px' }}>
                <div style={{ background: c.bg, borderLeft: `4px solid ${c.teal}`, borderRadius: '0 12px 12px 0', padding: 20, marginBottom: 40 }}>
                    <p style={{ color: c.txt, fontSize: 14, lineHeight: 1.6 }}>{res.summary}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
                    <div>
                        <h2 style={sTitle}>Experience</h2>
                        {res.experience.map((e, i) => (
                            <div key={i} style={{ border: '1px solid #f1f5f9', borderRadius: 12, padding: 20, marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <h3 style={{ fontWeight: 600, fontSize: 15, color: c.txtDk }}>{e.title}</h3>
                                    <span style={{ color: c.tealDk, fontSize: 12, background: c.bg, border: '1px solid #99f6e4', padding: '2px 10px', borderRadius: 99, fontWeight: 500, whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
                                </div>
                                <p style={{ color: c.tealDk, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                                {e.description && e.description.split('\n').filter(Boolean).map((b, j) => (
                                    <div key={j} style={{ display: 'flex', gap: 10, fontSize: 13, color: c.txt, marginBottom: 8 }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2dd4bf', marginTop: 6, flexShrink: 0 }} />{b.replace(/^[•\-–—]\s*/, '')}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div>
                        <h2 style={sTitle}>Education</h2>
                        {res.education.map((edu, i) => (
                            <div key={i} style={{ background: c.bg, borderRadius: 8, padding: 14, marginBottom: 12 }}><p style={{ fontWeight: 600, fontSize: 13, color: c.txtDk }}>{edu.degree}</p><p style={{ color: c.tealDk, fontSize: 11.5, marginTop: 4 }}>{edu.school} · {edu.endDate}</p></div>
                        ))}
                        <h2 style={{ ...sTitle, marginTop: 28 }}>Core Skills</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {res.skills.map((sk, i) => (
                                <span key={i} style={{ fontSize: 11.5, background: '#ccfbf1', color: c.tealDk, padding: '4px 10px', borderRadius: 99, fontWeight: 500 }}>{sk}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 23 — Purple Dusk ═══ */
export const PurpleDuskPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'purple_dusk')
    const c = {
        violet900: '#4c1d95', violet950: '#2e1065', violet700: '#6d28d9', violet600: '#7c3aed',
        violet500: '#8b5cf6', violet400: '#a78bfa', violet300: '#c4b5fd', violet200: '#ddd6fe',
        violet100: '#ede9fe', violet50: '#f5f3ff', fuchsia500: '#d946ef', fuchsia400: '#e879f9',
        slate800: '#1e293b', slate500: '#64748b', white: '#fff',
    }
    const sTitle = { color: c.violet400, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: 600, marginBottom: 12 }
    const hr = { height: 1, background: 'rgba(109,40,217,0.3)', margin: 0, border: 'none' }
    const gradBar = (w: string) => ({ height: '100%', width: w, background: `linear-gradient(to right, ${c.violet400}, ${c.fuchsia400})`, borderRadius: 99 })
    const datePill = { fontSize: 11, color: c.violet600, background: c.violet50, border: `1px solid ${c.violet200}`, padding: '2px 10px', borderRadius: 99, fontWeight: 500, whiteSpace: 'nowrap' as const }
    const bullet = { display: 'flex', gap: 10, fontSize: 13, color: c.slate500, lineHeight: 1.6, marginBottom: 6 }
    const dot = { color: c.violet400, marginTop: 4, flexShrink: 0, fontSize: 8 }
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    const dotColors = [c.violet500, c.violet400, c.violet300]

    return (
        <div style={{ fontFamily: "'Sora', 'DM Sans', sans-serif", background: c.white, overflow: 'hidden', display: 'flex', flexDirection: 'column' as const }}>
            {/* Top gradient strip */}
            <div style={{ height: 8, background: `linear-gradient(to right, ${c.violet700}, ${c.violet500}, ${c.fuchsia500})` }} />
            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <aside style={{ width: 288, flexShrink: 0, background: `linear-gradient(to bottom, ${c.violet900}, ${c.violet950})`, color: c.white, padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
                    <div>
                        <p style={{ color: c.violet400, fontSize: 10, letterSpacing: 3.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>{res.role}</p>
                        <h1 style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.2 }}>{firstName}<br /><span style={{ color: c.violet300, fontWeight: 300 }}>{lastName}</span></h1>
                        <p style={{ color: c.violet400, fontSize: 12, marginTop: 16, lineHeight: 1.8, fontWeight: 300 }}>{res.location}<br />{res.phone}<br />{res.email}</p>
                    </div>
                    <hr style={hr} />
                    <div>
                        <div style={sTitle}>About</div>
                        <p style={{ color: c.violet200, fontSize: 12.5, lineHeight: 1.6, fontWeight: 300 }}>{res.summary}</p>
                    </div>
                    <hr style={hr} />
                    <div>
                        <div style={sTitle}>Expertise</div>
                        {res.skills.slice(0, 5).map((name, i) => (
                            <div key={i} style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                                    <span style={{ color: c.violet100 }}>{name}</span>
                                </div>
                                <div style={{ height: 2, background: c.violet900, borderRadius: 99 }}><div style={gradBar(`${95 - i * 5}%`)} /></div>
                            </div>
                        ))}
                    </div>
                    <hr style={hr} />
                    <div>
                        <div style={sTitle}>Education</div>
                        {res.education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: 12 }}><p style={{ color: c.white, fontSize: 13, fontWeight: 600 }}>{edu.degree}</p><p style={{ color: c.violet400, fontSize: 11.5, marginTop: 2, fontWeight: 300 }}>{edu.school} · {edu.endDate}</p></div>
                        ))}
                    </div>
                </aside>

                {/* Main */}
                <main style={{ flex: 1, padding: '40px 40px' }}>
                    {/* Section header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: c.violet100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: c.violet500 }} />
                        </div>
                        <p style={{ color: c.violet600, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Work Experience</p>
                    </div>

                    {/* Experience timeline */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 40 }}>
                        {res.experience.map((e, i) => (
                            <div key={i} style={{ position: 'relative', paddingLeft: 24, borderLeft: `2px solid ${c.violet100}` }}>
                                <div style={{ position: 'absolute', left: -5, top: 4, width: 8, height: 8, borderRadius: '50%', background: dotColors[i % dotColors.length] }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <h3 style={{ fontSize: 15.5, fontWeight: 600, color: c.slate800 }}>{e.title}</h3>
                                    <span style={datePill}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
                                </div>
                                <p style={{ color: c.violet600, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                                {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={bullet}><span style={dot}>●</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                            </div>
                        ))}
                    </div>

                    {/* Skills section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: c.violet100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: c.violet500 }} />
                        </div>
                        <p style={{ color: c.violet600, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Skills</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {res.skills.map((t, i) => (
                            <span key={i} style={{ fontSize: 12, color: c.violet700, background: c.violet50, border: `1px solid ${c.violet200}`, padding: '6px 12px', borderRadius: 8, fontWeight: 500 }}>{t}</span>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}

/* ═══ Resume 24 — Coral Bright ═══ */
export const CoralBrightPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'coral_bright')
    const c = { or500: '#f97316', or400: '#fb923c', or200: '#fed7aa', or100: '#ffedd5', or50: '#fff7ed', or600: '#ea580c', or700: '#c2410c', red400: '#f87171', rose500: '#f43e5c', sl800: '#1e293b', sl500: '#64748b', sl600: '#475569', w: '#fff' }
    const datePill = { fontSize: 11, color: c.or600, background: c.or50, border: `1px solid ${c.or200}`, borderRadius: 99, padding: '2px 10px', fontWeight: 600, whiteSpace: 'nowrap' as const }
    const sHead = { color: c.or500, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }
    const bullet = { display: 'flex', gap: 10, fontSize: 13, color: c.sl500, lineHeight: 1.6, marginBottom: 6 }
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    const initials = (firstName[0] || '') + (lastName[0] || '')
    return (
        <div style={{ fontFamily: "'Nunito', 'DM Sans', sans-serif", background: c.w, overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ background: `linear-gradient(to right, ${c.or500}, ${c.red400}, ${c.rose500})`, padding: '40px 48px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 256, height: 256, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', transform: 'translate(25%,-50%)' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 40 }}>
                    <div style={{ width: 96, height: 96, borderRadius: 16, background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, color: c.w, flexShrink: 0 }}>{initials}</div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ color: c.w, fontSize: 44, fontWeight: 800, lineHeight: 1, letterSpacing: -0.5 }}>{firstName} <span style={{ fontWeight: 300, fontStyle: 'italic' }}>{lastName}</span></h1>
                        <p style={{ color: c.or100, fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', marginTop: 10, fontWeight: 500 }}>{res.role}</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 13, color: c.or100, lineHeight: 2 }}>
                        <p>{res.location}</p><p>{res.phone}</p><p>{res.email}</p>
                    </div>
                </div>
            </header>
            {/* Body */}
            <div style={{ padding: '40px 48px' }}>
                {/* Summary */}
                <div style={{ marginBottom: 36, padding: 20, background: c.or50, borderRadius: 12, borderLeft: `4px solid ${c.or400}` }}>
                    <p style={{ color: c.sl600, fontSize: 14, lineHeight: 1.6 }}>{res.summary}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
                    {/* Experience */}
                    <div>
                        <div style={sHead}><span style={{ width: 16, height: 2, background: c.or400 }} />Experience</div>
                        {res.experience.map((e, i) => (
                            <div key={i} style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}><h3 style={{ fontWeight: 700, fontSize: 15, color: c.sl800 }}>{e.title}</h3><span style={datePill}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div>
                                <p style={{ color: c.or500, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                                {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={bullet}><span style={{ color: c.or400, flexShrink: 0, marginTop: 1, fontWeight: 700 }}>→</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                            </div>
                        ))}
                    </div>
                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                        <div><div style={sHead}><span style={{ width: 16, height: 2, background: c.or400 }} />Education</div>
                            {res.education.map((edu, i) => (
                                <div key={i} style={{ background: c.or50, borderRadius: 12, padding: 14, marginBottom: 8 }}><p style={{ color: c.sl800, fontWeight: 700, fontSize: 13 }}>{edu.degree}</p><p style={{ color: c.or500, fontSize: 11.5, marginTop: 2, fontWeight: 600 }}>{edu.school} · {edu.endDate}</p></div>
                            ))}
                        </div>
                        <div><div style={sHead}><span style={{ width: 16, height: 2, background: c.or400 }} />Skills</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {res.skills.map((s, i) => (
                                    <span key={i} style={{ background: c.or100, color: c.or700, fontSize: 11.5, padding: '4px 10px', borderRadius: 99, fontWeight: 600 }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 25 — Ocean Deep ═══ */
export const OceanDeepPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'ocean_deep')
    const c = { sky900: '#0c4a6e', sky800: '#075985', sky700: '#0369a1', sky600: '#0284c7', sky400: '#38bdf8', sky300: '#7dd3fc', sky200: '#bae6fd', sky100: '#e0f2fe', sky50: '#f0f9ff', ind900: '#312e81', sl800: '#1e293b', sl700: '#334155', sl500: '#64748b', sl600: '#475569', w: '#fff' }
    const datePill = { fontSize: 11, color: c.sky600, fontWeight: 600, background: c.sky50, border: `1px solid ${c.sky200}`, padding: '2px 10px', borderRadius: 4, whiteSpace: 'nowrap' as const }
    const sHead = { color: c.sky700, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }
    const bullet = { display: 'flex', gap: 10, fontSize: 13, color: c.sl500, lineHeight: 1.6, marginBottom: 6 }
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    return (
        <div style={{ fontFamily: "'Libre Franklin', 'DM Sans', sans-serif", overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ background: `linear-gradient(135deg, ${c.sky900}, #1e3a5f, ${c.ind900})`, padding: '56px 56px 48px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -80, right: -80, width: 288, height: 288, borderRadius: '50%', background: 'rgba(56,189,248,0.1)', filter: 'blur(48px)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 32, marginBottom: 32 }}>
                        <div>
                            <p style={{ color: c.sky400, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>{res.role}</p>
                            <h1 style={{ color: c.w, fontSize: 50, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>{firstName}</h1>
                            <h1 style={{ color: c.sky300, fontSize: 50, fontWeight: 200, lineHeight: 1, fontStyle: 'italic' }}>{lastName}</h1>
                        </div>
                        <div style={{ textAlign: 'right', color: c.sky300, fontSize: 13, lineHeight: 2, fontWeight: 300 }}>
                            <p style={{ color: c.w, fontWeight: 500 }}>{res.location}</p>
                            <p>{res.phone}</p><p>{res.email}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {res.skills.slice(0, 5).map((t, i) => (
                            <span key={i} style={{ fontSize: 11, background: 'rgba(255,255,255,0.1)', color: c.sky200, border: '1px solid rgba(14,116,144,0.4)', padding: '4px 12px', borderRadius: 99 }}>{t}</span>
                        ))}
                    </div>
                </div>
            </header>
            {/* Body */}
            <div style={{ background: c.w, padding: '40px 56px' }}>
                {/* Summary */}
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 40, padding: 20, border: `1px solid ${c.sky100}`, borderRadius: 12, background: 'rgba(240,249,255,0.5)' }}>
                    <div style={{ width: 4, alignSelf: 'stretch', background: c.sky600, borderRadius: 99, flexShrink: 0 }} />
                    <p style={{ color: c.sl600, fontSize: 14, lineHeight: 1.6 }}>{res.summary}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
                    {/* Experience */}
                    <div>
                        <div style={sHead}><div style={{ width: 20, height: 2, background: c.sky400 }} />Experience</div>
                        {res.experience.map((e, i) => (
                            <div key={i} style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}><h3 style={{ color: c.sl800, fontWeight: 700, fontSize: 15 }}>{e.title}</h3><span style={datePill}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div>
                                <p style={{ color: c.sky600, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                                {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={bullet}><span style={{ color: c.sky400, fontWeight: 900, flexShrink: 0, marginTop: 1 }}>›</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                            </div>
                        ))}
                    </div>
                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                        <div><div style={sHead}><div style={{ width: 16, height: 2, background: c.sky400 }} />Education</div>
                            {res.education.map((edu, i) => (
                                <div key={i} style={{ borderLeft: `2px solid ${c.sky300}`, paddingLeft: 12, marginBottom: 12 }}><p style={{ color: c.sl700, fontSize: 13, fontWeight: 600 }}>{edu.degree}</p><p style={{ color: c.sky600, fontSize: 11.5, marginTop: 2 }}>{edu.school}<br />{edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p></div>
                            ))}
                        </div>
                        <div><div style={sHead}><div style={{ width: 16, height: 2, background: c.sky400 }} />Skills</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {res.skills.map((s, i) => (
                                    <span key={i} style={{ fontSize: 11, color: c.sky700, background: c.sky100, padding: '2px 8px', borderRadius: 4 }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 26 — Sage Pro ═══ */
export const SageProPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'sage_pro')
    const c = { g700: '#15803d', g600: '#16a34a', g500: '#22c55e', g400: '#4ade80', g300: '#86efac', g200: '#bbf7d0', g100: '#dcfce7', g50: '#f0fdf4', g800: '#166534', st400: '#a8a29e', st500: '#78716c', st600: '#57534e', st100: '#f5f5f4', st50: '#fafaf9', sl800: '#1e293b', sl700: '#334155', sl500: '#64748b', w: '#fff' }
    const sHead = { color: c.g700, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 20 }
    const datePill = { fontSize: 11, color: c.g700, background: c.g50, border: `1px solid ${c.g200}`, borderRadius: 4, padding: '2px 8px', fontWeight: 600, whiteSpace: 'nowrap' as const, flexShrink: 0 }
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    return (
        <div style={{ fontFamily: "'Lato', 'DM Sans', sans-serif", background: c.w, overflow: 'hidden' }}>
            {/* Top strip */}
            <div style={{ height: 6, display: 'flex' }}><div style={{ flex: 1, background: c.st400 }} /><div style={{ flex: 1, background: c.g600 }} /><div style={{ flex: 1, background: c.st400 }} /></div>
            {/* Header */}
            <header style={{ padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid ${c.st100}` }}>
                <div>
                    <h1 style={{ fontSize: 46, fontWeight: 900, lineHeight: 1, letterSpacing: -0.5, color: c.sl800 }}>{firstName}<br /><span style={{ color: c.g700, fontWeight: 300, fontStyle: 'italic' }}>{lastName}</span></h1>
                    <p style={{ color: c.st400, fontSize: 12, letterSpacing: 3.5, textTransform: 'uppercase', fontWeight: 500, marginTop: 12 }}>{res.role}</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: 13, color: c.st500, lineHeight: 2 }}>
                    <p style={{ color: c.sl700, fontWeight: 600 }}>{res.location}</p>
                    <p>{res.phone}</p><p>{res.email}</p>
                </div>
            </header>
            <div style={{ padding: '40px 48px' }}>
                {/* Profile */}
                <div style={{ marginBottom: 32 }}>
                    <div style={sHead}>Profile</div>
                    <p style={{ color: c.st600, fontSize: 14, lineHeight: 1.6, borderLeft: `3px solid ${c.g300}`, paddingLeft: 16 }}>{res.summary}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
                    {/* Experience */}
                    <div>
                        <div style={sHead}>Experience</div>
                        {res.experience.map((e, i) => (
                            <div key={i} style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 4 }}><h3 style={{ fontWeight: 700, fontSize: 15, color: c.sl800 }}>{e.title}</h3><span style={datePill}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div>
                                <p style={{ color: c.g700, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                                {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ display: 'flex', gap: 8, fontSize: 13, color: c.st500, lineHeight: 1.6, marginBottom: 6 }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: c.g400, marginTop: 8, flexShrink: 0 }} />{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                            </div>
                        ))}
                    </div>
                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                        <div><div style={sHead}>Education</div>
                            {res.education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: 12 }}><p style={{ color: c.sl700, fontWeight: 700, fontSize: 13 }}>{edu.degree}</p><p style={{ color: c.g700, fontSize: 11.5, marginTop: 2, fontWeight: 600 }}>{edu.school} · {edu.endDate}</p></div>
                            ))}
                        </div>
                        <div><div style={sHead}>Skills</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {res.skills.map((s, i) => (
                                    <span key={i} style={{ fontSize: 11.5, color: c.g800, background: c.g100, borderRadius: 4, padding: '4px 10px', fontWeight: 500 }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 27 — Carbon Noir ═══ */
export const CarbonNoirPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'carbon_noir')
    const c = { z950: '#09090b', z900: '#18181b', z800: '#27272a', z700: '#3f3f46', z500: '#71717a', z400: '#a1a1aa', z300: '#d4d4d8', z200: '#e4e4e7', w: '#fff' }
    const sHead = { color: c.z500, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase' as const, fontWeight: 600, marginBottom: 24 }
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    return (
        <div style={{ fontFamily: "'Space Grotesk', 'DM Sans', sans-serif", overflow: 'hidden' }}>
            {/* Name banner */}
            <div style={{ background: c.z900, border: `1px solid ${c.z800}`, padding: '40px 56px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ color: c.w, fontSize: 52, fontWeight: 700, lineHeight: 1, letterSpacing: -1 }}>{firstName}<br /><span style={{ color: c.z400, fontWeight: 300 }}>{lastName}</span></h1>
                        <p style={{ color: c.z500, fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 500, marginTop: 12 }}>{res.role}</p>
                    </div>
                    <div style={{ textAlign: 'right', color: c.z500, fontSize: 13, lineHeight: 2, fontWeight: 300 }}>
                        <p style={{ color: c.z300, fontWeight: 500 }}>{res.location}</p>
                        <p>{res.phone}</p><p>{res.email}</p>
                    </div>
                </div>
            </div>
            {/* Summary band */}
            <div style={{ background: c.z800, borderLeft: `1px solid ${c.z700}`, borderRight: `1px solid ${c.z700}`, padding: '20px 56px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 2, height: 48, background: c.w, flexShrink: 0 }} />
                <p style={{ color: c.z400, fontSize: 13.5, lineHeight: 1.6, fontWeight: 300 }}>{res.summary}</p>
            </div>
            {/* Main body */}
            <div style={{ background: c.z900, border: `1px solid ${c.z800}`, marginTop: 2 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr' }}>
                    {/* Experience */}
                    <div style={{ borderRight: `1px solid ${c.z800}`, padding: '40px 48px' }}>
                        <div style={sHead}>Experience</div>
                        {res.experience.map((e, i) => (
                            <div key={i} style={{ marginBottom: 32, ...(i > 0 ? { borderTop: `1px solid ${c.z800}`, paddingTop: 32 } : {}) }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                                    <h3 style={{ color: c.w, fontWeight: 600, fontSize: 16 }}>{e.title}</h3>
                                    <span style={{ color: c.z500, fontSize: 11, fontWeight: 500, letterSpacing: 1, whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'NOW' : e.endDate}</span>
                                </div>
                                <p style={{ color: c.z400, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: 11, marginBottom: 12 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                                {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ fontSize: 13, color: c.z500, fontWeight: 300, lineHeight: 1.6, marginBottom: 8 }}><span style={{ color: c.w, fontWeight: 700, marginRight: 8 }}>/</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                            </div>
                        ))}
                    </div>
                    {/* Sidebar */}
                    <div style={{ padding: '40px 40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                        <div>
                            <div style={sHead}>Skills</div>
                            {res.skills.slice(0, 5).map((name, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <span style={{ color: c.z300, fontSize: 13 }}>{name}</span>
                                    <div style={{ display: 'flex', gap: 4 }}>{Array.from({ length: 5 }, (_, j) => <div key={j} style={{ width: 8, height: 8, borderRadius: 2, background: j < (5 - i * 0.5) ? c.w : c.z700 }} />)}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: `1px solid ${c.z800}`, paddingTop: 32 }}>
                            <div style={sHead}>Education</div>
                            {res.education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: 12 }}>
                                    <p style={{ color: c.z200, fontSize: 13.5, fontWeight: 600 }}>{edu.degree}</p>
                                    <p style={{ color: c.z500, fontSize: 12, marginTop: 2 }}>{edu.school}<br />{edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 28 — Sand Dune ═══ */
export const SandDunePreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'sand_dune')
    const c = { am900: '#92400e', am800: '#92400e', am700: '#b45309', am600: '#d97706', am500: '#f59e0b', am400: '#fbbf24', am200: '#fde68a', am100: '#fef3c7', am50: '#fffbeb', st800: '#292524', st600: '#57534e', st500: '#78716c', st100: '#f5f5f4', st50: '#fafaf9', w: '#fff' }
    const sHead = { color: c.am700, fontSize: 10, letterSpacing: 3.5, textTransform: 'uppercase' as const, fontWeight: 600, marginBottom: 20 }
    const datePill = { fontSize: 11, color: c.am700, background: c.am50, border: `1px solid ${c.am200}`, borderRadius: 4, padding: '2px 8px', fontWeight: 600, whiteSpace: 'nowrap' as const, flexShrink: 0 }
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    return (
        <div style={{ fontFamily: "'Josefin Sans', 'DM Sans', sans-serif", background: c.st50, overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ background: 'linear-gradient(135deg, #92400e 0%, #b45309 40%, #d97706 70%, #fbbf24 100%)', padding: '48px 56px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -64, right: -64, width: 256, height: 256, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', bottom: -40, left: -40, width: 192, height: 192, borderRadius: '50%', background: 'rgba(146,64,14,0.2)' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40 }}>
                    <div>
                        <p style={{ color: c.am200, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>{res.role}</p>
                        <h1 style={{ color: c.w, fontWeight: 700, fontSize: 46, lineHeight: 1, letterSpacing: -0.5 }}>{firstName}</h1>
                        <h1 style={{ color: c.am200, fontWeight: 200, fontStyle: 'italic', fontSize: 46, lineHeight: 1, fontFamily: "'Merriweather', 'EB Garamond', serif" }}>{lastName}</h1>
                    </div>
                    <div style={{ textAlign: 'right', color: c.am100, fontSize: 13, lineHeight: 2, fontWeight: 300 }}>
                        <p style={{ fontWeight: 600, color: c.w }}>{res.location}</p>
                        <p>{res.phone}</p><p>{res.email}</p>
                    </div>
                </div>
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
                    {res.skills.slice(0, 5).map((t, i) => (
                        <span key={i} style={{ fontSize: 11, background: 'rgba(255,255,255,0.15)', color: c.w, border: '1px solid rgba(255,255,255,0.3)', padding: '4px 12px', borderRadius: 99 }}>{t}</span>
                    ))}
                </div>
            </header>
            <div style={{ padding: '40px 56px' }}>
                {/* Profile */}
                <div style={{ marginBottom: 32, borderLeft: `4px solid ${c.am400}`, paddingLeft: 20, paddingTop: 4, paddingBottom: 4 }}>
                    <span style={{ display: 'block', fontSize: 13, color: c.st500, fontWeight: 300 }}>{res.summary}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 32 }}>
                    {/* Experience */}
                    <div>
                        <div style={sHead}>Experience</div>
                        {res.experience.map((e, i) => (
                            <div key={i} style={{ marginBottom: 28 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 4 }}><h3 style={{ fontWeight: 600, fontSize: 15, color: c.st800 }}>{e.title}</h3><span style={datePill}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div>
                                <p style={{ color: c.am600, fontWeight: 600, fontSize: 13, letterSpacing: 0.5, marginBottom: 10 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                                {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ display: 'flex', gap: 10, fontSize: 13, color: c.st500, lineHeight: 1.6, marginBottom: 6, fontWeight: 300 }}><span style={{ color: c.am500, marginTop: 4, flexShrink: 0, fontSize: 8 }}>◆</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                            </div>
                        ))}
                    </div>
                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                        <div><div style={sHead}>Education</div>
                            {res.education.map((edu, i) => (
                                <div key={i} style={{ background: c.am50, borderRadius: 12, padding: 14, border: `1px solid ${c.am100}`, marginBottom: 12 }}><p style={{ color: c.st800, fontWeight: 600, fontSize: 13 }}>{edu.degree}</p><p style={{ color: c.am600, fontSize: 11.5, marginTop: 2 }}>{edu.school}<br />{edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p></div>
                            ))}
                        </div>
                        <div><div style={sHead}>Skills</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {res.skills.map((s, i) => (
                                    <span key={i} style={{ background: c.am100, color: c.am800, fontSize: 11.5, padding: '4px 10px', borderRadius: 4, fontWeight: 500 }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 29 — Indigo Sharp ═══ */
export const IndigoSharpPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'indigo_sharp')
    const c = { i700: '#4338ca', i600: '#4f46e5', i500: '#6366f1', i400: '#818cf8', i300: '#a5b4fc', i200: '#c7d2fe', i100: '#e0e7ff', i50: '#eef2ff', p400: '#c084fc', sl800: '#1e293b', sl700: '#334155', sl500: '#64748b', w: '#fff' }
    const datePill = { fontSize: 11, color: c.i600, background: c.i50, border: `1px solid ${c.i200}`, borderRadius: 4, padding: '2px 8px', fontWeight: 700, whiteSpace: 'nowrap' as const }
    const diamond = (size: number) => ({ width: size, height: size, background: c.i600, transform: 'rotate(45deg)', flexShrink: 0 })
    const sHead = (gap: number) => ({ display: 'flex', alignItems: 'center', gap, marginBottom: 16 })
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    return (
        <div style={{ fontFamily: "'Manrope', 'DM Sans', sans-serif", background: c.w, overflow: 'hidden' }}>
            <div style={{ display: 'flex' }}>
                <div style={{ width: 8, background: c.i600, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    {/* Header */}
                    <header style={{ background: c.i700, padding: '40px 48px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: 320, height: 320, borderRadius: '50%', background: 'rgba(79,70,229,0.4)', transform: 'translate(25%,-50%)' }} />
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32 }}>
                            <div>
                                <h1 style={{ color: c.w, fontSize: 48, fontWeight: 800, lineHeight: 1, letterSpacing: -1 }}>{firstName}<br /><span style={{ color: c.i200, fontWeight: 300 }}>{lastName}</span></h1>
                                <p style={{ color: c.i300, fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', marginTop: 12, fontWeight: 600 }}>{res.role}</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px', fontSize: 12.5, color: c.i200 }}>
                                <span style={{ fontWeight: 500, color: c.w, gridColumn: 'span 2' }}>{res.location}</span>
                                <span>{res.email}</span><span>{res.phone}</span>
                            </div>
                        </div>
                    </header>
                    {/* Accent line */}
                    <div style={{ height: 2, background: `linear-gradient(to right, ${c.i600}, ${c.p400}, transparent)` }} />
                    <div style={{ padding: '40px 48px' }}>
                        {/* About */}
                        <div style={{ marginBottom: 36 }}>
                            <div style={sHead(12)}><div style={diamond(16)} /><h2 style={{ color: c.i700, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>About</h2></div>
                            <p style={{ color: c.sl500, fontSize: 14, lineHeight: 1.6, marginLeft: 28 }}>{res.summary}</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
                            {/* Experience */}
                            <div>
                                <div style={sHead(12)}><div style={diamond(16)} /><h2 style={{ color: c.i700, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>Experience</h2></div>
                                <div style={{ marginLeft: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    {res.experience.map((e, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}><h3 style={{ color: c.sl800, fontWeight: 800, fontSize: 15 }}>{e.title}</h3><span style={datePill}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div>
                                            <p style={{ color: c.i600, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                                            {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ display: 'flex', gap: 8, fontSize: 13, color: c.sl500, lineHeight: 1.6, marginBottom: 6 }}><span style={{ color: c.i400, fontWeight: 900, flexShrink: 0 }}>›</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Sidebar */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                                <div>
                                    <div style={sHead(12)}><div style={diamond(12)} /><h2 style={{ color: c.i700, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>Education</h2></div>
                                    {res.education.map((edu, i) => (
                                        <div key={i} style={{ borderLeft: `2px solid ${c.i300}`, paddingLeft: 12, marginBottom: 12 }}>
                                            <p style={{ color: c.sl700, fontWeight: 700, fontSize: 13 }}>{edu.degree}</p>
                                            <p style={{ color: c.i600, fontSize: 11.5, marginTop: 2, fontWeight: 600 }}>{edu.school} · {edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div style={sHead(12)}><div style={diamond(12)} /><h2 style={{ color: c.i700, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>Skills</h2></div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {res.skills.map((s, i) => (
                                            <span key={i} style={{ fontSize: 11.5, color: c.i700, background: c.i100, borderRadius: 4, padding: '4px 10px', fontWeight: 600 }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 30 — Platinum Elite ═══ */
export const PlatinumElitePreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'platinum_elite')
    const c = { sl900: '#0f172a', sl800: '#1e293b', sl700: '#334155', sl600: '#475569', sl500: '#64748b', sl400: '#94a3b8', sl300: '#cbd5e1', sl200: '#e2e8f0', sl100: '#f1f5f9', sl50: '#f8fafc', w: '#fff' }
    const sHead = { fontSize: 10, letterSpacing: 4, textTransform: 'uppercase' as const, fontWeight: 600, color: c.sl400, marginBottom: 16 }
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    const initials = (firstName[0] || '') + (lastName[0] || '')
    return (
        <div style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif", background: c.w, overflow: 'hidden' }}>
            {/* Silver strip */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #94a3b8, #cbd5e1, #e2e8f0, #cbd5e1, #94a3b8)' }} />
            {/* Header two-panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr' }}>
                {/* Dark left */}
                <div style={{ background: c.sl900, padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ width: 64, height: 64, border: `1px solid ${c.sl500}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, position: 'relative' }}>
                            <span style={{ fontSize: 24, fontWeight: 700, color: c.sl300, fontFamily: "'EB Garamond', 'Georgia', serif" }}>{initials}</span>
                        </div>
                        <h1 style={{ color: c.w, fontSize: 36, lineHeight: 1.1, marginBottom: 4, fontFamily: "'EB Garamond', 'Georgia', serif" }}>{firstName}</h1>
                        <h1 style={{ color: c.sl400, fontSize: 36, fontWeight: 300, fontStyle: 'italic', lineHeight: 1.1, marginBottom: 16, fontFamily: "'EB Garamond', 'Georgia', serif" }}>{lastName}</h1>
                        <p style={{ color: c.sl500, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 500 }}>{res.role}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 40 }}>
                        <div><p style={{ color: c.sl500, fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Location</p><p style={{ color: c.sl300, fontSize: 12.5, fontWeight: 300, lineHeight: 2 }}>{res.location}</p></div>
                        <div><p style={{ color: c.sl500, fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Contact</p><p style={{ color: c.sl400, fontSize: 12.5, fontWeight: 300, lineHeight: 2, whiteSpace: 'pre-line' }}>{res.phone}{'\n'}{res.email}</p></div>
                    </div>
                </div>
                {/* Right panel */}
                <div style={{ background: c.sl50, padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: c.sl400, fontSize: 10, letterSpacing: 3.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>Summary</p>
                        <p style={{ color: c.sl600, fontSize: 14.5, lineHeight: 1.6, fontFamily: "'EB Garamond', 'Georgia', serif" }}>{res.summary}</p>
                    </div>
                </div>
            </div>
            {/* Platinum divider */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #94a3b8, transparent)' }} />
            {/* Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr' }}>
                {/* Career */}
                <div style={{ padding: '40px 40px', borderRight: `1px solid ${c.sl100}` }}>
                    <div style={sHead}>Career</div>
                    {res.experience.map((e, i) => (
                        <div key={i} style={{ marginBottom: 28, ...(i > 0 ? { paddingTop: 20, borderTop: `1px solid ${c.sl100}` } : {}) }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                                <h3 style={{ fontWeight: 600, fontSize: 16, color: c.sl800 }}>{e.title}</h3>
                                <span style={{ color: c.sl400, fontSize: 11, fontWeight: 500, letterSpacing: 1, whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
                            </div>
                            <p style={{ color: c.sl500, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                            {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ borderLeft: `1px solid ${c.sl200}`, paddingLeft: 12, fontSize: 13, color: c.sl500, fontWeight: 300, lineHeight: 1.6, marginBottom: 6 }}>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                        </div>
                    ))}
                </div>
                {/* Sidebar */}
                <div style={{ padding: '40px 40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <div>
                        <div style={sHead}>Education</div>
                        {res.education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: 16 }}><p style={{ color: c.sl700, fontWeight: 600, fontSize: 13.5 }}>{edu.degree}</p><p style={{ color: c.sl500, fontSize: 12, fontWeight: 300, marginTop: 2 }}>{edu.school}<br />{edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p></div>
                        ))}
                    </div>
                    <div style={{ borderTop: `1px solid ${c.sl100}`, paddingTop: 32 }}>
                        <div style={sHead}>Skills</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {res.skills.map((s, i) => (
                                <span key={i} style={{ fontSize: 12, color: c.sl600, background: c.sl100, padding: '4px 10px', borderRadius: 4, fontWeight: 500 }}>{s}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #94a3b8, transparent)' }} />
        </div>
    )
}

/* ═══ Resume 11 — Cascade Blue ═══ */
export const CascadeBluePreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'cascade_blue')
    const c = { navy: '#0f2a4a', blue: '#1a6fb5', skyBlue: '#7fc4f7', ltBlue: '#e8f2fb', txtDark: '#1e2d3d', txtMid: '#4a6070', txtSide: '#c0d4e4', txtDate: '#6b8299', w: '#fff' }
    const sideHead = { fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: c.skyBlue, fontWeight: 600, marginBottom: 14 }
    const mainHead = { fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: c.blue, fontWeight: 700, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${c.ltBlue}` }
    const datePill = { fontSize: 11.5, color: c.txtDate, background: c.ltBlue, padding: '2px 8px', borderRadius: 2, fontWeight: 500, whiteSpace: 'nowrap' as const }
    const bullet = { display: 'flex', gap: 10, fontSize: 13, color: c.txtMid, lineHeight: 1.7, fontWeight: 300, marginBottom: 4 }
    const dot = { width: 5, height: 5, borderRadius: '50%', background: c.blue, opacity: 0.6, marginTop: 8, flexShrink: 0 }
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    return (
        <div style={{ fontFamily: "'Inter', 'DM Sans', sans-serif", display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 1100, overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{ background: c.navy, color: c.txtSide, padding: '44px 28px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                    <div style={{ fontSize: 28, color: c.w, lineHeight: 1.2, letterSpacing: -0.5, fontFamily: "'DM Serif Display', 'EB Garamond', serif" }}>{firstName}<br /><em style={{ color: c.skyBlue }}>{lastName}</em></div>
                    <div style={{ fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase', color: c.skyBlue, fontWeight: 500, marginTop: 8 }}>{res.role}</div>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <div>
                    <div style={sideHead}>Contact</div>
                    {[res.email, res.phone, res.location].map((item, i) => (
                        <div key={i} style={{ fontSize: 12.5, color: c.txtSide, marginBottom: 8, lineHeight: 1.4 }}>{item}</div>
                    ))}
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <div>
                    <div style={sideHead}>Skills</div>
                    {res.skills.slice(0, 6).map((name, i) => (
                        <div key={i} style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 12.5, color: c.txtSide, marginBottom: 4, fontWeight: 500 }}>{name}</div>
                            <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${92 - i * 4}%`, borderRadius: 2, background: `linear-gradient(90deg, ${c.skyBlue}, ${c.blue})` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <div>
                    <div style={sideHead}>Education</div>
                    {res.education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: 12 }}>
                            <h4 style={{ fontSize: 13, color: c.w, fontWeight: 600, lineHeight: 1.4 }}>{edu.degree}</h4>
                            <p style={{ fontSize: 12, color: c.skyBlue, marginTop: 2 }}>{edu.school}<br />{edu.endDate}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Main */}
            <div style={{ padding: '44px 40px', background: c.w }}>
                {/* Cascade bars */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 36 }}>
                    <div style={{ height: 4, width: 60, borderRadius: 2, background: c.blue }} />
                    <div style={{ height: 4, width: 40, borderRadius: 2, background: '#5ca8e0' }} />
                    <div style={{ height: 4, width: 24, borderRadius: 2, background: '#a8d4f0' }} />
                </div>
                {/* Summary */}
                <div style={{ marginBottom: 32 }}>
                    <div style={mainHead}>Professional Summary</div>
                    <p style={{ fontSize: 14, color: '#3d5166', lineHeight: 1.8 }}>{res.summary}</p>
                </div>
                {/* Experience */}
                <div style={{ marginBottom: 32 }}>
                    <div style={mainHead}>Work Experience</div>
                    {res.experience.map((e, i) => (
                        <div key={i} style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                                <div style={{ fontSize: 15, fontWeight: 600, color: c.txtDark, fontFamily: "'DM Serif Display', 'EB Garamond', serif" }}>{e.title}</div>
                                <div style={datePill}>{e.startDate} — {e.current ? 'Present' : e.endDate}</div>
                            </div>
                            <div style={{ fontSize: 13, color: c.blue, fontWeight: 600, marginBottom: 8 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                            {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={bullet}><div style={dot} />{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 12 — Nordic Minimal ═══ */
export const NordicMinimalPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'nordic_minimal')
    const c = { grn: '#2d6a4f', dark: '#1c1c1c', mid: '#555', lt: '#888', border: '#e0e0e0', bg: '#fafafa', w: '#fff' }
    const sHead = { fontSize: 10, fontWeight: 600, letterSpacing: 3.5, textTransform: 'uppercase' as const, color: c.grn, marginBottom: 20 }
    return (
        <div style={{ fontFamily: "'Jost', 'DM Sans', sans-serif", background: c.bg, padding: '72px 80px', overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ marginBottom: 56 }}>
                <div style={{ fontSize: 42, color: c.dark, lineHeight: 1.1, letterSpacing: -0.5, fontFamily: "'Libre Baskerville', 'EB Garamond', serif" }}>
                    {res.name}
                </div>
                <div style={{ fontSize: 13, fontWeight: 300, letterSpacing: 4, textTransform: 'uppercase', color: c.lt, marginTop: 12 }}>{res.role}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24, paddingTop: 24, borderTop: `1px solid ${c.border}` }}>
                    <div style={{ display: 'flex', gap: 28, fontSize: 12.5, color: c.lt }}>
                        <span>{res.email}</span><span>{res.phone}</span><span>{res.location}</span>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.grn, opacity: 0.5 }} />
                </div>
            </header>
            {/* Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 60 }}>
                {/* Main */}
                <main>
                    <div style={{ marginBottom: 40 }}>
                        <div style={sHead}>Profile</div>
                        <p style={{ fontSize: 14.5, color: c.mid, lineHeight: 1.85, fontWeight: 300 }}>{res.summary}</p>
                    </div>
                    <div>
                        <div style={sHead}>Experience</div>
                        {res.experience.map((e, i, arr) => (
                            <div key={i} style={{ paddingBottom: i < arr.length - 1 ? 28 : 0, marginBottom: i < arr.length - 1 ? 28 : 0, borderBottom: i < arr.length - 1 ? `1px solid ${c.border}` : 'none' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                                    <div style={{ fontSize: 16, color: c.dark, fontFamily: "'Libre Baskerville', 'EB Garamond', serif" }}>{e.title}</div>
                                    <div style={{ fontSize: 12, color: c.lt, fontWeight: 300, letterSpacing: 1 }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</div>
                                </div>
                                <div style={{ fontSize: 13, color: c.grn, fontWeight: 500, marginBottom: 10 }}>{e.company}{e.location ? ` — ${e.location}` : ''}</div>
                                {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <p key={j} style={{ fontSize: 13.5, color: c.mid, lineHeight: 1.75, fontWeight: 300, marginBottom: 4 }}>{b.replace(/^[•\-–—]\s*/, '')}</p>)}
                            </div>
                        ))}
                    </div>
                </main>
                {/* Sidebar */}
                <aside>
                    <div style={{ marginBottom: 36 }}>
                        <div style={sHead}>Education</div>
                        {res.education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: 16 }}>
                                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: c.dark, marginBottom: 2 }}>{edu.degree}</span>
                                <span style={{ fontSize: 13, color: c.mid, fontWeight: 300, lineHeight: 1.6 }}>{edu.school}<br />{edu.endDate}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginBottom: 36 }}>
                        <div style={sHead}>Skills</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {res.skills.map((m, i) => (
                                <span key={i} style={{ fontSize: 11.5, color: c.mid, border: `1px solid ${c.border}`, padding: '2px 8px', borderRadius: 2 }}>{m}</span>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

/* ═══ Resume 13 — Midnight Pro ═══ */
export const MidnightProPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'midnight_pro')
    const c = { bg: '#0c0f1a', bg2: '#141828', gold: '#c9a84c', goldLt: '#e8c96e', cream: '#e8e4d8', slate: '#8891ab', dk: '#4a5268', border: '#252d45' }
    const datePill = { fontSize: 11, color: c.dk, background: c.bg2, border: `1px solid ${c.border}`, padding: '2px 8px', borderRadius: 2, whiteSpace: 'nowrap' as const, letterSpacing: 1 }
    const sHead = { fontSize: 10, fontWeight: 600, letterSpacing: 3.5, textTransform: 'uppercase' as const, color: c.gold, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }
    return (
        <div style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif", background: c.bg, overflow: 'hidden' }}>
            {/* Gold bar */}
            <div style={{ height: 3, background: `linear-gradient(90deg, ${c.gold}, ${c.goldLt}, ${c.gold})` }} />
            {/* Header */}
            <header style={{ padding: '48px 56px', borderBottom: `1px solid ${c.border}`, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', gap: 32 }}>
                <div>
                    <div style={{ fontSize: 52, fontWeight: 600, color: c.cream, lineHeight: 1, letterSpacing: -1, fontFamily: "'Cormorant Garamond', 'EB Garamond', serif" }}>
                        {res.name}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: 4, textTransform: 'uppercase', color: c.slate, marginTop: 12 }}>{res.role}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12.5, color: c.slate, lineHeight: 2 }}>
                    {res.location}<br />{res.phone}<br /><span style={{ color: c.gold }}>{res.email}</span>
                </div>
            </header>
            {/* Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px' }}>
                {/* Main */}
                <div style={{ padding: '44px 56px', borderRight: `1px solid ${c.border}` }}>
                    <div style={{ marginBottom: 40 }}>
                        <div style={sHead}>Profile<span style={{ flex: 1, height: 1, background: c.border }} /></div>
                        <p style={{ fontSize: 14, color: '#b0b8cc', lineHeight: 1.85, fontWeight: 300 }}>{res.summary}</p>
                    </div>
                    <div>
                        <div style={sHead}>Experience<span style={{ flex: 1, height: 1, background: c.border }} /></div>
                        {res.experience.map((e, i) => (
                            <div key={i} style={{ marginBottom: 28 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <div style={{ fontSize: 18, fontWeight: 600, color: c.cream, fontFamily: "'Cormorant Garamond', 'EB Garamond', serif" }}>{e.title}</div>
                                    <div style={datePill}>{e.startDate} — {e.current ? 'Present' : e.endDate}</div>
                                </div>
                                <div style={{ fontSize: 12.5, color: c.gold, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                                {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ display: 'flex', gap: 10, fontSize: 13, color: c.slate, lineHeight: 1.6, marginBottom: 5 }}><span style={{ color: c.gold, fontSize: 7, marginTop: 6, flexShrink: 0 }}>◆</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Sidebar */}
                <div style={{ background: c.bg2, padding: '44px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3.5, textTransform: 'uppercase', color: c.gold, marginBottom: 20 }}>Education</div>
                        {res.education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: 12 }}>
                                <h4 style={{ fontSize: 15, fontWeight: 600, color: c.cream, fontFamily: "'Cormorant Garamond', 'EB Garamond', serif" }}>{edu.degree}</h4>
                                <p style={{ fontSize: 12, color: c.slate, marginTop: 2, lineHeight: 1.4 }}>{edu.school}<br />{edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3.5, textTransform: 'uppercase', color: c.gold, marginBottom: 20 }}>Skills</div>
                        {res.skills.map((s, i) => (
                            <div key={i} style={{ fontSize: 12.5, color: c.slate, marginBottom: 3, paddingLeft: 12, position: 'relative' }}><span style={{ position: 'absolute', left: 0, top: 9, width: 4, height: 1, background: c.gold }} />{s}</div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', color: c.gold, fontSize: 16, letterSpacing: 8, opacity: 0.4, marginTop: 8 }}>◆ · ◆ · ◆</div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 14 — Blueprint ═══ */
export const BlueprintPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'blueprint')
    const c = { bg: '#0a1628', bg2: '#0e1e36', blue: '#4a9eff', cyan: '#7ec8f0', slate: '#6a90b8', ltSlate: '#c8daf0', white: '#e8f2ff', gridLine: 'rgba(66,140,220,0.25)' }
    const mono = "'Share Tech Mono', 'Courier New', monospace"
    const sHead = { fontFamily: mono, fontSize: 11, color: c.blue, letterSpacing: 2, marginBottom: 20, display: 'flex' as const, alignItems: 'center' as const, gap: 10 }
    return (
        <div style={{ fontFamily: "'Space Grotesk', 'DM Sans', sans-serif", background: c.bg, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${c.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${c.gridLine} 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.5, pointerEvents: 'none' as const }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
                <header style={{ padding: '48px 56px', background: c.bg2, borderBottom: `1px solid ${c.gridLine}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ fontSize: 42, fontWeight: 700, color: c.white, letterSpacing: -1, lineHeight: 1.1 }}>{res.name}</div>
                            <div style={{ fontFamily: mono, fontSize: 13, color: c.cyan, marginTop: 10, letterSpacing: 2 }}>// {res.role.toUpperCase().replace(/ /g, '_')}</div>
                        </div>
                        <div style={{ fontFamily: mono, fontSize: 11, color: c.slate, lineHeight: 2, background: 'rgba(10,22,40,0.8)', border: `1px solid ${c.gridLine}`, padding: 16, minWidth: 220 }}>
                            LOCATION: <span style={{ color: c.cyan }}>{res.location}</span><br />
                            EMAIL: <span style={{ color: c.cyan }}>{res.email}</span><br />
                            PHONE: <span style={{ color: c.cyan }}>{res.phone}</span>
                        </div>
                    </div>
                </header>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px' }}>
                    <div style={{ padding: '40px 56px', borderRight: `1px solid ${c.gridLine}` }}>
                        <div style={{ marginBottom: 40 }}>
                            <div style={sHead}><span style={{ fontFamily: mono, color: c.slate }}>{'// '}</span>PROFILE<span style={{ flex: 1, height: 1, background: c.gridLine }} /></div>
                            <p style={{ fontSize: 13.5, color: c.slate, lineHeight: 1.85, borderLeft: `2px solid ${c.blue}`, paddingLeft: 16 }}>{res.summary}</p>
                        </div>
                        <div>
                            <div style={sHead}><span style={{ fontFamily: mono, color: c.slate }}>{'// '}</span>EXPERIENCE<span style={{ flex: 1, height: 1, background: c.gridLine }} /></div>
                            {res.experience.map((e, i) => (
                                <div key={i} style={{ marginBottom: 28 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                                        <div style={{ fontSize: 15, fontWeight: 600, color: c.white }}>{e.title}</div>
                                        <div style={{ fontFamily: mono, fontSize: 10.5, color: c.slate, letterSpacing: 1 }}>{e.startDate} — {e.current ? 'PRESENT' : e.endDate}</div>
                                    </div>
                                    <div style={{ fontFamily: mono, fontSize: 11, color: c.cyan, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>// {e.company}{e.location ? ` · ${e.location}` : ''}</div>
                                    {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ fontSize: 13, color: c.slate, lineHeight: 1.6, marginBottom: 4, paddingLeft: 20, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: c.blue, fontSize: 11 }}>→</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ background: c.bg2, padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                        <div>
                            <div style={{ fontFamily: mono, fontSize: 10, color: c.blue, letterSpacing: 2, marginBottom: 16 }}>SKILLS</div>
                            {res.skills.slice(0, 6).map((name, i) => (
                                <div key={i} style={{ marginBottom: 14 }}>
                                    <div style={{ fontFamily: mono, fontSize: 11.5, color: c.ltSlate, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>{name}<span style={{ color: c.blue, fontSize: 10 }}>{95 - i * 5}%</span></div>
                                    <div style={{ height: 2, background: 'rgba(74,158,255,0.15)' }}><div style={{ height: '100%', background: c.blue, width: `${95 - i * 5}%` }} /></div>
                                </div>
                            ))}
                        </div>
                        <div style={{ paddingTop: 32, borderTop: `1px solid ${c.gridLine}` }}>
                            <div style={{ fontFamily: mono, fontSize: 10, color: c.blue, letterSpacing: 2, marginBottom: 16 }}>EDUCATION</div>
                            {res.education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: 12 }}>
                                    <h4 style={{ fontSize: 13, color: c.white, fontWeight: 600 }}>{edu.degree}</h4>
                                    <p style={{ fontFamily: mono, fontSize: 11, color: c.slate, marginTop: 4, lineHeight: 1.6 }}>{edu.school}<br />{edu.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 15 — Emerald Fresh ═══ */
export const EmeraldFreshPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'emerald_fresh')
    const c = { grn: '#1a7a4a', grn2: '#2d9e65', ltGrn: '#d4f0e2', bgGrn: '#f0faf5', brdr: '#c8e8d6', dark: '#1a2b23', txt: '#3a5a47', txtPro: '#4a6e5a', txtDt: '#7aa88c', w: '#fff' }
    const sHead = { fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: c.grn, marginBottom: 16, display: 'flex' as const, alignItems: 'center' as const, gap: 10 }
    const datePill = { fontSize: 11.5, color: c.txtDt, background: c.ltGrn, padding: '2px 8px', borderRadius: 2, fontWeight: 500, whiteSpace: 'nowrap' as const }
    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif", background: c.w, overflow: 'hidden' }}>
            <div style={{ background: c.grn, padding: '44px 56px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: -40, right: 100, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 40 }}>
                    <div>
                        <div style={{ fontSize: 44, fontWeight: 700, color: c.w, letterSpacing: -1, lineHeight: 1.1 }}>{res.name}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 10 }}>{res.role}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        {[res.email, res.phone, res.location].map((item, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)', fontSize: 12, padding: '4px 12px', borderRadius: 99, whiteSpace: 'nowrap' }}>{item}</div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 230px' }}>
                <div style={{ padding: '40px 48px', borderRight: `1px solid ${c.brdr}` }}>
                    <div style={{ marginBottom: 36 }}>
                        <div style={sHead}>Profile<span style={{ flex: 1, height: 2, background: c.ltGrn, borderRadius: 1 }} /></div>
                        <p style={{ fontSize: 14, color: c.txtPro, lineHeight: 1.85 }}>{res.summary}</p>
                    </div>
                    <div>
                        <div style={sHead}>Experience<span style={{ flex: 1, height: 2, background: c.ltGrn, borderRadius: 1 }} /></div>
                        {res.experience.map((e, i) => (
                            <div key={i} style={{ marginBottom: 28 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <div style={{ fontSize: 15, fontWeight: 600, color: c.dark }}>{e.title}</div>
                                    <div style={datePill}>{e.startDate} — {e.current ? 'Present' : e.endDate}</div>
                                </div>
                                <div style={{ fontSize: 13, color: c.grn2, fontWeight: 600, marginBottom: 10 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                                {e.description && e.description.split('\n').filter(Boolean).map((b, j) => (
                                    <div key={j} style={{ display: 'flex', gap: 10, fontSize: 13, color: c.txt, lineHeight: 1.6, marginBottom: 4 }}>
                                        <span style={{ width: 5, height: 5, background: c.grn2, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', marginTop: 7, flexShrink: 0 }} />{b.replace(/^[•\-–—]\s*/, '')}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ background: c.bgGrn, padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: c.grn, marginBottom: 12 }}>Skills</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {res.skills.map((s, i) => (
                                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: c.grn, background: c.ltGrn, padding: '4px 10px', borderRadius: 4, fontWeight: 500 }}>
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.grn2, flexShrink: 0 }} />{s}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div style={{ borderTop: `1px solid ${c.brdr}`, paddingTop: 32 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: c.grn, marginBottom: 16 }}>Education</div>
                        {res.education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: 16 }}>
                                <h4 style={{ fontSize: 13.5, fontWeight: 600, color: c.dark, lineHeight: 1.4 }}>{edu.degree}</h4>
                                <p style={{ fontSize: 12, color: c.txtDt, marginTop: 2, lineHeight: 1.4 }}>{edu.school}<br />{edu.endDate}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
/* ═══ Resume 16 — Sunset Warm ═══ */
export const SunsetWarmPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'sunset_warm')
    const c = { amber: res.customColor || '#c97c2a', amberLt: '#f5d4a0', amberPale: '#fdf6ec', rust: '#9c4a1a', warm: '#f7efe3', text: '#2a1f14', muted: '#6b5040', light: '#a08060', rule: '#e8d4bb' }
    const sTitle = { fontFamily: "'Fraunces', 'EB Garamond', serif", fontSize: 19, fontWeight: 600, color: c.amber, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }
    const datePill = { fontSize: 11.5, fontWeight: 600, color: c.amber, background: c.amberLt, padding: '2px 9px', borderRadius: 3, whiteSpace: 'nowrap' as const }
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    return (
        <div style={{ fontFamily: "'Nunito', 'DM Sans', sans-serif", background: c.warm, overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ background: 'linear-gradient(135deg, #c97c2a 0%, #e8a44a 50%, #d4763a 100%)', padding: '50px 60px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: -30, right: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', top: -50, left: 200, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', gap: 40 }}>
                    <div>
                        <div style={{ fontFamily: "'Fraunces', 'EB Garamond', serif", fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: -0.5 }}>{firstName} <em style={{ fontWeight: 300, opacity: 0.85 }}>{lastName}</em></div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 10 }}>{res.role}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 12.5, color: 'rgba(255,255,255,0.8)', lineHeight: 2.1 }}>
                        {res.location}<br />{res.phone}<br /><span style={{ color: 'rgba(255,255,255,0.95)' }}>{res.email}</span>{res.website && <><br /><span style={{ color: 'rgba(255,255,255,0.95)' }}>{res.website}</span></>}
                    </div>
                </div>
            </header>
            {/* Body */}
            <div style={{ padding: '40px 60px 56px', display: 'grid', gridTemplateColumns: '1fr 230px', gap: 52 }}>
                {/* Main */}
                <main>
                    {res.show('summary') && res.summary && (
                        <div style={{ marginBottom: 36 }}>
                            <div style={sTitle}>About<span style={{ flex: 1, height: 1, background: c.rule }} /></div>
                            <p style={{ fontSize: 14, color: c.muted, lineHeight: 1.85 }}>{res.summary}</p>
                        </div>
                    )}
                    {res.show('experience') && res.experience.length > 0 && (
                        <div>
                            <div style={sTitle}>Experience<span style={{ flex: 1, height: 1, background: c.rule }} /></div>
                            {res.experience.map((e, i) => (
                                <div key={i} style={{ marginBottom: 26 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: c.text }}>{e.title}</div>
                                        <div style={datePill}>{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</div>
                                    </div>
                                    <div style={{ fontSize: 13, color: c.rust, fontWeight: 600, marginBottom: 10 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                                    {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ fontSize: 13, color: c.muted, lineHeight: 1.7, paddingLeft: 18, position: 'relative', marginBottom: 4 }}><span style={{ position: 'absolute', left: 0, color: c.amber, fontSize: 10, top: 3 }}>◈</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                                </div>
                            ))}
                        </div>
                    )}
                </main>
                {/* Sidebar */}
                <aside>
                    {res.show('skills') && res.skills.length > 0 && (
                        <div style={{ marginBottom: 36 }}>
                            <div style={{ fontFamily: "'Fraunces', 'EB Garamond', serif", fontSize: 15, fontWeight: 600, color: c.amber, marginBottom: 18 }}>Skills</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {res.skills.map((s, i) => (
                                    <span key={i} style={{ fontSize: 12, color: c.amber, border: `1px solid ${c.amberLt}`, background: c.amberPale, padding: '4px 10px', borderRadius: 4, fontWeight: 500 }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {res.show('education') && res.education.length > 0 && (
                        <div style={{ marginBottom: 36 }}>
                            <div style={{ fontFamily: "'Fraunces', 'EB Garamond', serif", fontSize: 15, fontWeight: 600, color: c.amber, marginBottom: 18 }}>Education</div>
                            {res.education.map((e, i) => (
                                <div key={i} style={{ marginBottom: 14 }}>
                                    <h4 style={{ fontSize: 13.5, fontWeight: 700, color: c.text, lineHeight: 1.3 }}>{e.degree}</h4>
                                    <p style={{ fontSize: 12, color: c.light, marginTop: 3, lineHeight: 1.5 }}>{e.school}<br />{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </aside>
            </div>
        </div>
    )
}

/* ═══ Resume 17 — Newspaper Classic ═══ */
export const NewspaperClassicPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'newspaper_classic')
    const c = { ink: '#1a1410', mid: '#4a3f34', muted: '#7a6e64', rule: '#c8bfb4', cream: '#f7f3ee', paper: '#faf7f3', red: res.customColor || '#8b1a1a' }
    const colTitle = { fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, color: c.red, borderBottom: `1px solid ${c.red}`, paddingBottom: 5, marginBottom: 14 }
    const entryTitle = { fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 14, fontWeight: 700, color: c.ink, lineHeight: 1.3, marginBottom: 2 }
    const entryMeta = { fontSize: 11, color: c.red, fontWeight: 600, marginBottom: 2, letterSpacing: 0.3 }
    const entryDate = { fontSize: 11, color: c.muted, fontStyle: 'italic' as const, marginBottom: 6, fontFamily: "'IM Fell English', 'Georgia', serif" }
    const entryP = { fontSize: 12.5, color: c.mid, lineHeight: 1.75, fontWeight: 300 }
    const skillItem = { fontSize: 12.5, color: c.mid, lineHeight: 1.8, paddingBottom: 5, borderBottom: `1px dotted ${c.rule}`, marginBottom: 5, fontWeight: 300 }
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    return (
        <div style={{ fontFamily: "'Source Sans 3', 'DM Sans', sans-serif", background: c.paper, padding: '52px 60px', overflow: 'hidden' }}>
            {/* Masthead */}
            <div style={{ textAlign: 'center', borderTop: `3px double ${c.ink}`, borderBottom: `3px double ${c.ink}`, padding: '16px 0', marginBottom: 8 }}>
                <div style={{ fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: c.muted, marginBottom: 6 }}>Curriculum Vitae</div>
                <div style={{ fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 56, fontWeight: 900, color: c.ink, letterSpacing: -1, lineHeight: 1 }}>{firstName} <em style={{ fontWeight: 400 }}>{lastName}</em></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 6, borderTop: `1px solid ${c.rule}`, fontSize: 11, color: c.muted }}>
                    <span>{res.location} · {res.phone} · {res.email}</span>
                    <span style={{ fontFamily: "'IM Fell English', 'Georgia', serif", fontStyle: 'italic', fontSize: 13 }}>{res.role}</span>
                    <span>{res.website || ''}</span>
                </div>
            </div>
            {/* Lede */}
            {res.show('summary') && res.summary && (
                <p style={{ fontFamily: "'IM Fell English', 'Georgia', serif", fontSize: 16, lineHeight: 1.75, color: c.mid, textAlign: 'center', margin: '22px 0 28px', padding: '0 40px', fontStyle: 'italic' }}>{res.summary}</p>
            )}
            {/* 3-Column */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1fr 2px 1fr', gap: '0 28px', borderTop: `1px solid ${c.rule}`, paddingTop: 28 }}>
                {/* Col 1: Experience */}
                <div>
                    {res.show('experience') && res.experience.length > 0 && (
                        <>
                            <div style={colTitle}>Experience</div>
                            {res.experience.map((e, i) => (
                                <div key={i} style={{ marginBottom: 18 }}>
                                    <div style={entryTitle}>{e.title}</div>
                                    <div style={entryMeta}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                                    <div style={entryDate}>{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</div>
                                    {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <p key={j} style={{ ...entryP, marginBottom: 4 }}>{b.replace(/^[•\-–—]\s*/, '')}</p>)}
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div style={{ background: c.rule }} />
                {/* Col 2: Education */}
                <div>
                    {res.show('education') && res.education.length > 0 && (
                        <>
                            <div style={colTitle}>Education</div>
                            {res.education.map((e, i) => (
                                <div key={i} style={{ marginBottom: 18 }}>
                                    <div style={entryTitle}>{e.degree}</div>
                                    <div style={entryMeta}>{e.school}{e.location ? ` · ${e.location}` : ''}</div>
                                    <div style={entryDate}>{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</div>
                                    {(e.gpa || e.notes) && <p style={entryP}>{e.gpa ? `GPA: ${e.gpa}` : ''}{e.gpa && e.notes ? '. ' : ''}{e.notes}</p>}
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div style={{ background: c.rule }} />
                {/* Col 3: Skills */}
                <div>
                    {res.show('skills') && res.skills.length > 0 && (
                        <>
                            <div style={colTitle}>Expertise</div>
                            {res.skills.map((s, i) => (
                                <div key={i} style={skillItem}>{s}</div>
                            ))}
                        </>
                    )}
                </div>
            </div>
            {/* Footer */}
            <footer style={{ marginTop: 28, paddingTop: 16, borderTop: `3px double ${c.ink}`, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: c.muted, fontFamily: "'IM Fell English', 'Georgia', serif", fontStyle: 'italic' }}>
                <span>References furnished upon request</span><span>·</span><span>Confidential — not for distribution</span>
            </footer>
        </div>
    )
}

/* ═══ Resume 18 — Ivory Marble ═══ */
export const IvoryMarblePreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'ivory_marble')
    const c = { ivory: '#f9f6f0', marble: '#e8e0d4', veins: '#c8bfb0', navy: '#1a2640', gold: res.customColor || '#b8963c', goldLt: '#d4af6a', text: '#2a1e14', muted: '#6a5a48', light: '#9a8a78' }
    const sTitle = { fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: 3, color: c.gold, fontWeight: 600, marginBottom: 14 }
    const goldDiv = { height: 1, background: `linear-gradient(90deg, ${c.gold}, transparent)`, margin: '22px 0', opacity: 0.4 }
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    const initials = (firstName[0] || '') + (lastName[0] || '')
    return (
        <div style={{ fontFamily: "'Raleway', 'DM Sans', sans-serif", background: c.ivory, overflow: 'hidden' }}>
            {/* Gold line */}
            <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${c.gold}, ${c.goldLt}, ${c.gold}, transparent)` }} />
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr' }}>
                {/* Sidebar */}
                <div style={{ background: c.navy, padding: '52px 32px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(255,255,255,0.02) 60px, rgba(255,255,255,0.02) 61px)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ width: 70, height: 70, border: '1px solid rgba(184,150,60,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative' }}>
                            <span style={{ fontFamily: "'Cormorant', 'EB Garamond', serif", fontSize: 28, fontWeight: 700, color: c.gold, letterSpacing: 2 }}>{initials}</span>
                        </div>
                        <div style={{ fontFamily: "'Cormorant', 'EB Garamond', serif", fontSize: 26, fontWeight: 300, color: '#fff', lineHeight: 1.2, letterSpacing: 1, marginBottom: 4 }}><strong style={{ fontWeight: 600, display: 'block' }}>{firstName}</strong>{lastName}</div>
                        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 3, color: c.gold, fontWeight: 500, marginBottom: 28 }}>{res.role}</div>
                        <div style={goldDiv} />
                        <div style={sTitle}>Contact</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, fontWeight: 300 }}>{res.location}<br />{res.phone}<br />{res.email}{res.website && <><br />{res.website}</>}</div>
                        {res.show('skills') && res.skills.length > 0 && (
                            <>
                                <div style={goldDiv} />
                                <div style={sTitle}>Expertise</div>
                                {res.skills.map((s, i) => (
                                    <div key={i} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, paddingLeft: 12, position: 'relative', marginBottom: 2, fontWeight: 300 }}><span style={{ position: 'absolute', left: 0, top: 9, width: 5, height: 1, background: c.gold }} />{s}</div>
                                ))}
                            </>
                        )}
                        {res.show('education') && res.education.length > 0 && (
                            <>
                                <div style={goldDiv} />
                                <div style={sTitle}>Education</div>
                                {res.education.map((e, i) => (
                                    <div key={i} style={{ marginBottom: 16 }}>
                                        <h4 style={{ fontFamily: "'Cormorant', 'EB Garamond', serif", fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>{e.degree}</h4>
                                        <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 3, lineHeight: 1.5 }}>{e.school}<br />{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</p>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
                {/* Main */}
                <div style={{ padding: '52px 48px' }}>
                    <div style={{ fontFamily: "'Cormorant', 'EB Garamond', serif", fontSize: 50, fontWeight: 300, color: c.navy, lineHeight: 1.05, letterSpacing: -0.5, marginBottom: 28 }}>{firstName}<br /><em style={{ fontWeight: 600, color: c.gold }}>{lastName}</em></div>
                    {res.show('summary') && res.summary && (
                        <div style={{ marginBottom: 36 }}>
                            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: c.navy, marginBottom: 18, paddingBottom: 8, borderBottom: `1px solid ${c.marble}`, display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 16, height: 1, background: c.gold }} />Profile</div>
                            <p style={{ fontFamily: "'Cormorant', 'EB Garamond', serif", fontSize: 16, fontStyle: 'italic', fontWeight: 300, color: c.muted, lineHeight: 1.85 }}>{res.summary}</p>
                        </div>
                    )}
                    {res.show('experience') && res.experience.length > 0 && (
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: c.navy, marginBottom: 18, paddingBottom: 8, borderBottom: `1px solid ${c.marble}`, display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 16, height: 1, background: c.gold }} />Experience</div>
                            {res.experience.map((e, i) => (
                                <div key={i} style={{ marginBottom: 26 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                        <div style={{ fontFamily: "'Cormorant', 'EB Garamond', serif", fontSize: 18, fontWeight: 600, color: c.navy }}>{e.title}</div>
                                        <div style={{ fontSize: 11, color: c.light, letterSpacing: 1, fontWeight: 500, whiteSpace: 'nowrap' }}>{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</div>
                                    </div>
                                    <div style={{ fontSize: 12.5, color: c.gold, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                                    {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ fontSize: 13, color: c.muted, lineHeight: 1.75, paddingLeft: 18, position: 'relative', marginBottom: 4 }}><span style={{ position: 'absolute', left: 0, color: c.gold, fontSize: 9, top: 4 }}>◇</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 19 — Neon Cyber ═══ */
export const NeonCyberPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'neon_cyber')
    const c = { bg: '#04080f', surface: '#080e18', neon: res.customColor || '#00fff7', neon2: '#b44fff', text: '#c0e8f0', muted: '#5a8090', border: 'rgba(0,255,247,0.15)', dimNeon: 'rgba(0,255,247,0.15)' }
    const mono = "'Rajdhani', 'DM Sans', sans-serif"
    const sHead = { fontFamily: mono, fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, color: c.neon, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }
    const datePill = { fontFamily: mono, fontSize: 11, color: c.neon, background: c.dimNeon, border: `1px solid ${c.border}`, padding: '2px 8px', letterSpacing: 1, whiteSpace: 'nowrap' as const }
    const nameParts = res.name.toUpperCase().split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    return (
        <div style={{ fontFamily: "'Exo 2', 'DM Sans', sans-serif", background: c.bg, overflow: 'hidden', border: `1px solid ${c.border}` }}>
            {/* Header */}
            <header style={{ padding: '48px 56px 40px', borderBottom: `1px solid ${c.border}`, background: c.surface, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${c.neon}, ${c.neon2}, transparent)` }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', gap: 32 }}>
                    <div>
                        <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 3, color: c.muted, marginBottom: 12, textTransform: 'uppercase' }}>SYS_ID: <span style={{ color: c.neon }}>ACTIVE</span></div>
                        <div style={{ fontFamily: mono, fontSize: 52, fontWeight: 700, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: -1 }}>
                            <div style={{ color: c.neon }}>{firstName}</div>
                            <div style={{ color: '#fff' }}>{lastName}</div>
                        </div>
                        <div style={{ fontSize: 12, color: c.muted, letterSpacing: 3, textTransform: 'uppercase', marginTop: 12 }}>// <span style={{ color: c.neon2 }}>{res.role}</span></div>
                    </div>
                    <div style={{ border: `1px solid ${c.border}`, padding: '14px 18px', fontFamily: mono, fontSize: 12, color: c.muted, lineHeight: 2, letterSpacing: 0.5, background: 'rgba(0,255,247,0.02)' }}>
                        LOC: <span style={{ color: c.text }}>{res.location}</span><br />
                        MAIL: <span style={{ color: c.text }}>{res.email}</span><br />
                        NET: <span style={{ color: c.text }}>{res.phone}</span>
                        {res.website && <><br />WEB: <span style={{ color: c.text }}>{res.website}</span></>}
                    </div>
                </div>
            </header>
            {/* Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px' }}>
                {/* Main */}
                <div style={{ padding: '40px 48px', borderRight: `1px solid ${c.border}` }}>
                    {res.show('summary') && res.summary && (
                        <div style={{ marginBottom: 38 }}>
                            <div style={sHead}><span style={{ color: c.neon2 }}>{'>'}</span>Profile<span style={{ flex: 1, height: 1, background: c.border }} /></div>
                            <p style={{ fontSize: 13.5, color: '#7a9aa8', lineHeight: 1.85, fontWeight: 300, borderLeft: `2px solid ${c.neon}`, paddingLeft: 16 }}>{res.summary}</p>
                        </div>
                    )}
                    {res.show('experience') && res.experience.length > 0 && (
                        <div>
                            <div style={sHead}><span style={{ color: c.neon2 }}>{'>'}</span>Experience<span style={{ flex: 1, height: 1, background: c.border }} /></div>
                            {res.experience.map((e, i) => (
                                <div key={i} style={{ marginBottom: 28 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                        <div style={{ fontFamily: mono, fontSize: 17, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 }}>{e.title}</div>
                                        <div style={datePill}>{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</div>
                                    </div>
                                    <div style={{ fontSize: 12, color: c.neon2, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>// {e.company}{e.location ? ` · ${e.location}` : ''}</div>
                                    {e.description && e.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ fontSize: 13, color: '#7a9aa8', lineHeight: 1.7, paddingLeft: 20, position: 'relative', marginBottom: 4 }}><span style={{ position: 'absolute', left: 0, color: c.neon, fontFamily: mono, fontSize: 10, top: 4, fontWeight: 700 }}>//</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Sidebar */}
                <div style={{ padding: '40px 28px', background: c.surface }}>
                    {res.show('skills') && res.skills.length > 0 && (
                        <div style={{ marginBottom: 38 }}>
                            <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: c.neon, marginBottom: 20 }}><span style={{ color: c.neon2 }}>{'>'}</span> Tech Stack</div>
                            {res.skills.map((s, i) => (
                                <div key={i} style={{ fontSize: 12.5, color: c.text, padding: '6px 10px', border: `1px solid ${c.border}`, marginBottom: 6, background: 'rgba(0,255,247,0.02)' }}>{s}</div>
                            ))}
                        </div>
                    )}
                    {res.show('education') && res.education.length > 0 && (
                        <div style={{ marginBottom: 38 }}>
                            <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: c.neon, marginBottom: 20 }}><span style={{ color: c.neon2 }}>{'>'}</span> Education</div>
                            {res.education.map((e, i) => (
                                <div key={i} style={{ marginBottom: 14 }}>
                                    <h4 style={{ fontFamily: mono, fontSize: 14, fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1.3 }}>{e.degree}</h4>
                                    <p style={{ fontSize: 11, color: c.muted, marginTop: 3, lineHeight: 1.6, letterSpacing: 0.5 }}>{e.school}<br />{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
