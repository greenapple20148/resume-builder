import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import styles from './ConfirmEmailPage.module.css'

export default function ConfirmEmailPage() {
    return (
        <div className={styles.page}>
            <Navbar variant="transparent" />

            <div className={styles.container}>
                <div className={styles.card}>
                    {/* Decorative top border */}
                    <div className={styles.cardAccent} />

                    <div className={styles.iconWrapper}>
                        <div className={styles.iconRing}>
                            <div className={styles.iconInner}>✉</div>
                        </div>
                        <div className={styles.sparkle1}>✦</div>
                        <div className={styles.sparkle2}>✦</div>
                        <div className={styles.sparkle3}>✦</div>
                    </div>

                    <h1 className={styles.title}>
                        Check your <em>inbox</em>
                    </h1>

                    <p className={styles.subtitle}>
                        We've sent a confirmation link to your email address. Click the link
                        to verify your account and start building your resume.
                    </p>

                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>1</div>
                            <div className={styles.stepText}>
                                <strong>Open your email</strong>
                                <span>Look for an email from ResumeBuildIn</span>
                            </div>
                        </div>
                        <div className={styles.stepConnector} />
                        <div className={styles.step}>
                            <div className={styles.stepNum}>2</div>
                            <div className={styles.stepText}>
                                <strong>Click "Confirm My Email"</strong>
                                <span>This verifies your account</span>
                            </div>
                        </div>
                        <div className={styles.stepConnector} />
                        <div className={styles.step}>
                            <div className={styles.stepNum}>3</div>
                            <div className={styles.stepText}>
                                <strong>Start building</strong>
                                <span>You'll be redirected to your dashboard</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.helpSection}>
                        <p className={styles.helpText}>
                            Didn't receive the email? Check your spam folder or try signing up again.
                        </p>
                        <div className={styles.helpActions}>
                            <Link to="/auth?mode=signup" className="btn btn-outline btn-sm">
                                ← Try Again
                            </Link>
                            <Link to="/auth?mode=signin" className="btn btn-ghost btn-sm">
                                Sign In Instead
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Background decoration */}
                <div className={styles.bgDecor1} />
                <div className={styles.bgDecor2} />
            </div>
        </div>
    )
}
