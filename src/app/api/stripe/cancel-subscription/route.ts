import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin, getSupabaseUser, extractToken } from '@/lib/server/supabase-admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' as any })

export async function POST(request: NextRequest) {
    try {
        const token = extractToken(request.headers.get('authorization'))
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const supabaseUser = getSupabaseUser(token)
        const { data: { user }, error: authError } = await supabaseUser.auth.getUser()
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const supabaseAdmin = getSupabaseAdmin()
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('stripe_subscription_id, stripe_customer_id, plan, subscription_period_end')
            .eq('id', user.id)
            .single()

        if (!profile?.stripe_subscription_id) {
            throw new Error('No active subscription found.')
        }

        const subscription = await stripe.subscriptions.update(profile.stripe_subscription_id, { cancel_at_period_end: true }) as any

        const periodEnd = new Date(subscription.current_period_end * 1000)
        const periodEndISO = periodEnd.toISOString()
        const periodEndFormatted = periodEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

        await supabaseAdmin.from('profiles').update({
            subscription_status: 'cancelling',
            subscription_period_end: periodEndISO,
        }).eq('id', user.id)

        return NextResponse.json({
            success: true,
            message: `Your subscription will remain active until ${periodEndFormatted}. After that, you'll be moved to the Free plan.`,
            periodEnd: periodEndISO,
            periodEndFormatted,
        })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
}
