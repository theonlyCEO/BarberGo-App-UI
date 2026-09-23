import React from 'react';
import './ResourcesPage.css';

const BookIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>;
const VideoIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>;
const LinkIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>;

const ResourcesPage = () => {
  return (
    <div className="resources-page">
      <div className="container">
        <div className="resources-hero">
          <h1>Resources</h1>
          <p>Guides, tutorials, and tools to help you get the most out of BarberGo.</p>
        </div>

        <div className="resources-content">
          <section className="resources-section">
            <h2>For Customers</h2>
            <div className="resources-grid">
              <div className="resource-card">
                <BookIcon />
                <h3>Booking Guide</h3>
                <p>Learn how to find and book your perfect barber in just a few taps.</p>
                <a href="/help" className="resource-link">Read Guide →</a>
              </div>
              <div className="resource-card">
                <VideoIcon />
                <h3>Video Tutorials</h3>
                <p>Watch step-by-step videos on how to use the BarberGo app.</p>
                <a href="#" className="resource-link">Watch Videos →</a>
              </div>
              <div className="resource-card">
                <LinkIcon />
                <h3>FAQ</h3>
                <p>Find quick answers to the most common questions about booking.</p>
                <a href="/help" className="resource-link">View FAQ →</a>
              </div>
            </div>
          </section>

          <section className="resources-section">
            <h2>For Barbers</h2>
            <div className="resources-grid">
              <div className="resource-card">
                <BookIcon />
                <h3>Getting Started</h3>
                <p>Set up your shop, add services, and start accepting bookings.</p>
                <a href="/help" className="resource-link">Read Guide →</a>
              </div>
              <div className="resource-card">
                <VideoIcon />
                <h3>Marketing Tips</h3>
                <p>Learn how to attract more customers and grow your barber business.</p>
                <a href="#" className="resource-link">Learn More →</a>
              </div>
              <div className="resource-card">
                <LinkIcon />
                <h3>Support Center</h3>
                <p>Get help with your shop, appointments, and account settings.</p>
                <a href="/help" className="resource-link">Get Support →</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;