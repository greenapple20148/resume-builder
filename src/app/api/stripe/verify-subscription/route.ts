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
            .select('stripe_customer_id, plan')
            .eq('id', user.id)
            .single()

        if (!profile?.stripe_customer_id) {
            return NextResponse.json({ plan: profile?.plan || 'free', synced: false })
        }

        const subscriptions = await stripe.subscriptions.list({ customer: profile.stripe_customer_id, status: 'active', limit: 10 })
        const trialSubs = await stripe.subscriptions.list({ customer: profile.stripe_customer_id, status: 'trialing', limit: 10 })
        const allSubs = [...subscriptions.data, ...trialSubs.data]

        if (allSubs.length === 0) {
            await supabaseAdmin.from('profiles').update({ plan: 'free', subscription_status: 'none' }).eq('id', user.id)
            return NextResponse.json({ plan: 'free', synced: true })
        }

        const premiumPriceIds = [process.env.VITE_STRIPE_TEAM_MONTHLY_PRICE_ID, process.env.VITE_STRIPE_TEAM_ANNUAL_PRICE_ID].filter(Boolean)
        const careerPlusPriceIds = [process.env.VITE_STRIPE_CAREER_PLUS_MONTHLY_PRICE_ID, process.env.VITE_STRIPE_CAREER_PLUS_ANNUAL_PRICE_ID].filter(Boolean)

        const determinePlan = (sub: any): string => {
            if (sub.metadata?.plan) return sub.metadata.plan
            const priceIds = sub.items?.data?.map((item: any) => item.price?.id) || []
            if (priceIds.some((id: string) => careerPlusPriceIds.includes(id))) return 'career_plus'
            if (priceIds.some((id: string) => premiumPriceIds.includes(id))) return 'premium'
            return 'pro'
        }

        const tierOrder: Record<string, number> = { free: 0, pro: 1, premium: 2, career_plus: 3 }
        let bestPlan = 'pro'
        let bestSub = allSubs[0]
        for (const sub of allSubs) {
            const plan = determinePlan(sub)
            if ((tierOrder[plan] || 0) > (tierOrder[bestPlan] || 0)) {
                bestPlan = plan
                bestSub = sub
            }
        }

        await supabaseAdmin.from('profiles').update({
            plan: bestPlan,
            stripe_subscription_id: bestSub.id,
            subscription_status: bestSub.status,
            subscription_period_end: new Date(bestSub.current_period_end * 1000).toISOString(),
        }).eq('id', user.id)

        return NextResponse.json({ plan: bestPlan, synced: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
