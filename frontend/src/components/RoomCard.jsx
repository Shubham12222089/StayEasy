import React from 'react'
import { Users, BadgeCheck, CheckCircle2 } from './ui-icons'

const RoomCard = ({ room, onAddToCart, checkInDate, checkOutDate, isAddingToCart }) => {
  const amenities = room.amenities || []
  const price = room.pricePerNight ?? room.price ?? room.Price ?? 0
  const roomName = room.name || room.Name || room.type || room.Type || room.roomType || room.RoomType || 'Room'
  const availableCount = Number(room.availableCount || room.AvailableCount || room.availableRooms || room.AvailableRooms || 0)
  const isAvailable = room.isAvailable !== false && availableCount > 0

  const handleClick = () => {
    if (checkInDate && checkOutDate) {
      onAddToCart({ ...room, name: roomName, price }, checkInDate, checkOutDate)
    }
  }

  return (
    <div className="card overflow-hidden flex flex-col transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl">
      {/* Room image */}
      <div className="relative h-48 overflow-hidden bg-slate-900 shrink-0">
        {room.image ? (
          <img
            src={room.image}
            alt={roomName}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-5xl text-white">
            🛏️
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
        
        {/* Availability badge */}
        <div
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur transition-all duration-200 ${
            isAvailable
              ? 'bg-emerald-500 shadow-emerald-500/25'
              : 'bg-red-500 shadow-red-500/25'
          }`}
        >
          {isAvailable ? '✓ Available' : 'Unavailable'}
        </div>
        
        {isAvailable && (
          <div className="absolute right-4 top-4 rounded-full bg-blue-500/90 px-3 py-1 text-xs font-bold text-white shadow-lg flex items-center gap-1 animate-pulse">
            <CheckCircle2 className="h-3 w-3" />
            Ready to book
          </div>
        )}
      </div>

      {/* Room details */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900">{roomName}</h3>
              {availableCount > 0 && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                  {availableCount} left
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <Users className="h-4 w-4" />
              <span>
                {room.capacity || 2} {(room.capacity || 2) === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Per night</p>
            <p className="text-2xl font-black text-blue-600">${price}</p>
          </div>
        </div>

        {room.description && (
          <p className="mb-4 text-sm leading-6 text-slate-600 line-clamp-2">{room.description}</p>
        )}

        {amenities.length > 0 && (
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <BadgeCheck className="h-4 w-4 text-blue-600" />
              Amenities
            </div>
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 4).map((amenity, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-100 transition-all duration-200 hover:bg-blue-100"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Spacer to push button to bottom */}
        <div className="flex-1" />

        {/* Add to cart button - always visible */}
        <button
          onClick={handleClick}
          disabled={isAddingToCart || !isAvailable || !checkInDate || !checkOutDate}
          className={`btn-primary w-full mt-4 transition-all duration-200 transform ${
            isAddingToCart ? 'opacity-75' : ''
          } ${
            !isAvailable || !checkInDate || !checkOutDate
              ? 'cursor-not-allowed opacity-60'
              : 'hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-blue-500/20'
          }`}
        >
          {isAddingToCart ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Adding...
            </span>
          ) : !isAvailable ? (
            'Unavailable'
          ) : !checkInDate || !checkOutDate ? (
            'Select dates first'
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              Add to cart
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default RoomCard
