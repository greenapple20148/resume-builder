import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/server/stripe'
import { getSupabaseAdmin, getSupabaseUser, extractToken } from '@/lib/server/supabase-admin'


export async function POST(request: NextRequest) {
    try {
        const token = extractToken(request.headers.get('authorization'))
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const supabaseUser = getSupabaseUser(token)
        const { data: { user }, error: authError } = await supabaseUser.auth.getUser()
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const supabaseAdmin = getSupabaseAdmin()
        const { data: profile, error: profileErr } = await supabaseAdmin
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single()

        if (profileErr) return NextResponse.json({ error: `Profile fetch failed: ${profileErr.message}` }, { status: 500 })
        if (!profile?.stripe_customer_id) return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 })

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumebuildin.com'
        const portalSession = await getStripe().billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${appUrl}/dashboard`,
        })

        return NextResponse.json({ url: portalSession.url })
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Unexpected error' }, { status: 500 })
    }
}
