import { getCurrentUser } from './authService';
import { CompleteTripPlan } from '../types/planner';

export interface SavedTripRecord {
  id: string;
  userId: string;
  title: string;
  destinationName: string;
  destinationId: string;
  country?: string;
  coordinates?: { lat: number; lng: number };
  days: number;
  highlights: string[];
  plan: CompleteTripPlan;
  status: 'upcoming' | 'completed';
  createdAt: string;
  savedAt: string;
}

// Alias for cleaner external API
export type SavedItineraryRecord = SavedTripRecord;

const PLANS_STORAGE_KEY = 'tsis_saved_plans';

function getStoredPlans(): SavedTripRecord[] {
  try {
    const raw = localStorage.getItem(PLANS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePlans(plans: SavedTripRecord[]): void {
  localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
}

function enforceAuth(userId: string): void {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.id !== userId) {
    throw new Error('Unauthorized access. Access denied.');
  }
}

export function getSavedPlans(userId: string): SavedTripRecord[] {
  enforceAuth(userId);
  const allPlans = getStoredPlans();
  return allPlans.filter((item) => item.userId === userId);
}

export function savePlan(
  userId: string,
  plan: CompleteTripPlan,
  title: string
): SavedTripRecord {
  enforceAuth(userId);

  const allPlans = getStoredPlans();
  const existingIndex = allPlans.findIndex((p) => p.plan.id === plan.id && p.userId === userId);

  const destName = plan.destination?.name || title;
  const highlights = plan.days?.slice(0, 3).flatMap(d => d.items?.map(i => i.place?.name || '') || []).filter(Boolean).slice(0, 4) || [];

  if (existingIndex !== -1) {
    allPlans[existingIndex].plan = plan;
    allPlans[existingIndex].title = title;
    allPlans[existingIndex].highlights = highlights;
    savePlans(allPlans);
    return allPlans[existingIndex];
  }

  const now = new Date().toISOString();
  const newRecord: SavedTripRecord = {
    id: `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    title,
    destinationName: destName,
    destinationId: plan.destination?.id || `dest-${Date.now()}`,
    country: plan.destination?.country,
    coordinates: plan.destination?.coordinates,
    days: plan.days?.length || 0,
    highlights,
    plan,
    status: 'upcoming',
    createdAt: now,
    savedAt: now,
  };

  allPlans.push(newRecord);
  savePlans(allPlans);

  return newRecord;
}

// Aliases for cleaner external API
export const getSavedItineraries = getSavedPlans;
export const deleteSavedItinerary = deletePlan;

export function updatePlanStatus(
  userId: string,
  savedTripId: string,
  status: 'upcoming' | 'completed'
): SavedTripRecord {
  enforceAuth(userId);

  const allPlans = getStoredPlans();
  const index = allPlans.findIndex((p) => p.id === savedTripId);
  if (index === -1) throw new Error('Saved trip not found.');
  if (allPlans[index].userId !== userId) throw new Error('Unauthorized action.');

  allPlans[index].status = status;
  savePlans(allPlans);

  return allPlans[index];
}

export function deletePlan(userId: string, savedTripId: string): void {
  enforceAuth(userId);

  const allPlans = getStoredPlans();
  const record = allPlans.find((p) => p.id === savedTripId);
  if (!record) throw new Error('Saved trip not found.');
  if (record.userId !== userId) throw new Error('Unauthorized action.');

  const updatedPlans = allPlans.filter((p) => p.id !== savedTripId);
  savePlans(updatedPlans);
}
