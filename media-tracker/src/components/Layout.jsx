import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Film, Tv2, BookOpen, Settings,
  Clapperboard, Menu, X
} from 'lucide-react'
import { useState, useEffect } from 'react'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/movies', icon: Film, label: 'Movies' },
  { to: '/shows', icon: Tv2, label: 'TV Shows' },
  { to: '/books', icon: BookOpen, label: 'Books' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

function NavItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group
        ${isActive
          ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
        }`
      }
    >
      <Icon size={18} className="shrink-0" />
      <span>{label}</span>
    </NavLink>
  )
}

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  return (
    <div className="flex h-screen h-dvh overflow-hidden bg-[#0f0f1a]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/[0.06] bg-[#0d0d1f]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
            <Clapperboard size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white leading-none">Vaultlog</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Media Tracker</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(n => <NavItem key={n.to} {...n} />)}
        </nav>
        <div className="px-6 py-4 border-t border-white/[0.06]">
          <p className="text-[10px] text-gray-600 text-center">Track what you love</p>
        </div>
      </aside>

      {/* Mobile overlay sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 h-full bg-[#0d0d1f] border-r border-white/[0.06] flex flex-col animate-slide-up z-10">
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
                  <Clapperboard size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white leading-none">Vaultlog</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Media Tracker</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {NAV.map(n => <NavItem key={n.to} {...n} onClick={() => setSidebarOpen(false)} />)}
            </nav>
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-white/[0.06] bg-[#0d0d1f]/80 backdrop-blur-xl safe-top">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white p-1">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <Clapperboard size={12} className="text-white" />
            </div>
            <span className="font-bold text-white">Vaultlog</span>
          </div>
          <div className="w-8" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="page-enter">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden flex items-center border-t border-white/[0.06] bg-[#0d0d1f]/90 backdrop-blur-xl safe-bottom">
          {NAV.slice(0, 4).map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors duration-200
                ${isActive ? 'text-violet-400' : 'text-gray-500'}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-violet-600/20' : ''}`}>
                    <Icon size={18} />
                  </div>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors duration-200
              ${isActive ? 'text-violet-400' : 'text-gray-500'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-violet-600/20' : ''}`}>
                  <Settings size={18} />
                </div>
                <span>Settings</span>
              </>
            )}
          </NavLink>
        </nav>
      </div>
    </div>
  )
}
