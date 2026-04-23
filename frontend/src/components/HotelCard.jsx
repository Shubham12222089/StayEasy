import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, ArrowRight, Sparkles } from './ui-icons'

const HotelCard = ({ hotel }) => {
  const averageRating = hotel.averageRating || hotel.rating || 4.5
  const price = hotel.pricePerNight || hotel.PricePerNight || hotel.minimumPrice || hotel.minPrice || hotel.startingPrice

  return (
    <Link to={`/hotels/${hotel.id}`} className="group block">
      <div className="card overflow-hidden h-full">
        <div className="relative h-56 overflow-hidden">
          {hotel.image ? (
            <img
              src={hotel.image}
              alt={hotel.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-slate-700 text-6xl text-white">
              🏨
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Featured stay
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{hotel.name}</h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{hotel.location || 'Location not specified'}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
              <Star className="h-4 w-4 fill-current" />
              {averageRating}
            </div>
          </div>

          <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-600">
            {hotel.description || 'A wonderful hotel experience awaits you.'}
          </p>

          <div className="flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Starting from</p>
              <p className="text-3xl font-black text-slate-900">
                {price ? `$${price}` : 'Contact'}
              </p>
            </div>
            <span className="btn-primary px-4 py-2 text-sm">
              View details
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default HotelCard
