import { useState, useEffect } from 'react'

export function useTheme() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const saved = localStorage.getItem('resumecraft-theme')
        if (saved === 'light' || saved === 'dark') return saved
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('resumecraft-theme', theme)
    }, [theme])

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

    return { theme, toggleTheme, setTheme }
}
