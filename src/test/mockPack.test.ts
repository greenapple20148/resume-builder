// src/test/mockPack.test.ts — Unit tests for Mock Interview Pack utilities
import { describe, it, expect, vi } from 'vitest'

// Mock supabase
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }) },
        from: vi.fn(() => ({
            update: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn().mockResolvedValue({ data: { mock_sessions_purchased: 3 }, error: null }),
                })),
            })),
        })),
        functions: { invoke: vi.fn() },
    },
}))

import {
    getPurchasedSessionsRemaining,
    getPlanSessionLimit,
    getTotalSessionsAvailable,
    canStartMockSession,
    getSessionsDisplay,
} from '../lib/mockPack'
import type { Profile } from '../types'

// ── Helpers ────────────────────────────────────────────
function makeProfile(overrides: Partial<Profile> = {}): Profile {
    return {
        id: 'test-user',
        plan: 'free',
        mock_sessions_used: 0,
        mock_sessions_purchased: 0,
        ...overrides,
    }
}

// ── getPlanSessionLimit ────────────────────────────────
describe('getPlanSessionLimit', () => {
    it('returns 0 for free plan', () => {
        expect(getPlanSessionLimit('free')).toBe(0)
    })

    it('returns 0 for pro plan', () => {
        expect(getPlanSessionLimit('pro')).toBe(0)
    })

    it('returns 3 for premium plan', () => {
        expect(getPlanSessionLimit('premium')).toBe(3)
    })

    it('returns 20 for career_plus plan', () => {
        expect(getPlanSessionLimit('career_plus')).toBe(20)
    })
})

// ── getPurchasedSessionsRemaining ──────────────────────
describe('getPurchasedSessionsRemaining', () => {
    it('returns 0 when no sessions purchased', () => {
        expect(getPurchasedSessionsRemaining(makeProfile())).toBe(0)
    })

    it('returns purchased count when none used', () => {
        expect(getPurchasedSessionsRemaining(makeProfile({
            mock_sessions_purchased: 6,
        }))).toBe(6)
    })

    it('returns 0 for null profile', () => {
        expect(getPurchasedSessionsRemaining(null as any)).toBe(0)
    })
})

// ── getTotalSessionsAvailable ──────────────────────────
describe('getTotalSessionsAvailable', () => {
    it('returns only purchased sessions for free plan', () => {
        const profile = makeProfile({ plan: 'free', mock_sessions_purchased: 3 })
        expect(getTotalSessionsAvailable(profile)).toBe(3)
    })

    it('returns plan + purchased for premium plan with no usage', () => {
        const profile = makeProfile({ plan: 'premium', mock_sessions_purchased: 3 })
        // premium = 3, purchased = 3 → 6
        expect(getTotalSessionsAvailable(profile)).toBe(6)
    })

    it('returns plan + purchased minus used for career_plus', () => {
        const profile = makeProfile({
            plan: 'career_plus',
            mock_sessions_used: 5,
            mock_sessions_purchased: 3,
        })
        // career_plus = 20, used = 5, remaining plan = 15, purchased = 3 → 18
        expect(getTotalSessionsAvailable(profile)).toBe(18)
    })

    it('handles used > plan limit gracefully (uses purchased)', () => {
        const profile = makeProfile({
            plan: 'premium',
            mock_sessions_used: 5, // used more than plan allows
            mock_sessions_purchased: 3,
        })
        // premium = 3, used = 5, plan remaining = 0, purchased = 3 → 3
        expect(getTotalSessionsAvailable(profile)).toBe(3)
    })
})

// ── canStartMockSession ────────────────────────────────
describe('canStartMockSession', () => {
    it('returns false for free user with no purchases', () => {
        expect(canStartMockSession(makeProfile())).toBe(false)
    })

    it('returns true for free user with purchased sessions', () => {
        expect(canStartMockSession(makeProfile({ mock_sessions_purchased: 3 }))).toBe(true)
    })

    it('returns true for premium user with sessions remaining', () => {
        expect(canStartMockSession(makeProfile({ plan: 'premium' }))).toBe(true)
    })

    it('returns false for premium user who used all sessions and no purchases', () => {
        expect(canStartMockSession(makeProfile({
            plan: 'premium',
            mock_sessions_used: 3,
        }))).toBe(false)
    })

    it('returns true for career_plus user', () => {
        expect(canStartMockSession(makeProfile({ plan: 'career_plus' }))).toBe(true)
    })
})

// ── getSessionsDisplay ─────────────────────────────────
describe('getSessionsDisplay', () => {
    it('shows purchased sessions for free user', () => {
        const display = getSessionsDisplay(makeProfile({ mock_sessions_purchased: 3 }))
        expect(display.total).toBe(3)
        expect(display.label).toContain('3')
    })

    it('shows combined total for premium user with purchases', () => {
        const display = getSessionsDisplay(makeProfile({
            plan: 'premium',
            mock_sessions_purchased: 3,
        }))
        expect(display.total).toBe(6)
    })

    it('handles null profile gracefully', () => {
        const display = getSessionsDisplay(null as any)
        expect(display.total).toBe(0)
    })
})
