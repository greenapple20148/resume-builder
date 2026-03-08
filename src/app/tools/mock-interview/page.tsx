export const dynamic = 'force-dynamic'
import { ProtectedRoute } from '@/components/AuthGuard'
import MockInterviewPage from '@/views/MockInterviewPage'

export default function MockInterview() {
    return <ProtectedRoute><MockInterviewPage /></ProtectedRoute>
}
