// Appointments.jsx
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './Appointments.css';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
  const [filters, setFilters] = useState({ status: '', date: '', shopId: '' });
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => { loadAppointments(); }, [pagination.page, filters]);

  const loadAppointments = async () => {
    setLoading(true); setError(null);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;
      if (filters.shopId) params.shopId = filters.shopId;
      const response = await adminService.getAllAppointments(params);
      setAppointments(response.appointments || []);
      setPagination(response.pagination || { page: 1, limit: 20, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
    } catch (err) { setError(err.message || 'Failed to load appointments'); } finally { setLoading(false); }
  };

  const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); setPagination(prev => ({ ...prev, page: 1 })); };
  const handlePageChange = (newPage) => { setPagination(prev => ({ ...prev, page: newPage })); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  if (loading) return <div className="admin-appointments-loading"><LoadingSpinner size="large" message="Loading appointments..." /></div>;

  return (
    <div className="admin-appointments">
      <div className="container">
        <div className="appointments-header">
          <h1>All Appointments</h1>
          <div className="header-actions"><Button variant="outline" onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide Filters' : 'Show Filters'}</Button></div>
        </div>
        {error && <ErrorMessage message={error} onRetry={loadAppointments} />}

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-row">
              <div className="filter-group"><label>Status</label><select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select"><option value="">All</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="no_show">No Show</option></select></div>
              <div className="filter-group"><label>Date</label><input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="filter-input" /></div>
              <div className="filter-group"><label>Shop ID</label><input type="text" name="shopId" value={filters.shopId} onChange={handleFilterChange} placeholder="Filter by shop ID..." className="filter-input" /></div>
            </div>
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div><h3>No Appointments Found</h3><p>No appointments match your current filters.</p></div>
        ) : (
          <>
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-info">
                    <div className="appointment-shop"><span className="shop-name">{appointment.shopId?.name || 'Unknown Shop'}</span></div>
                    <div className="appointment-customer"><span className="customer-name">{appointment.customerId?.name || 'Unknown'}</span><span className="customer-email">{appointment.customerId?.email || ''}</span></div>
                    <div className="appointment-service"><span className="service-name">{appointment.serviceName}</span><span className="service-price">R{appointment.priceAtBooking?.toFixed(2)}</span></div>
                    <div className="appointment-datetime"><span className="appointment-date">{new Date(appointment.startDateTime).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</span><span className="appointment-time">{new Date(appointment.startDateTime).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</span></div>
                  </div>
                  <div className="appointment-status"><span className={`status-badge ${appointment.status}`}>{appointment.status}</span></div>
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
export default AdminAppointments;