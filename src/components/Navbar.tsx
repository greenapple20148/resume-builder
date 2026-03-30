'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useStore } from '../lib/store'
import { useTheme } from '../lib/useTheme'
import { getEffectivePlan, isExpressUnlockActive } from '../lib/expressUnlock'

interface NavbarProps {
  variant?: 'default' | 'editor' | 'transparent'
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const { user, profile, signOut } = useStore()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Track scroll position for transparent variant
  useEffect(() => {
    if (variant !== 'transparent') return
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [variant])

  const handleSignOut = async () => {
    await signOut()
    // ProtectedRoute detects null user and redirects to /auth
  }

  const isActive = (path: string) => pathname === path

  // Build nav classes based on variant + scroll state
  const isTransparent = variant === 'transparent' && !scrolled
  const navClasses = [
    'sticky top-0 z-[100] transition-all duration-300',
    isTransparent
      ? 'bg-transparent border-b border-transparent'
      : 'bg-[rgba(250,248,243,0.92)] dark:bg-[rgba(18,17,16,0.92)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
  ].join(' ')

  return (
    <nav className={navClasses} aria-label="Main navigation">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 h-[60px] flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="font-display text-[22px] font-light text-ink no-underline tracking-tight flex items-center gap-1.5 whitespace-nowrap shrink-0">
          <span className="text-gold text-base leading-none">◈</span>
          Resume<em className="italic text-gold">BuildIn</em>
        </Link>

        {/* Center links */}
        <div className="hidden sm:flex gap-1 flex-1">
          <Link
            href="/themes"
            className={`px-3.5 py-1.5 text-[13px] rounded-lg transition-all duration-200 ${isActive('/themes')
              ? 'text-ink font-medium bg-ink-05'
              : 'text-ink-40 hover:text-ink hover:bg-[rgba(0,0,0,0.04)]'
              }`}
          >
            Themes
          </Link>
          <Link
            href="/pricing"
            className={`px-3.5 py-1.5 text-[13px] rounded-lg transition-all duration-200 ${isActive('/pricing')
              ? 'text-ink font-medium bg-ink-05'
              : 'text-ink-40 hover:text-ink hover:bg-[rgba(0,0,0,0.04)]'
              }`}
          >
            Pricing
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 relative ml-auto sm:ml-0">
          {/* Theme toggle */}
          <button
            className="w-[34px] h-[34px] rounded-full bg-ink-05 border border-ink-10 cursor-pointer flex items-center justify-center transition-all duration-200 text-ink-40 shrink-0 hover:bg-ink-10 hover:text-gold hover:border-gold hover:rotate-[15deg]"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            <span className="flex items-center justify-center transition-transform duration-300">
              {isDark ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </span>
          </button>

          {user ? (
            <>
              {(getEffectivePlan(profile) !== 'free' || isExpressUnlockActive(profile)) && (
                <span className="badge badge-gold">{isExpressUnlockActive(profile) && profile?.plan === 'free' ? 'EXPRESS' : profile?.plan}</span>
              )}
              <Link href="/dashboard" className="btn btn-outline btn-sm">
                Dashboard
              </Link>
              <button
                className="w-[34px] h-[34px] rounded-full bg-ink dark:bg-gold text-parchment text-[13px] font-semibold border-none cursor-pointer flex items-center justify-center transition-opacity duration-200 font-display hover:opacity-80"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="User menu"
              >
                {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </button>
              {menuOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 bg-white dark:bg-ink-05 border border-ink-10 rounded-xl shadow-lg min-w-[200px] overflow-hidden animate-[slideDown_0.2s_ease]">
                  <div className="px-4 py-3.5">
                    <div className="text-sm font-medium text-ink mb-0.5">
                      {profile?.full_name || 'User'}
                    </div>
                    <div className="text-xs text-ink-40 font-mono">{user.email}</div>
                  </div>
                  <div className="h-px bg-ink-10" />
                  <Link href="/dashboard" className="block w-full text-left px-4 py-2.5 text-sm text-ink-70 no-underline transition-colors duration-150 hover:bg-ink-05 hover:text-ink" onClick={() => setMenuOpen(false)}>
                    My Resumes
                  </Link>
                  <Link href="/profile" className="block w-full text-left px-4 py-2.5 text-sm text-ink-70 no-underline transition-colors duration-150 hover:bg-ink-05 hover:text-ink" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  {(getEffectivePlan(profile) === 'pro' || getEffectivePlan(profile) === 'premium' || getEffectivePlan(profile) === 'career_plus') && (
                    <Link href="/tools/cover-letter" className="block w-full text-left px-4 py-2.5 text-sm text-ink-70 no-underline transition-colors duration-150 hover:bg-ink-05 hover:text-ink" onClick={() => setMenuOpen(false)}>
                      Cover Letters
                    </Link>
                  )}
                  {(getEffectivePlan(profile) === 'premium' || getEffectivePlan(profile) === 'career_plus') && (
                    <>
                      <Link href="/tools/linkedin" className="block w-full text-left px-4 py-2.5 text-sm text-ink-70 no-underline transition-colors duration-150 hover:bg-ink-05 hover:text-ink" onClick={() => setMenuOpen(false)}>
                        LinkedIn Toolkit
                      </Link>
                      <Link href="/tools/interview" className="block w-full text-left px-4 py-2.5 text-sm text-ink-70 no-underline transition-colors duration-150 hover:bg-ink-05 hover:text-ink" onClick={() => setMenuOpen(false)}>
                        Interview Toolkit
                      </Link>
                      <Link href="/tools/mock-interview" className="block w-full text-left px-4 py-2.5 text-sm text-ink-70 no-underline transition-colors duration-150 hover:bg-ink-05 hover:text-ink" onClick={() => setMenuOpen(false)}>
                        AI Mock Interview
                      </Link>
                      {profile?.plan === 'career_plus' && (
                        <Link href="/tools/career-dashboard" className="block w-full text-left px-4 py-2.5 text-sm text-gold font-medium no-underline transition-colors duration-150 hover:bg-gold/5" onClick={() => setMenuOpen(false)}>
                          ✦ Career Dashboard
                        </Link>
                      )}
                      <Link href="/tools/ai" className="block w-full text-left px-4 py-2.5 text-sm text-ink-70 no-underline transition-colors duration-150 hover:bg-ink-05 hover:text-ink" onClick={() => setMenuOpen(false)}>
                        AI Tools
                      </Link>
                    </>
                  )}
                  <Link href="/pricing" className="block w-full text-left px-4 py-2.5 text-sm text-ink-70 no-underline transition-colors duration-150 hover:bg-ink-05 hover:text-ink" onClick={() => setMenuOpen(false)}>
                    Billing & Plans
                  </Link>
                  <div className="h-px bg-ink-10" />
                  <button className="block w-full text-left px-4 py-2.5 text-sm text-ink-70 bg-transparent border-none cursor-pointer transition-colors duration-150 hover:bg-ink-05 hover:text-ink font-[inherit]" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/auth" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link href="/auth?mode=signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
