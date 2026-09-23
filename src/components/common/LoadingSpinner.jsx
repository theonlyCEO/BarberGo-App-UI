import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner = ({ 
  size = 'medium', 
  fullPage = false, 
  message = '',
  variant = 'default' // 'default' | 'overlay'
}) => {
  const classes = [
    'spinner',
    `spinner-${size}`,
    fullPage ? 'spinner-full-page' : '',
    variant === 'overlay' ? 'spinner-overlay' : '',
    `spinner-${variant}`
  ].filter(Boolean).join(' ')

  return (
    <div 
      className={classes} 
      role="status" 
      aria-live="polite"
      aria-label={message || 'Loading'}
    >
      <div className="spinner-ring" aria-hidden="true" />
      {message && <p className="spinner-message">{message}</p>}
      <span className="sr-only">{message || 'Loading content'}</span>
    </div>
  )
}

export default LoadingSpinner