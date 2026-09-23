import React from 'react'
import './BarberMapMarker.css'

const BarberMapMarker = ({ shop, isSelected, onClick }) => {
  const { name, rating, isOpen = false } = shop

  return (
    <div 
      className={`map-marker ${isSelected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -100%)',
        // Position would be calculated based on actual coordinates
        // For demo, we'll use random positioning
        marginLeft: `${(Math.random() - 0.5) * 100}px`,
        marginTop: `${(Math.random() - 0.5) * 100}px`
      }}
    >
      <div className="marker-dot">
        <span className="marker-emoji">✂️</span>
      </div>
      
      {isSelected && (
        <div className="marker-popup">
          <div className="popup-content">
            <div className="popup-header">
              <span className="popup-name">{name}</span>
              <span className={`popup-status ${isOpen ? 'open' : 'closed'}`}>
                {isOpen ? '● Open' : '● Closed'}
              </span>
            </div>
            {rating > 0 && (
              <div className="popup-rating">
                ⭐ {rating.toFixed(1)}
              </div>
            )}
            <button className="popup-view-btn">
              View Shop
            </button>
          </div>
          <div className="popup-arrow" />
        </div>
      )}
    </div>
  )
}

export default BarberMapMarker