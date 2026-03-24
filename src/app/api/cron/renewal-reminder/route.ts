import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/server/supabase-admin'

// Cron-triggered endpoint to send renewal reminders.
// Protected by x-api-secret header or cron secret.

export async function POST(request: NextRequest) {
    try {
        const apiSecret = request.headers.get('x-api-secret') || request.headers.get('authorization')?.replace('Bearer ', '')
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!apiSecret || apiSecret !== serviceKey) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabaseAdmin = getSupabaseAdmin()
        const now = new Date()
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        const sixDaysFromNow = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000)

        const { data: users, error } = await supabaseAdmin
            .from('profiles')
            .select('id, email, full_name, plan, subscription_period_end, subscription_status')
            .not('subscription_period_end', 'is', null)
            .eq('subscription_status', 'active')
            .neq('plan', 'free')
            .gte('subscription_period_end', sixDaysFromNow.toISOString())
            .lte('subscription_period_end', sevenDaysFromNow.toISOString())

        if (error) throw new Error(`Failed to query profiles: ${error.message}`)
        if (!users || users.length === 0) return NextResponse.json({ sent: 0, message: 'No renewals in the next 7 days.' })

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        let sent = 0
        const errors: string[] = []

        for (const user of users) {
            try {
                const renewDate = new Date(user.subscription_period_end)
                const renewFormatted = renewDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

                await fetch(`${appUrl}/api/email/send`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-api-secret': serviceKey || '' },
                    body: JSON.stringify({ type: 'renewal_reminder', userId: user.id, data: { plan: user.plan, renewDate: renewFormatted } }),
                })
                sent++
            } catch (e: any) {
                errors.push(`${user.id}: ${e.message}`)
            }
        }

        return NextResponse.json({ sent, total: users.length, errors: errors.length > 0 ? errors : undefined })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
