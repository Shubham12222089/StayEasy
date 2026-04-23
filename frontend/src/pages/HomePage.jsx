import React, { useEffect, useMemo, useState } from 'react'
import HotelCard from '../components/HotelCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'
import { hotelService } from '../services/hotelService'
import { Search, Filter, RefreshCw, MapPin, Star, Building2 } from '../components/ui-icons'

const HomePage = () => {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ location: '', priceRange: 'all', rating: 'all' })

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await hotelService.getAllHotels()
      setHotels(Array.isArray(data) ? data : data?.$values || [])
    } catch (err) {
      setHotels([])
      setError('Failed to load hotels. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const getHotelPrice = (hotel) => Number(hotel.pricePerNight || hotel.PricePerNight || hotel.minimumPrice || hotel.minPrice || hotel.startingPrice || 0)
  const getHotelRating = (hotel) => Number(hotel.averageRating || hotel.rating || 0)

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const q = searchTerm.trim().toLowerCase()
      const searchMatch = !q || [hotel.name, hotel.location, hotel.description].some((value) =>
        String(value || '').toLowerCase().includes(q)
      )

      const locationMatch = !filters.location || String(hotel.location || '').toLowerCase().includes(filters.location.toLowerCase())

      const price = getHotelPrice(hotel)
      const priceMatch =
        filters.priceRange === 'all' ||
        (filters.priceRange === 'budget' && price > 0 && price <= 100) ||
        (filters.priceRange === 'mid' && price > 100 && price <= 250) ||
        (filters.priceRange === 'luxury' && price > 250)

      const rating = getHotelRating(hotel)
      const ratingMatch =
        filters.rating === 'all' ||
        (filters.rating === '3+' && rating >= 3) ||
        (filters.rating === '4+' && rating >= 4)

      return searchMatch && locationMatch && priceMatch && ratingMatch
    })
  }, [hotels, searchTerm, filters])

  const stats = [
    { label: 'Hotels', value: hotels.length || '—', icon: Building2 },
    { label: 'Rated 4+', value: hotels.filter((h) => getHotelRating(h) >= 4).length, icon: Star },
    { label: 'Locations', value: new Set(hotels.map((h) => h.location).filter(Boolean)).size, icon: MapPin }
  ]

  return (
    <div className="page-section">
      <div className="container">
        <section className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-6 py-14 text-white shadow-2xl shadow-blue-950/20 sm:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <span className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-blue-100 backdrop-blur">
                Premium stays, simplified booking
              </span>
              <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Find your perfect stay with StayEasy
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
                Search, compare, and book modern hotels with a fast checkout flow and clean booking experience.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-lg">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <Icon className="h-5 w-5 text-blue-200" />
                    <div className="mt-3 text-2xl font-black">{value}</div>
                    <div className="text-sm text-blue-100">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="rounded-[1.4rem] bg-white p-5 text-slate-900">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-700">
                  <Search className="h-4 w-4" />
                  Live hotel discovery
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  Search by hotel name, location, or description. Apply filters instantly without extra API calls.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="card mb-8 p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search hotels, cities, or highlights..."
                className="input-field pl-12"
              />
            </div>
            <button type="button" onClick={fetchHotels} className="btn-secondary whitespace-nowrap">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Price range</label>
              <select name="priceRange" value={filters.priceRange} onChange={handleFilterChange} className="input-field">
                <option value="all">All prices</option>
                <option value="budget">Budget (Under $100)</option>
                <option value="mid">Mid-range ($100-$250)</option>
                <option value="luxury">Luxury ($250+)</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Rating</label>
              <select name="rating" value={filters.rating} onChange={handleFilterChange} className="input-field">
                <option value="all">All ratings</option>
                <option value="3+">3+ stars</option>
                <option value="4+">4+ stars</option>
              </select>
            </div>
          </div>
        </section>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredHotels.length}</span> of {hotels.length} hotels
          </p>
          {(searchTerm || filters.location || filters.priceRange !== 'all' || filters.rating !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setFilters({ location: '', priceRange: 'all', rating: 'all' })
              }}
              className="text-sm font-semibold text-blue-700 hover:text-blue-800"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <div className="mx-auto flex max-w-md flex-col items-center gap-4">
              <LoadingSpinner />
              <p className="text-slate-600">Loading hotels from the API...</p>
            </div>
          </div>
        ) : filteredHotels.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="card py-16 text-center">
            <Filter className="mx-auto mb-4 h-16 w-16 text-slate-300" />
            <h3 className="text-xl font-bold text-slate-900">No hotels found</h3>
            <p className="mt-2 text-slate-600">Try removing filters or searching a different destination.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
