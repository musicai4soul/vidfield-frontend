import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Menu, X, ChevronDown, Film } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    toast.success('Signed out successfully')
  }

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Showcase', href: '/#showcase' },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-dark-600/60 bg-dark-900/80 backdrop-blur-xl">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-900/50 group-hover:shadow-brand-700/50 transition-all">
              <Film size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-zinc-100">
              Vid<span className="text-brand-400">field</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-dark-700 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA / User menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Credits badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-500">
                  <Zap size={13} className="text-accent-gold" />
                  <span className="text-xs font-semibold text-zinc-300">
                    {profile?.credits ?? '—'} credits
                  </span>
                </div>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-500 hover:border-dark-400 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                      {(user.email?.[0] ?? 'U').toUpperCase()}
                    </div>
                    <span className="text-sm text-zinc-300 max-w-[120px] truncate">
                      {user.email}
                    </span>
                    <ChevronDown size={14} className="text-zinc-500" />
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-dark-700 border border-dark-500 rounded-xl shadow-2xl py-1.5 z-50">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-dark-600 transition-all"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/history"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-dark-600 transition-all"
                      >
                        Video History
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-dark-600 transition-all"
                      >
                        Settings
                      </Link>
                      <div className="border-t border-dark-500 my-1" />
                      <button
                        onClick={() => { handleSignOut(); setDropOpen(false) }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-dark-600 transition-all"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary !py-2 !px-5 text-sm">
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary !py-2 !px-5 text-sm">
                  Start Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-dark-600 bg-dark-900 px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-dark-700 transition-all"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-dark-600 flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-secondary text-center text-sm">Dashboard</Link>
                <button onClick={handleSignOut} className="text-red-400 py-2 text-sm">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary text-center text-sm">Log In</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary text-center text-sm">Start Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
