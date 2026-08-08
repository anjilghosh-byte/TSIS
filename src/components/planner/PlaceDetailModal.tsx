import React from 'react';
import { X, MapPin, Clock, Ticket, ShieldCheck, Sun, Compass, ExternalLink } from 'lucide-react';
import { TouristPlace } from '../../types/planner';
import { InteractiveMap } from '../analysis/InteractiveMap';

interface PlaceDetailModalProps {
  place: TouristPlace | null;
  onClose: () => void;
  onAddToTrip?: (place: TouristPlace) => void;
  nearbyPlaces?: TouristPlace[];
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  onAddToTrip,
  nearbyPlaces = [],
}) => {
  if (!place) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8">
        {/* Banner image header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header text content */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="inline-block px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2 border border-sky-500/30">
              {place.category}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{place.name}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{place.cityName}</span>
              <span>&bull;</span>
              <span>Approx. {place.distanceFromBaseKm || 2.5} km from center</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <Clock className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-semibold">Visit Duration</div>
                <div className="text-xs font-bold text-white">
                  {Math.round(place.approxDurationMinutes / 60 * 10) / 10} hrs
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <Ticket className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-semibold">Entry Ticket</div>
                <div className="text-xs font-bold text-white truncate">
                  {place.estimatedTicketPrice || 'Free Entry'}
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-semibold">Best Time</div>
                <div className="text-xs font-bold text-white">{place.bestTimeToVisit}</div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-semibold">Venue Type</div>
                <div className="text-xs font-bold text-white">
                  {place.isIndoor ? 'Indoor Facility' : 'Outdoor Venue'}
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">About</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{place.description}</p>
          </div>

          {/* Why Visit Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Why Visit?</h3>
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sm text-sky-200">
              {place.whyVisit}
            </div>
          </div>

          {/* Safety Information */}
          {place.safetyAlert ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">TSIS Safety Note</div>
                <div>{place.safetyAlert}</div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified venue: Standard tourist safety precautions apply.</span>
            </div>
          )}

          {/* Location Map */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Map Location</h3>
            <InteractiveMap
              destinationCoords={place.coordinates}
              destinationName={place.name}
            />
          </div>

          {/* Nearby Places Section */}
          {nearbyPlaces.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Nearby Attractions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nearbyPlaces.slice(0, 2).map((near) => (
                  <div key={near.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <img src={near.image} alt={near.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="text-xs font-bold text-white">{near.name}</div>
                      <div className="text-[11px] text-slate-400">{near.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.cityName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </a>

          {onAddToTrip && (
            <button
              onClick={() => {
                onAddToTrip(place);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-600/20"
            >
              <Compass className="w-4 h-4" />
              <span>Add to My Trip</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
