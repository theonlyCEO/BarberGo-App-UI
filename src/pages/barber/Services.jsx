// Services.jsx
import React, { useState, useEffect } from 'react';
import { shopService } from '../../services/shopService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ServiceCard from '../../components/barber/ServiceCard';
import './Services.css';

const BarberServices = () => {
  const [shop, setShop] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', durationMinutes: '30', category: 'General', active: true });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true); setError(null);
    try {
      const shopData = await shopService.getMyShop();
      setShop(shopData);
      const servicesData = await shopService.getServices(shopData.id);
      setServices(servicesData.services || []);
    } catch (err) { setError(err.message || 'Failed to load services'); } finally { setLoading(false); }
  };

  const handleChange = (e) => { const { name, value, type, checked } = e.target; setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value })); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null); setSuccess(null); setSaving(true);
    try {
      const data = { ...formData, price: parseFloat(formData.price), durationMinutes: parseInt(formData.durationMinutes) };
      if (editingService) { await shopService.updateService(editingService.id, data); setSuccess('Service updated successfully!'); }
      else { await shopService.createService(shop.id, data); setSuccess('Service created successfully!'); }
      await loadData(); setShowForm(false); setEditingService(null); resetForm();
    } catch (err) { setError(err.message || 'Failed to save service'); } finally { setSaving(false); }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({ name: service.name || '', description: service.description || '', price: service.price || '', durationMinutes: service.durationMinutes || '30', category: service.category || 'General', active: service.active !== undefined ? service.active : true });
    setShowForm(true);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try { await shopService.deleteService(serviceId); setSuccess('Service deleted successfully!'); await loadData(); } catch (err) { setError(err.message || 'Failed to delete service'); }
  };

  const handleToggleActive = async (serviceId, currentActive) => {
    try { await shopService.toggleServiceActive(serviceId); setSuccess(`Service ${currentActive ? 'deactivated' : 'activated'} successfully!`); await loadData(); } catch (err) { setError(err.message || 'Failed to toggle service status'); }
  };

  const resetForm = () => { setFormData({ name: '', description: '', price: '', durationMinutes: '30', category: 'General', active: true }); };

  if (loading) return <div className="barber-services-loading"><LoadingSpinner size="large" message="Loading services..." /></div>;
  if (!shop) return <div className="barber-services-error"><div className="container"><div className="error-card"><h2>No Shop Found</h2><p>You need to create your shop first before adding services.</p><Button variant="primary" onClick={() => window.location.href = '/barber/shop'}>Create Your Shop</Button></div></div></div>;

  return (
    <div className="barber-services">
      <div className="container">
        <div className="services-header">
          <div className="header-left"><h1>Services</h1><span className="service-count">{services.length} services</span></div>
          <Button variant="primary" onClick={() => { setShowForm(true); setEditingService(null); resetForm(); }}>+ Add Service</Button>
        </div>
        {error && <ErrorMessage message={error} />}
        {success && <div className="success-message"><span className="success-icon">✓</span>{success}</div>}

        {showForm && (
          <div className="service-form-container">
            <div className="service-form-header"><h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3><button className="form-close" onClick={() => { setShowForm(false); setEditingService(null); resetForm(); }}>✕</button></div>
            <form onSubmit={handleSubmit} className="service-form">
              <div className="form-group"><label>Service Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required minLength={2} maxLength={100} placeholder="e.g., Fade Haircut" /></div>
              <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows={3} placeholder="Describe the service..." /></div>
              <div className="form-row">
                <div className="form-group"><label>Price (ZAR) *</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="form-input" required min="0" max="10000" step="0.01" placeholder="80.00" /></div>
                <div className="form-group"><label>Duration (minutes) *</label><select name="durationMinutes" value={formData.durationMinutes} onChange={handleChange} className="form-select"><option value="15">15 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">60 min</option><option value="90">90 min</option><option value="120">120 min</option><option value="180">180 min</option><option value="240">240 min</option></select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Category</label><input type="text" name="category" value={formData.category} onChange={handleChange} className="form-input" placeholder="e.g., Haircuts, Beard, Styling" /></div>
                <div className="form-group"><label className="checkbox-label"><input type="checkbox" name="active" checked={formData.active} onChange={handleChange} /> Active</label><span className="form-hint">Inactive services won't appear for booking</span></div>
              </div>
              <div className="form-actions"><Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingService(null); resetForm(); }}>Cancel</Button><Button type="submit" variant="primary" loading={saving} disabled={saving}>{editingService ? 'Update Service' : 'Add Service'}</Button></div>
            </form>
          </div>
        )}

        {services.length === 0 && !showForm ? (
          <div className="empty-state"><div className="empty-icon">✂️</div><h3>No Services Added</h3><p>Start by adding your first service to attract customers.</p><Button variant="primary" onClick={() => { setShowForm(true); setEditingService(null); resetForm(); }}>Add Your First Service</Button></div>
        ) : (
          <div className="services-list">
            {services.map((service) => (
              <div key={service.id} className="service-item-wrapper">
                <ServiceCard service={service} />
                <div className="service-actions">
                  <Button variant="outline" size="small" onClick={() => handleEdit(service)}>Edit</Button>
                  <Button variant="secondary" size="small" onClick={() => handleToggleActive(service.id, service.active)}>{service.active ? 'Deactivate' : 'Activate'}</Button>
                  <Button variant="danger" size="small" onClick={() => handleDelete(service.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default BarberServices;