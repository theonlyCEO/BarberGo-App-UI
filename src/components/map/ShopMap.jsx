import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './ShopMap.css'

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const shopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const ShopMap = ({ shop, userLocation, height = '100%', showDirections = true }) => {
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    setMapLoaded(true)
  }, [])

  if (!shop || !shop.location) {
    return (
      <div className="shop-map-placeholder">
        <span>📍</span>
        <p>Location not available</p>
      </div>
    )
  }

  const { coordinates } = shop.location
  const shopPosition = [coordinates[1], coordinates[0]] // [lat, lng]
  
  return (
    <div className="shop-map" style={{ height }}>
      {mapLoaded && (
        <MapContainer
          center={shopPosition}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Shop marker */}
          <Marker position={shopPosition} icon={shopIcon}>
            <Popup>
              <div className="shop-popup">
                <strong>{shop.name}</strong>
                <p>{shop.address?.street}, {shop.address?.city}</p>
                {showDirections && (
                  <a 
                    href={`https://www.openstreetmap.org/directions?from=&to=${shopPosition[0]},${shopPosition[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
          
          {/* User location marker */}
          {userLocation && (
            <Marker 
              position={[userLocation.latitude, userLocation.longitude]} 
              icon={userIcon}
            >
              <Popup>Your Location</Popup>
            </Marker>
          )}
        </MapContainer>
      )}
    </div>
  )
}

export default ShopMap