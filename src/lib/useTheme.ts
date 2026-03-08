'use client'
import { useState, useEffect } from 'react'

export function useTheme() {
    // Always initialize to 'light' for SSR consistency.
    // The beforeInteractive script in layout.tsx already sets data-theme
    // on the HTML element to prevent FOUC. We sync React state in useEffect.
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    // Sync with stored/system preference after hydration
    useEffect(() => {
        const saved = localStorage.getItem('resumebuildin-theme')
        if (saved === 'light' || saved === 'dark') {
            setTheme(saved)
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark')
        }
    }, [])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('resumebuildin-theme', theme)
    }, [theme])

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

    return { theme, toggleTheme, setTheme }
}
