
import React from 'react'
import './OpeningHours.css'

const OpeningHours = ({ hours, timezone = 'Africa/Johannesburg', showTimezone = true }) => {
  const daysOfWeek = [
    { value: 0, label: 'Monday' },
    { value: 1, label: 'Tuesday' },
    { value: 2, label: 'Wednesday' },
    { value: 3, label: 'Thursday' },
    { value: 4, label: 'Friday' },
    { value: 5, label: 'Saturday' },
    { value: 6, label: 'Sunday' }
  ]

  // Get today's day of week
  const today = new Date().getDay()
  // Convert Sunday (0) to Monday (0) format
  const todayIndex = today === 0 ? 6 : today - 1

  const getHoursForDay = (dayValue) => {
    const dayHours = hours?.find(h => h.dayOfWeek === dayValue)
    return dayHours
  }

  const formatHours = (periods) => {
    if (!periods || periods.length === 0) return 'Closed'
    return periods.map(p => `${p.start} - ${p.end}`).join(', ')
  }

  const isDayToday = (dayValue) => {
    return dayValue === todayIndex
  }

  return (
    <div className="opening-hours">
      {hours && hours.length > 0 ? (
        <div className="hours-list">
          {daysOfWeek.map((day) => {
            const dayHours = getHoursForDay(day.value)
            const isToday = isDayToday(day.value)
            const isOpen = dayHours?.isOpen && dayHours?.periods?.length > 0
            const periods = dayHours?.periods || []

            return (
              <div key={day.value} className={`hours-row ${isToday ? 'today' : ''}`}>
                <span className="hours-day">
                  {day.label}
                  {isToday && <span className="today-badge">Today</span>}
                </span>
                <span className={`hours-time ${isOpen ? 'open' : 'closed'}`}>
                  {isOpen ? formatHours(periods) : 'Closed'}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="no-hours">Opening hours not available</p>
      )}
      
      {showTimezone && timezone && (
        <div className="hours-timezone">
          <span className="timezone-label">Timezone:</span>
          <span className="timezone-value">{timezone}</span>
        </div>
      )}
    </div>
  )
}

export default OpeningHours