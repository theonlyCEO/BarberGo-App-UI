import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

export const RoleRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading, getDashboardPath } = useAuth()

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user?.role)) {
    // Redirect to the user's appropriate dashboard
    const redirectPath = getDashboardPath()
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}