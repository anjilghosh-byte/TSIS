import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DayItinerary } from '../../types/planner';
import { LocationCoordinates } from '../../types/location';
import { MapPin, Navigation, Route } from 'lucide-react';

interface ItineraryMapRouteProps {
  dayItinerary: DayItinerary;
  baseCoordinates: LocationCoordinates;
  destinationName: string;
}

// Function to generate custom numbered map icons for route stops
function createNumberedMarkerIcon(number: number | string, isHotel: boolean = false) {
  const bgColor = isHotel ? '#10b981' : '#0284c7';
  const borderColor = '#ffffff';
  const shadowColor = isHotel ? 'rgba(16,185,129,0.7)' : 'rgba(2,132,199,0.7)';

  return new L.DivIcon({
    className: `custom-route-marker-${number}`,
    html: `
      <div style="
        background: ${bgColor};
        color: #ffffff;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid ${borderColor};
        box-shadow: 0 0 12px ${shadowColor};
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 13px;
        font-family: sans-serif;
      ">
        ${number}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

const ChangeMapView: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
};

export const ItineraryMapRoute: React.FC<ItineraryMapRouteProps> = ({
  dayItinerary,
  baseCoordinates,
  destinationName,
}) => {
  const center: [number, number] = [baseCoordinates.lat, baseCoordinates.lng];

  // Build sequential polyline route coordinates
  const routePoints: [number, number][] = [
    [baseCoordinates.lat, baseCoordinates.lng], // Start at Base / Hotel
    ...dayItinerary.items.map(
      (item): [number, number] => [item.place.coordinates.lat, item.place.coordinates.lng]
    ),
    [baseCoordinates.lat, baseCoordinates.lng], // Return to Base / Hotel
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Route className="w-3.5 h-3.5" />
            <span>Map-Based Daily Route</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-0.5">
            {dayItinerary.title} Route Map
          </h3>
        </div>

        {/* Route Steps Summary */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Base Hotel
          </span>
          <span>&rarr;</span>
          <span className="flex items-center gap-1 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> {dayItinerary.items.length} Attractions
          </span>
        </div>
      </div>

      {/* Map View */}
      <div className="h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-800 relative shadow-inner">
        <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="h-full w-full">
          <ChangeMapView center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Connect points with Polyline route line */}
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: '#0284c7',
              weight: 4,
              opacity: 0.8,
              dashArray: '8, 8',
            }}
          />

          {/* Base / Hotel Marker */}
          <Marker position={center} icon={createNumberedMarkerIcon('🏨', true)}>
            <Popup>
              <div className="text-slate-900 font-bold text-xs p-1">
                <div className="flex items-center gap-1 text-emerald-700">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Base Hotel / Origin</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{destinationName}</div>
              </div>
            </Popup>
          </Marker>

          {/* Attraction Markers */}
          {dayItinerary.items.map((item, idx) => {
            const stopPos: [number, number] = [item.place.coordinates.lat, item.place.coordinates.lng];
            return (
              <Marker
                key={item.id}
                position={stopPos}
                icon={createNumberedMarkerIcon(idx + 1, false)}
              >
                <Popup>
                  <div className="text-slate-900 font-bold text-xs p-1 space-y-0.5">
                    <div className="flex items-center gap-1 text-sky-700">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Stop {idx + 1}: {item.place.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Suggested Time: {item.suggestedTimeSlot}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Duration: {Math.round(item.durationMinutes / 60 * 10) / 10} hrs
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Visual Sequence Chain */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs overflow-x-auto scrollbar-thin flex items-center gap-3">
        <span className="font-bold text-emerald-400 shrink-0">HOTEL</span>
        {dayItinerary.items.map((item, idx) => (
          <React.Fragment key={item.id}>
            <span className="text-slate-600 font-extrabold">&rarr;</span>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 shrink-0">
              <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="font-semibold text-white">{item.place.name}</span>
            </div>
          </React.Fragment>
        ))}
        <span className="text-slate-600 font-extrabold">&rarr;</span>
        <span className="font-bold text-emerald-400 shrink-0">HOTEL</span>
      </div>
    </div>
  );
};
