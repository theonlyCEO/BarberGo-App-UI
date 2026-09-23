import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      // Don't redirect if already on login or register page
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token')
        // Store the attempted URL for redirect after login
        sessionStorage.setItem('redirectAfterLogin', currentPath)
        window.location.href = '/login'
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.warn('Forbidden access:', error.response?.data?.error?.message)
    }

    // Format error message
    const responseError = error.response?.data?.error
    const message = responseError?.message || error.message || 'An error occurred'
    const code = responseError?.code || 'UNKNOWN_ERROR'
    
    // Create custom error object
    const customError = new Error(message)
    customError.code = code
    customError.status = error.response?.status
    customError.details = responseError?.details
    customError.originalError = error

    return Promise.reject(customError)
  }
)

export default api