import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { toast } from '../components/Toast'
import { PLANS } from '../lib/stripe'
import styles from './EditorPage.module.css'
import '../styles/terminal.css'
import '../styles/scifi.css'
import '../styles/sophisticated.css'
import '../styles/healthcare.css'
import '../styles/nature.css'
import '../styles/vintage.css'
import '../styles/graduate.css'

// Sections config
const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: '◉' },
  { id: 'summary', label: 'Summary', icon: '≡' },
  { id: 'experience', label: 'Experience', icon: '◈' },
  { id: 'education', label: 'Education', icon: '✦' },
  { id: 'skills', label: 'Skills', icon: '◆' },
  { id: 'languages', label: 'Languages', icon: '◇' },
  { id: 'certifications', label: 'Certifications', icon: '●' },
  { id: 'projects', label: 'Projects', icon: '◑' },
]

// ─── Auto-save hook ──────────────────────────────────────────
function useAutoSave(resumeId, data, delay = 1500) {
  const { updateResume } = useStore()
  const [saveStatus, setSaveStatus] = useState('saved')
  const timerRef = useRef(null)
  const initialRef = useRef(true)

  useEffect(() => {
    if (initialRef.current) { initialRef.current = false; return }
    if (!resumeId || !data || resumeId === 'new') return

    setSaveStatus('saving')
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      try {
        await updateResume(resumeId, { data })
        setSaveStatus('saved')
      } catch (err) {
        console.error('Auto-save error:', err)
        setSaveStatus('error')
      }
    }, delay)

    return () => clearTimeout(timerRef.current)
  }, [JSON.stringify(data), resumeId, delay, updateResume])

  return saveStatus
}

// ─── Form fields ─────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

function TextArea({ label, value, onChange, placeholder = '', rows = 3 }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea
        className="form-textarea"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ minHeight: rows * 28 }}
      />
    </div>
  )
}

// ─── Section: Personal Info ───────────────────────────────────
function PersonalSection({ data, onChange }) {
  const set = (field) => (val) => onChange({ ...data, [field]: val })
  return (
    <div className={styles.sectionForm}>
      <div className="form-row">
        <Field label="Full Name" value={data.fullName} onChange={set('fullName')} placeholder="Alex Johnson" />
        <Field label="Job Title" value={data.jobTitle} onChange={set('jobTitle')} placeholder="Senior Product Manager" />
      </div>
      <div className="form-row">
        <Field label="Email" value={data.email} onChange={set('email')} type="email" placeholder="alex@company.com" />
        <Field label="Phone" value={data.phone} onChange={set('phone')} placeholder="+1 234 567 8900" />
      </div>
      <div className="form-row">
        <Field label="Location" value={data.location} onChange={set('location')} placeholder="New York, NY" />
        <Field label="Website / LinkedIn" value={data.website} onChange={set('website')} placeholder="linkedin.com/in/alex" />
      </div>
    </div>
  )
}

// ─── Section: Summary ───────────────────────────────────────
function SummarySection({ data, onChange }) {
  const [isAiLoading, setIsAiLoading] = useState(false)

  const handleAi = async () => {
    setIsAiLoading(true)
    toast.info('AI is rewriting your summary...')
    try {
      const { enhanceTextWithAI } = await import('../lib/ai')
      const improved = await enhanceTextWithAI(data || '')
      onChange(improved)
      toast.success('Summary improved!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsAiLoading(false)
    }
  }

  return (
    <div className={styles.sectionForm}>
      <TextArea
        label="Professional Summary"
        value={data}
        onChange={onChange}
        placeholder="Experienced professional with 8+ years in product management. Proven track record of shipping successful products at scale. Passionate about user-centric design and data-driven decisions."
        rows={5}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8 }}>
        <p className={styles.hint}>💡 3-4 sentences highlighting your biggest strengths and career goals.</p>
        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--blue)', fontSize: 12 }} onClick={handleAi} disabled={isAiLoading || !data}>
          {isAiLoading ? '✨ Rewriting...' : '✨ AI Rewrite'}
        </button>
      </div>
    </div>
  )
}

// ─── Section: Experience ────────────────────────────────────
function ExperienceSection({ data = [], onChange }) {
  const [aiLoadingIdx, setAiLoadingIdx] = useState(null)

  const add = () => onChange([...data, { id: Date.now(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }])
  const remove = (idx) => onChange(data.filter((_, i) => i !== idx))
  const update = (idx, field, val) => {
    const next = [...data]
    next[idx] = { ...next[idx], [field]: val }
    onChange(next)
  }

  const handleAi = async (idx, text) => {
    if (!text) return
    setAiLoadingIdx(idx)
    toast.info('AI is rewriting experience...')
    try {
      const { enhanceTextWithAI } = await import('../lib/ai')
      const improved = await enhanceTextWithAI(text)
      update(idx, 'description', improved)
      toast.success('Experience improved!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setAiLoadingIdx(null)
    }
  }

  return (
    <div className={styles.sectionForm}>
      {data.map((exp, idx) => (
        <div key={exp.id || idx} className={styles.entryCard}>
          <div className={styles.entryHeader}>
            <span className={styles.entryLabel}>{exp.title || `Position ${idx + 1}`}</span>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => remove(idx)} aria-label="Remove">✕</button>
          </div>
          <div className="form-row">
            <Field label="Job Title" value={exp.title} onChange={(v) => update(idx, 'title', v)} placeholder="Senior Designer" />
            <Field label="Company" value={exp.company} onChange={(v) => update(idx, 'company', v)} placeholder="Acme Corp" />
          </div>
          <div className="form-row">
            <Field label="Start Date" value={exp.startDate} onChange={(v) => update(idx, 'startDate', v)} placeholder="Jan 2020" />
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="text"
                className="form-input"
                value={exp.current ? 'Present' : (exp.endDate || '')}
                onChange={(e) => update(idx, 'endDate', e.target.value)}
                disabled={exp.current}
                placeholder="Dec 2023"
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-40)', marginTop: 6, cursor: 'pointer' }}>
                <input type="checkbox" checked={exp.current || false} onChange={(e) => update(idx, 'current', e.target.checked)} />
                Currently working here
              </label>
            </div>
          </div>
          <Field label="Location" value={exp.location} onChange={(v) => update(idx, 'location', v)} placeholder="New York, NY" />
          <TextArea
            label="Key Achievements & Responsibilities"
            value={exp.description}
            onChange={(v) => update(idx, 'description', v)}
            placeholder="• Led cross-functional team of 8 to ship payments redesign (↑28% conversion)&#10;• Reduced customer support tickets 35% via proactive onboarding flow"
            rows={4}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -6, marginBottom: 8 }}>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--blue)', fontSize: 11 }} onClick={() => handleAi(idx, exp.description)} disabled={aiLoadingIdx === idx || !exp.description}>
              {aiLoadingIdx === idx ? '✨ Rewriting...' : '✨ AI Rewrite'}
            </button>
          </div>
        </div>
      ))}
      <button className={styles.addBtn} onClick={add}>
        <span>+</span> Add Experience
      </button>
    </div>
  )
}

// ─── Section: Education ─────────────────────────────────────
function EducationSection({ data = [], onChange }) {
  const add = () => onChange([...data, { id: Date.now(), degree: '', school: '', location: '', startDate: '', endDate: '', gpa: '', notes: '' }])
  const remove = (idx) => onChange(data.filter((_, i) => i !== idx))
  const update = (idx, field, val) => {
    const next = [...data]; next[idx] = { ...next[idx], [field]: val }; onChange(next)
  }

  return (
    <div className={styles.sectionForm}>
      {data.map((edu, idx) => (
        <div key={edu.id || idx} className={styles.entryCard}>
          <div className={styles.entryHeader}>
            <span className={styles.entryLabel}>{edu.degree || `Degree ${idx + 1}`}</span>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => remove(idx)}>✕</button>
          </div>
          <div className="form-row">
            <Field label="Degree / Certificate" value={edu.degree} onChange={(v) => update(idx, 'degree', v)} placeholder="B.S. Computer Science" />
            <Field label="School / University" value={edu.school} onChange={(v) => update(idx, 'school', v)} placeholder="MIT" />
          </div>
          <div className="form-row">
            <Field label="Start Year" value={edu.startDate} onChange={(v) => update(idx, 'startDate', v)} placeholder="2018" />
            <Field label="End Year" value={edu.endDate} onChange={(v) => update(idx, 'endDate', v)} placeholder="2022" />
          </div>
          <div className="form-row">
            <Field label="Location" value={edu.location} onChange={(v) => update(idx, 'location', v)} placeholder="Cambridge, MA" />
            <Field label="GPA (optional)" value={edu.gpa} onChange={(v) => update(idx, 'gpa', v)} placeholder="3.8 / 4.0" />
          </div>
          <Field label="Honors / Notes (optional)" value={edu.notes} onChange={(v) => update(idx, 'notes', v)} placeholder="Summa Cum Laude, Dean's List" />
        </div>
      ))}
      <button className={styles.addBtn} onClick={add}><span>+</span> Add Education</button>
    </div>
  )
}

// ─── Section: Skills ─────────────────────────────────────────
function SkillsSection({ data = [], onChange }) {
  const [input, setInput] = useState('')
  const add = () => {
    const trimmed = input.trim()
    if (!trimmed || data.includes(trimmed)) return
    onChange([...data, trimmed])
    setInput('')
  }
  const remove = (s) => onChange(data.filter((x) => x !== s))

  return (
    <div className={styles.sectionForm}>
      <div className={styles.skillInput}>
        <input
          type="text"
          className="form-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Type a skill and press Enter…"
        />
        <button className="btn btn-outline" onClick={add}>Add</button>
      </div>
      <div className={styles.skillTags}>
        {data.map((skill) => (
          <span key={skill} className={styles.skillTag}>
            {skill}
            <button onClick={() => remove(skill)}>✕</button>
          </span>
        ))}
        {data.length === 0 && (
          <p style={{ color: 'var(--ink-20)', fontSize: 13, fontStyle: 'italic' }}>
            No skills added yet. Type above and press Enter.
          </p>
        )}
      </div>
      <p className={styles.hint}>💡 Add 6-12 specific skills relevant to your target role.</p>
    </div>
  )
}

// ─── Section: Languages ──────────────────────────────────────
function LanguagesSection({ data = [], onChange }) {
  const add = () => onChange([...data, { id: Date.now(), language: '', level: 'Fluent' }])
  const remove = (idx) => onChange(data.filter((_, i) => i !== idx))
  const update = (idx, field, val) => {
    const next = [...data]; next[idx] = { ...next[idx], [field]: val }; onChange(next)
  }
  const LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic']

  return (
    <div className={styles.sectionForm}>
      {data.map((lang, idx) => (
        <div key={lang.id || idx} className={styles.inlineRow}>
          <input className="form-input" value={lang.language} onChange={(e) => update(idx, 'language', e.target.value)} placeholder="Language" />
          <select className="form-input form-select" value={lang.level} onChange={(e) => update(idx, 'level', e.target.value)}>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => remove(idx)}>✕</button>
        </div>
      ))}
      <button className={styles.addBtn} onClick={add}><span>+</span> Add Language</button>
    </div>
  )
}

// ─── Section: Certifications ─────────────────────────────────
function CertificationsSection({ data = [], onChange }) {
  const add = () => onChange([...data, { id: Date.now(), name: '', issuer: '', date: '', url: '' }])
  const remove = (idx) => onChange(data.filter((_, i) => i !== idx))
  const update = (idx, field, val) => {
    const next = [...data]; next[idx] = { ...next[idx], [field]: val }; onChange(next)
  }

  return (
    <div className={styles.sectionForm}>
      {data.map((cert, idx) => (
        <div key={cert.id || idx} className={styles.entryCard}>
          <div className={styles.entryHeader}>
            <span className={styles.entryLabel}>{cert.name || `Certificate ${idx + 1}`}</span>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => remove(idx)}>✕</button>
          </div>
          <div className="form-row">
            <Field label="Certificate Name" value={cert.name} onChange={(v) => update(idx, 'name', v)} placeholder="AWS Solutions Architect" />
            <Field label="Issuing Organization" value={cert.issuer} onChange={(v) => update(idx, 'issuer', v)} placeholder="Amazon Web Services" />
          </div>
          <div className="form-row">
            <Field label="Date" value={cert.date} onChange={(v) => update(idx, 'date', v)} placeholder="Mar 2023" />
            <Field label="Certificate URL (optional)" value={cert.url} onChange={(v) => update(idx, 'url', v)} placeholder="https://..." />
          </div>
        </div>
      ))}
      <button className={styles.addBtn} onClick={add}><span>+</span> Add Certification</button>
    </div>
  )
}

// ─── Section: Projects ───────────────────────────────────────
function ProjectsSection({ data = [], onChange }) {
  const add = () => onChange([...data, { id: Date.now(), name: '', description: '', url: '', tech: '' }])
  const remove = (idx) => onChange(data.filter((_, i) => i !== idx))
  const update = (idx, field, val) => {
    const next = [...data]; next[idx] = { ...next[idx], [field]: val }; onChange(next)
  }

  return (
    <div className={styles.sectionForm}>
      {data.map((proj, idx) => (
        <div key={proj.id || idx} className={styles.entryCard}>
          <div className={styles.entryHeader}>
            <span className={styles.entryLabel}>{proj.name || `Project ${idx + 1}`}</span>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => remove(idx)}>✕</button>
          </div>
          <div className="form-row">
            <Field label="Project Name" value={proj.name} onChange={(v) => update(idx, 'name', v)} placeholder="Open Source Dashboard" />
            <Field label="URL (optional)" value={proj.url} onChange={(v) => update(idx, 'url', v)} placeholder="github.com/user/project" />
          </div>
          <Field label="Technologies Used" value={proj.tech} onChange={(v) => update(idx, 'tech', v)} placeholder="React, Node.js, PostgreSQL" />
          <TextArea label="Description" value={proj.description} onChange={(v) => update(idx, 'description', v)} placeholder="Built a real-time analytics dashboard serving 10k+ users." rows={3} />
        </div>
      ))}
      <button className={styles.addBtn} onClick={add}><span>+</span> Add Project</button>
    </div>
  )
}

// ─── Live Preview ─────────────────────────────────────────────
function LivePreview({ resumeData, themeId }) {
  const d = resumeData || {}
  const p = d.personal || {}

  const themes = {
    dark: { bg: '#0f0f14', text: '#e8e0cc', accent: '#c9a84c', border: 'rgba(201,168,76,0.25)' },
    sidebar: { bg: '#fff', text: '#1a1a1a', accent: '#1e3a5f', border: '#e0e8f0' },
    bold: { bg: '#fff', text: '#1a1a1a', accent: '#f5c800', border: '#e8e4de' },
    teal: { bg: '#f8f9fb', text: '#1c1c2e', accent: '#2b9db3', border: '#e0e8f0' },
    creative: { bg: '#fff', text: '#1a1a1a', accent: '#ee5a24', border: '#f0e8e4' },
    obsidian: { bg: '#0d0d0d', text: '#e8e0d8', accent: '#c69b6b', border: 'rgba(198,155,107,0.18)' },
    ivory: { bg: '#faf6ef', text: '#1a2744', accent: '#1a2744', border: '#d0c8b8' },
    noir: { bg: '#080808', text: '#f0f0f0', accent: '#b4ff50', border: 'rgba(180,255,80,0.15)' },
    rose: { bg: '#fdf8f4', text: '#2a1f1f', accent: '#d4a0a0', border: 'rgba(212,160,160,0.2)' },
    executive: { bg: '#ebebeb', text: '#1a1a1a', accent: '#1a1a1a', border: '#bbb' },
    default: { bg: '#fff', text: '#1a1a1a', accent: '#1a1a1a', border: '#e8e4de' },
  }
  const t = themes[themeId] || themes.default

  if (themeId === 'healthcare') {
    return (
      <div className="health-theme-wrapper" style={{ fontSize: '10px' }}>
        <div className="health-hero" style={{ padding: '20px' }}>
          <div className="health-ekg">
            <svg viewBox="0 0 1200 60" preserveAspectRatio="none"><polyline fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" points="0,30 50,30 70,30 80,10 90,50 100,20 110,40 120,30 170,30 220,30 240,30 250,10 260,50 270,20 280,40 290,30 340,30" /></svg>
          </div>
          <div className="health-name" style={{ fontSize: '20px' }}>{p.fullName || 'User Name'}</div>
          <div className="health-title" style={{ fontSize: '11px' }}>{p.jobTitle || 'Profession'}</div>
          <div className="health-contact" style={{ fontSize: '9px', marginTop: '10px' }}>
            {p.email && <span>✉ {p.email}</span>}
            {p.phone && <span>☎ {p.phone}</span>}
            {p.location && <span>📍 {p.location}</span>}
          </div>
        </div>
        <div className="health-vitals" style={{ padding: '10px', gap: '6px' }}>
          <div className="health-vital-card health-vital-1" style={{ padding: '8px' }}><div className="health-vital-num" style={{ fontSize: '14px' }}>12+</div><div className="health-vital-label" style={{ fontSize: '7px' }}>Years Exp</div></div>
          <div className="health-vital-card health-vital-2" style={{ padding: '8px' }}><div className="health-vital-num" style={{ fontSize: '14px' }}>8k+</div><div className="health-vital-label" style={{ fontSize: '7px' }}>Patients</div></div>
          <div className="health-vital-card health-vital-3" style={{ padding: '8px' }}><div className="health-vital-num" style={{ fontSize: '14px' }}>24</div><div className="health-vital-label" style={{ fontSize: '7px' }}>Pubs</div></div>
          <div className="health-vital-card health-vital-4" style={{ padding: '8px' }}><div className="health-vital-num" style={{ fontSize: '14px' }}>96%</div><div className="health-vital-label" style={{ fontSize: '7px' }}>Satisfaction</div></div>
        </div>
        <div className="health-section">
          {d.summary && (
            <div style={{ marginBottom: '12px' }}>
              <div className="health-section-head"><div className="health-section-label" style={{ fontSize: '12px' }}>Professional Summary</div><div className="health-section-line"></div></div>
              <div className="health-summary" style={{ fontSize: '10px' }}>{d.summary}</div>
            </div>
          )}
          {d.experience?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div className="health-section-head"><div className="health-section-label" style={{ fontSize: '12px' }}>Clinical Experience</div><div className="health-section-line"></div></div>
              {d.experience.map((exp, i) => (
                <div key={i} className="health-exp-card" style={{ padding: '10px' }}>
                  <div className="health-exp-role" style={{ fontSize: '12px' }}>{exp.title}</div>
                  <div className="health-exp-co" style={{ fontSize: '10px' }}>{exp.company}</div>
                  <div className="health-exp-date" style={{ fontSize: '8px' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                  {exp.description && <div className="health-exp-desc" style={{ fontSize: '9px' }}>{exp.description}</div>}
                </div>
              ))}
            </div>
          )}
          {d.education?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div className="health-section-head"><div className="health-section-label" style={{ fontSize: '12px' }}>Education</div><div className="health-section-line"></div></div>
              {d.education.map((edu, i) => (
                <div key={i} className="health-exp-card" style={{ padding: '8px' }}>
                  <div className="health-exp-role" style={{ fontSize: '11px' }}>{edu.degree}</div>
                  <div className="health-exp-co" style={{ fontSize: '10px' }}>{edu.school}</div>
                  <div className="health-exp-date" style={{ fontSize: '8px' }}>{edu.endDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (themeId === 'nature') {
    return (
      <div className="nature-theme-wrapper" style={{ fontSize: '10px' }}>
        <div className="nature-header" style={{ padding: '20px' }}>
          <h1 className="nature-name" style={{ fontSize: '24px' }}>{p.fullName || 'User Name'}</h1>
          <p className="nature-role" style={{ fontSize: '12px' }}>{p.jobTitle || 'Profession'}</p>
          <div className="nature-divider"><div className="nature-divider-line"></div>🌿<div className="nature-divider-line"></div></div>
          <div className="nature-contact" style={{ fontSize: '9px' }}>
            {p.email && <span>{p.email}</span>}
            {p.location && <span>{p.location}</span>}
          </div>
        </div>
        <div className="nature-section">
          {d.summary && (
            <div style={{ marginBottom: '12px' }}>
              <h2 className="nature-section-title" style={{ fontSize: '14px' }}>About</h2>
              <div className="nature-summary" style={{ fontSize: '10px' }}>{d.summary}</div>
            </div>
          )}
          {d.experience?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <h2 className="nature-section-title" style={{ fontSize: '14px' }}>Experience</h2>
              <div className="nature-timeline">
                {d.experience.map((exp, i) => (
                  <div key={i} className="nature-exp-item" style={{ padding: '10px' }}>
                    <div className="nature-exp-role" style={{ fontSize: '12px' }}>{exp.title}</div>
                    <div className="nature-exp-co" style={{ fontSize: '11px' }}>{exp.company}</div>
                    <div className="nature-exp-date" style={{ fontSize: '8px' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                    {exp.description && <div style={{ fontSize: '9px', color: '#6b5e50', marginTop: '6px' }}>{exp.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (themeId === 'scifi') {
    return (
      <div className="scifi-theme-wrapper">
        <div className="scifi-sys-bar">
          <span>SYSTEM://DATA_VISUALIZER</span>
          <span>STATUS: ONLINE</span>
        </div>
        <div className="scifi-header">
          <h1 className="scifi-name" data-name={p.fullName || 'USER NAME'}>{p.fullName || 'USER NAME'}</h1>
          <div className="scifi-designation">{p.jobTitle || 'OPERATIVE'}</div>
          <div className="scifi-contact">
            {p.email && <span>[E] {p.email}</span>}
            {p.location && <span>[L] {p.location}</span>}
          </div>
        </div>
        <div className="scifi-section">
          {d.summary && (
            <div style={{ marginBottom: '12px' }}>
              <div className="scifi-section-head">
                <span className="scifi-section-title">MISSION BRIEF</span>
                <div className="scifi-section-line"></div>
              </div>
              <div className="scifi-brief">{d.summary}</div>
            </div>
          )}
          {d.experience?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div className="scifi-section-head">
                <span className="scifi-section-title">CHRONOLOGY</span>
                <div className="scifi-section-line"></div>
              </div>
              {d.experience.map((exp, i) => (
                <div key={i} className="scifi-exp-card">
                  <div className="scifi-exp-role">{exp.title}</div>
                  <div className="scifi-exp-co">{exp.company}</div>
                  <span className="scifi-exp-date">{exp.startDate} – {exp.current ? 'PRESENT' : exp.endDate}</span>
                  {exp.description && <div style={{ marginTop: '6px', opacity: 0.8 }}>{exp.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (themeId === 'sophisticated') {
    return (
      <div className="sophisticated-theme-wrapper">
        <header className="sophisticated-hero">
          <div className="sophisticated-hero-content">
            <div className="sophisticated-hero-left">
              <h1 className="sophisticated-name">{p.fullName || 'User Name'}</h1>
              <p className="sophisticated-title">{p.jobTitle || 'Executive'}</p>
            </div>
            <div className="sophisticated-contact-box">
              <div className="sophisticated-contact-label">Contact</div>
              <div>{p.email}</div>
              <div>{p.location}</div>
            </div>
          </div>
        </header>
        <div className="sophisticated-body">
          <div className="sophisticated-main">
            {d.summary && (
              <div style={{ marginBottom: '20px' }}>
                <div className="sophisticated-section-label">Executive Summary</div>
                <div className="sophisticated-summary">{d.summary}</div>
              </div>
            )}
            {d.experience?.length > 0 && (
              <div>
                <div className="sophisticated-section-label">Professional Experience</div>
                {d.experience.map((exp, i) => (
                  <div key={i} className="sophisticated-exp-item">
                    <div className="sophisticated-exp-header">
                      <span>{exp.title}</span>
                      <span>{exp.startDate} – {exp.current ? 'Pres' : exp.endDate}</span>
                    </div>
                    <div className="sophisticated-exp-org">{exp.company}</div>
                    {exp.description && <div style={{ marginTop: '4px', opacity: 0.8 }}>{exp.description}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="sophisticated-side">
            {d.skills?.length > 0 && (
              <div>
                <div className="sophisticated-section-label">Competencies</div>
                {d.skills.slice(0, 6).map((s, i) => (
                  <div key={i} className="sophisticated-skill-row">
                    <div className="sophisticated-skill-name">{s}</div>
                    <div className="sophisticated-skill-bar"><div className="sophisticated-skill-fill" style={{ width: '90%' }}></div></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (themeId === 'vintage') {
    return (
      <div className="vintage-theme-wrapper" style={{ padding: '15px' }}>
        <div className="vintage-document" style={{ padding: '20px' }}>
          <div className="vintage-ornament" style={{ padding: '15px' }}>
            <div className="vintage-cv-label" style={{ fontSize: '8px' }}>Curriculum Vitæ</div>
            <h1 className="vintage-name" style={{ fontSize: '24px' }}>{p.fullName || 'User Name'}</h1>
            <div className="vintage-title" style={{ fontSize: '12px' }}>{p.jobTitle || 'Professional'}</div>
            <div className="vintage-contact" style={{ fontSize: '9px' }}>
              {[p.email, p.phone, p.location].filter(Boolean).join(' · ')}
            </div>
          </div>
          {d.summary && (
            <div style={{ marginBottom: '20px' }}>
              <div className="vintage-section-head">
                <span className="vintage-section-title" style={{ fontSize: '11px' }}>Statement</span>
                <div className="vintage-section-rule"></div>
              </div>
              <div className="vintage-summary" style={{ fontSize: '11px' }}>{d.summary}</div>
            </div>
          )}
          {d.experience?.length > 0 && (
            <div>
              <div className="vintage-section-head">
                <span className="vintage-section-title" style={{ fontSize: '11px' }}>Experience</span>
                <div className="vintage-section-rule"></div>
              </div>
              {d.experience.map((exp, i) => (
                <div key={i} className="vintage-exp-item">
                  <div className="vintage-role-row" style={{ fontSize: '13px' }}>
                    <span>{exp.title}</span>
                    <span className="vintage-date" style={{ fontSize: '10px' }}>{exp.startDate} – {exp.current ? 'Pres' : exp.endDate}</span>
                  </div>
                  <div className="vintage-org" style={{ fontSize: '11px' }}>{exp.company}</div>
                  {exp.description && <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.9 }}>{exp.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (themeId === 'graduate') {
    return (
      <div className="graduate-theme-wrapper" style={{ fontSize: '10px' }}>
        <header className="graduate-header" style={{ padding: '20px' }}>
          <div className="graduate-greeting" style={{ fontSize: '8px' }}>Hello, I'm</div>
          <h1 className="graduate-name" style={{ fontSize: '24px' }}>{p.fullName || 'User Name'}</h1>
          <p className="graduate-tagline" style={{ fontSize: '12px' }}>{p.jobTitle || 'Graduate'}</p>
          <div className="graduate-contact" style={{ fontSize: '9px' }}>
            {p.email && <span>✉ {p.email}</span>}
            {p.location && <span>📍 {p.location}</span>}
          </div>
        </header>
        <div className="graduate-section">
          {d.summary && (
            <div style={{ marginBottom: '15px' }}>
              <div className="graduate-section-head">
                <div className="graduate-dot" style={{ backgroundColor: '#ff8a65' }}></div>
                <h2 className="graduate-section-title" style={{ fontSize: '12px' }}>About</h2>
                <div className="graduate-section-line"></div>
              </div>
              <div className="graduate-card" style={{ fontSize: '10px' }}>{d.summary}</div>
            </div>
          )}
          {d.education?.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <div className="graduate-section-head">
                <div className="graduate-dot" style={{ backgroundColor: '#8b5cf6' }}></div>
                <h2 className="graduate-section-title" style={{ fontSize: '12px' }}>Education</h2>
                <div className="graduate-section-line"></div>
              </div>
              {d.education.map((edu, i) => (
                <div key={i} className="graduate-card" style={{ marginBottom: '8px' }}>
                  <div className="graduate-edu-item">
                    <div className="graduate-edu-badge" style={{ width: '30px', height: '30px', fontSize: '16px' }}>🎓</div>
                    <div>
                      <div className="graduate-edu-degree" style={{ fontSize: '11px' }}>{edu.degree}</div>
                      <div className="graduate-edu-school" style={{ fontSize: '10px' }}>{edu.school}</div>
                      <div style={{ fontSize: '8px', opacity: 0.6 }}>{edu.endDate}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {d.experience?.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <div className="graduate-section-head">
                <div className="graduate-dot" style={{ backgroundColor: '#0ea5e9' }}></div>
                <h2 className="graduate-section-title" style={{ fontSize: '12px' }}>Experience</h2>
                <div className="graduate-section-line"></div>
              </div>
              {d.experience.map((exp, i) => (
                <div key={i} className="graduate-card" style={{ marginBottom: '8px' }}>
                  <div className="graduate-exp-row" style={{ fontSize: '11px' }}>
                    <span>{exp.title}</span>
                    <span className="graduate-exp-date" style={{ fontSize: '9px' }}>{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="graduate-exp-co" style={{ fontSize: '10px' }}>{exp.company}</div>
                  {exp.description && <div style={{ fontSize: '9px', marginTop: '4px', opacity: 0.8 }}>{exp.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (themeId === 'terminal') {
    return (
      <div className="terminal-theme-wrapper">
        <div className="terminal-container">
          <div className="terminal-window">
            <div className="terminal-titlebar">
              <div className="terminal-titlebar-btn close"></div>
              <div className="terminal-titlebar-btn min"></div>
              <div className="terminal-titlebar-btn max"></div>
              <span className="terminal-titlebar-text">zsh — {p.fullName ? p.fullName.toLowerCase().replace(' ', '_') : 'user'} — 80×24</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-line" style={{ marginBottom: 2 }}>
                <span className="terminal-prompt-prefix">user</span><span className="terminal-prompt-dir">@portfolio</span><span className="terminal-prompt-symbol"> $ </span>
                <span className="terminal-command">cat</span> <span className="terminal-flag">--pretty</span> <span className="terminal-string">~/resume.json</span>
              </div>
              <div className="terminal-ascii-box">
                <div className="terminal-name">{p.fullName?.toUpperCase() || 'USER NAME'}</div>
                <div className="terminal-title">{p.jobTitle || 'PROFESSION'}</div>
              </div>
              <div className="terminal-section">
                <div className="terminal-section-cmd">$ grep <span className="terminal-flag">-i</span> "contact" <span className="terminal-string">info.cfg</span></div>
                <div className="terminal-table-row">
                  <span className="terminal-table-key">  email:</span>
                  <span className="terminal-table-val">{p.email}</span>
                </div>
                <div className="terminal-table-row">
                  <span className="terminal-table-key">  phone:</span>
                  <span className="terminal-table-val">{p.phone}</span>
                </div>
                <div className="terminal-table-row">
                  <span className="terminal-table-key">  location:</span>
                  <span className="terminal-table-val">{p.location}</span>
                </div>
              </div>
              {d.summary && (
                <div className="terminal-section">
                  <div className="terminal-section-cmd">$ echo <span className="terminal-string">$ABOUT_ME</span></div>
                  <div style={{ color: '#c9d1d9', paddingLeft: 4, fontSize: 10, lineHeight: 1.5 }}>
                    {d.summary}
                  </div>
                </div>
              )}
              {d.skills?.length > 0 && (
                <div className="terminal-section">
                  <div className="terminal-section-cmd">$ skills <span className="terminal-flag">--list</span> <span className="terminal-flag">--verbose</span></div>
                  {d.skills.slice(0, 6).map((skill, i) => (
                    <div key={i} className="terminal-skill-bar">
                      <span className="terminal-skill-label">  {skill}</span>
                      <div className="terminal-skill-track"><div className="terminal-skill-fill" style={{ width: `${95 - (i * 5)}%`, background: i % 2 === 0 ? 'linear-gradient(90deg, #7ee787, #56d364)' : 'linear-gradient(90deg, #79c0ff, #58a6ff)' }}></div></div>
                    </div>
                  ))}
                </div>
              )}
              {d.experience?.length > 0 && (
                <div className="terminal-section">
                  <div className="terminal-section-cmd">$ history <span className="terminal-flag">--career</span></div>
                  {d.experience.map((exp, i) => (
                    <div key={i} className="terminal-exp-entry">
                      <div className="terminal-exp-role">{exp.title}</div>
                      <div className="terminal-exp-co">{exp.company}</div>
                      <div className="terminal-exp-date">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                      {exp.description && <div className="terminal-exp-desc"><span>{exp.description}</span></div>}
                    </div>
                  ))}
                </div>
              )}
              <div className="terminal-footer-line">
                <span>
                  <span className="terminal-prompt-prefix">user</span><span className="terminal-prompt-dir">@portfolio</span><span className="terminal-prompt-symbol"> $ </span>
                  <span className="terminal-cursor-blink"></span>
                </span>
                <span style={{ color: '#7ee787' }}>uptime: active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, fontFamily: '"DM Sans", sans-serif', fontSize: '11px', overflow: 'auto', color: t.text }}>
      {/* Header */}
      <div style={{ padding: '18px 18px 12px', borderBottom: `1px solid ${t.border}`, background: themeId === 'dark' ? '#0f0f14' : themeId === 'bold' || themeId === 'sidebar' ? t.accent : t.bg }}>
        {themeId === 'bold' || themeId === 'sidebar' ? (
          <div style={{ color: themeId === 'bold' ? '#111' : '#fff' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{p.fullName || 'Your Name'}</div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{p.jobTitle || 'Job Title'}</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.accent }}>{p.fullName || 'Your Name'}</div>
            <div style={{ fontSize: 12, color: t.text, opacity: 0.6, marginTop: 3 }}>{p.jobTitle || 'Job Title'}</div>
            <div style={{ fontSize: 10, color: t.text, opacity: 0.4, marginTop: 4 }}>
              {[p.email, p.phone, p.location].filter(Boolean).join(' · ')}
            </div>
          </>
        )}
      </div>

      <div style={{ padding: '12px 18px' }}>
        {/* Summary */}
        {d.summary && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent, marginBottom: 5 }}>Summary</div>
            <p style={{ fontSize: 10, lineHeight: 1.6, color: t.text, opacity: 0.7 }}>{d.summary}</p>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent, marginBottom: 6, borderBottom: `1px solid ${t.border}`, paddingBottom: 3 }}>Experience</div>
          {d.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: `2px solid ${t.border}` }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{exp.title}</div>
              <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 2 }}>{exp.company} {exp.startDate && `· ${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`}</div>
              {exp.description && <p style={{ fontSize: 10, lineHeight: 1.6, opacity: 0.65 }}>{exp.description.slice(0, 150)}{exp.description.length > 150 ? '…' : ''}</p>}
            </div>
          ))}
        </div>

        {/* Education */}
        {d.education?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent, marginBottom: 6, borderBottom: `1px solid ${t.border}`, paddingBottom: 3 }}>Education</div>
            {d.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 12 }}>{edu.degree}</div>
                <div style={{ fontSize: 10, opacity: 0.5 }}>{edu.school} {edu.endDate && `· ${edu.endDate}`}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent, marginBottom: 6, borderBottom: `1px solid ${t.border}`, paddingBottom: 3 }}>Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {d.skills.map((s, i) => (
              <span key={i} style={{ background: `${t.accent}15`, color: t.accent, padding: '4px 10px', borderRadius: 100, fontSize: 10, fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Editor ──────────────────────────────────────────────
export default function EditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { profile, resumes, updateResume, fetchResumes, setCurrentResume } = useStore()

  const [resumeData, setResumeData] = useState({})
  const [title, setTitle] = useState('My Resume')
  const [themeId, setThemeId] = useState('classic')

  const [activeSection, setActiveSection] = useState('personal')
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)

  const fileInputRef = useRef(null)
  const [importing, setImporting] = useState(false)

  const saveStatus = useAutoSave(id, resumeData, 2000)

  const [error, setError] = useState(null)

  // Load resume on mount
  useEffect(() => {
    let isMounted = true
    const loadResume = async () => {
      setError(null)
      try {
        const allResumes = await fetchResumes()
        if (!isMounted) return

        const resume = allResumes?.find((r) => r.id === id)
        if (resume) {
          setCurrentResume(resume)
          setResumeData(resume.data || {})
          setTitle(resume.title || 'My Resume')
          setThemeId(resume.theme_id || 'classic')
        } else {
          setError('Resume not found or access denied.')
        }
      } catch (err) {
        if (isMounted) setError('Failed to load resume. Please check your connection.')
        console.error('loadResume error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id && id !== 'new') {
      loadResume()
    } else {
      setLoading(false)
    }

    return () => { isMounted = false }
  }, [id, fetchResumes, setCurrentResume])

  // Watch for auto-download param
  useEffect(() => {
    if (searchParams.get('download') === 'true' && !loading) {
      handleDownload()
    }
  }, [loading])

  const handleSectionData = useCallback((section) => (value) => {
    setResumeData((prev) => ({ ...prev, [section]: value }))
  }, [])

  const handleTitleSave = async () => {
    setEditingTitle(false)
    if (id) await updateResume(id, { title })
  }

  const handleDownload = async () => {
    setDownloading(true)
    toast.info('Generating your PDF…')

    try {
      // Dynamic import for PDF generation
      const { default: jsPDF } = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')

      const previewEl = document.getElementById('resume-preview-content')
      if (!previewEl) throw new Error('Preview not found')

      const canvas = await html2canvas(previewEl, { scale: 2, useCORS: true, backgroundColor: null })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

      // Add watermark for free plan
      if (profile?.plan === 'free' || !profile?.plan) {
        pdf.setFontSize(10)
        pdf.setTextColor(180, 180, 180)
        pdf.text('Made with ResumeBuildIn', pdfWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' })
      }

      pdf.save(`${title || 'resume'}.pdf`)
      toast.success('PDF downloaded!')
    } catch (err) {
      toast.error('PDF generation failed. Try again.')
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  const handleDocxDownload = async () => {
    toast.info('Generating DOCX...')
    try {
      const { exportToDocx } = await import('../lib/docxExport')
      await exportToDocx(resumeData, themeId, profile?.plan || 'free')
      toast.success('DOCX downloaded!')
    } catch (err) {
      toast.error('DOCX generation failed.')
      console.error(err)
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    toast.info('Extracting text...')
    try {
      const { extractTextFromPDF, extractTextFromDocx, parseResumeWithAI } = await import('../lib/ai')
      let text = ''

      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file)
      } else if (file.type.includes('wordprocessingml') || file.name.endsWith('.docx')) {
        text = await extractTextFromDocx(file)
      } else {
        throw new Error('Unsupported file type')
      }
      toast.info('AI is parsing your resume...')
      const parsed = await parseResumeWithAI(text)
      setResumeData(parsed)
      toast.success('Resume imported and fields populated!')
    } catch (err) {
      toast.error('Could not import. ' + err.message)
      console.error(err)
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--parchment)' }}>
        <div className="spinner" style={{ color: 'var(--gold)', width: 32, height: 32 }} />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--parchment)', padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🚧</div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>{error}</h2>
        <p style={{ color: 'var(--ink-60)', marginBottom: 24 }}>The data might still be syncing or the link is invalid.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Reload Page</button>
          <Link to="/dashboard" className="btn btn-outline">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const renderSection = () => {
    if (!resumeData) return null
    const s = resumeData

    switch (activeSection) {
      case 'personal': return <PersonalSection data={s.personal || {}} onChange={handleSectionData('personal')} />
      case 'summary': return <SummarySection data={s.summary || ''} onChange={handleSectionData('summary')} />
      case 'experience': return <ExperienceSection data={s.experience || []} onChange={handleSectionData('experience')} />
      case 'education': return <EducationSection data={s.education || []} onChange={handleSectionData('education')} />
      case 'skills': return <SkillsSection data={s.skills || []} onChange={handleSectionData('skills')} />
      case 'languages': return <LanguagesSection data={s.languages || []} onChange={handleSectionData('languages')} />
      case 'certifications': return <CertificationsSection data={s.certifications || []} onChange={handleSectionData('certifications')} />
      case 'projects': return <ProjectsSection data={s.projects || []} onChange={handleSectionData('projects')} />
      default: return null
    }
  }

  const activeSec = SECTIONS.find((s) => s.id === activeSection)

  return (
    <div className={styles.editor}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Link to="/dashboard" className="btn btn-ghost btn-sm">
            ← Dashboard
          </Link>
          <div className={styles.toolbarDivider} />

          {/* Editable title */}
          {editingTitle ? (
            <input
              className={`form-input ${styles.titleInput}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              autoFocus
            />
          ) : (
            <button className={styles.titleBtn} onClick={() => setEditingTitle(true)}>
              {title} ✎
            </button>
          )}
        </div>

        <div className={styles.toolbarCenter}>
          <Link to="/themes" className="btn btn-ghost btn-sm">
            ✦ Change Theme
          </Link>
        </div>

        <div className={styles.toolbarRight}>
          {/* Save status */}
          <span className={styles.saveStatus}>
            {saveStatus === 'saving' && <><div className="spinner" style={{ width: 12, height: 12 }} /> Saving…</>}
            {saveStatus === 'saved' && <span style={{ color: 'var(--emerald)' }}>● Saved</span>}
            {saveStatus === 'error' && <span style={{ color: 'var(--rose)' }}>⚠ Save failed</span>}
          </span>

          <div className={styles.toolbarDivider} />

          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-outline btn-sm" onClick={() => fileInputRef.current?.click()} disabled={importing}>
              {importing ? 'Importing…' : '⇪ Import Resume (PDF/DOCX)'}
            </button>
            <input type="file" accept="application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport} />

            <button
              className="btn btn-gold btn-sm"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? 'Generating…' : '↓ PDF'}
            </button>
            <button
              className="btn btn-gold btn-sm"
              onClick={handleDocxDownload}
            >
              ↓ DOCX
            </button>
          </div>
        </div>
      </div>

      {/* ── Three-panel layout ── */}
      <div className={styles.layout}>
        {/* Section nav sidebar */}
        <div className={styles.sectionNav}>
          <div className={styles.navTitle}>Sections</div>
          {SECTIONS.map((sec) => {
            const hasData = resumeData && (
              sec.id === 'personal' ? !!(resumeData.personal?.fullName)
                : sec.id === 'summary' ? !!(resumeData.summary)
                  : Array.isArray(resumeData[sec.id]) ? resumeData[sec.id].length > 0
                    : false
            )
            return (
              <button
                key={sec.id}
                className={`${styles.navItem} ${activeSection === sec.id ? styles.navActive : ''}`}
                onClick={() => setActiveSection(sec.id)}
              >
                <span className={styles.navIcon}>{sec.icon}</span>
                {sec.label}
                {hasData && <span className={styles.navDot} />}
              </button>
            )
          })}
        </div>

        {/* Form area */}
        <div className={styles.formArea}>
          <div className={styles.formAreaHeader}>
            <h3 className={styles.sectionTitle}>
              {activeSec?.icon} {activeSec?.label}
            </h3>
          </div>
          <div className={styles.formAreaBody}>
            {renderSection()}
          </div>
        </div>

        {/* Live preview */}
        <div className={styles.previewPanel}>
          <div className={styles.previewTopbar}>
            <span className={styles.previewLabel}>Live Preview</span>
            <span className="badge badge-dark" style={{ fontSize: 9 }}>{themeId}</span>
          </div>
          <div className={styles.previewWrapper}>
            <div id="resume-preview-content" className={styles.previewDoc}>
              <LivePreview resumeData={resumeData} themeId={themeId} />
            </div>
          </div>
          <div className={styles.previewFooter}>
            <p>Full-fidelity theme renders in exported PDF</p>
          </div>
        </div>
      </div>
    </div>
  )
}
