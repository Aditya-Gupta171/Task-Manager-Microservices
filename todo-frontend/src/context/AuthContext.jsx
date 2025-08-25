import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, auth } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const { data } = await auth.getProfile()
          setUser(data)
        } catch (err) {
          console.error('Failed to load user profile:', err)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  const login = async (credentials) => {
    try {
      setError(null)
      const { data } = await auth.login(credentials)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      const { data } = await auth.register(userData)
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      throw err
    }
  }

  const logout = async () => {
    try {
      await auth.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    }
  }

  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
  }), [user, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}