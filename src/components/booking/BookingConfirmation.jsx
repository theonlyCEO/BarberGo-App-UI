import React from 'react'
import Button from '../common/Button'
import './BookingConfirmation.css'

const BookingConfirmation = ({ 
  booking, 
  shop, 
  service, 
  date, 
  time,
  onNewBooking,
  onViewAppointments
}) => {
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

  const getDirectionsUrl = () => {
    if (!shop?.address) return '#'
    const address = `${shop.address.street}, ${shop.address.city}`
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
  }

  return (
    <div className="booking-confirmation">
      <div className="confirmation-header">
        <div className="confirmation-icon">✓</div>
        <h2>Booking Confirmed!</h2>
        <p className="confirmation-subtitle">
          Your appointment has been successfully booked
        </p>
      </div>

      <div className="confirmation-card">
        <div className="confirmation-shop">
          <h3 className="confirmation-shop-name">{shop?.name}</h3>
          <p className="confirmation-shop-address">
            {shop?.address?.street}, {shop?.address?.city}
          </p>
        </div>

        <div className="confirmation-details">
          <div className="detail-item">
            <span className="detail-icon">✂️</span>
            <div className="detail-info">
              <span className="detail-label">Service</span>
              <span className="detail-value">{service?.name}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <div className="detail-info">
              <span className="detail-label">Date</span>
              <span className="detail-value">{formatDate(date)}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">🕐</span>
            <div className="detail-info">
              <span className="detail-label">Time</span>
              <span className="detail-value">{time?.startTime}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">💰</span>
            <div className="detail-info">
              <span className="detail-label">Price</span>
              <span className="detail-value price">R{service?.price?.toFixed(2)}</span>
            </div>
          </div>

          {booking?.id && (
            <div className="detail-item">
              <span className="detail-icon">📋</span>
              <div className="detail-info">
                <span className="detail-label">Booking Reference</span>
                <span className="detail-value reference">#{booking.id.slice(-8).toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="confirmation-actions">
          <Button 
            variant="primary" 
            fullWidth
            onClick={() => {
              window.open(getDirectionsUrl(), '_blank')
            }}
          >
            📍 Get Directions
          </Button>
          
          <Button 
            variant="secondary" 
            fullWidth
            onClick={onViewAppointments}
          >
            View My Appointments
          </Button>
          
          <Button 
            variant="outline" 
            fullWidth
            onClick={onNewBooking}
          >
            Book Another Appointment
          </Button>
        </div>
      </div>

      <div className="confirmation-tips">
        <h4>Tips for your appointment</h4>
        <ul className="tips-list">
          <li>
            <span className="tip-icon">⏰</span>
            <span>Arrive 5-10 minutes before your appointment time</span>
          </li>
          <li>
            <span className="tip-icon">📞</span>
            <span>Call the shop if you need to reschedule or are running late</span>
          </li>
          <li>
            <span className="tip-icon">💳</span>
            <span>Payment can be made at the shop after your haircut</span>
          </li>
          <li>
            <span className="tip-icon">⭐</span>
            <span>Don't forget to leave a review after your appointment</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default BookingConfirmation