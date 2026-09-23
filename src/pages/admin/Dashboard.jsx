// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './Dashboard.css';

// SVG Icons
const UsersIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const ScissorsIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3h-3z"/></svg>;
const CalendarIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>;
const DollarIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>;
const StarIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, customers: 0, barbers: 0, admins: 0 },
    shops: { total: 0, pending: 0, approved: 0, suspended: 0, activeLast30Days: 0 },
    appointments: { total: 0, completed: 0, cancelled: 0, completionRate: 0 },
    reviews: { total: 0 },
    revenue: { total: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    setLoading(true); setError(null);
    try {
      const data = await adminService.getPlatformStats();
      setStats(data);
    } catch (err) { setError(err.message || 'Failed to load platform statistics'); } finally { setLoading(false); }
  };

  if (loading) return <div className="admin-dashboard-loading"><LoadingSpinner size="large" message="Loading platform statistics..." /></div>;

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Good morning, Admin</h1>
          <div className="last-updated">Here's what's happening today</div>
        </div>

        {error && <ErrorMessage message={error} onRetry={loadStats} />}

        {/* Top Stats Row */}
        <div className="stats-grid top-stats">
          <div className="stat-card">
            <div className="stat-icon"><UsersIcon /></div>
            <div className="stat-info">
              <span className="stat-number">{stats.users.total}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><ScissorsIcon /></div>
            <div className="stat-info">
              <span className="stat-number">{stats.users.barbers}</span>
              <span className="stat-label">Total Barbers</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CalendarIcon /></div>
            <div className="stat-info">
              <span className="stat-number">{stats.appointments.total}</span>
              <span className="stat-label">Total Appointments</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><DollarIcon /></div>
            <div className="stat-info">
              <span className="stat-number">R{stats.revenue.total.toFixed(0)}</span>
              <span className="stat-label">Revenue</span>
            </div>
          </div>
        </div>

        {/* Pending Approvals Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Pending Approvals</h2>
            <Link to="/admin/barbers" className="view-all">View All →</Link>
          </div>
          <div className="pending-grid">
            <div className="pending-card">
              <span className="pending-number">{stats.shops.pending}</span>
              <span className="pending-label">Barbers Awaiting Approval</span>
              <Link to="/admin/barbers"><Button variant="primary" size="small">Review Now</Button></Link>
            </div>
            <div className="pending-card">
              <span className="pending-number">{stats.reviews.total}</span>
              <span className="pending-label">Reviews to Moderate</span>
              <Link to="/admin/reviews"><Button variant="outline" size="small">Moderate</Button></Link>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/admin/barbers" className="quick-action-card">
              <ScissorsIcon />
              <span className="action-label">Manage Barbers</span>
              {stats.shops.pending > 0 && <span className="action-badge">{stats.shops.pending}</span>}
            </Link>
            <Link to="/admin/customers" className="quick-action-card">
              <UsersIcon />
              <span className="action-label">Manage Customers</span>
            </Link>
            <Link to="/admin/reviews" className="quick-action-card">
              <StarIcon />
              <span className="action-label">Moderate Reviews</span>
            </Link>
            <Link to="/admin/appointments" className="quick-action-card">
              <CalendarIcon />
              <span className="action-label">All Appointments</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
export default AdminDashboard;