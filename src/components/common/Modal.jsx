import React, { useEffect, useRef } from 'react'
import Button from './Button'
import './Modal.css'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actions,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true
}) => {
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocusRef.current = document.activeElement
      // Focus the modal
      modalRef.current?.focus()
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore focus
      previousFocusRef.current?.focus()
      // Restore body scroll
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && closeOnEscape && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, closeOnEscape])

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div 
        ref={modalRef}
        className={`modal-content modal-${size}`}
        tabIndex={-1}
      >
        {title && (
          <div className="modal-header">
            <h3 id="modal-title" className="modal-title">{title}</h3>
            <button 
              className="modal-close" 
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="modal-body">
          {children}
        </div>

        {actions && (
          <div className="modal-footer">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'primary'}
                onClick={action.onClick}
                loading={action.loading}
                disabled={action.disabled}
                fullWidth={actions.length === 1}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal