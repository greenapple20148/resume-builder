import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { toast } from '../components/Toast'
import { useStore } from '../lib/store'
import { PLANS, openCustomerPortal, verifySubscription } from '../lib/stripe'
import styles from './DashboardPage.module.css'
import { Resume } from '../types'

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
    <div className={styles.resumeCard}>
      {/* Theme preview thumbnail */}
      <div
        className={styles.cardThumb}
        onClick={() => onEdit(resume)}
        style={{ cursor: 'pointer' }}
      >
        <ResumeThumb theme={resume.theme_id} data={resume.data} />
        <div className={styles.cardOverlay}>
          <span className="btn btn-primary btn-sm">Edit Resume</span>
        </div>
      </div>

      <div className={styles.cardInfo}>
        <div className={styles.cardMeta}>
          <div className={styles.cardTitle}>{resume.title}</div>
          <div className={styles.cardDate}>
            {new Date(resume.updated_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </div>
        </div>

        <div className={styles.cardActions}>
          <span className="badge badge-dark" style={{ fontSize: 9 }}>{resume.theme_id}</span>
          <div className={styles.cardMenu}>
            <button
              className="btn btn-ghost btn-icon btn-sm"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Resume options"
            >
              ···
            </button>
            {menuOpen && (
              <div className={styles.cardDropdown}>
                <button onClick={() => { onEdit(resume); setMenuOpen(false) }}>
                  ✎ Edit
                </button>
                <button onClick={() => { onDuplicate(resume); setMenuOpen(false) }}>
                  ⧉ Duplicate
                </button>
                <button onClick={() => { onDownload(resume); setMenuOpen(false) }}>
                  ↓ Download PDF
                </button>
                <div className={styles.cardDropdownDivider} />
                <button
                  className={styles.deleteBtn}
                  onClick={() => { onDelete(resume.id); setMenuOpen(false) }}
                >
                  ✕ Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ResumeThumbProps {
  theme: string
  data: any
}

function ResumeThumb({ theme, data }: ResumeThumbProps) {
  const themes: Record<string, { bg: string; accent: string; sidebar: boolean; gradient?: boolean }> = {
    classic: { bg: '#fff', accent: '#1a1a1a', sidebar: false },
    minimalist: { bg: '#fafaf8', accent: '#111', sidebar: false },
    sidebar: { bg: '#1e3a5f', accent: '#7eb8f7', sidebar: true },
    creative: { bg: '#fff', accent: '#ee5a24', sidebar: false, gradient: true },
    dark: { bg: '#0f0f14', accent: '#c9a84c', sidebar: false },
    editorial: { bg: '#f5f0e8', accent: '#1a1410', sidebar: false },
    bold: { bg: '#1a1a1a', accent: '#f5c800', sidebar: true },
    teal: { bg: '#1c1c2e', accent: '#2b9db3', sidebar: true },
    timeline: { bg: '#f7f7f5', accent: '#222', sidebar: false },
    grande: { bg: '#fff', accent: '#111', sidebar: true },
    blob: { bg: '#fff', accent: '#b87fce', sidebar: false },
    split: { bg: '#f2f2f0', accent: '#888', sidebar: true },
    obsidian: { bg: '#0d0d0d', accent: '#c69b6b', sidebar: false },
    ivory: { bg: '#faf6ef', accent: '#1a2744', sidebar: true },
    noir: { bg: '#080808', accent: '#b4ff50', sidebar: true },
    rose: { bg: '#fdf8f4', accent: '#d4a0a0', sidebar: true },
    executive: { bg: '#ebebeb', accent: '#1a1a1a', sidebar: false },
    terminal: { bg: '#0a0e14', accent: '#7ee787', sidebar: false },
    healthcare: { bg: '#f4f7fa', accent: '#0d9488', sidebar: false },
    nature: { bg: '#f7f3eb', accent: '#4a6741', sidebar: false },
    scifi: { bg: '#05080f', accent: '#00c3ff', sidebar: false },
    sophisticated: { bg: '#ffffff', accent: '#b8953e', sidebar: true },
    vintage: { bg: '#f5eed6', accent: '#5c4a32', sidebar: false },
    graduate: { bg: '#fafbfe', accent: '#f43f5e', sidebar: false },
  }

  const t = themes[theme] || themes.classic

  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, display: 'flex', overflow: 'hidden' }}>
      {t.sidebar && (
        <div style={{ width: '35%', background: t.accent === '#f5c800' ? '#1a1a1a' : t.accent, opacity: 0.9 }} />
      )}
      <div style={{ flex: 1, padding: 10 }}>
        {t.gradient && (
          <div style={{ height: 30, background: `linear-gradient(135deg, ${t.accent}, #f9ca24)`, borderRadius: '3px 3px 0 0', marginBottom: 6 }} />
        )}
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

  useEffect(() => {
    fetchResumes()
    if (searchParams.get('upgraded') === 'true') {
      toast.success('🎉 Welcome to Pro! All features unlocked.')
    }
  }, [fetchResumes, searchParams])

  // Sync plan from Stripe on mount
  const { user, fetchProfile } = useStore()
  useEffect(() => {
    if (user) {
      verifySubscription()
        .then(() => fetchProfile(user.id))
        .catch(() => { })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const handleCreate = async (initialData: any = null) => {
    try {
      const dataToPass = initialData?.nativeEvent ? null : initialData;
      const resume = await createResume('classic', dataToPass)
      navigate(`/editor/${resume.id}`)
    } catch (err: any) {
      if (err.message === 'LIMIT_REACHED') {
        toast.error('Resume limit reached. Upgrade your plan to create more.')
        navigate('/pricing')
      } else {
        toast.error(err.message || 'Could not create resume.')
      }
    }
  }

  const handleEdit = (resume: Resume) => {
    navigate(`/editor/${resume.id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteResume(id)
      toast.success('Resume deleted.')
    } catch (err: any) {
      console.error(err)
      toast.error('Could not delete resume: ' + err.message)
    }
    setDeleteConfirm(null)
  }

  const handleDuplicate = async (resume: Resume) => {
    try {
      await duplicateResume(resume)
      toast.success('Resume duplicated!')
    } catch {
      toast.error('Could not duplicate resume.')
    }
  }

  const handleDownload = (resume: Resume) => {
    navigate(`/editor/${resume.id}?download=true`)
  }

  const handleBilling = async () => {
    if (!profile?.stripe_customer_id) {
      navigate('/pricing')
      return
    }
    try {
      setPortalLoading(true)
      await openCustomerPortal()
    } catch {
      toast.error('Could not open billing portal.')
    } finally {
      setPortalLoading(false)
    }
  }

  const planInfo = PLANS[profile?.plan || 'free']
  const resumeCount = resumes.length
  const resumeLimit = planInfo?.resumeLimit || 3

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarLabel}>Navigation</div>
            <Link to="/dashboard" className={`${styles.sidebarItem} ${styles.active}`}>
              <span>◈</span> My Resumes
            </Link>
            <Link to="/themes" className={styles.sidebarItem}>
              <span>✦</span> Templates
            </Link>
            <Link to="/pricing" className={styles.sidebarItem}>
              <span>$</span> Billing
            </Link>
            {(profile?.plan === 'pro' || profile?.plan === 'premium' || profile?.plan === 'career_plus') && (
              <Link to="/tools/cover-letter" className={styles.sidebarItem}>
                <span>✉️</span> Cover Letters
              </Link>
            )}
            {(profile?.plan === 'premium' || profile?.plan === 'career_plus') && (
              <>
                <Link to="/tools/linkedin" className={styles.sidebarItem}>
                  <span>🔗</span> LinkedIn Toolkit
                </Link>
                <Link to="/tools/interview" className={styles.sidebarItem}>
                  <span>🎤</span> Interview Toolkit
                </Link>
                <Link to="/tools/mock-interview" className={styles.sidebarItem}>
                  <span>🤖</span> AI Mock Interview
                </Link>
              </>
            )}
          </div>

          {/* Plan card */}
          <div className={styles.planCard}>
            <div className={styles.planCardBadge}>
              <span className={`badge ${profile?.plan !== 'free' ? 'badge-gold' : 'badge-dark'}`}>
                {profile?.plan === 'career_plus' ? 'CAREER+' : profile?.plan?.toUpperCase() || 'FREE'}
              </span>
            </div>
            <div className={styles.planCardProgress}>
              <div className={styles.planCardProgressLabel}>
                {resumeCount}/{resumeLimit === Infinity ? '∞' : resumeLimit} resumes
              </div>
              <div className={styles.planCardProgressBar}>
                <div
                  className={styles.planCardProgressFill}
                  style={{ width: `${Math.min((resumeCount / (resumeLimit === Infinity ? 1 : resumeLimit)) * 100, 100)}%` }}
                />
              </div>
            </div>
            {profile?.plan === 'free' && (
              <Link to="/pricing" className="btn btn-gold" style={{ width: '100%', marginTop: 12, fontSize: 13 }}>
                Upgrade to Pro →
              </Link>
            )}
            {profile?.plan !== 'free' && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', marginTop: 8 }}
                onClick={handleBilling}
                disabled={portalLoading}
              >
                {portalLoading ? 'Opening…' : 'Manage Billing'}
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className={styles.main}>
          <div className={styles.topBar}>
            <div>
              <h2 className={styles.pageTitle}>My Resumes</h2>
              <p className={styles.pageSubtitle}>
                {resumeCount} resume{resumeCount !== 1 ? 's' : ''} · {profile?.plan || 'free'} plan
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-gold" onClick={() => handleCreate(null)}>
                + New Resume
              </button>
            </div>
          </div>

          {resumesLoading ? (
            <div className={styles.loading}>
              <div className="spinner" style={{ color: 'var(--gold)' }} />
            </div>
          ) : resumes.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>◈</div>
              <h3>No resumes yet</h3>
              <p>Create your first resume and start applying with confidence.</p>
              <button className="btn btn-gold btn-lg" onClick={() => handleCreate(null)}>
                Build Your First Resume →
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeleteConfirm(id)}
                  onDuplicate={handleDuplicate}
                  onDownload={handleDownload}
                />
              ))}
              {/* New resume card */}
              {(resumeLimit === Infinity || resumeCount < resumeLimit) && (
                <button className={styles.newCard} onClick={() => handleCreate(null)}>
                  <span className={styles.newCardIcon}>+</span>
                  <span>New Resume</span>
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 12 }}>Delete Resume?</h3>
            <p style={{ marginBottom: 24, color: 'var(--ink-40)', fontSize: 14 }}>
              This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(deleteConfirm)}>
                Delete
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
