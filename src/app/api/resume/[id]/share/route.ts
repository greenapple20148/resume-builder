import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side API route to mark a resume as publicly shared.
// Uses the service role key to bypass RLS — no client auth needed.
// The resume UUID itself acts as the access control (unguessable).

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    if (!id) {
        return NextResponse.json({ error: 'Missing resume ID' }, { status: 400 })
    }

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('[share] Missing SUPABASE_SERVICE_ROLE_KEY in environment')
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        )
    }

    try {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

        const { error } = await supabaseAdmin
            .from('resumes')
            .update({ is_public: true })
            .eq('id', id)

        if (error) {
            console.error('[share] DB error:', error.message)
            return NextResponse.json({ error: 'Could not share resume.' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('[share] Error:', err)
        return NextResponse.json({ error: 'Could not share resume.' }, { status: 500 })
    }
}
