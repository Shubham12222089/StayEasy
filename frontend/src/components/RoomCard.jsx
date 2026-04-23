import React from 'react'
import { Users, BadgeCheck } from './ui-icons'

const RoomCard = ({ room, onAddToCart, checkInDate, checkOutDate, isAddingToCart }) => {
  const amenities = room.amenities || []
  const price = room.pricePerNight ?? room.price ?? 0

  const handleClick = () => {
    if (checkInDate && checkOutDate) {
      onAddToCart(room, checkInDate, checkOutDate)
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        {room.image ? (
          <img src={room.image} alt={room.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-5xl text-white">
            🛏️
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-emerald-500/25">
          {room.isAvailable === false ? 'Unavailable' : 'Available'}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{room.name}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Users className="h-4 w-4" />
              <span>
                {room.capacity || 2} {(room.capacity || 2) === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-slate-500">Per night</p>
            <p className="text-2xl font-black text-blue-600">${price}</p>
          </div>
        </div>

        <p className="mb-4 text-sm leading-6 text-slate-600">{room.description}</p>

        {amenities.length > 0 && (
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <BadgeCheck className="h-4 w-4 text-blue-600" />
              Amenities
            </div>
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 4).map((amenity, index) => (
                <span key={index} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleClick}
          disabled={isAddingToCart || room.isAvailable === false || !checkInDate || !checkOutDate}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAddingToCart ? 'Adding...' : 'Add to cart'}
        </button>
      </div>
    </div>
  )
}

export default RoomCard
