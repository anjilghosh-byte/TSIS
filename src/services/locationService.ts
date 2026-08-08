import { DestinationInfo, LocationCoordinates } from '../types/location';

export const POPULAR_DESTINATIONS: DestinationInfo[] = [
  {
    id: 'digha-beach',
    name: 'Digha Beach',
    state: 'West Bengal',
    country: 'India',
    coordinates: { lat: 21.6266, lng: 87.5074 },
    popularActivities: ['beach', 'water_sports', 'sightseeing'],
    description: 'Popular coastal resort town on the Bay of Bengal known for shallow sea beaches and scenic views.',
  },
  {
    id: 'darjeeling',
    name: 'Darjeeling',
    state: 'West Bengal',
    country: 'India',
    coordinates: { lat: 27.041, lng: 88.2663 },
    popularActivities: ['trekking', 'mountain_travel', 'sightseeing'],
    description: 'Famous Himalayan hill station surrounded by tea gardens, views of Kanchenjunga, and crisp mountain climate.',
  },
  {
    id: 'goa-calangute',
    name: 'Goa (Calangute)',
    state: 'Goa',
    country: 'India',
    coordinates: { lat: 15.5438, lng: 73.7554 },
    popularActivities: ['beach', 'water_sports', 'camping', 'general_tourism'],
    description: 'Vibrant beach location with famous shorelines, water sports, and historical architecture.',
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans National Park',
    state: 'West Bengal',
    country: 'India',
    coordinates: { lat: 21.9497, lng: 88.9007 },
    popularActivities: ['sightseeing', 'camping', 'general_tourism'],
    description: 'UNESCO World Heritage site featuring mangrove forests, river estuaries, and wildlife reserves.',
  },
  {
    id: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    coordinates: { lat: 32.2432, lng: 77.1892 },
    popularActivities: ['trekking', 'hiking', 'mountain_travel', 'camping'],
    description: 'High-altitude Himalayan resort town popular for adventure sports, trekking routes, and river valleys.',
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    coordinates: { lat: 30.0869, lng: 78.2676 },
    popularActivities: ['water_sports', 'hiking', 'camping', 'general_tourism'],
    description: 'Gateway to the Garhwal Himalayas on the banks of the Ganges, famous for white-water rafting and yoga.',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    popularActivities: ['sightseeing', 'general_tourism'],
    description: 'The Pink City of India known for historic palaces, forts, vibrant bazaars, and cultural heritage.',
  },
  {
    id: 'munnar',
    name: 'Munnar',
    state: 'Kerala',
    country: 'India',
    coordinates: { lat: 10.0889, lng: 77.0595 },
    popularActivities: ['hiking', 'trekking', 'sightseeing'],
    description: 'Picturesque hill station in the Western Ghats famous for rolling tea plantations and mist-covered peaks.',
  }
];

export async function searchLocations(query: string): Promise<DestinationInfo[]> {
  if (!query || query.trim().length < 2) {
    return POPULAR_DESTINATIONS;
  }

  const normalizedQuery = query.trim().toLowerCase();

  // First check matching popular local list
  const localMatches = POPULAR_DESTINATIONS.filter(
    (dest) =>
      dest.name.toLowerCase().includes(normalizedQuery) ||
      (dest.state && dest.state.toLowerCase().includes(normalizedQuery)) ||
      dest.country.toLowerCase().includes(normalizedQuery)
  );

  try {
    // Open-Meteo Geocoding API (free, reliable, no API key needed)
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}&count=5&language=en&format=json`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Geocoding search failed');

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return localMatches;
    }

    const apiResults: DestinationInfo[] = data.results.map((item: any, idx: number) => ({
      id: `geo-${item.id || idx}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: item.name,
      state: item.admin1 || item.country,
      country: item.country || 'International',
      coordinates: {
        lat: item.latitude,
        lng: item.longitude,
      },
      popularActivities: ['general_tourism', 'sightseeing'],
      description: `Destination in ${item.admin1 ? item.admin1 + ', ' : ''}${item.country || ''}`,
    }));

    // Merge and deduplicate by coordinates/name
    const merged = [...localMatches];
    apiResults.forEach((apiItem) => {
      if (!merged.some((m) => m.name.toLowerCase() === apiItem.name.toLowerCase())) {
        merged.push(apiItem);
      }
    });

    return merged;
  } catch (error) {
    console.warn('Live geocoding failed, falling back to local dataset:', error);
    return localMatches.length > 0 ? localMatches : POPULAR_DESTINATIONS;
  }
}

export function getCurrentUserLocation(): Promise<LocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}
