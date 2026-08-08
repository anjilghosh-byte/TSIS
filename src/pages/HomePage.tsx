import React from 'react';
import { HeroSection } from '../components/dashboard/HeroSection';
import { FeaturedDestinations } from '../components/dashboard/FeaturedDestinations';
import { SafetyPhilosophy } from '../components/dashboard/SafetyPhilosophy';
import { HowItWorks } from '../components/dashboard/HowItWorks';
import { DestinationInfo } from '../types/location';
import { UserProfile } from '../services/authService';

interface HomePageProps {
  onSelectDestination: (dest: DestinationInfo) => void;
  onPlanTripForDestination?: (dest: DestinationInfo) => void;
  onOpenTripPlanner?: () => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation: boolean;
  currentUser?: UserProfile | null;
  onLoginClick?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectDestination,
  onPlanTripForDestination,
  onOpenTripPlanner,
  onUseCurrentLocation,
  isLoadingLocation,
  currentUser,
  onLoginClick,
}) => {
  return (
    <div className="space-y-6">
      <HeroSection
        onSelectDestination={onSelectDestination}
        onPlanTripForDestination={onPlanTripForDestination}
        onOpenTripPlanner={onOpenTripPlanner}
        onUseCurrentLocation={onUseCurrentLocation}
        isLoadingLocation={isLoadingLocation}
      />

      {/* Auth prompt for unauthenticated users */}
      {!currentUser && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-sky-900/40 via-indigo-900/40 to-slate-900/40 border border-sky-800/40 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="text-3xl shrink-0">🔐</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-lg">Save your itineraries & track travel history</p>
              <p className="text-slate-400 text-sm mt-0.5">Create a free TSIS account to save trip plans, mark visited places, and access your profile.</p>
            </div>
            <button
              onClick={onLoginClick}
              className="shrink-0 px-5 py-2 bg-sky-600 hover:bg-sky-500 rounded-xl text-white font-semibold text-sm transition"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      )}

      <FeaturedDestinations onSelectDestination={onSelectDestination} />
      <HowItWorks />
      <SafetyPhilosophy />
    </div>
  );
};
