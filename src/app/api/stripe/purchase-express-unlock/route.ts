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
            .select('stripe_customer_id, email, full_name, plan')
            .eq('id', user.id)
            .single()

        if (profile?.plan && profile.plan !== 'free') {
            throw new Error('You already have a paid plan. Express Unlock is for free users.')
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
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumebuildin.com'
        const priceId = process.env.EXPRESS_UNLOCK_PRICE_ID
        if (!priceId) throw new Error('EXPRESS_UNLOCK_PRICE_ID is not configured.')

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${appUrl}/dashboard?purchased=express_unlock`,
            cancel_url: `${appUrl}/pricing?cancelled=true`,
            metadata: { supabase_user_id: user.id, addon_type: 'express_unlock' },
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
