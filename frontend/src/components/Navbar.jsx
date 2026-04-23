import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { ShoppingCart, LogOut, User, Hotel, ShieldCheck } from './ui-icons'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const displayName = user?.displayName || user?.email || user?.name || user?.Email || 'Guest'
  const isAdmin = user?.role === 'Admin'

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl shadow-sm">
      <nav className="container py-4">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-3 group">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition">
              <Hotel className="h-6 w-6" />
            </span>
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900">StayEasy</div>
              <div className="text-xs text-slate-500">Modern hotel booking</div>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="btn-secondary px-4 py-2.5 text-sm">
                    <ShieldCheck className="h-4 w-4" />
                    Admin dashboard
                  </Link>
                )}

                <Link
                  to="/cart"
                  className="relative inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-slate-700 hover:border-blue-200 hover:text-blue-700 transition"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div className="hidden md:flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="max-w-[180px] truncate">{displayName}</span>
                  {isAdmin && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">Admin</span>
                  )}
                </div>

                <button onClick={handleLogout} className="btn-secondary px-4 py-2.5 text-sm">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary px-4 py-2.5 text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary px-4 py-2.5 text-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
