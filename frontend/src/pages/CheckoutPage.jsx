import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { bookingService } from '../services/bookingService'
import Alert from '../components/Alert'
import LoadingSpinner from '../components/LoadingSpinner'
import { CreditCard, User, ReceiptText, ShieldCheck } from '../components/ui-icons'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cart, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  })

  if (cart.length === 0) {
    return (
      <div className="container py-12">
        <Alert type="error" message="Your cart is empty. Please add items before checkout." />
        <button onClick={() => navigate('/')} className="btn-primary mt-4">Continue shopping</button>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all contact information')
      return false
    }

    if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVC) {
      setError('Please fill in all payment information')
      return false
    }

    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setLoading(true)
    try {
      for (const item of cart) {
        await bookingService.addToCart(item.roomId, item.quantity)
      }

      await bookingService.checkout()

      const bookingSummary = {
        guestName: `${formData.firstName} ${formData.lastName}`,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        items: cart,
        subtotal: getTotalPrice(),
        total: getTotalPrice() * 1.1,
        createdAt: new Date().toISOString()
      }

      clearCart()
      setSuccess('Booking confirmed! Redirecting...')
      window.setTimeout(() => {
        navigate('/booking-confirmation', { state: { booking: bookingSummary } })
      }, 1200)
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const subtotal = getTotalPrice()
  const taxes = subtotal * 0.1
  const total = subtotal + taxes

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-section">
      <div className="container">
        <div className="mb-8 rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-6 py-8 text-white sm:px-8">
          <div className="flex items-center gap-3">
            <ReceiptText className="h-7 w-7 text-blue-200" />
            <div>
              <h1 className="text-3xl font-black tracking-tight">Checkout</h1>
              <p className="mt-1 text-blue-100">Complete your booking securely in a few steps.</p>
            </div>
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="card p-6">
                <div className="mb-6 flex items-center gap-2">
                  <User className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Contact information</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" className="input-field" required />
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" className="input-field" required />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" className="input-field sm:col-span-2" required />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" className="input-field sm:col-span-2" required />
                </div>
              </div>

              <div className="card p-6">
                <div className="mb-6 flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Payment information</h2>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '')
                      const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim()
                      handleChange({ target: { name: 'cardNumber', value: formattedValue } })
                    }}
                    placeholder="Card number"
                    maxLength="19"
                    className="input-field"
                    required
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        const formattedValue = value.length >= 3 ? value.replace(/(\d{2})(\d{1,2})/, '$1/$2') : value
                        handleChange({ target: { name: 'cardExpiry', value: formattedValue } })
                      }}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="input-field"
                      required
                    />
                    <input
                      type="text"
                      name="cardCVC"
                      value={formData.cardCVC}
                      onChange={(e) => handleChange({ target: { name: 'cardCVC', value: e.target.value.replace(/\D/g, '').slice(0, 3) } })}
                      placeholder="CVC"
                      maxLength="3"
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg disabled:opacity-60">
                <ShieldCheck className="h-5 w-5" />
                {loading ? 'Processing...' : `Complete booking • $${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          <aside className="card h-fit p-6 lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold text-slate-900">Order summary</h2>
            <div className="mt-6 space-y-4 border-b border-slate-100 pb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">{item.roomName}</p>
                    <p className="text-slate-500">{item.hotelName}</p>
                    <p className="text-slate-500">{item.nights} night(s) × {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-900">${item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Taxes & fees</span><span className="font-semibold text-slate-900">${taxes.toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-slate-100 pt-4 text-base"><span className="font-bold text-slate-900">Total</span><span className="font-black text-blue-600">${total.toFixed(2)}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
