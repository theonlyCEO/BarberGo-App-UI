import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../common/Button'
import './AppointmentCard.css'

const AppointmentCard = ({ appointment, onCancel, onView, variant = 'full' }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    id,
    shopId,
    serviceName,
    serviceId,
    date,
    startDateTime,
    endDateTime,
    status,
    priceAtBooking,
    durationAtBooking,
    notes,
    cancellationReason,
    shop
  } = appointment

  const shopName = shopId?.name || shop?.name || 'Unknown Shop'
  const shopAddress = shopId?.address || shop?.address

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-ZA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled',
      no_show: 'No Show'
    }
    return labels[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'pending',
      confirmed: 'confirmed',
      completed: 'completed',
      cancelled: 'cancelled',
      no_show: 'no-show'
    }
    return colors[status] || ''
  }

  const canCancel = ['pending', 'confirmed'].includes(status)
  const canReview = status === 'completed'

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`appointment-card ${variant}`}>
      <div className="appointment-header" onClick={toggleExpand}>
        <div className="appointment-main">
          <div className="appointment-shop">
            <span className="shop-name">{shopName}</span>
            <span className={`appointment-status status-${getStatusColor(status)}`}>
              {getStatusLabel(status)}
            </span>
          </div>
          <div className="appointment-service">
            <span className="service-name">{serviceName}</span>
            <span className="service-price">R{priceAtBooking?.toFixed(2)}</span>
          </div>
          <div className="appointment-datetime">
            <span className="appointment-date">{formatDate(startDateTime)}</span>
            <span className="appointment-time">{formatTime(startDateTime)}</span>
          </div>
        </div>
        <div className="appointment-toggle">
          <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </div>
      </div>

      {isExpanded && (
        <div className="appointment-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Duration</span>
              <span className="detail-value">{durationAtBooking} min</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date</span>
              <span className="detail-value">{formatDate(startDateTime)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time</span>
              <span className="detail-value">{formatTime(startDateTime)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className={`detail-value status-${getStatusColor(status)}`}>
                {getStatusLabel(status)}
              </span>
            </div>
            {shopAddress && (
              <div className="detail-item full-width">
                <span className="detail-label">Location</span>
                <span className="detail-value">
                  {shopAddress.street}, {shopAddress.city}
                </span>
              </div>
            )}
            {notes && (
              <div className="detail-item full-width">
                <span className="detail-label">Notes</span>
                <span className="detail-value">{notes}</span>
              </div>
            )}
            {cancellationReason && (
              <div className="detail-item full-width">
                <span className="detail-label">Cancellation Reason</span>
                <span className="detail-value cancellation-reason">
                  {cancellationReason}
                </span>
              </div>
            )}
          </div>

          <div className="appointment-actions">
            <Link to={`/shops/${shopId?._id || shopId}`}>
              <Button variant="outline" size="small">
                View Shop
              </Button>
            </Link>
            
            {canCancel && (
              <Button 
                variant="danger" 
                size="small"
                onClick={() => onCancel?.(appointment)}
              >
                Cancel
              </Button>
            )}
            
            {canReview && (
              <Link to={`/shops/${shopId?._id || shopId}/review`}>
                <Button variant="primary" size="small">
                  Write Review
                </Button>
              </Link>
            )}
            
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => onView?.(appointment)}
            >
              View Details
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentCard