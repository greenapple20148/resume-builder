import { loadStripe } from '@stripe/stripe-js'
import { supabase } from './supabase'

let stripePromise = null

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      { text: '3 resumes', included: true },
      { text: '4 themes', included: true },
      { text: 'PDF download (watermarked)', included: true },
      { text: 'All 17 themes', included: false },
      { text: 'Clean PDF (no watermark)', included: false },
      { text: 'Custom domain sharing', included: false },
      { text: 'Priority support', included: false },
    ],
    resumeLimit: 3,
    themeLimit: 4,
    watermark: true,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 9,
    priceMonthly: 9,
    priceAnnual: 79,
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID,
    stripePriceIdAnnual: import.meta.env.VITE_STRIPE_PRO_ANNUAL_PRICE_ID,
    features: [
      { text: '25 resumes', included: true },
      { text: 'All 17 themes', included: true },
      { text: 'Clean PDF download', included: true },
      { text: 'Public resume link', included: true },
      { text: 'Auto-save', included: true },
      { text: 'Priority support', included: true },
      { text: 'Team collaboration', included: false },
    ],
    resumeLimit: 25,
    themeLimit: 12,
    watermark: false,
    popular: true,
    trialDays: 7,
  },
  team: {
    id: 'team',
    name: 'Team',
    price: 29,
    priceMonthly: 29,
    priceAnnual: 249,
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_TEAM_MONTHLY_PRICE_ID,
    stripePriceIdAnnual: import.meta.env.VITE_STRIPE_TEAM_ANNUAL_PRICE_ID,
    features: [
      { text: 'Unlimited resumes', included: true },
      { text: 'All 17 themes', included: true },
      { text: 'Clean PDF download', included: true },
      { text: 'Public resume links', included: true },
      { text: 'Team workspace (5 seats)', included: true },
      { text: 'Custom branding', included: true },
      { text: 'Priority support', included: true },
    ],
    resumeLimit: Infinity,
    themeLimit: 12,
    watermark: false,
  },
}

export async function createCheckoutSession(priceId, plan) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const { data, error } = await supabase.functions.invoke('create-checkout', {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: { priceId, plan, trialDays: PLANS[plan]?.trialDays },
  })

  if (error) throw error
  return data
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
