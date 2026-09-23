// Reviews.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewService } from '../../services/reviewService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import RatingStars from '../../components/common/RatingStars';
import './Reviews.css';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });

  useEffect(() => { loadReviews(); }, [pagination.page]);

  const loadReviews = async () => {
    setLoading(true); setError(null);
    try {
      const response = await reviewService.getMyReviews({ page: pagination.page, limit: pagination.limit });
      setReviews(response.reviews || []);
      setPagination(response.pagination || { page: 1, limit: 10, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
    } catch (err) { setError(err.message || 'Failed to load reviews'); } finally { setLoading(false); }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try { await reviewService.deleteReview(reviewId); await loadReviews(); } catch (err) { setError(err.message); }
  };

  const handlePageChange = (newPage) => { setPagination(prev => ({ ...prev, page: newPage })); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  if (loading) return <div className="customer-reviews-loading"><LoadingSpinner size="large" message="Loading your reviews..." /></div>;

  return (
    <div className="customer-reviews">
      <div className="container">
        <div className="reviews-header">
          <h1>My Reviews</h1>
          <Link to="/find"><Button variant="primary" size="small">Write a Review</Button></Link>
        </div>
        {error && <ErrorMessage message={error} onRetry={loadReviews} />}
        {reviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✍️</div>
            <h3>No Reviews Yet</h3>
            <p>You haven't written any reviews yet. Review your completed appointments!</p>
            <Link to="/customer/appointments"><Button variant="primary">View Appointments</Button></Link>
          </div>
        ) : (
          <>
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="review-shop">
                      <span className="shop-name">{review.shopId?.name || 'Unknown Shop'}</span>
                      <span className={`review-status ${review.status}`}>{review.status === 'visible' ? 'Public' : review.status}</span>
                    </div>
                    <div className="review-actions">
                      <Link to={`/shops/${review.shopId?._id || review.shopId}`}><Button variant="outline" size="small">View Shop</Button></Link>
                      <Button variant="danger" size="small" onClick={() => handleDeleteReview(review.id)}>Delete</Button>
                    </div>
                  </div>
                  <div className="review-content">
                    <div className="review-rating">
                      <RatingStars rating={review.rating} size="medium" />
                      <span className="review-date">{new Date(review.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    {review.barberResponse?.text && (
                      <div className="review-response">
                        <div className="response-header"><span className="response-icon">💈</span><span className="response-label">Barber Response</span></div>
                        <p className="response-text">{review.barberResponse.text}</p>
                      </div>
                    )}
                    <div className="review-meta"><span className="helpful-count">👍 {review.helpfulCount || 0} people found this helpful</span></div>
                  </div>
                </div>
              ))}
            </div>
            {pagination.total > pagination.limit && (
              <div className="pagination">
                <button className="page-btn" onClick={() => handlePageChange(pagination.page - 1)} disabled={!pagination.hasPrevPage}>← Previous</button>
                <span className="page-info">Page {pagination.page} of {pagination.pages}</span>
                <button className="page-btn" onClick={() => handlePageChange(pagination.page + 1)} disabled={!pagination.hasNextPage}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default CustomerReviews;