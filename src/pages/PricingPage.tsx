import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { toast } from '../components/Toast'
import { PLANS, createCheckoutSession, openCustomerPortal } from '../lib/stripe'
import { useStore } from '../lib/store'
import styles from './PricingPage.module.css'

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const { user, profile } = useStore()
  const navigate = useNavigate()

  const handleUpgrade = async (plan: string) => {
    if (!user) {
      navigate('/auth?mode=signup')
      return
    }

    if (plan === 'free') return

    if (profile?.plan === plan) {
      // Open billing portal for management
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

  const getPlanBtnLabel = (planId: string) => {
    const plan = (PLANS as any)[planId]
    if (!user) return planId === 'free' ? 'Get Started Free' : (plan.trialDays ? `Start ${plan.trialDays}-Day Free Trial` : 'Upgrade Now')
    if (profile?.plan === planId) return 'Manage Billing'
    if (planId === 'free') return 'Downgrade'
    return plan.trialDays && profile?.plan === 'free' ? `Start ${plan.trialDays}-Day Free Trial` : 'Upgrade Now'
  }

  const FAQ = [
    { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your billing portal. You keep Pro access until the end of your billing period.' },
    { q: 'Is there a free trial?', a: 'The Free plan is forever free. Our Pro plan also includes a 7-day free trial so you can test all premium features before being charged.' },
    { q: 'What payment methods do you accept?', a: 'All major credit and debit cards (Visa, Mastercard, Amex), Apple Pay, and Google Pay via Stripe.' },
    { q: 'Do you offer refunds?', a: 'We offer a full refund within 7 days of purchase if you\'re not satisfied. Contact support@resumecraft.io.' },
  ]

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
          const isCurrent = profile?.plan === plan.id
          const price = annual ? parseFloat((plan.priceAnnual / 12).toFixed(2)) : plan.priceMonthly
          const isLoading = loading === plan.id

          return (
            <div
              key={plan.id}
              className={`${styles.plan} ${plan.popular ? styles.planPopular : ''} ${isCurrent ? styles.planCurrent : ''}`}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>
                  ✦ Most Popular
                </div>
              )}
              {isCurrent && (
                <div className={styles.currentBadge}>Your Plan</div>
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
              </div>

              <div className={styles.planDivider} />

              <ul className={styles.features}>
                {plan.features.map((f: any, i: number) => (
                  <li key={i} className={`${styles.feature} ${!f.included ? styles.featureOff : ''}`}>
                    <span className={styles.featureCheck}>{f.included ? '✓' : '✕'}</span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <button
                className={`btn ${plan.popular ? 'btn-gold' : 'btn-outline'} ${styles.planBtn}`}
                onClick={() => handleUpgrade(plan.id)}
                disabled={isLoading || (plan.id === 'free' && user && profile?.plan === 'free')}
              >
                {isLoading ? (
                  <><div className="spinner" style={{ width: 16, height: 16 }} /> Processing…</>
                ) : (
                  getPlanBtnLabel(plan.id)
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Enterprise CTA */}
      <div className={styles.enterprise}>
        <div className={styles.enterpriseContent}>
          <h3>Need something bigger?</h3>
          <p>Custom seats, SSO, API access, and white-labeling for large organizations.</p>
        </div>
        <a href="mailto:enterprise@resumecraft.io" className="btn btn-outline">
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
