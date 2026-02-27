import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSEO } from '../lib/useSEO'
import { LandingIcon } from '../components/LandingIcons'

const STATS = [
  { num: '47,000+', label: 'Resumes Created' },
  { num: '30', label: 'Professional Themes' },
  { num: '94%', label: 'Interview Rate' },
  { num: '180+', label: 'Countries' },
]

const FEATURES = [
  { icon: 'target', title: 'Built to Pass ATS', desc: 'Not just pretty — every resume is engineered to pass applicant tracking systems and reach real humans.' },
  { icon: 'bar-chart', title: 'Job Description Match', desc: 'Paste any job description and instantly see how well your resume matches. Close the gaps before you apply.' },
  { icon: 'trend-up', title: 'Recruiter Rejection Insights', desc: 'See exactly why recruiters pass on resumes like yours — and fix it before they ever see it.' },
  { icon: 'brain', title: 'AI-Powered Bullet Points', desc: 'Transform vague descriptions into quantified, metrics-driven achievements that prove your impact.' },
  { icon: 'trophy', title: 'Interview Conversion', desc: 'Designed to get you interviews, not just downloads. Every feature is optimized for real hiring outcomes.' },
]

const THEME_PREVIEWS = [
  { id: 'bold', label: 'Bold Accent', accent: '#f5c800', bg: '#1a1a1a' },
  { id: 'sophisticated', label: 'Sophisticated', accent: '#b8953e', bg: '#ffffff' },
  { id: 'scifi', label: 'Sci-Fi', accent: '#00c3ff', bg: '#05080f' },
  { id: 'dark', label: 'Dark Elegant', accent: '#c9a84c', bg: '#0f0f14' },
  { id: 'blob', label: 'Blob Pastel', accent: '#b87fce', bg: '#ffffff' },
  { id: 'split', label: 'Clean Split', accent: '#888', bg: '#f2f2f0' },
]

/* ── Founding Member Launch Offer Component ──────────── */
const FOUNDING_BENEFITS = [
  'Unlimited resume downloads',
  'Premium templates',
  'ATS optimization',
  'Cover letter builder',
  'Cancel anytime',
]

function FoundingMemberOffer({ spotsLeft, setSpotsLeft }: { spotsLeft: number; setSpotsLeft: React.Dispatch<React.SetStateAction<number>> }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = React.useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const spotsPercentage = ((100 - spotsLeft) / 100) * 100

  return (
    <section
      ref={sectionRef}
      aria-label="Founding Member Launch Offer"
      id="founding-offer"
      className="relative overflow-hidden px-5 sm:px-10 py-16 sm:py-24"
      style={{ background: 'linear-gradient(165deg, #0c0a06 0%, #1a1408 30%, #0e0d0b 60%, #131008 100%)' }}
    >
      {/* Decorative backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,146,60,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(201,146,60,0.06),transparent_50%)]" />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(201,146,60,0.5) 2px, rgba(201,146,60,0.5) 3px)', backgroundSize: '100% 4px' }} />

      <div className="max-w-[680px] mx-auto relative">
        {/* Urgency Badge */}
        <div className="flex justify-center mb-8" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[rgba(201,146,60,0.3)] bg-[rgba(201,146,60,0.08)] backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f59e0b]" />
            </span>
            <span className="text-[11px] font-mono tracking-[0.15em] uppercase text-gold-light font-medium">Limited Time · Founding Members Only</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative rounded-2xl overflow-hidden" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)', transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s' }}>
          {/* Animated gold border */}
          <div className="absolute inset-0 rounded-2xl p-px" style={{ background: 'linear-gradient(135deg, rgba(201,146,60,0.5) 0%, rgba(201,146,60,0.1) 25%, rgba(201,146,60,0.4) 50%, rgba(201,146,60,0.1) 75%, rgba(201,146,60,0.5) 100%)', backgroundSize: '400% 400%', animation: 'foundingBorderGlow 6s ease infinite' }} />

          <div className="relative rounded-2xl m-px bg-gradient-to-br from-[#151209] via-[#0e0d0b] to-[#100e08] px-8 sm:px-12 py-10 sm:py-14">
            {/* Heading */}
            <div className="text-center mb-10">
              <h2 className="text-parchment dark:text-[#e8e6e0] text-[clamp(28px,4vw,42px)] leading-[1.15] mb-4 font-display">
                Founding Member<br />
                <em className="italic" style={{ color: '#e8b76a' }}>Launch Offer</em>
              </h2>
              <p className="text-[rgba(250,248,243,0.45)] text-[15px] leading-relaxed max-w-[460px] mx-auto">
                Be one of the first 100 users and get exclusive pricing for your first year.
              </p>
            </div>

            {/* Pricing */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 mb-2">
                <span className="text-[rgba(250,248,243,0.4)] text-sm font-mono">Normally</span>
                <span className="text-[rgba(250,248,243,0.5)] text-xl line-through font-display">$79/year</span>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase" style={{ background: 'linear-gradient(135deg, rgba(232,183,106,0.2), rgba(201,146,60,0.1))', color: '#e8b76a', border: '1px solid rgba(232,183,106,0.25)' }}>SAVE $60</span>
              </div>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="font-display text-[72px] sm:text-[88px] font-light leading-none" style={{ color: '#e8b76a' }}>$19</span>
                <span className="text-[rgba(250,248,243,0.35)] text-lg font-display">/year</span>
              </div>
              <p className="text-[rgba(250,248,243,0.35)] text-xs font-mono mt-2 tracking-wide">PRO PLAN · FIRST YEAR · THEN $79/YR</p>
            </div>

            {/* Benefits */}
            <div className="max-w-[340px] mx-auto mb-10">
              {FOUNDING_BENEFITS.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3.5 py-2.5"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-12px)',
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.08}s`,
                    borderBottom: i < FOUNDING_BENEFITS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(232,183,106,0.2), rgba(201,146,60,0.1))', border: '1px solid rgba(232,183,106,0.2)' }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#e8b76a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span className="text-[14px] text-[rgba(250,248,243,0.7)] font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Spots Remaining */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-mono tracking-wide uppercase text-[rgba(250,248,243,0.35)]">Spots claimed</span>
                <span className="text-[12px] font-mono font-bold" style={{ color: spotsLeft <= 20 ? '#f87171' : '#e8b76a' }}>{spotsLeft} remaining</span>
              </div>
              <div className="h-2 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    width: isVisible ? `${spotsPercentage}%` : '0%',
                    background: spotsLeft <= 20 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #c9923c, #e8b76a)',
                    transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
                  }}
                >
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)', animation: 'foundingShimmer 2s ease-in-out infinite' }} />
                </div>
              </div>
              <p className="text-center text-[11px] text-[rgba(250,248,243,0.25)] font-mono mt-2.5">Only 100 spots available</p>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                to="/auth?mode=signup"
                id="founding-offer-cta"
                className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-xl text-[16px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #c9923c 0%, #e8b76a 50%, #c9923c 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'foundingBtnShimmer 3s ease infinite',
                  boxShadow: '0 8px 32px rgba(201, 146, 60, 0.35), 0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                <span className="relative z-10">Claim My Founding Spot</span>
                <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
              </Link>
              <p className="text-[11px] text-[rgba(250,248,243,0.25)] mt-4 font-mono">75% off your first year — limited spots.</p>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex justify-center gap-6 sm:gap-10 mt-8 flex-wrap" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s' }}>
          {[
            { icon: 'lock', text: 'Secure Payment' },
            { icon: 'zap', text: 'Instant Access' },
            { icon: 'refresh', text: 'Cancel Anytime' },
            { icon: 'shield', text: 'Money-back Guarantee' },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[11px] text-[rgba(250,248,243,0.3)]">
              <LandingIcon name={item.icon} size={12} />
              {item.text}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes foundingBorderGlow { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes foundingShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes foundingBtnShimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      `}</style>
    </section>
  )
}

export default function LandingPage() {
  useSEO({
    title: 'ResumeBuildIn — Build Resumes That Get You Hired',
    description: 'Build beautiful, ATS-optimized resumes in minutes. Choose from 30 professional themes, use the live editor, and download perfect PDFs instantly. Free forever.',
    path: '/',
  })

  const [spotsLeft, setSpotsLeft] = useState(50)

  // Real-time countdown — starts immediately on page load
  useEffect(() => {
    const tick = () => {
      setSpotsLeft(prev => {
        if (prev <= 12) return prev
        return prev - 1
      })
    }
    // First tick after a short random delay
    const firstTimeout = setTimeout(tick, 3000 + Math.random() * 5000)
    // Then tick every 8-20 seconds
    const interval = setInterval(tick, 8000 + Math.random() * 12000)
    return () => { clearTimeout(firstTimeout); clearInterval(interval) }
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar variant="transparent" />
      <main>

        {/* ── HERO ─────────────────────────────── */}
        <section aria-label="Hero" className="max-w-[1200px] mx-auto px-5 sm:px-10 py-12 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-20 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 text-[13px] text-ink-40 mb-6 font-mono">
              <span className="badge badge-gold">New</span>
              30 themes just dropped
            </div>
            <h1 className="text-[clamp(48px,7vw,88px)] leading-[1.0] mb-5">
              Resumes that<br />
              <em className="italic text-gold">get you hired</em>
            </h1>
            <p className="text-[17px] text-ink-40 leading-[1.7] max-w-[500px] mb-8 mx-auto lg:mx-0">
              Build a stunning, ATS-friendly resume in minutes. Choose from 30
              professionally designed themes, fill in your details, download instantly.
            </p>
            <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
              <Link to="/auth?mode=signup" className="btn btn-gold btn-lg">Build My Resume — Free</Link>
              <Link to="/themes" className="btn btn-outline btn-lg">Browse Themes →</Link>
            </div>
            <p className="text-xs text-ink-20 mt-3.5 font-mono">No credit card required · Free plan forever</p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 mt-5">
              {[
                { icon: 'refresh', text: 'No surprise renewals' },
                { icon: 'cursor', text: 'Cancel in 1 click' },
                { icon: 'mail', text: 'Email reminder before renewal' },
                { icon: 'check', text: '7-day money-back guarantee' },
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[11.5px] text-ink-30 font-medium">
                  <LandingIcon name={item.icon} size={12} className="opacity-60" />
                  {item.text}
                </span>
              ))}
            </div>

            {/* ── Founding Member Mini Banner ── */}
            <a
              href="#founding-offer"
              className="mt-6 block max-w-[480px] mx-auto lg:mx-0 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg no-underline group bg-ink-05 dark:bg-[rgba(26,20,8,0.6)]"
              style={{ border: '1px solid var(--gold-pale, rgba(201,146,60,0.25))' }}
            >
              <div className="px-5 py-3.5 flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-[28px] font-light leading-none text-gold">$19</span>
                    <span className="text-[11px] text-ink-30 font-mono">/yr</span>
                  </div>
                  <span className="text-[9px] font-mono text-ink-20"><span className="line-through">$79</span> → $19/yr</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-ink leading-tight mb-0.5">Founding Member Offer</div>
                  <div className="text-[10px] text-ink-40 font-mono">75% off Pro — first year</div>
                </div>
                <div className="flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all group-hover:scale-105" style={{ background: 'linear-gradient(135deg, #c9923c, #e8b76a)', color: '#fff' }}>
                  Claim →
                </div>
              </div>
              <div className="px-5 pb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-ink-30">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold" />
                  </span>
                  {100 - spotsLeft}/100 spots claimed
                </span>
                <span className="text-[10px] font-mono font-semibold text-gold">{spotsLeft} left</span>
              </div>
              <div className="h-1 bg-ink-10">
                <div className="h-full rounded-full" style={{ width: `${100 - spotsLeft}%`, background: 'linear-gradient(90deg, #c9923c, #e8b76a)' }} />
              </div>
            </a>
          </div>

          <div className="relative">
            <div className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden shadow-xl animate-[float_6s_ease-in-out_infinite]">
              <div className="h-16 bg-gradient-to-br from-ink to-ink-70" />
              <div className="p-6">
                <div className="h-3.5 bg-[#d4d0ca] rounded-sm mb-2 w-[65%]" />
                <div className="h-[9px] bg-ink-10 rounded-sm w-[40%]" />
                <div className="h-px bg-[#e8e4de] my-3" />
                <div className="h-2 bg-ink-10 rounded-sm mb-[5px] w-[80%]" />
                <div className="h-2 bg-ink-10 rounded-sm mb-[5px] w-[70%]" />
                <div className="h-2 bg-ink-10 rounded-sm w-[90%]" />
                <div className="h-px bg-[#e8e4de] my-3" />
                <div className="h-2.5 bg-[#d4d0ca] rounded-sm mb-2 w-[50%]" />
                <div className="h-2 bg-ink-10 rounded-sm mb-[5px] w-[80%]" />
                <div className="h-2 bg-ink-10 rounded-sm mb-[5px] w-[75%]" />
                <div className="h-2 bg-ink-10 rounded-sm w-[85%]" />
                <div className="h-px bg-[#e8e4de] my-3" />
                <div className="flex gap-1.5">
                  <div className="h-5 w-[55px] bg-[#e8e4de] rounded-sm" />
                  <div className="h-5 w-[45px] bg-[#e8e4de] rounded-sm" />
                  <div className="h-5 w-[60px] bg-[#e8e4de] rounded-sm" />
                </div>
              </div>
            </div>
            <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 flex-col gap-2.5 hidden lg:flex">
              {['✓ ATS Friendly', '⚡ Instant PDF', '✦ 30 Themes'].map((text, i) => (
                <div key={i} className="bg-[var(--white)] border border-ink-10 rounded-full px-3.5 py-2 text-xs font-medium text-ink shadow-md whitespace-nowrap animate-[slideInRight_0.6s_ease_both]" style={{ animationDelay: `${i * 0.3}s` }}>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────── */}
        <section aria-label="Statistics" className="bg-[#0e0d0b] dark:bg-[#0e0d0b] flex justify-center flex-wrap p-10">
          {STATS.map((s, i) => (
            <div key={i} className={`flex-1 max-w-[220px] text-center px-5 py-4 sm:py-0 ${i < STATS.length - 1 ? 'sm:border-r sm:border-[rgba(255,255,255,0.08)]' : ''}`}>
              <div className="font-display text-4xl font-light text-gold-light mb-1.5">{s.num}</div>
              <div className="text-xs text-[rgba(250,248,243,0.4)] font-mono uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── FEATURES ─────────────────────────── */}
        <section aria-label="Features" className="max-w-[1200px] mx-auto px-5 sm:px-10 py-16 sm:py-24">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <h2 className="mb-3">Built for interviews,<br /><em className="italic text-gold">not just downloads</em></h2>
            <p className="text-base text-ink-40">Every feature is designed to get you past the ATS, impress recruiters, and land the interview.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-8 sm:p-7 bg-[var(--white)] border border-ink-10 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gold-pale animate-[fadeUp_0.6s_ease_both]" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="mb-4 text-gold"><LandingIcon name={f.icon} size={28} /></div>
                <h4 className="text-lg mb-2.5">{f.title}</h4>
                <p className="text-sm leading-[1.7] text-ink-40">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI INTERVIEW COACH BANNER ──────── */}
        <section aria-label="AI Interview Coach" className="mx-5 sm:mx-10 my-0">
          <div className="max-w-[1200px] mx-auto bg-gradient-to-br from-[#0e0d0b] to-[#2a2520] rounded-2xl px-8 sm:px-14 py-12 sm:py-14 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(201,146,60,0.12),transparent_70%)]" />
            <div className="flex-shrink-0 relative text-gold-light"><LandingIcon name="mic" size={56} /></div>
            <div className="text-center lg:text-left relative flex-1">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.15em] uppercase text-gold-light mb-3 opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-light animate-pulse" />
                Coming Soon
              </div>
              <h2 className="text-parchment dark:text-[#e8e6e0] text-[clamp(24px,3.5vw,36px)] leading-[1.2] mb-3 font-display">
                AI Interview Coach That Analyzes Your Answers<span className="text-gold italic"> — Not Just Asks Questions.</span>
              </h2>
              <p className="text-[rgba(250,248,243,0.45)] text-sm leading-[1.7] max-w-[520px] mx-auto lg:mx-0">
                Practice with an AI that gives real-time feedback on your tone, structure, and content. Get personalized tips to ace every interview.
              </p>
            </div>
            <Link to="/auth?mode=signup" className="btn btn-gold relative whitespace-nowrap flex-shrink-0">Get Notified →</Link>
          </div>
        </section>

        {/* ── ADVANCED AI FEATURES ───────────── */}
        <section aria-label="Advanced AI Features" className="bg-[#0e0d0b] dark:bg-[#0e0d0b] px-5 sm:px-10 py-16 sm:py-24">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center max-w-[620px] mx-auto mb-14">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.15em] uppercase text-gold-light mb-4 opacity-70">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-light" />
                Advanced AI
              </div>
              <h2 className="text-parchment dark:text-[#e8e6e0] mb-3">AI that gives you<br /><em className="italic text-gold-light">an unfair advantage</em></h2>
              <p className="text-[rgba(250,248,243,0.4)] text-base">Powered by intelligence that goes far beyond spell-check. These tools analyze, optimize, and transform your entire job search.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: 'brain', title: 'STAR Answer Detection', desc: 'AI detects if your interview answers follow the Situation-Task-Action-Result framework and coaches you to strengthen weak areas.' },
                { icon: 'trend-down', title: 'Confidence & Clarity Score', desc: 'Get scored on filler words, hedging language, and answer structure. See exactly where you sound uncertain.' },
                { icon: 'mic', title: 'Follow-Up Question Simulation', desc: 'AI predicts the follow-up questions interviewers will ask based on your answers — so nothing catches you off guard.' },
                { icon: 'clipboard', title: 'Resume Weakness Analyzer', desc: 'Scans your resume for gaps, weak verbs, missing metrics, and inconsistencies that make recruiters hit "reject."' },
                { icon: 'linkedin', title: 'Resume → LinkedIn Auto-Convert', desc: 'One click transforms your resume into an optimized LinkedIn profile — headline, summary, and experience sections.' },
                { icon: 'search', title: 'Missing Keyword Detector', desc: "Compares your resume against the job description and highlights every critical keyword you're missing." },
              ].map((f, i) => (
                <div key={i} className="relative p-7 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm transition-all duration-300 hover:border-[rgba(201,146,60,0.25)] hover:bg-[rgba(255,255,255,0.04)] group overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(201,146,60,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex-shrink-0 text-gold"><LandingIcon name={f.icon} size={22} /></div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <h4 className="text-parchment dark:text-[#e8e6e0] text-[15px] font-semibold">{f.title}</h4>
                        <span className="text-[9px] font-mono tracking-[0.15em] uppercase px-2 py-0.5 rounded-full bg-[rgba(201,146,60,0.12)] text-gold-light border border-[rgba(201,146,60,0.15)]">Pro</span>
                      </div>
                      <p className="text-[13px] leading-[1.7] text-[rgba(250,248,243,0.4)]">{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/tools/ai" className="btn btn-gold btn-lg">Unlock AI Features →</Link>
            </div>
          </div>
        </section>

        {/* ── THEME SHOWCASE ───────────────────── */}
        <section aria-label="Theme showcase" className="bg-ink-05 px-5 sm:px-10 py-16 sm:py-24">
          <div className="text-center max-w-[560px] mx-auto mb-14">
            <h2 className="mb-3">30 themes.<br /><em className="italic text-gold">One perfect fit.</em></h2>
            <p className="text-base text-ink-40">From minimalist to bold — every style has its place.</p>
          </div>
          <div className="flex gap-3.5 max-w-[1200px] mx-auto overflow-x-auto pb-2">
            {THEME_PREVIEWS.map((t) => (
              <div key={t.id} className="shrink-0 w-40 rounded-xl overflow-hidden border border-[rgba(0,0,0,0.08)] transition-transform duration-300 cursor-pointer hover:-translate-y-1.5 hover:scale-[1.02]" style={{ background: t.bg }}>
                <div className="p-3.5 flex flex-col gap-[5px] h-[120px]">
                  <div className="h-1.5 rounded-[1px] w-[60%]" style={{ background: t.accent, opacity: 0.8 }} />
                  <div className="h-1.5 rounded-[1px] w-[40%] bg-[rgba(255,255,255,0.15)]" />
                  <div className="h-px my-1.5" style={{ background: t.accent, opacity: 0.15 }} />
                  <div className="h-1.5 rounded-[1px] w-full bg-[rgba(255,255,255,0.15)]" />
                  <div className="h-1.5 rounded-[1px] w-[80%] bg-[rgba(255,255,255,0.15)]" />
                  <div className="h-1.5 rounded-[1px] w-[70%] bg-[rgba(255,255,255,0.15)]" />
                </div>
                <div className="px-3.5 py-2 text-[10px] font-mono tracking-wide uppercase bg-[rgba(0,0,0,0.15)]" style={{ color: t.bg === '#ffffff' || t.bg === '#f2f2f0' ? '#666' : 'rgba(255,255,255,0.6)' }}>
                  {t.label}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/themes" className="btn btn-outline btn-lg">View All 30 Themes →</Link>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────── */}
        <section aria-label="How it works" className="max-w-[1200px] mx-auto px-5 sm:px-10 py-16 sm:py-24">
          <div className="text-center max-w-[560px] mx-auto mb-14">
            <h2 className="mb-3">Three steps to<br /><em className="italic text-gold">your perfect resume</em></h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {[
              { n: '01', title: 'Pick a theme', desc: 'Browse 30 professional designs and select the one that matches your style and industry.' },
              { n: '02', title: 'Fill in your details', desc: 'Our smart editor guides you through each section. Add experience, skills, education and more.' },
              { n: '03', title: 'Download & apply', desc: 'Export a pixel-perfect PDF instantly. Share your public link or send the file directly.' },
            ].map((step, i) => (
              <div key={i} className="p-8 bg-[var(--white)] border border-ink-10 rounded-xl">
                <div className="font-display text-5xl font-light text-ink-10 leading-none mb-4">{step.n}</div>
                <h3 className="text-[22px] mb-2.5">{step.title}</h3>
                <p className="text-sm text-ink-40 leading-[1.7]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── BUILT FOR ──────────────────────── */}
        <section aria-label="Built for" className="bg-ink-05 px-5 sm:px-10 py-16 sm:py-24">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center max-w-[560px] mx-auto mb-12">
              <h2 className="mb-3">Built for people<br /><em className="italic text-gold">who mean business</em></h2>
              <p className="text-base text-ink-40">Whether you're switching careers or climbing the ladder — we've got you covered.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { icon: 'laptop', title: 'Built for Tech Professionals', desc: 'Optimized for SWE, PM, Data, DevOps, and Design roles with industry-specific formatting.' },
                { icon: 'refresh', title: 'Built for Career Switchers', desc: 'Highlight transferable skills and reframe experience for a completely new industry.' },
                { icon: 'arrow-up', title: 'Built for Promotion-Ready Employees', desc: 'Showcase internal impact, leadership growth, and metrics that justify your next level.' },
                { icon: 'flag', title: 'Built for US Job Market', desc: 'Follows US resume conventions — no photo, no DOB, ATS-compliant formatting.' },
                { icon: 'building', title: 'Built for Fortune 500 ATS', desc: 'Tested against Workday, Greenhouse, Lever, and iCIMS parsing systems.' },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-[var(--white)] border border-ink-10 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-gold-pale">
                  <div className="mb-3 text-gold flex justify-center"><LandingIcon name={item.icon} size={28} /></div>
                  <h4 className="text-[14px] font-semibold mb-2 leading-snug">{item.title}</h4>
                  <p className="text-[12px] text-ink-40 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EMOTIONAL RELIEF ───────────────── */}
        <section aria-label="Eliminate resume anxiety" className="relative overflow-hidden px-5 sm:px-10 py-20 sm:py-28" style={{ background: 'linear-gradient(135deg, #1a1510 0%, #0e0d0b 40%, #12110f 100%)' }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(201,146,60,0.08),transparent_60%)]" />
          <div className="max-w-[1100px] mx-auto relative">
            <div className="text-center max-w-[620px] mx-auto mb-14">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.15em] uppercase text-gold-light mb-4 opacity-70">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-light animate-pulse" />
                Real Talk
              </div>
              <h2 className="text-parchment dark:text-[#e8e6e0] mb-4">We get it.<br /><em className="italic text-gold-light">Job searching is stressful.</em></h2>
              <p className="text-[rgba(250,248,243,0.45)] text-base leading-relaxed">You shouldn't have to wonder if your resume is good enough. We built these tools so you never have to guess again.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { icon: 'heart-pulse', text: 'Stop Guessing If Your Resume Is Good Enough', sub: 'Get an instant score and clear action items' },
                { icon: 'message-circle', text: 'Practice Interviews Before the Real One', sub: 'AI-powered mock interviews with feedback' },
                { icon: 'shield', text: 'Eliminate Resume Anxiety', sub: 'Know exactly what recruiters will think' },
                { icon: 'mic', text: 'Never Freeze in an Interview Again', sub: 'Prep answers using the STAR framework' },
                { icon: 'rocket', text: 'Feel Prepared — Not Panicked', sub: 'Walk in with confidence, every time' },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] text-center transition-all duration-300 hover:border-[rgba(201,146,60,0.2)] hover:bg-[rgba(255,255,255,0.05)] hover:-translate-y-1 group">
                  <div className="mb-3 text-gold-light flex justify-center group-hover:scale-110 transition-transform"><LandingIcon name={item.icon} size={28} /></div>
                  <p className="text-[13px] font-semibold text-parchment dark:text-[#e8e6e0] leading-snug mb-1.5">{item.text}</p>
                  <p className="text-[11px] text-[rgba(250,248,243,0.3)] leading-snug">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCT DIFFERENTIATORS ────────── */}
        <section aria-label="Product experience" className="max-w-[1200px] mx-auto px-5 sm:px-10 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.15em] uppercase text-gold mb-4 opacity-70">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                Product Experience
              </div>
              <h2 className="mb-4">An experience<br /><em className="italic text-gold">competitors can't match</em></h2>
              <p className="text-base text-ink-40 leading-[1.8] mb-8">Real-time feedback, instant formatting, and unlimited flexibility — all in one editor. No lag, no bloat, no gimmicks.</p>
              <Link to="/auth?mode=signup" className="btn btn-outline">Try It Free →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: 'zap', title: 'Under 10 Minutes', desc: 'Build a polished, job-ready resume faster than making coffee.' },
                { icon: 'folders', title: 'Unlimited Versions', desc: 'Tailor a unique resume for every job — no limits, ever.' },
                { icon: 'layers', title: 'Instant Format Switch', desc: 'Switch between 30 themes without losing a single word.' },
                { icon: 'file-text', title: 'One-Click Formatting', desc: 'Clean, consistent formatting applied automatically.' },
                { icon: 'bar-chart', title: 'Live Resume Score', desc: 'See your score update in real-time as you edit.' },
                { icon: 'target', title: 'ATS Compliance Check', desc: 'Every export is tested for applicant tracking systems.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3.5 p-4 rounded-xl bg-ink-05 border border-ink-10 transition-all duration-300 hover:border-gold-pale hover:shadow-sm">
                  <span className="mt-0.5 flex-shrink-0 text-gold"><LandingIcon name={item.icon} size={20} /></span>
                  <div>
                    <h4 className="text-[13px] font-semibold mb-0.5">{item.title}</h4>
                    <p className="text-[11px] text-ink-30 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOUNDER ANGLE ──────────────────── */}
        <section aria-label="About us" className="mx-5 sm:mx-10 mb-0">
          <div className="max-w-[1200px] mx-auto rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f3eb 0%, #f0e8d8 100%)' }}>
            <div className="px-8 sm:px-16 py-14 sm:py-20">
              <div className="max-w-[760px] mx-auto text-center">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.15em] uppercase mb-4 opacity-60" style={{ color: '#8b6914' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8b6914' }} />
                  From Our Founders
                </div>
                <h2 className="text-[#1a1510] mb-5">Built by engineers,<br /><em className="italic" style={{ color: '#8b6914' }}>not marketing teams.</em></h2>
                <p className="text-[15px] leading-[1.8] mb-12 max-w-[560px] mx-auto" style={{ color: 'rgba(26,21,16,0.5)' }}>
                  We got tired of resume builders that looked like they were designed in 2010. So we built one ourselves — with real AI, real design, and obsessive attention to what actually gets people hired.
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { icon: 'code', title: 'Built by Engineers', desc: 'Product-obsessed founders who ship weekly' },
                    { icon: 'sparkles', title: 'Constantly Improving AI', desc: 'Models retrained on real hiring data' },
                    { icon: 'flask', title: 'Founder-Led Product', desc: 'Every feature decision made by builders' },
                    { icon: 'lightbulb', title: 'We Listen to Members', desc: 'Founding members shape the roadmap' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl text-center border transition-all duration-200 hover:-translate-y-0.5" style={{ background: 'rgba(255,255,255,0.6)', borderColor: 'rgba(139,105,20,0.1)' }}>
                      <div className="mb-2 flex justify-center" style={{ color: '#8b6914' }}><LandingIcon name={item.icon} size={22} /></div>
                      <h4 className="text-[12px] font-semibold mb-0.5" style={{ color: '#1a1510' }}>{item.title}</h4>
                      <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(26,21,16,0.4)' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOUNDING MEMBER LAUNCH OFFER ──────── */}
        <FoundingMemberOffer spotsLeft={spotsLeft} setSpotsLeft={setSpotsLeft} />

        {/* ── CTA BANNER ───────────────────────── */}
        <section aria-label="Call to action" className="bg-gradient-to-br from-[#0e0d0b] to-[#3a3830] dark:from-[#0e0d0b] dark:to-[#3a3830] px-10 py-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,146,60,0.15),transparent_70%)]" />
          <h2 className="text-parchment dark:text-[#e8e6e0] relative mb-3">Start building<br /><em className="italic text-gold-light">for free today</em></h2>
          <p className="text-[rgba(250,248,243,0.5)] relative text-base">Join 47,000+ professionals who've landed jobs with ResumeBuildIn.</p>
          <Link to="/auth?mode=signup" className="btn btn-gold btn-lg mt-6 relative">Create Your Resume →</Link>
        </section>

      </main>

      {/* ── FOOTER ───────────────────────────── */}
      <footer className="bg-[#1a1916] dark:bg-[#0d0d0c] px-5 sm:px-10 pt-16 text-[rgba(250,248,243,0.6)]" role="contentinfo">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row gap-10 sm:gap-20 pb-12 border-b border-[rgba(255,255,255,0.06)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex-[1.5]">
            <div className="font-display text-2xl font-light text-parchment dark:text-[#e8e6e0] mb-3 tracking-tight">◈ Resume<em className="italic text-gold">BuildIn</em></div>
            <p className="text-[13px] text-[rgba(250,248,243,0.4)] dark:text-[rgba(250,248,243,0.5)]">Beautiful resumes that get you hired.</p>
          </div>
          <nav aria-label="Footer navigation" className="flex gap-8 sm:gap-16 flex-wrap">
            {[
              { title: 'Product', links: [{ to: '/themes', text: 'Themes' }, { to: '/pricing', text: 'Pricing' }, { to: '/dashboard', text: 'Dashboard' }] },
              { title: 'Company', links: [{ to: '/about', text: 'About' }, { to: '/blog', text: 'Blog' }, { to: '/contact', text: 'Contact' }] },
              { title: 'Legal', links: [{ to: '/privacy', text: 'Privacy' }, { to: '/terms', text: 'Terms' }, { to: '/cookies', text: 'Cookies' }] },
            ].map((col) => (
              <div key={col.title} className="flex flex-col gap-2.5">
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[rgba(250,248,243,0.25)] dark:text-[rgba(250,248,243,0.4)] mb-1">{col.title}</div>
                {col.links.map((l) => (
                  <Link key={l.text} to={l.to} className="text-sm text-[rgba(250,248,243,0.5)] dark:text-[rgba(250,248,243,0.6)] no-underline transition-colors hover:text-parchment dark:hover:text-[#e8e6e0]">{l.text}</Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="max-w-[1200px] mx-auto py-6 flex flex-col sm:flex-row justify-between text-xs text-[rgba(250,248,243,0.25)] dark:text-[rgba(250,248,243,0.4)] font-mono gap-2">
          <span>© 2026 ResumeBuildIn. All rights reserved.</span>
          <span>Resume BuildIn is operated by RZeal Solutions,  United States.</span>
        </div>
      </footer>
    </div>
  )
}
