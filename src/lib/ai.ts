// src/lib/ai.ts — Client-side AI mock interview helpers
import { invokeEdgeFunction } from './supabase'
import { callAI } from './aiProvider'

export interface InterviewEvaluation {
    score: number
    clarity_score: number
    confidence_score: number
    keyword_relevance: number
    star_detected: boolean
    star_breakdown: { situation: number; task: number; action: number; result: number } | null
    strengths: string[]
    improvements: string[]
    keywords_found: string[]
    keywords_missing: string[]
    improved_answer: string
    sample_answer: string
    // Technical extras
    technical_accuracy?: number
    depth?: number
    // Salary extras
    tactics_used?: string[]
    next_move?: string
}

export interface InterviewQuestion {
    question: string
    answer: string
    evaluation: InterviewEvaluation | null
}

export interface InterviewSummary {
    overall_score: number
    clarity_avg: number
    confidence_avg: number
    keyword_relevance_avg: number
    star_usage_rate: string
    verdict: string
    top_strengths: string[]
    areas_to_improve: string[]
    recommendation: string
    final_offer?: string
}

export interface InterviewConfig {
    type: string
    role: string
    difficulty: 'easy' | 'medium' | 'hard'
    questionCount: number
}

export interface PracticeHistoryEntry {
    id: string
    interview_type: string
    role: string
    difficulty: string
    question_count: number
    overall_score: number
    clarity_avg: number
    confidence_avg: number
    keyword_relevance_avg: number
    star_usage_rate: string
    verdict: string
    created_at: string
}

async function callMockInterview(body: Record<string, any>): Promise<any> {
    const data = await invokeEdgeFunction('ai-mock-interview', { body })
    return data
}

export async function generateQuestion(
    config: InterviewConfig,
    history: InterviewQuestion[],
    questionIndex: number,
): Promise<string> {
    const data = await callMockInterview({
        action: 'generate_question',
        interviewType: config.type,
        role: config.role,
        difficulty: config.difficulty,
        history,
        questionIndex,
        totalQuestions: config.questionCount,
    })
    return data?.result || ''
}

export async function evaluateAnswer(
    config: InterviewConfig,
    question: string,
    answer: string,
): Promise<InterviewEvaluation> {
    const data = await callMockInterview({
        action: 'evaluate_answer',
        interviewType: config.type,
        role: config.role,
        difficulty: config.difficulty,
        question,
        answer,
    })

    const result = data?.result || ''
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    try {
        const parsed = JSON.parse(cleaned)
        return {
            score: parsed.score ?? 5,
            clarity_score: parsed.clarity_score ?? parsed.score ?? 5,
            confidence_score: parsed.confidence_score ?? 5,
            keyword_relevance: parsed.keyword_relevance ?? 5,
            star_detected: parsed.star_detected ?? false,
            star_breakdown: parsed.star_breakdown ?? null,
            strengths: parsed.strengths ?? [],
            improvements: parsed.improvements ?? [],
            keywords_found: parsed.keywords_found ?? [],
            keywords_missing: parsed.keywords_missing ?? [],
            improved_answer: parsed.improved_answer ?? '',
            sample_answer: parsed.sample_answer ?? '',
            technical_accuracy: parsed.technical_accuracy,
            depth: parsed.depth,
            tactics_used: parsed.tactics_used,
            next_move: parsed.next_move,
        }
    } catch {
        console.error('Failed to parse evaluation:', result)
        return {
            score: 5, clarity_score: 5, confidence_score: 5, keyword_relevance: 5,
            star_detected: false, star_breakdown: null,
            strengths: ['Answer received'], improvements: ['Could not parse AI feedback'],
            keywords_found: [], keywords_missing: [],
            improved_answer: '', sample_answer: '',
        }
    }
}

export async function generateSummary(
    config: InterviewConfig,
    history: InterviewQuestion[],
): Promise<InterviewSummary> {
    const data = await callMockInterview({
        action: 'generate_summary',
        interviewType: config.type,
        role: config.role,
        difficulty: config.difficulty,
        history,
    })

    const result = data?.result || ''
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    try {
        const parsed = JSON.parse(cleaned)
        return {
            overall_score: parsed.overall_score ?? 5,
            clarity_avg: parsed.clarity_avg ?? 5,
            confidence_avg: parsed.confidence_avg ?? 5,
            keyword_relevance_avg: parsed.keyword_relevance_avg ?? 5,
            star_usage_rate: parsed.star_usage_rate ?? 'N/A',
            verdict: parsed.verdict ?? 'Interview completed',
            top_strengths: parsed.top_strengths ?? [],
            areas_to_improve: parsed.areas_to_improve ?? [],
            recommendation: parsed.recommendation ?? '',
            final_offer: parsed.final_offer,
        }
    } catch {
        console.error('Failed to parse summary:', result)
        return {
            overall_score: 5, clarity_avg: 5, confidence_avg: 5, keyword_relevance_avg: 5,
            star_usage_rate: 'N/A',
            verdict: 'Interview completed',
            top_strengths: ['Completed all questions'],
            areas_to_improve: ['Review feedback for each question'],
            recommendation: 'Keep practicing to improve your interview skills.',
        }
    }
}

export async function getPracticeHistory(): Promise<PracticeHistoryEntry[]> {
    const data = await callMockInterview({ action: 'get_history' })
    return data?.history || []
}

// ─────────────── Resume AI Helpers ───────────────

/**
 * Enhance resume text using rule-based improvements.
 * Rewrites passive voice, adds impact verbs, tightens phrasing.
 */
export async function enhanceTextWithAI(text: string): Promise<string> {
    if (!text.trim()) return text

    try {
        const result = await callAI({
            prompt: `You are a professional resume writer. Rewrite the following resume text to make it more impactful and professional.

Rules:
- Use strong action verbs (Led, Spearheaded, Architected, Delivered, Optimized, Streamlined, etc.)
- Add quantified results where reasonable (%, $, numbers)
- Keep the same meaning and facts, but make it more compelling
- Use concise, achievement-oriented language
- Remove filler words and passive voice
- Keep roughly the same length (don't make it much longer)
- Return ONLY the improved text, no explanations or labels
- Preserve bullet point format if present
- Do NOT add markdown formatting

Text to improve:
${text}`,
            temperature: 0.7,
            maxTokens: 1024,
            feature: 'enhance',
        })

        return result.text
    } catch (err: any) {
        console.error('AI rewrite failed, falling back to local enhancement:', err)
        return enhanceTextLocal(text)
    }
}

/** Local rule-based fallback for when AI API is unavailable */
function enhanceTextLocal(text: string): string {
    const lines = text.split('\n').map(line => {
        let l = line.trim()
        if (!l) return ''

        const bulletMatch = l.match(/^([•\-–—]\s*)(.*)/)
        let prefix = ''
        let content = l
        if (bulletMatch) {
            prefix = '• '
            content = bulletMatch[2]
        }

        content = content.charAt(0).toUpperCase() + content.slice(1)

        const verbMap: Record<string, string> = {
            'helped with': 'Contributed to',
            'worked on': 'Developed',
            'was responsible for': 'Led',
            'responsible for': 'Led',
            'was part of': 'Collaborated on',
            'made improvements to': 'Optimized',
            'did work on': 'Executed',
            'assisted in': 'Supported',
            'dealt with': 'Managed',
            'took care of': 'Oversaw',
            'put together': 'Assembled',
            'came up with': 'Designed',
            'set up': 'Established',
            'looked into': 'Investigated',
            'got better at': 'Improved',
        }
        for (const [weak, strong] of Object.entries(verbMap)) {
            const regex = new RegExp(`\\b${weak}\\b`, 'gi')
            if (regex.test(content)) {
                content = content.replace(regex, strong)
            }
        }

        if (content.length > 10 && !/[.!?]$/.test(content)) {
            content += '.'
        }

        return prefix + content
    })

    return lines.filter(l => l !== undefined).join('\n')
}

// ─────────────── Resume Weakness Analyzer ───────────────

export interface WeaknessFinding {
    section: string
    severity: 'critical' | 'warning' | 'tip'
    title: string
    description: string
    suggestion: string
}

export interface WeaknessAnalysis {
    overallScore: number
    findings: WeaknessFinding[]
    sectionScores: { section: string; score: number; label: string }[]
    topStrength: string
    summary: string
}

export async function analyzeResumeWeaknesses(resumeData: Record<string, any>): Promise<WeaknessAnalysis> {
    // Build a text representation of the resume
    const personal = resumeData.personal || {}
    const sections: string[] = []
    sections.push(`NAME: ${personal.fullName || '(empty)'}`)
    sections.push(`JOB TITLE: ${personal.jobTitle || '(empty)'}`)
    sections.push(`EMAIL: ${personal.email || '(empty)'}`)
    sections.push(`PHONE: ${personal.phone || '(empty)'}`)
    sections.push(`LOCATION: ${personal.location || '(empty)'}`)
    sections.push(`WEBSITE: ${personal.website || '(empty)'}`)
    sections.push(`\nSUMMARY:\n${resumeData.summary || '(empty)'}`)

    const exp = resumeData.experience || []
    sections.push(`\nEXPERIENCE (${exp.length} entries):`)
    exp.forEach((e: any, i: number) => {
        sections.push(`  ${i + 1}. ${e.title || '?'} at ${e.company || '?'} (${e.startDate || '?'} - ${e.current ? 'Present' : e.endDate || '?'})`)
        sections.push(`     Description: ${e.description || '(empty)'}`)
    })

    const edu = resumeData.education || []
    sections.push(`\nEDUCATION (${edu.length} entries):`)
    edu.forEach((e: any, i: number) => {
        sections.push(`  ${i + 1}. ${e.degree || '?'} at ${e.school || '?'} (${e.startDate || '?'} - ${e.endDate || '?'})${e.gpa ? ` GPA: ${e.gpa}` : ''}`)
    })

    const skills = resumeData.skills || []
    sections.push(`\nSKILLS (${skills.length}): ${skills.join(', ') || '(empty)'}`)

    const langs = resumeData.languages || []
    sections.push(`\nLANGUAGES (${langs.length}): ${langs.map((l: any) => `${l.language} (${l.proficiency})`).join(', ') || '(empty)'}`)

    const certs = resumeData.certifications || []
    sections.push(`\nCERTIFICATIONS (${certs.length}): ${certs.map((c: any) => `${c.name} - ${c.issuer}`).join(', ') || '(empty)'}`)

    const projects = resumeData.projects || []
    sections.push(`\nPROJECTS (${projects.length}):`)
    projects.forEach((p: any, i: number) => {
        sections.push(`  ${i + 1}. ${p.name || '?'}: ${p.description || '(empty)'}`)
    })

    const resumeText = sections.join('\n')

    const prompt = `You are an expert resume reviewer and career coach. Analyze this resume and provide a comprehensive weakness analysis.

RESUME:
${resumeText}

Respond with ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "overallScore": <number 0-100>,
  "summary": "<one sentence overall assessment>",
  "topStrength": "<the single best thing about this resume>",
  "sectionScores": [
    {"section": "Contact Info", "score": <0-100>, "label": "<one-word: Strong/Good/Weak/Missing>"},
    {"section": "Summary", "score": <0-100>, "label": "<one-word>"},
    {"section": "Experience", "score": <0-100>, "label": "<one-word>"},
    {"section": "Education", "score": <0-100>, "label": "<one-word>"},
    {"section": "Skills", "score": <0-100>, "label": "<one-word>"},
    {"section": "Overall Impact", "score": <0-100>, "label": "<one-word>"}
  ],
  "findings": [
    {
      "section": "<section name>",
      "severity": "<critical|warning|tip>",
      "title": "<short issue title>",
      "description": "<what's wrong and why it matters, 1-2 sentences>",
      "suggestion": "<specific actionable fix, 1-2 sentences>"
    }
  ]
}

Rules for analysis:
- Score harshly but fairly. Most resumes score 40-70.
- Include 5-10 findings covering different sections.
- "critical" = will likely get the resume rejected (missing key info, major gaps)
- "warning" = reduces competitiveness (weak language, missing metrics, formatting)
- "tip" = nice improvement (optimization, ATS keywords, modern best practices)
- Be specific - reference actual content from the resume, not generic advice.
- Empty or minimal sections should be flagged as critical.
- Check for: quantified achievements, action verbs, ATS keywords, length, completeness, consistency.`

    const result = await callAI({
        prompt,
        temperature: 0.4,
        maxTokens: 2048,
        feature: 'analyze',
    })

    const resultText = result.text

    // Parse JSON, stripping markdown fences if present
    const cleaned = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    try {
        const parsed = JSON.parse(cleaned)
        return {
            overallScore: parsed.overallScore ?? 50,
            summary: parsed.summary ?? 'Analysis complete.',
            topStrength: parsed.topStrength ?? 'Resume submitted for review.',
            sectionScores: parsed.sectionScores ?? [],
            findings: (parsed.findings ?? []).map((f: any) => ({
                section: f.section ?? 'General',
                severity: (['critical', 'warning', 'tip'].includes(f.severity) ? f.severity : 'tip') as 'critical' | 'warning' | 'tip',
                title: f.title ?? 'Finding',
                description: f.description ?? '',
                suggestion: f.suggestion ?? '',
            })),
        }
    } catch {
        console.error('Failed to parse weakness analysis:', resultText)
        throw new Error('Failed to parse AI response. Please try again.')
    }
}

/**
 * Extract text content from a PDF file.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        console.log('[extractTextFromPDF] Triggered on file size:', file.size)
        const pdfjs = await import('pdfjs-dist')
        const workerSrc = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc.default

        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
        const pages: string[] = []

        console.log('[extractTextFromPDF] Document opened successfully, total pages:', pdf.numPages)
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const text = textContent.items.map((item: any) => item.str).join(' ')
            pages.push(text)
        }

        const result = pages.join('\n\n')
        if (!result.trim()) {
            throw new Error('PDF appears to be scanned/image-based — no selectable text found.')
        }
        console.log('[extractTextFromPDF] Extracted', result.length, 'characters')
        return result
    } catch (err: any) {
        console.error('PDF extraction error:', err)
        throw new Error(err?.message || 'Could not extract text from PDF. The file may be corrupted or image-based.')
    }
}

/**
 * Extract text content from a DOCX file.
 */
export async function extractTextFromDocx(file: File): Promise<string> {
    try {
        const mammoth = await import('mammoth')
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        if (!result.value.trim()) {
            throw new Error('DOCX file appears to be empty.')
        }
        console.log('[extractTextFromDocx] Extracted', result.value.length, 'characters')
        return result.value
    } catch (err: any) {
        console.error('DOCX extraction error:', err)
        throw new Error(err?.message || 'Could not extract text from DOCX. The file may be corrupted.')
    }
}

/**
 * Parse raw resume text into structured ResumeData.
 * Uses AI for unmatched extraction accuracy.
 */
export async function parseResumeWithAI(text: string): Promise<any> {
    try {
        console.log('[parseResumeWithAI] Requesting JSON extraction from AI, text length:', text.length)

        // Truncate if extremely long to avoid token limits
        const truncated = text.length > 15000 ? text.slice(0, 15000) + '\n[...truncated]' : text

        const result = await callAI({
            prompt: `You are an expert ATS (Applicant Tracking System) parser. Parse the following raw resume text into a highly structured JSON object. Extract every detail accurately. Do NOT miss bullet points, skills, languages, certifications, or projects!

Return ONLY a valid JSON object matching exactly this structure (omit empty arrays/fields):
{
  "personal": { "fullName": "", "email": "", "phone": "", "location": "", "jobTitle": "", "website": "" },
  "summary": "Professional summary paragraph or objective...",
  "experience": [
    { "company": "", "position": "", "startDate": "YYYY-MM or Mon YYYY", "endDate": "YYYY-MM or Mon YYYY or Present", "location": "", "description": "All bullet points for this role joined with newlines" }
  ],
  "education": [
    { "institution": "", "degree": "", "field": "", "startDate": "", "endDate": "", "gpa": "" }
  ],
  "skills": ["Skill 1", "Skill 2", "..."],
  "languages": [
    { "language": "", "proficiency": "Native|Fluent|Professional|Intermediate|Basic" }
  ],
  "certifications": [
    { "name": "", "issuer": "", "date": "" }
  ],
  "projects": [
    { "name": "", "description": "", "url": "", "technologies": "" }
  ]
}

IMPORTANT RULES:
1. Extract ALL bullet points under each job as a single "description" string separated by newlines
2. If no summary/objective section exists, write a brief one based on the resume content
3. Extract skills from any "Skills", "Technical Skills", or "Tools" sections
4. Extract ALL languages found
5. Extract certifications, awards, and licenses
6. Do NOT invent data — only extract what's present

Raw resume text:
"""
${truncated}
"""`,
            temperature: 0.1,
            maxTokens: 4096,
            jsonMode: true,
            feature: 'parse',
        })

        const resultText = result.text
        if (!resultText) throw new Error('Empty response from AI')

        // Strip markdown fences if present
        const cleaned = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        console.log('[parseResumeWithAI] AI returned', cleaned.length, 'chars, parsing JSON...')
        const parsed = JSON.parse(cleaned)

        // ── Normalize AI output to match ResumeData types ──────────
        // The AI returns flexible field names — we map them to the exact
        // shape the editor, templates, and preview panel expect.

        const personal = parsed.personal || {}
        const normalizedPersonal = {
            fullName: personal.fullName || personal.name || personal.full_name || '',
            jobTitle: personal.jobTitle || personal.job_title || personal.title || '',
            email: personal.email || '',
            phone: personal.phone || personal.telephone || '',
            location: personal.location || personal.address || personal.city || '',
            website: personal.website || personal.url || personal.linkedin || '',
            summary: '',   // summary lives at top level, not inside personal
            photo: '',
        }

        const normalizedExperience = (parsed.experience || []).map((exp: any, i: number) => ({
            id: exp.id || i + 1,
            title: exp.title || exp.position || exp.role || '',
            company: exp.company || exp.employer || exp.organization || '',
            location: exp.location || '',
            startDate: exp.startDate || exp.start_date || exp.start || '',
            endDate: exp.endDate || exp.end_date || exp.end || '',
            current: !!(exp.current || (exp.endDate || exp.end_date || '').toLowerCase() === 'present'),
            description: exp.description || exp.details || exp.responsibilities || '',
        }))

        const normalizedEducation = (parsed.education || []).map((edu: any, i: number) => {
            const degree = edu.degree || ''
            const field = edu.field || edu.major || edu.concentration || ''
            return {
                id: edu.id || i + 1,
                degree: field ? `${degree}${degree && field ? ' in ' : ''}${field}` : degree,
                school: edu.school || edu.institution || edu.university || edu.college || '',
                location: edu.location || '',
                startDate: edu.startDate || edu.start_date || edu.start || '',
                endDate: edu.endDate || edu.end_date || edu.end || edu.year || edu.graduation || '',
                gpa: edu.gpa || '',
                notes: edu.notes || edu.honors || edu.activities || '',
            }
        })

        const normalizedLanguages = (parsed.languages || []).map((lang: any, i: number) => ({
            id: lang.id || i + 1,
            language: lang.language || lang.name || '',
            level: lang.level || lang.proficiency || lang.fluency || '',
        }))

        const normalizedCertifications = (parsed.certifications || []).map((cert: any, i: number) => ({
            id: cert.id || i + 1,
            name: cert.name || cert.title || cert.certification || '',
            issuer: cert.issuer || cert.organization || cert.provider || '',
            date: cert.date || cert.year || cert.issued || '',
            url: cert.url || cert.link || '',
        }))

        const normalizedProjects = (parsed.projects || []).map((proj: any, i: number) => ({
            id: proj.id || i + 1,
            name: proj.name || proj.title || '',
            description: proj.description || proj.details || '',
            url: proj.url || proj.link || '',
            tech: proj.tech || proj.technologies || proj.stack || '',
        }))

        const normalizedSummary = parsed.summary || personal.summary || ''

        console.log('[parseResumeWithAI] Normalized data:', {
            personalName: normalizedPersonal.fullName,
            experienceCount: normalizedExperience.length,
            educationCount: normalizedEducation.length,
            skillsCount: (parsed.skills || []).length,
        })

        return {
            personal: normalizedPersonal,
            summary: normalizedSummary,
            experience: normalizedExperience,
            education: normalizedEducation,
            skills: parsed.skills || [],
            languages: normalizedLanguages,
            certifications: normalizedCertifications,
            projects: normalizedProjects,
        }
    } catch (err) {
        console.error('[parseResumeWithAI] AI extraction failed:', err)
        return fallbackHeuristicParsing(text)
    }
}

// Retrain the old logic purely as a fallback 
function fallbackHeuristicParsing(text: string): any {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    const result: any = {
        personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', summary: '', photo: '' },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        projects: [],
    }

    const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/)
    if (emailMatch) result.personal.email = emailMatch[0]

    const phoneMatch = text.match(/(\+?\d[\d\s().-]{8,}\d)/)
    if (phoneMatch) result.personal.phone = phoneMatch[1].trim()

    if (lines.length > 0) {
        const nameLine = lines[0]
        if (nameLine.length < 60 && !nameLine.includes('@')) {
            result.personal.fullName = nameLine
        }
    }

    const sectionHeaders = /^(summary|profile|objective|experience|work|employment|education|skills|expertise|certifications?|projects?|languages?|awards?)/i
    let currentSection = ''
    const sectionContent: Record<string, string[]> = {}

    for (const line of lines) {
        if (sectionHeaders.test(line) && line.length < 40) {
            currentSection = line.toLowerCase().replace(/[:\s]/g, '')
            if (currentSection.startsWith('experience') || currentSection.startsWith('work') || currentSection.startsWith('employment')) currentSection = 'experience'
            if (currentSection.startsWith('summary') || currentSection.startsWith('profile') || currentSection.startsWith('objective')) currentSection = 'summary'
            if (currentSection.startsWith('skill') || currentSection.startsWith('expertise')) currentSection = 'skills'
            sectionContent[currentSection] = []
        } else if (currentSection) {
            sectionContent[currentSection] = sectionContent[currentSection] || []
            sectionContent[currentSection].push(line)
        }
    }

    if (sectionContent.summary) result.summary = sectionContent.summary.join(' ')
    if (sectionContent.skills) {
        result.skills = sectionContent.skills
            .join(', ')
            .split(/[,|;·•]/)
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 1 && s.length < 50)
    }

    return result
}

// ─────────────── AI Theme Generator ───────────────

export interface AIThemeResult {
    pageBg: string
    sidebarBg: string
    headerBg: string
    primaryText: string
    secondaryText: string
    accentColor: string
    borderColor: string
    headingFont: string
    bodyFont: string
    explanation: string
}

/**
 * Build a complete CSS override for #resume-preview-root from theme tokens.
 * This aggressively overrides inline styles on the template.
 */
export function buildThemeCSS(t: AIThemeResult): string {
    return `
#resume-preview-root,
#resume-preview-root > div {
  background: ${t.pageBg} !important;
  color: ${t.primaryText} !important;
  font-family: ${t.bodyFont || 'inherit'} !important;
}
#resume-preview-root aside,
#resume-preview-root > div > aside,
#resume-preview-root > div > div:first-child[style*="background"] {
  background: ${t.sidebarBg} !important;
}
#resume-preview-root header,
#resume-preview-root > div > header {
  background: ${t.headerBg} !important;
}
#resume-preview-root h1,
#resume-preview-root h2,
#resume-preview-root h3 {
  color: ${t.accentColor} !important;
  font-family: ${t.headingFont || t.bodyFont || 'inherit'} !important;
}
#resume-preview-root h1 {
  color: ${t.primaryText} !important;
}
#resume-preview-root h1 span[style*="color"],
#resume-preview-root h1 span[style*="italic"] {
  color: ${t.accentColor} !important;
}
#resume-preview-root p,
#resume-preview-root li,
#resume-preview-root div[style*="line-height"],
#resume-preview-root span:not([style*="background"]) {
  color: ${t.primaryText} !important;
}
#resume-preview-root [style*="color: rgb(122"],
#resume-preview-root [style*="color: #888"],
#resume-preview-root [style*="color: #666"],
#resume-preview-root [style*="color: #6e"],
#resume-preview-root [style*="color: #7a"],
#resume-preview-root [style*="color: #999"],
#resume-preview-root small,
#resume-preview-root .text-muted {
  color: ${t.secondaryText} !important;
}
#resume-preview-root [style*="border-bottom"],
#resume-preview-root [style*="border-top"],
#resume-preview-root hr {
  border-color: ${t.borderColor} !important;
}
#resume-preview-root a,
#resume-preview-root [style*="letter-spacing: 3"],
#resume-preview-root [style*="letter-spacing: 4"],
#resume-preview-root [style*="text-transform: uppercase"] {
  color: ${t.accentColor} !important;
}
#resume-preview-root aside *,
#resume-preview-root > div > aside * {
  color: inherit !important;
}
#resume-preview-root aside h2,
#resume-preview-root aside h3 {
  color: ${t.accentColor} !important;
}
`.trim()
}

/**
 * Generate a completely new theme from a natural language description.
 * Returns color tokens, fonts, and a CSS override stylesheet.
 */
export async function generateThemeFromDescription(description: string): Promise<AIThemeResult> {
    const prompt = `You are a world-class resume designer. Generate a COMPLETELY CUSTOM color theme for a resume based on the user's description. Be creative — design unique, harmonious color palettes.

User's description: "${description}"

You MUST respond with ONLY valid JSON (no markdown, no code fences, no explanation outside JSON):
{
  "pageBg": "#hex — main page background color",
  "sidebarBg": "#hex — sidebar/aside background (can be same as pageBg if no sidebar contrast needed)",
  "headerBg": "#hex — header area background (often same as pageBg or sidebarBg)",
  "primaryText": "#hex — main body text color (must be readable on pageBg)",
  "secondaryText": "#hex — muted/secondary text color",
  "accentColor": "#hex — highlights, section titles, links, key elements",
  "borderColor": "#hex — dividers and borders",
  "headingFont": "CSS font-family for headings (pick from: Georgia, Garamond, Playfair Display, Roboto, Inter, Sora, Arial, Helvetica, Cambria, Source Sans 3, DM Sans, Open Sans)",
  "bodyFont": "CSS font-family for body text (pick from same list)",
  "explanation": "One sentence describing the theme you created"
}

Rules:
- Ensure sufficient contrast between text and background (WCAG AA minimum)
- For dark themes: use light text on dark backgrounds
- For light themes: use dark text on light backgrounds
- The accent color should POP against both pageBg and sidebarBg
- Be creative with the palette — don't just use basic primary colors
- Include appropriate font-family fallbacks (e.g. "Georgia, serif" or "'Inter', sans-serif")`

    const aiResult = await callAI({
        prompt,
        temperature: 0.8,
        maxTokens: 512,
        feature: 'theme_generate',
    })

    let raw = aiResult.text

    // Strip markdown code fences if present
    raw = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()

    const result: AIThemeResult = JSON.parse(raw)

    // Validate all hex colors
    const hexFields: (keyof AIThemeResult)[] = ['pageBg', 'sidebarBg', 'headerBg', 'primaryText', 'secondaryText', 'accentColor', 'borderColor']
    for (const field of hexFields) {
        const val = result[field]
        if (typeof val !== 'string' || !/^#[0-9a-fA-F]{3,8}$/.test(val)) {
            (result as any)[field] = field === 'pageBg' ? '#ffffff' : field === 'primaryText' ? '#1a1a1a' : '#888888'
        }
    }

    return result
}

export const INTERVIEW_TYPES = {
    general: {
        id: 'general',
        name: 'Role Interview',
        icon: 'target',
        description: 'Full mock interview tailored to your target role',
        defaultQuestions: 8,
    },
    system_design: {
        id: 'system_design',
        name: 'System Design',
        icon: 'layers',
        description: 'Architecture challenges & scalability deep-dives',
        defaultQuestions: 5,
    },
    behavioral: {
        id: 'behavioral',
        name: 'Behavioral Mastery',
        icon: 'brain',
        description: 'STAR method behavioral questions with detailed scoring',
        defaultQuestions: 6,
    },
    salary: {
        id: 'salary',
        name: 'Salary Negotiation',
        icon: 'briefcase',
        description: 'Interactive negotiation roleplay with an HR rep',
        defaultQuestions: 6,
    },
    technical: {
        id: 'technical',
        name: 'Technical Coding',
        icon: 'hash',
        description: 'Explain algorithms, code, and technical decisions',
        defaultQuestions: 5,
    },
}

export const MOCK_ROLES = [
    'Software Engineer',
    'Engineering Manager',
    'Product Manager',
    'UX Designer',
    'Data Scientist',
    'DevOps Engineer',
    'Financial Analyst',
    'Marketing Manager',
    'Sales Executive',
    'Business Analyst',
    'Project Manager',
    'HR Manager',
    'Operations Manager',
    'Management Consultant',
]
