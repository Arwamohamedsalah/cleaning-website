import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/globals.css';
import '../styles/dashboard.css';

// Create custom motorcycle marker icon
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #2596be 0%, #1d7898 100%);
        border: 3px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(37, 150, 190, 0.5);
        position: relative;
        font-size: 28px;
      ">
        🏍️
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });
};

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map updates when position changes
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const Map = ({ 
  center = [24.7136, 46.6753], // Default: Riyadh, Saudi Arabia
  zoom = 13,
  markerPosition = null,
  onMarkerClick = null,
  height = '400px',
  style = {}
}) => {
  const [position, setPosition] = React.useState(markerPosition || center);

  useEffect(() => {
    if (markerPosition) {
      setPosition(markerPosition);
    }
  }, [markerPosition]);

  const handleMapClick = (e) => {
    const newPosition = [e.latlng.lat, e.latlng.lng];
    setPosition(newPosition);
    if (onMarkerClick) {
      onMarkerClick(newPosition);
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height, 
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(37, 150, 190, 0.5)',
      boxShadow: '0 4px 16px rgba(37, 150, 190, 0.3)',
      ...style 
    }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        onClick={handleMapClick}
      >
        {/* Blue theme tile layer with labels */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={position} zoom={zoom} />
        {position && (
          <Marker position={position} icon={createCustomIcon()}>
            <Popup
              style={{
                background: 'linear-gradient(135deg, rgba(37, 150, 190, 0.95) 0%, rgba(29, 120, 152, 0.95) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(37, 150, 190, 0.5)',
                borderRadius: '12px',
                color: '#ffffff',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <div style={{ color: '#ffffff', lineHeight: '1.6' }}>
                <strong style={{ color: '#ffffff' }}>الموقع المحدد</strong><br />
                خط العرض: {position[0].toFixed(6)}<br />
                خط الطول: {position[1].toFixed(6)}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      <style>{`
        .leaflet-container {
          background: linear-gradient(135deg, rgba(37, 150, 190, 0.2) 0%, rgba(37, 150, 190, 0.4) 100%);
        }
        /* Make map blue while keeping labels clear and visible */
        .leaflet-tile-pane {
          filter: hue-rotate(200deg) saturate(1.2) brightness(1.05);
        }
        .leaflet-tile {
          filter: hue-rotate(200deg) saturate(1.2) brightness(1.05);
        }
        .leaflet-tile-container img {
          filter: hue-rotate(200deg) saturate(1.2) brightness(1.05);
        }
        .leaflet-popup-content-wrapper {
          background: linear-gradient(135deg, rgba(37, 150, 190, 0.95) 0%, rgba(29, 120, 152, 0.95) 100%) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(37, 150, 190, 0.5) !important;
          border-radius: 12px !important;
          color: #ffffff !important;
        }
        .leaflet-popup-tip {
          background: linear-gradient(135deg, rgba(37, 150, 190, 0.95) 0%, rgba(29, 120, 152, 0.95) 100%) !important;
          border: 1px solid rgba(37, 150, 190, 0.5) !important;
        }
        .leaflet-control-zoom a {
          background: linear-gradient(135deg, rgba(37, 150, 190, 0.9) 0%, rgba(29, 120, 152, 0.9) 100%) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(37, 150, 190, 0.5) !important;
          color: #ffffff !important;
        }
        .leaflet-control-zoom a:hover {
          background: linear-gradient(135deg, rgba(37, 150, 190, 1) 0%, rgba(29, 120, 152, 1) 100%) !important;
        }
        .leaflet-bar {
          border: 1px solid rgba(37, 150, 190, 0.5) !important;
          box-shadow: 0 4px 12px rgba(37, 150, 190, 0.3) !important;
        }
        .leaflet-popup-content {
          color: #ffffff !important;
        }
        .leaflet-attribution {
          background: rgba(37, 150, 190, 0.8) !important;
          color: #ffffff !important;
          backdrop-filter: blur(10px) !important;
        }
        .leaflet-attribution a {
          color: #ffffff !important;
        }
        /* Keep text labels visible and clear */
        .leaflet-tile-pane canvas,
        .leaflet-tile-pane img {
          filter: hue-rotate(200deg) saturate(1.2) brightness(1.05);
        }
      `}</style>
    </div>
  );
};

export default Map;

