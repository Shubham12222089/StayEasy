import api from './api'

const BOOKING_URL = import.meta.env.VITE_BOOKING_URL || 'http://localhost:5100'

export const bookingService = {
  addToCart: async (roomId, quantity = 1) => {
    try {
      const response = await api.post(`${BOOKING_URL}/api/booking/cart`, { roomId, quantity })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add to cart' }
    }
  },

  checkout: async () => {
    try {
      const response = await api.post(`${BOOKING_URL}/api/booking/checkout`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to checkout' }
    }
  },

  getUserBookings: async () => {
    try {
      const response = await api.get(`${BOOKING_URL}/api/booking/my-bookings`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch bookings' }
    }
  }
}
