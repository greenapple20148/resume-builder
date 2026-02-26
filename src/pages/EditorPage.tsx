import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { toast } from '../components/Toast'
import { PREVIEW_MAP } from './ThemesPreviews'
import type { ResumeData, PersonalInfo, ExperienceEntry, EducationEntry, LanguageEntry, CertificationEntry, ProjectEntry } from '../types/resume'
import { useSEO } from '../lib/useSEO'

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: '●' },
  { id: 'summary', label: 'Summary', icon: '■' },
  { id: 'experience', label: 'Experience', icon: '✦' },
  { id: 'education', label: 'Education', icon: '✦' },
  { id: 'skills', label: 'Skills', icon: '◆' },
  { id: 'languages', label: 'Languages', icon: '◇' },
  { id: 'certifications', label: 'Certifications', icon: '●' },
  { id: 'projects', label: 'Projects', icon: '◑' },
] as const

type SectionId = typeof SECTIONS[number]['id']

// ─── Auto-save hook ──────────────────────────────────────────
function useAutoSave(resumeId: string | undefined, data: any, delay = 1500) {
  const { updateResume } = useStore()
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (!resumeId || resumeId === 'new') return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setStatus('saving')

    timeoutRef.current = setTimeout(async () => {
      try {
        await updateResume(resumeId, { data })
        setStatus('saved')
      } catch {
        setStatus('error')
      }
    }, delay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [data, resumeId, delay, updateResume])

  return status
}

// ─── Reusable Add Button ─────────────────────────────────────
function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-transparent border-2 border-dashed border-ink-10 rounded-xl text-[13px] font-medium text-ink-40 cursor-pointer transition-all hover:border-gold hover:text-gold hover:bg-[rgba(201,146,60,0.04)]"
      onClick={onClick}
    >
      <span className="w-5 h-5 rounded-full bg-ink-05 flex items-center justify-center text-sm leading-none">+</span>
      {label}
    </button>
  )
}

// ─── Section Header ──────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="mb-6 pb-5 border-b border-ink-10">
      <div className="flex items-center gap-2.5 mb-1">
        <span className="text-base">{icon}</span>
        <h3 className="text-lg font-display font-normal tracking-tight" style={{ fontSize: 20, lineHeight: 1.2 }}>{title}</h3>
      </div>
      <p className="text-[12.5px] text-ink-40 leading-relaxed ml-[30px]">{subtitle}</p>
    </div>
  )
}

// ─── Form fields ─────────────────────────────────────────────
interface FieldProps {
  label: string
  value: string | undefined
  onChange: (val: string) => void
  type?: string
  placeholder?: string
}

function Field({ label, value, onChange, type = 'text', placeholder = '' }: FieldProps) {
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

interface TextAreaProps {
  label: string
  value: string | undefined
  onChange: (val: string) => void
  placeholder?: string
  rows?: number
}

function TextArea({ label, value, onChange, placeholder = '', rows = 3 }: TextAreaProps) {
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

// ─── Section Components ─────────────────────────────────────
interface SectionProps<T> {
  data: T
  onChange: (val: T) => void
}

function PersonalSection({ data, onChange }: SectionProps<PersonalInfo>) {
  const set = (field: keyof PersonalInfo) => (val: string) => onChange({ ...data, [field]: val })
  return (
    <>
      <SectionHeader icon="●" title="Personal Information" subtitle="Your contact details and basic info. This appears at the top of your resume." />
      <div className="flex flex-col gap-4">
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
    </>
  )
}

function SummarySection({ data, onChange }: SectionProps<string>) {
  const [isAiLoading, setIsAiLoading] = useState(false)

  const handleAi = async () => {
    setIsAiLoading(true)
    toast.info('AI is rewriting your summary...')
    try {
      const { enhanceTextWithAI } = await import('../lib/ai')
      const improved = await enhanceTextWithAI(data || '')
      onChange(improved)
      toast.success('Summary improved!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsAiLoading(false)
    }
  }

  return (
    <>
      <SectionHeader icon="■" title="Professional Summary" subtitle="A brief overview of your experience and career goals. 3-4 impactful sentences work best." />
      <div className="flex flex-col gap-3">
        <TextArea
          label="Summary"
          value={data}
          onChange={onChange}
          placeholder="Experienced professional with 8+ years in product management..."
          rows={5}
        />
        <div className="flex justify-between items-center">
          <p className="text-[11.5px] text-ink-20 leading-relaxed italic m-0">💡 Tip: Highlight your biggest strengths and what makes you unique.</p>
          <button className="btn btn-ghost btn-sm text-gold" style={{ fontSize: 12 }} onClick={handleAi} disabled={isAiLoading || !data}>
            {isAiLoading ? '✨ Rewriting…' : '✨ AI Rewrite'}
          </button>
        </div>
      </div>
    </>
  )
}

function ExperienceSection({ data = [], onChange }: SectionProps<ExperienceEntry[]>) {
  const [aiLoadingIdx, setAiLoadingIdx] = useState<number | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(data.length > 0 ? 0 : null)

  const add = () => {
    onChange([...data, { id: Date.now(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }])
    setExpandedIdx(data.length)
  }
  const remove = (idx: number) => {
    onChange(data.filter((_, i) => i !== idx))
    setExpandedIdx(null)
  }
  const update = (idx: number, field: keyof ExperienceEntry, val: any) => {
    const next = [...data]
    next[idx] = { ...next[idx], [field]: val }
    onChange(next)
  }

  const handleAi = async (idx: number, text: string) => {
    if (!text) return
    setAiLoadingIdx(idx)
    toast.info('AI is rewriting experience...')
    try {
      const { enhanceTextWithAI } = await import('../lib/ai')
      const improved = await enhanceTextWithAI(text)
      update(idx, 'description', improved)
      toast.success('Experience improved!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setAiLoadingIdx(null)
    }
  }

  return (
    <>
      <SectionHeader icon="✦" title="Work Experience" subtitle="List your work history, starting with the most recent position." />
      <div className="flex flex-col gap-3">
        {data.map((exp, idx) => (
          <div key={exp.id || idx} className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden transition-all">
            {/* Collapsed header — always visible */}
            <button
              className="flex items-center justify-between w-full px-5 py-3.5 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-ink-05"
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${exp.title && exp.company ? 'bg-emerald' : 'bg-ink-10'}`} />
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-ink truncate">{exp.title || `Position ${idx + 1}`}</div>
                  {exp.company && <div className="text-[11.5px] text-ink-40 truncate">{exp.company} {exp.startDate && `· ${exp.startDate} – ${exp.current ? 'Present' : exp.endDate || '…'}`}</div>}
                </div>
              </div>
              <span className={`text-ink-20 text-xs transition-transform shrink-0 ml-2 ${expandedIdx === idx ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Expanded form */}
            {expandedIdx === idx && (
              <div className="px-5 pb-5 pt-2 border-t border-ink-10 flex flex-col gap-3" style={{ animation: 'fadeUp 0.2s ease both' }}>
                <div className="form-row">
                  <Field label="Job Title" value={exp.title} onChange={(v) => update(idx, 'title', v)} placeholder="Senior Designer" />
                  <Field label="Company" value={exp.company} onChange={(v) => update(idx, 'company', v)} placeholder="Acme Corp" />
                </div>
                <div className="form-row">
                  <Field label="Start Date" value={exp.startDate} onChange={(v) => update(idx, 'startDate', v)} placeholder="Jan 2020" />
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input type="text" className="form-input" value={exp.current ? 'Present' : (exp.endDate || '')} onChange={(e) => update(idx, 'endDate', e.target.value)} disabled={exp.current} placeholder="Dec 2023" />
                    <label className="flex items-center gap-1.5 text-xs text-ink-40 mt-1.5 cursor-pointer select-none">
                      <input type="checkbox" checked={exp.current || false} onChange={(e) => update(idx, 'current', e.target.checked)} className="accent-gold" />
                      Currently working here
                    </label>
                  </div>
                </div>
                <Field label="Location" value={exp.location} onChange={(v) => update(idx, 'location', v)} placeholder="New York, NY" />
                <TextArea label="Key Achievements & Responsibilities" value={exp.description} onChange={(v) => update(idx, 'description', v)} placeholder="• Led cross-functional team of 8 to ship payments redesign..." rows={4} />
                <div className="flex justify-between items-center mt-[-4px]">
                  <button className="btn btn-danger btn-sm" style={{ fontSize: 11 }} onClick={() => remove(idx)}>Remove</button>
                  <button className="btn btn-ghost btn-sm text-gold" style={{ fontSize: 11 }} onClick={() => handleAi(idx, exp.description)} disabled={aiLoadingIdx === idx || !exp.description}>
                    {aiLoadingIdx === idx ? '✨ Rewriting…' : '✨ AI Rewrite'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        <AddButton label="Add Experience" onClick={add} />
      </div>
    </>
  )
}

function EducationSection({ data = [], onChange }: SectionProps<EducationEntry[]>) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(data.length > 0 ? 0 : null)
  const add = () => { onChange([...data, { id: Date.now(), degree: '', school: '', location: '', startDate: '', endDate: '', gpa: '', notes: '' }]); setExpandedIdx(data.length) }
  const remove = (idx: number) => { onChange(data.filter((_, i) => i !== idx)); setExpandedIdx(null) }
  const update = (idx: number, field: keyof EducationEntry, val: string) => {
    const next = [...data]; next[idx] = { ...next[idx], [field]: val }; onChange(next)
  }

  return (
    <>
      <SectionHeader icon="✦" title="Education" subtitle="Your academic background (degrees, certifications, bootcamps)." />
      <div className="flex flex-col gap-3">
        {data.map((edu, idx) => (
          <div key={edu.id || idx} className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden transition-all">
            <button
              className="flex items-center justify-between w-full px-5 py-3.5 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-ink-05"
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${edu.degree && edu.school ? 'bg-emerald' : 'bg-ink-10'}`} />
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-ink truncate">{edu.degree || `Degree ${idx + 1}`}</div>
                  {edu.school && <div className="text-[11.5px] text-ink-40 truncate">{edu.school} {edu.startDate && `· ${edu.startDate} – ${edu.endDate || '…'}`}</div>}
                </div>
              </div>
              <span className={`text-ink-20 text-xs transition-transform shrink-0 ml-2 ${expandedIdx === idx ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {expandedIdx === idx && (
              <div className="px-5 pb-5 pt-2 border-t border-ink-10 flex flex-col gap-3" style={{ animation: 'fadeUp 0.2s ease both' }}>
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
                <Field label="Honors / Notes" value={edu.notes} onChange={(v) => update(idx, 'notes', v)} placeholder="Summa Cum Laude, Dean's List" />
                <div className="flex justify-end mt-[-4px]">
                  <button className="btn btn-danger btn-sm" style={{ fontSize: 11 }} onClick={() => remove(idx)}>Remove</button>
                </div>
              </div>
            )}
          </div>
        ))}
        <AddButton label="Add Education" onClick={add} />
      </div>
    </>
  )
}

function SkillsSection({ data = [], onChange }: SectionProps<string[]>) {
  const [input, setInput] = useState('')
  const add = () => {
    const trimmed = input.trim()
    if (!trimmed || data.includes(trimmed)) return
    onChange([...data, trimmed])
    setInput('')
  }
  const remove = (s: string) => onChange(data.filter((x) => x !== s))

  return (
    <>
      <SectionHeader icon="◆" title="Skills" subtitle="Add your technical and soft skills. Type and press Enter to add." />
      <div className="flex flex-col gap-5">
        <div className="flex gap-2.5">
          <input type="text" className="form-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Type a skill and press Enter…" />
          <button className="btn btn-outline shrink-0" onClick={add} disabled={!input.trim()}>Add</button>
        </div>
        {data.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1.5 bg-ink dark:bg-gold text-parchment dark:text-white px-3 py-[5px] rounded-full text-xs font-medium transition-all hover:shadow-sm">
                {skill}
                <button className="bg-transparent border-none cursor-pointer text-[rgba(250,248,243,0.5)] text-[10px] p-0 leading-none transition-colors hover:text-parchment" onClick={() => remove(skill)}>✕</button>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-ink-20 text-[13px]">
            No skills added yet. Start typing above to add your first skill.
          </div>
        )}
      </div>
    </>
  )
}

function LanguagesSection({ data = [], onChange }: SectionProps<LanguageEntry[]>) {
  const add = () => onChange([...data, { id: Date.now(), language: '', level: 'Fluent' }])
  const remove = (idx: number) => onChange(data.filter((_, i) => i !== idx))
  const update = (idx: number, field: keyof LanguageEntry, val: string) => {
    const next = [...data]; next[idx] = { ...next[idx], [field]: val }; onChange(next)
  }
  const LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic']

  return (
    <>
      <SectionHeader icon="◇" title="Languages" subtitle="Languages you speak and your proficiency level." />
      <div className="flex flex-col gap-3">
        {data.map((lang, idx) => (
          <div key={lang.id || idx} className="flex gap-2.5 items-end bg-[var(--white)] border border-ink-10 rounded-xl px-4 py-3">
            <div className="form-group flex-1">
              <label className="form-label">Language</label>
              <input className="form-input" value={lang.language} onChange={(e) => update(idx, 'language', e.target.value)} placeholder="e.g. Spanish" />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Proficiency</label>
              <select className="form-input form-select" value={lang.level} onChange={(e) => update(idx, 'level', e.target.value)}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <button className="btn btn-ghost btn-icon btn-sm shrink-0 mb-0.5" onClick={() => remove(idx)}>✕</button>
          </div>
        ))}
        <AddButton label="Add Language" onClick={add} />
      </div>
    </>
  )
}

function CertificationsSection({ data = [], onChange }: SectionProps<CertificationEntry[]>) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(data.length > 0 ? 0 : null)
  const add = () => { onChange([...data, { id: Date.now(), name: '', issuer: '', date: '', url: '' }]); setExpandedIdx(data.length) }
  const remove = (idx: number) => { onChange(data.filter((_, i) => i !== idx)); setExpandedIdx(null) }
  const update = (idx: number, field: keyof CertificationEntry, val: string) => {
    const next = [...data]; next[idx] = { ...next[idx], [field]: val }; onChange(next)
  }

  return (
    <>
      <SectionHeader icon="●" title="Certifications" subtitle="Professional certifications and licenses." />
      <div className="flex flex-col gap-3">
        {data.map((cert, idx) => (
          <div key={cert.id || idx} className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden transition-all">
            <button
              className="flex items-center justify-between w-full px-5 py-3.5 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-ink-05"
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${cert.name ? 'bg-emerald' : 'bg-ink-10'}`} />
                <div className="text-[13px] font-semibold text-ink truncate">{cert.name || `Certificate ${idx + 1}`}</div>
              </div>
              <span className={`text-ink-20 text-xs transition-transform shrink-0 ml-2 ${expandedIdx === idx ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {expandedIdx === idx && (
              <div className="px-5 pb-5 pt-2 border-t border-ink-10 flex flex-col gap-3" style={{ animation: 'fadeUp 0.2s ease both' }}>
                <div className="form-row">
                  <Field label="Certificate Name" value={cert.name} onChange={(v) => update(idx, 'name', v)} placeholder="AWS Solutions Architect" />
                  <Field label="Issuing Organization" value={cert.issuer} onChange={(v) => update(idx, 'issuer', v)} placeholder="Amazon Web Services" />
                </div>
                <div className="form-row">
                  <Field label="Date" value={cert.date} onChange={(v) => update(idx, 'date', v)} placeholder="Mar 2023" />
                  <Field label="Certificate URL (optional)" value={cert.url} onChange={(v) => update(idx, 'url', v)} placeholder="https://..." />
                </div>
                <div className="flex justify-end mt-[-4px]">
                  <button className="btn btn-danger btn-sm" style={{ fontSize: 11 }} onClick={() => remove(idx)}>Remove</button>
                </div>
              </div>
            )}
          </div>
        ))}
        <AddButton label="Add Certification" onClick={add} />
      </div>
    </>
  )
}

function ProjectsSection({ data = [], onChange }: SectionProps<ProjectEntry[]>) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(data.length > 0 ? 0 : null)
  const add = () => { onChange([...data, { id: Date.now(), name: '', description: '', url: '', tech: '' }]); setExpandedIdx(data.length) }
  const remove = (idx: number) => { onChange(data.filter((_, i) => i !== idx)); setExpandedIdx(null) }
  const update = (idx: number, field: keyof ProjectEntry, val: string) => {
    const next = [...data]; next[idx] = { ...next[idx], [field]: val }; onChange(next)
  }

  return (
    <>
      <SectionHeader icon="◑" title="Projects" subtitle="Personal or open-source projects that showcase your skills." />
      <div className="flex flex-col gap-3">
        {data.map((proj, idx) => (
          <div key={proj.id || idx} className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden transition-all">
            <button
              className="flex items-center justify-between w-full px-5 py-3.5 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-ink-05"
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${proj.name ? 'bg-emerald' : 'bg-ink-10'}`} />
                <div className="text-[13px] font-semibold text-ink truncate">{proj.name || `Project ${idx + 1}`}</div>
              </div>
              <span className={`text-ink-20 text-xs transition-transform shrink-0 ml-2 ${expandedIdx === idx ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {expandedIdx === idx && (
              <div className="px-5 pb-5 pt-2 border-t border-ink-10 flex flex-col gap-3" style={{ animation: 'fadeUp 0.2s ease both' }}>
                <div className="form-row">
                  <Field label="Project Name" value={proj.name} onChange={(v) => update(idx, 'name', v)} placeholder="Open Source Dashboard" />
                  <Field label="URL (optional)" value={proj.url} onChange={(v) => update(idx, 'url', v)} placeholder="github.com/user/project" />
                </div>
                <Field label="Technologies Used" value={proj.tech} onChange={(v) => update(idx, 'tech', v)} placeholder="React, Node.js, PostgreSQL" />
                <TextArea label="Description" value={proj.description} onChange={(v) => update(idx, 'description', v)} placeholder="Built a real-time analytics dashboard..." rows={3} />
                <div className="flex justify-end mt-[-4px]">
                  <button className="btn btn-danger btn-sm" style={{ fontSize: 11 }} onClick={() => remove(idx)}>Remove</button>
                </div>
              </div>
            )}
          </div>
        ))}
        <AddButton label="Add Project" onClick={add} />
      </div>
    </>
  )
}

// ─── Live Preview ─────────────────────────────────────────────
interface LivePreviewProps {
  resumeData: Partial<ResumeData>
  themeId: string
}

function LivePreview({ resumeData, themeId }: LivePreviewProps) {
  const PreviewComponent = PREVIEW_MAP[themeId] || PREVIEW_MAP.classic
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', background: 'var(--ink-05)' }}>
      <div style={{
        width: '210mm',
        minHeight: '297mm',
        margin: '40px auto',
        background: '#fff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        <PreviewComponent data={resumeData} />
      </div>
    </div>
  )
}

// ─── Section completeness helper ─────────────────────────────
function getSectionStatus(data: Partial<ResumeData>, sectionId: string): 'empty' | 'partial' | 'complete' {
  switch (sectionId) {
    case 'personal': {
      const p = data.personal as PersonalInfo | undefined
      if (!p) return 'empty'
      const filled = [p.fullName, p.email, p.jobTitle].filter(Boolean).length
      return filled === 0 ? 'empty' : filled >= 2 ? 'complete' : 'partial'
    }
    case 'summary': return data.summary ? 'complete' : 'empty'
    case 'experience': return (data.experience?.length || 0) > 0 ? 'complete' : 'empty'
    case 'education': return (data.education?.length || 0) > 0 ? 'complete' : 'empty'
    case 'skills': return (data.skills?.length || 0) > 0 ? 'complete' : 'empty'
    case 'languages': return (data.languages?.length || 0) > 0 ? 'complete' : 'empty'
    case 'certifications': return (data.certifications?.length || 0) > 0 ? 'complete' : 'empty'
    case 'projects': return (data.projects?.length || 0) > 0 ? 'complete' : 'empty'
    default: return 'empty'
  }
}

// ─── Main Editor Component ─────────────────────────────────────
export default function EditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { profile, updateResume, fetchResumes, setCurrentResume } = useStore()

  const [resumeData, setResumeData] = useState<Partial<ResumeData>>({})
  const [title, setTitle] = useState('My Resume')
  const [themeId, setThemeId] = useState('classic')

  const [activeSection, setActiveSection] = useState<SectionId>('personal')
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)

  const saveStatus = useAutoSave(id, resumeData, 2000)
  const [error, setError] = useState<string | null>(null)

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
        if (isMounted) setError('Failed to load resume.')
        console.error(err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id && id !== 'new') loadResume()
    else setLoading(false)

    return () => { isMounted = false }
  }, [id, fetchResumes, setCurrentResume])

  useEffect(() => {
    if (searchParams.get('download') === 'true' && !loading) {
      handleDownload()
    }
  }, [loading, searchParams])

  const handleSectionData = useCallback((section: keyof ResumeData) => (value: any) => {
    setResumeData((prev) => ({ ...prev, [section]: value }))
  }, [])

  const handleTitleSave = async () => {
    setEditingTitle(false)
    if (id) await updateResume(id, { title })
  }

  const handleDownload = async () => {
    setDownloading(true)
    toast.info('Generating PDF…')
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')

      const previewEl = document.getElementById('resume-preview-content')
      if (!previewEl) throw new Error('Preview not found')

      const canvas = await html2canvas(previewEl, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

      if (profile?.plan === 'free' || !profile?.plan) {
        pdf.text('Made with ResumeBuildIn', pdfWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' })
      }

      pdf.save(`${title || 'resume'}.pdf`)
      toast.success('PDF downloaded!')
    } catch (err) {
      toast.error('PDF generation failed.')
    } finally {
      setDownloading(false)
    }
  }

  const handleDocxDownload = async () => {
    toast.info('Generating DOCX...')
    try {
      const { exportToDocx } = await import('../lib/docxExport')
      await exportToDocx(resumeData as ResumeData, themeId, profile?.plan || 'free')
      toast.success('DOCX downloaded!')
    } catch (err) {
      toast.error('DOCX failed.')
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    toast.info('Importing...')
    try {
      const { extractTextFromPDF, extractTextFromDocx, parseResumeWithAI } = await import('../lib/ai')
      let text = ''
      if (file.type === 'application/pdf') text = await extractTextFromPDF(file)
      else text = await extractTextFromDocx(file)

      const parsed = await parseResumeWithAI(text)
      setResumeData(parsed)
      toast.success('Imported!')
    } catch (err: any) {
      toast.error('Import failed: ' + err.message)
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Section navigation
  const sectionIds = SECTIONS.map(s => s.id)
  const currentIdx = sectionIds.indexOf(activeSection)
  const goPrev = () => { if (currentIdx > 0) setActiveSection(sectionIds[currentIdx - 1] as SectionId) }
  const goNext = () => { if (currentIdx < sectionIds.length - 1) setActiveSection(sectionIds[currentIdx + 1] as SectionId) }

  useSEO({
    title: `Editing: ${title}`,
    description: 'Edit your resume with the ResumeBuildIn live editor.',
    path: `/editor/${id}`,
    noindex: true,
  })

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>
  if (error) return <div className="error-screen"><h2>{error}</h2><Link to="/dashboard">Back</Link></div>

  const renderSection = () => {
    const s = resumeData
    switch (activeSection) {
      case 'personal': return <PersonalSection data={(s.personal as PersonalInfo) || {}} onChange={handleSectionData('personal')} />
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

  const completedCount = SECTIONS.filter(s => getSectionStatus(resumeData, s.id) === 'complete').length

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-parchment">
      {/* ── Top Toolbar ─────────────────────────── */}
      <div className="h-[54px] bg-[var(--white)] border-b border-ink-10 flex items-center justify-between px-4 gap-3 shrink-0 z-10">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Link to="/dashboard" className="btn btn-ghost btn-sm shrink-0">← Back</Link>
          <div className="w-px h-5 bg-ink-10 shrink-0" />
          {editingTitle ? (
            <input autoFocus className="form-input w-[200px] px-2 py-1 h-8 text-sm font-medium" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleTitleSave} onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()} />
          ) : (
            <span className="bg-transparent border-none text-sm font-medium text-ink cursor-pointer px-2 py-1 rounded-sm transition-colors hover:bg-ink-05 truncate" onClick={() => setEditingTitle(true)}>{title}</span>
          )}
          <div className="flex items-center gap-1.5 text-xs font-mono text-ink-40 whitespace-nowrap shrink-0">
            {saveStatus === 'saving' && <><div className="spinner" style={{ width: 12, height: 12 }} /> Saving…</>}
            {saveStatus === 'saved' && <span className="text-emerald">✓ Saved</span>}
            {saveStatus === 'error' && <span className="text-rose">⚠ Error</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <input type="file" ref={fileInputRef} accept=".pdf,.docx" className="hidden" onChange={handleImport} />
          <button className="btn btn-ghost btn-sm" onClick={() => fileInputRef.current?.click()} disabled={importing}>
            {importing ? '⏳ Importing…' : '📥 Import'}
          </button>
          <div className="w-px h-5 bg-ink-10" />
          <button className="btn btn-outline btn-sm" onClick={handleDownload} disabled={downloading}>
            {downloading ? 'Generating…' : '📄 PDF'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleDocxDownload}>📝 DOCX</button>
        </div>
      </div>

      {/* ── Main Layout ────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[210px] max-md:w-[52px] bg-[var(--white)] border-r border-ink-10 py-4 overflow-y-auto shrink-0 flex flex-col">
          <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink-20 px-4 mb-2 max-md:hidden">Sections</div>
          <div className="flex-1">
            {SECTIONS.map((sec) => {
              const status = getSectionStatus(resumeData, sec.id)
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as SectionId)}
                  className={`group flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] bg-transparent border-none border-l-[3px] cursor-pointer text-left transition-all ${activeSection === sec.id ? '!bg-gold-pale !text-gold border-l-gold font-semibold' : 'text-ink-40 border-l-transparent hover:bg-ink-05 hover:text-ink'}`}
                >
                  <span className={`w-[7px] h-[7px] rounded-full shrink-0 transition-colors ${status === 'complete' ? 'bg-emerald' : status === 'partial' ? 'bg-gold' : 'bg-ink-10'}`} />
                  <span className="max-md:hidden">{sec.label}</span>
                </button>
              )
            })}
          </div>
          {/* Progress */}
          <div className="px-4 pt-3 mt-auto border-t border-ink-10 max-md:hidden">
            <div className="text-[10px] font-mono text-ink-20 mb-2">{completedCount}/{SECTIONS.length} sections</div>
            <div className="h-1.5 bg-ink-05 rounded-full overflow-hidden">
              <div className="h-full bg-emerald rounded-full transition-all duration-500" style={{ width: `${(completedCount / SECTIONS.length) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Editor Form */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[640px] mx-auto px-8 py-8">
            {renderSection()}

            {/* Section Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-ink-10">
              {currentIdx > 0 ? (
                <button className="btn btn-outline btn-sm" onClick={goPrev}>
                  ← {SECTIONS[currentIdx - 1].label}
                </button>
              ) : <div />}
              {currentIdx < SECTIONS.length - 1 ? (
                <button className="btn btn-gold btn-sm" onClick={goNext}>
                  {SECTIONS[currentIdx + 1].label} →
                </button>
              ) : (
                <button className="btn btn-gold btn-sm" onClick={handleDownload} disabled={downloading}>
                  📄 Download PDF
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-[540px] max-xl:hidden border-l border-ink-10 flex flex-col shrink-0">
          <div id="resume-preview-content">
            <LivePreview resumeData={resumeData} themeId={themeId} />
          </div>
        </div>
      </div>
    </div>
  )
}
