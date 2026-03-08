'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'
import { toast } from '../components/Toast'
import { useStore } from '@/lib/store'
import { useSEO } from '@/lib/useSEO'
import { PLANS, openCustomerPortal, verifySubscription, cancelSubscription } from '@/lib/stripe'
import { Resume } from '../types'
import { getResumeScore } from '@/lib/resumeScore'
import { LandingIcon } from '../components/LandingIcons'
import { getEffectivePlan, isExpressUnlockActive } from '@/lib/expressUnlock'
import ShareResumeModal from '../components/ShareResumeModal'

interface ResumeCardProps {
  resume: Resume
  onEdit: (resume: Resume) => void
  onDelete: (id: string) => void
  onDuplicate: (resume: Resume) => void
  onDownload: (resume: Resume) => void
  onShare: (resume: Resume) => void
}

function ResumeCard({ resume, onEdit, onDelete, onDuplicate, onDownload, onShare }: ResumeCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5">
      <div className="h-40 relative overflow-hidden bg-ink-05 cursor-pointer group" onClick={() => onEdit(resume)}>
        <ResumeThumb theme={resume.theme_id} data={resume.data} />
        <div className="absolute inset-0 bg-[rgba(14,13,11,0.5)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="btn btn-primary btn-sm">Edit Resume</span>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium text-ink mb-0.5 truncate">{resume.title}</div>
          <div className="text-[10px] text-ink-20 font-mono">{new Date(resume.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
        <div className="flex items-center gap-1.5 relative">
          <span className="badge badge-dark" style={{ fontSize: 9 }}>{resume.theme_id}</span>
          <div className="relative">
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setMenuOpen(!menuOpen)} aria-label="Resume options">···</button>
            {menuOpen && (
              <div className="absolute bottom-[calc(100%+6px)] right-0 bg-[var(--white)] border border-ink-10 rounded-xl shadow-lg min-w-[160px] overflow-hidden z-50 animate-[scaleIn_0.15s_ease]">
                <button className="block w-full text-left px-3.5 py-2.5 text-[13px] text-ink-70 bg-transparent border-none cursor-pointer transition-colors hover:bg-ink-05 hover:text-ink" onClick={() => { onEdit(resume); setMenuOpen(false) }}>✎ Edit</button>
                <button className="block w-full text-left px-3.5 py-2.5 text-[13px] text-ink-70 bg-transparent border-none cursor-pointer transition-colors hover:bg-ink-05 hover:text-ink" onClick={() => { onDuplicate(resume); setMenuOpen(false) }}>⧉ Duplicate</button>
                <button className="block w-full text-left px-3.5 py-2.5 text-[13px] text-ink-70 bg-transparent border-none cursor-pointer transition-colors hover:bg-ink-05 hover:text-ink" onClick={() => { onDownload(resume); setMenuOpen(false) }}>↓ Download PDF</button>
                <button className="block w-full text-left px-3.5 py-2.5 text-[13px] text-ink-70 bg-transparent border-none cursor-pointer transition-colors hover:bg-ink-05 hover:text-ink" onClick={() => { onShare(resume); setMenuOpen(false) }}>⤴ Share QR <span className="badge badge-gold" style={{ fontSize: 8, marginLeft: 4, verticalAlign: 'middle' }}>PREMIUM</span></button>
                <div className="h-px bg-ink-10" />
                <button className="block w-full text-left px-3.5 py-2.5 text-[13px] text-rose bg-transparent border-none cursor-pointer transition-colors hover:bg-ink-05" onClick={() => { onDelete(resume.id); setMenuOpen(false) }}>✕ Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Score card */}
      {(() => {
        const score = getResumeScore(resume)
        const color = score > 70 ? '#22c55e' : score > 45 ? '#eab308' : '#ef4444'
        const bg = score > 70 ? 'rgba(34,197,94,0.06)' : score > 45 ? 'rgba(234,179,8,0.06)' : 'rgba(239,68,68,0.06)'
        const label = score > 80 ? 'Excellent' : score > 60 ? 'Good' : score > 40 ? 'Needs Work' : 'Weak'
        const desc = score > 80
          ? 'Ready to impress recruiters'
          : score > 60
            ? 'A few improvements will help'
            : score > 40
              ? 'Add metrics & stronger verbs'
              : 'Missing key sections'
        return (
          <div className="mx-3 mb-3 p-2.5 rounded-lg" style={{ background: bg }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]" style={{ color }}>{score > 70 ? '●' : score > 45 ? '▲' : '●'}</span>
                <span className="text-[11px] font-semibold" style={{ color }}>{label}</span>
              </div>
              <span className="text-[11px] font-mono font-bold" style={{ color }}>{score}/100</span>
            </div>
            <div className="h-1.5 bg-[rgba(0,0,0,0.06)] rounded-full overflow-hidden mb-1.5">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, background: color }} />
            </div>
            <div className="text-[10px] text-ink-30 leading-snug">{desc}</div>
          </div>
        )
      })()}
    </div>
  )
}

function ResumeThumb({ theme, data }: { theme: string; data: any }) {
  const themes: Record<string, { bg: string; accent: string; sidebar: boolean }> = {
    classic: { bg: '#ffffff', accent: '#1a1a1a', sidebar: false },
    executive: { bg: '#ffffff', accent: '#0c4a6e', sidebar: false },
    minimal: { bg: '#ffffff', accent: '#111111', sidebar: false },
    bold: { bg: '#ffffff', accent: '#f59e0b', sidebar: false },

    mono_sidebar: { bg: '#ffffff', accent: '#111111', sidebar: true },
    mono_stack: { bg: '#f7f7f7', accent: '#111111', sidebar: false },
    mono_type: { bg: '#ffffff', accent: '#000000', sidebar: false },
    mono_editorial: { bg: '#fafafa', accent: '#111111', sidebar: false },
    exec_navy: { bg: '#ffffff', accent: '#c9a84c', sidebar: false },
    exec_marble: { bg: '#f9f6f0', accent: '#b8963c', sidebar: false },
    exec_copper: { bg: '#fffbf5', accent: '#b45309', sidebar: false },
    creative_neon: { bg: '#0f0f0f', accent: '#22c55e', sidebar: false },
    creative_coral: { bg: '#fef7f3', accent: '#dc6843', sidebar: false },
    creative_blueprint: { bg: '#0c1929', accent: '#38bdf8', sidebar: false },
    creative_sunset: { bg: '#ffffff', accent: '#ea580c', sidebar: false },
    dark_obsidian: { bg: '#0a0a0a', accent: '#e5e5e5', sidebar: false },
    dark_midnight: { bg: '#0b1120', accent: '#60a5fa', sidebar: false },
    dark_eclipse: { bg: '#12100e', accent: '#f59e0b', sidebar: true },
    dark_void: { bg: '#000000', accent: '#a78bfa', sidebar: false },
    dark_carbon: { bg: '#141414', accent: '#2dd4bf', sidebar: false },
    prestige: { bg: '#ffffff', accent: '#c5a572', sidebar: false },
    modern_sidebar: { bg: '#ffffff', accent: '#2D8C6F', sidebar: true },
    coral_horizon: { bg: '#ffffff', accent: '#E8634A', sidebar: false },
    swiss_grid: { bg: '#ffffff', accent: '#FF0000', sidebar: false },
    ocean_breeze: { bg: '#ffffff', accent: '#0EA5E9', sidebar: false },
    monochrome_editorial: { bg: '#ffffff', accent: '#0a0a0a', sidebar: false },
    midnight_luxe: { bg: '#1A1A2E', accent: '#C9A96E', sidebar: false },
    forest_canopy: { bg: '#ffffff', accent: '#2D5016', sidebar: false },
    copper_deco: { bg: '#ffffff', accent: '#B87333', sidebar: false },
    arctic_frost: { bg: '#ffffff', accent: '#5E81AC', sidebar: true },
    sunset_gradient: { bg: '#ffffff', accent: '#E85D26', sidebar: false },
    metro_line: { bg: '#ffffff', accent: '#0078D4', sidebar: false },
    rose_quartz: { bg: '#ffffff', accent: '#C77D8A', sidebar: false },
    concrete_brutalist: { bg: '#ffffff', accent: '#FFD600', sidebar: false },
    lavender_fields: { bg: '#ffffff', accent: '#7C6DAF', sidebar: false },
    steel_industrial: { bg: '#ffffff', accent: '#37474F', sidebar: false },
    obsidian_executive: { bg: '#0D0D1A', accent: '#7C4DFF', sidebar: false },
    ivory_prestige: { bg: '#FEFCF6', accent: '#C4A97D', sidebar: false },
    aurora_borealis: { bg: '#0B1622', accent: '#00C9A7', sidebar: false },
    blueprint_architect: { bg: '#0D2137', accent: '#4FC3F7', sidebar: false },
    onyx_ember: { bg: '#121212', accent: '#FF5722', sidebar: false },

    exec_prestige: { bg: '#ffffff', accent: '#0f0f0f', sidebar: false },
    exec_pillar: { bg: '#ffffff', accent: '#0e0e0e', sidebar: false },
    exec_regal: { bg: '#ffffff', accent: '#0b0b0b', sidebar: false },
    exec_apex: { bg: '#ffffff', accent: '#0c0c0c', sidebar: false },
    exec_strata: { bg: '#ffffff', accent: '#0d0d0d', sidebar: false },
    exec_counsel: { bg: '#ffffff', accent: '#0e0e0e', sidebar: false },
    exec_monogram: { bg: '#ffffff', accent: '#0c0c0c', sidebar: true },
    exec_ledger: { bg: '#ffffff', accent: '#0b0b0b', sidebar: false },
    exec_architect: { bg: '#ffffff', accent: '#0a0a0a', sidebar: false },
  }
  const t = themes[theme] || themes.classic
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, display: 'flex', overflow: 'hidden' }}>
      {t.sidebar && <div style={{ width: '35%', background: t.accent === '#f5c800' ? '#1a1a1a' : t.accent, opacity: 0.9 }} />}
      <div style={{ flex: 1, padding: 10 }}>
        <div style={{ height: 8, width: '60%', background: t.accent, opacity: 0.7, borderRadius: 2, marginBottom: 4 }} />
        <div style={{ height: 6, width: '45%', background: t.accent, opacity: 0.4, borderRadius: 2, marginBottom: 10 }} />
        {[1, 0.8, 0.9, 0.7, 0.8].map((w, i) => (
          <div key={i} style={{ height: 5, width: `${w * 100}%`, background: t.accent, opacity: 0.1, borderRadius: 1, marginBottom: 4 }} />
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { profile, resumes, resumesLoading, fetchResumes, createResume, deleteResume, deleteAllResumes, duplicateResume } = useStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false)
  const [deleteAllLoading, setDeleteAllLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const importInputRef = useRef<HTMLInputElement>(null)
  const [shareResume, setShareResume] = useState<Resume | null>(null)

  useEffect(() => { fetchResumes(); if (searchParams.get('upgraded') === 'true') toast.success('Welcome to Pro! All features unlocked.') }, [fetchResumes, searchParams])
  const { user, fetchProfile } = useStore()
  useEffect(() => { if (user) verifySubscription().then(() => fetchProfile(user.id)).catch(() => { }) }, [user?.id])

  const handleCreate = async (initialData: any = null) => {
    try {
      const dataToPass = initialData?.nativeEvent ? null : initialData
      const resume = await createResume('classic', dataToPass)
      router.push(`/editor/${resume.id}`)
    } catch (err: any) {
      if (err.message === 'LIMIT_REACHED') { toast.error('Resume limit reached. Upgrade your plan to create more.'); router.push('/pricing') }
      else toast.error(err.message || 'Could not create resume.')
    }
  }

  const handleImportResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    toast.info('Importing resume — extracting text…')
    try {
      const { extractTextFromPDF, extractTextFromDocx, parseResumeWithAI } = await import('../lib/ai')
      let text = ''
      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        text = await extractTextFromPDF(file)
      } else if (file.name.toLowerCase().endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        text = await extractTextFromDocx(file)
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or DOCX file.')
      }

      if (!text.trim()) throw new Error('Could not extract any text from the file.')

      toast.info('Parsing with AI…')
      const parsed = await parseResumeWithAI(text)
      toast.info('Creating resume…')
      const resume = await createResume('classic', parsed)
      toast.success('Resume imported successfully!')
      router.push(`/editor/${resume.id}`)
    } catch (err: any) {
      console.error('Import error:', err)
      toast.error('Import failed: ' + (err.message || 'Unknown error'))
    } finally {
      setImporting(false)
      if (importInputRef.current) importInputRef.current.value = ''
    }
  }
  const handleEdit = (resume: Resume) => router.push(`/editor/${resume.id}`)
  const handleDelete = async (id: string) => { try { await deleteResume(id); toast.success('Resume deleted.') } catch (err: any) { toast.error('Could not delete resume: ' + err.message) } setDeleteConfirm(null) }
  const handleDuplicate = async (resume: Resume) => { try { await duplicateResume(resume); toast.success('Resume duplicated!') } catch { toast.error('Could not duplicate resume.') } }
  const handleDownload = (resume: Resume) => router.push(`/editor/${resume.id}?download=true`)
  const handleBilling = async () => {
    if (!profile?.stripe_customer_id) { router.push('/pricing'); return }
    try { setPortalLoading(true); await openCustomerPortal() } catch { toast.error('Could not open billing portal.') } finally { setPortalLoading(false) }
  }

  const effectivePlan = getEffectivePlan(profile)
  const planInfo = PLANS[effectivePlan] || PLANS.free
  const resumeCount = resumes.length
  const resumeLimit = planInfo?.resumeLimit || 3

  useSEO({
    title: 'My Resumes — Dashboard',
    description: 'Manage your resumes, create new ones, and access your career tools.',
    path: '/dashboard',
    noindex: true,
  })

  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <div className="flex flex-col md:flex-row max-w-[1200px] mx-auto px-5 md:px-10 py-8 gap-8 items-start">
        {/* Sidebar */}
        <aside className="w-full md:w-[220px] shrink-0 md:sticky md:top-[92px]">
          <div className="mb-6">
            <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink-20 mb-2 px-3">Navigation</div>
            <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink font-medium rounded-lg bg-[var(--white)] border-l-2 border-gold shadow-sm no-underline mb-0.5">
              <span className="text-gold"><LandingIcon name="file-text" size={14} /></span> My Resumes
            </Link>
            <Link href="/themes" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5">
              <span className="text-ink-30"><LandingIcon name="layers" size={14} /></span> Templates
            </Link>
            <Link href="/pricing" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5">
              <span className="text-ink-30"><LandingIcon name="star" size={14} /></span> Billing
            </Link>
            {(effectivePlan === 'pro' || effectivePlan === 'premium' || effectivePlan === 'career_plus') && (
              <Link href="/tools/cover-letter" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5">
                <span className="text-ink-30"><LandingIcon name="mail" size={14} /></span> Cover Letters
              </Link>
            )}
            {(effectivePlan === 'premium' || effectivePlan === 'career_plus') && (
              <>
                <Link href="/tools/linkedin" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5"><span className="text-ink-30"><LandingIcon name="linkedin" size={14} /></span> LinkedIn Toolkit</Link>
                <Link href="/tools/interview" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5"><span className="text-ink-30"><LandingIcon name="mic" size={14} /></span> Interview Toolkit</Link>
                <Link href="/tools/mock-interview" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5"><span className="text-ink-30"><LandingIcon name="brain" size={14} /></span> AI Mock Interview</Link>
                {profile?.plan === 'career_plus' && (
                  <Link href="/tools/career-dashboard" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gold font-medium rounded-lg border-l-2 border-transparent transition-all hover:bg-gold/5 hover:border-gold no-underline mb-0.5"><span className="text-gold"><LandingIcon name="trending-up" size={14} /></span> ✦ Career Dashboard</Link>
                )}
              </>
            )}
            <Link href="/tools/ai" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5"><span className="text-ink-30"><LandingIcon name="sparkles" size={14} /></span> AI Tools</Link>
          </div>

          <div className="bg-[var(--white)] border border-ink-10 rounded-xl p-4 mt-4">
            <div className="mb-3">
              <span className={`badge ${effectivePlan !== 'free' ? 'badge-gold' : 'badge-dark'}`}>
                {isExpressUnlockActive(profile) && profile?.plan === 'free' ? 'EXPRESS' : profile?.plan === 'career_plus' ? 'CAREER+' : profile?.plan?.toUpperCase() || 'FREE'}
              </span>
            </div>
            <div className="mb-1">
              <div className="text-xs font-mono text-ink-40 mb-1.5 flex justify-between">{resumeCount}/{resumeLimit === Infinity ? '∞' : resumeLimit} resumes</div>
              <div className="h-1 bg-ink-10 rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full transition-all duration-400" style={{ width: `${Math.min((resumeCount / (resumeLimit === Infinity ? 1 : resumeLimit)) * 100, 100)}%` }} />
              </div>
            </div>
            {profile?.plan === 'free' && !isExpressUnlockActive(profile) && (
              <>
                <Link href="/pricing" className="btn btn-gold w-full mt-3 text-[13px]">Upgrade to Pro →</Link>
                <Link href="/pricing" className="block mt-3 no-underline">
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(212,163,88,0.1), rgba(212,163,88,0.04))',
                    border: '1px solid rgba(212,163,88,0.25)',
                    borderRadius: 10,
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <span style={{ fontSize: 18 }}>⚡</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.02em' }}>Express 24h Unlock</div>
                      <div style={{ fontSize: 10, color: 'var(--ink-40)' }}>Full Pro access for 24 hours — $9.99</div>
                    </div>
                  </div>
                </Link>
              </>
            )}
            {profile?.plan === 'free' && isExpressUnlockActive(profile) && (
              <Link href="/pricing" className="btn btn-gold w-full mt-3 text-[13px]">Upgrade to keep Pro access →</Link>
            )}
            {profile?.plan !== 'free' && (
              <>
                <button className="btn btn-ghost btn-sm w-full mt-2" onClick={handleBilling} disabled={portalLoading}>{portalLoading ? 'Opening…' : 'Manage Billing'}</button>
                <button
                  className="w-full mt-1.5 text-[11px] text-ink-20 bg-transparent border-none cursor-pointer py-1.5 rounded-md transition-colors hover:text-rose hover:bg-[rgba(239,68,68,0.05)] font-[inherit]"
                  onClick={() => setCancelConfirm(true)}
                >
                  Cancel Subscription
                </button>
              </>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-7">
            <div>
              <h2 className="text-[28px] mb-1">My Resumes</h2>
              <p className="text-[13px] text-ink-40 font-mono">{resumeCount} resume{resumeCount !== 1 ? 's' : ''} · {profile?.plan || 'free'} plan</p>
            </div>
            <div className="flex gap-2.5">
              {resumes.length > 0 && (
                <button
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--rose, #e74c3c)', borderColor: 'var(--rose, #e74c3c)' }}
                  onClick={() => setDeleteAllConfirm(true)}
                >
                  Delete All
                </button>
              )}
              <input type="file" ref={importInputRef} accept=".pdf,.docx" className="hidden" onChange={handleImportResume} />
              <button
                className="btn btn-outline btn-sm"
                onClick={() => importInputRef.current?.click()}
                disabled={importing}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {importing ? (
                  <><div className="spinner" style={{ width: 14, height: 14 }} /> Importing…</>
                ) : (
                  <>↑ Import PDF/DOCX</>
                )}
              </button>
              <button className="btn btn-gold" onClick={() => handleCreate(null)}>+ New Resume</button>
            </div>
          </div>

          {resumesLoading && resumes.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]"><div className="spinner" style={{ color: 'var(--gold)' }} /></div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-20 px-10">
              <div className="text-5xl text-ink-10 mb-5">◈</div>
              <h3 className="text-2xl mb-2.5">No resumes yet</h3>
              <p className="text-[15px] text-ink-40 mb-7">Create your first resume and start applying with confidence.</p>
              <button className="btn btn-gold btn-lg" onClick={() => handleCreate(null)}>Build Your First Resume →</button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} onEdit={handleEdit} onDelete={(id) => setDeleteConfirm(id)} onDuplicate={handleDuplicate} onDownload={handleDownload} onShare={(r) => {
                  const canShare = effectivePlan === 'premium' || effectivePlan === 'career_plus'
                  if (!canShare) { toast.info('Share via QR code is available on Premium and Career+ plans.'); router.push('/pricing'); return }
                  setShareResume(r)
                }} />
              ))}
              {(resumeLimit === Infinity || resumeCount < resumeLimit) && (
                <button className="h-[220px] border-2 border-dashed border-ink-10 rounded-xl bg-transparent cursor-pointer flex flex-col items-center justify-center gap-2.5 text-sm text-ink-20 transition-all hover:border-gold hover:text-gold hover:bg-gold-pale" onClick={() => handleCreate(null)}>
                  <span className="text-[32px] w-12 h-12 rounded-full bg-ink-05 flex items-center justify-center font-light transition-all">+</span>
                  <span>New Resume</span>
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-3">Delete Resume?</h3>
            <p className="mb-6 text-ink-40 text-sm">This action is permanent and cannot be undone.</p>
            <div className="flex gap-2.5">
              <button className="btn btn-danger flex-1" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              <button className="btn btn-outline flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deleteAllConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteAllConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2" style={{ color: 'var(--rose, #e74c3c)' }}>Delete All Resumes?</h3>
            <p className="mb-2 text-ink-40 text-sm">This will permanently delete <strong>all {resumes.length} resume{resumes.length !== 1 ? 's' : ''}</strong>. This action cannot be undone.</p>
            <p className="mb-5 text-ink-30 text-[12px]">All resume data, including content and settings, will be lost forever.</p>
            <div className="flex gap-2.5">
              <button
                className="btn btn-danger flex-1"
                disabled={deleteAllLoading}
                onClick={async () => {
                  setDeleteAllLoading(true)
                  try {
                    await deleteAllResumes()
                    toast.success(`All ${resumes.length} resume${resumes.length !== 1 ? 's' : ''} deleted.`)
                    setDeleteAllConfirm(false)
                  } catch (err: any) {
                    toast.error('Could not delete resumes: ' + (err.message || 'Unknown error'))
                  } finally {
                    setDeleteAllLoading(false)
                  }
                }}
              >
                {deleteAllLoading ? 'Deleting…' : `Delete All ${resumes.length} Resume${resumes.length !== 1 ? 's' : ''}`}
              </button>
              <button className="btn btn-outline flex-1" onClick={() => setDeleteAllConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {cancelConfirm && (
        <div className="modal-overlay" onClick={() => setCancelConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h3 className="mb-2">Cancel Subscription?</h3>
            <p className="text-sm text-ink-40 mb-2">Your subscription will be cancelled at the end of the current billing period. You'll keep access until then.</p>
            <p className="text-[12px] text-ink-30 mb-6">After cancellation, your plan will revert to Free with limited features.</p>
            <div className="flex gap-2.5">
              <button
                className="btn btn-danger flex-1"
                disabled={cancelLoading}
                onClick={async () => {
                  setCancelLoading(true)
                  try {
                    const result = await cancelSubscription()
                    if (result.success) {
                      toast.success(result.message || 'Subscription cancelled. You\'ll keep access until the billing period ends.')
                      setCancelConfirm(false)
                      if (user) fetchProfile(user.id)
                    }
                  } catch (err: any) {
                    toast.error(err.message || 'Could not cancel subscription.')
                  } finally {
                    setCancelLoading(false)
                  }
                }}
              >
                {cancelLoading ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
              <button className="btn btn-outline flex-1" onClick={() => setCancelConfirm(false)}>Keep Plan</button>
            </div>
          </div>
        </div>
      )}

      {shareResume && (
        <ShareResumeModal
          resumeId={shareResume.id}
          resumeTitle={shareResume.title}
          onClose={() => setShareResume(null)}
        />
      )}
    </div>
  )
}
