import React, { useEffect, useMemo, useState } from 'react'
import { adminService } from '../services/adminService'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'
import { Building2, Users, Hotel, CalendarDays, ShieldCheck, RefreshCw, Trash2, ReceiptText } from '../components/ui-icons'

const emptyHotelForm = {
  name: '',
  location: '',
  description: '',
  pricePerNight: '',
  availableRooms: '',
}

const emptyRoomForm = {
  hotelId: '',
  type: '',
  price: '',
  availableCount: '',
}

const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null)
  const [users, setUsers] = useState([])
  const [hotels, setHotels] = useState([])
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedHotelId, setSelectedHotelId] = useState('')
  const [hotelForm, setHotelForm] = useState(emptyHotelForm)
  const [hotelEditId, setHotelEditId] = useState(null)
  const [roomForm, setRoomForm] = useState(emptyRoomForm)
  const [roomEditId, setRoomEditId] = useState(null)
  const [bookingStatusDrafts, setBookingStatusDrafts] = useState({})

  const getId = (value) => value?.id || value?.Id
  const getHotelName = (hotel) => hotel?.name || hotel?.Name || 'Hotel'
  const getHotelLocation = (hotel) => hotel?.location || hotel?.Location || ''
  const getHotelPrice = (hotel) => Number(hotel?.pricePerNight || hotel?.PricePerNight || 0)
  const getHotelDescription = (hotel) => hotel?.description || hotel?.Description || ''
  const getHotelRooms = (hotel) => Number(hotel?.availableRooms || hotel?.AvailableRooms || 0)

  const getRoomType = (room) => room?.type || room?.Type || 'Room'
  const getRoomPrice = (room) => Number(room?.price || room?.Price || 0)
  const getRoomCount = (room) => Number(room?.availableCount || room?.AvailableCount || 0)

  const getUserName = (user) => `${user?.firstName || user?.FirstName || ''} ${user?.lastName || user?.LastName || ''}`.trim() || user?.email || user?.Email || 'User'
  const getUserEmail = (user) => user?.email || user?.Email || ''
  const getUserRole = (user) => user?.role || user?.Role || 'Guest'
  const getBookingStatus = (booking) => booking?.status || booking?.Status || 'Pending'
  const getBookingAmount = (booking) => Number(booking?.totalAmount || booking?.TotalAmount || 0)

  const loadAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [dash, userList, hotelList, bookingList] = await Promise.all([
        adminService.getDashboard(),
        adminService.getUsers(),
        adminService.getHotels(),
        adminService.getBookings(),
      ])

      setDashboard(dash)
      setUsers(Array.isArray(userList) ? userList : userList?.$values || [])
      const normalizedHotels = Array.isArray(hotelList) ? hotelList : hotelList?.$values || []
      const normalizedBookings = Array.isArray(bookingList) ? bookingList : bookingList?.$values || []
      setHotels(normalizedHotels)
      setBookings(normalizedBookings)
      setBookingStatusDrafts(
        Object.fromEntries(normalizedBookings.map((booking) => [getId(booking), getBookingStatus(booking)]))
      )

      if (!selectedHotelId && normalizedHotels.length > 0) {
        setSelectedHotelId(String(getId(normalizedHotels[0])))
      }
    } catch (err) {
      setError(err.message || 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const loadRooms = async (hotelId) => {
    if (!hotelId) {
      setRooms([])
      return
    }

    try {
      const roomList = await adminService.getRoomsByHotel(hotelId)
      setRooms(Array.isArray(roomList) ? roomList : roomList?.$values || [])
    } catch (err) {
      setError(err.message || 'Failed to load rooms')
      setRooms([])
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  useEffect(() => {
    if (selectedHotelId) {
      loadRooms(selectedHotelId)
      setRoomForm((prev) => ({ ...prev, hotelId: selectedHotelId }))
    }
  }, [selectedHotelId])

  const resetMessages = () => {
    setError('')
    setSuccess('')
  }

  const refreshAll = async () => {
    await loadAll()
    if (selectedHotelId) {
      await loadRooms(selectedHotelId)
    }
  }

  const handleHotelSubmit = async (e) => {
    e.preventDefault()
    resetMessages()
    setSaving(true)

    try {
      const payload = {
        name: hotelForm.name,
        location: hotelForm.location,
        description: hotelForm.description,
        pricePerNight: Number(hotelForm.pricePerNight),
        availableRooms: Number(hotelForm.availableRooms),
      }

      if (hotelEditId) {
        await adminService.updateHotel(hotelEditId, payload)
        setSuccess('Hotel updated successfully')
      } else {
        await adminService.addHotel(payload)
        setSuccess('Hotel added successfully')
      }

      setHotelEditId(null)
      setHotelForm(emptyHotelForm)
      await refreshAll()
    } catch (err) {
      setError(err.message || 'Failed to save hotel')
    } finally {
      setSaving(false)
    }
  }

  const handleHotelEdit = (hotel) => {
    setActiveTab('hotels')
    setHotelEditId(getId(hotel))
    setHotelForm({
      name: getHotelName(hotel),
      location: getHotelLocation(hotel),
      description: getHotelDescription(hotel),
      pricePerNight: String(getHotelPrice(hotel)),
      availableRooms: String(getHotelRooms(hotel)),
    })
  }

  const handleHotelDelete = async (id) => {
    resetMessages()
    setSaving(true)
    try {
      await adminService.deleteHotel(id)
      setSuccess('Hotel deleted successfully')
      if (String(id) === selectedHotelId) {
        setSelectedHotelId('')
        setRooms([])
      }
      await refreshAll()
    } catch (err) {
      setError(err.message || 'Failed to delete hotel')
    } finally {
      setSaving(false)
    }
  }

  const handleRoomSubmit = async (e) => {
    e.preventDefault()
    resetMessages()
    setSaving(true)

    try {
      const payload = {
        hotelId: roomForm.hotelId,
        type: roomForm.type,
        price: Number(roomForm.price),
        availableCount: Number(roomForm.availableCount),
      }

      if (roomEditId) {
        await adminService.updateRoom(roomEditId, payload)
        setSuccess('Room updated successfully')
      } else {
        await adminService.addRoom(payload)
        setSuccess('Room added successfully')
      }

      setRoomEditId(null)
      setRoomForm((prev) => ({ ...emptyRoomForm, hotelId: prev.hotelId || selectedHotelId }))
      await refreshAll()
    } catch (err) {
      setError(err.message || 'Failed to save room')
    } finally {
      setSaving(false)
    }
  }

  const handleRoomEdit = (room) => {
    setActiveTab('rooms')
    setRoomEditId(getId(room))
    setSelectedHotelId(String(room?.hotelId || room?.HotelId || selectedHotelId))
    setRoomForm({
      hotelId: String(room?.hotelId || room?.HotelId || selectedHotelId),
      type: getRoomType(room),
      price: String(getRoomPrice(room)),
      availableCount: String(getRoomCount(room)),
    })
  }

  const handleRoomDelete = async (id) => {
    resetMessages()
    setSaving(true)
    try {
      await adminService.deleteRoom(id)
      setSuccess('Room deleted successfully')
      await refreshAll()
    } catch (err) {
      setError(err.message || 'Failed to delete room')
    } finally {
      setSaving(false)
    }
  }

  const handleUserBlock = async (id, isBlocked) => {
    resetMessages()
    setSaving(true)
    try {
      await adminService.blockUser(id, isBlocked)
      setSuccess(`User ${isBlocked ? 'blocked' : 'unblocked'} successfully`)
      await refreshAll()
    } catch (err) {
      setError(err.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleUserDelete = async (id) => {
    resetMessages()
    setSaving(true)
    try {
      await adminService.deleteUser(id)
      setSuccess('User deleted successfully')
      await refreshAll()
    } catch (err) {
      setError(err.message || 'Failed to delete user')
    } finally {
      setSaving(false)
    }
  }

  const handleBookingStatusSave = async (id) => {
    resetMessages()
    setSaving(true)
    try {
      await adminService.updateBookingStatus(id, bookingStatusDrafts[id])
      setSuccess('Booking status updated successfully')
      await refreshAll()
    } catch (err) {
      setError(err.message || 'Failed to update booking status')
    } finally {
      setSaving(false)
    }
  }

  const stats = useMemo(() => [
    { label: 'Bookings', value: dashboard?.totalBookings ?? bookings.length, icon: ReceiptText },
    { label: 'Active users', value: dashboard?.activeUsers ?? users.filter((u) => !u.isBlocked && !u.IsBlocked).length, icon: Users },
    { label: 'Revenue', value: dashboard ? `$${Number(dashboard.revenue || 0).toFixed(2)}` : '$0.00', icon: CalendarDays },
    { label: 'Hotels', value: hotels.length, icon: Hotel },
  ], [dashboard, bookings.length, users, hotels.length])

  if (loading) return <LoadingSpinner />

  const selectedRooms = rooms
  const selectedHotel = hotels.find((hotel) => String(getId(hotel)) === String(selectedHotelId))

  return (
    <div className="page-section">
      <div className="container">
        <section className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-6 py-12 text-white shadow-2xl shadow-blue-950/20 sm:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-blue-100 backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Admin control center
              </span>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                Manage hotels, rooms, users and bookings
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-blue-100 sm:text-lg">
                Use this dashboard to operate StayEasy as an admin. You can add and edit hotels and rooms, block users, update booking status and review operational stats.
              </p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-blue-100">
                Booking on behalf of another user is not exposed by the backend yet. The dashboard supports the current admin management APIs and can be extended once a create-booking endpoint is added.
              </div>
            </div>
            <button type="button" onClick={refreshAll} className="btn-secondary whitespace-nowrap bg-white/95 text-slate-900">
              <RefreshCw className="h-4 w-4" />
              Refresh all
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <Icon className="h-5 w-5 text-blue-200" />
                <div className="mt-3 text-2xl font-black">{value}</div>
                <div className="text-sm text-blue-100">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="mb-6 flex flex-wrap gap-3">
          {['overview', 'hotels', 'rooms', 'users', 'bookings'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-slate-900">Quick summary</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-700">
                <div className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"><span>Total bookings</span><span className="font-bold">{dashboard?.totalBookings ?? bookings.length}</span></div>
                <div className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"><span>Active users</span><span className="font-bold">{dashboard?.activeUsers ?? users.filter((u) => !(u.isBlocked || u.IsBlocked)).length}</span></div>
                <div className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"><span>Total revenue</span><span className="font-bold">${Number(dashboard?.revenue || 0).toFixed(2)}</span></div>
                <div className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"><span>Total hotels</span><span className="font-bold">{hotels.length}</span></div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-2xl font-bold text-slate-900">Latest bookings</h2>
              <div className="mt-6 space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={getId(booking)} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">Booking #{getId(booking)}</p>
                        <p className="text-slate-500">User {booking?.userId || booking?.UserId}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">${getBookingAmount(booking).toFixed(2)}</p>
                        <p className="text-slate-500">{getBookingStatus(booking)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && <p className="text-slate-500">No bookings available.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hotels' && (
          <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
            <form onSubmit={handleHotelSubmit} className="card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">{hotelEditId ? 'Edit hotel' : 'Add hotel'}</h2>
              </div>

              <input
                className="input-field"
                placeholder="Hotel name"
                value={hotelForm.name}
                onChange={(e) => setHotelForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <input
                className="input-field"
                placeholder="Location"
                value={hotelForm.location}
                onChange={(e) => setHotelForm((prev) => ({ ...prev, location: e.target.value }))}
                required
              />
              <textarea
                className="input-field min-h-28"
                placeholder="Description"
                value={hotelForm.description}
                onChange={(e) => setHotelForm((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  className="input-field"
                  placeholder="Price per night"
                  value={hotelForm.pricePerNight}
                  onChange={(e) => setHotelForm((prev) => ({ ...prev, pricePerNight: e.target.value }))}
                  required
                />
                <input
                  type="number"
                  className="input-field"
                  placeholder="Available rooms"
                  value={hotelForm.availableRooms}
                  onChange={(e) => setHotelForm((prev) => ({ ...prev, availableRooms: e.target.value }))}
                  required
                />
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full">
                {hotelEditId ? 'Update hotel' : 'Add hotel'}
              </button>
              {hotelEditId && (
                <button
                  type="button"
                  onClick={() => {
                    setHotelEditId(null)
                    setHotelForm(emptyHotelForm)
                  }}
                  className="btn-secondary w-full"
                >
                  Cancel edit
                </button>
              )}
            </form>

            <div className="card p-6 overflow-auto">
              <h2 className="text-2xl font-bold text-slate-900">Hotels</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="py-3 pr-4">Name</th>
                      <th className="py-3 pr-4">Location</th>
                      <th className="py-3 pr-4">Price</th>
                      <th className="py-3 pr-4">Rooms</th>
                      <th className="py-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotels.map((hotel) => (
                      <tr key={getId(hotel)} className="border-b border-slate-100 align-top">
                        <td className="py-3 pr-4 font-semibold text-slate-900">{getHotelName(hotel)}</td>
                        <td className="py-3 pr-4 text-slate-600">{getHotelLocation(hotel)}</td>
                        <td className="py-3 pr-4 text-slate-600">${getHotelPrice(hotel).toFixed(2)}</td>
                        <td className="py-3 pr-4 text-slate-600">{getHotelRooms(hotel)}</td>
                        <td className="py-3 pr-4">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => handleHotelEdit(hotel)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                            <button type="button" onClick={() => handleHotelDelete(getId(hotel))} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
            <form onSubmit={handleRoomSubmit} className="card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Hotel className="h-5 w-5 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">{roomEditId ? 'Edit room' : 'Add room'}</h2>
              </div>

              <select
                className="input-field"
                value={roomForm.hotelId}
                onChange={(e) => setRoomForm((prev) => ({ ...prev, hotelId: e.target.value }))}
                required
              >
                <option value="">Select hotel</option>
                {hotels.map((hotel) => (
                  <option key={getId(hotel)} value={getId(hotel)}>
                    {getHotelName(hotel)}
                  </option>
                ))}
              </select>

              <input
                className="input-field"
                placeholder="Room type"
                value={roomForm.type}
                onChange={(e) => setRoomForm((prev) => ({ ...prev, type: e.target.value }))}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  className="input-field"
                  placeholder="Price"
                  value={roomForm.price}
                  onChange={(e) => setRoomForm((prev) => ({ ...prev, price: e.target.value }))}
                  required
                />
                <input
                  type="number"
                  className="input-field"
                  placeholder="Available count"
                  value={roomForm.availableCount}
                  onChange={(e) => setRoomForm((prev) => ({ ...prev, availableCount: e.target.value }))}
                  required
                />
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full">
                {roomEditId ? 'Update room' : 'Add room'}
              </button>
              {roomEditId && (
                <button
                  type="button"
                  onClick={() => {
                    setRoomEditId(null)
                    setRoomForm(emptyRoomForm)
                  }}
                  className="btn-secondary w-full"
                >
                  Cancel edit
                </button>
              )}
            </form>

            <div className="card p-6 overflow-auto">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Rooms</h2>
                  <p className="text-sm text-slate-500">{selectedHotel ? getHotelName(selectedHotel) : 'Select a hotel to view rooms'}</p>
                </div>
                <select
                  className="input-field max-w-xs"
                  value={selectedHotelId}
                  onChange={(e) => setSelectedHotelId(e.target.value)}
                >
                  <option value="">Select hotel</option>
                  {hotels.map((hotel) => (
                    <option key={getId(hotel)} value={getId(hotel)}>
                      {getHotelName(hotel)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="py-3 pr-4">Type</th>
                      <th className="py-3 pr-4">Price</th>
                      <th className="py-3 pr-4">Available</th>
                      <th className="py-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRooms.map((room) => (
                      <tr key={getId(room)} className="border-b border-slate-100 align-top">
                        <td className="py-3 pr-4 font-semibold text-slate-900">{getRoomType(room)}</td>
                        <td className="py-3 pr-4 text-slate-600">${getRoomPrice(room).toFixed(2)}</td>
                        <td className="py-3 pr-4 text-slate-600">{getRoomCount(room)}</td>
                        <td className="py-3 pr-4">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => handleRoomEdit(room)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                            <button type="button" onClick={() => handleRoomDelete(getId(room))} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card p-6 overflow-auto">
            <h2 className="text-2xl font-bold text-slate-900">Users</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Role</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isBlocked = user?.isBlocked || user?.IsBlocked
                    return (
                      <tr key={getId(user)} className="border-b border-slate-100 align-top">
                        <td className="py-3 pr-4 font-semibold text-slate-900">{getUserName(user)}</td>
                        <td className="py-3 pr-4 text-slate-600">{getUserEmail(user)}</td>
                        <td className="py-3 pr-4 text-slate-600">{getUserRole(user)}</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isBlocked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => handleUserBlock(getId(user), !isBlocked)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                              {isBlocked ? 'Unblock' : 'Block'}
                            </button>
                            <button type="button" onClick={() => handleUserDelete(getId(user))} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="card p-6 overflow-auto">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">Bookings</h2>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-3 pr-4">ID</th>
                    <th className="py-3 pr-4">User</th>
                    <th className="py-3 pr-4">Amount</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const bookingId = getId(booking)
                    return (
                      <tr key={bookingId} className="border-b border-slate-100 align-top">
                        <td className="py-3 pr-4 font-semibold text-slate-900">{bookingId}</td>
                        <td className="py-3 pr-4 text-slate-600">{booking?.userId || booking?.UserId}</td>
                        <td className="py-3 pr-4 text-slate-600">${getBookingAmount(booking).toFixed(2)}</td>
                        <td className="py-3 pr-4">
                          <select
                            className="input-field"
                            value={bookingStatusDrafts[bookingId] || getBookingStatus(booking)}
                            onChange={(e) => setBookingStatusDrafts((prev) => ({ ...prev, [bookingId]: e.target.value }))}
                          >
                            {['Pending', 'Confirmed', 'Cancelled', 'Completed'].map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 pr-4">
                          <button type="button" onClick={() => handleBookingStatusSave(bookingId)} className="btn-secondary px-3 py-2 text-xs">
                            Update status
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboardPage
