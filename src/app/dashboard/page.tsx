export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { ProtectedRoute } from '@/components/AuthGuard'
import DashboardPage from '@/views/DashboardPage'

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <Suspense fallback={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--parchment)' }}>
                    <div className="spinner" style={{ color: 'var(--gold)' }} />
                </div>
            }>
                <DashboardPage />
            </Suspense>
        </ProtectedRoute>
    )
}
