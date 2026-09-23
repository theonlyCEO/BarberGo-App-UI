// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const ScissorsIcon = () => (
  <svg className="icon" viewBox="0 0 24 24"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3h-3z"/></svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-brand-title"><ScissorsIcon /> BarberGo</h3>
            <p className="footer-brand-tagline">Find. Book. Cut.</p>
            <p className="footer-brand-description">The easiest way to find and book appointments with trusted barbers near you.</p>
          </div>
          <div className="footer-links">
            <h4 className="footer-heading">Quick Links</h4>
            <ul>
              <li><Link to="/find">Find Barbers</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/help">Help Center</Link></li>
            </ul>
          </div>
                    {/* For Barbers */}
          <div className="footer-links">
            <h4 className="footer-heading">For Barbers</h4>
            <ul>
              <li><Link to="/register">Join as Barber</Link></li>
              <li><Link to="/barber/dashboard">Barber Dashboard</Link></li>
              <li><Link to="/resources">Resources</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4 className="footer-heading">Contact</h4>
            <p>Email: support@barbergo.com</p>
            <p>Phone: +27 123 456 789</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} BarberGo. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;