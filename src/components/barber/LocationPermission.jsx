import React, { useState } from 'react'
import Button from '../common/Button'
import './LocationPermission.css'

const LocationPermission = ({ onAllow, onManual, isLoading, error }) => {
  const [address, setAddress] = useState('')
  const [showManual, setShowManual] = useState(false)

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (address.trim()) {
      // TODO: Geocode address
      // For now, just pass through
      onManual?.(0, 0)
    }
  }

  return (
    <div className="location-permission">
      <div className="location-permission-content">
        <div className="location-icon">📍</div>
        <h2>Find barbers near you</h2>
        <p>
          BarberGo uses your location to show nearby barbers and their availability.
        </p>

        {error && (
          <div className="location-error">
            <p>{error}</p>
          </div>
        )}

        {!showManual ? (
          <div className="location-actions">
            <Button
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
              onClick={onAllow}
            >
              {isLoading ? 'Getting location...' : 'Allow Location'}
            </Button>
            <button 
              className="location-manual-link"
              onClick={() => setShowManual(true)}
            >
              Enter location manually
            </button>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="location-manual">
            <input
              type="text"
              placeholder="Enter city, suburb, or address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="location-input"
              autoFocus
            />
            <Button type="submit" variant="primary" fullWidth>
              Search
            </Button>
            <button 
              type="button"
              className="location-back-link"
              onClick={() => setShowManual(false)}
            >
              ← Use my location
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default LocationPermission