// src/components/barber/ShopCard.jsx (Fixed)
import React from 'react'
import { useNavigate } from 'react-router-dom'
import RatingStars from '../common/RatingStars'
import './ShopCard.css'

const ShopCard = ({ shop }) => {
  const navigate = useNavigate()
  
  // Get shop ID from either id or _id
  const shopId = shop.id || shop._id

  const handleClick = () => {
    if (shopId) {
      navigate(`/shops/${shopId}`)
    } else {
      console.error('Shop ID is missing:', shop)
    }
  }

  return (
    <div className="shop-card" onClick={handleClick}>
      <div className="shop-card-image">
        {shop.photos && shop.photos.length > 0 ? (
          <img src={shop.photos[0]} alt={shop.name} />
        ) : (
          <div className="shop-card-placeholder">✂️</div>
        )}
      </div>
      <div className="shop-card-content">
        <h3 className="shop-card-name">{shop.name}</h3>
        <div className="shop-card-rating">
          <RatingStars rating={shop.rating || 0} size="small" />
          <span className="review-count">({shop.reviewCount || 0})</span>
        </div>
        {shop.distance && (
          <p className="shop-card-distance">
            📍 {shop.distance.formatted || `${shop.distance.km?.toFixed(1)} km`}
          </p>
        )}
        <p className="shop-card-address">
          {shop.address?.city}, {shop.address?.province}
        </p>
      </div>
    </div>
  )
}

export default ShopCard