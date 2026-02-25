import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStore } from '../lib/store'
import { verifySubscription } from '../lib/stripe'
import styles from './LinkedInToolkitPage.module.css'

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
    const isPremium = profile?.plan === 'premium' || profile?.plan === 'career_plus'

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
            <div className={styles.page}>
                <Navbar />
                <div className={styles.gate}>
                    <div className={styles.gateIcon}>🔗</div>
                    <h1>LinkedIn Toolkit</h1>
                    <p>Generate optimized LinkedIn headlines, about sections, and experience rewrites from your resume data.</p>
                    <div className={styles.gateFeatures}>
                        <div className={styles.gateFeature}>
                            <span className={styles.gateFeatureIcon}>💡</span>
                            <div>
                                <strong>Headline Generator</strong>
                                <p>5 headline variations optimized for recruiter search</p>
                            </div>
                        </div>
                        <div className={styles.gateFeature}>
                            <span className={styles.gateFeatureIcon}>📝</span>
                            <div>
                                <strong>About Section Writer</strong>
                                <p>3 tone options: Professional, Storytelling, Results-driven</p>
                            </div>
                        </div>
                        <div className={styles.gateFeature}>
                            <span className={styles.gateFeatureIcon}>🔄</span>
                            <div>
                                <strong>Experience Rewrite</strong>
                                <p>Transform resume bullets into LinkedIn-ready narratives</p>
                            </div>
                        </div>
                    </div>
                    <Link to="/pricing" className="btn btn-gold btn-lg">Upgrade to Premium →</Link>
                    <p className={styles.gateCaveat}>Available on the Premium plan</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerBadge}><span className="badge badge-gold">Premium</span></div>
                    <h1>LinkedIn <em>Toolkit</em></h1>
                    <p>Turn your resume into a LinkedIn profile that gets noticed.</p>
                </div>

                {/* ── HEADLINE GENERATOR ──────────────────────── */}
                <section className={styles.tool}>
                    <div className={styles.toolHeader}>
                        <span className={styles.toolIcon}>💡</span>
                        <div>
                            <h2>Headline Generator</h2>
                            <p>Generate 5 recruiter-optimized headline variations.</p>
                        </div>
                    </div>
                    <div className={styles.toolBody}>
                        <div className={styles.inputGrid}>
                            <div className={styles.inputGroup}>
                                <label>Your Role / Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Senior Product Manager"
                                    value={hlRole}
                                    onChange={e => setHlRole(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Industry</label>
                                <input
                                    type="text"
                                    placeholder="e.g. FinTech, Healthcare, SaaS"
                                    value={hlIndustry}
                                    onChange={e => setHlIndustry(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                                <label>Top Skills (comma-separated)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Product Strategy, Data Analysis, Agile, SQL"
                                    value={hlSkills}
                                    onChange={e => setHlSkills(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            className="btn btn-gold"
                            onClick={generateHeadlines}
                            disabled={!hlRole || !hlSkills || !hlIndustry}
                        >
                            Generate Headlines
                        </button>

                        {headlines.length > 0 && (
                            <div className={styles.results}>
                                {headlines.map((hl, i) => (
                                    <div key={i} className={styles.resultCard}>
                                        <div className={styles.resultText}>{hl}</div>
                                        <button
                                            className={styles.copyBtn}
                                            onClick={() => copyToClipboard(hl, `hl-${i}`)}
                                        >
                                            {copied === `hl-${i}` ? '✓ Copied' : 'Copy'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ── ABOUT SECTION GENERATOR ─────────────────── */}
                <section className={styles.tool}>
                    <div className={styles.toolHeader}>
                        <span className={styles.toolIcon}>📝</span>
                        <div>
                            <h2>About Section Generator</h2>
                            <p>Create a compelling LinkedIn summary in your preferred tone.</p>
                        </div>
                    </div>
                    <div className={styles.toolBody}>
                        <div className={styles.inputGrid}>
                            <div className={styles.inputGroup}>
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Elena Vasquez"
                                    value={aboutName}
                                    onChange={e => setAboutName(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Your Role</label>
                                <input
                                    type="text"
                                    placeholder="e.g. UX Designer"
                                    value={aboutRole}
                                    onChange={e => setAboutRole(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                                <label>Key Skills (comma-separated)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. User Research, Figma, Prototyping, Design Systems"
                                    value={aboutSkills}
                                    onChange={e => setAboutSkills(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                                <label>Current Resume Summary</label>
                                <textarea
                                    placeholder="Paste your resume summary here..."
                                    rows={3}
                                    value={aboutSummary}
                                    onChange={e => setAboutSummary(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={styles.toneSelector}>
                            <label>Tone:</label>
                            {(['professional', 'storytelling', 'results'] as const).map(tone => (
                                <button
                                    key={tone}
                                    className={`${styles.toneBtn} ${aboutTone === tone ? styles.toneBtnActive : ''}`}
                                    onClick={() => setAboutTone(tone)}
                                >
                                    {tone === 'professional' ? '🏢 Professional' : tone === 'storytelling' ? '📖 Storytelling' : '🎯 Results-Driven'}
                                </button>
                            ))}
                        </div>
                        <button
                            className="btn btn-gold"
                            onClick={generateAbout}
                            disabled={!aboutName || !aboutRole || !aboutSkills || !aboutSummary}
                        >
                            Generate About Section
                        </button>

                        {aboutResult && (
                            <div className={styles.results}>
                                <div className={styles.resultCard} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                    <div className={styles.resultText} style={{ whiteSpace: 'pre-wrap' }}>{aboutResult}</div>
                                    <button
                                        className={styles.copyBtn}
                                        style={{ alignSelf: 'flex-end', marginTop: 12 }}
                                        onClick={() => copyToClipboard(aboutResult, 'about')}
                                    >
                                        {copied === 'about' ? '✓ Copied' : 'Copy to Clipboard'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── EXPERIENCE REWRITE ──────────────────────── */}
                <section className={styles.tool}>
                    <div className={styles.toolHeader}>
                        <span className={styles.toolIcon}>🔄</span>
                        <div>
                            <h2>Experience → LinkedIn Rewrite</h2>
                            <p>Convert resume bullet points into LinkedIn-style narratives.</p>
                        </div>
                    </div>
                    <div className={styles.toolBody}>
                        <div className={styles.inputGrid}>
                            <div className={styles.inputGroup}>
                                <label>Job Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Senior Software Engineer"
                                    value={expTitle}
                                    onChange={e => setExpTitle(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Company</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Google"
                                    value={expCompany}
                                    onChange={e => setExpCompany(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                                <label>Resume Bullet Points (one per line)</label>
                                <textarea
                                    placeholder={"• Led migration of monolith to microservices\n• Reduced API latency by 40%\n• Mentored 5 junior engineers"}
                                    rows={5}
                                    value={expBullets}
                                    onChange={e => setExpBullets(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            className="btn btn-gold"
                            onClick={generateExpRewrite}
                            disabled={!expTitle || !expCompany || !expBullets}
                        >
                            Rewrite for LinkedIn
                        </button>

                        {expResult && (
                            <div className={styles.results}>
                                <div className={styles.resultCard} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                    <div className={styles.resultText} style={{ whiteSpace: 'pre-wrap' }}>{expResult}</div>
                                    <button
                                        className={styles.copyBtn}
                                        style={{ alignSelf: 'flex-end', marginTop: 12 }}
                                        onClick={() => copyToClipboard(expResult, 'exp')}
                                    >
                                        {copied === 'exp' ? '✓ Copied' : 'Copy to Clipboard'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
