'use client'

import { useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, authLoading } = useStore()
    const didRedirect = useRef(false)

    // TC-048 fix: Proactively validate session on mount to catch stale/cleared tokens
    // before any protected content flashes.
    useEffect(() => {
        if (!authLoading && user) {
            // Double-check the session is actually valid by inspecting the stored token
            try {
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
                const ref = supabaseUrl?.split('//')[1]?.split('.')[0]
                const raw = localStorage.getItem(`sb-${ref}-auth-token`)
                if (raw) {
                    const parsed = JSON.parse(raw)
                    if (parsed?.expires_at && parsed.expires_at * 1000 < Date.now()) {
                        // Session expired — redirect immediately
                        console.warn('[ProtectedRoute] Expired session token detected')
                        window.location.href = '/auth'
                        return
                    }
                }
            } catch { /* ignore parse errors */ }
        }
    }, [user, authLoading])

    useEffect(() => {
        if (!authLoading && !user && !didRedirect.current) {
            didRedirect.current = true
            window.location.href = '/auth'
        }
    }, [user, authLoading])

    if (authLoading || !user) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    background: 'var(--parchment)',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '32px',
                            fontWeight: '300',
                            marginBottom: '20px',
                            color: 'var(--ink)',
                        }}
                    >
                        Resume<em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>BuildIn</em>
                    </div>
                    <div className="spinner" style={{ margin: '0 auto', color: 'var(--gold)' }} />
                </div>
            </div>
        )
    }

    return <>{children}</>
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user, authLoading } = useStore()
    const didRedirect = useRef(false)

    useEffect(() => {
        if (!authLoading && user && !didRedirect.current) {
            const params = new URLSearchParams(window.location.search)
            const mode = params.get('mode')
            const hash = window.location.hash || ''
            // BUG-006 fix: Check for recovery tokens in URL hash AND sessionStorage flag.
            // The PASSWORD_RECOVERY event handler in store.ts sets this flag before redirecting
            // to /auth?mode=reset-password. We check it here to prevent the PublicRoute from
            // racing ahead to /dashboard before the recovery redirect completes.
            const isRecovery = hash.includes('type=recovery')
            const isRecoveryPending = sessionStorage.getItem('rc_password_recovery') === 'true'
            if (mode === 'forgot-password' || mode === 'reset-password' || isRecovery || isRecoveryPending) {
                // Clear the flag once we've reached the reset-password page
                if (mode === 'reset-password') {
                    sessionStorage.removeItem('rc_password_recovery')
                }
                return
            }
            // TC-AUTH-001 fix: Don't redirect to /dashboard if a signup just completed.
            // The signup handler needs time to navigate to /confirm-email.
            const isSignupPending = sessionStorage.getItem('rc_signup_pending') === 'true'
            if (isSignupPending) {
                return
            }
            didRedirect.current = true
            window.location.href = '/dashboard'
        }
    }, [user, authLoading])

    if (authLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    background: 'var(--parchment)',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '32px',
                            fontWeight: '300',
                            marginBottom: '20px',
                            color: 'var(--ink)',
                        }}
                    >
                        Resume<em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>BuildIn</em>
                    </div>
                    <div className="spinner" style={{ margin: '0 auto', color: 'var(--gold)' }} />
                </div>
            </div>
        )
    }

    if (user) {
        const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
        const hash = typeof window !== 'undefined' ? (window.location.hash || '') : ''
        const mode = params?.get('mode')
        const isRecovery = hash.includes('type=recovery')
        const isRecoveryPending = typeof window !== 'undefined' && sessionStorage.getItem('rc_password_recovery') === 'true'
        const isSignupPending = typeof window !== 'undefined' && sessionStorage.getItem('rc_signup_pending') === 'true'
        if (mode !== 'forgot-password' && mode !== 'reset-password' && !isRecovery && !isRecoveryPending && !isSignupPending) {
            return (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        background: 'var(--parchment)',
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '32px',
                                fontWeight: '300',
                                marginBottom: '20px',
                                color: 'var(--ink)',
                            }}
                        >
                            Resume<em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>BuildIn</em>
                        </div>
                        <div className="spinner" style={{ margin: '0 auto', color: 'var(--gold)' }} />
                    </div>
                </div>
            )
        }
    }

    return <>{children}</>
}
