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

    // Simulate a short async delay for UX
    await new Promise(r => setTimeout(r, 600))

    const lines = text.split('\n').map(line => {
        let l = line.trim()
        if (!l) return ''

        // Remove leading bullet characters for processing
        const bulletMatch = l.match(/^([•\-–—]\s*)(.*)/)
        let prefix = ''
        let content = l
        if (bulletMatch) {
            prefix = '• '
            content = bulletMatch[2]
        }

        // Capitalize first letter
        content = content.charAt(0).toUpperCase() + content.slice(1)

        // Replace weak verbs with strong action verbs
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
            'used': 'Leveraged',
        }
        for (const [weak, strong] of Object.entries(verbMap)) {
            const regex = new RegExp(`\\b${weak}\\b`, 'gi')
            if (regex.test(content)) {
                content = content.replace(regex, strong)
            }
        }

        // Add period if missing
        if (content.length > 10 && !/[.!?]$/.test(content)) {
            content += '.'
        }

        return prefix + content
    })

    return lines.filter(l => l !== undefined).join('\n')
}

/**
 * Extract text content from a PDF file.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
        GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

        const arrayBuffer = await file.arrayBuffer()
        const pdf = await getDocument({ data: arrayBuffer }).promise
        const pages: string[] = []

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
 * Uses heuristic section detection.
 */
export async function parseResumeWithAI(text: string): Promise<any> {
    await new Promise(r => setTimeout(r, 300))

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    const result: any = {
        personal: { fullName: '', email: '', phone: '', location: '', jobTitle: '', website: '' },
        summary: '',
        experience: [],
        education: [],
        skills: [],
    }

    // Extract email
    const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/)
    if (emailMatch) result.personal.email = emailMatch[0]

    // Extract phone
    const phoneMatch = text.match(/(\+?\d[\d\s\-().]{8,}\d)/)
    if (phoneMatch) result.personal.phone = phoneMatch[1].trim()

    // First non-empty line is likely the name
    if (lines.length > 0) {
        const nameLine = lines[0]
        if (nameLine.length < 60 && !nameLine.includes('@')) {
            result.personal.fullName = nameLine
        }
    }

    // Detect sections by common headers
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

    // Map parsed sections
    if (sectionContent.summary) {
        result.summary = sectionContent.summary.join(' ')
    }

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
        icon: '🎯',
        description: 'Full mock interview tailored to your target role',
        defaultQuestions: 8,
    },
    system_design: {
        id: 'system_design',
        name: 'System Design',
        icon: '🏗️',
        description: 'Architecture challenges & scalability deep-dives',
        defaultQuestions: 5,
    },
    behavioral: {
        id: 'behavioral',
        name: 'Behavioral Mastery',
        icon: '🧠',
        description: 'STAR method behavioral questions with detailed scoring',
        defaultQuestions: 6,
    },
    salary: {
        id: 'salary',
        name: 'Salary Negotiation',
        icon: '💰',
        description: 'Interactive negotiation roleplay with an HR rep',
        defaultQuestions: 6,
    },
    technical: {
        id: 'technical',
        name: 'Technical Coding',
        icon: '💻',
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
