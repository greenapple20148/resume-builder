// src/lib/resumeScore.ts — Shared resume weakness analysis

const WEAK_VERBS = ['helped', 'assisted', 'worked on', 'was responsible for', 'participated in', 'handled', 'dealt with', 'did', 'made', 'got', 'used', 'tried']

export function getResumeScore(resume: any): number {
    const d = resume?.data || {}
    let issues = 0
    let high = 0, med = 0, low = 0

    const p = d.personal || {}
    if (!p.fullName) high++
    if (!p.email) high++
    if (!p.phone) med++
    if (!p.location) low++

    if (!d.summary || d.summary.length < 50) high++
    else if (d.summary.length > 500) med++

    const exp = d.experience || []
    if (exp.length === 0) {
        high++
    } else {
        exp.forEach((e: any) => {
            const desc = (e.description || '').toLowerCase()
            if (!desc || desc.length < 30) { high++ }
            else {
                if (!/\d+%|\$[\d,]+|\d+x|\d+ /.test(desc)) high++
                const weakFound = WEAK_VERBS.filter(v => desc.includes(v))
                if (weakFound.length > 0) med++
            }
            if (!e.startDate) med++
        })
    }

    if (!d.skills || d.skills.length === 0) high++
    else if (d.skills.length < 5) med++
    if (!d.education || d.education.length === 0) low++

    return Math.max(0, Math.min(100, 100 - high * 15 - med * 8 - low * 3))
}
