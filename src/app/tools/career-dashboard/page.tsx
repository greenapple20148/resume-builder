export const dynamic = 'force-dynamic'
import { ProtectedRoute } from '@/components/AuthGuard'
import CareerDashboardPage from '@/views/CareerDashboardPage'

export default function CareerDashboard() {
    return <ProtectedRoute><CareerDashboardPage /></ProtectedRoute>
}
