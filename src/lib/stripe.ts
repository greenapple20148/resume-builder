import { loadStripe, Stripe } from '@stripe/stripe-js'
import { supabase } from './supabase'

let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export interface PlanFeature {
  text: string
  included: boolean
}

export interface PlanFeatureGroup {
  label: string
  features: PlanFeature[]
}

export interface Plan {
  id: string
  name: string
  price: number
  priceMonthly: number
  priceAnnual: number
  stripePriceIdMonthly?: string
  stripePriceIdAnnual?: string
  features: PlanFeature[]
  featureGroups: PlanFeatureGroup[]
  tagline: string
  cta: string
  resumeLimit: number
  themeLimit: number
  watermark: boolean
  popular?: boolean
  trialDays?: number
}

export const PLANS: Record<string, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceMonthly: 0,
    priceAnnual: 0,
    tagline: 'Build your resume, upgrade to download clean.',
    cta: 'Start Building Free',
    features: [
      { text: 'Full resume editor', included: true },
      { text: '2 basic templates', included: true },
      { text: 'Basic sections (Experience, Education, Skills)', included: true },
      { text: 'Basic spellcheck', included: true },
      { text: 'PDF download (watermarked)', included: true },
      { text: 'Save 1 resume', included: true },
      { text: 'All 15 templates', included: false },
      { text: 'DOCX export', included: false },
      { text: 'Cover letter builder', included: false },
      { text: 'ATS check', included: false },
    ],
    featureGroups: [
      {
        label: 'Builder', features: [
          { text: 'Full resume editor', included: true },
          { text: '2 basic templates', included: true },
          { text: 'Basic sections (Experience, Education, Skills)', included: true },
          { text: 'Basic spellcheck', included: true },
        ]
      },
      {
        label: 'Export', features: [
          { text: 'PDF download (watermarked)', included: true },
          { text: 'Save 1 resume', included: true },
          { text: 'Clean PDF (no watermark)', included: false },
          { text: 'DOCX export', included: false },
        ]
      },
      {
        label: 'Tools', features: [
          { text: 'Cover letter builder', included: false },
          { text: 'ATS check', included: false },
          { text: 'AI rewrite suggestions', included: false },
          { text: 'JD match analysis', included: false },
        ]
      },
    ],
    resumeLimit: 1,
    themeLimit: 2,
    watermark: true,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 14.99,
    priceMonthly: 14.99,
    priceAnnual: 79,
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID,
    stripePriceIdAnnual: import.meta.env.VITE_STRIPE_PRO_ANNUAL_PRICE_ID,
    tagline: 'Everything job seekers need. Unlimited downloads + DOCX included.',
    cta: 'Start 7-Day Free Trial',
    features: [
      { text: 'All 15 templates', included: true },
      { text: 'Unlimited PDF downloads (no watermark)', included: true },
      { text: 'DOCX export', included: true },
      { text: 'Up to 5 resume versions', included: true },
      { text: 'Cover letter builder', included: true },
      { text: 'Section guidance + examples per role', included: true },
      { text: 'Basic ATS check', included: true },
      { text: 'Auto-format (spacing, alignment, bullets)', included: true },
      { text: 'Resume version history (last 10 saves)', included: true },
      { text: 'Email support', included: true },
      { text: 'JD match analysis', included: false },
      { text: 'AI rewrite suggestions', included: false },
      { text: 'LinkedIn & interview toolkit', included: false },
    ],
    featureGroups: [
      {
        label: 'Builder', features: [
          { text: 'All 15 templates', included: true },
          { text: 'Up to 5 resume versions', included: true },
          { text: 'Section guidance + examples per role', included: true },
          { text: 'Auto-format (spacing, alignment, bullets)', included: true },
          { text: 'Resume version history (last 10 saves)', included: true },
        ]
      },
      {
        label: 'Export', features: [
          { text: 'Unlimited PDF downloads (no watermark)', included: true },
          { text: 'DOCX export', included: true },
          { text: 'Cover letter builder + export', included: true },
        ]
      },
      {
        label: 'ATS & Optimization', features: [
          { text: 'Formatting issue detection', included: true },
          { text: 'Keyword coverage check', included: true },
          { text: 'Readability score', included: true },
        ]
      },
      {
        label: 'Support', features: [
          { text: 'Email support (standard)', included: true },
        ]
      },
    ],
    resumeLimit: 5,
    themeLimit: 15,
    watermark: false,
    popular: true,
    trialDays: 7,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 24.99,
    priceMonthly: 24.99,
    priceAnnual: 119,
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_TEAM_MONTHLY_PRICE_ID,
    stripePriceIdAnnual: import.meta.env.VITE_STRIPE_TEAM_ANNUAL_PRICE_ID,
    tagline: 'JD match + ATS parse preview + LinkedIn tools.',
    cta: 'Go Premium',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'All templates (current + future)', included: true },
      { text: 'JD match — keyword gaps & suggestions', included: true },
      { text: 'AI rewrite suggestions', included: true },
      { text: 'ATS simulation preview', included: true },
      { text: 'LinkedIn toolkit', included: true },
      { text: 'Interview toolkit', included: true },
      { text: 'Priority support', included: true },
    ],
    featureGroups: [
      { label: 'Everything in Pro, plus:', features: [] },
      {
        label: 'JD Match', features: [
          { text: 'Paste job description → see missing keywords', included: true },
          { text: 'Skill gap analysis', included: true },
          { text: 'Tailored suggestions per role', included: true },
        ]
      },
      {
        label: 'AI Rewrite', features: [
          { text: 'Stronger bullet points (impact + metrics)', included: true },
          { text: 'Summary rewrite in 3 tones', included: true },
        ]
      },
      {
        label: 'ATS Simulation', features: [
          { text: 'See how ATS parses your resume sections', included: true },
          { text: 'Section-by-section parse preview', included: true },
        ]
      },
      {
        label: 'LinkedIn Toolkit', features: [
          { text: 'Headline generator', included: true },
          { text: 'About section generator', included: true },
          { text: 'Experience-to-LinkedIn rewrite', included: true },
        ]
      },
      {
        label: 'Interview Toolkit', features: [
          { text: '20 common questions by role', included: true },
          { text: 'STAR story builder', included: true },
        ]
      },
      {
        label: 'Support', features: [
          { text: 'Priority support', included: true },
        ]
      },
    ],
    resumeLimit: Infinity,
    themeLimit: Infinity,
    watermark: false,
  },
}

export async function createCheckoutSession(priceId: string, plan: string) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  // Add timeout to prevent infinite spinning
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { priceId, plan, trialDays: PLANS[plan]?.trialDays },
    })

    if (error) throw error
    if (!data?.url) throw new Error('No checkout URL returned. Please try again.')
    return data as { url: string }
  } finally {
    clearTimeout(timeout)
  }
}

export async function openCustomerPortal() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })
    if (error) throw error
    if (!data?.url) throw new Error('Could not open billing portal. Please try again.')
    window.location.href = data.url
  } finally {
    clearTimeout(timeout)
  }
}

export async function verifySubscription(): Promise<{ plan: string; synced: boolean }> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const { data, error } = await supabase.functions.invoke('verify-subscription', {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  })

  if (error) throw error
  return data as { plan: string; synced: boolean }
}
