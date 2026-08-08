import React, { useState, useEffect } from 'react';
import { DestinationInfo, ActivityType, LocationCoordinates } from '../types/location';
import { WeatherData } from '../types/weather';
import { NewsData } from '../types/news';
import { CrimeData } from '../types/crime';
import { RiskAssessment } from '../types/risk';

import { fetchWeatherData } from '../services/weatherService';
import { fetchDestinationNews } from '../services/newsService';
import { fetchHistoricalCrimeData } from '../services/crimeDataService';
import { calculateRiskAssessment } from '../services/riskAssessmentService';

import { RiskOverviewCard } from '../components/analysis/RiskOverviewCard';
import { RiskBreakdown } from '../components/analysis/RiskBreakdown';
import { WeatherCard } from '../components/analysis/WeatherCard';
import { WeatherForecast } from '../components/analysis/WeatherForecast';
import { ActivitySelector } from '../components/analysis/ActivitySelector';
import { NewsSection } from '../components/analysis/NewsSection';
import { CrimeDataSection } from '../components/analysis/CrimeDataSection';
import { RecommendationsList } from '../components/analysis/RecommendationsList';
import { InteractiveMap } from '../components/analysis/InteractiveMap';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { SearchBar } from '../components/dashboard/SearchBar';

interface DestinationAnalysisPageProps {
  destination: DestinationInfo;
  onSelectDestination: (dest: DestinationInfo) => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation: boolean;
  userLocation?: LocationCoordinates;
  isDemoMode: boolean;
}

export const DestinationAnalysisPage: React.FC<DestinationAnalysisPageProps> = ({
  destination,
  onSelectDestination,
  onUseCurrentLocation,
  isLoadingLocation,
  userLocation,
  isDemoMode,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('general_tourism');
  const [loading, setLoading] = useState(true);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [news, setNews] = useState<NewsData | null>(null);
  const [crime, setCrime] = useState<CrimeData | null>(null);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const weatherRes = await fetchWeatherData(destination.coordinates, isDemoMode);
        const newsRes = await fetchDestinationNews(destination.name, isDemoMode);
        const crimeRes = fetchHistoricalCrimeData(destination.name, destination.state);

        if (isMounted) {
          setWeather(weatherRes);
          setNews(newsRes);
          setCrime(crimeRes);

          const riskRes = calculateRiskAssessment(
            weatherRes,
            crimeRes,
            newsRes,
            selectedActivity
          );
          setAssessment(riskRes);
        }
      } catch (err) {
        console.error('Failed loading destination intelligence:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [destination, isDemoMode, selectedActivity]);

  const handleActivityChange = (newAct: ActivityType) => {
    setSelectedActivity(newAct);
    if (weather && crime && news) {
      const updatedAssessment = calculateRiskAssessment(weather, crime, news, newAct);
      setAssessment(updatedAssessment);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Search Bar */}
      <div className="bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
        <SearchBar
          onSelectDestination={onSelectDestination}
          onUseCurrentLocation={onUseCurrentLocation}
          isLoadingLocation={isLoadingLocation}
        />
      </div>

      {loading ? (
        <div className="space-y-6">
          <SkeletonCard height="h-64" count={1} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonCard height="h-72" count={1} />
            <SkeletonCard height="h-72" count={1} />
          </div>
        </div>
      ) : (
        <>
          {/* Main Risk Overview */}
          {assessment && (
            <RiskOverviewCard assessment={assessment} destinationName={destination.name} />
          )}

          {/* Activity Selector & Factor Breakdown */}
          <ActivitySelector
            selectedActivity={selectedActivity}
            onSelectActivity={handleActivityChange}
          />

          {assessment && <RiskBreakdown assessment={assessment} />}

          {/* Weather & Forecast */}
          {weather && (
            <>
              <WeatherCard weather={weather} destinationName={destination.name} />
              <WeatherForecast weather={weather} />
            </>
          )}

          {/* Recommendations List */}
          {assessment && (
            <RecommendationsList recommendations={assessment.recommendations} />
          )}

          {/* Verified News & Incidents */}
          {news && <NewsSection newsData={news} destinationName={destination.name} />}

          {/* Crime Statistics Section */}
          {crime && <CrimeDataSection crimeData={crime} />}

          {/* Interactive Geographic Map */}
          <InteractiveMap
            destinationCoords={destination.coordinates}
            destinationName={destination.name}
            userCoords={userLocation}
          />
        </>
      )}
    </div>
  );
};
