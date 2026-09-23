// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { shopService } from '../../services/shopService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import AppointmentCard from '../../components/customer/AppointmentCard';
import './Dashboard.css';

// SVG Icons
const CalendarIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>;
const CheckIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;
const CloseIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const ListIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>;
const SearchIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;
const UserIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const StarIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>;

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    setLoading(true); setError(null);
    try {
      const upcomingResponse = await appointmentService.getMyAppointments({ upcomingOnly: true, limit: 5 });
      setUpcomingAppointments(upcomingResponse.appointments || []);
      const recentResponse = await appointmentService.getMyAppointments({ limit: 5, page: 1 });
      setRecentAppointments(recentResponse.appointments || []);
      const allResponse = await appointmentService.getMyAppointments({ limit: 100 });
      const allAppointments = allResponse.appointments || [];
      const now = new Date();
      setStats({
        total: allResponse.pagination?.total || 0,
        upcoming: allAppointments.filter(a => new Date(a.startDateTime) > now && a.status !== 'cancelled').length,
        completed: allAppointments.filter(a => a.status === 'completed').length,
        cancelled: allAppointments.filter(a => a.status === 'cancelled').length
      });
    } catch (err) { setError(err.message || 'Failed to load dashboard'); } finally { setLoading(false); }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try { await appointmentService.cancelAppointment(appointmentId, 'Cancelled by customer'); await loadDashboardData(); } catch (err) { setError(err.message); }
  };

  if (loading) return <div className="customer-dashboard-loading"><LoadingSpinner size="large" message="Loading your dashboard..." /></div>;

  return (
    <div className="customer-dashboard">
      <div className="container">
        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <div className="welcome-content">
            <h1>Welcome back, {user?.name?.split(' ')[0] || 'Customer'}!</h1>
            <p>Here's what's happening with your appointments</p>
          </div>
          <div className="welcome-actions">
            <Link to="/find"><Button variant="primary">Find a Barber</Button></Link>
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={loadDashboardData} />}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-icon"><CalendarIcon /></div><div className="stat-info"><span className="stat-number">{stats.upcoming}</span><span className="stat-label">Upcoming</span></div></div>
          <div className="stat-card"><div className="stat-icon"><CheckIcon /></div><div className="stat-info"><span className="stat-number">{stats.completed}</span><span className="stat-label">Completed</span></div></div>
          <div className="stat-card"><div className="stat-icon"><CloseIcon /></div><div className="stat-info"><span className="stat-number">{stats.cancelled}</span><span className="stat-label">Cancelled</span></div></div>
          <div className="stat-card"><div className="stat-icon"><ListIcon /></div><div className="stat-info"><span className="stat-number">{stats.total}</span><span className="stat-label">Total Bookings</span></div></div>
        </div>

        {/* Upcoming Appointments */}
        <section className="dashboard-section">
          <div className="section-header"><h2>Upcoming Appointments</h2><Link to="/customer/appointments" className="view-all">View All →</Link></div>
          {upcomingAppointments.length > 0 ? (
            <div className="appointments-list">
              {upcomingAppointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} onCancel={handleCancelAppointment} variant="compact" />)}
            </div>
          ) : (
            <div className="empty-state"><div className="empty-icon"><CalendarIcon /></div><h3>No Upcoming Appointments</h3><p>Book your next haircut today!</p><Link to="/find"><Button variant="primary">Find a Barber</Button></Link></div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="dashboard-section">
          <div className="section-header"><h2>Recent Activity</h2><Link to="/customer/appointments" className="view-all">View All →</Link></div>
          {recentAppointments.length > 0 ? (
            <div className="recent-list">
              {recentAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="recent-item">
                  <span className="recent-shop">{appointment.shopId?.name || 'Unknown Shop'}</span>
                  <span className="recent-service">{appointment.serviceName}</span>
                  <span className={`recent-status status-${appointment.status}`}>{appointment.status}</span>
                  <span className="recent-date">{new Date(appointment.startDateTime).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}</span>
                </div>
              ))}
            </div>
          ) : <p className="no-recent">No recent activity</p>}
        </section>

        {/* Quick Actions */}
        <section className="dashboard-section quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/find" className="quick-action-card"><SearchIcon /><span className="action-label">Find Barbers</span></Link>
            <Link to="/customer/appointments" className="quick-action-card"><ListIcon /><span className="action-label">My Appointments</span></Link>
            <Link to="/customer/profile" className="quick-action-card"><UserIcon /><span className="action-label">My Profile</span></Link>
            <Link to="/customer/reviews" className="quick-action-card"><StarIcon /><span className="action-label">My Reviews</span></Link>
          </div>
        </section>
      </div>
    </div>
  );
};
export default CustomerDashboard;