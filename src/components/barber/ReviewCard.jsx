import React, { useState } from 'react'
import RatingStars from '../common/RatingStars'
import './ReviewCard.css'

const ReviewCard = ({ review, onHelpful }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    customerId,
    rating,
    comment,
    photos = [],
    createdAt,
    status = 'visible',
    helpfulCount = 0,
    barberResponse,
    isVerified = false
  } = review

  const customerName = customerId?.name || 'Anonymous Customer'
  const formattedDate = new Date(createdAt).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const hasPhotos = photos && photos.length > 0
  const displayPhotos = hasPhotos ? photos.slice(0, 3) : []
  const remainingPhotos = hasPhotos ? photos.length - 3 : 0
  const isLongComment = comment && comment.length > 200

  const displayComment = isExpanded || !isLongComment 
    ? comment 
    : `${comment.slice(0, 200)}...`

  const handleHelpfulClick = () => {
    if (onHelpful) {
      onHelpful(review.id)
    }
  }

  return (
    <div className={`review-card ${status !== 'visible' ? 'hidden-review' : ''}`}>
      <div className="review-header">
        <div className="review-user">
          <div className="user-avatar">
            {customerName.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{customerName}</span>
            <span className="review-date">{formattedDate}</span>
          </div>
        </div>
        <div className="review-rating">
          <RatingStars rating={rating} size="small" />
          {isVerified && (
            <span className="verified-badge" title="Verified customer">✓</span>
          )}
        </div>
      </div>

      <div className="review-content">
        <p className="review-comment">{displayComment}</p>
        {isLongComment && (
          <button 
            className="review-expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {hasPhotos && (
        <div className="review-photos">
          {displayPhotos.map((photo, index) => (
            <img 
              key={index} 
              src={photo} 
              alt={`Review photo ${index + 1}`} 
              className="review-photo"
              loading="lazy"
            />
          ))}
          {remainingPhotos > 0 && (
            <div className="review-photo-more">
              <span>+{remainingPhotos}</span>
            </div>
          )}
        </div>
      )}

      {barberResponse && (
        <div className="barber-response">
          <div className="response-header">
            <span className="response-icon">💈</span>
            <span className="response-label">Barber Response</span>
          </div>
          <p className="response-text">{barberResponse.text}</p>
          {barberResponse.respondedAt && (
            <span className="response-date">
              {new Date(barberResponse.respondedAt).toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          )}
        </div>
      )}

      <div className="review-footer">
        <button 
          className="helpful-btn"
          onClick={handleHelpfulClick}
        >
          👍 Helpful ({helpfulCount})
        </button>
        {status === 'flagged' && (
          <span className="flagged-badge">⚠️ Reported</span>
        )}
      </div>
    </div>
  )
}

export default ReviewCard