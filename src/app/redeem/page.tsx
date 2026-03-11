export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import RedeemCouponPage from '@/views/RedeemCouponPage'

export default function Redeem() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--parchment)' }}>
                <div className="spinner" style={{ color: 'var(--gold)' }} />
            </div>
        }>
            <RedeemCouponPage />
        </Suspense>
    )
}
