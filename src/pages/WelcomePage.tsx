import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStore } from '../lib/store'
import { PLANS, verifySubscription } from '../lib/stripe'
import styles from './WelcomePage.module.css'

const CONFETTI_COLORS = ['#c9923c', '#d4b96a', '#e8d5a3', '#4caf7a', '#64b5f6', '#f87171', '#a78bfa']

function Confetti() {
    const [pieces] = useState(() =>
        Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 2,
            duration: 2 + Math.random() * 2,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            size: 6 + Math.random() * 6,
            rotation: Math.random() * 360,
        }))
    )

    return (
        <div className={styles.confettiContainer}>
            {pieces.map(p => (
                <div
                    key={p.id}
                    className={styles.confettiPiece}
                    style={{
                        left: `${p.left}%`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        backgroundColor: p.color,
                        width: p.size,
                        height: p.size * 0.5,
                        transform: `rotate(${p.rotation}deg)`,
                    }}
                />
            ))}
        </div>
    )
}

export default function WelcomePage() {
    const { user, profile, fetchProfile } = useStore()
    const [showContent, setShowContent] = useState(false)
    const [verifiedPlan, setVerifiedPlan] = useState<string | null>(null)

    // Use verified plan from Stripe (authoritative), fallback to profile
    const planId = verifiedPlan || profile?.plan || 'pro'
    const plan = (PLANS as any)[planId] || PLANS.pro

    // Verify the latest subscription with Stripe in background
    useEffect(() => {
        if (!user) return
        verifySubscription()
            .then(result => {
                if (result.plan && result.plan !== 'free') {
                    setVerifiedPlan(result.plan)
                }
                fetchProfile(user.id)
            })
            .catch(err => console.error('Plan sync error:', err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id])

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 300)
        return () => clearTimeout(timer)
    }, [])

    const isPremium = planId === 'premium'

    return (
        <div className={styles.page}>
            <Navbar />
            <Confetti />

            <div className={`${styles.container} ${showContent ? styles.containerVisible : ''}`}>
                {/* Success Icon */}
                <div className={styles.successIcon}>
                    <div className={styles.successCircle}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>

                <h1 className={styles.title}>
                    Welcome to <em>{plan.name}</em>! 🎉
                </h1>
                <p className={styles.subtitle}>
                    Your payment was successful. You now have full access to all {plan.name} features.
                </p>

                {/* Plan Summary */}
                <div className={styles.planSummary}>
                    <div className={styles.planSummaryHeader}>
                        <span className="badge badge-gold">{plan.name} Plan</span>
                        <span className={styles.planSummaryPrice}>
                            ${plan.priceMonthly}/mo
                        </span>
                    </div>
                    <div className={styles.planSummaryFeatures}>
                        {plan.features.filter((f: any) => f.included).slice(0, 6).map((f: any, i: number) => (
                            <div key={i} className={styles.planSummaryFeature}>
                                <span className={styles.checkMark}>✓</span>
                                {f.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Start Actions */}
                <div className={styles.quickStart}>
                    <h2>Get started</h2>
                    <div className={styles.actionGrid}>
                        <Link to="/editor/new" className={styles.actionCard}>
                            <div className={styles.actionIcon}>📄</div>
                            <div className={styles.actionContent}>
                                <strong>Create a Resume</strong>
                                <p>Start building with all {plan.name} templates</p>
                            </div>
                            <span className={styles.actionArrow}>→</span>
                        </Link>

                        <Link to="/themes" className={styles.actionCard}>
                            <div className={styles.actionIcon}>🎨</div>
                            <div className={styles.actionContent}>
                                <strong>Browse Themes</strong>
                                <p>Preview all {plan.themeLimit === Infinity ? '' : plan.themeLimit} premium templates</p>
                            </div>
                            <span className={styles.actionArrow}>→</span>
                        </Link>

                        {isPremium && (
                            <>
                                <Link to="/tools/linkedin" className={styles.actionCard}>
                                    <div className={styles.actionIcon}>🔗</div>
                                    <div className={styles.actionContent}>
                                        <strong>LinkedIn Toolkit</strong>
                                        <p>Generate headlines, about sections & rewrites</p>
                                    </div>
                                    <span className={styles.actionArrow}>→</span>
                                </Link>

                                <Link to="/tools/interview" className={styles.actionCard}>
                                    <div className={styles.actionIcon}>🎤</div>
                                    <div className={styles.actionContent}>
                                        <strong>Interview Toolkit</strong>
                                        <p>Practice with role-specific questions & STAR stories</p>
                                    </div>
                                    <span className={styles.actionArrow}>→</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Go to dashboard */}
                <div className={styles.dashboardCta}>
                    <Link to="/dashboard" className="btn btn-gold btn-lg">
                        Go to Dashboard →
                    </Link>
                    <p className={styles.ctaCaveat}>
                        Need help? Reach us at <a href="mailto:support@resumebuildin.io">support@resumebuildin.io</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
