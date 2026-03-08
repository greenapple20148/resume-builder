export const dynamic = 'force-dynamic'
import { ProtectedRoute } from '@/components/AuthGuard'
import CoverLetterPage from '@/views/CoverLetterPage'

export default function CoverLetter() {
    return <ProtectedRoute><CoverLetterPage /></ProtectedRoute>
}
