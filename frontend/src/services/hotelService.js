import api from './api'

const CATALOG_URL = import.meta.env.VITE_CATALOG_URL || 'http://localhost:5142'

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data
  return (
    data?.message ||
    data?.detail ||
    data?.title ||
    data ||
    error?.message ||
    fallback
  )
}

export const hotelService = {
  getAllHotels: async () => {
    try {
      const response = await api.get(`${CATALOG_URL}/api/hotels`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch hotels'))
    }
  },

  getHotelById: async (id) => {
    try {
      const response = await api.get(`${CATALOG_URL}/api/hotels/${id}`)
      // Handle potential response wrapping (e.g., { success: true, data: {...} })
      const data = response.data?.data || response.data
      console.log('Hotel API Response:', { full: response.data, processed: data, id })
      return data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch hotel details'))
    }
  },

  getRoomsByHotelId: async (hotelId) => {
    try {
      const response = await api.get(`${CATALOG_URL}/api/hotels/${hotelId}/rooms`)
      const data = Array.isArray(response.data) ? response.data : response.data?.$values || response.data
      console.log('Rooms API Response:', { full: response.data, processed: data, hotelId, count: Array.isArray(data) ? data.length : 'not array' })
      return data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch rooms'))
    }
  },

  submitRating: async (hotelId, rating) => {
    try {
      const response = await api.post(`${CATALOG_URL}/api/hotels/${hotelId}/rating`, { rating })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to submit rating'))
    }
  },

  getHotelRatings: async (hotelId) => {
    try {
      const response = await api.get(`${CATALOG_URL}/api/hotels/${hotelId}/ratings`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch ratings'))
    }
  }
}
