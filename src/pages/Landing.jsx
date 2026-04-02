import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PricingSection from '../components/PricingSection'
import {
  Sparkles, Play, Zap, Shield, Clock, Star,
  ArrowRight, CheckCircle, Film, Clapperboard,
  TrendingUp, Users, Award, ChevronRight
} from 'lucide-react'

const STYLE_PRESETS = [
  {
    name: 'Bollywood Drama',
    emoji: '🎬',
    desc: 'Cinematic emotions, vibrant colors, dramatic angles',
    gradient: 'from-orange-500/20 to-pink-500/20',
    border: 'border-orange-500/30',
    tag: 'Most Popular',
    tagColor: 'bg-orange-500/20 text-orange-300',
  },
  {
    name: 'Viral Reels',
    emoji: '🔥',
    desc: 'Fast cuts, trending hooks, Instagram & YouTube Shorts ready',
    gradient: 'from-red-500/20 to-orange-500/20',
    border: 'border-red-500/30',
    tag: 'Trending',
    tagColor: 'bg-red-500/20 text-red-300',
  },
  {
    name: 'Cinematic',
    emoji: '🎥',
    desc: 'Film-grade visuals, depth of field, rich color grading',
    gradient: 'from-brand-500/20 to-purple-500/20',
    border: 'border-brand-500/30',
    tag: 'Premium',
    tagColor: 'bg-brand-500/20 text-brand-300',
  },
  {
    name: 'UGC Ads',
    emoji: '📱',
    desc: 'Authentic, performance-driven creative for D2C brands',
    gradient: 'from-green-500/20 to-teal-500/20',
    border: 'border-green-500/30',
    tag: 'New',
    tagColor: 'bg-green-500/20 text-green-300',
  },
]

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Bharat-First Presets',
    desc: 'Trained on Bollywood aesthetics, regional vibes, and Indian content trends — not just Hollywood.',
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
  },
  {
    icon: Zap,
    title: 'Generate in Seconds',
    desc: 'From prompt to polished video in under 60 seconds. No render farms, no waiting.',
    color: 'text-accent-gold',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Clock,
    title: '15s to 2min Clips',
    desc: 'Perfect for Instagram Reels, YouTube Shorts, OTT teasers, and ad creatives.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    icon: Shield,
    title: 'Commercial License',
    desc: 'Full commercial rights on every video you generate. Use in ads, films, campaigns.',
    color: 'text-accent-pink',
    bg: 'bg-pink-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Multi-Platform Export',
    desc: '9:16 for Reels, 16:9 for YouTube, 1:1 for feeds. Export in one click.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Users,
    title: 'Team Workspaces',
    desc: 'Invite your team, share credits, manage brand presets. Built for agencies too.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
]

const SHOWCASE = [
  { label: 'Bollywood Action Scene', style: 'Bollywood', prompt: 'A hero in slow motion, golden hour, dramatic music...', thumb: 'bg-gradient-to-br from-orange-900/60 to-red-900/60' },
  { label: 'Product Launch Reel', style: 'UGC Ad', prompt: 'Unboxing a premium skincare product, soft lighting...', thumb: 'bg-gradient-to-br from-pink-900/60 to-purple-900/60' },
  { label: 'Cinematic Landscape', style: 'Cinematic', prompt: 'Sunrise over Himalayan peaks, golden mist, birds...', thumb: 'bg-gradient-to-br from-blue-900/60 to-indigo-900/60' },
  { label: 'Dance Reel Intro', style: 'Reels', prompt: 'Energetic Bhangra opening, colorful outfit, quick cuts...', thumb: 'bg-gradient-to-br from-green-900/60 to-teal-900/60' },
  { label: 'Wedding Teaser', style: 'Bollywood', prompt: 'Bride & groom, fairy lights, slow zoom, ethnic wear...', thumb: 'bg-gradient-to-br from-amber-900/60 to-orange-900/60' },
  { label: 'Fashion Ad', style: 'UGC Ad', prompt: 'Model walking in slow motion, urban setting, outfit reveal...', thumb: 'bg-gradient-to-br from-violet-900/60 to-pink-900/60' },
]

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    handle: '@priya.creates',
    role: 'Content Creator · Mumbai',
    avatar: 'PS',
    color: 'from-pink-500 to-rose-600',
    text: 'Vidfield changed my workflow completely. I was spending ₹50,000/shoot on Bollywood-style reels. Now I generate better content in 2 minutes. 10/10 product.'
  },
  {
    name: 'Arjun Mehta',
    handle: '@arjunads',
    role: 'Performance Marketer · Delhi',
    avatar: 'AM',
    color: 'from-brand-500 to-purple-600',
    text: 'Running D2C ads for 12 brands. The UGC Ad preset is insane — CTR went up 3x. Best ₹799 I spend every month by far.'
  },
  {
    name: 'Kavita Nair',
    handle: '@kavita.films',
    role: 'Indie Filmmaker · Bengaluru',
    avatar: 'KN',
    color: 'from-green-500 to-teal-600',
    text: 'Used Vidfield for a short film pitch deck. The cinematic preset produced reference visuals that impressed the producer. Exceptional quality for the price.'
  },
]

const STATS = [
  { label: 'Videos Generated', value: '2.4M+', icon: Film },
  { label: 'Indian Creators', value: '18,000+', icon: Users },
  { label: 'Avg. Generation Time', value: '45 sec', icon: Clock },
  { label: 'Platform Rating', value: '4.9 / 5', icon: Star },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background glow */}
        <div className="hero-glow" />
        <div className="absolute inset-0 star-field opacity-30 pointer-events-none" />

        <div className="page-container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8">
              <Sparkles size={14} className="animate-pulse" />
              AI Video Generation Built for Bharat
              <span className="text-lg">🇮🇳</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-zinc-100 leading-tight mb-6 tracking-tight">
              Create{' '}
              <span className="gradient-text">Bollywood-Grade</span>
              <br />
              Videos with AI
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Type a prompt. Pick a style. Get a cinematic video in seconds.
              Built for Indian content creators, filmmakers & brands.{' '}
              <span className="text-zinc-300 font-medium">Starting at just ₹299/month.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/signup" className="btn-primary flex items-center gap-2 justify-center text-base px-8 py-4">
                Start Creating Free
                <ArrowRight size={18} />
              </Link>
              <a href="#showcase" className="btn-secondary flex items-center gap-2 justify-center text-base px-8 py-4">
                <Play size={16} className="text-brand-400" />
                Watch Examples
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" />No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" />10 free credits on signup</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" />Cancel anytime</span>
            </div>
          </div>

          {/* Hero visual — prompt demo card */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="gradient-border p-0.5 rounded-2xl shadow-2xl shadow-brand-950">
              <div className="bg-dark-800 rounded-2xl overflow-hidden">
                {/* Fake browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-dark-600 bg-dark-700">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="flex-1 mx-4 bg-dark-800 rounded-md px-3 py-1 text-xs text-zinc-600">
                    app.vidfield.in/dashboard
                  </div>
                </div>
                {/* Dashboard preview */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-sm text-zinc-500">Style:</div>
                    {['Bollywood', 'Cinematic', 'Reels', 'UGC Ad'].map((s, i) => (
                      <span key={s} className={`badge ${i === 0 ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'bg-dark-700 text-zinc-500 border border-dark-500'}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="bg-dark-900 rounded-xl p-4 text-sm text-zinc-400 border border-dark-600 mb-4 leading-relaxed">
                    <span className="text-brand-400">→</span> A Bollywood actress walks in slow motion through a monsoon rain, her dupatta flowing, golden hour lighting, dramatic Bollywood music, cinematic depth of field...
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-dark-600 overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-brand-500 to-purple-500 rounded-full animate-pulse" />
                    </div>
                    <span className="text-xs text-zinc-500">Generating · 38s</span>
                  </div>
                  <div className="mt-4 aspect-video rounded-xl bg-gradient-to-br from-orange-900/40 to-pink-900/40 border border-dark-600 flex items-center justify-center">
                    <div className="text-center">
                      <Film size={32} className="text-zinc-600 mx-auto mb-2" />
                      <p className="text-xs text-zinc-600">Preview generating...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-dark-600">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon size={20} className="text-brand-400 mx-auto mb-2" />
                <div className="text-3xl font-black text-zinc-100 mb-1">{value}</div>
                <div className="text-sm text-zinc-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STYLE PRESETS ──────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="page-container">
          <div className="text-center mb-16">
            <div className="badge bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-4 mx-auto">
              <Clapperboard size={13} />
              Style Presets
            </div>
            <h2 className="section-heading mb-4">
              Made for <span className="gradient-text">Indian Content</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Four presets trained on Indian aesthetics. From Bollywood blockbusters to viral UGC.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STYLE_PRESETS.map((preset) => (
              <div key={preset.name} className={`card bg-gradient-to-br ${preset.gradient} border ${preset.border} relative group hover:scale-105 transition-transform duration-200`}>
                {preset.tag && (
                  <span className={`badge ${preset.tagColor} absolute top-4 right-4 text-xs`}>
                    {preset.tag}
                  </span>
                )}
                <div className="text-4xl mb-4">{preset.emoji}</div>
                <h3 className="font-bold text-zinc-100 mb-2">{preset.name}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{preset.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section className="py-24 bg-dark-800/40">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">
              Everything You Need to <span className="gradient-text">Create & Scale</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="card group hover:border-dark-400 transition-all">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className="font-bold text-zinc-100 mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWCASE ───────────────────────────────────────────────── */}
      <section id="showcase" className="py-24">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">
              Real Videos, <span className="gradient-text">Real Prompts</span>
            </h2>
            <p className="text-zinc-400 text-lg">All generated with Vidfield. No post-production.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SHOWCASE.map((item) => (
              <div key={item.label} className="group cursor-pointer">
                <div className={`aspect-video rounded-2xl ${item.thumb} border border-dark-600 group-hover:border-dark-400 transition-all relative overflow-hidden flex items-end p-4`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={20} className="text-white ml-1" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <span className="badge bg-black/50 backdrop-blur-sm text-zinc-300 text-xs border border-white/10 mb-1">
                      {item.style}
                    </span>
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <p className="font-medium text-zinc-200 text-sm">{item.label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">"{item.prompt}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────── */}
      <section className="py-24 bg-dark-800/40">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">
              Loved by <span className="gradient-text">Indian Creators</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card group hover:border-dark-400">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-accent-gold fill-accent-gold" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold text-white`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────── */}
      <section id="pricing">
        <PricingSection />
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="gradient-border p-px rounded-3xl">
              <div className="bg-dark-800 rounded-3xl px-8 py-16">
                <Award size={40} className="text-brand-400 mx-auto mb-6" />
                <h2 className="text-4xl font-black text-zinc-100 mb-4">
                  Start Creating Today
                </h2>
                <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                  Join 18,000+ Indian creators already using Vidfield.
                  10 free credits. No card needed.
                </p>
                <Link to="/signup" className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2">
                  Create Free Account
                  <ChevronRight size={18} />
                </Link>
                <p className="text-xs text-zinc-600 mt-4">
                  By signing up you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
