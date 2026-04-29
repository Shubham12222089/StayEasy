import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { ShoppingCart, LogOut, User, Hotel, ShieldCheck, ReceiptText } from './ui-icons'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/')
    } finally {
      setLoggingOut(false)
    }
  }

  const displayName = user?.displayName || user?.firstName || user?.email || 'Guest'
  const isAdmin = user?.role === 'Admin'
  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl shadow-sm">
      <nav className="container py-3">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          {/* Logo */}
          <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-3 group">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 group-hover:scale-110 group-hover:shadow-blue-500/40 transition-all duration-300">
              <Hotel className="h-6 w-6" />
            </span>
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors duration-200">StayEasy</div>
              <div className="text-[11px] font-medium text-slate-400 tracking-wide">Premium hotel booking</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      isActive('/admin')
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/"
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        isActive('/')
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Hotel className="h-4 w-4" />
                      Hotels
                    </Link>
                    <Link
                      to="/my-bookings"
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        isActive('/my-bookings')
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <ReceiptText className="h-4 w-4" />
                      My bookings
                    </Link>
                  </>
                )}

                {/* Divider */}
                <div className="h-8 w-px bg-slate-200 mx-1" />

                {/* Cart */}
                <Link
                  to="/cart"
                  className={`relative inline-flex h-11 items-center justify-center rounded-xl border px-4 transition-all duration-200 hover:scale-105 ${
                    isActive('/cart')
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700'
                  }`}
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-1 text-[11px] font-bold text-white shadow-lg shadow-rose-500/30 animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* User profile badge */}
                <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 px-4 py-2.5 border border-slate-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm font-bold shadow-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900 max-w-[140px] truncate leading-tight">
                      {displayName}
                    </span>
                    {isAdmin && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Admin</span>
                    )}
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 active:scale-95"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary px-5 py-2.5 text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105 transition-all duration-200 active:scale-95"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center h-11 w-11 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl bg-white p-4 shadow-lg border border-slate-100 animate-fade-in space-y-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 p-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-lg font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{displayName}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>

                {isAdmin ? (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                    <ShieldCheck className="h-4 w-4" /> Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                      <Hotel className="h-4 w-4" /> Hotels
                    </Link>
                    <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                      <ReceiptText className="h-4 w-4" /> My bookings
                    </Link>
                  </>
                )}

                <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                  <span className="flex items-center gap-3"><ShoppingCart className="h-4 w-4" /> Cart</span>
                  {cartCount > 0 && (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white">{cartCount}</span>
                  )}
                </Link>

                <div className="border-t border-slate-100 pt-2 mt-2">
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false) }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 text-center transition">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block btn-primary text-center py-3">
                  Get started
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
