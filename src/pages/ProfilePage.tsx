import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStore } from '../lib/store'
import { toast } from '../components/Toast'
import { PLANS, openCustomerPortal } from '../lib/stripe'
import { supabase } from '../lib/supabase'
import { LandingIcon } from '../components/LandingIcons'
import { getSelectedProvider, setSelectedProvider, isProviderConfigured, PROVIDER_INFO, type AIProvider } from '../lib/aiProvider'

export default function ProfilePage() {
    const { user, profile, signOut, updateProfile, resetPassword, fetchResumes, resumes } = useStore()
    const navigate = useNavigate()
    const [tab, setTab] = useState<'general' | 'security' | 'ai' | 'invite'>('general')
    const [fullName, setFullName] = useState(profile?.full_name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [saving, setSaving] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordSaving, setPasswordSaving] = useState(false)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteName, setInviteName] = useState('')
    const [inviteSending, setInviteSending] = useState(false)
    const [inviteSent, setInviteSent] = useState(false)
    const [portalLoading, setPortalLoading] = useState(false)
    const [aiProvider, setAiProvider] = useState<AIProvider>(getSelectedProvider())

    useEffect(() => { fetchResumes() }, [fetchResumes])
    useEffect(() => { if (profile) setFullName(profile.full_name || ''); if (user) setEmail(user.email || '') }, [profile, user])

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!fullName.trim()) { toast.error('Name cannot be empty'); return }
        setSaving(true)
        try { await updateProfile({ full_name: fullName, email }); toast.success('Profile updated!'); if (email !== user?.email) toast.success('Check your new email to confirm the change.') }
        catch (err: any) { toast.error(err.message || 'Failed to update profile') }
        finally { setSaving(false) }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return }
        if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
        setPasswordSaving(true)
        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPassword })
            if (signInError) { toast.error('Current password is incorrect'); setPasswordSaving(false); return }
            const { error } = await supabase.auth.updateUser({ password: newPassword })
            if (error) throw error
            toast.success('Password updated successfully!'); setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
        } catch (err: any) { toast.error(err.message || 'Failed to update password') } finally { setPasswordSaving(false) }
    }

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inviteEmail.includes('@')) { toast.error('Please enter a valid email address'); return }
        setInviteSending(true)
        try {
            const { error } = await supabase.auth.admin.inviteUserByEmail(inviteEmail)
            if (error) {
                const referralLink = `${window.location.origin}/auth?mode=signup&ref=${user.id}`
                const subject = encodeURIComponent(`${profile?.full_name || 'A friend'} invited you to ResumeBuildIn`)
                const body = encodeURIComponent(`Hey${inviteName ? ' ' + inviteName : ''},\n\nI've been using ResumeBuildIn to build my resume and I think you'd love it too!\n\nIt's free to get started — just click this link:\n${referralLink}\n\nCheers,\n${profile?.full_name || 'Your friend'}`)
                window.open(`mailto:${inviteEmail}?subject=${subject}&body=${body}`, '_blank')
            }
            setInviteSent(true); toast.success(`Invitation sent to ${inviteEmail}!`)
            setTimeout(() => { setInviteEmail(''); setInviteName(''); setInviteSent(false) }, 3000)
        } catch (err: any) {
            const referralLink = `${window.location.origin}/auth?mode=signup&ref=${user.id}`
            const subject = encodeURIComponent(`${profile?.full_name || 'A friend'} invited you to ResumeBuildIn`)
            const body = encodeURIComponent(`Hey${inviteName ? ' ' + inviteName : ''},\n\nI've been using ResumeBuildIn to build my resume and I think you'd love it too!\n\nIt's free to get started — just click this link:\n${referralLink}\n\nCheers,\n${profile?.full_name || 'Your friend'}`)
            window.open(`mailto:${inviteEmail}?subject=${subject}&body=${body}`, '_blank')
            setInviteSent(true); toast.success('Opening email client...')
        } finally { setInviteSending(false) }
    }

    const handleSelectProvider = (provider: AIProvider) => {
        setSelectedProvider(provider)
        setAiProvider(provider)
        toast.success(`AI provider switched to ${PROVIDER_INFO[provider].name}`)
    }

    const handleCopyLink = () => { navigator.clipboard.writeText(`${window.location.origin}/auth?mode=signup&ref=${user.id}`); toast.success('Invite link copied to clipboard!') }
    const handleBilling = async () => { if (!profile?.stripe_customer_id) { navigate('/pricing'); return }; try { setPortalLoading(true); await openCustomerPortal() } catch { toast.error('Could not open billing portal.') } finally { setPortalLoading(false) } }
    const handleSignOut = async () => { await signOut(); navigate('/') }

    const planInfo = PLANS[profile?.plan || 'free']
    const resumeCount = resumes.length
    const resumeLimit = planInfo?.resumeLimit || 3
    const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'

    const sidebarItemBase = "flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-ink-40 bg-transparent border-none rounded-lg cursor-pointer transition-all no-underline w-full text-left hover:text-ink hover:bg-ink-05"
    const sidebarItemActive = "flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-ink bg-[var(--white)] border border-ink-10 rounded-lg cursor-pointer font-medium shadow-sm no-underline w-full text-left"

    return (
        <div className="min-h-screen bg-parchment">
            <Navbar />
            <div className="flex flex-col md:flex-row max-w-[1100px] mx-auto px-4 md:px-6 py-8 gap-8 min-h-[calc(100vh-60px)]">
                {/* Sidebar */}
                <aside className="w-full md:w-[260px] shrink-0 flex flex-col gap-5">
                    <div className="bg-[var(--white)] border border-ink-10 rounded-xl px-5 py-7 text-center shadow-sm">
                        <div className="w-16 h-16 rounded-full bg-ink dark:bg-gold text-parchment font-display text-2xl font-semibold flex items-center justify-center mx-auto mb-3">
                            {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="font-display text-lg text-ink mb-0.5">{profile?.full_name || 'User'}</div>
                        <div className="font-mono text-[11px] text-ink-40">{user?.email}</div>
                        <span className={`badge ${profile?.plan === 'pro' || profile?.plan === 'premium' || profile?.plan === 'career_plus' ? 'badge-gold' : 'badge-dark'} mt-2 inline-block`}>{profile?.plan === 'career_plus' ? 'CAREER+' : profile?.plan?.toUpperCase() || 'FREE'}</span>
                    </div>
                    <div className="flex flex-row md:flex-col gap-0.5 overflow-x-auto">
                        <button className={tab === 'general' ? sidebarItemActive : sidebarItemBase} onClick={() => setTab('general')}><span className="text-ink-40"><LandingIcon name="user" size={14} /></span> General</button>
                        <button className={tab === 'security' ? sidebarItemActive : sidebarItemBase} onClick={() => setTab('security')}><span className="text-ink-40"><LandingIcon name="lock" size={14} /></span> Security</button>
                        <button className={tab === 'ai' ? sidebarItemActive : sidebarItemBase} onClick={() => setTab('ai')}><span className="text-ink-40"><LandingIcon name="sparkles" size={14} /></span> AI Provider</button>
                        <button className={tab === 'invite' ? sidebarItemActive : sidebarItemBase} onClick={() => setTab('invite')}><span className="text-ink-40"><LandingIcon name="gift" size={14} /></span> Invite a Friend</button>
                    </div>
                    <div className="mt-auto flex flex-row md:flex-col gap-0.5 border-t border-ink-10 pt-4 justify-center md:justify-start">
                        <Link to="/dashboard" className={sidebarItemBase}><span>◈</span> Dashboard</Link>
                        <button className={`${sidebarItemBase} !text-rose hover:!bg-[rgba(225,29,72,0.06)] hover:!text-rose`} onClick={handleSignOut}><span>→</span> Sign Out</button>
                    </div>
                </aside>

                <main className="flex-1 min-w-0">
                    {tab === 'general' && (
                        <div className="flex flex-col gap-5 animate-[fadeUp_0.35s_ease_both]">
                            <div className="mb-1"><h2 className="text-[clamp(24px,3vw,32px)] mb-1.5">General Settings</h2><p className="text-[15px] text-ink-40">Manage your account information and preferences.</p></div>
                            <form onSubmit={handleSaveProfile} className="bg-[var(--white)] border border-ink-10 rounded-xl p-7 shadow-sm">
                                <h4 className="font-display text-lg text-ink mb-5 pb-3.5 border-b border-ink-05">Profile Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-1">
                                    <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" /></div>
                                    <div className="form-group"><label className="form-label">Email Address</label><input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />{email !== user?.email && <span className="form-error" style={{ color: 'var(--gold)', fontSize: 11 }}>ℹ A confirmation email will be sent to your new address</span>}</div>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-ink-05 mt-4"><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <><div className="spinner" /> Saving…</> : 'Save Changes'}</button></div>
                            </form>
                            <div className="bg-[var(--white)] border border-ink-10 rounded-xl p-7 shadow-sm">
                                <h4 className="font-display text-lg text-ink mb-5 pb-3.5 border-b border-ink-05">Account Overview</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[{ val: resumeCount, label: 'Resumes Created' }, { val: resumeLimit === Infinity ? '∞' : resumeLimit, label: 'Resume Limit' }, { val: memberSince, label: 'Member Since' }, { val: profile?.plan || 'free', label: 'Current Plan' }].map((s, i) => (
                                        <div key={i} className="text-center p-4 bg-parchment dark:bg-ink-05 rounded-lg">
                                            <div className="font-display text-[22px] text-ink mb-1 capitalize">{s.val}</div>
                                            <div className="font-mono text-[10px] tracking-wide uppercase text-ink-40">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end pt-4 border-t border-ink-05 mt-4">
                                    {profile?.plan === 'free' ? <Link to="/pricing" className="btn btn-gold">Upgrade to Pro →</Link> : <button className="btn btn-outline" onClick={handleBilling} disabled={portalLoading}>{portalLoading ? 'Opening…' : 'Manage Billing'}</button>}
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'security' && (
                        <div className="flex flex-col gap-5 animate-[fadeUp_0.35s_ease_both]">
                            <div className="mb-1"><h2 className="text-[clamp(24px,3vw,32px)] mb-1.5">Security</h2><p className="text-[15px] text-ink-40">Manage your password and account security.</p></div>
                            <form onSubmit={handleChangePassword} className="bg-[var(--white)] border border-ink-10 rounded-xl p-7 shadow-sm">
                                <h4 className="font-display text-lg text-ink mb-5 pb-3.5 border-b border-ink-05">Change Password</h4>
                                <div className="flex flex-col gap-4 mb-1">
                                    <div className="form-group"><label className="form-label">Current Password</label><input type="password" className="form-input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" /></div>
                                    <div className="form-group"><label className="form-label">New Password</label><input type="password" className="form-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="6+ characters" /></div>
                                    <div className="form-group"><label className="form-label">Confirm New Password</label><input type="password" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" /></div>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-ink-05 mt-4"><button type="submit" className="btn btn-primary" disabled={passwordSaving}>{passwordSaving ? <><div className="spinner" /> Updating…</> : 'Update Password'}</button></div>
                            </form>
                            <div className="bg-[var(--white)] border border-ink-10 rounded-xl p-7 shadow-sm">
                                <h4 className="font-display text-lg text-ink mb-5 pb-3.5 border-b border-ink-05">Password Tips</h4>
                                <div className="flex flex-col gap-3">
                                    {['Use at least 12 characters with a mix of letters, numbers, and symbols', "Don't reuse passwords from other websites", 'Consider using a password manager for convenience and security'].map((t, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-[13px] text-ink-70 leading-relaxed"><span className="text-emerald font-semibold shrink-0 mt-px">✓</span><span>{t}</span></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'ai' && (
                        <div className="flex flex-col gap-5 animate-[fadeUp_0.35s_ease_both]">
                            <div className="mb-1">
                                <h2 className="text-[clamp(24px,3vw,32px)] mb-1.5">AI Provider</h2>
                                <p className="text-[15px] text-ink-40">Choose which AI model powers your resume tools, support agent, and content generation.</p>
                            </div>

                            {/* Provider Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(Object.entries(PROVIDER_INFO) as [AIProvider, typeof PROVIDER_INFO[AIProvider]][]).map(([key, info]) => {
                                    const isActive = aiProvider === key
                                    const isConfigured = isProviderConfigured(key)
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => handleSelectProvider(key)}
                                            className="text-left bg-[var(--white)] border rounded-xl p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                                            style={{
                                                borderColor: isActive ? info.color : 'var(--ink-10)',
                                                borderWidth: isActive ? 2 : 1,
                                                outline: isActive ? `2px solid ${info.color}20` : 'none',
                                                outlineOffset: 2,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {/* Header row */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                                                        style={{ background: `linear-gradient(135deg, ${info.color}, ${info.color}CC)` }}
                                                    >
                                                        {info.icon}
                                                    </div>
                                                    <div>
                                                        <div className="font-display text-[15px] font-semibold text-ink">{info.name}</div>
                                                        <div className="text-[11px] font-mono text-ink-30 mt-0.5">{info.models}</div>
                                                    </div>
                                                </div>
                                                {/* Radio indicator */}
                                                <div
                                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                                                    style={{
                                                        borderColor: isActive ? info.color : 'var(--ink-20)',
                                                    }}
                                                >
                                                    {isActive && (
                                                        <div
                                                            className="w-2.5 h-2.5 rounded-full"
                                                            style={{ background: info.color }}
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-[13px] text-ink-50 leading-relaxed mb-4">{info.description}</p>

                                            {/* Status */}
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ background: isConfigured ? '#22c55e' : '#ef4444' }}
                                                />
                                                <span className="text-[11px] font-mono" style={{ color: isConfigured ? '#22c55e' : '#ef4444' }}>
                                                    {isConfigured ? 'API key configured' : 'API key missing'}
                                                </span>
                                            </div>

                                            {/* Active badge */}
                                            {isActive && (
                                                <div
                                                    className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                                                    style={{ background: `${info.color}15`, color: info.color }}
                                                >
                                                    <span>✦</span> Active Provider
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Info Card */}
                            <div className="bg-[var(--white)] border border-ink-10 rounded-xl p-7 shadow-sm">
                                <h4 className="font-display text-lg text-ink mb-5 pb-3.5 border-b border-ink-05">How It Works</h4>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { icon: '⚡', text: 'Select your preferred AI provider above. The change takes effect immediately for all AI features.' },
                                        { icon: '🔄', text: 'If your selected provider\'s API key is missing, the app will automatically fall back to the other provider.' },
                                        { icon: '🔑', text: 'API keys are configured in your project\'s .env file as VITE_GEMINI_API_KEY and VITE_CLAUDE_API_KEY.' },
                                        { icon: '🎯', text: 'Both providers are used for: AI text enhancement, resume parsing, weakness analysis, theme generation, and the support chatbot.' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-[13px] text-ink-70 leading-relaxed">
                                            <span className="shrink-0 mt-0.5 text-base">{item.icon}</span>
                                            <span>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Provider Comparison */}
                            <div className="bg-[var(--white)] border border-ink-10 rounded-xl p-7 shadow-sm">
                                <h4 className="font-display text-lg text-ink mb-5 pb-3.5 border-b border-ink-05">Provider Comparison</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-[13px]" style={{ borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr className="border-b border-ink-05">
                                                <th className="text-left py-2.5 px-3 font-mono text-[10px] tracking-wider uppercase text-ink-30 font-medium">Feature</th>
                                                <th className="text-center py-2.5 px-3 font-mono text-[10px] tracking-wider uppercase font-medium" style={{ color: PROVIDER_INFO.gemini.color }}>Gemini</th>
                                                <th className="text-center py-2.5 px-3 font-mono text-[10px] tracking-wider uppercase font-medium" style={{ color: PROVIDER_INFO.claude.color }}>Claude</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                ['Speed', 'Very Fast', '🏃 Fast'],
                                                ['Writing Quality', '🟢 Good', '🟢 Excellent'],
                                                ['JSON Parsing', '🟢 Excellent', '🟢 Great'],
                                                ['Creativity', '🟢 Good', '🟢 Excellent'],
                                                ['Streaming', '✅ Yes', '✅ Yes'],
                                                ['Cost', '💰 Low', '💰 Moderate'],
                                            ].map(([feature, gemini, claude], i) => (
                                                <tr key={i} className="border-b border-ink-05 last:border-none">
                                                    <td className="py-2.5 px-3 text-ink-60 font-medium">{feature}</td>
                                                    <td className="py-2.5 px-3 text-center text-ink-50">{gemini}</td>
                                                    <td className="py-2.5 px-3 text-center text-ink-50">{claude}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'invite' && (
                        <div className="flex flex-col gap-5 animate-[fadeUp_0.35s_ease_both]">
                            <div className="mb-1"><h2 className="text-[clamp(24px,3vw,32px)] mb-1.5">Invite a Friend</h2><p className="text-[15px] text-ink-40">Share ResumeBuildIn with friends and help them land their dream job.</p></div>
                            <div className="bg-gradient-to-br from-ink to-[#2a2820] rounded-xl px-8 py-10 text-center relative overflow-hidden">
                                <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_70%,rgba(201,146,60,0.1)_0%,transparent_50%)] pointer-events-none" />
                                <div className="flex justify-center mb-4 relative z-10 text-gold"><LandingIcon name="gift" size={40} /></div>
                                <h3 className="font-display text-2xl font-light text-parchment mb-2.5 relative z-10">Give the gift of a great resume</h3>
                                <p className="text-sm text-[rgba(250,248,243,0.5)] leading-relaxed max-w-[400px] mx-auto relative z-10">Know someone who's job hunting? Share ResumeBuildIn with them and help them put their best foot forward.</p>
                            </div>
                            <form onSubmit={handleSendInvite} className="bg-[var(--white)] border border-ink-10 rounded-xl p-7 shadow-sm">
                                <h4 className="font-display text-lg text-ink mb-5 pb-3.5 border-b border-ink-05">Send an Invitation</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-1">
                                    <div className="form-group"><label className="form-label">Friend's Name (optional)</label><input type="text" className="form-input" value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Their name" /></div>
                                    <div className="form-group"><label className="form-label">Friend's Email</label><input type="email" className="form-input" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="friend@example.com" required /></div>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-ink-05 mt-4"><button type="submit" className="btn btn-gold" disabled={inviteSending || inviteSent}>{inviteSent ? '✓ Invitation Sent!' : inviteSending ? <><div className="spinner" /> Sending…</> : 'Send Invitation →'}</button></div>
                            </form>
                            <div className="bg-[var(--white)] border border-ink-10 rounded-xl p-7 shadow-sm">
                                <h4 className="font-display text-lg text-ink mb-5 pb-3.5 border-b border-ink-05">Or Share Your Link</h4>
                                <p className="text-sm text-ink-40 leading-relaxed mb-4">Copy your personal referral link and share it anywhere — email, social media, or text.</p>
                                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                                    <input type="text" className="form-input flex-1 font-mono text-xs" value={`${window.location.origin}/auth?mode=signup&ref=${user?.id || ''}`} readOnly />
                                    <button type="button" className="btn btn-outline btn-sm" onClick={handleCopyLink}>Copy</button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
