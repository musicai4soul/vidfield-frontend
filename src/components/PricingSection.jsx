import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Zap, ArrowRight, Star, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { createRazorpayOrder, verifyPayment } from '../lib/api'
import toast from 'react-hot-toast'

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: '₹0',
    period: 'forever',
    credits: 10,
    creditsLabel: '10 credits/month',
    description: 'Try Vidfield with no commitment',
    color: 'border-dark-500',
    buttonClass: 'btn-secondary',
    buttonLabel: 'Get Started Free',
    popular: false,
    features: [
      '10 AI video credits/month',
      'All 4 style presets',
      'Up to 15-second clips',
      '720p export',
      'Community support',
    ],
    missing: ['HD 1080p export', 'Commercial license', 'Priority generation', 'API access'],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 299,
    priceLabel: '₹299',
    period: '/month',
    credits: 50,
    creditsLabel: '50 credits/month',
    description: 'For individual creators getting started',
    color: 'border-dark-500',
    buttonClass: 'btn-secondary',
    buttonLabel: 'Start Starter',
    popular: false,
    features: [
      '50 AI video credits/month',
      'All 4 style presets',
      'Up to 60-second clips',
      '1080p export',
      'Commercial license',
      'Email support',
    ],
    missing: ['Priority generation', 'API access'],
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 799,
    priceLabel: '₹799',
    period: '/month',
    credits: 200,
    creditsLabel: '200 credits/month',
    description: 'For serious creators and small teams',
    color: 'border-brand-500',
    buttonClass: 'btn-primary',
    buttonLabel: 'Go Creator',
    popular: true,
    features: [
      '200 AI video credits/month',
      'All 4 style presets',
      'Up to 2-minute clips',
      '1080p export',
      'Commercial license',
      'Priority generation queue',
      'Priority support',
      'Video history & downloads',
    ],
    missing: ['API access'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1999,
    priceLabel: '₹1,999',
    period: '/month',
    credits: 600,
    creditsLabel: '600 credits/month',
    description: 'For agencies and power users',
    color: 'border-dark-500',
    buttonClass: 'btn-secondary',
    buttonLabel: 'Go Pro',
    popular: false,
    features: [
      '600 AI video credits/month',
      'All 4 style presets',
      'Up to 2-minute clips',
      '4K export',
      'Commercial license',
      'Priority generation queue',
      'API access',
      'Dedicated support',
      'Custom style presets',
      'Team workspace (3 seats)',
    ],
    missing: [],
  },
]

/* ── Razorpay checkout hook ─────────────────────────────────────────── */
function useRazorpay(user, refreshProfile) {
  const [payingId, setPayingId] = useState(null)

  const checkout = async (plan) => {
    if (plan.id === 'free') return
    if (!user) return
    setPayingId(plan.id)
    try {
      const { data: order } = await createRazorpayOrder(plan.id)
      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      order.amount,
        currency:    'INR',
        name:        'Vidfield',
        description: `${plan.name} Plan — ${plan.creditsLabel}`,
        order_id:    order.razorpay_order_id,
        prefill:     { email: order.email || user?.email },
        theme:       { color: '#6366f1' },
        modal:       { ondismiss: () => setPayingId(null) },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              plan_id:             plan.id,
            })
            toast.success(`🎉 Upgraded to ${plan.name}! Credits added.`)
            if (refreshProfile) refreshProfile()
          } catch (e) {
            toast.error('Payment verification failed. Contact support.')
          } finally {
            setPayingId(null)
          }
        },
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.')
        setPayingId(null)
      })
      rzp.open()
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Could not initiate payment.')
      setPayingId(null)
    }
  }

  return { payingId, checkout }
}

/* ── PricingSection ─────────────────────────────────────────────────── */
export default function PricingSection({ onSelectPlan }) {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const { payingId, checkout } = useRazorpay(user, refreshProfile)

  const handlePlanClick = (plan) => {
    if (onSelectPlan) {
      onSelectPlan(plan)
      return
    }
    if (plan.id === 'free') {
      if (user) navigate('/dashboard')
      else navigate('/signup')
      return
    }
    if (!user) {
      navigate('/signup')
      return
    }
    checkout(plan)
  }

  return (
    <section className="py-24 bg-dark-800/40">
      <div className="page-container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-sm font-medium mb-4">
            <Zap size={13} />
            Simple INR Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-100 mb-4">
            Plans for Every Creator
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            No dollar conversions. No surprises. Pay in rupees, cancel anytime.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {PLANS.map((plan) => {
            const isPaying = payingId === plan.id
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border ${plan.color} bg-dark-700 p-6 flex flex-col gap-4
                  ${plan.popular ? 'ring-2 ring-brand-500 shadow-xl shadow-brand-950/50' : ''}
                  transition-all hover:border-dark-400`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500 text-xs font-bold text-white shadow-lg">
                      <Star size={11} className="fill-white" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-zinc-100 mb-0.5">{plan.name}</h3>
                  <p className="text-xs text-zinc-500">{plan.description}</p>
                </div>

                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-zinc-100">{plan.priceLabel}</span>
                  <span className="text-sm text-zinc-500 mb-1">{plan.period}</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800 border border-dark-600">
                  <Zap size={14} className="text-accent-gold" />
                  <span className="text-sm font-semibold text-zinc-300">{plan.creditsLabel}</span>
                </div>

                <button
                  onClick={() => handlePlanClick(plan)}
                  disabled={isPaying}
                  className={`${plan.buttonClass} text-sm text-center w-full flex items-center justify-center gap-2 disabled:opacity-60`}
                >
                  {isPaying ? (
                    <><Loader2 size={14} className="animate-spin" /> Processing…</>
                  ) : (
                    plan.buttonLabel
                  )}
                </button>

                <ul className="space-y-2 pt-2 border-t border-dark-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                      <CheckCircle size={13} className="text-green-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-zinc-600 line-through">
                      <CheckCircle size={13} className="text-dark-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <p className="text-center text-sm text-zinc-600 mt-10">
          All plans include GST. Payments secured by Razorpay. Cancel anytime from your dashboard.
        </p>
      </div>
    </section>
  )
}
