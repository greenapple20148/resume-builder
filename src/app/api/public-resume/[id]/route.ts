import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Public resume API route — fetches resume data for shared/public viewing.
// Uses the service role key (bypasses RLS) if available, otherwise falls back
// to the anon key which can read resumes where is_public = TRUE via RLS policy.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    if (!id) {
        return NextResponse.json({ error: 'Missing resume ID' }, { status: 400 })
    }

    if (!supabaseUrl) {
        return NextResponse.json(
            { error: 'Server configuration error — missing Supabase URL' },
            { status: 500 }
        )
    }

    try {
        // Prefer service role key (bypasses RLS), fallback to anon key (uses RLS).
        // With anon key, the query will only succeed if the resume has is_public = TRUE,
        // which is enforced by the RLS policy "Users can view public resumes".
        const key = supabaseServiceKey || supabaseAnonKey
        if (!key) {
            return NextResponse.json(
                { error: 'Server configuration error — missing Supabase credentials' },
                { status: 500 }
            )
        }

        const supabaseClient = createClient(supabaseUrl, key)

        // Build the query — with service role key we can read anything;
        // with anon key the RLS policy filters to is_public = TRUE automatically.
        let query = supabaseClient
            .from('resumes')
            .select('title, theme_id, data, is_public')
            .eq('id', id)

        // When using service role key, also enforce is_public check in code
        // so non-public resumes can't be accessed via the API.
        if (supabaseServiceKey) {
            query = query.eq('is_public', true)
        }

        const { data, error } = await query.single()

        if (error || !data) {
            return NextResponse.json(
                { error: 'Resume not found or not publicly shared.' },
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
