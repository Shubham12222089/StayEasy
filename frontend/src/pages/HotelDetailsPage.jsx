import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import RoomCard from '../components/RoomCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'
import { hotelService } from '../services/hotelService'
import { useCart } from '../context/CartContext'
import { MapPin, Star, Phone, MapPinned, ArrowLeft, CheckCircle2 } from '../components/ui-icons'

const HotelDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [addingToCart, setAddingToCart] = useState({})
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchHotelDetails()
  }, [id])

  useEffect(() => {
    const checkIn = new Date()
    checkIn.setDate(checkIn.getDate() + 1)
    const checkOut = new Date()
    checkOut.setDate(checkOut.getDate() + 2)
    setCheckInDate(checkIn.toISOString().split('T')[0])
    setCheckOutDate(checkOut.toISOString().split('T')[0])
  }, [])

  const fetchHotelDetails = async () => {
    setLoading(true)
    setError('')
    try {
      const [hotelData, roomData] = await Promise.all([
        hotelService.getHotelById(id),
        hotelService.getRoomsByHotelId(id)
      ])
      setHotel(hotelData)
      setRooms(Array.isArray(roomData) ? roomData : roomData?.$values || [])
    } catch (err) {
      setError('Failed to load hotel details. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0
    const start = new Date(checkInDate)
    const end = new Date(checkOutDate)
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
  }, [checkInDate, checkOutDate])

  const handleAddToCart = async (room) => {
    if (!checkInDate || !checkOutDate) {
      setError('Please select check-in and check-out dates')
      return
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setError('Check-out date must be after check-in date')
      return
    }

    setAddingToCart((prev) => ({ ...prev, [room.id]: true }))
    try {
      const roomData = {
        ...room,
        hotelId: hotel.id,
        hotelName: hotel.name,
        name: room.name || room.roomType || 'Room',
        price: room.pricePerNight ?? room.price ?? 0
      }
      addToCart(roomData, checkInDate, checkOutDate)
      setSuccess(`${room.name || 'Room'} added to cart`)
      window.setTimeout(() => setSuccess(''), 2500)
    } catch {
      setError('Failed to add room to cart')
    } finally {
      setAddingToCart((prev) => ({ ...prev, [room.id]: false }))
    }
  }

  if (loading) return <LoadingSpinner />

  if (!hotel) {
    return (
      <div className="container py-12">
        <Alert type="error" message={error || 'Hotel not found'} />
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          Back to hotels
        </button>
      </div>
    )
  }

  return (
    <div className="page-section">
      <div className="container">
        <button onClick={() => navigate('/')} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" />
          Back to hotels
        </button>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="card mb-8 overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[360px] bg-slate-900">
              {hotel.image ? (
                <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-[360px] items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-7xl text-white">
                  🏨
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 backdrop-blur">
                {rooms.length} rooms available
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2 text-amber-600">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-lg font-bold text-slate-900">{hotel.averageRating || 4.5}</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{hotel.name}</h1>
              <div className="mt-4 flex items-center gap-2 text-slate-600">
                <MapPin className="h-5 w-5" />
                <p>{hotel.location || 'Location not specified'}</p>
              </div>
              <p className="mt-5 leading-7 text-slate-600">{hotel.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {hotel.phone && (
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <Phone className="h-4 w-4" />
                      Contact
                    </div>
                    <div className="mt-1 font-semibold text-slate-900">{hotel.phone}</div>
                  </div>
                )}
                {hotel.address && (
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <MapPinned className="h-4 w-4" />
                      Address
                    </div>
                    <div className="mt-1 font-semibold text-slate-900">{hotel.address}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-8 p-6">
          <div className="mb-4 flex items-center gap-2 text-slate-900">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h2 className="text-2xl font-bold">Select dates</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Check-in</label>
              <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Check-out</label>
              <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="input-field" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">Booking duration: <span className="font-semibold text-slate-900">{nights} night(s)</span></p>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Available rooms</h2>
          <span className="text-sm text-slate-500">Choose a room and add it to your cart</span>
        </div>

        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onAddToCart={handleAddToCart}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                isAddingToCart={addingToCart[room.id] || false}
              />
            ))}
          </div>
        ) : (
          <div className="card py-16 text-center">
            <p className="text-slate-600">No rooms available right now.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HotelDetailsPage
