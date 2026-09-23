import React from 'react'
import './Skeleton.css'

export const SkeletonText = ({ lines = 1, width = '100%', className = '' }) => {
  return (
    <div className={`skeleton-text ${className}`} style={{ width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="skeleton-line"
          style={{ 
            width: i === lines - 1 && lines > 1 ? '80%' : '100%',
            height: '1rem',
            marginBottom: i < lines - 1 ? '0.5rem' : '0'
          }}
        />
      ))}
    </div>
  )
}

export const SkeletonCard = ({ count = 1, className = '' }) => {
  return (
    <div className={`skeleton-card ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card-item">
          <div className="skeleton-image" />
          <div className="skeleton-content">
            <div className="skeleton-title" />
            <div className="skeleton-text-short" />
            <div className="skeleton-text-short" />
          </div>
        </div>
      ))}
    </div>
  )
}

export const SkeletonShopCard = ({ count = 3 }) => {
  return (
    <div className="skeleton-shop-cards">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-shop-card">
          <div className="skeleton-image" />
          <div className="skeleton-content">
            <div className="skeleton-title" />
            <div className="skeleton-text-short" />
            <div className="skeleton-text-short" />
            <div className="skeleton-text-short" style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export const SkeletonAppointment = ({ count = 3 }) => {
  return (
    <div className="skeleton-appointments">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-appointment">
          <div className="skeleton-appointment-header">
            <div className="skeleton-title" style={{ width: '40%' }} />
            <div className="skeleton-text-short" style={{ width: '20%' }} />
          </div>
          <div className="skeleton-appointment-body">
            <div className="skeleton-text-short" />
            <div className="skeleton-text-short" style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default {
  SkeletonText,
  SkeletonCard,
  SkeletonShopCard,
  SkeletonAppointment
}