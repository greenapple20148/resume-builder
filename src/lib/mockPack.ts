// src/lib/mockPack.ts — Mock Interview Pack purchase & session tracking
import { supabase } from './supabase'
import type { Profile } from '../types'

const PACK_SIZE = 3  // 3 Interview Mock Pack

/**
 * Get the total number of sessions available from purchased packs.
 */
export function getPurchasedSessionsRemaining(profile: Profile | null): number {
    return profile?.mock_sessions_purchased || 0
}

/**
 * Get the plan-based session limit per month.
 */
export function getPlanSessionLimit(plan: string): number {
    if (plan === 'career_plus') return 20
    if (plan === 'premium') return 3
    return 0
}

/**
 * Get total available sessions = (plan limit - used) + purchased bonus sessions.
 * Purchased sessions are separate from the monthly plan allowance.
 */
export function getTotalSessionsAvailable(profile: Profile | null): number {
    const plan = profile?.plan || 'free'
    const planLimit = getPlanSessionLimit(plan)
    const used = profile?.mock_sessions_used || 0
    const planRemaining = Math.max(0, planLimit - used)
    const purchased = profile?.mock_sessions_purchased || 0
    return planRemaining + purchased
}

/**
 * Check if the user can start a mock interview session.
 * Users can access mock interviews if:
 * 1. They have a premium/career_plus plan with remaining sessions, OR
 * 2. They have purchased mock pack sessions remaining
 */
export function canStartMockSession(profile: Profile | null): boolean {
    return getTotalSessionsAvailable(profile) > 0
}

/**
 * Get a display string for sessions remaining.
 */
export function getSessionsDisplay(profile: Profile | null): {
    planRemaining: number
    planLimit: number
    purchased: number
    total: number
    label: string
} {
    const plan = profile?.plan || 'free'
    const planLimit = getPlanSessionLimit(plan)
    const used = profile?.mock_sessions_used || 0
    const planRemaining = Math.max(0, planLimit - used)
    const purchased = profile?.mock_sessions_purchased || 0
    const total = planRemaining + purchased

    let label = `${total} session${total !== 1 ? 's' : ''} available`
    if (planLimit > 0 && purchased > 0) {
        label = `${planRemaining} plan + ${purchased} purchased = ${total} total`
    } else if (purchased > 0 && planLimit === 0) {
        label = `${purchased} purchased session${purchased !== 1 ? 's' : ''}`
    } else if (planLimit > 0) {
        label = `${planRemaining} of ${planLimit} sessions remaining`
    }

    return { planRemaining, planLimit, purchased, total, label }
}

/**
 * Purchase a 3 Interview Mock Pack.
 * Adds 3 to mock_sessions_purchased in the profiles table.
 */
export async function purchaseMockPack(): Promise<{ success: boolean; newTotal: number }> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    try {
        // Try edge function first (production Stripe flow)
        const { data, error } = await supabase.functions.invoke('purchase-mock-pack', {
            headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (!error && data?.success) {
            return data as { success: boolean; newTotal: number }
        }
    } catch {
        // Edge function not deployed — activate directly (dev mode)
        console.warn('[mockPack] Edge function not available, adding directly (dev mode)')
    }

    // Dev fallback: add directly to profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('mock_sessions_purchased')
        .eq('id', session.user.id)
        .single()

    const current = profile?.mock_sessions_purchased || 0
    const newTotal = current + PACK_SIZE

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ mock_sessions_purchased: newTotal })
        .eq('id', session.user.id)

    if (updateError) throw updateError

    return { success: true, newTotal }
}

/**
 * Consume one session. Deducts from purchased first, then from plan allowance.
 */
export async function consumeMockSession(): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const { data: profile } = await supabase
        .from('profiles')
        .select('mock_sessions_used, mock_sessions_purchased, plan')
        .eq('id', session.user.id)
        .single()

    if (!profile) throw new Error('Profile not found')

    const purchased = profile.mock_sessions_purchased || 0
    const used = profile.mock_sessions_used || 0
    const planLimit = getPlanSessionLimit(profile.plan || 'free')
    const planRemaining = Math.max(0, planLimit - used)

    if (purchased > 0) {
        // Deduct from purchased sessions first
        await supabase
            .from('profiles')
            .update({ mock_sessions_purchased: purchased - 1 })
            .eq('id', session.user.id)
    } else if (planRemaining > 0) {
        // Deduct from plan allowance
        await supabase
            .from('profiles')
            .update({ mock_sessions_used: used + 1 })
            .eq('id', session.user.id)
    } else {
        throw new Error('No sessions remaining')
    }
}
