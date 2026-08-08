export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface DestinationInfo {
  id: string;
  name: string;
  state?: string;
  country: string;
  coordinates: LocationCoordinates;
  popularActivities?: ActivityType[];
  description?: string;
  bannerImage?: string;
}

export type ActivityType =
  | 'beach'
  | 'trekking'
  | 'hiking'
  | 'camping'
  | 'sightseeing'
  | 'water_sports'
  | 'mountain_travel'
  | 'general_tourism';
