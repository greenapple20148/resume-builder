import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { toast } from '../components/Toast'
import { useStore } from '../lib/store'
import { PREVIEW_MAP } from './ThemesPreviews'
import '../styles/terminal.css'
import '../styles/scifi.css'
import '../styles/sophisticated.css'
import '../styles/healthcare.css'


import '../styles/futuristic.css'
import styles from './ThemesPage.module.css'
import { ResumeData } from '../types'

interface Theme {
  id: string
  name: string
  category: string
  desc: string
  accent: string
  bg: string
  popular?: boolean
  premium?: boolean
  new?: boolean
}

const THEMES: Theme[] = [

  { id: 'editorial_luxe', name: 'Editorial Luxe', category: 'creative', desc: 'Luxe editorial layout', accent: '#dca47d', bg: '#fdfbf9' },
  { id: 'dark_architect', name: 'Dark Architect', category: 'dark', desc: 'Dark tech aesthetic', accent: '#f5c800', bg: '#121212' },
  { id: 'bauhaus_geometric', name: 'Bauhaus Geometric', category: 'creative', desc: 'Geometric design', accent: '#005bb5', bg: '#fafafa' },
  { id: 'soft_pastel', name: 'Soft Pastel', category: 'creative', desc: 'Pastel aesthetic', accent: '#a29bfe', bg: '#fbf9fc' },
  { id: 'swiss_grid', name: 'Swiss Grid', category: 'minimal', desc: 'Clean grid system', accent: '#e84118', bg: '#ffffff' },
  { id: 'brutalist_raw', name: 'Brutalist Raw', category: 'creative', desc: 'Raw design elements', accent: '#0000ff', bg: '#e0e0e0' },
  { id: 'warm_earth', name: 'Warm Earth', category: 'minimal', desc: 'Earthy calm layout', accent: '#b96b4b', bg: '#fbf9f6' },
  { id: 'monochrome_precision', name: 'Monochrome Precision', category: 'minimal', desc: 'Black and white sharp', accent: '#333333', bg: '#ffffff' },
  { id: 'gradient_horizon', name: 'Gradient Horizon', category: 'creative', desc: 'Colorful gradients', accent: '#00c6ff', bg: '#ffffff' },
  { id: 'art_deco_revival', name: 'Art Deco Revival', category: 'professional', desc: 'Classic art deco details', accent: '#a08b6d', bg: '#fcfbfa' },
  { id: 'phd', name: 'PhD Academic', category: 'professional', desc: 'Academic focus', accent: '#1a4e8a', bg: '#ffffff' },

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

  { id: 'scifi', name: 'Sci-Fi', category: 'creative', desc: 'Futuristic HUD interface', accent: '#00c3ff', bg: '#05080f', new: true },
  { id: 'sophisticated', name: 'Sophisticated', category: 'professional', desc: 'Black & gold executive luxury', accent: '#b8953e', bg: '#ffffff', new: true },

  { id: 'futuristic', name: 'Futuristic', category: 'creative', desc: 'Animated glassmorphism interface', accent: '#6ee7b7', bg: '#07060e', new: true },
]

const FILTERS = [
  { id: 'all', label: 'All Themes' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'professional', label: 'Professional' },
  { id: 'creative', label: 'Creative' },
  { id: 'dark', label: 'Dark' },
]

interface ThemePreviewProps {
  theme: Theme
  data: Partial<ResumeData> | undefined
}

function ThemePreview({ theme, data }: ThemePreviewProps) {
  const PreviewComponent = PREVIEW_MAP[theme.id]
  if (!PreviewComponent) return null
  return (
    <>
      <PreviewComponent data={data} />
    </>
  )
}

export default function ThemesPage() {
  const [filter, setFilter] = useState('all')
  const [selectedThemeId, setSelectedThemeId] = useState('classic')
  const { user, createResume, currentResume } = useStore()
  const navigate = useNavigate()

  const visible = THEMES.filter((t) => filter === 'all' || t.category === filter)
  const resumeData = currentResume?.data
  const selectedTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0]
  const themeCount = visible.length

  const handleUseTheme = async (theme: Theme) => {
    if (!user) {
      navigate('/auth?mode=signup')
      return
    }
    try {
      const resume = await createResume(theme.id)
      navigate(`/editor/${resume.id}`)
    } catch (err: any) {
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

      <div className={styles.splitContainer}>
        <div className={styles.leftPanel}>
          <div className={styles.header}>
            <h1>Choose a theme.<br /><em>Make it yours.</em></h1>
            <p>Every template is ATS-optimized and recruiter-approved.</p>
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
              <span className={styles.count}>{themeCount} results</span>
            </div>
          </div>

          <div className={styles.grid}>
            {visible.map((theme, idx) => (
              <div
                key={theme.id}
                className={`${styles.themeCard} ${selectedThemeId === theme.id ? styles.selectedCard : ''}`}
                style={{ animationDelay: `${idx * 0.04}s` }}
                onClick={() => setSelectedThemeId(theme.id)}
              >
                {theme.popular && <div className={`${styles.badge} ${styles.badgePopular}`}>Popular</div>}
                {theme.premium && <div className={`${styles.badge} ${styles.badgePremium}`}>Premium</div>}
                {theme.new && <div className={`${styles.badge} ${styles.badgeNew}`}>New</div>}

                <div className={styles.preview}>
                  <div className={styles.previewInner}>
                    <ThemePreview theme={theme} data={resumeData} />
                  </div>
                </div>

                <div className={styles.info}>
                  <div>
                    <div className={styles.themeName}>{theme.name}</div>
                    <div className={styles.themeDesc}>{theme.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.previewSticky}>
            <div className={styles.previewTitle}>
              <div>
                <h2>{selectedTheme.name}</h2>
                <p>{selectedTheme.desc}</p>
                <div className={styles.categoryBadge}>{selectedTheme.category}</div>
              </div>
              <button className="btn btn-gold" onClick={() => handleUseTheme(selectedTheme)}>
                Use This Theme →
              </button>
            </div>

            <div className={styles.fullPreviewWindow}>
              <div className={styles.previewCanvas} key={selectedTheme.id}>
                <ThemePreview theme={selectedTheme} data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
