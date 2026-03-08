export const dynamic = 'force-dynamic'
import { ProtectedRoute } from '@/components/AuthGuard'
import ProfilePage from '@/views/ProfilePage'

export default function Profile() {
    return <ProtectedRoute><ProfilePage /></ProtectedRoute>
}
