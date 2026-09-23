// FindPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import { useLocation } from '../../context/LocationContext';
import { shopService } from '../../services/shopService';
import BarberCard from '../../components/barber/BarberCard';
import BarberMap from '../../components/map/BarberMap';
import FilterPanel from '../../components/barber/FilterPanel';
import LocationPermission from '../../components/barber/LocationPermission';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';
import './FindPage.css';

const ListIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>;
const MapIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>;
const FilterIcon = () => <svg className="icon" viewBox="0 0 24 24"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>;

const FindPage = () => {
  const routerLocation = useRouterLocation();
  const { location, hasLocation, getCurrentLocation, isLoading: locationLoading, error: locationError, permissionStatus, setManualLocation, clearLocation } = useLocation();
  
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ radius: 5, minRating: 0, maxPrice: null, serviceId: null, sortBy: 'distance' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
  const [selectedShop, setSelectedShop] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'list', 'map', 'split'
  const [showFilters, setShowFilters] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  
  const mapRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => { if (hasLocation) loadShops(); }, [location, filters.page, filters.sortBy, filters.radius, filters.minRating, filters.serviceId]);

  const loadShops = async () => {
    if (!hasLocation) return;
    setLoading(true); setError(null);
    try {
      const params = { latitude: location.latitude, longitude: location.longitude, radius: filters.radius, page: pagination.page, limit: pagination.limit, sortBy: filters.sortBy };
      if (filters.minRating > 0) params.minRating = filters.minRating;
      if (filters.serviceId) params.serviceId = filters.serviceId;
      const response = await shopService.getNearbyShops(params);
      const normalizedShops = (response.shops || []).map(shop => ({ ...shop, id: shop.id || shop._id }));
      setShops(normalizedShops);
      setPagination(response.pagination || { page: 1, limit: 20, total: 0, pages: 0, hasNextPage: false, hasPrevPage: false });
    } catch (err) { setError(err.message || 'Failed to load barbers'); setShops([]); } finally { setLoading(false); }
  };

  const handleLocationPermission = async () => { try { await getCurrentLocation(); loadShops(); } catch (err) {} };
  const handleFilterChange = (newFilters) => { setFilters(prev => ({ ...prev, ...newFilters, page: 1 })); if (window.innerWidth <= 768) setShowFilters(false); };
  const handlePageChange = (newPage) => { setPagination(prev => ({ ...prev, page: newPage })); if (listRef.current) listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const handleShopSelect = (shop) => { setSelectedShop(shop); if (window.innerWidth <= 768) setViewMode('map'); };
  const handleShopDeselect = () => setSelectedShop(null);

  if (!hasLocation && permissionStatus === 'prompt') return <div className="find-page"><LocationPermission onAllow={handleLocationPermission} onManual={setManualLocation} isLoading={locationLoading} error={locationError} /></div>;
  if (!hasLocation && permissionStatus === 'denied') return <div className="find-page"><div className="container manual-search"><h2>Search for barbers</h2><p>Enter a location to find barbers near you</p><div className="search-input-group"><input type="text" placeholder="Enter city, suburb, or address..." value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} /><Button onClick={() => {}}>Search</Button></div></div></div>;

  return (
    <div className="find-page">
      <div className="find-container">
        {/* Top Search Bar */}
        <div className="search-bar">
          <div className="search-bar-content">
            <div className="location-display">
              <span className="location-text">📍 {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}</span>
            </div>
            <div className="radius-control">
              <label>Radius: {filters.radius} km</label>
              <input type="range" min="1" max="50" value={filters.radius} onChange={(e) => handleFilterChange({ radius: parseInt(e.target.value) })} className="radius-slider" />
            </div>
            <Button variant="outline" size="small" onClick={() => setShowFilters(!showFilters)}><FilterIcon /> Filters</Button>
          </div>
        </div>

        <FilterPanel isOpen={showFilters} filters={filters} onFilterChange={handleFilterChange} onClose={() => setShowFilters(false)} />

        {/* Results Header */}
        <div className="results-header">
          <div className="results-count"><span className="count-number">{pagination.total}</span><span className="count-label">barbers found</span></div>
          <div className="results-actions">
            <div className="view-toggle">
              <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><ListIcon /></button>
              <button className={`view-btn ${viewMode === 'split' ? 'active' : ''}`} onClick={() => setViewMode('split')}>Split</button>
              <button className={`view-btn ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}><MapIcon /></button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`results-content view-${viewMode}`}>
          {viewMode !== 'list' && (
            <div className="map-container">
              <BarberMap ref={mapRef} shops={shops} selectedShop={selectedShop} onShopSelect={handleShopSelect} center={location ? [location.latitude, location.longitude] : null} radius={filters.radius} />
            </div>
          )}
          {viewMode !== 'map' && (
            <div className="list-container" ref={listRef}>
              {loading && shops.length === 0 ? <LoadingSpinner /> : error ? <ErrorMessage message={error} onRetry={loadShops} /> : shops.length === 0 ? <div className="find-empty"><h3>No barbers found nearby</h3><p>Try adjusting your search radius or filters</p></div> : (
                <>
                  {shops.map((shop) => <BarberCard key={shop.id || shop._id} shop={shop} isSelected={selectedShop?.id === shop.id} onSelect={() => handleShopSelect(shop)} onDeselect={handleShopDeselect} />)}
                  {pagination.total > pagination.limit && (
                    <div className="pagination">
                      <button className="page-btn" onClick={() => handlePageChange(pagination.page - 1)} disabled={!pagination.hasPrevPage}>← Previous</button>
                      <span className="page-info">Page {pagination.page} of {pagination.pages}</span>
                      <button className="page-btn" onClick={() => handlePageChange(pagination.page + 1)} disabled={!pagination.hasNextPage}>Next →</button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FindPage;