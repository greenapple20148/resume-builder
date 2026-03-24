'use client'
// src/pages/PublicResumePage.tsx — Public resume viewer (accessed via QR code or shared link)
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PREVIEW_MAP } from './ThemesPreviews'
import { ResumeData } from '../types'

interface Themes { id: string; bg: string }

const THEME_BG: Record<string, string> = {
    classic: '#ffffff', executive: '#ffffff', minimal: '#ffffff', bold: '#ffffff',
    creative_neon: '#0f0f0f', creative_blueprint: '#0c1929',
    dark_obsidian: '#0a0a0a', dark_midnight: '#0b1120', dark_eclipse: '#12100e',
    dark_void: '#000000', dark_carbon: '#141414',
    midnight_luxe: '#1A1A2E', aurora_borealis: '#0B1622', blueprint_architect: '#0D2137',
    onyx_ember: '#121212', obsidian_executive: '#0D0D1A',
}

export default function PublicResumePage() {
    const { id } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [resumeData, setResumeData] = useState<ResumeData | null>(null)
    const [themeId, setThemeId] = useState('classic')
    const [title, setTitle] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(0.6)

    useEffect(() => {
        if (!id) { setError('No resume ID provided.'); setLoading(false); return }

        const fetchResume = async () => {
            try {
                // BUG-018 fix: Use server-side API route instead of direct Supabase client.
                // The anon key client is blocked by RLS policies for unauthenticated users.
                const response = await fetch(`/api/public-resume/${id}`)
                if (!response.ok) {
                    setError('This resume is not available or the link has expired.')
                    return
                }
                const data = await response.json()

                setTitle(data.title)
                setThemeId(data.theme_id || 'classic')
                setResumeData(data.data as ResumeData)
            } catch {
                setError('Could not load the resume. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchResume()
    }, [id])

    useEffect(() => {
        const updateScale = () => {
            if (!containerRef.current) return
            const containerWidth = containerRef.current.clientWidth - 48
            const newScale = Math.min(containerWidth / 816, 1)
            setScale(newScale)
        }
        updateScale()
        window.addEventListener('resize', updateScale)
        return () => window.removeEventListener('resize', updateScale)
    }, [resumeData])

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--parchment)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, marginBottom: 20, color: 'var(--ink)' }}>
                        Resume<em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>BuildIn</em>
                    </div>
                    <div className="spinner" style={{ margin: '0 auto', color: 'var(--gold)' }} />
                </div>
            </div>
        )
    }

    if (error || !resumeData) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--parchment)' }}>
                <div style={{ textAlign: 'center', maxWidth: 420, padding: '0 20px' }}>
                    <div style={{ marginBottom: 16, opacity: 0.3, display: 'flex', justifyContent: 'center' }}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 8 }}>Resume Not Found</h1>
                    <p style={{ color: 'var(--ink-40)', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>{error}</p>
                    <Link href="/" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Go to ResumeBuildIn <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></Link>
                </div>
            </div>
        )
    }

    const PreviewComponent = PREVIEW_MAP[themeId] || PREVIEW_MAP.classic
    const bg = THEME_BG[themeId] || '#ffffff'

    return (
        <div style={{ minHeight: '100vh', background: 'var(--parchment)' }}>
            {/* ── Header ── */}
            <header style={{
                borderBottom: '1px solid var(--ink-10)', padding: '12px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--white)',
            }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: 'var(--gold)', display: 'inline-flex' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg></span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>
                        Resume<em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>BuildIn</em>
                    </span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 13, color: 'var(--ink-40)' }}>{title}</span>
                    <Link href="/auth?mode=signup" className="btn btn-gold btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Create Yours Free <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></Link>
                </div>
            </header>

            {/* ── Resume Preview ── */}
            <div ref={containerRef} style={{
                maxWidth: 900, margin: '0 auto', padding: '32px 24px',
            }}>
                <div style={{
                    background: bg,
                    borderRadius: 8,
                    boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
                    overflow: 'hidden',
                    transformOrigin: 'top center',
                    width: 816,
                    transform: `scale(${scale})`,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    <div ref={contentRef}>
                        <PreviewComponent data={resumeData} />
                    </div>
                </div>
            </div>

            {/* ── Footer CTA ── */}
            <div style={{
                textAlign: 'center', padding: '32px 24px 48px',
            }}>
                <p style={{ color: 'var(--ink-40)', fontSize: 14, marginBottom: 12 }}>
                    Built with <span style={{ color: 'var(--gold)' }}>ResumeBuildIn</span> — Create yours in minutes
                </p>
                <Link href="/auth?mode=signup" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Build My Resume — Free <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></Link>
            </div>
        </div>
    )
}
