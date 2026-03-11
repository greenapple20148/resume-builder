'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, authLoading } = useStore()
    const router = useRouter()

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/auth')
        }
    }, [user, authLoading, router])

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

    if (!user) return null
    return <>{children}</>
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user, authLoading } = useStore()
    const router = useRouter()

    useEffect(() => {
        if (!authLoading && user) {
            // TC-020 fix: Allow logged-in users to access forgot-password and reset-password flows
            const params = new URLSearchParams(window.location.search)
            const mode = params.get('mode')
            if (mode === 'forgot-password' || mode === 'reset-password') {
                return // Don't redirect — let them reset their password
            }
            router.replace('/dashboard')
        }
    }, [user, authLoading, router])

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
        // Allow rendering for forgot-password/reset-password even when logged in
        const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
        const mode = params?.get('mode')
        if (mode !== 'forgot-password' && mode !== 'reset-password') {
            return null
        }
    }
    return <>{children}</>
}
