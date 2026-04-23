import api from './api'

const ADMIN_API = '/api/admin'

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data
  return data?.message || data?.detail || data?.title || error?.message || fallback
}

export const adminService = {
  getDashboard: async () => {
    try {
      const response = await api.get(`${ADMIN_API}/dashboard`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load dashboard'))
    }
  },

  getUsers: async () => {
    try {
      const response = await api.get(`${ADMIN_API}/users`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load users'))
    }
  },

  blockUser: async (id, isBlocked) => {
    try {
      const response = await api.put(`${ADMIN_API}/users/${id}/block`, { isBlocked })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update user'))
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`${ADMIN_API}/users/${id}`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete user'))
    }
  },

  getHotels: async () => {
    try {
      const response = await api.get(`${ADMIN_API}/hotels`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load hotels'))
    }
  },

  addHotel: async (payload) => {
    try {
      const response = await api.post(`${ADMIN_API}/hotels`, payload)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to add hotel'))
    }
  },

  updateHotel: async (id, payload) => {
    try {
      const response = await api.put(`${ADMIN_API}/hotels/${id}`, payload)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update hotel'))
    }
  },

  deleteHotel: async (id) => {
    try {
      const response = await api.delete(`${ADMIN_API}/hotels/${id}`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete hotel'))
    }
  },

  getRoomsByHotel: async (hotelId) => {
    try {
      const response = await api.get(`${ADMIN_API}/rooms/hotel/${hotelId}`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load rooms'))
    }
  },

  addRoom: async (payload) => {
    try {
      const response = await api.post(`${ADMIN_API}/rooms`, payload)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to add room'))
    }
  },

  updateRoom: async (id, payload) => {
    try {
      const response = await api.put(`${ADMIN_API}/rooms/${id}`, payload)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update room'))
    }
  },

  deleteRoom: async (id) => {
    try {
      const response = await api.delete(`${ADMIN_API}/rooms/${id}`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete room'))
    }
  },

  getBookings: async () => {
    try {
      const response = await api.get(`${ADMIN_API}/bookings`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load bookings'))
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.put(`${ADMIN_API}/bookings/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update booking status'))
    }
  },
}
