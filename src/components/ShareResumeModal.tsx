'use client'
// src/components/ShareResumeModal.tsx — QR Code share modal
import { useState, useEffect, useRef } from 'react'
import { generateQRCodeSVG, generateQRCodeDataURL } from '../lib/qrcode'
import { toast } from './Toast'

interface ShareResumeModalProps {
    resumeId: string
    resumeTitle: string
    onClose: () => void
}

export default function ShareResumeModal({ resumeId, resumeTitle, onClose }: ShareResumeModalProps) {
    const [qrSvg, setQrSvg] = useState('')
    const [qrPng, setQrPng] = useState('')
    const [copied, setCopied] = useState(false)
    const [activeTab, setActiveTab] = useState<'qr' | 'link'>('qr')
    const inputRef = useRef<HTMLInputElement>(null)

    const shareUrl = `${window.location.origin}/resume/${resumeId}`

    useEffect(() => {
        setQrSvg(generateQRCodeSVG(shareUrl, 220, 'var(--ink, #0e0d0b)', 'transparent'))
        setQrPng(generateQRCodeDataURL(shareUrl, 600))
    }, [shareUrl])

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            toast.success('Link copied to clipboard!')
            setTimeout(() => setCopied(false), 2000)
        } catch {
            inputRef.current?.select()
            toast.info('Select and copy the link manually')
        }
    }

    const handleDownloadQR = () => {
        const link = document.createElement('a')
        link.download = `${resumeTitle.replace(/[^a-zA-Z0-9]/g, '_')}_QR.png`
        link.href = qrPng
        link.click()
        toast.success('QR code downloaded!')
    }

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${resumeTitle} — Resume`,
                    text: `Check out my resume: ${resumeTitle}`,
                    url: shareUrl,
                })
            } catch { /* user cancelled */ }
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
            <div
                className="modal"
                onClick={e => e.stopPropagation()}
                style={{ maxWidth: 420, width: '100%', padding: 0, overflow: 'hidden' }}
            >
                {/* ── Header ── */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(201,146,60,0.08), rgba(201,146,60,0.02))',
                    borderBottom: '1px solid var(--ink-10)',
                    padding: '20px 24px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 18, fontFamily: 'var(--font-display)' }}>Share Resume</h3>
                        <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--ink-40)', fontFamily: 'var(--font-mono)' }}>
                            {resumeTitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            width: 32, height: 32, borderRadius: 8, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: 'var(--ink-40)',
                            transition: 'all 0.15s', fontSize: 18,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink-05)'; e.currentTarget.style.color = 'var(--ink)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--ink-40)' }}
                    >✕</button>
                </div>

                {/* ── Tabs ── */}
                <div style={{
                    display: 'flex', borderBottom: '1px solid var(--ink-10)',
                    padding: '0 24px', gap: 0,
                }}>
                    {(['qr', 'link'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: '12px 16px', fontSize: 13, fontWeight: 600,
                                color: activeTab === tab ? 'var(--gold)' : 'var(--ink-40)',
                                borderBottom: activeTab === tab ? '2px solid var(--gold)' : '2px solid transparent',
                                transition: 'all 0.15s', fontFamily: 'var(--font-body)',
                            }}
                        >
                            {tab === 'qr' ? '◉ QR Code' : '🔗 Link'}
                        </button>
                    ))}
                </div>

                {/* ── Content ── */}
                <div style={{ padding: '24px' }}>
                    {activeTab === 'qr' ? (
                        <div style={{ textAlign: 'center' }}>
                            {/* QR Code Display */}
                            <div style={{
                                display: 'inline-flex', padding: 20,
                                background: 'white', borderRadius: 16,
                                border: '1px solid rgba(0,0,0,0.08)',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                                marginBottom: 16,
                            }}>
                                {qrSvg ? (
                                    <img src={qrSvg} alt="QR Code" width={200} height={200} style={{ display: 'block' }} />
                                ) : (
                                    <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div className="spinner" />
                                    </div>
                                )}
                            </div>

                            <p style={{ fontSize: 13, color: 'var(--ink-40)', margin: '0 0 20px', lineHeight: 1.5 }}>
                                Scan this QR code to view the resume on any device
                            </p>

                            {/* QR Actions */}
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-gold" onClick={handleDownloadQR} style={{ flex: 1, fontSize: 13 }}>
                                    ↓ Download QR
                                </button>
                                <button className="btn btn-outline" onClick={handleCopyLink} style={{ flex: 1, fontSize: 13 }}>
                                    {copied ? '✓ Copied!' : '⎘ Copy Link'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Share Link */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-40)', marginBottom: 6, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Share URL
                                </label>
                                <div style={{
                                    display: 'flex', gap: 0,
                                    border: '1.5px solid var(--ink-10)', borderRadius: 10, overflow: 'hidden',
                                    transition: 'border-color 0.15s',
                                }}>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        readOnly
                                        value={shareUrl}
                                        onClick={e => (e.target as HTMLInputElement).select()}
                                        style={{
                                            flex: 1, border: 'none', padding: '10px 14px',
                                            fontSize: 13, fontFamily: 'var(--font-mono)',
                                            background: 'var(--ink-05)', color: 'var(--ink)',
                                            outline: 'none',
                                        }}
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        style={{
                                            background: copied ? 'var(--emerald)' : 'var(--gold)',
                                            color: 'white', border: 'none', cursor: 'pointer',
                                            padding: '10px 16px', fontSize: 13, fontWeight: 600,
                                            transition: 'all 0.15s', fontFamily: 'var(--font-body)',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {copied ? '✓ Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>

                            {/* Share Methods */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-40)', marginBottom: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Share via
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                    <ShareButton
                                        label="Email"
                                        icon="✉"
                                        color="#4A90D9"
                                        onClick={() => window.open(`mailto:?subject=${encodeURIComponent(resumeTitle + ' — Resume')}&body=${encodeURIComponent('Check out my resume: ' + shareUrl)}`)}
                                    />
                                    <ShareButton
                                        label="LinkedIn"
                                        icon="in"
                                        color="#0A66C2"
                                        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                                    />
                                    {typeof navigator.share === 'function' && (
                                        <ShareButton
                                            label="More"
                                            icon="⋯"
                                            color="var(--ink-40)"
                                            onClick={handleNativeShare}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div style={{
                                background: 'rgba(201,146,60,0.06)',
                                border: '1px solid rgba(201,146,60,0.15)',
                                borderRadius: 10, padding: '10px 14px',
                                display: 'flex', alignItems: 'flex-start', gap: 8,
                            }}>
                                <span style={{ fontSize: 14, lineHeight: 1 }}>💡</span>
                                <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-40)', lineHeight: 1.5 }}>
                                    Anyone with this link can view your resume. The link stays active as long as your resume exists.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ShareButton({ label, icon, color, onClick }: { label: string; icon: string; color: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: '14px 8px', background: 'var(--ink-05)', border: '1px solid var(--ink-10)',
                borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ink-10)'; e.currentTarget.style.transform = 'none' }}
        >
            <span style={{
                width: 36, height: 36, borderRadius: 8, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: icon === 'in' ? 14 : 18,
                fontWeight: icon === 'in' ? 800 : 400, color: 'white', background: color,
            }}>
                {icon}
            </span>
            <span style={{ fontSize: 11, color: 'var(--ink-40)', fontWeight: 500 }}>{label}</span>
        </button>
    )
}
