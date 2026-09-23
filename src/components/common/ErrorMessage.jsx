import React from 'react'
import './ErrorMessage.css'

const ErrorMessage = ({ message, onRetry, variant = 'error' }) => {
  if (!message) return null

  return (
    <div className={`error-message error-${variant}`}>
      <span className="error-icon">
        {variant === 'error' && '⚠️'}
        {variant === 'warning' && '⚡'}
        {variant === 'info' && 'ℹ️'}
      </span>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-retry">
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage