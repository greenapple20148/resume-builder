'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'
import { toast } from '../components/Toast'
import { useStore } from '@/lib/store'
import { useSEO } from '@/lib/useSEO'
import { redeemCoupon, isCouponActive, formatCouponCountdown, getCouponRemainingDays } from '@/lib/coupon'
import { getEffectivePlan } from '@/lib/expressUnlock'
import { PLANS } from '@/lib/stripe'

export default function RedeemCouponPage() {
    const { user, profile, fetchProfile } = useStore()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [code, setCode] = useState(searchParams?.get('code') || '')
    const [loading, setLoading] = useState(false)
    const [redeemed, setRedeemed] = useState(false)
    const [redeemedPlan, setRedeemedPlan] = useState<string | null>(null)
    const [redeemedDays, setRedeemedDays] = useState<number>(90)

    useSEO({
        title: 'Redeem Coupon — Get Free Pro Access',
        description: 'Enter your coupon code to unlock free Pro access to ResumeBuildIn. Build unlimited resumes, export without watermarks, and access premium features.',
        path: '/redeem',
    })

    // If user has an active coupon, show their status
    const hasActiveCoupon = isCouponActive(profile)
    const couponPlan = hasActiveCoupon ? (PLANS as any)[getEffectivePlan(profile)] : null

    const handleRedeem = async () => {
        if (!code.trim()) {
            toast.error('Please enter a coupon code.')
            return
        }
        if (!user) {
            // Save code to localStorage and redirect to signup
            localStorage.setItem('pending_coupon_code', code.trim().toUpperCase())
            router.push('/auth?mode=signup&redirect=/redeem')
            return
        }

        setLoading(true)
        try {
            const result = await redeemCoupon(code)
            if (result.success) {
                setRedeemed(true)
                setRedeemedPlan(result.plan || 'pro')
                setRedeemedDays(result.duration_days || 90)
                toast.success(`🎉 Coupon applied! Enjoy ${result.duration_days || 90} days of free ${(PLANS as any)[result.plan || 'pro']?.name || 'Pro'} access!`)
                if (user) await fetchProfile(user.id)
            } else {
                toast.error(result.error || 'Could not redeem coupon.')
            }
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    // Auto-redeem pending coupon after login redirect
    useEffect(() => {
        if (!user) return
        const pendingCode = localStorage.getItem('pending_coupon_code')
        if (pendingCode && !hasActiveCoupon) {
            setCode(pendingCode)
            localStorage.removeItem('pending_coupon_code')
            // Auto-submit
            setTimeout(async () => {
                setLoading(true)
                try {
                    const result = await redeemCoupon(pendingCode)
                    if (result.success) {
                        setRedeemed(true)
                        setRedeemedPlan(result.plan || 'pro')
                        setRedeemedDays(result.duration_days || 90)
                        toast.success(`🎉 Coupon applied! Enjoy ${result.duration_days || 90} days of free ${(PLANS as any)[result.plan || 'pro']?.name || 'Pro'} access!`)
                        if (user) await fetchProfile(user.id)
                    } else {
                        toast.error(result.error || 'Could not redeem coupon.')
                    }
                } catch (err: any) {
                    toast.error(err.message || 'Something went wrong.')
                } finally {
                    setLoading(false)
                }
            }, 500)
        }
    }, [user?.id])

    // Auto-populate from URL param
    useEffect(() => {
        const urlCode = searchParams?.get('code')
        if (urlCode) setCode(urlCode)
    }, [searchParams])

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="max-w-[520px] mx-auto px-5 sm:px-10 pt-12 pb-20">

                {/* ── Header ── */}
                <div className="text-center mb-10">
                    <div className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-2xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(212,163,88,0.15), rgba(212,163,88,0.05))',
                            border: '1.5px solid rgba(212,163,88,0.3)',
                        }}>
                        <span className="text-3xl">🎁</span>
                    </div>
                    <h1 className="text-3xl mb-2.5">Redeem your <em className="italic text-gold">coupon</em></h1>
                    <p className="text-[15px] text-ink-40">Enter your code below to unlock free premium access.</p>
                </div>

                {/* ── Already has active coupon ── */}
                {hasActiveCoupon && !redeemed && (
                    <div className="mb-8 px-6 py-5 rounded-xl border-[1.5px] border-emerald/30"
                        style={{ background: 'linear-gradient(135deg, rgba(76,175,122,0.08), rgba(76,175,122,0.02))' }}>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-8 h-8 rounded-full bg-emerald/15 text-emerald text-sm font-bold flex items-center justify-center">✓</span>
                            <strong className="text-[15px] text-ink">Coupon Active</strong>
                        </div>
                        <p className="text-[13px] text-ink-40 mb-3">
                            You're currently enjoying <strong className="text-ink">{couponPlan?.name || 'Pro'}</strong> access via coupon code <code className="text-xs bg-ink-05 px-1.5 py-0.5 rounded">{profile?.coupon_code}</code>.
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-ink-20 font-mono">{formatCouponCountdown(profile)} remaining</span>
                            <Link href="/dashboard" className="btn btn-gold text-xs py-1.5 px-4">Go to Dashboard →</Link>
                        </div>
                    </div>
                )}

                {/* ── Redemption Success ── */}
                {redeemed && (
                    <div className="mb-8 text-center animate-[fadeUp_0.5s_ease_both]">
                        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-emerald to-[#34d399] text-white inline-flex items-center justify-center">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <h2 className="text-2xl mb-2">You're all set! 🎉</h2>
                        <p className="text-[15px] text-ink-40 mb-2">
                            You now have <strong className="text-ink">{redeemedDays} days</strong> of free <strong className="text-gold">{(PLANS as any)[redeemedPlan || 'pro']?.name || 'Pro'}</strong> access.
                        </p>
                        <p className="text-[13px] text-ink-20 mb-8">All premium features are unlocked — no credit card needed.</p>

                        <div className="bg-[var(--white)] border border-ink-10 rounded-xl p-5 mb-6 text-left">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-ink-20 font-semibold mb-3">What you've unlocked</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[
                                    'All resume templates (100+)',
                                    'Unlimited PDF downloads',
                                    'DOCX export',
                                    'No watermark',
                                    'Cover letter builder',
                                    'Priority support',
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[13px] text-ink-70">
                                        <span className="w-[18px] h-[18px] rounded-full bg-[#dcfce7] dark:bg-[rgba(76,175,122,0.15)] text-emerald text-[10px] font-bold flex items-center justify-center shrink-0">✓</span>
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <Link href="/dashboard" className="btn btn-gold w-full py-3">Go to Dashboard →</Link>
                            <Link href="/editor/new" className="btn btn-outline w-full py-3">Create a Resume →</Link>
                        </div>
                    </div>
                )}

                {/* ── Coupon Input Form ── */}
                {!redeemed && !hasActiveCoupon && (
                    <div className="bg-[var(--white)] border-[1.5px] border-ink-10 rounded-xl p-7 mb-6">
                        <label className="block text-[13px] font-semibold text-ink mb-2" htmlFor="coupon-code">Coupon Code</label>
                        <div className="flex gap-3">
                            <input
                                id="coupon-code"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleRedeem() }}
                                placeholder="e.g. LAUNCH3"
                                className="flex-1 px-4 py-3 rounded-lg border border-ink-10 bg-transparent text-ink text-base font-mono tracking-widest uppercase placeholder:text-ink-20 placeholder:tracking-normal placeholder:normal-case placeholder:font-sans focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                                autoFocus
                                autoComplete="off"
                                maxLength={30}
                                disabled={loading}
                            />
                            <button
                                className="btn btn-gold py-3 px-6 shrink-0"
                                onClick={handleRedeem}
                                disabled={loading || !code.trim()}
                            >
                                {loading ? (
                                    <><div className="spinner" style={{ width: 16, height: 16 }} /> Applying…</>
                                ) : (
                                    'Redeem'
                                )}
                            </button>
                        </div>
                        <p className="text-[12px] text-ink-20 mt-3">
                            {user
                                ? 'Enter your coupon code to unlock free premium access.'
                                : "You\u2019ll be asked to create a free account before your coupon is applied."}
                        </p>
                    </div>
                )}

                {/* ── How it works ── */}
                {!redeemed && (
                    <div className="bg-ink-05 rounded-xl p-6 mb-6">
                        <h3 className="text-[14px] font-semibold mb-4">How coupon codes work</h3>
                        <div className="flex flex-col gap-3.5">
                            {[
                                { step: '1', title: 'Enter your code', desc: 'Type or paste the coupon code you received.' },
                                { step: '2', title: 'Get instant access', desc: 'All Pro features unlock immediately — no credit card required.' },
                                { step: '3', title: 'When it expires', desc: "You\u2019ll be moved back to the free plan, or you can upgrade to keep your access." },
                            ].map(s => (
                                <div key={s.step} className="flex items-start gap-3.5">
                                    <div className="w-7 h-7 rounded-full bg-gold-pale text-gold text-xs font-bold flex items-center justify-center shrink-0 font-mono">{s.step}</div>
                                    <div>
                                        <strong className="block text-[13px] mb-0.5">{s.title}</strong>
                                        <p className="text-[12px] text-ink-40 m-0">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Don't have a code? ── */}
                {!redeemed && (
                    <div className="text-center">
                        <p className="text-[13px] text-ink-20">
                            Don&apos;t have a code? <Link href="/pricing" className="text-gold no-underline hover:underline">View our plans →</Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
