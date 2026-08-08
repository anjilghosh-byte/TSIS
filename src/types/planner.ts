import { DestinationInfo, LocationCoordinates } from './location';

export type PlaceCategory =
  | 'history'
  | 'nature'
  | 'beach'
  | 'religious'
  | 'food'
  | 'shopping'
  | 'culture'
  | 'photography'
  | 'adventure'
  | 'family'
  | 'relaxed'
  | 'budget';

export type TripPace = 'relaxed' | 'balanced' | 'packed';
export type TravelStyle = 'budget' | 'standard' | 'premium';
export type AccommodationType = 'hostel' | 'budget_hotel' | 'standard_hotel' | 'premium_hotel';

export interface TouristPlace {
  id: string;
  destinationId?: string;
  cityName: string;
  name: string;
  category: PlaceCategory;
  description: string;
  whyVisit: string;
  image: string;
  coordinates: LocationCoordinates;
  approxDurationMinutes: number;
  bestTimeToVisit: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
  openingHours?: string;
  closingHours?: string;
  estimatedTicketPrice?: string;
  isIndoor: boolean;
  distanceFromBaseKm?: number;
  isDayTrip?: boolean;
  safetyAlert?: string;
  nearbyPlaceIds?: string[];
}

export interface TripPreferences {
  destination: DestinationInfo;
  durationDays: number;
  categories: PlaceCategory[];
  pace: TripPace;
  travelStyle?: TravelStyle;
  accommodationType?: AccommodationType;
  numTravelers?: number;
}

export interface ItineraryItem {
  id: string;
  place: TouristPlace;
  suggestedTimeSlot: string;
  periodOfDay: 'morning' | 'late_morning' | 'lunch' | 'afternoon' | 'evening' | 'night';
  durationMinutes: number;
  notes?: string;
  weatherAlert?: string;
  safetyAlert?: string;
  alternativeSuggested?: TouristPlace;
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  dateLabel?: string;
  items: ItineraryItem[];
  dailyWeatherSummary?: string;
  dailySafetySummary?: string;
}

export interface BudgetEstimate {
  accommodation: number;
  localTransport: number;
  food: number;
  entryFees: number;
  miscellaneous: number;
  total: number;
  currency: string;
}

export interface CompleteTripPlan {
  id: string;
  destination: DestinationInfo;
  durationDays: number;
  preferences: TripPreferences;
  days: DayItinerary[];
  createdAt: string;
  budgetEstimate?: BudgetEstimate;
  safetyOverview: {
    weatherRisk: 'Low' | 'Moderate' | 'High';
    historicalRisk: 'Low' | 'Moderate' | 'High';
    recentAlertsCount: number;
  };
}

export interface MultiCityStop {
  id: string;
  destination: DestinationInfo;
  days: number;
}

export interface MultiCityPlan {
  id: string;
  stops: MultiCityStop[];
  totalDays: number;
  plans: CompleteTripPlan[];
  createdAt: string;
}
