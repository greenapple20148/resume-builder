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
