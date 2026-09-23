import React from 'react';
import './AboutPage.css';

const ScissorsIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3h-3z"/></svg>;
const UsersIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const HeartIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-hero">
          <h1>About BarberGo</h1>
          <p>Connecting people with great barbers, one cut at a time.</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              BarberGo was built with a simple goal: to make finding and booking a barber as easy as possible. 
              We believe that getting a haircut should be an enjoyable experience, not a chore. 
              By connecting customers directly with local barbers, we eliminate the guesswork, the wait times, 
              and the phone calls.
            </p>
          </section>

          <section className="about-section">
            <h2>How It Works</h2>
            <div className="about-grid">
              <div className="about-card">
                <ScissorsIcon />
                <h3>Find</h3>
                <p>Discover trusted barbers in your area with real-time availability and verified reviews.</p>
              </div>
              <div className="about-card">
                <UsersIcon />
                <h3>Book</h3>
                <p>Select your preferred service, date, and time. Confirm in seconds with instant booking.</p>
              </div>
              <div className="about-card">
                <HeartIcon />
                <h3>Cut</h3>
                <p>Arrive at your appointment time, skip the queue, and enjoy your fresh new look.</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Our Values</h2>
            <ul className="about-values">
              <li><strong>Trust:</strong> We verify every barber on our platform to ensure quality service.</li>
              <li><strong>Convenience:</strong> Book anytime, anywhere, from any device.</li>
              <li><strong>Community:</strong> We support local businesses and help them grow.</li>
              <li><strong>Transparency:</strong> Clear pricing, real reviews, and honest availability.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;