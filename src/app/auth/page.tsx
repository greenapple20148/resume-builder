export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { PublicRoute } from '@/components/AuthGuard'
import AuthPage from '@/views/AuthPage'

export default function Auth() {
    return (
        <PublicRoute>
            <Suspense>
                <AuthPage />
            </Suspense>
        </PublicRoute>
    )
}
