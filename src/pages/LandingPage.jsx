import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import styles from './LandingPage.module.css'

const STATS = [
  { num: '47,000+', label: 'Resumes Created' },
  { num: '25', label: 'Professional Themes' },
  { num: '94%', label: 'Interview Rate' },
  { num: '180+', label: 'Countries' },
]

const FEATURES = [
  {
    icon: '⚡',
    title: 'Build in Minutes',
    desc: 'Intuitive editor with live preview. Fill in your details, watch your resume take shape instantly.',
  },
  {
    icon: '✦',
    title: '25 Stunning Themes',
    desc: 'From minimalist classics to bold creative layouts — every theme crafted by professional designers.',
  },
  {
    icon: '📄',
    title: 'Perfect PDF Export',
    desc: 'Pixel-perfect PDF generation that looks identical to your preview on screen.',
  },
  {
    icon: '🎯',
    title: 'ATS Optimized',
    desc: 'All templates pass applicant tracking systems. Get seen by real humans, not filtered by bots.',
  },
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
  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className="badge badge-gold">New</span>
            25 themes just dropped
          </div>
          <h1 className={styles.heroTitle}>
            Resumes that<br />
            <em>get you hired</em>
          </h1>
          <p className={styles.heroSubtitle}>
            Build a stunning, ATS-friendly resume in minutes. Choose from 25
            professionally designed themes, fill in your details, download instantly.
          </p>
          <div className={styles.heroActions}>
            <Link to="/auth?mode=signup" className="btn btn-gold btn-lg">
              Build My Resume — Free
            </Link>
            <Link to="/themes" className="btn btn-outline btn-lg">
              Browse Themes →
            </Link>
          </div>
          <p className={styles.heroCaveat}>
            No credit card required · Free plan forever
          </p>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.floatingCard}>
            <div className={styles.fcHeader} />
            <div className={styles.fcBody}>
              <div className={styles.fcLine} style={{ width: '65%', height: 14, background: '#d4d0ca', marginBottom: 8 }} />
              <div className={styles.fcLine} style={{ width: '40%', height: 9 }} />
              <div style={{ height: 1, background: '#e8e4de', margin: '12px 0' }} />
              <div className={styles.fcLine} style={{ width: '80%', height: 8, marginBottom: 5 }} />
              <div className={styles.fcLine} style={{ width: '70%', height: 8, marginBottom: 5 }} />
              <div className={styles.fcLine} style={{ width: '90%', height: 8 }} />
              <div style={{ height: 1, background: '#e8e4de', margin: '12px 0' }} />
              <div className={styles.fcLine} style={{ width: '50%', height: 10, background: '#d4d0ca', marginBottom: 8 }} />
              <div className={styles.fcLine} style={{ width: '80%', height: 8, marginBottom: 5 }} />
              <div className={styles.fcLine} style={{ width: '75%', height: 8, marginBottom: 5 }} />
              <div className={styles.fcLine} style={{ width: '85%', height: 8 }} />
              <div style={{ height: 1, background: '#e8e4de', margin: '12px 0' }} />
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ height: 20, width: 55, background: '#e8e4de', borderRadius: 3 }} />
                <div style={{ height: 20, width: 45, background: '#e8e4de', borderRadius: 3 }} />
                <div style={{ height: 20, width: 60, background: '#e8e4de', borderRadius: 3 }} />
              </div>
            </div>
          </div>
          <div className={styles.floatingBadges}>
            <div className={styles.floatingBadge} style={{ '--delay': '0s' }}>
              ✓ ATS Friendly
            </div>
            <div className={styles.floatingBadge} style={{ '--delay': '0.3s' }}>
              ⚡ Instant PDF
            </div>
            <div className={styles.floatingBadge} style={{ '--delay': '0.6s' }}>
              ✦ 25 Themes
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section className={styles.stats}>
        {STATS.map((s, i) => (
          <div key={i} className={styles.statItem}>
            <div className={styles.statNum}>{s.num}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2>Everything you need<br /><em>to land the job</em></h2>
          <p>Built for job seekers who want results, not a design degree.</p>
        </div>
        <div className={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.featureCard} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THEME SHOWCASE ─────────────────────────────────── */}
      <section className={styles.showcase}>
        <div className={styles.sectionHeader}>
          <h2>25 themes.<br /><em>One perfect fit.</em></h2>
          <p>From minimalist to bold — every style has its place.</p>
        </div>
        <div className={styles.themeStrip}>
          {THEME_PREVIEWS.map((t) => (
            <div key={t.id} className={styles.themeChip}
              style={{ background: t.bg, '--accent': t.accent }}>
              <div className={styles.themeChipInner}>
                <div className={styles.themeChipLine} style={{ width: '60%', background: t.accent, opacity: 0.8 }} />
                <div className={styles.themeChipLine} style={{ width: '40%' }} />
                <div style={{ height: 1, background: t.accent, opacity: 0.15, margin: '6px 0' }} />
                <div className={styles.themeChipLine} />
                <div className={styles.themeChipLine} style={{ width: '80%' }} />
                <div className={styles.themeChipLine} style={{ width: '70%' }} />
              </div>
              <div className={styles.themeChipLabel} style={{ color: t.bg === '#ffffff' || t.bg === '#f2f2f0' ? '#666' : 'rgba(255,255,255,0.6)' }}>
                {t.label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/themes" className="btn btn-outline btn-lg">
            View All 25 Themes →
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2>Three steps to<br /><em>your perfect resume</em></h2>
        </div>
        <div className={styles.steps}>
          {[
            { n: '01', title: 'Pick a theme', desc: 'Browse 25 professional designs and select the one that matches your style and industry.' },
            { n: '02', title: 'Fill in your details', desc: 'Our smart editor guides you through each section. Add experience, skills, education and more.' },
            { n: '03', title: 'Download & apply', desc: 'Export a pixel-perfect PDF instantly. Share your public link or send the file directly.' },
          ].map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepNum}>{step.n}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────── */}
      <section className={styles.ctaBanner}>
        <h2>Start building<br /><em>for free today</em></h2>
        <p>Join 47,000+ professionals who've landed jobs with ResumeBuildIn.</p>
        <Link to="/auth?mode=signup" className="btn btn-gold btn-lg" style={{ marginTop: 24 }}>
          Create Your Resume →
        </Link>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>◈ Resume<em>BuildIn</em></div>
            <p>Beautiful resumes that get you hired.</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Product</div>
              <Link to="/themes">Themes</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Company</div>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Legal</div>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 ResumeBuildIn. All rights reserved.</span>
          <span>Made with care for job seekers everywhere.</span>
        </div>
      </footer>
    </div>
  )
}
