// Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './Profile.css';

const CustomerProfile = () => {
  const { user, updateUser, changePassword } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => { if (user) setProfileData({ name: user.name || '', email: user.email || '', phone: user.phone || '' }); }, [user]);

  const handleProfileChange = (e) => setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePasswordChange = (e) => setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleProfileSubmit = async (e) => {
    e.preventDefault(); setError(null); setSuccess(null); setSaving(true);
    try { await updateUser({ name: profileData.name, phone: profileData.phone }); setSuccess('Profile updated successfully!'); } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault(); setError(null); setSuccess(null); setSaving(true);
    if (passwordData.newPassword !== passwordData.confirmPassword) { setError('New passwords do not match'); setSaving(false); return; }
    if (passwordData.newPassword.length < 8) { setError('Password must be at least 8 characters'); setSaving(false); return; }
    try { await changePassword(passwordData.currentPassword, passwordData.newPassword); setSuccess('Password changed successfully!'); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  if (!user) return <div className="customer-profile-loading"><LoadingSpinner size="large" message="Loading profile..." /></div>;

  return (
    <div className="customer-profile">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="profile-avatar"><span className="avatar-text">{user.name?.charAt(0).toUpperCase() || 'U'}</span></div>
        </div>
        {error && <ErrorMessage message={error} />}
        {success && <div className="success-message"><span className="success-icon">✓</span>{success}</div>}

        <div className="profile-tabs">
          <button className={`profile-tab ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => setActiveSection('profile')}>Profile Details</button>
          <button className={`profile-tab ${activeSection === 'password' ? 'active' : ''}`} onClick={() => setActiveSection('password')}>Change Password</button>
        </div>

        <div className="profile-content">
          {activeSection === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group"><label>Full Name</label><input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className="form-input" required minLength={2} maxLength={100} /></div>
              <div className="form-group"><label>Email Address</label><input type="email" name="email" value={profileData.email} className="form-input" disabled /><span className="form-hint">Email cannot be changed</span></div>
              <div className="form-group"><label>Phone Number</label><input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className="form-input" placeholder="+27 12 345 6789" /></div>
              <div className="form-actions"><Button type="submit" variant="primary" loading={saving} disabled={saving}>Save Changes</Button></div>
            </form>
          )}
          {activeSection === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group"><label>Current Password</label><input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="form-input" required /></div>
              <div className="form-group"><label>New Password</label><input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="form-input" required minLength={8} /><span className="form-hint">Must be at least 8 characters</span></div>
              <div className="form-group"><label>Confirm New Password</label><input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="form-input" required /></div>
              <div className="form-actions"><Button type="submit" variant="primary" loading={saving} disabled={saving}>Change Password</Button></div>
            </form>
          )}
        </div>

        <div className="profile-account-info">
          <h3>Account Information</h3>
          <div className="info-grid">
            <div className="info-item"><span className="info-label">Account Type</span><span className="info-value">{user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</span></div>
            <div className="info-item"><span className="info-label">Member Since</span><span className="info-value">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</span></div>
            <div className="info-item"><span className="info-label">Last Login</span><span className="info-value">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerProfile;