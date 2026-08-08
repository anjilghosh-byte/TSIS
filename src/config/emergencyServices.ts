import { EmergencyServiceInfo } from '../types/sos';

export const OFFICIAL_EMERGENCY_SERVICES: EmergencyServiceInfo[] = [
  {
    name: 'National Emergency Response (ERSS)',
    number: '112',
    category: 'police',
    description: 'Single emergency number for Police, Fire, and Ambulance services across India.',
  },
  {
    name: 'Police Control Room',
    number: '100',
    category: 'police',
    description: 'Direct hotline for immediate police intervention and law enforcement response.',
  },
  {
    name: 'Ambulance & Medical Emergency',
    number: '102',
    category: 'medical',
    description: 'Government emergency ambulance service for medical assistance and transport.',
  },
  {
    name: 'Fire & Rescue Services',
    number: '101',
    category: 'fire',
    description: 'Emergency fire response, rescue operations, and hazardous material management.',
  },
  {
    name: 'Disaster Management Helpline',
    number: '108',
    category: 'disaster',
    description: 'Emergency medical and disaster response operations during floods, storms, and landslides.',
  },
  {
    name: 'Women Helpline',
    number: '1091',
    category: 'women',
    description: '24/7 dedicated helpline for women safety, emergency rescue, and assistance.',
  },
  {
    name: 'Tourist Helpline & Assistance',
    number: '1363',
    category: 'tourist',
    description: 'Official Ministry of Tourism toll-free multi-lingual tourist assistance line.',
  },
];
