import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Film, LayoutDashboard, History, Settings, LogOut,
  Zap, ChevronRight, CreditCard
} from 'lucide-react'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Generate' },
  { to: '/history',   icon: History,         label: 'History' },
  { to: '/settings',  icon: Settings,        label: 'Settings' },
]

export default function DashboardLayout({ children }) {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    toast.success('Signed out')
  }

  const planColors = {
    free:    'text-zinc-400',
    starter: 'text-green-400',
    creator: 'text-brand-400',
    pro:     'text-accent-gold',
  }
  const planColor = planColors[profile?.plan] || 'text-zinc-400'

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-dark-600 bg-dark-800 py-6">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 px-6 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Film size={15} className="text-white" />
          </div>
          <span className="text-lg font-bold text-zinc-100">
            Vid<span className="text-brand-400">field</span>
          </span>
        </NavLink>

        {/* User card */}
        <div className="mx-4 mb-6 p-3 rounded-xl bg-dark-700 border border-dark-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {(user?.email?.[0] ?? 'U').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-zinc-200 truncate">{user?.email}</p>
              <p className={`text-xs capitalize font-medium ${planColor}`}>
                {profile?.plan ?? 'free'} plan
              </p>
            </div>
          </div>
          {/* Credits */}
          <div className="mt-3 flex items-center justify-between px-2 py-2 rounded-lg bg-dark-800 border border-dark-600">
            <div className="flex items-center gap-1.5">
              <Zap size={12} className="text-accent-gold" />
              <span className="text-xs text-zinc-400">Credits</span>
            </div>
            <span className="text-sm font-bold text-zinc-200">{profile?.credits ?? 0}</span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-dark-700'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 mt-4 space-y-1 border-t border-dark-600 pt-4">
          <NavLink
            to="/pricing"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-dark-700 transition-all"
          >
            <CreditCard size={17} />
            Upgrade Plan
            <ChevronRight size={13} className="ml-auto text-zinc-600" />
          </NavLink>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-dark-600 bg-dark-800">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Film size={13} className="text-white" />
            </div>
            <span className="font-bold text-zinc-100 text-sm">Vid<span className="text-brand-400">field</span></span>
          </NavLink>
          <div className="flex items-center gap-2">
            {NAV.map(({ to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  `p-2 rounded-lg transition-all ${isActive ? 'bg-brand-500/15 text-brand-300' : 'text-zinc-500 hover:text-zinc-300'}`
                }
              >
                <Icon size={18} />
              </NavLink>
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
