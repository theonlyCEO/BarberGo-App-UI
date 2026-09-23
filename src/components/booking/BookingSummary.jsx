import React from 'react'
import './BookingSummary.css'

const BookingSummary = ({ shop, service, date, timeSlot, notes, onNotesChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDuration = (minutes) => {
    if (!minutes) return '—'
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }

  return (
    <div className="booking-summary">
      <div className="summary-card">
        <div className="summary-section">
          <h4 className="summary-title">Barber Shop</h4>
          <div className="summary-content">
            <p className="summary-shop-name">{shop?.name || '—'}</p>
            <p className="summary-shop-address">
              {shop?.address?.street}, {shop?.address?.city}
            </p>
          </div>
        </div>

        <div className="summary-divider" />

        <div className="summary-section">
          <h4 className="summary-title">Service</h4>
          <div className="summary-content">
            <div className="summary-row">
              <span className="summary-label">Service</span>
              <span className="summary-value">{service?.name || '—'}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Duration</span>
              <span className="summary-value">{formatDuration(service?.durationMinutes)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Price</span>
              <span className="summary-value price">
                R{service?.price?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>

        <div className="summary-divider" />

        <div className="summary-section">
          <h4 className="summary-title">Date & Time</h4>
          <div className="summary-content">
            <div className="summary-row">
              <span className="summary-label">Date</span>
              <span className="summary-value">{formatDate(date)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Time</span>
              <span className="summary-value time">{timeSlot?.startTime || '—'}</span>
            </div>
          </div>
        </div>

        <div className="summary-divider" />

        <div className="summary-section">
          <h4 className="summary-title">Notes (Optional)</h4>
          <div className="summary-content">
            <textarea
              className="notes-input"
              placeholder="Any special requests or notes for the barber..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="summary-divider" />

        <div className="summary-total">
          <span className="total-label">Total</span>
          <span className="total-price">R{service?.price?.toFixed(2) || '0.00'}</span>
        </div>
      </div>
    </div>
  )
}

export default BookingSummary