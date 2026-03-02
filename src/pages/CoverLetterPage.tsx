import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStore } from '../lib/store'
import { toast } from '../components/Toast'
import { CoverLetter } from '../types'
import { sanitizeHtml, escapeHtml } from '../lib/sanitize'
import { getEffectivePlan } from '../lib/expressUnlock'

type Phase = 'list' | 'editor'

const TONE_OPTIONS = [
    { id: 'professional' as const, label: 'Professional', desc: 'Formal and polished' },
    { id: 'conversational' as const, label: 'Conversational', desc: 'Warm and personable' },
    { id: 'enthusiastic' as const, label: 'Enthusiastic', desc: 'Energetic and passionate' },
]

export default function CoverLetterPage() {
    const {
        profile, resumes, coverLetters, coverLettersLoading, saveStatus,
        fetchResumes, fetchCoverLetters, createCoverLetter, updateCoverLetter, deleteCoverLetter,
    } = useStore()

    const plan = getEffectivePlan(profile)
    const canAccess = plan !== 'free'

    const [phase, setPhase] = useState<Phase>('list')
    const [activeCL, setActiveCL] = useState<CoverLetter | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [aiLoading, setAiLoading] = useState(false)
    const [jdText, setJdText] = useState('')
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (canAccess) {
            fetchCoverLetters()
            fetchResumes()
        }
    }, [canAccess])

    const autoSave = useCallback((field: string, value: string) => {
        if (!activeCL) return
        const updated = { ...activeCL, [field]: value }
        setActiveCL(updated)
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => {
            updateCoverLetter(activeCL.id, { [field]: value }).catch(() => toast.error('Failed to save'))
        }, 800)
    }, [activeCL, updateCoverLetter])

    const handleCreate = async () => {
        try {
            const cl = await createCoverLetter({ company_name: '', job_title: '', recipient_name: '', body: '', tone: 'professional' })
            setActiveCL(cl)
            setPhase('editor')
        } catch (err: any) { toast.error(err.message || 'Failed to create cover letter') }
    }

    const handleEdit = (cl: CoverLetter) => { setActiveCL(cl); setPhase('editor') }

    const handleDelete = async (id: string) => {
        try {
            await deleteCoverLetter(id)
            setDeleteConfirm(null)
            if (activeCL?.id === id) { setActiveCL(null); setPhase('list') }
            toast.success('Cover letter deleted')
        } catch { toast.error('Failed to delete') }
    }

    const handleAIGenerate = async () => {
        if (!activeCL) return
        setAiLoading(true)
        try {
            const resume = activeCL.resume_id ? resumes.find(r => r.id === activeCL.resume_id) : resumes[0]
            const body = generateLocalCoverLetter(activeCL, resume, jdText)
            autoSave('body', body)
            toast.success('Cover letter template generated!')
        } catch { toast.error('Generation failed') }
        finally { setAiLoading(false) }
    }

    const handleDownload = () => {
        if (!activeCL) return
        const name = profile?.full_name || 'Applicant'
        const email = profile?.email || ''
        const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        const text = `${date}\n\n${activeCL.recipient_name || 'Hiring Manager'}\n${activeCL.company_name}\n\nDear ${activeCL.recipient_name || 'Hiring Manager'},\n\n${activeCL.body}\n\nSincerely,\n${name}\n${email}`
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
        const safeTitle = escapeHtml(activeCL.company_name || 'Cover Letter')
        const safeContent = sanitizeHtml(printDiv.innerHTML)
        win.document.write(`<html><head><title>Cover Letter - ${safeTitle}</title>
      <style>body{font-family:Georgia,'Times New Roman',serif;padding:60px;color:#1a1a1a;line-height:1.8;max-width:700px;margin:0 auto}.date{font-size:13px;color:#666;margin-bottom:20px}.recipient{font-size:14px;color:#333;margin-bottom:20px;line-height:1.6}.salutation{font-size:14px;font-weight:600;margin-bottom:16px}.body{font-size:14px;line-height:1.85;color:#333;white-space:pre-wrap}.closing{margin-top:28px;font-size:14px;color:#333}.name{font-weight:700;margin-top:4px}.contact{font-size:12px;color:#888;margin-top:2px}</style></head><body>${safeContent}</body></html>`)
        win.document.close()
        setTimeout(() => { win.print(); win.close() }, 300)
    }

    // ── Premium Gate
    if (!canAccess) {
        return (
            <div className="min-h-screen bg-bg">
                <Navbar />
                <div className="max-w-[560px] mx-auto mt-20 text-center p-12 bg-surface border border-border rounded-2xl">
                    <div className="text-5xl">✉️</div>
                    <h1 className="text-3xl font-bold text-ink mt-4 mb-2">Cover Letter Builder</h1>
                    <p className="text-ink-40 text-sm mb-6 leading-relaxed">Create tailored cover letters for every application. Write manually or let AI draft one based on your resume and the job description.</p>
                    <Link to="/pricing" className="btn btn-gold btn-lg">Upgrade to Pro →</Link>
                </div>
            </div>
        )
    }

    // ── LIST VIEW
    if (phase === 'list') {
        return (
            <div className="min-h-screen bg-bg">
                <Navbar />
                <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-20">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-ink my-2">Cover <em className="not-italic bg-gradient-to-br from-gold to-gold-light bg-clip-text text-transparent">Letters</em></h1>
                        <p className="text-ink-40 text-[15px]">Create tailored cover letters for every application.</p>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="text-lg font-bold text-ink">My Cover Letters</div>
                            <div className="text-[13px] text-ink-40 mt-0.5">{coverLetters.length} cover letter{coverLetters.length !== 1 ? 's' : ''}</div>
                        </div>
                        <button className="btn btn-gold" onClick={handleCreate}>+ New Cover Letter</button>
                    </div>

                    {coverLettersLoading ? (
                        <div className="flex items-center justify-center min-h-[200px]"><div className="spinner" style={{ color: 'var(--gold)' }} /></div>
                    ) : coverLetters.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-5xl mb-4">✉️</div>
                            <h3 className="text-lg font-bold text-ink mb-2">No cover letters yet</h3>
                            <p className="text-ink-40 text-sm mb-5">Create your first cover letter and stand out from the crowd.</p>
                            <button className="btn btn-gold btn-lg" onClick={handleCreate}>Create Your First Cover Letter →</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {coverLetters.map((cl) => (
                                <div key={cl.id} className="bg-surface border border-border rounded-2xl p-6 cursor-pointer transition-all hover:border-gold hover:-translate-y-0.5 hover:shadow-lg" onClick={() => handleEdit(cl)}>
                                    <div className="text-[28px] mb-3">✉️</div>
                                    <div className="font-bold text-[15px] text-ink mb-1">{cl.title}</div>
                                    <div className="text-xs text-ink-40 mb-2.5">
                                        {cl.company_name && `${cl.company_name} · `}{cl.job_title && `${cl.job_title} · `}
                                        {new Date(cl.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="text-[13px] text-ink-70 leading-relaxed line-clamp-3">{cl.body || 'Empty — click to start writing'}</div>
                                    <div className="flex gap-2 mt-3.5" onClick={e => e.stopPropagation()}>
                                        <button className="px-2.5 py-1 rounded-md border border-border bg-bg text-ink-70 text-[11px] cursor-pointer transition-all hover:border-gold hover:text-gold" onClick={() => handleEdit(cl)}>Edit</button>
                                        <button className="px-2.5 py-1 rounded-md border border-border bg-bg text-ink-70 text-[11px] cursor-pointer transition-all hover:border-rose hover:text-rose" onClick={() => setDeleteConfirm(cl.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                            <button className="bg-surface border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 min-h-[180px] cursor-pointer transition-all text-ink-40 text-sm hover:border-gold hover:text-gold" onClick={handleCreate}>
                                <span className="text-[32px] font-light">+</span>
                                <span>New Cover Letter</span>
                            </button>
                        </div>
                    )}
                </div>

                {deleteConfirm && (
                    <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <h3 className="mb-3">Delete Cover Letter?</h3>
                            <p className="mb-6 text-ink-40 text-sm">This action is permanent and cannot be undone.</p>
                            <div className="flex gap-2.5">
                                <button className="btn btn-danger flex-1" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                                <button className="btn btn-outline flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // ── EDITOR VIEW
    return (
        <div className="min-h-screen bg-bg">
            <Navbar />
            <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-20">
                <div className="flex items-center gap-2.5 mb-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => setPhase('list')}>← Back</button>
                    <button className="btn btn-outline btn-sm" onClick={handleDownload}>Download TXT</button>
                    <button className="btn btn-outline btn-sm" onClick={handleDownloadPDF}>Print / PDF</button>
                    <span className={`text-xs ml-auto ${saveStatus === 'saving' ? 'text-gold' : saveStatus === 'error' ? 'text-rose' : 'text-ink-20'}`}>
                        {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'error' ? 'Error saving' : '✓ Saved'}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[calc(100vh-180px)]">
                    {/* Left: Form */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-surface border border-border rounded-2xl p-6">
                            <div className="text-sm font-bold text-ink mb-4 flex items-center gap-2">Company Details</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-semibold text-ink-40 uppercase tracking-wide">Company Name</label>
                                    <input className="px-3 py-2.5 border border-border rounded-[10px] bg-bg text-ink text-sm transition-colors focus:outline-none focus:border-gold" placeholder="e.g. Google" value={activeCL?.company_name || ''} onChange={e => autoSave('company_name', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-semibold text-ink-40 uppercase tracking-wide">Job Title</label>
                                    <input className="px-3 py-2.5 border border-border rounded-[10px] bg-bg text-ink text-sm transition-colors focus:outline-none focus:border-gold" placeholder="e.g. Senior Software Engineer" value={activeCL?.job_title || ''} onChange={e => autoSave('job_title', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-semibold text-ink-40 uppercase tracking-wide">Recipient Name</label>
                                    <input className="px-3 py-2.5 border border-border rounded-[10px] bg-bg text-ink text-sm transition-colors focus:outline-none focus:border-gold" placeholder="e.g. Jane Smith (or leave blank)" value={activeCL?.recipient_name || ''} onChange={e => autoSave('recipient_name', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-semibold text-ink-40 uppercase tracking-wide">Cover Letter Title</label>
                                    <input className="px-3 py-2.5 border border-border rounded-[10px] bg-bg text-ink text-sm transition-colors focus:outline-none focus:border-gold" placeholder="e.g. Cover Letter — Google" value={activeCL?.title || ''} onChange={e => autoSave('title', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface border border-border rounded-2xl p-6">
                            <div className="text-sm font-bold text-ink mb-4 flex items-center gap-2">Tone & Style</div>
                            <div className="flex gap-2">
                                {TONE_OPTIONS.map(t => (
                                    <button key={t.id} className={`px-3.5 py-2 rounded-lg border text-[13px] cursor-pointer transition-all ${activeCL?.tone === t.id ? 'bg-gradient-to-br from-gold to-gold-light text-black border-gold font-semibold' : 'border-border bg-bg text-ink-70 hover:border-gold'}`} onClick={() => autoSave('tone', t.id)}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                            {resumes.length > 0 && (
                                <div className="flex flex-col gap-1 mt-4">
                                    <label className="text-[11px] font-semibold text-ink-40 uppercase tracking-wide">Link to Resume (for AI)</label>
                                    <select className="px-3 py-2.5 border border-border rounded-[10px] bg-bg text-ink text-sm transition-colors focus:outline-none focus:border-gold" value={activeCL?.resume_id || ''} onChange={e => autoSave('resume_id', e.target.value)}>
                                        <option value="">None — write from scratch</option>
                                        {resumes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>

                        {(plan === 'premium' || plan === 'career_plus') && (
                            <div className="bg-gradient-to-br from-[rgba(201,168,76,0.06)] to-[rgba(201,168,76,0.02)] border border-[rgba(201,168,76,0.2)] rounded-[14px] p-5">
                                <div className="text-[13px] font-bold text-gold mb-2 flex items-center gap-1.5">AI Cover Letter Writer</div>
                                <div className="text-xs text-ink-40 mb-3 leading-relaxed">Paste the job description below and we'll generate a tailored cover letter from your resume.</div>
                                <textarea className="w-full min-h-[80px] p-3 border border-[rgba(201,168,76,0.2)] rounded-[10px] bg-bg text-ink text-[13px] leading-relaxed resize-y mb-2.5 focus:outline-none focus:border-gold" placeholder="Paste the job description here (optional but recommended)…" value={jdText} onChange={e => setJdText(e.target.value)} />
                                <button className="btn btn-gold w-full" onClick={handleAIGenerate} disabled={aiLoading}>
                                    {aiLoading ? <>Generating…</> : 'Generate Cover Letter'}
                                </button>
                            </div>
                        )}

                        <div className="bg-surface border border-border rounded-2xl p-6">
                            <div className="text-sm font-bold text-ink mb-4 flex items-center gap-2">Cover Letter Body</div>
                            <textarea className="w-full min-h-[320px] p-[18px] border border-border rounded-xl bg-bg text-ink text-sm leading-[1.75] resize-y transition-colors focus:outline-none focus:border-gold" placeholder={"Write your cover letter body here…\n\nParagraph 1: Express interest in the role and company.\n\nParagraph 2: Highlight relevant experience and skills.\n\nParagraph 3: Connect your achievements to the company's needs.\n\nParagraph 4: Express enthusiasm and call to action."} value={activeCL?.body || ''} onChange={e => autoSave('body', e.target.value)} />
                            <div className="text-[11px] text-ink-20 text-right mt-1">{(activeCL?.body || '').split(/\s+/).filter(Boolean).length} words</div>
                        </div>
                    </div>

                    {/* Right: Preview */}
                    <div className="lg:sticky lg:top-[88px] self-start">
                        <div className="bg-white border border-border rounded-2xl p-12 text-[#1a1a1a] font-serif min-h-[500px] shadow-md" id="cover-letter-preview">
                            {activeCL?.body ? (
                                <>
                                    <div className="text-[13px] text-[#666] mb-5">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                    {activeCL.recipient_name && <div className="text-sm leading-relaxed text-[#333] mb-5">{activeCL.recipient_name}<br />{activeCL.company_name}</div>}
                                    <div className="text-sm font-semibold text-[#1a1a1a] mb-4">Dear {activeCL.recipient_name || 'Hiring Manager'},</div>
                                    <div className="text-sm leading-[1.85] text-[#333] whitespace-pre-wrap">{activeCL.body}</div>
                                    <div className="mt-7 text-sm leading-relaxed text-[#333]">
                                        Sincerely,
                                        <div className="font-bold text-[#1a1a1a] mt-1">{profile?.full_name || 'Your Name'}</div>
                                        <div className="text-xs text-[#888] mt-0.5">{profile?.email || ''}</div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-16 text-[#aaa] italic text-[15px]">✉️ Your cover letter preview will appear here as you type…</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function generateLocalCoverLetter(cl: CoverLetter, resume: any, jdText: string): string {
    const title = resume?.data?.personal?.jobTitle || 'professional'
    const company = cl.company_name || '[Company]'
    const role = cl.job_title || '[Position]'
    const skills = resume?.data?.skills?.slice(0, 5).join(', ') || 'relevant skills'
    const experience = resume?.data?.experience?.[0]
    const expLine = experience ? `In my most recent role as ${experience.title} at ${experience.company}, I developed expertise in ${skills}.` : `With my background as a ${title}, I bring strong expertise in ${skills}.`
    const toneOpener = cl.tone === 'enthusiastic'
        ? `I am thrilled to apply for the ${role} position at ${company}! This opportunity perfectly aligns with my passion and professional goals.`
        : cl.tone === 'conversational'
            ? `I'm writing to express my interest in the ${role} role at ${company}. I was excited to discover this opportunity and believe I'd be a great fit for your team.`
            : `I am writing to express my strong interest in the ${role} position at ${company}. With my background in ${title.toLowerCase()}, I am confident I would be a valuable addition to your team.`
    return `${toneOpener}\n\n${expLine} I am passionate about delivering high-quality results and continuously growing in my field.\n\n${jdText ? `After reviewing the job description, I am particularly drawn to the opportunity to contribute to ${company}'s mission. My experience directly aligns with the key requirements you've outlined, and I am eager to bring my expertise to your team.` : `I am drawn to ${company}'s mission and values, and I am eager to contribute my skills and experience to help drive the company's continued success.`}\n\nI would welcome the opportunity to discuss how my background and skills align with your needs. Thank you for considering my application, and I look forward to hearing from you.`
}
