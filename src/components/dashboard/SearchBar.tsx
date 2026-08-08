import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Loader2, ShieldCheck, Compass } from 'lucide-react';
import { DestinationInfo } from '../../types/location';
import { searchLocations } from '../../services/locationService';

interface SearchBarProps {
  onSelectDestination: (destination: DestinationInfo) => void;
  onPlanTripForDestination?: (destination: DestinationInfo) => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectDestination,
  onPlanTripForDestination,
  onUseCurrentLocation,
  isLoadingLocation = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DestinationInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 1) {
        setIsSearching(true);
        const res = await searchLocations(query);
        setResults(res);
        setIsSearching(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSafety = (dest: DestinationInfo) => {
    setQuery(dest.name);
    setIsOpen(false);
    onSelectDestination(dest);
  };

  const handleSelectPlan = (dest: DestinationInfo) => {
    setQuery(dest.name);
    setIsOpen(false);
    if (onPlanTripForDestination) {
      onPlanTripForDestination(dest);
    } else {
      onSelectDestination(dest);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative" ref={dropdownRef}>
      <div className="glass-panel p-2 rounded-2xl border border-sky-500/30 shadow-2xl shadow-sky-500/10 flex flex-col sm:flex-row items-center gap-2">
        {/* Search input field */}
        <div className="relative flex-1 w-full flex items-center">
          <Search className="w-5 h-5 text-sky-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 1 && setIsOpen(true)}
            placeholder="Search destination (e.g. Kolkata, Jaipur, Darjeeling, Goa)..."
            className="w-full bg-slate-900/90 text-white placeholder-slate-400 text-sm sm:text-base rounded-xl pl-12 pr-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50 border border-slate-800"
          />
          {isSearching && (
            <Loader2 className="w-4 h-4 text-sky-400 absolute right-4 animate-spin" />
          )}
        </div>

        {/* Current Location button */}
        <button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLoadingLocation}
          className="w-full sm:w-auto px-5 py-3.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700 shrink-0"
        >
          {isLoadingLocation ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Navigation className="w-4 h-4 text-emerald-400" />
          )}
          <span>Near Me</span>
        </button>
      </div>

      {/* Unified Search Dropdown with Dual Actions */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto divide-y divide-slate-800/60">
          {results.length > 0 ? (
            results.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleSelectSafety(dest)}
                className="p-3.5 hover:bg-slate-800/80 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm group-hover:text-sky-300 transition-colors">
                      {dest.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {dest.state ? `${dest.state}, ` : ''}
                      {dest.country}
                    </div>
                  </div>
                </div>

                {/* Dual Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSafety(dest);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Check Safety</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(dest);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-md"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Plan My Trip</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-slate-400 text-xs">
              No matching destinations found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
