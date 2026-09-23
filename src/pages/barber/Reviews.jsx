// Reviews.jsx
import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import RatingStars from '../../components/common/RatingStars';
import './Reviews.css';

const BarberReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0, distribution: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadReviews(); }, [pagination.page]);

  const loadReviews = async () => {
    setLoading(true); setError(null);
    try {
      const shopId = 'placeholder';
      const response = await reviewService.getShopReviews(shopId, { page: pagination.page, limit: pagination.limit });
      setReviews(response.reviews || []);
      setStats({ average: response.average || 0, total: response.total || 0, distribution: response.ratingDistribution || {} });
      setPagination(response.pagination || { page: 1, limit: 10, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
    } catch (err) { setError(err.message || 'Failed to load reviews'); } finally { setLoading(false); }
  };

  const handleRespond = async (reviewId) => {
    if (!responseText.trim()) return;
    setSaving(true);
    try { await reviewService.respondToReview(reviewId, responseText); setRespondingTo(null); setResponseText(''); await loadReviews(); } catch (err) { setError(err.message || 'Failed to respond to review'); } finally { setSaving(false); }
  };

  const handleHideReview = async (reviewId) => {
    try { await reviewService.moderateReview(reviewId, 'hide'); await loadReviews(); } catch (err) { setError(err.message || 'Failed to hide review'); }
  };

  const handlePageChange = (newPage) => { setPagination(prev => ({ ...prev, page: newPage })); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  if (loading) return <div className="barber-reviews-loading"><LoadingSpinner size="large" message="Loading reviews..." /></div>;

  return (
    <div className="barber-reviews">
      <div className="container">
        <div className="reviews-header">
          <h1>Reviews</h1>
          <div className="header-stats"><span className="stat-item"><span className="stat-number">⭐ {stats.average?.toFixed(1) || '0.0'}</span><span className="stat-label">Average</span></span><span className="stat-item"><span className="stat-number">{stats.total}</span><span className="stat-label">Total Reviews</span></span></div>
        </div>
        {error && <ErrorMessage message={error} onRetry={loadReviews} />}

        {stats.total > 0 && (
          <div className="rating-distribution">
            <h3>Rating Distribution</h3>
            <div className="distribution-bars">
              {[5, 4, 3, 2, 1].map((star) => { const count = stats.distribution[star] || 0; const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0; return (<div key={star} className="dist-bar-row"><span className="dist-label">{star} ★</span><div className="dist-track"><div className="dist-fill" style={{ width: `${percentage}%` }} /></div><span className="dist-count">{count}</span></div>); })}
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">⭐</div><h3>No Reviews Yet</h3><p>Your shop hasn't received any reviews yet.</p></div>
        ) : (
          <>
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="review-user"><span className="user-avatar">{review.customerId?.name?.charAt(0) || 'U'}</span><div className="user-info"><span className="user-name">{review.customerId?.name || 'Anonymous'}</span><span className="review-date">{new Date(review.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</span></div></div>
                    <div className="review-rating"><RatingStars rating={review.rating} size="small" /></div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  {review.barberResponse?.text && (<div className="review-response"><div className="response-header"><span className="response-icon">💈</span><span className="response-label">Your Response</span></div><p className="response-text">{review.barberResponse.text}</p><span className="response-date">{new Date(review.barberResponse.respondedAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</span></div>)}
                  <div className="review-actions">
                    {!review.barberResponse?.text && (<Button variant="outline" size="small" onClick={() => setRespondingTo(review.id)}>Respond</Button>)}
                    {review.status === 'visible' && (<Button variant="danger" size="small" onClick={() => handleHideReview(review.id)}>Hide</Button>)}
                  </div>
                  {respondingTo === review.id && (
                    <div className="response-form">
                      <textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="Write your response to this review..." className="response-input" rows={3} />
                      <div className="response-actions"><Button variant="outline" size="small" onClick={() => { setRespondingTo(null); setResponseText(''); }}>Cancel</Button><Button variant="primary" size="small" onClick={() => handleRespond(review.id)} loading={saving} disabled={saving || !responseText.trim()}>Send Response</Button></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {pagination.total > pagination.limit && (
              <div className="pagination"><button className="page-btn" onClick={() => handlePageChange(pagination.page - 1)} disabled={!pagination.hasPrevPage}>← Previous</button><span className="page-info">Page {pagination.page} of {pagination.pages}</span><button className="page-btn" onClick={() => handlePageChange(pagination.page + 1)} disabled={!pagination.hasNextPage}>Next →</button></div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default BarberReviews;