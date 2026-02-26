import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { toast } from '../components/Toast'
import { PLANS, ADD_ONS, createCheckoutSession, openCustomerPortal } from '../lib/stripe'
import { useStore } from '../lib/store'
import { useSEO } from '../lib/useSEO'

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)
  const [loading, setLoading] = useState<string | null>(null)
  const { user, profile } = useStore()
  const navigate = useNavigate()

  const currentPlanId = profile?.plan || 'free'
  const currentPlan = (PLANS as any)[currentPlanId] || PLANS.free
  const planOrder = ['free', 'pro', 'premium', 'career_plus']
  const currentIndex = planOrder.indexOf(currentPlanId)

  useSEO({
    title: user ? 'Manage Your Plan' : 'Pricing — Simple, Honest Plans',
    description: user
      ? 'Manage your ResumeBuildIn subscription, upgrade or downgrade your plan, and access billing.'
      : 'Start free, upgrade when you\'re ready. ResumeBuildIn offers simple pricing for resume building, AI tools, mock interviews, and career coaching.',
    path: '/pricing',
    noindex: !!user,
  })

  const handleUpgrade = async (plan: string) => {
    if (!user) { navigate('/auth?mode=signup'); return }
    if (plan === 'free') return
    if (profile?.plan === plan) { try { setLoading(plan); await openCustomerPortal() } catch { toast.error('Could not open billing portal.') } finally { setLoading(null) }; return }
    const planData = (PLANS as any)[plan]
    const priceId = annual ? planData.stripePriceIdAnnual : planData.stripePriceIdMonthly
    if (!priceId) { toast.error('Price configuration missing.'); return }
    try { setLoading(plan); const { url } = await createCheckoutSession(priceId, plan); if (url) window.location.href = url } catch (err: any) { toast.error(err.message || 'Checkout failed.') } finally { setLoading(null) }
  }

  const handleManageBilling = async () => { try { setLoading('portal'); await openCustomerPortal() } catch { toast.error('Could not open billing portal.') } finally { setLoading(null) } }

  const getPlanBtnLabel = (planId: string) => {
    if (!user) return planId === 'free' ? 'Get Started Free' : ((PLANS as any)[planId].trialDays ? `Start ${(PLANS as any)[planId].trialDays}-Day Free Trial` : 'Upgrade Now')
    if (profile?.plan === planId) return 'Current Plan'
    const targetIndex = planOrder.indexOf(planId)
    if (targetIndex > currentIndex) return 'Upgrade'
    if (targetIndex < currentIndex) return 'Downgrade'
    return 'Select'
  }

  const FAQ = [
    { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your billing portal. You keep access until the end of your billing period.' },
    { q: 'Is there a free trial?', a: 'The Free plan is forever free. Pro includes a 7-day free trial so you can try all features before being charged.' },
    { q: "What's the difference between the plans?", a: 'Pro is for building great resumes. Premium adds AI mock interviews, JD matching, and LinkedIn tools. Career+ gives 20 mock sessions/month and priority support.' },
    { q: 'What are AI Mock Interviews?', a: 'AI-powered practice interviews that ask role-specific questions, evaluate your answers in real-time, and give you detailed feedback.' },
    { q: 'What are One-Time Add-Ons?', a: 'Boost your job search without a subscription change. Buy a Mock Interview Pack, get a Human Resume Review, or 24-hour Express Pro access.' },
    { q: 'What payment methods do you accept?', a: 'All major credit and debit cards, Apple Pay, and Google Pay via Stripe.' },
    { q: 'Do you offer refunds?', a: "We offer a full refund within 7 days of purchase. No questions asked. Contact support@resumebuildin.io." },
  ]

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
        <div className="max-w-[800px] mx-auto px-5 sm:px-10 pt-10 pb-20">
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
              <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
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

          {currentIndex > 0 && (
            <div className="text-center p-7 bg-ink-05 rounded-xl mb-10"><p className="text-sm text-ink-40 mb-4">Want to switch to a lower plan? You can downgrade or cancel through the billing portal.</p><button className="btn btn-outline" onClick={handleManageBilling} disabled={loading === 'portal'}>{loading === 'portal' ? 'Opening…' : 'Open Billing Portal'}</button></div>
          )}

          <div className="py-10">
            <div className="text-center mb-12"><h2>Frequently asked<br /><em className="italic text-gold">questions</em></h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FAQ.map((item, i) => (<div key={i} className="p-6 bg-[var(--white)] border border-ink-10 rounded-xl"><h4 className="text-base mb-2.5">{item.q}</h4><p className="text-sm text-ink-40 leading-relaxed">{item.a}</p></div>))}
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
      </div>

      <div className="flex flex-col md:flex-row gap-5 max-w-[1000px] mx-auto px-5 md:px-10 pb-20 items-start">
        {Object.values(PLANS).map((plan: any) => {
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
                <div className="text-[28px]">{addon.icon}</div>
                <div className="font-bold text-sm text-ink">{addon.name}</div>
                <div className="text-xs text-ink-40 leading-relaxed flex-1">{addon.description}</div>
                <div className="text-xl font-extrabold text-gold">${addon.price}</div>
                <button className="btn btn-outline text-xs py-1.5 px-3.5 mt-1">Buy Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto mb-20 px-5 md:px-10 rounded-xl bg-ink-05 p-8 flex flex-col sm:flex-row items-center justify-between gap-8">
        <div><h3 className="text-[22px] mb-1.5">Need something bigger?</h3><p className="text-sm text-ink-40">Custom seats, SSO, API access, and white-labeling for large organizations.</p></div>
        <a href="mailto:enterprise@resumebuildin.io" className="btn btn-outline shrink-0">Talk to Sales →</a>
      </div>

      <div className="max-w-[900px] mx-auto px-5 md:px-10 pb-20">
        <div className="text-center mb-12"><h2>Frequently asked<br /><em className="italic text-gold">questions</em></h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FAQ.map((item, i) => (<div key={i} className="p-6 bg-[var(--white)] border border-ink-10 rounded-xl"><h4 className="text-base mb-2.5">{item.q}</h4><p className="text-sm text-ink-40 leading-relaxed">{item.a}</p></div>))}
        </div>
      </div>

      <div className="text-center py-16 px-10 bg-ink-05"><p className="text-base text-ink-40 mb-5">Still unsure? Start with the free plan — no credit card needed.</p><Link to="/auth?mode=signup" className="btn btn-gold btn-lg">Start Building Free →</Link></div>
    </div>
  )
}
