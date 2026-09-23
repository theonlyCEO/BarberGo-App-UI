// Schedule.jsx
import React, { useState, useEffect } from 'react';
import { shopService } from '../../services/shopService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './Schedule.css';

const BarberSchedule = () => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openingHours, setOpeningHours] = useState([]);

  const daysOfWeek = [{ value: 0, label: 'Monday' }, { value: 1, label: 'Tuesday' }, { value: 2, label: 'Wednesday' }, { value: 3, label: 'Thursday' }, { value: 4, label: 'Friday' }, { value: 5, label: 'Saturday' }, { value: 6, label: 'Sunday' }];

  useEffect(() => { loadSchedule(); }, []);

  const loadSchedule = async () => {
    setLoading(true); setError(null);
    try {
      const shopData = await shopService.getMyShop();
      setShop(shopData);
      if (shopData.openingHours && shopData.openingHours.length === 7) setOpeningHours(shopData.openingHours);
      else {
        const defaultHours = daysOfWeek.map((day) => ({ dayOfWeek: day.value, isOpen: day.value < 5, periods: day.value < 5 ? [{ start: '09:00', end: '18:00' }] : [] }));
        setOpeningHours(defaultHours);
      }
    } catch (err) { setError(err.message || 'Failed to load schedule'); } finally { setLoading(false); }
  };

  const handleToggleDay = (dayIndex) => {
    setOpeningHours(prev => prev.map((day, index) => {
      if (index === dayIndex) { const newIsOpen = !day.isOpen; return { ...day, isOpen: newIsOpen, periods: newIsOpen ? [{ start: '09:00', end: '18:00' }] : [] }; }
      return day;
    }));
  };

  const handlePeriodChange = (dayIndex, periodIndex, field, value) => {
    setOpeningHours(prev => prev.map((day, index) => {
      if (index === dayIndex) { const newPeriods = [...day.periods]; newPeriods[periodIndex] = { ...newPeriods[periodIndex], [field]: value }; return { ...day, periods: newPeriods }; }
      return day;
    }));
  };

  const handleAddPeriod = (dayIndex) => {
    setOpeningHours(prev => prev.map((day, index) => {
      if (index === dayIndex) { const lastPeriod = day.periods[day.periods.length - 1]; const start = lastPeriod ? lastPeriod.end : '09:00'; const end = lastPeriod ? '18:00' : '18:00'; return { ...day, periods: [...day.periods, { start, end }] }; }
      return day;
    }));
  };

  const handleRemovePeriod = (dayIndex, periodIndex) => {
    setOpeningHours(prev => prev.map((day, index) => {
      if (index === dayIndex && day.periods.length > 1) { const newPeriods = day.periods.filter((_, i) => i !== periodIndex); return { ...day, periods: newPeriods }; }
      return day;
    }));
  };

  const handleSave = async () => {
    if (!shop) return;
    setError(null); setSuccess(null); setSaving(true);
    try {
      const formattedHours = openingHours.map(day => ({ dayOfWeek: day.dayOfWeek, isOpen: day.isOpen, periods: day.isOpen ? day.periods.map(period => ({ start: period.start, end: period.end })) : [] }));
      await shopService.updateOpeningHours(shop.id, { openingHours: formattedHours });
      setSuccess('Schedule updated successfully!');
      setTimeout(() => { loadSchedule(); }, 1000);
    } catch (err) { setError(err.response?.data?.error?.message || err.message || 'Failed to update schedule'); } finally { setSaving(false); }
  };

  if (loading) return <div className="barber-schedule-loading"><LoadingSpinner size="large" message="Loading schedule..." /></div>;
  if (!shop) return <div className="barber-schedule-error"><div className="container"><div className="error-card"><h2>No Shop Found</h2><p>You need to create your shop first before setting your schedule.</p><Button variant="primary" onClick={() => window.location.href = '/barber/shop'}>Create Your Shop</Button></div></div></div>;

  return (
    <div className="barber-schedule">
      <div className="container">
        <div className="schedule-header">
          <h1>Schedule</h1>
          <div className="schedule-actions"><Button variant="primary" onClick={handleSave} loading={saving} disabled={saving}>Save Schedule</Button></div>
        </div>
        {error && <ErrorMessage message={error} />}
        {success && <div className="success-message"><span className="success-icon">✓</span>{success}</div>}

        <div className="schedule-grid">
          {openingHours.map((day, index) => (
            <div key={day.dayOfWeek} className="schedule-day">
              <div className="day-header">
                <div className="day-info"><h3>{daysOfWeek[index].label}</h3><label className="toggle-switch"><input type="checkbox" checked={day.isOpen} onChange={() => handleToggleDay(index)} /><span className="toggle-slider" /></label></div>
                <span className={`day-status ${day.isOpen ? 'open' : 'closed'}`}>{day.isOpen ? 'Open' : 'Closed'}</span>
              </div>
              {day.isOpen && (
                <div className="day-periods">
                  {day.periods.map((period, periodIndex) => (
                    <div key={periodIndex} className="period-row">
                      <div className="period-inputs"><input type="time" value={period.start} onChange={(e) => handlePeriodChange(index, periodIndex, 'start', e.target.value)} className="time-input" /><span className="time-separator">—</span><input type="time" value={period.end} onChange={(e) => handlePeriodChange(index, periodIndex, 'end', e.target.value)} className="time-input" /></div>
                      {day.periods.length > 1 && (<button className="remove-period" onClick={() => handleRemovePeriod(index, periodIndex)}>✕</button>)}
                    </div>
                  ))}
                  <button className="add-period" onClick={() => handleAddPeriod(index)}>+ Add Time Slot</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="schedule-footer"><p className="schedule-hint">Your opening hours determine when customers can book appointments. Make sure to set them correctly.</p></div>
      </div>
    </div>
  );
};
export default BarberSchedule;