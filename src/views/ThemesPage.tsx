'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import { toast } from '../components/Toast'
import { useStore } from '@/lib/store'
import { useSEO } from '@/lib/useSEO'
import { PREVIEW_MAP } from './ThemesPreviews'
import { ResumeData } from '../types'

export interface Theme {
  id: string; name: string; category: string; desc: string; accent: string; bg: string
  popular?: boolean; premium?: boolean; new?: boolean
}

export const THEMES: Theme[] = [
  { id: 'classic', name: 'Classic', category: 'professional', desc: 'Traditional serif elegance', accent: '#1a1a1a', bg: '#ffffff', popular: true },
  { id: 'executive', name: 'Executive', category: 'professional', desc: 'Bold header with photo', accent: '#0c4a6e', bg: '#ffffff', premium: true },
  { id: 'minimal', name: 'Minimal', category: 'minimal', desc: 'Clean whitespace design', accent: '#111111', bg: '#ffffff' },
  { id: 'bold', name: 'Bold', category: 'creative', desc: 'Dark header, strong type', accent: '#f59e0b', bg: '#ffffff', new: true },
  // Mono collection
  { id: 'mono_sidebar', name: 'Mono Sidebar', category: 'mono', desc: 'Dark sidebar, monospace code feel', accent: '#111111', bg: '#ffffff', new: true },
  { id: 'mono_stack', name: 'Mono Stack', category: 'mono', desc: 'Stacked bands, alternating grays', accent: '#111111', bg: '#f7f7f7', new: true },
  { id: 'mono_type', name: 'Mono Type', category: 'mono', desc: 'Typography-focused, large name', accent: '#000000', bg: '#ffffff', new: true },
  { id: 'mono_editorial', name: 'Mono Editorial', category: 'mono', desc: 'Serif editorial in grayscale', accent: '#111111', bg: '#fafafa', new: true },
  // Executive collection
  { id: 'exec_navy', name: 'Exec Navy', category: 'executive', desc: 'Navy header with gold accents', accent: '#c9a84c', bg: '#ffffff', premium: true },
  { id: 'exec_marble', name: 'Exec Marble', category: 'executive', desc: 'Ivory luxury with gold rules', accent: '#b8963c', bg: '#f9f6f0', premium: true },
  { id: 'exec_copper', name: 'Exec Copper', category: 'executive', desc: 'Warm bronze accents on cream', accent: '#b45309', bg: '#fffbf5', premium: true },
  // Creative collection
  { id: 'creative_neon', name: 'Neon', category: 'creative', desc: 'Dark mode with neon green', accent: '#22c55e', bg: '#0f0f0f', new: true },
  { id: 'creative_coral', name: 'Coral', category: 'creative', desc: 'Warm terracotta, organic shapes', accent: '#dc6843', bg: '#fef7f3', new: true },
  { id: 'creative_blueprint', name: 'Blueprint', category: 'creative', desc: 'Technical code-style layout', accent: '#38bdf8', bg: '#0c1929', new: true },
  { id: 'creative_sunset', name: 'Sunset', category: 'creative', desc: 'Warm orange gradient header', accent: '#ea580c', bg: '#ffffff', new: true },
  // Dark collection
  { id: 'dark_obsidian', name: 'Obsidian', category: 'dark', desc: 'Pure black, clean white text', accent: '#e5e5e5', bg: '#0a0a0a', new: true },
  { id: 'dark_midnight', name: 'Midnight', category: 'dark', desc: 'Deep blue with ice accents', accent: '#60a5fa', bg: '#0b1120', new: true },
  { id: 'dark_eclipse', name: 'Eclipse', category: 'dark', desc: 'Amber sidebar on warm dark', accent: '#f59e0b', bg: '#12100e', new: true },
  { id: 'dark_void', name: 'Void', category: 'dark', desc: 'OLED black with violet glow', accent: '#a78bfa', bg: '#000000', new: true },
  { id: 'dark_carbon', name: 'Carbon', category: 'dark', desc: 'Carbon gray with teal accents', accent: '#2dd4bf', bg: '#141414', new: true },
  // Signature collection
  { id: 'prestige', name: 'Prestige', category: 'executive', desc: 'Gold accents, luxury two-column', accent: '#c5a572', bg: '#ffffff', premium: true },
  { id: 'modern_sidebar', name: 'Modern Sidebar', category: 'professional', desc: 'Green accent, sidebar layout', accent: '#2D8C6F', bg: '#ffffff', new: true },
  { id: 'coral_horizon', name: 'Coral Horizon', category: 'creative', desc: 'Warm coral gradient header', accent: '#E8634A', bg: '#ffffff', new: true },
  { id: 'swiss_grid', name: 'Swiss Grid', category: 'minimal', desc: 'Bold black + red grid layout', accent: '#FF0000', bg: '#ffffff', new: true },
  { id: 'ocean_breeze', name: 'Ocean Breeze', category: 'creative', desc: 'Centered sky-blue pill sections', accent: '#0EA5E9', bg: '#ffffff', new: true },
  { id: 'monochrome_editorial', name: 'Editorial', category: 'mono', desc: 'Double-ruled masthead, justified', accent: '#0a0a0a', bg: '#ffffff', new: true },
  { id: 'midnight_luxe', name: 'Midnight Luxe', category: 'dark', desc: 'Gold on navy, centered luxury', accent: '#C9A96E', bg: '#1A1A2E', premium: true },
  { id: 'forest_canopy', name: 'Forest', category: 'creative', desc: 'Pine green timeline with leaf accents', accent: '#2D5016', bg: '#ffffff', new: true },
  { id: 'copper_deco', name: 'Copper Deco', category: 'executive', desc: 'Art deco ornaments, warm copper', accent: '#B87333', bg: '#ffffff', premium: true },
  { id: 'arctic_frost', name: 'Arctic Frost', category: 'professional', desc: 'Nord palette sidebar with cards', accent: '#5E81AC', bg: '#ffffff', new: true },
  { id: 'sunset_gradient', name: 'Sunset', category: 'creative', desc: 'Orange-to-plum gradient header', accent: '#E85D26', bg: '#ffffff', new: true },
  { id: 'metro_line', name: 'Metro Line', category: 'professional', desc: 'Blue metro timeline layout', accent: '#0078D4', bg: '#ffffff', new: true },
  { id: 'rose_quartz', name: 'Rose Quartz', category: 'creative', desc: 'Soft pink centered elegance', accent: '#C77D8A', bg: '#ffffff', new: true },
  { id: 'concrete_brutalist', name: 'Brutalist', category: 'creative', desc: 'Bold borders, yellow highlights', accent: '#FFD600', bg: '#ffffff', new: true },
  { id: 'lavender_fields', name: 'Lavender', category: 'creative', desc: 'Purple badge sections, soft bg', accent: '#7C6DAF', bg: '#ffffff', new: true },
  { id: 'steel_industrial', name: 'Steel', category: 'professional', desc: 'Iron header with orange rivets', accent: '#37474F', bg: '#ffffff', new: true },
  { id: 'obsidian_executive', name: 'Obsidian Exec', category: 'dark', desc: 'Violet glow on deep black cards', accent: '#7C4DFF', bg: '#0D0D1A', premium: true },
  { id: 'ivory_prestige', name: 'Ivory', category: 'executive', desc: 'Ornate ivory with tan filigree', accent: '#C4A97D', bg: '#FEFCF6', premium: true },
  { id: 'aurora_borealis', name: 'Aurora', category: 'dark', desc: 'Teal-to-pink gradient dark cards', accent: '#00C9A7', bg: '#0B1622', new: true },
  { id: 'blueprint_architect', name: 'Blueprint', category: 'dark', desc: 'Grid-paper dark blue, monospace', accent: '#4FC3F7', bg: '#0D2137', new: true },
  { id: 'onyx_ember', name: 'Onyx Ember', category: 'dark', desc: 'Black with ember orange accents', accent: '#FF5722', bg: '#121212', new: true },
  { id: 'exec_prestige', name: 'Prestige', category: 'executive', desc: 'Serif header, impact cards', accent: '#0f0f0f', bg: '#ffffff', premium: true },
  { id: 'exec_pillar', name: 'Pillar', category: 'executive', desc: 'Timeline dots, dark header band', accent: '#0e0e0e', bg: '#ffffff', premium: true },
  { id: 'exec_regal', name: 'Regal', category: 'executive', desc: 'Centered serif, ornamental rules', accent: '#0b0b0b', bg: '#ffffff', premium: true },
  { id: 'exec_apex', name: 'Apex', category: 'executive', desc: 'Angular black header, structured', accent: '#0c0c0c', bg: '#ffffff', premium: true },
  { id: 'exec_strata', name: 'Strata', category: 'executive', desc: 'Layered horizontal bands', accent: '#0d0d0d', bg: '#ffffff', premium: true },
  { id: 'exec_counsel', name: 'Counsel', category: 'executive', desc: 'Legal style, double-ruled header', accent: '#0e0e0e', bg: '#ffffff', premium: true },
  { id: 'exec_monogram', name: 'Monogram', category: 'executive', desc: 'Initials badge, sidebar layout', accent: '#0c0c0c', bg: '#ffffff', premium: true },
  { id: 'exec_ledger', name: 'Ledger', category: 'executive', desc: 'Three-column bottom, precision', accent: '#0b0b0b', bg: '#ffffff', premium: true },
  { id: 'exec_architect', name: 'Architect', category: 'executive', desc: 'Grid layout, structured blueprint', accent: '#0a0a0a', bg: '#ffffff', premium: true },
]

const FILTERS = [
  { id: 'all', label: 'All Themes' },
  { id: 'professional', label: 'Professional' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'creative', label: 'Creative' },
  { id: 'mono', label: 'Mono' },
  { id: 'executive', label: 'Executive' },
  { id: 'dark', label: 'Dark' },
]

function ThemePreview({ theme, data }: { theme: Theme; data: Partial<ResumeData> | undefined }) {
  const PreviewComponent = PREVIEW_MAP[theme.id]
  if (!PreviewComponent) return null
  return <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100%' }}><PreviewComponent data={data} /></div>
}

export default function ThemesPage() {
  const [filter, setFilter] = useState('all')
  const [selectedThemeId, setSelectedThemeId] = useState('classic')
  const { user, createResume, currentResume } = useStore()
  const router = useRouter()
  const visible = THEMES.filter((t) => filter === 'all' || t.category === filter)
  const resumeData = currentResume?.data
  const selectedTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0]

  useSEO({
    title: 'Resume Themes & Templates',
    description: 'Browse ATS-optimized, professionally designed resume themes. Find the perfect template for your next job application.',
    path: '/themes',
  })

  const [useThemeLoading, setUseThemeLoading] = useState(false)

  const handleUseTheme = async (theme: Theme) => {
    if (!user) { router.push('/auth?mode=signup'); return }
    setUseThemeLoading(true)
    try {
      console.log('[ThemesPage] Creating resume with theme:', theme.id, 'user:', user.id)
      const resume = await createResume(theme.id)
      console.log('[ThemesPage] Resume created:', resume.id)
      // TC-045 fix: Use hard navigation to ensure the editor loads with the new theme
      window.location.href = `/editor/${resume.id}`
    } catch (err: any) {
      console.error('[ThemesPage] Error creating resume:', err)
      if (err.message === 'LIMIT_REACHED') { toast.error('Resume limit reached.'); router.push('/pricing') }
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
            <div className="flex-1 min-h-0 flex items-start justify-center px-8 py-7 overflow-auto relative">
              <div className="w-[794px] bg-white shrink-0 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.06),0_12px_36px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.2),0_12px_36px_rgba(0,0,0,0.3)] preview-fill" style={{ zoom: 0.65, transformOrigin: 'top center' }} key={selectedTheme.id}>
                <ThemePreview theme={selectedTheme} data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
