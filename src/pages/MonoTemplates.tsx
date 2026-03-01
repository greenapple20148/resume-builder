import React from 'react'
import { useDynamicData } from './ThemesPreviews'
import { ResumeData } from '../types'

interface PreviewProps { data?: Partial<ResumeData> }

// ─── Shared helpers ──────────────────────────────────────────
const bullet = (text: string) =>
    text.split('\n').filter(Boolean).map(b => b.replace(/^[•\-–—]\s*/, '').trim()).filter(Boolean)

// ═══════════════════════════════════════════════════════════════
// 1. MONO SLATE — Dark header, clean white body, hairline rules
// ═══════════════════════════════════════════════════════════════
export const MonoSlatePreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'editorial_luxe')
    const c = { blk: '#111', dk: '#222', mid: '#666', lt: '#999', rule: '#ddd', bg: '#fafafa', w: '#fff' }
    const sHead = { fontSize: 10, fontWeight: 700 as const, letterSpacing: 4, textTransform: 'uppercase' as const, color: c.mid, marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${c.rule}` }

    return (
        <div style={{ fontFamily: "'Inter', 'DM Sans', sans-serif", background: c.w, overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ background: c.blk, padding: '48px 56px', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 56, right: 56, height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ color: c.w, fontSize: 42, fontWeight: 800, lineHeight: 1, letterSpacing: -1 }}>{res.name}</h1>
                        <p style={{ color: c.lt, fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', marginTop: 10, fontWeight: 500 }}>{res.role}</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 2 }}>
                        {res.location}<br />{res.phone}<br /><span style={{ color: 'rgba(255,255,255,0.7)' }}>{res.email}</span>
                    </div>
                </div>
            </header>
            {/* Thin accent bar */}
            <div style={{ height: 3, background: c.blk }} />

            <div style={{ padding: '40px 56px' }}>
                {/* Summary */}
                {res.show('summary') && res.summary && (
                    <div style={{ marginBottom: 36 }}>
                        <div style={sHead}>Profile</div>
                        <p style={{ fontSize: 14, color: c.dk, lineHeight: 1.85, fontWeight: 300 }}>{res.summary}</p>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48 }}>
                    {/* Experience */}
                    <div>
                        {res.show('experience') && res.experience.length > 0 && (
                            <>
                                <div style={sHead}>Experience</div>
                                {res.experience.map((e, i) => (
                                    <div key={i} style={{ marginBottom: 28, ...(i > 0 ? { paddingTop: 20, borderTop: `1px solid ${c.rule}` } : {}) }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                                            <h3 style={{ fontWeight: 700, fontSize: 15, color: c.blk }}>{e.title}</h3>
                                            <span style={{ fontSize: 11, color: c.lt, letterSpacing: 1, whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
                                        </div>
                                        <p style={{ fontSize: 12, color: c.mid, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                                        {e.description && bullet(e.description).map((b, j) => (
                                            <div key={j} style={{ display: 'flex', gap: 10, fontSize: 13, color: c.dk, lineHeight: 1.65, marginBottom: 5, fontWeight: 300 }}>
                                                <span style={{ color: c.lt, flexShrink: 0, marginTop: 1 }}>—</span>{b}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        {res.show('education') && res.education.length > 0 && (
                            <div>
                                <div style={sHead}>Education</div>
                                {res.education.map((edu, i) => (
                                    <div key={i} style={{ marginBottom: 16 }}>
                                        <h4 style={{ fontWeight: 700, fontSize: 13, color: c.blk, lineHeight: 1.4 }}>{edu.degree}</h4>
                                        <p style={{ fontSize: 12, color: c.mid, marginTop: 2, lineHeight: 1.5 }}>{edu.school}<br />{edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {res.show('skills') && res.skills.length > 0 && (
                            <div>
                                <div style={sHead}>Skills</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {res.skills.map((s, i) => (
                                        <span key={i} style={{ fontSize: 11.5, color: c.dk, background: c.bg, border: `1px solid ${c.rule}`, padding: '4px 10px', fontWeight: 500 }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// 2. MONO EDGE — Bold left accent bar, asymmetric layout
// ═══════════════════════════════════════════════════════════════
export const MonoEdgePreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'dark_architect')
    const c = { blk: '#0a0a0a', dk: '#1a1a1a', mid: '#555', lt: '#888', pale: '#bbb', rule: '#e0e0e0', bg: '#f5f5f5', w: '#fff' }
    const mono = "'IBM Plex Mono', 'Courier New', monospace"
    const sHead = { fontFamily: mono, fontSize: 10, fontWeight: 600 as const, letterSpacing: 3, textTransform: 'uppercase' as const, color: c.lt, marginBottom: 18 }

    return (
        <div style={{ fontFamily: "'Space Grotesk', 'DM Sans', sans-serif", display: 'flex', overflow: 'hidden' }}>
            {/* Edge bar */}
            <div style={{ width: 6, background: c.blk, flexShrink: 0 }} />

            {/* Main */}
            <div style={{ flex: 1, background: c.w }}>
                {/* Header */}
                <header style={{ padding: '44px 48px 32px', borderBottom: `1px solid ${c.rule}` }}>
                    <h1 style={{ fontSize: 44, fontWeight: 800, color: c.blk, lineHeight: 1, letterSpacing: -1 }}>{res.name}</h1>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12 }}>
                        <span style={{ fontFamily: mono, fontSize: 11, color: c.lt, letterSpacing: 3, textTransform: 'uppercase' }}>{res.role}</span>
                        <span style={{ fontFamily: mono, fontSize: 11, color: c.lt }}>
                            {res.location} · {res.phone} · {res.email}
                        </span>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px' }}>
                    {/* Content */}
                    <div style={{ padding: '36px 48px', borderRight: `1px solid ${c.rule}` }}>
                        {/* Summary */}
                        {res.show('summary') && res.summary && (
                            <div style={{ marginBottom: 36 }}>
                                <div style={sHead}>About</div>
                                <p style={{ fontSize: 14, color: c.mid, lineHeight: 1.85, fontWeight: 300, borderLeft: `2px solid ${c.blk}`, paddingLeft: 16 }}>{res.summary}</p>
                            </div>
                        )}

                        {/* Experience */}
                        {res.show('experience') && res.experience.length > 0 && (
                            <div>
                                <div style={sHead}>Experience</div>
                                {res.experience.map((e, i) => (
                                    <div key={i} style={{ marginBottom: 28 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                                            <h3 style={{ fontWeight: 700, fontSize: 15, color: c.blk }}>{e.title}</h3>
                                            <span style={{ fontFamily: mono, fontSize: 10, color: c.lt, letterSpacing: 1 }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
                                        </div>
                                        <p style={{ fontFamily: mono, fontSize: 11, color: c.mid, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                                        {e.description && bullet(e.description).map((b, j) => (
                                            <div key={j} style={{ display: 'flex', gap: 10, fontSize: 13, color: c.mid, lineHeight: 1.65, marginBottom: 5, fontWeight: 300 }}>
                                                <span style={{ width: 4, height: 4, background: c.blk, marginTop: 8, flexShrink: 0 }} />{b}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside style={{ padding: '36px 28px', background: c.bg, display: 'flex', flexDirection: 'column', gap: 32 }}>
                        {res.show('education') && res.education.length > 0 && (
                            <div>
                                <div style={sHead}>Education</div>
                                {res.education.map((edu, i) => (
                                    <div key={i} style={{ marginBottom: 14 }}>
                                        <h4 style={{ fontWeight: 700, fontSize: 13, color: c.dk, lineHeight: 1.4 }}>{edu.degree}</h4>
                                        <p style={{ fontSize: 12, color: c.lt, marginTop: 2, lineHeight: 1.5 }}>{edu.school}<br />{edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {res.show('skills') && res.skills.length > 0 && (
                            <div>
                                <div style={sHead}>Skills</div>
                                {res.skills.map((s, i) => (
                                    <div key={i} style={{ fontSize: 12, color: c.mid, paddingLeft: 12, position: 'relative', marginBottom: 6, lineHeight: 1.4 }}>
                                        <span style={{ position: 'absolute', left: 0, top: 7, width: 4, height: 1, background: c.blk }} />{s}
                                    </div>
                                ))}
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// 3. MONO STACK — Full-width stacked sections, alternating bands
// ═══════════════════════════════════════════════════════════════
export const MonoStackPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'bauhaus_geometric')
    const c = { blk: '#111', dk: '#222', mid: '#555', lt: '#888', rule: '#e0e0e0', bg: '#f7f7f7', w: '#fff' }
    const sHead = (dark?: boolean) => ({ fontSize: 10, fontWeight: 700 as const, letterSpacing: 5, textTransform: 'uppercase' as const, color: dark ? 'rgba(255,255,255,0.4)' : c.lt, marginBottom: 20 })

    return (
        <div style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif", overflow: 'hidden' }}>
            {/* Header — dark */}
            <header style={{ background: c.blk, padding: '52px 56px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #333, #111)' }} />
                <h1 style={{ color: c.w, fontSize: 48, fontWeight: 800, lineHeight: 1, letterSpacing: -1 }}>{res.name}</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
                    <span style={{ fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{res.role}</span>
                    <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                        <span>{res.location}</span><span>{res.phone}</span><span style={{ color: 'rgba(255,255,255,0.55)' }}>{res.email}</span>
                    </div>
                </div>
            </header>

            {/* Summary band — light gray */}
            {res.show('summary') && res.summary && (
                <div style={{ background: c.bg, padding: '28px 56px', borderBottom: `1px solid ${c.rule}` }}>
                    <p style={{ fontSize: 14, color: c.mid, lineHeight: 1.85, fontWeight: 300, maxWidth: 700 }}>{res.summary}</p>
                </div>
            )}

            {/* Skills band — white */}
            {res.show('skills') && res.skills.length > 0 && (
                <div style={{ padding: '24px 56px', borderBottom: `1px solid ${c.rule}` }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {res.skills.map((s, i) => (
                            <span key={i} style={{ fontSize: 11, color: c.dk, border: `1px solid ${c.rule}`, padding: '5px 14px', fontWeight: 600, letterSpacing: 0.5 }}>{s}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience — white */}
            {res.show('experience') && res.experience.length > 0 && (
                <div style={{ padding: '36px 56px' }}>
                    <div style={sHead()}>Experience</div>
                    {res.experience.map((e, i) => (
                        <div key={i} style={{ marginBottom: 28, ...(i > 0 ? { paddingTop: 24, borderTop: `1px solid ${c.rule}` } : {}) }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 4 }}>
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: 16, color: c.blk }}>{e.title}</h3>
                                    <p style={{ fontSize: 12, color: c.lt, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                                </div>
                                <span style={{ fontSize: 11, color: c.lt, whiteSpace: 'nowrap', fontWeight: 500, letterSpacing: 1 }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
                            </div>
                            {e.description && (
                                <div style={{ marginTop: 10 }}>
                                    {bullet(e.description).map((b, j) => (
                                        <div key={j} style={{ fontSize: 13, color: c.mid, lineHeight: 1.65, marginBottom: 5, paddingLeft: 16, position: 'relative', fontWeight: 300 }}>
                                            <span style={{ position: 'absolute', left: 0, top: 9, width: 6, height: 1, background: c.blk }} />{b}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Education — gray band */}
            {res.show('education') && res.education.length > 0 && (
                <div style={{ background: c.bg, padding: '36px 56px', borderTop: `1px solid ${c.rule}` }}>
                    <div style={sHead()}>Education</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {res.education.map((edu, i) => (
                            <div key={i}>
                                <h4 style={{ fontWeight: 700, fontSize: 14, color: c.blk, lineHeight: 1.3 }}>{edu.degree}</h4>
                                <p style={{ fontSize: 12, color: c.lt, marginTop: 4, lineHeight: 1.5 }}>{edu.school} · {edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// 4. MONO GRID — Two-column, stark black/white contrast
// ═══════════════════════════════════════════════════════════════
export const MonoGridPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'sidebar')
    const c = { blk: '#0a0a0a', dk: '#1a1a1a', mid: '#4a4a4a', lt: '#8a8a8a', pale: '#c0c0c0', rule: '#e8e8e8', bg: '#f8f8f8', w: '#fff' }
    const sHead = { fontSize: 10, fontWeight: 700 as const, letterSpacing: 4, textTransform: 'uppercase' as const, marginBottom: 18, paddingBottom: 8 }

    return (
        <div style={{ fontFamily: "'Inter', 'DM Sans', sans-serif", display: 'grid', gridTemplateColumns: '240px 1fr', overflow: 'hidden' }}>
            {/* Dark sidebar */}
            <div style={{ background: c.blk, padding: '48px 28px', color: c.pale, display: 'flex', flexDirection: 'column', gap: 28 }}>
                {/* Name */}
                <div>
                    <h1 style={{ color: c.w, fontSize: 22, fontWeight: 800, lineHeight: 1.2, letterSpacing: -0.5 }}>{res.name}</h1>
                    <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#666', fontWeight: 600, marginTop: 8 }}>{res.role}</p>
                </div>
                <div style={{ height: 1, background: '#333' }} />

                {/* Contact */}
                <div>
                    <div style={{ ...sHead, color: '#555', borderBottom: '1px solid #333' }}>Contact</div>
                    {[res.email, res.phone, res.location].map((item, i) => (
                        <p key={i} style={{ fontSize: 12, color: '#888', marginBottom: 6, lineHeight: 1.4 }}>{item}</p>
                    ))}
                </div>

                {/* Skills */}
                {res.show('skills') && res.skills.length > 0 && (
                    <div>
                        <div style={{ ...sHead, color: '#555', borderBottom: '1px solid #333' }}>Skills</div>
                        {res.skills.map((s, i) => (
                            <div key={i} style={{ marginBottom: 10 }}>
                                <div style={{ fontSize: 12, color: '#aaa', marginBottom: 4, fontWeight: 500 }}>{s}</div>
                                <div style={{ height: 2, background: '#333' }}>
                                    <div style={{ height: '100%', width: `${92 - i * 6}%`, background: '#666' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Education */}
                {res.show('education') && res.education.length > 0 && (
                    <div>
                        <div style={{ ...sHead, color: '#555', borderBottom: '1px solid #333' }}>Education</div>
                        {res.education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: 14 }}>
                                <h4 style={{ fontSize: 13, color: c.w, fontWeight: 600, lineHeight: 1.3 }}>{edu.degree}</h4>
                                <p style={{ fontSize: 11, color: '#666', marginTop: 3, lineHeight: 1.5 }}>{edu.school}<br />{edu.endDate}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Main content */}
            <div style={{ padding: '48px 44px', background: c.w }}>
                {/* Summary */}
                {res.show('summary') && res.summary && (
                    <div style={{ marginBottom: 36 }}>
                        <div style={{ ...sHead, color: c.lt, borderBottom: `2px solid ${c.blk}` }}>Summary</div>
                        <p style={{ fontSize: 14, color: c.mid, lineHeight: 1.85, fontWeight: 300 }}>{res.summary}</p>
                    </div>
                )}

                {/* Experience */}
                {res.show('experience') && res.experience.length > 0 && (
                    <div>
                        <div style={{ ...sHead, color: c.lt, borderBottom: `2px solid ${c.blk}` }}>Experience</div>
                        {res.experience.map((e, i) => (
                            <div key={i} style={{ marginBottom: 28, ...(i > 0 ? { paddingTop: 22, borderTop: `1px solid ${c.rule}` } : {}) }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                                    <h3 style={{ fontWeight: 700, fontSize: 15, color: c.blk }}>{e.title}</h3>
                                    <span style={{ fontSize: 11, color: c.lt, letterSpacing: 1, whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
                                </div>
                                <p style={{ fontSize: 12, color: c.lt, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                                {e.description && bullet(e.description).map((b, j) => (
                                    <div key={j} style={{ display: 'flex', gap: 10, fontSize: 13, color: c.mid, lineHeight: 1.65, marginBottom: 5, fontWeight: 300 }}>
                                        <span style={{ width: 5, height: 1, background: c.blk, marginTop: 10, flexShrink: 0 }} />{b}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// 5. MONO INK — Editorial serif typography, elegant grayscale
// ═══════════════════════════════════════════════════════════════
export const MonoInkPreview: React.FC<PreviewProps> = ({ data }) => {
    const res = useDynamicData(data || {}, 'editorial')
    const c = { blk: '#111', dk: '#222', mid: '#555', lt: '#888', pale: '#bbb', rule: '#d0d0d0', bg: '#f9f9f9', w: '#fff' }
    const serif = "'Cormorant Garamond', 'EB Garamond', Georgia, serif"
    const sHead = { fontFamily: serif, fontSize: 16, fontWeight: 600 as const, fontStyle: 'italic' as const, color: c.blk, marginBottom: 18, paddingBottom: 8, borderBottom: `1px solid ${c.rule}` }
    const nameParts = res.name.split(' ')
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''

    return (
        <div style={{ fontFamily: "'Source Sans 3', 'DM Sans', sans-serif", background: c.w, overflow: 'hidden' }}>
            {/* Top rule */}
            <div style={{ height: 3, background: c.blk }} />

            {/* Header */}
            <header style={{ padding: '48px 64px 36px', textAlign: 'center', borderBottom: `1px solid ${c.rule}` }}>
                <h1 style={{ fontFamily: serif, fontSize: 52, fontWeight: 300, color: c.blk, lineHeight: 1, letterSpacing: -0.5 }}>
                    {firstName} <strong style={{ fontWeight: 700 }}>{lastName}</strong>
                </h1>
                <p style={{ fontSize: 12, letterSpacing: 5, textTransform: 'uppercase', color: c.lt, marginTop: 12, fontWeight: 500 }}>{res.role}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, fontSize: 12, color: c.lt }}>
                    <span>{res.location}</span><span>·</span><span>{res.phone}</span><span>·</span><span>{res.email}</span>
                </div>
            </header>

            <div style={{ padding: '40px 64px' }}>
                {/* Summary */}
                {res.show('summary') && res.summary && (
                    <div style={{ marginBottom: 36 }}>
                        <p style={{ fontFamily: serif, fontSize: 17, fontStyle: 'italic', fontWeight: 300, color: c.mid, lineHeight: 1.85, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>{res.summary}</p>
                    </div>
                )}

                {/* Two column body */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 48 }}>
                    <div>
                        {/* Experience */}
                        {res.show('experience') && res.experience.length > 0 && (
                            <div>
                                <div style={sHead}>Experience</div>
                                {res.experience.map((e, i) => (
                                    <div key={i} style={{ marginBottom: 26 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                                            <h3 style={{ fontFamily: serif, fontWeight: 600, fontSize: 17, color: c.blk }}>{e.title}</h3>
                                            <span style={{ fontSize: 11, color: c.lt, fontStyle: 'italic', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
                                        </div>
                                        <p style={{ fontSize: 12, color: c.mid, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                                        {e.description && bullet(e.description).map((b, j) => (
                                            <div key={j} style={{ fontSize: 13, color: c.mid, lineHeight: 1.7, marginBottom: 5, paddingLeft: 16, position: 'relative', fontWeight: 300 }}>
                                                <span style={{ position: 'absolute', left: 0, top: 9, width: 6, height: 1, background: c.blk }} />{b}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        {res.show('education') && res.education.length > 0 && (
                            <div>
                                <div style={sHead}>Education</div>
                                {res.education.map((edu, i) => (
                                    <div key={i} style={{ marginBottom: 16 }}>
                                        <h4 style={{ fontFamily: serif, fontWeight: 600, fontSize: 15, color: c.blk, lineHeight: 1.3 }}>{edu.degree}</h4>
                                        <p style={{ fontSize: 12, color: c.lt, marginTop: 3, lineHeight: 1.5 }}>{edu.school}<br />{edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {res.show('skills') && res.skills.length > 0 && (
                            <div>
                                <div style={sHead}>Expertise</div>
                                {res.skills.map((s, i) => (
                                    <div key={i} style={{ fontSize: 12.5, color: c.mid, lineHeight: 1.8, paddingBottom: 4, borderBottom: `1px dotted ${c.rule}`, marginBottom: 4, fontWeight: 300 }}>{s}</div>
                                ))}
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            {/* Bottom rule */}
            <div style={{ height: 3, background: c.blk, marginTop: 20 }} />
        </div>
    )
}

// ─── Export map ───────────────────────────────────────────────
export const MONO_PREVIEW_MAP: Record<string, React.FC<PreviewProps>> = {
    mono_slate: MonoSlatePreview,
    mono_edge: MonoEdgePreview,
    mono_stack: MonoStackPreview,
    mono_grid: MonoGridPreview,
    mono_ink: MonoInkPreview,
}
