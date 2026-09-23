// Reviews.jsx
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import RatingStars from '../../components/common/RatingStars';
import './Reviews.css';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
  const [filters, setFilters] = useState({ status: 'flagged', rating: '', shopId: '' });
  const [showFilters, setShowFilters] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => { loadReviews(); }, [pagination.page, filters]);

  const loadReviews = async () => {
    setLoading(true); setError(null);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.rating) params.rating = filters.rating;
      if (filters.shopId) params.shopId = filters.shopId;
      const response = await adminService.getAllReviews(params);
      setReviews(response.reviews || []);
      setPagination(response.pagination || { page: 1, limit: 20, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
    } catch (err) { setError(err.message || 'Failed to load reviews'); } finally { setLoading(false); }
  };

  const handleModerate = async (reviewId, action) => {
    setProcessingId(reviewId);
    try { await adminService.moderateReview(reviewId, action); await loadReviews(); } catch (err) { setError(err.message || 'Failed to moderate review'); } finally { setProcessingId(null); }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    setProcessingId(reviewId);
    try { await adminService.deleteReview(reviewId); await loadReviews(); } catch (err) { setError(err.message || 'Failed to delete review'); } finally { setProcessingId(null); }
  };

  const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); setPagination(prev => ({ ...prev, page: 1 })); };
  const handlePageChange = (newPage) => { setPagination(prev => ({ ...prev, page: newPage })); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const getStatusBadge = (status) => ({ visible: 'visible', hidden: 'hidden', flagged: 'flagged' }[status] || '');

  if (loading) return <div className="admin-reviews-loading"><LoadingSpinner size="large" message="Loading reviews..." /></div>;

  return (
    <div className="admin-reviews">
      <div className="container">
        <div className="reviews-header">
          <h1>Review Moderation</h1>
          <div className="header-actions"><Button variant="outline" onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide Filters' : 'Show Filters'}</Button></div>
        </div>
        {error && <ErrorMessage message={error} onRetry={loadReviews} />}

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-row">
              <div className="filter-group"><label>Status</label><select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select"><option value="all">All</option><option value="visible">Visible</option><option value="hidden">Hidden</option><option value="flagged">Flagged</option></select></div>
              <div className="filter-group"><label>Rating</label><select name="rating" value={filters.rating} onChange={handleFilterChange} className="filter-select"><option value="">All</option><option value="1">1 Star</option><option value="2">2 Stars</option><option value="3">3 Stars</option><option value="4">4 Stars</option><option value="5">5 Stars</option></select></div>
              <div className="filter-group"><label>Shop ID</label><input type="text" name="shopId" value={filters.shopId} onChange={handleFilterChange} placeholder="Filter by shop ID..." className="filter-input" /></div>
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">⭐</div><h3>No Reviews Found</h3><p>No reviews match your current filters.</p></div>
        ) : (
          <>
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="review-info">
                      <div className="review-shop"><span className="shop-name">{review.shopId?.name || 'Unknown Shop'}</span><span className={`status-badge ${getStatusBadge(review.status)}`}>{review.status}</span></div>
                      <div className="review-user"><span className="user-name">{review.customerId?.name || 'Anonymous'}</span><span className="user-email">{review.customerId?.email || ''}</span></div>
                    </div>
                    <div className="review-rating"><RatingStars rating={review.rating} size="small" /></div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  {review.photos && review.photos.length > 0 && (
                    <div className="review-photos">
                      {review.photos.slice(0, 3).map((photo, index) => (<img key={index} src={photo} alt={`Review photo ${index + 1}`} className="review-photo" />))}
                      {review.photos.length > 3 && (<span className="photo-more">+{review.photos.length - 3} more</span>)}
                    </div>
                  )}
                  <div className="review-meta">
                    <span className="review-date">{new Date(review.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span className="helpful-count">👍 {review.helpfulCount || 0}</span>
                    {review.isVerified && (<span className="verified-badge">✓ Verified</span>)}
                  </div>
                  <div className="review-actions">
                    {review.status === 'flagged' && (<><Button variant="success" size="small" onClick={() => handleModerate(review.id, 'show')} loading={processingId === review.id} disabled={processingId === review.id}>Approve</Button><Button variant="danger" size="small" onClick={() => handleModerate(review.id, 'hide')} loading={processingId === review.id} disabled={processingId === review.id}>Hide</Button></>)}
                    {review.status === 'visible' && (<><Button variant="warning" size="small" onClick={() => handleModerate(review.id, 'flag')} loading={processingId === review.id} disabled={processingId === review.id}>Flag</Button><Button variant="danger" size="small" onClick={() => handleModerate(review.id, 'hide')} loading={processingId === review.id} disabled={processingId === review.id}>Hide</Button><Button variant="outline" size="small" onClick={() => handleModerate(review.id, 'verify')} loading={processingId === review.id} disabled={processingId === review.id}>Verify</Button></>)}
                    {review.status === 'hidden' && (<Button variant="success" size="small" onClick={() => handleModerate(review.id, 'show')} loading={processingId === review.id} disabled={processingId === review.id}>Restore</Button>)}
                    <Button variant="danger" size="small" onClick={() => handleDelete(review.id)} loading={processingId === review.id} disabled={processingId === review.id}>Delete</Button>
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
export default AdminReviews;