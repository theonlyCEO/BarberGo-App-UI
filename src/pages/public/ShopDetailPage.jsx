// ShopDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { shopService } from '../../services/shopService';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import RatingStars from '../../components/common/RatingStars';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ServiceCard from '../../components/barber/ServiceCard';
import ReviewCard from '../../components/barber/ReviewCard';
import OpeningHours from '../../components/barber/OpeningHours';
import ShopMap from '../../components/map/ShopMap';
import './ShopDetailPage.css';

const ShopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { location: userLocation } = useLocation();
  
  const [shop, setShop] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('services');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewPagination, setReviewPagination] = useState({});
  
  const servicesRef = useRef(null);
  const reviewsRef = useRef(null);
  const hoursRef = useRef(null);

  useEffect(() => {
    const isValidId = id && typeof id === 'string' && id !== '[object Object]' && id !== 'undefined' && id.trim() !== '';
    if (!isValidId) { setError('Invalid shop ID.'); setLoading(false); return; }
    const loadShop = async () => {
      setLoading(true); setError(null);
      try {
        const params = userLocation ? { latitude: userLocation.latitude, longitude: userLocation.longitude } : {};
        const shopData = await shopService.getShopById(id, params);
        setShop(shopData);
        try { const servicesData = await shopService.getServices(id, { activeOnly: true }); setServices(servicesData.services || []); } catch (e) { setServices([]); }
        await loadReviews(1);
      } catch (err) { setError(err.message || 'Failed to load shop details'); } finally { setLoading(false); }
    };
    loadShop();
  }, [id, userLocation]);

  const loadReviews = async (page) => {
    if (!id || typeof id !== 'string') return;
    setReviewLoading(true);
    try {
      const response = await reviewService.getShopReviews(id, { page, limit: 10, sortBy: 'newest' });
      setReviews(response.reviews || []);
      setReviewStats(response.ratingDistribution || {});
      setReviewPagination(response.pagination || {});
      setReviewPage(page);
    } catch (err) {} finally { setReviewLoading(false); }
  };

  const handleBookNow = () => {
    if (!id || typeof id !== 'string') return;
    if (!isAuthenticated) { navigate('/login', { state: { from: `/shops/${id}` } }); return; }
    navigate(`/shops/${id}/book`);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'services' && servicesRef.current) servicesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (tab === 'reviews' && reviewsRef.current) reviewsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (tab === 'hours' && hoursRef.current) hoursRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return <div className="shop-detail-loading"><LoadingSpinner size="large" message="Loading shop details..." /></div>;
  if (error || !shop) return <div className="shop-detail-error"><div className="container"><ErrorMessage message={error || 'Shop not found'} onRetry={() => window.location.reload()} /><Link to="/find" className="back-link">← Back to Find Barbers</Link></div></div>;

  const { name, description, phone, email, address, photos = [], rating = 0, reviewCount = 0, distance, timezone, openingHours = [], isOpen = false, status } = shop;
  const isApproved = status === 'approved';
  const hasPhotos = photos && photos.length > 0;
  const displayPhotos = hasPhotos ? photos.slice(0, 4) : [];
  const hasExtraPhotos = hasPhotos && photos.length > 4;

  return (
    <div className="shop-detail-page">
      <div className="shop-hero">
        <div className="shop-hero-background">
          {hasPhotos ? <img src={photos[0]} alt={name} className="hero-bg-image" /> : <div className="hero-bg-placeholder"></div>}
          <div className="hero-overlay" />
        </div>
        <div className="container">
          <div className="shop-hero-content">
            <div className="shop-hero-info">
              <h1 className="shop-name">{name}</h1>
              <div className="shop-meta">
                <div className="shop-rating"><RatingStars rating={rating} size="medium" showNumber /><span className="review-count">({reviewCount} reviews)</span></div>
                {distance && <span className="shop-distance">📍 {distance.formatted || `${distance.km.toFixed(1)} km`}</span>}
                <span className={`shop-status ${isOpen ? 'open' : 'closed'}`}>{isOpen ? '● Open Now' : '● Closed'}</span>
              </div>
              <p className="shop-address">{address?.street}, {address?.city}, {address?.province} {address?.postalCode}</p>
              <div className="shop-contact">{phone && <span>📞 {phone}</span>}{email && <span>✉️ {email}</span>}</div>
            </div>
            <div className="shop-hero-actions">
              {isApproved ? <Button variant="primary" size="large" onClick={handleBookNow}>Book Appointment</Button> : <div className="shop-status-message"><span className="status-badge pending">Pending Approval</span><p>This shop is currently being reviewed</p></div>}
            </div>
          </div>
        </div>
      </div>

      {hasPhotos && displayPhotos.length > 0 && (
        <div className="shop-gallery">
          <div className="container">
            <div className="gallery-grid">
              {displayPhotos.map((photo, index) => <div key={index} className="gallery-item"><img src={photo} alt={`${name} - Photo ${index + 1}`} /></div>)}
              {hasExtraPhotos && <div className="gallery-item gallery-more"><span>+{photos.length - 4} more</span></div>}
            </div>
          </div>
        </div>
      )}

      <div className="shop-tabs">
        <div className="container">
          <div className="tab-list">
            <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => handleTabChange('services')}>Services & Prices</button>
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => handleTabChange('reviews')}>Reviews ({reviewCount})</button>
            <button className={`tab-btn ${activeTab === 'hours' ? 'active' : ''}`} onClick={() => handleTabChange('hours')}>Opening Hours</button>
          </div>
        </div>
      </div>

      <div className="shop-content">
        <div className="container">
          <div className="shop-content-grid">
            <div className="shop-main">
              {description && <div className="shop-description"><h3>About</h3><p>{description}</p></div>}
              <div ref={servicesRef} className="shop-section"><h3>Services & Prices</h3>{services.length > 0 ? <div className="services-list">{services.map((service) => <ServiceCard key={service.id || service._id} service={service} />)}</div> : <p className="no-services">No services available.</p>}</div>
              <div ref={reviewsRef} className="shop-section">
                <div className="reviews-header">
                  <h3>Reviews</h3>
                  {reviewStats && (
                    <div className="review-stats">
                      <div className="review-rating-summary"><span className="big-rating">{rating.toFixed(1)}</span><div><RatingStars rating={rating} size="small" /><span className="review-total">{reviewCount} reviews</span></div></div>
                      <div className="rating-bars">{[5,4,3,2,1].map((star) => { const count = reviewStats[star] || 0; const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0; return <div key={star} className="rating-bar-row"><span className="rating-bar-label">{star} ★</span><div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: `${percentage}%` }} /></div><span className="rating-bar-count">{count}</span></div>; })}</div>
                    </div>
                  )}
                </div>
                {reviewLoading ? <LoadingSpinner size="small" /> : reviews.length > 0 ? <><div className="reviews-list">{reviews.map((review) => <ReviewCard key={review.id || review._id} review={review} />)}</div>{reviewPagination?.hasNextPage && <div className="load-more-reviews"><Button variant="outline" onClick={() => loadReviews(reviewPage + 1)}>Load More Reviews</Button></div>}</> : <p className="no-reviews">No reviews yet. Be the first to review!</p>}
              </div>
            </div>

            <div className="shop-sidebar">
              <div ref={hoursRef} className="sidebar-card"><h4>Opening Hours</h4><OpeningHours hours={openingHours} timezone={timezone} /></div>
              <div className="sidebar-card"><h4>Location</h4><div className="shop-map-wrapper"><ShopMap shop={shop} userLocation={userLocation} /></div><p className="map-address">{address?.street}, {address?.city}</p><Button variant="outline" size="small" fullWidth onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${address?.street},${address?.city}`, '_blank')}>Get Directions</Button></div>
              {isApproved && <div className="sidebar-card quick-actions"><h4>Quick Actions</h4><Button variant="primary" fullWidth onClick={handleBookNow}>Book Appointment</Button>{phone && <Button variant="outline" fullWidth onClick={() => window.location.href = `tel:${phone}`}>Call Shop</Button>}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShopDetailPage;