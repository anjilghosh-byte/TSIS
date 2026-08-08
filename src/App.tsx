import React, { useState, useEffect } from 'react';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { HomePage } from './pages/HomePage';
import { DestinationAnalysisPage } from './pages/DestinationAnalysisPage';
import { TravelPlannerPage } from './pages/TravelPlannerPage';
import { SosPage } from './pages/SosPage';
import { ContactsPage } from './pages/ContactsPage';
import { AboutPage } from './pages/AboutPage';
import { AuthPages } from './components/auth/AuthPages';
import { UserProfilePage } from './pages/UserProfilePage';

import { DestinationInfo, LocationCoordinates } from './types/location';
import { EmergencyContact } from './types/sos';

import { POPULAR_DESTINATIONS, getCurrentUserLocation } from './services/locationService';
import { getStoredEmergencyContacts, saveEmergencyContacts } from './services/emergencyService';
import { isDemoModeEnabled, setDemoModeEnabled } from './utils/storage';
import { getCurrentUser, logout, UserProfile } from './services/authService';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedDestination, setSelectedDestination] = useState<DestinationInfo>(
    POPULAR_DESTINATIONS[0]
  );
  const [userLocation, setUserLocation] = useState<LocationCoordinates | undefined>(undefined);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(isDemoModeEnabled());
  const [contacts, setContacts] = useState<EmergencyContact[]>(getStoredEmergencyContacts());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getCurrentUser());
  const [showAuth, setShowAuth] = useState<boolean>(false);

  useEffect(() => {
    getCurrentUserLocation()
      .then((coords) => setUserLocation(coords))
      .catch((err) => console.log('Geolocation initially passive:', err.message));
  }, []);

  const handleToggleDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    setDemoModeEnabled(enabled);
  };

  const handleSaveContacts = (newContacts: EmergencyContact[]) => {
    setContacts(newContacts);
    saveEmergencyContacts(newContacts);
  };

  const handleSelectDestination = (dest: DestinationInfo) => {
    setSelectedDestination(dest);
    setCurrentTab('analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanTripForDestination = (dest: DestinationInfo) => {
    setSelectedDestination(dest);
    setCurrentTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUseCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const coords = await getCurrentUserLocation();
      setUserLocation(coords);

      const userDest: DestinationInfo = {
        id: `user-loc-${Date.now()}`,
        name: 'Your Current Location',
        country: 'Current Position',
        coordinates: coords,
        popularActivities: ['general_tourism', 'sightseeing'],
        description: `Coordinates: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
      };

      setSelectedDestination(userDest);
      setCurrentTab('analysis');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      alert(`Location access notice: ${error.message || 'Unable to retrieve location'}. You can still search destinations manually.`);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavTab = (tab: string) => {
    if (tab === 'login') {
      setShowAuth(true);
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showAuth) {
    return (
      <AuthPages
        onAuthSuccess={handleAuthSuccess}
        onBackToApp={() => setShowAuth(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      <DisclaimerBanner />

      <Navbar
        currentTab={currentTab}
        onSelectTab={handleNavTab}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        currentUser={currentUser}
        onLoginClick={() => setShowAuth(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onSelectDestination={handleSelectDestination}
            onPlanTripForDestination={handlePlanTripForDestination}
            onOpenTripPlanner={() => {
              setCurrentTab('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLoadingLocation={isLoadingLocation}
            currentUser={currentUser}
            onLoginClick={() => setShowAuth(true)}
          />
        )}

        {currentTab === 'planner' && (
          <TravelPlannerPage
            initialDestination={selectedDestination}
            userLocation={userLocation}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLoadingLocation={isLoadingLocation}
            isDemoMode={isDemoMode}
            onSelectDestinationForSafety={handleSelectDestination}
            currentUser={currentUser}
          />
        )}

        {currentTab === 'analysis' && (
          <DestinationAnalysisPage
            destination={selectedDestination}
            onSelectDestination={handleSelectDestination}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLoadingLocation={isLoadingLocation}
            userLocation={userLocation}
            isDemoMode={isDemoMode}
          />
        )}

        {currentTab === 'sos' && (
          <SosPage
            contacts={contacts}
            onSaveContacts={handleSaveContacts}
            userLocation={userLocation}
            destinationName={selectedDestination.name}
          />
        )}

        {currentTab === 'contacts' && (
          <ContactsPage contacts={contacts} onSaveContacts={handleSaveContacts} />
        )}

        {currentTab === 'profile' && currentUser && (
          <UserProfilePage
            user={currentUser}
            onLogout={handleLogout}
            onSelectDestination={handleSelectDestination}
            onPlanTrip={handlePlanTripForDestination}
          />
        )}

        {currentTab === 'about' && <AboutPage />}
      </main>

      <Footer
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default App;
