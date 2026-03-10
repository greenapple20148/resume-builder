export const dynamic = 'force-dynamic'
import { ProtectedRoute } from '@/components/AuthGuard'
import LinkedInToolkitPage from '@/views/LinkedInToolkitPage'

export default function LinkedIn() {
    return <ProtectedRoute><LinkedInToolkitPage /></ProtectedRoute>
}
