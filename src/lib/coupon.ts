'use client'
// src/lib/coupon.ts — Coupon code logic for temporary plan access
import { supabase } from './supabase'
import type { Profile } from '../types'

const COUPON_DURATION_MS = 90 * 24 * 60 * 60 * 1000 // 90 days (~3 months)

/**
 * Check if the user's coupon is currently active.
 */
export function isCouponActive(profile: Profile | null): boolean {
    if (!profile?.coupon_expires_at) return false
    return new Date(profile.coupon_expires_at).getTime() > Date.now()
}

/**
 * Get the plan granted by the active coupon (null if expired/none).
 */
export function getCouponPlan(profile: Profile | null): string | null {
    if (!isCouponActive(profile)) return null
    return profile?.coupon_plan || null
}

/**
 * Get remaining time in ms. Returns 0 if expired or no coupon.
 */
export function getCouponRemainingMs(profile: Profile | null): number {
    if (!profile?.coupon_expires_at) return 0
    return Math.max(0, new Date(profile.coupon_expires_at).getTime() - Date.now())
}

/**
 * Get remaining days. Returns 0 if expired.
 */
export function getCouponRemainingDays(profile: Profile | null): number {
    return Math.ceil(getCouponRemainingMs(profile) / (24 * 60 * 60 * 1000))
}

/**
 * Format remaining time as a human-readable string.
 * e.g. "89 days", "2 days", "23 hours", "45 minutes"
 */
export function formatCouponCountdown(profile: Profile | null): string {
    const remaining = getCouponRemainingMs(profile)
    if (remaining <= 0) return 'Expired'

    const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))

    if (days > 1) return `${days} days`
    if (days === 1) return `1 day, ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
}

/**
 * Check if the coupon is expiring soon (within 7 days).
 */
export function isCouponExpiringSoon(profile: Profile | null): boolean {
    const days = getCouponRemainingDays(profile)
    return days > 0 && days <= 7
}

/**
 * Check if the coupon is in its last 14 days (show upgrade nudge).
 */
export function shouldShowUpgradeNudge(profile: Profile | null): boolean {
    const days = getCouponRemainingDays(profile)
    return days > 0 && days <= 14
}

export interface RedeemResult {
    success: boolean
    error?: string
    plan?: string
    expires_at?: string
    duration_days?: number
}

/**
 * Redeem a coupon code for the current user.
 * Uses the server-side RPC function for atomic validation.
 */
export async function redeemCoupon(couponCode: string): Promise<RedeemResult> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase.rpc('redeem_coupon', {
        user_uuid: user.id,
        coupon_code_input: couponCode.trim().toUpperCase(),
    })

    if (error) {
        console.error('[coupon] RPC error:', error)
        return { success: false, error: error.message || 'Failed to redeem coupon.' }
    }

    // The RPC returns a JSONB object
    const result = data as RedeemResult
    return result
}
