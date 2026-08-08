export interface EmergencyContact {
  id: string;
  name: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Spouse' | 'Sibling' | 'Friend' | 'Other';
  phone: string;
  email?: string;
  isPrimary?: boolean;
}

export interface EmergencyServiceInfo {
  name: string;
  number: string;
  category: 'police' | 'fire' | 'medical' | 'disaster' | 'tourist' | 'women';
  description: string;
}

export interface SosPayload {
  userLocation?: {
    lat: number;
    lng: number;
    address?: string;
  };
  mapsUrl?: string;
  timestamp: string;
  contactsToNotify: EmergencyContact[];
  customNote?: string;
}
