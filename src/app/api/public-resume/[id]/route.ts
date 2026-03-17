import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// BUG-018 fix: Server-side API route that fetches resume data using the service role key,
// bypassing RLS policies. This enables public sharing via /resume/[id] pages.
// The anon key approach fails when RLS restricts reads to auth.uid() = user_id.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    if (!id) {
        return NextResponse.json({ error: 'Missing resume ID' }, { status: 400 })
    }

    if (!supabaseUrl || !supabaseServiceKey) {
        return NextResponse.json(
            { error: 'Server configuration error — missing Supabase credentials' },
            { status: 500 }
        )
    }

    try {
        // Use service role key to bypass RLS
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

        const { data, error } = await supabaseAdmin
            .from('resumes')
            .select('title, theme_id, data')
            .eq('id', id)
            .single()

        if (error || !data) {
            return NextResponse.json(
                { error: 'Resume not found or not available.' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            title: data.title,
            theme_id: data.theme_id,
            data: data.data,
        })
    } catch (err: any) {
        console.error('[public-resume] Error fetching resume:', err)
        return NextResponse.json(
            { error: 'Could not load resume.' },
            { status: 500 }
        )
    }
}
