import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      
      if (!storedToken) {
        setIsLoading(false)
        return
      }

      try {
        const userData = await authService.getCurrentUser()
        setUser(userData)
        setIsAuthenticated(true)
        setToken(storedToken)
      } catch (err) {
        console.error('Auth initialization error:', err)
        // Token might be invalid/expired
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Login
  const login = useCallback(async (email, password) => {
    setError(null)
    setIsLoading(true)
    
    try {
      const response = await authService.login(email, password)
      const { user: userData, token: newToken } = response
      
      setUser(userData)
      setIsAuthenticated(true)
      setToken(newToken)
      localStorage.setItem('token', newToken)
      
      return response
    } catch (err) {
      setError(err.message || 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Register
  const register = useCallback(async (userData) => {
    setError(null)
    setIsLoading(true)
    
    try {
      const response = await authService.register(userData)
      const { user: newUser, token: newToken } = response
      
      setUser(newUser)
      setIsAuthenticated(true)
      setToken(newToken)
      localStorage.setItem('token', newToken)
      
      return response
    } catch (err) {
      setError(err.message || 'Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      setToken(null)
      localStorage.removeItem('token')
    }
  }, [])

  // Update user profile
  const updateUser = useCallback(async (data) => {
    setError(null)
    setIsLoading(true)
    
    try {
      const updatedUser = await authService.updateProfile(data)
      setUser(updatedUser)
      return updatedUser
    } catch (err) {
      setError(err.message || 'Update failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setError(null)
    setIsLoading(true)
    
    try {
      await authService.changePassword(currentPassword, newPassword)
    } catch (err) {
      setError(err.message || 'Password change failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Get user's dashboard path based on role
  const getDashboardPath = useCallback(() => {
    if (!user) return '/'
    switch (user.role) {
      case 'customer':
        return '/customer/dashboard'
      case 'barber':
        return '/barber/dashboard'
      case 'admin':
        return '/admin/dashboard'
      default:
        return '/'
    }
  }, [user])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    token,
    login,
    register,
    logout,
    updateUser,
    changePassword,
    getDashboardPath,
    // Helper to check if user has specific role
    hasRole: (role) => user?.role === role,
    isCustomer: user?.role === 'customer',
    isBarber: user?.role === 'barber',
    isAdmin: user?.role === 'admin',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}