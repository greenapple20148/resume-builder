import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, getSupabaseUser, extractToken } from '@/lib/server/supabase-admin'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.NEXT_PUBLIC_CLAUDE_API_KEY || ''

const EVAL_SCHEMA = `{
  "score": <1-10 overall>,
  "clarity_score": <1-10>,
  "confidence_score": <1-10>,
  "keyword_relevance": <1-10>,
  "star_detected": <true/false>,
  "star_breakdown": {"situation": <1-10>, "task": <1-10>, "action": <1-10>, "result": <1-10>} OR null,
  "strengths": ["..."],
  "improvements": ["..."],
  "keywords_found": ["..."],
  "keywords_missing": ["..."],
  "improved_answer": "...",
  "sample_answer": "..."
}`

const SYSTEM_PROMPTS: Record<string, (role: string, difficulty: string) => string> = {
    general: (role, difficulty) => `You are an experienced interviewer conducting a ${difficulty}-level job interview for a ${role} position.\nWhen ACTION is "generate_question": Return ONLY the interview question text.\nWhen ACTION is "evaluate_answer": Return ONLY valid JSON:\n${EVAL_SCHEMA}\nWhen ACTION is "generate_summary": Return ONLY valid JSON: {"overall_score":<1-10>,"clarity_avg":<1-10>,"confidence_avg":<1-10>,"keyword_relevance_avg":<1-10>,"star_usage_rate":"...","verdict":"...","top_strengths":["..."],"areas_to_improve":["..."],"recommendation":"..."}`,
    system_design: (role, difficulty) => `You are a principal engineer conducting a ${difficulty}-level system design interview for a ${role}.\nWhen ACTION is "generate_question": Ask a system design problem. Return ONLY the question text.\nWhen ACTION is "evaluate_answer": Return ONLY valid JSON:\n${EVAL_SCHEMA}\nWhen ACTION is "generate_summary": Return ONLY valid JSON: {"overall_score":<1-10>,"clarity_avg":<1-10>,"confidence_avg":<1-10>,"keyword_relevance_avg":<1-10>,"star_usage_rate":"N/A","verdict":"...","top_strengths":["..."],"areas_to_improve":["..."],"recommendation":"..."}`,
    behavioral: (role, difficulty) => `You are a hiring manager conducting a ${difficulty}-level behavioral interview for a ${role}.\nWhen ACTION is "generate_question": Ask behavioral questions. Return ONLY the question text.\nWhen ACTION is "evaluate_answer": ALWAYS detect and score STAR structure. Return ONLY valid JSON:\n${EVAL_SCHEMA}\nWhen ACTION is "generate_summary": Return ONLY valid JSON with star_usage_rate.`,
    salary: () => `You are an HR representative in a salary negotiation roleplay.\nWhen ACTION is "generate_question": Present a scenario. Return ONLY the dialogue text.\nWhen ACTION is "evaluate_answer": Return ONLY valid JSON:\n${EVAL_SCHEMA}\nAdditionally: "tactics_used":["..."],"next_move":"..."\nWhen ACTION is "generate_summary": Return ONLY valid JSON with "final_offer":"..."`,
    technical: (role, difficulty) => `You are a senior engineer conducting a ${difficulty}-level technical interview for a ${role}.\nWhen ACTION is "generate_question": Present a coding/algorithm question. Return ONLY the question text.\nWhen ACTION is "evaluate_answer": Return ONLY valid JSON:\n${EVAL_SCHEMA}\nAdditionally: "technical_accuracy":<1-10>,"depth":<1-10>\nWhen ACTION is "generate_summary": Return ONLY valid JSON.`,
}

async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': CLAUDE_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1500, system: systemPrompt, messages: [{ role: 'user', content: userMessage }] }),
    })
    if (!response.ok) throw new Error(`Claude API error: ${response.status}`)
    const data = await response.json()
    return data.content?.[0]?.text || ''
}

async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system_instruction: { parts: [{ text: systemPrompt }] }, contents: [{ parts: [{ text: userMessage }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 1500 } }),
    })
    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`)
    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callAI(systemPrompt: string, userMessage: string): Promise<string> {
    if (CLAUDE_API_KEY) { try { return await callClaude(systemPrompt, userMessage) } catch (err) { console.warn('Claude failed, trying Gemini:', (err as Error).message) } }
    if (GEMINI_API_KEY) return await callGemini(systemPrompt, userMessage)
    throw new Error('No AI provider configured.')
}

export async function POST(request: NextRequest) {
    try {
        const token = extractToken(request.headers.get('authorization'))
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const supabaseUser = getSupabaseUser(token)
        const { data: { user }, error: authError } = await supabaseUser.auth.getUser()
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const supabaseAdmin = getSupabaseAdmin()
        const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', user.id).single()

        const plan = profile?.plan || 'free'
        const sessionsUsed = profile?.mock_sessions_used ?? 0
        const sessionsPurchased = profile?.mock_sessions_purchased ?? 0
        const planLimits: Record<string, number> = { free: 0, pro: 0, premium: 3, career_plus: 20 }
        const limit = planLimits[plan] || 0
        const totalAllowed = limit + sessionsPurchased

        const { action, interviewType, role, difficulty, question, answer, history, questionIndex, totalQuestions } = await request.json()

        if (action === 'get_history') {
            const { data: historyData } = await supabaseAdmin.from('mock_interview_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)
            return NextResponse.json({ history: historyData || [] })
        }

        if (action === 'generate_question' && questionIndex === 0) {
            if (plan === 'free' || plan === 'pro') {
                if (sessionsPurchased <= 0) throw new Error('MOCK_LIMIT: Mock interviews require Premium, Career+, or a Mock Pack purchase.')
            } else if (plan === 'premium' && sessionsUsed >= totalAllowed) {
                throw new Error("MOCK_LIMIT: You've used all 3 mock sessions this month.")
            }
        }

        const systemPrompt = SYSTEM_PROMPTS[interviewType]?.(role, difficulty || 'medium')
        if (!systemPrompt) throw new Error('Invalid interview type')

        let userMessage = ''
        let result = ''

        switch (action) {
            case 'generate_question': {
                const historyContext = history?.length ? `\n\nPrevious questions (don't repeat):\n${history.map((h: any, i: number) => `${i + 1}. ${h.question}`).join('\n')}` : ''
                userMessage = `ACTION: generate_question\nRole: ${role}\nDifficulty: ${difficulty || 'medium'}\nQuestion ${(questionIndex || 0) + 1} of ${totalQuestions || 6}${historyContext}`
                result = await callAI(systemPrompt, userMessage)
                break
            }
            case 'evaluate_answer': {
                userMessage = `ACTION: evaluate_answer\nRole: ${role}\nQuestion: ${question}\nCandidate's Answer: ${answer}\n\nEvaluate thoroughly. Respond with ONLY valid JSON.`
                result = await callAI(systemPrompt, userMessage)
                break
            }
            case 'generate_summary': {
                const allQA = history?.map((h: any, i: number) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}\nScore: ${h.evaluation?.score || 'N/A'}/10`).join('\n\n') || ''
                userMessage = `ACTION: generate_summary\nInterview type: ${interviewType}\nRole: ${role}\n\nFull transcript:\n${allQA}\n\nRespond with ONLY valid JSON.`
                result = await callAI(systemPrompt, userMessage)

                try {
                    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
                    const summaryData = JSON.parse(cleaned)
                    await supabaseAdmin.from('mock_interview_history').insert({
                        user_id: user.id, interview_type: interviewType, role, difficulty: difficulty || 'medium',
                        question_count: history?.length || 0, overall_score: summaryData.overall_score || 0,
                        clarity_avg: summaryData.clarity_avg || 0, confidence_avg: summaryData.confidence_avg || 0,
                        keyword_relevance_avg: summaryData.keyword_relevance_avg || 0,
                        star_usage_rate: summaryData.star_usage_rate || 'N/A', verdict: summaryData.verdict || '',
                        questions_data: JSON.stringify(history), summary_data: cleaned,
                    })
                } catch (saveErr) { console.error('Failed to save history:', saveErr) }

                if (plan === 'premium') {
                    await supabaseAdmin.from('profiles').update({ mock_sessions_used: sessionsUsed + 1 }).eq('id', user.id)
                } else if (sessionsPurchased > 0 && (plan === 'free' || plan === 'pro')) {
                    await supabaseAdmin.from('profiles').update({ mock_sessions_purchased: sessionsPurchased - 1 }).eq('id', user.id)
                }
                break
            }
            default: throw new Error('Invalid action')
        }

        return NextResponse.json({ result: result.trim() })
    } catch (error: any) {
        const msg = error.message || 'Unknown error'
        return NextResponse.json({ error: msg }, { status: msg.startsWith('MOCK_LIMIT') ? 403 : 400 })
    }
}
