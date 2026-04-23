import React, { createContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext()

const base64UrlDecode = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  return atob(padded)
}

const decodeToken = (token) => {
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const claims = JSON.parse(base64UrlDecode(payload))
    const email = claims.email || claims.Email || claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
    const role = claims.role || claims.Role || claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    const displayName = claims.name || claims.Name || claims.email || claims.Email || email || 'Guest'

    return {
      email: email || '',
      role: role || '',
      displayName,
      claims,
    }
  } catch {
    return null
  }
}

const isTokenValid = (token) => {
  const decoded = decodeToken(token)
  if (!decoded?.claims) return false

  const exp = Number(decoded.claims.exp)
  if (!Number.isFinite(exp)) return true

  return exp * 1000 > Date.now()
}

const normalizeUser = (value, token = null) => {
  if (!value && !token) return null

  const tokenUser = decodeToken(token)

  if (typeof value === 'string') {
    return tokenUser || { displayName: value }
  }

  const email = value?.email || value?.Email || tokenUser?.email || ''
  const role = value?.role || value?.Role || tokenUser?.role || ''
  const displayName =
    value?.displayName ||
    value?.DisplayName ||
    value?.name ||
    value?.Name ||
    tokenUser?.displayName ||
    email ||
    'Guest'

  return {
    ...(value || {}),
    email,
    role,
    displayName,
  }
}

const getStoredToken = () => localStorage.getItem('token') || ''

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(getStoredToken)

  useEffect(() => {
    const storedToken = getStoredToken()

    if (!storedToken || !isTokenValid(storedToken)) {
      localStorage.removeItem('token')
      setToken('')
      setUser(null)
      setLoading(false)
      return
    }

    setToken(storedToken)
    setUser(normalizeUser(null, storedToken))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }

    if (!isTokenValid(token)) {
      localStorage.removeItem('token')
      setToken('')
      setUser(null)
      return
    }

    setUser((currentUser) => normalizeUser(currentUser, token))
  }, [token])

  const login = async (email, password) => {
    const response = await authService.login(email, password)
    const nextToken = response?.token || response?.Token || response?.accessToken || response?.AccessToken || ''

    if (!nextToken) {
      throw new Error('Login succeeded but no token was returned by the server.')
    }

    if (!isTokenValid(nextToken)) {
      throw new Error('The server returned an expired or invalid token.')
    }

    localStorage.setItem('token', nextToken)
    setToken(nextToken)
    setUser(normalizeUser(response, nextToken))
    return response
  }

  const register = async (userData) => {
    return await authService.register(userData)
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setToken('')
      localStorage.removeItem('token')
    }
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!token && isTokenValid(token),
    }),
    [user, token, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
