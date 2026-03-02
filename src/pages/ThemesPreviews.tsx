import React from 'react'
import { ResumeData } from '../types'

// ─── DATA ADAPTER ──────────────────────────────────────────
// Normalises ResumeData into flat props every template can consume.
// Falls back to rich sample data when the user hasn't filled anything in yet.

const FALLBACK = {
  name: 'Jane Doe',
  role: 'Senior Product Designer',
  email: 'jane.doe@email.com',
  phone: '(555) 123-4567',
  location: 'San Francisco, CA',
  website: 'janedoe.design',
  photo: '',
  summary:
    'Product designer with 8+ years of experience crafting intuitive digital products for consumer and enterprise audiences. Passionate about design systems, accessibility, and turning complex problems into elegant solutions.',
  experience: [
    { id: 1, title: 'Senior Product Designer', company: 'Figma', location: 'San Francisco, CA', startDate: '2021', endDate: 'Present', current: true, description: 'Led the redesign of the component library used by 4M+ designers worldwide\nShipped auto-layout v4 reducing design-to-dev handoff time by 35%\nMentored 3 junior designers and established a weekly design critique program' },
    { id: 2, title: 'Product Designer', company: 'Stripe', location: 'San Francisco, CA', startDate: '2018', endDate: '2021', current: false, description: 'Designed the Stripe Dashboard payments overview used by 500K+ businesses\nConducted 60+ user interviews to inform checkout flow optimisation\nReduced support tickets by 22% through self-service UX improvements' },
    { id: 3, title: 'UX Designer', company: 'Airbnb', location: 'San Francisco, CA', startDate: '2016', endDate: '2018', current: false, description: 'Designed the host onboarding flow increasing completion rate by 18%\nCreated the illustration system used across marketing and product' },
  ],
  education: [
    { id: 1, degree: 'B.F.A. Interaction Design', school: 'California College of the Arts', location: 'San Francisco, CA', startDate: '2012', endDate: '2016', gpa: '3.8', notes: '' },
  ],
  skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Accessibility', 'HTML/CSS', 'React', 'Data Visualisation'],
  certifications: [],
  languages: [],
  projects: [],
}

export function useDynamicData(data: Partial<ResumeData>, _themeId?: string) {
  const d = data || {}
  const p = (d as any).personal || { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', summary: '', photo: '' }
  const hiddenSections: string[] = (d as any).hiddenSections || []
  const isHidden = (s: string) => hiddenSections.includes(s)

  const hasContent = (p.fullName || '').trim().length > 0 || (Array.isArray(d.experience) && d.experience.length > 0)

  const exp = isHidden('experience') ? [] : (Array.isArray(d.experience) && d.experience.length > 0 ? d.experience : (hasContent ? [] : FALLBACK.experience))
  const edu = isHidden('education') ? [] : (Array.isArray(d.education) && d.education.length > 0 ? d.education : (hasContent ? [] : FALLBACK.education))
  const skills = isHidden('skills') ? [] : (Array.isArray(d.skills) && d.skills.length > 0 ? d.skills : (hasContent ? [] : FALLBACK.skills))
  const summary = isHidden('summary') ? '' : (d.summary || (hasContent ? '' : FALLBACK.summary))

  return {
    name: (p.fullName || '').trim() || FALLBACK.name,
    role: (p.jobTitle || '').trim() || FALLBACK.role,
    email: (p.email || '').trim() || FALLBACK.email,
    phone: (p.phone || '').trim() || FALLBACK.phone,
    location: (p.location || '').trim() || FALLBACK.location,
    website: (p.website || '').trim() || FALLBACK.website,
    photo: (p.photo || '').trim(),
    summary,
    experience: exp as any[],
    education: edu as any[],
    skills,
    certifications: isHidden('certifications') ? [] : (Array.isArray(d.certifications) ? d.certifications : []),
    languages: isHidden('languages') ? [] : (Array.isArray(d.languages) ? d.languages : []),
    projects: isHidden('projects') ? [] : (Array.isArray(d.projects) ? d.projects : []),
    customColor: (d as any).customColor || '',
    show: (section: string) => !isHidden(section),
  }
}

// ─── SHARED TYPES ──────────────────────────────────────────

interface PreviewProps {
  data?: Partial<ResumeData>
}

// Bullet helper — splits description into lines
function bullets(desc?: string): string[] {
  if (!desc) return []
  return desc
    .split('\n')
    .map(l => l.replace(/^[•·\-–—*]\s*/, '').trim())
    .filter(Boolean)
}

// ────────────────────────────────────────────────────────────
// 1.  CLASSIC — Serif headings + sans body, single-column
//     Fonts: Playfair Display 700 + Source Sans 3 400
//     Sizes: 11px body, 22px section heading
// ────────────────────────────────────────────────────────────

function ClassicTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const accent = r.customColor || '#1a1a1a'
  const heading = "'Playfair Display', Georgia, serif"
  const body = "'Source Sans 3', 'Segoe UI', sans-serif"
  const bodySize = 11
  const headSize = 13

  const sectionTitle = (label: string): React.CSSProperties => ({
    fontFamily: heading, fontSize: headSize, fontWeight: 700, letterSpacing: 3,
    textTransform: 'uppercase', color: accent, borderBottom: `1.5px solid ${accent}`,
    paddingBottom: 6, marginBottom: 14, marginTop: 28,
  })

  return (
    <div style={{ fontFamily: body, fontSize: bodySize, color: '#222', lineHeight: 1.55, padding: '48px 52px', background: '#fff', minHeight: 1123 }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: 8 }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', display: 'block', border: `2px solid ${accent}` }} />}
        <h1 style={{ fontFamily: heading, fontSize: 32, fontWeight: 700, color: accent, letterSpacing: 1, margin: 0 }}>{r.name}</h1>
        <div style={{ fontSize: bodySize, color: '#555', marginTop: 4, letterSpacing: 1.5, textTransform: 'uppercase' }}>{r.role}</div>
        <div style={{ fontSize: bodySize, color: '#888', marginTop: 8 }}>
          {[r.location, r.phone, r.email, r.website].filter(Boolean).join('  ·  ')}
        </div>
      </header>

      {/* Summary */}
      {r.summary && (
        <>
          <div style={sectionTitle('Summary')}>Summary</div>
          <p style={{ margin: 0, color: '#444' }}>{r.summary}</p>
        </>
      )}

      {/* Experience */}
      {r.experience.length > 0 && (
        <>
          <div style={sectionTitle('Experience')}>Experience</div>
          {r.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: bodySize, color: '#111' }}>{exp.title}</strong>
                <span style={{ fontSize: bodySize, color: '#888', whiteSpace: 'nowrap' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style={{ fontSize: bodySize, color: accent, fontWeight: 600, marginBottom: 4 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
              {bullets(exp.description).map((b, j) => (
                <div key={j} style={{ paddingLeft: 14, position: 'relative', marginBottom: 2, color: '#444' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>{b}
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Education */}
      {r.education.length > 0 && (
        <>
          <div style={sectionTitle('Education')}>Education</div>
          {r.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <strong style={{ fontSize: bodySize }}>{edu.degree}</strong>
                <div style={{ color: '#555', fontSize: bodySize }}>{edu.school}{edu.location ? `, ${edu.location}` : ''}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</div>
              </div>
              <span style={{ fontSize: bodySize, color: '#888', whiteSpace: 'nowrap' }}>{edu.endDate}</span>
            </div>
          ))}
        </>
      )}

      {/* Skills */}
      {r.skills.length > 0 && (
        <>
          <div style={sectionTitle('Skills')}>Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {r.skills.map((s, i) => (
              <span key={i} style={{ fontSize: bodySize, padding: '3px 12px', borderRadius: 4, border: `1px solid ${accent}20`, background: `${accent}08`, color: '#333' }}>{s}</span>
            ))}
          </div>
        </>
      )}

      {/* Languages */}
      {r.languages.length > 0 && (
        <>
          <div style={sectionTitle('Languages')}>Languages</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {r.languages.map((l: any, i) => <span key={i} style={{ fontSize: bodySize, color: '#444' }}>{l.language} — {l.level}</span>)}
          </div>
        </>
      )}

      {/* Certifications */}
      {r.certifications.length > 0 && (
        <>
          <div style={sectionTitle('Certifications')}>Certifications</div>
          {r.certifications.map((c: any, i) => (
            <div key={i} style={{ marginBottom: 4, fontSize: bodySize, color: '#444' }}>
              <strong>{c.name}</strong>{c.issuer ? ` — ${c.issuer}` : ''}{c.date ? ` (${c.date})` : ''}
            </div>
          ))}
        </>
      )}

      {/* Projects */}
      {r.projects.length > 0 && (
        <>
          <div style={sectionTitle('Projects')}>Projects</div>
          {r.projects.map((p: any, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <strong style={{ fontSize: bodySize }}>{p.name}</strong>
              {p.tech && <span style={{ fontSize: bodySize, color: '#888', marginLeft: 8 }}>({p.tech})</span>}
              {p.description && <div style={{ fontSize: bodySize, color: '#444', marginTop: 2 }}>{p.description}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 2.  MODERN — Two-column sidebar, clean sans-serif
//     Fonts: Inter 600 + Inter 400
//     Sizes: 11px body, 12px section heading
// ────────────────────────────────────────────────────────────

function ModernTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const accent = r.customColor || '#2563eb'
  const font = "'Inter', 'Segoe UI', sans-serif"
  const bodySize = 11
  const headSize = 11

  const sLabel: React.CSSProperties = {
    fontFamily: font, fontSize: headSize, fontWeight: 700, letterSpacing: 2.5,
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 12, paddingBottom: 6,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  }
  const mLabel: React.CSSProperties = {
    fontFamily: font, fontSize: headSize, fontWeight: 700, letterSpacing: 2.5,
    textTransform: 'uppercase', color: accent, marginBottom: 14, paddingBottom: 6,
    borderBottom: `1.5px solid ${accent}20`,
  }

  return (
    <div style={{ fontFamily: font, fontSize: bodySize, display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 1123, background: '#fff', color: '#222', lineHeight: 1.55 }}>
      {/* Sidebar */}
      <aside style={{ background: '#1a1a2e', color: '#e0e0e0', padding: '40px 24px' }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', display: 'block', border: `3px solid ${accent}` }} />}
        <h1 style={{ fontFamily: font, fontSize: 22, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.2, marginBottom: 4 }}>{r.name}</h1>
        <div style={{ textAlign: 'center', fontSize: bodySize, color: accent, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 24 }}>{r.role}</div>

        {/* Contact */}
        <div style={{ marginBottom: 24 }}>
          <div style={sLabel}>Contact</div>
          {[r.email, r.phone, r.location, r.website].filter(Boolean).map((v, i) => (
            <div key={i} style={{ fontSize: bodySize, marginBottom: 6, color: '#ccc', wordBreak: 'break-word' }}>{v}</div>
          ))}
        </div>

        {/* Skills */}
        {r.skills.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={sLabel}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {r.skills.map((s, i) => (
                <span key={i} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 4, background: `${accent}25`, color: accent, fontWeight: 500 }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {r.education.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={sLabel}>Education</div>
            {r.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: bodySize }}>{edu.degree}</div>
                <div style={{ fontSize: bodySize, color: '#aaa' }}>{edu.school}</div>
                <div style={{ fontSize: bodySize, color: '#777' }}>{edu.endDate}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {r.languages.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={sLabel}>Languages</div>
            {r.languages.map((l: any, i) => (
              <div key={i} style={{ fontSize: bodySize, marginBottom: 4, color: '#ccc' }}>{l.language} — <span style={{ color: '#999' }}>{l.level}</span></div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {r.certifications.length > 0 && (
          <div>
            <div style={sLabel}>Certifications</div>
            {r.certifications.map((c: any, i) => (
              <div key={i} style={{ marginBottom: 6, fontSize: bodySize, color: '#ccc' }}>{c.name}{c.date ? ` (${c.date})` : ''}</div>
            ))}
          </div>
        )}
      </aside>

      {/* Main */}
      <main style={{ padding: '40px 40px 40px 32px' }}>
        {/* Summary */}
        {r.summary && (
          <div style={{ marginBottom: 24 }}>
            <div style={mLabel}>Profile</div>
            <p style={{ margin: 0, color: '#555', lineHeight: 1.65 }}>{r.summary}</p>
          </div>
        )}

        {/* Experience */}
        {r.experience.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={mLabel}>Experience</div>
            {r.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: 13, color: '#111' }}>{exp.title}</strong>
                  <span style={{ fontSize: bodySize, color: '#999', whiteSpace: 'nowrap' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div style={{ fontSize: bodySize, color: accent, fontWeight: 600, marginBottom: 6 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                {bullets(exp.description).map((b, j) => (
                  <div key={j} style={{ paddingLeft: 14, position: 'relative', marginBottom: 2, color: '#555' }}>
                    <span style={{ position: 'absolute', left: 0, color: accent }}>▸</span>{b}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {r.projects.length > 0 && (
          <div>
            <div style={mLabel}>Projects</div>
            {r.projects.map((p: any, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <strong style={{ fontSize: bodySize }}>{p.name}</strong>
                {p.tech && <span style={{ fontSize: 10, color: '#999', marginLeft: 6 }}>({p.tech})</span>}
                {p.description && <div style={{ fontSize: bodySize, color: '#555', marginTop: 2 }}>{p.description}</div>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 3.  EXECUTIVE — Full-width header with photo, serif accent
//     Fonts: Merriweather 700 + Open Sans 400
//     Sizes: 11px body, 13px section heading
// ────────────────────────────────────────────────────────────

function ExecutiveTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const accent = r.customColor || '#0c4a6e'
  const heading = "'Merriweather', Georgia, serif"
  const body = "'Open Sans', 'Segoe UI', sans-serif"
  const bodySize = 11
  const headSize = 12

  const sTitle: React.CSSProperties = {
    fontFamily: heading, fontSize: headSize, fontWeight: 700, letterSpacing: 3,
    textTransform: 'uppercase', color: accent, marginBottom: 12, marginTop: 28,
    display: 'flex', alignItems: 'center', gap: 10,
  }
  const rule: React.CSSProperties = { flex: 1, height: 1, background: `${accent}30` }

  return (
    <div style={{ fontFamily: body, fontSize: bodySize, color: '#222', lineHeight: 1.55, background: '#fff', minHeight: 1123 }}>
      {/* Header */}
      <header style={{ background: accent, color: '#fff', padding: '36px 52px', display: 'flex', alignItems: 'center', gap: 28 }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: heading, fontSize: 30, fontWeight: 700, margin: 0, letterSpacing: 0.5, color: '#fff' }}>{r.name}</h1>
          <div style={{ fontSize: 13, fontWeight: 300, opacity: 0.8, marginTop: 4, letterSpacing: 2, textTransform: 'uppercase' }}>{r.role}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: bodySize, lineHeight: 1.8, opacity: 0.85 }}>
          {r.location}<br />{r.phone}<br />{r.email}
        </div>
      </header>

      <div style={{ padding: '0 52px 48px' }}>
        {/* Summary */}
        {r.summary && (
          <>
            <div style={sTitle}><span style={rule} />Summary<span style={rule} /></div>
            <p style={{ margin: 0, color: '#444', textAlign: 'center', maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>{r.summary}</p>
          </>
        )}

        {/* Experience */}
        {r.experience.length > 0 && (
          <>
            <div style={sTitle}>Experience<span style={rule} /></div>
            {r.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 18, paddingLeft: 16, borderLeft: `2px solid ${accent}20` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: 13, color: '#111' }}>{exp.title}</strong>
                  <span style={{ fontSize: bodySize, color: '#999', whiteSpace: 'nowrap' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div style={{ fontSize: bodySize, color: accent, fontWeight: 600, marginBottom: 6 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                {bullets(exp.description).map((b, j) => (
                  <div key={j} style={{ paddingLeft: 14, position: 'relative', marginBottom: 2, color: '#555' }}>
                    <span style={{ position: 'absolute', left: 0, color: accent, fontWeight: 700 }}>—</span>{b}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {/* Two-column bottom */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 8 }}>
          <div>
            {r.education.length > 0 && (
              <>
                <div style={sTitle}>Education<span style={rule} /></div>
                {r.education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <strong style={{ fontSize: bodySize }}>{edu.degree}</strong>
                    <div style={{ fontSize: bodySize, color: '#555' }}>{edu.school} · {edu.endDate}</div>
                  </div>
                ))}
              </>
            )}
            {r.certifications.length > 0 && (
              <>
                <div style={sTitle}>Certifications<span style={rule} /></div>
                {r.certifications.map((c: any, i) => (
                  <div key={i} style={{ fontSize: bodySize, marginBottom: 4, color: '#444' }}><strong>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>
                ))}
              </>
            )}
          </div>
          <div>
            {r.skills.length > 0 && (
              <>
                <div style={sTitle}>Skills<span style={rule} /></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {r.skills.map((s, i) => (
                    <span key={i} style={{ fontSize: bodySize, padding: '3px 12px', borderRadius: 20, background: `${accent}10`, border: `1px solid ${accent}20`, color: '#333' }}>{s}</span>
                  ))}
                </div>
              </>
            )}
            {r.languages.length > 0 && (
              <>
                <div style={sTitle}>Languages<span style={rule} /></div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {r.languages.map((l: any, i) => (
                    <span key={i} style={{ fontSize: bodySize, color: '#444' }}>{l.language} — {l.level}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Projects */}
        {r.projects.length > 0 && (
          <>
            <div style={sTitle}>Projects<span style={rule} /></div>
            {r.projects.map((p: any, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <strong style={{ fontSize: bodySize }}>{p.name}</strong>
                {p.tech && <span style={{ fontSize: 10, color: '#888', marginLeft: 6 }}>({p.tech})</span>}
                {p.description && <div style={{ fontSize: bodySize, color: '#444', marginTop: 2 }}>{p.description}</div>}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 4.  MINIMAL — Ultra-clean, lots of whitespace, single-column
//     Fonts: DM Sans 500 + DM Sans 400
//     Sizes: 11px body, 11px section heading (caps)
// ────────────────────────────────────────────────────────────

function MinimalTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const accent = r.customColor || '#111'
  const font = "'DM Sans', 'Segoe UI', sans-serif"
  const bodySize = 11

  const sTitle: React.CSSProperties = {
    fontFamily: font, fontSize: bodySize, fontWeight: 600, letterSpacing: 3,
    textTransform: 'uppercase', color: accent, marginBottom: 14, marginTop: 32,
  }

  return (
    <div style={{ fontFamily: font, fontSize: bodySize, color: '#333', lineHeight: 1.6, padding: '56px 60px', background: '#fff', minHeight: 1123 }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12, paddingBottom: 20, borderBottom: `1px solid #e5e5e5` }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: font, fontSize: 28, fontWeight: 600, color: accent, margin: 0, letterSpacing: -0.5 }}>{r.name}</h1>
          <div style={{ fontSize: bodySize, color: '#888', marginTop: 4 }}>{r.role}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: bodySize, color: '#999', lineHeight: 1.8 }}>
          {r.email}<br />{r.phone}<br />{r.location}
        </div>
      </header>

      {/* Summary */}
      {r.summary && (
        <p style={{ margin: '16px 0 0', color: '#555', lineHeight: 1.7 }}>{r.summary}</p>
      )}

      {/* Experience */}
      {r.experience.length > 0 && (
        <>
          <div style={sTitle}>Experience</div>
          {r.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span><strong style={{ color: '#111' }}>{exp.title}</strong> <span style={{ color: '#999' }}>at</span> <strong style={{ color: accent }}>{exp.company}</strong></span>
                <span style={{ fontSize: bodySize, color: '#aaa', whiteSpace: 'nowrap' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              {exp.location && <div style={{ fontSize: bodySize, color: '#bbb', marginBottom: 4 }}>{exp.location}</div>}
              {bullets(exp.description).map((b, j) => (
                <div key={j} style={{ color: '#555', marginBottom: 2 }}>– {b}</div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Education */}
      {r.education.length > 0 && (
        <>
          <div style={sTitle}>Education</div>
          {r.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{edu.degree}</strong>
                <span style={{ color: '#999' }}> — {edu.school}</span>
                {edu.gpa && <span style={{ color: '#bbb' }}> (GPA: {edu.gpa})</span>}
              </div>
              <span style={{ color: '#bbb', whiteSpace: 'nowrap' }}>{edu.endDate}</span>
            </div>
          ))}
        </>
      )}

      {/* Skills */}
      {r.skills.length > 0 && (
        <>
          <div style={sTitle}>Skills</div>
          <div style={{ color: '#555' }}>{r.skills.join('  ·  ')}</div>
        </>
      )}

      {/* Languages */}
      {r.languages.length > 0 && (
        <>
          <div style={sTitle}>Languages</div>
          <div style={{ color: '#555' }}>{r.languages.map((l: any) => `${l.language} (${l.level})`).join('  ·  ')}</div>
        </>
      )}

      {/* Certifications */}
      {r.certifications.length > 0 && (
        <>
          <div style={sTitle}>Certifications</div>
          {r.certifications.map((c: any, i) => (
            <div key={i} style={{ marginBottom: 3, color: '#555' }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}{c.date ? ` (${c.date})` : ''}</div>
          ))}
        </>
      )}

      {/* Projects */}
      {r.projects.length > 0 && (
        <>
          <div style={sTitle}>Projects</div>
          {r.projects.map((p: any, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong>{p.name}</strong>{p.tech && <span style={{ color: '#999' }}> ({p.tech})</span>}
              {p.description && <div style={{ color: '#555', marginTop: 2 }}>{p.description}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 5.  BOLD — Dark header block, high contrast, strong type
//     Fonts: Space Grotesk 700 + DM Sans 400
//     Sizes: 11px body, 12px section heading
// ────────────────────────────────────────────────────────────

function BoldTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const accent = r.customColor || '#f59e0b'
  const heading = "'Space Grotesk', 'DM Sans', sans-serif"
  const body = "'DM Sans', 'Segoe UI', sans-serif"
  const bodySize = 11
  const headSize = 12

  const sTitle: React.CSSProperties = {
    fontFamily: heading, fontSize: headSize, fontWeight: 700, letterSpacing: 3,
    textTransform: 'uppercase', color: accent, marginBottom: 14, marginTop: 28,
    paddingBottom: 6, borderBottom: `2px solid ${accent}`,
  }

  return (
    <div style={{ fontFamily: body, fontSize: bodySize, color: '#222', lineHeight: 1.55, background: '#fff', minHeight: 1123 }}>
      {/* Header */}
      <header style={{ background: '#111', color: '#fff', padding: '40px 52px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: `${accent}15` }} />
        <div style={{ position: 'absolute', bottom: -20, left: 80, width: 80, height: 80, borderRadius: '50%', background: `${accent}10` }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, position: 'relative', zIndex: 1 }}>
          {r.photo && <img src={r.photo} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: heading, fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: -0.5, color: '#fff' }}>{r.name}</h1>
            <div style={{ fontSize: 13, color: accent, fontWeight: 600, marginTop: 4, letterSpacing: 1.5, textTransform: 'uppercase' }}>{r.role}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: bodySize, color: '#aaa', lineHeight: 1.8 }}>
            {r.email}<br />{r.phone}<br />{r.location}
          </div>
        </div>
      </header>

      <div style={{ padding: '0 52px 48px' }}>
        {/* Summary */}
        {r.summary && (
          <>
            <div style={sTitle}>About</div>
            <p style={{ margin: 0, color: '#444', lineHeight: 1.7 }}>{r.summary}</p>
          </>
        )}

        {/* Experience */}
        {r.experience.length > 0 && (
          <>
            <div style={sTitle}>Experience</div>
            {r.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: 13, color: '#111' }}>{exp.title}</strong>
                  <span style={{ fontSize: bodySize, color: '#999', whiteSpace: 'nowrap' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div style={{ fontSize: bodySize, color: accent, fontWeight: 600, marginBottom: 6 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                {bullets(exp.description).map((b, j) => (
                  <div key={j} style={{ paddingLeft: 14, position: 'relative', marginBottom: 2, color: '#555' }}>
                    <span style={{ position: 'absolute', left: 0, top: 1, width: 6, height: 6, background: accent, borderRadius: 1 }} />{b}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {/* Two-column bottom */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            {r.education.length > 0 && (
              <>
                <div style={sTitle}>Education</div>
                {r.education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <strong style={{ fontSize: bodySize }}>{edu.degree}</strong>
                    <div style={{ fontSize: bodySize, color: '#555' }}>{edu.school} · {edu.endDate}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                  </div>
                ))}
              </>
            )}
            {r.languages.length > 0 && (
              <>
                <div style={sTitle}>Languages</div>
                {r.languages.map((l: any, i) => (
                  <div key={i} style={{ fontSize: bodySize, marginBottom: 3, color: '#444' }}>{l.language} — {l.level}</div>
                ))}
              </>
            )}
          </div>
          <div>
            {r.skills.length > 0 && (
              <>
                <div style={sTitle}>Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {r.skills.map((s, i) => (
                    <span key={i} style={{ fontSize: bodySize, padding: '4px 12px', borderRadius: 4, background: '#111', color: '#fff', fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </>
            )}
            {r.certifications.length > 0 && (
              <>
                <div style={sTitle}>Certifications</div>
                {r.certifications.map((c: any, i) => (
                  <div key={i} style={{ fontSize: bodySize, marginBottom: 4, color: '#444' }}><strong>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Projects */}
        {r.projects.length > 0 && (
          <>
            <div style={sTitle}>Projects</div>
            {r.projects.map((p: any, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <strong style={{ fontSize: bodySize }}>{p.name}</strong>
                {p.tech && <span style={{ fontSize: 10, color: '#888', marginLeft: 6 }}>({p.tech})</span>}
                {p.description && <div style={{ fontSize: bodySize, color: '#444', marginTop: 2 }}>{p.description}</div>}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// MONO 1 — Clean single-column, hairline rules
// Fonts: IBM Plex Mono 600 + IBM Plex Sans 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function MonoCleanTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const h = "'IBM Plex Mono', monospace"; const b = "'IBM Plex Sans', sans-serif"
  const bs = 11; const hs = 12
  const sec = (l: string): React.CSSProperties => ({ fontFamily: h, fontSize: hs, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: '#111', borderBottom: '1px solid #ccc', paddingBottom: 6, marginBottom: 14, marginTop: 28 })
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#222', lineHeight: 1.55, padding: '48px 52px', background: '#fff', minHeight: 1123 }}>
      <header style={{ textAlign: 'center', marginBottom: 8 }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', display: 'block', filter: 'grayscale(100%)' }} />}
        <h1 style={{ fontFamily: h, fontSize: 28, fontWeight: 700, color: '#000', margin: 0 }}>{r.name}</h1>
        <div style={{ fontSize: bs, color: '#666', marginTop: 4, letterSpacing: 2, textTransform: 'uppercase' }}>{r.role}</div>
        <div style={{ fontSize: bs, color: '#999', marginTop: 8 }}>{[r.email, r.phone, r.location].filter(Boolean).join(' · ')}</div>
      </header>
      {r.summary && <><div style={sec('S')}>Summary</div><p style={{ margin: 0, color: '#444' }}>{r.summary}</p></>}
      {r.experience.length > 0 && <><div style={sec('E')}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>{e.title}</strong><span style={{ color: '#888', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: '#555', fontWeight: 600, marginBottom: 4 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 12, position: 'relative', color: '#444', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0 }}>–</span>{x}</div>)}</div>)}</>}
      {r.education.length > 0 && <><div style={sec('Ed')}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 8 }}><strong>{e.degree}</strong> — {e.school} <span style={{ color: '#999' }}>{e.endDate}</span></div>)}</>}
      {r.skills.length > 0 && <><div style={sec('Sk')}>Skills</div><div style={{ color: '#555' }}>{r.skills.join(' · ')}</div></>}
      {r.languages.length > 0 && <><div style={sec('L')}>Languages</div><div style={{ color: '#555' }}>{r.languages.map((l: any) => `${l.language} (${l.level})`).join(' · ')}</div></>}
      {r.certifications.length > 0 && <><div style={sec('C')}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 3, color: '#444' }}>{c.name}{c.date ? ` (${c.date})` : ''}</div>)}</>}
      {r.projects.length > 0 && <><div style={sec('P')}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 8 }}><strong>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#444', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// MONO 2 — Dark sidebar, white main
// Fonts: JetBrains Mono 700 + Inter 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function MonoSidebarTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const h = "'JetBrains Mono', monospace"; const b = "'Inter', sans-serif"
  const bs = 11; const hs = 11
  const sL: React.CSSProperties = { fontFamily: h, fontSize: hs, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: '#888', marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid #333' }
  const mL: React.CSSProperties = { fontFamily: h, fontSize: hs, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: '#111', marginBottom: 14, paddingBottom: 6, borderBottom: '1px solid #ddd' }
  return (
    <div style={{ fontFamily: b, fontSize: bs, display: 'grid', gridTemplateColumns: '210px 1fr', minHeight: 1123, background: '#fff', color: '#222', lineHeight: 1.55 }}>
      <aside style={{ background: '#111', color: '#ccc', padding: '40px 22px' }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 14px', display: 'block', filter: 'grayscale(100%)', border: '2px solid #444' }} />}
        <h1 style={{ fontFamily: h, fontSize: 20, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.2, marginBottom: 4 }}>{r.name}</h1>
        <div style={{ textAlign: 'center', fontSize: bs, color: '#777', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 24 }}>{r.role}</div>
        <div style={{ marginBottom: 24 }}><div style={sL}>Contact</div>{[r.email, r.phone, r.location, r.website].filter(Boolean).map((v, i) => <div key={i} style={{ fontSize: bs, marginBottom: 5, color: '#aaa', wordBreak: 'break-word' }}>{v}</div>)}</div>
        {r.skills.length > 0 && <div style={{ marginBottom: 24 }}><div style={sL}>Skills</div>{r.skills.map((s, i) => <div key={i} style={{ fontSize: bs, marginBottom: 4, color: '#ccc' }}>// {s}</div>)}</div>}
        {r.education.length > 0 && <div style={{ marginBottom: 24 }}><div style={sL}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><div style={{ fontWeight: 600, color: '#fff', fontSize: bs }}>{e.degree}</div><div style={{ fontSize: bs, color: '#888' }}>{e.school} · {e.endDate}</div></div>)}</div>}
        {r.languages.length > 0 && <div><div style={sL}>Languages</div>{r.languages.map((l: any, i) => <div key={i} style={{ fontSize: bs, marginBottom: 3, color: '#aaa' }}>{l.language} — {l.level}</div>)}</div>}
      </aside>
      <main style={{ padding: '40px 36px' }}>
        {r.summary && <div style={{ marginBottom: 24 }}><div style={mL}>Profile</div><p style={{ margin: 0, color: '#555' }}>{r.summary}</p></div>}
        {r.experience.length > 0 && <div style={{ marginBottom: 24 }}><div style={mL}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: '#111' }}>{e.title}</strong><span style={{ color: '#999', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: '#555', fontWeight: 600, marginBottom: 6 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#555', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: '#999' }}>&gt;</span>{x}</div>)}</div>)}</div>}
        {r.certifications.length > 0 && <div><div style={mL}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#444' }}>{c.name}{c.date ? ` (${c.date})` : ''}</div>)}</div>}
        {r.projects.length > 0 && <div style={{ marginTop: 20 }}><div style={mL}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#555', marginTop: 2 }}>{p.description}</div>}</div>)}</div>}
      </main>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// MONO 3 — Stacked bands with alternating grays
// Fonts: Space Mono 700 + DM Sans 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function MonoStackTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const h = "'Space Mono', monospace"; const b = "'DM Sans', sans-serif"
  const bs = 11
  const band = (dark: boolean): React.CSSProperties => ({ background: dark ? '#f0f0f0' : '#fff', padding: '20px 48px' })
  const sec: React.CSSProperties = { fontFamily: h, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#111', marginBottom: 14 }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#222', lineHeight: 1.55, background: '#fff', minHeight: 1123 }}>
      <header style={{ background: '#111', color: '#fff', padding: '36px 48px', display: 'flex', alignItems: 'center', gap: 20 }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(100%)', border: '2px solid #555', flexShrink: 0 }} />}
        <div style={{ flex: 1 }}><h1 style={{ fontFamily: h, fontSize: 26, fontWeight: 700, margin: 0, color: '#fff' }}>{r.name}</h1><div style={{ fontSize: bs, color: '#999', marginTop: 4, letterSpacing: 1.5, textTransform: 'uppercase' }}>{r.role}</div></div>
        <div style={{ textAlign: 'right', fontSize: bs, color: '#888', lineHeight: 1.8 }}>{r.email}<br />{r.phone}<br />{r.location}</div>
      </header>
      {r.summary && <div style={band(true)}><div style={sec}>Summary</div><p style={{ margin: 0, color: '#444' }}>{r.summary}</p></div>}
      {r.experience.length > 0 && <div style={band(false)}><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>{e.title}</strong><span style={{ color: '#888' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: '#555', fontWeight: 600, marginBottom: 4 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 12, position: 'relative', color: '#444', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0 }}>▪</span>{x}</div>)}</div>)}</div>}
      {r.education.length > 0 && <div style={band(true)}><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 8 }}><strong>{e.degree}</strong> — {e.school} <span style={{ color: '#999' }}>{e.endDate}</span></div>)}</div>}
      <div style={band(false)}>
        {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '3px 10px', border: '1px solid #ccc', borderRadius: 3, color: '#333' }}>{s}</span>)}</div></>}
        {r.languages.length > 0 && <><div style={sec}>Languages</div><div style={{ color: '#555', marginBottom: 20 }}>{r.languages.map((l: any) => `${l.language} (${l.level})`).join(' · ')}</div></>}
        {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 3, color: '#444' }}>{c.name}{c.date ? ` (${c.date})` : ''}</div>)}</>}
      </div>
      {r.projects.length > 0 && <div style={band(true)}><div style={sec}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 8 }}><strong>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#444', marginTop: 2 }}>{p.description}</div>}</div>)}</div>}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// MONO 4 — Typography-focused, large name, monospace accents
// Fonts: IBM Plex Mono 700 + IBM Plex Sans 400 | 11px / 11px
// ────────────────────────────────────────────────────────────
function MonoTypeTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const h = "'IBM Plex Mono', monospace"; const b = "'IBM Plex Sans', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: h, fontSize: bs, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#000', marginBottom: 12, marginTop: 28, display: 'flex', alignItems: 'center', gap: 8 }
  const line: React.CSSProperties = { flex: 1, height: 1, background: '#ccc' }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#333', lineHeight: 1.6, padding: '52px 56px', background: '#fff', minHeight: 1123 }}>
      <header style={{ marginBottom: 16, borderBottom: '2px solid #000', paddingBottom: 16 }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(100%)', marginBottom: 10 }} />}
        <h1 style={{ fontFamily: h, fontSize: 36, fontWeight: 700, color: '#000', margin: 0, lineHeight: 1.1, letterSpacing: -1 }}>{r.name}</h1>
        <div style={{ fontFamily: h, fontSize: bs, color: '#666', marginTop: 6, letterSpacing: 3, textTransform: 'uppercase' }}>{r.role}</div>
        <div style={{ fontSize: bs, color: '#999', marginTop: 6 }}>{[r.email, r.phone, r.location].filter(Boolean).join(' | ')}</div>
      </header>
      {r.summary && <><div style={sec}>Summary<span style={line} /></div><p style={{ margin: 0, color: '#444' }}>{r.summary}</p></>}
      {r.experience.length > 0 && <><div style={sec}>Experience<span style={line} /></div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: '#000' }}>{e.title}</strong><span style={{ fontFamily: h, color: '#999', whiteSpace: 'nowrap' }}>{e.startDate}–{e.current ? 'Present' : e.endDate}</span></div><div style={{ color: '#555', marginBottom: 4 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ color: '#444', marginBottom: 2 }}>→ {x}</div>)}</div>)}</>}
      {r.education.length > 0 && <><div style={sec}>Education<span style={line} /></div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 8 }}><strong>{e.degree}</strong><span style={{ color: '#888' }}> — {e.school} · {e.endDate}</span></div>)}</>}
      {r.skills.length > 0 && <><div style={sec}>Skills<span style={line} /></div><div style={{ fontFamily: h, fontSize: bs, color: '#555' }}>{r.skills.join(', ')}</div></>}
      {r.languages.length > 0 && <><div style={sec}>Languages<span style={line} /></div><div style={{ color: '#555' }}>{r.languages.map((l: any) => `${l.language} (${l.level})`).join(' · ')}</div></>}
      {r.certifications.length > 0 && <><div style={sec}>Certifications<span style={line} /></div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 3, color: '#444' }}>{c.name}{c.date ? ` (${c.date})` : ''}</div>)}</>}
      {r.projects.length > 0 && <><div style={sec}>Projects<span style={line} /></div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 8 }}><strong>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#444', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// MONO 5 — Editorial serif in grayscale, newspaper feel
// Fonts: Playfair Display 700 + Source Sans 3 400 | 11px / 13px
// ────────────────────────────────────────────────────────────
function MonoEditorialTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const h = "'Playfair Display', Georgia, serif"; const b = "'Source Sans 3', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: h, fontSize: 13, fontWeight: 700, color: '#000', marginBottom: 12, marginTop: 28, paddingBottom: 6, borderBottom: '2px solid #000' }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#222', lineHeight: 1.55, padding: '48px 52px', background: '#fafafa', minHeight: 1123 }}>
      <header style={{ textAlign: 'center', marginBottom: 8, paddingBottom: 16, borderBottom: '1px solid #ddd' }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', display: 'block', filter: 'grayscale(100%)', border: '2px solid #ccc' }} />}
        <h1 style={{ fontFamily: h, fontSize: 34, fontWeight: 700, color: '#000', margin: 0 }}>{r.name}</h1>
        <div style={{ fontSize: bs, color: '#666', marginTop: 4, letterSpacing: 2, textTransform: 'uppercase', fontStyle: 'italic' }}>{r.role}</div>
        <div style={{ fontSize: bs, color: '#999', marginTop: 8 }}>{[r.email, r.phone, r.location].filter(Boolean).join('  ·  ')}</div>
      </header>
      {r.summary && <><div style={sec}>Summary</div><p style={{ margin: 0, color: '#444', lineHeight: 1.7, fontStyle: 'italic' }}>{r.summary}</p></>}
      {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: '#000' }}>{e.title}</strong><span style={{ color: '#888', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: '#555', fontStyle: 'italic', marginBottom: 4 }}>{e.company}{e.location ? `, ${e.location}` : ''}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#444', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0 }}>•</span>{x}</div>)}</div>)}</>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 8 }}>
        <div>
          {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 8 }}><strong>{e.degree}</strong><div style={{ color: '#666' }}>{e.school} · {e.endDate}</div></div>)}</>}
          {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 3, color: '#444' }}>{c.name}{c.date ? ` (${c.date})` : ''}</div>)}</>}
        </div>
        <div>
          {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '2px 10px', border: '1px solid #999', borderRadius: 2, color: '#333' }}>{s}</span>)}</div></>}
          {r.languages.length > 0 && <><div style={{ ...sec, marginTop: 20 }}>Languages</div><div style={{ color: '#555' }}>{r.languages.map((l: any) => `${l.language} (${l.level})`).join(' · ')}</div></>}
        </div>
      </div>
      {r.projects.length > 0 && <><div style={sec}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 8 }}><strong>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#444', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// EXEC 1 — Navy header with gold accents
// Fonts: Merriweather 700 + Open Sans 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function ExecNavyTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#c9a84c'; const navy = '#0a1e3d'
  const h = "'Merriweather', Georgia, serif"; const b = "'Open Sans', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: h, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: navy, marginBottom: 14, marginTop: 28, paddingBottom: 6, borderBottom: `2px solid ${ac}` }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#222', lineHeight: 1.55, background: '#fff', minHeight: 1123 }}>
      <header style={{ background: navy, color: '#fff', padding: '38px 52px', display: 'flex', alignItems: 'center', gap: 24 }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${ac}`, flexShrink: 0 }} />}
        <div style={{ flex: 1 }}><h1 style={{ fontFamily: h, fontSize: 28, fontWeight: 700, margin: 0, color: '#fff' }}>{r.name}</h1><div style={{ fontSize: bs, color: ac, marginTop: 4, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{r.role}</div></div>
        <div style={{ textAlign: 'right', fontSize: bs, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>{r.email}<br />{r.phone}<br />{r.location}</div>
      </header>
      <div style={{ padding: '0 52px 48px' }}>
        {r.summary && <><div style={sec}>Executive Summary</div><p style={{ margin: 0, color: '#444', lineHeight: 1.7 }}>{r.summary}</p></>}
        {r.experience.length > 0 && <><div style={sec}>Professional Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18, paddingLeft: 14, borderLeft: `3px solid ${ac}` }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: navy }}>{e.title}</strong><span style={{ color: '#999', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: ac, fontWeight: 600, marginBottom: 6 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#555', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac }}>▸</span>{x}</div>)}</div>)}</>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{e.degree}</strong><div style={{ color: '#555' }}>{e.school} · {e.endDate}</div></div>)}</>}
            {r.languages.length > 0 && <><div style={sec}>Languages</div>{r.languages.map((l: any, i) => <div key={i} style={{ marginBottom: 3, color: '#444' }}>{l.language} — {l.level}</div>)}</>}
          </div>
          <div>
            {r.skills.length > 0 && <><div style={sec}>Core Competencies</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '3px 12px', borderRadius: 20, background: `${navy}08`, border: `1px solid ${navy}20`, color: '#333' }}>{s}</span>)}</div></>}
            {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#444' }}><strong>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>)}</>}
          </div>
        </div>
        {r.projects.length > 0 && <><div style={sec}>Key Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#444', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// EXEC 2 — Slate sidebar, sophisticated
// Fonts: Inter 700 + Inter 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function ExecSlateTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#3b82f6'; const slate = '#1e293b'
  const f = "'Inter', 'Segoe UI', sans-serif"
  const bs = 11
  const sL: React.CSSProperties = { fontFamily: f, fontSize: bs, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.1)' }
  const mL: React.CSSProperties = { fontFamily: f, fontSize: 12, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: slate, marginBottom: 14, paddingBottom: 6, borderBottom: `2px solid ${ac}` }
  return (
    <div style={{ fontFamily: f, fontSize: bs, display: 'grid', gridTemplateColumns: '230px 1fr', minHeight: 1123, background: '#fff', color: '#222', lineHeight: 1.55 }}>
      <aside style={{ background: slate, color: '#d0d5dd', padding: '40px 24px' }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', display: 'block', border: `3px solid ${ac}` }} />}
        <h1 style={{ fontFamily: f, fontSize: 20, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.2, marginBottom: 4 }}>{r.name}</h1>
        <div style={{ textAlign: 'center', fontSize: bs, color: ac, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 28 }}>{r.role}</div>
        <div style={{ marginBottom: 24 }}><div style={sL}>Contact</div>{[r.email, r.phone, r.location, r.website].filter(Boolean).map((v, i) => <div key={i} style={{ fontSize: bs, marginBottom: 6, color: '#b0b8c4', wordBreak: 'break-word' }}>{v}</div>)}</div>
        {r.skills.length > 0 && <div style={{ marginBottom: 24 }}><div style={sL}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 4, background: `${ac}20`, color: ac }}>{s}</span>)}</div></div>}
        {r.education.length > 0 && <div style={{ marginBottom: 24 }}><div style={sL}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><div style={{ fontWeight: 600, color: '#fff', fontSize: bs }}>{e.degree}</div><div style={{ fontSize: bs, color: '#8896a6' }}>{e.school} · {e.endDate}</div></div>)}</div>}
        {r.languages.length > 0 && <div><div style={sL}>Languages</div>{r.languages.map((l: any, i) => <div key={i} style={{ fontSize: bs, marginBottom: 3, color: '#b0b8c4' }}>{l.language} — {l.level}</div>)}</div>}
      </aside>
      <main style={{ padding: '40px 40px 40px 32px' }}>
        {r.summary && <div style={{ marginBottom: 24 }}><div style={mL}>Profile</div><p style={{ margin: 0, color: '#555', lineHeight: 1.65 }}>{r.summary}</p></div>}
        {r.experience.length > 0 && <div style={{ marginBottom: 24 }}><div style={mL}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#111' }}>{e.title}</strong><span style={{ color: '#999', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: ac, fontWeight: 600, marginBottom: 6 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#555', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac }}>▸</span>{x}</div>)}</div>)}</div>}
        {r.certifications.length > 0 && <div><div style={mL}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#444' }}>{c.name}{c.date ? ` (${c.date})` : ''}</div>)}</div>}
        {r.projects.length > 0 && <div style={{ marginTop: 20 }}><div style={mL}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#555', marginTop: 2 }}>{p.description}</div>}</div>)}</div>}
      </main>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// EXEC 3 — Ivory marble, luxury feel
// Fonts: Playfair Display 700 + Open Sans 400 | 11px / 13px
// ────────────────────────────────────────────────────────────
function ExecMarbleTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#b8963c'
  const h = "'Playfair Display', Georgia, serif"; const b = "'Open Sans', sans-serif"
  const bs = 11
  const sec = (label: string): React.CSSProperties => ({ fontFamily: h, fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: ac, marginBottom: 14, marginTop: 28, display: 'flex', alignItems: 'center', gap: 10 })
  const rule: React.CSSProperties = { flex: 1, height: 1, background: `${ac}40` }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#222', lineHeight: 1.55, background: '#f9f6f0', minHeight: 1123, padding: '48px 52px' }}>
      <header style={{ textAlign: 'center', marginBottom: 8, paddingBottom: 20, borderBottom: `2px solid ${ac}` }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', display: 'block', border: `3px solid ${ac}` }} />}
        <h1 style={{ fontFamily: h, fontSize: 32, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{r.name}</h1>
        <div style={{ fontSize: bs, color: ac, marginTop: 4, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>{r.role}</div>
        <div style={{ fontSize: bs, color: '#888', marginTop: 8 }}>{[r.email, r.phone, r.location].filter(Boolean).join('  ·  ')}</div>
      </header>
      {r.summary && <><div style={sec('S')}><span style={rule} />Summary<span style={rule} /></div><p style={{ margin: 0, color: '#444', textAlign: 'center', lineHeight: 1.7 }}>{r.summary}</p></>}
      {r.experience.length > 0 && <><div style={sec('E')}>Experience<span style={rule} /></div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18, paddingLeft: 16, borderLeft: `2px solid ${ac}30` }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#111' }}>{e.title}</strong><span style={{ color: '#999', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: ac, fontWeight: 600, marginBottom: 6 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#555', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac }}>◆</span>{x}</div>)}</div>)}</>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 8 }}>
        <div>
          {r.education.length > 0 && <><div style={sec('Ed')}>Education<span style={rule} /></div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{e.degree}</strong><div style={{ color: '#555' }}>{e.school} · {e.endDate}</div></div>)}</>}
          {r.certifications.length > 0 && <><div style={sec('C')}>Certifications<span style={rule} /></div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#444' }}><strong>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>)}</>}
        </div>
        <div>
          {r.skills.length > 0 && <><div style={sec('Sk')}>Skills<span style={rule} /></div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '3px 12px', borderRadius: 20, background: `${ac}10`, border: `1px solid ${ac}30`, color: '#333' }}>{s}</span>)}</div></>}
          {r.languages.length > 0 && <><div style={sec('L')}>Languages<span style={rule} /></div><div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>{r.languages.map((l: any, i) => <span key={i} style={{ color: '#444' }}>{l.language} — {l.level}</span>)}</div></>}
        </div>
      </div>
      {r.projects.length > 0 && <><div style={sec('P')}>Projects<span style={rule} /></div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#444', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// EXEC 4 — Charcoal dark header, white body
// Fonts: Space Grotesk 700 + Inter 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function ExecCharcoalTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#64748b'
  const h = "'Space Grotesk', sans-serif"; const b = "'Inter', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: h, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#334155', marginBottom: 14, marginTop: 28, paddingBottom: 6, borderBottom: `1.5px solid ${ac}40` }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#222', lineHeight: 1.55, background: '#fff', minHeight: 1123 }}>
      <header style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', color: '#fff', padding: '40px 52px', display: 'flex', alignItems: 'center', gap: 24 }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.2)', flexShrink: 0 }} />}
        <div style={{ flex: 1 }}><h1 style={{ fontFamily: h, fontSize: 30, fontWeight: 700, margin: 0, color: '#fff' }}>{r.name}</h1><div style={{ fontSize: bs, color: ac, marginTop: 4, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{r.role}</div></div>
        <div style={{ textAlign: 'right', fontSize: bs, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>{r.email}<br />{r.phone}<br />{r.location}</div>
      </header>
      <div style={{ padding: '0 52px 48px' }}>
        {r.summary && <><div style={sec}>Summary</div><p style={{ margin: 0, color: '#555', lineHeight: 1.7 }}>{r.summary}</p></>}
        {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#111' }}>{e.title}</strong><span style={{ color: '#999', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: '#475569', fontWeight: 600, marginBottom: 6 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#555', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac }}>—</span>{x}</div>)}</div>)}</>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{e.degree}</strong><div style={{ color: '#555' }}>{e.school} · {e.endDate}</div></div>)}</>}
            {r.languages.length > 0 && <><div style={sec}>Languages</div>{r.languages.map((l: any, i) => <div key={i} style={{ marginBottom: 3, color: '#444' }}>{l.language} — {l.level}</div>)}</>}
          </div>
          <div>
            {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '3px 12px', borderRadius: 4, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155' }}>{s}</span>)}</div></>}
            {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#444' }}><strong>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>)}</>}
          </div>
        </div>
        {r.projects.length > 0 && <><div style={sec}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#444', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// EXEC 5 — Copper/bronze accents, warm professional
// Fonts: Merriweather 700 + DM Sans 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function ExecCopperTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#b45309'
  const h = "'Merriweather', Georgia, serif"; const b = "'DM Sans', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: h, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: ac, marginBottom: 14, marginTop: 28, paddingBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }
  const rule: React.CSSProperties = { flex: 1, height: 1, background: `${ac}30` }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#222', lineHeight: 1.55, background: '#fffbf5', minHeight: 1123 }}>
      <header style={{ padding: '40px 52px', borderBottom: `3px solid ${ac}`, display: 'flex', alignItems: 'center', gap: 24 }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${ac}`, flexShrink: 0 }} />}
        <div style={{ flex: 1 }}><h1 style={{ fontFamily: h, fontSize: 30, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{r.name}</h1><div style={{ fontSize: bs, color: ac, marginTop: 4, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{r.role}</div></div>
        <div style={{ textAlign: 'right', fontSize: bs, color: '#888', lineHeight: 1.8 }}>{r.email}<br />{r.phone}<br />{r.location}</div>
      </header>
      <div style={{ padding: '0 52px 48px' }}>
        {r.summary && <><div style={sec}>Summary<span style={rule} /></div><p style={{ margin: 0, color: '#444', lineHeight: 1.7 }}>{r.summary}</p></>}
        {r.experience.length > 0 && <><div style={sec}>Experience<span style={rule} /></div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#111' }}>{e.title}</strong><span style={{ color: '#999', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: ac, fontWeight: 600, marginBottom: 6 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#555', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac }}>◈</span>{x}</div>)}</div>)}</>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            {r.education.length > 0 && <><div style={sec}>Education<span style={rule} /></div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{e.degree}</strong><div style={{ color: '#555' }}>{e.school} · {e.endDate}</div></div>)}</>}
            {r.languages.length > 0 && <><div style={sec}>Languages<span style={rule} /></div>{r.languages.map((l: any, i) => <div key={i} style={{ marginBottom: 3, color: '#444' }}>{l.language} — {l.level}</div>)}</>}
          </div>
          <div>
            {r.skills.length > 0 && <><div style={sec}>Skills<span style={rule} /></div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '3px 12px', borderRadius: 4, background: `${ac}08`, border: `1px solid ${ac}20`, color: '#333' }}>{s}</span>)}</div></>}
            {r.certifications.length > 0 && <><div style={sec}>Certifications<span style={rule} /></div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#444' }}><strong>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>)}</>}
          </div>
        </div>
        {r.projects.length > 0 && <><div style={sec}>Projects<span style={rule} /></div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#444', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// CREATIVE 1 — Gradient purple/pink sidebar
// Fonts: Outfit 700 + Inter 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function CreativeGradientTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#a855f7'
  const h = "'Outfit', sans-serif"; const b = "'Inter', sans-serif"
  const bs = 11
  const sL: React.CSSProperties = { fontFamily: h, fontSize: bs, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.12)' }
  const mL: React.CSSProperties = { fontFamily: h, fontSize: 12, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: '#1a1a2e', marginBottom: 14, paddingBottom: 6, borderBottom: `2px solid ${ac}` }
  return (
    <div style={{ fontFamily: b, fontSize: bs, display: 'grid', gridTemplateColumns: '230px 1fr', minHeight: 1123, background: '#fff', color: '#222', lineHeight: 1.55 }}>
      <aside style={{ background: 'linear-gradient(180deg, #7c3aed, #a855f7, #ec4899)', color: '#fff', padding: '40px 24px' }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', display: 'block', border: '3px solid rgba(255,255,255,0.3)' }} />}
        <h1 style={{ fontFamily: h, fontSize: 20, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.2, marginBottom: 4 }}>{r.name}</h1>
        <div style={{ textAlign: 'center', fontSize: bs, color: 'rgba(255,255,255,0.75)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 28 }}>{r.role}</div>
        <div style={{ marginBottom: 24 }}><div style={sL}>Contact</div>{[r.email, r.phone, r.location, r.website].filter(Boolean).map((v, i) => <div key={i} style={{ fontSize: bs, marginBottom: 6, color: 'rgba(255,255,255,0.8)', wordBreak: 'break-word' }}>{v}</div>)}</div>
        {r.skills.length > 0 && <div style={{ marginBottom: 24 }}><div style={sL}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.15)', color: '#fff' }}>{s}</span>)}</div></div>}
        {r.education.length > 0 && <div style={{ marginBottom: 24 }}><div style={sL}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><div style={{ fontWeight: 600, color: '#fff', fontSize: bs }}>{e.degree}</div><div style={{ fontSize: bs, color: 'rgba(255,255,255,0.6)' }}>{e.school} · {e.endDate}</div></div>)}</div>}
        {r.languages.length > 0 && <div><div style={sL}>Languages</div>{r.languages.map((l: any, i) => <div key={i} style={{ fontSize: bs, marginBottom: 3, color: 'rgba(255,255,255,0.75)' }}>{l.language} — {l.level}</div>)}</div>}
      </aside>
      <main style={{ padding: '40px 36px' }}>
        {r.summary && <div style={{ marginBottom: 24 }}><div style={mL}>Profile</div><p style={{ margin: 0, color: '#555', lineHeight: 1.65 }}>{r.summary}</p></div>}
        {r.experience.length > 0 && <div style={{ marginBottom: 24 }}><div style={mL}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#111' }}>{e.title}</strong><span style={{ color: '#999', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: ac, fontWeight: 600, marginBottom: 6 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#555', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac }}>▸</span>{x}</div>)}</div>)}</div>}
        {r.certifications.length > 0 && <div><div style={mL}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#444' }}>{c.name}{c.date ? ` (${c.date})` : ''}</div>)}</div>}
        {r.projects.length > 0 && <div style={{ marginTop: 20 }}><div style={mL}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#555', marginTop: 2 }}>{p.description}</div>}</div>)}</div>}
      </main>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// CREATIVE 2 — Dark background, neon green accents
// Fonts: Space Grotesk 700 + DM Sans 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function CreativeNeonTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#22c55e'
  const h = "'Space Grotesk', sans-serif"; const b = "'DM Sans', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: h, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: ac, marginBottom: 14, marginTop: 28, paddingBottom: 6, borderBottom: `1px solid ${ac}40` }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#d4d4d8', lineHeight: 1.55, background: '#0f0f0f', minHeight: 1123, padding: '48px 52px' }}>
      <header style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {r.photo && <img src={r.photo} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${ac}`, flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: h, fontSize: 30, fontWeight: 700, margin: 0, color: '#fff' }}>{r.name}</h1>
            <div style={{ fontSize: bs, color: ac, marginTop: 4, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{r.role}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: bs, color: '#71717a', lineHeight: 1.8 }}>{r.email}<br />{r.phone}<br />{r.location}</div>
        </div>
      </header>
      {r.summary && <><div style={sec}>About</div><p style={{ margin: 0, color: '#a1a1aa', lineHeight: 1.7 }}>{r.summary}</p></>}
      {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#fff' }}>{e.title}</strong><span style={{ color: '#52525b', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: ac, fontWeight: 600, marginBottom: 6 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#a1a1aa', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac }}>›</span>{x}</div>)}</div>)}</>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div>
          {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ color: '#fff' }}>{e.degree}</strong><div style={{ color: '#71717a' }}>{e.school} · {e.endDate}</div></div>)}</>}
          {r.languages.length > 0 && <><div style={sec}>Languages</div>{r.languages.map((l: any, i) => <div key={i} style={{ marginBottom: 3, color: '#a1a1aa' }}>{l.language} — {l.level}</div>)}</>}
        </div>
        <div>
          {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '3px 12px', borderRadius: 4, background: `${ac}15`, border: `1px solid ${ac}30`, color: ac }}>{s}</span>)}</div></>}
          {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#a1a1aa' }}><strong style={{ color: '#fff' }}>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>)}</>}
        </div>
      </div>
      {r.projects.length > 0 && <><div style={sec}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ color: '#fff' }}>{p.name}</strong>{p.tech && <span style={{ color: '#52525b' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#a1a1aa', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// CREATIVE 3 — Warm coral/terracotta with organic shapes
// Fonts: DM Serif Display 400 + Inter 400 | 11px / 13px
// ────────────────────────────────────────────────────────────
function CreativeCoralTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#dc6843'
  const h = "'DM Serif Display', Georgia, serif"; const b = "'Inter', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: h, fontSize: 13, fontWeight: 400, letterSpacing: 1, color: ac, marginBottom: 14, marginTop: 28, paddingBottom: 6, borderBottom: `2px solid ${ac}` }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#222', lineHeight: 1.55, background: '#fef7f3', minHeight: 1123, padding: '48px 52px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: `${ac}08` }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: '50%', background: `${ac}06` }} />
      <header style={{ position: 'relative', zIndex: 1, marginBottom: 8, textAlign: 'center', paddingBottom: 20, borderBottom: `1px solid ${ac}20` }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', display: 'block', border: `3px solid ${ac}` }} />}
        <h1 style={{ fontFamily: h, fontSize: 32, fontWeight: 400, color: '#1a1a1a', margin: 0 }}>{r.name}</h1>
        <div style={{ fontSize: bs, color: ac, marginTop: 4, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{r.role}</div>
        <div style={{ fontSize: bs, color: '#999', marginTop: 8 }}>{[r.email, r.phone, r.location].filter(Boolean).join('  ·  ')}</div>
      </header>
      {r.summary && <><div style={sec}>Summary</div><p style={{ margin: 0, color: '#555', lineHeight: 1.7, position: 'relative', zIndex: 1 }}>{r.summary}</p></>}
      {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18, paddingLeft: 14, borderLeft: `2px solid ${ac}30`, position: 'relative', zIndex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#111' }}>{e.title}</strong><span style={{ color: '#999', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: ac, fontWeight: 600, marginBottom: 6 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#555', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac }}>◦</span>{x}</div>)}</div>)}</>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, position: 'relative', zIndex: 1 }}>
        <div>
          {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{e.degree}</strong><div style={{ color: '#666' }}>{e.school} · {e.endDate}</div></div>)}</>}
          {r.languages.length > 0 && <><div style={sec}>Languages</div>{r.languages.map((l: any, i) => <div key={i} style={{ marginBottom: 3, color: '#555' }}>{l.language} — {l.level}</div>)}</>}
        </div>
        <div>
          {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '3px 12px', borderRadius: 20, background: `${ac}10`, border: `1px solid ${ac}25`, color: '#333' }}>{s}</span>)}</div></>}
          {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#444' }}>{c.name}{c.date ? ` (${c.date})` : ''}</div>)}</>}
        </div>
      </div>
      {r.projects.length > 0 && <><div style={sec}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10, position: 'relative', zIndex: 1 }}><strong>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#555', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// CREATIVE 4 — Technical blueprint style
// Fonts: JetBrains Mono 700 + Inter 400 | 11px / 11px
// ────────────────────────────────────────────────────────────
function CreativeBlueprintTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#38bdf8'
  const h = "'JetBrains Mono', monospace"; const b = "'Inter', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: h, fontSize: bs, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: ac, marginBottom: 14, marginTop: 28, paddingBottom: 6, borderBottom: `1px dashed ${ac}50` }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#e2e8f0', lineHeight: 1.55, background: '#0c1929', minHeight: 1123, padding: '48px 52px' }}>
      <header style={{ borderBottom: `1px solid ${ac}30`, paddingBottom: 16, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {r.photo && <img src={r.photo} alt="" style={{ width: 68, height: 68, borderRadius: 6, objectFit: 'cover', border: `2px solid ${ac}50`, flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: h, fontSize: 26, fontWeight: 700, margin: 0, color: '#fff' }}>&lt;{r.name} /&gt;</h1>
            <div style={{ fontSize: bs, color: ac, marginTop: 4, fontFamily: h }}>{'// '}{r.role}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: bs, color: '#64748b', lineHeight: 1.8, fontFamily: h }}>{r.email}<br />{r.phone}<br />{r.location}</div>
        </div>
      </header>
      {r.summary && <><div style={sec}>/* Summary */</div><p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.7 }}>{r.summary}</p></>}
      {r.experience.length > 0 && <><div style={sec}>/* Experience */</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18, paddingLeft: 14, borderLeft: `2px solid ${ac}30` }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#fff' }}>{e.title}</strong><span style={{ color: '#475569', fontFamily: h, whiteSpace: 'nowrap' }}>{e.startDate}–{e.current ? 'now' : e.endDate}</span></div><div style={{ color: ac, fontWeight: 600, marginBottom: 6 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#94a3b8', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac, fontFamily: h }}>→</span>{x}</div>)}</div>)}</>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div>
          {r.education.length > 0 && <><div style={sec}>/* Education */</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ color: '#fff' }}>{e.degree}</strong><div style={{ color: '#64748b' }}>{e.school} · {e.endDate}</div></div>)}</>}
          {r.languages.length > 0 && <><div style={sec}>/* Languages */</div>{r.languages.map((l: any, i) => <div key={i} style={{ marginBottom: 3, color: '#94a3b8' }}>{l.language} — {l.level}</div>)}</>}
        </div>
        <div>
          {r.skills.length > 0 && <><div style={sec}>/* Skills */</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '3px 12px', borderRadius: 3, background: `${ac}12`, border: `1px solid ${ac}25`, color: ac, fontFamily: h }}>{s}</span>)}</div></>}
          {r.certifications.length > 0 && <><div style={sec}>/* Certs */</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#94a3b8' }}><strong style={{ color: '#fff' }}>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>)}</>}
        </div>
      </div>
      {r.projects.length > 0 && <><div style={sec}>/* Projects */</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ color: '#fff' }}>{p.name}</strong>{p.tech && <span style={{ color: '#475569', fontFamily: h }}> ({p.tech})</span>}{p.description && <div style={{ color: '#94a3b8', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// CREATIVE 5 — Sunset warm orange gradient header
// Fonts: Outfit 700 + DM Sans 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function CreativeSunsetTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#ea580c'
  const h = "'Outfit', sans-serif"; const b = "'DM Sans', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: h, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: ac, marginBottom: 14, marginTop: 28, paddingBottom: 6, borderBottom: `2px solid ${ac}` }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#222', lineHeight: 1.55, background: '#fff', minHeight: 1123 }}>
      <header style={{ background: 'linear-gradient(135deg, #ea580c, #f59e0b, #f97316)', color: '#fff', padding: '40px 52px', display: 'flex', alignItems: 'center', gap: 24 }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)', flexShrink: 0 }} />}
        <div style={{ flex: 1 }}><h1 style={{ fontFamily: h, fontSize: 30, fontWeight: 700, margin: 0, color: '#fff' }}>{r.name}</h1><div style={{ fontSize: bs, color: 'rgba(255,255,255,0.85)', marginTop: 4, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{r.role}</div></div>
        <div style={{ textAlign: 'right', fontSize: bs, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>{r.email}<br />{r.phone}<br />{r.location}</div>
      </header>
      <div style={{ padding: '0 52px 48px' }}>
        {r.summary && <><div style={sec}>About Me</div><p style={{ margin: 0, color: '#555', lineHeight: 1.7 }}>{r.summary}</p></>}
        {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18, paddingLeft: 14, borderLeft: `3px solid ${ac}30` }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#111' }}>{e.title}</strong><span style={{ color: '#999', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: ac, fontWeight: 600, marginBottom: 6 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#555', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac }}>▸</span>{x}</div>)}</div>)}</>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{e.degree}</strong><div style={{ color: '#555' }}>{e.school} · {e.endDate}</div></div>)}</>}
            {r.languages.length > 0 && <><div style={sec}>Languages</div>{r.languages.map((l: any, i) => <div key={i} style={{ marginBottom: 3, color: '#444' }}>{l.language} — {l.level}</div>)}</>}
          </div>
          <div>
            {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '3px 12px', borderRadius: 20, background: `${ac}10`, border: `1px solid ${ac}25`, color: '#333' }}>{s}</span>)}</div></>}
            {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#444' }}><strong>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>)}</>}
          </div>
        </div>
        {r.projects.length > 0 && <><div style={sec}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#555', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// DARK 1 — Obsidian: pure black, clean white text
// Fonts: Inter 700 + Inter 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function DarkObsidianTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#e5e5e5'
  const f = "'Inter', 'Segoe UI', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: f, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: ac, marginBottom: 14, marginTop: 28, paddingBottom: 6, borderBottom: `1px solid #333` }
  return (
    <div style={{ fontFamily: f, fontSize: bs, color: '#ccc', lineHeight: 1.55, background: '#0a0a0a', minHeight: 1123, padding: '48px 52px' }}>
      <header style={{ marginBottom: 12, paddingBottom: 20, borderBottom: '1px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {r.photo && <img src={r.photo} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #333', flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: f, fontSize: 30, fontWeight: 700, margin: 0, color: '#fff' }}>{r.name}</h1>
            <div style={{ fontSize: bs, color: '#888', marginTop: 4, letterSpacing: 2, textTransform: 'uppercase' }}>{r.role}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: bs, color: '#555', lineHeight: 1.8 }}>{r.email}<br />{r.phone}<br />{r.location}</div>
        </div>
      </header>
      {r.summary && <><div style={sec}>Summary</div><p style={{ margin: 0, color: '#999', lineHeight: 1.7 }}>{r.summary}</p></>}
      {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#fff' }}>{e.title}</strong><span style={{ color: '#555', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: '#777', fontWeight: 600, marginBottom: 6 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#999', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: '#555' }}>·</span>{x}</div>)}</div>)}</>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div>
          {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ color: '#fff' }}>{e.degree}</strong><div style={{ color: '#666' }}>{e.school} · {e.endDate}</div></div>)}</>}
          {r.languages.length > 0 && <><div style={sec}>Languages</div>{r.languages.map((l: any, i) => <div key={i} style={{ marginBottom: 3, color: '#999' }}>{l.language} — {l.level}</div>)}</>}
        </div>
        <div>
          {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '3px 12px', borderRadius: 4, background: '#161616', border: '1px solid #2a2a2a', color: '#bbb' }}>{s}</span>)}</div></>}
          {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#999' }}><strong style={{ color: '#fff' }}>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>)}</>}
        </div>
      </div>
      {r.projects.length > 0 && <><div style={sec}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ color: '#fff' }}>{p.name}</strong>{p.tech && <span style={{ color: '#555' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#999', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// DARK 2 — Midnight: deep blue dark with ice-blue accents
// Fonts: Space Grotesk 700 + Inter 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function DarkMidnightTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#60a5fa'
  const h = "'Space Grotesk', sans-serif"; const b = "'Inter', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: h, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: ac, marginBottom: 14, marginTop: 28, paddingBottom: 6, borderBottom: `1px solid #1e293b` }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#cbd5e1', lineHeight: 1.55, background: '#0b1120', minHeight: 1123 }}>
      <header style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '40px 52px', display: 'flex', alignItems: 'center', gap: 24 }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${ac}40`, flexShrink: 0 }} />}
        <div style={{ flex: 1 }}><h1 style={{ fontFamily: h, fontSize: 30, fontWeight: 700, margin: 0, color: '#f1f5f9' }}>{r.name}</h1><div style={{ fontSize: bs, color: ac, marginTop: 4, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{r.role}</div></div>
        <div style={{ textAlign: 'right', fontSize: bs, color: '#475569', lineHeight: 1.8 }}>{r.email}<br />{r.phone}<br />{r.location}</div>
      </header>
      <div style={{ padding: '0 52px 48px' }}>
        {r.summary && <><div style={sec}>Summary</div><p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.7 }}>{r.summary}</p></>}
        {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18, paddingLeft: 14, borderLeft: `2px solid ${ac}30` }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#f1f5f9' }}>{e.title}</strong><span style={{ color: '#475569', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: ac, fontWeight: 600, marginBottom: 6 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#94a3b8', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac }}>▸</span>{x}</div>)}</div>)}</>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ color: '#f1f5f9' }}>{e.degree}</strong><div style={{ color: '#64748b' }}>{e.school} · {e.endDate}</div></div>)}</>}
            {r.languages.length > 0 && <><div style={sec}>Languages</div>{r.languages.map((l: any, i) => <div key={i} style={{ marginBottom: 3, color: '#94a3b8' }}>{l.language} — {l.level}</div>)}</>}
          </div>
          <div>
            {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '3px 12px', borderRadius: 4, background: '#1e293b', border: `1px solid ${ac}20`, color: ac }}>{s}</span>)}</div></>}
            {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#94a3b8' }}><strong style={{ color: '#f1f5f9' }}>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>)}</>}
          </div>
        </div>
        {r.projects.length > 0 && <><div style={sec}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ color: '#f1f5f9' }}>{p.name}</strong>{p.tech && <span style={{ color: '#475569' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#94a3b8', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// DARK 3 — Eclipse: dark with warm amber/gold glow
// Fonts: Outfit 700 + DM Sans 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function DarkEclipseTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#f59e0b'
  const h = "'Outfit', sans-serif"; const b = "'DM Sans', sans-serif"
  const bs = 11
  const sL: React.CSSProperties = { fontFamily: h, fontSize: bs, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: `${ac}90`, marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${ac}20` }
  const mL: React.CSSProperties = { fontFamily: h, fontSize: 12, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: ac, marginBottom: 14, paddingBottom: 6, borderBottom: `1px solid #2a2520` }
  return (
    <div style={{ fontFamily: b, fontSize: bs, display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 1123, background: '#12100e', color: '#d4c8b8', lineHeight: 1.55 }}>
      <aside style={{ background: '#1a1714', padding: '40px 22px', borderRight: `1px solid ${ac}15` }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', display: 'block', border: `3px solid ${ac}40` }} />}
        <h1 style={{ fontFamily: h, fontSize: 20, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.2, marginBottom: 4 }}>{r.name}</h1>
        <div style={{ textAlign: 'center', fontSize: bs, color: ac, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 28 }}>{r.role}</div>
        <div style={{ marginBottom: 24 }}><div style={sL}>Contact</div>{[r.email, r.phone, r.location, r.website].filter(Boolean).map((v, i) => <div key={i} style={{ fontSize: bs, marginBottom: 6, color: '#8a7e70', wordBreak: 'break-word' }}>{v}</div>)}</div>
        {r.skills.length > 0 && <div style={{ marginBottom: 24 }}><div style={sL}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 4, background: `${ac}12`, border: `1px solid ${ac}20`, color: ac }}>{s}</span>)}</div></div>}
        {r.education.length > 0 && <div style={{ marginBottom: 24 }}><div style={sL}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><div style={{ fontWeight: 600, color: '#e8ddd0', fontSize: bs }}>{e.degree}</div><div style={{ fontSize: bs, color: '#6b6055' }}>{e.school} · {e.endDate}</div></div>)}</div>}
        {r.languages.length > 0 && <div><div style={sL}>Languages</div>{r.languages.map((l: any, i) => <div key={i} style={{ fontSize: bs, marginBottom: 3, color: '#8a7e70' }}>{l.language} — {l.level}</div>)}</div>}
      </aside>
      <main style={{ padding: '40px 36px' }}>
        {r.summary && <div style={{ marginBottom: 24 }}><div style={mL}>Profile</div><p style={{ margin: 0, color: '#a09080', lineHeight: 1.65 }}>{r.summary}</p></div>}
        {r.experience.length > 0 && <div style={{ marginBottom: 24 }}><div style={mL}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#fff' }}>{e.title}</strong><span style={{ color: '#5a5045', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: ac, fontWeight: 600, marginBottom: 6 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#a09080', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac }}>▸</span>{x}</div>)}</div>)}</div>}
        {r.certifications.length > 0 && <div><div style={mL}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#a09080' }}><strong style={{ color: '#e8ddd0' }}>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>)}</div>}
        {r.projects.length > 0 && <div style={{ marginTop: 20 }}><div style={mL}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ color: '#fff' }}>{p.name}</strong>{p.tech && <span style={{ color: '#5a5045' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#a09080', marginTop: 2 }}>{p.description}</div>}</div>)}</div>}
      </main>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// DARK 4 — Void: OLED pure black with violet accent
// Fonts: DM Sans 700 + DM Sans 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function DarkVoidTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#a78bfa'
  const f = "'DM Sans', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: f, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: ac, marginBottom: 14, marginTop: 28, paddingBottom: 6, borderBottom: `1px solid ${ac}25` }
  return (
    <div style={{ fontFamily: f, fontSize: bs, color: '#d4d4d8', lineHeight: 1.55, background: '#000', minHeight: 1123, padding: '48px 52px' }}>
      <header style={{ marginBottom: 12, paddingBottom: 20, borderBottom: `2px solid ${ac}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {r.photo && <img src={r.photo} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${ac}`, flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: f, fontSize: 30, fontWeight: 700, margin: 0, color: '#fff' }}>{r.name}</h1>
            <div style={{ fontSize: bs, color: ac, marginTop: 4, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{r.role}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: bs, color: '#52525b', lineHeight: 1.8 }}>{r.email}<br />{r.phone}<br />{r.location}</div>
        </div>
      </header>
      {r.summary && <><div style={sec}>About</div><p style={{ margin: 0, color: '#a1a1aa', lineHeight: 1.7 }}>{r.summary}</p></>}
      {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18, paddingLeft: 14, borderLeft: `2px solid ${ac}30` }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#fff' }}>{e.title}</strong><span style={{ color: '#52525b', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: ac, fontWeight: 600, marginBottom: 6 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#a1a1aa', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac }}>›</span>{x}</div>)}</div>)}</>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div>
          {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ color: '#fff' }}>{e.degree}</strong><div style={{ color: '#71717a' }}>{e.school} · {e.endDate}</div></div>)}</>}
          {r.languages.length > 0 && <><div style={sec}>Languages</div>{r.languages.map((l: any, i) => <div key={i} style={{ marginBottom: 3, color: '#a1a1aa' }}>{l.language} — {l.level}</div>)}</>}
        </div>
        <div>
          {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '3px 12px', borderRadius: 4, background: `${ac}10`, border: `1px solid ${ac}20`, color: ac }}>{s}</span>)}</div></>}
          {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#a1a1aa' }}><strong style={{ color: '#fff' }}>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>)}</>}
        </div>
      </div>
      {r.projects.length > 0 && <><div style={sec}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ color: '#fff' }}>{p.name}</strong>{p.tech && <span style={{ color: '#52525b' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#a1a1aa', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// DARK 5 — Carbon: dark gray with teal accents
// Fonts: Outfit 700 + Inter 400 | 11px / 12px
// ────────────────────────────────────────────────────────────
function DarkCarbonTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#2dd4bf'
  const h = "'Outfit', sans-serif"; const b = "'Inter', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: h, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: ac, marginBottom: 14, marginTop: 28, paddingBottom: 6, borderBottom: `1px solid #2a2a2a` }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#d4d4d4', lineHeight: 1.55, background: '#141414', minHeight: 1123 }}>
      <header style={{ background: '#1c1c1c', padding: '40px 52px', display: 'flex', alignItems: 'center', gap: 24, borderBottom: `3px solid ${ac}` }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${ac}40`, flexShrink: 0 }} />}
        <div style={{ flex: 1 }}><h1 style={{ fontFamily: h, fontSize: 30, fontWeight: 700, margin: 0, color: '#fff' }}>{r.name}</h1><div style={{ fontSize: bs, color: ac, marginTop: 4, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{r.role}</div></div>
        <div style={{ textAlign: 'right', fontSize: bs, color: '#666', lineHeight: 1.8 }}>{r.email}<br />{r.phone}<br />{r.location}</div>
      </header>
      <div style={{ padding: '0 52px 48px' }}>
        {r.summary && <><div style={sec}>Summary</div><p style={{ margin: 0, color: '#999', lineHeight: 1.7 }}>{r.summary}</p></>}
        {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginBottom: 18, paddingLeft: 14, borderLeft: `2px solid ${ac}30` }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 13, color: '#fff' }}>{e.title}</strong><span style={{ color: '#555', whiteSpace: 'nowrap' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span></div><div style={{ color: ac, fontWeight: 600, marginBottom: 6 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#999', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0, color: ac }}>▸</span>{x}</div>)}</div>)}</>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ color: '#fff' }}>{e.degree}</strong><div style={{ color: '#666' }}>{e.school} · {e.endDate}</div></div>)}</>}
            {r.languages.length > 0 && <><div style={sec}>Languages</div>{r.languages.map((l: any, i) => <div key={i} style={{ marginBottom: 3, color: '#999' }}>{l.language} — {l.level}</div>)}</>}
          </div>
          <div>
            {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: bs, padding: '3px 12px', borderRadius: 4, background: '#1c1c1c', border: `1px solid ${ac}25`, color: ac }}>{s}</span>)}</div></>}
            {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 4, color: '#999' }}><strong style={{ color: '#fff' }}>{c.name}</strong>{c.date ? ` (${c.date})` : ''}</div>)}</>}
          </div>
        </div>
        {r.projects.length > 0 && <><div style={sec}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ color: '#fff' }}>{p.name}</strong>{p.tech && <span style={{ color: '#555' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#999', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// PRESTIGE — Gold-accented luxury professional (reference match)
// Fonts: Cormorant Garamond 300/700 + Open Sans 400 | 11px / 13px
// Two-column: experience left, skills/education right
// ────────────────────────────────────────────────────────────
function PrestigeTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const gold = r.customColor || '#c5a572'
  const h = "'Cormorant Garamond', Georgia, serif"
  const b = "'Open Sans', 'Segoe UI', sans-serif"
  const bs = 11
  const rightSec: React.CSSProperties = { fontFamily: h, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#333', marginBottom: 10, marginTop: 24, paddingBottom: 4, borderBottom: `1.5px solid ${gold}` }
  const leftSec: React.CSSProperties = { fontFamily: h, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#333', marginBottom: 10, marginTop: 24 }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#333', lineHeight: 1.55, background: '#fff', minHeight: 1123 }}>
      {/* Top gold bar */}
      <div style={{ height: 6, background: `linear-gradient(90deg, ${gold}, ${gold}cc, ${gold})` }} />

      {/* Header: name + role */}
      <header style={{ textAlign: 'center', padding: '32px 52px 20px' }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', display: 'block', border: `3px solid ${gold}` }} />}
        <h1 style={{ fontFamily: h, fontSize: 36, margin: 0, color: '#222', letterSpacing: 4 }}>
          <span style={{ fontWeight: 300 }}>{r.name.split(' ')[0]}</span>{' '}
          <span style={{ fontWeight: 700 }}>{r.name.split(' ').slice(1).join(' ')}</span>
        </h1>
        <div style={{ fontFamily: b, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#888', marginTop: 4 }}>{r.role}</div>
      </header>

      {/* Contact bar between gold rules */}
      <div style={{ borderTop: `1.5px solid ${gold}`, borderBottom: `1.5px solid ${gold}`, margin: '0 40px', padding: '10px 0', display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
        {r.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#555' }}><span style={{ width: 22, height: 22, borderRadius: '50%', border: `1px solid ${gold}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: gold }}>✆</span>{r.phone}</div>}
        {r.email && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#555' }}><span style={{ width: 22, height: 22, borderRadius: '50%', border: `1px solid ${gold}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: gold }}>@</span>{r.email}</div>}
        {r.location && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#555' }}><span style={{ width: 22, height: 22, borderRadius: '50%', border: `1px solid ${gold}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: gold }}>◉</span>{r.location}</div>}
        {r.website && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#555' }}><span style={{ width: 22, height: 22, borderRadius: '50%', border: `1px solid ${gold}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: gold }}>⌘</span>{r.website}</div>}
      </div>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 32, padding: '0 44px 40px', borderRight: 'none' }}>
        {/* LEFT: summary + experience */}
        <div style={{ borderRight: `1px solid #e8e2d8`, paddingRight: 28 }}>
          {r.summary && <><div style={leftSec}>Professional Profile</div><p style={{ margin: 0, color: '#555', lineHeight: 1.7 }}>{r.summary}</p></>}

          {r.experience.length > 0 && <>
            <div style={leftSec}>Work Experience</div>
            {r.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: 12, color: '#222', textTransform: 'uppercase', letterSpacing: 0.5 }}>{e.title}</strong>
                  <span style={{ fontSize: 10, color: '#999', whiteSpace: 'nowrap', letterSpacing: 0.5 }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                </div>
                <div style={{ fontSize: 10, color: gold, fontStyle: 'italic', marginBottom: 4 }}>{e.company}{e.location ? ` / ${e.location}` : ''}</div>
                {bullets(e.description).map((x, j) => (
                  <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#555', marginBottom: 2, fontSize: bs }}>
                    <span style={{ position: 'absolute', left: 0, color: '#333' }}>•</span>{x}
                  </div>
                ))}
              </div>
            ))}
          </>}

          {r.projects.length > 0 && <><div style={leftSec}>Projects</div>{r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 8 }}><strong style={{ fontSize: 12, color: '#222' }}>{p.name}</strong>{p.tech && <span style={{ color: '#999' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#555', marginTop: 2 }}>{p.description}</div>}</div>)}</>}
        </div>

        {/* RIGHT: skills, education, certifications, languages */}
        <div>
          {r.skills.length > 0 && <>
            <div style={rightSec}>Skills</div>
            {r.skills.map((s, i) => <div key={i} style={{ fontSize: bs, color: '#555', marginBottom: 4, paddingLeft: 0 }}>{s}</div>)}
          </>}

          {r.education.length > 0 && <>
            <div style={rightSec}>Education</div>
            {r.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <strong style={{ fontSize: 12, color: '#222', textTransform: 'uppercase', letterSpacing: 0.5 }}>{e.degree}</strong>
                <div style={{ fontSize: 10, color: '#666' }}>{e.school}</div>
                <div style={{ fontSize: 10, color: '#999' }}>{e.endDate}</div>
              </div>
            ))}
          </>}

          {r.certifications.length > 0 && <>
            <div style={rightSec}>Achievements</div>
            {r.certifications.map((c: any, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <strong style={{ fontSize: 12, color: '#222', textTransform: 'uppercase', letterSpacing: 0.5 }}>{c.name}</strong>
                {c.date && <div style={{ fontSize: 10, color: '#999' }}>{c.date}</div>}
              </div>
            ))}
          </>}

          {r.languages.length > 0 && <>
            <div style={rightSec}>Languages</div>
            {r.languages.map((l: any, i) => <div key={i} style={{ fontSize: bs, color: '#555', marginBottom: 4 }}>{l.language} — {l.level}</div>)}
          </>}
        </div>
      </div>

      {/* Bottom gold bar */}
      <div style={{ height: 6, background: `linear-gradient(90deg, ${gold}, ${gold}cc, ${gold})`, marginTop: 'auto' }} />
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// TABLEAU — Dark header + dark sidebar, clean professional
// Fonts: Cormorant Garamond 300/700 + Open Sans 400 | 11px / 13px
// ────────────────────────────────────────────────────────────
function TableauTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const dark = r.customColor || '#2d2d2d'
  const h = "'Cormorant Garamond', Georgia, serif"
  const b = "'Open Sans', 'Segoe UI', sans-serif"
  const bs = 11
  const sideSec: React.CSSProperties = { fontFamily: h, fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#fff', marginBottom: 14, marginTop: 28 }
  const mainSec: React.CSSProperties = { fontFamily: h, fontSize: 14, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#222', marginBottom: 14, marginTop: 28 }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#333', lineHeight: 1.55, background: '#fff', minHeight: 1123, display: 'flex', flexDirection: 'column' }}>
      {/* Dark header */}
      <header style={{ background: dark, padding: '40px 52px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: h, fontSize: 38, margin: 0, color: '#fff', letterSpacing: 8 }}>
          <span style={{ fontWeight: 300 }}>{r.name.split(' ')[0]}</span>{' '}
          <span style={{ fontWeight: 700 }}>{r.name.split(' ').slice(1).join(' ')}</span>
        </h1>
      </header>
      {/* Title bar */}
      <div style={{ textAlign: 'center', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
        <span style={{ fontFamily: h, fontSize: 13, fontWeight: 400, letterSpacing: 3, color: '#666', fontStyle: 'italic' }}>{r.role}</span>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', flex: 1 }}>
        {/* LEFT dark sidebar */}
        <aside style={{ background: dark, color: '#ddd', padding: '24px 20px 40px' }}>
          {r.photo && <img src={r.photo} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', display: 'block', border: '2px solid #555' }} />}

          {/* Contact */}
          <div style={sideSec}>Contact</div>
          {r.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: bs }}><span style={{ color: '#999' }}>✆</span><span style={{ color: '#ccc' }}>{r.phone}</span></div>}
          {r.email && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: bs }}><span style={{ color: '#999' }}>✉</span><span style={{ color: '#ccc', wordBreak: 'break-all' }}>{r.email}</span></div>}
          {r.location && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: bs }}><span style={{ color: '#999' }}>⌂</span><span style={{ color: '#ccc' }}>{r.location}</span></div>}
          {r.website && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: bs }}><span style={{ color: '#999' }}>⌘</span><span style={{ color: '#ccc', wordBreak: 'break-all' }}>{r.website}</span></div>}

          {/* Education */}
          {r.education.length > 0 && <>
            <div style={sideSec}>Education</div>
            {r.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <strong style={{ fontSize: 12, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 }}>{e.degree}</strong>
                <div style={{ fontSize: 10, color: '#999' }}>{e.school}</div>
                <div style={{ fontSize: 10, color: '#777' }}>{e.endDate}</div>
              </div>
            ))}
          </>}

          {/* Skills */}
          {r.skills.length > 0 && <>
            <div style={sideSec}>Skills</div>
            <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>// Professional</div>
            {r.skills.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, fontSize: bs, color: '#ccc' }}>
                <span style={{ color: '#666' }}>•</span>{s}
              </div>
            ))}
          </>}

          {/* Languages */}
          {r.languages.length > 0 && <>
            <div style={sideSec}>Languages</div>
            {r.languages.map((l: any, i) => <div key={i} style={{ fontSize: bs, color: '#ccc', marginBottom: 4 }}>{l.language} — {l.level}</div>)}
          </>}
        </aside>

        {/* RIGHT main content */}
        <main style={{ padding: '0 40px 40px' }}>
          {r.summary && <>
            <div style={mainSec}>Profile</div>
            <p style={{ margin: 0, color: '#555', lineHeight: 1.7 }}>{r.summary}</p>
          </>}

          {r.experience.length > 0 && <>
            <div style={mainSec}>Work Experience</div>
            {r.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <strong style={{ fontSize: 12, color: '#222', textTransform: 'uppercase', letterSpacing: 0.5 }}>{e.title}</strong>
                  <span style={{ fontSize: 10, color: '#bbb' }}>|</span>
                  <span style={{ fontSize: 10, color: '#999' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                </div>
                <div style={{ fontSize: 10, color: '#888', marginBottom: 6 }}>{e.company}{e.location ? ` | ${e.location}` : ''}</div>
                {bullets(e.description).map((x, j) => (
                  <div key={j} style={{ paddingLeft: 14, position: 'relative', color: '#555', marginBottom: 2, fontSize: bs }}>
                    <span style={{ position: 'absolute', left: 0, color: '#999' }}>•</span>{x}
                  </div>
                ))}
              </div>
            ))}
          </>}

          {r.certifications.length > 0 && <>
            <div style={mainSec}>Certifications</div>
            {r.certifications.map((c: any, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <strong style={{ fontSize: 12, color: '#222' }}>{c.name}</strong>
                {c.date && <span style={{ fontSize: 10, color: '#999' }}> — {c.date}</span>}
              </div>
            ))}
          </>}

          {r.projects.length > 0 && <>
            <div style={mainSec}>Projects</div>
            {r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 8 }}><strong style={{ fontSize: 12, color: '#222' }}>{p.name}</strong>{p.tech && <span style={{ color: '#999' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#555', marginTop: 2 }}>{p.description}</div>}</div>)}
          </>}
        </main>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// SHOWCASE — Photo header, 3-col info row, 2-col body
// Fonts: Cormorant Garamond 700 + Open Sans 400 | 11px / 13px
// ────────────────────────────────────────────────────────────
function ShowcaseTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#222'
  const h = "'Cormorant Garamond', Georgia, serif"
  const b = "'Open Sans', 'Segoe UI', sans-serif"
  const bs = 11
  const sec: React.CSSProperties = { fontFamily: h, fontSize: 14, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#222', marginBottom: 12, marginTop: 0, paddingBottom: 6, borderBottom: '2px solid #222' }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#333', lineHeight: 1.55, background: '#fff', minHeight: 1123 }}>
      {/* Header banner */}
      <div style={{ background: '#e8e4e0', height: 80, position: 'relative' }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }} />}
      </div>

      {/* Name + role */}
      <header style={{ textAlign: 'center', padding: r.photo ? '48px 52px 10px' : '20px 52px 10px' }}>
        <h1 style={{ fontFamily: h, fontSize: 34, margin: 0, color: '#222', letterSpacing: 5 }}>
          <span style={{ fontWeight: 300 }}>{r.name.split(' ')[0]}</span>{' '}
          <span style={{ fontWeight: 700 }}>{r.name.split(' ').slice(1).join(' ')}</span>
        </h1>
        <div style={{ fontFamily: b, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#999', marginTop: 4 }}>{r.role}</div>
      </header>

      {/* Profile pill heading + summary */}
      <div style={{ textAlign: 'center', margin: '12px 52px 0' }}>
        <span style={{ fontFamily: h, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', padding: '4px 18px', border: '1.5px solid #222', display: 'inline-block' }}>Profile</span>
      </div>
      {r.summary && <p style={{ margin: '12px 52px 0', color: '#555', lineHeight: 1.7, textAlign: 'center', fontSize: bs }}>{r.summary}</p>}

      {/* Three-column info row: Contact | Education | Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, margin: '20px 40px 0', borderTop: '1.5px solid #222', borderBottom: '1.5px solid #222' }}>
        <div style={{ padding: '16px 14px', borderRight: '1px solid #ddd' }}>
          <div style={{ ...sec, fontSize: 12 }}>Contacts</div>
          {r.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: bs }}><span style={{ fontSize: 10, color: '#999' }}>✆</span>{r.phone}</div>}
          {r.email && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: bs }}><span style={{ fontSize: 10, color: '#999' }}>✉</span>{r.email}</div>}
          {r.location && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: bs }}><span style={{ fontSize: 10, color: '#999' }}>⌂</span>{r.location}</div>}
          {r.website && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: bs }}><span style={{ fontSize: 10, color: '#999' }}>⌘</span>{r.website}</div>}
        </div>
        <div style={{ padding: '16px 14px', borderRight: '1px solid #ddd' }}>
          <div style={{ ...sec, fontSize: 12 }}>Education</div>
          {r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ fontSize: 12, color: '#222', textTransform: 'uppercase' }}>{e.degree}</strong><div style={{ fontSize: 10, color: '#888' }}>{e.school}</div><div style={{ fontSize: 10, color: '#aaa' }}>{e.endDate}</div></div>)}
        </div>
        <div style={{ padding: '16px 14px' }}>
          <div style={{ ...sec, fontSize: 12 }}>Skills</div>
          {r.skills.map((s, i) => <div key={i} style={{ fontSize: bs, color: '#555', marginBottom: 4 }}>• {s}</div>)}
        </div>
      </div>

      {/* Two-column bottom: Experience | Awards+Certifications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: '0 44px 40px' }}>
        <div>
          {r.experience.length > 0 && <>
            <div style={{ ...sec, marginTop: 20 }}>Work Experience</div>
            {r.experience.map((e, i) => <div key={i} style={{ marginBottom: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 12, color: '#222' }}>{e.title}</strong><span style={{ fontSize: 10, color: '#999' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span></div><div style={{ fontSize: 10, color: '#888', marginBottom: 4 }}>{e.company}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ paddingLeft: 12, position: 'relative', color: '#555', marginBottom: 2 }}><span style={{ position: 'absolute', left: 0 }}>•</span>{x}</div>)}</div>)}
          </>}
        </div>
        <div>
          {r.certifications.length > 0 && <>
            <div style={{ ...sec, marginTop: 20 }}>Awards</div>
            {r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 8 }}><strong style={{ fontSize: 12, color: '#222' }}>{c.name}</strong>{c.date && <div style={{ fontSize: 10, color: '#999' }}>{c.date}</div>}</div>)}
          </>}
          {r.languages.length > 0 && <>
            <div style={{ ...sec, marginTop: 20 }}>Languages</div>
            {r.languages.map((l: any, i) => <div key={i} style={{ fontSize: bs, color: '#555', marginBottom: 4 }}>{l.language} — {l.level}</div>)}
          </>}
          {r.projects.length > 0 && <>
            <div style={{ ...sec, marginTop: 20 }}>Projects</div>
            {r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 8 }}><strong style={{ fontSize: 12, color: '#222' }}>{p.name}</strong>{p.tech && <span style={{ color: '#999' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#555', marginTop: 2 }}>{p.description}</div>}</div>)}
          </>}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// DIRECTOR — Bold header with vertical bar, circle section icons
// Fonts: Outfit 700 + DM Sans 400 | 11px / 13px
// ────────────────────────────────────────────────────────────
function DirectorTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#222'
  const h = "'Outfit', sans-serif"
  const b = "'DM Sans', sans-serif"
  const bs = 11
  const icon = (letter: string): React.CSSProperties => ({ width: 26, height: 26, borderRadius: '50%', background: ac, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: h, flexShrink: 0 })
  const sec = (letter: string, label: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 28, marginBottom: 14 }}>
      <span style={icon(letter)}>{letter}</span>
      <span style={{ fontFamily: h, fontSize: 14, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#222' }}>{label}</span>
      <span style={{ flex: 1, height: 2, background: '#222' }} />
    </div>
  )
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#333', lineHeight: 1.55, background: '#f8f8f6', minHeight: 1123, padding: '40px 44px' }}>
      {/* Header: name | role | contact */}
      <header style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 12, paddingBottom: 16, borderBottom: '1px solid #ddd' }}>
        <div style={{ flex: '0 0 auto', paddingRight: 20, borderRight: `3px solid ${ac}` }}>
          <h1 style={{ fontFamily: h, fontSize: 32, margin: 0, color: '#111', fontWeight: 900, lineHeight: 1.1 }}>{r.name.toUpperCase()}</h1>
        </div>
        <div style={{ paddingLeft: 16, paddingRight: 20, flex: 1 }}>
          {r.role && <div style={{ fontFamily: h, fontSize: 12, fontWeight: 700, color: '#444', letterSpacing: 1, lineHeight: 1.4, textTransform: 'uppercase' }}>{r.role}</div>}
        </div>
        <div style={{ textAlign: 'right', fontSize: 10, color: '#666', lineHeight: 1.8, whiteSpace: 'nowrap' }}>
          {r.phone && <div>P: {r.phone}</div>}
          {r.email && <div>E: {r.email}</div>}
          {r.location && <div>A: {r.location}</div>}
        </div>
      </header>

      {/* Summary */}
      {r.summary && <p style={{ margin: '0 0 4px', color: '#555', lineHeight: 1.7 }}>{r.summary}</p>}
      {r.photo && <div style={{ textAlign: 'center', marginBottom: 4 }}><img src={r.photo} alt="" style={{ width: 0, height: 0 }} /></div>}

      {/* Education: 2-column */}
      {r.education.length > 0 && <>
        {sec('E', 'Education')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ fontSize: 12, color: '#222', textTransform: 'uppercase' }}>{e.degree}</strong><div style={{ fontSize: 10, color: '#888' }}>{e.school} | {e.endDate}</div></div>)}
        </div>
      </>}

      {/* Work Experience: 2-column */}
      {r.experience.length > 0 && <>
        {sec('W', 'Work Experience')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {r.experience.map((e, i) => <div key={i} style={{ marginBottom: 14 }}><strong style={{ fontSize: 12, color: '#111', textTransform: 'uppercase' }}>{e.title}</strong><div style={{ fontSize: 10, color: '#888', marginBottom: 4, textTransform: 'uppercase' }}>{e.company} | {e.startDate} – {e.current ? 'Present' : e.endDate}</div>{bullets(e.description).map((x, j) => <div key={j} style={{ color: '#555', marginBottom: 2 }}>{x}</div>)}</div>)}
        </div>
      </>}

      {/* Awards + Skills side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          {r.certifications.length > 0 && <>
            {sec('A', 'Awards')}
            {r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 10 }}><strong style={{ fontSize: 12, color: '#222', textTransform: 'uppercase' }}>{c.name}</strong>{c.date && <div style={{ fontSize: 10, color: '#888' }}>{c.date}</div>}</div>)}
          </>}
          {r.projects.length > 0 && <>
            {sec('P', 'Projects')}
            {r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 8 }}><strong style={{ fontSize: 12, color: '#222' }}>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ color: '#555', marginTop: 2 }}>{p.description}</div>}</div>)}
          </>}
        </div>
        <div>
          {r.skills.length > 0 && <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 28, marginBottom: 14 }}>
              <span style={{ fontFamily: h, fontSize: 14, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#222' }}>Skills & Languages</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {r.skills.map((s, i) => <div key={i} style={{ fontSize: bs, padding: '4px 0', borderBottom: '1px solid #ddd', color: '#444', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s}</div>)}
            </div>
            {r.languages.length > 0 && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 12 }}>
              {r.languages.map((l: any, i) => <div key={i} style={{ fontSize: bs, padding: '4px 0', borderBottom: '1px solid #ddd', color: '#444', textTransform: 'uppercase' }}>{l.language}</div>)}
            </div>}
          </>}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// VIVID — Bold yellow creative portfolio style
// Fonts: Outfit 900 + DM Sans 400 | 11px / 14px
// ────────────────────────────────────────────────────────────
function VividTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ac = r.customColor || '#eab308'
  const h = "'Outfit', sans-serif"
  const b = "'DM Sans', sans-serif"
  const bs = 11
  const cardSec: React.CSSProperties = { fontFamily: h, fontSize: 16, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', color: '#111', marginBottom: 14 }
  return (
    <div style={{ fontFamily: b, fontSize: bs, color: '#222', lineHeight: 1.55, background: ac, minHeight: 1123 }}>
      {/* Header */}
      <header style={{ padding: '32px 40px 24px', display: 'flex', alignItems: 'flex-start', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: h, fontSize: 36, fontWeight: 900, margin: 0, color: '#111', lineHeight: 1.1 }}>{r.name.toUpperCase()}</h1>
          <div style={{ fontFamily: h, fontSize: 14, fontWeight: 700, color: '#333', letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>{r.role}</div>
          {r.summary && <p style={{ margin: '10px 0 0', color: '#333', lineHeight: 1.6, fontSize: bs, maxWidth: 280, fontStyle: 'italic' }}>{r.summary.slice(0, 150)}{r.summary.length > 150 ? '...' : ''}</p>}
        </div>
        {r.photo && <img src={r.photo} alt="" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4, border: '3px solid #fff', flexShrink: 0 }} />}
        <div style={{ fontSize: 10, color: '#333', lineHeight: 2, whiteSpace: 'nowrap' }}>
          {r.phone && <div>✆ {r.phone}</div>}
          {r.email && <div>✉ {r.email}</div>}
          {r.website && <div>⌘ {r.website}</div>}
          {r.location && <div>◉ {r.location}</div>}
        </div>
      </header>

      {/* White card: "WHO AM I?" + "EXPERT IN" */}
      <div style={{ margin: '0 20px', background: '#fff', borderRadius: 6, padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <div style={cardSec}>Who Am I?</div>
          {r.summary && <p style={{ margin: 0, color: '#555', lineHeight: 1.7, fontSize: bs }}>{r.summary}</p>}
        </div>
        <div>
          <div style={cardSec}>Expert In</div>
          {r.skills.slice(0, 5).map((s, i) => {
            const pct = 60 + Math.round(Math.random() * 35)
            return (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: '#333', marginBottom: 2 }}><span>{s}</span><span>{pct}%</span></div>
                <div style={{ height: 6, background: '#e5e5e5', borderRadius: 3 }}><div style={{ height: 6, background: ac, borderRadius: 3, width: `${pct}%` }} /></div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Education + Experience side by side in bordered cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '16px 20px' }}>
        <div style={{ background: '#fff', borderRadius: 6, padding: '20px 24px' }}>
          <div style={cardSec}>Education</div>
          {r.education.map((e, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, marginBottom: 12 }}>
              <div><div style={{ fontSize: 10, fontWeight: 700, color: '#333' }}>{e.endDate}</div><div style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>{e.school}</div></div>
              <div><strong style={{ fontSize: 12, color: '#111' }}>{e.degree}</strong></div>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 6, padding: '20px 24px' }}>
          <div style={cardSec}>Experience</div>
          {r.experience.map((e, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, marginBottom: 12 }}>
              <div><div style={{ fontSize: 10, fontWeight: 700, color: '#333' }}>{e.startDate}–{e.current ? 'Now' : e.endDate}</div><div style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>{e.company}</div></div>
              <div><strong style={{ fontSize: 12, color: '#111' }}>{e.title}</strong>{bullets(e.description).length > 0 && <div style={{ color: '#555', marginTop: 2, fontSize: bs }}>{bullets(e.description)[0]}</div>}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: certifications + interests as tags */}
      <div style={{ margin: '0 20px', background: '#fff', borderRadius: 6, padding: '20px 24px', marginBottom: 16 }}>
        {r.certifications.length > 0 && <>
          <div style={cardSec}>Achievements</div>
          {r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 6 }}><strong style={{ fontSize: 12, color: '#222' }}>{c.name}</strong>{c.date && <span style={{ color: '#999' }}> — {c.date}</span>}</div>)}
        </>}
        {r.projects.length > 0 && <>
          <div style={{ ...cardSec, marginTop: 16 }}>Projects</div>
          {r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 6 }}><strong style={{ fontSize: 12, color: '#222' }}>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}</div>)}
        </>}
      </div>

      {/* Skill/Interest tags at very bottom */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 20px 28px', justifyContent: 'center' }}>
        {r.skills.map((s, i) => <span key={i} style={{ fontSize: 10, padding: '6px 16px', borderRadius: 4, background: '#fff', color: '#222', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s}</span>)}
        {r.languages.map((l: any, i) => <span key={`l${i}`} style={{ fontSize: 10, padding: '6px 16px', borderRadius: 4, background: '#111', color: '#fff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{l.language}</span>)}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// MODERN SIDEBAR — Green accent, sidebar with contact/skills/education
// Fonts: Source Sans 3 / Segoe UI | 10.5–13px
// ────────────────────────────────────────────────────────────
function ModernSidebarTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const accent = r.customColor || '#2D8C6F'
  const dark = '#1A1A2E'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sideHead: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, color: accent, letterSpacing: 2, textTransform: 'uppercase', borderBottom: `1.5px solid ${accent}`, paddingBottom: 3, marginTop: 14, marginBottom: 8 }
  const mainHead: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: dark, letterSpacing: 3, textTransform: 'uppercase', borderBottom: `1.5px solid ${accent}`, paddingBottom: 4, marginTop: 16, marginBottom: 10 }
  return (
    <div style={{ fontFamily: f, color: '#333', lineHeight: 1.5, background: '#fff', minHeight: 1123 }}>
      {/* Header */}
      <div style={{ borderBottom: `3px solid ${accent}`, padding: '20px 28px 14px' }}>
        <h1 style={{ fontSize: 30, letterSpacing: 4, color: dark, margin: 0, textTransform: 'uppercase', fontWeight: 800 }}>{r.name}</h1>
        <div style={{ fontSize: 14, color: accent, marginTop: 2 }}>{r.role}</div>
      </div>

      {/* Layout: sidebar + main */}
      <div style={{ display: 'flex', gap: 24, padding: '0 28px 40px' }}>
        {/* Sidebar */}
        <div style={{ width: 200, flexShrink: 0, background: '#F0F5F3', borderRadius: 6, padding: 14, marginTop: 14 }}>
          {r.photo && <img src={r.photo} alt="" style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', display: 'block', border: `2px solid ${accent}` }} />}

          <div style={{ ...sideHead, marginTop: 0 }}>Contact</div>
          {r.email && <div style={{ fontSize: 10.5, color: '#555', marginBottom: 4 }}>{r.email}</div>}
          {r.phone && <div style={{ fontSize: 10.5, color: '#555', marginBottom: 4 }}>{r.phone}</div>}
          {r.location && <div style={{ fontSize: 10.5, color: '#555', marginBottom: 4 }}>{r.location}</div>}
          {r.website && <div style={{ fontSize: 10.5, color: accent, marginBottom: 4 }}>{r.website}</div>}

          {r.skills.length > 0 && <>
            <div style={sideHead}>Skills</div>
            {r.skills.map((s, i) => <div key={i} style={{ fontSize: 10.5, color: '#555', marginBottom: 4, display: 'flex', alignItems: 'baseline', gap: 5 }}><span style={{ color: accent, fontSize: 8, flexShrink: 0 }}>●</span>{s}</div>)}
          </>}

          {r.certifications.length > 0 && <>
            <div style={sideHead}>Certifications</div>
            {r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10, color: '#555', marginBottom: 6 }}>{c.name}{c.date ? ` (${c.date})` : ''}</div>)}
          </>}

          {r.education.length > 0 && <>
            <div style={sideHead}>Education</div>
            {r.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#222' }}>{e.degree}</div>
                <div style={{ fontSize: 10, color: '#666' }}>{e.school}</div>
                <div style={{ fontSize: 10, color: accent }}>{e.endDate}</div>
              </div>
            ))}
          </>}

          {r.languages.length > 0 && <>
            <div style={sideHead}>Languages</div>
            {r.languages.map((l: any, i) => <div key={i} style={{ fontSize: 10.5, color: '#555', marginBottom: 4, display: 'flex', alignItems: 'baseline', gap: 5 }}><span style={{ color: accent, fontSize: 8, flexShrink: 0 }}>●</span>{l.language} — {l.level}</div>)}
          </>}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0, paddingTop: 14 }}>
          {r.summary && <>
            <div style={{ ...mainHead, marginTop: 0 }}>Profile</div>
            <div style={{ fontSize: 11, color: '#555' }}>{r.summary}</div>
          </>}

          {r.experience.length > 0 && <>
            <div style={mainHead}>Experience</div>
            {r.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: dark, marginTop: i > 0 ? 10 : 0 }}>{e.title}</div>
                <div style={{ fontSize: 11 }}>
                  <span style={{ color: accent, fontWeight: 600 }}>{e.company}</span>
                  {e.location && <span style={{ color: '#aaa' }}> | {e.location}</span>}
                </div>
                <div style={{ fontSize: 10.5, color: '#aaa', fontStyle: 'italic' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</div>
                {bullets(e.description).length > 0 && (
                  <div style={{ marginTop: 5, paddingLeft: 14 }}>
                    {bullets(e.description).map((b, j) => (
                      <div key={j} style={{ fontSize: 10.5, color: '#555', marginBottom: 3, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: -12, color: accent }}>▸</span>{b}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>}

          {r.projects.length > 0 && <>
            <div style={mainHead}>Projects</div>
            {r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 8 }}><strong style={{ fontSize: 12, color: dark }}>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ fontSize: 10.5, color: '#555', marginTop: 2 }}>{p.description}</div>}</div>)}
          </>}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// CORAL HORIZON — Warm coral gradient header, two-column body
// Fonts: Source Sans 3 / Segoe UI | 10.5–12.5px
// ────────────────────────────────────────────────────────────
function CoralHorizonTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const coral = r.customColor || '#E8634A'
  const sand = '#FFF8F5'
  const stone = '#4A4A4A'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const secTitle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: coral, letterSpacing: 3, textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }
  const sideHead: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: coral, letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 14, marginBottom: 6 }
  return (
    <div style={{ fontFamily: f, color: '#3D3D3D', lineHeight: 1.55, background: '#fff', minHeight: 1123 }}>
      {/* Gradient header */}
      <header style={{ background: `linear-gradient(135deg, ${coral}, #F4845F)`, padding: '24px 28px', borderRadius: '0', color: '#fff' }}>
        {r.photo && <img src={r.photo} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)', float: 'right', marginLeft: 12 }} />}
        <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: 3, margin: 0, textTransform: 'uppercase', color: '#fff' }}>{r.name}</h1>
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, marginTop: 4, letterSpacing: 1 }}>{r.role}</div>
        <div style={{ fontSize: 10, opacity: 0.8, marginTop: 10 }}>
          {[r.email, r.phone, r.location, r.website].filter(Boolean).join('  ·  ')}
        </div>
      </header>

      {/* Body */}
      <div style={{ padding: '4px 28px 40px' }}>
        {r.summary && <>
          <div style={{ ...secTitle, marginTop: 16 }}>Summary</div>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{r.summary}</div>
        </>}

        {/* Two-column: experience left, sidebar right */}
        <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
          {/* Left: experience */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {r.experience.length > 0 && <>
              <div style={{ ...secTitle, marginTop: 0 }}>Experience</div>
              {r.experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: stone, marginTop: i > 0 ? 10 : 0 }}>{e.title}</div>
                  <div style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between' }}>
                    <span><span style={{ color: coral, fontWeight: 600 }}>{e.company}</span>{e.location && <span style={{ color: '#bbb' }}>, {e.location}</span>}</span>
                    <span style={{ color: '#bbb', fontStyle: 'italic' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                  </div>
                  {bullets(e.description).length > 0 && (
                    <div style={{ marginTop: 4, paddingLeft: 14 }}>
                      {bullets(e.description).map((b, j) => (
                        <div key={j} style={{ fontSize: 10.5, color: '#666', marginBottom: 3, position: 'relative' }}>
                          <span style={{ position: 'absolute', left: -10, color: coral }}>•</span>{b}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>}

            {r.projects.length > 0 && <>
              <div style={secTitle}>Projects</div>
              {r.projects.map((p: any, i) => <div key={i} style={{ marginBottom: 6 }}><strong style={{ fontSize: 11, color: stone }}>{p.name}</strong>{p.tech && <span style={{ color: '#888' }}> ({p.tech})</span>}{p.description && <div style={{ fontSize: 10.5, color: '#666', marginTop: 2 }}>{p.description}</div>}</div>)}
            </>}
          </div>

          {/* Right sidebar */}
          <div style={{ width: 190, flexShrink: 0, background: sand, borderRadius: 6, padding: 14 }}>
            {r.skills.length > 0 && <>
              <div style={{ ...sideHead, marginTop: 0 }}>Skills</div>
              {r.skills.map((s, i) => <div key={i} style={{ fontSize: 10, color: '#666', padding: '3px 0', borderBottom: i < r.skills.length - 1 ? '1px solid #F0E8E5' : 'none' }}>{s}</div>)}
            </>}

            {r.education.length > 0 && <>
              <div style={sideHead}>Education</div>
              {r.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: stone }}>{e.degree}</div>
                  <div style={{ fontSize: 10, color: '#888' }}>{e.school}</div>
                  <div style={{ fontSize: 10, color: coral }}>{e.endDate}</div>
                </div>
              ))}
            </>}

            {r.certifications.length > 0 && <>
              <div style={sideHead}>Certifications</div>
              {r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10, color: '#888', marginBottom: 5 }}>{c.name}</div>)}
            </>}

            {r.languages.length > 0 && <>
              <div style={sideHead}>Languages</div>
              {r.languages.map((l: any, i) => <div key={i} style={{ fontSize: 10, color: '#666', padding: '3px 0', borderBottom: i < r.languages.length - 1 ? '1px solid #F0E8E5' : 'none' }}>{l.language} — {l.level}</div>)}
            </>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// SWISS GRID — Bold black + red, grid layout with monospace dates
// Fonts: Source Sans 3 / Segoe UI | 10–12px
// ────────────────────────────────────────────────────────────
function SwissGridTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const red = r.customColor || '#FF0000'
  const blk = '#111'
  const gray = '#888'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const mono = "'IBM Plex Mono', 'Courier New', monospace"
  const secTitle: React.CSSProperties = { fontSize: 10, fontWeight: 900, color: blk, letterSpacing: 4, textTransform: 'uppercase', marginTop: 20, marginBottom: 8, paddingTop: 4, borderTop: '1px solid #ddd' }
  return (
    <div style={{ fontFamily: f, color: '#222', lineHeight: 1.5, background: '#fff', minHeight: 1123, padding: '28px 32px' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `3px solid ${blk}`, paddingBottom: 12, marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: blk, margin: 0, lineHeight: 1, textTransform: 'uppercase' }}>{r.name}</h1>
          <div style={{ fontSize: 13, color: red, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 }}>{r.role}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 10.5, color: gray, lineHeight: 1.6 }}>
          {r.email && <div>{r.email}</div>}
          {r.phone && <div>{r.phone}</div>}
          {r.location && <div>{r.location}</div>}
          {r.website && <div>{r.website}</div>}
        </div>
      </header>

      {/* Profile */}
      {r.summary && <>
        <div style={{ ...secTitle, marginTop: 0, borderTop: 'none' }}>Profile</div>
        <div style={{ fontSize: 11, color: '#555' }}>{r.summary}</div>
      </>}

      {/* Experience — grid layout */}
      {r.experience.length > 0 && <>
        <div style={secTitle}>Experience</div>
        {r.experience.map((e, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '2px 16px', marginTop: i > 0 ? 10 : 0 }}>
            <div style={{ fontSize: 10, color: gray, fontFamily: mono, paddingTop: 2 }}>{e.startDate} – {e.current ? 'Now' : e.endDate}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: blk, textTransform: 'uppercase' }}>{e.title}</div>
              <div style={{ fontSize: 11 }}>
                <span style={{ color: red, fontWeight: 600 }}>{e.company}</span>
                {e.location && <span style={{ color: gray, fontWeight: 400 }}> · {e.location}</span>}
              </div>
              {bullets(e.description).length > 0 && (
                <div style={{ margin: '4px 0 10px', paddingLeft: 14 }}>
                  {bullets(e.description).map((b, j) => (
                    <div key={j} style={{ fontSize: 10.5, color: '#555', marginBottom: 2, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: -12, color: red, fontSize: 6, top: 4 }}>■</span>{b}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </>}

      {/* Education — grid layout */}
      {r.education.length > 0 && <>
        <div style={secTitle}>Education</div>
        {r.education.map((e, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '2px 16px', marginBottom: 6 }}>
            <div style={{ fontSize: 10, color: gray, fontFamily: mono }}>{e.endDate}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 11.5, color: blk }}>{e.degree}</div>
              <div style={{ fontSize: 11, color: '#555' }}>{e.school}</div>
            </div>
          </div>
        ))}
      </>}

      {/* Skills — two-column with arrows */}
      {r.skills.length > 0 && <>
        <div style={secTitle}>Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
          {r.skills.map((s, i) => (
            <div key={i} style={{ fontSize: 10, color: '#555', padding: '4px 0', width: '50%' }}>
              <span style={{ color: red, fontWeight: 700 }}>→ </span>{s}
            </div>
          ))}
        </div>
      </>}

      {/* Certifications */}
      {r.certifications.length > 0 && <>
        <div style={secTitle}>Certifications</div>
        {r.certifications.map((c: any, i) => (
          <div key={i} style={{ fontSize: 10.5, color: '#555', marginBottom: 3 }}>
            <span style={{ color: red, fontSize: 6 }}>■ </span>{c.name}{c.date ? ` (${c.date})` : ''}
          </div>
        ))}
      </>}

      {/* Languages */}
      {r.languages.length > 0 && <>
        <div style={secTitle}>Languages</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
          {r.languages.map((l: any, i) => (
            <div key={i} style={{ fontSize: 10, color: '#555', padding: '4px 0', width: '50%' }}>
              <span style={{ color: red, fontWeight: 700 }}>→ </span>{l.language} — {l.level}
            </div>
          ))}
        </div>
      </>}
    </div>
  )
}

// Templates 9-14 converted to inline styles

// T9: OCEAN BREEZE
function OceanBreezeTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const sky = r.customColor || '#0EA5E9'; const deep = '#0C4A6E'; const foam = '#F0F9FF'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sec: React.CSSProperties = { display: 'inline-block', fontSize: 10.5, fontWeight: 700, color: deep, letterSpacing: 3, textTransform: 'uppercase', margin: '20px 0 10px', background: foam, padding: '4px 14px', borderRadius: 20 }
  return (
    <div style={{ fontFamily: f, color: '#334155', lineHeight: 1.55, background: '#fff', minHeight: 1123, padding: '28px 32px' }}>
      <header style={{ textAlign: 'center', paddingBottom: 16, marginBottom: 16, borderBottom: `2px solid ${sky}` }}>
        <h1 style={{ fontSize: 32, fontWeight: 300, color: deep, margin: 0, letterSpacing: 4, textTransform: 'uppercase' }}>{r.name}</h1>
        <div style={{ fontSize: 14, color: sky, fontWeight: 600, marginTop: 4 }}>{r.role}</div>
        <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 8 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).join('  ·  ')}</div>
      </header>
      {r.summary && <><div style={sec}>Summary</div><div style={{ fontSize: 11, color: '#64748B', padding: '10px 0' }}>{r.summary}</div></>}
      {r.experience.length > 0 && <><div style={sec}>Experience</div>
        {r.experience.map((e, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 16px', marginTop: 10, borderLeft: `3px solid ${sky}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: deep }}>{e.title}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span><span style={{ color: sky, fontWeight: 600 }}>{e.company}</span>{e.location && <span style={{ color: '#CBD5E1' }}> · {e.location}</span>}</span><span style={{ color: '#94A3B8' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span></div>
            {bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#64748B', marginTop: 3, paddingLeft: 12, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: sky }}>•</span>{b}</div>)}
          </div>))}
      </>}
      {r.education.length > 0 && <><div style={sec}>Education</div>
        {r.education.map((e, i) => (
          <div key={i} style={{ background: foam, borderRadius: 6, padding: '10px 14px', marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, fontSize: 11.5, color: deep }}>{e.degree}</span><span style={{ color: '#94A3B8', fontSize: 10 }}>{e.endDate}</span></div>
            <div style={{ fontSize: 11, color: sky }}>{e.school}</div>
          </div>))}
      </>}
      {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ background: foam, color: deep, fontSize: 10, padding: '4px 12px', borderRadius: 20, fontWeight: 600, border: '1px solid #BAE6FD' }}>{s}</span>)}</div></>}
      {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10.5, color: '#64748B', marginBottom: 4, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: sky, fontSize: 8, top: 2 }}>✦</span>{c.name}</div>)}</>}
    </div>)
}

// T10: MONOCHROME EDITORIAL
function MonochromeEditorialTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const blk = '#0a0a0a'; const mid = '#6b6b6b'; const lt = '#a0a0a0'; const rule = '#d4d4d4'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sec: React.CSSProperties = { fontSize: 9, fontWeight: 800, color: blk, letterSpacing: 5, textTransform: 'uppercase', borderTop: `1px solid ${rule}`, borderBottom: `1px solid ${rule}`, padding: '5px 0', margin: '18px 0 10px', textAlign: 'center' }
  return (
    <div style={{ fontFamily: f, color: '#1a1a1a', lineHeight: 1.55, background: '#fff', minHeight: 1123, padding: '28px 32px' }}>
      <header style={{ borderBottom: `4px double ${blk}`, paddingBottom: 14, marginBottom: 16, textAlign: 'center' }}>
        <h1 style={{ fontSize: 38, fontWeight: 300, color: blk, margin: 0, letterSpacing: 8, textTransform: 'uppercase' }}>{r.name}</h1>
        <div style={{ height: 1, background: blk, margin: '8px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: 10, color: mid, textTransform: 'uppercase', letterSpacing: 2 }}>{[r.email, r.phone, r.location].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}</div>
        <div style={{ fontSize: 12, color: mid, fontStyle: 'italic', marginTop: 6 }}>{r.role}</div>
      </header>
      {r.summary && <><div style={sec}>Profile</div><div style={{ fontSize: 11, color: mid, textAlign: 'justify', fontStyle: 'italic' }}>{r.summary}</div></>}
      {r.experience.length > 0 && <><div style={sec}>Experience</div>
        {r.experience.map((e, i) => (
          <div key={i} style={{ marginTop: 12, paddingBottom: 10, borderBottom: i < r.experience.length - 1 ? `1px dotted ${rule}` : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><span style={{ fontSize: 13, fontWeight: 700, color: blk }}>{e.title}</span><span style={{ fontSize: 10, color: lt, fontStyle: 'italic' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span></div>
            <div style={{ fontSize: 11, color: mid }}>{e.company}{e.location && <span style={{ color: lt }}> · {e.location}</span>}</div>
            {bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: mid, marginTop: 3, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: lt }}>—</span>{b}</div>)}
          </div>))}
      </>}
      {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginTop: 8 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, fontSize: 11.5, color: blk }}>{e.degree}</span><span style={{ fontSize: 10, color: lt, fontStyle: 'italic' }}>{e.endDate}</span></div><div style={{ fontSize: 11, color: mid }}>{e.school}</div></div>)}</>}
      {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ fontSize: 10.5, color: mid, textAlign: 'center', marginTop: 6 }}>{r.skills.join(' / ')}</div></>}
      {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10.5, color: mid, textAlign: 'center', marginBottom: 3 }}>{c.name}</div>)}</>}
    </div>)
}

// T11: MIDNIGHT LUXE
function MidnightLuxeTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const gold = r.customColor || '#C9A96E'; const cream = '#E8DCC8'; const dim = '#7A7A8E'; const bg = '#1A1A2E'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sec: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: gold, letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center', margin: '22px 0 10px' }
  return (
    <div style={{ fontFamily: f, color: '#D4C5A9', lineHeight: 1.55, background: bg, minHeight: 1123, padding: '30px 34px', borderRadius: 4 }}>
      <h1 style={{ fontSize: 30, fontWeight: 300, color: cream, letterSpacing: 10, textTransform: 'uppercase', textAlign: 'center', margin: 0 }}>{r.name}</h1>
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, margin: '10px 60px' }} />
      <div style={{ textAlign: 'center', fontSize: 13, color: gold, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>{r.role}</div>
      <div style={{ textAlign: 'center', fontSize: 10, color: dim, margin: '10px 0 20px', letterSpacing: 1 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).join('  |  ')}</div>
      {r.summary && <><div style={sec}>About</div><div style={{ fontSize: 11, color: dim, textAlign: 'center', fontStyle: 'italic', padding: '0 20px' }}>{r.summary}</div></>}
      {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i}><div style={{ fontSize: 13, fontWeight: 700, color: cream, marginTop: 14 }}>{e.title}</div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span><span style={{ color: gold }}>{e.company}</span>{e.location && <span style={{ color: dim }}> · {e.location}</span>}</span><span style={{ color: dim, fontStyle: 'italic' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span></div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#9A9AAE', marginTop: 3, paddingLeft: 16, position: 'relative' }}><span style={{ position: 'absolute', left: 4, color: gold }}>•</span>{b}</div>)}</div>)}</>}
      {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i}><div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}><span style={{ fontWeight: 700, fontSize: 11.5, color: cream }}>{e.degree}</span><span style={{ color: dim, fontStyle: 'italic', fontSize: 10 }}>{e.endDate}</span></div><div style={{ fontSize: 11, color: gold }}>{e.school}</div></div>)}</>}
      {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 8 }}>{r.skills.map((s, i) => <span key={i} style={{ border: '1px solid #333355', color: gold, fontSize: 9.5, padding: '3px 10px', borderRadius: 2, letterSpacing: 0.5 }}>{s}</span>)}</div></>}
      {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10.5, color: '#9A9AAE', textAlign: 'center', marginBottom: 4 }}>{c.name}</div>)}</>}
    </div>)
}

// T12: FOREST CANOPY
function ForestCanopyTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const pine = r.customColor || '#2D5016'; const moss = '#6B8F4E'; const leaf = '#A8C686'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sec: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: pine, letterSpacing: 3, textTransform: 'uppercase', margin: '20px 0 8px', paddingBottom: 4, borderBottom: `2px solid ${leaf}` }
  return (
    <div style={{ fontFamily: f, color: '#2D3B2D', lineHeight: 1.55, background: '#fff', minHeight: 1123, padding: '28px 32px' }}>
      <header style={{ borderLeft: `5px solid ${pine}`, paddingLeft: 18, marginBottom: 18 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: pine, margin: 0 }}>{r.name}</h1>
        <div style={{ fontSize: 13, color: moss, fontWeight: 600, marginTop: 2 }}>{r.role}</div>
        <div style={{ fontSize: 10.5, color: '#8A8A7A', marginTop: 6 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).join(' · ')}</div>
      </header>
      {r.summary && <><div style={sec}>Summary</div><div style={{ fontSize: 11, color: '#5A6B5A', background: '#FEFCF3', padding: '10px 14px', borderRadius: 4, border: '1px solid #E8E4D4' }}>{r.summary}</div></>}
      {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ position: 'relative', paddingLeft: 20, marginTop: 14, borderLeft: '2px solid #D4DEC8' }}><span style={{ position: 'absolute', left: -6, top: 0, color: moss, fontSize: 10, background: '#fff' }}>●</span><div style={{ fontSize: 12.5, fontWeight: 700, color: pine }}>{e.title}</div><div style={{ fontSize: 11 }}><span style={{ color: moss, fontWeight: 600 }}>{e.company}</span>{e.location && <span style={{ color: '#B0B0A0' }}> · {e.location}</span>} <span style={{ color: '#A0A090', fontStyle: 'italic' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span></div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#5A6B5A', marginTop: 3, paddingLeft: 12, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: leaf }}>•</span>{b}</div>)}</div>)}</>}
      {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginTop: 8 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, fontSize: 11.5, color: pine }}>{e.degree}</span><span style={{ color: '#A0A090', fontStyle: 'italic', fontSize: 10 }}>{e.endDate}</span></div><div style={{ fontSize: 11, color: moss }}>{e.school}</div></div>)}</>}
      {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ background: '#EDF3E5', color: pine, fontSize: 10, padding: '4px 10px', borderRadius: 4, fontWeight: 600 }}>{s}</span>)}</div></>}
      {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10.5, color: '#5A6B5A', marginBottom: 4, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: moss, fontWeight: 700, fontSize: 11 }}>✓</span>{c.name}</div>)}</>}
    </div>)
}

// T13: COPPER DECO
function CopperDecoTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const copper = r.customColor || '#B87333'; const dark = '#2C1810'; const cream = '#FFF8F0'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sec: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: dark, letterSpacing: 4, textTransform: 'uppercase', margin: '22px 0 10px', textAlign: 'center' }
  return (
    <div style={{ fontFamily: f, color: '#3E2723', lineHeight: 1.55, background: '#fff', minHeight: 1123, padding: '28px 32px' }}>
      <header style={{ textAlign: 'center', paddingBottom: 16 }}>
        <div style={{ color: copper, fontSize: 12, marginBottom: 6 }}>— ◆ —</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: dark, margin: 0, letterSpacing: 5, textTransform: 'uppercase' }}>{r.name}</h1>
        <div style={{ fontSize: 13, color: copper, letterSpacing: 2, marginTop: 4 }}>{r.role}</div>
        <div style={{ fontSize: 10, color: '#A0887A', marginTop: 8, letterSpacing: 1 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).join('  ·  ')}</div>
      </header>
      {r.summary && <><div style={sec}>◈ Summary ◈</div><div style={{ fontSize: 11, color: '#6D5D53', textAlign: 'center', borderTop: '1px solid #E8D5C4', borderBottom: '1px solid #E8D5C4', padding: '10px 16px', background: cream }}>{r.summary}</div></>}
      {r.experience.length > 0 && <><div style={sec}>◈ Experience ◈</div>{r.experience.map((e, i) => <div key={i}><div style={{ fontSize: 12.5, fontWeight: 700, color: dark, marginTop: 12 }}>{e.title}</div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span><span style={{ color: copper, fontWeight: 600 }}>{e.company}</span>{e.location && <span style={{ color: '#B0A090' }}>, {e.location}</span>}</span><span style={{ color: '#B0A090', fontStyle: 'italic' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span></div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#6D5D53', marginTop: 3, paddingLeft: 16, position: 'relative' }}><span style={{ position: 'absolute', left: 4, color: copper }}>•</span>{b}</div>)}</div>)}</>}
      {r.education.length > 0 && <><div style={sec}>◈ Education ◈</div>{r.education.map((e, i) => <div key={i} style={{ marginTop: 8 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, fontSize: 11.5, color: dark }}>{e.degree}</span><span style={{ color: '#B0A090', fontStyle: 'italic', fontSize: 10 }}>{e.endDate}</span></div><div style={{ fontSize: 11, color: copper }}>{e.school}</div></div>)}</>}
      {r.skills.length > 0 && <><div style={sec}>◈ Expertise ◈</div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px 14px', marginTop: 6 }}>{r.skills.map((s, i) => <div key={i} style={{ fontSize: 10.5, color: '#6D5D53', textAlign: 'center', padding: '3px 0', borderBottom: '1px dotted #E8D5C4' }}>{s}</div>)}</div></>}
      {r.certifications.length > 0 && <><div style={sec}>◈ Certifications ◈</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10.5, color: '#6D5D53', textAlign: 'center', marginBottom: 3 }}>{c.name}</div>)}</>}
    </div>)
}

// T14: ARCTIC FROST
function ArcticFrostTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const frost = r.customColor || '#5E81AC'; const ice = '#88C0D0'; const snow = '#ECEFF4'; const night = '#2E3440'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sideTitle: React.CSSProperties = { fontSize: 9.5, fontWeight: 700, color: frost, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8 }
  const mainTitle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: frost, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 10px', borderBottom: '2px solid #D8DEE9', paddingBottom: 4 }
  return (
    <div style={{ fontFamily: f, color: '#2E3440', lineHeight: 1.55, background: '#fff', minHeight: 1123 }}>
      <header style={{ background: 'linear-gradient(135deg, #2E3440, #3B4252)', color: '#fff', padding: '22px 26px', marginBottom: 16 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: 2, color: '#fff' }}>{r.name}</h1>
        <div style={{ fontSize: 13, color: ice, marginTop: 3 }}>{r.role}</div>
        <div style={{ fontSize: 10, color: '#8892A4', marginTop: 8 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).join('  ·  ')}</div>
      </header>
      <div style={{ display: 'flex', gap: 20, padding: '0 26px 28px' }}>
        <div style={{ width: 180, flexShrink: 0 }}>
          <div style={{ background: snow, borderRadius: 6, padding: 12, marginBottom: 12 }}><div style={sideTitle}>Skills</div>{r.skills.map((s, i) => <div key={i} style={{ fontSize: 10, color: '#4C566A', padding: '3px 0', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: ice, flexShrink: 0 }} />{s}</div>)}</div>
          <div style={{ background: snow, borderRadius: 6, padding: 12, marginBottom: 12 }}><div style={sideTitle}>Education</div>{r.education.map((e, i) => <div key={i}><div style={{ fontSize: 10.5, fontWeight: 700, color: night }}>{e.degree}</div><div style={{ fontSize: 10, color: frost }}>{e.school}</div><div style={{ fontSize: 9.5, color: '#8892A4', marginBottom: 8 }}>{e.endDate}</div></div>)}</div>
          {r.certifications.length > 0 && <div style={{ background: snow, borderRadius: 6, padding: 12 }}><div style={sideTitle}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 9.5, color: '#4C566A', marginBottom: 5 }}>{c.name}</div>)}</div>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {r.summary && <><div style={mainTitle}>Profile</div><div style={{ fontSize: 11, color: '#4C566A', marginBottom: 16 }}>{r.summary}</div></>}
          {r.experience.length > 0 && <><div style={mainTitle}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ background: snow, borderRadius: 6, padding: '12px 14px', marginBottom: 10 }}><div style={{ fontSize: 12.5, fontWeight: 700, color: night }}>{e.title}</div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 2 }}><span><span style={{ color: frost, fontWeight: 600 }}>{e.company}</span>{e.location && <span style={{ color: '#B0B8C8' }}> · {e.location}</span>}</span><span style={{ color: '#8892A4' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span></div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#4C566A', marginTop: 2, paddingLeft: 12, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: ice }}>•</span>{b}</div>)}</div>)}</>}
        </div>
      </div>
    </div>)
}


// Templates 15-20 converted to inline styles

// T15: SUNSET GRADIENT
function SunsetGradientTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const flame = r.customColor || '#E85D26'; const plum = '#8B2F5F'; const peach = '#FEF0E7'; const wine = '#5C1A3A'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sec: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: 3.5, textTransform: 'uppercase', margin: '20px 0 8px', color: flame }
  return (
    <div style={{ fontFamily: f, color: '#3D2C2C', lineHeight: 1.55, background: '#fff', minHeight: 1123 }}>
      <header style={{ background: `linear-gradient(135deg, ${flame}, ${plum})`, color: '#fff', padding: '26px 30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: 6, textTransform: 'uppercase', margin: 0, color: '#fff' }}>{r.name}</h1>
        <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4, letterSpacing: 2 }}>{r.role}</div>
        <div style={{ fontSize: 10, opacity: 0.75, marginTop: 10 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).join(' · ')}</div>
      </header>
      <div style={{ padding: '0 30px 28px' }}>
        {r.summary && <><div style={sec}>Profile</div><div style={{ fontSize: 11, color: '#6B5A5A', background: peach, padding: '10px 14px', borderRadius: 8 }}>{r.summary}</div></>}
        {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i}><div style={{ fontSize: 12.5, fontWeight: 700, color: wine, marginTop: 12 }}>{e.title}</div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span><span style={{ color: flame, fontWeight: 600 }}>{e.company}</span>{e.location && <span style={{ color: '#C0A0A0' }}> · {e.location}</span>}</span><span style={{ color: '#C0A0A0', fontStyle: 'italic' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span></div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#6B5A5A', marginTop: 3, paddingLeft: 16, position: 'relative' }}><span style={{ position: 'absolute', left: 4, color: flame }}>•</span>{b}</div>)}</div>)}</>}
        {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginTop: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, fontSize: 11.5, color: wine }}>{e.degree}</span><span style={{ color: '#C0A0A0', fontSize: 10 }}>{e.endDate}</span></div><div style={{ fontSize: 11, color: plum }}>{e.school}</div></div>)}</>}
        {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ background: 'linear-gradient(135deg, #FEF0E7, #FCE4EC)', color: wine, fontSize: 10, padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>{s}</span>)}</div></>}
        {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10.5, color: '#6B5A5A', marginBottom: 4, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: flame, fontSize: 9 }}>★</span>{c.name}</div>)}</>}
      </div>
    </div>)
}

// T16: METRO LINE
function MetroLineTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const blue = r.customColor || '#0078D4'; const dark = '#1B1B1B'; const ltbg = '#F3F3F3'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const mono = "'IBM Plex Mono', 'Courier New', monospace"
  const sec: React.CSSProperties = { fontSize: 10.5, fontWeight: 800, color: '#fff', letterSpacing: 3, textTransform: 'uppercase', background: blue, display: 'inline-block', padding: '3px 12px', margin: '18px 0 10px' }
  return (
    <div style={{ fontFamily: f, color: '#333', lineHeight: 1.5, background: '#fff', minHeight: 1123, padding: '28px 32px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16, paddingBottom: 14, borderBottom: `3px solid ${blue}` }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 800, color: dark, margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>{r.name}</h1><div style={{ fontSize: 13, color: blue, fontWeight: 600 }}>{r.role}</div><div style={{ fontSize: 10, color: '#888', marginTop: 3 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).join(' · ')}</div></div>
      </header>
      {r.summary && <><div style={sec}>Profile</div><div style={{ fontSize: 11, color: '#555', padding: '8px 12px', background: ltbg, borderLeft: `3px solid ${blue}` }}>{r.summary}</div></>}
      {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i} style={{ display: 'flex', gap: 14, marginTop: 12 }}><div style={{ width: 90, flexShrink: 0, fontSize: 10, color: '#888', paddingTop: 2, textAlign: 'right', fontFamily: mono }}>{e.startDate}–{e.current ? 'Now' : e.endDate}</div><div style={{ flex: 1, borderLeft: '2px solid #D0D0D0', paddingLeft: 14, paddingBottom: 8 }}><div style={{ fontSize: 12.5, fontWeight: 700, color: dark }}>{e.title}</div><div style={{ fontSize: 11, color: blue, fontWeight: 600 }}>{e.company}{e.location && <span style={{ color: '#aaa', fontWeight: 400 }}> · {e.location}</span>}</div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#555', marginTop: 2, paddingLeft: 12, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: blue }}>▪</span>{b}</div>)}</div></div>)}</>}
      {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginTop: 8 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, fontSize: 11.5, color: dark }}>{e.degree}</span><span style={{ fontSize: 10, color: '#888', fontFamily: mono }}>{e.endDate}</span></div><div style={{ fontSize: 11, color: blue }}>{e.school}</div></div>)}</>}
      {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>{r.skills.map((s, i) => <div key={i} style={{ background: ltbg, color: dark, fontSize: 10, padding: '4px 10px', fontWeight: 600, borderLeft: `3px solid ${blue}` }}>{s}</div>)}</div></>}
      {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10.5, color: '#555', marginBottom: 3, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 2, color: blue }}>▪</span>{c.name}</div>)}</>}
    </div>)
}

// T17: ROSE QUARTZ
function RoseQuartzTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const rose = r.customColor || '#C77D8A'; const blush = '#F5E6EA'; const deep = '#6B3A4A'; const soft = '#E8CDD3'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sec: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, color: rose, letterSpacing: 3, textTransform: 'uppercase', margin: '20px 0 8px', display: 'flex', alignItems: 'center', gap: 10 }
  const line: React.CSSProperties = { flex: 1, height: 1, background: soft }
  return (
    <div style={{ fontFamily: f, color: '#4A3B3B', lineHeight: 1.55, background: '#fff', minHeight: 1123, padding: '28px 32px' }}>
      <header style={{ textAlign: 'center', paddingBottom: 16, borderBottom: `1px solid ${soft}`, marginBottom: 16 }}>
        <h1 style={{ fontSize: 30, fontWeight: 300, color: deep, letterSpacing: 6, textTransform: 'uppercase', margin: 0 }}>{r.name}</h1>
        <div style={{ fontSize: 13, color: rose, marginTop: 4, fontWeight: 600, letterSpacing: 1 }}>{r.role}</div>
        <div style={{ fontSize: 10.5, color: '#B0A0A4', marginTop: 8 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).join('  ·  ')}</div>
      </header>
      {r.summary && <><div style={sec}><div style={line} /><span>Summary</span><div style={line} /></div><div style={{ fontSize: 11, color: '#7A6A6A', textAlign: 'center', padding: '10px 24px', background: blush, borderRadius: 8 }}>{r.summary}</div></>}
      {r.experience.length > 0 && <><div style={sec}><div style={line} /><span>Experience</span><div style={line} /></div>{r.experience.map((e, i) => <div key={i}><div style={{ fontSize: 12.5, fontWeight: 700, color: deep, marginTop: 12 }}>{e.title}</div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span><span style={{ color: rose, fontWeight: 600 }}>{e.company}</span>{e.location && <span style={{ color: '#C0B0B4' }}> · {e.location}</span>}</span><span style={{ color: '#C0B0B4', fontStyle: 'italic' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span></div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#7A6A6A', marginTop: 3, paddingLeft: 16, position: 'relative' }}><span style={{ position: 'absolute', left: 4, color: rose, fontSize: 7 }}>♦</span>{b}</div>)}</div>)}</>}
      {r.education.length > 0 && <><div style={sec}><div style={line} /><span>Education</span><div style={line} /></div>{r.education.map((e, i) => <div key={i} style={{ marginTop: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, fontSize: 11.5, color: deep }}>{e.degree}</span><span style={{ color: '#C0B0B4', fontSize: 10 }}>{e.endDate}</span></div><div style={{ fontSize: 11, color: rose }}>{e.school}</div></div>)}</>}
      {r.skills.length > 0 && <><div style={sec}><div style={line} /><span>Skills</span><div style={line} /></div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ background: blush, color: deep, fontSize: 10, padding: '4px 12px', borderRadius: 20, fontWeight: 600, border: `1px solid ${soft}` }}>{s}</span>)}</div></>}
      {r.certifications.length > 0 && <><div style={sec}><div style={line} /><span>Certifications</span><div style={line} /></div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10.5, color: '#7A6A6A', textAlign: 'center', marginBottom: 4 }}>{c.name}</div>)}</>}
    </div>)
}

// T18: CONCRETE BRUTALIST
function ConcreteBrutalistTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const yellow = r.customColor || '#FFD600'; const blk = '#0a0a0a'; const concrete = '#8C8C8C'; const ltbg = '#F2F2F2'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const mono = "'IBM Plex Mono', 'Courier New', monospace"
  const sec: React.CSSProperties = { fontSize: 11, fontWeight: 900, color: blk, letterSpacing: 4, textTransform: 'uppercase', margin: '20px 0 8px', background: yellow, display: 'inline-block', padding: '2px 10px' }
  return (
    <div style={{ fontFamily: f, color: '#1a1a1a', lineHeight: 1.5, background: '#fff', minHeight: 1123, padding: '28px 32px' }}>
      <header style={{ border: `3px solid ${blk}`, padding: '18px 20px', marginBottom: 16 }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: blk, margin: 0, textTransform: 'uppercase', lineHeight: 1 }}>{r.name}</h1>
        <div style={{ fontSize: 13, fontWeight: 800, color: blk, textTransform: 'uppercase', letterSpacing: 4, marginTop: 4, background: yellow, display: 'inline-block', padding: '2px 8px' }}>{r.role}</div>
        <div style={{ fontSize: 10, color: concrete, marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).join(' / ')}</div>
      </header>
      {r.summary && <><div style={sec}>Profile</div><div style={{ fontSize: 11, color: '#444', border: '1px solid #ddd', padding: '10px 14px', background: ltbg }}>{r.summary}</div></>}
      {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i}><div style={{ fontSize: 13, fontWeight: 900, color: blk, textTransform: 'uppercase', marginTop: 14 }}>{e.title}</div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, borderBottom: '1px solid #ddd', paddingBottom: 4, marginBottom: 4 }}><span><span style={{ color: blk, fontWeight: 700 }}>{e.company}</span>{e.location && <span style={{ color: concrete, fontWeight: 400 }}> / {e.location}</span>}</span><span style={{ color: concrete, fontFamily: mono, fontSize: 10 }}>{e.startDate}–{e.current ? 'NOW' : e.endDate}</span></div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#444', marginBottom: 2, paddingLeft: 16, position: 'relative' }}><span style={{ position: 'absolute', left: 2, color: yellow, fontSize: 8 }}>■</span>{b}</div>)}</div>)}</>}
      {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginTop: 8 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 900, fontSize: 11.5, color: blk, textTransform: 'uppercase' }}>{e.degree}</span><span style={{ color: concrete, fontFamily: mono, fontSize: 10 }}>{e.endDate}</span></div><div style={{ fontSize: 11, color: '#444' }}>{e.school}</div></div>)}</>}
      {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, marginTop: 6 }}>{r.skills.map((s, i) => <div key={i} style={{ fontSize: 10, fontWeight: 700, color: blk, textTransform: 'uppercase', padding: '4px 8px', background: ltbg, borderLeft: `3px solid ${yellow}` }}>{s}</div>)}</div></>}
      {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10, color: '#444', marginBottom: 3, fontFamily: mono }}>// {c.name}</div>)}</>}
    </div>)
}

// T19: LAVENDER FIELDS
function LavenderFieldsTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const lav = r.customColor || '#7C6DAF'; const lilac = '#E8E0F0'; const deep = '#2E2348'; const soft = '#F5F2FA'; const muted = '#9B8EC0'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sec: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: deep, letterSpacing: 3, textTransform: 'uppercase', margin: '20px 0 8px', padding: '4px 12px', background: lilac, borderRadius: 4, display: 'inline-block' }
  return (
    <div style={{ fontFamily: f, color: '#3D3557', lineHeight: 1.55, background: '#fff', minHeight: 1123, padding: '28px 32px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `2px solid ${lav}`, paddingBottom: 12, marginBottom: 16 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 700, color: deep, margin: 0 }}>{r.name}</h1><div style={{ fontSize: 13, color: lav, fontWeight: 600 }}>{r.role}</div></div>
        <div style={{ textAlign: 'right', fontSize: 10.5, color: muted, lineHeight: 1.7 }}>{r.email && <div>{r.email}</div>}{r.phone && <div>{r.phone}</div>}{r.location && <div>{r.location}</div>}{r.website && <div>{r.website}</div>}</div>
      </header>
      {r.summary && <><div style={sec}>Summary</div><div style={{ fontSize: 11, color: '#6B5E80', padding: '10px 14px', background: soft, borderRadius: 6, borderLeft: `3px solid ${muted}` }}>{r.summary}</div></>}
      {r.experience.length > 0 && <><div style={sec}>Experience</div>{r.experience.map((e, i) => <div key={i}><div style={{ fontSize: 12.5, fontWeight: 700, color: deep, marginTop: 12 }}>{e.title}</div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span><span style={{ color: lav, fontWeight: 600 }}>{e.company}</span>{e.location && <span style={{ color: '#B8B0C8' }}> · {e.location}</span>}</span><span style={{ color: muted, fontStyle: 'italic' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span></div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#6B5E80', marginTop: 3, paddingLeft: 16, position: 'relative' }}><span style={{ position: 'absolute', left: 4, color: lav }}>•</span>{b}</div>)}</div>)}</>}
      {r.education.length > 0 && <><div style={sec}>Education</div>{r.education.map((e, i) => <div key={i} style={{ marginTop: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, fontSize: 11.5, color: deep }}>{e.degree}</span><span style={{ color: muted, fontSize: 10 }}>{e.endDate}</span></div><div style={{ fontSize: 11, color: lav }}>{e.school}</div></div>)}</>}
      {r.skills.length > 0 && <><div style={sec}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ background: soft, color: deep, fontSize: 10, padding: '4px 10px', borderRadius: 4, fontWeight: 600, border: `1px solid ${lilac}` }}>{s}</span>)}</div></>}
      {r.certifications.length > 0 && <><div style={sec}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10.5, color: '#6B5E80', marginBottom: 4, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: lav, fontSize: 10 }}>◇</span>{c.name}</div>)}</>}
    </div>)
}

// T20: STEEL INDUSTRIAL
function SteelIndustrialTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const steel = '#607D8B'; const iron = r.customColor || '#37474F'; const rivet = '#FF6F00'; const plate = '#ECEFF1'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const mono = "'IBM Plex Mono', 'Courier New', monospace"
  const sec: React.CSSProperties = { fontSize: 10.5, fontWeight: 900, color: iron, letterSpacing: 4, textTransform: 'uppercase', margin: '20px 0 8px', paddingBottom: 4, borderBottom: `2px solid ${iron}`, display: 'flex', alignItems: 'center', gap: 8 }
  return (
    <div style={{ fontFamily: f, color: '#333', lineHeight: 1.5, background: '#fff', minHeight: 1123 }}>
      <header style={{ background: iron, color: '#fff', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: 2, color: '#fff' }}>{r.name}</h1><div style={{ fontSize: 12, color: rivet, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, marginTop: 2 }}>{r.role}</div></div>
        <div style={{ textAlign: 'right', fontSize: 10, color: '#90A4AE', lineHeight: 1.7 }}>{r.email && <div>{r.email}</div>}{r.phone && <div>{r.phone}</div>}{r.location && <div>{r.location}</div>}</div>
      </header>
      <div style={{ padding: '0 24px 28px' }}>
        {r.summary && <><div style={sec}><span style={{ width: 8, height: 8, background: rivet, borderRadius: '50%', flexShrink: 0 }} />Profile</div><div style={{ fontSize: 11, color: '#546E7A', background: plate, padding: '10px 14px', borderLeft: `4px solid ${steel}` }}>{r.summary}</div></>}
        {r.experience.length > 0 && <><div style={sec}><span style={{ width: 8, height: 8, background: rivet, borderRadius: '50%', flexShrink: 0 }} />Experience</div>{r.experience.map((e, i) => <div key={i}><div style={{ fontSize: 13, fontWeight: 800, color: iron, textTransform: 'uppercase', marginTop: 14 }}>{e.title}</div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span><span style={{ color: rivet, fontWeight: 700 }}>{e.company}</span>{e.location && <span style={{ color: '#90A4AE' }}> · {e.location}</span>}</span><span style={{ color: steel, fontFamily: mono, fontSize: 10 }}>{e.startDate}–{e.current ? 'NOW' : e.endDate}</span></div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#546E7A', marginTop: 2, paddingLeft: 12, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: rivet }}>▸</span>{b}</div>)}</div>)}</>}
        {r.education.length > 0 && <><div style={sec}><span style={{ width: 8, height: 8, background: rivet, borderRadius: '50%', flexShrink: 0 }} />Education</div>{r.education.map((e, i) => <div key={i} style={{ marginTop: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 800, fontSize: 11.5, color: iron, textTransform: 'uppercase' }}>{e.degree}</span><span style={{ color: steel, fontSize: 10 }}>{e.endDate}</span></div><div style={{ fontSize: 11, color: steel }}>{e.school}</div></div>)}</>}
        {r.skills.length > 0 && <><div style={sec}><span style={{ width: 8, height: 8, background: rivet, borderRadius: '50%', flexShrink: 0 }} />Skills</div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginTop: 6 }}>{r.skills.map((s, i) => <div key={i} style={{ background: plate, color: iron, fontSize: 10, padding: '5px 8px', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', borderTop: `2px solid ${rivet}` }}>{s}</div>)}</div></>}
        {r.certifications.length > 0 && <><div style={sec}><span style={{ width: 8, height: 8, background: rivet, borderRadius: '50%', flexShrink: 0 }} />Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10, color: '#546E7A', marginBottom: 3, fontFamily: mono }}>⬡ {c.name}</div>)}</>}
      </div>
    </div>)
}


// T21: OBSIDIAN EXECUTIVE
function ObsidianExecutiveTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const violet = r.customColor || '#7C4DFF'; const bg = '#0D0D1A'; const slate = '#1A1A30'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sec: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: violet, letterSpacing: 4, textTransform: 'uppercase', margin: '22px 0 10px', display: 'flex', alignItems: 'center', gap: 10 }
  return (
    <div style={{ fontFamily: f, color: '#E0E0E0', lineHeight: 1.55, background: bg, minHeight: 1123, borderRadius: 6, overflow: 'hidden' }}>
      <header style={{ background: 'linear-gradient(160deg, #0D0D1A 0%, #1A1040 50%, #0D0D1A 100%)', padding: '30px 34px 24px', borderBottom: `1px solid ${violet}30` }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: 1 }}>{r.name}</h1>
        <div style={{ fontSize: 14, color: violet, fontWeight: 600, marginTop: 2, letterSpacing: 1 }}>{r.role}</div>
        <div style={{ fontSize: 10, color: '#B0B0C0', marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).map((v, i) => <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: violet }} />{v}</span>)}</div>
      </header>
      <div style={{ padding: '20px 34px 30px' }}>
        {r.summary && <><div style={sec}>Profile<div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #2A2A4A, transparent)' }} /></div><div style={{ fontSize: 11, color: '#B0B0C0', background: `${violet}14`, padding: '14px 18px', borderRadius: 8, border: '1px solid #2A2A4A' }}>{r.summary}</div></>}
        {r.experience.length > 0 && <><div style={sec}>Experience<div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #2A2A4A, transparent)' }} /></div>{r.experience.map((e, i) => <div key={i} style={{ background: slate, borderRadius: 8, padding: '14px 18px', marginTop: 10, border: '1px solid #2A2A4A' }}><div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{e.title}</div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 2 }}><span><span style={{ color: violet, fontWeight: 600 }}>{e.company}</span>{e.location && <span style={{ color: '#6A6A80' }}> · {e.location}</span>}</span><span style={{ color: '#6A6A80', fontFamily: 'monospace', fontSize: 10 }}>{e.startDate}–{e.current ? 'Now' : e.endDate}</span></div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#9090A8', marginTop: 3, paddingLeft: 16, position: 'relative' }}><span style={{ position: 'absolute', left: 4, color: violet }}>•</span>{b}</div>)}</div>)}</>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 10 }}>
          <div style={{ background: slate, borderRadius: 8, padding: '14px 16px', border: '1px solid #2A2A4A' }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: violet, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Education</div>
            {r.education.map((e, i) => <div key={i}><div style={{ fontWeight: 700, fontSize: 11, color: '#fff' }}>{e.degree}</div><div style={{ fontSize: 10, color: violet }}>{e.school} · {e.endDate}</div><div style={{ fontSize: 9.5, color: '#6A6A80', marginBottom: 8 }}></div></div>)}
            {r.certifications.length > 0 && <><div style={{ fontSize: 9.5, fontWeight: 700, color: violet, letterSpacing: 3, textTransform: 'uppercase', marginTop: 12, marginBottom: 8 }}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 9.5, color: '#9090A8', marginBottom: 5, paddingLeft: 10, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: violet, fontWeight: 700 }}>›</span>{c.name}</div>)}</>}
          </div>
          <div style={{ background: slate, borderRadius: 8, padding: '14px 16px', border: '1px solid #2A2A4A' }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: violet, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{r.skills.map((s, i) => <span key={i} style={{ background: `${violet}14`, color: violet, fontSize: 9, padding: '3px 9px', borderRadius: 4, border: '1px solid #2A2A4A', fontWeight: 600 }}>{s}</span>)}</div>
          </div>
        </div>
      </div>
    </div>)
}

// T22: IVORY PRESTIGE
function IvoryPrestigeTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const walnut = '#5C4033'; const tan = r.customColor || '#C4A97D'; const ink = '#2C2117'; const parchment = '#F5EFE3'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sec: React.CSSProperties = { fontSize: 10, fontWeight: 600, color: walnut, letterSpacing: 5, textTransform: 'uppercase', textAlign: 'center', margin: '24px 0 6px' }
  return (
    <div style={{ fontFamily: f, color: '#3B3226', lineHeight: 1.6, background: '#FEFCF6', minHeight: 1123, padding: '28px 32px' }}>
      <header style={{ textAlign: 'center', paddingBottom: 18 }}>
        <div style={{ color: tan, fontSize: 18, letterSpacing: 12, marginBottom: 4, opacity: 0.5 }}>◦ ◦ ◦ ◦ ◦</div>
        <h1 style={{ fontSize: 34, fontWeight: 300, color: ink, letterSpacing: 10, textTransform: 'uppercase', margin: 0 }}>{r.name}</h1>
        <div style={{ fontSize: 12, color: tan, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 600, marginTop: 6 }}>{r.role}</div>
        <div style={{ width: 80, height: 1, background: tan, margin: '12px auto' }} />
        <div style={{ fontSize: 10, color: '#A09080', letterSpacing: 1.5 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).join('   ·   ')}</div>
      </header>
      {r.summary && <><div style={sec}>Executive Summary</div><div style={{ textAlign: 'center', color: tan, fontSize: 10, letterSpacing: 6, marginBottom: 10, opacity: 0.4 }}>— — —</div><div style={{ fontSize: 11, color: '#7A6B5A', textAlign: 'center', maxWidth: '90%', margin: '0 auto 6px', fontStyle: 'italic', lineHeight: 1.7 }}>{r.summary}</div></>}
      {r.experience.length > 0 && <><div style={sec}>Professional Experience</div><div style={{ textAlign: 'center', color: tan, fontSize: 10, letterSpacing: 6, marginBottom: 10, opacity: 0.4 }}>— — —</div>{r.experience.map((e, i) => <div key={i} style={{ border: '1px solid #E8DFD0', borderRadius: 4, padding: '14px 18px', marginTop: 12, background: parchment }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><span style={{ fontSize: 13, fontWeight: 700, color: ink }}>{e.title}</span><span style={{ fontSize: 10.5, color: tan, fontStyle: 'italic' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span></div><div><span style={{ fontSize: 11.5, color: walnut, fontWeight: 600 }}>{e.company}</span>{e.location && <span style={{ color: '#B0A090' }}> · {e.location}</span>}</div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#6B5E50', marginTop: 3, paddingLeft: 18, position: 'relative' }}><span style={{ position: 'absolute', left: 6, color: tan }}>•</span>{b}</div>)}</div>)}</>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 14 }}>
        <div style={{ borderTop: `1px solid ${tan}`, paddingTop: 10 }}>
          <div style={{ fontSize: 9.5, fontWeight: 600, color: walnut, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Education</div>
          {r.education.map((e, i) => <div key={i}><div style={{ fontWeight: 700, fontSize: 11, color: ink }}>{e.degree}</div><div style={{ fontSize: 10.5, color: walnut }}>{e.school}</div><div style={{ fontSize: 10, color: tan, marginBottom: 8 }}>{e.endDate}</div></div>)}
          {r.certifications.length > 0 && <><div style={{ fontSize: 9.5, fontWeight: 600, color: walnut, letterSpacing: 4, textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10, color: '#7A6B5A', marginBottom: 5 }}>{c.name}</div>)}</>}
        </div>
        <div style={{ borderTop: `1px solid ${tan}`, paddingTop: 10 }}>
          <div style={{ fontSize: 9.5, fontWeight: 600, color: walnut, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Areas of Expertise</div>
          {r.skills.map((s, i) => <div key={i} style={{ fontSize: 10, color: '#6B5E50', padding: '3px 0', borderBottom: '1px dotted #E0D8C8', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 5, height: 5, border: `1px solid ${tan}`, borderRadius: '50%', flexShrink: 0 }} />{s}</div>)}
        </div>
      </div>
      <div style={{ width: 80, height: 1, background: tan, margin: '24px auto 0' }} />
    </div>)
}

// T23: AURORA BOREALIS
function AuroraBorealisTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const teal = r.customColor || '#00C9A7'; const dim = '#6B8A80'; const card = '#111F2E'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sec: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', margin: '22px 0 10px', color: teal, display: 'flex', alignItems: 'center', gap: 10 }
  return (
    <div style={{ fontFamily: f, color: '#E0ECE4', lineHeight: 1.55, background: 'linear-gradient(180deg, #0B1622 0%, #0F1B2B 100%)', minHeight: 1123, borderRadius: 6, overflow: 'hidden' }}>
      <header style={{ padding: '28px 32px 22px', background: `linear-gradient(135deg, ${teal}14, #E040FB10)`, borderBottom: '1px solid #1A3040' }}>
        <h1 style={{ fontSize: 30, fontWeight: 300, color: '#fff', margin: 0, letterSpacing: 4, textTransform: 'uppercase' }}>{r.name}</h1>
        <div style={{ fontSize: 14, color: teal, fontWeight: 700, marginTop: 4, letterSpacing: 1 }}>{r.role}</div>
        <div style={{ fontSize: 10, color: dim, marginTop: 10 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).join('  ·  ')}</div>
      </header>
      <div style={{ padding: '20px 32px 28px' }}>
        {r.summary && <><div style={sec}>Profile<div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #1A3040, transparent)' }} /></div><div style={{ fontSize: 11, color: dim, borderLeft: `2px solid ${teal}`, padding: '10px 16px', background: `${teal}08`, borderRadius: '0 6px 6px 0' }}>{r.summary}</div></>}
        {r.experience.length > 0 && <><div style={sec}>Experience<div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #1A3040, transparent)' }} /></div>{r.experience.map((e, i) => <div key={i} style={{ background: card, borderRadius: 8, padding: '14px 18px', marginTop: 10, border: '1px solid #1A3040', borderLeft: `3px solid ${teal}` }}><div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{e.title}</div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 2 }}><span><span style={{ color: teal, fontWeight: 600 }}>{e.company}</span>{e.location && <span style={{ color: '#4A6A70' }}> · {e.location}</span>}</span><span style={{ color: '#4A6A70', fontFamily: 'monospace', fontSize: 10 }}>{e.startDate}–{e.current ? 'Now' : e.endDate}</span></div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#7A9A90', marginTop: 3, paddingLeft: 16, position: 'relative' }}><span style={{ position: 'absolute', left: 4, color: teal }}>•</span>{b}</div>)}</div>)}</>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
          <div style={{ background: card, borderRadius: 8, padding: '14px 16px', border: '1px solid #1A3040' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8, color: teal }}>Education</div>
            {r.education.map((e, i) => <div key={i}><div style={{ fontWeight: 700, fontSize: 11, color: '#fff' }}>{e.degree}</div><div style={{ fontSize: 10, color: teal }}>{e.school} · {e.endDate}</div><div style={{ fontSize: 9.5, color: '#4A6A70', marginBottom: 8 }}></div></div>)}
            {r.certifications.length > 0 && <><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginTop: 10, marginBottom: 8, color: teal }}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 9.5, color: '#7A9A90', marginBottom: 5 }}>{c.name}</div>)}</>}
          </div>
          <div style={{ background: card, borderRadius: 8, padding: '14px 16px', border: '1px solid #1A3040' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8, color: teal }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: 9, padding: '3px 9px', borderRadius: 20, fontWeight: 600, border: '1px solid #1A3040', background: `${teal}10`, color: teal }}>{s}</span>)}</div>
          </div>
        </div>
      </div>
    </div>)
}

// T24: BLUEPRINT ARCHITECT
function BlueprintArchitectTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const blue = r.customColor || '#4FC3F7'; const bg = '#0D2137'; const line = '#1A3A5C'; const white = '#E8F0F8'; const dim = '#5A8AAA'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const mono = "'IBM Plex Mono', 'Courier New', monospace"
  const sec: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: blue, letterSpacing: 3, textTransform: 'uppercase', fontFamily: mono, margin: '22px 0 8px', paddingBottom: 4, borderBottom: `1px dashed ${line}` }
  return (
    <div style={{ fontFamily: f, color: '#C8D8E8', lineHeight: 1.5, background: bg, minHeight: 1123, padding: '28px 32px', borderRadius: 4 }}>
      <header style={{ border: `1px solid ${blue}`, padding: '18px 22px', marginBottom: 20, position: 'relative' }}>
        <h1 style={{ fontSize: 26, fontWeight: 300, color: white, margin: 0, letterSpacing: 4, textTransform: 'uppercase', fontFamily: mono }}>{r.name}</h1>
        <div style={{ fontSize: 12, color: blue, fontFamily: mono, marginTop: 4 }}>{r.role}</div>
        <div style={{ fontSize: 10, color: dim, fontFamily: mono, marginTop: 8 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).join(' | ')}</div>
      </header>
      {r.summary && <><div style={sec}>// Summary</div><div style={{ fontSize: 11, color: dim, padding: '10px 14px', border: `1px dashed ${line}` }}>{r.summary}</div></>}
      {r.experience.length > 0 && <><div style={sec}>// Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginTop: 12, paddingLeft: 18, borderLeft: `1px solid ${line}`, position: 'relative' }}><span style={{ position: 'absolute', left: -5, top: 0, color: blue, fontSize: 9, background: bg }}>○</span><div style={{ fontSize: 12.5, fontWeight: 700, color: white, fontFamily: mono }}>{e.title}</div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5 }}><span><span style={{ color: blue }}>{e.company}</span>{e.location && <span style={{ color: '#3A6A88' }}> · {e.location}</span>}</span><span style={{ color: dim, fontFamily: mono, fontSize: 10 }}>{e.startDate}–{e.current ? 'Now' : e.endDate}</span></div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#7AA0B8', marginTop: 2, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: blue }}>→</span>{b}</div>)}</div>)}</>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 10 }}>
        <div style={{ border: `1px dashed ${line}`, padding: '12px 14px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: blue, letterSpacing: 3, textTransform: 'uppercase', fontFamily: mono, marginBottom: 8 }}># Education</div>
          {r.education.map((e, i) => <div key={i}><div style={{ fontWeight: 700, fontSize: 11, color: white, fontFamily: mono }}>{e.degree}</div><div style={{ fontSize: 10, color: blue }}>{e.school} · {e.endDate}</div><div style={{ fontSize: 9.5, color: dim, marginBottom: 6 }}></div></div>)}
          {r.certifications.length > 0 && <><div style={{ fontSize: 9, fontWeight: 700, color: blue, letterSpacing: 3, textTransform: 'uppercase', fontFamily: mono, marginTop: 10, marginBottom: 8 }}># Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 9.5, color: '#7AA0B8', fontFamily: mono, marginBottom: 4 }}>✓ {c.name}</div>)}</>}
        </div>
        <div style={{ border: `1px dashed ${line}`, padding: '12px 14px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: blue, letterSpacing: 3, textTransform: 'uppercase', fontFamily: mono, marginBottom: 8 }}># Skills</div>
          {r.skills.map((s, i) => <div key={i} style={{ fontSize: 10, color: blue, fontFamily: mono, padding: '2px 0' }}>&gt; {s}</div>)}
        </div>
      </div>
    </div>)
}

// T25: ONYX & EMBER
function OnyxEmberTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const ember = r.customColor || '#FF5722'; const onyx = '#121212'; const ash = '#2A2A2A'; const smoke = '#8A8A7A'
  const f = "'Source Sans 3', 'Segoe UI', sans-serif"
  const sec: React.CSSProperties = { fontSize: 11, fontWeight: 900, color: ember, letterSpacing: 4, textTransform: 'uppercase', margin: '24px 0 10px', display: 'flex', alignItems: 'center', gap: 10 }
  return (
    <div style={{ fontFamily: f, color: '#D4D0C8', lineHeight: 1.55, background: onyx, minHeight: 1123, borderRadius: 6, overflow: 'hidden' }}>
      <header style={{ padding: '28px 32px 20px', borderBottom: `3px solid ${ember}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}><h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: 2 }}>{r.name}</h1><span style={{ background: ember, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 3, letterSpacing: 2, textTransform: 'uppercase' }}>{r.role}</span></div>
        <div style={{ fontSize: 10, color: smoke, marginTop: 10, display: 'flex', gap: 14 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}</div>
      </header>
      <div style={{ padding: '20px 32px 28px' }}>
        {r.summary && <><div style={sec}><span style={{ width: 16, height: 3, background: ember, flexShrink: 0 }} />Profile</div><div style={{ fontSize: 11, color: smoke, background: ash, padding: '14px 18px', borderRadius: 6, borderLeft: `3px solid ${ember}` }}>{r.summary}</div></>}
        {r.experience.length > 0 && <><div style={sec}><span style={{ width: 16, height: 3, background: ember, flexShrink: 0 }} />Experience</div>{r.experience.map((e, i) => <div key={i} style={{ marginTop: 14, paddingBottom: 12, borderBottom: i < r.experience.length - 1 ? '1px solid #222' : 'none' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 14, fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>{e.title}</span><span style={{ fontSize: 10, color: ember, fontFamily: 'monospace', background: ash, padding: '2px 8px', borderRadius: 3 }}>{e.startDate}–{e.current ? 'Now' : e.endDate}</span></div><div><span style={{ fontSize: 11.5, color: ember, fontWeight: 600 }}>{e.company}</span>{e.location && <span style={{ color: smoke }}> · {e.location}</span>}</div>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 10.5, color: '#A0A090', marginTop: 3, paddingLeft: 16, position: 'relative' }}><span style={{ position: 'absolute', left: 2, color: ember, fontSize: 6 }}>▪</span>{b}</div>)}</div>)}</>}
        <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: ember, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Education</div>
            {r.education.map((e, i) => <div key={i}><div style={{ fontWeight: 700, fontSize: 11, color: '#fff' }}>{e.degree}</div><div style={{ fontSize: 10.5, color: ember }}>{e.school} · {e.endDate}</div><div style={{ fontSize: 10, color: smoke, marginBottom: 8 }}></div></div>)}
            {r.certifications.length > 0 && <><div style={{ fontSize: 9.5, fontWeight: 700, color: ember, letterSpacing: 3, textTransform: 'uppercase', marginTop: 12, marginBottom: 8 }}>Certifications</div>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10, color: '#A0A090', marginBottom: 5, paddingLeft: 12, position: 'relative' }}><span style={{ width: 5, height: 5, background: ember, borderRadius: '50%', position: 'absolute', left: 0, top: 5 }} />{c.name}</div>)}</>}
          </div>
          <div style={{ width: 220, flexShrink: 0 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: ember, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Skills</div>
            {r.skills.map((s, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><span style={{ fontSize: 10, color: '#C0C0B0', flex: 1 }}>{s}</span><div style={{ width: 60, height: 3, background: ash, borderRadius: 2, overflow: 'hidden' }}><div style={{ height: '100%', background: `linear-gradient(90deg, ${ember}, #FF8A65)`, borderRadius: 2, width: `${70 + ((i * 17 + 11) % 30)}%` }} /></div></div>)}
          </div>
        </div>
      </div>
    </div>)
}


// EXECUTIVE TEMPLATES 1-5

// EXEC1: Authority — Black header, metrics strip, two-column bottom
function ExecAuthorityTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const blk = '#0a0a0a'; const mid = '#4a4a4a'; const lt = '#7a7a7a'; const faint = '#c8c8c8'
  return (
    <div style={{ fontFamily: "'Karla', Helvetica, sans-serif", color: '#1a1a1a', lineHeight: 1.55, fontSize: 13, background: '#fff', minHeight: 1123 }}>
      <header style={{ background: blk, color: '#fff', padding: '46px 54px 40px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: "'Bodoni Moda', 'Times New Roman', serif", fontWeight: 700, fontSize: 42, lineHeight: 1.05, letterSpacing: 1, margin: 0, color: '#fff' }}>{r.name}</h1>
            <div style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 18, opacity: 0.55, marginTop: 8 }}>{r.role}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12, fontWeight: 300, lineHeight: 2, opacity: 0.6, paddingTop: 6 }}>
            {r.email && <div>{r.email}</div>}{r.phone && <div>{r.phone}</div>}{r.location && <div>{r.location}</div>}{r.website && <div>{r.website}</div>}
          </div>
        </div>
      </header>
      {r.summary && <div style={{ background: blk, color: '#fff', padding: '22px 54px 30px' }}>
        <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, opacity: 0.35, marginBottom: 8 }}>Executive Summary</div>
        <div style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', fontSize: 14.5, lineHeight: 1.75, opacity: 0.8, maxWidth: 560 }}>{r.summary}</div>
      </div>}
      <div style={{ padding: '32px 54px 44px' }}>
        {r.experience.length > 0 && <>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3.5, color: blk, marginBottom: 18, paddingBottom: 10, borderBottom: `1px solid ${faint}` }}>Leadership Experience</div>
          {r.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: i < r.experience.length - 1 ? '1px solid #eaeaea' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 600, fontSize: 17, color: blk }}>{e.title}</span>
                <span style={{ fontSize: 11.5, color: lt }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: mid, marginBottom: 4 }}>{e.company}</div>
              {e.location && <div style={{ fontSize: 12, color: lt, fontWeight: 300, fontStyle: 'italic', marginBottom: 10 }}>{e.location}</div>}
              {bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 12.5, color: mid, lineHeight: 1.6, marginBottom: 5, paddingLeft: 14, position: 'relative', fontWeight: 300 }}><span style={{ position: 'absolute', left: 0, top: 7, width: 6, height: 2, background: faint, display: 'inline-block' }} />{b}</div>)}
            </div>
          ))}
        </>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {r.education.length > 0 && <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3.5, color: blk, marginBottom: 18, paddingBottom: 10, borderBottom: `1px solid ${faint}` }}>Education</div>
            {r.education.map((e, i) => <div key={i} style={{ marginBottom: 12 }}><div style={{ fontWeight: 600, fontSize: 13, color: blk }}>{e.degree}</div><div style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', fontSize: 12.5, color: mid }}>{e.school}</div><div style={{ fontSize: 11, color: lt, fontWeight: 300 }}>{e.endDate}</div></div>)}
          </div>}
          {r.skills.length > 0 && <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3.5, color: blk, marginBottom: 18, paddingBottom: 10, borderBottom: `1px solid ${faint}` }}>Core Competencies</div>
            {r.skills.map((s, i) => <div key={i} style={{ fontSize: 12.5, color: mid, marginBottom: 6, fontWeight: 300 }}>{s}</div>)}
          </div>}
        </div>
        {r.certifications.length > 0 && <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3.5, color: blk, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${faint}` }}>Certifications</div>
          {r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 12.5, color: mid, marginBottom: 6, fontWeight: 300 }}>{c.name}{c.issuer && ` — ${c.issuer}`}</div>)}
        </div>}
      </div>
    </div>)
}

// EXEC2: Prestige — Serif header, impact cards, three-column bottom
function ExecPrestigeTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const blk = '#0f0f0f'; const mid = '#555'; const lt = '#888'; const faint = '#ccc'
  return (
    <div style={{ fontFamily: "'Sora', Helvetica, sans-serif", color: '#222', lineHeight: 1.55, fontSize: 12.5, background: '#fff', minHeight: 1123, padding: '52px 62px' }}>
      <header style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: `3px solid ${blk}`, paddingBottom: 14, marginBottom: 12 }}>
          <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 400, fontSize: 40, color: blk, letterSpacing: 2, margin: 0 }}>{r.name}</h1>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: lt, border: `1.5px solid ${faint}`, padding: '6px 14px' }}>{r.role}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: lt, fontWeight: 300 }}>
          {[r.email, r.phone, r.location, r.website].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </header>
      {r.summary && <div style={{ marginBottom: 32, padding: '24px 28px', borderLeft: `3px solid ${blk}`, background: '#f4f4f4' }}>
        <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: lt, marginBottom: 8 }}>Executive Profile</div>
        <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 15, lineHeight: 1.75, color: mid }}>{r.summary}</div>
      </div>}
      {r.skills.length > 0 && <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(r.skills.length, 4)}, 1fr)`, marginBottom: 32, borderTop: `1px solid ${faint}`, borderBottom: `1px solid ${faint}` }}>
        {r.skills.slice(0, 8).map((s, i) => <div key={i} style={{ padding: '14px 14px', textAlign: 'center', fontSize: 11, fontWeight: 500, color: '#222', letterSpacing: 0.5, borderRight: i < Math.min(r.skills.length, 4) - 1 ? `1px solid ${faint}` : 'none', lineHeight: 1.5 }}>{s}</div>)}
      </div>}
      {r.experience.length > 0 && <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 3, color: blk, whiteSpace: 'nowrap', margin: 0 }}>Career History</h2>
          <div style={{ flex: 1, height: 1, background: faint }} />
        </div>
        {r.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 600, fontSize: 18, color: blk }}>{e.title}</span>
              <span style={{ fontSize: 11, color: lt }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: mid, marginBottom: 2 }}>{e.company}</div>
            {e.location && <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 12.5, color: lt, marginBottom: 10 }}>{e.location}</div>}
            {bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 12.5, color: mid, lineHeight: 1.7, fontWeight: 300, marginBottom: 4 }}>{b}</div>)}
          </div>
        ))}
      </div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
        {r.education.length > 0 && <div>
          <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2.5, color: blk, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${blk}` }}>Education</div>
          {r.education.map((e, i) => <div key={i} style={{ marginBottom: 10, fontSize: 12, fontWeight: 300, color: mid }}><strong style={{ fontWeight: 600, color: '#222', display: 'block', fontSize: 12.5 }}>{e.degree}</strong><span style={{ fontSize: 11, color: lt }}>{e.school} — {e.endDate}</span></div>)}
        </div>}
        {r.certifications.length > 0 && <div>
          <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2.5, color: blk, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${blk}` }}>Credentials</div>
          {r.certifications.map((c: any, i) => <div key={i} style={{ marginBottom: 10, fontSize: 12, fontWeight: 300, color: mid }}><strong style={{ fontWeight: 600, color: '#222', display: 'block', fontSize: 12.5 }}>{c.name}</strong>{c.issuer && <span style={{ fontSize: 11, color: lt }}>{c.issuer}</span>}</div>)}
        </div>}
        <div />
      </div>
    </div>)
}

// EXEC3: Pillar — Dark header band, timeline dots, sidebar competencies
function ExecPillarTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const blk = '#0e0e0e'; const mid = '#505050'; const lt = '#808080'; const faint = '#c0c0c0'
  return (
    <div style={{ fontFamily: "'Albert Sans', Helvetica, sans-serif", color: '#1c1c1c', lineHeight: 1.55, fontSize: 12.5, background: '#fff', minHeight: 1123 }}>
      <header style={{ background: blk, color: '#fff', padding: '40px 54px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: "'Lora', Georgia, serif", fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: 1, color: '#fff' }}>{r.name}</h1>
          <div style={{ fontSize: 13, fontWeight: 300, opacity: 0.6, marginTop: 4, letterSpacing: 2, textTransform: 'uppercase' }}>{r.role}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 11.5, fontWeight: 300, lineHeight: 1.9, opacity: 0.55 }}>
          {r.email && <div>{r.email}</div>}{r.phone && <div>{r.phone}</div>}{r.location && <div>{r.location}</div>}
        </div>
      </header>
      <div style={{ padding: '32px 54px 44px' }}>
        {r.summary && <div style={{ marginBottom: 28, padding: '20px 24px', borderLeft: `3px solid ${blk}`, background: '#f7f7f7' }}>
          <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: lt, marginBottom: 8 }}>Executive Summary</div>
          <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, lineHeight: 1.75, color: mid }}>{r.summary}</div>
        </div>}
        {r.experience.length > 0 && <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3.5, color: blk, marginBottom: 18, paddingBottom: 8, borderBottom: `2px solid ${blk}` }}>Experience</div>
          {r.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 22, paddingLeft: 20, borderLeft: `2px solid #e0e0e0`, position: 'relative' }}>
              <span style={{ position: 'absolute', left: -5, top: 2, width: 8, height: 8, borderRadius: '50%', background: blk }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: "'Lora', Georgia, serif", fontWeight: 600, fontSize: 16, color: blk }}>{e.title}</span>
                <span style={{ fontSize: 11, color: lt }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: mid }}>{e.company}{e.location && ` · ${e.location}`}</div>
              <div style={{ marginTop: 8 }}>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 12, color: mid, lineHeight: 1.65, marginBottom: 4, fontWeight: 300 }}>{b}</div>)}</div>
            </div>
          ))}
        </div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {r.education.length > 0 && <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3.5, color: blk, marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${blk}` }}>Education</div>
            {r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><div style={{ fontWeight: 600, fontSize: 13, color: blk }}>{e.degree}</div><div style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', fontSize: 12, color: mid }}>{e.school}</div><div style={{ fontSize: 11, color: lt }}>{e.endDate}</div></div>)}
          </div>}
          <div>
            {r.skills.length > 0 && <>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3.5, color: blk, marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${blk}` }}>Competencies</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>{r.skills.map((s, i) => <div key={i} style={{ fontSize: 11.5, color: mid, padding: '4px 0', fontWeight: 400 }}>{s}</div>)}</div>
            </>}
            {r.certifications.length > 0 && <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3.5, color: blk, marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${blk}` }}>Certifications</div>
              {r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 12, color: mid, marginBottom: 6, fontWeight: 300 }}>{c.name}</div>)}
            </div>}
          </div>
        </div>
      </div>
    </div>)
}

// EXEC4: Regal — Centered header, ornamental rules, serif elegance
function ExecRegalTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const blk = '#0b0b0b'; const mid = '#4d4d4d'; const lt = '#7d7d7d'; const faint = '#c5c5c5'
  return (
    <div style={{ fontFamily: "'Lexend', Helvetica, sans-serif", color: '#1e1e1e', lineHeight: 1.55, fontSize: 12.5, background: '#fff', minHeight: 1123, padding: '52px 58px' }}>
      <header style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 20, borderBottom: `1px solid ${faint}` }}>
        <h1 style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 400, fontSize: 44, color: blk, letterSpacing: 3, textTransform: 'uppercase', margin: 0 }}>{r.name}</h1>
        <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 4, color: lt, marginTop: 8 }}>{r.role}</div>
        <div style={{ width: 48, height: 1, background: blk, margin: '14px auto' }} />
        <div style={{ fontSize: 11, color: lt, fontWeight: 300 }}>{[r.email, r.phone, r.location, r.website].filter(Boolean).join('   ·   ')}</div>
      </header>
      {r.summary && <div style={{ textAlign: 'center', marginBottom: 30, padding: '0 24px' }}>
        <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: 15, lineHeight: 1.75, color: mid, fontStyle: 'italic' }}>{r.summary}</div>
      </div>}
      {r.experience.length > 0 && <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 4, color: blk, textAlign: 'center', marginBottom: 20 }}>— Experience —</div>
        {r.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: 22, paddingBottom: 22, borderBottom: i < r.experience.length - 1 ? `1px solid #ededed` : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 600, fontSize: 18, color: blk }}>{e.title}</span>
              <span style={{ fontSize: 11, color: lt, fontStyle: 'italic' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: mid }}>{e.company}{e.location && `, ${e.location}`}</div>
            <div style={{ marginTop: 8 }}>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 12, color: mid, lineHeight: 1.65, marginBottom: 4, fontWeight: 300, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: faint }}>·</span>{b}</div>)}</div>
          </div>
        ))}
      </div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        {r.education.length > 0 && <div>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 4, color: blk, textAlign: 'center', marginBottom: 16 }}>— Education —</div>
          {r.education.map((e, i) => <div key={i} style={{ textAlign: 'center', marginBottom: 10 }}><div style={{ fontWeight: 600, fontSize: 13, color: blk }}>{e.degree}</div><div style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontStyle: 'italic', fontSize: 12, color: mid }}>{e.school} · {e.endDate}</div></div>)}
        </div>}
        {r.skills.length > 0 && <div>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 4, color: blk, textAlign: 'center', marginBottom: 16 }}>— Expertise —</div>
          <div style={{ textAlign: 'center', fontSize: 11.5, color: mid, lineHeight: 2 }}>{r.skills.join('  ·  ')}</div>
        </div>}
      </div>
      {r.certifications.length > 0 && <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 4, color: blk, textAlign: 'center', marginBottom: 12 }}>— Credentials —</div>
        <div style={{ textAlign: 'center' }}>{r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 12, color: mid, marginBottom: 4, fontWeight: 300 }}>{c.name}{c.issuer && ` — ${c.issuer}`}</div>)}</div>
      </div>}
    </div>)
}

// EXEC5: Apex — Black angular header, metric tiles, structured layout
function ExecApexTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const blk = '#0c0c0c'; const mid = '#505050'; const lt = '#848484'; const faint = '#c8c8c8'
  return (
    <div style={{ fontFamily: "'Red Hat Display', Helvetica, sans-serif", color: '#1f1f1f', lineHeight: 1.55, fontSize: 12.5, background: '#fff', minHeight: 1123 }}>
      <header style={{ background: blk, color: '#fff', padding: '44px 54px 36px' }}>
        <h1 style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 700, fontSize: 38, margin: 0, letterSpacing: 1.5, color: '#fff' }}>{r.name}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
          <span style={{ fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic', fontSize: 16, opacity: 0.6 }}>{r.role}</span>
          <span style={{ fontSize: 11, opacity: 0.5, fontWeight: 300 }}>{[r.email, r.phone, r.location].filter(Boolean).join('  ·  ')}</span>
        </div>
      </header>
      {r.summary && <div style={{ background: blk, color: '#fff', padding: '0 54px 34px' }}>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, opacity: 0.7, fontWeight: 300, maxWidth: 580 }}>{r.summary}</div>
      </div>}
      <div style={{ padding: '30px 54px 44px' }}>
        {r.experience.length > 0 && <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 3, color: blk, margin: 0, whiteSpace: 'nowrap' }}>Experience</h2>
            <div style={{ flex: 1, height: 2, background: blk }} />
          </div>
          {r.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 600, fontSize: 17, color: blk }}>{e.title}</span>
                <span style={{ fontSize: 11, color: lt }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: mid }}>{e.company}{e.location && ` · ${e.location}`}</div>
              <div style={{ marginTop: 8 }}>{bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 12, color: mid, lineHeight: 1.65, marginBottom: 4, fontWeight: 300 }}>{b}</div>)}</div>
            </div>
          ))}
        </div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            {r.education.length > 0 && <>
              <div style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2.5, color: blk, marginBottom: 12, paddingBottom: 6, borderBottom: `2px solid ${blk}` }}>Education</div>
              {r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><div style={{ fontWeight: 600, fontSize: 13, color: blk }}>{e.degree}</div><div style={{ fontSize: 12, color: mid }}>{e.school}</div><div style={{ fontSize: 11, color: lt }}>{e.endDate}</div></div>)}
            </>}
          </div>
          <div>
            {r.skills.length > 0 && <>
              <div style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2.5, color: blk, marginBottom: 12, paddingBottom: 6, borderBottom: `2px solid ${blk}` }}>Core Strengths</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: 10.5, color: mid, padding: '4px 10px', border: `1px solid #eee`, fontWeight: 500 }}>{s}</span>)}</div>
            </>}
            {r.certifications.length > 0 && <div style={{ marginTop: 16 }}>
              <div style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2.5, color: blk, marginBottom: 12, paddingBottom: 6, borderBottom: `2px solid ${blk}` }}>Certifications</div>
              {r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 12, color: mid, marginBottom: 6, fontWeight: 300 }}>{c.name}</div>)}
            </div>}
          </div>
        </div>
      </div>
    </div>)
}


// EXECUTIVE TEMPLATES 6-10

// EXEC6: Strata — Layered horizontal bands, subtle gray hierarchy
function ExecStrataTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const blk = '#0d0d0d'; const mid = '#525252'; const lt = '#7e7e7e'; const faint = '#c4c4c4'
  return (
    <div style={{ fontFamily: "'Figtree', Helvetica, sans-serif", color: '#202020', lineHeight: 1.55, fontSize: 12.5, background: '#fff', minHeight: 1123 }}>
      <header style={{ background: blk, color: '#fff', padding: '40px 54px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 4, opacity: 0.4, marginBottom: 8 }}>Executive Resume</div>
          <h1 style={{ fontFamily: "'Cardo', Georgia, serif", fontWeight: 700, fontSize: 38, margin: 0, letterSpacing: 1, color: '#fff' }}>{r.name}</h1>
        </div>
        <div style={{ fontSize: 14, fontWeight: 300, opacity: 0.6, fontFamily: "'Cardo', Georgia, serif", fontStyle: 'italic' }}>{r.role}</div>
      </header>
      <div style={{ background: '#efefef', padding: '14px 54px', display: 'flex', gap: 24, fontSize: 11, color: lt }}>
        {[r.email, r.phone, r.location, r.website].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
      </div>
      <div style={{ padding: '30px 54px 44px' }}>
        {r.summary && <div style={{ marginBottom: 28, padding: '18px 22px', background: '#f7f7f7', borderRadius: 2 }}>
          <div style={{ fontFamily: "'Cardo', Georgia, serif", fontSize: 14, lineHeight: 1.7, color: mid }}>{r.summary}</div>
        </div>}
        {r.experience.length > 0 && <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3.5, color: blk, marginBottom: 18, paddingBottom: 8, borderBottom: `2px solid ${blk}` }}>Professional History</div>
          {r.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 22, paddingBottom: 22, borderBottom: i < r.experience.length - 1 ? '1px solid #efefef' : 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Cardo', Georgia, serif", fontWeight: 700, fontSize: 16, color: blk }}>{e.title}</span>
                <span style={{ fontSize: 11, color: lt }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: mid, marginBottom: 8 }}>{e.company}{e.location && ` · ${e.location}`}</div>
              {bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 12, color: mid, lineHeight: 1.65, marginBottom: 4, fontWeight: 300, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 0, top: 6, width: 6, height: 2, background: faint, display: 'inline-block' }} />{b}</div>)}
            </div>
          ))}
        </div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {r.education.length > 0 && <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${blk}` }}>Education</div>
            {r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><div style={{ fontWeight: 600, fontSize: 13, color: blk }}>{e.degree}</div><div style={{ fontFamily: "'Cardo', Georgia, serif", fontStyle: 'italic', fontSize: 12, color: mid }}>{e.school} · {e.endDate}</div></div>)}
          </div>}
          <div>
            {r.skills.length > 0 && <>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 14, paddingBottom: 8, borderBottom: `2px solid ${blk}` }}>Skills</div>
              {r.skills.map((s, i) => <div key={i} style={{ fontSize: 12, color: mid, marginBottom: 5, fontWeight: 400, paddingLeft: 10, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: faint }}>·</span>{s}</div>)}
            </>}
            {r.certifications.length > 0 && <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${blk}` }}>Certifications</div>
              {r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 12, color: mid, marginBottom: 5, fontWeight: 300 }}>{c.name}</div>)}
            </div>}
          </div>
        </div>
      </div>
    </div>)
}

// EXEC7: Counsel — Legal style, serif display, structured formality
function ExecCounselTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const blk = '#0e0e0e'; const mid = '#4f4f4f'; const lt = '#808080'; const faint = '#c0c0c0'
  return (
    <div style={{ fontFamily: "'Nunito Sans', Helvetica, sans-serif", color: '#1d1d1d', lineHeight: 1.55, fontSize: 12.5, background: '#fff', minHeight: 1123, padding: '52px 60px' }}>
      <header style={{ marginBottom: 32, borderBottom: `3px double ${blk}`, paddingBottom: 18 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400, fontSize: 40, color: blk, margin: 0, letterSpacing: 1 }}>{r.name}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 15, color: lt }}>{r.role}</span>
          <span style={{ fontSize: 11, color: lt, fontWeight: 300 }}>{[r.email, r.phone, r.location].filter(Boolean).join('  ·  ')}</span>
        </div>
      </header>
      {r.summary && <div style={{ marginBottom: 28, padding: '18px 24px', border: `1px solid ${faint}`, background: '#f6f6f6' }}>
        <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: lt, marginBottom: 8 }}>Professional Summary</div>
        <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 14, lineHeight: 1.75, color: mid }}>{r.summary}</div>
      </div>}
      {r.experience.length > 0 && <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 16, borderBottom: `1px solid ${faint}`, paddingBottom: 8 }}>
          Professional Experience
        </div>
        {r.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < r.experience.length - 1 ? `1px solid #ebebeb` : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 17, color: blk }}>{e.title}</span>
              <span style={{ fontSize: 11, color: lt, fontStyle: 'italic' }}>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
            </div>
            <div style={{ fontSize: 13, color: mid, fontWeight: 500, marginBottom: 8 }}>{e.company}{e.location && `, ${e.location}`}</div>
            {bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 12, color: mid, lineHeight: 1.65, marginBottom: 4, fontWeight: 300, paddingLeft: 16, position: 'relative' }}><span style={{ position: 'absolute', left: 4, color: faint }}>—</span>{b}</div>)}
          </div>
        ))}
      </div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
        {r.education.length > 0 && <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 12, borderBottom: `1px solid ${faint}`, paddingBottom: 8 }}>Education</div>
          {r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><div style={{ fontWeight: 600, fontSize: 13, color: blk }}>{e.degree}</div><div style={{ fontSize: 12, color: mid }}>{e.school}</div><div style={{ fontSize: 11, color: lt }}>{e.endDate}</div></div>)}
        </div>}
        <div>
          {r.skills.length > 0 && <>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 12, borderBottom: `1px solid ${faint}`, paddingBottom: 8 }}>Areas of Practice</div>
            <div style={{ columns: 2, columnGap: 20 }}>{r.skills.map((s, i) => <div key={i} style={{ fontSize: 11.5, color: mid, marginBottom: 5, fontWeight: 400, breakInside: 'avoid' }}>{s}</div>)}</div>
          </>}
          {r.certifications.length > 0 && <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 12, borderBottom: `1px solid ${faint}`, paddingBottom: 8 }}>Certifications</div>
            {r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 12, color: mid, marginBottom: 5, fontWeight: 300 }}>{c.name}</div>)}
          </div>}
        </div>
      </div>
    </div>)
}

// EXEC8: Monogram — Large initial monogram, sidebar left
function ExecMonogramTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const blk = '#0c0c0c'; const mid = '#4e4e4e'; const lt = '#7c7c7c'; const faint = '#c2c2c2'
  const initials = r.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', Helvetica, sans-serif", color: '#1c1c1c', lineHeight: 1.55, fontSize: 12.5, background: '#fff', minHeight: 1123 }}>
      <header style={{ padding: '44px 54px 36px', borderBottom: `2px solid ${blk}`, display: 'flex', gap: 28, alignItems: 'center' }}>
        <div style={{ width: 72, height: 72, background: blk, color: '#fff', fontFamily: "'Literata', Georgia, serif", fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, letterSpacing: 2 }}>{initials}</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Literata', Georgia, serif", fontWeight: 600, fontSize: 32, color: '#1a1a1a', margin: 0, letterSpacing: 1 }}>{r.name}</h1>
          <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 3, color: lt, marginTop: 4 }}>{r.role}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, fontWeight: 300, lineHeight: 1.8, color: lt }}>
          {r.email && <div>{r.email}</div>}{r.phone && <div>{r.phone}</div>}{r.location && <div>{r.location}</div>}
        </div>
      </header>
      <div style={{ display: 'flex' }}>
        <aside style={{ width: 210, padding: '28px 24px', background: '#f5f5f5', borderRight: `1px solid #e8e8e8`, flexShrink: 0 }}>
          {r.skills.length > 0 && <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 10, paddingBottom: 6, borderBottom: `1.5px solid ${blk}` }}>Expertise</div>
            {r.skills.map((s, i) => <div key={i} style={{ fontSize: 11, color: mid, marginBottom: 5, fontWeight: 400 }}>{s}</div>)}
          </div>}
          {r.education.length > 0 && <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 10, paddingBottom: 6, borderBottom: `1.5px solid ${blk}` }}>Education</div>
            {r.education.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><div style={{ fontWeight: 600, fontSize: 11.5, color: blk }}>{e.degree}</div><div style={{ fontSize: 10.5, color: mid }}>{e.school}</div><div style={{ fontSize: 10, color: lt }}>{e.endDate}</div></div>)}
          </div>}
          {r.certifications.length > 0 && <div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 10, paddingBottom: 6, borderBottom: `1.5px solid ${blk}` }}>Certifications</div>
            {r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 10.5, color: mid, marginBottom: 6, fontWeight: 400 }}>{c.name}</div>)}
          </div>}
        </aside>
        <main style={{ flex: 1, padding: '28px 38px 44px' }}>
          {r.summary && <div style={{ marginBottom: 24, padding: '16px 20px', borderLeft: `3px solid ${blk}`, background: '#fafafa' }}>
            <div style={{ fontFamily: "'Literata', Georgia, serif", fontSize: 13.5, lineHeight: 1.7, color: mid }}>{r.summary}</div>
          </div>}
          {r.experience.length > 0 && <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${faint}` }}>Career Timeline</div>
            {r.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: "'Literata', Georgia, serif", fontWeight: 600, fontSize: 15, color: blk }}>{e.title}</span>
                  <span style={{ fontSize: 10.5, color: lt }}>{e.startDate}—{e.current ? 'Present' : e.endDate}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: mid, marginBottom: 6 }}>{e.company}{e.location && ` · ${e.location}`}</div>
                {bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 11.5, color: mid, lineHeight: 1.6, marginBottom: 3, fontWeight: 300 }}>{b}</div>)}
              </div>
            ))}
          </div>}
        </main>
      </div>
    </div>)
}

// EXEC9: Ledger — Box header, bordered sections, accounting precision
function ExecLedgerTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const blk = '#0b0b0b'; const mid = '#4c4c4c'; const lt = '#7f7f7f'; const faint = '#c3c3c3'
  return (
    <div style={{ fontFamily: "'Urbanist', Helvetica, sans-serif", color: '#1b1b1b', lineHeight: 1.55, fontSize: 12.5, background: '#fff', minHeight: 1123 }}>
      <header style={{ background: blk, color: '#fff', padding: '38px 54px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontFamily: "'Bitter', Georgia, serif", fontWeight: 700, fontSize: 34, margin: 0, color: '#fff' }}>{r.name}</h1>
            <div style={{ fontSize: 13, fontWeight: 300, opacity: 0.6, marginTop: 4, textTransform: 'uppercase', letterSpacing: 3 }}>{r.role}</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 300, lineHeight: 1.8, opacity: 0.5, textAlign: 'right' }}>
            {r.email && <div>{r.email}</div>}{r.phone && <div>{r.phone}</div>}{r.location && <div>{r.location}</div>}
          </div>
        </div>
      </header>
      <div style={{ padding: '28px 54px 44px' }}>
        {r.summary && <div style={{ marginBottom: 24, padding: '16px 20px', border: `1px solid #eaeaea`, background: '#f5f5f5' }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: lt, marginBottom: 6 }}>Summary</div>
          <div style={{ fontFamily: "'Bitter', Georgia, serif", fontSize: 13.5, lineHeight: 1.7, color: mid }}>{r.summary}</div>
        </div>}
        {r.experience.length > 0 && <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3.5, color: blk, marginBottom: 16, paddingBottom: 6, borderBottom: `2px solid ${blk}` }}>Experience</div>
          {r.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 20, paddingBottom: 18, borderBottom: i < r.experience.length - 1 ? '1px solid #eaeaea' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: "'Bitter', Georgia, serif", fontWeight: 600, fontSize: 16, color: blk }}>{e.title}</span>
                <span style={{ fontSize: 11, color: lt, fontFamily: 'monospace' }}>{e.startDate}–{e.current ? 'Present' : e.endDate}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: mid, marginBottom: 6 }}>{e.company}{e.location && ` · ${e.location}`}</div>
              {bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 12, color: mid, lineHeight: 1.65, marginBottom: 4, fontWeight: 300, paddingLeft: 12, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: faint }}>›</span>{b}</div>)}
            </div>
          ))}
        </div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28 }}>
          {r.education.length > 0 && <div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 10, paddingBottom: 6, borderBottom: `1.5px solid ${blk}` }}>Education</div>
            {r.education.map((e, i) => <div key={i} style={{ marginBottom: 8 }}><div style={{ fontWeight: 600, fontSize: 12, color: blk }}>{e.degree}</div><div style={{ fontSize: 11, color: mid }}>{e.school}</div><div style={{ fontSize: 10, color: lt }}>{e.endDate}</div></div>)}
          </div>}
          {r.skills.length > 0 && <div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 10, paddingBottom: 6, borderBottom: `1.5px solid ${blk}` }}>Skills</div>
            {r.skills.map((s, i) => <div key={i} style={{ fontSize: 11.5, color: mid, marginBottom: 4, fontWeight: 400 }}>{s}</div>)}
          </div>}
          {r.certifications.length > 0 && <div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: blk, marginBottom: 10, paddingBottom: 6, borderBottom: `1.5px solid ${blk}` }}>Certifications</div>
            {r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 11.5, color: mid, marginBottom: 5, fontWeight: 300 }}>{c.name}</div>)}
          </div>}
        </div>
      </div>
    </div>)
}

// EXEC10: Architect — Blueprint-like grid layout, structured precision
function ExecArchitectTemplate({ data }: PreviewProps) {
  const r = useDynamicData(data || {})
  const blk = '#0a0a0a'; const mid = '#4b4b4b'; const lt = '#7e7e7e'; const faint = '#bfbfbf'
  return (
    <div style={{ fontFamily: "'DM Sans', Helvetica, sans-serif", color: '#1a1a1a', lineHeight: 1.55, fontSize: 12.5, background: '#fff', minHeight: 1123, padding: '48px 56px' }}>
      <header style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16, borderBottom: `3px solid ${blk}` }}>
          <div>
            <h1 style={{ fontFamily: "'Spectral', Georgia, serif", fontWeight: 700, fontSize: 36, color: blk, margin: 0, letterSpacing: 1.5 }}>{r.name}</h1>
            <div style={{ fontFamily: "'Spectral', Georgia, serif", fontStyle: 'italic', fontSize: 15, color: lt, marginTop: 4 }}>{r.role}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, fontWeight: 300, lineHeight: 1.8, color: lt, paddingTop: 4 }}>
            {r.email && <div>{r.email}</div>}{r.phone && <div>{r.phone}</div>}{r.location && <div>{r.location}</div>}{r.website && <div>{r.website}</div>}
          </div>
        </div>
      </header>
      {r.summary && <div style={{ marginBottom: 28, display: 'grid', gridTemplateColumns: '100px 1fr', gap: 20 }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: blk, paddingTop: 2 }}>Profile</div>
        <div style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: 14, lineHeight: 1.75, color: mid, paddingBottom: 16, borderBottom: `1px solid #e6e6e6` }}>{r.summary}</div>
      </div>}
      {r.experience.length > 0 && <div style={{ marginBottom: 24 }}>
        {r.experience.map((e, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 20, marginBottom: 20, paddingBottom: 18, borderBottom: i < r.experience.length - 1 ? '1px solid #e6e6e6' : 'none' }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: blk }}>{i === 0 ? 'Experience' : ''}</div>
              <div style={{ fontSize: 10, color: lt, marginTop: 4 }}>{e.startDate}–{e.current ? 'Now' : e.endDate}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Spectral', Georgia, serif", fontWeight: 600, fontSize: 16, color: blk }}>{e.title}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: mid, marginBottom: 6 }}>{e.company}{e.location && ` · ${e.location}`}</div>
              {bullets(e.description).map((b, j) => <div key={j} style={{ fontSize: 12, color: mid, lineHeight: 1.65, marginBottom: 3, fontWeight: 300 }}>{b}</div>)}
            </div>
          </div>
        ))}
      </div>}
      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 20 }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: blk }}>Education</div>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              {r.education.map((e, i) => <div key={i} style={{ marginBottom: 8 }}><div style={{ fontWeight: 600, fontSize: 12.5, color: blk }}>{e.degree}</div><div style={{ fontSize: 11.5, color: mid }}>{e.school} · {e.endDate}</div></div>)}
            </div>
            <div>
              {r.skills.length > 0 && <>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: blk, marginBottom: 8 }}>Key Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{r.skills.map((s, i) => <span key={i} style={{ fontSize: 10.5, color: mid, padding: '3px 9px', border: `1px solid #e6e6e6`, fontWeight: 500 }}>{s}</span>)}</div>
              </>}
            </div>
          </div>
          {r.certifications.length > 0 && <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: blk, marginBottom: 8 }}>Certifications</div>
            {r.certifications.map((c: any, i) => <div key={i} style={{ fontSize: 12, color: mid, marginBottom: 4, fontWeight: 300 }}>{c.name}{c.issuer && ` — ${c.issuer}`}</div>)}
          </div>}
        </div>
      </div>
    </div>)
}


// ─── PREVIEW MAP ───────────────────────────────────────────

export const PREVIEW_MAP: Record<string, React.FC<PreviewProps>> = {
  classic: ClassicTemplate,
  executive: ExecutiveTemplate,
  minimal: MinimalTemplate,
  bold: BoldTemplate,
  mono_clean: MonoCleanTemplate,
  mono_sidebar: MonoSidebarTemplate,
  mono_stack: MonoStackTemplate,
  mono_type: MonoTypeTemplate,
  mono_editorial: MonoEditorialTemplate,
  exec_navy: ExecNavyTemplate,
  exec_marble: ExecMarbleTemplate,
  exec_copper: ExecCopperTemplate,
  creative_neon: CreativeNeonTemplate,
  creative_coral: CreativeCoralTemplate,
  creative_blueprint: CreativeBlueprintTemplate,
  creative_sunset: CreativeSunsetTemplate,
  dark_obsidian: DarkObsidianTemplate,
  dark_midnight: DarkMidnightTemplate,
  dark_eclipse: DarkEclipseTemplate,
  dark_void: DarkVoidTemplate,
  dark_carbon: DarkCarbonTemplate,
  prestige: PrestigeTemplate,
  modern_sidebar: ModernSidebarTemplate,
  coral_horizon: CoralHorizonTemplate,
  swiss_grid: SwissGridTemplate,
  ocean_breeze: OceanBreezeTemplate,
  monochrome_editorial: MonochromeEditorialTemplate,
  midnight_luxe: MidnightLuxeTemplate,
  forest_canopy: ForestCanopyTemplate,
  copper_deco: CopperDecoTemplate,
  arctic_frost: ArcticFrostTemplate,
  sunset_gradient: SunsetGradientTemplate,
  metro_line: MetroLineTemplate,
  rose_quartz: RoseQuartzTemplate,
  concrete_brutalist: ConcreteBrutalistTemplate,
  lavender_fields: LavenderFieldsTemplate,
  steel_industrial: SteelIndustrialTemplate,
  obsidian_executive: ObsidianExecutiveTemplate,
  ivory_prestige: IvoryPrestigeTemplate,
  aurora_borealis: AuroraBorealisTemplate,
  blueprint_architect: BlueprintArchitectTemplate,
  onyx_ember: OnyxEmberTemplate,
  exec_authority: ExecAuthorityTemplate,
  exec_prestige: ExecPrestigeTemplate,
  exec_pillar: ExecPillarTemplate,
  exec_regal: ExecRegalTemplate,
  exec_apex: ExecApexTemplate,
  exec_strata: ExecStrataTemplate,
  exec_counsel: ExecCounselTemplate,
  exec_monogram: ExecMonogramTemplate,
  exec_ledger: ExecLedgerTemplate,
  exec_architect: ExecArchitectTemplate,
}

