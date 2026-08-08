import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocationCoordinates } from '../../types/location';
import { MapPin, Navigation } from 'lucide-react';

// Custom Map Marker SVG icon fix for Leaflet in React
const customDestinationIcon = new L.DivIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="background: #0284c7; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 12px rgba(2,132,199,0.8); display: flex; align-items: center; justify-content: center;"><div style="background: #ffffff; width: 8px; height: 8px; border-radius: 50%;"></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const customUserLocationIcon = new L.DivIcon({
  className: 'custom-leaflet-user-marker',
  html: `<div style="background: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 12px rgba(16,185,129,0.8); display: flex; align-items: center; justify-content: center;"><div style="background: #ffffff; width: 6px; height: 6px; border-radius: 50%;"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface ChangeViewProps {
  center: [number, number];
}

const ChangeView: React.FC<ChangeViewProps> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
};

interface InteractiveMapProps {
  destinationCoords: LocationCoordinates;
  destinationName: string;
  userCoords?: LocationCoordinates;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  destinationCoords,
  destinationName,
  userCoords,
}) => {
  const center: [number, number] = [destinationCoords.lat, destinationCoords.lng];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Geographic Map View</div>
          <h3 className="text-xl font-bold text-white mt-0.5">{destinationName} Location Map</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Destination
          </span>
          {userCoords && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Your Location
            </span>
          )}
        </div>
      </div>

      <div className="h-80 w-full rounded-2xl overflow-hidden border border-slate-800 relative shadow-inner">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <ChangeView center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Destination Marker */}
          <Marker position={center} icon={customDestinationIcon}>
            <Popup>
              <div className="text-slate-900 font-bold text-xs p-1">
                <div className="flex items-center gap-1 text-sky-600">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{destinationName}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Lat: {destinationCoords.lat.toFixed(4)}, Lng: {destinationCoords.lng.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>

          {/* User Location Marker if available */}
          {userCoords && (
            <Marker position={[userCoords.lat, userCoords.lng]} icon={customUserLocationIcon}>
              <Popup>
                <div className="text-slate-900 font-bold text-xs p-1">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Your Current Location</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};
