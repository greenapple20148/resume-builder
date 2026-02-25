import React, { useState, useEffect, useRef, useCallback } from 'react'
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
import '../styles/futuristic.css'
import { PREVIEW_MAP } from './ThemesPreviews'
import { ResumeData, PersonalInfo, ExperienceEntry, EducationEntry, LanguageEntry, CertificationEntry, ProjectEntry, SaveStatus } from '../types'

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
] as const

type SectionId = typeof SECTIONS[number]['id']

// ─── Auto-save hook ──────────────────────────────────────────
function useAutoSave(resumeId: string | undefined, data: any, delay = 1500) {
  const { updateResume } = useStore()
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const timerRef = useRef<NodeJS.Timeout | null>(null)
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

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [JSON.stringify(data), resumeId, delay, updateResume])

  return saveStatus
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
    <div className={styles.sectionForm}>
      <TextArea
        label="Professional Summary"
        value={data}
        onChange={onChange}
        placeholder="Experienced professional with 8+ years in product management..."
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

function ExperienceSection({ data = [], onChange }: SectionProps<ExperienceEntry[]>) {
  const [aiLoadingIdx, setAiLoadingIdx] = useState<number | null>(null)

  const add = () => onChange([...data, { id: Date.now(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }])
  const remove = (idx: number) => onChange(data.filter((_, i) => i !== idx))
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
            placeholder="• Led cross-functional team of 8 to ship payments redesign..."
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

function EducationSection({ data = [], onChange }: SectionProps<EducationEntry[]>) {
  const add = () => onChange([...data, { id: Date.now(), degree: '', school: '', location: '', startDate: '', endDate: '', gpa: '', notes: '' }])
  const remove = (idx: number) => onChange(data.filter((_, i) => i !== idx))
  const update = (idx: number, field: keyof EducationEntry, val: string) => {
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
      </div>
    </div>
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

function CertificationsSection({ data = [], onChange }: SectionProps<CertificationEntry[]>) {
  const add = () => onChange([...data, { id: Date.now(), name: '', issuer: '', date: '', url: '' }])
  const remove = (idx: number) => onChange(data.filter((_, i) => i !== idx))
  const update = (idx: number, field: keyof CertificationEntry, val: string) => {
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

function ProjectsSection({ data = [], onChange }: SectionProps<ProjectEntry[]>) {
  const add = () => onChange([...data, { id: Date.now(), name: '', description: '', url: '', tech: '' }])
  const remove = (idx: number) => onChange(data.filter((_, i) => i !== idx))
  const update = (idx: number, field: keyof ProjectEntry, val: string) => {
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
          <TextArea label="Description" value={proj.description} onChange={(v) => update(idx, 'description', v)} placeholder="Built a real-time analytics dashboard..." rows={3} />
        </div>
      ))}
      <button className={styles.addBtn} onClick={add}><span>+</span> Add Project</button>
    </div>
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
    <div style={{ width: '100%', height: '100%', overflow: 'auto', background: '#f8f9fa' }}>
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

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Link to="/dashboard" className="btn btn-ghost btn-sm">← Back</Link>
          <div className={styles.toolbarDivider} />
          {editingTitle ? (
            <input
              autoFocus
              className={`form-input ${styles.titleInput}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
            />
          ) : (
            <span className={styles.titleBtn} onClick={() => setEditingTitle(true)}>{title}</span>
          )}
          <div className={styles.saveStatus}>
            {saveStatus === 'saving' && <><div className="spinner" style={{ width: 12, height: 12 }} /> Saving…</>}
            {saveStatus === 'saved' && '✓ Saved'}
            {saveStatus === 'error' && '⚠ Error'}
          </div>
        </div>
        <div className={styles.toolbarRight}>
          <button className="btn btn-outline btn-sm" onClick={handleDownload} disabled={downloading}>
            {downloading ? 'Generating…' : '📄 PDF'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleDocxDownload}>📝 DOCX</button>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.sectionNav}>
          <div className={styles.navTitle}>Sections</div>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as SectionId)}
              className={`${styles.navItem} ${activeSection === sec.id ? styles.navActive : ''}`}
            >
              <span className={styles.navIcon}>{sec.icon}</span>
              {sec.label}
            </button>
          ))}
        </div>
        <div className={styles.formArea}>{renderSection()}</div>
        <div className={styles.previewPanel}>
          <div id="resume-preview-content">
            <LivePreview resumeData={resumeData} themeId={themeId} />
          </div>
        </div>
      </div>
    </div>
  )
}
