import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PricingSection from '../components/PricingSection'
import { ShieldCheck, RefreshCw, Zap, HelpCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'What is a credit?',
    a: 'One credit = one AI video generation. Short clips (≤15s) cost 1 credit. Longer clips (16s–2min) cost 2 credits. Credits refresh every billing cycle.'
  },
  {
    q: 'Can I get a refund?',
    a: 'Yes. We offer a 7-day money-back guarantee on all paid plans. If you\'re not happy, email support@vidfield.in and we\'ll refund immediately.'
  },
  {
    q: 'Do unused credits roll over?',
    a: 'Credits do not roll over to the next month. They reset on your billing date. Purchase a top-up if you need more credits mid-month.'
  },
  {
    q: 'Can I use videos for commercial projects?',
    a: 'All paid plans include a full commercial license. You own the videos you generate and can use them in ads, films, client projects, and social media.'
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept all major UPI apps (GPay, PhonePe, Paytm), debit/credit cards (Visa, Mastercard, RuPay), and net banking — all through Razorpay.'
  },
  {
    q: 'How do I upgrade or downgrade?',
    a: 'You can change your plan any time from your Dashboard → Settings → Billing. Upgrades are effective immediately; downgrades apply at next billing cycle.'
  },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-24">
        {/* Hero */}
        <section className="py-16 text-center">
          <div className="page-container">
            <h1 className="text-4xl sm:text-5xl font-black text-zinc-100 mb-4">
              Simple, Honest Pricing
            </h1>
            <p className="text-zinc-400 text-xl max-w-xl mx-auto">
              Pay in ₹. No hidden charges. No dollar conversion anxiety.
            </p>
          </div>
        </section>

        {/* Pricing cards */}
        <PricingSection />

        {/* Trust badges */}
        <section className="py-16">
          <div className="page-container">
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: ShieldCheck, title: '7-Day Money Back', desc: 'Not happy? Full refund, no questions asked.', color: 'text-green-400', bg: 'bg-green-500/10' },
                { icon: RefreshCw, title: 'Cancel Anytime', desc: 'No lock-in. Cancel from dashboard in one click.', color: 'text-brand-400', bg: 'bg-brand-500/10' },
                { icon: Zap, title: 'Instant Activation', desc: 'Credits available immediately after payment.', color: 'text-accent-gold', bg: 'bg-yellow-500/10' },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="card text-center">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}>
                    <Icon size={20} className={color} />
                  </div>
                  <h3 className="font-bold text-zinc-200 mb-1">{title}</h3>
                  <p className="text-sm text-zinc-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 border-t border-dark-600">
          <div className="page-container max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <HelpCircle size={22} className="text-brand-400" />
              <h2 className="text-2xl font-bold text-zinc-100">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {FAQS.map(({ q, a }) => (
                <details key={q} className="group card cursor-pointer select-none">
                  <summary className="font-semibold text-zinc-200 text-sm list-none flex items-center justify-between gap-4">
                    {q}
                    <span className="text-zinc-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed border-t border-dark-600 pt-3">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
