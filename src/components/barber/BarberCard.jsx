import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RatingStars from '../common/RatingStars'
import Button from '../common/Button'
import './BarberCard.css'

const BarberCard = ({ shop, isSelected, onSelect, onDeselect }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const navigate = useNavigate()

  const shopId = typeof shop.id === 'string' ? shop.id : 
                 typeof shop._id === 'string' ? shop._id : 
                 shop.id?.toString() || shop._id?.toString() || null

  const {
    name,
    address,
    rating,
    reviewCount,
    distance,
    services = [],
    photos = [],
    isOpen = false,
    nextAvailable = null
  } = shop

  const hasServices = services && services.length > 0
  const displayServices = hasServices ? services.slice(0, 3) : []
  const remainingServices = hasServices ? services.length - 3 : 0
  const hasPhotos = photos && photos.length > 0

  // Generate unique placeholder based on shop name
  const getPlaceholderStyle = () => {
    const colors = [
      '#e94560', '#0f3460', '#16213e', 
      '#533483', '#1a1a2e', '#e23e57',
      '#311d3f', '#522546'
    ]
    const colorIndex = (name?.length || 0) % colors.length
    return {
      backgroundColor: colors[colorIndex],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem',
      color: 'white',
      width: '100%',
      height: '100%'
    }
  }

  const formattedDistance = distance?.formatted || 
    (distance?.km ? `${distance.km.toFixed(1)} km` : 'Unknown distance')

  const handleCardClick = () => {
    if (isSelected) {
      onDeselect?.()
    } else {
      onSelect?.()
    }
    setIsExpanded(!isExpanded)
  }

  const handleViewBarber = (e) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (shopId && typeof shopId === 'string' && shopId !== '[object Object]') {
      navigate(`/shops/${shopId}`)
    } else {
      console.error('Invalid shop ID:', shopId)
    }
  }

 // Instead of using http://localhost:3000/uploads/...
// Just use /uploads/... (Vite will proxy it)

const getPhotoUrl = (photo) => {
  if (!photo) return null
  if (photo.startsWith('http') || photo.startsWith('blob')) return photo
  // Return as relative URL - Vite proxy will handle it
  return photo
}

  return (
    <div 
      className={`barber-card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-image">
        {hasPhotos ? (
          <img src={getPhotoUrl(photos[0])} alt={name} loading="lazy" />
        ) : (
          <div className="card-image-placeholder" style={getPlaceholderStyle()}>
            ✂️
          </div>
        )}
        <div className="card-status">
          <span className={`status-badge ${isOpen ? 'open' : 'closed'}`}>
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="shop-name">{name}</h3>
          <div className="shop-distance">{formattedDistance}</div>
        </div>

        <div className="shop-rating">
          <RatingStars rating={rating || 0} size="small" />
          <span className="review-count">({reviewCount || 0})</span>
        </div>

        <p className="shop-address">{address?.street}, {address?.city}</p>

        {hasServices && (
          <div className="shop-services">
            {displayServices.map((service, index) => (
              <span key={service.id || service._id || index} className="service-tag">
                {service.name}
                {service.price && ` · R${service.price}`}
              </span>
            ))}
            {remainingServices > 0 && (
              <span className="service-tag more">+{remainingServices} more</span>
            )}
          </div>
        )}

        {nextAvailable && (
          <div className="shop-next-available">
            <span className="next-label">Next available:</span>
            <span className="next-time">{nextAvailable}</span>
          </div>
        )}

        <div className="card-actions">
          <Button 
            variant="primary" 
            size="small"
            onClick={handleViewBarber}
          >
            View Barber
          </Button>
          {isSelected && (
            <Button variant="outline" size="small" onClick={(e) => {
              e.stopPropagation()
              onDeselect?.()
            }}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BarberCard