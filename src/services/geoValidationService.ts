import { TouristPlace } from '../types/planner';
import { LocationCoordinates } from '../types/location';

// Haversine distance formula (returns km)
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export type DestinationType = 'metro' | 'city' | 'hill_station' | 'beach' | 'coastal' | 'regional' | 'default';

// Configure allowed radii by destination type
export const DESTINATION_RADIUS_CONFIG: Record<DestinationType, { primary: number; dayTrip: number }> = {
  metro:        { primary: 30, dayTrip: 70 },
  city:         { primary: 25, dayTrip: 60 },
  hill_station: { primary: 20, dayTrip: 50 },
  beach:        { primary: 15, dayTrip: 45 },
  coastal:      { primary: 15, dayTrip: 45 },
  regional:     { primary: 40, dayTrip: 80 },
  default:      { primary: 20, dayTrip: 50 },
};

// Resolve destination type from keywords
export function resolveDestinationType(name: string): DestinationType {
  const lower = name.toLowerCase();
  if (['kolkata', 'mumbai', 'delhi', 'chennai', 'bangalore', 'hyderabad'].some(c => lower.includes(c))) return 'metro';
  if (['darjeeling', 'manali', 'shimla', 'ooty', 'mussoorie', 'munnar', 'kodaikanal'].some(c => lower.includes(c))) return 'hill_station';
  if (['digha', 'puri', 'goa', 'calangute', 'varkala', 'kovalam', 'mandarmani'].some(c => lower.includes(c))) return 'beach';
  if (['jaipur', 'udaipur', 'jodhpur', 'varanasi', 'agra', 'rishikesh', 'haridwar'].some(c => lower.includes(c))) return 'city';
  return 'default';
}

export interface ValidationResult {
  isValid: boolean;
  distance: number;
  isDayTrip: boolean;
  reason?: string;
}

export function validateAttractionForDestination(
  destination: { lat: number; lng: number; name: string; country?: string; state?: string },
  attraction: TouristPlace,
  destinationType: DestinationType = 'default'
): ValidationResult {
  const { primary: primaryRadius, dayTrip: dayTripRadius } = DESTINATION_RADIUS_CONFIG[destinationType];

  // 1. Valid coordinates check
  if (
    typeof attraction.coordinates?.lat !== 'number' ||
    typeof attraction.coordinates?.lng !== 'number' ||
    isNaN(attraction.coordinates.lat) ||
    isNaN(attraction.coordinates.lng)
  ) {
    return { isValid: false, distance: -1, isDayTrip: false, reason: 'Invalid or missing coordinates' };
  }

  // 2. Calculate haversine distance
  const distance = haversineDistance(
    destination.lat, destination.lng,
    attraction.coordinates.lat, attraction.coordinates.lng
  );

  // 3. Primary radius — fully valid
  if (distance <= primaryRadius) {
    return { isValid: true, distance, isDayTrip: false };
  }

  // 4. Day-trip zone
  if (distance <= dayTripRadius) {
    return { isValid: true, distance, isDayTrip: true };
  }

  // 5. Too far — reject
  return {
    isValid: false,
    distance,
    isDayTrip: false,
    reason: `Distance ${distance.toFixed(1)} km exceeds allowed radius of ${dayTripRadius} km for destination type "${destinationType}"`,
  };
}

// Filter and tag attractions against a resolved destination
export function filterAttractionsForDestination(
  destination: { lat: number; lng: number; name: string; country?: string; state?: string },
  attractions: TouristPlace[],
  destinationType?: DestinationType
): TouristPlace[] {
  const type = destinationType || resolveDestinationType(destination.name);
  const seen = new Set<string>();
  const result: TouristPlace[] = [];

  for (const attraction of attractions) {
    // Dedup check
    const key = `${attraction.name.toLowerCase().trim()}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const validation = validateAttractionForDestination(destination, attraction, type);
    if (!validation.isValid) {
      console.debug(`[GeoFilter] REJECTED "${attraction.name}" for "${destination.name}": ${validation.reason}`);
      continue;
    }

    result.push({
      ...attraction,
      isDayTrip: validation.isDayTrip,
      distanceFromBaseKm: parseFloat(validation.distance.toFixed(1)),
    } as TouristPlace & { isDayTrip?: boolean });
  }

  return result;
}
