import {
  TripPreferences,
  TouristPlace,
  CompleteTripPlan,
  DayItinerary,
  ItineraryItem,
  BudgetEstimate,
  MultiCityStop,
  MultiCityPlan,
} from '../types/planner';
import { WeatherData } from '../types/weather';
import { RiskAssessment } from '../types/risk';
import { getPlacesForDestination } from './tourismService';

// Calculate distance in KM using Haversine Formula to optimize geographic grouping
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Deterministically generates a day-wise itinerary optimized by:
 * - Geographic proximity (minimizes cross-city travel)
 * - User preferences & pace
 * - Weather conditions (rain/heat awareness)
 * - TSIS Safety advisories
 */
export async function generateItinerary(
  preferences: TripPreferences,
  weatherForecast?: WeatherData,
  safetyAssessment?: RiskAssessment
): Promise<CompleteTripPlan> {
  const destination = preferences.destination;
  const allPlaces = await getPlacesForDestination(destination.name, destination.coordinates);

  // Filter & score places by user category preferences
  const userCatSet = new Set(preferences.categories);
  const scoredPlaces = [...allPlaces].sort((a, b) => {
    const aMatch = userCatSet.has(a.category) ? 2 : 0;
    const bMatch = userCatSet.has(b.category) ? 2 : 0;
    return bMatch - aMatch;
  });

  // Determine items per day based on pace
  let itemsPerDay = 3;
  if (preferences.pace === 'relaxed') itemsPerDay = 2;
  if (preferences.pace === 'packed') itemsPerDay = 5;

  const totalDays = Math.min(Math.max(preferences.durationDays, 1), 7);
  const days: DayItinerary[] = [];

  let pool = [...scoredPlaces];
  if (pool.length === 0) pool = [...allPlaces];

  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    if (pool.length === 0) pool = [...allPlaces]; // reset pool if exhausted

    // Pick seed place for the day (highest preference remaining)
    const seedPlace = pool.shift() || allPlaces[0];

    // Find geographically closest places to the seed place to form a cluster
    const cluster = [seedPlace];
    const targetCount = itemsPerDay - 1;

    pool.sort((a, b) => {
      const distA = calculateHaversineDistance(
        seedPlace.coordinates.lat,
        seedPlace.coordinates.lng,
        a.coordinates.lat,
        a.coordinates.lng
      );
      const distB = calculateHaversineDistance(
        seedPlace.coordinates.lat,
        seedPlace.coordinates.lng,
        b.coordinates.lat,
        b.coordinates.lng
      );
      return distA - distB;
    });

    for (let k = 0; k < targetCount && pool.length > 0; k++) {
      cluster.push(pool.shift()!);
    }

    // Schedule items into time periods (Morning, Late Morning, Afternoon, Evening, Night)
    const timePeriods: ('morning' | 'late_morning' | 'afternoon' | 'evening' | 'night')[] = [
      'morning',
      'late_morning',
      'afternoon',
      'evening',
      'night',
    ];
    const defaultTimes = ['09:30 AM', '11:45 AM', '02:30 PM', '05:30 PM', '08:00 PM'];

    // Check weather forecast for rain or extreme heat on this day
    const dayWeather = weatherForecast?.daily[dayNum - 1] || weatherForecast?.daily[0];
    const isRainForecast =
      dayWeather &&
      (dayWeather.weatherCondition.toLowerCase().includes('rain') ||
        dayWeather.weatherCondition.toLowerCase().includes('shower') ||
        dayWeather.rainProbability > 40);

    const isExtremeHeat = dayWeather && dayWeather.maxTemp > 36;

    const dayItems: ItineraryItem[] = cluster.map((place, idx) => {
      const period = timePeriods[idx % timePeriods.length];
      const timeSlot = defaultTimes[idx % defaultTimes.length];

      let weatherAlert: string | undefined;
      let alternativeSuggested: TouristPlace | undefined;

      // Weather-aware adjustment
      if (isRainForecast && !place.isIndoor && (period === 'afternoon' || period === 'evening')) {
        weatherAlert = `🌧️ Rain expected (${dayWeather?.rainProbability || 50}% chance). Consider visiting this outdoor attraction in the morning or opting for an indoor museum.`;

        // Find indoor alternative from all places
        const indoorAlt = allPlaces.find((p) => p.isIndoor && p.id !== place.id);
        if (indoorAlt) alternativeSuggested = indoorAlt;
      } else if (isExtremeHeat && !place.isIndoor && period === 'afternoon') {
        weatherAlert = `☀️ Peak heat forecast (${dayWeather?.maxTemp}°C). Hydrate well or prefer shaded indoor venues during 12:00 PM – 4:00 PM.`;
      }

      return {
        id: `item-${dayNum}-${idx}-${place.id}`,
        place,
        suggestedTimeSlot: timeSlot,
        periodOfDay: period,
        durationMinutes: place.approxDurationMinutes,
        weatherAlert,
        alternativeSuggested,
        safetyAlert:
          safetyAssessment?.overallRisk === 'HIGH' || safetyAssessment?.overallRisk === 'SEVERE'
            ? `⚠️ Note: Destination has an elevated safety advisory (${safetyAssessment.numericalScore}/100). Check local news updates before travel.`
            : undefined,
      };
    });

    // Title generation based on cluster categories
    const primaryCat = cluster[0]?.category || 'Sightseeing';
    const dayTitle = `Day ${dayNum} — ${capitalize(primaryCat)} & Local Exploration`;

    days.push({
      dayNumber: dayNum,
      title: dayTitle,
      dateLabel: dayWeather ? `Day ${dayNum} (${dayWeather.weatherCondition}, ${dayWeather.maxTemp}°C)` : `Day ${dayNum}`,
      items: dayItems,
      dailyWeatherSummary: dayWeather
        ? `${dayWeather.weatherCondition} &bull; Max ${dayWeather.maxTemp}°C / Min ${dayWeather.minTemp}°C`
        : 'Pleasant travel weather expected.',
      dailySafetySummary: safetyAssessment
        ? `Safety Indicator: ${safetyAssessment.overallRisk} (${safetyAssessment.numericalScore}/100)`
        : 'No critical security advisories.',
    });
  }

  // Calculate budget estimate
  const budgetEstimate = calculateBudgetEstimate(preferences);

  return {
    id: `trip-plan-${Date.now()}`,
    destination,
    durationDays: totalDays,
    preferences,
    days,
    createdAt: new Date().toISOString(),
    budgetEstimate,
    safetyOverview: {
      weatherRisk: safetyAssessment?.factors?.weatherRisk === 'HIGH' || safetyAssessment?.factors?.weatherRisk === 'SEVERE' ? 'High' : 'Low',
      historicalRisk: safetyAssessment?.factors?.crimeRisk === 'HIGH' || safetyAssessment?.factors?.crimeRisk === 'SEVERE' ? 'High' : 'Low',
      recentAlertsCount: safetyAssessment?.officialWarning ? 1 : 0,
    },
  };
}

/**
 * Reorganizes a day's itinerary dynamically if weather or conditions change
 */
export function replanDay(
  day: DayItinerary,
  weatherForecast?: WeatherData,
  availablePlaces: TouristPlace[] = []
): DayItinerary {
  const updatedItems = day.items.map((item) => {
    if (item.weatherAlert || !item.place.isIndoor) {
      // Find an indoor place to suggest as alternative
      const indoorAlt = availablePlaces.find((p) => p.isIndoor && p.id !== item.place.id);
      return {
        ...item,
        weatherAlert: `🔄 Re-planned for weather: Rain forecast during outdoor window. Recommended indoor alternative attached below.`,
        alternativeSuggested: indoorAlt || item.alternativeSuggested,
      };
    }
    return item;
  });

  return {
    ...day,
    title: `${day.title} (Re-planned for Weather)`,
    items: updatedItems,
  };
}

/**
 * Calculates realistic budget estimates (clearly labeled as approximate estimates)
 */
export function calculateBudgetEstimate(preferences: TripPreferences): BudgetEstimate {
  const days = preferences.durationDays || 1;
  const travelers = preferences.numTravelers || 1;
  const style = preferences.travelStyle || 'standard';
  const accomm = preferences.accommodationType || 'standard_hotel';

  let perDayAccomm = 2000;
  if (accomm === 'hostel') perDayAccomm = 700;
  if (accomm === 'budget_hotel') perDayAccomm = 1400;
  if (accomm === 'standard_hotel') perDayAccomm = 3000;
  if (accomm === 'premium_hotel') perDayAccomm = 7500;

  let perDayTransport = 500;
  let perDayFood = 800;
  let perDayEntry = 300;

  if (style === 'budget') {
    perDayTransport = 300;
    perDayFood = 450;
    perDayEntry = 150;
  } else if (style === 'premium') {
    perDayTransport = 1500;
    perDayFood = 2500;
    perDayEntry = 800;
  }

  const totalAccomm = perDayAccomm * days;
  const totalTransport = perDayTransport * days * travelers;
  const totalFood = perDayFood * days * travelers;
  const totalEntry = perDayEntry * days * travelers;
  const misc = Math.round((totalAccomm + totalTransport + totalFood + totalEntry) * 0.1);

  return {
    accommodation: Math.round(totalAccomm),
    localTransport: Math.round(totalTransport),
    food: Math.round(totalFood),
    entryFees: Math.round(totalEntry),
    miscellaneous: misc,
    total: Math.round(totalAccomm + totalTransport + totalFood + totalEntry + misc),
    currency: 'INR (₹)',
  };
}

/**
 * Generates a Multi-City combined itinerary
 */
export async function generateMultiCityPlan(stops: MultiCityStop[]): Promise<MultiCityPlan> {
  const plans: CompleteTripPlan[] = [];

  for (const stop of stops) {
    const singlePrefs: TripPreferences = {
      destination: stop.destination,
      durationDays: stop.days,
      categories: ['history', 'culture', 'food'],
      pace: 'balanced',
    };
    const plan = await generateItinerary(singlePrefs);
    plans.push(plan);
  }

  const totalDays = stops.reduce((acc, s) => acc + s.days, 0);

  return {
    id: `multicity-${Date.now()}`,
    stops,
    totalDays,
    plans,
    createdAt: new Date().toISOString(),
  };
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
