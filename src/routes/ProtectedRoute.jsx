import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading..." />
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirect after login
    sessionStorage.setItem('redirectAfterLogin', location.pathname)
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}