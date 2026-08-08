import { EmergencyContact, SosPayload } from '../types/sos';

const CONTACTS_STORAGE_KEY = 'tsis_emergency_contacts_v1';

export const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: 'contact-default-1',
    name: 'Primary Emergency Contact',
    relationship: 'Father',
    phone: '+919876543210',
    isPrimary: true,
  },
  {
    id: 'contact-default-2',
    name: 'Secondary Emergency Contact',
    relationship: 'Mother',
    phone: '+919876543211',
    isPrimary: false,
  },
];

export function getStoredEmergencyContacts(): EmergencyContact[] {
  try {
    const raw = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (!raw) return DEFAULT_CONTACTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CONTACTS;
  } catch (error) {
    console.warn('Failed to parse emergency contacts from localStorage:', error);
    return DEFAULT_CONTACTS;
  }
}

export function saveEmergencyContacts(contacts: EmergencyContact[]): void {
  try {
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  } catch (error) {
    console.error('Failed to save emergency contacts to localStorage:', error);
  }
}

export function createGoogleMapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function formatSosEmergencyMessage(
  contacts: EmergencyContact[],
  lat?: number,
  lng?: number,
  locationName?: string
): { messageText: string; mapsUrl?: string } {
  let locationPart = 'Unknown location (Permission pending)';
  let mapsUrl = undefined;

  if (lat !== undefined && lng !== undefined) {
    mapsUrl = createGoogleMapsLink(lat, lng);
    locationPart = `${locationName ? locationName + ' (' : ''}Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}${locationName ? ')' : ''}\nMap Link: ${mapsUrl}`;
  }

  const messageText = `🚨 EMERGENCY SOS ALERT! 🚨\nI am using the Tourist Safety Intelligence System (TSIS) and may need urgent assistance.\n\nMy Current Location:\n${locationPart}\n\nTime: ${new Date().toLocaleString()}\nPlease contact me or local authorities immediately!`;

  return { messageText, mapsUrl };
}

export function generateSmsDeepLink(phoneNumber: string, bodyText: string): string {
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
  const encodedBody = encodeURIComponent(bodyText);
  // Works on mobile iOS and Android web browsers
  return `sms:${cleanPhone}?body=${encodedBody}`;
}

export function generateTelDeepLink(phoneNumber: string): string {
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
  return `tel:${cleanPhone}`;
}
