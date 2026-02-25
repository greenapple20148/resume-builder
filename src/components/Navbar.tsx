import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { useTheme } from '../lib/useTheme'
import styles from './Navbar.module.css'

interface NavbarProps {
  variant?: 'default' | 'editor' | 'transparent'
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const { user, profile, signOut } = useStore()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className={`${styles.nav} ${styles[variant]}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>◈</span>
          Resume<em>BuildIn</em>
        </Link>

        {/* Center links */}
        <div className={styles.links}>
          <Link to="/themes" className={`${styles.link} ${isActive('/themes') ? styles.active : ''}`}>
            Themes
          </Link>
          <Link to="/pricing" className={`${styles.link} ${isActive('/pricing') ? styles.active : ''}`}>
            Pricing
          </Link>
        </div>

        {/* Right actions */}
        <div className={styles.actions}>
          {/* Theme toggle */}
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch  to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            <span className={styles.themeToggleIcon}>
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </span>
          </button>

          {user ? (
            <>
              {profile?.plan !== 'free' && (
                <span className="badge badge-gold">{profile?.plan}</span>
              )}
              <Link to="/dashboard" className="btn btn-outline btn-sm">
                Dashboard
              </Link>
              <button
                className={styles.avatar}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="User menu"
              >
                {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </button>
              {menuOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownUser}>
                    <div className={styles.dropdownName}>
                      {profile?.full_name || 'User'}
                    </div>
                    <div className={styles.dropdownEmail}>{user.email}</div>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link to="/dashboard" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                    My Resumes
                  </Link>
                  <Link to="/profile" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  {profile?.plan === 'premium' && (
                    <>
                      <Link to="/tools/linkedin" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                        🔗 LinkedIn Toolkit
                      </Link>
                      <Link to="/tools/interview" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                        🎤 Interview Toolkit
                      </Link>
                    </>
                  )}
                  <Link to="/pricing" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                    Billing & Plans
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <button className={styles.dropdownItem} onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/auth" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link to="/auth?mode=signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
