import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/server/supabase-admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' as any })

async function sendEmail(payload: Record<string, unknown>) {
    try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        await fetch(`${appUrl}/api/email/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-secret': process.env.SUPABASE_SERVICE_ROLE_KEY || '' },
            body: JSON.stringify(payload),
        })
    } catch (e) {
        console.error('Email send failed (non-blocking):', e)
    }
}

async function findProfileByCustomerId(customerId: string) {
    const supabaseAdmin = getSupabaseAdmin()
    const { data } = await supabaseAdmin.from('profiles').select('id, plan, subscription_status').eq('stripe_customer_id', customerId).single()
    return data
}

export async function POST(request: NextRequest) {
    const signature = request.headers.get('stripe-signature')
    if (!signature) return NextResponse.json({ error: 'No signature' }, { status: 400 })

    const body = await request.text()
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || '')
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session
            const customerId = session.customer as string

            if (session.mode === 'payment') {
                const addonType = session.metadata?.addon_type
                const supabaseUserId = session.metadata?.supabase_user_id
                if (!supabaseUserId) { console.error('No supabase_user_id for add-on'); break }

                if (addonType === 'mock_pack') {
                    const { data: profile } = await supabaseAdmin.from('profiles').select('mock_sessions_purchased').eq('id', supabaseUserId).single()
                    const currentSessions = profile?.mock_sessions_purchased || 0
                    const sessionsToAdd = parseInt(session.metadata?.sessions_count || '3', 10)
                    const { error } = await supabaseAdmin.from('profiles').update({ mock_sessions_purchased: currentSessions + sessionsToAdd, stripe_customer_id: customerId }).eq('id', supabaseUserId)
                    if (error) console.error('Error adding mock sessions:', error)
                    else await sendEmail({ type: 'mock_pack', userId: supabaseUserId, data: { sessions: String(sessionsToAdd) } })
                } else if (addonType === 'express_unlock') {
                    const unlockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                    const { error } = await supabaseAdmin.from('profiles').update({ express_unlock_until: unlockUntil, stripe_customer_id: customerId }).eq('id', supabaseUserId)
                    if (error) console.error('Error activating express unlock:', error)
                    else await sendEmail({ type: 'express_unlock', userId: supabaseUserId })
                }
                break
            }

            const subscriptionId = session.subscription as string
            const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any
            const plan = subscription.metadata?.plan || 'pro'
            const supabaseUserId = subscription.metadata?.supabase_user_id

            const updateData = {
                plan,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                subscription_status: subscription.status || 'active',
                subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            }

            let result
            if (supabaseUserId) {
                result = await supabaseAdmin.from('profiles').update(updateData).eq('id', supabaseUserId)
            } else {
                result = await supabaseAdmin.from('profiles').update(updateData).eq('stripe_customer_id', customerId)
            }
            if (result.error) console.error('Error updating profile:', result.error)
            else await sendEmail({ type: 'plan_confirmation', userId: supabaseUserId, plan })
            break
        }

        case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription
            const previousAttributes = (event.data as any).previous_attributes || {}
            let dbStatus = subscription.status
            if (subscription.cancel_at_period_end && subscription.status === 'active') dbStatus = 'cancelling' as any
            if (previousAttributes.cancel_at_period_end === true && !subscription.cancel_at_period_end) dbStatus = 'active'

            const updatePayload: Record<string, unknown> = {
                subscription_status: dbStatus,
                subscription_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            }
            if (subscription.metadata?.plan) updatePayload.plan = subscription.metadata.plan

            const { error } = await supabaseAdmin.from('profiles').update(updatePayload).eq('stripe_subscription_id', subscription.id)
            if (error) console.error('Error updating subscription:', error)
            break
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription
            const customerId = subscription.customer as string
            const activeSubs = await stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 1 })
            const trialSubs = await stripe.subscriptions.list({ customer: customerId, status: 'trialing', limit: 1 })

            if (activeSubs.data.length === 0 && trialSubs.data.length === 0) {
                await supabaseAdmin.from('profiles').update({ plan: 'free', subscription_status: 'cancelled', stripe_subscription_id: null }).eq('stripe_customer_id', customerId)
                const profile = await findProfileByCustomerId(customerId)
                if (profile?.id) await sendEmail({ type: 'cancellation_confirmation', userId: profile.id })
            }
            break
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice
            const customerId = invoice.customer as string
            const subscriptionId = (invoice as any).subscription as string
            if (subscriptionId) {
                await supabaseAdmin.from('profiles').update({ subscription_status: 'past_due' }).eq('stripe_subscription_id', subscriptionId)
                const profile = await findProfileByCustomerId(customerId)
                if (profile?.id) await sendEmail({ type: 'payment_failed', userId: profile.id, data: { attempt: String(invoice.attempt_count || 1) } })
            }
            break
        }
    }

    return NextResponse.json({ received: true })
}
