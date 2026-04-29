import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, ArrowRight, Sparkles } from './ui-icons'

const HotelCard = ({ hotel }) => {
  const rating = Number(hotel.averageRating || hotel.rating || hotel.Rating || 0)
  const price = hotel.pricePerNight || hotel.PricePerNight || hotel.minimumPrice || hotel.minPrice || hotel.startingPrice

  return (
    <Link to={`/hotels/${hotel.id}`} className="group block h-full">
      <div className="card overflow-hidden h-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
        <div className="relative h-56 overflow-hidden bg-slate-900">
          {hotel.image ? (
            <img
              src={hotel.image}
              alt={hotel.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-slate-700 text-6xl text-white">
              🏨
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur flex items-center gap-1 shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            Featured stay
          </div>

          {rating > 4 && (
            <div className="absolute right-4 top-4 rounded-full bg-amber-400/95 px-3 py-1 text-xs font-bold text-white backdrop-blur flex items-center gap-1 shadow-lg animate-bounce">
              <Star className="h-3.5 w-3.5 fill-current" />
              Top rated
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col h-full">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{hotel.name}</h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">{hotel.location || 'Location not specified'}</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-1 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 px-3 py-2 shadow-md">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-amber-700">{rating > 0 ? rating.toFixed(1) : 'N/A'}</span>
            </div>
          </div>

          <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-600 flex-1">
            {hotel.description || 'A wonderful hotel experience awaits you.'}
          </p>

          <div className="flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Starting from</p>
              <p className="text-3xl font-black text-slate-900">
                {price ? `$${price}` : 'Contact'}
              </p>
            </div>
            <span className="btn-primary px-4 py-2 text-sm transition-all duration-200 transform group-hover:scale-110 active:scale-95 flex items-center gap-2">
              View details
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default HotelCard
