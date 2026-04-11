'use client'
// src/lib/aiProvider.ts — Unified AI Provider abstraction (OpenAI + Gemini + Claude)
import { guardAICall } from './aiRateLimit'

export type AIProvider = 'openai' | 'gemini' | 'claude'

const STORAGE_KEY = 'resumecraft_ai_provider'

// ── Provider State ────────────────────────────────────────

export function getSelectedProvider(): AIProvider {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'openai' || stored === 'claude' || stored === 'gemini') return stored
    } catch { }
    return 'openai' // default
}

export function setSelectedProvider(provider: AIProvider): void {
    localStorage.setItem(STORAGE_KEY, provider)
}

// ── API Key helpers ───────────────────────────────────────

export function getOpenAIApiKey(): string {
    return process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
}

export function getGeminiApiKey(): string {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
}

export function getClaudeApiKey(): string {
    return process.env.NEXT_PUBLIC_CLAUDE_API_KEY || ''
}

export function getActiveApiKey(): string {
    const provider = getSelectedProvider()
    if (provider === 'openai') return getOpenAIApiKey()
    return provider === 'claude' ? getClaudeApiKey() : getGeminiApiKey()
}

export function isProviderConfigured(provider: AIProvider): boolean {
    let key = ''
    if (provider === 'openai') key = getOpenAIApiKey()
    else if (provider === 'claude') key = getClaudeApiKey()
    else key = getGeminiApiKey()
    return !!key && key.length > 5
}

// ── Plan lookup for rate limiting ─────────────────────────

/** Read the user's plan from the Zustand store's persisted state or localStorage profile cache. */
function _getStoredPlan(): string {
    try {
        // Try reading from the profile cached in localStorage by the store
        const stored = localStorage.getItem('rc_user_plan')
        if (stored) return stored
    } catch { }
    return 'free' // default to most restrictive
}

/** Called by the store when the profile is loaded to cache the plan for the rate limiter. */
export function cacheUserPlan(plan: string): void {
    try {
        localStorage.setItem('rc_user_plan', plan)
    } catch { }
}

// ── Unified non-streaming call ────────────────────────────

export interface AICallOptions {
    prompt: string
    systemPrompt?: string
    temperature?: number
    maxTokens?: number
    jsonMode?: boolean
    /** Feature identifier for per-feature cooldown tracking */
    feature?: string
    /** User's plan for daily limit check. Defaults to reading from localStorage. */
    plan?: string
}

export interface AICallResult {
    text: string
    provider: AIProvider
}

/**
 * Make a non-streaming AI call to the selected provider.
 * Falls back to other providers if the selected one has no API key.
 */
export async function callAI(options: AICallOptions): Promise<AICallResult> {
    // ── AI abuse protection ──────────────────────────
    const plan = options.plan || _getStoredPlan()
    const guard = guardAICall(plan, options.feature || 'default')
    if (!guard.allowed) {
        throw new Error(guard.message || 'AI rate limit exceeded.')
    }

    let provider = getSelectedProvider()

    // Fallback logic: if selected provider isn't configured, try others
    if (!isProviderConfigured(provider)) {
        const fallbacks: AIProvider[] = ['openai', 'gemini', 'claude'].filter(p => p !== provider) as AIProvider[]
        const available = fallbacks.find(p => isProviderConfigured(p))
        if (available) {
            provider = available
        } else {
            throw new Error(
                'No AI provider configured. Please add NEXT_PUBLIC_OPENAI_API_KEY, NEXT_PUBLIC_GEMINI_API_KEY, or NEXT_PUBLIC_CLAUDE_API_KEY to your .env file.'
            )
        }
    }

    const callFn = provider === 'openai' ? callOpenAI : provider === 'claude' ? callClaude : callGemini
    const fallbacks: AIProvider[] = ['openai', 'gemini', 'claude'].filter(p => p !== provider) as AIProvider[]

    try {
        return await callFn(options)
    } catch (err) {
        // Auto-fallback to next configured provider
        for (const fb of fallbacks) {
            if (isProviderConfigured(fb)) {
                console.warn(`[AI] ${provider} failed, falling back to ${fb}:`, (err as Error).message)
                const fbFn = fb === 'openai' ? callOpenAI : fb === 'claude' ? callClaude : callGemini
                return fbFn(options)
            }
        }
        throw err
    }
}

// ── OpenAI Implementation ─────────────────────────────────

async function callOpenAI(options: AICallOptions): Promise<AICallResult> {
    const apiKey = getOpenAIApiKey()
    if (!apiKey) throw new Error('OpenAI API key not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your .env file.')

    const messages: any[] = []
    if (options.systemPrompt) {
        messages.push({ role: 'system', content: options.systemPrompt })
    }
    messages.push({ role: 'user', content: options.prompt })

    const body: any = {
        model: 'gpt-4o-mini',
        messages,
        max_tokens: options.maxTokens ?? 1024,
    }

    if (options.temperature !== undefined) {
        body.temperature = options.temperature
    }

    if (options.jsonMode) {
        body.response_format = { type: 'json_object' }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData?.error?.message || `OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content?.trim()
    if (!text) throw new Error('No response from OpenAI')

    return { text, provider: 'openai' }
}

// ── Gemini Implementation ─────────────────────────────────

async function callGemini(options: AICallOptions): Promise<AICallResult> {
    const apiKey = getGeminiApiKey()
    if (!apiKey) throw new Error('Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env file.')

    const body: any = {
        contents: [{ parts: [{ text: options.prompt }] }],
        generationConfig: {
            temperature: options.temperature ?? 0.7,
            maxOutputTokens: options.maxTokens ?? 1024,
        },
    }

    if (options.systemPrompt) {
        body.system_instruction = { parts: [{ text: options.systemPrompt }] }
    }

    if (options.jsonMode) {
        body.generationConfig.responseMimeType = 'application/json'
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }
    )

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData?.error?.message || `Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!text) throw new Error('No response from Gemini AI')

    return { text, provider: 'gemini' }
}

// ── Claude Implementation ─────────────────────────────────

async function callClaude(options: AICallOptions): Promise<AICallResult> {
    const apiKey = getClaudeApiKey()
    if (!apiKey) throw new Error('Claude API key not configured. Please add NEXT_PUBLIC_CLAUDE_API_KEY to your .env file.')

    const messages: any[] = [
        { role: 'user', content: options.prompt },
    ]

    const body: any = {
        model: 'claude-sonnet-4-20250514',
        max_tokens: options.maxTokens ?? 1024,
        messages,
    }

    if (options.systemPrompt) {
        body.system = options.systemPrompt
    }

    // Claude uses temperature differently (0-1 range same as Gemini though)
    if (options.temperature !== undefined) {
        body.temperature = options.temperature
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData?.error?.message || `Claude API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data?.content?.[0]?.text?.trim()
    if (!text) throw new Error('No response from Claude AI')

    return { text, provider: 'claude' }
}

// ── Unified streaming call (for support agent) ────────────

export interface AIStreamOptions {
    systemPrompt: string
    messages: { role: 'user' | 'assistant'; content: string }[]
    temperature?: number
    maxTokens?: number
    onStream?: (partialText: string) => void
    /** Feature identifier for per-feature cooldown tracking */
    feature?: string
    /** User's plan for daily limit check */
    plan?: string
}

/**
 * Make a streaming AI call. Used by the support agent chatbot.
 */
export async function callAIStream(options: AIStreamOptions): Promise<string> {
    // ── AI abuse protection ──────────────────────────
    const plan = options.plan || _getStoredPlan()
    const guard = guardAICall(plan, options.feature || 'chat')
    if (!guard.allowed) {
        throw new Error(guard.message || 'AI rate limit exceeded.')
    }

    let provider = getSelectedProvider()

    if (!isProviderConfigured(provider)) {
        const fallbacks: AIProvider[] = ['openai', 'gemini', 'claude'].filter(p => p !== provider) as AIProvider[]
        const available = fallbacks.find(p => isProviderConfigured(p))
        if (available) {
            provider = available
        } else {
            throw new Error('No AI provider configured.')
        }
    }

    const getStreamFn = (p: AIProvider) =>
        p === 'openai' ? streamOpenAI : p === 'claude' ? streamClaude : streamGemini

    // BUG-027 fix: Auto-fallback if the primary provider's stream call fails
    try {
        return await getStreamFn(provider)(options)
    } catch (err) {
        const fallbacks: AIProvider[] = ['openai', 'gemini', 'claude'].filter(p => p !== provider) as AIProvider[]
        for (const fb of fallbacks) {
            if (isProviderConfigured(fb)) {
                console.warn(`[AI Stream] ${provider} failed, falling back to ${fb}:`, (err as Error).message)
                try {
                    return await getStreamFn(fb)(options)
                } catch (fbErr) {
                    console.warn(`[AI Stream] Fallback ${fb} also failed:`, (fbErr as Error).message)
                }
            }
        }
        throw err
    }
}

// ── OpenAI Streaming ──────────────────────────────────────

async function streamOpenAI(options: AIStreamOptions): Promise<string> {
    const apiKey = getOpenAIApiKey()
    if (!apiKey) throw new Error('OpenAI API key not configured.')

    const messages: any[] = [
        { role: 'system', content: options.systemPrompt },
        ...options.messages.map(msg => ({ role: msg.role, content: msg.content })),
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            max_tokens: options.maxTokens ?? 1024,
            temperature: options.temperature ?? 0.7,
            stream: true,
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenAI streaming API error:', errorText)
        throw new Error('Failed to get AI response. Please try again.')
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response stream')

    const decoder = new TextDecoder()
    let fullText = ''
    let buffer = ''

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const jsonStr = line.slice(6).trim()
            if (!jsonStr || jsonStr === '[DONE]') continue

            try {
                const parsed = JSON.parse(jsonStr)
                const text = parsed?.choices?.[0]?.delta?.content
                if (text) {
                    fullText += text
                    options.onStream?.(fullText)
                }
            } catch {
                // Skip malformed JSON chunks
            }
        }
    }

    return fullText || "I'm sorry, I couldn't generate a response. Please try again."
}

// ── Gemini Streaming ──────────────────────────────────────

async function streamGemini(options: AIStreamOptions): Promise<string> {
    const apiKey = getGeminiApiKey()
    if (!apiKey) throw new Error('Gemini API key not configured.')

    // Convert messages to Gemini format
    const contents = options.messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
    }))

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: options.systemPrompt }] },
            contents,
            generationConfig: {
                temperature: options.temperature ?? 0.7,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: options.maxTokens ?? 1024,
            },
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error('Gemini streaming API error:', errorText)
        throw new Error('Failed to get AI response. Please try again.')
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response stream')

    const decoder = new TextDecoder()
    let fullText = ''
    let buffer = ''

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const jsonStr = line.slice(6).trim()
            if (!jsonStr || jsonStr === '[DONE]') continue

            try {
                const parsed = JSON.parse(jsonStr)
                const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text
                if (text) {
                    fullText += text
                    options.onStream?.(fullText)
                }
            } catch {
                // Skip malformed JSON chunks
            }
        }
    }

    return fullText || "I'm sorry, I couldn't generate a response. Please try again."
}

// ── Claude Streaming ──────────────────────────────────────

async function streamClaude(options: AIStreamOptions): Promise<string> {
    const apiKey = getClaudeApiKey()
    if (!apiKey) throw new Error('Claude API key not configured.')

    // Convert messages to Claude format
    const messages = options.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
    }))

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: options.maxTokens ?? 1024,
            system: options.systemPrompt,
            messages,
            stream: true,
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error('Claude streaming API error:', errorText)
        throw new Error('Failed to get AI response. Please try again.')
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response stream')

    const decoder = new TextDecoder()
    let fullText = ''
    let buffer = ''

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const jsonStr = line.slice(6).trim()
            if (!jsonStr || jsonStr === '[DONE]') continue

            try {
                const parsed = JSON.parse(jsonStr)
                // Claude streaming events
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                    fullText += parsed.delta.text
                    options.onStream?.(fullText)
                }
            } catch {
                // Skip malformed JSON chunks
            }
        }
    }

    return fullText || "I'm sorry, I couldn't generate a response. Please try again."
}

// ── Provider info for UI ──────────────────────────────────

export const PROVIDER_INFO = {
    openai: {
        name: 'OpenAI',
        description: 'Cost-effective and fast. Great all-around performance.',
        icon: '⬡',
        color: '#10A37F',
        models: 'GPT-4o Mini',
    },
    gemini: {
        name: 'Google Gemini',
        description: 'Fast and efficient. Great for resume writing and analysis.',
        icon: '✦',
        color: '#4285F4',
        models: 'Gemini 2.5 Flash Lite / Flash',
    },
    claude: {
        name: 'Anthropic Claude',
        description: 'Highly capable and nuanced. Excellent at detailed writing.',
        icon: '◈',
        color: '#D97757',
        models: 'Claude Sonnet 4',
    },
} as const
