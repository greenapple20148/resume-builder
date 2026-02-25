import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { toast } from '../components/Toast'
import { PLANS, ADD_ONS, createCheckoutSession, openCustomerPortal } from '../lib/stripe'
import { useStore } from '../lib/store'
import styles from './PricingPage.module.css'

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)
  const [loading, setLoading] = useState<string | null>(null)
  const { user, profile } = useStore()
  const navigate = useNavigate()

  const currentPlanId = profile?.plan || 'free'
  const currentPlan = (PLANS as any)[currentPlanId] || PLANS.free
  const planOrder = ['free', 'pro', 'premium', 'career_plus']
  const currentIndex = planOrder.indexOf(currentPlanId)

  const handleUpgrade = async (plan: string) => {
    if (!user) {
      navigate('/auth?mode=signup')
      return
    }

    if (plan === 'free') return

    // Same plan → manage billing via customer portal
    if (profile?.plan === plan) {
      try {
        setLoading(plan)
        await openCustomerPortal()
      } catch (err) {
        toast.error('Could not open billing portal. Please try again.')
      } finally {
        setLoading(null)
      }
      return
    }

    // Upgrade/downgrade → Stripe Checkout (old subs auto-cancelled server-side)
    const planData = (PLANS as any)[plan]
    const priceId = annual
      ? planData.stripePriceIdAnnual
      : planData.stripePriceIdMonthly

    if (!priceId) {
      toast.error('Price configuration missing. Set your Stripe Price IDs in .env file')
      return
    }

    try {
      setLoading(plan)
      const { url } = await createCheckoutSession(priceId, plan)
      if (url) window.location.href = url
    } catch (err: any) {
      toast.error(err.message || 'Checkout failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleManageBilling = async () => {
    try {
      setLoading('portal')
      await openCustomerPortal()
    } catch (err) {
      toast.error('Could not open billing portal. Please try again.')
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
    { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your billing portal. You keep access until the end of your billing period. No surprise renewals — we send a reminder email before each renewal.' },
    { q: 'Is there a free trial?', a: 'The Free plan is forever free — build your resume and see how it looks. Pro includes a 7-day free trial so you can try all features (templates, DOCX, cover letters) before being charged.' },
    { q: 'What\'s the difference between the plans?', a: 'Pro is for building great resumes. Premium adds AI mock interviews (3/mo), JD matching, and LinkedIn tools. Career+ gives 20 mock sessions/month, all interview modes, STAR coaching, and priority support.' },
    { q: 'What are AI Mock Interviews?', a: 'AI-powered practice interviews that ask role-specific questions, evaluate your answers in real-time, and give you detailed feedback on clarity, confidence, keyword usage, and STAR structure.' },
    { q: 'What are One-Time Add-Ons?', a: 'Boost your job search without a subscription change. Buy a Mock Interview Pack (3 sessions), get a Human Resume Review, a LinkedIn Profile Overhaul, or 24-hour Express Pro access.' },
    { q: 'What payment methods do you accept?', a: 'All major credit and debit cards (Visa, Mastercard, Amex), Apple Pay, and Google Pay via Stripe.' },
    { q: 'Do you offer refunds?', a: 'We offer a full refund within 7 days of purchase if you\'re not satisfied. No questions asked. Contact support@resumebuildin.io.' },
  ]

  // ────────────────────────────────────────────────────
  // LOGGED-IN USER → Plan Management View
  // ────────────────────────────────────────────────────
  if (user) {
    return (
      <div className={styles.page}>
        <Navbar />

        <div className={styles.manageContainer}>
          {/* Current Plan Hero */}
          <div className={styles.manageHero}>
            <h1>Manage your <em>plan</em></h1>
            <p>You're currently on the <strong>{currentPlan.name}</strong> plan.</p>
          </div>

          {/* Current Plan Card */}
          <div className={styles.currentPlanCard}>
            <div className={styles.currentPlanLeft}>
              <div className={styles.currentPlanBadge}>
                <span className={`badge ${currentPlanId === 'free' ? 'badge-dark' : 'badge-gold'}`}>
                  {currentPlan.name}
                </span>
                <span className={styles.currentPlanStatus}>Active</span>
              </div>
              <div className={styles.currentPlanPrice}>
                {currentPlan.priceMonthly === 0 ? (
                  <span>Free forever</span>
                ) : (
                  <span>${currentPlan.priceMonthly}/mo <span className={styles.currentPlanPriceAlt}>or ${currentPlan.priceAnnual}/yr</span></span>
                )}
              </div>
              <div className={styles.currentPlanTagline}>{currentPlan.tagline}</div>
            </div>
            {currentPlanId !== 'free' && (
              <div className={styles.currentPlanActions}>
                <button
                  className="btn btn-outline"
                  onClick={handleManageBilling}
                  disabled={loading === 'portal'}
                >
                  {loading === 'portal' ? (
                    <><div className="spinner" style={{ width: 14, height: 14 }} /> Opening…</>
                  ) : (
                    'Manage Billing'
                  )}
                </button>
                <button
                  className={`btn ${styles.cancelBtn}`}
                  onClick={handleManageBilling}
                  disabled={loading === 'portal'}
                >
                  Cancel Subscription
                </button>
              </div>
            )}
          </div>

          {/* Current Plan Features */}
          <div className={styles.currentPlanFeatures}>
            <div className={styles.currentPlanFeaturesTitle}>What's included in your plan</div>
            <div className={styles.currentPlanFeaturesGrid}>
              {currentPlan.featureGroups.map((group: any, gi: number) => (
                <div key={gi} className={styles.currentFeatureGroup}>
                  <div className={styles.featureGroupLabel}>{group.label}</div>
                  <ul className={styles.features}>
                    {group.features.map((f: any, i: number) => (
                      <li key={i} className={`${styles.feature} ${!f.included ? styles.featureOff : ''}`}>
                        <span className={styles.featureCheck}>{f.included ? '✓' : '✕'}</span>
                        {f.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Available Plans */}
          {currentIndex < planOrder.length - 1 && (
            <div className={styles.availablePlans}>
              <div className={styles.availablePlansTitle}>Upgrade your plan</div>
              <p className={styles.availablePlansSubtitle}>Unlock more features and tools to supercharge your job search.</p>

              {/* Annual toggle */}
              <div className={styles.toggle} style={{ marginBottom: 28 }}>
                <span className={!annual ? styles.toggleActive : ''}>Monthly</span>
                <button
                  className={styles.toggleSwitch}
                  onClick={() => setAnnual(!annual)}
                  aria-checked={annual}
                  role="switch"
                >
                  <div className={styles.toggleThumb} style={{ transform: annual ? 'translateX(22px)' : 'translateX(2px)' }} />
                </button>
                <span className={annual ? styles.toggleActive : ''}>
                  Annual
                  <span className="badge badge-green" style={{ marginLeft: 8 }}>Save 56%</span>
                </span>
              </div>

              <div className={styles.upgradePlans}>
                {planOrder.filter((_, idx) => idx > currentIndex).map(planId => {
                  const plan = (PLANS as any)[planId]
                  const price = annual ? parseFloat((plan.priceAnnual / 12).toFixed(2)) : plan.priceMonthly
                  const isLoading = loading === planId

                  return (
                    <div key={planId} className={`${styles.upgradePlanCard} ${plan.popular ? styles.upgradePlanPopular : ''}`}>
                      {plan.popular && <div className={styles.popularBadge}>✦ Most Popular</div>}
                      <div className={styles.upgradePlanHeader}>
                        <h3>{plan.name}</h3>
                        <div className={styles.upgradePlanPrice}>
                          <span className={styles.priceCurrency}>$</span>
                          <span className={styles.priceNum} style={{ fontSize: 40 }}>{price}</span>
                          <span className={styles.pricePer}>/mo</span>
                        </div>
                        {annual && (
                          <div className={styles.priceNote}>Billed ${plan.priceAnnual}/year</div>
                        )}
                        {plan.trialDays && (
                          <div style={{ fontSize: 13, color: 'var(--emerald)', fontWeight: 600, marginTop: 6 }}>
                            {plan.trialDays}-day free trial
                          </div>
                        )}
                        <div className={styles.planTagline}>{plan.tagline}</div>
                      </div>

                      <div className={styles.planDivider} />

                      <div className={styles.featureGroupsWrap}>
                        {plan.featureGroups.map((group: any, gi: number) => (
                          <div key={gi} className={styles.featureGroup}>
                            <div className={styles.featureGroupLabel}>{group.label}</div>
                            <ul className={styles.features}>
                              {group.features.map((f: any, i: number) => (
                                <li key={i} className={`${styles.feature} ${!f.included ? styles.featureOff : ''}`}>
                                  <span className={styles.featureCheck}>{f.included ? '✓' : '✕'}</span>
                                  {f.text}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <button
                        className={`btn btn-gold ${styles.planBtn}`}
                        onClick={() => handleUpgrade(planId)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <><div className="spinner" style={{ width: 16, height: 16 }} /> Processing…</>
                        ) : (
                          `Upgrade to ${plan.name}`
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Downgrade option */}
          {currentIndex > 0 && (
            <div className={styles.downgradeSection}>
              <p>Want to switch to a lower plan? You can downgrade or cancel through the billing portal.</p>
              <button className="btn btn-outline" onClick={handleManageBilling} disabled={loading === 'portal'}>
                {loading === 'portal' ? 'Opening…' : 'Open Billing Portal'}
              </button>
            </div>
          )}

          {/* FAQ */}
          <div className={styles.faq} style={{ padding: '40px 0' }}>
            <div className={styles.sectionHeader}>
              <h2>Frequently asked<br /><em>questions</em></h2>
            </div>
            <div className={styles.faqGrid}>
              {FAQ.map((item, i) => (
                <div key={i} className={styles.faqItem}>
                  <h4>{item.q}</h4>
                  <p>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ────────────────────────────────────────────────────
  // NOT LOGGED IN → Marketing Pricing View
  // ────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.hero}>
        <h1>Simple,<br /><em>honest pricing</em></h1>
        <p>Start free. Upgrade when you're ready to land the job.</p>

        {/* Annual toggle */}
        <div className={styles.toggle}>
          <span className={!annual ? styles.toggleActive : ''}>Monthly</span>
          <button
            className={styles.toggleSwitch}
            onClick={() => setAnnual(!annual)}
            aria-checked={annual}
            role="switch"
          >
            <div className={styles.toggleThumb} style={{ transform: annual ? 'translateX(22px)' : 'translateX(2px)' }} />
          </button>
          <span className={annual ? styles.toggleActive : ''}>
            Annual
            <span className="badge badge-green" style={{ marginLeft: 8 }}>Save 56%</span>
          </span>
        </div>
      </div>

      {/* Pricing cards */}
      <div className={styles.plans}>
        {Object.values(PLANS).map((plan: any) => {
          const price = annual ? parseFloat((plan.priceAnnual / 12).toFixed(2)) : plan.priceMonthly

          return (
            <div
              key={plan.id}
              className={`${styles.plan} ${plan.popular ? styles.planPopular : ''}`}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>
                  ✦ Most Popular
                </div>
              )}

              <div className={styles.planHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.planPrice}>
                  {price === 0 ? (
                    <span className={styles.priceNum}>Free</span>
                  ) : (
                    <>
                      <span className={styles.priceCurrency}>$</span>
                      <span className={styles.priceNum}>{price}</span>
                      <span className={styles.pricePer}>/mo</span>
                    </>
                  )}
                </div>
                {annual && price > 0 && (
                  <div className={styles.priceNote}>
                    Billed ${plan.priceAnnual}/year
                  </div>
                )}
                {plan.trialDays && (
                  <div style={{ fontSize: 13, color: 'var(--emerald)', fontWeight: 600, marginTop: 8 }}>
                    Includes {plan.trialDays}-day free trial
                  </div>
                )}
                <div className={styles.planTagline}>{plan.tagline}</div>
              </div>

              <div className={styles.planDivider} />

              <div className={styles.featureGroupsWrap}>
                {plan.featureGroups.map((group: any, gi: number) => (
                  <div key={gi} className={styles.featureGroup}>
                    <div className={styles.featureGroupLabel}>{group.label}</div>
                    <ul className={styles.features}>
                      {group.features.map((f: any, i: number) => (
                        <li key={i} className={`${styles.feature} ${!f.included ? styles.featureOff : ''}`}>
                          <span className={styles.featureCheck}>{f.included ? '✓' : '✕'}</span>
                          {f.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <button
                className={`btn ${plan.popular ? 'btn-gold' : 'btn-outline'} ${styles.planBtn}`}
                onClick={() => handleUpgrade(plan.id)}
              >
                {plan.cta || getPlanBtnLabel(plan.id)}
              </button>
            </div>
          )
        })}
      </div>

      {/* Add-Ons */}
      <div className={styles.enterprise}>
        <div style={{ width: '100%' }}>
          <div className={styles.sectionHeader} style={{ marginBottom: 24 }}>
            <h2>One-time <em>add-ons</em></h2>
            <p style={{ marginTop: 6, color: 'var(--ink-40)', fontSize: 14 }}>Boost your job search without changing your plan.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {ADD_ONS.map(addon => (
              <div key={addon.id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 18px',
                display: 'flex', flexDirection: 'column' as const, gap: 8
              }}>
                <div style={{ fontSize: 28 }}>{addon.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{addon.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-40)', lineHeight: 1.5, flex: 1 }}>{addon.description}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gold)' }}>${addon.price}</div>
                <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 14px', marginTop: 4 }}>
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className={styles.enterprise}>
        <div className={styles.enterpriseContent}>
          <h3>Need something bigger?</h3>
          <p>Custom seats, SSO, API access, and white-labeling for large organizations.</p>
        </div>
        <a href="mailto:enterprise@resumebuildin.io" className="btn btn-outline">
          Talk to Sales →
        </a>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <div className={styles.sectionHeader}>
          <h2>Frequently asked<br /><em>questions</em></h2>
        </div>
        <div className={styles.faqGrid}>
          {FAQ.map((item, i) => (
            <div key={i} className={styles.faqItem}>
              <h4>{item.q}</h4>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className={styles.bottomCta}>
        <p>Still unsure? Start with the free plan — no credit card needed.</p>
        <Link to="/auth?mode=signup" className="btn btn-gold btn-lg">
          Start Building Free →
        </Link>
      </div>
    </div>
  )
}
