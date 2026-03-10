'use client'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

if ((!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) && typeof window !== 'undefined') {
  console.error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Disable navigator.locks — causes deadlocks in Next.js production
    // (cross-tab session sync is not needed for this app)
    lock: async (_name: string, _acquireTimeout: number, callback: () => Promise<any>) => {
      return await callback()
    },
  },
})

/**
 * Safely get the access token — getSession() can deadlock due to navigator.locks,
 * so we race it with a timeout and fall back to reading localStorage directly.
 */
export async function getAccessToken(): Promise<string> {
  let accessToken: string | undefined

  try {
    const result = await Promise.race([
      supabase.auth.getSession(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('getSession_timeout')), 5000))
    ])
    accessToken = result.data.session?.access_token
  } catch {
    // Fallback: read token directly from localStorage
    const ref = supabaseUrl.split('//')[1]?.split('.')[0]
    const raw = localStorage.getItem(`sb-${ref}-auth-token`)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        accessToken = parsed?.access_token || parsed?.currentSession?.access_token
      } catch { /* ignore */ }
    }
  }

  if (!accessToken) throw new Error('Not authenticated')
  return accessToken
}

/**
 * Call a Supabase Edge Function via direct fetch — bypasses supabase.functions.invoke
 * which internally calls getSession() and can deadlock.
 */
export async function invokeEdgeFunction<T = any>(
  functionName: string,
  options?: { body?: any; timeoutMs?: number }
): Promise<T> {
  const accessToken = await getAccessToken()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 15000)

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': supabaseAnonKey,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `Edge function error (${res.status})`)
    return data as T
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new Error('Request timed out. Please try again.')
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

export default supabase
