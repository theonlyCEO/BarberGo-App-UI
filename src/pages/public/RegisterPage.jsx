// RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import './RegisterPage.css';

const ScissorsIcon = () => <svg className="icon icon-xl" viewBox="0 0 24 24"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3h-3z"/></svg>;
const UserIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const MailIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;
const PhoneIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>;
const LockIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => { if (isAuthenticated && !authLoading) navigate('/'); }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') calculatePasswordStrength(value);
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[@$!%*?&]/)) score++;
    setPasswordStrength(Math.min(score, 5));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null);
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (passwordStrength < 3) { setError('Please choose a stronger password'); return; }
    if (!agreedToTerms) { setError('Please agree to the Terms of Service'); return; }
    setLoading(true);
    try {
      const userData = { name: formData.name.trim(), email: formData.email.toLowerCase().trim(), password: formData.password, role: formData.role };
      if (formData.phone.trim()) userData.phone = formData.phone.trim();
      await register(userData);
      navigate('/');
    } catch (err) { setError(err.message || 'Registration failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      {/* Left Hero Panel */}
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-hero-brand">
            <ScissorsIcon />
            <span>BarberGo</span>
          </div>
          <h1>Join the Community.</h1>
          <p>Create an account to book appointments, manage your schedule, and discover the best barbers in your area.</p>
        </div>
        <div className="auth-hero-footer">
          <p>&copy; {new Date().getFullYear()} BarberGo. All rights reserved.</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>
          
          {error && <ErrorMessage message={error} variant="error" />}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <UserIcon />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className="form-input" disabled={loading} />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <MailIcon />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className="form-input" disabled={loading} />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number (optional)</label>
              <div className="input-with-icon">
                <PhoneIcon />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+27 12 345 6789" className="form-input" disabled={loading} />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <LockIcon />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" required className="form-input" disabled={loading} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE' : 'SHOW'}</button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className="strength-fill" style={{ width: `${(passwordStrength / 5) * 100}%`, backgroundColor: passwordStrength < 3 ? '#e74c3c' : passwordStrength < 4 ? '#f39c12' : '#2ecc71' }} />
                  </div>
                  <span className="strength-label">{passwordStrength < 3 ? 'Weak' : passwordStrength < 4 ? 'Fair' : 'Strong'}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <LockIcon />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required className="form-input" disabled={loading} />
              </div>
            </div>

            <div className="form-group">
              <label>I want to...</label>
              <select name="role" value={formData.role} onChange={handleChange} className="form-select" disabled={loading}>
                <option value="customer">Find a barber (Customer)</option>
                <option value="barber">Join as a barber (Barber)</option>
              </select>
            </div>

            <div className="form-group terms-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} disabled={loading} />
                <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
              </label>
            </div>

            <Button type="submit" variant="primary" size="large" fullWidth loading={loading} disabled={loading}>Create Account</Button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;