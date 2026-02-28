// src/lib/ai.ts — Client-side AI mock interview helpers
import { supabase } from './supabase'

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
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const { data, error } = await supabase.functions.invoke('ai-mock-interview', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body,
    })

    if (error) throw error
    if (data?.error) throw new Error(data.error)
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

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
        throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.')
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a professional resume writer. Rewrite the following resume text to make it more impactful and professional.

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
${text}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    }
                })
            }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData?.error?.message || `Gemini API error: ${response.status}`)
        }

        const data = await response.json()
        const result = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

        if (!result) {
            throw new Error('No response from AI')
        }

        return result
    } catch (err: any) {
        console.error('AI rewrite failed, falling back to local enhancement:', err)
        // Fallback to local rule-based enhancement
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
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
        throw new Error('Gemini API key not configured.')
    }

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

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

    let response: Response
    try {
        response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.4,
                        maxOutputTokens: 2048,
                    }
                })
            }
        )
    } catch (fetchErr: any) {
        clearTimeout(timeoutId)
        if (fetchErr.name === 'AbortError') {
            throw new Error('Analysis timed out. Please try again.')
        }
        throw new Error('Network error — check your connection and try again.')
    }
    clearTimeout(timeoutId)

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData?.error?.message || `Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!resultText) {
        throw new Error('No response from AI')
    }

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
        // Correct implementation for Vite with pdfjs-dist > 5.x
        const pdfjs = await import('pdfjs-dist')

        // Use a trusted unpkg or cdnjs URL for the worker identical to the module version
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`

        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
        const pages: string[] = []

        console.log('[extractTextFromPDF] Document opened successfully, total pages:', pdf.numPages)
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const text = textContent.items.map((item: any) => item.str).join(' ')
            pages.push(text)
        }

        return pages.join('\n\n')
    } catch (err) {
        console.error('PDF extraction error:', err)
        // Fallback: try reading as text
        return await file.text()
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
        return result.value
    } catch (err) {
        console.error('DOCX extraction error:', err)
        return await file.text()
    }
}

/**
 * Parse raw resume text into structured ResumeData.
 * Uses Gemini AI for unmatched extraction accuracy.
 */
export async function parseResumeWithAI(text: string): Promise<any> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
        console.warn('VITE_GEMINI_API_KEY not found. Falling back to simple heuristic parsing (poor quality).')
        return fallbackHeuristicParsing(text)
    }

    try {
        console.log('[parseResumeWithAI] Requesting JSON extraction from Gemini...')
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are an expert ATS (Applicant Tracking System) parser. Parse the following raw resume text into a highly structured JSON object. Extract every detail accurately. Do NOT miss bullet points in experiences or education!
Return ONLY a valid JSON object without markdown formatting, matching exactly this structure:
{
  "personal": { "fullName": "", "email": "", "phone": "", "location": "", "jobTitle": "", "website": "" },
  "summary": "Professional summary paragraph or objective...",
  "experience": [
    { "company": "", "position": "", "startDate": "YYYY-MM or string", "endDate": "YYYY-MM or string or Present", "location": "", "description": "Bullet points combined with \n or • character..." }
  ],
  "education": [
    { "institution": "", "degree": "", "field": "", "startDate": "YYYY-MM or string", "endDate": "YYYY-MM or string" }
  ],
  "skills": ["Skill 1", "Skill 2"]
}

Raw resume text to parse:
"""
${text}
"""`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.1,
                        responseMimeType: "application/json"
                    }
                })
            }
        )

        if (!response.ok) {
            throw new Error(`Gemini API error status: ${response.status}`)
        }

        const data = await response.json()
        const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
        if (!resultText) throw new Error("Empty response from AI")

        const parsed = JSON.parse(resultText)

        // Clean up empty fields and return
        return {
            personal: parsed.personal || {},
            summary: parsed.summary || '',
            experience: parsed.experience || [],
            education: parsed.education || [],
            skills: parsed.skills || []
        }
    } catch (err) {
        console.error('[parseResumeWithAI] Gemini extraction failed:', err)
        return fallbackHeuristicParsing(text)
    }
}

// Retrain the old logic purely as a fallback 
function fallbackHeuristicParsing(text: string): any {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    const result: any = {
        personal: { fullName: '', email: '', phone: '', location: '', jobTitle: '', website: '' },
        summary: '',
        experience: [],
        education: [],
        skills: [],
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
            currentSection = line.toLowerCase().replace(/[:\\s]/g, '')
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
