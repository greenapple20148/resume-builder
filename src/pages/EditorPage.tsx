import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { WeaknessAnalysis } from '../lib/ai'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { toast } from '../components/Toast'
import { PREVIEW_MAP } from './ThemesPreviews'
import type { ResumeData, PersonalInfo, ExperienceEntry, EducationEntry, LanguageEntry, CertificationEntry, ProjectEntry, CustomSection, CustomSectionEntry } from '../types'
import { useSEO } from '../lib/useSEO'
import { useTheme } from '../lib/useTheme'
import { THEMES } from './ThemesPage'

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: '●' },
  { id: 'summary', label: 'Summary', icon: '■' },
  { id: 'experience', label: 'Experience', icon: '✦' },
  { id: 'education', label: 'Education', icon: '✦' },
  { id: 'skills', label: 'Skills', icon: '◆' },
  { id: 'languages', label: 'Languages', icon: '◇' },
  { id: 'certifications', label: 'Certifications', icon: '●' },
  { id: 'projects', label: 'Projects', icon: '◑' },
  { id: 'custom', label: 'Custom', icon: '✚' },
] as const

type SectionId = typeof SECTIONS[number]['id']

// Sections that can be hidden (personal is always visible)
const HIDEABLE_SECTIONS = ['summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'projects', 'custom']

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
  showToolbar?: boolean
  toolbarVariant?: 'full' | 'compact'
}

const BULLET_STYLES = [
  { id: 'bullet', symbol: '•', label: 'Bullet' },
  { id: 'dash', symbol: '–', label: 'Dash' },
  { id: 'arrow', symbol: '▸', label: 'Arrow' },
  { id: 'number', symbol: '1.', label: '1. 2. 3.' },
  { id: 'alpha', symbol: 'a.', label: 'a. b. c.' },
  { id: 'none', symbol: '⊘', label: 'None' },
] as const

function applyBulletStyle(text: string, styleId: string): string {
  const lines = text.split('\n').filter(l => l.trim())
  return lines.map((line, i) => {
    // Strip existing bullet/number prefix
    const clean = line.replace(/^[\s]*[•\-–—▸►▹◆◇●○■□▪▫→⟶❯❱✦✧\d]+[.):\s]*/u, '').replace(/^[a-z][.)]\s*/i, '').trim()
    if (!clean) return ''
    switch (styleId) {
      case 'bullet': return `• ${clean}`
      case 'dash': return `– ${clean}`
      case 'arrow': return `▸ ${clean}`
      case 'number': return `${i + 1}. ${clean}`
      case 'alpha': return `${String.fromCharCode(97 + (i % 26))}. ${clean}`
      case 'none': return clean
      default: return `• ${clean}`
    }
  }).join('\n')
}

function TextArea({ label, value, onChange, placeholder = '', rows = 3, showToolbar = false, toolbarVariant = 'full' }: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [activeBullet, setActiveBullet] = useState<string | null>(null)

  const CYCLE_STYLES = ['number', 'alpha', 'arrow', 'dash'] as const

  // Detect current bullet style from value
  useEffect(() => {
    if (!value) { setActiveBullet(null); return }
    const firstLine = value.split('\n').find(l => l.trim())
    if (!firstLine) return
    if (/^\d+[.)]/.test(firstLine.trim())) setActiveBullet('number')
    else if (/^[a-z][.)]/.test(firstLine.trim())) setActiveBullet('alpha')
    else if (firstLine.trim().startsWith('•')) setActiveBullet('bullet')
    else if (firstLine.trim().startsWith('–') || firstLine.trim().startsWith('-')) setActiveBullet('dash')
    else if (firstLine.trim().startsWith('▸')) setActiveBullet('arrow')
    else setActiveBullet(null)
  }, [value])

  const handleBulletClick = (styleId: string) => {
    const current = value || ''
    if (!current.trim()) {
      // Start with a bullet prefix on an empty field
      const style = BULLET_STYLES.find(s => s.id === styleId)
      if (style && styleId !== 'none') {
        const prefix = styleId === 'number' ? '1. ' : styleId === 'alpha' ? 'a. ' : `${style.symbol} `
        onChange(prefix)
        setTimeout(() => textareaRef.current?.focus(), 0)
      }
      return
    }
    onChange(applyBulletStyle(current, styleId))
  }

  const insertWrap = (before: string, after: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const text = value || ''
    const selected = text.substring(start, end)
    const newText = text.substring(0, start) + before + selected + after + text.substring(end)
    onChange(newText)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Auto-continue bullet on Enter
    if (e.key === 'Enter' && !e.shiftKey && value) {
      const ta = textareaRef.current
      if (!ta) return
      const cursor = ta.selectionStart
      const lines = value.substring(0, cursor).split('\n')
      const currentLine = lines[lines.length - 1]

      let prefix = ''
      const bulletMatch = currentLine.match(/^(\s*[•–▸]\s*)/)
      const numberMatch = currentLine.match(/^(\s*)(\d+)([.)]\s*)/)
      const alphaMatch = currentLine.match(/^(\s*)([a-z])([.)]\s*)/i)

      if (bulletMatch) {
        // If current line is just the bullet with no text, clear it
        if (currentLine.trim().length <= 2) {
          e.preventDefault()
          const before = value.substring(0, cursor - currentLine.length)
          const after = value.substring(cursor)
          onChange(before + '\n' + after)
          return
        }
        prefix = bulletMatch[1]
      } else if (numberMatch) {
        if (currentLine.replace(numberMatch[0], '').trim() === '') {
          e.preventDefault()
          const before = value.substring(0, cursor - currentLine.length)
          const after = value.substring(cursor)
          onChange(before + '\n' + after)
          return
        }
        prefix = `${numberMatch[1]}${parseInt(numberMatch[2]) + 1}${numberMatch[3]}`
      } else if (alphaMatch) {
        if (currentLine.replace(alphaMatch[0], '').trim() === '') {
          e.preventDefault()
          const before = value.substring(0, cursor - currentLine.length)
          const after = value.substring(cursor)
          onChange(before + '\n' + after)
          return
        }
        const next = String.fromCharCode(alphaMatch[2].charCodeAt(0) + 1)
        prefix = `${alphaMatch[1]}${next}${alphaMatch[3]}`
      }

      if (prefix) {
        e.preventDefault()
        const before = value.substring(0, cursor)
        const after = value.substring(cursor)
        const newValue = before + '\n' + prefix + after
        onChange(newValue)
        setTimeout(() => {
          ta.setSelectionRange(cursor + 1 + prefix.length, cursor + 1 + prefix.length)
        }, 0)
      }
    }
  }

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {showToolbar && toolbarVariant === 'full' && (
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          <div className="flex items-center bg-ink-05 rounded-lg p-0.5 gap-0.5">
            {BULLET_STYLES.map(style => (
              <button
                key={style.id}
                type="button"
                title={style.label}
                className={`px-2 py-1 rounded-md text-[11px] font-mono border-none cursor-pointer transition-all ${activeBullet === style.id
                  ? 'bg-gold text-white shadow-sm'
                  : 'bg-transparent text-ink-40 hover:bg-ink-10 hover:text-ink'
                  }`}
                onClick={() => handleBulletClick(style.id)}
              >
                {style.symbol}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-ink-10 mx-1" />
          <button
            type="button"
            title="Bold"
            className="px-1.5 py-1 rounded-md text-[12px] font-bold bg-transparent border-none cursor-pointer text-ink-40 hover:bg-ink-10 hover:text-ink transition-all"
            onClick={() => insertWrap('**', '**')}
          >
            B
          </button>
          <button
            type="button"
            title="Italic"
            className="px-1.5 py-1 rounded-md text-[12px] italic bg-transparent border-none cursor-pointer text-ink-40 hover:bg-ink-10 hover:text-ink transition-all"
            onClick={() => insertWrap('*', '*')}
          >
            I
          </button>
        </div>
      )}
      {showToolbar && toolbarVariant === 'compact' && (() => {
        const currentCycleIdx = CYCLE_STYLES.indexOf(activeBullet as any)
        const cycleLabel = activeBullet === 'number' ? '1.' : activeBullet === 'alpha' ? 'a.' : activeBullet === 'arrow' ? '▸' : activeBullet === 'dash' ? '–' : '1.'
        return (
          <div className="flex items-center gap-1.5 mb-1.5">
            <button
              type="button"
              title="Bullet list"
              className={`px-2.5 py-1 rounded-lg text-[12px] font-mono border-none cursor-pointer transition-all ${activeBullet === 'bullet' ? 'bg-gold text-white shadow-sm' : 'bg-ink-05 text-ink-40 hover:bg-ink-10 hover:text-ink'}`}
              onClick={() => handleBulletClick(activeBullet === 'bullet' ? 'none' : 'bullet')}
            >
              •&ensp;Bullet
            </button>
            <button
              type="button"
              title={`Cycle: ${CYCLE_STYLES.map(s => s === 'number' ? '1.' : s === 'alpha' ? 'a.' : s === 'arrow' ? '▸' : '–').join(' → ')}`}
              className={`px-2.5 py-1 rounded-lg text-[12px] font-mono border-none cursor-pointer transition-all ${CYCLE_STYLES.includes(activeBullet as any) ? 'bg-gold text-white shadow-sm' : 'bg-ink-05 text-ink-40 hover:bg-ink-10 hover:text-ink'}`}
              onClick={() => {
                const nextIdx = (currentCycleIdx + 1) % CYCLE_STYLES.length
                handleBulletClick(CYCLE_STYLES[nextIdx])
              }}
            >
              {CYCLE_STYLES.includes(activeBullet as any) ? cycleLabel : '1.'}&ensp;List
            </button>
            <button
              type="button"
              title="Clear formatting"
              className={`px-2 py-1 rounded-lg text-[12px] font-mono border-none cursor-pointer transition-all ${!activeBullet ? 'bg-ink-10 text-ink-40' : 'bg-ink-05 text-ink-30 hover:bg-ink-10 hover:text-ink'}`}
              onClick={() => handleBulletClick('none')}
            >
              ⊘
            </button>
            <div className="w-px h-5 bg-ink-10 mx-0.5" />
            <button
              type="button"
              title="Bold"
              className="px-1.5 py-1 rounded-lg text-[12px] font-bold bg-ink-05 border-none cursor-pointer text-ink-40 hover:bg-ink-10 hover:text-ink transition-all"
              onClick={() => insertWrap('**', '**')}
            >
              B
            </button>
            <button
              type="button"
              title="Italic"
              className="px-1.5 py-1 rounded-lg text-[12px] italic bg-ink-05 border-none cursor-pointer text-ink-40 hover:bg-ink-10 hover:text-ink transition-all"
              onClick={() => insertWrap('*', '*')}
            >
              I
            </button>
          </div>
        )
      })()}
      <textarea
        ref={textareaRef}
        className="form-textarea"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={showToolbar ? handleKeyDown : undefined}
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return }
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        // Resize to max 400px for storage efficiency
        const max = 400
        const scale = Math.min(max / img.width, max / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        onChange({ ...data, photo: canvas.toDataURL('image/jpeg', 0.85) })
        toast.success('Photo added!')
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 400, height: 400 } })
      setStream(mediaStream)
      setShowCamera(true)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.play()
        }
      }, 100)
    } catch {
      toast.error('Could not access camera. Please check permissions.')
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const size = Math.min(video.videoWidth, video.videoHeight)
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 400
    const ctx = canvas.getContext('2d')!
    // Center-crop to square
    const sx = (video.videoWidth - size) / 2
    const sy = (video.videoHeight - size) / 2
    ctx.drawImage(video, sx, sy, size, size, 0, 0, 400, 400)
    onChange({ ...data, photo: canvas.toDataURL('image/jpeg', 0.85) })
    stopCamera()
    toast.success('Photo captured!')
  }

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setShowCamera(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return }
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const max = 400
        const scale = Math.min(max / img.width, max / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        onChange({ ...data, photo: canvas.toDataURL('image/jpeg', 0.85) })
        toast.success('Photo added!')
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <SectionHeader icon="●" title="Personal Information" subtitle="Your contact details and basic info. This appears at the top of your resume." />
      <div className="flex flex-col gap-4">
        {/* Photo Upload */}
        <div className="form-group">
          <label className="form-label">Profile Photo <span className="text-ink-20 font-normal">(optional)</span></label>
          <div className="flex items-start gap-4">
            {data.photo ? (
              <div className="relative group">
                <img
                  src={data.photo}
                  alt="Profile"
                  className="w-[80px] h-[80px] rounded-full object-cover border-2 border-ink-10 shadow-sm"
                />
                <button
                  type="button"
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-[rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer"
                  onClick={() => onChange({ ...data, photo: '' })}
                  title="Remove photo"
                >
                  <span className="text-white text-lg">✕</span>
                </button>
              </div>
            ) : (
              <div
                className="w-[80px] h-[80px] rounded-full border-2 border-dashed border-ink-15 flex items-center justify-center text-ink-20 text-2xl cursor-pointer hover:border-gold hover:text-gold transition-colors bg-ink-05"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                title="Click or drag to add photo"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="14" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M6 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>
              </div>
            )}
            <div className="flex flex-col gap-1.5 pt-1">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              <button
                type="button"
                className="text-[12px] px-3 py-1.5 rounded-lg bg-ink-05 border-none cursor-pointer text-ink-40 hover:bg-ink-10 hover:text-ink transition-all font-[inherit] text-left"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M12 18v-6" /><path d="M9 15h6" /></svg>Upload File
              </button>
              <button
                type="button"
                className="text-[12px] px-3 py-1.5 rounded-lg bg-ink-05 border-none cursor-pointer text-ink-40 hover:bg-ink-10 hover:text-ink transition-all font-[inherit] text-left"
                onClick={startCamera}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}><rect x="2" y="6" width="20" height="14" rx="2" /><circle cx="12" cy="13" r="3" /><path d="M6 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>Take Photo
              </button>
              {data.photo && (
                <button
                  type="button"
                  className="text-[12px] px-3 py-1.5 rounded-lg bg-transparent border-none cursor-pointer text-rose hover:bg-[rgba(239,68,68,0.05)] transition-all font-[inherit] text-left"
                  onClick={() => onChange({ ...data, photo: '' })}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}><path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" /></svg>Remove
                </button>
              )}
            </div>
          </div>

          <p className="text-[10px] text-ink-20 mt-1.5 font-mono">JPG, PNG · Max 2MB · Resized to 400×400px</p>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="modal-overlay" onClick={stopCamera}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440, padding: 0, overflow: 'hidden' }}>
              <div className="p-4 border-b border-ink-10 flex items-center justify-between">
                <h3 className="text-sm font-semibold m-0">Take Photo</h3>
                <button className="text-ink-30 bg-transparent border-none cursor-pointer text-lg" onClick={stopCamera}>✕</button>
              </div>
              <div className="relative bg-black flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <div className="absolute inset-0 rounded-full border-[3px] border-white/30 m-8 pointer-events-none" />
              </div>
              <div className="p-4 flex justify-center gap-3 bg-ink-05">
                <button
                  type="button"
                  className="btn btn-gold px-6"
                  onClick={capturePhoto}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>Capture
                </button>
                <button type="button" className="btn btn-outline" onClick={stopCamera}>Cancel</button>
              </div>
            </div>
          </div>
        )}

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
          showToolbar
          toolbarVariant="compact"
        />
        <div className="flex justify-between items-center">
          <p className="text-[11.5px] text-ink-20 leading-relaxed italic m-0">Tip: Highlight your biggest strengths and what makes you unique.</p>
          <button className="btn btn-ghost btn-sm text-gold" style={{ fontSize: 12 }} onClick={handleAi} disabled={isAiLoading || !data}>
            {isAiLoading ? 'Rewriting…' : 'AI Rewrite'}
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
                <TextArea label="Key Achievements & Responsibilities" value={exp.description} onChange={(v) => update(idx, 'description', v)} placeholder="• Led cross-functional team of 8 to ship payments redesign..." rows={4} showToolbar toolbarVariant="compact" />
                <div className="flex justify-between items-center mt-[-4px]">
                  <button className="btn btn-danger btn-sm" style={{ fontSize: 11 }} onClick={() => remove(idx)}>Remove</button>
                  <button className="btn btn-ghost btn-sm text-gold" style={{ fontSize: 11 }} onClick={() => handleAi(idx, exp.description)} disabled={aiLoadingIdx === idx || !exp.description}>
                    {aiLoadingIdx === idx ? 'Rewriting…' : 'AI Rewrite'}
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
                <TextArea label="Description" value={proj.description} onChange={(v) => update(idx, 'description', v)} placeholder="Built a real-time analytics dashboard..." rows={3} showToolbar toolbarVariant="compact" />
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

function CustomSectionsSection({ data = [], onChange }: SectionProps<CustomSection[]>) {
  const [expandedSection, setExpandedSection] = useState<number | null>(data.length > 0 ? 0 : null)
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null)

  const addSection = () => {
    const newSection: CustomSection = { id: Date.now(), title: '', entries: [] }
    onChange([...data, newSection])
    setExpandedSection(data.length)
    setExpandedEntry(null)
  }
  const removeSection = (idx: number) => {
    onChange(data.filter((_, i) => i !== idx))
    setExpandedSection(null)
  }
  const updateSectionTitle = (idx: number, title: string) => {
    const next = [...data]; next[idx] = { ...next[idx], title }; onChange(next)
  }
  const addEntry = (sIdx: number) => {
    const next = [...data]
    const entry: CustomSectionEntry = { id: Date.now(), title: '', subtitle: '', date: '', description: '' }
    next[sIdx] = { ...next[sIdx], entries: [...next[sIdx].entries, entry] }
    onChange(next)
    setExpandedEntry(next[sIdx].entries.length - 1)
  }
  const removeEntry = (sIdx: number, eIdx: number) => {
    const next = [...data]
    next[sIdx] = { ...next[sIdx], entries: next[sIdx].entries.filter((_, i) => i !== eIdx) }
    onChange(next)
    setExpandedEntry(null)
  }
  const updateEntry = (sIdx: number, eIdx: number, field: keyof CustomSectionEntry, val: string) => {
    const next = [...data]
    const entries = [...next[sIdx].entries]
    entries[eIdx] = { ...entries[eIdx], [field]: val }
    next[sIdx] = { ...next[sIdx], entries }
    onChange(next)
  }

  return (
    <>
      <SectionHeader icon="✚" title="Custom Sections" subtitle="Add any extra sections like Awards, Volunteering, Publications, etc." />
      <div className="flex flex-col gap-4">
        {data.map((section, sIdx) => (
          <div key={section.id || sIdx} className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden">
            <button
              className="flex items-center justify-between w-full px-5 py-3.5 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-ink-05"
              onClick={() => setExpandedSection(expandedSection === sIdx ? null : sIdx)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${section.title ? 'bg-emerald' : 'bg-ink-10'}`} />
                <div className="text-[13px] font-semibold text-ink truncate">{section.title || `Section ${sIdx + 1}`}</div>
                <span className="text-[11px] text-ink-30 shrink-0">{section.entries.length} {section.entries.length === 1 ? 'entry' : 'entries'}</span>
              </div>
              <span className={`text-ink-20 text-xs transition-transform shrink-0 ml-2 ${expandedSection === sIdx ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {expandedSection === sIdx && (
              <div className="px-5 pb-5 pt-2 border-t border-ink-10 flex flex-col gap-3" style={{ animation: 'fadeUp 0.2s ease both' }}>
                <Field label="Section Title" value={section.title} onChange={(v) => updateSectionTitle(sIdx, v)} placeholder="e.g. Awards, Volunteering, Publications" />
                <div className="flex flex-col gap-2 mt-1">
                  {section.entries.map((entry, eIdx) => (
                    <div key={entry.id || eIdx} className="border border-ink-10 rounded-lg overflow-hidden">
                      <button
                        className="flex items-center justify-between w-full px-4 py-2.5 bg-ink-05 border-none cursor-pointer text-left transition-colors hover:bg-ink-10 text-xs"
                        onClick={() => setExpandedEntry(expandedEntry === eIdx ? null : eIdx)}
                      >
                        <span className="font-medium text-ink truncate">{entry.title || `Entry ${eIdx + 1}`}</span>
                        <span className={`text-ink-20 transition-transform ${expandedEntry === eIdx ? 'rotate-180' : ''}`}>▼</span>
                      </button>
                      {expandedEntry === eIdx && (
                        <div className="px-4 pb-4 pt-2 flex flex-col gap-2.5">
                          <div className="form-row">
                            <Field label="Title" value={entry.title} onChange={(v) => updateEntry(sIdx, eIdx, 'title', v)} placeholder="e.g. Dean's List, Volunteer Coordinator" />
                            <Field label="Subtitle" value={entry.subtitle} onChange={(v) => updateEntry(sIdx, eIdx, 'subtitle', v)} placeholder="e.g. Organization name" />
                          </div>
                          <Field label="Date" value={entry.date} onChange={(v) => updateEntry(sIdx, eIdx, 'date', v)} placeholder="e.g. 2023 — Present" />
                          <TextArea label="Description" value={entry.description} onChange={(v) => updateEntry(sIdx, eIdx, 'description', v)} placeholder="Details..." rows={2} />
                          <div className="flex justify-end">
                            <button className="btn btn-danger btn-sm" style={{ fontSize: 11 }} onClick={() => removeEntry(sIdx, eIdx)}>Remove Entry</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <AddButton label="Add Entry" onClick={() => addEntry(sIdx)} />
                </div>
                <div className="flex justify-end mt-1">
                  <button className="btn btn-danger btn-sm" style={{ fontSize: 11 }} onClick={() => removeSection(sIdx)}>Remove Section</button>
                </div>
              </div>
            )}
          </div>
        ))}
        <AddButton label="Add Custom Section" onClick={addSection} />
      </div>
    </>
  )
}

// ─── Live Preview ─────────────────────────────────────────────
// A4 dimensions at 96 DPI
const PAGE_W_PX = 794   // 210mm
const PAGE_H_PX = 1123  // 297mm

interface LivePreviewProps {
  resumeData: Partial<ResumeData>
  themeId: string
}

function LivePreview({ resumeData, themeId }: LivePreviewProps) {
  const PreviewComponent = PREVIEW_MAP[themeId] || PREVIEW_MAP.editorial_luxe
  const themeBg = THEMES.find(t => t.id === themeId)?.bg || '#fff'
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const [pageCount, setPageCount] = useState(1)

  // Scale to fit container width
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return
      const containerW = containerRef.current.clientWidth
      setScale(Math.min((containerW - 60) / PAGE_W_PX, 1))
    }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Measure content height → compute page count
  useEffect(() => {
    if (!contentRef.current) return
    const measure = () => {
      const h = contentRef.current?.scrollHeight || 0
      setPageCount(Math.max(1, Math.ceil(h / PAGE_H_PX)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (contentRef.current) observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [resumeData, themeId])

  const hiddenSections = resumeData.hiddenSections || []
  const isHidden = (s: string) => hiddenSections.includes(s)
  const accent = resumeData.customColor || '#1a2744'
  const languages = Array.isArray(resumeData.languages) ? resumeData.languages : []
  const certifications = Array.isArray(resumeData.certifications) ? resumeData.certifications : []
  const projects = Array.isArray(resumeData.projects) ? resumeData.projects : []
  const customSections = Array.isArray(resumeData.customSections) ? resumeData.customSections : []
  const hasExtras = (!isHidden('languages') && languages.length > 0) || (!isHidden('certifications') && certifications.length > 0) || (!isHidden('projects') && projects.length > 0) || (!isHidden('custom') && customSections.length > 0)

  const nativeH = Math.max(pageCount * PAGE_H_PX, PAGE_H_PX)

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', background: 'var(--ink-05)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
      {/* Reserve scaled space */}
      <div style={{ width: PAGE_W_PX * scale, height: nativeH * scale, flexShrink: 0, position: 'relative' }}>
        {/* Scale transform */}
        <div style={{ width: PAGE_W_PX, transformOrigin: 'top left', transform: `scale(${scale})`, position: 'absolute', top: 0, left: 0 }}>
          {/* Paper */}
          <div style={{ width: PAGE_W_PX, minHeight: PAGE_H_PX, background: themeBg, boxShadow: '0 2px 12px rgba(0,0,0,0.08), 0 8px 28px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' }}>
            {/* Content — rendered ONCE, flows naturally */}
            <div ref={contentRef} id="resume-preview-root" style={{ width: PAGE_W_PX }}>
              {/* Prevent template root from forcing extra height */}
              <style>{`#resume-preview-root > div { min-height: auto !important; }`}</style>
              {/* AI-generated custom theme CSS override */}
              {resumeData.customThemeCSS && <style>{resumeData.customThemeCSS}</style>}
              {resumeData.customFont && (
                <style>{`#resume-preview-root, #resume-preview-root * { font-family: ${resumeData.customFont} !important; }`}</style>
              )}
              {resumeData.customColor && (
                <style>{`#resume-preview-root [style*="color"] { --user-accent: ${resumeData.customColor}; }`}</style>
              )}
              <PreviewComponent data={resumeData} />
              {hasExtras && (
                <div style={{ padding: '0 48px 40px', fontFamily: "'Inter', 'DM Sans', sans-serif" }}>
                  {!isHidden('languages') && languages.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, borderBottom: `1.5px solid ${accent}22`, paddingBottom: 6, marginBottom: 12 }}>Languages</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {languages.map((l, i) => (
                          <span key={i} style={{ fontSize: 12, color: '#2a2a2a', background: '#f5f5f5', padding: '4px 12px', borderRadius: 4, border: '1px solid #e8e8e8' }}>
                            {l.language}{l.level ? <span style={{ color: '#888', marginLeft: 6, fontSize: 11 }}>· {l.level}</span> : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {!isHidden('certifications') && certifications.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, borderBottom: `1.5px solid ${accent}22`, paddingBottom: 6, marginBottom: 12 }}>Certifications</div>
                      {certifications.map((c, i) => (
                        <div key={i} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{c.name}</span>
                            {c.issuer && <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>— {c.issuer}</span>}
                          </div>
                          {c.date && <span style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>{c.date}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {!isHidden('projects') && projects.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, borderBottom: `1.5px solid ${accent}22`, paddingBottom: 6, marginBottom: 12 }}>Projects</div>
                      {projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{proj.name}</div>
                          {proj.tech && <div style={{ fontSize: 11, color: accent, marginTop: 2 }}>{proj.tech}</div>}
                          {proj.description && <div style={{ fontSize: 12, color: '#555', lineHeight: 1.6, marginTop: 4 }}>{proj.description}</div>}
                          {proj.url && <div style={{ fontSize: 11, color: accent, marginTop: 2 }}>{proj.url}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                  {!isHidden('custom') && customSections.map((section, sIdx) => (
                    section.title && section.entries.length > 0 ? (
                      <div key={sIdx} style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, borderBottom: `1.5px solid ${accent}22`, paddingBottom: 6, marginBottom: 12 }}>{section.title}</div>
                        {section.entries.map((entry, eIdx) => (
                          <div key={eIdx} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <div>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{entry.title}</span>
                                {entry.subtitle && <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>— {entry.subtitle}</span>}
                              </div>
                              {entry.date && <span style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>{entry.date}</span>}
                            </div>
                            {entry.description && <div style={{ fontSize: 12, color: '#555', lineHeight: 1.6, marginTop: 3 }}>{entry.description}</div>}
                          </div>
                        ))}
                      </div>
                    ) : null
                  ))}
                </div>
              )}
            </div>
            {/* Page break lines overlaid */}
            {pageCount > 1 && Array.from({ length: pageCount - 1 }).map((_, i) => (
              <div key={i} style={{ position: 'absolute', top: (i + 1) * PAGE_H_PX, left: 0, right: 0, height: 0, borderTop: '2px dashed rgba(0,0,0,0.18)', pointerEvents: 'none', zIndex: 10 }}>
                <span style={{ position: 'absolute', right: 8, top: 4, fontSize: 10, color: 'rgba(0,0,0,0.3)', fontFamily: 'monospace', background: '#fff', padding: '1px 6px', borderRadius: 3 }}>Page {i + 2}</span>
              </div>
            ))}
          </div>
        </div>
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
    case 'custom': return (data.customSections?.length || 0) > 0 ? 'complete' : 'empty'
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
  const [themeId, setThemeId] = useState('editorial_luxe')

  const [activeSection, setActiveSection] = useState<SectionId>('personal')
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)

  const saveStatus = useAutoSave(id, resumeData, 2000)
  const [error, setError] = useState<string | null>(null)

  // Weakness Analyzer state
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const [analyzerOpen, setAnalyzerOpen] = useState(false)
  const [analyzerLoading, setAnalyzerLoading] = useState(false)
  const [analysis, setAnalysis] = useState<WeaknessAnalysis | null>(null)
  const [analyzerError, setAnalyzerError] = useState<string | null>(null)

  // AI Theme Dictation
  const [themePrompt, setThemePrompt] = useState('')
  const [themeDictating, setThemeDictating] = useState(false)
  const analyzerAbortRef = useRef<AbortController | null>(null)

  const cancelAnalysis = () => {
    if (analyzerAbortRef.current) {
      analyzerAbortRef.current.abort()
      analyzerAbortRef.current = null
    }
    setAnalyzerLoading(false)
    setAnalyzerOpen(false)
  }

  const runAnalysis = async () => {
    // Abort any previous request
    if (analyzerAbortRef.current) analyzerAbortRef.current.abort()
    const controller = new AbortController()
    analyzerAbortRef.current = controller

    setAnalyzerOpen(true)
    setAnalyzerLoading(true)
    setAnalysis(null)
    setAnalyzerError(null)
    try {
      const { analyzeResumeWeaknesses } = await import('../lib/ai')
      const result = await analyzeResumeWeaknesses(resumeData as Record<string, any>)
      if (!controller.signal.aborted) {
        setAnalysis(result)
      }
    } catch (err: any) {
      if (controller.signal.aborted) return // user cancelled, don't show error
      const msg = err.message || 'Analysis failed'
      setAnalyzerError(msg)
      toast.error(msg)
      console.error(err)
    } finally {
      if (!controller.signal.aborted) {
        setAnalyzerLoading(false)
      }
    }
  }

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
          // Handle data that might be a string or null
          let parsedData: Partial<ResumeData> = {}
          if (resume.data) {
            if (typeof resume.data === 'string') {
              try { parsedData = JSON.parse(resume.data) } catch { parsedData = {} }
            } else {
              parsedData = resume.data as Partial<ResumeData>
            }
          }
          setResumeData(parsedData)
          setTitle(resume.title || 'My Resume')
          setThemeId(resume.theme_id || 'editorial_luxe')
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
    setResumeData((prev: Partial<ResumeData>) => ({ ...prev, [section]: value }))
  }, [])

  const toggleSection = useCallback((sectionId: string) => {
    setResumeData((prev: Partial<ResumeData>) => {
      const hidden = prev.hiddenSections || []
      const isHidden = hidden.includes(sectionId)
      return {
        ...prev,
        hiddenSections: isHidden
          ? hidden.filter((s: string) => s !== sectionId)
          : [...hidden, sectionId]
      }
    })
  }, [])

  const isSectionHidden = useCallback((sectionId: string) => {
    return (resumeData.hiddenSections || []).includes(sectionId)
  }, [resumeData.hiddenSections])

  const handleTitleSave = async () => {
    setEditingTitle(false)
    if (id) await updateResume(id, { title })
  }

  const handleThemeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newThemeId = e.target.value
    setThemeId(newThemeId)
    if (id) await updateResume(id, { theme_id: newThemeId })
  }

  const handleThemeDictation = async () => {
    if (!themePrompt.trim()) return
    setThemeDictating(true)
    try {
      const { generateThemeFromDescription, buildThemeCSS } = await import('../lib/ai')
      const result = await generateThemeFromDescription(themePrompt.trim())
      const css = buildThemeCSS(result)

      // Apply as custom CSS override + store accent/font for extras sections
      setResumeData(prev => ({
        ...prev,
        customColor: result.accentColor,
        customFont: result.bodyFont || prev.customFont,
        customThemeCSS: css,
      }))
      toast.success(`✨ ${result.explanation}`)
      setThemePrompt('')
    } catch (err: any) {
      toast.error('Theme generation failed: ' + (err.message || 'Unknown error'))
      console.error(err)
    } finally {
      setThemeDictating(false)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    toast.info('Generating PDF…')

    const previewEl = document.getElementById('resume-preview-root')
    if (!previewEl) {
      toast.error('Preview not found')
      setDownloading(false)
      return
    }

    try {
      // Look up theme background color
      const themeBg = THEMES.find(t => t.id === themeId)?.bg || '#fff'

      // Collect Google Fonts links
      const fontLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]'))
        .map(el => el.outerHTML).join('\n')

      // Collect all stylesheets from the main document
      const styles = Array.from(document.querySelectorAll('style'))
        .map(s => s.outerHTML).join('\n')

      // Clone the preview content
      const contentClone = previewEl.cloneNode(true) as HTMLElement
      contentClone.id = 'resume-preview-root'

      // Remove internal style overrides (min-height, etc.)
      contentClone.querySelectorAll('style').forEach(s => {
        if (s.textContent?.includes('min-height')) s.remove()
      })

      // Recursively strip all hardcoded 794px widths from the clone
      const stripFixedWidths = (el: HTMLElement) => {
        if (el.style?.width && (el.style.width === '794px' || el.style.width === '794')) {
          el.style.width = '100%'
        }
        if (el.style?.minWidth && (el.style.minWidth === '794px' || el.style.minWidth === '794')) {
          el.style.minWidth = '100%'
        }
        for (let i = 0; i < el.children.length; i++) {
          const child = el.children[i]
          if (child instanceof HTMLElement) stripFixedWidths(child)
        }
      }
      stripFixedWidths(contentClone)

      // Watermark for free users
      const isFree = profile?.plan === 'free' || !profile?.plan
      const isLightBg = ['#ffffff', '#fff', '#fafafa', '#fdfbf9', '#fbf9fc', '#f7f7f7', '#f9f6f0', '#faf7f3', '#f7efe3', '#fdfcfa', '#f8f8f8'].includes(themeBg)
      const watermarkHTML = isFree
        ? `<div style="position:fixed;bottom:0;left:0;right:0;text-align:center;padding:4mm 0;font-size:9pt;color:${isLightBg ? '#828282' : '#b4b4b4'};background:${themeBg};font-family:sans-serif;">Made with ResumeBuildIn</div>`
        : ''

      // Build self-contained HTML document for Puppeteer
      const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  ${fontLinks}
  ${styles}
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      width: 100%;
      margin: 0;
      padding: 0;
      background: ${themeBg};
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    #resume-preview-root {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    #resume-preview-root > div {
      width: 100% !important;
      max-width: 100% !important;
      min-height: auto !important;
    }
  </style>
</head>
<body>
  ${contentClone.outerHTML}
  ${watermarkHTML}
</body>
</html>`

      // Call server-side PDF generation API
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: fullHTML,
          filename: `${title || 'resume'}.pdf`,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || `Server error: ${response.status}`)
      }

      // Download the PDF
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title || 'resume'}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('PDF downloaded!')
    } catch (err: any) {
      console.error('PDF generation error:', err)
      toast.error(err?.message || 'PDF generation failed.')
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
      case 'custom': return <CustomSectionsSection data={s.customSections || []} onChange={handleSectionData('customSections')} />
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
          <select
            className="form-select text-xs font-medium py-1 px-2 h-[34px] w-[150px] cursor-pointer truncate"
            value={themeId}
            onChange={handleThemeChange}
            aria-label="Change Theme"
          >
            {THEMES.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
          <div className="w-px h-5 bg-ink-10" />
          <button
            className="btn btn-sm flex items-center gap-1.5"
            style={{ background: 'var(--gold)', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, letterSpacing: 0.3, padding: '6px 14px' }}
            onClick={runAnalysis}
            disabled={analyzerLoading}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
            {analyzerLoading ? 'Analyzing…' : 'Analyze'}
          </button>
          <div className="w-px h-5 bg-ink-10" />
          <button
            className="w-[34px] h-[34px] rounded-full bg-ink-05 border border-ink-10 cursor-pointer flex items-center justify-center transition-all duration-200 text-ink-40 shrink-0 hover:bg-ink-10 hover:text-gold hover:border-gold hover:rotate-[15deg]"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </button>
          <div className="w-px h-5 bg-ink-10" />
          <input type="file" ref={fileInputRef} accept=".pdf,.docx" className="hidden" onChange={handleImport} />
          <button className="btn btn-ghost btn-sm" onClick={() => fileInputRef.current?.click()} disabled={importing}>
            {importing ? 'Importing…' : 'Import'}
          </button>
          <div className="w-px h-5 bg-ink-10" />
          <button className="btn btn-outline btn-sm" onClick={handleDownload} disabled={downloading}>
            {downloading ? 'Generating…' : 'PDF'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleDocxDownload}>DOCX</button>
        </div>
      </div>

      {/* ── Main Layout ────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[180px] max-md:w-[52px] bg-[var(--white)] border-r border-ink-10 py-4 overflow-y-auto shrink-0 flex flex-col">
          <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink-20 px-4 mb-2 max-md:hidden">Sections</div>
          <div className="flex-1">
            {SECTIONS.map((sec) => {
              const status = getSectionStatus(resumeData, sec.id)
              const hidden = isSectionHidden(sec.id)
              const canHide = HIDEABLE_SECTIONS.includes(sec.id)
              return (
                <div key={sec.id} className="flex items-center group/row">
                  <button
                    onClick={() => setActiveSection(sec.id as SectionId)}
                    className={`flex items-center gap-2.5 flex-1 px-4 py-2.5 text-[13px] bg-transparent border-none border-l-[3px] cursor-pointer text-left transition-all ${hidden ? 'opacity-40' : ''} ${activeSection === sec.id ? '!bg-gold-pale !text-gold border-l-gold font-semibold' : 'text-ink-40 border-l-transparent hover:bg-ink-05 hover:text-ink'}`}
                  >
                    <span className={`w-[7px] h-[7px] rounded-full shrink-0 transition-colors ${hidden ? 'bg-ink-10' : status === 'complete' ? 'bg-emerald' : status === 'partial' ? 'bg-gold' : 'bg-ink-10'}`} />
                    <span className={`max-md:hidden ${hidden ? 'line-through' : ''}`}>{sec.label}</span>
                  </button>
                  {canHide && (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSection(sec.id) }}
                      className="w-7 h-7 flex items-center justify-center bg-transparent border-none cursor-pointer text-ink-20 hover:text-ink transition-colors opacity-0 group-hover/row:opacity-100 shrink-0 mr-1"
                      title={hidden ? `Show ${sec.label} in preview` : `Hide ${sec.label} from preview`}
                    >
                      {hidden ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      )}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Style Controls */}
          <div className="px-3 pt-3 border-t border-ink-10 max-md:hidden">
            <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink-20 px-1 mb-2">Style</div>

            {/* Font Face */}
            <div className="mb-3">
              <label className="text-[10px] text-ink-30 block mb-1 px-1">Font</label>
              <select
                className="w-full text-[11px] px-2 py-1.5 rounded-lg border border-ink-10 bg-[var(--white)] text-ink cursor-pointer outline-none focus:border-gold transition-colors"
                value={resumeData.customFont || ''}
                onChange={(e) => setResumeData(prev => ({ ...prev, customFont: e.target.value || undefined }))}
                style={{ fontFamily: resumeData.customFont || 'inherit' }}
              >
                <option value="">Theme Default</option>
                <optgroup label="Modern Sans-Serif">
                  <option value="Calibri, sans-serif" style={{ fontFamily: 'Calibri' }}>Calibri</option>
                  <option value="Arial, sans-serif" style={{ fontFamily: 'Arial' }}>Arial</option>
                  <option value="Helvetica, Arial, sans-serif" style={{ fontFamily: 'Helvetica' }}>Helvetica</option>
                  <option value="Roboto, sans-serif" style={{ fontFamily: 'Roboto' }}>Roboto</option>
                  <option value="'Open Sans', sans-serif" style={{ fontFamily: 'Open Sans' }}>Open Sans</option>
                </optgroup>
                <optgroup label="Classic Serif">
                  <option value="Georgia, serif" style={{ fontFamily: 'Georgia' }}>Georgia</option>
                  <option value="Garamond, 'EB Garamond', serif" style={{ fontFamily: 'Garamond' }}>Garamond</option>
                  <option value="Cambria, serif" style={{ fontFamily: 'Cambria' }}>Cambria</option>
                </optgroup>
              </select>
            </div>

            {/* Accent Color */}
            <div className="mb-2">
              <label className="text-[10px] text-ink-30 block mb-1.5 px-1">Accent Color</label>
              <div className="flex items-center gap-1.5 flex-wrap px-0.5">
                {[
                  { color: '', label: 'Default' },
                  { color: '#1a1a1a', label: 'Black' },
                  { color: '#1e3a5f', label: 'Navy' },
                  { color: '#1a4e8a', label: 'Blue' },
                  { color: '#0d9488', label: 'Teal' },
                  { color: '#16a34a', label: 'Green' },
                  { color: '#c4553a', label: 'Rust' },
                  { color: '#8b5cf6', label: 'Violet' },
                  { color: '#c9923c', label: 'Gold' },
                  { color: '#e84118', label: 'Red' },
                ].map(c => (
                  <button
                    key={c.color || 'default'}
                    type="button"
                    title={c.label}
                    className="border-none cursor-pointer p-0 transition-all"
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: c.color || 'conic-gradient(#1a1a1a, #1e3a5f, #0d9488, #c4553a, #1a1a1a)',
                      border: (resumeData.customColor || '') === c.color ? '2px solid var(--gold)' : '2px solid var(--ink-10, #ddd)',
                      transform: (resumeData.customColor || '') === c.color ? 'scale(1.2)' : 'scale(1)',
                    }}
                    onClick={() => setResumeData(prev => ({ ...prev, customColor: c.color || undefined }))}
                  />
                ))}
                <label
                  title="Custom color"
                  className="relative cursor-pointer"
                  style={{ width: 18, height: 18, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--ink-10, #ddd)' }}
                >
                  <div style={{ width: '100%', height: '100%', background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)', borderRadius: '50%' }} />
                  <input
                    type="color"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    value={resumeData.customColor || '#1a1a1a'}
                    onChange={(e) => setResumeData(prev => ({ ...prev, customColor: e.target.value }))}
                  />
                </label>
              </div>
            </div>

            {/* AI Theme Dictation */}
            <div className="mb-2 mt-3 pt-3 border-t border-ink-10">
              <label className="text-[10px] text-ink-30 flex items-center gap-1 mb-1.5 px-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                AI Theme
              </label>
              <div className="flex gap-1">
                <input
                  type="text"
                  className="flex-1 text-[11px] px-2 py-1.5 rounded-lg border border-ink-10 bg-[var(--white)] text-ink outline-none focus:border-gold transition-colors"
                  placeholder="e.g. dark with gold accents"
                  value={themePrompt}
                  onChange={(e) => setThemePrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !themeDictating && handleThemeDictation()}
                  disabled={themeDictating}
                />
                <button
                  type="button"
                  className="shrink-0 text-[10px] font-semibold px-2 py-1.5 rounded-lg border-none cursor-pointer transition-all disabled:opacity-40"
                  style={{ background: 'var(--gold)', color: '#fff' }}
                  onClick={handleThemeDictation}
                  disabled={themeDictating || !themePrompt.trim()}
                  title="Generate theme from description"
                >
                  {themeDictating ? '…' : '✨'}
                </button>
              </div>
              {resumeData.customThemeCSS && (
                <button
                  type="button"
                  className="text-[10px] text-ink-30 hover:text-rose cursor-pointer bg-transparent border-none px-1 mt-1 transition-colors"
                  onClick={() => setResumeData(prev => ({ ...prev, customThemeCSS: undefined }))}
                >
                  ✕ Reset AI theme
                </button>
              )}
            </div>
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
          <div className="max-w-[560px] mx-auto px-6 py-8">
            {isSectionHidden(activeSection) && HIDEABLE_SECTIONS.includes(activeSection) && (
              <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-[13px]" style={{ background: 'rgba(201,146,60,0.08)', borderColor: 'rgba(201,146,60,0.2)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                <span style={{ flex: 1, color: 'var(--ink-60, #6a5a48)' }}>This section is <strong>hidden</strong> from the resume preview.</span>
                <button
                  onClick={() => toggleSection(activeSection)}
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-transparent border-none cursor-pointer transition-colors hover:bg-[rgba(201,146,60,0.12)]"
                  style={{ color: 'var(--gold, #c9923c)', whiteSpace: 'nowrap' }}
                >Show in preview</button>
              </div>
            )}
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
                  Download PDF
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="flex-1 max-xl:hidden border-l border-ink-10 flex flex-col min-w-[400px] min-h-0 overflow-hidden">
          <div id="resume-preview-content" className="flex-1 min-h-0">
            <LivePreview resumeData={resumeData} themeId={themeId} />
          </div>
        </div>
      </div>

      {/* ── Weakness Analyzer Drawer ────────────── */}
      {analyzerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={cancelAnalysis}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative w-[440px] max-w-[90vw] h-full bg-[var(--white)] shadow-2xl overflow-y-auto"
            style={{ animation: 'slideInRight 0.25s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="sticky top-0 z-10 bg-[var(--white)] border-b border-ink-10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">Resume Analyzer</div>
                  <div className="text-[11px] text-ink-30 font-mono">AI-powered weakness detection</div>
                </div>
              </div>
              <button onClick={cancelAnalysis} className="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent border-none cursor-pointer text-ink-30 hover:bg-ink-05 hover:text-ink transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Loading State */}
            {analyzerLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div style={{ width: 48, height: 48, border: '3px solid #e5e7eb', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <div className="text-sm text-ink-40 font-medium">Analyzing your resume…</div>
                <div className="text-[11px] text-ink-20">This takes a few seconds</div>
                <button
                  className="btn btn-outline btn-sm mt-2"
                  style={{ fontSize: 12, padding: '6px 20px' }}
                  onClick={cancelAnalysis}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Error State */}
            {analyzerError && !analyzerLoading && (
              <div className="flex flex-col items-center justify-center py-16 px-6 gap-4 text-center">
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                </div>
                <div className="text-sm text-ink font-medium">Analysis Failed</div>
                <div className="text-[12px] text-ink-40 leading-relaxed max-w-[280px]">{analyzerError}</div>
                <button
                  className="btn btn-sm flex items-center gap-2 mt-2"
                  style={{ background: 'var(--gold)', color: '#fff', border: 'none', padding: '8px 20px' }}
                  onClick={runAnalysis}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                  Try Again
                </button>
              </div>
            )}

            {/* Results */}
            {analysis && !analyzerLoading && (
              <div className="px-6 py-5">
                {/* Score Ring */}
                <div className="flex items-center gap-5 mb-6">
                  <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                    <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#f0f0f0" strokeWidth="6" />
                      <circle
                        cx="40" cy="40" r="34" fill="none"
                        stroke={analysis.overallScore >= 70 ? '#10b981' : analysis.overallScore >= 45 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={`${(analysis.overallScore / 100) * 213.6} 213.6`}
                        style={{ transition: 'stroke-dasharray 1s ease-out' }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{analysis.overallScore}</span>
                      <span style={{ fontSize: 9, color: 'var(--ink-30)', fontWeight: 500, letterSpacing: 0.5 }}>/100</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-ink-60 leading-relaxed mb-2">{analysis.summary}</div>
                    <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      {analysis.topStrength}
                    </div>
                  </div>
                </div>

                {/* Section Scores */}
                <div className="mb-6">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-ink-20 mb-3">Section Breakdown</div>
                  <div className="grid grid-cols-3 gap-2">
                    {analysis.sectionScores.map((ss, i) => (
                      <div key={i} className="rounded-lg border border-ink-10 px-3 py-2.5 bg-[var(--parchment)]">
                        <div className="text-[10px] text-ink-30 font-medium mb-1">{ss.section}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-[15px] font-bold" style={{ color: ss.score >= 70 ? '#10b981' : ss.score >= 45 ? '#f59e0b' : '#ef4444' }}>{ss.score}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
                            background: ss.score >= 70 ? 'rgba(16,185,129,0.1)' : ss.score >= 45 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                            color: ss.score >= 70 ? '#059669' : ss.score >= 45 ? '#d97706' : '#dc2626',
                          }}>{ss.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Findings */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-ink-20 mb-3">
                    Findings ({analysis.findings.length})
                  </div>
                  <div className="flex flex-col gap-3">
                    {analysis.findings.map((f, i) => {
                      const severityStyles = {
                        critical: {
                          bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)', color: '#dc2626',
                          icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#dc2626" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                        },
                        warning: {
                          bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)', color: '#d97706',
                          icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        },
                        tip: {
                          bg: 'rgba(99,102,241,0.06)', border: 'rgba(99,102,241,0.15)', color: '#6366f1',
                          icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        },
                      }
                      const s = severityStyles[f.severity]
                      return (
                        <div key={i} className="rounded-xl p-4" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                          <div className="flex items-start gap-2 mb-1.5">
                            <span className="mt-0.5 shrink-0">{s.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[13px] font-semibold text-ink">{f.title}</span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md" style={{ background: s.border, color: s.color }}>{f.section}</span>
                              </div>
                              <div className="text-[12px] text-ink-50 leading-relaxed mb-2">{f.description}</div>
                              <div className="text-[11.5px] leading-relaxed px-3 py-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--ink-60)' }}>
                                <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Fix:</strong> {f.suggestion}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Re-analyze button */}
                <div className="mt-6 pt-4 border-t border-ink-10">
                  <button
                    className="btn btn-sm w-full flex items-center justify-center gap-2"
                    style={{ background: 'var(--gold)', color: '#fff', border: 'none', padding: '10px 16px' }}
                    onClick={runAnalysis}
                    disabled={analyzerLoading}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                    Re-analyze Resume
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )
      }

      {/* Drawer animation */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div >
  )
}
