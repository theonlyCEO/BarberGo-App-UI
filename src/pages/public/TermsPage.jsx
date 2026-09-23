import React from 'react';
import './LegalPage.css';

const TermsPage = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-header">
          <h1>Terms of Service</h1>
          <p className="legal-updated">Last updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="legal-content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using the BarberGo platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>BarberGo provides an online platform that connects customers with barbers for booking appointments. We do not provide barbering services ourselves; we facilitate the booking process between customers and independent barbers.</p>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.</p>
          </section>

          <section>
            <h2>4. Booking and Cancellation</h2>
            <p>All bookings are subject to barber availability and confirmation. Cancellation policies are set by individual barbers. Please review the specific cancellation policy before booking.</p>
          </section>

          <section>
            <h2>5. Payments</h2>
            <p>Payments are processed through secure third-party payment gateways. By providing payment information, you represent that you are authorized to use the payment method.</p>
          </section>

          <section>
            <h2>6. User Conduct</h2>
            <p>You agree not to use the platform for any unlawful purpose or in any way that could damage, disable, or impair the service. Harassment, abuse, or fraudulent activity will result in account termination.</p>
          </section>

          <section>
            <h2>7. Intellectual Property</h2>
            <p>All content on the BarberGo platform, including logos, text, and software, is the property of BarberGo or its licensors and is protected by copyright laws.</p>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>BarberGo is not liable for any indirect, incidental, or consequential damages arising from your use of the platform or services provided by barbers.</p>
          </section>

          <section>
            <h2>9. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>If you have questions about these Terms, please contact us at support@barbergo.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;