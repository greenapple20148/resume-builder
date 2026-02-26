import React from 'react'
import '../styles/templates-batch2.css'

interface PreviewProps {
    data?: any
}

/* ═══ Resume 20 — Origami Zen ═══ */
export const OrigamiZenPreview: React.FC<PreviewProps> = () => (
    <div className="origami-zen-wrapper">
        <div className="red-stripe" />
        <header>
            <div>
                <div className="name">Yuki<strong>Tanaka</strong></div>
                <span className="jp-accent">田中 幸</span>
                <div className="role">Product Design Lead</div>
            </div>
            <div className="contact-block">
                <div className="contact-item">Tokyo, Japan / Remote<br />+81 90-1234-5678<br /><a href="#">yuki@tanaka.design</a><br /><a href="#">yukitanaka.design</a></div>
            </div>
        </header>
        <div className="body">
            <div className="main">
                <div className="section">
                    <div className="section-title">Philosophy</div>
                    <p className="summary">Product designer with 9 years creating human-centered digital experiences across mobile, web, and emerging platforms. Deeply influenced by principles of ma (間) — the beauty of intentional negative space.</p>
                </div>
                <div className="section">
                    <div className="section-title">Experience</div>
                    {[
                        { title: 'Principal Product Designer', date: '2022 — Present', co: 'Figma · San Francisco / Remote', bullets: ['Led design of Developer Handoff 2.0 feature, adopted by 1.2M developers in 6 months', 'Established interaction design principles and motion language used company-wide', 'Hired and onboarded 8 product designers; built team career growth frameworks'] },
                        { title: 'Senior Product Designer', date: '2019 — 2022', co: 'Mercari · Tokyo, Japan', bullets: ['Redesigned seller onboarding flow increasing listing completion rate from 58% to 84%', 'Defined global design system used across iOS, Android, and Web'] },
                        { title: 'Product Designer', date: '2016 — 2019', co: 'Sony Interactive Entertainment · Tokyo', bullets: ['Designed PlayStation 5 quick menu and cross-game social features', 'Shipped 3 major PS4 system software updates affecting 100M+ console owners'] },
                    ].map((e, i) => (
                        <div className="entry" key={i}>
                            <div className="entry-meta"><div className="entry-title">{e.title}</div><div className="entry-date">{e.date}</div></div>
                            <div className="entry-company">{e.co}</div>
                            <ul>{e.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="center-rule"><div className="fold-mark" /></div>
            <div className="sidebar">
                <div className="section">
                    <div className="section-title">Craft</div>
                    {['Interaction Design — Motion, transitions', 'Design Systems — Tokens, components', 'User Research — Usability testing', 'Prototyping — Figma, Principle, Framer', 'Visual Design — Typography, color, layout'].map((s, i) => {
                        const [title, desc] = s.split(' — ')
                        return <div className="sidebar-item" key={i}><strong>{title}</strong>{desc}</div>
                    })}
                </div>
                <div className="section">
                    <div className="section-title">Education</div>
                    <div className="edu-item"><h4>M.Des. Interaction Design</h4><p>Keio University<br />Tokyo · 2016</p></div>
                    <div className="edu-item"><h4>B.A. Visual Design</h4><p>Tokyo University of the Arts<br />2014</p></div>
                </div>
                <div className="section">
                    <div className="section-title">Recognition</div>
                    {['Red Dot Award · 2023', 'iF Design Award · 2022', 'Awwwards SOTD · ×12'].map((s, i) => <div className="sidebar-item" key={i}>{s}</div>)}
                </div>
                <div className="section">
                    <div className="section-title">Languages</div>
                    {['Japanese — Native', 'English — Fluent', 'Mandarin — Basic'].map((s, i) => <div className="sidebar-item" key={i}>{s}</div>)}
                </div>
            </div>
        </div>
        <div className="foot-ornament"><div className="ornament-line" /><div className="ornament-mark" /><div className="ornament-line" /></div>
    </div>
)

/* ═══ Resume 21 — Corporate Slate ═══ */
export const CorporateSlatePreview: React.FC<PreviewProps> = () => {
    const s = {
        wrap: { fontFamily: "'Inter', sans-serif", background: '#fff', display: 'flex', overflow: 'hidden' } as React.CSSProperties,
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
        kpi: { background: '#eff6ff', borderRadius: 8, padding: 16, textAlign: 'center' as const },
        kpiNum: { fontSize: 24, fontWeight: 700, color: '#2563eb' },
        kpiLabel: { fontSize: 11, color: '#64748b', marginTop: 4 },
        skillBar: { height: 4, background: '#334155', borderRadius: 99, marginTop: 4 },
        skillFill: (w: string) => ({ height: '100%', width: w, background: '#3b82f6', borderRadius: 99 }),
    }
    return (
        <div style={s.wrap}>
            <aside style={s.aside}>
                <div><div style={s.initials}>NB</div><h1 style={s.h1}>Nathan<br />Brooks</h1><p style={s.role}>Operations Manager</p></div>
                <hr style={s.hr} />
                <div><div style={s.sTitle}>Contact</div>
                    <div style={s.contact}>n.brooks@ops.com</div>
                    <div style={s.contact}>(312) 504-8820</div>
                    <div style={s.contact}>Chicago, IL</div>
                </div>
                <hr style={s.hr} />
                <div><div style={s.sTitle}>Skills</div>
                    {[['Process Optimization', '95%'], ['Supply Chain', '88%'], ['Budget Management', '90%'], ['ERP Systems (SAP)', '82%']].map(([name, pct], i) => (
                        <div key={i} style={{ marginBottom: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: '#cbd5e1' }}>{name}</span><span style={{ color: '#60a5fa', fontSize: 11 }}>{pct}</span></div><div style={s.skillBar}><div style={s.skillFill(pct)} /></div></div>
                    ))}
                </div>
                <hr style={s.hr} />
                <div><div style={s.sTitle}>Education</div>
                    <div style={{ marginBottom: 12 }}><p style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>MBA, Operations</p><p style={{ color: '#94a3b8', fontSize: 11.5, marginTop: 2 }}>Kellogg School of Management<br />Northwestern · 2017</p></div>
                    <div><p style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>B.S. Industrial Engineering</p><p style={{ color: '#94a3b8', fontSize: 11.5, marginTop: 2 }}>Purdue University · 2015</p></div>
                </div>
            </aside>
            <main style={s.main}>
                <div style={s.bars}><div style={{ height: 4, width: 56, background: '#3b82f6', borderRadius: 99 }} /><div style={{ height: 4, width: 36, background: '#93c5fd', borderRadius: 99 }} /><div style={{ height: 4, width: 20, background: '#bfdbfe', borderRadius: 99 }} /></div>
                <section style={{ marginBottom: 32 }}>
                    <div style={s.mTitle}>Professional Summary</div>
                    <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.6 }}>Operations manager with 8 years optimizing supply chain processes and leading cross-functional teams. Delivered $14M in annual cost savings through lean methodologies and ERP transformation.</p>
                </section>
                <section style={{ marginBottom: 32 }}>
                    <div style={s.mTitle}>Work Experience</div>
                    {[
                        { title: 'Senior Operations Manager', date: '2022 — Present', co: 'Amazon Logistics · Chicago, IL', bullets: ['Managed 340-person warehouse processing 120K orders/day', 'Implemented lean improvements reducing picking error rate by 62%', 'Led SAP WMS deployment across 3 facilities on-time and 8% under budget', 'Achieved 99.4% on-time shipment rate, top 5% in network'] },
                        { title: 'Operations Manager', date: '2019 — 2022', co: 'Caterpillar Inc. · Peoria, IL', bullets: ['Oversaw $80M annual production budget and 200-person floor', 'Reduced production cycle time 28% through value stream mapping'] },
                        { title: 'Supply Chain Analyst', date: '2017 — 2019', co: 'Deloitte Consulting · Chicago, IL', bullets: ['Delivered 6 supply chain transformation engagements', 'Built demand forecasting model improving inventory accuracy from 72% to 94%'] },
                    ].map((e, i) => (
                        <div key={i} style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}><h3 style={s.entryTitle}>{e.title}</h3><span style={s.entryDate}>{e.date}</span></div>
                            <p style={s.entryCo}>{e.co}</p>
                            {e.bullets.map((b, j) => <div key={j} style={s.bullet}><span style={s.bDot}>▸</span>{b}</div>)}
                        </div>
                    ))}
                </section>
                <section>
                    <div style={s.mTitle}>Key Achievements</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        {[['$14M', 'Annual Cost Savings'], ['99.4%', 'On-Time Shipment'], ['540+', 'Team Members Led']].map(([n, l], i) => <div key={i} style={s.kpi}><div style={s.kpiNum}>{n}</div><div style={s.kpiLabel}>{l}</div></div>)}
                    </div>
                </section>
            </main>
        </div>
    )
}

/* ═══ Resume 22 — Teal Wave ═══ */
export const TealWavePreview: React.FC<PreviewProps> = () => {
    const c = { teal: '#0d9488', tealDk: '#0f766e', tealLt: '#99f6e4', bg: '#f0fdfa', white: '#fff', txt: '#475569', txtDk: '#1e293b' }
    const sTitle = { color: c.tealDk, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 20 }
    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: c.white, overflow: 'hidden' }}>
            <header style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)', padding: '48px 56px 64px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -48, right: -48, width: 192, height: 192, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
                    <div>
                        <p style={{ color: '#99f6e4', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>Curriculum Vitae</p>
                        <h1 style={{ color: '#fff', fontSize: 50, fontWeight: 700, lineHeight: 1 }}>Anika<br /><span style={{ fontWeight: 300, fontStyle: 'italic', opacity: 0.8 }}>Patel</span></h1>
                        <p style={{ color: '#ccfbf1', fontSize: 14, letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 12, fontWeight: 500 }}>Healthcare Administrator</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 13, color: '#ccfbf1', lineHeight: 2 }}>
                        <p>Boston, MA</p><p>(617) 923-4401</p><p>anika.patel@health.org</p><p>linkedin.com/in/anika-patel</p>
                    </div>
                </div>
            </header>
            <div style={{ padding: '40px 56px' }}>
                <div style={{ background: c.bg, borderLeft: `4px solid ${c.teal}`, borderRadius: '0 12px 12px 0', padding: 20, marginBottom: 40 }}>
                    <p style={{ color: c.txt, fontSize: 14, lineHeight: 1.6 }}>Healthcare administrator with 10 years improving operational performance at academic medical centers. Expertise in revenue cycle management, regulatory compliance, and building high-performance clinical operations teams.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
                    <div>
                        <h2 style={sTitle}>Experience</h2>
                        {[
                            { title: 'VP of Hospital Operations', date: '2022 — Present', co: 'Mass General Brigham · Boston, MA', bullets: ['Oversaw operations for 3 hospitals with 1,400 beds and $2.1B budget', 'Reduced average length of stay by 0.8 days saving $18M annually', 'Led Epic EMR migration serving 6,000+ clinical staff with 98% adoption'] },
                            { title: 'Director of Clinical Operations', date: '2018 — 2022', co: 'Boston Medical Center', bullets: ['Managed 18-department clinical operations budget of $420M', 'Redesigned ED triage workflow reducing door-to-provider time from 48 to 14 min'] },
                        ].map((e, i) => (
                            <div key={i} style={{ border: '1px solid #f1f5f9', borderRadius: 12, padding: 20, marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <h3 style={{ fontWeight: 600, fontSize: 15, color: c.txtDk }}>{e.title}</h3>
                                    <span style={{ color: c.tealDk, fontSize: 12, background: c.bg, border: '1px solid #99f6e4', padding: '2px 10px', borderRadius: 99, fontWeight: 500, whiteSpace: 'nowrap' }}>{e.date}</span>
                                </div>
                                <p style={{ color: c.tealDk, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{e.co}</p>
                                {e.bullets.map((b, j) => (
                                    <div key={j} style={{ display: 'flex', gap: 10, fontSize: 13, color: c.txt, marginBottom: 8 }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2dd4bf', marginTop: 6, flexShrink: 0 }} />{b}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div>
                        <h2 style={sTitle}>Education</h2>
                        {[['MHA, Health Administration', 'Harvard T.H. Chan School · 2014'], ['B.S. Public Health', 'Tufts University · 2012']].map(([d, s2], i) => (
                            <div key={i} style={{ background: c.bg, borderRadius: 8, padding: 14, marginBottom: 12 }}><p style={{ fontWeight: 600, fontSize: 13, color: c.txtDk }}>{d}</p><p style={{ color: c.tealDk, fontSize: 11.5, marginTop: 4 }}>{s2}</p></div>
                        ))}
                        <h2 style={{ ...sTitle, marginTop: 28 }}>Core Skills</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {['Revenue Cycle', 'Epic EMR', 'JCAHO', 'CMS Compliance', 'Lean Healthcare', 'HIPAA', 'Staff Development'].map((sk, i) => (
                                <span key={i} style={{ fontSize: 11.5, background: '#ccfbf1', color: c.tealDk, padding: '4px 10px', borderRadius: 99, fontWeight: 500 }}>{sk}</span>
                            ))}
                        </div>
                        <h2 style={{ ...sTitle, marginTop: 28 }}>Metrics</h2>
                        {[['Patient Satisfaction', '96th %ile'], ['Cost Reduction', '$36M+'], ['Staff Managed', '5,600+']].map(([l, v], i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: '#f8fafc', borderRadius: 8, marginBottom: 8 }}>
                                <span style={{ fontSize: 12, color: c.txt }}>{l}</span><span style={{ color: c.tealDk, fontWeight: 700, fontSize: 14 }}>{v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 23 — Purple Dusk ═══ */
export const PurpleDuskPreview: React.FC<PreviewProps> = () => {
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

    return (
        <div style={{ fontFamily: "'Sora', 'DM Sans', sans-serif", background: c.white, overflow: 'hidden' }}>
            {/* Top gradient strip */}
            <div style={{ height: 8, background: `linear-gradient(to right, ${c.violet700}, ${c.violet500}, ${c.fuchsia500})` }} />
            <div style={{ display: 'flex' }}>
                {/* Sidebar */}
                <aside style={{ width: 288, flexShrink: 0, background: `linear-gradient(to bottom, ${c.violet900}, ${c.violet950})`, color: c.white, padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
                    <div>
                        <p style={{ color: c.violet400, fontSize: 10, letterSpacing: 3.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>Creative Strategist</p>
                        <h1 style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.2 }}>Zara<br /><span style={{ color: c.violet300, fontWeight: 300 }}>Mitchell</span></h1>
                        <p style={{ color: c.violet400, fontSize: 12, marginTop: 16, lineHeight: 1.8, fontWeight: 300 }}>New York, NY<br />(646) 301-7720<br />zara@mitchell.co<br />zaramitchell.co</p>
                    </div>
                    <hr style={hr} />
                    <div>
                        <div style={sTitle}>About</div>
                        <p style={{ color: c.violet200, fontSize: 12.5, lineHeight: 1.6, fontWeight: 300 }}>Brand strategist and creative director with 11 years shaping cultural narratives for technology, fashion, and entertainment clients.</p>
                    </div>
                    <hr style={hr} />
                    <div>
                        <div style={sTitle}>Expertise</div>
                        {[['Brand Strategy', '95%', 'Expert'], ['Campaign Direction', '92%', 'Expert'], ['Content Strategy', '85%', 'Advanced'], ['Visual Identity', '80%', 'Advanced'], ['Data Analytics', '70%', 'Proficient']].map(([name, pct, level], i) => (
                            <div key={i} style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                                    <span style={{ color: c.violet100 }}>{name}</span>
                                    <span style={{ color: c.violet400, fontSize: 10 }}>{level}</span>
                                </div>
                                <div style={{ height: 2, background: c.violet900, borderRadius: 99 }}><div style={gradBar(pct)} /></div>
                            </div>
                        ))}
                    </div>
                    <hr style={hr} />
                    <div>
                        <div style={sTitle}>Education</div>
                        <div style={{ marginBottom: 12 }}><p style={{ color: c.white, fontSize: 13, fontWeight: 600 }}>M.A. Branding</p><p style={{ color: c.violet400, fontSize: 11.5, marginTop: 2, fontWeight: 300 }}>SVA · New York · 2014</p></div>
                        <div><p style={{ color: c.white, fontSize: 13, fontWeight: 600 }}>B.A. Communication Arts</p><p style={{ color: c.violet400, fontSize: 11.5, marginTop: 2, fontWeight: 300 }}>NYU · 2012</p></div>
                    </div>
                    <hr style={hr} />
                    <div>
                        <div style={sTitle}>Awards</div>
                        {['Cannes Lions Gold · 2023', 'Clio Award · 2022', 'D&AD Pencil · 2021', 'One Show Silver · 2020'].map((a, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: c.violet300, fontWeight: 300, marginBottom: 8 }}>
                                <span style={{ color: c.fuchsia400, flexShrink: 0 }}>◆</span>{a}
                            </div>
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
                        {[
                            { title: 'Chief Creative Officer', date: '2022 — Present', co: 'Droga5 · New York', bullets: ['Led creative vision for 24-client portfolio generating $380M in annual billings', 'Directed Amazon, Meta, and Apple account teams spanning 140 creatives globally', 'Won Cannes Grand Prix and 6 Gold Lions for Amazon Alexa campaign', 'Grew agency creative department from 60 to 140 in 24 months'], dotColor: c.violet500 },
                            { title: 'Executive Creative Director', date: '2018 — 2022', co: 'Wieden+Kennedy · New York', bullets: ['Oversaw Nike, Ford, and Instagram accounts totaling $200M+ in revenue', 'Concepted Nike\'s "Play New" global platform — viewed 1.2B times', 'Mentored and promoted 12 creative directors through growth programs'], dotColor: c.violet400 },
                            { title: 'Creative Director', date: '2014 — 2018', co: 'BBDO · New York', bullets: ['Led AT&T and Pepsi account creative, producing 4 Super Bowl commercials', 'Won Effie Gold for Pepsi "Generations" campaign exceeding sales targets by 31%'], dotColor: c.violet300 },
                        ].map((e, i) => (
                            <div key={i} style={{ position: 'relative', paddingLeft: 24, borderLeft: `2px solid ${c.violet100}` }}>
                                <div style={{ position: 'absolute', left: -5, top: 4, width: 8, height: 8, borderRadius: '50%', background: e.dotColor }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <h3 style={{ fontSize: 15.5, fontWeight: 600, color: c.slate800 }}>{e.title}</h3>
                                    <span style={datePill}>{e.date}</span>
                                </div>
                                <p style={{ color: c.violet600, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{e.co}</p>
                                {e.bullets.map((b, j) => <div key={j} style={bullet}><span style={dot}>●</span>{b}</div>)}
                            </div>
                        ))}
                    </div>

                    {/* Tools section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: c.violet100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: c.violet500 }} />
                        </div>
                        <p style={{ color: c.violet600, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Tools & Platforms</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {['Adobe Creative Suite', 'Figma', 'Final Cut Pro', 'Keynote', 'Notion', 'Asana', 'Sprinklr'].map((t, i) => (
                            <span key={i} style={{ fontSize: 12, color: c.violet700, background: c.violet50, border: `1px solid ${c.violet200}`, padding: '6px 12px', borderRadius: 8, fontWeight: 500 }}>{t}</span>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}

/* ═══ Resume 24 — Coral Bright ═══ */
export const CoralBrightPreview: React.FC<PreviewProps> = () => {
    const c = { or500: '#f97316', or400: '#fb923c', or200: '#fed7aa', or100: '#ffedd5', or50: '#fff7ed', or600: '#ea580c', or700: '#c2410c', red400: '#f87171', rose500: '#f43e5c', sl800: '#1e293b', sl500: '#64748b', sl600: '#475569', w: '#fff' }
    const datePill = { fontSize: 11, color: c.or600, background: c.or50, border: `1px solid ${c.or200}`, borderRadius: 99, padding: '2px 10px', fontWeight: 600, whiteSpace: 'nowrap' as const }
    const sHead = { color: c.or500, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }
    const bullet = { display: 'flex', gap: 10, fontSize: 13, color: c.sl500, lineHeight: 1.6, marginBottom: 6 }
    return (
        <div style={{ fontFamily: "'Nunito', 'DM Sans', sans-serif", background: c.w, overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ background: `linear-gradient(to right, ${c.or500}, ${c.red400}, ${c.rose500})`, padding: '40px 48px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 256, height: 256, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', transform: 'translate(25%,-50%)' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 40 }}>
                    <div style={{ width: 96, height: 96, borderRadius: 16, background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, color: c.w, flexShrink: 0 }}>LH</div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ color: c.w, fontSize: 44, fontWeight: 800, lineHeight: 1, letterSpacing: -0.5 }}>Layla <span style={{ fontWeight: 300, fontStyle: 'italic' }}>Hassan</span></h1>
                        <p style={{ color: c.or100, fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', marginTop: 10, fontWeight: 500 }}>Social Media & Growth Marketer</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 13, color: c.or100, lineHeight: 2 }}>
                        <p>Dubai, UAE</p><p>+971 50 234 5678</p><p>layla@hassanmktg.com</p><p>layla-hassan.com</p>
                    </div>
                </div>
                {/* Stats */}
                <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                    {[['8+', 'Years'], ['$40M+', 'Ad Spend Managed'], ['120M+', 'Followers Grown'], ['18', 'Brand Clients']].map(([v, l], i) => (
                        <div key={i} style={{ textAlign: 'center' }}><div style={{ color: c.w, fontSize: 24, fontWeight: 900 }}>{v}</div><div style={{ color: c.or200, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginTop: 2 }}>{l}</div></div>
                    ))}
                </div>
            </header>
            {/* Body */}
            <div style={{ padding: '40px 48px' }}>
                {/* Summary */}
                <div style={{ marginBottom: 36, padding: 20, background: c.or50, borderRadius: 12, borderLeft: `4px solid ${c.or400}` }}>
                    <p style={{ color: c.sl600, fontSize: 14, lineHeight: 1.6 }}>Performance marketer and social media strategist specializing in rapid brand growth, paid acquisition, and influencer partnerships. Built and managed social presences for 18 brands totaling 120M+ followers.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
                    {/* Experience */}
                    <div>
                        <div style={sHead}><span style={{ width: 16, height: 2, background: c.or400 }} />Experience</div>
                        {[
                            { title: 'Head of Growth Marketing', date: '2022 — Present', co: 'Noon.com · Dubai, UAE', bullets: ['Scaled paid social from $2M to $18M annual spend while maintaining 4.2x ROAS', 'Grew TikTok from 0 to 14M followers in 18 months', 'Led influencer program with 2,400 creators driving 32% of new customer acquisition', 'Built 12-person growth team from scratch'] },
                            { title: 'Social Media Director', date: '2019 — 2022', co: 'Namshi (EMEA Fashion) · Dubai', bullets: ['Grew Instagram from 800K to 8M followers; #1 fashion brand in MENA', 'Reduced CPA 44% through creative testing framework (120+ monthly ad variants)', 'Launched Ramadan campaigns achieving 8M organic reach with zero paid promotion'] },
                            { title: 'Digital Marketing Manager', date: '2016 — 2019', co: 'WPP MENA · Dubai', bullets: ['Managed digital campaigns for Unilever, P&G, and L\'Oréal across 8 MENA markets', 'Certified Google Partner trainer; trained 60+ agency staff'] },
                        ].map((e, i) => (
                            <div key={i} style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}><h3 style={{ fontWeight: 700, fontSize: 15, color: c.sl800 }}>{e.title}</h3><span style={datePill}>{e.date}</span></div>
                                <p style={{ color: c.or500, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{e.co}</p>
                                {e.bullets.map((b, j) => <div key={j} style={bullet}><span style={{ color: c.or400, flexShrink: 0, marginTop: 1, fontWeight: 700 }}>→</span>{b}</div>)}
                            </div>
                        ))}
                    </div>
                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                        <div><div style={sHead}><span style={{ width: 16, height: 2, background: c.or400 }} />Education</div>
                            <div style={{ background: c.or50, borderRadius: 12, padding: 14 }}><p style={{ color: c.sl800, fontWeight: 700, fontSize: 13 }}>B.Sc. Marketing</p><p style={{ color: c.or500, fontSize: 11.5, marginTop: 2, fontWeight: 600 }}>AUC · Cairo, Egypt · 2016</p></div>
                        </div>
                        <div><div style={sHead}><span style={{ width: 16, height: 2, background: c.or400 }} />Skills</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {['TikTok Ads', 'Meta Ads', 'Google Ads', 'SEO', 'Influencer Mktg', 'Email / SMS', 'Analytics', 'A/B Testing'].map((s, i) => (
                                    <span key={i} style={{ background: c.or100, color: c.or700, fontSize: 11.5, padding: '4px 10px', borderRadius: 99, fontWeight: 600 }}>{s}</span>
                                ))}
                            </div>
                        </div>
                        <div><div style={sHead}><span style={{ width: 16, height: 2, background: c.or400 }} />Certifications</div>
                            {['Meta Blueprint Certified', 'Google Analytics 4 Certified', 'TikTok Ads Certified', 'HubSpot Content Marketing'].map((c2, i) => (
                                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12.5, color: c.sl500, marginBottom: 8 }}><span style={{ color: c.or400, fontWeight: 700 }}>✓</span>{c2}</div>
                            ))}
                        </div>
                        <div><div style={sHead}><span style={{ width: 16, height: 2, background: c.or400 }} />Languages</div>
                            {[['Arabic', 'Native'], ['English', 'Fluent'], ['French', 'Conversational']].map(([l, lv], i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: c.sl500, marginBottom: 6 }}><span>{l}</span><span style={{ color: c.or500, fontWeight: 600, fontSize: 11 }}>{lv}</span></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 25 — Ocean Deep ═══ */
export const OceanDeepPreview: React.FC<PreviewProps> = () => {
    const c = { sky900: '#0c4a6e', sky800: '#075985', sky700: '#0369a1', sky600: '#0284c7', sky400: '#38bdf8', sky300: '#7dd3fc', sky200: '#bae6fd', sky100: '#e0f2fe', sky50: '#f0f9ff', ind900: '#312e81', sl800: '#1e293b', sl700: '#334155', sl500: '#64748b', sl600: '#475569', w: '#fff' }
    const datePill = { fontSize: 11, color: c.sky600, fontWeight: 600, background: c.sky50, border: `1px solid ${c.sky200}`, padding: '2px 10px', borderRadius: 4, whiteSpace: 'nowrap' as const }
    const sHead = { color: c.sky700, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }
    const bullet = { display: 'flex', gap: 10, fontSize: 13, color: c.sl500, lineHeight: 1.6, marginBottom: 6 }
    return (
        <div style={{ fontFamily: "'Libre Franklin', 'DM Sans', sans-serif", overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ background: `linear-gradient(135deg, ${c.sky900}, #1e3a5f, ${c.ind900})`, padding: '56px 56px 48px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -80, right: -80, width: 288, height: 288, borderRadius: '50%', background: 'rgba(56,189,248,0.1)', filter: 'blur(48px)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 32, marginBottom: 32 }}>
                        <div>
                            <p style={{ color: c.sky400, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>Marine Engineer · Project Manager</p>
                            <h1 style={{ color: c.w, fontSize: 50, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>James</h1>
                            <h1 style={{ color: c.sky300, fontSize: 50, fontWeight: 200, lineHeight: 1, fontStyle: 'italic' }}>O'Brien</h1>
                        </div>
                        <div style={{ textAlign: 'right', color: c.sky300, fontSize: 13, lineHeight: 2, fontWeight: 300 }}>
                            <p style={{ color: c.w, fontWeight: 500 }}>Aberdeen, Scotland</p>
                            <p>+44 7700 123456</p><p>j.obrien@marine.eng</p><p>linkedin.com/in/jobrien-eng</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {['Offshore Operations', 'FPSO Vessels', 'Subsea Engineering', 'HSSE Management', 'IMO Compliance'].map((t, i) => (
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
                    <p style={{ color: c.sl600, fontSize: 14, lineHeight: 1.6 }}>Chartered Marine Engineer with 14 years in offshore oil & gas and renewable energy sectors. Led FPSO conversion projects worth $800M+ and managed multinational engineering teams of 120+.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
                    {/* Experience */}
                    <div>
                        <div style={sHead}><div style={{ width: 20, height: 2, background: c.sky400 }} />Experience</div>
                        {[
                            { title: 'Principal Marine Engineer', date: '2021 — Present', co: 'Subsea 7 · Aberdeen, UK', bullets: ['Directed FPSO hull conversion project ($480M) delivered 3 weeks ahead of schedule', 'Led 120-person multinational engineering team across UK, Singapore, and Nigeria', 'Zero LTI record over 4.2M man-hours through HSSE culture program', 'Achieved Class DNV certification for 3 vessels maintaining ISM Code compliance'] },
                            { title: 'Senior Marine Systems Engineer', date: '2017 — 2021', co: 'TechnipFMC · Aberdeen, UK', bullets: ['Designed propulsion and dynamic positioning systems for 4 offshore support vessels', 'Reduced fuel consumption 18% through hull form optimization using CFD analysis', 'Authored maintenance protocols reducing unplanned downtime from 8.2% to 2.1%'] },
                            { title: 'Graduate Marine Engineer', date: '2011 — 2017', co: 'BP · Aberdeen / West Africa', bullets: ['Rotational offshore position on FPSO Kwame Nkrumah and Schiehallion', 'Qualified OOW (Unlimited) and Chief Engineer (unlimited)'] },
                        ].map((e, i) => (
                            <div key={i} style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}><h3 style={{ color: c.sl800, fontWeight: 700, fontSize: 15 }}>{e.title}</h3><span style={datePill}>{e.date}</span></div>
                                <p style={{ color: c.sky600, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{e.co}</p>
                                {e.bullets.map((b, j) => <div key={j} style={bullet}><span style={{ color: c.sky400, fontWeight: 900, flexShrink: 0, marginTop: 1 }}>›</span>{b}</div>)}
                            </div>
                        ))}
                    </div>
                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                        <div><div style={sHead}><div style={{ width: 16, height: 2, background: c.sky400 }} />Education</div>
                            <div style={{ borderLeft: `2px solid ${c.sky300}`, paddingLeft: 12 }}><p style={{ color: c.sl700, fontSize: 13, fontWeight: 600 }}>B.Eng. (Hons) Marine Engineering</p><p style={{ color: c.sky600, fontSize: 11.5, marginTop: 2 }}>Newcastle University<br />2011 · First Class</p></div>
                        </div>
                        <div><div style={sHead}><div style={{ width: 16, height: 2, background: c.sky400 }} />Certifications</div>
                            {['CEng MIMarEST', 'STCW Chief Engineer (Unlimited)', 'Dynamic Positioning (DP2)', 'NEBOSH International OGC', 'HUET / BOSIET Offshore'].map((cert, i) => (
                                <div key={i} style={{ background: c.sky50, borderRadius: 8, padding: '8px 12px', fontSize: 12, color: c.sl600, fontWeight: 500, marginBottom: 8 }}>{cert}</div>
                            ))}
                        </div>
                        <div><div style={sHead}><div style={{ width: 16, height: 2, background: c.sky400 }} />Technical Skills</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {['AutoCAD Naval', 'AVEVA Marine', 'ShipConstructor', 'ANSYS CFX', 'MAXSURF', 'SAP PM'].map((s, i) => (
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
export const SageProPreview: React.FC<PreviewProps> = () => {
    const c = { g700: '#15803d', g600: '#16a34a', g500: '#22c55e', g400: '#4ade80', g300: '#86efac', g200: '#bbf7d0', g100: '#dcfce7', g50: '#f0fdf4', g800: '#166534', st400: '#a8a29e', st500: '#78716c', st600: '#57534e', st100: '#f5f5f4', st50: '#fafaf9', sl800: '#1e293b', sl700: '#334155', sl500: '#64748b', w: '#fff' }
    const sHead = { color: c.g700, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 20 }
    const datePill = { fontSize: 11, color: c.g700, background: c.g50, border: `1px solid ${c.g200}`, borderRadius: 4, padding: '2px 8px', fontWeight: 600, whiteSpace: 'nowrap' as const, flexShrink: 0 }
    return (
        <div style={{ fontFamily: "'Lato', 'DM Sans', sans-serif", background: c.w, overflow: 'hidden' }}>
            {/* Top strip */}
            <div style={{ height: 6, display: 'flex' }}><div style={{ flex: 1, background: c.st400 }} /><div style={{ flex: 1, background: c.g600 }} /><div style={{ flex: 1, background: c.st400 }} /></div>
            {/* Header */}
            <header style={{ padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid ${c.st100}` }}>
                <div>
                    <h1 style={{ fontSize: 46, fontWeight: 900, lineHeight: 1, letterSpacing: -0.5, color: c.sl800 }}>Claire<br /><span style={{ color: c.g700, fontWeight: 300, fontStyle: 'italic' }}>Dubois</span></h1>
                    <p style={{ color: c.st400, fontSize: 12, letterSpacing: 3.5, textTransform: 'uppercase', fontWeight: 500, marginTop: 12 }}>Talent Acquisition Director</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: 13, color: c.st500, lineHeight: 2 }}>
                    <p style={{ color: c.sl700, fontWeight: 600 }}>Paris, France · Open to relocation</p>
                    <p>+33 6 78 90 12 34</p><p>claire.dubois@talent.fr</p><p style={{ color: c.g700 }}>linkedin.com/in/clairedubois</p>
                </div>
            </header>
            <div style={{ padding: '40px 48px' }}>
                {/* Profile */}
                <div style={{ marginBottom: 32 }}>
                    <div style={sHead}>Profile</div>
                    <p style={{ color: c.st600, fontSize: 14, lineHeight: 1.6, borderLeft: `3px solid ${c.g300}`, paddingLeft: 16 }}>People-first talent leader with 12 years building high-performance recruiting functions at hyper-growth tech companies across Europe. Scaled hiring from 50 to 600+ employees per year at two unicorn-stage companies.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
                    {/* Experience */}
                    <div>
                        <div style={sHead}>Experience</div>
                        {[
                            { title: 'VP of Talent Acquisition', date: '2022 — Present', co: 'Contentsquare · Paris', bullets: ['Built global TA function from 4 to 28 recruiters supporting 600 annual hires across 12 countries', 'Reduced time-to-offer from 38 to 19 days through ATS redesign and structured interviewing', 'Launched "Belong at CS" DEI program increasing underrepresented hires from 22% to 41%', 'Managed $8M annual recruiting budget achieving 23% year-over-year efficiency gain'] },
                            { title: 'Senior Talent Acquisition Manager', date: '2018 — 2022', co: 'Doctolib · Paris', bullets: ['Scaled engineering and product hiring from 40 to 280 roles annually during Series D–F hypergrowth', 'Built employer brand from scratch; Glassdoor rating improved from 3.4 to 4.7', 'Implemented Greenhouse ATS reducing recruiter admin time by 35%'] },
                            { title: 'Technical Recruiter', date: '2013 — 2018', co: 'Michael Page Technology · Paris', bullets: ['Placed 220+ software engineers and engineering leaders at 80+ tech companies', 'Ranked #1 biller in Paris office two years running (2016, 2017)'] },
                        ].map((e, i) => (
                            <div key={i} style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 4 }}><h3 style={{ fontWeight: 700, fontSize: 15, color: c.sl800 }}>{e.title}</h3><span style={datePill}>{e.date}</span></div>
                                <p style={{ color: c.g700, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{e.co}</p>
                                {e.bullets.map((b, j) => <div key={j} style={{ display: 'flex', gap: 8, fontSize: 13, color: c.st500, lineHeight: 1.6, marginBottom: 6 }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: c.g400, marginTop: 8, flexShrink: 0 }} />{b}</div>)}
                            </div>
                        ))}
                    </div>
                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                        <div><div style={sHead}>Education</div>
                            {[['M.Sc. Human Resources Management', 'ESSEC Business School · 2013'], ['B.A. Psychology', 'Paris-Sorbonne · 2011']].map(([d, s], i) => (
                                <div key={i} style={{ marginBottom: 12 }}><p style={{ color: c.sl700, fontWeight: 700, fontSize: 13 }}>{d}</p><p style={{ color: c.g700, fontSize: 11.5, marginTop: 2, fontWeight: 600 }}>{s}</p></div>
                            ))}
                        </div>
                        <div><div style={sHead}>Skills</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {['Greenhouse ATS', 'LinkedIn Recruiter', 'Employer Brand', 'Structured Interviews', 'DEI Recruiting', 'People Analytics', 'Lever', 'Workday'].map((s, i) => (
                                    <span key={i} style={{ fontSize: 11.5, color: c.g800, background: c.g100, borderRadius: 4, padding: '4px 10px', fontWeight: 500 }}>{s}</span>
                                ))}
                            </div>
                        </div>
                        <div><div style={sHead}>Languages</div>
                            {[['French', 5], ['English', 5], ['German', 3]].map(([lang, filled], i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <span style={{ fontSize: 13, color: c.st600 }}>{lang as string}</span>
                                    <div style={{ display: 'flex', gap: 4 }}>{Array.from({ length: 5 }, (_, j) => <div key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: j < (filled as number) ? c.g500 : c.g200 }} />)}</div>
                                </div>
                            ))}
                        </div>
                        <div><div style={sHead}>Impact Numbers</div>
                            {[['Hires Completed', '1,600+'], ['Time to Offer', '−50%'], ['Offer Acceptance', '94%']].map(([l, v], i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, background: c.st50, borderRadius: 8, border: `1px solid ${c.st100}`, marginBottom: 8 }}>
                                    <span style={{ fontSize: 12, color: c.st500 }}>{l}</span><span style={{ color: c.g700, fontWeight: 900, fontSize: 15 }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 27 — Carbon Noir ═══ */
export const CarbonNoirPreview: React.FC<PreviewProps> = () => {
    const c = { z950: '#09090b', z900: '#18181b', z800: '#27272a', z700: '#3f3f46', z500: '#71717a', z400: '#a1a1aa', z300: '#d4d4d8', z200: '#e4e4e7', w: '#fff' }
    const sHead = { color: c.z500, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase' as const, fontWeight: 600, marginBottom: 24 }
    return (
        <div style={{ fontFamily: "'Space Grotesk', 'DM Sans', sans-serif", overflow: 'hidden' }}>
            {/* Name banner */}
            <div style={{ background: c.z900, border: `1px solid ${c.z800}`, padding: '40px 56px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ color: c.w, fontSize: 52, fontWeight: 700, lineHeight: 1, letterSpacing: -1 }}>Rhys<br /><span style={{ color: c.z400, fontWeight: 300 }}>Harrington</span></h1>
                        <p style={{ color: c.z500, fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 500, marginTop: 12 }}>Data Engineering Lead</p>
                    </div>
                    <div style={{ textAlign: 'right', color: c.z500, fontSize: 13, lineHeight: 2, fontWeight: 300 }}>
                        <p style={{ color: c.z300, fontWeight: 500 }}>London, UK</p>
                        <p>+44 7800 123456</p><p>rhys@harrington.dev</p><p style={{ color: c.z400 }}>rhysharrington.dev</p>
                    </div>
                </div>
            </div>
            {/* Summary band */}
            <div style={{ background: c.z800, borderLeft: `1px solid ${c.z700}`, borderRight: `1px solid ${c.z700}`, padding: '20px 56px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 2, height: 48, background: c.w, flexShrink: 0 }} />
                <p style={{ color: c.z400, fontSize: 13.5, lineHeight: 1.6, fontWeight: 300 }}>Data engineering leader with 9 years designing pipelines and data platforms for fintech, media, and e-commerce at scale. Expert in Apache Spark, dbt, and cloud data warehousing.</p>
            </div>
            {/* Main body */}
            <div style={{ background: c.z900, border: `1px solid ${c.z800}`, marginTop: 2 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr' }}>
                    {/* Experience */}
                    <div style={{ borderRight: `1px solid ${c.z800}`, padding: '40px 48px' }}>
                        <div style={sHead}>Experience</div>
                        {[
                            { title: 'Lead Data Engineer', date: '2022 — NOW', co: 'Monzo · London', bullets: ['Architected streaming data platform processing £4B/day in transaction events using Kafka + Flink', 'Migrated 400+ Airflow DAGs to Prefect reducing pipeline failures by 78%', 'Implemented data cost governance saving $3.8M annually in BigQuery compute', 'Led team of 8 engineers, conducting 40+ technical interviews'] },
                            { title: 'Senior Data Engineer', date: '2019 — 2022', co: 'Deliveroo · London', bullets: ['Built real-time order attribution pipeline tracking 2M+ daily orders across 12 markets', 'Led dbt migration from Looker PDTs reducing transformation run time 65%', 'Designed data mesh architecture enabling 60+ analytical self-service users'] },
                            { title: 'Data Engineer', date: '2016 — 2019', co: 'Sky UK · London', bullets: ['Built ETL pipelines for viewer analytics platform processing 8TB daily across 12M subscribers', 'Created Python-based data quality framework catching 99.4% of schema violations'] },
                        ].map((e, i) => (
                            <div key={i} style={{ marginBottom: 32, ...(i > 0 ? { borderTop: `1px solid ${c.z800}`, paddingTop: 32 } : {}) }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                                    <h3 style={{ color: c.w, fontWeight: 600, fontSize: 16 }}>{e.title}</h3>
                                    <span style={{ color: c.z500, fontSize: 11, fontWeight: 500, letterSpacing: 1, whiteSpace: 'nowrap' }}>{e.date}</span>
                                </div>
                                <p style={{ color: c.z400, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: 11, marginBottom: 12 }}>{e.co}</p>
                                {e.bullets.map((b, j) => <div key={j} style={{ fontSize: 13, color: c.z500, fontWeight: 300, lineHeight: 1.6, marginBottom: 8 }}><span style={{ color: c.w, fontWeight: 700, marginRight: 8 }}>/</span>{b}</div>)}
                            </div>
                        ))}
                    </div>
                    {/* Sidebar */}
                    <div style={{ padding: '40px 40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                        <div>
                            <div style={sHead}>Tech Stack</div>
                            {[['Python / SQL', 5], ['dbt + BigQuery', 5], ['Apache Spark', 4], ['Kafka / Flink', 4], ['Terraform / GCP', 3]].map(([name, filled], i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <span style={{ color: c.z300, fontSize: 13 }}>{name as string}</span>
                                    <div style={{ display: 'flex', gap: 4 }}>{Array.from({ length: 5 }, (_, j) => <div key={j} style={{ width: 8, height: 8, borderRadius: 2, background: j < (filled as number) ? c.w : c.z700 }} />)}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: `1px solid ${c.z800}`, paddingTop: 32 }}>
                            <div style={sHead}>Education</div>
                            <p style={{ color: c.z200, fontSize: 13.5, fontWeight: 600 }}>MEng Computer Science</p>
                            <p style={{ color: c.z500, fontSize: 12, marginTop: 2 }}>Imperial College London<br />First Class Honours · 2016</p>
                        </div>
                        <div style={{ borderTop: `1px solid ${c.z800}`, paddingTop: 32 }}>
                            <div style={sHead}>Certifications</div>
                            {['GCP Professional Data Engineer', 'dbt Analytics Engineering', 'Databricks Associate DE'].map((cert, i) => (
                                <div key={i} style={{ border: `1px solid ${c.z700}`, padding: '8px 12px', fontSize: 12, color: c.z400, marginBottom: 8 }}>{cert}</div>
                            ))}
                        </div>
                        <div style={{ borderTop: `1px solid ${c.z800}`, paddingTop: 32 }}>
                            <div style={sHead}>Numbers</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {[['$3.8M', 'Saved'], ['400+', 'Pipelines'], ['8TB', 'Daily'], ['99.4%', 'Uptime']].map(([n, l], i) => (
                                    <div key={i} style={{ background: c.z800, padding: 12, textAlign: 'center' }}>
                                        <div style={{ color: c.w, fontSize: 20, fontWeight: 700 }}>{n}</div>
                                        <div style={{ color: c.z500, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 2 }}>{l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 28 — Sand Dune ═══ */
export const SandDunePreview: React.FC<PreviewProps> = () => {
    const c = { am900: '#92400e', am800: '#92400e', am700: '#b45309', am600: '#d97706', am500: '#f59e0b', am400: '#fbbf24', am200: '#fde68a', am100: '#fef3c7', am50: '#fffbeb', st800: '#292524', st600: '#57534e', st500: '#78716c', st100: '#f5f5f4', st50: '#fafaf9', w: '#fff' }
    const sHead = { color: c.am700, fontSize: 10, letterSpacing: 3.5, textTransform: 'uppercase' as const, fontWeight: 600, marginBottom: 20 }
    const datePill = { fontSize: 11, color: c.am700, background: c.am50, border: `1px solid ${c.am200}`, borderRadius: 4, padding: '2px 8px', fontWeight: 600, whiteSpace: 'nowrap' as const, flexShrink: 0 }
    return (
        <div style={{ fontFamily: "'Josefin Sans', 'DM Sans', sans-serif", background: c.st50, overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ background: 'linear-gradient(135deg, #92400e 0%, #b45309 40%, #d97706 70%, #fbbf24 100%)', padding: '48px 56px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -64, right: -64, width: 256, height: 256, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', bottom: -40, left: -40, width: 192, height: 192, borderRadius: '50%', background: 'rgba(146,64,14,0.2)' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40 }}>
                    <div>
                        <p style={{ color: c.am200, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>Architect & Urban Designer</p>
                        <h1 style={{ color: c.w, fontWeight: 700, fontSize: 46, lineHeight: 1, letterSpacing: -0.5 }}>Amara</h1>
                        <h1 style={{ color: c.am200, fontWeight: 200, fontStyle: 'italic', fontSize: 46, lineHeight: 1, fontFamily: "'Merriweather', 'EB Garamond', serif" }}>Osei</h1>
                    </div>
                    <div style={{ textAlign: 'right', color: c.am100, fontSize: 13, lineHeight: 2, fontWeight: 300 }}>
                        <p style={{ fontWeight: 600, color: c.w }}>Accra, Ghana · Remote</p>
                        <p>+233 24 123 4567</p><p>amara@osei.design</p><p>amaraosei.com</p>
                    </div>
                </div>
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
                    {['Sustainable Design', 'Urban Planning', 'BIM / Revit', 'LEED BD+C', 'Cultural Heritage'].map((t, i) => (
                        <span key={i} style={{ fontSize: 11, background: 'rgba(255,255,255,0.15)', color: c.w, border: '1px solid rgba(255,255,255,0.3)', padding: '4px 12px', borderRadius: 99 }}>{t}</span>
                    ))}
                </div>
            </header>
            <div style={{ padding: '40px 56px' }}>
                {/* Profile */}
                <div style={{ marginBottom: 32, borderLeft: `4px solid ${c.am400}`, paddingLeft: 20, paddingTop: 4, paddingBottom: 4 }}>
                    <p style={{ fontFamily: "'Merriweather', 'EB Garamond', serif", fontSize: 14, color: c.st600, lineHeight: 1.6, fontStyle: 'italic' }}>"Architecture is a social art — it shapes lives before it shapes skylines."</p>
                    <span style={{ display: 'block', marginTop: 8, fontSize: 13, color: c.st500, fontWeight: 300 }}>Architect and urban designer with 10 years creating culturally resonant spaces in West Africa, Europe, and the Middle East. RIBA-chartered with LEED BD+C accreditation.</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 32 }}>
                    {/* Experience */}
                    <div>
                        <div style={sHead}>Experience</div>
                        {[
                            { title: 'Associate Director, Architecture', date: '2022 — Present', co: 'Kéré Architecture · Berlin / Accra', bullets: ['Led design of Benin National Assembly complex (€120M) — Aga Khan Award shortlist 2024', 'Directed 22-person multidisciplinary team across architecture and engineering', 'Developed passive cooling strategy reducing energy consumption 48%', 'Secured LEED Platinum certification for 3 commercial projects in Accra'] },
                            { title: 'Senior Urban Designer', date: '2018 — 2022', co: 'UN-Habitat · Nairobi / Geneva', bullets: ['Designed urban resilience frameworks implemented in 8 African cities affecting 2.4M residents', 'Authored WHO-endorsed guidelines on heat-resilient settlement upgrading', 'Facilitated participatory design workshops with 3,000+ community members'] },
                            { title: 'Project Architect', date: '2014 — 2018', co: 'Foster + Partners · London', bullets: ['Contributed to Apple Park Campus and Bloomberg European HQ projects', 'Produced BIM models and construction documents for 400,000 m²'] },
                        ].map((e, i) => (
                            <div key={i} style={{ marginBottom: 28 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 4 }}><h3 style={{ fontWeight: 600, fontSize: 15, color: c.st800 }}>{e.title}</h3><span style={datePill}>{e.date}</span></div>
                                <p style={{ color: c.am600, fontWeight: 600, fontSize: 13, letterSpacing: 0.5, marginBottom: 10 }}>{e.co}</p>
                                {e.bullets.map((b, j) => <div key={j} style={{ display: 'flex', gap: 10, fontSize: 13, color: c.st500, lineHeight: 1.6, marginBottom: 6, fontWeight: 300 }}><span style={{ color: c.am500, marginTop: 4, flexShrink: 0, fontSize: 8 }}>◆</span>{b}</div>)}
                            </div>
                        ))}
                    </div>
                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                        <div><div style={sHead}>Education</div>
                            {[['M.Arch. Urban Design', 'The Bartlett, UCL', 'London · 2014 · Distinction'], ['B.Arch (Hons)', 'Kwame Nkrumah University', 'Ghana · 2012 · First Class']].map(([d, s, s2], i) => (
                                <div key={i} style={{ background: c.am50, borderRadius: 12, padding: 14, border: `1px solid ${c.am100}`, marginBottom: 12 }}><p style={{ color: c.st800, fontWeight: 600, fontSize: 13 }}>{d}</p><p style={{ color: c.am600, fontSize: 11.5, marginTop: 2 }}>{s}<br />{s2}</p></div>
                            ))}
                        </div>
                        <div><div style={sHead}>Credentials</div>
                            {['ARB Registered Architect (UK)', 'RIBA Chartered Architect', 'LEED BD+C Accredited', 'EDGE Auditor (IFC)'].map((cr, i) => (
                                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12.5, color: c.st500, fontWeight: 300, marginBottom: 6 }}><span style={{ color: c.am500, fontWeight: 700 }}>✓</span>{cr}</div>
                            ))}
                        </div>
                        <div><div style={sHead}>Software</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {['Revit', 'Rhino / Grasshopper', 'AutoCAD', 'V-Ray', 'Lumion', 'SketchUp', 'InDesign'].map((s, i) => (
                                    <span key={i} style={{ background: c.am100, color: c.am800, fontSize: 11.5, padding: '4px 10px', borderRadius: 4, fontWeight: 500 }}>{s}</span>
                                ))}
                            </div>
                        </div>
                        <div><div style={sHead}>Languages</div>
                            {[['English', 'Native'], ['Twi (Akan)', 'Native'], ['French', 'Professional'], ['German', 'Basic']].map(([l, lv], i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: c.st500, fontWeight: 300, marginBottom: 6 }}><span>{l}</span><span style={{ color: c.am600, fontWeight: 600, fontSize: 11 }}>{lv}</span></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 29 — Indigo Sharp ═══ */
export const IndigoSharpPreview: React.FC<PreviewProps> = () => {
    const c = { i700: '#4338ca', i600: '#4f46e5', i500: '#6366f1', i400: '#818cf8', i300: '#a5b4fc', i200: '#c7d2fe', i100: '#e0e7ff', i50: '#eef2ff', p400: '#c084fc', sl800: '#1e293b', sl700: '#334155', sl500: '#64748b', w: '#fff' }
    const datePill = { fontSize: 11, color: c.i600, background: c.i50, border: `1px solid ${c.i200}`, borderRadius: 4, padding: '2px 8px', fontWeight: 700, whiteSpace: 'nowrap' as const }
    const diamond = (size: number) => ({ width: size, height: size, background: c.i600, transform: 'rotate(45deg)', flexShrink: 0 })
    const sHead = (gap: number) => ({ display: 'flex', alignItems: 'center', gap, marginBottom: 16 })
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
                                <h1 style={{ color: c.w, fontSize: 48, fontWeight: 800, lineHeight: 1, letterSpacing: -1 }}>Priya<br /><span style={{ color: c.i200, fontWeight: 300 }}>Sharma</span></h1>
                                <p style={{ color: c.i300, fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', marginTop: 12, fontWeight: 600 }}>AI Product Manager</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px', fontSize: 12.5, color: c.i200 }}>
                                <span style={{ fontWeight: 500, color: c.w, gridColumn: 'span 2' }}>Bangalore, India</span>
                                <span>priya@sharma.ai</span><span>+91 98765 43210</span>
                                <span style={{ color: c.i300 }}>linkedin.com/in/priyasharma</span><span style={{ color: c.i300 }}>priyasharma.ai</span>
                            </div>
                        </div>
                    </header>
                    {/* Accent line */}
                    <div style={{ height: 2, background: `linear-gradient(to right, ${c.i600}, ${c.p400}, transparent)` }} />
                    <div style={{ padding: '40px 48px' }}>
                        {/* About */}
                        <div style={{ marginBottom: 36 }}>
                            <div style={sHead(12)}><div style={diamond(16)} /><h2 style={{ color: c.i700, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>About</h2></div>
                            <p style={{ color: c.sl500, fontSize: 14, lineHeight: 1.6, marginLeft: 28 }}>AI product manager with 7 years at the intersection of machine learning and consumer products. Shipped 5 AI-powered features to 50M+ users at Google and Flipkart.</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
                            {/* Experience */}
                            <div>
                                <div style={sHead(12)}><div style={diamond(16)} /><h2 style={{ color: c.i700, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>Experience</h2></div>
                                <div style={{ marginLeft: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    {[
                                        { title: 'Senior Product Manager, AI', date: '2022 — Present', co: 'Google · Bangalore / Mountain View', bullets: ['Owned Google Lens AI product for India — grew MAU from 18M to 52M in 18 months', 'Shipped multilingual visual search (Hindi, Tamil, Bengali) with 94% precision recall', 'Defined model evaluation framework adopted across 3 Google India product teams', 'Led responsible AI review for 4 launched features; zero bias escalations post-launch'] },
                                        { title: 'Product Manager, Recommendations', date: '2019 — 2022', co: 'Flipkart · Bangalore', bullets: ['Led ML-powered homepage personalization for 400M+ users, lifting GMV by 12%', 'Built A/B testing platform for ML models enabling 200+ experiment iterations per quarter', 'Shipped real-time recommendation engine replacing batch processing, reducing latency 80%'] },
                                        { title: 'Associate Product Manager', date: '2017 — 2019', co: 'Ola · Bangalore', bullets: ['Built ETA prediction model improving driver dispatch accuracy from 71% to 89%', 'Launched surge pricing model increasing driver earnings 18% while maintaining rider NPS'] },
                                    ].map((e, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}><h3 style={{ color: c.sl800, fontWeight: 800, fontSize: 15 }}>{e.title}</h3><span style={datePill}>{e.date}</span></div>
                                            <p style={{ color: c.i600, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{e.co}</p>
                                            {e.bullets.map((b, j) => <div key={j} style={{ display: 'flex', gap: 8, fontSize: 13, color: c.sl500, lineHeight: 1.6, marginBottom: 6 }}><span style={{ color: c.i400, fontWeight: 900, flexShrink: 0 }}>›</span>{b}</div>)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Sidebar */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                                <div>
                                    <div style={sHead(12)}><div style={diamond(12)} /><h2 style={{ color: c.i700, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>Education</h2></div>
                                    {[['M.Tech. Computer Science', 'IIT Delhi · 2017', 'Specialization: ML & AI'], ['B.Tech. Information Technology', 'BITS Pilani · 2015', '']].map(([d, s, sub], i) => (
                                        <div key={i} style={{ borderLeft: `2px solid ${c.i300}`, paddingLeft: 12, marginBottom: 12 }}>
                                            <p style={{ color: c.sl700, fontWeight: 700, fontSize: 13 }}>{d}</p>
                                            <p style={{ color: c.i600, fontSize: 11.5, marginTop: 2, fontWeight: 600 }}>{s}</p>
                                            {sub && <p style={{ color: c.sl500, fontSize: 11, marginTop: 2 }}>{sub}</p>}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div style={sHead(12)}><div style={diamond(12)} /><h2 style={{ color: c.i700, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>Skills</h2></div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {['ML Product Design', 'A/B Testing', 'SQL', 'Python', 'OKRs', 'Responsible AI', 'Figma', 'Amplitude'].map((s, i) => (
                                            <span key={i} style={{ fontSize: 11.5, color: c.i700, background: c.i100, borderRadius: 4, padding: '4px 10px', fontWeight: 600 }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div style={sHead(12)}><div style={diamond(12)} /><h2 style={{ color: c.i700, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>Impact</h2></div>
                                    {[['Users Impacted', '50M+'], ['GMV Lift', '+12%'], ['MAU Growth', '3×']].map(([l, v], i) => (
                                        <div key={i} style={{ padding: 12, background: c.i50, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                            <span style={{ fontSize: 12, color: c.sl500 }}>{l}</span><span style={{ color: c.i700, fontWeight: 800, fontSize: 15 }}>{v}</span>
                                        </div>
                                    ))}
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
export const PlatinumElitePreview: React.FC<PreviewProps> = () => {
    const c = { sl900: '#0f172a', sl800: '#1e293b', sl700: '#334155', sl600: '#475569', sl500: '#64748b', sl400: '#94a3b8', sl300: '#cbd5e1', sl200: '#e2e8f0', sl100: '#f1f5f9', sl50: '#f8fafc', w: '#fff' }
    const sHead = { fontSize: 10, letterSpacing: 4, textTransform: 'uppercase' as const, fontWeight: 600, color: c.sl400, marginBottom: 16 }
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
                            <span style={{ fontSize: 24, fontWeight: 700, color: c.sl300, fontFamily: "'EB Garamond', 'Georgia', serif" }}>AW</span>
                        </div>
                        <h1 style={{ color: c.w, fontSize: 36, lineHeight: 1.1, marginBottom: 4, fontFamily: "'EB Garamond', 'Georgia', serif" }}>Alexander</h1>
                        <h1 style={{ color: c.sl400, fontSize: 36, fontWeight: 300, fontStyle: 'italic', lineHeight: 1.1, marginBottom: 16, fontFamily: "'EB Garamond', 'Georgia', serif" }}>Whitmore</h1>
                        <p style={{ color: c.sl500, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 500 }}>Chief Executive Officer</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 40 }}>
                        {[['Location', 'London, United Kingdom'], ['Contact', '+44 7700 900123\nalex@whitmore.co\nwhitmorecapital.co'], ['LinkedIn', 'in/awhitmore-ceo']].map(([label, val], i) => (
                            <div key={i}><p style={{ color: c.sl500, fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>{label}</p><p style={{ color: i === 0 ? c.sl300 : c.sl400, fontSize: 12.5, fontWeight: 300, lineHeight: 2, whiteSpace: 'pre-line' }}>{val}</p></div>
                        ))}
                    </div>
                </div>
                {/* Right panel */}
                <div style={{ background: c.sl50, padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: c.sl400, fontSize: 10, letterSpacing: 3.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>Board-Level Summary</p>
                        <p style={{ color: c.sl600, fontSize: 14.5, lineHeight: 1.6, fontFamily: "'EB Garamond', 'Georgia', serif", fontStyle: 'italic' }}>"Twenty years building, scaling, and transforming technology enterprises across three continents. A track record of creating $6B+ in shareholder value through disciplined capital allocation and inspired leadership."</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32, paddingTop: 24, borderTop: `1px solid ${c.sl200}` }}>
                        {[['$6B+', 'Value Created'], ['22K+', 'Employees Led'], ['3', 'Exits (2 IPO)']].map(([v, l], i) => (
                            <div key={i}><div style={{ fontSize: 28, fontWeight: 700, color: c.sl800 }}>{v}</div><div style={{ color: c.sl400, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 2 }}>{l}</div></div>
                        ))}
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
                    {[
                        { title: 'Chief Executive Officer', date: '2020 — Present', co: 'Mosaic Technologies Group · London (FTSE 250)', bullets: ['Led $1.2B transformation program returning company to 18% EBITDA margin within 24 months', 'Executed 3 strategic acquisitions totaling $680M; integrated 4,200 employees across 7 countries', 'Increased TSR 340% over 4-year tenure; awarded Top 100 FTSE CEO 2023', 'Established ESG governance framework achieving net-zero 5 years ahead of plan'] },
                        { title: 'President & COO', date: '2016 — 2020', co: 'Vertex Cloud Solutions · New York (NYSE)', bullets: ['Scaled company from $300M to $1.8B revenue over 4 years', 'Led IPO process raising $450M; oversaw post-IPO investor relations', 'Built executive leadership team of 14 C-suite executives across 9 global offices'] },
                        { title: 'Managing Director, EMEA', date: '2011 — 2016', co: 'Oracle Corporation · London', bullets: ['Ran $2.4B EMEA enterprise business across 28 countries with 6,200-person team', 'Grew cloud ARR from $120M to $820M — highest growth region globally for 3 years'] },
                        { title: 'VP Sales → SVP Strategy', date: '2005 — 2011', co: 'McKinsey & Company · London / New York', bullets: ['Senior Partner leading Technology & Media practice in EMEA', 'Advised 20+ FTSE 100 and Fortune 500 boards on growth strategy'] },
                    ].map((e, i) => (
                        <div key={i} style={{ marginBottom: 28, ...(i > 0 ? { paddingTop: 20, borderTop: `1px solid ${c.sl100}` } : {}) }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                                <h3 style={{ fontWeight: 600, fontSize: 16, color: c.sl800 }}>{e.title}</h3>
                                <span style={{ color: c.sl400, fontSize: 11, fontWeight: 500, letterSpacing: 1, whiteSpace: 'nowrap' }}>{e.date}</span>
                            </div>
                            <p style={{ color: c.sl500, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>{e.co}</p>
                            {e.bullets.map((b, j) => <div key={j} style={{ borderLeft: `1px solid ${c.sl200}`, paddingLeft: 12, fontSize: 13, color: c.sl500, fontWeight: 300, lineHeight: 1.6, marginBottom: 6 }}>{b}</div>)}
                        </div>
                    ))}
                </div>
                {/* Sidebar */}
                <div style={{ padding: '40px 40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <div>
                        <div style={sHead}>Education</div>
                        {[['MBA', 'INSEAD, Fontainebleau', "Dean's List · 2005"], ['B.A. (Hons) PPE, First Class', 'University of Oxford', 'Balliol College · 2003']].map(([d, s, s2], i) => (
                            <div key={i} style={{ marginBottom: 16 }}><p style={{ color: c.sl700, fontWeight: 600, fontSize: 13.5 }}>{d}</p><p style={{ color: c.sl500, fontSize: 12, fontWeight: 300, marginTop: 2 }}>{s}<br />{s2}</p></div>
                        ))}
                    </div>
                    <div style={{ borderTop: `1px solid ${c.sl100}`, paddingTop: 32 }}>
                        <div style={sHead}>Board Positions</div>
                        {[['Non-Executive Director', 'Barclays PLC · 2021 — Present'], ['Audit Committee Chair', 'TechUK Industry Council · 2022 —'], ['Trustee', 'Royal Academy of Engineering']].map(([t, s], i) => (
                            <div key={i} style={{ marginBottom: 10 }}><p style={{ color: c.sl700, fontWeight: 600, fontSize: 13 }}>{t}</p><p style={{ color: c.sl500, fontSize: 11.5, fontWeight: 300 }}>{s}</p></div>
                        ))}
                    </div>
                    <div style={{ borderTop: `1px solid ${c.sl100}`, paddingTop: 32 }}>
                        <div style={sHead}>Recognition</div>
                        {['Top 100 FTSE CEOs · Management Today 2023', 'UK Technology Business Leader · Tech Nation 2022', 'Wharton Global 40 Under 40 · 2018', "CBE — Queen's Birthday Honours 2024"].map((r, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12.5, color: c.sl500, fontWeight: 300, marginBottom: 10 }}><span style={{ color: c.sl300, flexShrink: 0 }}>—</span>{r}</div>
                        ))}
                    </div>
                    <div style={{ borderTop: `1px solid ${c.sl100}`, paddingTop: 32 }}>
                        <div style={sHead}>Languages</div>
                        {[['English', 'Native'], ['French', 'Fluent'], ['German', 'Professional']].map(([l, lv], i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: c.sl500, fontWeight: 300, marginBottom: 6 }}><span>{l}</span><span style={{ color: c.sl400, fontSize: 11 }}>{lv}</span></div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Bottom */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #94a3b8, transparent)' }} />
            <div style={{ padding: '12px 40px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: c.sl400, fontWeight: 300, background: c.sl50 }}>
                <span>References available on request</span><span>Confidential — not for distribution</span>
            </div>
        </div>
    )
}

/* ═══ Resume 11 — Cascade Blue ═══ */
export const CascadeBluePreview: React.FC<PreviewProps> = () => {
    const c = { navy: '#0f2a4a', blue: '#1a6fb5', skyBlue: '#7fc4f7', ltBlue: '#e8f2fb', txtDark: '#1e2d3d', txtMid: '#4a6070', txtSide: '#c0d4e4', txtDate: '#6b8299', w: '#fff' }
    const sideHead = { fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: c.skyBlue, fontWeight: 600, marginBottom: 14 }
    const mainHead = { fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: c.blue, fontWeight: 700, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${c.ltBlue}` }
    const datePill = { fontSize: 11.5, color: c.txtDate, background: c.ltBlue, padding: '2px 8px', borderRadius: 2, fontWeight: 500, whiteSpace: 'nowrap' as const }
    const bullet = { display: 'flex', gap: 10, fontSize: 13, color: c.txtMid, lineHeight: 1.7, fontWeight: 300, marginBottom: 4 }
    const dot = { width: 5, height: 5, borderRadius: '50%', background: c.blue, opacity: 0.6, marginTop: 8, flexShrink: 0 }
    return (
        <div style={{ fontFamily: "'Inter', 'DM Sans', sans-serif", display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 1100, overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{ background: c.navy, color: c.txtSide, padding: '44px 28px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                    <div style={{ fontSize: 28, color: c.w, lineHeight: 1.2, letterSpacing: -0.5, fontFamily: "'DM Serif Display', 'EB Garamond', serif" }}>Daniel<br /><em style={{ color: c.skyBlue }}>Park</em></div>
                    <div style={{ fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase', color: c.skyBlue, fontWeight: 500, marginTop: 8 }}>Full-Stack Engineer</div>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <div>
                    <div style={sideHead}>Contact</div>
                    {['daniel.park@email.com', '(415) 228-9401', 'San Francisco, CA', 'github.com/dpark-dev'].map((item, i) => (
                        <div key={i} style={{ fontSize: 12.5, color: c.txtSide, marginBottom: 8, lineHeight: 1.4 }}>{item}</div>
                    ))}
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <div>
                    <div style={sideHead}>Skills</div>
                    {[['React / Next.js', 92], ['Node.js / Express', 88], ['TypeScript', 90], ['PostgreSQL', 80], ['AWS / Docker', 75], ['GraphQL', 78]].map(([name, pct], i) => (
                        <div key={i} style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 12.5, color: c.txtSide, marginBottom: 4, fontWeight: 500 }}>{name as string}</div>
                            <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, borderRadius: 2, background: `linear-gradient(90deg, ${c.skyBlue}, ${c.blue})` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <div>
                    <div style={sideHead}>Education</div>
                    <h4 style={{ fontSize: 13, color: c.w, fontWeight: 600, lineHeight: 1.4 }}>B.S. Computer Science</h4>
                    <p style={{ fontSize: 12, color: c.skyBlue, marginTop: 2 }}>UC San Diego<br />2019</p>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <div>
                    <div style={sideHead}>Languages</div>
                    {[['English', 'Native'], ['Korean', 'Fluent'], ['Japanese', 'Conversational']].map(([l, lv], i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: c.txtSide, marginBottom: 6 }}><span>{l}</span><span style={{ color: c.skyBlue, fontSize: 11, fontWeight: 500 }}>{lv}</span></div>
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
                    <p style={{ fontSize: 14, color: '#3d5166', lineHeight: 1.8 }}>Full-stack engineer with 6+ years building high-performance web applications and APIs. Passionate about developer experience, clean architecture, and shipping products that scale. Contributor to open-source tooling and mentor for junior engineers.</p>
                </div>
                {/* Experience */}
                <div style={{ marginBottom: 32 }}>
                    <div style={mainHead}>Work Experience</div>
                    {[
                        { title: 'Senior Software Engineer', date: '2022 — Present', co: 'Vercel · San Francisco, CA', bullets: ['Led frontend platform team delivering Next.js edge-rendering infrastructure used by 500K+ developers', 'Reduced cold-start times by 62% through worker-thread pooling and lazy module loading', 'Designed and shipped analytics dashboard serving real-time traffic data at 50K req/s', 'Mentored 3 junior engineers and established team coding standards'] },
                        { title: 'Software Engineer', date: '2020 — 2022', co: 'Linear · Remote', bullets: ['Built real-time collaborative features using CRDTs and WebSocket synchronization', 'Optimized Postgres query patterns reducing dashboard load time from 4.2s to 340ms', 'Shipped keyboard-first command palette adopted as core product feature'] },
                        { title: 'Junior Developer', date: '2019 — 2020', co: 'Stripe · San Francisco, CA', bullets: ['Implemented payment flow UI components used in 2,000+ merchant integrations', 'Wrote integration tests raising coverage from 58% to 89%'] },
                    ].map((e, i) => (
                        <div key={i} style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                                <div style={{ fontSize: 15, fontWeight: 600, color: c.txtDark, fontFamily: "'DM Serif Display', 'EB Garamond', serif" }}>{e.title}</div>
                                <div style={datePill}>{e.date}</div>
                            </div>
                            <div style={{ fontSize: 13, color: c.blue, fontWeight: 600, marginBottom: 8 }}>{e.co}</div>
                            {e.bullets.map((b, j) => <div key={j} style={bullet}><div style={dot} />{b}</div>)}
                        </div>
                    ))}
                </div>
                {/* Projects */}
                <div>
                    <div style={mainHead}>Featured Projects</div>
                    {[
                        { name: 'OpenSync — Real-time Collaboration SDK', desc: 'Open-source TypeScript SDK for building collaborative apps with conflict-free data sync. 2.4K GitHub stars.', tech: 'TypeScript · WebSockets · CRDT · 2.4K ★' },
                        { name: 'EdgeConfig — Feature Flag Platform', desc: 'Distributed feature flag system with sub-millisecond evaluation via edge workers. Deployed at 3 companies.', tech: 'Cloudflare Workers · Redis · React Dashboard' },
                    ].map((p, i) => (
                        <div key={i} style={{ background: c.ltBlue, borderRadius: 6, padding: 14, marginBottom: 12, borderLeft: `3px solid ${c.blue}` }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: c.navy, marginBottom: 4 }}>{p.name}</div>
                            <div style={{ fontSize: 12.5, color: c.txtMid, lineHeight: 1.6 }}>{p.desc}</div>
                            <div style={{ fontSize: 11, color: c.blue, fontWeight: 500, marginTop: 6, letterSpacing: 0.5 }}>{p.tech}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 12 — Nordic Minimal ═══ */
export const NordicMinimalPreview: React.FC<PreviewProps> = () => {
    const c = { grn: '#2d6a4f', dark: '#1c1c1c', mid: '#555', lt: '#888', border: '#e0e0e0', bg: '#fafafa', w: '#fff' }
    const sHead = { fontSize: 10, fontWeight: 600, letterSpacing: 3.5, textTransform: 'uppercase' as const, color: c.grn, marginBottom: 20 }
    return (
        <div style={{ fontFamily: "'Jost', 'DM Sans', sans-serif", background: c.bg, padding: '72px 80px', overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ marginBottom: 56 }}>
                <div style={{ fontSize: 42, color: c.dark, lineHeight: 1.1, letterSpacing: -0.5, fontFamily: "'Libre Baskerville', 'EB Garamond', serif" }}>
                    Astrid <em style={{ color: c.grn }}>Lindqvist</em>
                </div>
                <div style={{ fontSize: 13, fontWeight: 300, letterSpacing: 4, textTransform: 'uppercase', color: c.lt, marginTop: 12 }}>UX Research Lead</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24, paddingTop: 24, borderTop: `1px solid ${c.border}` }}>
                    <div style={{ display: 'flex', gap: 28, fontSize: 12.5, color: c.lt }}>
                        <span>astrid.l@design.io</span><span>+46 70 123 4567</span><span>Stockholm, Sweden</span><span style={{ color: c.grn }}>linkedin.com/in/astridl</span>
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
                        <p style={{ fontSize: 14.5, color: c.mid, lineHeight: 1.85, fontWeight: 300 }}>Human-centered researcher with 8 years translating complex user behavior into design principles that move product metrics. I specialize in mixed-method research, strategic synthesis, and building research practices from the ground up at scaling companies.</p>
                    </div>
                    <div>
                        <div style={sHead}>Experience</div>
                        {[
                            { title: 'Principal UX Researcher', date: '2022 — Present', co: 'Spotify — Stockholm', desc: 'Led discovery research for the Creator Studio product, influencing the roadmap for 8M+ podcasters. Established a continuous research program conducting 400+ interviews per year. Reduced time-to-insight by 55% through a centralized research repository and insight tagging system.' },
                            { title: 'Senior UX Researcher', date: '2019 — 2022', co: 'Klarna — Stockholm', desc: "Owned research for the checkout and post-purchase experience across 15 markets. Identified friction patterns reducing cart abandonment by 18%. Co-created the design principles for Klarna's 2021 brand redesign based on 12-country attitudinal study." },
                            { title: 'UX Researcher', date: '2016 — 2019', co: 'IDEO — San Francisco', desc: 'Conducted fieldwork and co-design workshops for healthcare, fintech, and public sector clients. Delivered 22 research reports directly influencing $400M+ in product investment decisions.' },
                        ].map((e, i, arr) => (
                            <div key={i} style={{ paddingBottom: i < arr.length - 1 ? 28 : 0, marginBottom: i < arr.length - 1 ? 28 : 0, borderBottom: i < arr.length - 1 ? `1px solid ${c.border}` : 'none' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                                    <div style={{ fontSize: 16, color: c.dark, fontFamily: "'Libre Baskerville', 'EB Garamond', serif" }}>{e.title}</div>
                                    <div style={{ fontSize: 12, color: c.lt, fontWeight: 300, letterSpacing: 1 }}>{e.date}</div>
                                </div>
                                <div style={{ fontSize: 13, color: c.grn, fontWeight: 500, marginBottom: 10 }}>{e.co}</div>
                                <p style={{ fontSize: 13.5, color: c.mid, lineHeight: 1.75, fontWeight: 300 }}>{e.desc}</p>
                            </div>
                        ))}
                    </div>
                </main>
                {/* Sidebar */}
                <aside>
                    <div style={{ marginBottom: 36 }}>
                        <div style={sHead}>Education</div>
                        {[['M.Sc. Cognitive Science', 'Stockholm University', '2016'], ['B.A. Psychology', 'Uppsala University', '2014']].map(([d, s, y], i) => (
                            <div key={i} style={{ marginBottom: 16 }}>
                                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: c.dark, marginBottom: 2 }}>{d}</span>
                                <span style={{ fontSize: 13, color: c.mid, fontWeight: 300, lineHeight: 1.6 }}>{s}<br />{y}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginBottom: 36 }}>
                        <div style={sHead}>Methods</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {['Interviews', 'Diary Studies', 'Surveys', 'Tree Testing', 'A/B Testing', 'Field Research', 'Card Sorting', 'Eye Tracking'].map((m, i) => (
                                <span key={i} style={{ fontSize: 11.5, color: c.mid, border: `1px solid ${c.border}`, padding: '2px 8px', borderRadius: 2 }}>{m}</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ marginBottom: 36 }}>
                        <div style={sHead}>Tools</div>
                        {['Figma, Maze', 'Dovetail, Notion', 'SPSS, R Studio', 'UserZoom, Optimal'].map((t, i) => (
                            <div key={i} style={{ fontSize: 13, color: c.mid, fontWeight: 300, lineHeight: 1.6, marginBottom: 6 }}>{t}</div>
                        ))}
                    </div>
                    <div>
                        <div style={sHead}>Languages</div>
                        {[['Swedish', 'Native'], ['English', 'Fluent'], ['German', 'Working']].map(([l, lv], i) => (
                            <div key={i} style={{ marginBottom: 6 }}>
                                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: c.dark }}>{l}</span>
                                <span style={{ fontSize: 13, color: c.mid, fontWeight: 300 }}>{lv}</span>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    )
}

/* ═══ Resume 13 — Midnight Pro ═══ */
export const MidnightProPreview: React.FC<PreviewProps> = () => {
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
                        Victoria <span style={{ color: c.gold, fontStyle: 'italic', fontWeight: 400 }}>Okafor</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: 4, textTransform: 'uppercase', color: c.slate, marginTop: 12 }}>Investment Banking Associate</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12.5, color: c.slate, lineHeight: 2 }}>
                    New York, NY<br />(212) 556-0234<br /><span style={{ color: c.gold }}>v.okafor@finance.com</span><br /><span style={{ color: c.gold }}>linkedin.com/in/vokafor</span>
                </div>
            </header>
            {/* Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px' }}>
                {/* Main */}
                <div style={{ padding: '44px 56px', borderRight: `1px solid ${c.border}` }}>
                    <div style={{ marginBottom: 40 }}>
                        <div style={sHead}>Profile<span style={{ flex: 1, height: 1, background: c.border }} /></div>
                        <p style={{ fontSize: 14, color: '#b0b8cc', lineHeight: 1.85, fontWeight: 300 }}>Finance professional with 7 years in M&A advisory and capital markets. Expertise in complex financial modeling, cross-border deal execution, and client management across technology and healthcare sectors. Closed $4.2B in transaction value over career.</p>
                    </div>
                    <div>
                        <div style={sHead}>Experience<span style={{ flex: 1, height: 1, background: c.border }} /></div>
                        {[
                            { title: 'Associate, M&A Advisory', date: '2021 — Present', co: 'Goldman Sachs · New York', bullets: ['Executed 8 M&A transactions totaling $2.1B in deal value across SaaS and healthcare verticals', 'Built LBO and DCF models for 14 buy-side and sell-side mandates', 'Led due diligence workstreams coordinating 40+ advisor teams across 3 jurisdictions', 'Ranked top 10%; promoted to Associate 12 months ahead of cycle'] },
                            { title: 'Analyst, Technology Investment Banking', date: '2019 — 2021', co: 'JPMorgan Chase · New York', bullets: ['Supported 6 tech sector transactions including 3 IPOs raising $800M+', 'Developed 3-statement models and management presentations for C-suite roadshows', 'Maintained deal pipeline tracking $6B+ in live mandates'] },
                            { title: 'Summer Analyst', date: 'Summer 2018', co: 'Morgan Stanley · New York', bullets: ['Prepared pitch books and industry analyses for 4 live healthcare M&A mandates', 'Received return offer with top performance rating in summer class'] },
                        ].map((e, i) => (
                            <div key={i} style={{ marginBottom: 28 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <div style={{ fontSize: 18, fontWeight: 600, color: c.cream, fontFamily: "'Cormorant Garamond', 'EB Garamond', serif" }}>{e.title}</div>
                                    <div style={datePill}>{e.date}</div>
                                </div>
                                <div style={{ fontSize: 12.5, color: c.gold, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{e.co}</div>
                                {e.bullets.map((b, j) => <div key={j} style={{ display: 'flex', gap: 10, fontSize: 13, color: c.slate, lineHeight: 1.6, marginBottom: 5 }}><span style={{ color: c.gold, fontSize: 7, marginTop: 6, flexShrink: 0 }}>◆</span>{b}</div>)}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Sidebar */}
                <div style={{ background: c.bg2, padding: '44px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3.5, textTransform: 'uppercase', color: c.gold, marginBottom: 20 }}>Education</div>
                        <h4 style={{ fontSize: 15, fontWeight: 600, color: c.cream, fontFamily: "'Cormorant Garamond', 'EB Garamond', serif" }}>B.S. Economics, Finance</h4>
                        <p style={{ fontSize: 12, color: c.slate, marginTop: 2, lineHeight: 1.4 }}>The Wharton School<br />University of Pennsylvania<br />GPA: 3.92 · 2019</p>
                    </div>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3.5, textTransform: 'uppercase', color: c.gold, marginBottom: 20 }}>Skills</div>
                        {['Financial Modeling (LBO, DCF)', 'M&A Transaction Advisory', 'Capital Markets', 'Valuation Analysis', 'Excel / VBA Automation', 'Bloomberg Terminal', 'FactSet / Capital IQ', 'PowerPoint / Pitch Decks'].map((s, i) => (
                            <div key={i} style={{ fontSize: 12.5, color: c.slate, marginBottom: 3, paddingLeft: 12, position: 'relative' }}><span style={{ position: 'absolute', left: 0, top: 9, width: 4, height: 1, background: c.gold }} />{s}</div>
                        ))}
                    </div>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3.5, textTransform: 'uppercase', color: c.gold, marginBottom: 20 }}>Certifications</div>
                        {['Series 79 — Investment Banking', 'Series 63 — Securities Agent', 'CFA Level II Candidate'].map((cert, i) => (
                            <div key={i} style={{ fontSize: 12.5, color: c.slate, fontWeight: 300, border: `1px solid ${c.border}`, borderRadius: 2, padding: '8px 10px', marginBottom: 8 }}>{cert}</div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', color: c.gold, fontSize: 16, letterSpacing: 8, opacity: 0.4, marginTop: 8 }}>◆ · ◆ · ◆</div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 14 — Blueprint ═══ */
export const BlueprintPreview: React.FC<PreviewProps> = () => {
    const c = { bg: '#0a1628', bg2: '#0e1e36', blue: '#4a9eff', cyan: '#7ec8f0', slate: '#6a90b8', ltSlate: '#c8daf0', white: '#e8f2ff', gridLine: 'rgba(66,140,220,0.25)' }
    const mono = "'Share Tech Mono', 'Courier New', monospace"
    const sHead = { fontFamily: mono, fontSize: 11, color: c.blue, letterSpacing: 2, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }
    return (
        <div style={{ fontFamily: "'Space Grotesk', 'DM Sans', sans-serif", background: c.bg, overflow: 'hidden', position: 'relative' }}>
            {/* Grid overlay */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${c.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${c.gridLine} 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.5, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <header style={{ padding: '48px 56px', background: c.bg2, borderBottom: `1px solid ${c.gridLine}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ fontFamily: mono, fontSize: 10, color: c.slate, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>DOC_TYPE: RESUME // REV: 2025.01 // STATUS: ACTIVE</div>
                            <div style={{ fontSize: 42, fontWeight: 700, color: c.white, letterSpacing: -1, lineHeight: 1.1 }}>Omar <span style={{ color: c.blue, fontWeight: 300 }}>Hassan</span></div>
                            <div style={{ fontFamily: mono, fontSize: 13, color: c.cyan, marginTop: 10, letterSpacing: 2 }}>// SYSTEMS_ARCHITECT</div>
                        </div>
                        <div style={{ fontFamily: mono, fontSize: 11, color: c.slate, lineHeight: 2, background: 'rgba(10,22,40,0.8)', border: `1px solid ${c.gridLine}`, padding: 16, minWidth: 220 }}>
                            LOCATION: <span style={{ color: c.cyan }}>Austin, TX</span><br />
                            EMAIL: <span style={{ color: c.cyan }}>omar@hassan.dev</span><br />
                            PHONE: <span style={{ color: c.cyan }}>(512) 349-0087</span><br />
                            WEB: <span style={{ color: c.cyan }}>omarhassan.dev</span>
                        </div>
                    </div>
                </header>
                {/* Body */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px' }}>
                    {/* Main */}
                    <div style={{ padding: '40px 56px', borderRight: `1px solid ${c.gridLine}` }}>
                        <div style={{ marginBottom: 40 }}>
                            <div style={sHead}><span style={{ fontFamily: mono, color: c.slate }}>{'// '}</span>PROFILE<span style={{ flex: 1, height: 1, background: c.gridLine }} /></div>
                            <p style={{ fontSize: 13.5, color: c.slate, lineHeight: 1.85, borderLeft: `2px solid ${c.blue}`, paddingLeft: 16 }}>Infrastructure and platform engineer with 9 years designing large-scale distributed systems. Specializing in cloud-native architecture, Kubernetes orchestration, and zero-downtime deployments at companies processing billions of events daily.</p>
                        </div>
                        <div>
                            <div style={sHead}><span style={{ fontFamily: mono, color: c.slate }}>{'// '}</span>EXPERIENCE<span style={{ flex: 1, height: 1, background: c.gridLine }} /></div>
                            {[
                                { title: 'Principal Platform Engineer', date: '2022 — PRESENT', co: '// CLOUDFLARE · AUSTIN, TX', bullets: ['Designed global edge-compute platform running 35M+ requests/sec across 285 cities', 'Led Kubernetes migration reducing infrastructure costs by $4.2M/yr', 'Built zero-downtime deploy pipeline enabling 200+ deployments per day', 'Authored Terraform modules adopted by 40+ internal engineering teams'] },
                                { title: 'Senior Site Reliability Engineer', date: '2019 — 2022', co: '// DATADOG · NEW YORK, NY', bullets: ['Maintained 99.995% availability for metrics ingestion processing 4TB/day', 'Designed on-call runbook system reducing MTTR from 45 to 8 minutes', 'Implemented chaos engineering program exposing 23 latent failure modes'] },
                                { title: 'DevOps Engineer', date: '2016 — 2019', co: '// HASHICORP · SAN FRANCISCO, CA', bullets: ['Contributed 140+ commits to Terraform core and AWS provider', 'Maintained CI/CD infrastructure for 80-engineer organization'] },
                            ].map((e, i) => (
                                <div key={i} style={{ marginBottom: 28 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                                        <div style={{ fontSize: 15, fontWeight: 600, color: c.white }}>{e.title}</div>
                                        <div style={{ fontFamily: mono, fontSize: 10.5, color: c.slate, letterSpacing: 1 }}>{e.date}</div>
                                    </div>
                                    <div style={{ fontFamily: mono, fontSize: 11, color: c.cyan, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{e.co}</div>
                                    {e.bullets.map((b, j) => <div key={j} style={{ fontSize: 13, color: c.slate, lineHeight: 1.6, marginBottom: 4, paddingLeft: 20, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: c.blue, fontSize: 11 }}>→</span>{b}</div>)}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div style={{ background: c.bg2, padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                        <div>
                            <div style={{ fontFamily: mono, fontSize: 10, color: c.blue, letterSpacing: 2, marginBottom: 16 }}>TECH_STACK</div>
                            {[['Kubernetes', 95], ['Terraform', 92], ['Go', 88], ['AWS / GCP', 90], ['Prometheus', 85], ['Rust', 72]].map(([name, pct], i) => (
                                <div key={i} style={{ marginBottom: 14 }}>
                                    <div style={{ fontFamily: mono, fontSize: 11.5, color: c.ltSlate, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>{name as string}<span style={{ color: c.blue, fontSize: 10 }}>{pct}%</span></div>
                                    <div style={{ height: 2, background: 'rgba(74,158,255,0.15)' }}><div style={{ height: '100%', background: c.blue, width: `${pct}%` }} /></div>
                                </div>
                            ))}
                        </div>
                        <div style={{ paddingTop: 32, borderTop: `1px solid ${c.gridLine}` }}>
                            <div style={{ fontFamily: mono, fontSize: 10, color: c.blue, letterSpacing: 2, marginBottom: 16 }}>EDUCATION</div>
                            <h4 style={{ fontSize: 13, color: c.white, fontWeight: 600 }}>B.S. Computer Engineering</h4>
                            <p style={{ fontFamily: mono, fontSize: 11, color: c.slate, marginTop: 4, lineHeight: 1.6 }}>UT Austin<br />2016</p>
                        </div>
                        <div style={{ paddingTop: 32, borderTop: `1px solid ${c.gridLine}` }}>
                            <div style={{ fontFamily: mono, fontSize: 10, color: c.blue, letterSpacing: 2, marginBottom: 16 }}>CERTS</div>
                            {['AWS Solutions Architect Pro', 'CKA / CKAD', 'HashiCorp Terraform Associate', 'GCP Professional DE'].map((cert, i, arr) => (
                                <div key={i} style={{ fontFamily: mono, fontSize: 10.5, color: c.slate, padding: '6px 0', lineHeight: 1.4, borderBottom: i < arr.length - 1 ? `1px solid ${c.gridLine}` : 'none' }}>{cert}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 15 — Emerald Fresh ═══ */
export const EmeraldFreshPreview: React.FC<PreviewProps> = () => {
    const c = { grn: '#1a7a4a', grn2: '#2d9e65', ltGrn: '#d4f0e2', bgGrn: '#f0faf5', brdr: '#c8e8d6', dark: '#1a2b23', txt: '#3a5a47', txtPro: '#4a6e5a', txtDt: '#7aa88c', w: '#fff' }
    const sHead = { fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: c.grn, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }
    const datePill = { fontSize: 11.5, color: c.txtDt, background: c.ltGrn, padding: '2px 8px', borderRadius: 2, fontWeight: 500, whiteSpace: 'nowrap' as const }
    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif", background: c.w, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: c.grn, padding: '44px 56px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: -40, right: 100, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 40 }}>
                    <div>
                        <div style={{ fontSize: 44, fontWeight: 700, color: c.w, letterSpacing: -1, lineHeight: 1.1 }}>Mei <em style={{ fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>Chen</em></div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 10 }}>Environmental Consultant</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        {['mei.chen@eco.com', '(617) 334-9821', 'Boston, MA', 'meiichen.com'].map((item, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)', fontSize: 12, padding: '4px 12px', borderRadius: 99, whiteSpace: 'nowrap' }}>{item}</div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 230px' }}>
                {/* Main */}
                <div style={{ padding: '40px 48px', borderRight: `1px solid ${c.brdr}` }}>
                    <div style={{ marginBottom: 36 }}>
                        <div style={sHead}>Profile<span style={{ flex: 1, height: 2, background: c.ltGrn, borderRadius: 1 }} /></div>
                        <p style={{ fontSize: 14, color: c.txtPro, lineHeight: 1.85 }}>Environmental scientist and sustainability consultant with 8 years advising Fortune 500 companies on ESG strategy, carbon accounting, and regulatory compliance. Led projects resulting in verified emissions reductions of 240,000 tCO₂e across 12 corporate clients.</p>
                    </div>
                    <div>
                        <div style={sHead}>Experience<span style={{ flex: 1, height: 2, background: c.ltGrn, borderRadius: 1 }} /></div>
                        {[
                            { title: 'Senior Sustainability Consultant', date: '2021 — Present', co: 'ERM Group · Boston, MA', bullets: ['Led net-zero transition roadmaps for 6 manufacturing clients covering 180 facilities globally', 'Managed Scope 1, 2 & 3 emissions inventories for clients with $20B+ annual revenues', "Developed SBTi-aligned target-setting frameworks adopted across firm's North America practice", 'Generated $2.4M in new business from client referrals over 3-year period'] },
                            { title: 'Environmental Analyst', date: '2018 — 2021', co: 'WSP Global · Chicago, IL', bullets: ['Performed LEED certification assessments for 28 commercial and residential projects', 'Conducted lifecycle assessments using SimaPro for CPG clients reducing packaging impact 34%', 'Authored ESG disclosure reports aligned with GRI, SASB, and TCFD frameworks'] },
                            { title: 'Research Associate', date: '2016 — 2018', co: 'MIT Climate Initiative · Cambridge, MA', bullets: ['Published 2 peer-reviewed papers on urban heat island mitigation strategies', 'Collaborated with Boston city government on climate resilience planning'] },
                        ].map((e, i) => (
                            <div key={i} style={{ marginBottom: 28 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <div style={{ fontSize: 15, fontWeight: 600, color: c.dark }}>{e.title}</div>
                                    <div style={datePill}>{e.date}</div>
                                </div>
                                <div style={{ fontSize: 13, color: c.grn2, fontWeight: 600, marginBottom: 10 }}>{e.co}</div>
                                {e.bullets.map((b, j) => (
                                    <div key={j} style={{ display: 'flex', gap: 10, fontSize: 13, color: c.txt, lineHeight: 1.6, marginBottom: 4 }}>
                                        <span style={{ width: 5, height: 5, background: c.grn2, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', marginTop: 7, flexShrink: 0 }} />{b}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Sidebar */}
                <div style={{ background: c.bgGrn, padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: c.grn, marginBottom: 12 }}>Skills</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {['Carbon Accounting', 'ESG Strategy', 'TCFD', 'GRI / SASB', 'LCA', 'SimaPro', 'SBTi', 'LEED', 'Python', 'ArcGIS'].map((s, i) => (
                                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: c.grn, background: c.ltGrn, padding: '4px 10px', borderRadius: 4, fontWeight: 500 }}>
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.grn2, flexShrink: 0 }} />{s}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div style={{ borderTop: `1px solid ${c.brdr}`, paddingTop: 32 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: c.grn, marginBottom: 16 }}>Education</div>
                        {[['M.S. Environmental Engineering', 'MIT', 'Cambridge, MA · 2016'], ['B.S. Earth Systems Science', 'Stanford University', '2014']].map(([d, s, s2], i) => (
                            <div key={i} style={{ marginBottom: 16 }}>
                                <h4 style={{ fontSize: 13.5, fontWeight: 600, color: c.dark, lineHeight: 1.4 }}>{d}</h4>
                                <p style={{ fontSize: 12, color: c.txtDt, marginTop: 2, lineHeight: 1.4 }}>{s}<br />{s2}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: `1px solid ${c.brdr}`, paddingTop: 32 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: c.grn, marginBottom: 16 }}>Awards</div>
                        {[['40 Under 40 in Sustainability', 'GreenBiz · 2024'], ['Best ESG Report', 'Corporate Knights · 2023']].map(([t, s], i) => (
                            <div key={i} style={{ background: c.w, borderRadius: 4, borderLeft: `3px solid ${c.grn2}`, padding: '10px 12px', marginBottom: 10 }}>
                                <div style={{ fontSize: 12.5, fontWeight: 600, color: c.dark }}>{t}</div>
                                <div style={{ fontSize: 11.5, color: c.txtDt, marginTop: 2 }}>{s}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 16 — Sunset Warm ═══ */
export const SunsetWarmPreview: React.FC<PreviewProps> = () => {
    const c = { amber: '#c97c2a', amberLt: '#f5d4a0', amberPale: '#fdf6ec', rust: '#9c4a1a', warm: '#f7efe3', text: '#2a1f14', muted: '#6b5040', light: '#a08060', rule: '#e8d4bb' }
    const sTitle = { fontFamily: "'Fraunces', 'EB Garamond', serif", fontSize: 19, fontWeight: 600, color: c.amber, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }
    const datePill = { fontSize: 11.5, fontWeight: 600, color: c.amber, background: c.amberLt, padding: '2px 9px', borderRadius: 3, whiteSpace: 'nowrap' as const }
    return (
        <div style={{ fontFamily: "'Nunito', 'DM Sans', sans-serif", background: c.warm, overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ background: 'linear-gradient(135deg, #c97c2a 0%, #e8a44a 50%, #d4763a 100%)', padding: '50px 60px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: -30, right: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', top: -50, left: 200, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', gap: 40 }}>
                    <div>
                        <div style={{ fontFamily: "'Fraunces', 'EB Garamond', serif", fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: -0.5 }}>Sofia <em style={{ fontWeight: 300, opacity: 0.85 }}>Reyes</em></div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 10 }}>Brand Strategist & Creative Director</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 12.5, color: 'rgba(255,255,255,0.8)', lineHeight: 2.1 }}>
                        Los Angeles, CA<br />(323) 887-1240<br /><span style={{ color: 'rgba(255,255,255,0.95)' }}>sofia@reyescreative.com</span><br /><span style={{ color: 'rgba(255,255,255,0.95)' }}>reyescreative.com</span>
                    </div>
                </div>
            </header>
            {/* Body */}
            <div style={{ padding: '40px 60px 56px', display: 'grid', gridTemplateColumns: '1fr 230px', gap: 52 }}>
                {/* Main */}
                <main>
                    <div style={{ marginBottom: 36 }}>
                        <div style={sTitle}>About<span style={{ flex: 1, height: 1, background: c.rule }} /></div>
                        <p style={{ fontSize: 14, color: c.muted, lineHeight: 1.85 }}>Creative director and brand strategist with 10 years building iconic identities for consumer brands. Led campaigns reaching 200M+ people for clients including Nike, Patagonia, and Oatly. Equal parts right-brain visionary and left-brain strategist.</p>
                    </div>
                    <div>
                        <div style={sTitle}>Experience<span style={{ flex: 1, height: 1, background: c.rule }} /></div>
                        {[
                            { title: 'Creative Director', date: '2021 — Present', co: 'Wieden+Kennedy · Los Angeles', bullets: ['Directed Nike\'s "Just Tomorrow" global campaign seen by 180M people across 42 markets', "Led rebrand of Patagonia's digital presence increasing direct-to-consumer revenue 38%", 'Built and managed a 12-person creative team across design, copy, and strategy', 'Won Cannes Lions Grand Prix 2023 and Clio Award 2024'] },
                            { title: 'Senior Art Director', date: '2018 — 2021', co: '72andSunny · Los Angeles', bullets: ['Led visual identity refresh for Snapchat reaching 300M daily active users', "Produced Oatly's US market launch campaign growing brand awareness from 12% to 58%", 'Mentored 6 junior designers and led weekly creative feedback sessions'] },
                            { title: 'Art Director', date: '2015 — 2018', co: 'TBWA\\Chiat\\Day · New York', bullets: ['Conceptualized and produced campaigns for Apple, Gatorade, and Airbnb', 'Recognized in Communication Arts Young Guns award list 2017'] },
                        ].map((e, i) => (
                            <div key={i} style={{ marginBottom: 26 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: c.text }}>{e.title}</div>
                                    <div style={datePill}>{e.date}</div>
                                </div>
                                <div style={{ fontSize: 13, color: c.rust, fontWeight: 600, marginBottom: 10 }}>{e.co}</div>
                                {e.bullets.map((b, j) => <div key={j} style={{ fontSize: 13, color: c.muted, lineHeight: 1.7, marginBottom: 4, paddingLeft: 18, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: c.amber, fontSize: 10, top: 3 }}>◈</span>{b}</div>)}
                            </div>
                        ))}
                    </div>
                </main>
                {/* Sidebar */}
                <aside>
                    <div style={{ marginBottom: 36 }}>
                        <div style={{ fontFamily: "'Fraunces', 'EB Garamond', serif", fontSize: 15, fontWeight: 600, color: c.amber, marginBottom: 18 }}>Core Skills</div>
                        {[['Brand Strategy', 5], ['Art Direction', 5], ['Copywriting', 4], ['Motion Design', 3], ['Team Leadership', 4]].map(([name, filled], i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: 13 }}>
                                <span style={{ color: c.text, fontWeight: 500 }}>{name as string}</span>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    {[1, 2, 3, 4, 5].map(n => <div key={n} style={{ width: 8, height: 8, borderRadius: '50%', background: n <= (filled as number) ? c.amber : c.rule }} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginBottom: 36 }}>
                        <div style={{ fontFamily: "'Fraunces', 'EB Garamond', serif", fontSize: 15, fontWeight: 600, color: c.amber, marginBottom: 18 }}>Education</div>
                        <h4 style={{ fontSize: 13.5, fontWeight: 700, color: c.text, lineHeight: 1.3 }}>B.F.A. Graphic Design</h4>
                        <p style={{ fontSize: 12, color: c.light, marginTop: 3, lineHeight: 1.5 }}>Rhode Island School of Design<br />2015</p>
                    </div>
                    <div>
                        <div style={{ fontFamily: "'Fraunces', 'EB Garamond', serif", fontSize: 15, fontWeight: 600, color: c.amber, marginBottom: 18 }}>Tools</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {['Figma', 'After Effects', 'Photoshop', 'Illustrator', 'Cinema 4D', 'Premiere'].map((t, i) => (
                                <span key={i} style={{ fontSize: 12, color: c.amber, border: `1px solid ${c.amberLt}`, background: c.amberPale, padding: '4px 10px', borderRadius: 4, fontWeight: 500 }}>{t}</span>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

/* ═══ Resume 17 — Newspaper Classic ═══ */
export const NewspaperClassicPreview: React.FC<PreviewProps> = () => {
    const c = { ink: '#1a1410', mid: '#4a3f34', muted: '#7a6e64', rule: '#c8bfb4', cream: '#f7f3ee', paper: '#faf7f3', red: '#8b1a1a' }
    const colTitle = { fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, color: c.red, borderBottom: `1px solid ${c.red}`, paddingBottom: 5, marginBottom: 14 }
    const entryTitle = { fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 14, fontWeight: 700, color: c.ink, lineHeight: 1.3, marginBottom: 2 }
    const entryMeta = { fontSize: 11, color: c.red, fontWeight: 600, marginBottom: 2, letterSpacing: 0.3 }
    const entryDate = { fontSize: 11, color: c.muted, fontStyle: 'italic' as const, marginBottom: 6, fontFamily: "'IM Fell English', 'Georgia', serif" }
    const entryP = { fontSize: 12.5, color: c.mid, lineHeight: 1.75, fontWeight: 300 }
    const skillItem = { fontSize: 12.5, color: c.mid, lineHeight: 1.8, paddingBottom: 5, borderBottom: `1px dotted ${c.rule}`, marginBottom: 5, fontWeight: 300 }
    return (
        <div style={{ fontFamily: "'Source Sans 3', 'DM Sans', sans-serif", background: c.paper, padding: '52px 60px', overflow: 'hidden' }}>
            {/* Masthead */}
            <div style={{ textAlign: 'center', borderTop: `3px double ${c.ink}`, borderBottom: `3px double ${c.ink}`, padding: '16px 0', marginBottom: 8 }}>
                <div style={{ fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: c.muted, marginBottom: 6 }}>Curriculum Vitae</div>
                <div style={{ fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 56, fontWeight: 900, color: c.ink, letterSpacing: -1, lineHeight: 1 }}>William <em style={{ fontWeight: 400 }}>Crawford</em></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 6, borderTop: `1px solid ${c.rule}`, fontSize: 11, color: c.muted }}>
                    <span>San Francisco, CA · (415) 777-2093 · w.crawford@law.com</span>
                    <span style={{ fontFamily: "'IM Fell English', 'Georgia', serif", fontStyle: 'italic', fontSize: 13 }}>Counselor · Litigator · Advisor</span>
                    <span>linkedin.com/in/wcrawford</span>
                </div>
            </div>
            {/* Lede */}
            <p style={{ fontFamily: "'IM Fell English', 'Georgia', serif", fontSize: 16, lineHeight: 1.75, color: c.mid, textAlign: 'center', margin: '22px 0 28px', padding: '0 40px', fontStyle: 'italic' }}>Senior litigation attorney with 14 years representing Fortune 100 companies in complex commercial disputes, securities litigation, and regulatory investigations. Track record of favorable outcomes in 87% of matters reaching trial.</p>
            {/* 3-Column */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1fr 2px 1fr', gap: '0 28px', borderTop: `1px solid ${c.rule}`, paddingTop: 28 }}>
                {/* Col 1: Experience */}
                <div>
                    <div style={colTitle}>Legal Experience</div>
                    {[
                        { title: 'Partner, Litigation', meta: 'Skadden, Arps · San Francisco', date: '2020 — Present', p: 'Lead counsel for NASDAQ-listed companies in securities class actions and SEC enforcement matters. Successfully resolved $1.2B shareholder derivative suit via negotiated settlement.' },
                        { title: 'Senior Associate', meta: 'Quinn Emanuel · Los Angeles', date: '2015 — 2020', p: 'Managed trial teams of 6 attorneys on high-stakes IP and commercial litigation. Won summary judgment in landmark patent case establishing industry precedent.' },
                        { title: 'Associate Attorney', meta: 'Gibson, Dunn & Crutcher · New York', date: '2012 — 2015', p: 'Defended financial institutions in post-2008 regulatory investigations. Managed document review teams of 40+ contract attorneys.' },
                    ].map((e, i) => (
                        <div key={i} style={{ marginBottom: 18 }}>
                            <div style={entryTitle}>{e.title}</div>
                            <div style={entryMeta}>{e.meta}</div>
                            <div style={entryDate}>{e.date}</div>
                            <p style={entryP}>{e.p}</p>
                        </div>
                    ))}
                </div>
                <div style={{ background: c.rule }} />
                {/* Col 2: Education + Clerkship + Bar */}
                <div>
                    <div style={colTitle}>Education</div>
                    {[
                        { title: 'J.D., magna cum laude', meta: 'Yale Law School', date: '2012', p: 'Order of the Coif. Yale Law Journal, Senior Editor. Moot Court Board Champion, 2011.' },
                        { title: 'B.A. Political Science, Philosophy', meta: 'Princeton University', date: '2009 — Summa Cum Laude', p: 'Phi Beta Kappa. Senior thesis on constitutional standing doctrine awarded departmental prize.' },
                    ].map((e, i) => (
                        <div key={i} style={{ marginBottom: 18 }}>
                            <div style={entryTitle}>{e.title}</div>
                            <div style={entryMeta}>{e.meta}</div>
                            <div style={entryDate}>{e.date}</div>
                            <p style={entryP}>{e.p}</p>
                        </div>
                    ))}
                    <div style={{ ...colTitle, marginTop: 24 }}>Clerkship</div>
                    <div style={{ marginBottom: 18 }}>
                        <div style={entryTitle}>Judicial Clerk</div>
                        <div style={entryMeta}>Hon. Richard Posner, 7th Circuit</div>
                        <div style={entryDate}>2012 — 2013</div>
                        <p style={entryP}>Researched and drafted opinions in 40+ appellate matters. Assisted in three published decisions cited in subsequent circuit rulings.</p>
                    </div>
                    <div style={{ ...colTitle, marginTop: 24 }}>Bar Admissions</div>
                    <p style={entryP}>California State Bar<br />New York State Bar<br />U.S. District Court, N.D. Cal.<br />U.S. Court of Appeals, 9th Cir.</p>
                </div>
                <div style={{ background: c.rule }} />
                {/* Col 3: Practice Areas + Recognition + Publications */}
                <div>
                    <div style={colTitle}>Practice Areas</div>
                    {[['Securities Litigation', 'Class actions, SEC enforcement'], ['Commercial Disputes', 'Breach of contract, fraud'], ['Intellectual Property', 'Patent, trade secrets'], ['Regulatory Defense', 'DOJ, FTC investigations'], ['Appellate Practice', 'Circuit court briefing'], ['Arbitration', 'AAA, JAMS, ICC panels']].map(([t, d], i) => (
                        <div key={i} style={skillItem}><strong style={{ fontWeight: 600, color: c.ink, fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 12 }}>{t}</strong> — {d}</div>
                    ))}
                    <div style={{ ...colTitle, marginTop: 24 }}>Recognition</div>
                    {[['Super Lawyers', '2020–2024'], ['Best Lawyers in America', 'Commercial Litigation 2022'], ['Chambers USA', 'Band 1, Securities Litigation'], ['Law360 Rising Star', 'Litigation 2018']].map(([t, d], i) => (
                        <div key={i} style={skillItem}><strong style={{ fontWeight: 600, color: c.ink, fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 12 }}>{t}</strong> — {d}</div>
                    ))}
                    <div style={{ ...colTitle, marginTop: 24 }}>Publications</div>
                    {[['Yale L.J.', '"Standing in Digital Markets" (2024)'], ['Stanford L. Rev.', '"Securities Fraud & AI" (2023)']].map(([t, d], i) => (
                        <div key={i} style={skillItem}><strong style={{ fontWeight: 600, color: c.ink, fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 12 }}>{t}</strong> — {d}</div>
                    ))}
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
export const IvoryMarblePreview: React.FC<PreviewProps> = () => {
    const c = { ivory: '#f9f6f0', marble: '#e8e0d4', veins: '#c8bfb0', navy: '#1a2640', gold: '#b8963c', goldLt: '#d4af6a', text: '#2a1e14', muted: '#6a5a48', light: '#9a8a78' }
    const sTitle = { fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: 3, color: c.gold, fontWeight: 600, marginBottom: 14 }
    const goldDiv = { height: 1, background: `linear-gradient(90deg, ${c.gold}, transparent)`, margin: '22px 0', opacity: 0.4 }
    return (
        <div style={{ fontFamily: "'Raleway', 'DM Sans', sans-serif", background: c.ivory, overflow: 'hidden' }}>
            {/* Gold line */}
            <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${c.gold}, ${c.goldLt}, ${c.gold}, transparent)` }} />
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr' }}>
                {/* Sidebar */}
                <div style={{ background: c.navy, padding: '52px 32px', position: 'relative', overflow: 'hidden' }}>
                    {/* Marble veining */}
                    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(255,255,255,0.02) 60px, rgba(255,255,255,0.02) 61px)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        {/* Monogram */}
                        <div style={{ width: 70, height: 70, border: '1px solid rgba(184,150,60,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative' }}>
                            <span style={{ fontFamily: "'Cormorant', 'EB Garamond', serif", fontSize: 28, fontWeight: 700, color: c.gold, letterSpacing: 2 }}>IF</span>
                            <span style={{ position: 'absolute', top: -2, left: -2, width: 8, height: 8, borderTop: `1px solid ${c.gold}`, borderLeft: `1px solid ${c.gold}`, opacity: 0.5 }} />
                            <span style={{ position: 'absolute', bottom: -2, right: -2, width: 8, height: 8, borderBottom: `1px solid ${c.gold}`, borderRight: `1px solid ${c.gold}`, opacity: 0.5 }} />
                        </div>
                        <div style={{ fontFamily: "'Cormorant', 'EB Garamond', serif", fontSize: 26, fontWeight: 300, color: '#fff', lineHeight: 1.2, letterSpacing: 1, marginBottom: 4 }}><strong style={{ fontWeight: 600, display: 'block' }}>Isabelle</strong>Fontaine</div>
                        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 3, color: c.gold, fontWeight: 500, marginBottom: 28 }}>Chief Marketing Officer</div>
                        <div style={goldDiv} />
                        <div style={sTitle}>Contact</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, fontWeight: 300 }}>Paris, France<br />+33 6 12 34 56 78<br />isabelle@fontaine.co<br />linkedin.com/in/ifontaine</div>
                        <div style={goldDiv} />
                        <div style={sTitle}>Expertise</div>
                        {['Brand Architecture', 'Growth Strategy', 'Digital Marketing', 'P&L Management', 'Consumer Insights', 'Retail & E-commerce', 'Global Team Leadership', 'Agency Management'].map((s, i) => (
                            <div key={i} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, paddingLeft: 12, position: 'relative', marginBottom: 2, fontWeight: 300 }}><span style={{ position: 'absolute', left: 0, top: 9, width: 5, height: 1, background: c.gold }} />{s}</div>
                        ))}
                        <div style={goldDiv} />
                        <div style={sTitle}>Education</div>
                        {[['MBA, Marketing', 'INSEAD', 'Fontainebleau · 2008'], ['B.A. Communication', 'Sciences Po Paris', '2006']].map(([d, s, s2], i) => (
                            <div key={i} style={{ marginBottom: 16 }}>
                                <h4 style={{ fontFamily: "'Cormorant', 'EB Garamond', serif", fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>{d}</h4>
                                <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 3, lineHeight: 1.5 }}>{s}<br />{s2}</p>
                            </div>
                        ))}
                        <div style={goldDiv} />
                        <div style={sTitle}>Languages</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, fontWeight: 300 }}>French — Native<br />English — Fluent<br />Spanish — Professional<br />Italian — Conversational</div>
                    </div>
                </div>
                {/* Main */}
                <div style={{ padding: '52px 48px' }}>
                    <div style={{ fontFamily: "'Cormorant', 'EB Garamond', serif", fontSize: 50, fontWeight: 300, color: c.navy, lineHeight: 1.05, letterSpacing: -0.5, marginBottom: 28 }}>Isabelle<br /><em style={{ fontWeight: 600, color: c.gold }}>Fontaine</em></div>
                    <div style={{ marginBottom: 36 }}>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: c.navy, marginBottom: 18, paddingBottom: 8, borderBottom: `1px solid ${c.marble}`, display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 16, height: 1, background: c.gold }} />Profile</div>
                        <p style={{ fontFamily: "'Cormorant', 'EB Garamond', serif", fontSize: 16, fontStyle: 'italic', fontWeight: 300, color: c.muted, lineHeight: 1.85 }}>Luxury brand executive with 16 years building category-defining marketing organizations across fashion, beauty, and lifestyle. Proven record growing premium brands from regional presence to global icons.</p>
                    </div>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: c.navy, marginBottom: 18, paddingBottom: 8, borderBottom: `1px solid ${c.marble}`, display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 16, height: 1, background: c.gold }} />Experience</div>
                        {[
                            { title: 'Chief Marketing Officer', date: '2021 — Present', co: 'Chloé · Paris, France', bullets: ['Repositioned Chloé as sustainability-led luxury brand, growing brand equity score 42 points', 'Led €140M integrated marketing budget across 62 markets with team of 85 globally', 'Launched "Chloé Unlimited" campaign earning 4 Cannes Lions and 28% DTC revenue growth', 'Expanded brand into Gen-Z segment increasing under-35 customer acquisition by 55%'] },
                            { title: 'VP, Global Brand Marketing', date: '2016 — 2021', co: "L'Oréal Luxe · Paris, France", bullets: ['Oversaw global brand strategy for Lancôme, Giorgio Armani Beauty, and YSL Beauté', 'Led digital transformation doubling e-commerce penetration from 18% to 36%', 'Managed €80M agency ecosystem renegotiating contracts saving €12M annually'] },
                            { title: 'Brand Director', date: '2012 — 2016', co: 'LVMH / Dior · Paris, France', bullets: ["Directed Dior Beauty's Asia-Pacific expansion across 14 new markets", 'Orchestrated 360° launch of "Rouge Dior" franchise generating €180M in first-year sales'] },
                        ].map((e, i) => (
                            <div key={i} style={{ marginBottom: 26 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <div style={{ fontFamily: "'Cormorant', 'EB Garamond', serif", fontSize: 18, fontWeight: 600, color: c.navy }}>{e.title}</div>
                                    <div style={{ fontSize: 11, color: c.light, letterSpacing: 1, fontWeight: 500, whiteSpace: 'nowrap' }}>{e.date}</div>
                                </div>
                                <div style={{ fontSize: 12.5, color: c.gold, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{e.co}</div>
                                {e.bullets.map((b, j) => <div key={j} style={{ fontSize: 13, color: c.muted, lineHeight: 1.75, marginBottom: 4, paddingLeft: 18, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: c.gold, fontSize: 9, top: 4 }}>◇</span>{b}</div>)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══ Resume 19 — Neon Cyber ═══ */
export const NeonCyberPreview: React.FC<PreviewProps> = () => {
    const c = { bg: '#04080f', surface: '#080e18', neon: '#00fff7', neon2: '#b44fff', text: '#c0e8f0', muted: '#5a8090', border: 'rgba(0,255,247,0.15)', dimNeon: 'rgba(0,255,247,0.15)' }
    const mono = "'Rajdhani', 'DM Sans', sans-serif"
    const sHead = { fontFamily: mono, fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, color: c.neon, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }
    const datePill = { fontFamily: mono, fontSize: 11, color: c.neon, background: c.dimNeon, border: `1px solid ${c.border}`, padding: '2px 8px', letterSpacing: 1, whiteSpace: 'nowrap' as const }
    return (
        <div style={{ fontFamily: "'Exo 2', 'DM Sans', sans-serif", background: c.bg, overflow: 'hidden', border: `1px solid ${c.border}` }}>
            {/* Header */}
            <header style={{ padding: '48px 56px 40px', borderBottom: `1px solid ${c.border}`, background: c.surface, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${c.neon}, ${c.neon2}, transparent)` }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', gap: 32 }}>
                    <div>
                        <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 3, color: c.muted, marginBottom: 12, textTransform: 'uppercase' }}>SYS_ID: <span style={{ color: c.neon }}>KN-2025 // ACTIVE</span></div>
                        <div style={{ fontFamily: mono, fontSize: 52, fontWeight: 700, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: -1 }}>
                            <div style={{ color: c.neon }}>KAI</div>
                            <div style={{ color: '#fff' }}>NAKAMURA</div>
                        </div>
                        <div style={{ fontSize: 12, color: c.muted, letterSpacing: 3, textTransform: 'uppercase', marginTop: 12 }}>// <span style={{ color: c.neon2 }}>CYBERSECURITY</span> ENGINEER</div>
                    </div>
                    <div style={{ border: `1px solid ${c.border}`, padding: '14px 18px', fontFamily: mono, fontSize: 12, color: c.muted, lineHeight: 2, letterSpacing: 0.5, background: 'rgba(0,255,247,0.02)' }}>
                        LOC: <span style={{ color: c.text }}>Austin, TX</span><br />
                        MAIL: <span style={{ color: c.text }}>kai@nakamura.sec</span><br />
                        NET: <span style={{ color: c.text }}>(512) 408-2934</span><br />
                        WEB: <span style={{ color: c.text }}>kainakamura.dev</span>
                    </div>
                </div>
            </header>
            {/* Stats strip */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${c.border}`, background: c.surface }}>
                {[['9+', 'Years Exp.'], ['340+', 'CVEs Reported'], ['12', 'Certs Held'], ['$2M+', 'Bug Bounties']].map(([num, label], i, arr) => (
                    <div key={i} style={{ flex: 1, padding: '16px 24px', borderRight: i < arr.length - 1 ? `1px solid ${c.border}` : 'none', textAlign: 'center' }}>
                        <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 700, color: c.neon, lineHeight: 1 }}>{num}</div>
                        <div style={{ fontSize: 10, color: c.muted, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
                    </div>
                ))}
            </div>
            {/* Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px' }}>
                {/* Main */}
                <div style={{ padding: '40px 48px', borderRight: `1px solid ${c.border}` }}>
                    <div style={{ marginBottom: 38 }}>
                        <div style={sHead}><span style={{ color: c.neon2 }}>{'>'}</span>Profile<span style={{ flex: 1, height: 1, background: c.border }} /></div>
                        <p style={{ fontSize: 13.5, color: '#7a9aa8', lineHeight: 1.85, fontWeight: 300, borderLeft: `2px solid ${c.neon}`, paddingLeft: 16 }}>Offensive security engineer specializing in red team operations, exploit development, and security architecture for critical infrastructure. Top-ranked on HackTheBox and CVE author with 340+ disclosed vulnerabilities.</p>
                    </div>
                    <div>
                        <div style={sHead}><span style={{ color: c.neon2 }}>{'>'}</span>Experience<span style={{ flex: 1, height: 1, background: c.border }} /></div>
                        {[
                            { title: 'Principal Red Team Engineer', date: '2022 — PRESENT', co: '// CROWDSTRIKE · AUSTIN, TX', bullets: ['Lead red team operations against Fortune 100 clients identifying critical attack chains', 'Developed proprietary C2 framework used across 80+ engagements with zero detection', 'Authored 45+ TTPs mapped to MITRE ATT&CK enhancing detection coverage by 22%', 'Mentored 4 junior red teamers; promoted to principal within 18 months'] },
                            { title: 'Senior Security Researcher', date: '2019 — 2022', co: '// GOOGLE PROJECT ZERO · REMOTE', bullets: ['Discovered and disclosed 148 zero-day vulnerabilities in Chrome, Android, and Windows', 'Developed fuzzing infrastructure covering 1.2M code paths per day', 'Published 8 security research papers at Black Hat, DEF CON, and Usenix'] },
                            { title: 'Security Engineer', date: '2016 — 2019', co: '// DARPA CONTRACTOR · WASHINGTON, DC', bullets: ['Developed autonomous vulnerability detection systems for critical infrastructure', 'Held TS/SCI clearance; participated in national cyber defense exercises'] },
                        ].map((e, i) => (
                            <div key={i} style={{ marginBottom: 28 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <div style={{ fontFamily: mono, fontSize: 17, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 }}>{e.title}</div>
                                    <div style={datePill}>{e.date}</div>
                                </div>
                                <div style={{ fontSize: 12, color: c.neon2, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{e.co}</div>
                                {e.bullets.map((b, j) => <div key={j} style={{ fontSize: 13, color: '#7a9aa8', lineHeight: 1.7, marginBottom: 4, paddingLeft: 20, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: c.neon, fontFamily: mono, fontSize: 10, top: 4, fontWeight: 700 }}>//</span>{b}</div>)}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Sidebar */}
                <div style={{ padding: '40px 28px', background: c.surface }}>
                    <div style={{ marginBottom: 38 }}>
                        <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: c.neon, marginBottom: 20 }}><span style={{ color: c.neon2 }}>{'>'}</span> Tech Stack</div>
                        {[['Python', 'EXPERT'], ['C / C++', 'EXPERT'], ['Assembly (x86/ARM)', 'ADVANCED'], ['Rust', 'ADVANCED'], ['Metasploit / Cobalt Strike', 'EXPERT'], ['Burp Suite', 'EXPERT']].map(([name, lvl], i) => (
                            <div key={i} style={{ fontSize: 12.5, color: c.text, padding: '6px 10px', border: `1px solid ${c.border}`, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,255,247,0.02)' }}>
                                {name}<span style={{ fontFamily: mono, fontSize: 10, color: c.neon, letterSpacing: 1 }}>{lvl}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginBottom: 38 }}>
                        <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: c.neon, marginBottom: 20 }}><span style={{ color: c.neon2 }}>{'>'}</span> Education</div>
                        <h4 style={{ fontFamily: mono, fontSize: 14, fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1.3 }}>B.S. Computer Science</h4>
                        <p style={{ fontSize: 11, color: c.muted, marginTop: 3, lineHeight: 1.6, letterSpacing: 0.5 }}>Carnegie Mellon<br />Pittsburgh, PA · 2016</p>
                    </div>
                    <div>
                        <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: c.neon, marginBottom: 20 }}><span style={{ color: c.neon2 }}>{'>'}</span> Certs</div>
                        {['OSCE3', 'OSCP', 'CISSP', 'GREM (GIAC)', 'CEH', 'CKA'].map((cert, i) => (
                            <span key={i} style={{ display: 'block', fontSize: 11, color: c.neon, border: `1px solid ${c.border}`, padding: '5px 10px', marginBottom: 5, fontFamily: mono, letterSpacing: 1, background: c.dimNeon }}>{cert}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
