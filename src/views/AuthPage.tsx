'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { toast } from '../components/Toast'
import { useSEO } from '@/lib/useSEO'
import { supabase } from '@/lib/supabase'
import { createCheckoutSession } from '@/lib/stripe'

type AuthMode = 'signup' | 'signin' | 'forgot-password' | 'reset-password'

export default function AuthPage() {
  const searchParams = useSearchParams()
  const initialMode = (searchParams.get('mode') || 'signin') as AuthMode
  const [mode, setMode] = useState<AuthMode>(
    ['signup', 'signin', 'forgot-password', 'reset-password'].includes(initialMode) ? initialMode : 'signin'
  )
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [resetSent, setResetSent] = useState(false)

  const { signIn, signUp, signInWithGoogle, resetPassword, updatePassword } = useStore()
  const router = useRouter()
  const isFoundingSignup = mode === 'signup' && searchParams.get('offer') === 'founding'

  useEffect(() => { if (mode === 'reset-password') { /* Supabase redirects here */ } }, [mode])

  // Save offer param across auth flows (like Google OAuth)
  useEffect(() => {
    async function checkOffer() {
      const offer = searchParams.get('offer')
      if (offer === 'founding') {
        try {
          const { data } = await supabase.rpc('get_founding_spots_left')
          if (typeof data === 'number' && data <= 0) {
            localStorage.removeItem('resumebuildin_offer')
            return
          }
        } catch (err) { }
      }
      if (offer) {
        localStorage.setItem('resumebuildin_offer', offer)
      }
    }
    checkOffer()
  }, [searchParams])

  const pwChecks = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    digit: /[0-9]/.test(form.password),
    symbol: /[^A-Za-z0-9]/.test(form.password),
  }
  const pwStrength = Object.values(pwChecks).filter(Boolean).length
  const pwValid = pwStrength === 5
  // BUG-004 fix: "Excellent" requires all 5 checks + 10+ char length
  const pwLabel = !pwChecks.length ? 'Too Short' : pwStrength <= 2 ? 'Weak' : pwStrength <= 3 ? 'Fair' : pwStrength <= 4 ? 'Good' : form.password.length >= 10 ? 'Excellent' : 'Strong'

  const validate = () => {
    const errs: Record<string, string> = {}
    if (mode === 'signup' && !form.fullName.trim()) errs.fullName = 'Name is required'
    // TC-014 fix: Proper email format validation (abc@ no longer passes)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    if (mode !== 'reset-password' && !emailValid) errs.email = 'Please enter a valid email address'
    if (mode === 'signin' && form.password.length < 8) errs.password = 'Password must be 8+ characters'
    if (mode === 'signup') { if (!pwValid) errs.password = 'Password does not meet all requirements' }
    if (mode === 'forgot-password' && !emailValid) errs.email = 'Please enter a valid email address'
    if (mode === 'reset-password') {
      if (!pwValid) errs.password = 'Password does not meet all requirements'
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUp(form.email, form.password, form.fullName)

        // Founding member: save pending plan and try to skip email verification
        if (isFoundingSignup) {
          localStorage.setItem('resumebuildin_pending_plan', JSON.stringify({ plan: 'founding', billing: 'annual' }))
          try {
            const result = await signIn(form.email, form.password)
            if (result?.user) {
              useStore.setState({ user: result.user })
              toast.info('Creating your Founding Member checkout…')
              const { url } = await createCheckoutSession('founding', 'annual')
              if (url) { window.location.href = url; return }
            }
          } catch {
            // Email confirmation required — pending plan saved, will auto-resume after verification
          }
        }

        window.location.href = '/confirm-email'
      } else if (mode === 'signin') {
        const result = await signIn(form.email, form.password)
        if (result?.user) {
          useStore.setState({ user: result.user })
        }
        toast.success('Welcome back!')
        // Navigation handled by PublicRoute via window.location.href
      } else if (mode === 'forgot-password') {
        await resetPassword(form.email)
        setResetSent(true)
      } else if (mode === 'reset-password') {
        await updatePassword(form.password)
        toast.success('Password updated! You can now sign in.')
        router.push('/auth?mode=signin')
        setMode('signin')
      }
    } catch (err: any) {
      const msg = err.message || ''
      if (msg.includes('sending confirmation email')) {
        toast.info('Account created but confirmation email could not be sent.')
        window.location.href = '/confirm-email'
      } else if (msg.includes('already registered') || msg.includes('already been registered')) {
        setErrors({ email: 'This email is already registered' })
        toast.error('An account with this email already exists. Try signing in.')
      } else if (msg.includes('No account found')) {
        // Security: silently show success screen even if email not found
        setResetSent(true)
      } else { toast.error(msg || 'Something went wrong. Try again.') }
    } finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try { await signInWithGoogle() } catch (err: any) { toast.error(err.message); setGoogleLoading(false) }
  }

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }))
  }

  const switchMode = (newMode: AuthMode) => { setMode(newMode); setErrors({}); setResetSent(false) }

  const headingMap: Record<AuthMode, string> = {
    signup: 'Create your account', signin: 'Welcome back',
    'forgot-password': 'Reset your password', 'reset-password': 'Choose new password',
  }

  const seoTitleMap: Record<AuthMode, string> = {
    signup: 'Create Your Free Account',
    signin: 'Sign In',
    'forgot-password': 'Reset Your Password',
    'reset-password': 'Choose New Password',
  }
  const seoDescMap: Record<AuthMode, string> = {
    signup: 'Create a free ResumeBuildIn account and start building beautiful, ATS-optimized resumes in minutes.',
    signin: 'Sign in to ResumeBuildIn to access your resumes, templates, and career tools.',
    'forgot-password': 'Reset your ResumeBuildIn password. We\'ll send you a secure link to choose a new one.',
    'reset-password': 'Choose a new password for your ResumeBuildIn account.',
  }
  useSEO({
    title: seoTitleMap[mode],
    description: seoDescMap[mode],
    path: '/auth',
    noindex: mode === 'reset-password',
  })

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left: Brand panel */}
      <div className="w-full md:w-[45%] bg-[#0e0d0b] dark:bg-[#0e0d0b] p-6 md:p-10 flex flex-col relative overflow-hidden">
        <div className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,146,60,0.12),transparent_70%)] pointer-events-none" />
        <Link href="/" className="font-display text-[22px] font-light text-parchment tracking-tight flex items-center gap-1.5 no-underline mb-16">
          <span className="text-gold">◈</span> Resume<em className="italic text-gold">BuildIn</em>
        </Link>
        <div className="flex-1">
          <h2 className="text-parchment text-[clamp(32px,4vw,52px)] mb-4">Your next job<br /><em className="italic text-gold-light">starts here</em></h2>
          <p className="text-[rgba(250,248,243,0.45)] text-[15px] leading-[1.7] mb-10">Build a stunning, ATS-optimized resume in minutes with ResumeBuildIn.</p>
          <div className="hidden md:flex gap-3">
            {['#f5c800', '#2b9db3', '#c9a84c'].map((c, i) => (
              <div key={i} className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden animate-[fadeUp_0.5s_ease_both]" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="h-8 rounded-t" style={{ background: c, opacity: 0.9 }} />
                <div className="p-2.5 flex flex-col gap-[5px]">
                  <div className="h-1.5 bg-[rgba(255,255,255,0.2)] rounded-sm" />
                  <div className="h-1.5 w-[70%] bg-[rgba(255,255,255,0.15)] rounded-sm" />
                  <div className="h-1.5 bg-[rgba(255,255,255,0.1)] rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl mt-10">
          <div className="text-gold text-sm mb-2.5 tracking-widest">★★★★★</div>
          <p className="text-sm text-[rgba(250,248,243,0.7)] italic leading-relaxed mb-2.5">"Got 3 interviews in the first week after switching to ResumeBuildIn."</p>
          <div className="text-xs text-[rgba(250,248,243,0.35)] font-mono">— Jamie L., Software Engineer</div>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="flex-1 bg-parchment flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[400px]">
          <div className="mb-7">
            <h3 className="text-[28px] mb-2">{headingMap[mode]}</h3>
            {mode === 'signup' && <p className="text-sm text-ink-40">Already have one? <button className="bg-transparent border-none text-gold font-body text-sm cursor-pointer font-medium underline p-0" onClick={() => switchMode('signin')}>Sign in</button></p>}
            {mode === 'signin' && <p className="text-sm text-ink-40">Don't have one? <button className="bg-transparent border-none text-gold font-body text-sm cursor-pointer font-medium underline p-0" onClick={() => switchMode('signup')}>Sign up free</button></p>}
            {mode === 'forgot-password' && <p className="text-sm text-ink-40">Enter your email and we'll send you a link to reset your password.</p>}
            {mode === 'reset-password' && <p className="text-sm text-ink-40">Enter your new password below.</p>}
          </div>

          {(mode === 'signup' || mode === 'signin') && (
            <>
              <button className="flex items-center justify-center gap-3 w-full p-3 bg-white dark:bg-ink-05 border-[1.5px] border-ink-10 rounded-lg text-sm font-medium text-ink cursor-pointer transition-all mb-5 hover:border-ink-20 hover:shadow-sm disabled:opacity-70 disabled:cursor-not-allowed" onClick={handleGoogle} disabled={googleLoading}>
                {googleLoading ? <div className="spinner" style={{ width: 18, height: 18 }} /> : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Continue with Google
              </button>
              <div className="divider">or</div>
            </>
          )}

          {mode === 'forgot-password' && resetSent ? (
            <div className="text-center p-8 bg-[var(--white)] border border-ink-10 rounded-xl mt-5">
              <div className="text-5xl mb-4">✉</div>
              <h4 className="font-display text-[22px] mb-3 text-ink">Check your inbox</h4>
              <p className="text-sm leading-relaxed text-ink-40 mb-1">If an account exists for <strong className="text-ink">{form.email}</strong>, we've sent a password reset link. Click the link in your email to choose a new password.</p>
              <p className="text-xs text-ink-20 mt-3">Didn't receive it? Check your spam folder or <button className="bg-transparent border-none text-gold font-body text-sm cursor-pointer font-medium underline p-0" onClick={() => setResetSent(false)}>try again</button></p>
              <button className="btn btn-outline w-full mt-4" onClick={() => switchMode('signin')}>← Back to Sign In</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
              {mode === 'signup' && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className={`form-input ${errors.fullName ? 'error' : ''}`} placeholder="Alex Johnson" value={form.fullName} onChange={set('fullName')} autoFocus />
                  {errors.fullName && <span className="form-error">⚠ {errors.fullName}</span>}
                </div>
              )}

              {mode !== 'reset-password' && (
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="alex@company.com" value={form.email} onChange={set('email')} autoFocus={mode === 'signin' || mode === 'forgot-password'} />
                  {errors.email && <span className="form-error">⚠ {errors.email}</span>}
                </div>
              )}

              {(mode === 'signin' || mode === 'signup' || mode === 'reset-password') && (
                <div className="form-group">
                  <label className="form-label">{mode === 'reset-password' ? 'New Password' : 'Password'}</label>
                  <input type="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="8+ characters" value={form.password} onChange={set('password')} autoFocus={mode === 'reset-password'} />
                  {errors.password && <span className="form-error">⚠ {errors.password}</span>}

                  {(mode === 'signup' || mode === 'reset-password') && form.password.length > 0 && (
                    <div className="flex items-center gap-2.5 mt-2.5">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="h-1 flex-1 rounded-sm transition-colors" style={{ background: pwStrength >= i ? (pwStrength <= 2 ? '#ef4444' : pwStrength <= 3 ? '#f59e0b' : '#22c55e') : 'var(--ink-10)' }} />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold font-mono uppercase tracking-wide text-ink-40 whitespace-nowrap">
                        {pwLabel}
                      </span>
                    </div>
                  )}

                  {(mode === 'signup' || mode === 'reset-password') && form.password.length > 0 && (
                    <div className="flex flex-col gap-1 mt-2.5">
                      {[
                        { ok: pwChecks.length, label: 'Min 8 characters' },
                        { ok: pwChecks.upper, label: 'Uppercase letter (A-Z)' },
                        { ok: pwChecks.lower, label: 'Lowercase letter (a-z)' },
                        { ok: pwChecks.digit, label: 'Number (0-9)' },
                        { ok: pwChecks.symbol, label: 'Symbol (!@#$…)' },
                      ].map((r, i) => (
                        <div key={i} className={`text-xs flex items-center gap-1.5 transition-colors ${r.ok ? 'text-emerald' : 'text-ink-20'}`}>
                          <span className={`text-[11px] w-3.5 text-center ${r.ok ? 'font-bold' : ''}`}>{r.ok ? '✓' : '○'}</span> {r.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {mode === 'reset-password' && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="Re-enter your password" value={form.confirmPassword} onChange={set('confirmPassword')} />
                  {errors.confirmPassword && <span className="form-error">⚠ {errors.confirmPassword}</span>}
                </div>
              )}

              {mode === 'signin' && (
                <div className="flex justify-end -mt-2">
                  <button type="button" className="bg-transparent border-none text-gold font-body text-[13px] cursor-pointer p-0 underline underline-offset-2 transition-opacity hover:opacity-80" onClick={() => switchMode('forgot-password')}>
                    Forgot your password?
                  </button>
                </div>
              )}

              <button type="submit" className="btn btn-primary w-full py-3.5" disabled={loading}>
                {loading ? <><div className="spinner" /> Processing…</> : mode === 'signup' ? (isFoundingSignup ? 'Create Account & Claim Spot →' : 'Create Account →') : mode === 'signin' ? 'Sign In →' : mode === 'forgot-password' ? 'Send Reset Link →' : 'Update Password →'}
              </button>

              {(mode === 'forgot-password' || mode === 'reset-password') && (
                <button type="button" className="btn btn-ghost w-full" onClick={() => switchMode('signin')}>← Back to Sign In</button>
              )}
            </form>
          )}

          {mode === 'signup' && (
            <p className="text-[11px] text-ink-20 text-center mt-3.5 leading-relaxed">
              By signing up you agree to our <a href="/terms" className="text-gold underline">Terms of Service</a> and <a href="/privacy" className="text-gold underline">Privacy Policy</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
