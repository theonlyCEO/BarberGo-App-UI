import React, { useState, useEffect } from 'react'
import './Toast.css'

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, 300)
  }

  if (!isVisible) return null

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  return (
    <div 
      className={`toast toast-${type} ${isExiting ? 'toast-exiting' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <span className="toast-icon" aria-hidden="true">{icons[type] || icons.info}</span>
      <span className="toast-message">{message}</span>
      <button 
        className="toast-close" 
        onClick={handleClose}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  )
}

export const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id || index}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemove?.(toast.id)}
        />
      ))}
    </div>
  )
}

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
    
    // Auto remove after duration + animation time
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration + 300)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return {
    toasts,
    addToast,
    removeToast,
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  }
}

export default Toast