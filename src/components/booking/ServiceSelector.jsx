import React, { useState } from 'react'
import './ServiceSelector.css'

const ServiceSelector = ({ services, selectedService, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Get unique categories
  const categories = ['all', ...new Set(services.map(s => s.category || 'General'))]

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }

  return (
    <div className="service-selector">
      {/* Search */}
      <div className="service-search">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Categories */}
      <div className="service-categories">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All' : category}
          </button>
        ))}
      </div>

      {/* Services List */}
      <div className="service-list">
        {filteredServices.length === 0 ? (
          <p className="no-services">No services found</p>
        ) : (
          filteredServices.map(service => (
            <div
              key={service.id}
              className={`service-item ${selectedService?.id === service.id ? 'selected' : ''}`}
              onClick={() => onSelect(service)}
            >
              <div className="service-info">
                <h4 className="service-name">{service.name}</h4>
                {service.category && (
                  <span className="service-category">{service.category}</span>
                )}
                {service.description && (
                  <p className="service-description">{service.description}</p>
                )}
                <div className="service-meta">
                  <span className="service-duration">⏱️ {formatDuration(service.durationMinutes)}</span>
                </div>
              </div>
              <div className="service-price">
                R{service.price.toFixed(2)}
                {selectedService?.id === service.id && (
                  <span className="selected-check">✓</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ServiceSelector