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

export interface Plan {
  id: string
  name: string
  price: number
  priceMonthly: number
  priceAnnual: number
  stripePriceIdMonthly?: string
  stripePriceIdAnnual?: string
  features: PlanFeature[]
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
    features: [
      { text: '1 resume', included: true },
      { text: '4 basic themes', included: true },
      { text: 'PDF download (watermarked)', included: true },
      { text: 'All 25 themes', included: false },
      { text: 'Clean PDF (no watermark)', included: false },
      { text: 'AI writing assistant', included: false },
      { text: 'Custom sections', included: false },
      { text: 'Priority support', included: false },
    ],
    resumeLimit: 1,
    themeLimit: 4,
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
    features: [
      { text: '10 resumes', included: true },
      { text: 'All 25 themes', included: true },
      { text: 'Clean PDF (no watermark)', included: true },
      { text: 'Public resume link', included: true },
      { text: 'AI writing assistant', included: true },
      { text: 'Custom sections', included: true },
      { text: 'Priority support', included: false },
      { text: 'Unlimited resumes', included: false },
    ],
    resumeLimit: 10,
    themeLimit: 25,
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
    features: [
      { text: 'Unlimited resumes', included: true },
      { text: 'All 25 themes', included: true },
      { text: 'Clean PDF (no watermark)', included: true },
      { text: 'Public resume links', included: true },
      { text: 'AI writing assistant', included: true },
      { text: 'Custom sections', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom branding', included: true },
    ],
    resumeLimit: Infinity,
    themeLimit: 25,
    watermark: false,
  },
}

export async function createCheckoutSession(priceId: string, plan: string) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const { data, error } = await supabase.functions.invoke('create-checkout', {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: { priceId, plan, trialDays: PLANS[plan]?.trialDays },
  })

  if (error) throw error
  return data as { url: string }
}

export async function openCustomerPortal() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const { data, error } = await supabase.functions.invoke('customer-portal', {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  })
  if (error) throw error
  if (data.url) window.location.href = data.url
}
