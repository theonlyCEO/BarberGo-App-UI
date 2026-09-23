import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const LocationContext = createContext(null)

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [permissionStatus, setPermissionStatus] = useState('prompt') // 'granted', 'denied', 'prompt'
  const [watchId, setWatchId] = useState(null)

  // Get current location
  const getCurrentLocation = useCallback(async (options = {}) => {
    setIsLoading(true)
    setError(null)

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = new Error('Geolocation is not supported by your browser')
        setError(err.message)
        setIsLoading(false)
        reject(err)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords
          const locationData = { 
            latitude, 
            longitude,
            accuracy,
            timestamp: position.timestamp
          }
          setLocation(locationData)
          setPermissionStatus('granted')
          setIsLoading(false)
          resolve(locationData)
        },
        (err) => {
          let message = 'Unable to get your location'
          if (err.code === 1) {
            message = 'Location permission denied. Please enable location services or search manually.'
            setPermissionStatus('denied')
          } else if (err.code === 2) {
            message = 'Location unavailable. Please try again or search manually.'
          } else if (err.code === 3) {
            message = 'Location request timed out. Please try again.'
          }
          setError(message)
          setIsLoading(false)
          reject(new Error(message))
        },
        {
          enableHighAccuracy: options.enableHighAccuracy !== false,
          timeout: options.timeout || 10000,
          maximumAge: options.maximumAge || 60000
        }
      )
    })
  }, [])

  // Watch location changes
  const watchLocation = useCallback((onChange) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return null
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const locationData = { 
          latitude, 
          longitude,
          accuracy,
          timestamp: position.timestamp
        }
        setLocation(locationData)
        setPermissionStatus('granted')
        if (onChange) onChange(locationData)
      },
      (err) => {
        let message = 'Unable to get your location'
        if (err.code === 1) {
          message = 'Location permission denied'
          setPermissionStatus('denied')
        }
        setError(message)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )

    setWatchId(id)
    return id
  }, [])

  // Stop watching location
  const stopWatching = useCallback(() => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
  }, [watchId])

  // Set location manually
  const setManualLocation = useCallback((lat, lng) => {
    const locationData = { 
      latitude: lat, 
      longitude: lng,
      accuracy: 0,
      timestamp: Date.now()
    }
    setLocation(locationData)
    setError(null)
    return locationData
  }, [])

  // Clear location
  const clearLocation = useCallback(() => {
    if (watchId) {
      stopWatching()
    }
    setLocation(null)
  }, [watchId, stopWatching])

  // Check if location is available
  const hasLocation = !!location

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  const value = {
    location,
    isLoading,
    error,
    permissionStatus,
    getCurrentLocation,
    watchLocation,
    stopWatching,
    setManualLocation,
    clearLocation,
    hasLocation
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}