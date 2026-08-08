import React, { useState } from 'react';
import {
  Compass, Calendar, Sparkles, MapPin, Zap, Check, ArrowRight,
  CheckCircle2, X, AlertCircle, Loader2
} from 'lucide-react';
import { DestinationInfo } from '../../types/location';
import { TripPreferences, PlaceCategory, TripPace, TravelStyle, AccommodationType } from '../../types/planner';
import { searchLocations } from '../../services/locationService';

interface PlannerWizardProps {
  initialDestination?: DestinationInfo;
  onGeneratePlan: (preferences: TripPreferences) => void;
  onOpenMultiCity?: () => void;
}

export const CATEGORY_OPTIONS: { id: PlaceCategory; label: string; icon: string }[] = [
  { id: 'history', label: 'History & Heritage', icon: '🏛️' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'beach', label: 'Beaches', icon: '🏖️' },
  { id: 'religious', label: 'Religious Places', icon: '🛕' },
  { id: 'food', label: 'Food & Culinary', icon: '🍴' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'culture', label: 'Culture & Arts', icon: '🎨' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'adventure', label: 'Adventure', icon: '🏞️' },
  { id: 'family', label: 'Family Friendly', icon: '👨‍👩‍👧' },
  { id: 'relaxed', label: 'Relaxed Travel', icon: '💑' },
  { id: 'budget', label: 'Budget Travel', icon: '🎒' },
];

// ─── Destination Confirmation Card ──────────────────────────────────────────
const DestinationConfirmCard: React.FC<{
  destination: DestinationInfo;
  onConfirm: () => void;
  onChange: () => void;
}> = ({ destination, onConfirm, onChange }) => (
  <div className="mt-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 animate-fade-in space-y-4">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
        <MapPin className="w-5 h-5 text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-0.5">Destination Identified</p>
        <h3 className="text-lg font-extrabold text-white">{destination.name}</h3>
        <p className="text-sm text-slate-300">
          {destination.state ? `${destination.state}, ` : ''}{destination.country}
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-lg font-mono">
            📍 {destination.coordinates.lat.toFixed(4)}°N, {destination.coordinates.lng.toFixed(4)}°E
          </span>
          {destination.description && (
            <span className="text-xs text-slate-400 italic max-w-xs truncate">{destination.description}</span>
          )}
        </div>
      </div>
      <button
        onClick={onChange}
        className="p-1.5 text-slate-500 hover:text-white transition-colors shrink-0"
        title="Change destination"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
    <div className="flex gap-3">
      <button
        onClick={onConfirm}
        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 hover:scale-[1.02]"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Confirm Destination</span>
      </button>
      <button
        onClick={onChange}
        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all border border-slate-700"
      >
        Change
      </button>
    </div>
  </div>
);

// ─── Main Wizard ─────────────────────────────────────────────────────────────
export const PlannerWizard: React.FC<PlannerWizardProps> = ({
  initialDestination,
  onGeneratePlan,
  onOpenMultiCity,
}) => {
  const [step, setStep] = useState<number>(1);
  const [destinationQuery, setDestinationQuery] = useState(initialDestination?.name || '');
  const [selectedDestination, setSelectedDestination] = useState<DestinationInfo | null>(
    initialDestination || null
  );
  // destinationConfirmed = user has clicked "Confirm Destination"
  const [destinationConfirmed, setDestinationConfirmed] = useState<boolean>(!!initialDestination);
  const [searchResults, setSearchResults] = useState<DestinationInfo[]>([]);
  const [durationDays, setDurationDays] = useState<number>(3);
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>(['history', 'culture', 'food']);
  const [pace, setPace] = useState<TripPace>('balanced');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('standard');
  const [accommodationType, setAccommodationType] = useState<AccommodationType>('standard_hotel');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (val: string) => {
    setDestinationQuery(val);
    setDestinationConfirmed(false);
    setSelectedDestination(null);
    setSearchError(null);

    if (val.trim().length >= 2) {
      setIsSearching(true);
      try {
        const res = await searchLocations(val);
        setSearchResults(res);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectResult = (dest: DestinationInfo) => {
    // Validate that the destination has real coordinates
    if (!dest.coordinates || dest.coordinates.lat === 0 || dest.coordinates.lng === 0) {
      setSearchError('Could not resolve coordinates for this destination. Please select another option.');
      return;
    }
    setSelectedDestination(dest);
    setDestinationQuery(dest.name);
    setSearchResults([]);
    setSearchError(null);
    setDestinationConfirmed(false); // force user to click Confirm
  };

  const handleConfirmDestination = () => {
    if (selectedDestination) {
      setDestinationConfirmed(true);
    }
  };

  const handleChangeDestination = () => {
    setDestinationConfirmed(false);
    setDestinationQuery('');
    setSelectedDestination(null);
    setSearchResults([]);
  };

  const handleNextStep = async () => {
    if (!destinationConfirmed || !selectedDestination) {
      // Auto-resolve if user has typed but not selected
      if (destinationQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await searchLocations(destinationQuery);
          if (res.length > 0) {
            const best = res[0];
            if (best.coordinates && best.coordinates.lat !== 0) {
              setSelectedDestination(best);
              setDestinationQuery(best.name);
              setDestinationConfirmed(false);
              setSearchResults([]);
              setSearchError('Please confirm the destination below before continuing.');
            } else {
              setSearchError('Could not auto-resolve destination. Please select from the dropdown.');
            }
          } else {
            setSearchError('No results found. Try a different spelling.');
          }
        } catch {
          setSearchError('Search failed. Please try again.');
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchError('Please enter and confirm a destination first.');
      }
      return;
    }
    setStep(2);
  };

  const toggleCategory = (cat: PlaceCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleFinish = () => {
    if (!selectedDestination || !destinationConfirmed) return;

    onGeneratePlan({
      destination: selectedDestination,
      durationDays,
      categories: selectedCategories.length > 0 ? selectedCategories : ['history', 'culture'],
      pace,
      travelStyle,
      accommodationType,
    });
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/30 shadow-2xl space-y-6">
      {/* Header & Steps Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Smart Travel Planner Wizard</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Plan Your Perfect Trip</h2>
        </div>

        <div className="flex items-center gap-2">
          {onOpenMultiCity && (
            <button
              onClick={onOpenMultiCity}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>🧭 Multi-City Trip</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300">
            <span>Step {step} of 3</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Destination & Duration */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>Where are you going?</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Enter destination (e.g. Digha, Kolkata, Jaipur, Goa)..."
                className="w-full bg-slate-900 text-white placeholder-slate-400 text-sm rounded-2xl px-4 py-3.5 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                autoComplete="off"
              />
              {isSearching && (
                <div className="absolute right-4 top-3.5 flex items-center gap-1.5 text-xs text-sky-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Resolving location...</span>
                </div>
              )}

              {searchResults.length > 0 && !destinationConfirmed && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-800">
                  {searchResults.map((dest) => (
                    <div
                      key={dest.id}
                      onClick={() => handleSelectResult(dest)}
                      className="p-3 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white">{dest.name}</div>
                        <div className="text-xs text-slate-400">
                          {dest.state ? `${dest.state}, ` : ''}{dest.country}
                          {dest.coordinates && dest.coordinates.lat !== 0 && (
                            <span className="ml-2 text-emerald-500 font-mono text-[10px]">
                              ({dest.coordinates.lat.toFixed(2)}°N)
                            </span>
                          )}
                        </div>
                      </div>
                      <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error message */}
            {searchError && (
              <div className="mt-2 flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {/* Destination Confirmation Card */}
            {selectedDestination && !destinationConfirmed && (
              <DestinationConfirmCard
                destination={selectedDestination}
                onConfirm={handleConfirmDestination}
                onChange={handleChangeDestination}
              />
            )}

            {/* Confirmed badge */}
            {destinationConfirmed && selectedDestination && (
              <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-semibold">
                  {selectedDestination.name}, {selectedDestination.state && `${selectedDestination.state}, `}{selectedDestination.country}
                  — Location confirmed and geocoded ✓
                </span>
                <button
                  onClick={handleChangeDestination}
                  className="ml-auto text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Popular quick picks */}
            <div className="text-xs text-slate-400 mt-3 flex flex-wrap gap-2">
              <span>Popular:</span>
              {['Digha', 'Kolkata', 'Jaipur', 'Udaipur', 'Darjeeling', 'Manali', 'Goa', 'Puri'].map((c) => (
                <button
                  key={c}
                  onClick={() => handleSearch(c)}
                  className="px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-sky-500/20 text-slate-300 text-[11px] transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>How many days are you staying?</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setDurationDays(num)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    durationDays === num
                      ? 'bg-sky-600 text-white border-sky-400 shadow-lg shadow-sky-600/30'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {num} {num === 1 ? 'Day' : 'Days'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={handleNextStep}
              disabled={isSearching}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-600/20 transition-all hover:scale-[1.02]"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Resolving...</span>
                </>
              ) : (
                <span>Next: Preferences →</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Trip Preferences & Categories */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          {selectedDestination && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Planning trip to <span className="text-white font-bold">{selectedDestination.name}</span>
                {selectedDestination.state ? `, ${selectedDestination.state}` : ''}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>What type of trip do you prefer? (Select multiple)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-3 rounded-xl text-left border text-xs font-medium transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>Travel Pace</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'relaxed', title: 'Relaxed', desc: '2 places/day, extra rest' },
                { id: 'balanced', title: 'Balanced', desc: '3–4 places/day, optimal' },
                { id: 'packed', title: 'Packed', desc: '5+ places/day, action packed' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPace(item.id as TripPace)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    pace === item.id
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs text-white">{item.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              &larr; Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-600/20"
            >
              <span>Next: Budget & Style →</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Travel Style & Budget Options */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          {selectedDestination && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Planning trip to <span className="text-white font-bold">{selectedDestination.name}</span>
                {selectedDestination.state ? `, ${selectedDestination.state}` : ''} — {durationDays} days</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Travel Style</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'budget', title: '🎒 Budget', desc: 'Local transit & economical eats' },
                { id: 'standard', title: '🧳 Standard', desc: 'Cabs/taxis & popular restaurants' },
                { id: 'premium', title: '👑 Premium', desc: 'Private luxury tours & fine dining' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setTravelStyle(st.id as TravelStyle)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    travelStyle === st.id
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs text-white">{st.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{st.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Accommodation Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'hostel', title: 'Hostel / Homestay' },
                { id: 'budget_hotel', title: 'Budget Hotel' },
                { id: 'standard_hotel', title: '3-Star / 4-Star' },
                { id: 'premium_hotel', title: '5-Star Luxury Resort' },
              ].map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccommodationType(acc.id as AccommodationType)}
                  className={`p-3 rounded-xl text-center border text-xs font-semibold transition-all ${
                    accommodationType === acc.id
                      ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {acc.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              &larr; Back
            </button>
            <button
              onClick={handleFinish}
              disabled={!selectedDestination || !destinationConfirmed}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-sky-500/25 transition-all hover:scale-105"
            >
              <Compass className="w-5 h-5" />
              <span>Generate Smart Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
