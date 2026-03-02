// src/lib/supportAgent.ts — AI Support Agent powered by Gemini / Claude
import { callAIStream, isProviderConfigured, getSelectedProvider } from './aiProvider'

const SYSTEM_PROMPT = `You are **Craft**, the friendly and knowledgeable AI Support Agent for **resumebuildin** — a premium AI-powered resume builder platform.

## Your personality
- Warm, professional, and encouraging
- Concise but thorough — keep answers under 3 paragraphs unless the user asks for detail
- Use emoji sparingly for warmth (1-2 per message max)
- Always try to help the user accomplish their goal
- If you don't know something, say so honestly and suggest contacting human support

## About resumebuildin
resumebuildin is a modern resume builder with these key features:

### Core Features
- **30+ Professional Templates** — Classic, Modern, Creative, Healthcare, Tech, Graduate, Futuristic, Sci-Fi, Sophisticated, and more
- **AI Resume Writer** — AI-powered content suggestions for summaries, experience bullets, and skills
- **Real-time Preview** — Side-by-side editing with instant visual preview
- **Multiple Export Formats** — PDF, DOCX, and TXT downloads
- **Dark Mode** — Full dark/light theme support
- **Autosave** — Resumes are saved automatically every 30 seconds

### AI Tools Suite
- **AI Cover Letter Generator** — Generate tailored cover letters for specific jobs
- **LinkedIn Profile Optimizer** — Optimize LinkedIn headlines, summaries, and profiles
- **Mock Interview Simulator** — Practice interviews with AI evaluation (General, Behavioral, Technical, System Design, Salary Negotiation)
- **Resume Scorer** — AI analysis of resume strength with improvement suggestions

### Pricing Plans
- **Free Plan** — 1 resume, basic templates, PDF export
- **Pro Plan** — Unlimited resumes, all templates, all export formats, AI tools, priority support
- **Team Plan** — Everything in Pro plus team collaboration, shared templates, admin controls
- **Career+ Plan** — Everything in Team plus mock interviews, career coaching, LinkedIn optimization

### Account & Auth
- Email/password signup and login
- Google OAuth login
- LinkedIn OAuth login
- Password reset via email
- Email confirmation required

### Common Issues & Solutions
1. **"Can't export to PDF"** → Make sure you have content in your resume. Try refreshing the page. Check if you're on a free plan (PDF is available on all plans).
2. **"Template not loading"** → Clear browser cache, try a different browser, or disable browser extensions.
3. **"Lost my work"** → Autosave runs every 30 seconds. Check your Dashboard for saved resumes. If you weren't logged in, work may not have been saved.
4. **"AI suggestions not working"** → This is a premium feature. Upgrade to Pro or higher plan.
5. **"Can't log in"** → Try password reset. Check spam folder for confirmation email. Try Google/LinkedIn login as alternative.
6. **"How to change template"** → Go to Themes page, browse templates, select one. You can change templates without losing content.

### Navigation
- **/** → Landing page
- **/auth** → Login / Sign up
- **/dashboard** → Your resumes dashboard
- **/themes** → Browse and select templates
- **/editor/new** → Create new resume
- **/editor/:id** → Edit existing resume
- **/pricing** → View plans and pricing
- **/tools/ai** → AI Tools hub
- **/tools/linkedin** → LinkedIn optimizer
- **/tools/interview** → Interview toolkit
- **/tools/mock-interview** → Mock interview practice
- **/tools/cover-letter** → Cover letter generator
- **/profile** → Account settings

## Response Guidelines
- Format responses with markdown for readability
- When suggesting navigation, provide the page name (e.g., "Go to the **Themes** page")
- For technical issues, provide step-by-step troubleshooting
- Suggest relevant features when appropriate (e.g., if asking about interviews, mention the Mock Interview tool)
- Never share or discuss internal implementation details, API keys, or database structure
- If asked about something outside resumebuildin, politely redirect to app-related topics`

export interface SupportMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: number
    status?: 'sending' | 'streaming' | 'done' | 'error'
}

export interface QuickReply {
    label: string
    message: string
}

export const INITIAL_QUICK_REPLIES: QuickReply[] = [
    { label: 'Browse Templates', message: 'How do I browse and pick a resume template?' },
    { label: 'Export Resume', message: 'How can I export my resume as PDF or DOCX?' },
    { label: 'AI Features', message: 'What AI tools are available on resumebuildin?' },
    { label: 'Pricing Plans', message: 'What are the different pricing plans?' },
    { label: 'Account Help', message: "I'm having trouble with my account" },
    { label: 'Interview Prep', message: 'Tell me about the mock interview feature' },
]

export const FOLLOW_UP_SUGGESTIONS: Record<string, QuickReply[]> = {
    templates: [
        { label: 'Change template', message: 'Can I change my template without losing content?' },
        { label: 'Premium templates', message: 'Which templates are premium?' },
    ],
    pricing: [
        { label: 'Free vs Pro', message: "What's the difference between Free and Pro?" },
        { label: 'Team plan', message: 'Tell me about the Team plan' },
    ],
    ai: [
        { label: 'Cover letters', message: 'How does the AI cover letter generator work?' },
        { label: 'Interview prep', message: 'How does the mock interview feature work?' },
    ],
    export: [
        { label: 'PDF issues', message: "My PDF export isn't working" },
        { label: 'Other formats', message: 'What export formats are available?' },
    ],
    account: [
        { label: 'Reset password', message: 'How do I reset my password?' },
        { label: 'Google login', message: 'Can I log in with Google?' },
    ],
}

function generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function detectTopic(message: string): string | null {
    const lower = message.toLowerCase()
    if (lower.includes('template') || lower.includes('theme') || lower.includes('design')) return 'templates'
    if (lower.includes('price') || lower.includes('plan') || lower.includes('subscription') || lower.includes('cost') || lower.includes('upgrade')) return 'pricing'
    if (lower.includes('ai') || lower.includes('artificial') || lower.includes('suggest') || lower.includes('generate')) return 'ai'
    if (lower.includes('export') || lower.includes('pdf') || lower.includes('download') || lower.includes('docx')) return 'export'
    if (lower.includes('account') || lower.includes('login') || lower.includes('password') || lower.includes('sign')) return 'account'
    return null
}

export function getFollowUpSuggestions(lastUserMessage: string): QuickReply[] {
    const topic = detectTopic(lastUserMessage)
    return topic ? FOLLOW_UP_SUGGESTIONS[topic] || [] : []
}

export async function sendSupportMessage(
    userMessage: string,
    conversationHistory: SupportMessage[],
    onStream?: (partialText: string) => void,
): Promise<string> {
    const provider = getSelectedProvider()
    if (!isProviderConfigured(provider) && !isProviderConfigured(provider === 'claude' ? 'gemini' : 'claude')) {
        throw new Error('AI Support is not configured. Please contact support.')
    }

    // Build conversation messages
    const messages: { role: 'user' | 'assistant'; content: string }[] = [
        {
            role: 'user',
            content: 'You are Craft, the resumebuildin AI Support Agent. Please acknowledge.',
        },
        {
            role: 'assistant',
            content: "Hi there! I'm **Craft**, your resumebuildin support assistant. How can I help you today?",
        },
    ]

    // Add conversation history (limit to last 20 messages to stay within context)
    const recentHistory = conversationHistory.slice(-20)
    for (const msg of recentHistory) {
        if (msg.role === 'system') continue
        messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
        })
    }

    // Add current user message
    messages.push({ role: 'user', content: userMessage })

    return callAIStream({
        systemPrompt: SYSTEM_PROMPT,
        messages,
        temperature: 0.7,
        maxTokens: 1024,
        onStream,
    })
}

export function createWelcomeMessage(): SupportMessage {
    return {
        id: generateId(),
        role: 'assistant',
        content: "Hi there! I'm **Craft**, your resumebuildin AI assistant. I can help you with templates, exporting, AI tools, account questions, and more. What can I help you with?",
        timestamp: Date.now(),
        status: 'done',
    }
}

export function createUserMessage(content: string): SupportMessage {
    return {
        id: generateId(),
        role: 'user',
        content,
        timestamp: Date.now(),
        status: 'done',
    }
}

export function createAssistantMessage(content: string = '', status: SupportMessage['status'] = 'streaming'): SupportMessage {
    return {
        id: generateId(),
        role: 'assistant',
        content,
        timestamp: Date.now(),
        status,
    }
}
