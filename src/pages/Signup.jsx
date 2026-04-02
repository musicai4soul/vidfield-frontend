import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Film, Mail, Lock, Eye, EyeOff, ArrowRight, User, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const PERKS = [
  '10 free video credits on signup',
  'All 4 style presets unlocked',
  'No credit card required',
  'Cancel or upgrade anytime',
]

export default function Signup() {
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [done, setDone]         = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password || !confirm) return toast.error('Please fill all fields')
    if (password.length < 8) return toast.error('Password must be at least 8 characters')
    if (password !== confirm) return toast.error('Passwords do not match')

    setLoading(true)
    try {
      const { error } = await signUp(email, password)
      if (error) throw error
      setDone(true)
    } catch (err) {
      toast.error(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed.')
      setGoogleLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-zinc-100 mb-3">Check your inbox!</h1>
          <p className="text-zinc-400 mb-6 leading-relaxed">
            We've sent a confirmation link to <span className="text-zinc-200 font-medium">{email}</span>.
            Click it to activate your account and claim your 10 free credits.
          </p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2">
            Go to Login <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left: Decorative panel */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-dark-900 via-dark-800 to-brand-950 items-center justify-center p-16 border-r border-dark-600">
        <div className="absolute inset-0 star-field opacity-20" />
        <div className="relative z-10 max-w-sm">
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Film size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-100">
              Vid<span className="text-brand-400">field</span>
            </span>
          </Link>
          <h2 className="text-3xl font-black text-zinc-100 mb-4 leading-tight">
            Start creating viral videos today
          </h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            No camera. No team. No editing skills. Just type a prompt and get a Bollywood-grade video in seconds.
          </p>
          <ul className="space-y-3">
            {PERKS.map(p => (
              <li key={p} className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle size={16} className="text-green-400 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
          {/* Social proof */}
          <div className="mt-10 flex items-center gap-3 p-4 rounded-xl bg-dark-700/50 border border-dark-600">
            <div className="flex -space-x-2">
              {['PS', 'AM', 'KN', 'RV'].map((a, i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-dark-800 bg-gradient-to-br ${
                  ['from-pink-500 to-rose-600', 'from-brand-500 to-purple-600',
                   'from-green-500 to-teal-600', 'from-orange-500 to-amber-600'][i]
                } flex items-center justify-center text-xs font-bold text-white`}>
                  {a}
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300">18,000+ creators</span> already use Vidfield
            </p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-10 group w-fit lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Film size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-100">
              Vid<span className="text-brand-400">field</span>
            </span>
          </Link>

          <h1 className="text-3xl font-black text-zinc-100 mb-2">Create your account</h1>
          <p className="text-zinc-400 mb-8">Get 10 free credits — no card required</p>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-dark-700 hover:bg-dark-600 border border-dark-500 hover:border-dark-400 text-zinc-200 font-semibold px-6 py-3.5 rounded-xl transition-all mb-6 disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-dark-600" />
            <span className="text-xs text-zinc-600">or sign up with email</span>
            <div className="flex-1 h-px bg-dark-600" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-10"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="input pl-10 pr-11"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className="input pl-10"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Free Account <ArrowRight size={16} /></>
              )}
            </button>

            <p className="text-xs text-zinc-600 text-center">
              By signing up you agree to our{' '}
              <a href="#" className="text-zinc-500 hover:text-zinc-300">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-zinc-500 hover:text-zinc-300">Privacy Policy</a>.
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
