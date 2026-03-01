import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { toast } from '../components/Toast'
import { useStore } from '../lib/store'
import { useSEO } from '../lib/useSEO'
import { PREVIEW_MAP } from './ThemesPreviews'
import '../styles/terminal.css'
import '../styles/scifi.css'
import '../styles/sophisticated.css'
import '../styles/healthcare.css'
import '../styles/futuristic.css'
import { ResumeData } from '../types'

export interface Theme {
  id: string; name: string; category: string; desc: string; accent: string; bg: string
  popular?: boolean; premium?: boolean; new?: boolean
}

export const THEMES: Theme[] = [

  { id: 'editorial_luxe', name: 'Editorial Luxe', category: 'creative', desc: 'Luxe editorial layout', accent: '#dca47d', bg: '#fdfbf9', premium: true },
  { id: 'dark_architect', name: 'Dark Architect', category: 'dark', desc: 'Dark tech aesthetic', accent: '#f5c800', bg: '#121212', premium: true },
  { id: 'bauhaus_geometric', name: 'Bauhaus Geometric', category: 'creative', desc: 'Geometric design', accent: '#005bb5', bg: '#fafafa', premium: true },
  { id: 'soft_pastel', name: 'Soft Pastel', category: 'creative', desc: 'Pastel aesthetic', accent: '#a29bfe', bg: '#fbf9fc' },
  { id: 'swiss_grid', name: 'Swiss Grid', category: 'minimal', desc: 'Clean grid system', accent: '#e84118', bg: '#ffffff' },

  { id: 'phd', name: 'PhD Academic', category: 'professional', desc: 'Academic focus', accent: '#1a4e8a', bg: '#ffffff' },

  { id: 'dark', name: 'Dark Elegant', category: 'dark', desc: 'Gold accents on dark', accent: '#c9a84c', bg: '#0f0f14', premium: true },

  { id: 'terminal', name: 'Terminal', category: 'creative', desc: 'Retro hacker aesthetic', accent: '#7ee787', bg: '#0a0e14', new: true },

  { id: 'corporate_slate', name: 'Corporate Slate', category: 'professional', desc: 'Slate sidebar with blue accents', accent: '#3b82f6', bg: '#1e293b', new: true },
  { id: 'teal_wave', name: 'Teal Wave', category: 'professional', desc: 'Teal gradient header with rounded cards', accent: '#0d9488', bg: '#ffffff', new: true },
  { id: 'purple_dusk', name: 'Purple Dusk', category: 'creative', desc: 'Violet gradient sidebar with timeline', accent: '#8b5cf6', bg: '#2e1065', new: true },
  { id: 'coral_bright', name: 'Coral Bright', category: 'creative', desc: 'Coral gradient header with stat strip', accent: '#f97316', bg: '#ffffff', new: true },
  { id: 'ocean_deep', name: 'Ocean Deep', category: 'professional', desc: 'Deep ocean gradient with tag strip', accent: '#0284c7', bg: '#0c4a6e', new: true },
  { id: 'sage_pro', name: 'Sage Pro', category: 'professional', desc: 'Clean green accents with impact metrics', accent: '#16a34a', bg: '#ffffff', new: true },
  { id: 'carbon_noir', name: 'Carbon Noir', category: 'dark', desc: 'Dark zinc panels with slash bullets', accent: '#ffffff', bg: '#18181b', new: true },
  { id: 'sand_dune', name: 'Sand Dune', category: 'creative', desc: 'Warm amber gradient with serif accents', accent: '#d97706', bg: '#fafaf9', new: true },
  { id: 'indigo_sharp', name: 'Indigo Sharp', category: 'professional', desc: 'Bold indigo border with diamond markers', accent: '#4f46e5', bg: '#ffffff', new: true },
  { id: 'platinum_elite', name: 'Platinum Elite', category: 'professional', desc: 'Executive two-panel with KPI bar', accent: '#94a3b8', bg: '#ffffff', new: true, premium: true },
  { id: 'cascade_blue', name: 'Cascade Blue', category: 'professional', desc: 'Navy sidebar with gradient skill bars', accent: '#1a6fb5', bg: '#0f2a4a', new: true },
  { id: 'nordic_minimal', name: 'Nordic Minimal', category: 'minimal', desc: 'Clean Scandinavian design with serif accents', accent: '#2d6a4f', bg: '#fafafa', new: true },
  { id: 'midnight_pro', name: 'Midnight Pro', category: 'dark', desc: 'Luxurious dark with gold accents', accent: '#c9a84c', bg: '#0c0f1a', new: true, premium: true },
  { id: 'blueprint', name: 'Blueprint', category: 'dark', desc: 'Engineering blueprint with grid overlay', accent: '#4a9eff', bg: '#0a1628', new: true, premium: true },
  { id: 'emerald_fresh', name: 'Emerald Fresh', category: 'creative', desc: 'Green header with triangle bullets', accent: '#1a7a4a', bg: '#ffffff', new: true },
  { id: 'sunset_warm', name: 'Sunset Warm', category: 'creative', desc: 'Amber sunset gradient with dot ratings', accent: '#c97c2a', bg: '#f7efe3', new: true },
  { id: 'newspaper_classic', name: 'Newspaper Classic', category: 'minimal', desc: 'Editorial 3-column newspaper layout', accent: '#8b1a1a', bg: '#faf7f3', new: true },
  { id: 'ivory_marble', name: 'Ivory Marble', category: 'professional', desc: 'Luxury navy sidebar with gold accents', accent: '#b8963c', bg: '#f9f6f0', new: true, premium: true },
  { id: 'neon_cyber', name: 'Neon Cyber', category: 'dark', desc: 'Cyberpunk neon with stats strip', accent: '#00fff7', bg: '#04080f', new: true, premium: true },
  { id: 'origami_zen', name: 'Origami Zen', category: 'minimal', desc: 'Japanese-inspired with fold marks', accent: '#b03030', bg: '#fdfcfa', new: true },
]

const FILTERS = [
  { id: 'all', label: 'All Themes' }, { id: 'minimal', label: 'Minimal' },
  { id: 'professional', label: 'Professional' }, { id: 'creative', label: 'Creative' }, { id: 'dark', label: 'Dark' },
]

function ThemePreview({ theme, data }: { theme: Theme; data: Partial<ResumeData> | undefined }) {
  const PreviewComponent = PREVIEW_MAP[theme.id]
  if (!PreviewComponent) return null
  return <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100%' }}><PreviewComponent data={data} /></div>
}

export default function ThemesPage() {
  const [filter, setFilter] = useState('all')
  const [selectedThemeId, setSelectedThemeId] = useState('editorial_luxe')
  const { user, createResume, currentResume } = useStore()
  const navigate = useNavigate()
  const visible = THEMES.filter((t) => filter === 'all' || t.category === filter)
  const resumeData = currentResume?.data
  const selectedTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0]

  useSEO({
    title: 'Resume Themes & Templates',
    description: 'Browse 30+ ATS-optimized, professionally designed resume themes. From minimalist to creative to dark — find the perfect template for your next job application.',
    path: '/themes',
  })

  const [useThemeLoading, setUseThemeLoading] = useState(false)

  const handleUseTheme = async (theme: Theme) => {
    if (!user) { navigate('/auth?mode=signup'); return }
    setUseThemeLoading(true)
    try {
      console.log('[ThemesPage] Creating resume with theme:', theme.id, 'user:', user.id)
      const resume = await createResume(theme.id)
      console.log('[ThemesPage] Resume created:', resume.id)
      navigate(`/editor/${resume.id}`)
    } catch (err: any) {
      console.error('[ThemesPage] Error creating resume:', err)
      if (err.message === 'LIMIT_REACHED') { toast.error('Resume limit reached.'); navigate('/pricing') }
      else toast.error(err.message || 'Could not create resume.')
    } finally {
      setUseThemeLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 h-[calc(100vh-60px)] overflow-hidden">
        {/* Left Panel */}
        <div className="w-[480px] min-w-[400px] max-xl:w-full max-xl:min-w-0 overflow-y-auto border-r-[1.5px] border-ink-10 bg-parchment scroll-smooth">
          <div className="text-center px-6 py-7 max-w-[400px] mx-auto">
            <h1 className="text-[clamp(28px,4vw,36px)] mb-2 leading-tight">Choose a theme.<br /><em className="italic text-gold">Make it yours.</em></h1>
            <p className="text-sm text-ink-40 leading-relaxed">Every template is ATS-optimized and recruiter-approved.</p>
          </div>

          <div className="mb-5 px-5 flex items-center justify-center gap-2">
            <div className="flex gap-1.5 flex-wrap justify-center">
              {FILTERS.map((f) => (
                <button key={f.id} className={`px-3.5 py-1.5 border-[1.5px] rounded-full text-xs cursor-pointer transition-all ${filter === f.id ? 'bg-ink border-ink text-parchment dark:bg-gold dark:border-gold dark:text-white' : 'border-ink-10 bg-transparent text-ink-40 hover:border-ink-20 hover:text-ink hover:bg-ink-05 dark:border-ink-10 dark:text-ink-40'}`} onClick={() => setFilter(f.id)}>{f.label}</button>
              ))}
              <span className="text-xs text-ink-40 font-mono whitespace-nowrap">{visible.length} results</span>
            </div>
          </div>

          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3 px-5 pb-16">
            {visible.map((theme, idx) => (
              <div key={theme.id} className={`bg-[var(--white)] border-[1.5px] ${selectedThemeId === theme.id ? '!border-gold shadow-[0_0_0_2px_var(--gold),var(--shadow)]' : 'border-ink-10'} rounded-xl overflow-hidden relative transition-all cursor-pointer animate-[fadeUp_0.5s_ease_both] shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:border-ink-20`} style={{ animationDelay: `${idx * 0.04}s` }} onClick={() => setSelectedThemeId(theme.id)}>
                {theme.popular && <div className="absolute top-2 right-2 z-[5] font-mono text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-gold text-white">Popular</div>}
                {theme.premium && <div className="absolute top-2 right-2 z-[5] font-mono text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-gradient-to-br from-[#1a1a1a] to-[#333] text-parchment dark:bg-gold dark:text-white">Premium</div>}
                {theme.new && <div className="absolute top-2 right-2 z-[5] font-mono text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-[#dcfce7] dark:bg-[rgba(76,175,122,0.15)] text-emerald">New</div>}
                <div className="h-[200px] relative overflow-hidden bg-ink-05 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-10 after:bg-gradient-to-b after:from-transparent after:to-ink-05 after:pointer-events-none after:z-[2]">
                  <div className="w-[680px] min-h-[880px] scale-[0.28] origin-top-left pointer-events-none absolute top-0 left-0 overflow-hidden preview-fill"><ThemePreview theme={theme} data={resumeData} /></div>
                </div>
                <div className="px-3 py-2.5 border-t border-ink-10 flex items-center justify-between gap-2">
                  <div><div className="text-xs font-semibold text-ink mb-px">{theme.name}</div><div className="text-[10px] text-ink-40 font-mono">{theme.desc}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-gradient-to-br from-[#f5f3ef] via-[#eae7e1] to-[#e2dfd8] dark:from-[#1a1917] dark:via-[#141312] dark:to-[#0f0e0d] flex flex-col overflow-hidden relative max-xl:hidden">
          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-7 pt-5 pb-4 shrink-0 border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.45)] dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-[12px]">
              <div>
                <h2 className="text-[22px] font-bold mb-0.5 tracking-tight text-ink">{selectedTheme.name}</h2>
                <p className="text-xs text-ink-40 m-0">{selectedTheme.desc}</p>
                <div className="inline-block text-[9px] font-mono uppercase tracking-widest text-gold bg-[rgba(197,165,114,0.1)] border border-[rgba(197,165,114,0.2)] rounded-full px-2.5 py-0.5 mt-1">{selectedTheme.category}</div>
              </div>
              <button className="btn btn-gold" onClick={() => handleUseTheme(selectedTheme)} disabled={useThemeLoading}>{useThemeLoading ? 'Creating…' : 'Use This Theme →'}</button>
            </div>
            <div className="flex-1 min-h-0 flex items-start justify-center px-8 py-7 overflow-hidden relative">
              <div className="w-[816px] h-[1200px] bg-white shrink-0 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.06),0_12px_36px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.2),0_12px_36px_rgba(0,0,0,0.3)] preview-fill" style={{ zoom: 0.65, transformOrigin: 'top center' }} key={selectedTheme.id}>
                <ThemePreview theme={selectedTheme} data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
