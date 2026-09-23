import React from 'react'
import './RatingStars.css'

const RatingStars = ({ rating, size = 'medium', showNumber = false }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const starSize = {
    small: '16px',
    medium: '20px',
    large: '28px'
  }

  const starStyle = {
    width: starSize[size],
    height: starSize[size]
  }

  return (
    <div className="rating-stars" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star star-full" style={starStyle}>
          ★
        </span>
      ))}
      {hasHalfStar && (
        <span className="star star-half" style={starStyle}>
          ★
        </span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star star-empty" style={starStyle}>
          ★
        </span>
      ))}
      {showNumber && (
        <span className="rating-number">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}

export default RatingStars