import React, { useState, useEffect } from 'react'
import { shopService } from '../../services/shopService'
import LoadingSpinner from '../common/LoadingSpinner'
import './DateSelector.css'

const DateSelector = ({ shopId, serviceId, selectedDate, onSelect }) => {
  const [availableDates, setAvailableDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    const loadAvailableDates = async () => {
      if (!shopId || !serviceId) return
      
      setLoading(true)
      setError(null)
      
      try {
        // Use getAvailableDates endpoint instead of getAvailability
        const response = await shopService.getAvailableDates(shopId, {
          serviceId,
          days: 30
        })
        
        // Extract available dates from response
        const dates = response.availableDates
          ?.map(item => item.date)
          ?.filter(Boolean) || []
        
        setAvailableDates(dates)
      } catch (err) {
        console.error('Failed to load available dates:', err)
        setError(err.response?.data?.error?.message || err.message || 'Failed to load available dates')
      } finally {
        setLoading(false)
      }
    }
    
    loadAvailableDates()
  }, [shopId, serviceId])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    return { daysInMonth, startingDay, firstDay, lastDay }
  }

  const isDateAvailable = (dateString) => {
    return availableDates.includes(dateString)
  }

  const isDatePast = (dateString) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(dateString)
    compareDate.setHours(0, 0, 0, 0)
    return compareDate < today
  }

  const isDateToday = (dateString) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(dateString)
    compareDate.setHours(0, 0, 0, 0)
    return compareDate.getTime() === today.getTime()
  }

  const handleDateClick = (dateString) => {
    if (isDateAvailable(dateString) && !isDatePast(dateString)) {
      onSelect(dateString)
    }
  }

  const changeMonth = (increment) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + increment)
    setCurrentMonth(newMonth)
  }

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-ZA', {
      month: 'long',
      year: 'numeric'
    })
  }

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth)
    const days = []
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    weekdays.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="calendar-header">
          {day}
        </div>
      )
    })
    
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />)
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const isAvailable = isDateAvailable(dateString)
      const isPast = isDatePast(dateString)
      const isSelected = selectedDate === dateString
      const isToday = isDateToday(dateString)
      
      let className = 'calendar-day'
      if (isPast) className += ' past'
      if (isAvailable && !isPast) className += ' available'
      if (isSelected) className += ' selected'
      if (isToday) className += ' today'
      if (!isAvailable && !isPast) className += ' unavailable'
      
      days.push(
        <div
          key={day}
          className={className}
          onClick={() => handleDateClick(dateString)}
          role="button"
          tabIndex={0}
          aria-label={`${day} ${formatMonthYear(currentMonth)}${isAvailable ? ' - Available' : ' - Unavailable'}`}
        >
          {day}
          {isSelected && <span className="selected-indicator">✓</span>}
        </div>
      )
    }
    
    return days
  }

  if (loading) {
    return (
      <div className="date-selector-loading">
        <LoadingSpinner size="small" message="Loading available dates..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="date-selector-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="date-selector">
      <div className="calendar-nav">
        <button onClick={() => changeMonth(-1)} className="nav-btn" aria-label="Previous month">
          ‹
        </button>
        <span className="month-label">{formatMonthYear(currentMonth)}</span>
        <button onClick={() => changeMonth(1)} className="nav-btn" aria-label="Next month">
          ›
        </button>
      </div>
      
      <div className="calendar-grid">
        {renderCalendar()}
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot available-dot" />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot unavailable-dot" />
          <span>Unavailable</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot selected-dot" />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot past-dot" />
          <span>Past</span>
        </div>
      </div>
    </div>
  )
}

export default DateSelector