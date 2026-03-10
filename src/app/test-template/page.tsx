export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import TestTemplatePage from '@/views/TestTemplatePage'

export default function TestTemplate() {
    return (
        <Suspense>
            <TestTemplatePage />
        </Suspense>
    )
}
