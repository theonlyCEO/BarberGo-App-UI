// Appointments.jsx
import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './Appointments.css';

const BarberAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
  const [filters, setFilters] = useState({ date: '', status: 'all', upcomingOnly: false });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { loadAppointments(); }, [pagination.page, filters]);

  const loadAppointments = async () => {
    setLoading(true); setError(null);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filters.date) params.date = filters.date;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.upcomingOnly) params.upcomingOnly = true;
      const response = await appointmentService.getBarberAppointments(params);
      setAppointments(response.appointments || []);
      setPagination(response.pagination || { page: 1, limit: 20, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
    } catch (err) { setError(err.message || 'Failed to load appointments'); } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try { await appointmentService.updateAppointmentStatus(appointmentId, newStatus); await loadAppointments(); } catch (err) { setError(err.message); }
  };

  const handlePageChange = (newPage) => { setPagination(prev => ({ ...prev, page: newPage })); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleFilterChange = (e) => { const { name, value, type, checked } = e.target; setFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value })); setPagination(prev => ({ ...prev, page: 1 })); };

  const getStatusActions = (appointment) => {
    switch (appointment.status) {
      case 'pending': return (<><Button variant="primary" size="small" onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}>Confirm</Button><Button variant="danger" size="small" onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}>Cancel</Button></>);
      case 'confirmed': return (<><Button variant="success" size="small" onClick={() => handleStatusUpdate(appointment.id, 'completed')}>Complete</Button><Button variant="danger" size="small" onClick={() => handleStatusUpdate(appointment.id, 'no_show')}>No Show</Button></>);
      default: return null;
    }
  };

  const getStatusLabel = (status) => ({ pending: 'Pending', confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled', no_show: 'No Show' }[status] || status);

  if (loading) return <div className="barber-appointments-loading"><LoadingSpinner size="large" message="Loading appointments..." /></div>;

  return (
    <div className="barber-appointments">
      <div className="container">
        <div className="appointments-header">
          <h1>Appointments</h1>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide Filters' : 'Show Filters'}</Button>
        </div>
        {error && <ErrorMessage message={error} onRetry={loadAppointments} />}

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-row">
              <div className="filter-group"><label>Date</label><input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="filter-input" /></div>
              <div className="filter-group"><label>Status</label><select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select"><option value="all">All</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="no_show">No Show</option></select></div>
              <div className="filter-group checkbox"><label className="checkbox-label"><input type="checkbox" name="upcomingOnly" checked={filters.upcomingOnly} onChange={handleFilterChange} /> Upcoming only</label></div>
            </div>
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div><h3>No Appointments Found</h3><p>{filters.upcomingOnly ? "You don't have any upcoming appointments." : "You don't have any appointments matching your filters."}</p></div>
        ) : (
          <>
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-time">
                    <div className="time-date">{new Date(appointment.startDateTime).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}</div>
                    <div className="time-time">{new Date(appointment.startDateTime).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div className="appointment-info">
                    <div className="info-customer"><span className="customer-name">{appointment.customerId?.name || 'Unknown Customer'}</span><span className="customer-phone">{appointment.customerId?.phone || ''}</span></div>
                    <div className="info-service"><span className="service-name">{appointment.serviceName}</span><span className="service-duration">{appointment.durationAtBooking} min</span><span className="service-price">R{appointment.priceAtBooking?.toFixed(2)}</span></div>
                  </div>
                  <div className="appointment-status"><span className={`status-badge ${appointment.status}`}>{getStatusLabel(appointment.status)}</span></div>
                  <div className="appointment-actions">{getStatusActions(appointment)}</div>
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
export default BarberAppointments;