import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, Download, Home, CalendarDays, ReceiptText } from '../components/ui-icons'

const BookingConfirmationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const booking = location.state?.booking

  if (!booking) {
    return (
      <div className="page-section">
        <div className="container">
          <div className="card mx-auto max-w-2xl p-8 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
            <h1 className="mt-4 text-3xl font-black text-slate-900">Booking confirmed</h1>
            <p className="mt-3 text-slate-600">
              Your booking was completed successfully. Return to the home page to make another reservation.
            </p>
            <button onClick={() => navigate('/')} className="btn-primary mt-6">
              <Home className="h-4 w-4" />
              Back to home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const total = booking.total || booking.subtotal * 1.1

  return (
    <div className="page-section">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-600 via-blue-600 to-indigo-700 px-6 py-10 text-white sm:px-10">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="h-16 w-16 text-emerald-200" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">StayEasy</p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Booking confirmed</h1>
                  <p className="mt-2 max-w-2xl text-blue-100">A confirmation has been generated for your reservation.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Guest</p>
                    <p className="mt-2 font-bold text-slate-900">{booking.guestName}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</p>
                    <p className="mt-2 font-bold text-slate-900">{booking.guestEmail}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Booked on</p>
                    <p className="mt-2 font-bold text-slate-900">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <ReceiptText className="h-5 w-5 text-blue-600" />
                    <h2 className="text-2xl font-bold text-slate-900">Reserved rooms</h2>
                  </div>

                  <div className="space-y-4">
                    {booking.items.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">{item.roomName}</h3>
                            <p className="text-sm text-slate-500">{item.hotelName}</p>
                            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                                <CalendarDays className="h-4 w-4" />
                                {new Date(item.checkInDate).toLocaleDateString()} → {new Date(item.checkOutDate).toLocaleDateString()}
                              </span>
                              <span className="rounded-full bg-slate-100 px-3 py-1">{item.quantity} room(s)</span>
                              <span className="rounded-full bg-slate-100 px-3 py-1">{item.nights} night(s)</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-wider text-slate-500">Price</p>
                            <p className="text-2xl font-black text-blue-600">${item.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="card h-fit p-6 lg:sticky lg:top-24">
                <h2 className="text-2xl font-bold text-slate-900">Receipt summary</h2>
                <div className="mt-6 space-y-3 border-b border-slate-100 pb-6 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-semibold text-slate-900">${booking.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Taxes & fees</span><span className="font-semibold text-slate-900">${(total - booking.subtotal).toFixed(2)}</span></div>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <span className="text-lg font-bold text-slate-900">Total paid</span>
                  <span className="text-3xl font-black text-blue-600">${total.toFixed(2)}</span>
                </div>
                <button onClick={() => window.print()} className="btn-secondary mt-6 w-full">
                  <Download className="h-4 w-4" />
                  Download receipt
                </button>
                <button onClick={() => navigate('/')} className="btn-primary mt-3 w-full">
                  <Home className="h-4 w-4" />
                  Back to home
                </button>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmationPage
