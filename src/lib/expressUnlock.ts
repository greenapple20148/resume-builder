// src/lib/expressUnlock.ts — Express 24h Unlock logic
import { supabase, invokeEdgeFunction, getAccessToken } from './supabase'
import type { Profile } from '../types'

const EXPRESS_DURATION_MS = 24 * 60 * 60 * 1000  // 24 hours

/**
 * Check if the user's Express Unlock is currently active.
 */
export function isExpressUnlockActive(profile: Profile | null): boolean {
    if (!profile?.express_unlock_until) return false
    return new Date(profile.express_unlock_until).getTime() > Date.now()
}

/**
 * Get remaining time in ms. Returns 0 if expired.
 */
export function getExpressUnlockRemainingMs(profile: Profile | null): number {
    if (!profile?.express_unlock_until) return 0
    return Math.max(0, new Date(profile.express_unlock_until).getTime() - Date.now())
}

/**
 * Format remaining time as "HH:MM:SS".
 */
export function formatExpressCountdown(remainingMs: number): string {
    if (remainingMs <= 0) return '00:00:00'
    const hrs = Math.floor(remainingMs / 3600000)
    const mins = Math.floor((remainingMs % 3600000) / 60000)
    const secs = Math.floor((remainingMs % 60000) / 1000)
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * Get the effective plan considering the Express Unlock.
 * If the user is on ``free`` and Express Unlock is active, they get ``pro`` level access.
 * If the user is already on a paid plan, Express Unlock has no extra effect.
 */
export function getEffectivePlan(profile: Profile | null): string {
    const basePlan = profile?.plan || 'free'
    if (basePlan !== 'free') return basePlan
    if (isExpressUnlockActive(profile)) return 'pro'
    return 'free'
}

/**
 * Activate Express Unlock for the current user.
 * Sets express_unlock_until to 24 hours from now in the profiles table.
 */
export async function activateExpressUnlock(): Promise<{ success: boolean; until: string }> {
    const accessToken = await getAccessToken()
    // Decode the JWT to get the user ID (payload is the second segment)
    const payload = JSON.parse(atob(accessToken.split('.')[1]))
    const userId = payload.sub

    const until = new Date(Date.now() + EXPRESS_DURATION_MS).toISOString()

    const { error } = await supabase
        .from('profiles')
        .update({ express_unlock_until: until })
        .eq('id', userId)

    if (error) throw error

    return { success: true, until }
}

/**
 * Purchase and activate Express Unlock.
 * In production this would go through Stripe checkout first.
 * For now, we invoke a Supabase Edge Function for payment, or activate directly.
 */
export async function purchaseExpressUnlock(): Promise<{ success: boolean; until: string }> {
    try {
        // Try edge function first (production flow)
        return await invokeEdgeFunction<{ success: boolean; until: string }>('purchase-express-unlock')
    } catch {
        // Edge function not deployed — activate directly (dev mode)
        console.warn('[expressUnlock] Edge function not available, activating directly (dev mode)')
    }

    // Dev fallback: activate directly
    return activateExpressUnlock()
}
