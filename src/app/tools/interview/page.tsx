export const dynamic = 'force-dynamic'
import { ProtectedRoute } from '@/components/AuthGuard'
import InterviewToolkitPage from '@/views/InterviewToolkitPage'

export default function Interview() {
    return <ProtectedRoute><InterviewToolkitPage /></ProtectedRoute>
}
