export const dynamic = 'force-dynamic'
import { ProtectedRoute } from '@/components/AuthGuard'
import EditorPage from '@/views/EditorPage'

export default function EditorNew() {
    return <ProtectedRoute><EditorPage /></ProtectedRoute>
}
