declare namespace NodeJS {
    interface ProcessEnv {
        readonly NEXT_PUBLIC_SUPABASE_URL: string
        readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string
        readonly NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
        readonly NEXT_PUBLIC_GEMINI_API_KEY: string
        readonly NEXT_PUBLIC_CLAUDE_API_KEY: string
        readonly NEXT_PUBLIC_APP_URL: string
    }
}
