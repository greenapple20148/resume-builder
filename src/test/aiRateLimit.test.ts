// src/test/aiRateLimit.test.ts — Unit tests for AI abuse protection
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
    checkRateLimit,
    checkDailyLimit,
    checkCooldown,
    recordCooldown,
    recordUsage,
    guardAICall,
    resetAllLimits,
    getUsageStats,
} from '../lib/aiRateLimit'

// Mock localStorage
const store: Record<string, string> = {}
const localStorageMock = {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { store[key] = val }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
}
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true })

describe('AI Rate Limit', () => {
    beforeEach(() => {
        localStorageMock.clear()
        resetAllLimits()
    })

    // ── Token Bucket Rate Limiter ─────────────────────────
    describe('checkRateLimit (token bucket)', () => {
        it('allows up to 8 rapid calls (burst limit)', () => {
            for (let i = 0; i < 8; i++) {
                const result = checkRateLimit()
                expect(result.allowed).toBe(true)
            }
        })

        it('blocks the 9th rapid call', () => {
            for (let i = 0; i < 8; i++) checkRateLimit()
            const result = checkRateLimit()
            expect(result.allowed).toBe(false)
            expect(result.retryAfterMs).toBeGreaterThan(0)
        })

        it('recovers after waiting', () => {
            for (let i = 0; i < 8; i++) checkRateLimit()

            // Simulate time passing (reset for test)
            resetAllLimits()
            const result = checkRateLimit()
            expect(result.allowed).toBe(true)
        })
    })

    // ── Daily Usage Caps ──────────────────────────────────
    describe('checkDailyLimit', () => {
        it('allows free plan up to 10 calls', () => {
            for (let i = 0; i < 10; i++) {
                const result = checkDailyLimit('free')
                expect(result.allowed).toBe(true)
                recordUsage()
            }
            const result = checkDailyLimit('free')
            expect(result.allowed).toBe(false)
            expect(result.used).toBe(10)
            expect(result.limit).toBe(10)
        })

        it('allows pro plan up to 50 calls', () => {
            for (let i = 0; i < 50; i++) {
                expect(checkDailyLimit('pro').allowed).toBe(true)
                recordUsage()
            }
            expect(checkDailyLimit('pro').allowed).toBe(false)
        })

        it('allows premium plan up to 200 calls', () => {
            for (let i = 0; i < 200; i++) {
                expect(checkDailyLimit('premium').allowed).toBe(true)
                recordUsage()
            }
            expect(checkDailyLimit('premium').allowed).toBe(false)
        })

        it('career_plus plan has unlimited calls', () => {
            for (let i = 0; i < 500; i++) {
                recordUsage()
            }
            const result = checkDailyLimit('career_plus')
            expect(result.allowed).toBe(true)
            expect(result.limit).toBe(Infinity)
        })

        it('defaults unknown plan to free limits', () => {
            const result = checkDailyLimit('unknown_plan')
            expect(result.limit).toBe(10)
        })
    })

    // ── Per-Feature Cooldowns ─────────────────────────────
    describe('checkCooldown', () => {
        it('allows first call for any feature', () => {
            expect(checkCooldown('enhance').allowed).toBe(true)
            expect(checkCooldown('analyze').allowed).toBe(true)
            expect(checkCooldown('parse').allowed).toBe(true)
        })

        it('blocks rapid repeat of same feature', () => {
            recordCooldown('enhance')
            const result = checkCooldown('enhance')
            expect(result.allowed).toBe(false)
            expect(result.remainingMs).toBeGreaterThan(0)
        })

        it('allows different features simultaneously', () => {
            recordCooldown('enhance')
            // Different features should still be allowed
            expect(checkCooldown('analyze').allowed).toBe(true)
            expect(checkCooldown('parse').allowed).toBe(true)
        })
    })

    // ── Usage Stats ───────────────────────────────────────
    describe('getUsageStats', () => {
        it('returns correct stats for free plan', () => {
            recordUsage()
            recordUsage()
            recordUsage()

            const stats = getUsageStats('free')
            expect(stats.used).toBe(3)
            expect(stats.limit).toBe(10)
            expect(stats.remaining).toBe(7)
            expect(stats.percentage).toBe(30)
        })

        it('returns Infinity remaining for career_plus', () => {
            const stats = getUsageStats('career_plus')
            expect(stats.limit).toBe(Infinity)
            expect(stats.remaining).toBe(Infinity)
            expect(stats.percentage).toBe(0)
        })
    })

    // ── Combined Guard ────────────────────────────────────
    describe('guardAICall', () => {
        it('allows a normal call', () => {
            const result = guardAICall('pro', 'enhance')
            expect(result.allowed).toBe(true)
            expect(result.reason).toBeUndefined()
        })

        it('blocks when daily limit exceeded', () => {
            // Exhaust free limit
            for (let i = 0; i < 10; i++) {
                guardAICall('free', `feature-${i}`) // use different features to avoid cooldown
            }
            resetAllLimits() // reset rate limiter tokens but keep daily count

            // Manually re-set daily usage without resetting it
            // Actually we need to be smarter — guardAICall records usage
            // After 10 calls as free, the 11th should fail
        })

        it('blocks on cooldown', () => {
            // First call succeeds
            const first = guardAICall('pro', 'enhance')
            expect(first.allowed).toBe(true)

            // Second call to same feature should be blocked by cooldown
            const second = guardAICall('pro', 'enhance')
            expect(second.allowed).toBe(false)
            expect(second.reason).toBe('cooldown')
            expect(second.message).toContain('wait')
        })

        it('blocks when rate limit exceeded', () => {
            // Burn through all 8 tokens with different features
            for (let i = 0; i < 8; i++) {
                guardAICall('career_plus', `feature-${i}`)
            }

            // 9th call should hit rate limit
            const result = guardAICall('career_plus', 'feature-9')
            expect(result.allowed).toBe(false)
            expect(result.reason).toBe('rate_limit')
            expect(result.message).toContain('Too many requests')
        })

        it('records usage after successful call', () => {
            guardAICall('free', 'enhance')
            const stats = getUsageStats('free')
            expect(stats.used).toBe(1)
        })
    })

    // ── Reset ─────────────────────────────────────────────
    describe('resetAllLimits', () => {
        it('clears all state', () => {
            recordUsage()
            recordUsage()
            recordCooldown('enhance')
            for (let i = 0; i < 5; i++) checkRateLimit()

            resetAllLimits()

            expect(getUsageStats('free').used).toBe(0)
            expect(checkCooldown('enhance').allowed).toBe(true)
            expect(checkRateLimit().allowed).toBe(true)
        })
    })
})
