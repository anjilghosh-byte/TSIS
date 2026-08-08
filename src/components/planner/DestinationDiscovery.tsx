import React, { useState } from 'react';
import { MapPin, Clock, Ticket, ShieldCheck, Sparkles, Filter, Info, Plus } from 'lucide-react';
import { TouristPlace, PlaceCategory } from '../../types/planner';
import { CATEGORY_OPTIONS } from './PlannerWizard';

interface DestinationDiscoveryProps {
  destinationName: string;
  places: TouristPlace[];
  onSelectPlace: (place: TouristPlace) => void;
  onAddPlaceToItinerary?: (place: TouristPlace) => void;
}

export const DestinationDiscovery: React.FC<DestinationDiscoveryProps> = ({
  destinationName,
  places,
  onSelectPlace,
  onAddPlaceToItinerary,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPlaces = selectedCategory === 'all'
    ? places
    : places.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Destination Discovery</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Places You Can Visit in {destinationName}
          </h2>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Places ({places.length})
          </button>
          {CATEGORY_OPTIONS.map((cat) => {
            const count = places.filter((p) => p.category === cat.id).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Place Cards Grid */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="glass-panel bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-800 hover:border-sky-500/40 transition-all hover:scale-[1.02] shadow-xl flex flex-col group"
            >
              {/* Card Image Banner */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

                {/* Category Badge */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-sky-300 border border-sky-500/30 text-[11px] font-bold uppercase tracking-wider">
                  {place.category}
                </span>

                {/* Indoor/Outdoor Badge */}
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-slate-300 text-[11px] font-medium border border-slate-800">
                  {place.isIndoor ? '🏛️ Indoor' : '🌿 Outdoor'}
                </span>
              </div>

              {/* Card Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {place.description}
                  </p>
                </div>

                {/* Place Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>~{Math.round(place.approxDurationMinutes / 60 * 10) / 10} hrs visit</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate">{place.estimatedTicketPrice || 'Free Entry'}</span>
                  </div>
                </div>

                {/* Distance & Action buttons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <MapPin className="w-3 h-3 text-sky-400" />
                    <span>{place.distanceFromBaseKm || 2.1} km from center</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectPlace(place)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-sky-400" />
                      <span>Details</span>
                    </button>

                    {onAddPlaceToItinerary && (
                      <button
                        onClick={() => onAddPlaceToItinerary(place)}
                        className="px-3 py-1.5 rounded-xl bg-sky-600/90 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 glass-panel rounded-3xl text-center space-y-2 border border-slate-800">
          <Filter className="w-8 h-8 text-slate-500 mx-auto" />
          <div className="text-sm font-bold text-white">No places found in this category</div>
          <div className="text-xs text-slate-400">Try selecting "All Places" to view all available attractions.</div>
        </div>
      )}
    </div>
  );
};
