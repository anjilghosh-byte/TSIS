import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  RefreshCw,
  Trash2,
  Star,
  CheckCircle2,
  CloudSun,
  ShieldCheck,
  Zap,
  Info,
  Save,
  Car,
  Lock,
} from 'lucide-react';
import { CompleteTripPlan, DayItinerary, ItineraryItem, TouristPlace } from '../../types/planner';
import { ItineraryMapRoute } from './ItineraryMapRoute';
import { UserProfile } from '../../services/authService';
import { savePlan } from '../../services/savedItineraryService';
import { addVisitedPlace } from '../../services/travelHistoryService';

interface ItineraryViewProps {
  plan: CompleteTripPlan;
  onUpdatePlan: (updatedPlan: CompleteTripPlan) => void;
  onReplanDay: (dayNumber: number) => void;
  onSelectPlaceDetails: (place: TouristPlace) => void;
  availablePlaces?: TouristPlace[];
  currentUser?: UserProfile | null;
  onLoginRequired?: () => void;
}

// ─── Mark as Visited Modal ───────────────────────────────────────────────────
const MarkVisitedModal: React.FC<{
  destinationName: string;
  onClose: () => void;
  onSave: (startDate: string, endDate: string) => void;
}> = ({ destinationName, onClose, onSave }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please fill in both dates.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be after start date.');
      return;
    }
    onSave(startDate, endDate);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Mark as Visited
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          When did you visit <span className="text-white font-semibold">{destinationName}</span>?
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-slate-600 text-slate-400 hover:border-slate-400 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition text-sm"
            >
              Save Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main ItineraryView ───────────────────────────────────────────────────────
export const ItineraryView: React.FC<ItineraryViewProps> = ({
  plan,
  onUpdatePlan,
  onReplanDay,
  onSelectPlaceDetails,
  availablePlaces = [],
  currentUser,
  onLoginRequired,
}) => {
  const [activeDayNum, setActiveDayNum] = useState<number>(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showMarkVisited, setShowMarkVisited] = useState(false);
  const [visitedSuccess, setVisitedSuccess] = useState(false);

  const activeDay = plan.days.find((d) => d.dayNumber === activeDayNum) || plan.days[0];

  const handleToggleFavorite = (placeId: string) => {
    setFavorites((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
    );
  };

  const handleRemoveItem = (dayNumber: number, itemId: string) => {
    const updatedDays = plan.days.map((d) => {
      if (d.dayNumber === dayNumber) {
        return { ...d, items: d.items.filter((item) => item.id !== itemId) };
      }
      return d;
    });
    onUpdatePlan({ ...plan, days: updatedDays });
  };

  const handleAcceptAlternative = (dayNumber: number, itemId: string, altPlace: TouristPlace) => {
    const updatedDays = plan.days.map((d) => {
      if (d.dayNumber === dayNumber) {
        return {
          ...d,
          items: d.items.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                place: altPlace,
                weatherAlert: undefined,
                alternativeSuggested: undefined,
                notes: `Swapped to indoor alternative (${altPlace.name}) for weather protection.`,
              };
            }
            return item;
          }),
        };
      }
      return d;
    });
    onUpdatePlan({ ...plan, days: updatedDays });
  };

  const handleSaveItinerary = () => {
    if (!currentUser) {
      onLoginRequired?.();
      return;
    }
    setSaveStatus('saving');
    try {
      const title = `${plan.destination.name} — ${plan.durationDays} Days`;
      savePlan(currentUser.id, plan, title);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleMarkVisited = (startDate: string, endDate: string) => {
    if (!currentUser) return;
    const days =
      Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    try {
      addVisitedPlace(currentUser.id, {
        destinationId: plan.destination.id,
        destinationName: plan.destination.name,
        country: plan.destination.country || 'India',
        state: plan.destination.state,
        latitude: plan.destination.coordinates?.lat || 0,
        longitude: plan.destination.coordinates?.lng || 0,
        startDate,
        endDate,
        days,
        tripId: plan.id,
      });
      setShowMarkVisited(false);
      setVisitedSuccess(true);
      setTimeout(() => setVisitedSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {showMarkVisited && (
        <MarkVisitedModal
          destinationName={plan.destination.name}
          onClose={() => setShowMarkVisited(false)}
          onSave={handleMarkVisited}
        />
      )}

      {/* Plan Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/30 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2 border border-sky-500/30">
              <span>✅ Geo-Verified Smart Itinerary</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Your {plan.durationDays}-Day {plan.destination.name} Trip
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Optimized for {plan.preferences.pace} pace &bull; Focus: {plan.preferences.categories.join(', ')}
            </p>
            {plan.destination.state && (
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {plan.destination.name}, {plan.destination.state}, {plan.destination.country}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Save Itinerary */}
            <button
              onClick={handleSaveItinerary}
              disabled={saveStatus === 'saving'}
              className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 border shadow-lg transition-all hover:scale-105 ${
                saveStatus === 'saved'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : saveStatus === 'error'
                  ? 'bg-red-500/20 border-red-500/40 text-red-300'
                  : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-500/40'
              }`}
            >
              {!currentUser ? <Lock className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>
                {saveStatus === 'saved' ? '✅ Saved!' : saveStatus === 'error' ? '❌ Error' : '💾 Save Itinerary'}
              </span>
            </button>

            {/* Mark as Visited */}
            {currentUser && !visitedSuccess && (
              <button
                onClick={() => setShowMarkVisited(true)}
                className="px-5 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-extrabold text-xs flex items-center gap-2 border border-emerald-500/40 shadow-lg transition-all hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>✓ Mark as Visited</span>
              </button>
            )}
            {visitedSuccess && (
              <div className="px-5 py-3 rounded-2xl bg-emerald-500/20 text-emerald-300 font-extrabold text-xs flex items-center gap-2 border border-emerald-500/40">
                <CheckCircle2 className="w-4 h-4" />
                <span>Added to Travel History!</span>
              </div>
            )}

            {/* Replan Day */}
            <button
              onClick={() => onReplanDay(activeDayNum)}
              className="px-5 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs flex items-center gap-2 border border-amber-500/40 shadow-lg transition-all hover:scale-105"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              <span>🔄 Replan Day {activeDayNum}</span>
            </button>
          </div>
        </div>

        {/* Auth notice for save */}
        {!currentUser && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            <span>Log in to save itineraries and mark destinations as visited.</span>
          </div>
        )}
      </div>

      {/* Day Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {plan.days.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDayNum(day.dayNumber)}
            className={`px-5 py-3 rounded-2xl font-extrabold text-xs transition-all whitespace-nowrap flex items-center gap-2 border ${
              activeDayNum === day.dayNumber
                ? 'bg-sky-600 text-white border-sky-400 shadow-lg shadow-sky-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Day {day.dayNumber}</span>
          </button>
        ))}
      </div>

      {/* Weather & Safety Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeDay.dailyWeatherSummary && (
          <div className="p-4 rounded-2xl glass-panel bg-sky-500/10 border border-sky-500/30 flex items-center gap-3 text-xs text-sky-200">
            <CloudSun className="w-6 h-6 text-sky-400 shrink-0" />
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[10px]">Weather Forecast</div>
              <div dangerouslySetInnerHTML={{ __html: activeDay.dailyWeatherSummary }} />
            </div>
          </div>
        )}

        {activeDay.dailySafetySummary && (
          <div className="p-4 rounded-2xl glass-panel bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-200">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[10px]">Safety Overview</div>
              <div>{activeDay.dailySafetySummary}</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Day Timeline */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-xl font-extrabold text-white">{activeDay.title}</h3>
          <span className="text-xs text-slate-400 font-semibold">{activeDay.items.length} Attractions Scheduled</span>
        </div>

        <div className="space-y-4">
          {activeDay.items.map((item) => {
            const isFav = favorites.includes(item.place.id);
            const isDayTrip = (item.place as any).isDayTrip === true;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border hover:border-sky-500/40 transition-all space-y-4 shadow-md ${
                  isDayTrip
                    ? 'bg-amber-950/30 border-amber-700/40'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                {/* Day Trip Badge */}
                {isDayTrip && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 w-fit">
                    <Car className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">🚗 Day Trip — Additional Travel Required</span>
                  </div>
                )}

                {/* Weather Alert */}
                {item.weatherAlert && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-2">
                    <div className="flex items-start gap-2 font-semibold">
                      <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item.weatherAlert}</span>
                    </div>

                    {item.alternativeSuggested && (
                      <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-[11px] font-bold text-amber-400">Suggested Weather-Safe Alternative</div>
                          <div className="font-bold text-white text-xs">{item.alternativeSuggested.name}</div>
                          <div className="text-[10px] text-slate-400">{item.alternativeSuggested.description}</div>
                        </div>
                        <button
                          onClick={() => handleAcceptAlternative(activeDay.dayNumber, item.id, item.alternativeSuggested!)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shrink-0"
                        >
                          Accept Alternative
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline Item Main Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Time Slot Tag */}
                    <div className="px-3 py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold font-mono shrink-0">
                      {item.suggestedTimeSlot}
                    </div>

                    {/* Image & Title */}
                    <div className="flex items-center gap-3">
                      <img
                        src={item.place.image}
                        alt={item.place.name}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div>
                        <h4
                          onClick={() => onSelectPlaceDetails(item.place)}
                          className="font-bold text-white text-base hover:text-sky-300 cursor-pointer transition-colors flex items-center gap-1.5"
                        >
                          <span>{item.place.name}</span>
                          <Info className="w-3.5 h-3.5 text-sky-400" />
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="capitalize text-sky-400 font-medium">{item.place.category}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.round((item.durationMinutes / 60) * 10) / 10} hrs
                          </span>
                          {item.place.distanceFromBaseKm !== undefined && (
                            <>
                              <span>&bull;</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {item.place.distanceFromBaseKm} km
                              </span>
                            </>
                          )}
                        </div>
                        {item.place.estimatedTicketPrice && (
                          <div className="text-[10px] text-slate-500 mt-0.5">{item.place.estimatedTicketPrice}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleToggleFavorite(item.place.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isFav
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                      }`}
                      title="Add to Favorites"
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleRemoveItem(activeDay.dayNumber, item.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors"
                      title="Remove from itinerary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {activeDay.items.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No attractions scheduled for this day.</p>
              <p className="text-xs mt-1">Use the Discovery tab to add places.</p>
            </div>
          )}
        </div>
      </div>

      {/* Leaflet Map Route */}
      <ItineraryMapRoute
        dayItinerary={activeDay}
        baseCoordinates={plan.destination.coordinates}
        destinationName={plan.destination.name}
      />
    </div>
  );
};
