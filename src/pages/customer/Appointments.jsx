// Appointments.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import AppointmentCard from '../../components/customer/AppointmentCard';
import './Appointments.css';

const CalendarIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>;

const CustomerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => { loadAppointments(); }, [activeTab, pagination.page]);

  const loadAppointments = async () => {
    setLoading(true); setError(null);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (activeTab === 'upcoming') params.upcomingOnly = true;
      else if (activeTab !== 'all') params.status = activeTab;
      const response = await appointmentService.getMyAppointments(params);
      setAppointments(response.appointments || []);
      setPagination(response.pagination || { page: 1, limit: 10, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
    } catch (err) { setError(err.message || 'Failed to load appointments'); } finally { setLoading(false); }
  };

  const handleCancelClick = (appointment) => { setSelectedAppointment(appointment); setCancelReason(''); setShowCancelModal(true); };
  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;
    setCancelling(true);
    try { await appointmentService.cancelAppointment(selectedAppointment.id, cancelReason || 'Cancelled by customer'); setShowCancelModal(false); await loadAppointments(); } catch (err) { setError(err.message); } finally { setCancelling(false); }
  };
  const handlePageChange = (newPage) => { setPagination(prev => ({ ...prev, page: newPage })); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const renderContent = () => {
    if (loading) return <div className="appointments-loading"><LoadingSpinner size="large" message="Loading appointments..." /></div>;
    if (error) return <ErrorMessage message={error} onRetry={loadAppointments} />;
    if (appointments.length === 0) return (
      <div className="empty-state">
        <div className="empty-icon"><CalendarIcon /></div>
        <h3>No appointments found</h3>
        <p>{activeTab === 'upcoming' ? "You don't have any upcoming appointments. Book one now!" : `You don't have any ${activeTab} appointments.`}</p>
        {activeTab === 'upcoming' && <Link to="/find"><Button variant="primary">Find a Barber</Button></Link>}
      </div>
    );
    return (
      <>
        <div className="appointments-list">
          {appointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} onCancel={() => handleCancelClick(appointment)} onView={() => setSelectedAppointment(appointment)} />)}
        </div>
        {pagination.total > pagination.limit && (
          <div className="pagination">
            <button className="page-btn" onClick={() => handlePageChange(pagination.page - 1)} disabled={!pagination.hasPrevPage}>← Previous</button>
            <span className="page-info">Page {pagination.page} of {pagination.pages}</span>
            <button className="page-btn" onClick={() => handlePageChange(pagination.page + 1)} disabled={!pagination.hasNextPage}>Next →</button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="customer-appointments">
      <div className="container">
        <div className="appointments-header">
          <h1>My Appointments</h1>
          <Link to="/find"><Button variant="primary" size="small">Book New</Button></Link>
        </div>
        <div className="appointments-tabs">
          {['upcoming', 'confirmed', 'completed', 'cancelled', 'all'].map((tab) => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {renderContent()}

        {showCancelModal && selectedAppointment && (
          <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Cancel Appointment</h3>
              <p>Are you sure you want to cancel your appointment at <strong>{selectedAppointment.shopId?.name || 'the shop'}</strong>?</p>
              <div className="form-group">
                <label htmlFor="cancelReason">Reason (optional)</label>
                <textarea id="cancelReason" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Why are you cancelling?" rows={3} className="form-input" />
              </div>
              <div className="modal-actions">
                <Button variant="outline" onClick={() => setShowCancelModal(false)} disabled={cancelling}>Keep Appointment</Button>
                <Button variant="danger" onClick={handleConfirmCancel} loading={cancelling} disabled={cancelling}>Cancel Appointment</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CustomerAppointments;