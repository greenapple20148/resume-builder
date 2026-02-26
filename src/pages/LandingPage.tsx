import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSEO } from '../lib/useSEO'

const STATS = [
  { num: '47,000+', label: 'Resumes Created' },
  { num: '25', label: 'Professional Themes' },
  { num: '94%', label: 'Interview Rate' },
  { num: '180+', label: 'Countries' },
]

const FEATURES = [
  { icon: '🎯', title: 'Built to Pass ATS', desc: 'Not just pretty — every resume is engineered to pass applicant tracking systems and reach real humans.' },
  { icon: '📊', title: 'Job Description Match', desc: 'Paste any job description and instantly see how well your resume matches. Close the gaps before you apply.' },
  { icon: '📈', title: 'Recruiter Rejection Insights', desc: 'See exactly why recruiters pass on resumes like yours — and fix it before they ever see it.' },
  { icon: '🧠', title: 'AI-Powered Bullet Points', desc: 'Transform vague descriptions into quantified, metrics-driven achievements that prove your impact.' },
  { icon: '🏆', title: 'Interview Conversion', desc: 'Designed to get you interviews, not just downloads. Every feature is optimized for real hiring outcomes.' },
]

const THEME_PREVIEWS = [
  { id: 'bold', label: 'Bold Accent', accent: '#f5c800', bg: '#1a1a1a' },
  { id: 'sophisticated', label: 'Sophisticated', accent: '#b8953e', bg: '#ffffff' },
  { id: 'scifi', label: 'Sci-Fi', accent: '#00c3ff', bg: '#05080f' },
  { id: 'dark', label: 'Dark Elegant', accent: '#c9a84c', bg: '#0f0f14' },
  { id: 'blob', label: 'Blob Pastel', accent: '#b87fce', bg: '#ffffff' },
  { id: 'split', label: 'Clean Split', accent: '#888', bg: '#f2f2f0' },
]

export default function LandingPage() {
  useSEO({
    title: 'ResumeBuildIn — Build Resumes That Get You Hired',
    description: 'Build beautiful, ATS-optimized resumes in minutes. Choose from 25 professional themes, use the live editor, and download perfect PDFs instantly. Free forever.',
    path: '/',
  })

  return (
    <div className="min-h-screen">
      <Navbar variant="transparent" />
      <main>

        {/* ── HERO ─────────────────────────────── */}
        <section aria-label="Hero" className="max-w-[1200px] mx-auto px-5 sm:px-10 py-12 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-20 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 text-[13px] text-ink-40 mb-6 font-mono">
              <span className="badge badge-gold">New</span>
              25 themes just dropped
            </div>
            <h1 className="text-[clamp(48px,7vw,88px)] leading-[1.0] mb-5">
              Resumes that<br />
              <em className="italic text-gold">get you hired</em>
            </h1>
            <p className="text-[17px] text-ink-40 leading-[1.7] max-w-[500px] mb-8 mx-auto lg:mx-0">
              Build a stunning, ATS-friendly resume in minutes. Choose from 25
              professionally designed themes, fill in your details, download instantly.
            </p>
            <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
              <Link to="/auth?mode=signup" className="btn btn-gold btn-lg">Build My Resume — Free</Link>
              <Link to="/themes" className="btn btn-outline btn-lg">Browse Themes →</Link>
            </div>
            <p className="text-xs text-ink-20 mt-3.5 font-mono">No credit card required · Free plan forever</p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 mt-5">
              {[
                { icon: '🔄', text: 'No surprise renewals' },
                { icon: '👆', text: 'Cancel in 1 click' },
                { icon: '📧', text: 'Email reminder before renewal' },
                { icon: '✅', text: '7-day money-back guarantee' },
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[11.5px] text-ink-30 font-medium">
                  <span className="text-[10px] opacity-60">{item.icon}</span>
                  {item.text}
                </span>
              ))}
            </div>
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
              {['✓ ATS Friendly', '⚡ Instant PDF', '✦ 25 Themes'].map((text, i) => (
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
                <div className="text-[28px] mb-4">{f.icon}</div>
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
            <div className="text-5xl sm:text-6xl flex-shrink-0 relative">🎙️</div>
            <div className="text-center lg:text-left relative flex-1">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.15em] uppercase text-gold-light mb-3 opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-light animate-pulse" />
                Coming Soon
              </div>
              <h2 className="text-parchment text-[clamp(24px,3.5vw,36px)] leading-[1.2] mb-3 font-display">
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
              <h2 className="text-parchment mb-3">AI that gives you<br /><em className="italic text-gold-light">an unfair advantage</em></h2>
              <p className="text-[rgba(250,248,243,0.4)] text-base">Powered by intelligence that goes far beyond spell-check. These tools analyze, optimize, and transform your entire job search.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: '🧠', title: 'STAR Answer Detection', desc: 'AI detects if your interview answers follow the Situation-Task-Action-Result framework and coaches you to strengthen weak areas.' },
                { icon: '📉', title: 'Confidence & Clarity Score', desc: 'Get scored on filler words, hedging language, and answer structure. See exactly where you sound uncertain.' },
                { icon: '🎙', title: 'Follow-Up Question Simulation', desc: 'AI predicts the follow-up questions interviewers will ask based on your answers — so nothing catches you off guard.' },
                { icon: '📋', title: 'Resume Weakness Analyzer', desc: 'Scans your resume for gaps, weak verbs, missing metrics, and inconsistencies that make recruiters hit "reject."' },
                { icon: '🧾', title: 'Resume → LinkedIn Auto-Convert', desc: 'One click transforms your resume into an optimized LinkedIn profile — headline, summary, and experience sections.' },
                { icon: '🔍', title: 'Missing Keyword Detector', desc: "Compares your resume against the job description and highlights every critical keyword you're missing." },
              ].map((f, i) => (
                <div key={i} className="relative p-7 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm transition-all duration-300 hover:border-[rgba(201,146,60,0.25)] hover:bg-[rgba(255,255,255,0.04)] group overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(201,146,60,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start gap-4">
                    <div className="text-2xl mt-0.5 flex-shrink-0">{f.icon}</div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <h4 className="text-parchment text-[15px] font-semibold">{f.title}</h4>
                        <span className="text-[9px] font-mono tracking-[0.15em] uppercase px-2 py-0.5 rounded-full bg-[rgba(201,146,60,0.12)] text-gold-light border border-[rgba(201,146,60,0.15)]">Pro</span>
                      </div>
                      <p className="text-[13px] leading-[1.7] text-[rgba(250,248,243,0.4)]">{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/auth?mode=signup" className="btn btn-gold btn-lg">Unlock AI Features →</Link>
            </div>
          </div>
        </section>

        {/* ── THEME SHOWCASE ───────────────────── */}
        <section aria-label="Theme showcase" className="bg-ink-05 px-5 sm:px-10 py-16 sm:py-24">
          <div className="text-center max-w-[560px] mx-auto mb-14">
            <h2 className="mb-3">25 themes.<br /><em className="italic text-gold">One perfect fit.</em></h2>
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
            <Link to="/themes" className="btn btn-outline btn-lg">View All 25 Themes →</Link>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────── */}
        <section aria-label="How it works" className="max-w-[1200px] mx-auto px-5 sm:px-10 py-16 sm:py-24">
          <div className="text-center max-w-[560px] mx-auto mb-14">
            <h2 className="mb-3">Three steps to<br /><em className="italic text-gold">your perfect resume</em></h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {[
              { n: '01', title: 'Pick a theme', desc: 'Browse 25 professional designs and select the one that matches your style and industry.' },
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

        {/* ── CTA BANNER ───────────────────────── */}
        <section aria-label="Call to action" className="bg-gradient-to-br from-[#0e0d0b] to-[#3a3830] dark:from-[#0e0d0b] dark:to-[#3a3830] px-10 py-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,146,60,0.15),transparent_70%)]" />
          <h2 className="text-parchment relative mb-3">Start building<br /><em className="italic text-gold-light">for free today</em></h2>
          <p className="text-[rgba(250,248,243,0.5)] relative text-base">Join 47,000+ professionals who've landed jobs with ResumeBuildIn.</p>
          <Link to="/auth?mode=signup" className="btn btn-gold btn-lg mt-6 relative">Create Your Resume →</Link>
        </section>

      </main>

      {/* ── FOOTER ───────────────────────────── */}
      <footer className="bg-[#1a1916] dark:bg-[#1a1916] px-5 sm:px-10 pt-16 text-[rgba(250,248,243,0.6)]" role="contentinfo">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row gap-10 sm:gap-20 pb-12 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex-[1.5]">
            <div className="font-display text-2xl font-light text-parchment mb-3 tracking-tight">◈ Resume<em className="italic text-gold">BuildIn</em></div>
            <p className="text-[13px] text-[rgba(250,248,243,0.4)]">Beautiful resumes that get you hired.</p>
          </div>
          <nav aria-label="Footer navigation" className="flex gap-8 sm:gap-16 flex-wrap">
            {[
              { title: 'Product', links: [{ to: '/themes', text: 'Themes' }, { to: '/pricing', text: 'Pricing' }, { to: '/dashboard', text: 'Dashboard' }] },
              { title: 'Company', links: [{ to: '#', text: 'About' }, { to: '#', text: 'Blog' }, { to: '#', text: 'Contact' }] },
              { title: 'Legal', links: [{ to: '#', text: 'Privacy' }, { to: '#', text: 'Terms' }, { to: '#', text: 'Cookies' }] },
            ].map((col) => (
              <div key={col.title} className="flex flex-col gap-2.5">
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[rgba(250,248,243,0.25)] mb-1">{col.title}</div>
                {col.links.map((l) => (
                  <Link key={l.text} to={l.to} className="text-sm text-[rgba(250,248,243,0.5)] no-underline transition-colors hover:text-parchment">{l.text}</Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="max-w-[1200px] mx-auto py-6 flex flex-col sm:flex-row justify-between text-xs text-[rgba(250,248,243,0.25)] font-mono gap-2">
          <span>© 2026 ResumeBuildIn. All rights reserved.</span>
          <span>Made with care for job seekers everywhere.</span>
        </div>
      </footer>
    </div>
  )
}
