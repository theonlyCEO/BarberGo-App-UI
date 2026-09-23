// Barbers.jsx
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import RatingStars from '../../components/common/RatingStars';
import './Barbers.css';

const AdminBarbers = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
  const [filters, setFilters] = useState({ status: 'pending', search: '' });
  const [showFilters, setShowFilters] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [rejectModal, setRejectModal] = useState({ show: false, shopId: null, reason: '' });

  useEffect(() => { loadShops(); }, [pagination.page, filters]);

  const loadShops = async () => {
    setLoading(true); setError(null);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.search) params.search = filters.search;
      const response = await adminService.getAllShops(params);
      setShops(response.shops || []);
      setPagination(response.pagination || { page: 1, limit: 20, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
    } catch (err) { setError(err.message || 'Failed to load shops'); } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (shopId, newStatus, reason = null) => {
    setProcessingId(shopId); setError(null);
    try {
      if (!shopId || typeof shopId !== 'string') throw new Error('Invalid shop ID');
      await adminService.updateShopStatus(shopId, newStatus, reason);
      await loadShops();
    } catch (err) { setError(err.response?.data?.error?.message || err.message || 'Failed to update shop status'); } finally { setProcessingId(null); }
  };

  const handleReject = (shopId) => setRejectModal({ show: true, shopId, reason: '' });
  const handleConfirmReject = async () => {
    const { shopId, reason } = rejectModal;
    if (!reason.trim()) { setError('Please provide a reason for rejection'); return; }
    setRejectModal({ show: false, shopId: null, reason: '' });
    await handleStatusUpdate(shopId, 'rejected', reason);
  };

  const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); setPagination(prev => ({ ...prev, page: 1 })); };
  const handlePageChange = (newPage) => { setPagination(prev => ({ ...prev, page: newPage })); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const getStatusBadge = (status) => ({ pending: 'pending', approved: 'approved', rejected: 'rejected', suspended: 'suspended' }[status] || '');

  if (loading) return <div className="admin-barbers-loading"><LoadingSpinner size="large" message="Loading barbers..." /></div>;

  return (
    <div className="admin-barbers">
      <div className="container">
        <div className="barbers-header">
          <h1>Barber Management</h1>
          <div className="header-actions">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide Filters' : 'Show Filters'}</Button>
          </div>
        </div>
        {error && <ErrorMessage message={error} onRetry={loadShops} />}

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-row">
              <div className="filter-group">
                <label>Status</label>
                <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Search</label>
                <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search by name or city..." className="filter-input" />
              </div>
            </div>
          </div>
        )}

        {shops.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🏪</div><h3>No Shops Found</h3><p>No shops match your current filters.</p></div>
        ) : (
          <>
            <div className="shops-list">
              {shops.map((shop) => (
                <div key={shop.id} className="shop-item">
                  <div className="shop-main">
                    <div className="shop-info">
                      <h3 className="shop-name">{shop.name}</h3>
                      <div className="shop-meta">
                        <span className="shop-owner">👤 {shop.ownerId?.name || 'Unknown Owner'}</span>
                        <span className="shop-email">✉️ {shop.ownerId?.email || 'No email'}</span>
                        <span className="shop-phone">📞 {shop.phone || 'No phone'}</span>
                      </div>
                      <div className="shop-address">📍 {shop.address?.street}, {shop.address?.city}, {shop.address?.province}</div>
                      <div className="shop-rating"><RatingStars rating={shop.rating} size="small" /><span className="review-count">({shop.reviewCount} reviews)</span></div>
                    </div>
                    <div className="shop-status"><span className={`status-badge ${getStatusBadge(shop.status)}`}>{shop.status?.charAt(0).toUpperCase() + shop.status?.slice(1)}</span></div>
                  </div>
                  <div className="shop-actions">
                    {shop.status === 'pending' && (<><Button variant="success" size="small" onClick={() => handleStatusUpdate(shop.id, 'approved')} loading={processingId === shop.id} disabled={processingId === shop.id}>Approve</Button><Button variant="danger" size="small" onClick={() => handleReject(shop.id)} loading={processingId === shop.id} disabled={processingId === shop.id}>Reject</Button></>)}
                    {shop.status === 'approved' && (<><Button variant="danger" size="small" onClick={() => handleStatusUpdate(shop.id, 'suspended')} loading={processingId === shop.id} disabled={processingId === shop.id}>Suspend</Button><Button variant="outline" size="small" onClick={() => handleStatusUpdate(shop.id, 'pending')} loading={processingId === shop.id} disabled={processingId === shop.id}>Set Pending</Button></>)}
                    {shop.status === 'suspended' && (<Button variant="success" size="small" onClick={() => handleStatusUpdate(shop.id, 'approved')} loading={processingId === shop.id} disabled={processingId === shop.id}>Reinstate</Button>)}
                    {shop.status === 'rejected' && (<Button variant="outline" size="small" onClick={() => handleStatusUpdate(shop.id, 'pending')} loading={processingId === shop.id} disabled={processingId === shop.id}>Reset to Pending</Button>)}
                    {shop.rejectionReason && (<div className="rejection-reason"><span className="reason-label">Reason:</span><span className="reason-text">{shop.rejectionReason}</span></div>)}
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

        {rejectModal.show && (
          <div className="modal-overlay" onClick={() => setRejectModal({ show: false, shopId: null, reason: '' })}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Reject Shop</h3>
              <p>Please provide a reason for rejecting this shop. This will be visible to the barber.</p>
              <div className="form-group"><label>Rejection Reason</label><textarea value={rejectModal.reason} onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))} className="form-input" rows={4} placeholder="Explain why the shop is being rejected..." /></div>
              <div className="modal-actions"><Button variant="outline" onClick={() => setRejectModal({ show: false, shopId: null, reason: '' })}>Cancel</Button><Button variant="danger" onClick={handleConfirmReject}>Reject Shop</Button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminBarbers;