'use client'
// src/lib/aiRateLimit.ts — AI abuse protection: rate limiting, daily caps, cooldowns
//
// 3-layer defense:
// 1. Per-minute rate limiter (token bucket) — prevents rapid-fire calls
// 2. Daily usage caps per plan — free=10, pro=50, premium=200, career+=unlimited
// 3. Per-feature cooldowns — prevents spamming the same action

// ── Storage Keys ──────────────────────────────────────────
const DAILY_USAGE_KEY = 'rc_ai_daily_usage'
const DAILY_DATE_KEY = 'rc_ai_daily_date'
const COOLDOWN_KEY = 'rc_ai_cooldowns'

// ── Plan Limits ──────────────────────────────────────────
const DAILY_LIMITS: Record<string, number> = {
    free: 10,
    pro: 50,
    premium: 200,
    career_plus: Infinity,
}

// ── Rate Limiter (Token Bucket) ──────────────────────────
// Allows MAX_TOKENS calls per window, refilling over time
const MAX_TOKENS = 8          // max burst
const REFILL_RATE_MS = 5000   // 1 token every 5 seconds
let tokens = MAX_TOKENS
let lastRefill = Date.now()

function refillTokens(): void {
    const now = Date.now()
    const elapsed = now - lastRefill
    const newTokens = Math.floor(elapsed / REFILL_RATE_MS)
    if (newTokens > 0) {
        tokens = Math.min(MAX_TOKENS, tokens + newTokens)
        lastRefill = now
    }
}

/**
 * Check if a request can proceed based on the token bucket rate limiter.
 * Returns true if allowed, false if rate-limited.
 */
export function checkRateLimit(): { allowed: boolean; retryAfterMs: number } {
    refillTokens()
    if (tokens > 0) {
        tokens--
        return { allowed: true, retryAfterMs: 0 }
    }
    // Calculate when the next token will be available
    const timeSinceRefill = Date.now() - lastRefill
    const retryAfterMs = REFILL_RATE_MS - timeSinceRefill
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 1000) }
}

// ── Daily Usage Tracker ──────────────────────────────────

function getTodayKey(): string {
    return new Date().toISOString().slice(0, 10) // "2026-03-02"
}

function getDailyUsage(): number {
    try {
        const storedDate = localStorage.getItem(DAILY_DATE_KEY)
        const today = getTodayKey()
        if (storedDate !== today) {
            // New day — reset counter
            localStorage.setItem(DAILY_DATE_KEY, today)
            localStorage.setItem(DAILY_USAGE_KEY, '0')
            return 0
        }
        return parseInt(localStorage.getItem(DAILY_USAGE_KEY) || '0', 10)
    } catch {
        return 0
    }
}

function incrementDailyUsage(): void {
    try {
        const current = getDailyUsage()
        localStorage.setItem(DAILY_USAGE_KEY, String(current + 1))
    } catch { }
}

/**
 * Check if the user has exceeded their daily AI usage limit.
 */
export function checkDailyLimit(plan: string): { allowed: boolean; used: number; limit: number } {
    const used = getDailyUsage()
    const limit = DAILY_LIMITS[plan] || DAILY_LIMITS.free
    if (limit === Infinity) return { allowed: true, used, limit }
    return { allowed: used < limit, used, limit }
}

/**
 * Record one AI call in the daily counter.
 */
export function recordUsage(): void {
    incrementDailyUsage()
}

/**
 * Get current usage stats for UI display.
 */
export function getUsageStats(plan: string): {
    used: number
    limit: number
    remaining: number
    percentage: number
} {
    const used = getDailyUsage()
    const limit = DAILY_LIMITS[plan] || DAILY_LIMITS.free
    const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used)
    const percentage = limit === Infinity ? 0 : Math.round((used / limit) * 100)
    return { used, limit, remaining, percentage }
}

// ── Per-Feature Cooldowns ────────────────────────────────
// Prevents spamming the same action (e.g. "enhance" button) repeatedly

const COOLDOWN_DURATIONS: Record<string, number> = {
    enhance: 3000,          // 3s between text enhancements
    analyze: 10000,         // 10s between resume analyses
    parse: 5000,            // 5s between resume imports
    theme_generate: 5000,   // 5s between theme generations
    chat: 2000,             // 2s between chat messages
    interview_question: 3000,
    interview_eval: 5000,
    cover_letter: 5000,
    default: 2000,          // 2s default for unknown features
}

function getCooldowns(): Record<string, number> {
    try {
        const stored = localStorage.getItem(COOLDOWN_KEY)
        return stored ? JSON.parse(stored) : {}
    } catch {
        return {}
    }
}

function setCooldown(feature: string): void {
    try {
        const cooldowns = getCooldowns()
        cooldowns[feature] = Date.now()
        localStorage.setItem(COOLDOWN_KEY, JSON.stringify(cooldowns))
    } catch { }
}

/**
 * Check if a feature-specific cooldown has elapsed.
 */
export function checkCooldown(feature: string): { allowed: boolean; remainingMs: number } {
    const cooldowns = getCooldowns()
    const lastCall = cooldowns[feature]
    if (!lastCall) return { allowed: true, remainingMs: 0 }

    const duration = COOLDOWN_DURATIONS[feature] || COOLDOWN_DURATIONS.default
    const elapsed = Date.now() - lastCall
    if (elapsed >= duration) return { allowed: true, remainingMs: 0 }

    return { allowed: false, remainingMs: duration - elapsed }
}

/**
 * Record that a feature was just used (starts cooldown timer).
 */
export function recordCooldown(feature: string): void {
    setCooldown(feature)
}

// ── Combined Guard (all 3 layers) ────────────────────────

export interface AIGuardResult {
    allowed: boolean
    reason?: 'rate_limit' | 'daily_limit' | 'cooldown'
    message?: string
    retryAfterMs?: number
}

/**
 * Run all 3 abuse protection checks before making an AI call.
 * Call this at the top of callAI / callAIStream.
 *
 * @param plan - User's plan (free, pro, premium, career_plus)
 * @param feature - Feature identifier for cooldown tracking
 */
export function guardAICall(plan: string, feature: string = 'default'): AIGuardResult {
    // Layer 1: Per-feature cooldown
    const cooldown = checkCooldown(feature)
    if (!cooldown.allowed) {
        const secs = Math.ceil(cooldown.remainingMs / 1000)
        return {
            allowed: false,
            reason: 'cooldown',
            message: `Please wait ${secs}s before trying again.`,
            retryAfterMs: cooldown.remainingMs,
        }
    }

    // Layer 2: Token bucket rate limiter
    const rateLimit = checkRateLimit()
    if (!rateLimit.allowed) {
        const secs = Math.ceil(rateLimit.retryAfterMs / 1000)
        return {
            allowed: false,
            reason: 'rate_limit',
            message: `Too many requests. Please wait ${secs}s.`,
            retryAfterMs: rateLimit.retryAfterMs,
        }
    }

    // Layer 3: Daily usage cap
    const daily = checkDailyLimit(plan)
    if (!daily.allowed) {
        return {
            allowed: false,
            reason: 'daily_limit',
            message: `Daily AI limit reached (${daily.used}/${daily.limit}). Upgrade your plan for more.`,
            retryAfterMs: 0,
        }
    }

    // All checks passed — record usage
    recordUsage()
    recordCooldown(feature)

    return { allowed: true }
}

// ── Reset (for testing) ──────────────────────────────────

export function resetAllLimits(): void {
    tokens = MAX_TOKENS
    lastRefill = Date.now()
    try {
        localStorage.removeItem(DAILY_USAGE_KEY)
        localStorage.removeItem(DAILY_DATE_KEY)
        localStorage.removeItem(COOLDOWN_KEY)
    } catch { }
}
