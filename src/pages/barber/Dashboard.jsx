// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { shopService } from '../../services/shopService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './Dashboard.css';

// SVG Icons
const CalendarIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>;
const DollarIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>;
const CheckIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;
const StarIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>;
const ShopIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/></svg>;

const BarberDashboard = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, upcoming: 0, completed: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    setLoading(true); setError(null);
    try {
      try { const shopData = await shopService.getMyShop(); setShop(shopData); } catch (err) { console.log('No shop found'); }
      const today = new Date().toISOString().split('T')[0];
      const todayResponse = await appointmentService.getBarberAppointments({ date: today, limit: 20 });
      setTodayAppointments(todayResponse.appointments || []);
      const upcomingResponse = await appointmentService.getBarberAppointments({ upcomingOnly: true, limit: 10 });
      setUpcomingAppointments(upcomingResponse.appointments || []);
      const allResponse = await appointmentService.getBarberAppointments({ limit: 100 });
      const allAppointments = allResponse.appointments || [];
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const todayCount = allAppointments.filter(a => a.date === todayStr && a.status !== 'cancelled').length;
      const upcomingCount = allAppointments.filter(a => new Date(a.startDateTime) > now && a.status !== 'cancelled').length;
      const completedCount = allAppointments.filter(a => a.status === 'completed').length;
      const totalRevenue = allAppointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + (a.priceAtBooking || 0), 0);
      setStats({ total: allAppointments.length, today: todayCount, upcoming: upcomingCount, completed: completedCount, revenue: totalRevenue });
    } catch (err) { setError(err.message || 'Failed to load dashboard'); } finally { setLoading(false); }
  };

  const handleAppointmentStatus = async (appointmentId, status) => {
    try { await appointmentService.updateAppointmentStatus(appointmentId, status); await loadDashboardData(); } catch (err) { setError(err.message); }
  };

  if (loading) return <div className="barber-dashboard-loading"><LoadingSpinner size="large" message="Loading your dashboard..." /></div>;

  return (
    <div className="barber-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Good morning, {user?.name?.split(' ')[0] || 'Barber'}</h1>
          <div className="last-updated">Here's what's happening today</div>
        </div>

        {error && <ErrorMessage message={error} onRetry={loadDashboardData} />}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-icon"><CalendarIcon /></div><div className="stat-info"><span className="stat-number">{stats.today}</span><span className="stat-label">Today's Bookings</span></div></div>
          <div className="stat-card"><div className="stat-icon"><DollarIcon /></div><div className="stat-info"><span className="stat-number">R{stats.revenue.toFixed(0)}</span><span className="stat-label">Revenue</span></div></div>
          <div className="stat-card"><div className="stat-icon"><CheckIcon /></div><div className="stat-info"><span className="stat-number">{stats.completed}</span><span className="stat-label">Completed</span></div></div>
          <div className="stat-card"><div className="stat-icon"><StarIcon /></div><div className="stat-info"><span className="stat-number">{shop?.rating?.toFixed(1) || '0.0'}</span><span className="stat-label">Rating</span></div></div>
        </div>

        {/* Shop Status */}
        {shop && (
          <div className="shop-status-card">
            <div className="shop-status-header"><h3>Shop Status</h3><span className={`status-badge ${shop.status}`}>{shop.status?.charAt(0).toUpperCase() + shop.status?.slice(1)}</span></div>
            <div className="shop-status-content">
              <div className="shop-status-item"><span className="status-label">Rating</span><span className="status-value">{shop.rating?.toFixed(1) || '0.0'} ({shop.reviewCount || 0} reviews)</span></div>
              <div className="shop-status-item"><span className="status-label">Services</span><span className="status-value">{shop.services?.length || 0} services</span></div>
              <div className="shop-status-item"><span className="status-label">Location</span><span className="status-value">{shop.address?.city || 'Not set'}</span></div>
            </div>
          </div>
        )}

        {/* Today's Appointments */}
        <section className="dashboard-section">
          <div className="section-header"><h2>Today's Appointments</h2><Link to="/barber/appointments" className="view-all">View All →</Link></div>
          {todayAppointments.length > 0 ? (
            <div className="appointments-list">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-time">{new Date(appointment.startDateTime).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="appointment-info"><span className="appointment-customer">{appointment.customerId?.name || 'Unknown Customer'}</span><span className="appointment-service">{appointment.serviceName}</span></div>
                  <div className="appointment-status-badge"><span className={`status-label ${appointment.status}`}>{appointment.status}</span></div>
                  <div className="appointment-actions">
                    {appointment.status === 'confirmed' && (<><Button variant="success" size="small" onClick={() => handleAppointmentStatus(appointment.id, 'completed')}>Complete</Button><Button variant="danger" size="small" onClick={() => handleAppointmentStatus(appointment.id, 'no_show')}>No Show</Button></>)}
                    {appointment.status === 'pending' && (<><Button variant="primary" size="small" onClick={() => handleAppointmentStatus(appointment.id, 'confirmed')}>Confirm</Button><Button variant="danger" size="small" onClick={() => handleAppointmentStatus(appointment.id, 'cancelled')}>Cancel</Button></>)}
                  </div>
                </div>
              ))}
            </div>
          ) : (<div className="empty-state"><div className="empty-icon"><CalendarIcon /></div><h3>No Appointments Today</h3><p>You have no appointments scheduled for today.</p></div>)}
        </section>

        {/* Upcoming Appointments */}
        <section className="dashboard-section">
          <div className="section-header"><h2>Upcoming Appointments</h2><Link to="/barber/appointments" className="view-all">View All →</Link></div>
          {upcomingAppointments.length > 0 ? (
            <div className="upcoming-list">
              {upcomingAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="upcoming-item">
                  <span className="upcoming-date">{new Date(appointment.startDateTime).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}</span>
                  <span className="upcoming-time">{new Date(appointment.startDateTime).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="upcoming-customer">{appointment.customerId?.name || 'Unknown'}</span>
                  <span className="upcoming-service">{appointment.serviceName}</span>
                </div>
              ))}
            </div>
          ) : (<p className="no-upcoming">No upcoming appointments</p>)}
        </section>

        {/* Quick Actions */}
        <section className="dashboard-section quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/barber/shop" className="quick-action-card"><ShopIcon /><span className="action-label">Manage Shop</span></Link>
            <Link to="/barber/services" className="quick-action-card"><CalendarIcon /><span className="action-label">Services</span></Link>
            <Link to="/barber/schedule" className="quick-action-card"><CalendarIcon /><span className="action-label">Schedule</span></Link>
            <Link to="/barber/appointments" className="quick-action-card"><CalendarIcon /><span className="action-label">Appointments</span></Link>
            <Link to="/barber/reviews" className="quick-action-card"><StarIcon /><span className="action-label">Reviews</span></Link>
          </div>
        </section>
      </div>
    </div>
  );
};
export default BarberDashboard;