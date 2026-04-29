import React, { useEffect, useState } from 'react'
import { bookingService } from '../services/bookingService'
import { hotelService } from '../services/hotelService'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'
import RatingStars from '../components/RatingStars'
import { ReceiptText, CalendarDays, CheckCircle2, RefreshCw } from '../components/ui-icons'

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [ratingHotelId, setRatingHotelId] = useState(null)
  const [ratingLoading, setRatingLoading] = useState({})
  const [success, setSuccess] = useState('')

  const getId = (booking) => booking?.id || booking?.Id
  const getAmount = (booking) => Number(booking?.totalAmount || booking?.TotalAmount || 0)
  const getStatus = (booking) => booking?.status || booking?.Status || 'Pending'
  const getCreatedAt = (booking) => booking?.createdAt || booking?.CreatedAt

  const loadBookings = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await bookingService.getUserBookings()
      setBookings(Array.isArray(result) ? result : result?.$values || [])
    } catch (err) {
      setError(err.message || 'Failed to load booking history')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRating = async (hotelId, ratingValue) => {
    setRatingLoading((prev) => ({ ...prev, [hotelId]: true }))
    try {
      await hotelService.submitRating(hotelId, ratingValue)
      setSuccess(`Thank you! You rated this hotel ${ratingValue} star${ratingValue !== 1 ? 's' : ''}.`)
      setRatingHotelId(null)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to submit rating. Please try again.')
      console.error(err)
    } finally {
      setRatingLoading((prev) => ({ ...prev, [hotelId]: false }))
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-section">
      <div className="container">
        <section className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-6 py-10 text-white shadow-2xl shadow-blue-950/20 sm:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100">
                <ReceiptText className="h-4 w-4" />
                Booking history
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">My bookings</h1>
              <p className="mt-2 text-blue-100">Track your previous and active bookings in one place.</p>
            </div>
            <button
              type="button"
              onClick={loadBookings}
              className="btn-secondary bg-white/95 text-slate-900 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </section>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {bookings.length === 0 ? (
          <div className="card py-16 text-center">
            <ReceiptText className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">No bookings yet</h2>
            <p className="mt-2 text-slate-600">Your confirmed bookings will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {bookings.map((booking) => {
              const status = getStatus(booking)
              const statusStyle =
                status.toLowerCase() === 'confirmed'
                  ? 'bg-emerald-100 text-emerald-700'
                  : status.toLowerCase() === 'cancelled'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-700'
              const hotelId = booking?.hotelId || booking?.HotelId
              const hotelName = booking?.hotelName || booking?.HotelName || 'Hotel'
              const isRatingOpen = ratingHotelId === hotelId

              return (
                <div
                  key={getId(booking)}
                  className="card overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-500">Booking ID</p>
                        <p className="text-xl font-black text-slate-900">#{getId(booking)}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}>
                        {status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 px-4 py-3 transition-all duration-200 hover:bg-slate-100">
                        <p className="text-xs uppercase tracking-wider text-slate-500">Total amount</p>
                        <p className="mt-1 text-lg font-bold text-blue-600">
                          ${getAmount(booking).toFixed(2)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 px-4 py-3 transition-all duration-200 hover:bg-slate-100">
                        <p className="text-xs uppercase tracking-wider text-slate-500">Booked on</p>
                        <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-slate-900">
                          <CalendarDays className="h-4 w-4" />
                          {getCreatedAt(booking)
                            ? new Date(getCreatedAt(booking)).toLocaleDateString()
                            : '—'}
                        </p>
                      </div>
                    </div>

                    {status.toLowerCase() === 'confirmed' && (
                      <div className="mt-5 border-t border-slate-200 pt-5">
                        {!isRatingOpen ? (
                          <button
                            onClick={() => setRatingHotelId(hotelId)}
                            className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition-all duration-200 hover:bg-amber-100 hover:shadow-md active:scale-95"
                          >
                            ⭐ Rate {hotelName}
                          </button>
                        ) : (
                          <div className="space-y-3 rounded-lg bg-amber-50 p-4">
                            <p className="text-sm font-semibold text-slate-700">
                              How would you rate {hotelName}?
                            </p>
                            <RatingStars
                              rating={0}
                              onRate={(ratingValue) => handleSubmitRating(hotelId, ratingValue)}
                              interactive={true}
                              size="lg"
                              showValue={false}
                              readOnly={ratingLoading[hotelId] || false}
                            />
                            <button
                              onClick={() => setRatingHotelId(null)}
                              className="mt-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-4 inline-flex items-center gap-1 text-sm text-slate-500">
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      Keep this booking ID for support requests.
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookingsPage
