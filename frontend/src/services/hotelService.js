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
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch hotel details'))
    }
  },

  getRoomsByHotelId: async (hotelId) => {
    try {
      const response = await api.get(`${CATALOG_URL}/api/hotels/${hotelId}/rooms`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch rooms'))
    }
  }
}
