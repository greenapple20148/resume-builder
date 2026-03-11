'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import { toast } from '../components/Toast'
import { PLANS, ADD_ONS, createCheckoutSession, openCustomerPortal } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { invokeEdgeFunction } from '@/lib/supabase'
import { useStore } from '@/lib/store'
import { useSEO } from '@/lib/useSEO'
import { LandingIcon } from '../components/LandingIcons'
import { purchaseExpressUnlock, isExpressUnlockActive, getExpressUnlockRemainingMs, formatExpressCountdown } from '@/lib/expressUnlock'
import { purchaseMockPack } from '@/lib/mockPack'

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)
  const [loading, setLoading] = useState<string | null>(null)
  const { user, profile, fetchProfile } = useStore()
  const router = useRouter()

  const [spotsLeft, setSpotsLeft] = useState<number | null>(null)

  useEffect(() => {
    async function fetchSpots() {
      try {
        const { data, error } = await supabase.rpc('get_founding_spots_left')
        if (!error && typeof data === 'number') {
          setSpotsLeft(data)
          if (data <= 0) {
            localStorage.removeItem('resumebuildin_offer')
          }
        }
      } catch (err) {
        console.error('Error fetching spots:', err)
      }
    }
    fetchSpots()
  }, [])

  const currentPlanId = profile?.plan || 'free'
  const currentPlan = (PLANS as any)[currentPlanId] || PLANS.free
  const [hasFoundingOffer, setHasFoundingOffer] = useState(false)

  useEffect(() => {
    setHasFoundingOffer(
      localStorage.getItem('resumebuildin_offer') === 'founding' && (spotsLeft === null || spotsLeft > 0)
    )
  }, [spotsLeft])

  const planOrder = hasFoundingOffer && profile?.plan !== 'pro' ? ['free', 'founding', 'premium', 'career_plus'] : ['free', 'pro', 'premium', 'career_plus']
  const currentIndex = planOrder.indexOf(currentPlanId) !== -1 ? planOrder.indexOf(currentPlanId) : ['free', 'pro', 'premium', 'career_plus'].indexOf(currentPlanId)

  useSEO({
    title: user ? 'Manage Your Plan' : 'Pricing — Simple, Honest Plans',
    description: user
      ? 'Manage your ResumeBuildIn subscription, upgrade or downgrade your plan, and access billing.'
      : 'Start free, upgrade when you\'re ready. ResumeBuildIn offers simple pricing for resume building, AI tools, mock interviews, and career coaching.',
    path: '/pricing',
    noindex: !!user,
  })

  const handleUpgrade = async (plan: string) => {
    if (!user) {
      // Save the intended plan so we can auto-resume checkout after signup/login
      if (plan !== 'free') {
        const billing = plan === 'founding' ? 'annual' : (annual ? 'annual' : 'monthly')
        localStorage.setItem('resumebuildin_pending_plan', JSON.stringify({ plan, billing }))
      }
      router.push(plan === 'founding' ? '/auth?mode=signup&offer=founding' : '/auth?mode=signup')
      return
    }
    if (plan === 'free') return
    if (profile?.plan === plan) { try { setLoading(plan); await openCustomerPortal() } catch { toast.error('Could not open billing portal.') } finally { setLoading(null) }; return }
    const billing = plan === 'founding' ? 'annual' : (annual ? 'annual' : 'monthly')
    try { setLoading(plan); const { url } = await createCheckoutSession(plan, billing as 'monthly' | 'annual'); if (url) window.location.href = url } catch (err: any) { console.error('[handleUpgrade] error:', err); toast.error(err.message || 'Checkout failed.') } finally { setLoading(null) }
  }

  const handleManageBilling = async () => { try { setLoading('portal'); await openCustomerPortal() } catch { toast.error('Could not open billing portal.') } finally { setLoading(null) } }

  const handleAddonPurchase = async (addonId: string) => {
    if (!user) { router.push('/auth?mode=signup'); return }
    if (addonId === 'express_unlock') {
      if (isExpressUnlockActive(profile)) {
        toast.info('Express Unlock is already active!')
        return
      }
      if (profile?.plan !== 'free') {
        toast.info('You already have a paid plan — Express Unlock is for free users.')
        return
      }
      try {
        setLoading('express_unlock')
        toast.info('Activating Express 24h Unlock…')
        const result = await purchaseExpressUnlock()
        if (result.success) {
          toast.success('Express Unlock activated! Pro features enabled for 24 hours.')
          if (user) await fetchProfile(user.id)
        }
      } catch (err: any) {
        toast.error(err.message || 'Could not activate Express Unlock.')
      } finally {
        setLoading(null)
      }
      return
    }
    if (addonId === 'mock_pack_3') {
      try {
        setLoading('mock_pack_3')
        toast.info('Purchasing Mock Interview Pack…')
        const result = await purchaseMockPack()
        if (result.success) {
          toast.success(`🎤 Mock Pack purchased! You now have ${result.newTotal} bonus session${result.newTotal !== 1 ? 's' : ''}.`)
          if (user) await fetchProfile(user.id)
        }
      } catch (err: any) {
        toast.error(err.message || 'Could not purchase mock pack.')
      } finally {
        setLoading(null)
      }
      return
    }
    // For other add-ons, use Stripe checkout
    try {
      setLoading(addonId)
      const data = await invokeEdgeFunction<{ url: string }>('create-checkout', {
        body: { plan: addonId, billing: 'one_time' },
      })
      if (data?.url) window.location.href = data.url
    } catch (err: any) {
      toast.error(err.message || 'Checkout failed.')
    } finally {
      setLoading(null)
    }
  }

  const getPlanBtnLabel = (planId: string) => {
    if (!user) return planId === 'free' ? 'Get Started Free' : ((PLANS as any)[planId].trialDays ? `Start ${(PLANS as any)[planId].trialDays}-Day Free Trial` : 'Upgrade Now')
    if (profile?.plan === planId) return 'Current Plan'
    const targetIndex = planOrder.indexOf(planId)
    if (targetIndex > currentIndex) return 'Upgrade'
    if (targetIndex < currentIndex) return 'Downgrade'
    return 'Select'
  }

  const FAQ = [
    { q: 'What is ATS and why does it matter?', a: 'ATS stands for Applicant Tracking System — software that 95% of large companies use to filter resumes before a human ever sees them. If your resume isn\'t ATS-compatible, it gets rejected automatically. Every ResumeBuildIn template is engineered to pass ATS scanners with clean formatting, proper headings, and machine-readable text.' },
    { q: 'What\'s your refund policy?', a: 'We offer a full, no-questions-asked refund within 7 days of any purchase — subscriptions or add-ons. After 7 days, you can cancel anytime and keep access until the end of your billing period, but refunds are not available. Contact support@resumebuildin.io to request a refund.' },
    { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your billing portal. You keep full access to all features until the end of your current billing period. No cancellation fees, no penalties.' },
    { q: 'Is there a free trial?', a: 'The Free plan is forever free — build 1 resume with any template. Pro includes a 7-day free trial so you can try all features (unlimited downloads, no watermark, cover letters) before being charged.' },
    { q: "What's the difference between the plans?", a: 'Free gets you started with 1 resume. Pro unlocks unlimited downloads, no watermark, DOCX export, cover letters, and priority support. Premium adds AI mock interviews, interview prep toolkit, and LinkedIn optimization. Career+ gives you 20 mock sessions/month, same-business-day support, JD-based interview prep, and a career intelligence dashboard.' },
    { q: 'What are AI Mock Interviews?', a: 'AI-powered practice sessions where you\'re asked role-specific questions, type your answers, and receive real-time evaluation — including scoring, improvement suggestions, and sample answers. Premium gives 3 sessions/month, Career+ gives 20, and you can buy additional packs anytime.' },
    { q: 'What is Job Description Matching?', a: 'Paste any job description and our AI instantly analyzes how well your resume matches. You\'ll see a match score, missing keywords, and specific suggestions to close the gaps — so you can tailor your resume before you apply.' },
    { q: 'What are One-Time Add-Ons?', a: 'Boost your job search without changing your plan. Options include a 3-session Mock Interview Pack ($4.99), and the Express 24h Unlock ($2.99) which gives full Pro access for 24 hours — perfect for last-minute applications.' },
    { q: 'How does Priority Support work?', a: 'Pro and Premium users get Skip-the-Line Priority Support with a guaranteed 12-hour response time. Career+ users get same-business-day support with front-of-queue priority and direct assistance with resume edits. We guarantee response times Monday–Friday during business hours. No bots. Real help.' },
    { q: 'Can I import my existing resume?', a: 'Yes. Upload a PDF or DOCX file and our AI parser will extract your information — contact details, experience, education, skills — and populate a new ResumeBuildIn resume automatically. You can then edit, enhance, and choose any template.' },
    { q: 'What payment methods do you accept?', a: 'All major credit and debit cards (Visa, Mastercard, Amex), Apple Pay, and Google Pay. All payments are processed securely through Stripe. We never store your card details.' },
    { q: 'Is my data safe and private?', a: 'Your resume data is stored securely with Supabase (built on PostgreSQL with row-level security). We never sell your data, share it with third parties, or use it for training AI models. You can delete your account and all data at any time.' },
    { q: 'How accurate is the AI enhancement?', a: 'Our AI transforms vague bullet points into quantified, metrics-driven achievement statements. You always review and approve every suggestion before it\'s applied — the AI assists, you decide. You can choose between Gemini and Claude as your AI provider.' },
    { q: 'Can I customize the resume themes?', a: 'All 30+ professional templates are fully customizable. Change colors, fonts, spacing, and layout. Pro users unlock all themes. You can even generate custom themes with AI by describing what you want.' },
    { q: 'What is Express 24h Unlock?', a: 'A one-time purchase ($2.99) that gives you full Pro-level access for 24 hours — unlimited downloads, no watermark, DOCX export, and cover letters. Perfect when you need to submit a polished resume fast without committing to a subscription.' },
    { q: 'Do you offer team or enterprise plans?', a: 'Not yet, but we\'re working on it. If you\'re a career center, staffing agency, or company interested in bulk licensing, reach out to hello@resumebuildin.com and we\'ll set something up.' },
    { q: 'How do coupon codes work?', a: 'Coupon codes give you free Pro access for a set period (usually 3 months). Simply enter your code at resumebuildin.com/redeem to activate. No credit card required. When the coupon expires, you can upgrade to a paid plan or continue with the free tier.' },
  ]

  // TC-029 fix: Interactive FAQ accordion with expand/collapse
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const FAQAccordion = () => (
    <div className="flex flex-col gap-3">
      {FAQ.map((item, i) => {
        const isOpen = openFaq === i
        return (
          <div key={i} className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden transition-all">
            <button
              className="w-full flex items-center justify-between p-5 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-ink-05 font-[inherit]"
              onClick={() => setOpenFaq(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <h4 className="text-[15px] font-semibold text-ink m-0 pr-4">{item.q}</h4>
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="shrink-0 text-ink-20 transition-transform"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transitionDuration: '200ms' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              style={{
                maxHeight: isOpen ? '500px' : '0',
                opacity: isOpen ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 300ms ease, opacity 200ms ease',
              }}
            >
              <p className="text-sm text-ink-40 leading-relaxed px-5 pb-5 pt-0 m-0">{item.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )

  const Toggle = () => (
    <div className="inline-flex items-center gap-3.5 text-sm font-medium text-ink-20">
      <span className={!annual ? 'text-ink' : ''}>Monthly</span>
      <button className="w-12 h-[26px] bg-ink dark:bg-gold border-none rounded-full cursor-pointer relative transition-colors" onClick={() => setAnnual(!annual)} aria-checked={annual} role="switch">
        <div className="absolute top-0.5 w-[22px] h-[22px] bg-white rounded-full transition-transform" style={{ transform: annual ? 'translateX(22px)' : 'translateX(2px)' }} />
      </button>
      <span className={annual ? 'text-ink' : ''}>Annual <span className="badge badge-green ml-2">Save 56%</span></span>
    </div>
  )

  const FeatureList = ({ groups }: { groups: any[] }) => (
    <div className="mb-6">
      {groups.map((group: any, gi: number) => (
        <div key={gi} className={gi < groups.length - 1 ? 'mb-3.5' : ''}>
          <div className="text-[10px] font-mono uppercase tracking-widest text-ink-20 font-semibold mb-2">{group.label}</div>
          <ul className="list-none flex flex-col gap-2">
            {group.features.map((f: any, i: number) => (
              <li key={i} className={`flex items-center gap-2.5 text-[13px] ${f.included ? 'text-ink-70' : 'text-ink-20'}`}>
                <span className={`w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${f.included ? 'bg-[#dcfce7] dark:bg-[rgba(76,175,122,0.15)] text-emerald' : 'bg-ink-05 text-ink-20'}`}>{f.included ? '✓' : '✕'}</span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )

  // ── LOGGED-IN → Plan Management View ──
  if (user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10 pt-10 pb-20">
          <div className="text-center mb-8"><h1 className="mb-2.5">Manage your <em className="italic text-gold">plan</em></h1><p className="text-base text-ink-40">You're currently on the <strong className="text-ink">{currentPlan.name}</strong> plan.</p></div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 px-8 py-7 bg-[var(--white)] border-[1.5px] border-gold-pale rounded-xl mb-7">
            <div>
              <div className="flex items-center gap-2.5 mb-2"><span className={`badge ${currentPlanId === 'free' ? 'badge-dark' : 'badge-gold'}`}>{currentPlan.name}</span><span className="text-xs font-mono text-emerald font-semibold uppercase tracking-wide">Active</span></div>
              <div className="text-xl font-semibold text-ink mb-1">{currentPlan.priceMonthly === 0 ? 'Free forever' : <>${currentPlan.priceMonthly}/mo <span className="text-sm text-ink-20 font-normal">or ${currentPlan.priceAnnual}/yr</span></>}</div>
              <div className="text-[13px] text-ink-40 italic">{currentPlan.tagline}</div>
            </div>
            {currentPlanId !== 'free' && (
              <div className="flex flex-col gap-2 shrink-0">
                <button className="btn btn-outline" onClick={handleManageBilling} disabled={loading === 'portal'}>{loading === 'portal' ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Opening…</> : 'Manage Billing'}</button>
                <button className="bg-transparent border border-ink-10 text-ink-40 text-[13px] py-2 px-5 rounded-lg cursor-pointer transition-all hover:border-[#ef4444] hover:text-[#ef4444]" onClick={handleManageBilling} disabled={loading === 'portal'}>Cancel Subscription</button>
              </div>
            )}
          </div>

          <div className="mb-10">
            <div className="text-[13px] font-mono uppercase tracking-widest text-ink-40 font-semibold mb-5">What's included in your plan</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentPlan.featureGroups.map((group: any, gi: number) => (
                <div key={gi} className="p-5 bg-[var(--white)] border border-ink-10 rounded-xl">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-ink-20 font-semibold mb-2">{group.label}</div>
                  <ul className="list-none flex flex-col gap-2">
                    {group.features.map((f: any, i: number) => (
                      <li key={i} className={`flex items-center gap-2.5 text-[13px] ${f.included ? 'text-ink-70' : 'text-ink-20'}`}>
                        <span className={`w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${f.included ? 'bg-[#dcfce7] dark:bg-[rgba(76,175,122,0.15)] text-emerald' : 'bg-ink-05 text-ink-20'}`}>{f.included ? '✓' : '✕'}</span>
                        {f.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {currentIndex < planOrder.length - 1 && (
            <div className="mb-10">
              <div className="text-[22px] font-bold mb-1.5">Upgrade your plan</div>
              <p className="text-[15px] text-ink-40 mb-6">Unlock more features and tools to supercharge your job search.</p>
              <div className="mb-7"><Toggle /></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {planOrder.filter((_, idx) => idx > currentIndex).map(planId => {
                  const plan = (PLANS as any)[planId]; const price = annual ? parseFloat((plan.priceAnnual / 12).toFixed(2)) : plan.priceMonthly; const isLoading = loading === planId
                  return (
                    <div key={planId} className={`bg-[var(--white)] border-[1.5px] ${plan.popular ? 'border-gold shadow-[0_0_0_1px_var(--gold),var(--shadow)]' : 'border-ink-10'} rounded-xl p-7 relative transition-all hover:shadow-lg hover:-translate-y-0.5`}>
                      {plan.popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-white text-[11px] font-bold font-mono px-4 py-1 rounded-full whitespace-nowrap">✦ Most Popular</div>}
                      <div className="mb-1">
                        <h3 className="text-[15px] font-mono uppercase tracking-widest text-ink-40 font-semibold mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-0.5 mb-1"><span className="font-display text-2xl font-light text-ink-40">$</span><span className="font-display text-[40px] font-light leading-none tracking-tight text-ink">{price}</span><span className="text-sm text-ink-40 ml-1">/mo</span></div>
                        {annual && <div className="text-xs text-ink-20 font-mono mb-2">Billed ${plan.priceAnnual}/year</div>}
                        {plan.trialDays && <div className="text-[13px] text-emerald font-semibold mt-1.5">{plan.trialDays}-day free trial</div>}
                        <div className="text-[12.5px] text-ink-20 mt-3 leading-relaxed italic">{plan.tagline}</div>
                      </div>
                      <div className="h-px bg-ink-10 my-5" />
                      <FeatureList groups={plan.featureGroups} />
                      <button className="btn btn-gold w-full py-3" onClick={() => handleUpgrade(planId)} disabled={isLoading}>{isLoading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Processing…</> : `Upgrade to ${plan.name}`}</button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Express 24h Unlock Card for Free Users */}
          {currentPlanId === 'free' && (
            <div
              className="mb-10"
              style={{
                background: 'linear-gradient(135deg, rgba(212,163,88,0.08), rgba(212,163,88,0.02))',
                border: '1.5px solid rgba(212,163,88,0.3)',
                borderRadius: 14,
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'linear-gradient(135deg, #d4a358, #c9923c)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                  flexShrink: 0,
                }}>
                  ⚡
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Express 24h Unlock</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-40)', marginTop: 2 }}>
                    {isExpressUnlockActive(profile)
                      ? `Active — ${formatExpressCountdown(getExpressUnlockRemainingMs(profile))} remaining`
                      : 'Unlock all Pro features for 24 hours. Download unlimited resumes, no watermark, cover letters, and more.'
                    }
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gold)' }}>$9.99</div>
                <button
                  className="btn btn-gold"
                  onClick={() => handleAddonPurchase('express_unlock')}
                  disabled={loading === 'express_unlock' || isExpressUnlockActive(profile)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {loading === 'express_unlock' ? 'Activating…' : isExpressUnlockActive(profile) ? '✓ Active' : 'Buy Now'}
                </button>
              </div>
            </div>
          )}

          {currentIndex > 0 && (
            <div className="text-center p-7 bg-ink-05 rounded-xl mb-10"><p className="text-sm text-ink-40 mb-4">Want to switch to a lower plan? You can downgrade or cancel through the billing portal.</p><button className="btn btn-outline" onClick={handleManageBilling} disabled={loading === 'portal'}>{loading === 'portal' ? 'Opening…' : 'Open Billing Portal'}</button></div>
          )}

          {/* ── One-Time Add-Ons (visible for logged-in users) ── */}
          <div className="mb-10">
            <div className="text-center mb-6"><h2>One-time <em className="italic text-gold">add-ons</em></h2><p className="mt-1.5 text-ink-40 text-sm">Boost your job search without changing your plan.</p></div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
              {ADD_ONS.filter(a => a.id !== 'express_unlock').map(addon => (
                <div key={addon.id} className="bg-surface border border-border rounded-[14px] p-5 flex flex-col gap-2">
                  <div className="text-gold"><LandingIcon name={addon.icon} size={26} /></div>
                  <div className="font-bold text-sm text-ink">{addon.name}</div>
                  <div className="text-xs text-ink-40 leading-relaxed flex-1">
                    {addon.description}
                    {addon.id === 'mock_pack_3' && (profile?.mock_sessions_purchased || 0) > 0 && (
                      <div className="mt-1 text-gold font-semibold">{profile?.mock_sessions_purchased} bonus session{(profile?.mock_sessions_purchased || 0) !== 1 ? 's' : ''} owned</div>
                    )}
                  </div>
                  <div className="text-xl font-extrabold text-gold">${addon.price}</div>
                  <button
                    className="btn btn-outline text-xs py-1.5 px-3.5 mt-1"
                    onClick={() => handleAddonPurchase(addon.id)}
                    disabled={loading === addon.id}
                  >
                    {loading === addon.id ? 'Processing…' : 'Buy Now'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="py-10">
            <div className="text-center mb-12"><h2>Frequently asked<br /><em className="italic text-gold">questions</em></h2></div>
            <div className="max-w-[800px] mx-auto">
              <FAQAccordion />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── NOT LOGGED IN → Marketing Pricing View ──
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="text-center py-20 px-10 max-w-[600px] mx-auto">
        <h1 className="mb-4">Simple,<br /><em className="italic text-gold">honest pricing</em></h1>
        <p className="text-[17px] text-ink-40 mb-8">Start free. Upgrade when you're ready to land the job.</p>
        <Toggle />
        <p className="text-[13px] text-ink-20 mt-4">Have a coupon code? <Link href="/redeem" className="text-gold no-underline hover:underline">Redeem it here →</Link></p>
      </div>

      <div className="flex flex-col md:flex-row gap-5 max-w-[1000px] mx-auto px-5 md:px-10 pb-20 items-start">
        {planOrder.map((planId: string) => {
          const plan = (PLANS as any)[planId]
          const price = annual ? parseFloat((plan.priceAnnual / 12).toFixed(2)) : plan.priceMonthly
          return (
            <div key={plan.id} className={`flex-1 bg-[var(--white)] border-[1.5px] ${plan.popular ? 'border-gold shadow-[0_0_0_1px_var(--gold),var(--shadow-lg)] -translate-y-2 md:-translate-y-2' : 'border-ink-10'} rounded-xl p-8 relative transition-all hover:shadow-lg hover:-translate-y-0.5`}>
              {plan.popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-white text-[11px] font-bold font-mono px-4 py-1 rounded-full whitespace-nowrap">✦ Most Popular</div>}
              <div className="mb-1">
                <h3 className="text-[15px] font-mono uppercase tracking-widest text-ink-40 font-semibold mb-3">{plan.name}</h3>
                <div className="flex items-baseline gap-0.5 mb-1">
                  {price === 0 ? <span className="font-display text-[56px] font-light leading-none tracking-tight text-ink">Free</span> : <><span className="font-display text-2xl font-light text-ink-40">$</span><span className="font-display text-[56px] font-light leading-none tracking-tight text-ink">{price}</span><span className="text-sm text-ink-40 ml-1">/mo</span></>}
                </div>
                {annual && price > 0 && <div className="text-xs text-ink-20 font-mono mb-2">Billed ${plan.priceAnnual}/year</div>}
                {plan.trialDays && <div className="text-[13px] text-emerald font-semibold mt-2">Includes {plan.trialDays}-day free trial</div>}
                <div className="text-[12.5px] text-ink-20 mt-3 leading-relaxed italic">{plan.tagline}</div>
              </div>
              <div className="h-px bg-ink-10 my-5" />
              <FeatureList groups={plan.featureGroups} />
              <button className={`btn ${plan.popular ? 'btn-gold' : 'btn-outline'} w-full py-3`} onClick={() => handleUpgrade(plan.id)}>{plan.cta || getPlanBtnLabel(plan.id)}</button>
            </div>
          )
        })}
      </div>

      <div className="max-w-[900px] mx-auto mb-20 px-5 md:px-10">
        <div className="w-full">
          <div className="text-center mb-6"><h2>One-time <em className="italic text-gold">add-ons</em></h2><p className="mt-1.5 text-ink-40 text-sm">Boost your job search without changing your plan.</p></div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {ADD_ONS.map(addon => (
              <div key={addon.id} className="bg-surface border border-border rounded-[14px] p-5 flex flex-col gap-2">
                <div className="text-gold"><LandingIcon name={addon.icon} size={26} /></div>
                <div className="font-bold text-sm text-ink">{addon.name}</div>
                <div className="text-xs text-ink-40 leading-relaxed flex-1">
                  {addon.description}
                  {addon.id === 'mock_pack_3' && (profile?.mock_sessions_purchased || 0) > 0 && (
                    <div className="mt-1 text-gold font-semibold">{profile?.mock_sessions_purchased} bonus session{(profile?.mock_sessions_purchased || 0) !== 1 ? 's' : ''} owned</div>
                  )}
                </div>
                <div className="text-xl font-extrabold text-gold">${addon.price}</div>
                <button
                  className={`btn ${addon.id === 'express_unlock' && isExpressUnlockActive(profile) ? 'btn-ghost' : 'btn-outline'} text-xs py-1.5 px-3.5 mt-1`}
                  onClick={() => handleAddonPurchase(addon.id)}
                  disabled={loading === addon.id || (addon.id === 'express_unlock' && isExpressUnlockActive(profile))}
                >
                  {loading === addon.id ? 'Processing\u2026' : addon.id === 'express_unlock' && isExpressUnlockActive(profile) ? `\u26a1 Active \u2014 ${formatExpressCountdown(getExpressUnlockRemainingMs(profile))}` : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto mb-20 px-5 md:px-10 rounded-xl bg-ink-05 p-8 flex flex-col sm:flex-row items-center justify-between gap-8">
        <div><h3 className="text-[22px] mb-1.5">Need something bigger?</h3><p className="text-sm text-ink-40">Custom seats, SSO, API access, and white-labeling for large organizations.</p></div>
        <a href="mailto:enterprise@resumebuildin.io" className="btn btn-outline shrink-0">Talk to Sales →</a>
      </div>

      {/* Stripe Protection — Refund Policy Link */}
      <div className="max-w-[900px] mx-auto px-5 md:px-10 mb-14 text-center">
        <p className="text-[12px] text-ink-30 leading-relaxed">
          By purchasing, you agree to our{' '}
          <Link href="/refund-policy" className="text-gold underline hover:text-gold/80 transition-colors">Refund Policy</Link>,{' '}
          <Link href="/terms" className="text-gold underline hover:text-gold/80 transition-colors">Terms of Service</Link>, and{' '}
          <Link href="/privacy" className="text-gold underline hover:text-gold/80 transition-colors">Privacy Policy</Link>.
        </p>
      </div>
      <div className="max-w-[900px] mx-auto px-5 md:px-10 pb-20">
        <div className="text-center mb-12"><h2>Frequently asked<br /><em className="italic text-gold">questions</em></h2></div>
        <div className="max-w-[800px] mx-auto">
          <FAQAccordion />
        </div>
      </div>

      <div className="text-center py-16 px-10 bg-ink-05"><p className="text-base text-ink-40 mb-5">Still unsure? Start with the free plan — no credit card needed.</p><Link href="/auth?mode=signup" className="btn btn-gold btn-lg">Start Building Free →</Link></div>
    </div>
  )
}
