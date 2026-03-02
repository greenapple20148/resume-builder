/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_STRIPE_PUBLISHABLE_KEY: string
    readonly VITE_STRIPE_PRO_MONTHLY_PRICE_ID: string
    readonly VITE_STRIPE_PRO_ANNUAL_PRICE_ID: string
    readonly VITE_STRIPE_TEAM_MONTHLY_PRICE_ID: string
    readonly VITE_STRIPE_TEAM_ANNUAL_PRICE_ID: string
    readonly VITE_GEMINI_API_KEY: string
    readonly VITE_CLAUDE_API_KEY: string
    readonly VITE_APP_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
