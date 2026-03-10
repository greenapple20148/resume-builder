export const dynamic = 'force-dynamic'
import { ProtectedRoute } from '@/components/AuthGuard'
import WelcomePage from '@/views/WelcomePage'

export default function Welcome() {
    return <ProtectedRoute><WelcomePage /></ProtectedRoute>
}
