import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { toast } from '../components/Toast'
import { useStore } from '../lib/store'
import { PREVIEW_MAP } from './ThemesPreviews'
import styles from './ThemesPage.module.css'

const THEMES = [
  { id: 'classic', name: 'Classic', category: 'professional', desc: 'Traditional serif, ATS-friendly', accent: '#1a1a1a', bg: '#fff' },
  { id: 'minimalist', name: 'Minimalist', category: 'minimal', desc: 'Clean whitespace design', accent: '#111', bg: '#fafaf8' },
  { id: 'sidebar', name: 'Sidebar', category: 'professional', desc: 'Two-column with skill bars', accent: '#7eb8f7', bg: '#1e3a5f', popular: true },
  { id: 'creative', name: 'Creative', category: 'creative', desc: 'Gradient header design', accent: '#ee5a24', bg: '#fff' },
  { id: 'dark', name: 'Dark Elegant', category: 'dark', desc: 'Gold accents on dark', accent: '#c9a84c', bg: '#0f0f14', premium: true },
  { id: 'editorial', name: 'Editorial', category: 'creative', desc: 'Magazine-style layout', accent: '#1a1410', bg: '#f5f0e8' },
  { id: 'bold', name: 'Bold Accent', category: 'creative', desc: 'High contrast yellow/black', accent: '#f5c800', bg: '#1a1a1a', new: true },
  { id: 'teal', name: 'Teal CV', category: 'professional', desc: 'Photo-ready with dot skills', accent: '#2b9db3', bg: '#1c1c2e', new: true },
  { id: 'timeline', name: 'Timeline', category: 'minimal', desc: 'Centered balanced columns', accent: '#222', bg: '#f7f7f5', new: true },
  { id: 'grande', name: 'Grande', category: 'minimal', desc: 'Bold typography editorial', accent: '#111', bg: '#fff', new: true },
  { id: 'blob', name: 'Blob Pastel', category: 'creative', desc: 'Soft modern pastel design', accent: '#b87fce', bg: '#fff', new: true },
  { id: 'split', name: 'Clean Split', category: 'minimal', desc: 'Elegant two-column layout', accent: '#888', bg: '#f2f2f0', new: true },
  { id: 'obsidian', name: 'Obsidian Luxe', category: 'dark', desc: 'Dark marble with rose-gold accents', accent: '#c69b6b', bg: '#0d0d0d', premium: true },
  { id: 'ivory', name: 'Ivory Editorial', category: 'professional', desc: 'Cream luxury with deep navy', accent: '#1a2744', bg: '#faf6ef', premium: true },
  { id: 'noir', name: 'Noir Architect', category: 'dark', desc: 'Pure black with electric lime grid', accent: '#b4ff50', bg: '#080808', premium: true },
  { id: 'rose', name: 'Rose Atelier', category: 'creative', desc: 'Blush & champagne editorial', accent: '#d4a0a0', bg: '#fdf8f4', premium: true },
  { id: 'executive', name: 'Executive', category: 'professional', desc: 'Clean centered, serif italic', accent: '#1a1a1a', bg: '#ebebeb', new: true },
  { id: 'terminal', name: 'Terminal', category: 'creative', desc: 'Retro hacker aesthetic', accent: '#7ee787', bg: '#0a0e14', new: true },
  { id: 'healthcare', name: 'Healthcare', category: 'professional', desc: 'Clean clinical with vital stats', accent: '#0d9488', bg: '#f4f7fa', new: true },
  { id: 'nature', name: 'Nature', category: 'creative', desc: 'Botanical organic aesthetic', accent: '#4a6741', bg: '#f7f3eb', new: true },
  { id: 'scifi', name: 'Sci-Fi', category: 'creative', desc: 'Futuristic HUD interface', accent: '#00c3ff', bg: '#05080f', new: true },
  { id: 'sophisticated', name: 'Sophisticated', category: 'professional', desc: 'Black & gold executive luxury', accent: '#b8953e', bg: '#ffffff', new: true },
  { id: 'vintage', name: 'Vintage', category: 'creative', desc: 'Aged parchment literary classic', accent: '#5c4a32', bg: '#f5eed6', new: true },
  { id: 'graduate', name: 'Fresh Graduate', category: 'creative', desc: 'Vibrant modern entry-level', accent: '#f43f5e', bg: '#fafbfe', new: true },
]

const FILTERS = [
  { id: 'all', label: 'All Themes' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'professional', label: 'Professional' },
  { id: 'creative', label: 'Creative' },
  { id: 'dark', label: 'Dark' },
]

function ThemePreview({ theme, data }) {
  const PreviewComponent = PREVIEW_MAP[theme.id]
  if (!PreviewComponent) return null
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <PreviewComponent data={data} />
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────
export default function ThemesPage() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const { user, createResume, currentResume } = useStore()
  const navigate = useNavigate()

  const resumeData = currentResume?.data

  const visible = THEMES.filter((t) => filter === 'all' || t.category === filter)

  const handleUseTheme = async (theme) => {
    if (!user) {
      navigate('/auth?mode=signup')
      return
    }
    try {
      const resume = await createResume(theme.id)
      navigate(`/editor/${resume.id}`)
    } catch (err) {
      if (err.message === 'LIMIT_REACHED') {
        toast.error('Resume limit reached. Upgrade your plan.')
        navigate('/pricing')
      } else {
        toast.error(err.message || 'Could not create resume.')
      }
    }
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.header}>
        <h1>25 themes.<br /><em>Your story, beautifully told.</em></h1>
        <p>Every template designed to pass ATS and impress humans.</p>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`${styles.filterBtn} ${filter === f.id ? styles.active : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className={styles.count}>
          Showing <strong>{visible.length}</strong> themes
        </div>
      </div>

      <div className={styles.grid}>
        {visible.map((theme) => (
          <div key={theme.id} className={styles.themeCard} style={{ animationDelay: `${visible.indexOf(theme) * 0.04}s` }}>
            {theme.popular && <div className={`${styles.badge} ${styles.badgePopular}`}>Popular</div>}
            {theme.premium && <div className={`${styles.badge} ${styles.badgePremium}`}>Premium</div>}
            {theme.new && <div className={`${styles.badge} ${styles.badgeNew}`}>New</div>}

            <div className={styles.preview}>
              <ThemePreview theme={theme} data={resumeData} />
              <div className={styles.previewOverlay}>
                <button
                  className="btn btn-primary"
                  onClick={() => handleUseTheme(theme)}
                >
                  Use This Theme →
                </button>
              </div>
            </div>

            <div className={styles.info}>
              <div>
                <div className={styles.themeName}>{theme.name}</div>
                <div className={styles.themeDesc}>{theme.desc}</div>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => handleUseTheme(theme)}
              >
                Use
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
