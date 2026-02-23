import { useState, useEffect, useCallback } from 'react'

const THEME_KEY = 'resumecraft-theme'

function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
    const [theme, setThemeState] = useState(getPreferredTheme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem(THEME_KEY, theme)
    }, [theme])

    // Listen for OS preference changes when no stored preference
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e) => {
            if (!localStorage.getItem(THEME_KEY)) {
                setThemeState(e.matches ? 'dark' : 'light')
            }
        }
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }, [])

    return { theme, toggleTheme, isDark: theme === 'dark' }
}
