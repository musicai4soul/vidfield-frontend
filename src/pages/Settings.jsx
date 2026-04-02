import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { createRazorpayOrder, verifyPayment } from '../lib/api'
import { PLANS } from '../components/PricingSection'
import {
  User, CreditCard, Shield, Bell, Zap,
  CheckCircle, ExternalLink, Crown, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'account',  label: 'Account',  icon: User },
  { id: 'billing',  label: 'Billing',  icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
]

/* ── Razorpay checkout helper ─────────────────────────────────────── */
function useRazorpay(refreshProfile) {
  const [paying, setPaying] = useState(false)

  const checkout = async (plan) => {
    if (plan.id === 'free') return
    setPaying(true)
    try {
      const { data: order } = await createRazorpayOrder(plan.id)
      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      order.amount,
        currency:    'INR',
        name:        'Vidfield',
        description: `${plan.name} Plan — ${plan.creditsLabel}`,
        order_id:    order.razorpay_order_id,
        prefill:     { email: order.email },
        theme:       { color: '#6366f1' },
        modal:       { ondismiss: () => setPaying(false) },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              plan_id:             plan.id,
            })
            toast.success(`🎉 Upgraded to ${plan.name}! Credits added.`)
            refreshProfile()
          } catch (e) {
            toast.error('Payment verification failed. Contact support.')
          } finally {
            setPaying(false)
          }
        },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Could not initiate payment.')
      setPaying(false)
    }
  }

  return { paying, checkout }
}

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth()
  const { paying, checkout } = useRazorpay(refreshProfile)
  const [tab, setTab] = useState('account')

  const currentPlan = PLANS.find(p => p.id === (profile?.plan || 'free')) || PLANS[0]

  const planColors = {
    free:    'text-zinc-400 border-zinc-600',
    starter: 'text-green-400 border-green-500/40',
    creator: 'text-brand-400 border-brand-500/40',
    pro:     'text-accent-gold border-yellow-500/40',
  }
  const planColor = planColors[profile?.plan] || planColors.free

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-zinc-100 mb-1">Settings</h1>
          <p className="text-zinc-500 text-sm">Manage your account, billing, and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-dark-800 border border-dark-600 rounded-xl p-1 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${tab === id
                  ? 'bg-dark-600 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* ── Account Tab ─────────────────────────────────────────── */}
        {tab === 'account' && (
          <div className="space-y-5">
            <div className="card">
              <h3 className="font-bold text-zinc-200 mb-5 flex items-center gap-2">
                <User size={16} className="text-brand-400" /> Profile
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white">
                  {(user?.email?.[0] ?? 'U').toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-zinc-200">{user?.email}</p>
                  <p className={`text-sm font-medium capitalize ${planColor.split(' ')[0]}`}>
                    {profile?.plan || 'free'} plan
                  </p>
                </div>
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="label">Email address</label>
                  <input value={user?.email || ''} readOnly className="input opacity-60 cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* Credit usage */}
            <div className="card">
              <h3 className="font-bold text-zinc-200 mb-4 flex items-center gap-2">
                <Zap size={16} className="text-accent-gold" /> Credit Usage
              </h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-zinc-400">Credits remaining</span>
                <span className="font-bold text-zinc-200">{profile?.credits ?? 0} / {currentPlan.credits}</span>
              </div>
              <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((profile?.credits ?? 0) / currentPlan.credits) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-zinc-600 mt-2">
                Credits reset on your next billing date.
              </p>
            </div>
          </div>
        )}

        {/* ── Billing Tab ─────────────────────────────────────────── */}
        {tab === 'billing' && (
          <div className="space-y-5">
            {/* Current plan */}
            <div className={`card border ${planColor.split(' ')[1] || 'border-dark-500'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-zinc-200 flex items-center gap-2">
                    <Crown size={16} className={planColor.split(' ')[0]} />
                    Current Plan
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Your active subscription</p>
                </div>
                <span className={`badge border ${planColor} text-xs capitalize font-bold`}>
                  {profile?.plan || 'free'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-dark-800 border border-dark-600 text-center">
                  <p className="text-xs text-zinc-500 mb-1">Monthly Credits</p>
                  <p className="text-xl font-black text-zinc-200">{currentPlan.credits}</p>
                </div>
                <div className="p-3 rounded-xl bg-dark-800 border border-dark-600 text-center">
                  <p className="text-xs text-zinc-500 mb-1">Monthly Price</p>
                  <p className="text-xl font-black text-zinc-200">{currentPlan.priceLabel}</p>
                </div>
              </div>
            </div>

            {/* Upgrade plans */}
            <div className="card">
              <h3 className="font-bold text-zinc-200 mb-5">Upgrade Plan</h3>
              <div className="space-y-3">
                {PLANS.filter(p => p.id !== 'free').map((plan) => {
                  const isCurrent = plan.id === (profile?.plan || 'free')
                  return (
                    <div
                      key={plan.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all
                        ${isCurrent
                          ? 'bg-brand-500/10 border-brand-500/30'
                          : 'bg-dark-800 border-dark-600 hover:border-dark-400'
                        }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-zinc-200 text-sm">{plan.name}</span>
                          {plan.popular && (
                            <span className="badge bg-brand-500/20 text-brand-300 text-xs">Popular</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500">{plan.creditsLabel} · {plan.priceLabel}/month</p>
                      </div>
                      {isCurrent ? (
                        <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                          <CheckCircle size={13} /> Active
                        </span>
                      ) : (
                        <button
                          onClick={() => checkout(plan)}
                          disabled={paying}
                          className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5"
                        >
                          {paying ? <Loader2 size={12} className="animate-spin" /> : null}
                          Upgrade
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <p className="text-xs text-zinc-600 text-center">
              Payments via Razorpay · Secured with 256-bit encryption · UPI, Cards, Net Banking accepted
            </p>
          </div>
        )}

        {/* ── Security Tab ────────────────────────────────────────── */}
        {tab === 'security' && (
          <div className="space-y-5">
            <div className="card">
              <h3 className="font-bold text-zinc-200 mb-5 flex items-center gap-2">
                <Shield size={16} className="text-green-400" /> Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800 border border-dark-600">
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">Password</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Change your account password</p>
                  </div>
                  <button className="btn-secondary !py-2 !px-4 text-xs">Change</button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800 border border-dark-600">
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">Two-Factor Authentication</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Add an extra layer of security</p>
                  </div>
                  <button className="btn-secondary !py-2 !px-4 text-xs">Enable</button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800 border border-dark-600">
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">Active Sessions</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Manage devices signed into your account</p>
                  </div>
                  <button className="btn-secondary !py-2 !px-4 text-xs">View</button>
                </div>
              </div>
            </div>

            <div className="card border-red-500/20">
              <h3 className="font-bold text-red-400 mb-4">Danger Zone</h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <div>
                  <p className="text-sm font-semibold text-zinc-200">Delete Account</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Permanently delete your account and all data</p>
                </div>
                <button className="px-4 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-all">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
