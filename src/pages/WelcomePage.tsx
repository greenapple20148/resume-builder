import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStore } from '../lib/store'
import { PLANS, verifySubscription } from '../lib/stripe'
import { LandingIcon } from '../components/LandingIcons'

const CONFETTI_COLORS = ['#c9923c', '#d4b96a', '#e8d5a3', '#4caf7a', '#64b5f6', '#f87171', '#a78bfa']

function Confetti() {
    const [pieces] = useState(() =>
        Array.from({ length: 50 }, (_, i) => ({
            id: i, left: Math.random() * 100, delay: Math.random() * 2,
            duration: 2 + Math.random() * 2, color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            size: 6 + Math.random() * 6, rotation: Math.random() * 360,
        }))
    )
    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            {pieces.map(p => (
                <div key={p.id} className="absolute -top-5 rounded-sm animate-[confettiFall_linear_forwards] opacity-0"
                    style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`, backgroundColor: p.color, width: p.size, height: p.size * 0.5, transform: `rotate(${p.rotation}deg)` }} />
            ))}
        </div>
    )
}

export default function WelcomePage() {
    const { user, profile, fetchProfile } = useStore()
    const [showContent, setShowContent] = useState(false)
    const [verifiedPlan, setVerifiedPlan] = useState<string | null>(null)
    const planId = verifiedPlan || profile?.plan || 'pro'
    const plan = (PLANS as any)[planId] || PLANS.pro

    useEffect(() => {
        if (!user) return
        verifySubscription().then(result => { if (result.plan && result.plan !== 'free') setVerifiedPlan(result.plan); fetchProfile(user.id) }).catch(err => console.error('Plan sync error:', err))
    }, [user?.id])

    useEffect(() => { const timer = setTimeout(() => setShowContent(true), 300); return () => clearTimeout(timer) }, [])

    const isPremium = planId === 'premium'

    return (
        <div className="min-h-screen relative overflow-hidden">
            <Navbar />
            <Confetti />
            <div className={`max-w-[640px] mx-auto px-5 sm:px-10 pt-10 pb-20 text-center transition-all duration-[600ms] ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <div className="mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald to-[#34d399] text-white inline-flex items-center justify-center animate-[scaleIn_0.5s_ease_0.3s_both]">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                </div>
                <h1 className="text-4xl mb-3 animate-[fadeUp_0.5s_ease_0.5s_both]">Welcome to <em className="italic text-gold">{plan.name}</em>!</h1>
                <p className="text-[17px] text-ink-40 mb-9 leading-relaxed animate-[fadeUp_0.5s_ease_0.6s_both]">Your payment was successful. You now have full access to all {plan.name} features.</p>

                <div className="bg-[var(--white)] border-[1.5px] border-gold-pale rounded-xl px-7 py-6 mb-9 text-left animate-[fadeUp_0.5s_ease_0.7s_both]">
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-ink-10">
                        <span className="badge badge-gold">{plan.name} Plan</span>
                        <span className="text-xl font-semibold text-ink font-display">${plan.priceMonthly}/mo</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {plan.features.filter((f: any) => f.included).slice(0, 6).map((f: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-[13px] text-ink-70">
                                <span className="w-[18px] h-[18px] rounded-full bg-[#dcfce7] dark:bg-[rgba(76,175,122,0.15)] text-emerald text-[10px] font-bold flex items-center justify-center shrink-0">✓</span>
                                {f.text}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-10 animate-[fadeUp_0.5s_ease_0.8s_both]">
                    <h2 className="text-lg mb-4 text-left">Get started</h2>
                    <div className="flex flex-col gap-2.5">
                        {[
                            { to: '/editor/new', icon: 'file-text', title: 'Create a Resume', desc: `Start building with all ${plan.name} templates` },
                            { to: '/themes', icon: 'layers', title: 'Browse Themes', desc: `Preview all ${plan.themeLimit === Infinity ? '' : plan.themeLimit} premium templates` },
                            ...(isPremium ? [
                                { to: '/tools/linkedin', icon: 'linkedin', title: 'LinkedIn Toolkit', desc: 'Generate headlines, about sections & rewrites' },
                                { to: '/tools/interview', icon: 'mic', title: 'Interview Toolkit', desc: 'Practice with role-specific questions & STAR stories' },
                            ] : []),
                        ].map((a) => (
                            <Link key={a.to} to={a.to} className="group flex items-center gap-4 px-5 py-4 bg-[var(--white)] border border-ink-10 rounded-xl no-underline text-ink transition-all hover:border-gold-pale hover:shadow-md hover:translate-x-1">
                                <div className="shrink-0 text-gold"><LandingIcon name={a.icon} size={26} /></div>
                                <div className="flex-1 text-left">
                                    <strong className="block text-[15px] mb-0.5">{a.title}</strong>
                                    <p className="text-[13px] text-ink-40 m-0">{a.desc}</p>
                                </div>
                                <span className="text-lg text-ink-20 shrink-0 transition-all group-hover:text-gold group-hover:translate-x-1">→</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="animate-[fadeUp_0.5s_ease_0.9s_both]">
                    <Link to="/dashboard" className="btn btn-gold btn-lg">Go to Dashboard →</Link>
                    <p className="text-[13px] text-ink-20 mt-4">Need help? Reach us at <a href="mailto:support@resumebuildin.io" className="text-gold no-underline hover:underline">support@resumebuildin.io</a></p>
                </div>
            </div>
        </div>
    )
}
