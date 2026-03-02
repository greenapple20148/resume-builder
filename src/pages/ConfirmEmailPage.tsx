import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function ConfirmEmailPage() {
    return (
        <div className="min-h-screen bg-parchment">
            <Navbar variant="transparent" />
            <div className="flex items-center justify-center min-h-[calc(100vh-60px)] px-6 py-10 relative overflow-hidden">
                <div className="w-full max-w-[520px] bg-[var(--white)] border border-ink-10 rounded-xl shadow-lg px-10 py-12 text-center relative overflow-hidden animate-[fadeUp_0.5s_ease_both]">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-emerald" />
                    <div className="relative w-24 h-24 mx-auto mb-7">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-pale to-[#dcfce7] flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
                            <div className="text-[40px] animate-[bounce_2s_ease-in-out_infinite]">✉</div>
                        </div>
                        <div className="absolute top-1 right-1 text-gold text-xs animate-[sparkle_2s_ease-in-out_infinite]">✦</div>
                        <div className="absolute bottom-2 left-0 text-gold text-xs animate-[sparkle_2s_ease-in-out_infinite_0.6s]">✦</div>
                        <div className="absolute top-3 left-2 text-gold text-xs animate-[sparkle_2s_ease-in-out_infinite_1.2s]">✦</div>
                    </div>
                    <h1 className="font-display text-[clamp(28px,4vw,36px)] font-light text-ink mb-3 tracking-tight">Check your <em className="italic text-gold">inbox</em></h1>
                    <p className="text-[15px] leading-[1.7] text-ink-40 max-w-[400px] mx-auto mb-8">We've sent a confirmation link to your email address. Click the link to verify your account and start building your resume.</p>
                    <div className="flex flex-col items-start gap-0 max-w-[340px] mx-auto">
                        {[
                            { n: '1', title: 'Open your email', desc: 'Look for an email from ResumeBuildIn' },
                            { n: '2', title: 'Click "Confirm My Email"', desc: 'This verifies your account' },
                            { n: '3', title: 'Start building', desc: "You'll be redirected to your dashboard" },
                        ].map((step, i) => (
                            <div key={i}>
                                {i > 0 && <div className="w-0.5 h-5 bg-ink-10 ml-[15px]" />}
                                <div className="flex items-start gap-4 text-left">
                                    <div className="w-8 h-8 rounded-full bg-ink dark:bg-gold text-parchment font-display text-sm font-semibold flex items-center justify-center shrink-0">{step.n}</div>
                                    <div className="flex flex-col gap-0.5 pt-1">
                                        <strong className="text-sm font-semibold text-ink">{step.title}</strong>
                                        <span className="text-[13px] text-ink-40">{step.desc}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-ink-10 to-transparent my-7" />
                    <div className="pt-1">
                        <p className="text-[13px] text-ink-20 mb-4 leading-relaxed">Didn't receive the email? Check your spam folder or try signing up again.</p>
                        <div className="flex gap-2.5 justify-center flex-wrap">
                            <Link to="/auth?mode=signup" className="btn btn-outline btn-sm">← Try Again</Link>
                            <Link to="/auth?mode=signin" className="btn btn-ghost btn-sm">Sign In Instead</Link>
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-[150px] -right-[100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,146,60,0.06),transparent_70%)] pointer-events-none" />
                <div className="absolute -top-[100px] -left-[80px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(45,106,79,0.05),transparent_70%)] pointer-events-none" />
            </div>
        </div>
    )
}
