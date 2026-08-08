import React, { useState, useEffect } from 'react';
import { DestinationInfo, LocationCoordinates } from '../types/location';
import { TripPreferences, CompleteTripPlan, TouristPlace, MultiCityPlan } from '../types/planner';
import { PlannerWizard } from '../components/planner/PlannerWizard';
import { DestinationDiscovery } from '../components/planner/DestinationDiscovery';
import { PlaceDetailModal } from '../components/planner/PlaceDetailModal';
import { ItineraryView } from '../components/planner/ItineraryView';
import { TripSummaryView } from '../components/planner/TripSummaryView';
import { PlacesNearMe } from '../components/planner/PlacesNearMe';
import { MultiCityPlannerView } from '../components/planner/MultiCityPlannerView';
import { AiTravelAssistantDrawer } from '../components/planner/AiTravelAssistantDrawer';
import { generateItinerary, replanDay } from '../services/itineraryService';
import { getPlacesForDestination } from '../services/tourismService';
import { fetchWeatherData } from '../services/weatherService';
import { fetchHistoricalCrimeData } from '../services/crimeDataService';
import { fetchDestinationNews } from '../services/newsService';
import { calculateRiskAssessment } from '../services/riskAssessmentService';
import { Compass, MapPin, Sparkles, Navigation, List, ShieldCheck } from 'lucide-react';

import { UserProfile } from '../services/authService';

interface TravelPlannerPageProps {
  initialDestination?: DestinationInfo;
  userLocation?: LocationCoordinates;
  onUseCurrentLocation?: () => void;
  isLoadingLocation?: boolean;
  isDemoMode?: boolean;
  onSelectDestinationForSafety?: (dest: DestinationInfo) => void;
  currentUser?: UserProfile | null;
}

export const TravelPlannerPage: React.FC<TravelPlannerPageProps> = ({
  initialDestination,
  userLocation,
  onUseCurrentLocation,
  isLoadingLocation = false,
  isDemoMode = false,
  onSelectDestinationForSafety,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'wizard' | 'discovery' | 'itinerary' | 'multicity' | 'nearme'>('wizard');
  const [currentDestination, setCurrentDestination] = useState<DestinationInfo>(
    initialDestination || {
      id: 'kolkata',
      name: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
      coordinates: { lat: 22.5726, lng: 88.3639 },
    }
  );

  const [availablePlaces, setAvailablePlaces] = useState<TouristPlace[]>([]);
  const [activePlan, setActivePlan] = useState<CompleteTripPlan | null>(null);
  const [selectedPlaceModal, setSelectedPlaceModal] = useState<TouristPlace | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    getPlacesForDestination(currentDestination.name, currentDestination.coordinates).then((places) =>
      setAvailablePlaces(places)
    );
  }, [currentDestination]);

  const handleGeneratePlan = async (preferences: TripPreferences) => {
    setIsGenerating(true);
    setCurrentDestination(preferences.destination);

    try {
      // Retrieve real-time weather, crime, and news data to make itinerary weather and safety aware
      const weather = await fetchWeatherData(preferences.destination.coordinates, isDemoMode);
      const crime = fetchHistoricalCrimeData(preferences.destination.name, preferences.destination.state);
      const news = await fetchDestinationNews(preferences.destination.name, isDemoMode);

      const safety = calculateRiskAssessment(weather, crime, news, 'general_tourism');

      const newPlan = await generateItinerary(preferences, weather, safety);
      setActivePlan(newPlan);
      setActiveTab('itinerary');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReplanDay = async (dayNum: number) => {
    if (!activePlan) return;
    const weather = await fetchWeatherData(activePlan.destination.coordinates, isDemoMode);
    const updatedDay = replanDay(
      activePlan.days.find((d) => d.dayNumber === dayNum) || activePlan.days[0],
      weather,
      availablePlaces
    );

    const updatedDays = activePlan.days.map((d) => (d.dayNumber === dayNum ? updatedDay : d));
    setActivePlan({ ...activePlan, days: updatedDays });
  };

  const handleAddPlaceToItinerary = (place: TouristPlace) => {
    if (!activePlan) {
      alert(`Plan your trip first using the wizard above!`);
      setActiveTab('wizard');
      return;
    }

    const updatedDays = [...activePlan.days];
    const targetDay = updatedDays[0];
    const newItem = {
      id: `custom-add-${Date.now()}`,
      place,
      suggestedTimeSlot: 'Flexible Slot',
      periodOfDay: 'evening' as const,
      durationMinutes: place.approxDurationMinutes,
    };

    targetDay.items.push(newItem);
    setActivePlan({ ...activePlan, days: updatedDays });
    setActiveTab('itinerary');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>TSIS AI Tourist Guide & Smart Travel Planner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Plan Your Journey in <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">{currentDestination.name}</span>
          </h1>
        </div>

        {/* View Switcher Sub-nav */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('wizard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wizard'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Trip Wizard</span>
          </button>

          <button
            onClick={() => setActiveTab('discovery')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'discovery'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Places</span>
          </button>

          {activePlan && (
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'itinerary'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>My Itinerary ({activePlan.durationDays}D)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('nearme')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'nearme'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Near Me</span>
          </button>
        </div>
      </div>

      {/* VIEW: Trip Setup Wizard */}
      {activeTab === 'wizard' && (
        <div className="space-y-8">
          <PlannerWizard
            initialDestination={currentDestination}
            onGeneratePlan={handleGeneratePlan}
            onOpenMultiCity={() => setActiveTab('multicity')}
          />
          <DestinationDiscovery
            destinationName={currentDestination.name}
            places={availablePlaces}
            onSelectPlace={(p) => setSelectedPlaceModal(p)}
            onAddPlaceToItinerary={handleAddPlaceToItinerary}
          />
        </div>
      )}

      {/* VIEW: Destination Discovery Grid */}
      {activeTab === 'discovery' && (
        <DestinationDiscovery
          destinationName={currentDestination.name}
          places={availablePlaces}
          onSelectPlace={(p) => setSelectedPlaceModal(p)}
          onAddPlaceToItinerary={handleAddPlaceToItinerary}
        />
      )}

      {/* VIEW: Active Generated Itinerary */}
      {activeTab === 'itinerary' && activePlan && (
        <div className="space-y-8">
          <ItineraryView
            plan={activePlan}
            onUpdatePlan={(p) => setActivePlan(p)}
            onReplanDay={handleReplanDay}
            onSelectPlaceDetails={(p) => setSelectedPlaceModal(p)}
            availablePlaces={availablePlaces}
            currentUser={currentUser}
          />
          <TripSummaryView plan={activePlan} />

          {/* Quick link to Safety Analysis for this destination */}
          {onSelectDestinationForSafety && (
            <div className="p-6 glass-panel rounded-3xl border border-sky-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-white text-base">Want to check full safety intelligence?</h4>
                <p className="text-xs text-slate-300">View NCRB crime data, weather warnings, and local news for {activePlan.destination.name}.</p>
              </div>
              <button
                onClick={() => onSelectDestinationForSafety(activePlan.destination)}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shrink-0"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Check Safety Analysis &rarr;</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW: Multi-City Planner */}
      {activeTab === 'multicity' && (
        <MultiCityPlannerView
          onPlanGenerated={(mPlan) => {
            if (mPlan.plans.length > 0) {
              setActivePlan(mPlan.plans[0]);
              setActiveTab('itinerary');
            }
          }}
          onBackToSingle={() => setActiveTab('wizard')}
        />
      )}

      {/* VIEW: Places Near Me */}
      {activeTab === 'nearme' && (
        <PlacesNearMe
          userLocation={userLocation}
          onUseCurrentLocation={onUseCurrentLocation}
          isLoadingLocation={isLoadingLocation}
        />
      )}

      {/* Modal for Place Details */}
      <PlaceDetailModal
        place={selectedPlaceModal}
        onClose={() => setSelectedPlaceModal(null)}
        onAddToTrip={handleAddPlaceToItinerary}
        nearbyPlaces={availablePlaces.filter((p) => p.id !== selectedPlaceModal?.id)}
      />

      {/* Floating AI Travel Assistant Chat Drawer */}
      <AiTravelAssistantDrawer
        destination={currentDestination}
        activePlan={activePlan || undefined}
      />
    </div>
  );
};
