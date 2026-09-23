import React from 'react'
import LoadingSpinner from '../common/LoadingSpinner'
import './TimeSlotSelector.css'

const TimeSlotSelector = ({ slots, selectedTime, onSelect, loading, error }) => {
  // Group slots by time
  const getTimeSlots = () => {
    if (!slots || slots.length === 0) return []
    
    // Filter unique times and sort
    const uniqueSlots = slots.filter((slot, index, self) => 
      self.findIndex(s => s.startTime === slot.startTime) === index
    )
    
    // Sort by time
    return uniqueSlots.sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const timeSlots = getTimeSlots()

  const renderSlot = (slot) => {
    const isSelected = selectedTime?.startTime === slot.startTime && 
                       selectedTime?.date === slot.date
    const isAvailable = slot.available
    const isPast = slot.isPast || false
    
    let className = 'time-slot'
    if (!isAvailable || isPast) className += ' unavailable'
    if (isSelected) className += ' selected'
    
    return (
      <button
        key={`${slot.date}-${slot.startTime}`}
        className={className}
        onClick={() => onSelect(slot)}
        disabled={!isAvailable || isPast}
        aria-label={`${slot.startTime}${isAvailable ? ' - Available' : ' - Unavailable'}`}
      >
        <span className="slot-time">{slot.startTime}</span>
        <span className="slot-status">
          {isSelected && '✓'}
          {!isAvailable && !isPast && '🔒'}
          {isPast && '⏳'}
        </span>
      </button>
    )
  }

  if (loading) {
    return (
      <div className="time-selector-loading">
        <LoadingSpinner size="small" message="Loading available times..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="time-selector-error">
        <p>{error}</p>
      </div>
    )
  }

  if (timeSlots.length === 0) {
    return (
      <div className="time-selector-empty">
        <span className="empty-icon">🕐</span>
        <p>No time slots available</p>
        <p className="empty-hint">Please select another date</p>
      </div>
    )
  }

  return (
    <div className="time-selector">
      <div className="time-slots-grid">
        {timeSlots.map(renderSlot)}
      </div>
      <div className="time-legend">
        <span className="legend-dot available-dot" />
        <span>Available</span>
        <span className="legend-dot unavailable-dot" />
        <span>Unavailable</span>
        <span className="legend-dot selected-dot" />
        <span>Selected</span>
      </div>
    </div>
  )
}

export default TimeSlotSelector