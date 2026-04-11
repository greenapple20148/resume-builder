import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUser, extractToken } from '@/lib/server/supabase-admin'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.NEXT_PUBLIC_CLAUDE_API_KEY || ''

const PARSE_PROMPT = `You are an expert ATS (Applicant Tracking System) parser. Parse the following raw resume text into a highly structured JSON object. Extract every detail accurately. Do NOT miss bullet points, skills, languages, certifications, or projects!

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
6. Do NOT invent data — only extract what's present`

// ── AI provider calls (server-side only) ──────────────────

async function callOpenAI(text: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            max_tokens: 4096,
            temperature: 0.1,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: PARSE_PROMPT },
                { role: 'user', content: `Raw resume text:\n"""\n${text}\n"""` },
            ],
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error?.message || `OpenAI API error: ${response.status}`)
    }
    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
}

async function callClaude(text: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': CLAUDE_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            temperature: 0.1,
            system: PARSE_PROMPT,
            messages: [{ role: 'user', content: `Raw resume text:\n"""\n${text}\n"""` }],
        }),
    })
    if (!response.ok) throw new Error(`Claude API error: ${response.status}`)
    const data = await response.json()
    return data.content?.[0]?.text || ''
}

async function callGemini(text: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: PARSE_PROMPT }] },
            contents: [{ parts: [{ text: `Raw resume text:\n"""\n${text}\n"""` }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 4096, responseMimeType: 'application/json' },
        }),
    })
    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`)
    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callAI(text: string): Promise<string> {
    if (OPENAI_API_KEY) { try { return await callOpenAI(text) } catch (err) { console.warn('[parse-resume] OpenAI failed:', (err as Error).message) } }
    if (CLAUDE_API_KEY) { try { return await callClaude(text) } catch (err) { console.warn('[parse-resume] Claude failed:', (err as Error).message) } }
    if (GEMINI_API_KEY) return await callGemini(text)
    throw new Error('No AI provider configured on the server.')
}

// ── Normalization ─────────────────────────────────────────

function normalizeAIOutput(raw: string) {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)

    const personal = parsed.personal || {}
    const normalizedPersonal = {
        fullName: personal.fullName || personal.name || personal.full_name || '',
        jobTitle: personal.jobTitle || personal.job_title || personal.title || '',
        email: personal.email || '',
        phone: personal.phone || personal.telephone || '',
        location: personal.location || personal.address || personal.city || '',
        website: personal.website || personal.url || personal.linkedin || '',
        summary: '',
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

    return {
        personal: normalizedPersonal,
        summary: parsed.summary || personal.summary || '',
        experience: normalizedExperience,
        education: normalizedEducation,
        skills: parsed.skills || [],
        languages: normalizedLanguages,
        certifications: normalizedCertifications,
        projects: normalizedProjects,
    }
}

// ── Route handler ─────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        // Auth check
        const token = extractToken(request.headers.get('authorization'))
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const supabaseUser = getSupabaseUser(token)
        const { data: { user }, error: authError } = await supabaseUser.auth.getUser()
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { text } = await request.json()
        if (!text || typeof text !== 'string' || text.trim().length < 20) {
            return NextResponse.json({ error: 'Resume text is too short or empty.' }, { status: 400 })
        }

        // Truncate if extremely long
        const truncated = text.length > 15000 ? text.slice(0, 15000) + '\n[...truncated]' : text

        const raw = await callAI(truncated)
        if (!raw) throw new Error('Empty response from AI')

        const normalized = normalizeAIOutput(raw)

        return NextResponse.json({ data: normalized })
    } catch (error: any) {
        console.error('[parse-resume] Error:', error.message)
        return NextResponse.json(
            { error: error.message || 'Failed to parse resume' },
            { status: 500 }
        )
    }
}
