'use client'
// src/components/ExpressUnlockBanner.tsx — Countdown banner for active Express 24h Unlock
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useStore } from '../lib/store'
import { isExpressUnlockActive, getExpressUnlockRemainingMs, formatExpressCountdown } from '../lib/expressUnlock'

export default function ExpressUnlockBanner() {
    const { profile } = useStore()
    const [remaining, setRemaining] = useState(0)

    useEffect(() => {
        if (!isExpressUnlockActive(profile)) return
        setRemaining(getExpressUnlockRemainingMs(profile))
        const interval = setInterval(() => {
            const ms = getExpressUnlockRemainingMs(profile)
            setRemaining(ms)
            if (ms <= 0) clearInterval(interval)
        }, 1000)
        return () => clearInterval(interval)
    }, [profile?.express_unlock_until])

    if (!isExpressUnlockActive(profile) || remaining <= 0) return null

    const isUrgent = remaining < 3600000  // Under 1 hour

    return (
        <div
            style={{
                background: isUrgent
                    ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
                    : 'linear-gradient(135deg, #d4a358, #c9923c)',
                color: '#fff',
                padding: '8px 20px',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.02em',
                position: 'relative',
                zIndex: 50,
                animation: isUrgent ? 'pulse-subtle 2s ease-in-out infinite' : undefined,
            }}
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>
                Express Unlock Active — Pro features enabled
            </span>
            <span
                style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '2px 10px',
                    borderRadius: 6,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    minWidth: 80,
                    textAlign: 'center',
                }}
            >
                {formatExpressCountdown(remaining)}
            </span>
            <span style={{ fontSize: 11, opacity: 0.8 }}>remaining</span>
            <Link
                href="/pricing"
                style={{
                    marginLeft: 8,
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    padding: '3px 12px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            >
                Upgrade to keep access →
            </Link>
            <style>{`
                @keyframes pulse-subtle {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.85; }
                }
            `}</style>
        </div>
    )
}
