// src/test/expressUnlock.test.ts — Unit tests for Express 24h Unlock utilities
import { describe, it, expect, vi, beforeEach } from 'vitest'

// We test the pure logic functions directly
// Mock supabase to avoid real DB calls
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }) },
        from: vi.fn(() => ({
            update: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
        })),
        functions: { invoke: vi.fn() },
    },
}))

import {
    isExpressUnlockActive,
    getExpressUnlockRemainingMs,
    formatExpressCountdown,
    getEffectivePlan,
} from '../lib/expressUnlock'
import type { Profile } from '../types'

// ── Helpers ────────────────────────────────────────────
function makeProfile(overrides: Partial<Profile> = {}): Profile {
    return {
        id: 'test-user',
        plan: 'free',
        ...overrides,
    }
}

// ── isExpressUnlockActive ──────────────────────────────
describe('isExpressUnlockActive', () => {
    it('returns false when no express_unlock_until is set', () => {
        expect(isExpressUnlockActive(makeProfile())).toBe(false)
    })

    it('returns false when profile is null', () => {
        expect(isExpressUnlockActive(null as any)).toBe(false)
    })

    it('returns true when unlock is in the future', () => {
        const future = new Date(Date.now() + 60 * 60 * 1000).toISOString()
        expect(isExpressUnlockActive(makeProfile({ express_unlock_until: future }))).toBe(true)
    })

    it('returns false when unlock has expired', () => {
        const past = new Date(Date.now() - 1000).toISOString()
        expect(isExpressUnlockActive(makeProfile({ express_unlock_until: past }))).toBe(false)
    })
})

// ── getExpressUnlockRemainingMs ────────────────────────
describe('getExpressUnlockRemainingMs', () => {
    it('returns 0 when no unlock is set', () => {
        expect(getExpressUnlockRemainingMs(makeProfile())).toBe(0)
    })

    it('returns positive number when unlock is active', () => {
        const future = new Date(Date.now() + 3600000).toISOString()
        const remaining = getExpressUnlockRemainingMs(makeProfile({ express_unlock_until: future }))
        expect(remaining).toBeGreaterThan(0)
        expect(remaining).toBeLessThanOrEqual(3600000)
    })

    it('returns 0 when unlock has expired', () => {
        const past = new Date(Date.now() - 1000).toISOString()
        expect(getExpressUnlockRemainingMs(makeProfile({ express_unlock_until: past }))).toBe(0)
    })
})

// ── formatExpressCountdown ─────────────────────────────
describe('formatExpressCountdown', () => {
    it('formats hours, minutes, seconds correctly', () => {
        // 2h 30m 45s = 9045000ms
        const result = formatExpressCountdown(2 * 3600000 + 30 * 60000 + 45 * 1000)
        expect(result).toBe('02:30:45')
    })

    it('formats zero correctly', () => {
        expect(formatExpressCountdown(0)).toBe('00:00:00')
    })

    it('formats minutes and seconds only', () => {
        expect(formatExpressCountdown(5 * 60000 + 10000)).toBe('00:05:10')
    })

    it('handles full 24 hours', () => {
        expect(formatExpressCountdown(24 * 3600000)).toBe('24:00:00')
    })
})

// ── getEffectivePlan ───────────────────────────────────
describe('getEffectivePlan', () => {
    it('returns the base plan when no unlock is active', () => {
        expect(getEffectivePlan(makeProfile({ plan: 'free' }))).toBe('free')
        expect(getEffectivePlan(makeProfile({ plan: 'pro' }))).toBe('pro')
        expect(getEffectivePlan(makeProfile({ plan: 'premium' }))).toBe('premium')
        expect(getEffectivePlan(makeProfile({ plan: 'career_plus' }))).toBe('career_plus')
    })

    it('returns "pro" for free users with active express unlock', () => {
        const future = new Date(Date.now() + 3600000).toISOString()
        expect(getEffectivePlan(makeProfile({ plan: 'free', express_unlock_until: future }))).toBe('pro')
    })

    it('does NOT upgrade pro/premium/career+ users', () => {
        const future = new Date(Date.now() + 3600000).toISOString()
        expect(getEffectivePlan(makeProfile({ plan: 'pro', express_unlock_until: future }))).toBe('pro')
        expect(getEffectivePlan(makeProfile({ plan: 'premium', express_unlock_until: future }))).toBe('premium')
        expect(getEffectivePlan(makeProfile({ plan: 'career_plus', express_unlock_until: future }))).toBe('career_plus')
    })

    it('returns "free" when unlock has expired', () => {
        const past = new Date(Date.now() - 1000).toISOString()
        expect(getEffectivePlan(makeProfile({ plan: 'free', express_unlock_until: past }))).toBe('free')
    })

    it('returns "free" for null profile', () => {
        expect(getEffectivePlan(null as any)).toBe('free')
    })
})
