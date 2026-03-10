'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import { useTheme } from '@/lib/useTheme'
import { Toast } from '@/components/Toast'
import SupportAgent from '@/components/SupportAgent'
import ExpressUnlockBanner from '@/components/ExpressUnlockBanner'

export function ClientProviders({ children }: { children: React.ReactNode }) {
    const { initAuth } = useStore()
    useTheme()

    useEffect(() => {
        initAuth()
    }, [initAuth])

    return (
        <>
            <Toast />
            <ExpressUnlockBanner />
            {children}
            <SupportAgent />
        </>
    )
}
