import React, { useState } from 'react'
import Button from '../common/Button'
import './FilterPanel.css'

const FilterPanel = ({ isOpen, filters, onFilterChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    onFilterChange(localFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      radius: 5,
      minRating: 0,
      maxPrice: null,
      serviceId: null,
      sortBy: 'distance'
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  if (!isOpen) return null

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="filter-close" onClick={onClose}>✕</button>
      </div>

      <div className="filter-body">
        {/* Sort By */}
        <div className="filter-group">
          <label className="filter-label">Sort By</label>
          <div className="filter-options">
            {[
              { value: 'distance', label: 'Distance' },
              { value: 'rating', label: 'Rating' },
              { value: 'price', label: 'Price' }
            ].map((option) => (
              <button
                key={option.value}
                className={`filter-option ${localFilters.sortBy === option.value ? 'active' : ''}`}
                onClick={() => handleFilterChange('sortBy', option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="filter-group">
          <label className="filter-label">Minimum Rating</label>
          <div className="filter-options">
            {[0, 1, 2, 3, 4].map((rating) => (
              <button
                key={rating}
                className={`filter-option ${localFilters.minRating === rating ? 'active' : ''}`}
                onClick={() => handleFilterChange('minRating', rating)}
              >
                {rating === 0 ? 'Any' : `${rating}+ ⭐`}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <label className="filter-label">Max Price</label>
          <div className="filter-options">
            {[
              { value: null, label: 'Any' },
              { value: 50, label: 'R50' },
              { value: 100, label: 'R100' },
              { value: 200, label: 'R200' },
              { value: 500, label: 'R500' }
            ].map((option) => (
              <button
                key={option.value || 'any'}
                className={`filter-option ${localFilters.maxPrice === option.value ? 'active' : ''}`}
                onClick={() => handleFilterChange('maxPrice', option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Radius */}
        <div className="filter-group">
          <label className="filter-label">Radius: {localFilters.radius} km</label>
          <input
            type="range"
            min="1"
            max="50"
            value={localFilters.radius}
            onChange={(e) => handleFilterChange('radius', parseInt(e.target.value))}
            className="filter-slider"
          />
          <div className="filter-range-labels">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>
      </div>

      <div className="filter-footer">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="primary" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

export default FilterPanel