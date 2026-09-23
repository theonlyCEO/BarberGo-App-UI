// BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { shopService } from '../../services/shopService';
import { appointmentService } from '../../services/appointmentService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ServiceSelector from '../../components/booking/ServiceSelector';
import DateSelector from '../../components/booking/DateSelector';
import TimeSlotSelector from '../../components/booking/TimeSlotSelector';
import BookingSummary from '../../components/booking/BookingSummary';
import BookingConfirmation from '../../components/booking/BookingConfirmation';
import './BookingPage.css';

const BookingPage = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { location: userLocation } = useLocation();
  
  const [shop, setShop] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [notes, setNotes] = useState('');
  const [conflictDetected, setConflictDetected] = useState(false);

  useEffect(() => {
    const loadShopData = async () => {
      setLoading(true); setError(null);
      try {
        const shopData = await shopService.getShopById(shopId);
        setShop(shopData);
        const servicesData = await shopService.getServices(shopId, { activeOnly: true });
        setServices(servicesData.services || []);
      } catch (err) { setError(err.message || 'Failed to load shop details'); } finally { setLoading(false); }
    };
    loadShopData();
  }, [shopId]);

  useEffect(() => { if (selectedService && selectedDate) loadAvailability(); }, [selectedService, selectedDate]);

  const loadAvailability = async () => {
    setAvailabilityLoading(true); setAvailabilityError(null); setSelectedTime(null);
    try {
      const response = await shopService.getAvailability(shopId, { serviceId: selectedService.id, date: selectedDate, slotInterval: 30 });
      setAvailableSlots(response.slots || []);
      if (response.availableSlots === 0) setAvailabilityError('No available time slots for this date. Please select another date.');
    } catch (err) { setAvailabilityError(err.message || 'Failed to load availability'); setAvailableSlots([]); } finally { setAvailabilityLoading(false); }
  };

  const handleServiceSelect = (service) => { setSelectedService(service); setSelectedDate(null); setSelectedTime(null); setAvailableSlots([]); setStep(2); };
  const handleDateSelect = (date) => { setSelectedDate(date); setSelectedTime(null); setAvailableSlots([]); };
  const handleTimeSelect = (slot) => { if (slot.available) { setSelectedTime(slot); setConflictDetected(false); } };
  const handleNext = () => { if (step === 2 && selectedTime) setStep(3); };
  const handleBack = () => { if (step === 2) { setStep(1); setSelectedDate(null); setSelectedTime(null); } else if (step === 3) setStep(2); };

  const handleBookingSubmit = async () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: `/shops/${shopId}/book` } }); return; }
    setBookingLoading(true); setBookingError(null); setConflictDetected(false);
    try {
      const bookingPayload = { shopId, serviceId: selectedService.id, date: selectedDate, time: selectedTime.startTime, notes };
      const response = await appointmentService.createAppointment(bookingPayload);
      setBookingData(response); setStep(4);
    } catch (err) {
      if (err.code === 'TIME_SLOT_ALREADY_BOOKED' || err.code === 'BLOCKED_TIME_CONFLICT') {
        setConflictDetected(true); setBookingError('This time slot is no longer available. Please select another time.');
        await loadAvailability(); setStep(2);
      } else { setBookingError(err.message || 'Failed to book appointment'); }
    } finally { setBookingLoading(false); }
  };

  const handleNewBooking = () => { setStep(1); setSelectedService(null); setSelectedDate(null); setSelectedTime(null); setAvailableSlots([]); setBookingData(null); setNotes(''); setConflictDetected(false); };
  const handleViewAppointments = () => { if (user?.role === 'customer') navigate('/customer/appointments'); else navigate('/login'); };

  if (loading) return <div className="booking-loading"><LoadingSpinner size="large" message="Loading shop details..." /></div>;
  if (error || !shop) return <div className="booking-error"><div className="container"><ErrorMessage message={error || 'Shop not found'} onRetry={() => window.location.reload()} /><Link to="/find" className="back-link">← Back to Find Barbers</Link></div></div>;
  if (shop.status !== 'approved') return <div className="booking-error"><div className="container"><div className="error-card"><h2>Shop Not Available</h2><p>This shop is currently not accepting bookings.</p><Link to={`/shops/${shopId}`} className="back-link">← Back to Shop</Link></div></div></div>;

  const availableServices = services.filter(s => s.active);
  if (availableServices.length === 0) return <div className="booking-error"><div className="container"><div className="error-card"><h2>No Services Available</h2><p>This shop currently has no active services.</p><Link to={`/shops/${shopId}`} className="back-link">← Back to Shop</Link></div></div></div>;

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-layout">
          <div className="booking-header">
            <Link to={`/shops/${shopId}`} className="booking-back">← Back to Shop</Link>
            <h1>Book Appointment</h1>
            <p className="booking-shop-name">{shop.name}</p>
          </div>

          <div className="booking-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}><span className="step-number">1</span><span className="step-label">Service</span></div>
            <div className={`step-connector ${step >= 2 ? 'active' : ''}`} />
            <div className={`step ${step >= 2 ? 'active' : ''}`}><span className="step-number">2</span><span className="step-label">Date & Time</span></div>
            <div className={`step-connector ${step >= 3 ? 'active' : ''}`} />
            <div className={`step ${step >= 3 ? 'active' : ''}`}><span className="step-number">3</span><span className="step-label">Confirm</span></div>
          </div>

          <div className="booking-content">
            {step === 1 && (
              <div className="booking-step">
                <h2>Choose a Service</h2>
                <p className="step-description">Select the service you'd like to book at {shop.name}</p>
                <ServiceSelector services={availableServices} selectedService={selectedService} onSelect={handleServiceSelect} />
              </div>
            )}

            {step === 2 && (
              <div className="booking-step">
                <h2>Choose Date & Time</h2>
                <p className="step-description">Select when you'd like to visit {shop.name}</p>
                <div className="date-time-grid">
                  <div className="date-section"><DateSelector shopId={shopId} serviceId={selectedService?.id} selectedDate={selectedDate} onSelect={handleDateSelect} /></div>
                  <div className="time-section"><TimeSlotSelector slots={availableSlots} selectedTime={selectedTime} onSelect={handleTimeSelect} loading={availabilityLoading} error={availabilityError} /></div>
                </div>
                {conflictDetected && <div className="conflict-warning"><span className="conflict-icon">⚠️</span><div className="conflict-message"><strong>Time Slot Changed</strong><p>The previously selected time is no longer available. Please choose another time.</p></div></div>}
                <div className="booking-actions">
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button variant="primary" onClick={handleNext} disabled={!selectedTime}>Continue</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="booking-step">
                <h2>Confirm Booking</h2>
                <p className="step-description">Review your appointment details before confirming</p>
                <BookingSummary shop={shop} service={selectedService} date={selectedDate} timeSlot={selectedTime} notes={notes} onNotesChange={setNotes} />
                <div className="booking-actions">
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button variant="primary" onClick={handleBookingSubmit} loading={bookingLoading} disabled={bookingLoading}>Confirm Booking</Button>
                </div>
                {bookingError && <ErrorMessage message={bookingError} variant="error" />}
              </div>
            )}

            {step === 4 && (
              <div className="booking-step">
                <BookingConfirmation booking={bookingData} shop={shop} service={selectedService} date={selectedDate} time={selectedTime} onNewBooking={handleNewBooking} onViewAppointments={handleViewAppointments} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookingPage;