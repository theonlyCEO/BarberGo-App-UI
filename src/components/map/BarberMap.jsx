import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './BarberMap.css'

// Fix default marker icons for Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons
const barberIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
})

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
})

const selectedBarberIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
})

// Component to handle map recentering
const MapController = ({ center }) => {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom())
    }
  }, [center, map])
  
  return null
}

const BarberMap = forwardRef(({ 
  shops = [], 
  selectedShop = null, 
  onShopSelect,
  center = null,
  radius = 5
}, ref) => {
  const mapRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  
  // Default center (Johannesburg)
  const defaultCenter = center || [-26.1081, 28.0473]
  
  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    panTo: (lat, lng) => {
      if (mapRef.current) {
        mapRef.current.setView([lat, lng], 13)
      }
    },
    zoomTo: (level) => {
      if (mapRef.current) {
        mapRef.current.setZoom(level)
      }
    },
    fitBounds: () => {
      if (mapRef.current && shops.length > 0) {
        const bounds = L.latLngBounds(
          shops.map(shop => [
            shop.location.coordinates[1],
            shop.location.coordinates[0]
          ])
        )
        mapRef.current.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }))

  useEffect(() => {
    setMapLoaded(true)
  }, [])

  return (
    <div className="barber-map">
      {mapLoaded && (
        <MapContainer
          ref={mapRef}
          center={defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          {/* OpenStreetMap Tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Map Controller for recentering */}
          <MapController center={defaultCenter} />
          
          {/* User location marker */}
          {center && (
            <Marker position={center} icon={userIcon}>
              <Popup>
                <div className="popup-content">
                  <strong>Your Location</strong>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Radius circle */}
          {center && radius > 0 && (
            <Circle
              center={center}
              radius={radius * 1000} // Convert km to meters
              pathOptions={{
                color: '#e94560',
                fillColor: '#e94560',
                fillOpacity: 0.1,
                weight: 1
              }}
            />
          )}
          
          {/* Barber markers */}
          {shops.map((shop) => {
            const shopPosition = [
              shop.location?.coordinates?.[1] || shop.location?.coordinates?.[0] || 0,
              shop.location?.coordinates?.[0] || 0
            ]
            
            const isSelected = selectedShop?.id === shop.id || selectedShop?._id === shop._id
            
            return (
              <Marker
                key={shop.id || shop._id}
                position={shopPosition}
                icon={isSelected ? selectedBarberIcon : barberIcon}
                eventHandlers={{
                  click: () => onShopSelect?.(shop)
                }}
              >
                <Popup>
                  <div className="popup-content">
                    <strong className="popup-name">{shop.name}</strong>
                    <div className="popup-rating">
                      ⭐ {shop.rating?.toFixed(1) || '0.0'} ({shop.reviewCount || 0} reviews)
                    </div>
                    {shop.distance && (
                      <div className="popup-distance">
                        📍 {shop.distance.formatted || `${shop.distance.km?.toFixed(1)} km`}
                      </div>
                    )}
                    {shop.address && (
                      <div className="popup-address">
                        {shop.address.street}, {shop.address.city}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      )}
    </div>
  )
})

BarberMap.displayName = 'BarberMap'

export default BarberMap