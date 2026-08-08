import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, ShieldAlert, Loader2, Sparkles, PhoneCall, Building2 } from 'lucide-react';
import { LocationCoordinates } from '../../types/location';
import { TouristPlace } from '../../types/planner';
import { getPlacesNearLocation } from '../../services/tourismService';

interface PlacesNearMeProps {
  userLocation?: LocationCoordinates;
  onUseCurrentLocation?: () => void;
  isLoadingLocation?: boolean;
}

export const PlacesNearMe: React.FC<PlacesNearMeProps> = ({
  userLocation,
  onUseCurrentLocation,
  isLoadingLocation = false,
}) => {
  const [nearbyPlaces, setNearbyPlaces] = useState<TouristPlace[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (userLocation) {
      setLoading(true);
      getPlacesNearLocation(userLocation, filter)
        .then((res) => setNearbyPlaces(res))
        .finally(() => setLoading(false));
    }
  }, [userLocation, filter]);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" />
            <span>Geolocation Discovery</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Places Near Me</h2>
        </div>

        {!userLocation && onUseCurrentLocation && (
          <button
            onClick={onUseCurrentLocation}
            disabled={isLoadingLocation}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            {isLoadingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            <span>Enable Geolocation</span>
          </button>
        )}
      </div>

      {userLocation ? (
        <div className="space-y-6">
          {/* Quick Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: 'all', label: 'All Nearby' },
              { id: 'history', label: '🏛️ Museums & Forts' },
              { id: 'nature', label: '🌿 Parks & Nature' },
              { id: 'food', label: '🍴 Food & Dining' },
              { id: 'emergency', label: '🚨 Emergency & Police' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === f.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Finding verified places near your position...</span>
            </div>
          ) : nearbyPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearbyPlaces.map((place) => (
                <div
                  key={place.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-start gap-3"
                >
                  <img src={place.image} alt={place.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{place.name}</h4>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{place.description}</div>
                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 mt-2 font-mono">
                      <MapPin className="w-3 h-3" />
                      <span>{place.distanceFromBaseKm || 1.2} km away</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs">
              No specific places found within immediate radius. Search standard tourist destinations above.
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
          <Navigation className="w-8 h-8 text-slate-600 mx-auto" />
          <div className="text-sm font-bold text-white">Location Access Required</div>
          <div className="text-xs text-slate-400 max-w-md mx-auto">
            Grant browser location access to discover nearby attractions, local dining, emergency hospitals, and police stations in real time.
          </div>
        </div>
      )}
    </div>
  );
};
