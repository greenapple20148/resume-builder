import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStore } from '../lib/store'
import { useSEO } from '../lib/useSEO'
import { LandingIcon } from '../components/LandingIcons'

// ── Helper: extract text from resume ────────────────
function getResumeText(resume: any): string {
    if (!resume?.data) return ''
    const d = resume.data
    const parts: string[] = []
    if (d.personal?.fullName) parts.push(d.personal.fullName)
    if (d.personal?.jobTitle) parts.push(d.personal.jobTitle)
    if (d.summary) parts.push(d.summary)
    if (d.experience?.length) {
        d.experience.forEach((e: any) => {
            parts.push(`${e.title || ''} ${e.company || ''} ${e.description || ''}`)
        })
    }
    if (d.education?.length) {
        d.education.forEach((e: any) => {
            parts.push(`${e.degree || ''} ${e.school || ''}`)
        })
    }
    if (d.skills?.length) parts.push(d.skills.join(', '))
    if (d.certifications?.length) {
        d.certifications.forEach((c: any) => parts.push(c.name || ''))
    }
    if (d.projects?.length) {
        d.projects.forEach((p: any) => parts.push(`${p.name || ''} ${p.description || ''}`))
    }
    return parts.join(' ').toLowerCase()
}

// ── STAR Detection Logic ────────────────────────────
const STAR_KEYWORDS = {
    situation: ['when', 'while', 'during', 'at my', 'in my role', 'our team', 'we were', 'the company', 'faced with', 'challenge', 'problem', 'issue', 'scenario', 'context', 'background'],
    task: ['responsible for', 'my role was', 'i needed to', 'i was asked', 'tasked with', 'goal was', 'objective', 'assigned', 'had to', 'needed to', 'my job was', 'i was supposed to', 'requirement'],
    action: ['i decided', 'i implemented', 'i created', 'i built', 'i led', 'i developed', 'i designed', 'i organized', 'i initiated', 'i proposed', 'i collaborated', 'i analyzed', 'i conducted', 'i established', 'steps i took', 'my approach'],
    result: ['resulted in', 'achieved', 'increased', 'decreased', 'reduced', 'improved', 'saved', 'grew', 'generated', 'delivered', 'outcome', 'impact', 'as a result', 'consequently', 'led to', '%', 'revenue', 'efficiency'],
}

function analyzeSTAR(text: string): { scores: Record<string, number>; overall: number; feedback: string[]; detected: boolean } {
    const lower = text.toLowerCase()
    const scores: Record<string, number> = {}
    const feedback: string[] = []
    let total = 0

    for (const [component, keywords] of Object.entries(STAR_KEYWORDS)) {
        const found = keywords.filter(k => lower.includes(k))
        const score = Math.min(100, Math.round((found.length / 3) * 100))
        scores[component] = score
        total += score
        if (score < 40) feedback.push(`[!] Weak ${component.charAt(0).toUpperCase() + component.slice(1)}: Try adding context about ${component === 'situation' ? 'the background and challenge' : component === 'task' ? 'your specific responsibility' : component === 'action' ? 'the concrete steps you took' : 'measurable outcomes and impact'}.`)
    }

    const overall = Math.round(total / 4)
    const detected = overall > 40

    if (overall > 75) feedback.unshift('Strong STAR format detected! Your answer clearly follows the Situation-Task-Action-Result framework.')
    else if (overall > 50) feedback.unshift('Partial STAR format detected. Strengthen the weaker components for a more compelling answer.')
    else feedback.unshift('STAR format is weak or absent. Restructure your answer using the Situation → Task → Action → Result framework.')

    return { scores, overall, feedback, detected }
}

// ── Confidence & Clarity Logic ──────────────────────
const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'sort of', 'kind of', 'basically', 'actually', 'literally', 'honestly', 'just', 'really', 'very', 'pretty much', 'i guess', 'i think maybe', 'i suppose']
const HEDGE_PHRASES = ['i think', 'i believe', 'i feel like', 'maybe', 'perhaps', 'possibly', 'might be', 'could be', 'not sure but', 'i\'m not certain', 'probably', 'somewhat', 'in a way', 'to some extent']
const POWER_WORDS = ['achieved', 'delivered', 'led', 'drove', 'spearheaded', 'increased', 'reduced', 'built', 'launched', 'optimized', 'transformed', 'implemented', 'generated', 'exceeded', 'accelerated', 'pioneered']

function analyzeConfidence(text: string): { confidenceScore: number; clarityScore: number; fillerCount: number; hedgeCount: number; powerCount: number; sentenceCount: number; avgSentenceLength: number; feedback: string[] } {
    const lower = text.toLowerCase()
    const words = text.split(/\s+/).filter(Boolean)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)

    const fillerCount = FILLER_WORDS.reduce((count, filler) => {
        const regex = new RegExp(`\\b${filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
        return count + (text.match(regex) || []).length
    }, 0)

    const hedgeCount = HEDGE_PHRASES.reduce((count, hedge) => {
        const regex = new RegExp(`\\b${hedge.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
        return count + (text.match(regex) || []).length
    }, 0)

    const powerCount = POWER_WORDS.reduce((count, word) => {
        const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi')
        return count + (text.match(regex) || []).length
    }, 0)

    const avgSentenceLength = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0

    // Confidence: penalize fillers and hedging, reward power words
    const fillerPenalty = Math.min(50, fillerCount * 8)
    const hedgePenalty = Math.min(40, hedgeCount * 7)
    const powerBonus = Math.min(25, powerCount * 5)
    const confidenceScore = Math.max(0, Math.min(100, 75 - fillerPenalty - hedgePenalty + powerBonus))

    // Clarity: based on sentence length, structure
    const lengthPenalty = avgSentenceLength > 25 ? (avgSentenceLength - 25) * 2 : 0
    const tooShort = avgSentenceLength < 8 && sentences.length > 1 ? 15 : 0
    const clarityScore = Math.max(0, Math.min(100, 85 - lengthPenalty - tooShort + (powerCount > 0 ? 10 : 0)))

    const feedback: string[] = []
    if (fillerCount > 0) feedback.push(`Found ${fillerCount} filler word${fillerCount > 1 ? 's' : ''} — remove these for a more authoritative tone.`)
    if (hedgeCount > 0) feedback.push(`Found ${hedgeCount} hedging phrase${hedgeCount > 1 ? 's' : ''} — replace "I think" with definitive statements.`)
    if (powerCount > 0) feedback.push(`Great! Used ${powerCount} power word${powerCount > 1 ? 's' : ''} that convey impact.`)
    if (avgSentenceLength > 25) feedback.push(`Average sentence length is ${avgSentenceLength} words — aim for 15-20 for clarity.`)
    if (confidenceScore > 70) feedback.push('Your tone sounds confident and assertive.')
    else if (confidenceScore > 45) feedback.push('Your confidence level is moderate — try being more direct and specific.')
    else feedback.push('Your answer sounds uncertain. Remove filler words and state your achievements directly.')

    return { confidenceScore, clarityScore, fillerCount, hedgeCount, powerCount, sentenceCount: sentences.length, avgSentenceLength, feedback }
}

// ── Follow-Up Question Logic ────────────────────────
const QUESTION_PATTERNS: { pattern: RegExp; followUps: string[] }[] = [
    { pattern: /team|led|manag|collaborat/i, followUps: ['How did you handle disagreements within the team?', 'What was the team size and how did you delegate?', 'How did you measure team performance?', 'Tell me about a team member who underperformed — how did you handle it?'] },
    { pattern: /increas|grew|improv|optim/i, followUps: ['What specific metrics did you track?', 'How did you measure that improvement?', 'What was the timeline for achieving those results?', 'Were there any trade-offs to achieve that growth?'] },
    { pattern: /design|architect|built|creat/i, followUps: ['What architectural decisions did you make and why?', 'How would you scale this solution?', 'What would you do differently if you started over?', 'How did you handle edge cases?'] },
    { pattern: /challenge|problem|difficult|obstacle/i, followUps: ['What resources did you have available?', 'How did you prioritize when facing this challenge?', 'What was your backup plan?', 'How did this experience change your approach going forward?'] },
    { pattern: /data|analy|metric|measure/i, followUps: ['How did you ensure data quality?', 'What tools did you use for analysis?', 'How did you present findings to stakeholders?', 'What surprised you in the data?'] },
    { pattern: /customer|user|client|stakeholder/i, followUps: ['How did you gather customer feedback?', 'How did you prioritize competing stakeholder needs?', 'Tell me about a time a customer was unhappy — what did you do?', 'How do you balance user needs with business goals?'] },
    { pattern: /budget|cost|sav|revenue|profit/i, followUps: ['How did you justify the investment?', 'What was the ROI?', 'How did you handle budget constraints?', 'What trade-offs did you make for cost efficiency?'] },
]

function generateFollowUps(text: string): string[] {
    const results: string[] = []
    for (const { pattern, followUps } of QUESTION_PATTERNS) {
        if (pattern.test(text)) {
            results.push(...followUps.slice(0, 2))
        }
    }
    // Always add generic follow-ups
    if (results.length < 3) {
        results.push('Can you walk me through that in more detail?', 'What would you do differently next time?', 'How did this impact your career growth?')
    }
    return [...new Set(results)].slice(0, 6)
}

// ── Resume Weakness Logic ───────────────────────────
const WEAK_VERBS = ['helped', 'assisted', 'worked on', 'was responsible for', 'participated in', 'handled', 'dealt with', 'did', 'made', 'got', 'used', 'tried']
const STRONG_VERBS = ['led', 'spearheaded', 'engineered', 'architected', 'delivered', 'launched', 'drove', 'optimized', 'transformed', 'accelerated']

function analyzeResumeWeaknesses(resume: any): { score: number; issues: { type: string; severity: 'high' | 'medium' | 'low'; message: string; fix: string }[] } {
    const issues: { type: string; severity: 'high' | 'medium' | 'low'; message: string; fix: string }[] = []
    const d = resume?.data || {}

    // Check personal info completeness
    const p = d.personal || {}
    if (!p.fullName) issues.push({ type: 'personal', severity: 'high', message: 'Missing full name', fix: 'Add your full professional name' })
    if (!p.email) issues.push({ type: 'personal', severity: 'high', message: 'Missing email address', fix: 'Add a professional email address' })
    if (!p.phone) issues.push({ type: 'personal', severity: 'medium', message: 'Missing phone number', fix: 'Add a phone number for recruiter contact' })
    if (!p.location) issues.push({ type: 'personal', severity: 'low', message: 'Missing location', fix: 'Add your city/state (remote-friendly roles still benefit from this)' })

    // Check summary
    if (!d.summary || d.summary.length < 50) {
        issues.push({ type: 'summary', severity: 'high', message: 'Summary is too short or missing', fix: 'Write a 2-3 sentence professional summary highlighting your key value proposition and years of experience' })
    } else if (d.summary.length > 500) {
        issues.push({ type: 'summary', severity: 'medium', message: 'Summary is too long', fix: 'Keep your summary concise (2-3 sentences, under 300 characters)' })
    }

    // Check experience
    const exp = d.experience || []
    if (exp.length === 0) {
        issues.push({ type: 'experience', severity: 'high', message: 'No experience entries', fix: 'Add at least 2-3 relevant work experiences' })
    } else {
        exp.forEach((e: any, i: number) => {
            const desc = (e.description || '').toLowerCase()
            if (!desc || desc.length < 30) {
                issues.push({ type: 'experience', severity: 'high', message: `"${e.title || `Position ${i + 1}`}" has no description`, fix: 'Add 3-5 bullet points describing your achievements' })
            } else {
                // Check for metrics
                if (!/\d+%|\$[\d,]+|\d+x|\d+ /.test(desc)) {
                    issues.push({ type: 'metrics', severity: 'high', message: `"${e.title || `Position ${i + 1}`}" lacks quantified metrics`, fix: 'Add numbers: revenue generated, % improvement, team size, users impacted, etc.' })
                }
                // Check for weak verbs
                const weakFound = WEAK_VERBS.filter(v => desc.includes(v))
                if (weakFound.length > 0) {
                    issues.push({ type: 'verbs', severity: 'medium', message: `"${e.title || `Position ${i + 1}`}" uses weak verbs: ${weakFound.join(', ')}`, fix: `Replace with stronger verbs: ${STRONG_VERBS.slice(0, 4).join(', ')}` })
                }
            }
            // Check for date gaps
            if (!e.startDate) {
                issues.push({ type: 'dates', severity: 'medium', message: `"${e.title || `Position ${i + 1}`}" missing start date`, fix: 'Add employment dates — gaps are more suspicious than short tenures' })
            }
        })
    }

    // Check skills
    if (!d.skills || d.skills.length === 0) {
        issues.push({ type: 'skills', severity: 'high', message: 'No skills listed', fix: 'Add 8-15 relevant skills — mix technical and soft skills' })
    } else if (d.skills.length < 5) {
        issues.push({ type: 'skills', severity: 'medium', message: `Only ${d.skills.length} skills listed`, fix: 'Add more skills to improve keyword matching (aim for 8-15)' })
    }

    // Check education
    if (!d.education || d.education.length === 0) {
        issues.push({ type: 'education', severity: 'low', message: 'No education listed', fix: 'Add your highest degree — even for experienced professionals' })
    }

    // Score
    const highCount = issues.filter(i => i.severity === 'high').length
    const medCount = issues.filter(i => i.severity === 'medium').length
    const lowCount = issues.filter(i => i.severity === 'low').length
    const score = Math.max(0, Math.min(100, 100 - highCount * 15 - medCount * 8 - lowCount * 3))

    return { score, issues }
}

// ── LinkedIn Auto-Convert Logic ─────────────────────
function convertToLinkedIn(resume: any): { headline: string; about: string; experience: string[] } {
    const d = resume?.data || {}
    const p = d.personal || {}
    const skills = d.skills || []

    // Headline
    const headline = p.jobTitle
        ? `${p.jobTitle}${skills.length > 0 ? ` | ${skills.slice(0, 3).join(' · ')}` : ''}`
        : 'Professional seeking new opportunities'

    // About
    const aboutParts: string[] = []
    if (d.summary) {
        aboutParts.push(d.summary)
    }
    if (d.experience?.length > 0) {
        const years = d.experience.length * 2 // rough estimate
        aboutParts.push(`\n\nWith ${years}+ years of professional experience, I bring expertise in ${skills.slice(0, 5).join(', ')}.`)
    }
    if (skills.length > 0) {
        aboutParts.push(`\n\nCore Skills: ${skills.join(' | ')}`)
    }
    aboutParts.push('\n\nOpen to connecting — feel free to reach out!')
    const about = aboutParts.join('')

    // Experience
    const experience = (d.experience || []).map((e: any) => {
        const lines = [`**${e.title || 'Position'}** at **${e.company || 'Company'}**`]
        if (e.startDate) lines.push(`${e.startDate} — ${e.current ? 'Present' : e.endDate || 'Present'}`)
        if (e.description) {
            const bullets = e.description.split('\n').filter((l: string) => l.trim())
            lines.push(...bullets.map((b: string) => `• ${b.replace(/^[•\-–—]\s*/, '')}`))
        }
        return lines.join('\n')
    })

    return { headline, about, experience }
}

// ── Missing Keyword Logic ───────────────────────────
function findMissingKeywords(resumeText: string, jobDescription: string): { found: string[]; missing: string[]; matchScore: number } {
    // Extract meaningful keywords from JD (2+ word phrases and single technical terms)
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'this', 'that', 'these', 'those', 'i', 'you', 'we', 'they', 'he', 'she', 'it', 'who', 'what', 'which', 'where', 'when', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'about', 'above', 'after', 'again', 'also', 'any', 'as', 'because', 'before', 'between', 'during', 'into', 'its', 'our', 'over', 'their', 'through', 'under', 'up', 'your', 'able', 'work', 'working', 'experience', 'role', 'position', 'company', 'team', 'including', 'strong', 'excellent', 'good', 'great', 'well', 'new', 'years', 'year', 'preferred', 'required', 'requirements', 'qualifications', 'responsibilities', 'looking', 'join', 'us', 'ideal', 'candidate', 'opportunity', 'plus'])

    const jdLower = jobDescription.toLowerCase()
    const resumeLower = resumeText.toLowerCase()

    // Extract keywords: filter common words, keep technical/meaningful ones
    const jdWords = jdLower.match(/\b[a-z][\w+#.-]*\b/g) || []
    const keywords = [...new Set(jdWords.filter(w => w.length > 2 && !stopWords.has(w)))]

    // Also extract 2-word phrases
    const jdPhrases: string[] = []
    const jdWordList = jdLower.split(/\s+/)
    for (let i = 0; i < jdWordList.length - 1; i++) {
        const w1 = jdWordList[i].replace(/[^a-z]/g, '')
        const w2 = jdWordList[i + 1].replace(/[^a-z]/g, '')
        if (w1.length > 2 && w2.length > 2 && !stopWords.has(w1) && !stopWords.has(w2)) {
            jdPhrases.push(`${w1} ${w2}`)
        }
    }

    const allKeywords = [...new Set([...keywords.slice(0, 30), ...jdPhrases.slice(0, 15)])]

    const found: string[] = []
    const missing: string[] = []

    for (const kw of allKeywords) {
        if (resumeLower.includes(kw)) {
            found.push(kw)
        } else {
            missing.push(kw)
        }
    }

    const matchScore = allKeywords.length > 0 ? Math.round((found.length / allKeywords.length) * 100) : 0
    return { found: found.slice(0, 20), missing: missing.slice(0, 20), matchScore }
}


// ── Tool type ─────────────────────────────────
type ToolId = 'star' | 'confidence' | 'followup' | 'weakness' | 'linkedin' | 'keywords'

const TOOLS: { id: ToolId; icon: string; title: string; desc: string }[] = [
    { id: 'star', icon: 'brain', title: 'STAR Answer Detection', desc: 'Check if your interview answers follow the STAR framework' },
    { id: 'confidence', icon: 'trend-down', title: 'Confidence & Clarity Score', desc: 'Analyze tone, filler words, and assertiveness' },
    { id: 'followup', icon: 'mic', title: 'Follow-Up Question Sim', desc: 'Predict what interviewers will ask next' },
    { id: 'weakness', icon: 'clipboard', title: 'Resume Weakness Analyzer', desc: 'Find gaps, weak verbs, and missing metrics' },
    { id: 'linkedin', icon: 'linkedin', title: 'Resume → LinkedIn', desc: 'Auto-convert your resume to a LinkedIn profile' },
    { id: 'keywords', icon: 'search', title: 'Missing Keyword Detector', desc: 'Compare your resume against any job description' },
]

// ── Score Bar Component ─────────────────────────────
function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-ink-50 font-medium">{label}</span>
                <span className="font-mono text-ink-40">{value}%</span>
            </div>
            <div className="h-2 bg-ink-10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
            </div>
        </div>
    )
}

// ── Score Badge ─────────────────────────────────────
function ScoreBadge({ score, label }: { score: number; label: string }) {
    const color = score > 70 ? '#22c55e' : score > 45 ? '#eab308' : '#ef4444'
    return (
        <div className="text-center">
            <div className="relative w-20 h-20 mx-auto">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="var(--ink-10)" strokeWidth="6" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${(score / 100) * 213.6} 213.6`} strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold" style={{ color }}>{score}</div>
            </div>
            <div className="text-xs text-ink-40 mt-1.5 font-medium">{label}</div>
        </div>
    )
}


// ══════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════
export default function AIToolsPage() {
    useSEO({ title: 'AI Tools — ResumeBuildIn', description: 'Advanced AI-powered tools for interview prep, resume analysis, and job search optimization.', path: '/tools/ai' })

    const { user, resumes, fetchResumes } = useStore()
    const [activeTool, setActiveTool] = useState<ToolId>('star')
    const [selectedResume, setSelectedResume] = useState<string>('')
    const [inputText, setInputText] = useState('')
    const [jdText, setJdText] = useState('')
    const [copied, setCopied] = useState('')

    const isLoggedIn = !!user
    const needsResume = activeTool === 'weakness' || activeTool === 'linkedin' || activeTool === 'keywords'

    useEffect(() => { if (isLoggedIn) fetchResumes() }, [isLoggedIn])
    useEffect(() => { if (resumes.length > 0 && !selectedResume) setSelectedResume(resumes[0].id) }, [resumes])

    const currentResume = useMemo(() => resumes.find(r => r.id === selectedResume), [resumes, selectedResume])
    const resumeText = useMemo(() => getResumeText(currentResume), [currentResume])

    // STAR analysis
    const starResult = useMemo(() => inputText.length > 20 ? analyzeSTAR(inputText) : null, [inputText])
    // Confidence analysis
    const confResult = useMemo(() => inputText.length > 20 ? analyzeConfidence(inputText) : null, [inputText])
    // Follow-up questions
    const followUps = useMemo(() => inputText.length > 20 ? generateFollowUps(inputText) : [], [inputText])
    // Resume weakness
    const weaknessResult = useMemo(() => currentResume ? analyzeResumeWeaknesses(currentResume) : null, [currentResume])
    // LinkedIn convert
    const linkedInResult = useMemo(() => currentResume ? convertToLinkedIn(currentResume) : null, [currentResume])
    // Keyword match
    const keywordResult = useMemo(() => resumeText && jdText.length > 30 ? findMissingKeywords(resumeText, jdText) : null, [resumeText, jdText])

    const copyText = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(''), 2000)
    }

    const signUpPrompt = (
        <div className="text-center py-14">
            <div className="flex justify-center mb-4 text-ink-20"><LandingIcon name="lock" size={48} /></div>
            <h3 className="text-xl font-semibold mb-2">Sign up to analyze your resume</h3>
            <p className="text-sm text-ink-40 mb-6 max-w-[400px] mx-auto leading-relaxed">Create a free account and build your resume to unlock this tool. It only takes a minute.</p>
            <div className="flex gap-3 justify-center">
                <Link to="/auth?mode=signup" className="btn btn-gold">Create Free Account →</Link>
                <Link to="/auth" className="btn btn-outline">Log In</Link>
            </div>
        </div>
    )

    const renderTool = () => {
        switch (activeTool) {
            // ── STAR Detection ──
            case 'star':
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-1">STAR Answer Detection</h3>
                        <p className="text-sm text-ink-40 mb-5">Paste an interview answer to check if it follows the Situation → Task → Action → Result framework.</p>
                        <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Paste your interview answer here... e.g. &quot;When I was working at Google, our team faced a challenge with...&quot;" className="w-full h-40 p-4 bg-[var(--white)] border border-ink-10 rounded-xl text-sm leading-relaxed resize-none focus:outline-none focus:border-gold transition-colors" />
                        {starResult && (
                            <div className="mt-6 space-y-5 animate-[fadeUp_0.3s_ease]">
                                <div className="flex items-center gap-6 flex-wrap">
                                    <ScoreBadge score={starResult.overall} label="STAR Score" />
                                    <div className="flex-1 min-w-[200px] space-y-1">
                                        <ScoreBar label="Situation" value={starResult.scores.situation} color="#3b82f6" />
                                        <ScoreBar label="Task" value={starResult.scores.task} color="#8b5cf6" />
                                        <ScoreBar label="Action" value={starResult.scores.action} color="#f59e0b" />
                                        <ScoreBar label="Result" value={starResult.scores.result} color="#22c55e" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {starResult.feedback.map((f, i) => (
                                        <div key={i} className="text-sm text-ink-60 leading-relaxed p-3 bg-ink-05 rounded-lg">{f}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )

            // ── Confidence & Clarity ──
            case 'confidence':
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-1">Confidence & Clarity Score</h3>
                        <p className="text-sm text-ink-40 mb-5">Paste your answer to detect filler words, hedging language, and assess overall assertiveness.</p>
                        <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Paste your interview answer here..." className="w-full h-40 p-4 bg-[var(--white)] border border-ink-10 rounded-xl text-sm leading-relaxed resize-none focus:outline-none focus:border-gold transition-colors" />
                        {confResult && (
                            <div className="mt-6 space-y-5 animate-[fadeUp_0.3s_ease]">
                                <div className="flex items-center gap-6 flex-wrap">
                                    <ScoreBadge score={confResult.confidenceScore} label="Confidence" />
                                    <ScoreBadge score={confResult.clarityScore} label="Clarity" />
                                    <div className="flex-1 min-w-[200px] grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'Filler Words', value: confResult.fillerCount, color: confResult.fillerCount > 2 ? '#ef4444' : '#22c55e' },
                                            { label: 'Hedging', value: confResult.hedgeCount, color: confResult.hedgeCount > 2 ? '#ef4444' : '#22c55e' },
                                            { label: 'Power Words', value: confResult.powerCount, color: confResult.powerCount > 0 ? '#22c55e' : '#eab308' },
                                        ].map((stat, i) => (
                                            <div key={i} className="text-center p-3 bg-ink-05 rounded-xl">
                                                <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                                                <div className="text-[10px] text-ink-30 font-mono uppercase tracking-wider mt-1">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {confResult.feedback.map((f, i) => (
                                        <div key={i} className="text-sm text-ink-60 leading-relaxed p-3 bg-ink-05 rounded-lg">{f}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )

            // ── Follow-Up Questions ──
            case 'followup':
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-1">Follow-Up Question Simulation</h3>
                        <p className="text-sm text-ink-40 mb-5">Paste your interview answer and see which follow-up questions an interviewer is likely to ask.</p>
                        <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Paste your interview answer here..." className="w-full h-40 p-4 bg-[var(--white)] border border-ink-10 rounded-xl text-sm leading-relaxed resize-none focus:outline-none focus:border-gold transition-colors" />
                        {followUps.length > 0 && (
                            <div className="mt-6 animate-[fadeUp_0.3s_ease]">
                                <div className="text-xs font-mono uppercase tracking-widest text-ink-30 mb-3">Predicted Follow-Up Questions</div>
                                <div className="space-y-2.5">
                                    {followUps.map((q, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 bg-ink-05 rounded-xl group hover:bg-[rgba(201,146,60,0.06)] transition-colors">
                                            <span className="text-gold font-bold text-sm mt-0.5">Q{i + 1}</span>
                                            <span className="text-sm text-ink-60 leading-relaxed flex-1">{q}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-4 bg-[rgba(201,146,60,0.06)] border border-gold-pale rounded-xl">
                                    <div className="text-xs font-mono uppercase tracking-widest text-gold mb-2">Pro Tip</div>
                                    <p className="text-sm text-ink-50 leading-relaxed">Prepare answers for each of these follow-ups. Interviewers probe deeper when they sense expertise or ambiguity. Having prepared responses shows depth.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )

            // ── Resume Weakness ──
            case 'weakness':
                if (!isLoggedIn) return signUpPrompt
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-1">Resume Weakness Analyzer</h3>
                        <p className="text-sm text-ink-40 mb-5">Scans your resume for gaps, weak verbs, missing metrics, and red flags that make recruiters reject.</p>
                        {resumes.length > 0 && (
                            <select value={selectedResume} onChange={e => setSelectedResume(e.target.value)} className="w-full p-3 bg-[var(--white)] border border-ink-10 rounded-xl text-sm mb-5 focus:outline-none focus:border-gold">
                                {resumes.map(r => <option key={r.id} value={r.id}>{r.title || 'Untitled Resume'}</option>)}
                            </select>
                        )}
                        {weaknessResult && (
                            <div className="animate-[fadeUp_0.3s_ease]">
                                <div className="flex items-center gap-6 mb-6 flex-wrap">
                                    <ScoreBadge score={weaknessResult.score} label="Resume Score" />
                                    <div className="flex-1 grid grid-cols-3 gap-3 min-w-[200px]">
                                        {[
                                            { label: 'Critical', value: weaknessResult.issues.filter(i => i.severity === 'high').length, color: '#ef4444' },
                                            { label: 'Warnings', value: weaknessResult.issues.filter(i => i.severity === 'medium').length, color: '#eab308' },
                                            { label: 'Suggestions', value: weaknessResult.issues.filter(i => i.severity === 'low').length, color: '#3b82f6' },
                                        ].map((s, i) => (
                                            <div key={i} className="text-center p-3 bg-ink-05 rounded-xl">
                                                <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                                                <div className="text-[10px] text-ink-30 font-mono uppercase tracking-wider mt-1">{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {weaknessResult.issues.length === 0 ? (
                                    <div className="text-center py-10 text-ink-30">
                                        <div className="flex justify-center mb-2 text-green-500"><LandingIcon name="check-circle" size={36} /></div>
                                        <p className="font-medium">Your resume looks strong! No critical issues found.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        {weaknessResult.issues.map((issue, i) => (
                                            <div key={i} className="p-4 bg-ink-05 rounded-xl border-l-3" style={{ borderLeftColor: issue.severity === 'high' ? '#ef4444' : issue.severity === 'medium' ? '#eab308' : '#3b82f6', borderLeftWidth: 3 }}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-mono uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: issue.severity === 'high' ? 'rgba(239,68,68,0.1)' : issue.severity === 'medium' ? 'rgba(234,179,8,0.1)' : 'rgba(59,130,246,0.1)', color: issue.severity === 'high' ? '#ef4444' : issue.severity === 'medium' ? '#eab308' : '#3b82f6' }}>
                                                        {issue.severity}
                                                    </span>
                                                    <span className="text-sm font-semibold text-ink">{issue.message}</span>
                                                </div>
                                                <p className="text-xs text-ink-40 mt-1">Tip: {issue.fix}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )

            // ── LinkedIn Convert ──
            case 'linkedin':
                if (!isLoggedIn) return signUpPrompt
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-1">Resume → LinkedIn Auto-Convert</h3>
                        <p className="text-sm text-ink-40 mb-5">One-click conversion of your resume into an optimized LinkedIn headline, about section, and experience.</p>
                        {resumes.length > 0 && (
                            <select value={selectedResume} onChange={e => setSelectedResume(e.target.value)} className="w-full p-3 bg-[var(--white)] border border-ink-10 rounded-xl text-sm mb-5 focus:outline-none focus:border-gold">
                                {resumes.map(r => <option key={r.id} value={r.id}>{r.title || 'Untitled Resume'}</option>)}
                            </select>
                        )}
                        {linkedInResult && (
                            <div className="space-y-5 animate-[fadeUp_0.3s_ease]">
                                {/* Headline */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-xs font-mono uppercase tracking-widest text-ink-30">LinkedIn Headline</div>
                                        <button onClick={() => copyText(linkedInResult.headline, 'headline')} className="text-xs text-gold hover:text-gold-dark transition-colors cursor-pointer">{copied === 'headline' ? '✓ Copied' : 'Copy'}</button>
                                    </div>
                                    <div className="p-4 bg-ink-05 rounded-xl text-sm text-ink-70 font-medium">{linkedInResult.headline}</div>
                                </div>
                                {/* About */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-xs font-mono uppercase tracking-widest text-ink-30">About Section</div>
                                        <button onClick={() => copyText(linkedInResult.about, 'about')} className="text-xs text-gold hover:text-gold-dark transition-colors cursor-pointer">{copied === 'about' ? '✓ Copied' : 'Copy'}</button>
                                    </div>
                                    <div className="p-4 bg-ink-05 rounded-xl text-sm text-ink-60 leading-relaxed whitespace-pre-line">{linkedInResult.about}</div>
                                </div>
                                {/* Experience */}
                                {linkedInResult.experience.length > 0 && (
                                    <div>
                                        <div className="text-xs font-mono uppercase tracking-widest text-ink-30 mb-2">Experience Sections</div>
                                        <div className="space-y-3">
                                            {linkedInResult.experience.map((exp, i) => (
                                                <div key={i} className="relative">
                                                    <button onClick={() => copyText(exp, `exp-${i}`)} className="absolute top-3 right-3 text-xs text-gold hover:text-gold-dark transition-colors cursor-pointer">{copied === `exp-${i}` ? '✓ Copied' : 'Copy'}</button>
                                                    <div className="p-4 bg-ink-05 rounded-xl text-sm text-ink-60 leading-relaxed whitespace-pre-line pr-16">{exp}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )

            // ── Missing Keywords ──
            case 'keywords':
                if (!isLoggedIn) return signUpPrompt
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-1">Missing Keyword Detector</h3>
                        <p className="text-sm text-ink-40 mb-5">Paste a job description to find critical keywords missing from your resume.</p>
                        {resumes.length > 0 && (
                            <select value={selectedResume} onChange={e => setSelectedResume(e.target.value)} className="w-full p-3 bg-[var(--white)] border border-ink-10 rounded-xl text-sm mb-3 focus:outline-none focus:border-gold">
                                {resumes.map(r => <option key={r.id} value={r.id}>{r.title || 'Untitled Resume'}</option>)}
                            </select>
                        )}
                        <textarea value={jdText} onChange={e => setJdText(e.target.value)} placeholder="Paste the full job description here..." className="w-full h-40 p-4 bg-[var(--white)] border border-ink-10 rounded-xl text-sm leading-relaxed resize-none focus:outline-none focus:border-gold transition-colors" />
                        {keywordResult && (
                            <div className="mt-6 animate-[fadeUp_0.3s_ease]">
                                <div className="flex items-center gap-6 mb-6 flex-wrap">
                                    <ScoreBadge score={keywordResult.matchScore} label="Match Score" />
                                    <div className="flex-1 grid grid-cols-2 gap-3 min-w-[200px]">
                                        <div className="text-center p-3 bg-ink-05 rounded-xl">
                                            <div className="text-2xl font-bold text-green-500">{keywordResult.found.length}</div>
                                            <div className="text-[10px] text-ink-30 font-mono uppercase tracking-wider mt-1">Keywords Found</div>
                                        </div>
                                        <div className="text-center p-3 bg-ink-05 rounded-xl">
                                            <div className="text-2xl font-bold text-red-500">{keywordResult.missing.length}</div>
                                            <div className="text-[10px] text-ink-30 font-mono uppercase tracking-wider mt-1">Missing</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Missing */}
                                {keywordResult.missing.length > 0 && (
                                    <div className="mb-4">
                                        <div className="text-xs font-mono uppercase tracking-widest text-red-500 mb-2.5">Missing Keywords — Add These</div>
                                        <div className="flex flex-wrap gap-2">
                                            {keywordResult.missing.map((kw, i) => (
                                                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100 font-medium">{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Found */}
                                {keywordResult.found.length > 0 && (
                                    <div>
                                        <div className="text-xs font-mono uppercase tracking-widest text-green-600 mb-2.5">Keywords Found</div>
                                        <div className="flex flex-wrap gap-2">
                                            {keywordResult.found.map((kw, i) => (
                                                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-600 border border-green-100 font-medium">{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            <Navbar />
            <div className="max-w-[1200px] mx-auto px-5 sm:px-10 py-10">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/dashboard" className="text-xs text-ink-30 hover:text-gold transition-colors mb-3 inline-block">← Back to Dashboard</Link>
                    <h1 className="text-3xl font-display mb-2">AI Tools</h1>
                    <p className="text-sm text-ink-40">Advanced AI-powered tools to optimize your resume and ace your interviews.</p>
                </div>

                <div className="flex gap-6 flex-col lg:flex-row">
                    {/* Sidebar */}
                    <div className="lg:w-[260px] flex-shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-1.5">
                            {TOOLS.map(tool => (
                                <button
                                    key={tool.id}
                                    onClick={() => setActiveTool(tool.id)}
                                    className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 cursor-pointer ${activeTool === tool.id
                                        ? 'bg-[var(--white)] border border-gold-pale shadow-sm'
                                        : 'hover:bg-ink-05 border border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-gold"><LandingIcon name={tool.icon} size={18} /></span>
                                        <div>
                                            <div className={`text-sm font-semibold ${activeTool === tool.id ? 'text-gold-dark' : 'text-ink'}`}>{tool.title}</div>
                                            <div className="text-[11px] text-ink-30 leading-snug mt-0.5">{tool.desc}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-[var(--white)] border border-ink-10 rounded-2xl p-6 sm:p-8">
                            {renderTool()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
