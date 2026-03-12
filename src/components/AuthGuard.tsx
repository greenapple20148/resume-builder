'use client'

import { useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, authLoading } = useStore()
    const didRedirect = useRef(false)

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
            if (mode === 'forgot-password' || mode === 'reset-password') {
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
        const mode = params?.get('mode')
        if (mode !== 'forgot-password' && mode !== 'reset-password') {
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
