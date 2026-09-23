import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import './ForgotPasswordPage.css';

const ScissorsIcon = () => <svg className="icon icon-xl" viewBox="0 0 24 24"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3h-3z"/></svg>;
const MailIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;
const CheckCircleIcon = () => <svg className="icon icon-xl" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      // TODO: Implement forgot password API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) { setError(err.message || 'Failed to send reset email'); } finally { setLoading(false); }
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
          <h1>Reset Password.</h1>
          <p>Don't worry, it happens. Enter your email and we'll send you a link to get back into your account.</p>
        </div>
        <div className="auth-hero-footer">
          <p>&copy; {new Date().getFullYear()} BarberGo. All rights reserved.</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          {success ? (
            <div className="success-state">
              <div className="success-icon-wrapper">
                <CheckCircleIcon />
              </div>
              <h2>Check your email</h2>
              <p>We've sent a password reset link to <strong>{email}</strong></p>
              <p className="success-sub">Didn't receive the email? Check your spam folder or try again.</p>
              <Link to="/login" className="btn btn-primary btn-full">Back to Login</Link>
            </div>
          ) : (
            <>
              <div className="auth-header">
                <h2>Forgot Password?</h2>
                <p>No worries, we'll send you reset instructions.</p>
              </div>
              
              {error && <ErrorMessage message={error} />}
              
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-with-icon">
                    <MailIcon />
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="form-input" disabled={loading} />
                  </div>
                </div>
                <Button type="submit" variant="primary" size="large" fullWidth loading={loading}>Send Reset Link</Button>
              </form>

              <div className="auth-footer">
                <Link to="/login" className="back-link">← Back to Login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;