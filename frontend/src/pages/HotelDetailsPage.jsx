import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import RoomCard from '../components/RoomCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'
import RatingStars from '../components/RatingStars'
import { hotelService } from '../services/hotelService'
import { useCart } from '../context/CartContext'
import { MapPin, Star, Phone, MapPinned, ArrowLeft, CheckCircle2 } from '../components/ui-icons'
import { useAuth } from '../context/AuthContext'

const HotelDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [addingToCart, setAddingToCart] = useState({})
  const [success, setSuccess] = useState('')
  const [ratingLoading, setRatingLoading] = useState(false)

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

  const totalAvailableRooms = useMemo(() => {
    // First try to sum from individual rooms
    const roomsSum = rooms.reduce((sum, room) => {
      const available = Number(
        room.availableCount ||
        room.AvailableCount ||
        room.availableRooms || 
        room.AvailableRooms || 
        room.available_rooms ||
        room.totalRooms ||
        room.TotalRooms ||
        0
      )
      return sum + available
    }, 0)
    
    // If rooms sum is available, return it
    if (roomsSum > 0) {
      return roomsSum
    }
    
    // Fallback to hotel's available rooms field - try multiple variations
    const hotelAvailable = Number(
      hotel?.availableRooms || 
      hotel?.AvailableRooms || 
      hotel?.available_rooms ||
      hotel?.totalRooms ||
      hotel?.TotalRooms ||
      hotel?.availableRoomsCount ||
      0
    )
    
    console.log('Debug - Hotel:', { 
      hotelId: hotel?.id, 
      hotelAvailable,
      hotelKeys: hotel ? Object.keys(hotel) : [],
      roomsCount: rooms.length,
      roomsSample: rooms[0]
    })
    
    return hotelAvailable
  }, [rooms, hotel])

  const handleAddToCart = async (room) => {
    if (!isAuthenticated) {
      setError('Please log in to add rooms to your cart')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
      return
    }

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
      const roomName = room.name || room.Name || room.type || room.Type || room.roomType || 'Room'
      const roomData = {
        ...room,
        hotelId: hotel.id,
        hotelName: hotel.name,
        name: roomName,
        price: room.pricePerNight ?? room.price ?? room.Price ?? 0
      }
      addToCart(roomData, checkInDate, checkOutDate)
      setSuccess(`${roomName} added to cart`)
      window.setTimeout(() => setSuccess(''), 2500)
    } catch {
      setError('Failed to add room to cart')
    } finally {
      setAddingToCart((prev) => ({ ...prev, [room.id]: false }))
    }
  }

  const handleSubmitRating = async (ratingValue) => {
    if (!isAuthenticated) {
      setError('Please log in to submit a rating')
      return
    }

    setRatingLoading(true)
    try {
      await hotelService.submitRating(hotel.id, ratingValue)
      const updatedHotel = await hotelService.getHotelById(hotel.id)
      setHotel(updatedHotel)
      setSuccess('Thank you! Your rating has been submitted.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to submit rating. Please try again.')
      console.error(err)
    } finally {
      setRatingLoading(false)
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
                {totalAvailableRooms > 0 ? `${totalAvailableRooms} rooms available` : `${rooms.length} room type(s)`}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-700">Overall Rating</p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-4xl font-black text-amber-600">
                      {Number(hotel.averageRating || hotel.rating || hotel.Rating || 0) > 0
                        ? Number(hotel.averageRating || hotel.rating || hotel.Rating || 0).toFixed(1)
                        : 'N/A'}
                    </p>
                    <p className="mt-1 text-sm text-amber-700">Based on guest ratings</p>
                  </div>
                  {isAuthenticated && (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Rate this hotel</p>
                      <RatingStars
                        rating={0}
                        onRate={handleSubmitRating}
                        interactive={true}
                        size="lg"
                        showValue={false}
                        readOnly={ratingLoading}
                      />
                    </div>
                  )}
                </div>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{hotel.name}</h1>
              <div className="mt-4 flex items-center gap-2 text-slate-600">
                <MapPin className="h-5 w-5" />
                <p>{hotel.location || 'Location not specified'}</p>
              </div>
              <p className="mt-5 leading-7 text-slate-600">{hotel.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {hotel.phone && (
                  <div className="rounded-2xl bg-slate-50 p-4 transition-all duration-200 hover:shadow-md hover:bg-slate-100">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <Phone className="h-4 w-4" />
                      Contact
                    </div>
                    <div className="mt-1 font-semibold text-slate-900">{hotel.phone}</div>
                  </div>
                )}
                {hotel.address && (
                  <div className="rounded-2xl bg-slate-50 p-4 transition-all duration-200 hover:shadow-md hover:bg-slate-100">
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

        <div className="card mb-8 overflow-hidden border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="mb-4 flex items-center gap-2 text-slate-900">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h2 className="text-2xl font-bold">Select your dates</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="group">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Check-in date</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="input-field transition-all duration-200 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="group">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Check-out date</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="input-field transition-all duration-200 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Booking duration: <span className="inline-flex rounded-full bg-blue-200 px-3 py-1 font-bold text-blue-700">{nights} night(s)</span>
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Available rooms</h2>
            <p className="mt-1 text-slate-600">Select a room and add it to your cart</p>
          </div>
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
