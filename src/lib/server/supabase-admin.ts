// src/lib/server/supabase-admin.ts — Server-side Supabase admin client
// Only used in API routes (runs on the server, never bundled in the client)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/** Admin client — bypasses RLS */
export function getSupabaseAdmin() {
    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL')
    }
    return createClient(supabaseUrl, supabaseServiceKey)
}

/** User-scoped client — authenticates as the requesting user (respects RLS) */
export function getSupabaseUser(token: string) {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
    })
}

/** Extract bearer token from Authorization header */
export function extractToken(authHeader: string | null): string | null {
    if (!authHeader?.toLowerCase().startsWith('bearer ')) return null
    return authHeader.split(' ')[1]
}
