import React from 'react';
import './LegalPage.css';

const PrivacyPage = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="legal-content">
          <section>
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly, such as your name, email address, phone number, and payment information when you register or book an appointment.</p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use your information to facilitate bookings, process payments, send notifications, and improve our services. We may also use your information to communicate with you about promotions or updates.</p>
          </section>

          <section>
            <h2>3. Information Sharing</h2>
            <p>We share your information with barbers when you make a booking so they can fulfill your appointment. We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2>5. Cookies</h2>
            <p>We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookies through your browser settings.</p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You can manage your information through your account settings or by contacting us.</p>
          </section>

          <section>
            <h2>7. Children's Privacy</h2>
            <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2>8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page.</p>
          </section>

          <section>
            <h2>9. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at privacy@barbergo.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;