// Customers.jsx
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './Customers.css';

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
  const [filters, setFilters] = useState({ role: 'customer', isActive: '', search: '' });
  const [showFilters, setShowFilters] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => { loadUsers(); }, [pagination.page, filters]);

  const loadUsers = async () => {
    setLoading(true); setError(null);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filters.role !== 'all') params.role = filters.role;
      if (filters.isActive !== '') params.isActive = filters.isActive;
      if (filters.search) params.search = filters.search;
      const response = await adminService.getAllUsers(params);
      setUsers(response.users || []);
      setPagination(response.pagination || { page: 1, limit: 20, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
    } catch (err) { setError(err.message || 'Failed to load users'); } finally { setLoading(false); }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    setProcessingId(userId);
    try {
      if (currentStatus) await adminService.deactivateUser(userId);
      else await adminService.activateUser(userId);
      await loadUsers();
    } catch (err) { setError(err.message || 'Failed to update user status'); } finally { setProcessingId(null); }
  };

  const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); setPagination(prev => ({ ...prev, page: 1 })); };
  const handlePageChange = (newPage) => { setPagination(prev => ({ ...prev, page: newPage })); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const getRoleLabel = (role) => ({ customer: 'Customer', barber: 'Barber', admin: 'Admin' }[role] || role);
  const getStatusBadge = (isActive) => isActive ? 'active' : 'inactive';

  if (loading) return <div className="admin-customers-loading"><LoadingSpinner size="large" message="Loading customers..." /></div>;

  return (
    <div className="admin-customers">
      <div className="container">
        <div className="customers-header">
          <h1>Customer Management</h1>
          <div className="header-actions"><Button variant="outline" onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide Filters' : 'Show Filters'}</Button></div>
        </div>
        {error && <ErrorMessage message={error} onRetry={loadUsers} />}

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-row">
              <div className="filter-group"><label>Role</label><select name="role" value={filters.role} onChange={handleFilterChange} className="filter-select"><option value="all">All</option><option value="customer">Customer</option><option value="barber">Barber</option><option value="admin">Admin</option></select></div>
              <div className="filter-group"><label>Status</label><select name="isActive" value={filters.isActive} onChange={handleFilterChange} className="filter-select"><option value="">All</option><option value="true">Active</option><option value="false">Inactive</option></select></div>
              <div className="filter-group"><label>Search</label><input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search by name or email..." className="filter-input" /></div>
            </div>
          </div>
        )}

        {users.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">👤</div><h3>No Users Found</h3><p>No users match your current filters.</p></div>
        ) : (
          <>
            <div className="users-list">
              {users.map((user) => (
                <div key={user.id} className="user-item">
                  <div className="user-info">
                    <div className="user-avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
                    <div className="user-details">
                      <h4 className="user-name">{user.name}</h4>
                      <div className="user-meta"><span className="user-email">✉️ {user.email}</span>{user.phone && <span className="user-phone">📞 {user.phone}</span>}<span className="user-role">{getRoleLabel(user.role)}</span></div>
                      <div className="user-meta"><span className="user-joined">Joined: {new Date(user.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</span>{user.lastLoginAt && <span className="user-last-login">Last login: {new Date(user.lastLoginAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>}</div>
                    </div>
                  </div>
                  <div className="user-status"><span className={`status-badge ${getStatusBadge(user.isActive)}`}>{user.isActive ? 'Active' : 'Inactive'}</span></div>
                  <div className="user-actions">
                    {user.role !== 'admin' ? (
                      <Button variant={user.isActive ? 'danger' : 'success'} size="small" onClick={() => handleToggleActive(user.id, user.isActive)} loading={processingId === user.id} disabled={processingId === user.id}>{user.isActive ? 'Deactivate' : 'Activate'}</Button>
                    ) : (<span className="protected-badge">Protected</span>)}
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
export default AdminCustomers;