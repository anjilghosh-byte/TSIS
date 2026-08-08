import React from 'react';
import { HeroSection } from '../components/dashboard/HeroSection';
import { FeaturedDestinations } from '../components/dashboard/FeaturedDestinations';
import { SafetyPhilosophy } from '../components/dashboard/SafetyPhilosophy';
import { HowItWorks } from '../components/dashboard/HowItWorks';
import { DestinationInfo } from '../types/location';

interface HomePageProps {
  onSelectDestination: (dest: DestinationInfo) => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectDestination,
  onUseCurrentLocation,
  isLoadingLocation,
}) => {
  return (
    <div className="space-y-6">
      <HeroSection
        onSelectDestination={onSelectDestination}
        onUseCurrentLocation={onUseCurrentLocation}
        isLoadingLocation={isLoadingLocation}
      />
      <FeaturedDestinations onSelectDestination={onSelectDestination} />
      <HowItWorks />
      <SafetyPhilosophy />
    </div>
  );
};
