import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin, getSupabaseUser, extractToken } from '@/lib/server/supabase-admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' as any })

function resolvePriceId(plan: string, billing: string): string | null {
    const map: Record<string, string> = {
        pro_monthly: 'STRIPE_PRO_MONTHLY_PRICE_ID',
        pro_annual: 'STRIPE_PRO_ANNUAL_PRICE_ID',
        premium_monthly: 'STRIPE_PREMIUM_MONTHLY_PRICE_ID',
        premium_annual: 'STRIPE_PREMIUM_ANNUAL_PRICE_ID',
        career_plus_monthly: 'STRIPE_CAREER_PLUS_MONTHLY_PRICE_ID',
        career_plus_annual: 'STRIPE_CAREER_PLUS_ANNUAL_PRICE_ID',
        founding_annual: 'STRIPE_FOUNDING_ANNUAL_PRICE_ID',
    }
    const key = `${plan}_${billing}`
    const secretName = map[key]
    if (!secretName) return null
    return process.env[secretName] || null
}

function getTrialDays(plan: string): number | undefined {
    const trials: Record<string, number> = { pro: 7 }
    return trials[plan]
}

export async function POST(request: NextRequest) {
    try {
        const token = extractToken(request.headers.get('authorization'))
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const supabaseUser = getSupabaseUser(token)
        const { data: { user }, error: authError } = await supabaseUser.auth.getUser()
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { plan, billing, trialDays: clientTrialDays } = body
        let priceId = body.priceId

        if (!priceId && plan && billing) {
            priceId = resolvePriceId(plan, billing)
            if (!priceId) throw new Error(`Price not configured for ${plan}/${billing}`)
        }
        if (!priceId) throw new Error('Missing plan/billing or priceId')

        const supabaseAdmin = getSupabaseAdmin()

        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('stripe_customer_id, email, full_name')
            .eq('id', user.id)
            .single()

        if (plan === 'founding') {
            const { count } = await supabaseAdmin
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('plan', 'founding')
            if (count !== null && count >= 100) throw new Error('The Founding Member offer has sold out.')
        }

        let customerId = profile?.stripe_customer_id
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: profile?.email || user.email,
                name: profile?.full_name || undefined,
                metadata: { supabase_user_id: user.id },
            })
            customerId = customer.id
            await supabaseAdmin.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
        } else {
            const existingSubs = await stripe.subscriptions.list({ customer: customerId, status: 'active' })
            const trialSubs = await stripe.subscriptions.list({ customer: customerId, status: 'trialing' })
            for (const sub of [...existingSubs.data, ...trialSubs.data]) {
                await stripe.subscriptions.cancel(sub.id)
            }
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumebuildin.com'
        const trialPeriodDays = clientTrialDays || getTrialDays(plan) || undefined

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${appUrl}/welcome`,
            cancel_url: `${appUrl}/pricing?cancelled=true`,
            subscription_data: {
                metadata: { supabase_user_id: user.id, plan },
                trial_period_days: trialPeriodDays,
            },
            allow_promotion_codes: true,
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
