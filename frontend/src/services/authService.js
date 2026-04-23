import api from './api'

const IDENTITY_URL = import.meta.env.VITE_IDENTITY_URL || 'http://localhost:5284'

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

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post(`${IDENTITY_URL}/api/auth/signup`, userData)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Registration failed'))
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post(`${IDENTITY_URL}/api/auth/login`, { email, password })
      const token = response.data?.token || response.data?.Token || response.data?.accessToken || response.data?.AccessToken
      if (token) localStorage.setItem('token', token)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Login failed'))
    }
  },

  logout: async () => {
    try {
      await api.post(`${IDENTITY_URL}/api/auth/logout`)
    } catch {
      // ignore logout failures
    } finally {
      localStorage.removeItem('token')
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get(`${IDENTITY_URL}/api/auth/me`)
      return response.data
    } catch {
      return null
    }
  }
}
