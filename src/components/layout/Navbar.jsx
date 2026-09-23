// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const ScissorsIcon = () => (
  <svg className="icon" viewBox="0 0 24 24"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3h-3z"/></svg>
);

const Navbar = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'customer': return '/customer/dashboard';
      case 'barber': return '/barber/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <ScissorsIcon />
          <span>BarberGo</span>
        </Link>

        <div className="navbar-desktop">
          <Link to="/find" className="nav-link">Find Barbers</Link>
          {isLoading ? (
            <span className="nav-loading">Loading...</span>
          ) : isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
              <span className="nav-user-name">{user.name} ({user.role})</span>
              <button onClick={handleLogout} className="nav-link nav-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link nav-register">Sign Up</Link>
            </>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`} />
        </button>

        <div className={`navbar-mobile ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/find" className="nav-link">Find Barbers</Link>
          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
              <span className="nav-user-mobile">{user.name}</span>
              <button onClick={handleLogout} className="nav-link nav-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link nav-register">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;