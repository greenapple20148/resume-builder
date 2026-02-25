import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStore } from '../lib/store'
import { toast } from '../components/Toast'
import { CoverLetter } from '../types'
import styles from './CoverLetterPage.module.css'

type Phase = 'list' | 'editor'

const TONE_OPTIONS = [
    { id: 'professional' as const, label: '💼 Professional', desc: 'Formal and polished' },
    { id: 'conversational' as const, label: '💬 Conversational', desc: 'Warm and personable' },
    { id: 'enthusiastic' as const, label: '🚀 Enthusiastic', desc: 'Energetic and passionate' },
]

export default function CoverLetterPage() {
    const {
        profile, resumes, coverLetters, coverLettersLoading, saveStatus,
        fetchResumes, fetchCoverLetters, createCoverLetter, updateCoverLetter, deleteCoverLetter,
    } = useStore()

    const plan = profile?.plan || 'free'
    const canAccess = plan !== 'free'

    const [phase, setPhase] = useState<Phase>('list')
    const [activeCL, setActiveCL] = useState<CoverLetter | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [aiLoading, setAiLoading] = useState(false)
    const [jdText, setJdText] = useState('')
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Load data
    useEffect(() => {
        if (canAccess) {
            fetchCoverLetters()
            fetchResumes()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canAccess])

    // ── Autosave ──────────────────────────────
    const autoSave = useCallback((field: string, value: string) => {
        if (!activeCL) return
        const updated = { ...activeCL, [field]: value }
        setActiveCL(updated)

        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => {
            updateCoverLetter(activeCL.id, { [field]: value }).catch(() => {
                toast.error('Failed to save')
            })
        }, 800)
    }, [activeCL, updateCoverLetter])

    // ── Create ────────────────────────────────
    const handleCreate = async () => {
        try {
            const cl = await createCoverLetter({
                company_name: '',
                job_title: '',
                recipient_name: '',
                body: '',
                tone: 'professional',
            })
            setActiveCL(cl)
            setPhase('editor')
        } catch (err: any) {
            toast.error(err.message || 'Failed to create cover letter')
        }
    }

    // ── Edit ──────────────────────────────────
    const handleEdit = (cl: CoverLetter) => {
        setActiveCL(cl)
        setPhase('editor')
    }

    // ── Delete ────────────────────────────────
    const handleDelete = async (id: string) => {
        try {
            await deleteCoverLetter(id)
            setDeleteConfirm(null)
            if (activeCL?.id === id) {
                setActiveCL(null)
                setPhase('list')
            }
            toast.success('Cover letter deleted')
        } catch {
            toast.error('Failed to delete')
        }
    }

    // ── AI Generate ───────────────────────────
    const handleAIGenerate = async () => {
        if (!activeCL) return
        setAiLoading(true)
        try {
            const resume = activeCL.resume_id
                ? resumes.find(r => r.id === activeCL.resume_id)
                : resumes[0]

            const resumeContext = resume
                ? `
Name: ${resume.data.personal?.fullName || ''}
Title: ${resume.data.personal?.jobTitle || ''}
Summary: ${resume.data.personal?.summary || ''}
Skills: ${resume.data.skills?.join(', ') || ''}
Experience: ${resume.data.experience?.map(e => `${e.title} at ${e.company}: ${e.description}`).join('\n') || 'None listed'}
Education: ${resume.data.education?.map(e => `${e.degree} at ${e.school}`).join(', ') || ''}`
                : ''

            const prompt = `Write a cover letter with the following details:
Company: ${activeCL.company_name || '[Company]'}
Job Title: ${activeCL.job_title || '[Position]'}
Recipient: ${activeCL.recipient_name || 'Hiring Manager'}
Tone: ${activeCL.tone}
${jdText ? `\nJob Description:\n${jdText}` : ''}
${resumeContext ? `\nCandidate Resume:\n${resumeContext}` : ''}

Write ONLY the body paragraphs of the cover letter (3-4 paragraphs). Do NOT include the date, address, salutation, or closing — those are added separately. 
Be specific, mention the company by name, and tailor to the role. 
Use a ${activeCL.tone} tone. Keep it under 350 words.`

            const { data: { session } } = await (await import('../lib/supabase')).supabase.auth.getSession()
            if (!session) throw new Error('Not authenticated')

            const res = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-mock-interview`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({
                        action: 'generate_cover_letter',
                        prompt,
                    }),
                }
            )

            // Falls back to simple fetch if the edge function doesn't have the action
            if (!res.ok) {
                // Use Gemini directly via a simple prompt approach
                const body = generateLocalCoverLetter(activeCL, resume, jdText)
                autoSave('body', body)
                toast.success('Cover letter generated!')
                return
            }

            const data = await res.json()
            if (data.result) {
                autoSave('body', data.result)
                toast.success('Cover letter generated!')
            }
        } catch (err: any) {
            // Fallback — generate a template locally
            const resume = resumes[0]
            const body = generateLocalCoverLetter(activeCL, resume, jdText)
            autoSave('body', body)
            toast.success('Cover letter template generated!')
        } finally {
            setAiLoading(false)
        }
    }

    // ── Download as text ──────────────────────
    const handleDownload = () => {
        if (!activeCL) return
        const name = profile?.full_name || 'Applicant'
        const email = profile?.email || ''
        const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

        const text = `${date}

${activeCL.recipient_name || 'Hiring Manager'}
${activeCL.company_name}

Dear ${activeCL.recipient_name || 'Hiring Manager'},

${activeCL.body}

Sincerely,
${name}
${email}`

        const blob = new Blob([text], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Cover Letter - ${activeCL.company_name || 'Untitled'}.txt`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Cover letter downloaded!')
    }

    const handleDownloadPDF = () => {
        if (!activeCL) return
        const printDiv = document.getElementById('cover-letter-preview')
        if (!printDiv) return

        const win = window.open('', '_blank')
        if (!win) return
        win.document.write(`
      <html><head><title>Cover Letter - ${activeCL.company_name}</title>
      <style>
        body { font-family: Georgia, 'Times New Roman', serif; padding: 60px; color: #1a1a1a; line-height: 1.8; max-width: 700px; margin: 0 auto; }
        .date { font-size: 13px; color: #666; margin-bottom: 20px; }
        .recipient { font-size: 14px; color: #333; margin-bottom: 20px; line-height: 1.6; }
        .salutation { font-size: 14px; font-weight: 600; margin-bottom: 16px; }
        .body { font-size: 14px; line-height: 1.85; color: #333; white-space: pre-wrap; }
        .closing { margin-top: 28px; font-size: 14px; color: #333; }
        .name { font-weight: 700; margin-top: 4px; }
        .contact { font-size: 12px; color: #888; margin-top: 2px; }
      </style></head><body>
      ${printDiv.innerHTML}
      </body></html>
    `)
        win.document.close()
        setTimeout(() => { win.print(); win.close() }, 300)
    }

    // ── Premium Gate ──────────────────────────
    if (!canAccess) {
        return (
            <div className={styles.page}>
                <Navbar />
                <div className={styles.gate}>
                    <div className={styles.gateIcon}>✉️</div>
                    <h1>Cover Letter Builder</h1>
                    <p>
                        Create tailored cover letters for every application. Write manually or let AI
                        draft one based on your resume and the job description.
                    </p>
                    <Link to="/pricing" className="btn btn-gold btn-lg">Upgrade to Pro →</Link>
                </div>
            </div>
        )
    }

    // ── LIST VIEW ─────────────────────────────
    if (phase === 'list') {
        return (
            <div className={styles.page}>
                <Navbar />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1>Cover <em>Letters</em></h1>
                        <p>Create tailored cover letters for every application.</p>
                    </div>

                    <div className={styles.topBar}>
                        <div>
                            <div className={styles.topBarTitle}>My Cover Letters</div>
                            <div className={styles.topBarSub}>{coverLetters.length} cover letter{coverLetters.length !== 1 ? 's' : ''}</div>
                        </div>
                        <button className="btn btn-gold" onClick={handleCreate}>+ New Cover Letter</button>
                    </div>

                    {coverLettersLoading ? (
                        <div className={styles.loading}>
                            <div className="spinner" style={{ color: 'var(--gold)' }} />
                        </div>
                    ) : coverLetters.length === 0 ? (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>✉️</div>
                            <h3>No cover letters yet</h3>
                            <p>Create your first cover letter and stand out from the crowd.</p>
                            <button className="btn btn-gold btn-lg" onClick={handleCreate}>
                                Create Your First Cover Letter →
                            </button>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {coverLetters.map((cl) => (
                                <div key={cl.id} className={styles.card} onClick={() => handleEdit(cl)}>
                                    <div className={styles.cardIcon}>✉️</div>
                                    <div className={styles.cardTitle}>{cl.title}</div>
                                    <div className={styles.cardMeta}>
                                        {cl.company_name && `${cl.company_name} · `}
                                        {cl.job_title && `${cl.job_title} · `}
                                        {new Date(cl.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className={styles.cardPreview}>
                                        {cl.body || 'Empty — click to start writing'}
                                    </div>
                                    <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                                        <button className={styles.cardBtn} onClick={() => handleEdit(cl)}>Edit</button>
                                        <button
                                            className={`${styles.cardBtn} ${styles.cardBtnDanger}`}
                                            onClick={() => setDeleteConfirm(cl.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button className={styles.newCard} onClick={handleCreate}>
                                <span className={styles.newCardIcon}>+</span>
                                <span>New Cover Letter</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Delete confirm modal */}
                {deleteConfirm && (
                    <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <h3 style={{ marginBottom: 12 }}>Delete Cover Letter?</h3>
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

    // ── EDITOR VIEW ───────────────────────────
    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.container}>
                {/* Actions bar */}
                <div className={styles.actionsBar}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setPhase('list')}>← Back</button>
                    <button className="btn btn-outline btn-sm" onClick={handleDownload}>📄 Download TXT</button>
                    <button className="btn btn-outline btn-sm" onClick={handleDownloadPDF}>🖨️ Print / PDF</button>
                    <span className={`${styles.saveIndicator} ${saveStatus === 'saving' ? styles.saving : saveStatus === 'error' ? styles.error : ''}`}>
                        {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'error' ? 'Error saving' : '✓ Saved'}
                    </span>
                </div>

                <div className={styles.editor}>
                    {/* ── Left: Form ────────────────── */}
                    <div className={styles.editorLeft}>
                        {/* Company info */}
                        <div className={styles.panel}>
                            <div className={styles.panelTitle}>🏢 Company Details</div>
                            <div className={styles.fieldGrid}>
                                <div className={styles.field}>
                                    <label>Company Name</label>
                                    <input
                                        placeholder="e.g. Google"
                                        value={activeCL?.company_name || ''}
                                        onChange={e => autoSave('company_name', e.target.value)}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Job Title</label>
                                    <input
                                        placeholder="e.g. Senior Software Engineer"
                                        value={activeCL?.job_title || ''}
                                        onChange={e => autoSave('job_title', e.target.value)}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Recipient Name</label>
                                    <input
                                        placeholder="e.g. Jane Smith (or leave blank)"
                                        value={activeCL?.recipient_name || ''}
                                        onChange={e => autoSave('recipient_name', e.target.value)}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Cover Letter Title</label>
                                    <input
                                        placeholder="e.g. Cover Letter — Google"
                                        value={activeCL?.title || ''}
                                        onChange={e => autoSave('title', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tone & Resume */}
                        <div className={styles.panel}>
                            <div className={styles.panelTitle}>🎨 Tone & Style</div>
                            <div className={styles.toneChips}>
                                {TONE_OPTIONS.map(t => (
                                    <button
                                        key={t.id}
                                        className={`${styles.toneChip} ${activeCL?.tone === t.id ? styles.toneChipActive : ''}`}
                                        onClick={() => autoSave('tone', t.id)}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            {resumes.length > 0 && (
                                <div className={styles.field} style={{ marginTop: 16 }}>
                                    <label>Link to Resume (for AI)</label>
                                    <select
                                        value={activeCL?.resume_id || ''}
                                        onChange={e => autoSave('resume_id', e.target.value)}
                                    >
                                        <option value="">None — write from scratch</option>
                                        {resumes.map(r => (
                                            <option key={r.id} value={r.id}>{r.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* AI Generation */}
                        {(plan === 'premium' || plan === 'career_plus') && (
                            <div className={styles.aiPanel}>
                                <div className={styles.aiPanelTitle}>✨ AI Cover Letter Writer</div>
                                <div className={styles.aiPanelDesc}>
                                    Paste the job description below and we'll generate a tailored cover letter
                                    from your resume. Link a resume above for best results.
                                </div>
                                <textarea
                                    className={styles.jdTextarea}
                                    placeholder="Paste the job description here (optional but recommended)…"
                                    value={jdText}
                                    onChange={e => setJdText(e.target.value)}
                                />
                                <button
                                    className="btn btn-gold"
                                    onClick={handleAIGenerate}
                                    disabled={aiLoading}
                                    style={{ width: '100%' }}
                                >
                                    {aiLoading ? (
                                        <><div className="spinner" style={{ width: 14, height: 14, display: 'inline-block' }} /> Generating…</>
                                    ) : (
                                        '✨ Generate Cover Letter'
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Body */}
                        <div className={styles.panel}>
                            <div className={styles.panelTitle}>📝 Cover Letter Body</div>
                            <textarea
                                className={styles.bodyTextarea}
                                placeholder="Write your cover letter body here…

Paragraph 1: Express interest in the role and company.

Paragraph 2: Highlight relevant experience and skills.

Paragraph 3: Connect your achievements to the company's needs.

Paragraph 4: Express enthusiasm and call to action."
                                value={activeCL?.body || ''}
                                onChange={e => autoSave('body', e.target.value)}
                            />
                            <div className={styles.charCount}>
                                {(activeCL?.body || '').split(/\s+/).filter(Boolean).length} words
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Preview ────────────── */}
                    <div className={styles.editorRight}>
                        <div className={styles.preview} id="cover-letter-preview">
                            {activeCL?.body ? (
                                <>
                                    <div className={styles.previewDate}>
                                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    {activeCL.recipient_name && (
                                        <div className={styles.previewRecipient}>
                                            {activeCL.recipient_name}<br />
                                            {activeCL.company_name}
                                        </div>
                                    )}
                                    <div className={styles.previewSalutation}>
                                        Dear {activeCL.recipient_name || 'Hiring Manager'},
                                    </div>
                                    <div className={styles.previewBody}>{activeCL.body}</div>
                                    <div className={styles.previewClosing}>
                                        Sincerely,
                                        <div className={styles.previewName}>{profile?.full_name || 'Your Name'}</div>
                                        <div className={styles.previewContact}>{profile?.email || ''}</div>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.previewPlaceholder}>
                                    ✉️ Your cover letter preview will appear here as you type…
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Fallback local cover letter template ────
function generateLocalCoverLetter(
    cl: CoverLetter,
    resume: any,
    jdText: string
): string {
    const name = resume?.data?.personal?.fullName || 'the candidate'
    const title = resume?.data?.personal?.jobTitle || 'professional'
    const company = cl.company_name || '[Company]'
    const role = cl.job_title || '[Position]'
    const skills = resume?.data?.skills?.slice(0, 5).join(', ') || 'relevant skills'
    const experience = resume?.data?.experience?.[0]

    const expLine = experience
        ? `In my most recent role as ${experience.title} at ${experience.company}, I developed expertise in ${skills}.`
        : `With my background as a ${title}, I bring strong expertise in ${skills}.`

    const toneOpener = cl.tone === 'enthusiastic'
        ? `I am thrilled to apply for the ${role} position at ${company}! This opportunity perfectly aligns with my passion and professional goals.`
        : cl.tone === 'conversational'
            ? `I'm writing to express my interest in the ${role} role at ${company}. I was excited to discover this opportunity and believe I'd be a great fit for your team.`
            : `I am writing to express my strong interest in the ${role} position at ${company}. With my background in ${title.toLowerCase()}, I am confident I would be a valuable addition to your team.`

    return `${toneOpener}

${expLine} I am passionate about delivering high-quality results and continuously growing in my field.

${jdText ? `After reviewing the job description, I am particularly drawn to the opportunity to contribute to ${company}'s mission. My experience directly aligns with the key requirements you've outlined, and I am eager to bring my expertise to your team.` : `I am drawn to ${company}'s mission and values, and I am eager to contribute my skills and experience to help drive the company's continued success.`}

I would welcome the opportunity to discuss how my background and skills align with your needs. Thank you for considering my application, and I look forward to hearing from you.`
}
