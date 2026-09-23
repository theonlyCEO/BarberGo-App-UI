import React from 'react'
import './ServiceCard.css'

const ServiceCard = ({ service, onSelect }) => {
  const {
    name,
    description,
    price,
    durationMinutes,
    category,
    active = true
  } = service

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }

  return (
    <div className={`service-card ${!active ? 'inactive' : ''}`}>
      <div className="service-info">
        <div className="service-header">
          <h4 className="service-name">{name}</h4>
          <span className="service-price">R{price.toFixed(2)}</span>
        </div>
        {category && (
          <span className="service-category">{category}</span>
        )}
        {description && (
          <p className="service-description">{description}</p>
        )}
        <div className="service-meta">
          <span className="service-duration">⏱️ {formatDuration(durationMinutes)}</span>
          {!active && (
            <span className="service-status">Currently unavailable</span>
          )}
        </div>
      </div>
      {onSelect && active && (
        <button 
          className="service-select-btn"
          onClick={() => onSelect(service)}
        >
          Select
        </button>
      )}
    </div>
  )
}

export default ServiceCard