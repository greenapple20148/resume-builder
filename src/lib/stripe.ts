'use client'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { supabase, invokeEdgeFunction } from './supabase'

let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    // Check both VITE_ prefixed and standard prefix in case of specific Vercel setups
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      console.warn("Stripe publishable key is missing. Set VITE_STRIPE_PUBLISHABLE_KEY in your environment. Billing features will not work.")
      return null
    }
    stripePromise = loadStripe(key).catch((err) => {
      console.error("Failed to load Stripe.js:", err?.message || err, "— Check your CSP headers and network connectivity to js.stripe.com")
      return null
    })
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
      { text: '1 basic template', included: true },
      { text: 'Save 1 resume', included: true },
      { text: 'PDF download (watermarked)', included: true },
      { text: '1 mock interview sample (preview)', included: true },
      { text: 'ATS score preview (no details)', included: true },
      { text: 'All templates (100+)', included: false },
      { text: 'DOCX export', included: false },
      { text: 'Cover letter builder', included: false },
      { text: 'Full ATS feedback', included: false },
      { text: 'Share resume via QR code', included: false },
    ],
    featureGroups: [
      {
        label: 'Builder', features: [
          { text: 'Full resume editor', included: true },
          { text: '1 basic template', included: true },
          { text: 'Save 1 resume', included: true },
        ]
      },
      {
        label: 'Export', features: [
          { text: 'PDF download (watermarked)', included: true },
          { text: 'Clean PDF (no watermark)', included: false },
          { text: 'DOCX export', included: false },
        ]
      },
      {
        label: 'Tools', features: [
          { text: '1 mock interview sample (preview only)', included: true },
          { text: 'ATS score preview (score only, no details)', included: true },
          { text: 'Cover letter builder', included: false },
          { text: 'Full ATS feedback', included: false },
        ]
      },
    ],
    resumeLimit: 1,
    themeLimit: 1,
    watermark: true,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 14.99,
    priceMonthly: 14.99,
    priceAnnual: 79,

    tagline: 'Everything job seekers need. Unlimited downloads + DOCX.',
    cta: 'Start 7-Day Free Trial',
    features: [
      { text: 'All resume templates (100+)', included: true },
      { text: 'Unlimited PDF + DOCX downloads', included: true },
      { text: 'Cover letter builder', included: true },
      { text: 'Basic ATS scan (format + keyword coverage)', included: true },
      { text: '5 saved resume versions', included: true },
      { text: 'Email support', included: true },
      { text: 'AI mock interviews', included: false },
      { text: 'JD match analysis', included: false },
      { text: 'AI rewrite suggestions', included: false },
      { text: 'LinkedIn toolkit', included: false },
      { text: 'Share resume via QR code', included: false },
    ],
    featureGroups: [
      {
        label: 'Builder', features: [
          { text: 'All resume templates (100+)', included: true },
          { text: '5 saved resume versions', included: true },
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
          { text: 'Format issue detection', included: true },
          { text: 'Keyword coverage check', included: true },
          { text: 'Readability score', included: true },
        ]
      },
      {
        label: 'Support', features: [
          { text: 'Skip-the-Line Priority Support', included: true },
          { text: 'Guaranteed 12-hour response time', included: true },
          { text: 'Front-of-queue priority', included: true },
          { text: 'Direct assistance with edits & formatting', included: true },
        ]
      },
    ],
    resumeLimit: 5,
    themeLimit: Infinity,
    watermark: false,
    popular: true,
    trialDays: 7,
  },
  founding: {
    id: 'founding',
    name: 'Pro (Founding)',
    price: 19,
    priceMonthly: 19,
    priceAnnual: 19,

    tagline: 'Founding Member Offer. Unlimited downloads + DOCX.',
    cta: 'Claim Founding Spot',
    features: [
      { text: 'All resume templates (100+)', included: true },
      { text: 'Unlimited PDF + DOCX downloads', included: true },
      { text: 'Cover letter builder', included: true },
      { text: 'Basic ATS scan (format + keyword coverage)', included: true },
      { text: '5 saved resume versions', included: true },
      { text: 'Email support', included: true },
      { text: 'AI mock interviews', included: false },
      { text: 'JD match analysis', included: false },
      { text: 'AI rewrite suggestions', included: false },
      { text: 'LinkedIn toolkit', included: false },
      { text: 'Share resume via QR code', included: false },
    ],
    featureGroups: [
      {
        label: 'Builder', features: [
          { text: 'All resume templates (100+)', included: true },
          { text: '5 saved resume versions', included: true },
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
          { text: 'Format issue detection', included: true },
          { text: 'Keyword coverage check', included: true },
          { text: 'Readability score', included: true },
        ]
      },
      {
        label: 'Support', features: [
          { text: 'Skip-the-Line Priority Support', included: true },
          { text: 'Guaranteed 12-hour response time', included: true },
          { text: 'Front-of-queue priority', included: true },
          { text: 'Direct assistance with edits & formatting', included: true },
        ]
      },
    ],
    resumeLimit: 5,
    themeLimit: Infinity,
    watermark: false,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 24.99,
    priceMonthly: 24.99,
    priceAnnual: 119,

    tagline: 'AI-powered tools for serious job seekers.',
    cta: 'Go Premium',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: '3 AI mock interviews/month', included: true },
      { text: 'JD match — paste JD → missing keywords', included: true },
      { text: 'AI bullet rewrite suggestions', included: true },
      { text: 'LinkedIn summary generator', included: true },
      { text: 'Advanced ATS feedback (section-level)', included: true },
      { text: '10 saved resume versions', included: true },
      { text: 'Interview toolkit', included: true },
      { text: 'Share resume via QR code', included: true },
      { text: 'Priority support', included: true },
    ],
    featureGroups: [
      { label: 'Everything in Pro, plus:', features: [] },
      {
        label: 'AI Mock Interview', features: [
          { text: '3 AI-powered mock sessions/month', included: true },
          { text: '2 interview modes (Role + Behavioral)', included: true },
          { text: 'Basic answer scoring', included: true },
          { text: 'Clarity + confidence metrics', included: true },
          { text: 'System Design, Technical, Salary modes', included: false },
          { text: 'AI answer suggestions + coaching', included: false },
        ]
      },
      {
        label: 'JD Match & AI Rewrite', features: [
          { text: 'Paste job description → missing keywords', included: true },
          { text: 'Skill gap analysis', included: true },
          { text: 'AI bullet rewrite suggestions', included: true },
        ]
      },
      {
        label: 'Advanced ATS', features: [
          { text: 'Section-level improvement suggestions', included: true },
          { text: 'ATS simulation preview', included: true },
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
          { text: '14 roles with 280+ questions', included: true },
          { text: 'STAR story builder', included: true },
        ]
      },
      {
        label: 'Sharing', features: [
          { text: 'Share resume via QR code', included: true },
          { text: 'Public resume link', included: true },
        ]
      },
      {
        label: 'Career Intelligence', features: [
          { text: 'JD-based interview simulation', included: false },
          { text: 'Interview scoring dashboard', included: false },
          { text: 'Resume score tracking over time', included: false },
        ]
      },
      {
        label: 'Support', features: [
          { text: 'Skip-the-Line Priority Support', included: true },
          { text: '12-hour guaranteed response time', included: true },
        ]
      },
    ],
    resumeLimit: 10,
    themeLimit: Infinity,
    watermark: false,
  },
  career_plus: {
    id: 'career_plus',
    name: 'Career+',
    price: 34.99,
    priceMonthly: 34.99,
    priceAnnual: 149,

    tagline: 'Full AI coaching suite for active job hunters.',
    cta: 'Go Career+',
    features: [
      { text: 'Everything in Premium', included: true },
      { text: '20 AI mock interviews/month', included: true },
      { text: 'JD-based interview simulation', included: true },
      { text: 'Behavioral + technical modes', included: true },
      { text: 'STAR answer coaching', included: true },
      { text: 'Interview scoring dashboard', included: true },
      { text: 'Resume score tracking over time', included: true },
      { text: 'Unlimited resume versions', included: true },
      { text: 'Share resume via QR code', included: true },
      { text: 'Priority support + early access', included: true },
    ],
    featureGroups: [
      { label: 'Everything in Premium, plus:', features: [] },
      {
        label: 'AI Mock Interviews (20/month)', features: [
          { text: '20 sessions per month', included: true },
          { text: 'All 5 interview modes', included: true },
          { text: 'System Design deep-dive', included: true },
          { text: 'Behavioral mastery pack', included: true },
          { text: 'Salary negotiation simulator', included: true },
          { text: 'Technical coding evaluation', included: true },
        ]
      },
      {
        label: 'AI Coaching', features: [
          { text: 'STAR answer coaching', included: true },
          { text: 'Detailed clarity + confidence scoring', included: true },
          { text: 'Keyword relevance analysis', included: true },
          { text: 'AI-suggested improved answers', included: true },
          { text: 'Ideal answer comparison', included: true },
        ]
      },
      {
        label: 'Career Intelligence', features: [
          { text: 'Interview scoring dashboard', included: true },
          { text: 'Resume score tracking over time', included: true },
          { text: 'JD-based interview simulation', included: true },
          { text: 'Performance breakdown by type', included: true },
        ]
      },
      {
        label: 'Resume Builder', features: [
          { text: 'Unlimited resume versions', included: true },
          { text: 'Share resume via QR code', included: true },
          { text: 'Public resume link', included: true },
        ]
      },
      {
        label: 'Support', features: [
          { text: 'Same-business-day support', included: true },
          { text: 'Front-of-queue priority', included: true },
          { text: 'Direct assistance with edits & formatting', included: true },
          { text: 'Early access to new tools', included: true },
        ]
      },
    ],
    resumeLimit: Infinity,
    themeLimit: Infinity,
    watermark: false,
  },
}

// ── One-Time Add-Ons (Profit Boosters) ──────────────────
export interface AddOn {
  id: string
  name: string
  price: number
  description: string
  icon: string

}

export const ADD_ONS: AddOn[] = [
  {
    id: 'mock_pack_3',
    name: '3 Interview Mock Pack',
    price: 12.99,
    description: '3 AI-powered mock interview sessions. Use anytime, never expires.',
    icon: 'mic',

  },
  {
    id: 'human_review',
    name: 'Resume Human Review',
    price: 49,
    description: 'Expert human review with personalized feedback within 48 hours.',
    icon: 'search',

  },
  {
    id: 'linkedin_overhaul',
    name: 'LinkedIn Profile Overhaul',
    price: 99,
    description: 'Complete LinkedIn profile rewrite by a career branding expert.',
    icon: 'linkedin',

  },
  {
    id: 'express_unlock',
    name: 'Express 24h Unlock',
    price: 9.99,
    description: '24-hour full Pro access. Download unlimited resumes, no watermark.',
    icon: 'zap',

  },
]

export async function createCheckoutSession(plan: string, billing: 'monthly' | 'annual') {
  const data = await invokeEdgeFunction<{ url: string }>('create-checkout', {
    body: { plan, billing },
  })
  if (!data?.url) throw new Error('No checkout URL returned. Please try again.')
  return data
}

export async function openCustomerPortal() {
  const data = await invokeEdgeFunction<{ url: string }>('customer-portal')
  if (!data?.url) throw new Error('Could not open billing portal. Please try again.')
  window.location.href = data.url
}

export async function verifySubscription(): Promise<{ plan: string; synced: boolean }> {
  return invokeEdgeFunction<{ plan: string; synced: boolean }>('verify-subscription')
}

export async function cancelSubscription(): Promise<{
  success: boolean;
  message: string;
  periodEnd?: string;
  periodEndFormatted?: string;
}> {
  return invokeEdgeFunction<{
    success: boolean;
    message: string;
    periodEnd?: string;
    periodEndFormatted?: string;
  }>('cancel-subscription')
}
