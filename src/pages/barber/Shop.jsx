// Shop.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { shopService } from '../../services/shopService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ShopMap from '../../components/map/ShopMap';
import OpeningHours from '../../components/barber/OpeningHours';
import './Shop.css';

const BarberShop = () => {
  const { user } = useAuth();
  const { location: userLocation, getCurrentLocation } = useLocation();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '', description: '', phone: '', email: '',
    address: { street: '', city: '', province: '', postalCode: '', country: 'South Africa' },
    location: { type: 'Point', coordinates: [0, 0] },
    timezone: 'Africa/Johannesburg', openingHours: []
  });

  useEffect(() => { loadShop(); }, []);

  const loadShop = async () => {
    setLoading(true); setError(null);
    try {
      const shopData = await shopService.getMyShop();
      setShop(shopData);
      setPhotos(shopData.photos || []);
      setFormData({
        name: shopData.name || '', description: shopData.description || '', phone: shopData.phone || '', email: shopData.email || '',
        address: shopData.address || { street: '', city: '', province: '', postalCode: '', country: 'South Africa' },
        location: shopData.location || { type: 'Point', coordinates: [0, 0] },
        timezone: shopData.timezone || 'Africa/Johannesburg', openingHours: shopData.openingHours || []
      });
    } catch (err) {
      if (err.code === 'SHOP_NOT_FOUND') {
        setShop(null);
        const defaultHours = [];
        for (let i = 0; i < 7; i++) defaultHours.push({ dayOfWeek: i, isOpen: i < 5, periods: i < 5 ? [{ start: '09:00', end: '18:00' }] : [] });
        setFormData(prev => ({ ...prev, openingHours: defaultHours }));
      } else setError(err.message || 'Failed to load shop');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (coordinates) => { setFormData(prev => ({ ...prev, location: { type: 'Point', coordinates } })); };

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !shop) return;
    setUploading(true); setError(null); setSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const formDataUpload = new FormData();
      formDataUpload.append('photo', files[0]);
      const response = await fetch(`http://localhost:3000/api/upload/shop/${shop.id}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formDataUpload });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error?.message || 'Failed to upload photo'); }
      const data = await response.json();
      setPhotos(data.data.photos); setSuccess('Photo uploaded successfully!'); await loadShop();
    } catch (err) { setError(err.message || 'Failed to upload photo'); } finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handlePhotoDelete = async (photoUrl) => {
    if (!shop) return;
    setError(null); setSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/upload/shop/${shop.id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ photoUrl }) });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error?.message || 'Failed to delete photo'); }
      const data = await response.json();
      setPhotos(data.data.photos); setSuccess('Photo deleted successfully!'); await loadShop();
    } catch (err) { setError(err.message || 'Failed to delete photo'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null); setSuccess(null); setSaving(true);
    try {
      if (shop) { const result = await shopService.updateShop(shop.id, formData); setShop(result); setSuccess('Shop updated successfully!'); }
      else { const result = await shopService.createShop(formData); setShop(result); setSuccess('Shop created successfully!'); navigate('/barber/dashboard'); }
      setIsEditing(false);
    } catch (err) { setError(err.message || 'Failed to save shop'); } finally { setSaving(false); }
  };

  const handleUseCurrentLocation = async () => {
    try { const location = await getCurrentLocation(); handleLocationSelect([location.longitude, location.latitude]); } catch (err) { setError('Failed to get current location'); }
  };

  if (loading) return <div className="barber-shop-loading"><LoadingSpinner size="large" message="Loading shop..." /></div>;

  return (
    <div className="barber-shop">
      <div className="container">
        <div className="shop-header">
          <h1>{shop ? 'Manage Shop' : 'Create Your Shop'}</h1>
          {shop && !isEditing && <Button variant="primary" onClick={() => setIsEditing(true)}>Edit Shop</Button>}
          {shop && isEditing && <Button variant="outline" onClick={() => { setIsEditing(false); loadShop(); }}>Cancel</Button>}
        </div>
        {error && <ErrorMessage message={error} />}
        {success && <div className="success-message"><span className="success-icon">✓</span>{success}</div>}

        {shop && !isEditing ? (
          <div className="shop-view">
            {photos.length > 0 && (<div className="info-section"><h3>Shop Photos</h3><div className="shop-photos-grid">{photos.map((photo, index) => <img key={index} src={photo.startsWith('http') ? photo : `http://localhost:3000${photo}`} alt={`Shop photo ${index + 1}`} className="shop-photo" />)}</div></div>)}
            <div className="shop-info-grid">
              <div className="info-section"><h3>Basic Information</h3><div className="info-item"><span className="info-label">Name</span><span className="info-value">{shop.name}</span></div><div className="info-item"><span className="info-label">Description</span><span className="info-value">{shop.description || 'No description'}</span></div><div className="info-item"><span className="info-label">Phone</span><span className="info-value">{shop.phone || 'Not set'}</span></div><div className="info-item"><span className="info-label">Email</span><span className="info-value">{shop.email || 'Not set'}</span></div></div>
              <div className="info-section"><h3>Address</h3><div className="info-item"><span className="info-label">Street</span><span className="info-value">{shop.address?.street || 'Not set'}</span></div><div className="info-item"><span className="info-label">City</span><span className="info-value">{shop.address?.city || 'Not set'}</span></div><div className="info-item"><span className="info-label">Province</span><span className="info-value">{shop.address?.province || 'Not set'}</span></div><div className="info-item"><span className="info-label">Postal Code</span><span className="info-value">{shop.address?.postalCode || 'Not set'}</span></div><div className="info-item"><span className="info-label">Country</span><span className="info-value">{shop.address?.country || 'Not set'}</span></div></div>
              <div className="info-section"><h3>Location</h3><div className="shop-map-wrapper"><ShopMap shop={shop} height="200px" /></div><div className="info-item"><span className="info-label">Coordinates</span><span className="info-value">{shop.location?.coordinates ? `${shop.location.coordinates[1].toFixed(4)}, ${shop.location.coordinates[0].toFixed(4)}` : 'Not set'}</span></div></div>
              <div className="info-section"><h3>Opening Hours</h3><OpeningHours hours={shop.openingHours} timezone={shop.timezone} /></div>
              <div className="info-section"><h3>Shop Status</h3><div className="info-item"><span className="info-label">Status</span><span className={`status-badge ${shop.status}`}>{shop.status?.charAt(0).toUpperCase() + shop.status?.slice(1)}</span></div><div className="info-item"><span className="info-label">Rating</span><span className="info-value">{shop.rating?.toFixed(1) || '0.0'} ({shop.reviewCount || 0} reviews)</span></div><div className="info-item"><span className="info-label">Timezone</span><span className="info-value">{shop.timezone}</span></div></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="shop-form">
            {shop && (<div className="form-section"><h3>Shop Photos</h3><p className="form-hint">Upload photos of your shop (max 10 photos)</p><div className="photo-upload-grid">{photos.map((photo, index) => (<div key={index} className="photo-item"><img src={photo.startsWith('http') ? photo : `http://localhost:3000${photo}`} alt={`Shop photo ${index + 1}`} /><button type="button" className="photo-delete-btn" onClick={() => handlePhotoDelete(photo)}>✕</button></div>))}{photos.length < 10 && (<button type="button" className="photo-upload-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>{uploading ? <span>Uploading...</span> : <><span className="upload-icon">📷</span><span>Add Photo</span></>}</button>)}</div><input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoUpload} style={{ display: 'none' }} /></div>)}
            <div className="form-section"><h3>Basic Information</h3><div className="form-group"><label>Shop Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required minLength={2} maxLength={100} placeholder="Enter your shop name" /></div><div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows={4} placeholder="Describe your shop, services, and experience" /></div><div className="form-row"><div className="form-group"><label>Phone Number *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" required placeholder="+27 12 345 6789" /></div><div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="shop@example.com" /></div></div></div>
            <div className="form-section"><h3>Address</h3><div className="form-group"><label>Street Address *</label><input type="text" name="address.street" value={formData.address.street} onChange={handleChange} className="form-input" required placeholder="123 Main Street" /></div><div className="form-row"><div className="form-group"><label>City *</label><input type="text" name="address.city" value={formData.address.city} onChange={handleChange} className="form-input" required placeholder="Johannesburg" /></div><div className="form-group"><label>Province</label><input type="text" name="address.province" value={formData.address.province} onChange={handleChange} className="form-input" placeholder="Gauteng" /></div></div><div className="form-row"><div className="form-group"><label>Postal Code</label><input type="text" name="address.postalCode" value={formData.address.postalCode} onChange={handleChange} className="form-input" placeholder="2000" /></div><div className="form-group"><label>Country</label><input type="text" name="address.country" value={formData.address.country} onChange={handleChange} className="form-input" placeholder="South Africa" /></div></div></div>
            <div className="form-section"><h3>Location</h3><p className="form-hint">Set your shop's location on the map</p><div className="location-controls"><Button type="button" variant="outline" onClick={handleUseCurrentLocation}>📍 Use Current Location</Button></div><div className="shop-map-wrapper"><ShopMap shop={{ location: formData.location }} height="300px" /></div><div className="form-group"><label>Coordinates</label><div className="coord-display"><span>Lat: {formData.location.coordinates[1]?.toFixed(6) || '0.000000'}</span><span>Lng: {formData.location.coordinates[0]?.toFixed(6) || '0.000000'}</span></div></div></div>
            <div className="form-section"><h3>Timezone</h3><div className="form-group"><label>Timezone</label><select name="timezone" value={formData.timezone} onChange={handleChange} className="form-select"><option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option><option value="Africa/Cairo">Africa/Cairo (EET)</option><option value="Africa/Lagos">Africa/Lagos (WAT)</option><option value="Africa/Nairobi">Africa/Nairobi (EAT)</option><option value="UTC">UTC</option></select></div></div>
            <div className="form-actions">{shop && <Button type="button" variant="outline" onClick={() => { setIsEditing(false); loadShop(); }}>Cancel</Button>}<Button type="submit" variant="primary" loading={saving} disabled={saving}>{shop ? 'Update Shop' : 'Create Shop'}</Button></div>
          </form>
        )}
      </div>
    </div>
  );
};
export default BarberShop;