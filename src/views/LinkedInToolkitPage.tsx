'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { useStore } from '@/lib/store'
import { verifySubscription } from '@/lib/stripe'
import { LandingIcon } from '../components/LandingIcons'
import { getEffectivePlan } from '@/lib/expressUnlock'


// ── Headline templates ──────────────────────────────
const HEADLINE_TEMPLATES = [
    (role: string, skills: string[], industry: string) =>
        `${role} | ${skills.slice(0, 3).join(', ')} | ${industry}`,
    (role: string, skills: string[], industry: string) =>
        `${role} helping ${industry} teams ship faster with ${skills[0]} & ${skills[1] || skills[0]}`,
    (role: string, skills: string[], _: string) =>
        `Experienced ${role} — ${skills.slice(0, 2).join(' · ')} — Building what matters`,
    (role: string, _: string[], industry: string) =>
        `${role} | Passionate about ${industry} | Open to opportunities`,
    (role: string, skills: string[], industry: string) =>
        `${industry} ${role} → ${skills.slice(0, 3).join(' | ')}`,
]

// ── About templates ──────────────────────────────────
const ABOUT_TEMPLATES: Record<string, (name: string, role: string, skills: string[], summary: string) => string> = {
    professional: (name, role, skills, summary) =>
        `I'm ${name}, a ${role} with deep expertise in ${skills.slice(0, 3).join(', ')}.\n\n${summary}\n\nI'm passionate about delivering measurable results and collaborating with cross-functional teams to drive impact. My toolkit includes ${skills.join(', ')}.\n\nLet's connect — I'm always open to conversations about ${skills[0]} and ${skills[1] || 'innovation'}.`,
    storytelling: (name, role, skills, summary) =>
        `It started with a simple question: how can we do this better?\n\nThat curiosity has shaped my career as a ${role}. ${summary}\n\nAlong the way, I've built fluency in ${skills.slice(0, 4).join(', ')}, and learned that the best solutions come from listening first.\n\nIf you're working on something interesting — let's talk. Reach out anytime.`,
    results: (name, role, skills, summary) =>
        `${role} focused on outcomes, not outputs.\n\n${summary}\n\nCore competencies: ${skills.join(' · ')}\n\nI measure success by impact — user growth, revenue, efficiency, team velocity. If that resonates, let's connect.`
}

// ── Experience rewrite ──────────────────────────────
function rewriteExperienceForLinkedIn(title: string, company: string, bullets: string): string {
    const lines = bullets.split('\n').filter(l => l.trim())
    const intro = `As ${title} at ${company}, I focused on driving meaningful outcomes across the organization.`
    const body = lines.map(l => {
        const clean = l.replace(/^[•\-–]\s*/, '').trim()
        // Convert third-person bullets to first-person narrative
        return clean
            .replace(/^Led /, 'I led ')
            .replace(/^Managed /, 'I managed ')
            .replace(/^Built /, 'I built ')
            .replace(/^Developed /, 'I developed ')
            .replace(/^Designed /, 'I designed ')
            .replace(/^Implemented /, 'I implemented ')
            .replace(/^Increased /, 'I increased ')
            .replace(/^Reduced /, 'I reduced ')
            .replace(/^Created /, 'I created ')
            .replace(/^Launched /, 'I launched ')
            .replace(/^Drove /, 'I drove ')
            .replace(/^Spearheaded /, 'I spearheaded ')
            .replace(/^Collaborated /, 'I collaborated ')
            .replace(/^Optimized /, 'I optimized ')
    }).join('. ') + '.'
    return `${intro}\n\n${body}`
}

export default function LinkedInToolkitPage() {
    const { user, profile, fetchProfile } = useStore()
    const effectivePlan = getEffectivePlan(profile)
    const isPremium = effectivePlan === 'premium' || effectivePlan === 'career_plus'

    // Sync plan from Stripe on mount
    useEffect(() => {
        if (user && !isPremium) {
            verifySubscription()
                .then(() => fetchProfile(user.id))
                .catch(() => { })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id])

    // ── Headline state
    const [hlRole, setHlRole] = useState('')
    const [hlSkills, setHlSkills] = useState('')
    const [hlIndustry, setHlIndustry] = useState('')
    const [headlines, setHeadlines] = useState<string[]>([])

    // ── About state
    const [aboutName, setAboutName] = useState('')
    const [aboutRole, setAboutRole] = useState('')
    const [aboutSkills, setAboutSkills] = useState('')
    const [aboutSummary, setAboutSummary] = useState('')
    const [aboutTone, setAboutTone] = useState<'professional' | 'storytelling' | 'results'>('professional')
    const [aboutResult, setAboutResult] = useState('')

    // ── Experience rewrite state
    const [expTitle, setExpTitle] = useState('')
    const [expCompany, setExpCompany] = useState('')
    const [expBullets, setExpBullets] = useState('')
    const [expResult, setExpResult] = useState('')

    // ── Copied state
    const [copied, setCopied] = useState<string | null>(null)

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const generateHeadlines = () => {
        const skills = hlSkills.split(',').map(s => s.trim()).filter(Boolean)
        setHeadlines(HEADLINE_TEMPLATES.map(fn => fn(hlRole, skills, hlIndustry)))
    }

    const generateAbout = () => {
        const skills = aboutSkills.split(',').map(s => s.trim()).filter(Boolean)
        setAboutResult(ABOUT_TEMPLATES[aboutTone](aboutName, aboutRole, skills, aboutSummary))
    }

    const generateExpRewrite = () => {
        setExpResult(rewriteExperienceForLinkedIn(expTitle, expCompany, expBullets))
    }

    // ── Premium gate
    if (!isPremium) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="max-w-[560px] mx-auto px-10 py-20 text-center">
                    <div className="flex justify-center mb-5 text-gold"><LandingIcon name="link" size={48} /></div>
                    <h1>LinkedIn Toolkit</h1>
                    <p className="text-base text-ink-40 mb-10 leading-relaxed">Generate optimized LinkedIn headlines, about sections, and experience rewrites from your resume data.</p>
                    <div className="flex flex-col gap-4 text-left mb-10">
                        {[{ icon: 'lightbulb', title: 'Headline Generator', desc: '5 headline variations optimized for recruiter search' }, { icon: 'edit', title: 'About Section Writer', desc: '3 tone options: Professional, Storytelling, Results-driven' }, { icon: 'refresh', title: 'Experience Rewrite', desc: 'Transform resume bullets into LinkedIn-ready narratives' }].map((f, i) => (
                            <div key={i} className="flex gap-4 items-start p-5 bg-[var(--white)] border border-ink-10 rounded-xl">
                                <span className="shrink-0 mt-0.5 text-gold"><LandingIcon name={f.icon} size={22} /></span>
                                <div><strong className="text-[15px] block mb-1">{f.title}</strong><p className="text-[13px] text-ink-40 m-0 leading-relaxed">{f.desc}</p></div>
                            </div>
                        ))}
                    </div>
                    <Link href="/pricing" className="btn btn-gold btn-lg">Upgrade to Premium →</Link>
                    <p className="text-xs text-ink-20 mt-3.5 font-mono">Available on the Premium plan</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="max-w-[800px] mx-auto px-5 sm:px-10 pt-10 pb-20">
                <div className="text-center mb-12">
                    <div className="mb-4"><span className="badge badge-gold">Premium</span></div>
                    <h1>LinkedIn <em className="italic text-gold">Toolkit</em></h1>
                    <p className="text-base text-ink-40">Turn your resume into a LinkedIn profile that gets noticed.</p>
                </div>

                {/* ── HEADLINE GENERATOR ──────────────────────── */}
                <section className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden mb-6">
                    <div className="flex items-start gap-4 px-7 py-6 bg-ink-05 border-b border-ink-10">
                        <span className="shrink-0 mt-0.5 text-gold"><LandingIcon name="lightbulb" size={26} /></span>
                        <div><h2 className="text-xl mb-1">Headline Generator</h2><p className="text-[13px] text-ink-40 m-0">Generate 5 recruiter-optimized headline variations.</p></div>
                    </div>
                    <div className="p-7">
                        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-5">
                            <div><label className="block text-xs font-semibold font-mono uppercase tracking-wide text-ink-40 mb-1.5">Your Role / Title</label><input type="text" className="w-full px-3.5 py-2.5 text-sm border border-ink-10 rounded-lg bg-[var(--white)] text-ink transition-colors focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,146,60,0.1)]" placeholder="e.g. Senior Product Manager" value={hlRole} onChange={e => setHlRole(e.target.value)} /></div>
                            <div><label className="block text-xs font-semibold font-mono uppercase tracking-wide text-ink-40 mb-1.5">Industry</label><input type="text" className="w-full px-3.5 py-2.5 text-sm border border-ink-10 rounded-lg bg-[var(--white)] text-ink transition-colors focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,146,60,0.1)]" placeholder="e.g. FinTech, Healthcare, SaaS" value={hlIndustry} onChange={e => setHlIndustry(e.target.value)} /></div>
                            <div className="col-span-full"><label className="block text-xs font-semibold font-mono uppercase tracking-wide text-ink-40 mb-1.5">Top Skills (comma-separated)</label><input type="text" className="w-full px-3.5 py-2.5 text-sm border border-ink-10 rounded-lg bg-[var(--white)] text-ink transition-colors focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,146,60,0.1)]" placeholder="e.g. Product Strategy, Data Analysis, Agile, SQL" value={hlSkills} onChange={e => setHlSkills(e.target.value)} /></div>
                        </div>
                        <button className="btn btn-gold" onClick={generateHeadlines} disabled={!hlRole || !hlSkills || !hlIndustry}>Generate Headlines</button>
                        {headlines.length > 0 && (
                            <div className="mt-6 flex flex-col gap-2.5">
                                {headlines.map((hl, i) => (
                                    <div key={i} className="flex items-center justify-between gap-4 px-5 py-4 bg-ink-05 border border-ink-10 rounded-xl transition-colors hover:border-gold-pale">
                                        <div className="text-sm text-ink leading-relaxed flex-1">{hl}</div>
                                        <button className="shrink-0 px-4 py-1.5 text-xs font-semibold font-mono border border-ink-10 rounded-lg bg-[var(--white)] text-ink-70 cursor-pointer transition-all hover:border-gold hover:text-gold whitespace-nowrap" onClick={() => copyToClipboard(hl, `hl-${i}`)}>{copied === `hl-${i}` ? '✓ Copied' : 'Copy'}</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ── ABOUT SECTION GENERATOR ─────────────────── */}
                <section className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden mb-6">
                    <div className="flex items-start gap-4 px-7 py-6 bg-ink-05 border-b border-ink-10">
                        <span className="shrink-0 mt-0.5 text-gold"><LandingIcon name="edit" size={26} /></span>
                        <div><h2 className="text-xl mb-1">About Section Generator</h2><p className="text-[13px] text-ink-40 m-0">Create a compelling LinkedIn summary in your preferred tone.</p></div>
                    </div>
                    <div className="p-7">
                        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-5">
                            <div><label className="block text-xs font-semibold font-mono uppercase tracking-wide text-ink-40 mb-1.5">Your Name</label><input type="text" className="w-full px-3.5 py-2.5 text-sm border border-ink-10 rounded-lg bg-[var(--white)] text-ink transition-colors focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,146,60,0.1)]" placeholder="e.g. Elena Vasquez" value={aboutName} onChange={e => setAboutName(e.target.value)} /></div>
                            <div><label className="block text-xs font-semibold font-mono uppercase tracking-wide text-ink-40 mb-1.5">Your Role</label><input type="text" className="w-full px-3.5 py-2.5 text-sm border border-ink-10 rounded-lg bg-[var(--white)] text-ink transition-colors focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,146,60,0.1)]" placeholder="e.g. UX Designer" value={aboutRole} onChange={e => setAboutRole(e.target.value)} /></div>
                            <div className="col-span-full"><label className="block text-xs font-semibold font-mono uppercase tracking-wide text-ink-40 mb-1.5">Key Skills (comma-separated)</label><input type="text" className="w-full px-3.5 py-2.5 text-sm border border-ink-10 rounded-lg bg-[var(--white)] text-ink transition-colors focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,146,60,0.1)]" placeholder="e.g. User Research, Figma, Prototyping" value={aboutSkills} onChange={e => setAboutSkills(e.target.value)} /></div>
                            <div className="col-span-full"><label className="block text-xs font-semibold font-mono uppercase tracking-wide text-ink-40 mb-1.5">Current Resume Summary</label><textarea className="w-full px-3.5 py-2.5 text-sm border border-ink-10 rounded-lg bg-[var(--white)] text-ink transition-colors focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,146,60,0.1)] resize-y" placeholder="Paste your resume summary here..." rows={3} value={aboutSummary} onChange={e => setAboutSummary(e.target.value)} /></div>
                        </div>
                        <div className="flex items-center gap-2 mb-5 flex-wrap">
                            <label className="text-xs font-semibold font-mono uppercase tracking-wide text-ink-40 mr-1">Tone:</label>
                            {(['professional', 'storytelling', 'results'] as const).map(tone => (
                                <button key={tone} className={`px-4 py-1.5 text-[13px] border rounded-full cursor-pointer transition-all ${aboutTone === tone ? 'border-gold bg-[rgba(201,146,60,0.08)] text-gold font-semibold' : 'border-ink-10 bg-[var(--white)] text-ink-70 hover:border-gold-pale'}`} onClick={() => setAboutTone(tone)}>{tone === 'professional' ? 'Professional' : tone === 'storytelling' ? 'Storytelling' : 'Results-Driven'}</button>
                            ))}
                        </div>
                        <button className="btn btn-gold" onClick={generateAbout} disabled={!aboutName || !aboutRole || !aboutSkills || !aboutSummary}>Generate About Section</button>
                        {aboutResult && (
                            <div className="mt-6 flex flex-col gap-2.5">
                                <div className="flex flex-col items-stretch gap-4 px-5 py-4 bg-ink-05 border border-ink-10 rounded-xl">
                                    <div className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{aboutResult}</div>
                                    <button className="self-end shrink-0 px-4 py-1.5 text-xs font-semibold font-mono border border-ink-10 rounded-lg bg-[var(--white)] text-ink-70 cursor-pointer transition-all hover:border-gold hover:text-gold" onClick={() => copyToClipboard(aboutResult, 'about')}>{copied === 'about' ? '✓ Copied' : 'Copy to Clipboard'}</button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── EXPERIENCE REWRITE ──────────────────────── */}
                <section className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden mb-6">
                    <div className="flex items-start gap-4 px-7 py-6 bg-ink-05 border-b border-ink-10">
                        <span className="shrink-0 mt-0.5 text-gold"><LandingIcon name="refresh" size={26} /></span>
                        <div><h2 className="text-xl mb-1">Experience → LinkedIn Rewrite</h2><p className="text-[13px] text-ink-40 m-0">Convert resume bullet points into LinkedIn-style narratives.</p></div>
                    </div>
                    <div className="p-7">
                        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-5">
                            <div><label className="block text-xs font-semibold font-mono uppercase tracking-wide text-ink-40 mb-1.5">Job Title</label><input type="text" className="w-full px-3.5 py-2.5 text-sm border border-ink-10 rounded-lg bg-[var(--white)] text-ink transition-colors focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,146,60,0.1)]" placeholder="e.g. Senior Software Engineer" value={expTitle} onChange={e => setExpTitle(e.target.value)} /></div>
                            <div><label className="block text-xs font-semibold font-mono uppercase tracking-wide text-ink-40 mb-1.5">Company</label><input type="text" className="w-full px-3.5 py-2.5 text-sm border border-ink-10 rounded-lg bg-[var(--white)] text-ink transition-colors focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,146,60,0.1)]" placeholder="e.g. Google" value={expCompany} onChange={e => setExpCompany(e.target.value)} /></div>
                            <div className="col-span-full"><label className="block text-xs font-semibold font-mono uppercase tracking-wide text-ink-40 mb-1.5">Resume Bullet Points (one per line)</label><textarea className="w-full px-3.5 py-2.5 text-sm border border-ink-10 rounded-lg bg-[var(--white)] text-ink transition-colors focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,146,60,0.1)] resize-y" placeholder={"• Led migration of monolith to microservices\n• Reduced API latency by 40%\n• Mentored 5 junior engineers"} rows={5} value={expBullets} onChange={e => setExpBullets(e.target.value)} /></div>
                        </div>
                        <button className="btn btn-gold" onClick={generateExpRewrite} disabled={!expTitle || !expCompany || !expBullets}>Rewrite for LinkedIn</button>
                        {expResult && (
                            <div className="mt-6 flex flex-col gap-2.5">
                                <div className="flex flex-col items-stretch gap-4 px-5 py-4 bg-ink-05 border border-ink-10 rounded-xl">
                                    <div className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{expResult}</div>
                                    <button className="self-end shrink-0 px-4 py-1.5 text-xs font-semibold font-mono border border-ink-10 rounded-lg bg-[var(--white)] text-ink-70 cursor-pointer transition-all hover:border-gold hover:text-gold" onClick={() => copyToClipboard(expResult, 'exp')}>{copied === 'exp' ? '✓ Copied' : 'Copy to Clipboard'}</button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
