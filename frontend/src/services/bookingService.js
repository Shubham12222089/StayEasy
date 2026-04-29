import api from './api'

const BOOKING_URL = import.meta.env.VITE_BOOKING_URL || 'http://localhost:5100'

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data
  return data?.message || data?.detail || data?.title || error?.message || fallback
}

export const bookingService = {
  addToCart: async (roomId, quantity = 1) => {
    try {
      const response = await api.post(`${BOOKING_URL}/api/booking/cart`, { roomId, quantity })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to add to cart'))
    }
  },

  checkout: async () => {
    try {
      const response = await api.post(`${BOOKING_URL}/api/booking/checkout`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to checkout'))
    }
  },

  getUserBookings: async () => {
    try {
      const response = await api.get(`${BOOKING_URL}/api/booking/my-bookings`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch bookings'))
    }
  }
}
