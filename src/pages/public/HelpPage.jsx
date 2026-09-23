import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HelpPage.css';

const ChevronDownIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>;
const ChevronUpIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/></svg>;
const MailIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;
const PhoneIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>;

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'How do I book an appointment?', a: 'Navigate to the Find Barbers page, select a barber, choose your service, pick a date and time, and confirm your booking. You will receive a confirmation once the barber approves.' },
    { q: 'Can I cancel or reschedule my appointment?', a: 'Yes. Go to your Customer Dashboard, find the appointment under "My Appointments," and click Cancel or Reschedule. Please note that cancellation policies may vary by barber.' },
    { q: 'How do I leave a review?', a: 'After your appointment is marked as completed, you can leave a review from your Customer Dashboard. Click "Write Review" next to the completed appointment.' },
    { q: 'How do I register as a barber?', a: 'Click "Sign Up" and select "Join as a Barber" as your role. Once registered, you can set up your shop profile, add services, and manage your schedule.' },
    { q: 'Is my payment secure?', a: 'Yes. All payments are processed through secure, encrypted payment gateways. We do not store your credit card information on our servers.' },
    { q: 'What if the barber cancels my appointment?', a: 'If a barber cancels your appointment, you will be notified immediately via email and in-app notification. You can then rebook with another barber or the same one at a different time.' },
  ];

  return (
    <div className="help-page">
      <div className="container">
        <div className="help-hero">
          <h1>Help Center</h1>
          <p>Find answers to your questions about BarberGo.</p>
        </div>

        <div className="help-content">
          <section className="help-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button
                    className={`faq-question ${openFaq === index ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span>{faq.q}</span>
                    {openFaq === index ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </button>
                  {openFaq === index && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="help-section">
            <h2>Still Need Help?</h2>
            <div className="contact-grid">
              <div className="contact-card">
                <MailIcon />
                <h3>Email Support</h3>
                <p>support@barbergo.com</p>
                <a href="mailto:support@barbergo.com" className="contact-link">Send Email</a>
              </div>
              <div className="contact-card">
                <PhoneIcon />
                <h3>Phone Support</h3>
                <p>+27 123 456 789</p>
                <a href="tel:+27123456789" className="contact-link">Call Now</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;