# ResumeBuildIn — Full-Stack Resume Builder

A production-ready resume builder with Supabase backend and Stripe payments.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | CSS Modules + Custom Design System |
| State | Zustand |
| Backend | Supabase (Auth, Database, Storage, Edge Functions) |
| Payments | Stripe (Checkout, Webhooks, Billing Portal) |
| PDF Export | jsPDF + html2canvas |
| Routing | React Router v6 |

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourname/resumebuildin.git
cd resumebuildin
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/migrations/001_schema.sql`
3. Enable **Google OAuth** in Authentication → Providers (optional)
4. Copy your project URL and anon key

### 3. Set Up Stripe

1. Create account at [stripe.com](https://stripe.com)
2. Create two Products in Stripe Dashboard:
   - **Pro Monthly** — $9/month → copy the Price ID
   - **Pro Annual** — $79/year → copy the Price ID
   - **Team Monthly** — $29/month → copy the Price ID
   - **Team Annual** — $249/year → copy the Price ID
3. Enable Customer Portal in Stripe Dashboard → Billing → Customer Portal

### 4. Configure Environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Stripe (publishable key — safe to expose)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs
VITE_STRIPE_PRO_MONTHLY_PRICE_ID=price_...
VITE_STRIPE_PRO_ANNUAL_PRICE_ID=price_...
VITE_STRIPE_TEAM_MONTHLY_PRICE_ID=price_...
VITE_STRIPE_TEAM_ANNUAL_PRICE_ID=price_...

VITE_APP_URL=http://localhost:5173
```

### 5. Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login & link project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Set secrets (server-side only — never in .env.local)
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set STRIPE_PRO_PRICE_ID=price_...
supabase secrets set STRIPE_TEAM_PRICE_ID=price_...
supabase secrets set APP_URL=https://yourapp.com
supabase secrets set RESEND_API_KEY=re_...
supabase secrets set FROM_EMAIL="ResumeBuildIn <hello@resumebuildin.com>"

# Deploy functions
supabase functions deploy create-checkout
supabase functions deploy customer-portal
supabase functions deploy stripe-webhook
supabase functions deploy send-email
supabase functions deploy contact-form
```

### 6. Configure Stripe Webhook

1. Go to Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the webhook signing secret → set as `STRIPE_WEBHOOK_SECRET`

### 7. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## Project Structure

```
resumebuildin/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Shared navigation
│   │   ├── Navbar.module.css
│   │   └── Toast.jsx           # Toast notification system
│   ├── pages/
│   │   ├── LandingPage.jsx     # Marketing homepage
│   │   ├── AuthPage.jsx        # Sign up / Login
│   │   ├── ThemesPage.jsx      # Theme gallery
│   │   ├── EditorPage.jsx      # Resume editor (core)
│   │   ├── DashboardPage.jsx   # User dashboard
│   │   ├── PricingPage.jsx     # Pricing with Stripe
│   │   └── NotFoundPage.jsx    # 404
│   ├── lib/
│   │   ├── supabase.js         # Supabase client
│   │   ├── stripe.js           # Stripe helpers + plan config
│   │   ├── store.js            # Zustand global state
│   │   ├── emailTemplates.ts   # Automated email templates
│   │   ├── aiProvider.ts       # AI provider abstraction (Gemini/Claude)
│   │   ├── aiRateLimit.ts      # AI abuse protection (rate limit, caps, cooldowns)
│   │   ├── expressUnlock.ts    # Express 24h Unlock logic
│   │   └── mockPack.ts         # Mock Interview Pack logic
│   └── styles/
│       └── global.css          # Design system + base styles
├── supabase/
│   ├── migrations/
│   │   └── 001_schema.sql      # Full DB schema + RLS policies
│   └── functions/
│       ├── create-checkout/    # Stripe checkout session
│       ├── customer-portal/    # Stripe billing portal
│       └── stripe-webhook/     # Webhook handler
├── .env.example                # Environment template
├── vite.config.js
└── package.json
```

---

## Features

### Authentication
- Email/password sign up & login
- Google OAuth (one-click)
- Auto-profile creation on signup
- Protected routes

### Resume Editor
- 8 sections: Personal, Summary, Experience, Education, Skills, Languages, Certifications, Projects
- Auto-save (1.5s debounce after typing)
- Live preview panel (real-time)
- Editable resume title
- Add/remove/reorder entries

### Theme Gallery
- 12 professionally designed themes
- Filter by: Minimal, Professional, Creative, Dark
- One-click apply to new or existing resume

### Dashboard
- All resumes in a grid
- Edit, duplicate, download, delete actions
- Plan usage indicator
- Billing portal link (Pro/Team)

### Payments (Stripe)
- Free tier: 3 resumes, 4 themes, watermarked PDF
- Pro ($9/mo or $79/yr): 25 resumes, all themes, clean PDF
- Team ($29/mo or $249/yr): unlimited, custom branding
- Webhook handles all subscription events
- Idempotent webhook processing
- Customer portal for self-serve billing

### PDF Export
- jsPDF + html2canvas
- Watermark-free on Pro/Team
- Pixel-accurate rendering

---

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy --prod
```

Add all `VITE_*` environment variables in Vercel dashboard.

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

---

## Adding New Themes

1. Add theme config to `THEMES` array in `src/pages/ThemesPage.jsx`
2. Add preview rendering in `ThemePreview` component
3. Add live editor preview styles in `LivePreview` in `EditorPage.jsx`

---

## Plan Limits

| Plan | Price | Resumes | Themes | PDF | Support |
|------|-------|---------|--------|-----|---------|
| Free | $0 | 1 | All | Watermarked | Standard (48hr) |
| Pro | $9.99/mo | 5 | All 30+ | Clean | ⚡ Priority (12hr) |
| Premium | $24.99/mo | 10 | All 30+ | Clean | ⚡ Priority (12hr) |
| Career+ | $34.99/mo | ∞ | All 30+ | Clean | ⚡ Same-business-day |

### One-Time Add-Ons

| Add-On | Price | Access |
|--------|-------|--------|
| Express 24h Unlock | $2.99 | Full Pro access for 24 hours |
| 3 Interview Mock Pack | $4.99 | 3 bonus AI mock interview sessions |

---

## Automated Email Templates

Branded HTML email templates in `src/lib/emailTemplates.ts` for all transactional scenarios:

| # | Template | Trigger | Key Content |
|---|----------|---------|-------------|
| 1 | `proConfirmation` | Pro plan purchase | 12-hour response, skip-the-line, dashboard CTA |
| 2 | `premiumConfirmation` | Premium plan purchase | Mock interviews, interview toolkit, LinkedIn tools |
| 3 | `careerPlusConfirmation` | Career+ plan purchase | Same-day support, 20 sessions, resume review invite |
| 4 | `priorityTicketAck` | Support ticket (paid user) | Plan badge, expected response time, "no bots" |
| 5 | `freeTicketAck` | Support ticket (free user) | 48hr timeline + soft upsell to Pro |
| 6 | `expressUnlockConfirmation` | Express 24h purchase | 24hr countdown, unlocked features |
| 7 | `mockPackConfirmation` | Mock Pack purchase | Session count, never-expire note |
| 8 | `welcomeSignup` | New account created | Getting started steps, dashboard CTA |

### Usage

```typescript
import { getConfirmationEmail, getTicketAckEmail } from './lib/emailTemplates'

// Plan confirmation → returns { subject, html, text }
const email = getConfirmationEmail('pro', 'Jane')

// Support ticket ack → auto-selects template by plan
const ack = getTicketAckEmail('career_plus', 'Jane')
// → Same-business-day response time for Career+
```

---

## Security Notes

- All Stripe secret keys are stored as Supabase Edge Function secrets (never in frontend)
- Row Level Security (RLS) ensures users can only access their own data
- Webhook signature verification on every Stripe event
- Idempotency table prevents duplicate event processing
- 3-layer AI abuse protection: token bucket rate limiting, daily usage caps, per-feature cooldowns


supabase secrets set STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
supabase secrets set STRIPE_PRO_ANNUAL_PRICE_ID=price_xxx
supabase secrets set STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx
supabase secrets set STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_xxx
supabase secrets set STRIPE_CAREER_PLUS_MONTHLY_PRICE_ID=price_xxx
supabase secrets set STRIPE_CAREER_PLUS_ANNUAL_PRICE_ID=price_xxx
supabase secrets set MOCK_PACK_PRICE_ID=price_xxx
supabase secrets set EXPRESS_UNLOCK_PRICE_ID=price_xxx
