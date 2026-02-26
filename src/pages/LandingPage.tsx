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
  { icon: '⚡', title: 'Build in Minutes', desc: 'Intuitive editor with live preview. Fill in your details, watch your resume take shape instantly.' },
  { icon: '✦', title: '25 Stunning Themes', desc: 'From minimalist classics to bold creative layouts — every theme crafted by professional designers.' },
  { icon: '📄', title: 'Perfect PDF Export', desc: 'Pixel-perfect PDF generation that looks identical to your preview on screen.' },
  { icon: '🎯', title: 'ATS Optimized', desc: 'All templates pass applicant tracking systems. Get seen by real humans, not filtered by bots.' },
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
          <div className="text-center max-w-[560px] mx-auto mb-14">
            <h2 className="mb-3">Everything you need<br /><em className="italic text-gold">to land the job</em></h2>
            <p className="text-base text-ink-40">Built for job seekers who want results, not a design degree.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-8 sm:p-7 bg-[var(--white)] border border-ink-10 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gold-pale animate-[fadeUp_0.6s_ease_both]" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="text-[28px] mb-4">{f.icon}</div>
                <h4 className="text-lg mb-2.5">{f.title}</h4>
                <p className="text-sm leading-[1.7] text-ink-40">{f.desc}</p>
              </div>
            ))}
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
