import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { toast } from '../components/Toast'
import styles from './AuthPage.module.css'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'signin')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  const { signIn, signUp, signInWithGoogle } = useStore()
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (mode === 'signup' && !form.fullName.trim()) errs.fullName = 'Name is required'
    if (!form.email.includes('@')) errs.email = 'Valid email required'
    if (form.password.length < 6) errs.password = 'Password must be 6+ characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUp(form.email, form.password, form.fullName)
        toast.success('Account created! Check your email to verify.')
        navigate('/dashboard')
      } else {
        await signIn(form.email, form.password)
        toast.success('Welcome back!')
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      toast.error(err.message)
      setGoogleLoading(false)
    }
  }


  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }))
  }

  return (
    <div className={styles.page}>
      {/* Left: Brand panel */}
      <div className={styles.brand}>
        <Link to="/" className={styles.brandLogo}>
          <span>◈</span> Resume<em>BuildIn</em>
        </Link>
        <div className={styles.brandContent}>
          <h2>Your next job<br /><em>starts here</em></h2>
          <p>Join 47,000+ professionals who've built their dream resume with ResumeBuildIn.</p>
          <div className={styles.brandSamples}>
            {['#f5c800', '#2b9db3', '#c9a84c'].map((c, i) => (
              <div key={i} className={styles.sampleCard} style={{ '--delay': `${i * 0.15}s` }}>
                <div style={{ height: 32, background: c, opacity: 0.9, borderRadius: '4px 4px 0 0' }} />
                <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} />
                  <div style={{ height: 6, width: '70%', background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.brandTestimonial}>
          <div className={styles.testimonialStars}>★★★★★</div>
          <p className={styles.testimonialText}>
            "Got 3 interviews in the first week after switching to ResumeBuildIn."
          </p>
          <div className={styles.testimonialAuthor}>— Jamie L., Software Engineer</div>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h3>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h3>
            <p>
              {mode === 'signup' ? 'Already have one? ' : "Don't have one? "}
              <button
                className={styles.toggleMode}
                onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setErrors({}) }}
              >
                {mode === 'signup' ? 'Sign in' : 'Sign up free'}
              </button>
            </p>
          </div>

          {/* Google OAuth */}
          <button className={styles.googleBtn} onClick={handleGoogle} disabled={googleLoading}>
            {googleLoading ? (
              <div className="spinner" style={{ width: 18, height: 18 }} />
            ) : (
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

          <form onSubmit={handleSubmit} className={styles.form}>
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Alex Johnson"
                  value={form.fullName}
                  onChange={set('fullName')}
                  autoFocus
                />
                {errors.fullName && <span className="form-error">⚠ {errors.fullName}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="alex@company.com"
                value={form.email}
                onChange={set('email')}
                autoFocus={mode === 'signin'}
              />
              {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="6+ characters"
                value={form.password}
                onChange={set('password')}
              />
              {errors.password && <span className="form-error">⚠ {errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 14 }} disabled={loading}>
              {loading ? <><div className="spinner" /> Processing…</> : mode === 'signup' ? 'Create Account →' : 'Sign In →'}
            </button>
          </form>

          {mode === 'signup' && (
            <p className={styles.terms}>
              By signing up you agree to our{' '}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
