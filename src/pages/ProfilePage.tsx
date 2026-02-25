import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStore } from '../lib/store'
import { toast } from '../components/Toast'
import { PLANS, openCustomerPortal } from '../lib/stripe'
import { supabase } from '../lib/supabase'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
    const { user, profile, signOut, updateProfile, resetPassword, fetchResumes, resumes } = useStore()
    const navigate = useNavigate()
    const [tab, setTab] = useState<'general' | 'security' | 'invite'>('general')

    // Profile form state
    const [fullName, setFullName] = useState(profile?.full_name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [saving, setSaving] = useState(false)

    // Password form
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordSaving, setPasswordSaving] = useState(false)

    // Invite friend
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteName, setInviteName] = useState('')
    const [inviteSending, setInviteSending] = useState(false)
    const [inviteSent, setInviteSent] = useState(false)

    // Billing
    const [portalLoading, setPortalLoading] = useState(false)

    useEffect(() => {
        fetchResumes()
    }, [fetchResumes])

    useEffect(() => {
        if (profile) setFullName(profile.full_name || '')
        if (user) setEmail(user.email || '')
    }, [profile, user])

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!fullName.trim()) {
            toast.error('Name cannot be empty')
            return
        }
        setSaving(true)
        try {
            await updateProfile({ full_name: fullName, email })
            toast.success('Profile updated!')
            if (email !== user?.email) {
                toast.success('Check your new email to confirm the change.')
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        setPasswordSaving(true)
        try {
            // Verify current password by re-authenticating
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            })
            if (signInError) {
                toast.error('Current password is incorrect')
                setPasswordSaving(false)
                return
            }

            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            })
            if (error) throw error
            toast.success('Password updated successfully!')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err: any) {
            toast.error(err.message || 'Failed to update password')
        } finally {
            setPasswordSaving(false)
        }
    }

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inviteEmail.includes('@')) {
            toast.error('Please enter a valid email address')
            return
        }
        setInviteSending(true)
        try {
            // Use Supabase's invite function or send a custom invite
            const { error } = await supabase.auth.admin.inviteUserByEmail(inviteEmail)
            if (error) {
                // Fallback — construct the invite link manually
                const referralLink = `${window.location.origin}/auth?mode=signup&ref=${user.id}`
                // Open mailto as fallback
                const subject = encodeURIComponent(`${profile?.full_name || 'A friend'} invited you to ResumeBuildIn`)
                const body = encodeURIComponent(
                    `Hey${inviteName ? ' ' + inviteName : ''},\n\n` +
                    `I've been using ResumeBuildIn to build my resume and I think you'd love it too!\n\n` +
                    `It's free to get started — just click this link:\n${referralLink}\n\n` +
                    `Cheers,\n${profile?.full_name || 'Your friend'}`
                )
                window.open(`mailto:${inviteEmail}?subject=${subject}&body=${body}`, '_blank')
            }
            setInviteSent(true)
            toast.success(`Invitation sent to ${inviteEmail}!`)
            setTimeout(() => {
                setInviteEmail('')
                setInviteName('')
                setInviteSent(false)
            }, 3000)
        } catch (err: any) {
            // Fallback to mailto
            const referralLink = `${window.location.origin}/auth?mode=signup&ref=${user.id}`
            const subject = encodeURIComponent(`${profile?.full_name || 'A friend'} invited you to ResumeBuildIn`)
            const body = encodeURIComponent(
                `Hey${inviteName ? ' ' + inviteName : ''},\n\n` +
                `I've been using ResumeBuildIn to build my resume and I think you'd love it too!\n\n` +
                `It's free to get started — just click this link:\n${referralLink}\n\n` +
                `Cheers,\n${profile?.full_name || 'Your friend'}`
            )
            window.open(`mailto:${inviteEmail}?subject=${subject}&body=${body}`, '_blank')
            setInviteSent(true)
            toast.success('Opening email client...')
        } finally {
            setInviteSending(false)
        }
    }

    const handleCopyLink = () => {
        const referralLink = `${window.location.origin}/auth?mode=signup&ref=${user.id}`
        navigator.clipboard.writeText(referralLink)
        toast.success('Invite link copied to clipboard!')
    }

    const handleBilling = async () => {
        if (!profile?.stripe_customer_id) {
            navigate('/pricing')
            return
        }
        try {
            setPortalLoading(true)
            await openCustomerPortal()
        } catch {
            toast.error('Could not open billing portal.')
        } finally {
            setPortalLoading(false)
        }
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    const planInfo = PLANS[profile?.plan || 'free']
    const resumeCount = resumes.length
    const resumeLimit = planInfo?.resumeLimit || 3
    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        })
        : '—'

    return (
        <div className={styles.page}>
            <Navbar />

            <div className={styles.layout}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.profileCard}>
                        <div className={styles.avatar}>
                            {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className={styles.profileName}>{profile?.full_name || 'User'}</div>
                        <div className={styles.profileEmail}>{user?.email}</div>
                        <span className={`badge ${profile?.plan === 'pro' || profile?.plan === 'premium' ? 'badge-gold' : 'badge-dark'}`} style={{ marginTop: 8 }}>
                            {profile?.plan?.toUpperCase() || 'FREE'}
                        </span>
                    </div>

                    <div className={styles.sidebarNav}>
                        <button
                            className={`${styles.sidebarItem} ${tab === 'general' ? styles.active : ''}`}
                            onClick={() => setTab('general')}
                        >
                            <span>👤</span> General
                        </button>
                        <button
                            className={`${styles.sidebarItem} ${tab === 'security' ? styles.active : ''}`}
                            onClick={() => setTab('security')}
                        >
                            <span>🔒</span> Security
                        </button>
                        <button
                            className={`${styles.sidebarItem} ${tab === 'invite' ? styles.active : ''}`}
                            onClick={() => setTab('invite')}
                        >
                            <span>💌</span> Invite a Friend
                        </button>
                    </div>

                    <div className={styles.sidebarFooter}>
                        <Link to="/dashboard" className={styles.sidebarItem}>
                            <span>◈</span> Dashboard
                        </Link>
                        <button className={`${styles.sidebarItem} ${styles.signOutBtn}`} onClick={handleSignOut}>
                            <span>→</span> Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main content */}
                <main className={styles.main}>
                    {/* GENERAL TAB */}
                    {tab === 'general' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>General Settings</h2>
                                <p>Manage your account information and preferences.</p>
                            </div>

                            <form onSubmit={handleSaveProfile} className={styles.formCard}>
                                <h4 className={styles.formCardTitle}>Profile Information</h4>
                                <div className={styles.formGrid}>
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                        />
                                        {email !== user?.email && (
                                            <span className="form-error" style={{ color: 'var(--gold)', fontSize: 11 }}>
                                                ℹ A confirmation email will be sent to your new address
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.formActions}>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? <><div className="spinner" /> Saving…</> : 'Save Changes'}
                                    </button>
                                </div>
                            </form>

                            {/* Account stats card */}
                            <div className={styles.formCard}>
                                <h4 className={styles.formCardTitle}>Account Overview</h4>
                                <div className={styles.statGrid}>
                                    <div className={styles.statItem}>
                                        <div className={styles.statValue}>{resumeCount}</div>
                                        <div className={styles.statLabel}>Resumes Created</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statValue}>{resumeLimit === Infinity ? '∞' : resumeLimit}</div>
                                        <div className={styles.statLabel}>Resume Limit</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statValue}>{memberSince}</div>
                                        <div className={styles.statLabel}>Member Since</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statValue} style={{ textTransform: 'capitalize' }}>
                                            {profile?.plan || 'free'}
                                        </div>
                                        <div className={styles.statLabel}>Current Plan</div>
                                    </div>
                                </div>
                                <div className={styles.formActions}>
                                    {profile?.plan === 'free' ? (
                                        <Link to="/pricing" className="btn btn-gold">
                                            Upgrade to Pro →
                                        </Link>
                                    ) : (
                                        <button className="btn btn-outline" onClick={handleBilling} disabled={portalLoading}>
                                            {portalLoading ? 'Opening…' : 'Manage Billing'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {tab === 'security' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>Security</h2>
                                <p>Manage your password and account security.</p>
                            </div>

                            <form onSubmit={handleChangePassword} className={styles.formCard}>
                                <h4 className={styles.formCardTitle}>Change Password</h4>
                                <div className={styles.formStack}>
                                    <div className="form-group">
                                        <label className="form-label">Current Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="6+ characters"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter new password"
                                        />
                                    </div>
                                </div>
                                <div className={styles.formActions}>
                                    <button type="submit" className="btn btn-primary" disabled={passwordSaving}>
                                        {passwordSaving ? <><div className="spinner" /> Updating…</> : 'Update Password'}
                                    </button>
                                </div>
                            </form>

                            {/* Password tips */}
                            <div className={styles.formCard}>
                                <h4 className={styles.formCardTitle}>Password Tips</h4>
                                <div className={styles.tipsList}>
                                    <div className={styles.tip}>
                                        <span className={styles.tipIcon}>✓</span>
                                        <span>Use at least 12 characters with a mix of letters, numbers, and symbols</span>
                                    </div>
                                    <div className={styles.tip}>
                                        <span className={styles.tipIcon}>✓</span>
                                        <span>Don't reuse passwords from other websites</span>
                                    </div>
                                    <div className={styles.tip}>
                                        <span className={styles.tipIcon}>✓</span>
                                        <span>Consider using a password manager for convenience and security</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INVITE TAB */}
                    {tab === 'invite' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>Invite a Friend</h2>
                                <p>Share ResumeBuildIn with friends and help them land their dream job.</p>
                            </div>

                            <div className={styles.inviteHero}>
                                <div className={styles.inviteHeroIcon}>🎁</div>
                                <h3>Give the gift of a great resume</h3>
                                <p>
                                    Know someone who's job hunting? Share ResumeBuildIn with them and
                                    help them put their best foot forward.
                                </p>
                            </div>

                            <form onSubmit={handleSendInvite} className={styles.formCard}>
                                <h4 className={styles.formCardTitle}>Send an Invitation</h4>
                                <div className={styles.formGrid}>
                                    <div className="form-group">
                                        <label className="form-label">Friend's Name (optional)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={inviteName}
                                            onChange={(e) => setInviteName(e.target.value)}
                                            placeholder="Their name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Friend's Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            placeholder="friend@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles.formActions}>
                                    <button type="submit" className="btn btn-gold" disabled={inviteSending || inviteSent}>
                                        {inviteSent ? (
                                            '✓ Invitation Sent!'
                                        ) : inviteSending ? (
                                            <><div className="spinner" /> Sending…</>
                                        ) : (
                                            'Send Invitation →'
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Or share a link */}
                            <div className={styles.formCard}>
                                <h4 className={styles.formCardTitle}>Or Share Your Link</h4>
                                <p className={styles.shareDesc}>
                                    Copy your personal referral link and share it anywhere — email, social media, or text.
                                </p>
                                <div className={styles.shareLinkRow}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={`${window.location.origin}/auth?mode=signup&ref=${user?.id || ''}`}
                                        readOnly
                                        style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                                    />
                                    <button type="button" className="btn btn-outline btn-sm" onClick={handleCopyLink}>
                                        📋 Copy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
