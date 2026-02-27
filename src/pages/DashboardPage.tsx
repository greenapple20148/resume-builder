import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { toast } from '../components/Toast'
import { useStore } from '../lib/store'
import { useSEO } from '../lib/useSEO'
import { PLANS, openCustomerPortal, verifySubscription, cancelSubscription } from '../lib/stripe'
import { Resume } from '../types'
import { getResumeScore } from '../lib/resumeScore'
import { LandingIcon } from '../components/LandingIcons'

interface ResumeCardProps {
  resume: Resume
  onEdit: (resume: Resume) => void
  onDelete: (id: string) => void
  onDuplicate: (resume: Resume) => void
  onDownload: (resume: Resume) => void
}

function ResumeCard({ resume, onEdit, onDelete, onDuplicate, onDownload }: ResumeCardProps) {
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
  const themes: Record<string, { bg: string; accent: string; sidebar: boolean; gradient?: boolean }> = {
    editorial_luxe: { bg: '#fdfbf9', accent: '#dca47d', sidebar: false },
    dark_architect: { bg: '#18181f', accent: '#64ffda', sidebar: true },
    bauhaus_geometric: { bg: '#0d1b3e', accent: '#e8634a', sidebar: true },
    soft_pastel: { bg: '#fdfbf8', accent: '#d4726a', sidebar: false },
    swiss_grid: { bg: '#fff', accent: '#d63031', sidebar: false },
    dark: { bg: '#0f0f14', accent: '#c9a84c', sidebar: false },

    terminal: { bg: '#0a0e14', accent: '#7ee787', sidebar: false },

    vintage: { bg: '#f5eed6', accent: '#5c4a32', sidebar: false }, graduate: { bg: '#fafbfe', accent: '#f43f5e', sidebar: false },
    corporate_slate: { bg: '#1e293b', accent: '#3b82f6', sidebar: true },
    teal_wave: { bg: '#ffffff', accent: '#0d9488', sidebar: false, gradient: true },
    purple_dusk: { bg: '#2e1065', accent: '#8b5cf6', sidebar: true },
    coral_bright: { bg: '#ffffff', accent: '#f97316', sidebar: false, gradient: true },
    ocean_deep: { bg: '#0c4a6e', accent: '#0284c7', sidebar: false, gradient: true },
    sage_pro: { bg: '#ffffff', accent: '#16a34a', sidebar: false },
    carbon_noir: { bg: '#18181b', accent: '#ffffff', sidebar: false },
    sand_dune: { bg: '#fafaf9', accent: '#d97706', sidebar: false, gradient: true },
    indigo_sharp: { bg: '#ffffff', accent: '#4f46e5', sidebar: false },
    platinum_elite: { bg: '#ffffff', accent: '#94a3b8', sidebar: true },
    cascade_blue: { bg: '#0f2a4a', accent: '#1a6fb5', sidebar: true },
    nordic_minimal: { bg: '#fafafa', accent: '#2d6a4f', sidebar: false },
    midnight_pro: { bg: '#0c0f1a', accent: '#c9a84c', sidebar: true },
    blueprint: { bg: '#0a1628', accent: '#4a9eff', sidebar: true },
    emerald_fresh: { bg: '#ffffff', accent: '#1a7a4a', sidebar: false, gradient: true },
    sunset_warm: { bg: '#f7efe3', accent: '#c97c2a', sidebar: false, gradient: true },
    newspaper_classic: { bg: '#faf7f3', accent: '#8b1a1a', sidebar: false },
    ivory_marble: { bg: '#f9f6f0', accent: '#b8963c', sidebar: true },
    neon_cyber: { bg: '#04080f', accent: '#00fff7', sidebar: true },
    origami_zen: { bg: '#fdfcfa', accent: '#b03030', sidebar: false },
  }
  const t = themes[theme] || themes.editorial_luxe
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, display: 'flex', overflow: 'hidden' }}>
      {t.sidebar && <div style={{ width: '35%', background: t.accent === '#f5c800' ? '#1a1a1a' : t.accent, opacity: 0.9 }} />}
      <div style={{ flex: 1, padding: 10 }}>
        {t.gradient && <div style={{ height: 30, background: `linear-gradient(135deg, ${t.accent}, #f9ca24)`, borderRadius: '3px 3px 0 0', marginBottom: 6 }} />}
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
  const { profile, resumes, resumesLoading, fetchResumes, createResume, deleteResume, duplicateResume } = useStore()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => { fetchResumes(); if (searchParams.get('upgraded') === 'true') toast.success('Welcome to Pro! All features unlocked.') }, [fetchResumes, searchParams])
  const { user, fetchProfile } = useStore()
  useEffect(() => { if (user) verifySubscription().then(() => fetchProfile(user.id)).catch(() => { }) }, [user?.id])

  const handleCreate = async (initialData: any = null) => {
    try {
      const dataToPass = initialData?.nativeEvent ? null : initialData
      const resume = await createResume('editorial_luxe', dataToPass)
      navigate(`/editor/${resume.id}`)
    } catch (err: any) {
      if (err.message === 'LIMIT_REACHED') { toast.error('Resume limit reached. Upgrade your plan to create more.'); navigate('/pricing') }
      else toast.error(err.message || 'Could not create resume.')
    }
  }
  const handleEdit = (resume: Resume) => navigate(`/editor/${resume.id}`)
  const handleDelete = async (id: string) => { try { await deleteResume(id); toast.success('Resume deleted.') } catch (err: any) { toast.error('Could not delete resume: ' + err.message) } setDeleteConfirm(null) }
  const handleDuplicate = async (resume: Resume) => { try { await duplicateResume(resume); toast.success('Resume duplicated!') } catch { toast.error('Could not duplicate resume.') } }
  const handleDownload = (resume: Resume) => navigate(`/editor/${resume.id}?download=true`)
  const handleBilling = async () => {
    if (!profile?.stripe_customer_id) { navigate('/pricing'); return }
    try { setPortalLoading(true); await openCustomerPortal() } catch { toast.error('Could not open billing portal.') } finally { setPortalLoading(false) }
  }

  const planInfo = PLANS[profile?.plan || 'free']
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
            <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink font-medium rounded-lg bg-[var(--white)] border-l-2 border-gold shadow-sm no-underline mb-0.5">
              <span className="text-gold"><LandingIcon name="file-text" size={14} /></span> My Resumes
            </Link>
            <Link to="/themes" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5">
              <span className="text-ink-30"><LandingIcon name="layers" size={14} /></span> Templates
            </Link>
            <Link to="/pricing" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5">
              <span className="text-ink-30"><LandingIcon name="star" size={14} /></span> Billing
            </Link>
            {(profile?.plan === 'pro' || profile?.plan === 'premium' || profile?.plan === 'career_plus') && (
              <Link to="/tools/cover-letter" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5">
                <span className="text-ink-30"><LandingIcon name="mail" size={14} /></span> Cover Letters
              </Link>
            )}
            {(profile?.plan === 'premium' || profile?.plan === 'career_plus') && (
              <>
                <Link to="/tools/linkedin" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5"><span className="text-ink-30"><LandingIcon name="linkedin" size={14} /></span> LinkedIn Toolkit</Link>
                <Link to="/tools/interview" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5"><span className="text-ink-30"><LandingIcon name="mic" size={14} /></span> Interview Toolkit</Link>
                <Link to="/tools/mock-interview" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5"><span className="text-ink-30"><LandingIcon name="brain" size={14} /></span> AI Mock Interview</Link>
              </>
            )}
            <Link to="/tools/ai" className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-40 rounded-lg border-l-2 border-transparent transition-all hover:bg-ink-05 hover:text-ink no-underline mb-0.5"><span className="text-ink-30"><LandingIcon name="sparkles" size={14} /></span> AI Tools</Link>
          </div>

          <div className="bg-[var(--white)] border border-ink-10 rounded-xl p-4 mt-4">
            <div className="mb-3">
              <span className={`badge ${profile?.plan !== 'free' ? 'badge-gold' : 'badge-dark'}`}>
                {profile?.plan === 'career_plus' ? 'CAREER+' : profile?.plan?.toUpperCase() || 'FREE'}
              </span>
            </div>
            <div className="mb-1">
              <div className="text-xs font-mono text-ink-40 mb-1.5 flex justify-between">{resumeCount}/{resumeLimit === Infinity ? '∞' : resumeLimit} resumes</div>
              <div className="h-1 bg-ink-10 rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full transition-all duration-400" style={{ width: `${Math.min((resumeCount / (resumeLimit === Infinity ? 1 : resumeLimit)) * 100, 100)}%` }} />
              </div>
            </div>
            {profile?.plan === 'free' && <Link to="/pricing" className="btn btn-gold w-full mt-3 text-[13px]">Upgrade to Pro →</Link>}
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
                <ResumeCard key={resume.id} resume={resume} onEdit={handleEdit} onDelete={(id) => setDeleteConfirm(id)} onDuplicate={handleDuplicate} onDownload={handleDownload} />
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
    </div>
  )
}
