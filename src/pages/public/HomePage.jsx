// HomePage.jsx
import React from 'react';
import './HomePage.css';

const SearchIcon = () => (
  <svg className="icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
);
const MapPinIcon = () => (
  <svg className="icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
);
const ClockIcon = () => (
  <svg className="icon" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
);
const ScissorsIcon = () => (
  <svg className="icon" viewBox="0 0 24 24"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3h-3z"/></svg>
);

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">Find. Book. Cut.</h1>
          <p className="hero-subtitle">Find a barber near you. Choose your haircut. Book your time. Skip the queue.</p>
          
          <div className="hero-search-bar">
            <div className="search-input-group">
              <MapPinIcon />
              <input type="text" placeholder="Enter your location" />
            </div>
            <div className="search-input-group">
              <SearchIcon />
              <input type="text" placeholder="Search barbers" />
            </div>
            <button className="hero-search-btn">Find a Barber</button>
          </div>
        </div>
      </section>
      
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <MapPinIcon />
              <h3>Find Nearby Barbers</h3>
              <p>Discover trusted barbers in your area with real-time availability.</p>
            </div>
            <div className="feature-card">
              <ClockIcon />
              <h3>Book in Minutes</h3>
              <p>Select your preferred time and confirm in seconds.</p>
            </div>
            <div className="feature-card">
              <ScissorsIcon />
              <h3>Arrive & Get Cut</h3>
              <p>Arrive at your appointment time and enjoy your haircut.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;